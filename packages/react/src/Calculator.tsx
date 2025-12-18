import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { CalculatorProps, CalculatorRef } from './types.js';
import '@calculateit/web-component';
import type { CalculateElement } from '@calculateit/web-component';

/**
 * React wrapper for the calculate-it web component
 *
 * Provides a React-friendly API while leveraging the web component's
 * Shadow DOM for perfect style isolation.
 *
 * @example
 * ```tsx
 * import { Calculator } from '@calculateit/react';
 *
 * function App() {
 *   return (
 *     <Calculator
 *       markdown={calculatorMarkdown}
 *       onValuesChange={(values) => console.log(values)}
 *     />
 *   );
 * }
 * ```
 */
export const Calculator = forwardRef<CalculatorRef, CalculatorProps>(
  (
    {
      document,
      documentJson,
      markdown,
      initialValues,
      onValuesChange,
      onCalculationsChange,
      formatResult,
      decimalPlaces = 6,
      showFormula = false,
      direction = 'vertical',
      formatter = 'default',
      maxColumnsVertical = 2,
      className,
      style,
    },
    ref
  ) => {
    const elementRef = useRef<CalculateElement>(null);

    // Expose imperative methods via ref
    useImperativeHandle(ref, () => ({
      getValues: () => elementRef.current?.getValues() || {},
      getCalculations: () => elementRef.current?.getCalculations() || {},
      setValues: (values: Record<string, number>) => {
        elementRef.current?.setValues(values);
      },
      recalculate: () => {
        elementRef.current?.recalculate();
      },
    }));

    // Sync props to web component properties
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      if (document !== undefined) element.document = document;
      if (documentJson !== undefined) element.documentJson = documentJson;
      if (markdown !== undefined) element.markdown = markdown;
      if (initialValues !== undefined) element.initialValues = initialValues;
      if (formatResult !== undefined) element.formatResult = formatResult;

      element.decimalPlaces = decimalPlaces;
      element.showFormula = showFormula;
      element.direction = direction;
      element.formatter = formatter;
      element.maxColumnsVertical = maxColumnsVertical;
    }, [
      document,
      documentJson,
      markdown,
      initialValues,
      formatResult,
      decimalPlaces,
      showFormula,
      direction,
      formatter,
      maxColumnsVertical,
    ]);

    // Set up event listeners for callbacks
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const handleValuesChange = (event: Event) => {
        const customEvent = event as CustomEvent<{
          values: Record<string, number>;
          timestamp: number;
        }>;
        onValuesChange?.(customEvent.detail.values);
      };

      const handleCalculationsChange = (event: Event) => {
        const customEvent = event as CustomEvent<{
          calculations: Record<string, number>;
          timestamp: number;
        }>;
        onCalculationsChange?.(customEvent.detail.calculations);
      };

      if (onValuesChange) {
        element.addEventListener('values-change', handleValuesChange);
      }
      if (onCalculationsChange) {
        element.addEventListener('calculations-change', handleCalculationsChange);
      }

      return () => {
        if (onValuesChange) {
          element.removeEventListener('values-change', handleValuesChange);
        }
        if (onCalculationsChange) {
          element.removeEventListener('calculations-change', handleCalculationsChange);
        }
      };
    }, [onValuesChange, onCalculationsChange]);

    return (
      <calculate-it
        ref={elementRef}
        class={className}
        style={style}
      />
    );
  }
);

Calculator.displayName = 'Calculator';
