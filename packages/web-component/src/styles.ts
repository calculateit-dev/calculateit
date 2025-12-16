import { css } from 'lit';

/**
 * Component styles with comprehensive CSS custom properties
 * Embeds minimal Pico CSS subset and ports all styles from React package
 */
export const styles = css`
  /* ===== CSS Custom Properties API ===== */
  :host {
    /* Colors */
    --calculate-bg-color: #fff;
    --calculate-text-color: #000;

    /* Input fields */
    --calculate-input-bg: #f8f9fa;
    --calculate-input-border: #dee2e6;
    --calculate-input-text: #000;
    --calculate-input-focus-border: #0066cc;

    /* Calculated results */
    --calculate-result-bg: #e8f5e9;
    --calculate-result-color: #2e7d32;
    --calculate-result-font-size: 1.25rem;

    /* Negative values */
    --calculate-negative-bg: #fee2e2;
    --calculate-negative-color: #991b1b;

    /* Section headings */
    --calculate-heading-color: inherit;
    --calculate-heading-font-weight: 600;

    /* Spacing */
    --calculate-gap: 2rem;
    --calculate-section-gap: 0.75rem;
    --calculate-padding: 0.75rem;
    --calculate-input-padding: 0.5rem;

    /* Typography */
    --calculate-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --calculate-font-mono: 'Monaco', 'Courier New', monospace;
    --calculate-title-font-size: 0.75rem;
    --calculate-formula-font-size: 0.75rem;

    /* Borders */
    --calculate-border-radius: 0.375rem;
    --calculate-border-width: 1px;

    /* Layout */
    --calculate-min-column-width: 200px;
    --calculate-max-columns: auto-fit;

    /* Effects */
    --calculate-input-opacity-unfocused: 0.8;
    --calculate-title-opacity: 0.7;
    --calculate-formula-opacity: 0.6;

    /* Display */
    display: block;
    font-family: var(--calculate-font-family);
    color: var(--calculate-text-color);
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
    padding: var(--calculate-input-padding);
    font-size: 1rem;
    font-family: var(--calculate-font-family);
    color: var(--calculate-input-text);
    background-color: var(--calculate-input-bg);
    border: var(--calculate-border-width) solid var(--calculate-input-border);
    border-radius: var(--calculate-border-radius);
    outline: none;
    transition: border-color 0.2s ease;
  }

  input[type='number']:focus {
    border-color: var(--calculate-input-focus-border);
  }

  /* Headings */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 1rem 0;
    font-weight: var(--calculate-heading-font-weight);
    color: var(--calculate-heading-color);
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
    gap: var(--calculate-gap);
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

  /* Section Layout */
  .section-content {
    display: grid;
    grid-template-columns: repeat(
      var(--calculate-max-columns),
      minmax(var(--calculate-min-column-width), 1fr)
    );
    gap: var(--calculate-section-gap);
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
    background-color: var(--calculate-negative-bg);
    color: var(--calculate-negative-color);
  }

  .input-label {
    position: absolute;
    left: var(--calculate-input-padding);
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.5);
  }

  .input-field input:focus + .input-label,
  .input-field input.has-value + .input-label {
    top: 0.25rem;
    font-size: 0.75rem;
    transform: translateY(0);
  }

  /* Input Result Display */
  .input-result {
    padding: var(--calculate-input-padding);
    border-radius: var(--calculate-border-radius);
    font-weight: 600;
    font-size: 0.875rem;
    font-family: var(--calculate-font-mono);
    text-align: right;
    white-space: nowrap;
    min-width: 4rem;
    opacity: var(--calculate-input-opacity-unfocused);
  }

  /* ===== Calculated Field ===== */
  .calc-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: var(--calculate-padding);
    background: var(--calculate-bg-color);
    border-radius: var(--calculate-border-radius);
  }

  .calc-title {
    font-size: var(--calculate-title-font-size);
    font-weight: 600;
    text-transform: capitalize;
    opacity: var(--calculate-title-opacity);
  }

  /* Calculated Result Display */
  .calc-result {
    padding: var(--calculate-input-padding);
    background: var(--calculate-result-bg);
    border-radius: var(--calculate-border-radius);
    font-weight: 700;
    font-size: var(--calculate-result-font-size);
    color: var(--calculate-result-color);
    font-family: var(--calculate-font-mono);
    text-align: center;
  }

  .calc-result.negative {
    background-color: var(--calculate-negative-bg);
    color: var(--calculate-negative-color);
  }

  .calc-formula {
    font-size: var(--calculate-formula-font-size);
    font-family: var(--calculate-font-mono);
    opacity: var(--calculate-formula-opacity);
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
