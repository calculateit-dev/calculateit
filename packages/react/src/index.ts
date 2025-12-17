// Export styles
import './styles.css';

// Export main component
export { Calculator } from './Calculator.js';

// Export sub-components (for advanced usage)
export { Section } from './Section.js';
export { InputField } from './InputField.js';
export { CalcField } from './CalcField.js';

// Export hooks
export { useCalculator } from './hooks/useCalculator.js';

// Export types
export type {
  CalculatorProps,
  CalculatorState,
  SectionProps,
  InputFieldProps,
  CalcFieldProps,
} from './types.js';

// Re-export parser types and evaluator for convenience
export type {
  ParsedDocument,
  Section as ParsedSection,
  Variable,
  ParserOptions,
  ParseResult,
  ParseError,
  EvalContext,
  EvalResult,
} from '@calculateit/parser-js';

export { ExpressionEvaluator, evaluateExpression, parseFile } from '@calculateit/parser-js';
