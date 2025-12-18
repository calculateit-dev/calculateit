// Export types
export type {
  ParsedDocument,
  Section,
  SectionItem,
  Variable,
  ParserOptions,
  ParseResult,
  ParseError,
  EvalContext,
  EvalResult,
} from './types.js';

// Export parser functions
export {
  parseFile,
  parseOrgFile,
  parseMarkdownFile,
} from './parser.js';

// Export evaluator
export { ExpressionEvaluator, evaluateExpression } from './evaluator.js';

// Export utility functions (useful for consumers)
export {
  detectFormat,
  stripEmojis,
  isSimpleValue,
} from './utils.js';
