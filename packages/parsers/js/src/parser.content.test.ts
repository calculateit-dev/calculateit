import { describe, it, expect } from 'vitest';
import { parseFile } from './parser';

describe('Parser Content Test', () => {
  it('should extract markdown content from story example', () => {
    const markdown = `# Price Calculator

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

    const result = parseFile(markdown);

    expect(result.success).toBe(true);

    // Log the parsed structure
    console.log('\n=== PARSER OUTPUT ===');
    result.data!.sections.forEach(s => {
      console.log(`\nSection: ${s.name} (level ${s.level}, hidden: ${s.hidden || false})`);
      console.log(`  variables: ${s.variables.length}`);
      console.log(`  items: ${s.items?.length || 0}`);

      if (s.items && s.items.length > 0) {
        s.items.forEach((item, idx) => {
          if (item.type === 'content') {
            console.log(`    [${idx}] content (${item.html.length} chars)`);
            console.log(`         ${item.html.substring(0, 100).replace(/\n/g, '\\n')}`);
          } else {
            console.log(`    [${idx}] variable: ${item.variable.name}`);
          }
        });
      }
    });
    console.log('===================\n');

    // The first section should have content
    const priceCalculatorSection = result.data!.sections.find(s => s.name === 'Price Calculator');
    expect(priceCalculatorSection).toBeDefined();
    expect(priceCalculatorSection!.items).toBeDefined();

    // It should have content with the Note
    const contentItems = priceCalculatorSection!.items!.filter(item => item.type === 'content');
    expect(contentItems.length).toBeGreaterThan(0);

    if (contentItems[0].type === 'content') {
      expect(contentItems[0].html).toContain('Note');
    }
  });
});
