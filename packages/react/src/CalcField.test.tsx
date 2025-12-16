import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CalcField } from './CalcField';
import type { Variable } from '@calculateit/parser-js';

describe('CalcField', () => {
  const mockVariable: Variable = {
    name: 'totalPrice',
    expression: 'price * quantity',
    isInput: false,
    section: 'Results',
    order: 0,
  };

  const defaultFormatResult = (value: number) => value.toFixed(2);

  it('should render calculated value', () => {
    render(
      <CalcField
        variable={mockVariable}
        value={150.5}
        formatResult={defaultFormatResult}
      />
    );

    expect(screen.getByText('150.50')).toBeInTheDocument();
  });

  it('should convert variable name to title case', () => {
    render(
      <CalcField
        variable={mockVariable}
        value={100}
        formatResult={defaultFormatResult}
      />
    );

    expect(screen.getByText('Total Price')).toBeInTheDocument();
  });

  it('should handle camelCase variable names', () => {
    const camelCaseVar: Variable = {
      ...mockVariable,
      name: 'myVariableName',
    };

    render(
      <CalcField
        variable={camelCaseVar}
        value={100}
        formatResult={defaultFormatResult}
      />
    );

    expect(screen.getByText('My Variable Name')).toBeInTheDocument();
  });

  it('should handle snake_case variable names', () => {
    const snakeCaseVar: Variable = {
      ...mockVariable,
      name: 'my_variable_name',
    };

    render(
      <CalcField
        variable={snakeCaseVar}
        value={100}
        formatResult={defaultFormatResult}
      />
    );

    expect(screen.getByText('My Variable Name')).toBeInTheDocument();
  });

  it('should handle kebab-case variable names', () => {
    const kebabCaseVar: Variable = {
      ...mockVariable,
      name: 'my-variable-name',
    };

    render(
      <CalcField
        variable={kebabCaseVar}
        value={100}
        formatResult={defaultFormatResult}
      />
    );

    expect(screen.getByText('My Variable Name')).toBeInTheDocument();
  });

  it('should not show formula by default', () => {
    render(
      <CalcField
        variable={mockVariable}
        value={100}
        formatResult={defaultFormatResult}
      />
    );

    expect(screen.queryByText('price * quantity')).not.toBeInTheDocument();
  });

  it('should show formula when showFormula is true', () => {
    render(
      <CalcField
        variable={mockVariable}
        value={100}
        formatResult={defaultFormatResult}
        showFormula={true}
      />
    );

    expect(screen.getByText('price * quantity')).toBeInTheDocument();
  });

  it('should apply custom formatting', () => {
    const customFormat = (value: number) => `$${value.toFixed(2)}`;

    render(
      <CalcField
        variable={mockVariable}
        value={99.99}
        formatResult={customFormat}
      />
    );

    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should apply negative styling for negative values', () => {
    render(
      <CalcField
        variable={mockVariable}
        value={-50}
        formatResult={defaultFormatResult}
      />
    );

    const result = screen.getByText('-50.00');
    expect(result).toHaveStyle({
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    });
  });

  it('should not apply negative styling for positive values', () => {
    render(
      <CalcField
        variable={mockVariable}
        value={50}
        formatResult={defaultFormatResult}
      />
    );

    const result = screen.getByText('50.00');
    expect(result).not.toHaveStyle({
      backgroundColor: '#fee2e2',
    });
  });

  it('should not apply negative styling for zero', () => {
    render(
      <CalcField
        variable={mockVariable}
        value={0}
        formatResult={defaultFormatResult}
      />
    );

    const result = screen.getByText('0.00');
    expect(result).not.toHaveStyle({
      backgroundColor: '#fee2e2',
    });
  });

  it('should render with different decimal places', () => {
    const formatWith4Decimals = (value: number) => value.toFixed(4);

    render(
      <CalcField
        variable={mockVariable}
        value={123.456789}
        formatResult={formatWith4Decimals}
      />
    );

    expect(screen.getByText('123.4568')).toBeInTheDocument();
  });

  it('should pass variable name to formatResult', () => {
    const formatWithName = (value: number, name: string) =>
      `${name}: ${value.toFixed(2)}`;

    render(
      <CalcField
        variable={mockVariable}
        value={100}
        formatResult={formatWithName}
      />
    );

    expect(screen.getByText('totalPrice: 100.00')).toBeInTheDocument();
  });
});
