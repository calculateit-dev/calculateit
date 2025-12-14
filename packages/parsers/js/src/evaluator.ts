import { Parser } from 'expr-eval';
import type { EvalContext, EvalResult } from './types.js';

/**
 * Safe expression evaluator using expr-eval library
 * Replaces eval() with a secure mathematical expression parser
 */
export class ExpressionEvaluator {
  private parser: Parser;
  private variables: EvalContext;

  constructor(variables: EvalContext = {}) {
    this.parser = new Parser();
    this.variables = variables;
  }

  /**
   * Update the variable context
   */
  setVariables(variables: EvalContext): void {
    this.variables = variables;
  }

  /**
   * Evaluate a mathematical expression safely
   */
  evaluate(expression: string): EvalResult {
    // Handle empty expressions
    if (!expression || expression.trim() === '') {
      return { success: true, value: 0 };
    }

    try {
      // Parse the expression
      const expr = this.parser.parse(expression);

      // Evaluate with current variables
      const value = expr.evaluate(this.variables);

      // Ensure result is a number
      if (typeof value !== 'number' || !isFinite(value)) {
        return {
          success: false,
          error: `Invalid result: ${value}`,
        };
      }

      return { success: true, value };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Evaluation error',
      };
    }
  }

  /**
   * Batch evaluate multiple expressions
   */
  evaluateAll(expressions: Record<string, string>): Record<string, EvalResult> {
    const results: Record<string, EvalResult> = {};

    for (const [name, expression] of Object.entries(expressions)) {
      results[name] = this.evaluate(expression);
    }

    return results;
  }
}

/**
 * Convenience function to evaluate a single expression
 */
export function evaluateExpression(
  expression: string,
  variables: EvalContext
): EvalResult {
  const evaluator = new ExpressionEvaluator(variables);
  return evaluator.evaluate(expression);
}
