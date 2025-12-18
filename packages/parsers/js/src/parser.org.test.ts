import { describe, it, expect } from 'vitest';
import { parseFile, parseOrgFile } from './parser';

describe('Org-mode Parser', () => {
  describe('Basic Parsing', () => {
    it('should parse org with single section', () => {
      const content = `** Input Values

x = 10
y = 5`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.format).toBe('org');
      expect(result.data?.sections).toHaveLength(1);
      expect(result.data?.sections[0].name).toBe('Input Values');
      expect(result.data?.variables).toHaveLength(2);
    });

    it('should parse org with multiple sections', () => {
      const content = `** Inputs

price = 100
quantity = 5

** Calculations

total = price * quantity
tax = total * 0.08
grandTotal = total + tax`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(2);
      expect(result.data?.sections[0].name).toBe('Inputs');
      expect(result.data?.sections[1].name).toBe('Calculations');
      expect(result.data?.variables).toHaveLength(5);
    });

    it('should handle different heading levels', () => {
      const content = `** Level 2

x = 1

*** Level 3

y = 2

**** Level 4

z = 3`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(3);
      expect(result.data?.sections[0].level).toBe(2);
      expect(result.data?.sections[1].level).toBe(3);
      expect(result.data?.sections[2].level).toBe(4);
    });
  });

  describe('Variable Detection', () => {
    it('should auto-detect input variables', () => {
      const content = `** Variables

inputValue = 42
calculated = inputValue * 2
anotherInput = 100`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.inputVariables).toContain('inputValue');
      expect(result.data?.inputVariables).toContain('anotherInput');
      expect(result.data?.inputVariables).not.toContain('calculated');
    });

    it('should detect decimal inputs', () => {
      const content = `** Inputs

rate = 0.08
price = 99.99
count = 5`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.inputVariables).toHaveLength(3);
    });

    it('should respect explicit inputs option', () => {
      const content = `** Variables

x = a + b
y = 5`;

      const result = parseFile(content, 'test.org', {
        explicitInputs: ['x'],
        autoDetectInputs: false,
      });

      expect(result.success).toBe(true);
      expect(result.data?.inputVariables).toEqual(['x']);
    });
  });

  describe('Hidden Sections', () => {
    it('should parse hidden sections with :hidden: tag', () => {
      const content = `** Visible Section

x = 10

*** Hidden Calculations :hidden:

intermediate = x * 2
temp = intermediate + 5

** Final Result

result = temp * 3`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(3);
      expect(result.data?.sections[0].hidden).toBeFalsy();
      expect(result.data?.sections[1].hidden).toBe(true);
      expect(result.data?.sections[2].hidden).toBeFalsy();
    });

    it('should handle multiple tags including hidden', () => {
      const content = `** Section :tag1:hidden:tag2:

x = 5`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections[0].hidden).toBe(true);
    });
  });

  describe('Section Names with Emojis', () => {
    it('should strip emojis from section names', () => {
      const content = `** 📊 Data Analysis

data = 100

*** 🎯 Target Values

target = 200`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections[0].name).toBe('Data Analysis');
      expect(result.data?.sections[1].name).toBe('Target Values');
    });
  });

  describe('Org-mode Specific Features', () => {
    it('should skip org directives starting with #', () => {
      const content = `** Section

#+TITLE: My Document
#+AUTHOR: John Doe
x = 10
#+OPTIONS: toc:nil
y = 20`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.variables).toHaveLength(2);
    });

    it('should handle org tags correctly', () => {
      const content = `** Project Alpha :work:project:

budget = 50000

** Private Notes :personal:hidden:

notes = 123`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections[0].hidden).toBeFalsy();
      expect(result.data?.sections[1].hidden).toBe(true);
    });
  });

  describe('Complex Calculations', () => {
    it('should parse financial calculator example', () => {
      const content = `** Initial Investment

principal = 10000
annualRate = 7.5
years = 10

** Growth Calculation :hidden:

monthlyRate = annualRate / 12 / 100
months = years * 12

** Results

futureValue = principal * (1 + monthlyRate)^months
totalGain = futureValue - principal
returnPercent = (totalGain / principal) * 100`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(3);
      expect(result.data?.sections[1].hidden).toBe(true);
      expect(result.data?.inputVariables).toHaveLength(3);

      const calculations = result.data?.variables.filter(v => !v.isInput);
      expect(calculations).toHaveLength(5);
    });
  });

  describe('Edge Cases', () => {
    it('should skip empty lines', () => {
      const content = `** Section


x = 10


y = 20


`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.variables).toHaveLength(2);
    });

    it('should skip malformed headers without space', () => {
      const content = `** Valid Section

x = 10
*NotAHeader
**AlsoNotAHeader
y = 20`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.variables).toHaveLength(2);
    });

    it('should handle variables with underscores and numbers', () => {
      const content = `** Variables

my_var_1 = 10
another_var_2 = 20
final_result_123 = my_var_1 + another_var_2`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.variables).toHaveLength(3);
    });

    it('should preserve variable order within sections', () => {
      const content = `** Section

first = 1
second = 2
third = 3`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.variables[0].order).toBe(0);
      expect(result.data?.variables[1].order).toBe(1);
      expect(result.data?.variables[2].order).toBe(2);
    });

    it('should preserve section order', () => {
      const content = `** First Section

x = 1

** Second Section

y = 2

** Third Section

z = 3`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections[0].order).toBe(0);
      expect(result.data?.sections[1].order).toBe(1);
      expect(result.data?.sections[2].order).toBe(2);
    });
  });

  describe('parseOrgFile convenience function', () => {
    it('should parse org content', () => {
      const content = `** Section

x = 10
y = 20`;

      const result = parseOrgFile(content);

      expect(result.success).toBe(true);
      expect(result.data?.variables).toHaveLength(2);
    });
  });

  describe('Format Auto-detection', () => {
    it('should detect org format from content without filename', () => {
      const content = `
** Section

x = 10`;

      const result = parseFile(content);

      expect(result.success).toBe(true);
      expect(result.data?.format).toBe('org');
    });
  });

  describe('Error Handling', () => {
    it('should return success even with no sections', () => {
      const content = `Just some text
without sections
or variables`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(0);
      expect(result.data?.variables).toHaveLength(0);
    });

    it('should handle empty content', () => {
      const result = parseFile('', 'test.org');

      expect(result.success).toBe(true);
      expect(result.data?.sections).toHaveLength(0);
    });
  });

  describe('Org Content Extraction', () => {
    it('should extract content at the end of org sections', () => {
      const content = `** Section

x = 10
y = 20

This is content at the end.
With multiple lines.`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      const section = result.data?.sections[0];
      expect(section?.items?.length).toBe(3);

      const lastItem = section?.items?.[2];
      expect(lastItem?.type).toBe('content');
      if (lastItem?.type === 'content') {
        expect(lastItem.html).toContain('content at the end');
      }
    });

    it('should handle org content with formatting', () => {
      const content = `** Introduction

Some text with content.

x = 10`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      const section = result.data?.sections[0];
      const contentItem = section?.items?.[0];
      expect(contentItem?.type).toBe('content');
    });

    it('should skip empty content in org mode', () => {
      const content = `** Section



x = 10`;

      const result = parseFile(content, 'test.org');

      expect(result.success).toBe(true);
      const section = result.data?.sections[0];
      expect(section?.items?.length).toBe(1);
      expect(section?.items?.[0]?.type).toBe('variable');
    });
  });
});
