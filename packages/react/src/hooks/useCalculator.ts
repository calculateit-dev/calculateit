import { useState, useEffect, useCallback } from 'react';
import { ParsedDocument, ExpressionEvaluator } from '@calculateit/parser-js';
import type { CalculatorState } from '../types.js';

/**
 * Calculator state management hook
 * Implements reactive calculation engine with dependency resolution
 */
export function useCalculator(
  document: ParsedDocument,
  initialValues?: Record<string, number>,
  onValuesChange?: (values: Record<string, number>) => void,
  onCalculationsChange?: (calculations: Record<string, number>) => void
) {
  // Initialize input values
  const [inputValues, setInputValues] = useState<Record<string, number>>(() => {
    const values: Record<string, number> = {};

    // Set from initialValues or parse from expressions
    document.inputVariables.forEach((varName) => {
      const variable = document.variables.find((v) => v.name === varName);
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
  });

  // Calculated values and errors
  const [calculatedValues, setCalculatedValues] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Recalculate all expressions
   * Extracted from HTML lines 941-993
   */
  const recalculate = useCallback(() => {
    const newCalculated: Record<string, number> = {};
    const newErrors: Record<string, string> = {};

    // Build evaluator context with input values
    const context = { ...inputValues };
    const evaluator = new ExpressionEvaluator(context);

    // Calculate all non-input variables in order
    document.variables.forEach((variable) => {
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

    setCalculatedValues(newCalculated);
    setErrors(newErrors);

    // Notify listeners
    if (onCalculationsChange) {
      onCalculationsChange(newCalculated);
    }
  }, [document, inputValues, onCalculationsChange]);

  /**
   * Handle input value change
   */
  const handleInputChange = useCallback(
    (name: string, value: number) => {
      setInputValues((prev) => {
        const newValues = { ...prev, [name]: value };

        // Notify listeners
        if (onValuesChange) {
          onValuesChange(newValues);
        }

        return newValues;
      });
    },
    [onValuesChange]
  );

  /**
   * Recalculate when input values change
   */
  useEffect(() => {
    recalculate();
  }, [recalculate]);

  const state: CalculatorState = {
    inputValues,
    calculatedValues,
    errors,
  };

  return {
    state,
    handleInputChange,
    recalculate,
  };
}
