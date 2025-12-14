import { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import type { InputFieldProps } from './types.js';

/**
 * Input field component for user-editable variables
 * Features floating label design from original HTML
 */
export function InputField({ variable, value, onChange }: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== 0 || focused;
  const isNegative = value < 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(variable.name, isNaN(newValue) ? 0 : newValue);
  };

  return (
    <div className="input-field">
      <div className="input-wrapper">
        <input
          type="number"
          id={`input-${variable.name}`}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          step="any"
          className={hasValue ? 'has-value' : ''}
          style={
            isNegative
              ? {
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                }
              : undefined
          }
        />
        <Label.Root
          htmlFor={`input-${variable.name}`}
          className="input-label"
        >
          {variable.name}
        </Label.Root>
      </div>
    </div>
  );
}
