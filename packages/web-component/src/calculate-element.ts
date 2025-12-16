import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { ParsedDocument, Section, Variable } from '@calculateit/parser-js';
import { CalculatorState } from './state/calculator-state.js';
import { formatters, type FormatterName } from './utils/formatters.js';
import { toTitleCase, parseDocumentJson } from './utils/helpers.js';
import { styles } from './styles.js';

/**
 * Calculate Web Component
 * Platform-agnostic calculator component built with Lit
 *
 * @element calculate
 *
 * @fires values-change - Fired when input values change
 * @fires calculations-change - Fired when calculations update
 *
 * @cssprop --calculate-bg-color - Background color
 * @cssprop --calculate-text-color - Text color
 * @cssprop --calculate-input-bg - Input background color
 * @cssprop --calculate-result-bg - Result background color
 * @cssprop --calculate-result-color - Result text color
 * @cssprop --calculate-negative-bg - Negative value background
 * @cssprop --calculate-negative-color - Negative value text color
 * @cssprop --calculate-gap - Gap between sections
 * @cssprop --calculate-border-radius - Border radius
 * ... and 20+ more CSS custom properties
 */
@customElement('calculate')
export class CalculateElement extends LitElement {
  static styles = styles;

  // ===== Properties =====

  /**
   * Parsed document object (JavaScript property)
   */
  @property({ type: Object })
  document?: ParsedDocument;

  /**
   * Document as JSON string (HTML attribute alternative)
   */
  @property({ type: String, attribute: 'document-json' })
  documentJson?: string;

  /**
   * Initial input values
   */
  @property({ type: Object })
  initialValues?: Record<string, number>;

  /**
   * Number of decimal places for default formatting
   */
  @property({ type: Number, attribute: 'decimal-places' })
  decimalPlaces: number = 6;

  /**
   * Show formulas under calculated results
   */
  @property({ type: Boolean, attribute: 'show-formula' })
  showFormula: boolean = false;

  /**
   * Layout direction: vertical or horizontal
   */
  @property({ type: String })
  direction: 'vertical' | 'horizontal' = 'vertical';

  /**
   * Named formatter to use (default, currency, percentage, compact, scientific)
   */
  @property({ type: String })
  formatter: FormatterName = 'default';

  // ===== Callback Properties (JavaScript only) =====

  /**
   * Custom result formatter function
   */
  public formatResult?: (value: number, variableName: string) => string;

  /**
   * Callback when input values change
   */
  public onValuesChange?: (values: Record<string, number>) => void;

  /**
   * Callback when calculations change
   */
  public onCalculationsChange?: (calculations: Record<string, number>) => void;

  // ===== Internal State =====

  @state()
  private calculatorState?: CalculatorState;

  @state()
  private focusedInput: string | null = null;

  // ===== Lifecycle =====

  connectedCallback() {
    super.connectedCallback();
    this.initializeState();
  }

  willUpdate(changedProperties: Map<string, unknown>) {
    // Reinitialize state if document changes
    if (
      changedProperties.has('document') ||
      changedProperties.has('documentJson') ||
      changedProperties.has('initialValues')
    ) {
      this.initializeState();
    }
  }

  // ===== Private Methods =====

  private initializeState() {
    const doc = this.resolveDocument();
    if (doc) {
      this.calculatorState = new CalculatorState(
        doc,
        this.initialValues,
        this.handleValuesChangeInternal.bind(this),
        this.handleCalculationsChangeInternal.bind(this)
      );
    }
  }

  private resolveDocument(): ParsedDocument | null {
    if (this.document) {
      return this.document;
    }
    if (this.documentJson) {
      return parseDocumentJson(this.documentJson);
    }
    return null;
  }

