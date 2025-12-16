# @calculateit/web-component

Platform-agnostic web component for interactive calculators built with Lit. Create reactive calculators from markdown or org-mode files that work in any framework or vanilla JavaScript.

## Features

✨ **Pure Web Component** - Built with Lit, works everywhere (React, Vue, Angular, vanilla JS)
🎨 **25+ CSS Custom Properties** - Complete styling control with CSS variables
📱 **Responsive** - Mobile-friendly with horizontal/vertical layouts
⚡ **Reactive** - Automatic recalculation on input changes
🎯 **Type-Safe** - Full TypeScript support
🔧 **Flexible** - Multiple formatters, custom callbacks, event-driven
🪶 **Lightweight** - ~60-80KB bundled (includes Lit)

## Installation

### npm Package

```bash
# pnpm
pnpm add @calculateit/web-component @calculateit/parser-js

# npm
npm install @calculateit/web-component @calculateit/parser-js

# yarn
yarn add @calculateit/web-component @calculateit/parser-js
```

### CDN (jsDeliver)

No build tools needed! Load directly from CDN:

```html
<script type="module">
  import { parseFile } from 'https://cdn.jsdelivr.net/npm/@calculateit/parser-js/+esm';
  import 'https://cdn.jsdelivr.net/npm/@calculateit/web-component/+esm';

  const result = parseFile('a = 10\nb = 20\nsum = a + b', 'calc.md');
  document.querySelector('calculate').document = result.data;
</script>

<calculate decimal-places="2"></calculate>
```

See [examples/cdn-jsdelivr.html](examples/cdn-jsdelivr.html) for a complete CDN example.

## Quick Start

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { parseFile } from '@calculateit/parser-js';
    import '@calculateit/web-component';

    const markdown = `
# Investment Calculator

principal = 10000
rate = 5.5
years = 10

future_value = principal * (1 + rate / 100) ^ years
    `;

    const result = parseFile(markdown, 'calc.md');
    const calc = document.getElementById('calc');
    calc.document = result.data;
  </script>
</head>
<body>
  <calculate id="calc" decimal-places="2"></calculate>
</body>
</html>
```

### React

```tsx
import { useRef, useEffect } from 'react';
import { parseFile } from '@calculateit/parser-js';
import '@calculateit/web-component';

function Calculator() {
  const calcRef = useRef<HTMLElementTagNameMap['calculate']>(null);

  useEffect(() => {
    const markdown = `...`;
    const result = parseFile(markdown, 'calc.md');

    if (calcRef.current && result.success) {
      calcRef.current.document = result.data;
      calcRef.current.onValuesChange = (values) => {
        console.log('Values:', values);
      };
    }
  }, []);

  return <calculate ref={calcRef} decimal-places={2} show-formula />;
}
```

### Vue

```vue
<template>
  <calculate
    ref="calc"
    :decimal-places="2"
    show-formula
    @values-change="handleChange"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { parseFile } from '@calculateit/parser-js';
import '@calculateit/web-component';

const calc = ref(null);

onMounted(() => {
  const result = parseFile(markdown, 'calc.md');
  calc.value.document = result.data;
});

function handleChange(e) {
  console.log('Values:', e.detail.values);
}
</script>
```

## API Reference

### Properties & Attributes

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `document` | - | `ParsedDocument` | - | Parsed document object (JS property only) |
| `documentJson` | `document-json` | `string` | - | Document as JSON string (HTML attribute) |
| `initialValues` | - | `Record<string, number>` | `{}` | Initial input values |
| `decimalPlaces` | `decimal-places` | `number` | `6` | Decimal places for default formatter |
| `showFormula` | `show-formula` | `boolean` | `false` | Show formulas under results |
| `direction` | `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `formatter` | `formatter` | `FormatterName` | `'default'` | Named formatter to use |
| `formatResult` | - | `Function` | - | Custom formatter function (JS only) |
| `onValuesChange` | - | `Function` | - | Callback when inputs change (JS only) |
| `onCalculationsChange` | - | `Function` | - | Callback when calculations update (JS only) |

### Named Formatters

Set via the `formatter` attribute:

- `default` - Fixed decimal places (uses `decimalPlaces`)
- `currency` - Currency format: `$123.45`
- `percentage` - Percentage format: `12.34%`
- `compact` - Compact notation: `1.2k`, `5.4M`, `2.1B`
- `scientific` - Scientific notation: `1.23e+10`

```html
<calculate formatter="currency"></calculate>
```

### Events

All events bubble and are composed (cross shadow DOM).

#### `values-change`

Fired when input values change.

```typescript
interface ValuesChangeEventDetail {
  values: Record<string, number>;
  timestamp: number;
}
```

```javascript
calc.addEventListener('values-change', (e) => {
  console.log(e.detail.values);
});
```

#### `calculations-change`

Fired when calculations update.

```typescript
interface CalculationsChangeEventDetail {
  calculations: Record<string, number>;
  timestamp: number;
}
```

