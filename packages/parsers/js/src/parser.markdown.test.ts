import { describe, it, expect } from 'vitest';
import { parseFile, parseMarkdownFile } from './parser';

describe('Markdown Parser', () => {
  describe('Basic Parsing', () => {
    it('should parse markdown with single section', async () => {
      const content = `## Input Values

x = 10
y = 5`;

      const result = await parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.format).toBe('markdown');
      expect(result.data?.sections).toHaveLength(1);
      expect(result.data?.sections[0].name).toBe('Input Values');
      expect(result.data?.variables).toHaveLength(2);
    });

    it('should parse markdown with multiple sections', () => {
      const content = `## Inputs

price = 100
quantity = 5

## Calculations

total = price * quantity
tax = total * 0.08
grandTotal = total + tax`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(2);
      expect(result.data?.sections[0].name).toBe('Inputs');
      expect(result.data?.sections[1].name).toBe('Calculations');
      expect(result.data?.variables).toHaveLength(5);
    });

    it('should handle different heading levels', () => {
      const content = `## Level 2

x = 1

### Level 3

y = 2

#### Level 4

z = 3`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(3);
      expect(result.data?.sections[0].level).toBe(2);
      expect(result.data?.sections[1].level).toBe(3);
      expect(result.data?.sections[2].level).toBe(4);
    });
  });

  describe('Variable Detection', () => {
    it('should auto-detect input variables', () => {
      const content = `## Variables

inputValue = 42
calculated = inputValue * 2
anotherInput = 100`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.inputVariables).toContain('inputValue');
      expect(result.data?.inputVariables).toContain('anotherInput');
      expect(result.data?.inputVariables).not.toContain('calculated');
    });

    it('should detect decimal inputs', () => {
      const content = `## Inputs

rate = 0.08
price = 99.99
count = 5`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.inputVariables).toHaveLength(3);
    });

    it('should detect negative number inputs', () => {
      const content = `## Values

negative = -10
positive = 10
zero = 0`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.inputVariables).toHaveLength(3);
    });

    it('should respect explicit inputs option', () => {
      const content = `## Variables

x = a + b
y = 5`;

      const result = parseFile(content, 'test.md', {
        explicitInputs: ['x'],
        autoDetectInputs: false,
      });

      expect(result.success).toBe(true);
      expect(result.data?.inputVariables).toEqual(['x']);
      expect(result.data?.variables[0].isInput).toBe(true);
      expect(result.data?.variables[1].isInput).toBe(false);
    });
  });

  describe('Hidden Sections', () => {
    it('should parse hidden sections with :hidden: tag', () => {
      const content = `## Visible Section

x = 10

### Hidden Calculations :hidden:

intermediate = x * 2
temp = intermediate + 5

## Final Result

result = temp * 3`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(3);
      expect(result.data?.sections[0].hidden).toBeFalsy();
      expect(result.data?.sections[1].hidden).toBe(true);
      expect(result.data?.sections[2].hidden).toBeFalsy();
    });

    it('should handle multiple tags including hidden', () => {
      const content = `## Section :tag1:hidden:tag2:

x = 5`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections[0].hidden).toBe(true);
    });
  });

  describe('Section Names with Emojis', () => {
    it('should strip emojis from section names', () => {
      const content = `## 📊 Data Analysis

data = 100

### 🎯 Target Values

target = 200`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections[0].name).toBe('Data Analysis');
      expect(result.data?.sections[1].name).toBe('Target Values');
    });
  });

  describe('Complex Calculations', () => {
    it('should parse mortgage calculator example', () => {
      const content = `## Loan Details

principal = 300000
rate = 4.5
years = 30

## Monthly Payment

monthlyRate = rate / 1200
numPayments = years * 12
payment = principal * monthlyRate / (1 - (1 + monthlyRate)^(-numPayments))
totalPaid = payment * numPayments
totalInterest = totalPaid - principal`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(2);
      expect(result.data?.inputVariables).toHaveLength(3);
      expect(result.data?.inputVariables).toContain('principal');
      expect(result.data?.inputVariables).toContain('rate');
      expect(result.data?.inputVariables).toContain('years');

      const calculations = result.data?.variables.filter(v => !v.isInput);
      expect(calculations).toHaveLength(5);
    });

    it('should parse crypto trading calculator example', () => {
      const content = `## Input Values

coins = 200
sellPrice = 1.50
buyPrice = 1.45
tradeFeePercent = 0.2

## Calculations

tradeFee = tradeFeePercent / 100
usdtFromSell = coins * sellPrice
sellFeeAmount = usdtFromSell * tradeFee
usdtReceived = usdtFromSell - sellFeeAmount
coinsAfterBuyback = usdtReceived / buyPrice
coinProfit = coinsAfterBuyback - coins`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.inputVariables).toHaveLength(4);
      expect(result.data?.variables.filter(v => !v.isInput)).toHaveLength(6);
    });
  });

  describe('Edge Cases', () => {
    it('should skip empty lines', () => {
      const content = `## Section


x = 10


y = 20


`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.variables).toHaveLength(2);
    });

    it('should skip malformed headers without space', () => {
      const content = `## Valid Section

x = 10
#NotAHeader
##AlsoNotAHeader
y = 20`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.variables).toHaveLength(2);
    });

    it('should skip code blocks', () => {
      const content = `## Section

x = 10
\`\`\`javascript
const code = 'ignored';
\`\`\`
y = 20`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.variables).toHaveLength(2);
    });

    it('should handle variables with underscores and numbers', () => {
      const content = `## Variables

my_var_1 = 10
another_var_2 = 20
final_result_123 = my_var_1 + another_var_2`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.variables).toHaveLength(3);
      expect(result.data?.variables[0].name).toBe('my_var_1');
      expect(result.data?.variables[1].name).toBe('another_var_2');
      expect(result.data?.variables[2].name).toBe('final_result_123');
    });

    it('should preserve variable order within sections', () => {
      const content = `## Section

first = 1
second = 2
third = 3`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.variables[0].order).toBe(0);
      expect(result.data?.variables[1].order).toBe(1);
      expect(result.data?.variables[2].order).toBe(2);
    });

    it('should preserve section order', () => {
      const content = `## First Section

x = 1

## Second Section

y = 2

## Third Section

z = 3`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections[0].order).toBe(0);
      expect(result.data?.sections[1].order).toBe(1);
      expect(result.data?.sections[2].order).toBe(2);
    });
  });

  describe('parseMarkdownFile convenience function', () => {
    it('should parse markdown content', () => {
      const content = `## Section

x = 10
y = 20`;

      const result = parseMarkdownFile(content);

      expect(result.success).toBe(true);
      expect(result.data?.format).toBe('markdown');
      expect(result.data?.variables).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    it('should return success even with no sections', () => {
      const content = `Just some text
without sections
or variables`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(0);
      expect(result.data?.variables).toHaveLength(0);
    });

    it('should handle empty content', () => {
      const result = parseFile('', 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(0);
    });
  });

  describe('Markdown Content Extraction', () => {
    it('should extract markdown content between variables', () => {
      const content = `## Input Values

Some description text here.

basePrice = 100
taxRate = 0.08

**Note:** More content here.

## Results

result = basePrice * taxRate`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(2);

      // Check first section has content items
      const firstSection = result.data?.sections[0];
      expect(firstSection?.items).toBeDefined();
      expect(firstSection?.items?.length).toBeGreaterThan(0);

      // Should have content before variables
      const firstItem = firstSection?.items?.[0];
      expect(firstItem?.type).toBe('content');
      if (firstItem?.type === 'content') {
        expect(firstItem.html).toContain('description');
      }
    });

    it('should extract content with bold and formatting', () => {
      const content = `## Section

**Bold text** and *italic text*.

x = 10`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      const section = result.data?.sections[0];
      expect(section?.items).toBeDefined();

      const contentItem = section?.items?.[0];
      expect(contentItem?.type).toBe('content');
      if (contentItem?.type === 'content') {
        expect(contentItem.html).toContain('<strong>Bold text</strong>');
        expect(contentItem.html).toContain('<em>italic text</em>');
      }
    });

    it('should extract content at the end of a section', () => {
      const content = `## Section

x = 10
y = 20

This is content at the end of the section.
More text here.`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      const section = result.data?.sections[0];
      expect(section?.items).toBeDefined();
      expect(section?.items?.length).toBe(3);

      // Last item should be content
      const lastItem = section?.items?.[2];
      expect(lastItem?.type).toBe('content');
      if (lastItem?.type === 'content') {
        expect(lastItem.html).toContain('content at the end');
        expect(lastItem.html).toContain('More text here');
      }
    });

    it('should handle content only sections (no variables)', () => {
      const content = `## Introduction

This is an introduction paragraph.

**Key points:**
- Point 1
- Point 2

## Calculations

x = 10`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(2);

      const introSection = result.data?.sections[0];
      expect(introSection?.variables).toHaveLength(0);
      expect(introSection?.items?.length).toBeGreaterThan(0);

      const contentItem = introSection?.items?.[0];
      expect(contentItem?.type).toBe('content');
    });

    it('should skip empty/whitespace-only content', () => {
      const content = `## Section




x = 10`;

      const result = parseFile(content, 'test.md');

      expect(result.success).toBe(true);
      const section = result.data?.sections[0];

      // Should only have the variable, not empty content
      expect(section?.items?.length).toBe(1);
      expect(section?.items?.[0]?.type).toBe('variable');
    });
  });
});
