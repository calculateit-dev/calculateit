import { css } from 'lit';

/**
 * Component styles with comprehensive CSS custom properties
 * Embeds minimal Pico CSS subset and ports all styles from React package
 */
export const styles = css`
  /* ===== CSS Custom Properties API ===== */
  :host {
    /* Colors */
    --calculate-it-bg-color: #fff;
    --calculate-it-text-color: #000;

    /* Input fields */
    --calculate-it-input-bg: #f8f9fa;
    --calculate-it-input-border: #dee2e6;
    --calculate-it-input-text: #000;
    --calculate-it-input-focus-border: #0066cc;
    --calculate-it-input-label-color: rgba(0, 0, 0, 0.5);
    --calculate-it-input-label-focus-color: rgba(0, 0, 0, 0.7);

    /* Calculated results */
    --calculate-it-result-bg: #e8f5e9;
    --calculate-it-result-color: #2e7d32;
    --calculate-it-result-font-size: 1.25rem;

    /* Negative values */
    --calculate-it-negative-bg: #fee2e2;
    --calculate-it-negative-color: #991b1b;

    /* Section headings */
    --calculate-it-heading-color: inherit;
    --calculate-it-heading-font-weight: 600;

    /* Spacing */
    --calculate-it-gap: 2rem;
    --calculate-it-section-gap: 0.75rem;
    --calculate-it-padding: 0.75rem;
    --calculate-it-input-padding: 0.5rem;

    /* Typography */
    --calculate-it-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --calculate-it-font-mono: 'Monaco', 'Courier New', monospace;
    --calculate-it-title-font-size: 0.75rem;
    --calculate-it-formula-font-size: 0.75rem;

    /* Borders */
    --calculate-it-border-radius: 0.375rem;
    --calculate-it-border-width: 1px;

    /* Layout */
    --calculate-it-min-column-width: 200px;
    --calculate-it-max-columns: auto-fit;
    --calculate-it-vertical-max-columns: 2;

    /* Effects */
    --calculate-it-input-opacity-unfocused: 0.8;
    --calculate-it-title-opacity: 0.7;
    --calculate-it-formula-opacity: 0.6;

    /* Display */
    display: block;
    font-family: var(--calculate-it-font-family);
    color: var(--calculate-it-text-color);
  }

  /* ===== Minimal Pico CSS Reset ===== */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Form elements */
  input[type='number'] {
    display: block;
    width: 100%;
    padding: var(--calculate-it-input-padding);
    font-size: 1rem;
    font-family: var(--calculate-it-font-family);
    color: var(--calculate-it-input-text);
    background-color: var(--calculate-it-input-bg);
    border: var(--calculate-it-border-width) solid var(--calculate-it-input-border);
    border-radius: var(--calculate-it-border-radius);
    outline: none;
    transition: border-color 0.2s ease;
  }

  input[type='number']:focus {
    border-color: var(--calculate-it-input-focus-border);
  }

  /* Headings */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 1rem 0;
    font-weight: var(--calculate-it-heading-font-weight);
    color: var(--calculate-it-heading-color);
  }

  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.75rem;
  }
  h3 {
    font-size: 1.5rem;
  }
  h4 {
    font-size: 1.25rem;
  }
  h5 {
    font-size: 1.125rem;
  }
  h6 {
    font-size: 1rem;
  }

  /* ===== Calculator Container ===== */
  .calculator {
    display: flex;
    flex-direction: column;
    gap: var(--calculate-it-gap);
  }

  /* Vertical Layout (Default) */
  .calculator--vertical {
    flex-direction: column;
  }

  /* Horizontal Layout */
  .calculator--horizontal {
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .calculator--horizontal {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .calculator--horizontal > .section {
      flex: 1;
      min-width: 300px;
    }
  }

  /* ===== Section ===== */
  .section {
    display: block;
  }

  .section h1,
  .section h2,
  .section h3,
  .section h4,
  .section h5,
  .section h6 {
    margin-bottom: 1rem;
  }

  /* Section Description (Markdown Content) */
  .section-description {
    margin-bottom: 1rem;
  }

  /* Section Layout */
  .section-content {
    display: grid;
    grid-template-columns: repeat(
      var(--calculate-it-max-columns),
      minmax(var(--calculate-it-min-column-width), 1fr)
    );
    gap: var(--calculate-it-section-gap);
  }

  /* Vertical mode: configurable max columns */
  .calculator--vertical .section-content {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    max-width: 100%;
  }

  @media (min-width: 576px) {
    .calculator--vertical .section-content {
      grid-template-columns: repeat(var(--calculate-it-vertical-max-columns), 1fr);
    }
  }

  /* ===== Input Field ===== */
  .input-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .input-wrapper {
    flex: 1;
    position: relative;
  }

  .input-field input {
    width: 100%;
    margin-bottom: 0;
  }

  .input-field input.negative {
    background-color: var(--calculate-it-negative-bg);
    color: var(--calculate-it-negative-color);
  }

  .input-label {
    position: absolute;
    left: var(--calculate-it-input-padding);
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    color: var(--calculate-it-input-label-color);
    background: transparent;
  }

  .input-field input:focus + .input-label,
  .input-field input.has-value + .input-label {
    top: -0.625rem;
    font-size: 0.75rem;
    transform: translateY(0);
    background: var(--calculate-it-bg-color);
    padding: 0 0.25rem;
    color: var(--calculate-it-input-label-focus-color);
    left: calc(var(--calculate-it-input-padding) - 0.25rem);
  }

  /* Input Result Display */
  .input-result {
    padding: var(--calculate-it-input-padding);
    border-radius: var(--calculate-it-border-radius);
    font-weight: 600;
    font-size: 0.875rem;
    font-family: var(--calculate-it-font-mono);
    text-align: right;
    white-space: nowrap;
    min-width: 4rem;
    opacity: var(--calculate-it-input-opacity-unfocused);
  }

  /* ===== Calculated Field ===== */
  .calc-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: var(--calculate-it-padding);
    background: var(--calculate-it-bg-color);
    border-radius: var(--calculate-it-border-radius);
  }

  .calc-title {
    font-size: var(--calculate-it-title-font-size);
    font-weight: 600;
    text-transform: capitalize;
    opacity: var(--calculate-it-title-opacity);
  }

  /* Calculated Result Display */
  .calc-result {
    padding: var(--calculate-it-input-padding);
    background: var(--calculate-it-result-bg);
    border-radius: var(--calculate-it-border-radius);
    font-weight: 700;
    font-size: var(--calculate-it-result-font-size);
    color: var(--calculate-it-result-color);
    font-family: var(--calculate-it-font-mono);
    text-align: center;
  }

  .calc-result.negative {
    background-color: var(--calculate-it-negative-bg);
    color: var(--calculate-it-negative-color);
  }

  .calc-formula {
    font-size: var(--calculate-it-formula-font-size);
    font-family: var(--calculate-it-font-mono);
    opacity: var(--calculate-it-formula-opacity);
    text-align: center;
  }

  /* ===== Mobile Responsive ===== */
  @media (max-width: 768px) {
    .input-field {
      flex-direction: column;
      align-items: stretch;
    }

    .input-result {
      min-width: auto;
      text-align: left;
    }
  }

  /* ===== Accessibility ===== */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }

  @media (prefers-contrast: high) {
    input[type='number'] {
      border-width: 2px;
    }
  }
`;
