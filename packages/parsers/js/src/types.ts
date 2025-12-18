/**
 * Parsed document structure representing org/markdown files with literate calculations
 */
export interface ParsedDocument {
  /** File format (org-mode or markdown) */
  format: 'org' | 'markdown';
  /** Expression language used in calculations */
  language: 'javascript' | 'elisp';
  /** Sections containing variables */
  sections: Section[];
  /** All variables in the document */
  variables: Variable[];
  /** Names of variables that are user inputs */
  inputVariables: string[];
}

/**
 * Section item - either a variable or markdown content
 */
export type SectionItem =
  | { type: 'variable'; variable: Variable }
  | { type: 'content'; html: string };

/**
 * A section in the document (corresponds to headers in org/markdown)
 */
export interface Section {
  /** Section name (emojis stripped) */
  name: string;
  /** Order of appearance in the document */
  order: number;
  /** Variables belonging to this section */
  variables: Variable[];
  /** Whether this section should be hidden from view (but still calculated) */
  hidden?: boolean;
  /** Heading level (1-6 for markdown #-######, 1+ for org-mode *-****...) */
  level?: number;
  /** Ordered items (variables and content blocks) as they appear in source */
  items?: SectionItem[];
}

/**
 * A variable definition with its expression
 */
export interface Variable {
  /** Variable name */
  name: string;
  /** Expression or value */
  expression: string;
  /** Whether this is an input variable (simple value) or calculated */
  isInput: boolean;
  /** Section this variable belongs to */
  section: string;
  /** Order within the section */
  order: number;
}

/**
 * Options for parsing org/markdown files
 */
export interface ParserOptions {
  /** Auto-detect inputs vs calculations based on expression patterns (default: true) */
  autoDetectInputs?: boolean;
  /** Explicitly mark these variables as inputs (overrides auto-detection) */
  explicitInputs?: string[];
  /** Expression language to use (default: 'javascript') */
  language?: 'javascript' | 'elisp';
}

/**
 * Result of parsing operation
 */
export interface ParseResult {
  /** Whether parsing was successful */
  success: boolean;
  /** Parsed document data (if successful) */
  data?: ParsedDocument;
  /** Error information (if failed) */
  error?: ParseError;
}

/**
 * Parse error information
 */
export interface ParseError {
  /** Error message */
  message: string;
  /** Line number where error occurred (if applicable) */
  line?: number;
  /** Additional context about the error */
  context?: string;
}

/**
 * Expression evaluator context
 */
export type EvalContext = Record<string, number>;

/**
 * Expression evaluation result
 */
export interface EvalResult {
  /** Whether evaluation was successful */
  success: boolean;
  /** Evaluated value (if successful) */
  value?: number;
  /** Error message (if failed) */
  error?: string;
}
