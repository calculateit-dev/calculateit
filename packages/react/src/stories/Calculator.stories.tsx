import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Calculator } from '../Calculator';
import { parseFile } from '@calculateit/parser-js';

// Crypto swing trade calculator example from original HTML
const cryptoCalcContent = `# Crypto Swing Trade Calculator

## 📝 Input Values

coins = 200
sellPrice = 1.50
checkBuyPrice = 1.45
targetCoins = 205
targetGrowth = 2.5
tradeFeePercent = 0.2
tradeFee = tradeFeePercent / 100

## 💰 Sell Transaction

usdtFromSell = coins * sellPrice
sellFeeAmount = usdtFromSell * tradeFee
usdtReceived = usdtFromSell - sellFeeAmount

## 🔄 Buy Back at Check Price

coinsBeforeBuyFee = usdtReceived / checkBuyPrice
buyFeeCoins = coinsBeforeBuyFee * tradeFee
coinsAfterBuyback = coinsBeforeBuyFee - buyFeeCoins
coinProfit = coinsAfterBuyback - coins
profitPercent = (coinProfit / coins) * 100

## 🎯 Required Buy Price

usdtAfterSell = coins * sellPrice * (1 - tradeFee)
requiredBuyPrice = (usdtAfterSell * (1 - tradeFee)) / targetCoins
verifyCoins = (usdtAfterSell / requiredBuyPrice) * (1 - tradeFee)
actualGrowth = ((targetCoins - coins) / coins) * 100
targetCoinsFromGrowth = coins * (1 + targetGrowth / 100)

## 📊 Quick Reference

breakeven_price = (usdtAfterSell * (1 - tradeFee)) / coins
profit1_price = (usdtAfterSell * (1 - tradeFee)) / (coins * 1.01)
profit2_price = (usdtAfterSell * (1 - tradeFee)) / (coins * 1.02)
profit5_price = (usdtAfterSell * (1 - tradeFee)) / (coins * 1.05)
profit10_price = (usdtAfterSell * (1 - tradeFee)) / (coins * 1.10)
`;

// Simple math calculator
const simpleMathContent = `# Simple Math Calculator

## Input Values

a = 10
b = 5

## Basic Operations

sum = a + b
difference = a - b
product = a * b
quotient = a / b

## Advanced

squared = a * a
cubed = a * a * a
average = (a + b) / 2
`;

const meta = {
  title: 'Calculator/Calculator',
  component: Calculator,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calculator>;

export default meta;
type Story = StoryObj<typeof meta>;

// Parse the documents
const cryptoResult = parseFile(cryptoCalcContent);
const mathResult = parseFile(simpleMathContent);

export const CryptoSwingTrading: Story = {
  args: {
    document: cryptoResult.data!,
    decimalPlaces: 2,
  },
};

export const SimpleMathCalculator: Story = {
  args: {
    document: mathResult.data!,
    decimalPlaces: 2,
  },
};

export const CustomInitialValues: Story = {
  args: {
    document: cryptoResult.data!,
    initialValues: {
      coins: 500,
      sellPrice: 2.0,
      checkBuyPrice: 1.85,
      targetCoins: 510,
      targetGrowth: 2.0,
      tradeFeePercent: 0.1,
    },
    decimalPlaces: 4,
  },
};

export const HighPrecision: Story = {
  args: {
    document: mathResult.data!,
    decimalPlaces: 8,
  },
};

export const WithCustomFormatter: Story = {
  args: {
    document: cryptoResult.data!,
    formatResult: (value: number, varName: string) => {
      // Custom formatting for different variables
      if (varName.includes('Percent') || varName.includes('Growth')) {
        return `${value.toFixed(2)}%`;
      }
      if (varName.includes('Price') || varName.includes('usdt')) {
        return `$${value.toFixed(2)}`;
      }
      if (varName.includes('coin') || varName.includes('Coins')) {
        return `${value.toFixed(6)} coins`;
      }
      return value.toFixed(2);
    },
    decimalPlaces: 2,
  },
};

export const WithCallbacks: Story = {
  args: {
    document: mathResult.data!,
    onValuesChange: (values) => {
      console.log('Input values changed:', values);
    },
    onCalculationsChange: (calculations) => {
      console.log('Calculations updated:', calculations);
    },
    decimalPlaces: 2,
  },
};

export const ThreeColumnsVertical: Story = {
  args: {
    document: cryptoResult.data!,
    maxColumnsVertical: 3,
    decimalPlaces: 2,
  },
};

export const SingleColumnVertical: Story = {
  args: {
    document: cryptoResult.data!,
    maxColumnsVertical: 1,
    decimalPlaces: 2,
  },
};

export const FourColumnsVertical: Story = {
  args: {
    document: cryptoResult.data!,
    maxColumnsVertical: 4,
    decimalPlaces: 2,
  },
};

// Calculator with hidden sections example
const initialHiddenSectionContent = `# Price Calculator

**Note:** This demo supports all heading levels (# to ######). The "Hidden Calculations" section (tagged with \`:hidden:\`) is not displayed in the calculator, but its calculations still work behind the scenes. Negative values are displayed in red. Try editing the markdown to see live updates!

## Input Values

basePrice = 100
taxRate = 0.08
discountPercent = 10
cost = 95

### Hidden Calculations :hidden:

discountAmount = basePrice * (discountPercent / 100)
priceAfterDiscount = basePrice - discountAmount
taxAmount = priceAfterDiscount * taxRate

#### Final Result

totalPrice = priceAfterDiscount + taxAmount
savings = basePrice - priceAfterDiscount
profit = totalPrice - cost

##### Additional Info

effectiveTaxRate = taxAmount / basePrice
`;

export const WithHiddenSections: Story = {
  render: () => {
    const [markdown, setMarkdown] = useState(initialHiddenSectionContent);
    const parseResult = parseFile(markdown);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', padding: '2rem', minHeight: '100vh' }}>
        {/* Rendered Markdown Preview */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Markdown Preview</h3>
          <div style={{
            flex: 1,
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: 'white',
            overflow: 'auto',
          }}>
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>

        {/* Editable Markdown Source */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Markdown Source</h3>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            style={{
              flex: 1,
              fontFamily: 'monospace',
              fontSize: '13px',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
              resize: 'none',
              lineHeight: '1.6',
              background: '#fafafa',
            }}
            spellCheck={false}
          />
        </div>

        {/* Live Calculator */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Live Calculator</h3>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {parseResult.success ? (
              <Calculator document={parseResult.data!} decimalPlaces={2} />
            ) : (
              <div style={{ padding: '1rem', background: '#ffebee', borderRadius: '8px', color: '#c62828' }}>
                <strong>Parse Error:</strong> {parseResult.error?.message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};
