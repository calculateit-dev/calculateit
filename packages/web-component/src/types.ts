import type { ParsedDocument } from '@calculateit/parser-js';
import type { FormatterName } from './utils/formatters.js';

/**
 * Properties for CalculateElement web component
 */
export interface CalculateElementProps {
  /**
   * Parsed document object
   */
  document?: ParsedDocument;

  /**
   * Document as JSON string (alternative to document property)
   */
  documentJson?: string;

  /**
   * Initial input values
   */
  initialValues?: Record<string, number>;

  /**
   * Number of decimal places for default formatting
   * @default 6
   */
  decimalPlaces?: number;

  /**
   * Show formulas under calculated results
   * @default false
   */
  showFormula?: boolean;

  /**
   * Layout direction
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * Named formatter to use
   * @default 'default'
   */
  formatter?: FormatterName;

  /**
   * Custom result formatter function
   */
  formatResult?: (value: number, variableName: string) => string;

  /**
   * Callback when input values change
   */
  onValuesChange?: (values: Record<string, number>) => void;

  /**
   * Callback when calculations change
   */
  onCalculationsChange?: (calculations: Record<string, number>) => void;
}

/**
 * Event detail for values-change event
 */
export interface ValuesChangeEventDetail {
  /**
   * Current input values
   */
  values: Record<string, number>;

  /**
   * Timestamp when event was fired
   */
  timestamp: number;
}

/**
 * Event detail for calculations-change event
 */
export interface CalculationsChangeEventDetail {
  /**
   * Current calculated values
   */
  calculations: Record<string, number>;

  /**
   * Timestamp when event was fired
   */
  timestamp: number;
}

/**
 * Event map for Calculate element
 * Use for type-safe event listeners
 *
 * @example
 * ```typescript
 * const calc = document.querySelector('calculate');
 * calc.addEventListener('values-change', (e: CustomEvent<ValuesChangeEventDetail>) => {
 *   console.log(e.detail.values);
 * });
 * ```
 */
export interface CalculateElementEventMap {
  'values-change': CustomEvent<ValuesChangeEventDetail>;
  'calculations-change': CustomEvent<CalculationsChangeEventDetail>;
}

// Augment global event types
declare global {
  interface HTMLElementEventMap extends CalculateElementEventMap {}
}
