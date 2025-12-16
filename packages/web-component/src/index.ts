/**
 * @calculateit/web-component
 * Platform-agnostic web component for interactive calculators
 *
 * @packageDocumentation
 */

// Main component
export { CalculateElement } from './calculate-element.js';

// Types
export type {
  CalculateElementProps,
  ValuesChangeEventDetail,
  CalculationsChangeEventDetail,
  CalculateElementEventMap,
} from './types.js';

// State management
export { CalculatorState } from './state/calculator-state.js';
export type { CalculatorStateData } from './state/calculator-state.js';

// Utilities
export { formatters, getFormatter } from './utils/formatters.js';
export type { FormatterName } from './utils/formatters.js';
export { toTitleCase, parseDocumentJson } from './utils/helpers.js';

// Re-export parser types for convenience
export type {
  ParsedDocument,
  Section,
  Variable,
  ParserOptions,
  ParseResult,
  ParseError,
  EvalContext,
  EvalResult,
} from '@calculateit/parser-js';

// Re-export parser functions
export { parseFile, ExpressionEvaluator, evaluateExpression } from '@calculateit/parser-js';

// Auto-register custom element
import { CalculateElement } from './calculate-element.js';

if (typeof window !== 'undefined' && !customElements.get('calculate')) {
  customElements.define('calculate', CalculateElement);
}
