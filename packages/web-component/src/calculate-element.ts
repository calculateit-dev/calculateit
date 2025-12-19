import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { ParsedDocument, Section, SectionItem, Variable } from '@calculateit/parser-js';
import { parseFile } from '@calculateit/parser-js';
import { CalculatorState } from './state/calculator-state.js';
import { formatters, type FormatterName } from './utils/formatters.js';
import { toTitleCase, parseDocumentJson } from './utils/helpers.js';
import { styles } from './styles.js';

/**
 * Calculate Web Component
 * Platform-agnostic calculator component built with Lit
 *
 * @element calculate-it
 *
 * @fires values-change - Fired when input values change
 * @fires calculations-change - Fired when calculations update
 *
 * @cssprop --calculate-it-bg-color - Background color
 * @cssprop --calculate-it-text-color - Text color
 * @cssprop --calculate-it-input-bg - Input background color
 * @cssprop --calculate-it-input-label-color - Input label color (unfocused)
 * @cssprop --calculate-it-input-label-focus-color - Input label color (focused)
 * @cssprop --calculate-it-result-bg - Result background color
 * @cssprop --calculate-it-result-color - Result text color
 * @cssprop --calculate-it-negative-bg - Negative value background
 * @cssprop --calculate-it-negative-color - Negative value text color
 * @cssprop --calculate-it-gap - Gap between sections
 * @cssprop --calculate-it-border-radius - Border radius
 * ... and 20+ more CSS custom properties (see README for full list)
 */
@customElement('calculate-it')
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
   * Markdown content (automatically parsed)
   */
  @property({ type: String })
  markdown?: string;

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

  /**
   * Maximum number of columns in vertical mode (default: 2)
   */
  @property({ type: Number, attribute: 'max-columns-vertical' })
  maxColumnsVertical: number = 2;

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
      changedProperties.has('markdown') ||
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
    // Priority: document > markdown > documentJson
    if (this.document) {
      return this.document;
    }

    if (this.markdown) {
      const result = parseFile(this.markdown);
      if (result.success && result.data) {
        return result.data;
      }
      console.error('Failed to parse markdown:', result.error);
      return null;
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
      <div
        class=${classMap(calculatorClasses)}
        style="--calculate-it-vertical-max-columns: ${this.maxColumnsVertical}"
      >
        ${doc.sections
          .filter((section) => !section.hidden)
          .map((section) => this.renderSection(section))}
      </div>
    `;
  }

  private renderSection(section: Section) {
    const headingLevel = Math.min(Math.max(section.level || 3, 1), 6);

    return html`
      <section class="section">
        ${this.renderHeading(section.name, headingLevel)}
        ${section.items && section.items.length > 0
          ? this.renderSectionItems(section.items)
          : html`
              <div class="section-content">
                ${section.variables.map((variable) => this.renderVariable(variable))}
              </div>
            `}
      </section>
    `;
  }

  private renderSectionItems(items: SectionItem[]) {
    const result: any[] = [];
    let variableGroup: any[] = [];

    for (const item of items) {
      if (item.type === 'content') {
        // Flush any accumulated variables first
        if (variableGroup.length > 0) {
          result.push(html`
            <div class="section-content">
              ${variableGroup.map((v) => this.renderVariable(v))}
            </div>
          `);
          variableGroup = [];
        }
        // Add content block
        result.push(html`
          <div class="section-description">${unsafeHTML(item.html)}</div>
        `);
      } else if (item.type === 'variable') {
        // Accumulate variables to render in grid
        variableGroup.push(item.variable);
      }
    }

    // Flush any remaining variables
    if (variableGroup.length > 0) {
      result.push(html`
        <div class="section-content">
          ${variableGroup.map((v) => this.renderVariable(v))}
        </div>
      `);
    }

    return result;
  }

  private renderHeading(name: string, level: number) {
    switch (level) {
      case 1:
        return html`<h1>${name}</h1>`;
      case 2:
        return html`<h2>${name}</h2>`;
      case 3:
        return html`<h3>${name}</h3>`;
      case 4:
        return html`<h4>${name}</h4>`;
      case 5:
        return html`<h5>${name}</h5>`;
      case 6:
        return html`<h6>${name}</h6>`;
      default:
        return html`<h3>${name}</h3>`;
    }
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
    'calculate-it': CalculateElement;
  }
}