### Methods

#### `getValues()`

Returns current input values.

```javascript
const values = calc.getValues();
```

#### `getCalculations()`

Returns current calculated values.

```javascript
const calculations = calc.getCalculations();
```

#### `setValues(values)`

Sets input values programmatically.

```javascript
calc.setValues({ principal: 50000, rate: 7.5 });
```

#### `recalculate()`

Forces recalculation.

```javascript
calc.recalculate();
```

## CSS Custom Properties API

The `<calculate>` element exposes 25+ CSS variables for complete styling control.

### Colors

| Variable | Default | Description |
|----------|---------|-------------|
| `--calculate-bg-color` | `#fff` | Background color |
| `--calculate-text-color` | `#000` | Text color |
| `--calculate-input-bg` | `#f8f9fa` | Input background |
| `--calculate-input-border` | `#dee2e6` | Input border color |
| `--calculate-input-text` | `#000` | Input text color |
| `--calculate-input-focus-border` | `#0066cc` | Input focus border |
| `--calculate-result-bg` | `#e8f5e9` | Result background |
| `--calculate-result-color` | `#2e7d32` | Result text color |
| `--calculate-negative-bg` | `#fee2e2` | Negative value background |
| `--calculate-negative-color` | `#991b1b` | Negative value text |
| `--calculate-heading-color` | `inherit` | Section heading color |

### Spacing

| Variable | Default | Description |
|----------|---------|-------------|
| `--calculate-gap` | `2rem` | Gap between sections |
| `--calculate-section-gap` | `0.75rem` | Gap between fields |
| `--calculate-padding` | `0.75rem` | Field padding |
| `--calculate-input-padding` | `0.5rem` | Input padding |

### Typography

| Variable | Default | Description |
|----------|---------|-------------|
| `--calculate-font-family` | `system-ui, sans-serif` | Font family |
| `--calculate-font-mono` | `Monaco, monospace` | Monospace font |
| `--calculate-result-font-size` | `1.25rem` | Result font size |
| `--calculate-title-font-size` | `0.75rem` | Title font size |
| `--calculate-formula-font-size` | `0.75rem` | Formula font size |

### Layout & Effects

| Variable | Default | Description |
|----------|---------|-------------|
| `--calculate-border-radius` | `0.375rem` | Border radius |
| `--calculate-border-width` | `1px` | Border width |
| `--calculate-min-column-width` | `200px` | Min column width |
| `--calculate-title-opacity` | `0.7` | Title opacity |
| `--calculate-formula-opacity` | `0.6` | Formula opacity |

## Theming Examples

### Dark Mode

```css
calculate.dark-mode {
  --calculate-bg-color: #1a1a1a;
  --calculate-text-color: #e5e5e5;
  --calculate-input-bg: #2d2d2d;
  --calculate-input-border: #404040;
  --calculate-result-bg: #1e3a20;
  --calculate-result-color: #4ade80;
}
```

### Brand Colors

```css
calculate {
  --calculate-result-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --calculate-result-color: white;
  --calculate-border-radius: 12px;
  --calculate-input-focus-border: #667eea;
}
```

### Compact Layout

```css
calculate.compact {
  --calculate-gap: 1rem;
  --calculate-padding: 0.5rem;
  --calculate-result-font-size: 1rem;
  --calculate-min-column-width: 150px;
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  CalculateElementProps,
  ValuesChangeEventDetail,
  CalculationsChangeEventDetail,
  ParsedDocument,
  Variable,
  Section,
} from '@calculateit/web-component';

// Type-safe event listeners
const calc = document.querySelector('calculate')!;
calc.addEventListener('values-change', (e: CustomEvent<ValuesChangeEventDetail>) => {
  console.log(e.detail.values);
});
```

## Advanced Usage

### Custom Formatter Function

```javascript
calc.formatResult = (value, variableName) => {
  if (variableName.includes('rate')) {
    return `${value.toFixed(2)}%`;
  }
  if (variableName.includes('price')) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
  return value.toFixed(6);
};
```

### Dynamic Document Updates

```javascript
// Parse new markdown
const newResult = parseFile(newMarkdown, 'calc.md');

// Update document
calc.document = newResult.data;

// Values are preserved, calculations update automatically
```

### Combining with Other Libraries

```javascript
// Use with Chart.js
calc.addEventListener('calculations-change', (e) => {
  updateChart(e.detail.calculations);
});

// Use with form validation
calc.addEventListener('values-change', (e) => {
  validateForm(e.detail.values);
});
```

## Examples

See the `/examples` directory for complete examples:

- `vanilla.html` - Pure HTML/JS usage
- `react.html` - React integration
- `theming.html` - CSS customization showcase

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires support for:
- Web Components (Custom Elements v1)
- Shadow DOM
- ES2020

## License

MIT

## Related Packages

- [@calculateit/parser-js](../parsers/js) - Parser and expression evaluator
- [@calculateit/react](../react) - React components
