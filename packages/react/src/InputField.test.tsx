import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from './InputField';
import type { Variable } from '@calculateit/parser-js';

describe('InputField', () => {
  const mockVariable: Variable = {
    name: 'testVar',
    expression: '10',
    isInput: true,
    section: 'Test',
    order: 0,
  };

  const mockOnChange = vi.fn();

  it('should render input with label', () => {
    render(<InputField variable={mockVariable} value={10} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(screen.getByText('testVar')).toBeInTheDocument();
  });

  it('should display current value', () => {
    render(<InputField variable={mockVariable} value={42} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('42');
  });

  it('should call onChange when value changes', async () => {
    const user = userEvent.setup();
    render(<InputField variable={mockVariable} value={10} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    // Use direct input value change instead of typing
    await user.clear(input);
    await user.click(input);
    input.value = '25';
    await user.keyboard('[Enter]');

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange.mock.calls.length).toBeGreaterThan(0);
  });

  it('should handle decimal input', async () => {
    render(<InputField variable={mockVariable} value={0} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '3.14' } });

    expect(mockOnChange).toHaveBeenCalledWith('testVar', 3.14);
  });

  it('should handle negative numbers', async () => {
    render(<InputField variable={mockVariable} value={0} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '-42' } });

    expect(mockOnChange).toHaveBeenCalledWith('testVar', -42);
  });

  it('should handle invalid input by defaulting to 0', async () => {
    const user = userEvent.setup();
    render(<InputField variable={mockVariable} value={10} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton');
    await user.clear(input);

    // Clearing the input will trigger onChange with NaN, which should become 0
    expect(mockOnChange).toHaveBeenCalledWith('testVar', 0);
  });

  it('should apply negative styling for negative values', () => {
    render(<InputField variable={mockVariable} value={-10} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveStyle({
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    });
  });

  it('should not apply negative styling for positive values', () => {
    render(<InputField variable={mockVariable} value={10} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton');
    expect(input).not.toHaveStyle({
      backgroundColor: '#fee2e2',
    });
  });

  it('should add has-value class when focused', async () => {
    const user = userEvent.setup();
    render(<InputField variable={mockVariable} value={0} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton');

    await user.click(input);

    expect(input).toHaveClass('has-value');
  });

  it('should add has-value class when value is not zero', () => {
    render(<InputField variable={mockVariable} value={42} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveClass('has-value');
  });

  it('should have step="any" attribute', () => {
    render(<InputField variable={mockVariable} value={10} onChange={mockOnChange} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('step', 'any');
  });
});
