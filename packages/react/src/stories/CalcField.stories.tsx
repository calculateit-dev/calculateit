import type { Meta, StoryObj } from '@storybook/react';
import { CalcField } from '../CalcField.js';
import type { Variable } from '@calculateit/parser-js';

const meta = {
  title: 'Calculator/CalcField',
  component: CalcField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalcField>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFormatter = (value: number) => value.toFixed(6);

export const SimpleCalculation: Story = {
  args: {
    variable: {
      name: 'total',
      expression: 'a + b',
      isInput: false,
      section: 'Calculations',
      order: 0,
    },
    value: 150.5,
    formatResult: defaultFormatter,
  },
};

export const ComplexExpression: Story = {
  args: {
    variable: {
      name: 'profit',
      expression: '(sellPrice - buyPrice) * quantity * (1 - fee)',
      isInput: false,
      section: 'Calculations',
      order: 0,
    },
    value: 1234.567890,
    formatResult: defaultFormatter,
  },
};

export const PercentageResult: Story = {
  args: {
    variable: {
      name: 'profitPercent',
      expression: '(profit / investment) * 100',
      isInput: false,
      section: 'Calculations',
      order: 0,
    },
    value: 12.5,
    formatResult: (value: number) => `${value.toFixed(2)}%`,
  },
};

export const CurrencyResult: Story = {
  args: {
    variable: {
      name: 'totalCost',
      expression: 'price * quantity',
      isInput: false,
      section: 'Calculations',
      order: 0,
    },
    value: 1500.75,
    formatResult: (value: number) => `$${value.toFixed(2)}`,
  },
};

export const SmallDecimal: Story = {
  args: {
    variable: {
      name: 'ratio',
      expression: 'small / large',
      isInput: false,
      section: 'Calculations',
      order: 0,
    },
    value: 0.000123,
    formatResult: defaultFormatter,
  },
};

export const NegativeResult: Story = {
  args: {
    variable: {
      name: 'loss',
      expression: 'sellPrice - buyPrice',
      isInput: false,
      section: 'Calculations',
      order: 0,
    },
    value: -250.50,
    formatResult: defaultFormatter,
  },
};
