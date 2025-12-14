import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { InputField } from '../InputField.js';
import type { Variable } from '@calculateit/parser-js';

const meta = {
  title: 'Calculator/InputField',
  component: InputField,
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
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleVariable: Variable = {
  name: 'price',
  expression: '100',
  isInput: true,
  section: 'Input Values',
  order: 0,
};

// Wrapper component to handle state
function InputFieldWithState(args: any) {
  const [value, setValue] = useState(args.value || 100);

  return (
    <InputField
      {...args}
      value={value}
      onChange={(name, newValue) => {
        setValue(newValue);
        args.onChange?.(name, newValue);
      }}
    />
  );
}

export const Default: Story = {
  render: (args) => <InputFieldWithState {...args} />,
  args: {
    variable: sampleVariable,
    value: 100,
  },
};

export const EmptyValue: Story = {
  render: (args) => <InputFieldWithState {...args} />,
  args: {
    variable: sampleVariable,
    value: 0,
  },
};

export const NegativeValue: Story = {
  render: (args) => <InputFieldWithState {...args} />,
  args: {
    variable: {
      ...sampleVariable,
      name: 'adjustment',
    },
    value: -25.5,
  },
};

export const LargeNumber: Story = {
  render: (args) => <InputFieldWithState {...args} />,
  args: {
    variable: {
      ...sampleVariable,
      name: 'marketCap',
    },
    value: 1000000,
  },
};

export const DecimalValue: Story = {
  render: (args) => <InputFieldWithState {...args} />,
  args: {
    variable: {
      ...sampleVariable,
      name: 'percentage',
    },
    value: 0.125,
  },
};
