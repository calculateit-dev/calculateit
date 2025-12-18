import type { CSSProperties } from 'react';
import type { ParsedDocument } from '@calculateit/parser-js';

/**
 * Named formatter types available in the web component
 */
export type FormatterName = 'default' | 'currency' | 'percentage' | 'compact' | 'scientific';

/**
 * Props for the Calculator component
 */
export interface CalculatorProps {
  /**
   * Parsed document from @calculateit/parser-js
   */
  document?: ParsedDocument;

  /**
   * Document as JSON string (HTML attribute alternative)
   */
  documentJson?: string;

  /**
   * Markdown content (automatically parsed) - alternative to document prop
   */
  markdown?: string;

  /**
   * Initial values for input variables
   */
  initialValues?: Record<string, number>;

  /**
   * Callback when input values change
   */
  onValuesChange?: (e: Event) => void;

  /**
   * Callback when calculations update
   */
  onCalculationsChange?: (e: Event) => void;

  /**
   * Custom formatting function for results
   * Takes precedence over the formatter prop
   */
  formatResult?: (value: number, variableName: string) => string;

  /**
   * Number of decimal places for default formatting (default: 6)
   */
  decimalPlaces?: number;

  /**
   * Show formulas in calculated fields (default: false)
   */
  showFormula?: boolean;

  /**
   * Layout direction: vertical (stacked) or horizontal (side-by-side grid)
   * (default: 'vertical')
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * Named formatter to use: default, currency, percentage, compact, scientific
   * (default: 'default')
   */
  formatter?: FormatterName;

  /**
   * Maximum number of columns in vertical mode
   * (default: 2)
   */
  maxColumnsVertical?: number;

  /**
   * Custom CSS class for the root element
   */
  className?: string;

  /**
   * Inline styles for the root element
   */
  style?: CSSProperties;
}

/**
 * Imperative handle for Calculator component ref
 * Allows programmatic control of the calculator
 *
 * @example
 * ```tsx
 * const calculatorRef = useRef<CalculatorRef>(null);
 *
 * // Get current values
 * const values = calculatorRef.current?.getValues();
 *
 * // Set values programmatically
 * calculatorRef.current?.setValues({ price: 100, tax: 0.2 });
 * ```
 */
export interface CalculatorRef {
  /**
   * Get current input values
   */
  getValues: () => Record<string, number>;

  /**
   * Get current calculated values
   */
  getCalculations: () => Record<string, number>;

  /**
   * Set input values programmatically
   */
  setValues: (values: Record<string, number>) => void;

  /**
   * Force recalculation
   */
  recalculate: () => void;
}
