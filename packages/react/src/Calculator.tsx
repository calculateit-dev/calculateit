import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { createComponent } from '@lit/react';
import type { CalculatorProps, CalculatorRef } from './types.js';
import { CalculateElement } from '@calculateit/web-component';

const CalculateItComponent = createComponent({
  tagName: 'calculate-it',
  elementClass: CalculateElement,
  react: React,
});

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
 *       onValuesChange={(e) => {
 *         const event = e as CustomEvent<{ values: Record<string, number> }>;
 *         console.log(event.detail.values);
 *       }}
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
      decimalPlaces,
      showFormula,
      direction,
      formatter,
      maxColumnsVertical,
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

    // Set up event listeners
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      if (onValuesChange) {
        element.addEventListener('values-change', onValuesChange);
      }
      if (onCalculationsChange) {
        element.addEventListener('calculations-change', onCalculationsChange);
      }

      return () => {
        if (onValuesChange) {
          element.removeEventListener('values-change', onValuesChange);
        }
        if (onCalculationsChange) {
          element.removeEventListener('calculations-change', onCalculationsChange);
        }
      };
    }, [onValuesChange, onCalculationsChange]);

    return (
      <CalculateItComponent
        ref={elementRef}
        document={document}
        documentJson={documentJson}
        markdown={markdown}
        initialValues={initialValues}
        formatResult={formatResult}
        decimalPlaces={decimalPlaces}
        showFormula={showFormula}
        direction={direction}
        formatter={formatter}
        maxColumnsVertical={maxColumnsVertical}
        className={className}
        style={style}
      />
    );
  }
);

Calculator.displayName = 'Calculator';
