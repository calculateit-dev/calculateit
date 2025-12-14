import { useCallback } from 'react';
import { Section } from './Section.js';
import { useCalculator } from './hooks/useCalculator.js';
import type { CalculatorProps } from './types.js';

/**
 * Main Calculator component
 * Orchestrates sections and manages calculator state
 */
export function Calculator({
  document,
  initialValues,
  onValuesChange,
  onCalculationsChange,
  formatResult,
  decimalPlaces = 6,
  className,
  showFormula = false,
  direction = 'vertical',
}: CalculatorProps) {
  const { state, handleInputChange } = useCalculator(
    document,
    initialValues,
    onValuesChange,
    onCalculationsChange
  );

  /**
   * Default result formatter
   */
  const defaultFormatResult = useCallback(
    (value: number, _variableName: string) => {
      return value.toFixed(decimalPlaces);
    },
    [decimalPlaces]
  );

  const resultFormatter = formatResult || defaultFormatResult;
  const calculatorClass = `calculator calculator--${direction}`;

  return (
    <div className={className || calculatorClass}>
      {document.sections
        .filter((section) => !section.hidden)
        .map((section) => (
          <Section
            key={section.name}
            name={section.name}
            variables={section.variables}
            inputValues={state.inputValues}
            calculatedValues={state.calculatedValues}
            onInputChange={handleInputChange}
            formatResult={resultFormatter}
            decimalPlaces={decimalPlaces}
            showFormula={showFormula}
            level={section.level}
          />
        ))}
    </div>
  );
}
