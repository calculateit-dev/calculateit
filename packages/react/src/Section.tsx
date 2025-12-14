import { createElement } from 'react';
import { InputField } from './InputField.js';
import { CalcField } from './CalcField.js';
import type { SectionProps } from './types.js';

/**
 * Section component - groups variables by section
 * Renders section title and variables (inputs and calculations)
 */
export function Section({
  name,
  variables,
  inputValues,
  calculatedValues,
  onInputChange,
  formatResult,
  showFormula = false,
  level = 3,
}: SectionProps) {
  // Create heading element based on level (default to h3)
  const headingLevel = Math.min(Math.max(level, 1), 6);
  const headingTag = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <section className="section">
      {createElement(headingTag, {}, name)}
      <div className="section-content">
        {variables.map((variable) => {
          if (variable.isInput) {
            const value = inputValues[variable.name] ?? 0;
            return (
              <InputField
                key={variable.name}
                variable={variable}
                value={value}
                onChange={onInputChange}
              />
            );
          } else {
            const value = calculatedValues[variable.name] ?? 0;
            return (
              <CalcField
                key={variable.name}
                variable={variable}
                value={value}
                formatResult={formatResult}
                showFormula={showFormula}
              />
            );
          }
        })}
      </div>
    </section>
  );
}