  private handleValuesChangeInternal(values: Record<string, number>) {
    // Call user callback
    if (this.onValuesChange) {
      this.onValuesChange(values);
    }

    // Dispatch CustomEvent
    this.dispatchEvent(
      new CustomEvent('values-change', {
        detail: { values, timestamp: Date.now() },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleCalculationsChangeInternal(calculations: Record<string, number>) {
    // Call user callback
    if (this.onCalculationsChange) {
      this.onCalculationsChange(calculations);
    }

    // Dispatch CustomEvent
    this.dispatchEvent(
      new CustomEvent('calculations-change', {
        detail: { calculations, timestamp: Date.now() },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleInputChange(variableName: string, value: number) {
    if (this.calculatorState) {
      this.calculatorState.handleInputChange(variableName, value);
      this.requestUpdate(); // Force re-render
    }
  }

  private handleInputFocus(variableName: string) {
    this.focusedInput = variableName;
  }

  private handleInputBlur() {
    this.focusedInput = null;
  }

  private getResultFormatter(): (value: number, name: string) => string {
    // Custom function takes precedence
    if (this.formatResult) {
      return this.formatResult;
    }

    // Use named formatter
    const namedFormatter = formatters[this.formatter];
    if (namedFormatter) {
      return (value: number, _name: string) => {
        if (this.formatter === 'default') {
          return namedFormatter(value, this.decimalPlaces);
        }
        return namedFormatter(value);
      };
    }

    // Fallback to default
    return (value: number) => value.toFixed(this.decimalPlaces);
  }

  // ===== Rendering =====

  render() {
    const doc = this.resolveDocument();
    if (!doc || !this.calculatorState) {
      return html`<div class="error">No document provided</div>`;
    }

    const calculatorClasses = {
      calculator: true,
      'calculator--vertical': this.direction === 'vertical',
      'calculator--horizontal': this.direction === 'horizontal',
    };

    return html`
      <div class=${classMap(calculatorClasses)}>
        ${doc.sections
          .filter((section) => !section.hidden)
          .map((section) => this.renderSection(section))}
      </div>
    `;
  }

  private renderSection(section: Section) {
    const headingLevel = Math.min(Math.max(section.level || 3, 1), 6);
    const HeadingTag = `h${headingLevel}` as const;

    return html`
      <section class="section">
        <${HeadingTag}>${section.name}</${HeadingTag}>
        <div class="section-content">
          ${section.variables.map((variable) => this.renderVariable(variable))}
        </div>
      </section>
    `;
  }

  private renderVariable(variable: Variable) {
    if (variable.isInput) {
      return this.renderInputField(variable);
    } else {
      return this.renderCalcField(variable);
    }
  }

  private renderInputField(variable: Variable) {
    const value = this.calculatorState!.state.inputValues[variable.name] ?? 0;
    const isNegative = value < 0;
    const isFocused = this.focusedInput === variable.name;
    const hasValue = value !== 0 || isFocused;

    const inputClasses = {
      'has-value': hasValue,
      'negative': isNegative,
    };

    return html`
      <div class="input-field">
        <div class="input-wrapper">
          <input
            type="number"
            id="input-${variable.name}"
            class=${classMap(inputClasses)}
            .value=${value.toString()}
            @input=${(e: Event) => {
              const target = e.target as HTMLInputElement;
              const newValue = parseFloat(target.value);
              this.handleInputChange(variable.name, isNaN(newValue) ? 0 : newValue);
            }}
            @focus=${() => this.handleInputFocus(variable.name)}
            @blur=${() => this.handleInputBlur()}
            step="any"
          />
          <label class="input-label" for="input-${variable.name}">
            ${variable.name}
          </label>
        </div>
      </div>
    `;
  }

  private renderCalcField(variable: Variable) {
    const value = this.calculatorState!.state.calculatedValues[variable.name] ?? 0;
    const formatter = this.getResultFormatter();
    const formattedValue = formatter(value, variable.name);
    const title = toTitleCase(variable.name);
    const isNegative = value < 0;

    const resultClasses = {
      'calc-result': true,
      'negative': isNegative,
    };

    return html`
      <div class="calc-field">
        <div class="calc-title">${title}</div>
        <div class=${classMap(resultClasses)}>${formattedValue}</div>
        ${this.showFormula
          ? html`<div class="calc-formula">${variable.expression}</div>`
          : nothing}
      </div>
    `;
  }

  // ===== Public API Methods =====

  /**
   * Get current input values
   */
  public getValues(): Record<string, number> {
    return this.calculatorState?.getInputValues() || {};
  }

  /**
   * Get current calculated values
   */
  public getCalculations(): Record<string, number> {
    return this.calculatorState?.getCalculatedValues() || {};
  }

  /**
   * Set input values programmatically
   */
  public setValues(values: Record<string, number>) {
    if (this.calculatorState) {
      Object.entries(values).forEach(([name, value]) => {
        this.calculatorState!.handleInputChange(name, value);
      });
      this.requestUpdate();
    }
  }

  /**
   * Force recalculation
   */
  public recalculate() {
    if (this.calculatorState) {
      this.calculatorState.recalculate();
      this.requestUpdate();
    }
  }
}

// TypeScript type augmentation
declare global {
  interface HTMLElementTagNameMap {
    'calculate': CalculateElement;
  }
}
