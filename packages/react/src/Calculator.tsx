import { useCallback, useMemo } from 'react';
import { Section } from './Section.js';
import { useCalculator } from './hooks/useCalculator.js';
import { parseFile } from '@calculateit/parser-js';
import type { CalculatorProps } from './types.js';

/**
 * Main Calculator component
 * Orchestrates sections and manages calculator state
 */
export function Calculator({
  document,
  markdown,
  initialValues,
  onValuesChange,
  onCalculationsChange,
  formatResult,
  decimalPlaces = 6,
  className,
  showFormula = false,
  direction = 'vertical',
}: CalculatorProps) {
  // Resolve document from markdown if provided
  const resolvedDocument = useMemo(() => {
    if (document) return document;
    if (markdown) {
      const result = parseFile(markdown);
      if (result.success && result.data) {
        return result.data;
      }
      console.error('Failed to parse markdown:', result.error);
      return null;
    }
    return null;
  }, [document, markdown]);

  const { state, handleInputChange } = useCalculator(
    resolvedDocument!,
    initialValues,
    onValuesChange,
    onCalculationsChange
  );

  if (!resolvedDocument) {
    return <div className="error">No document or markdown provided</div>;
  }

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
      {resolvedDocument.sections
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
