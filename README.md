# ⚡ CalculateIt

<div align="center">

[![CI](https://github.com/calculateit-dev/calculateit/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/calculateit-dev/calculateit/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-137%20passed-brightgreen?style=flat&colorA=18181B&colorB=10b981)](https://github.com/calculateit-dev/calculateit)
[![Coverage](https://img.shields.io/badge/coverage-99%25-brightgreen?style=flat&colorA=18181B&colorB=10b981)](https://github.com/calculateit-dev/calculateit)
[![npm version](https://img.shields.io/npm/v/@calculateit/react?style=flat&colorA=18181B&colorB=10b981)](https://www.npmjs.com/package/@calculateit/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat&colorA=18181B&colorB=f59e0b)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=flat&colorA=18181B&colorB=3b82f6&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-61dafb?style=flat&colorA=18181B&colorB=06b6d4&logo=react&logoColor=white)](https://react.dev/)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc3534.svg?style=flat&colorA=18181B&colorB=f97316&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Turbo](https://img.shields.io/badge/built%20with-Turbo-ef4444?style=flat&colorA=18181B&colorB=ef4444)](https://turbo.build/)

</div>

> Define calculators in plain text. Get interactive UIs for free.

**CalculateIt** introduces **CalculateIt Flavored Markdown (CTFM)**—a revolutionary way to build interactive calculators using nothing but text. Write formulas in markdown, get a beautiful, reactive calculator UI instantly. No JSON schemas, no complex configurations, just pure, readable text.

## 💡 Meet CalculateIt Flavored Markdown (CTFM)

**Stop writing calculator UIs. Start writing calculator documents.**

CTFM is a simple, intuitive text format that turns markdown documents into living, breathing calculators. Define your variables, write your formulas, and CalculateIt handles the rest—parsing, dependency resolution, real-time updates, and UI rendering.

```markdown
## Inputs
price = 100
quantity = 5

## Calculation
total = price * quantity
tax = total * 0.08
grandTotal = total + tax
```

That's it. No JSX. No state management. No forms. Just **text that calculates**.

## ✨ Why CTFM Changes Everything

- 📝 **Text-First Design**: Define calculators in plain markdown—human-readable, version-controllable, LLM-friendly
- 🎯 **Zero Configuration**: No schemas, no builders, no drag-and-drop. Just write formulas like you'd write them on paper
- 🔄 **Automatic Dependencies**: CTFM figures out calculation order automatically—no manual dependency graphs
- 🎨 **Instant UI**: Get a beautiful, responsive interface without writing a single line of JSX
- 🧠 **AI-Ready**: Generate calculators with LLMs or let users describe their needs in natural language
- 📱 **Deploy Anywhere**: CTFM documents are portable—same calculator on web, mobile, or CLI

## 🎬 Quick Start

```bash
pnpm install @calculateit/react
```

**Step 1:** Write your calculator in CTFM (it's just markdown with formulas!)

```markdown
# Mortgage Calculator

## Loan Details

principal = 300000
rate = 4.5
years = 30

## Monthly Payment

monthlyRate = rate / 1200
numPayments = years * 12
payment = principal * monthlyRate / (1 - (1 + monthlyRate)^(-numPayments))
totalPaid = payment * numPayments
totalInterest = totalPaid - principal
```

**Step 2:** Parse and render

```tsx
import { Calculator, parseFile } from '@calculateit/react';
import '@calculateit/react/calculator.css';

const markdown = `...`; // Your markdown from above

function App() {
  const result = parseFile(markdown, 'mortgage.md');
  return <Calculator document={result.data} decimalPlaces={2} />;
}
```

**That's it.** You just built a mortgage calculator with automatic calculations, real-time updates, and a beautiful UI.

## 📖 CTFM Syntax Guide

CalculateIt Flavored Markdown is designed to feel natural. Here's everything you need to know:

### Basic Structure
```markdown
# Calculator Title (optional)

## Section Name
variable = value or formula
anotherVar = calculation using other variables

## Another Section
result = some math expression
```

### Features
- **Sections**: Use markdown headers (`##` to `######`) to organize your calculator
- **Variables**: Simple assignments like `tax = 0.08` or `total = price * quantity`
- **Formulas**: Use standard math operators (`+`, `-`, `*`, `/`, `^` for power)
- **Functions**: Support for common functions (`sqrt`, `abs`, `min`, `max`, `sin`, `cos`, etc.)
- **Comments**: Regular markdown text and formatting are preserved for documentation
- **Hidden Sections**: Add `:hidden:` to section headers for internal calculations

### Example: Multi-Step Calculation
```markdown
# Investment Calculator

## Initial Investment
principal = 10000
annualRate = 7.5
years = 10

## Growth Calculation :hidden:
monthlyRate = annualRate / 12 / 100
months = years * 12

## Results
futureValue = principal * (1 + monthlyRate)^months
totalGain = futureValue - principal
returnPercent = (totalGain / principal) * 100
```

CTFM automatically figures out the calculation order, detects circular dependencies, and only recalculates what's needed when values change.

## 🎨 Beyond the Basics

### 🎛️ Flexible Sections
Organize calculations into logical groups. Each section can have its own heading level, making complex calculators easy to understand.

### 💅 Customizable Styling
Use our default theme or bring your own. Built with CSS variables for easy theming. CTFM focuses on logic—you control the look.

### 🔍 Formula Visibility
Toggle formula display on/off. Perfect for educational tools or when you want users to see the math behind the magic.

### 📐 Precision Control
Set decimal places globally or format each variable uniquely with custom formatters.

### 🎭 Custom Result Formatting
```tsx
<Calculator
  document={result.data}
  formatResult={(value, varName) => {
    if (varName.includes('Price')) return `$${value.toFixed(2)}`;
    if (varName.includes('Percent')) return `${value.toFixed(1)}%`;
    return value.toFixed(2);
  }}
/>
```

## 🏗️ Built for Scale

**Monorepo Architecture**
- `@calculateit/parser-js` - Core calculation engine
- `@calculateit/react` - React components and hooks
- More parsers coming soon (Python, Excel formulas, and more!)

**Modern Tooling**
- ⚡ Vite for lightning-fast builds
- 📚 Storybook for component development
- 🔄 Turbo for optimized monorepo workflows
- 💪 TypeScript for bulletproof type safety

## 🚀 Why Text-Based Calculators Matter

**CTFM unlocks possibilities that traditional UI-first approaches can't touch:**

### 🤖 AI-Generated Calculators
Let users describe what they need in plain English. Use GPT/Claude to generate CTFM documents on the fly. Instant custom calculators without writing code.

### 📝 Version Control & Collaboration
CTFM documents are just text files. Use Git, review changes in PRs, collaborate with non-developers. Your calculator logic is as reviewable as your code.

### 🔄 Platform Independence
Write once, run anywhere. The same CTFM document works in React, Vue, Svelte, or even CLI tools. Your calculator logic is decoupled from the UI framework.

### 📚 Documentation That Calculates
Embed calculators directly in your docs. Technical specifications that users can interact with. Tutorials that compute real results.

### 🎯 User-Editable Calculators
Let power users customize calculations. Store CTFM in your database. Build calculator marketplaces. The possibilities are endless.

## 🎯 Perfect For

- 💰 **Financial Calculators**: Mortgages, loans, ROI, compound interest—CTFM makes complex finance formulas readable
- 🏗️ **Engineering Tools**: Unit conversions, material calculators, load estimators—formulas engineers can actually review
- 📊 **Business Applications**: Pricing tools, quote generators, configurators—let sales teams tweak the logic
- 🎓 **Educational Apps**: Interactive math lessons, formula explorers—students can see and edit the formulas
- 🏥 **Healthcare**: BMI calculators, dosage calculators, risk assessments—formulas that clinicians can verify
- 🤖 **AI-Powered Tools**: Generate custom calculators on demand—CTFM is the perfect LLM output format

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Start Storybook for component development
pnpm storybook

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck
```

## 📦 Packages

| Package                  | Description                  | Version |
|--------------------------|------------------------------|---------|
| `@calculateit/react`     | React components and hooks   | 1.0.0   |
| `@calculateit/parser-js` | JavaScript expression parser | 1.0.0   |
    
## 📦 Publishing

This project uses GitHub Actions to automatically publish packages to npm with automatic version management.

### Setup

1. **Create an npm access token:**
   - Go to [npmjs.com](https://www.npmjs.com/) and log in
   - Navigate to Access Tokens → Generate New Token
   - Choose "Automation" type
   - Copy the token

2. **Add token to GitHub:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Create a new repository secret named `NPM_TOKEN`
   - Paste your npm token

### Publishing Workflow

The publish workflow:
1. Runs tests and builds
2. Publishes the current version from `package.json`
3. Creates a git tag for the release (`v1.0.0`)
4. Auto-bumps to the next patch version (`1.0.0` → `1.0.1`)
5. Commits and pushes the version bump

**To publish:**
1. Ensure the version in `packages/react/package.json` is what you want to publish
2. Trigger the workflow:
   - **Automatic:** Create a new [GitHub Release](../../releases/new)
   - **Manual:** Go to Actions → Publish to npm → Run workflow

The workflow automatically handles version bumping to prevent conflicts between multiple engineers.

## 🤝 Contributing

We love contributions! Whether it's bug fixes, new features, or documentation improvements—all PRs are welcome.

All pull requests are automatically validated with CI checks (type checking, builds, Storybook).

## 📄 License

MIT © CalculateIt

---

<div align="center">

**Stop building calculator UIs. Start writing CTFM.**

[Documentation](#) • [CTFM Playground](#) • [Examples](#) • [GitHub](#)

Built with ❤️ for developers who believe calculators should be as simple as markdown

*Because if you can write markdown, you can build calculators.*

</div>
