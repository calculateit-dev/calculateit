// Main component
export { Calculator } from './Calculator.js';

// Types
export type {
  CalculatorProps,
  CalculatorRef,
  FormatterName,
} from './types.js';

// Re-export parser types and utilities for convenience
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
