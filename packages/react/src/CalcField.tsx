import type { CalcFieldProps } from './types.js';

/**
 * Convert string to title case
 */
function toTitleCase(str: string): string {
  return str
    .split(/(?=[A-Z])|_|-/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Calculated field component (display only)
 * Shows the variable name as title, result, and optionally formula as subscript
 */
export function CalcField({ variable, value, formatResult, showFormula = false }: CalcFieldProps) {
  const formattedValue = formatResult(value, variable.name);
  const title = toTitleCase(variable.name);
  const isNegative = value < 0;

  return (
    <div className="calc-field">
      <div className="calc-title">{title}</div>
      <div
        className="calc-result"
        style={
          isNegative
            ? {
                backgroundColor: '#fee2e2',
                color: '#991b1b',
              }
            : undefined
        }
      >
        {formattedValue}
      </div>
      {showFormula && <div className="calc-formula">{variable.expression}</div>}
    </div>
  );
}
