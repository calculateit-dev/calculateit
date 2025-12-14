import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Section } from '../Section.js';
import type { Variable } from '@calculateit/parser-js';

const meta = {
  title: 'Calculator/Section',
  component: Section,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

const inputVariables: Variable[] = [
  {
    name: 'principal',
    expression: '1000',
    isInput: true,
    section: 'Input Values',
    order: 0,
  },
  {
    name: 'rate',
    expression: '5',
    isInput: true,
    section: 'Input Values',
    order: 1,
  },
  {
    name: 'time',
    expression: '2',
    isInput: true,
    section: 'Input Values',
    order: 2,
  },
];

const calcVariables: Variable[] = [
  {
    name: 'interest',
    expression: 'principal * rate * time / 100',
    isInput: false,
    section: 'Calculations',
    order: 0,
  },
  {
    name: 'total',
    expression: 'principal + interest',
    isInput: false,
    section: 'Calculations',
    order: 1,
  },
];

const mixedVariables: Variable[] = [
  {
    name: 'coins',
    expression: '200',
    isInput: true,
    section: 'Trade',
    order: 0,
  },
  {
    name: 'price',
    expression: '1.50',
    isInput: true,
    section: 'Trade',
    order: 1,
  },
  {
    name: 'total',
    expression: 'coins * price',
    isInput: false,
    section: 'Trade',
    order: 2,
  },
  {
    name: 'fee',
    expression: 'total * 0.002',
    isInput: false,
    section: 'Trade',
    order: 3,
  },
];

function SectionWithState(args: any) {
  const [inputValues, setInputValues] = useState({
    principal: 1000,
    rate: 5,
    time: 2,
    coins: 200,
    price: 1.50,
  });

  const [calculatedValues, setCalculatedValues] = useState({
    interest: 100,
    total: 1100,
    fee: 0.6,
  });

  const handleInputChange = (name: string, value: number) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));

    // Simple recalculation for demo
    if (name === 'principal' || name === 'rate' || name === 'time') {
      const p = name === 'principal' ? value : inputValues.principal;
      const r = name === 'rate' ? value : inputValues.rate;
      const t = name === 'time' ? value : inputValues.time;
      const interest = (p * r * t) / 100;
      setCalculatedValues((prev) => ({
        ...prev,
        interest,
        total: p + interest
      }));
    } else if (name === 'coins' || name === 'price') {
      const c = name === 'coins' ? value : inputValues.coins;
      const p = name === 'price' ? value : inputValues.price;
      const total = c * p;
      setCalculatedValues((prev) => ({
        ...prev,
        total,
        fee: total * 0.002
      }));
    }
  };

  return (
    <Section
      {...args}
      inputValues={inputValues}
      calculatedValues={calculatedValues}
      onInputChange={handleInputChange}
    />
  );
}

export const InputsOnly: Story = {
  render: (args) => <SectionWithState {...args} />,
  args: {
    name: '📝 Input Values',
    variables: inputVariables,
    formatResult: (value: number) => value.toFixed(2),
  },
};

export const CalculationsOnly: Story = {
  render: (args) => <SectionWithState {...args} />,
  args: {
    name: '📊 Calculations',
    variables: calcVariables,
    formatResult: (value: number) => value.toFixed(2),
  },
};

export const MixedSection: Story = {
  render: (args) => <SectionWithState {...args} />,
  args: {
    name: '💰 Trade Analysis',
    variables: mixedVariables,
    formatResult: (value: number) => value.toFixed(2),
  },
};

export const WithCustomFormatter: Story = {
  render: (args) => <SectionWithState {...args} />,
  args: {
    name: '🎯 Financial Metrics',
    variables: calcVariables,
    formatResult: (value: number, varName: string) => {
      if (varName === 'interest') return `$${value.toFixed(2)}`;
      if (varName === 'total') return `$${value.toFixed(2)}`;
      return value.toFixed(2);
    },
  },
};
