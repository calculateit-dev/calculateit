import type { ParsedDocument, Variable } from '@calculateit/parser-js';

/**
 * Props for the Calculator component
 */
export interface CalculatorProps {
  /** Parsed document from @calculateit/parser-js */
  document?: ParsedDocument;
  /** Markdown content (automatically parsed) - alternative to document prop */
  markdown?: string;
  /** Initial values for input variables */
  initialValues?: Record<string, number>;
  /** Callback when input values change */
  onValuesChange?: (values: Record<string, number>) => void;
  /** Callback when calculations update */
  onCalculationsChange?: (calculations: Record<string, number>) => void;
  /** Custom formatting for results */
  formatResult?: (value: number, variableName: string) => string;
  /** Number of decimal places (default: 6) */
  decimalPlaces?: number;
  /** Custom CSS class */
  className?: string;
  /** Show formulas in calculated fields (default: false) */
  showFormula?: boolean;
  /** Layout direction: vertical (stacked) or horizontal (side-by-side grid) (default: 'vertical') */
  direction?: 'vertical' | 'horizontal';
}

/**
 * Calculator state management
 */
export interface CalculatorState {
  /** Current input values */
  inputValues: Record<string, number>;
  /** Current calculated values */
  calculatedValues: Record<string, number>;
  /** Calculation errors by variable name */
  errors: Record<string, string>;
}

/**
 * Props for Section component
 */
export interface SectionProps {
  /** Section name */
  name: string;
  /** Variables in this section */
  variables: Variable[];
  /** Current input values */
  inputValues: Record<string, number>;
  /** Current calculated values */
  calculatedValues: Record<string, number>;
  /** Callback when input changes */
  onInputChange: (name: string, value: number) => void;
  /** Result formatter */
  formatResult: (value: number, name: string) => string;
  /** Decimal places for display */
  decimalPlaces: number;
  /** Show formulas in calculated fields (default: false) */
  showFormula?: boolean;
  /** Heading level (1-6 for h1-h6) */
  level?: number;
}

/**
 * Props for InputField component
 */
export interface InputFieldProps {
  /** Variable definition */
  variable: Variable;
  /** Current value */
  value: number;
  /** Change handler */
  onChange: (name: string, value: number) => void;
}

/**
 * Props for CalcField component
 */
export interface CalcFieldProps {
  /** Variable definition */
  variable: Variable;
  /** Calculated value */
  value: number;
  /** Result formatter */
  formatResult: (value: number, name: string) => string;
  /** Show formula (default: true) */
  showFormula?: boolean;
}
