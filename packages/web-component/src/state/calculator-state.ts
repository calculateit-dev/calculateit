import { ParsedDocument, ExpressionEvaluator } from '@calculateit/parser-js';

/**
 * Calculator state structure
 */
export interface CalculatorStateData {
  inputValues: Record<string, number>;
  calculatedValues: Record<string, number>;
  errors: Record<string, string>;
}

/**
 * Calculator state management class
 * Port of React useCalculator hook for standalone usage
 * Implements reactive calculation engine with dependency resolution
 */
export class CalculatorState {
  public state: CalculatorStateData;

  constructor(
    private document: ParsedDocument,
    initialValues?: Record<string, number>,
    private onValuesChange?: (values: Record<string, number>) => void,
    private onCalculationsChange?: (calculations: Record<string, number>) => void
  ) {
    // Initialize state
    this.state = {
      inputValues: this.initializeInputValues(initialValues),
      calculatedValues: {},
      errors: {},
    };

    // Perform initial calculation
    this.recalculate();
  }

  /**
   * Initialize input values from document
   * Ported from useCalculator.ts:16-34
   */
  private initializeInputValues(initialValues?: Record<string, number>): Record<string, number> {
    const values: Record<string, number> = {};

    // Set from initialValues or parse from expressions
    this.document.inputVariables.forEach((varName) => {
      const variable = this.document.variables.find((v) => v.name === varName);
      if (variable) {
        if (initialValues && varName in initialValues) {
          values[varName] = initialValues[varName];
        } else {
          // Parse initial value from expression
          const parsed = parseFloat(variable.expression);
          values[varName] = isNaN(parsed) ? 0 : parsed;
        }
      }
    });

    return values;
  }

  /**
   * Recalculate all expressions
   * Ported from useCalculator.ts:44-77
   */
  public recalculate(): void {
    const newCalculated: Record<string, number> = {};
    const newErrors: Record<string, string> = {};

    // Build evaluator context with input values
    const context = { ...this.state.inputValues };
    const evaluator = new ExpressionEvaluator(context);

    // Calculate all non-input variables in order
    this.document.variables.forEach((variable) => {
      if (!variable.isInput) {
        // Update context with previously calculated values
        evaluator.setVariables({ ...context, ...newCalculated });

        // Evaluate expression
        const result = evaluator.evaluate(variable.expression);

        if (result.success && result.value !== undefined) {
          newCalculated[variable.name] = result.value;
        } else {
          newErrors[variable.name] = result.error || 'Calculation error';
          newCalculated[variable.name] = 0; // Fallback value
        }
      }
    });

    // Update state
    this.state.calculatedValues = newCalculated;
    this.state.errors = newErrors;

    // Notify listeners
    if (this.onCalculationsChange) {
      this.onCalculationsChange(newCalculated);
    }
  }

  /**
   * Handle input value change
   * Ported from useCalculator.ts:82-96
   */
  public handleInputChange(name: string, value: number): void {
    // Update input values
    this.state.inputValues = {
      ...this.state.inputValues,
      [name]: value,
    };

    // Notify listeners
    if (this.onValuesChange) {
      this.onValuesChange(this.state.inputValues);
    }

    // Recalculate dependent values
    this.recalculate();
  }

  /**
   * Get current input values
   */
  public getInputValues(): Record<string, number> {
    return { ...this.state.inputValues };
  }

  /**
   * Get current calculated values
   */
  public getCalculatedValues(): Record<string, number> {
    return { ...this.state.calculatedValues };
  }

  /**
   * Get current errors
   */
  public getErrors(): Record<string, string> {
    return { ...this.state.errors };
  }
}
