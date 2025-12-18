import { describe, it, expect, beforeEach } from 'vitest';
import { ExpressionEvaluator, evaluateExpression } from './evaluator';

describe('ExpressionEvaluator', () => {
  let evaluator: ExpressionEvaluator;

  beforeEach(() => {
    evaluator = new ExpressionEvaluator();
  });

  describe('evaluate', () => {
    it('should evaluate simple arithmetic', () => {
      expect(evaluator.evaluate('2 + 3')).toEqual({ success: true, value: 5 });
      expect(evaluator.evaluate('10 - 4')).toEqual({ success: true, value: 6 });
      expect(evaluator.evaluate('3 * 4')).toEqual({ success: true, value: 12 });
      expect(evaluator.evaluate('15 / 3')).toEqual({ success: true, value: 5 });
    });

    it('should handle empty expressions', () => {
      expect(evaluator.evaluate('')).toEqual({ success: true, value: 0 });
      expect(evaluator.evaluate('  ')).toEqual({ success: true, value: 0 });
    });

    it('should evaluate with variables', () => {
      evaluator.setVariables({ x: 10, y: 5 });
      expect(evaluator.evaluate('x + y')).toEqual({ success: true, value: 15 });
      expect(evaluator.evaluate('x * y')).toEqual({ success: true, value: 50 });
      expect(evaluator.evaluate('x / y')).toEqual({ success: true, value: 2 });
    });

    it('should evaluate complex expressions', () => {
      evaluator.setVariables({ a: 2, b: 3, c: 4 });
      expect(evaluator.evaluate('a + b * c')).toEqual({ success: true, value: 14 });
      expect(evaluator.evaluate('(a + b) * c')).toEqual({ success: true, value: 20 });
    });

    it('should evaluate power operations', () => {
      expect(evaluator.evaluate('2 ^ 3')).toEqual({ success: true, value: 8 });
      expect(evaluator.evaluate('10 ^ 2')).toEqual({ success: true, value: 100 });
    });

    it('should evaluate mathematical functions', () => {
      expect(evaluator.evaluate('sqrt(16)')).toEqual({ success: true, value: 4 });
      expect(evaluator.evaluate('abs(-5)')).toEqual({ success: true, value: 5 });
      expect(evaluator.evaluate('min(3, 5, 2)')).toEqual({ success: true, value: 2 });
      expect(evaluator.evaluate('max(3, 5, 2)')).toEqual({ success: true, value: 5 });
    });

    it('should handle decimal results', () => {
      expect(evaluator.evaluate('10 / 3')).toMatchObject({
        success: true,
        value: expect.closeTo(3.333333, 5)
      });
      expect(evaluator.evaluate('sqrt(2)')).toMatchObject({
        success: true,
        value: expect.closeTo(1.414213, 5)
      });
    });

    it('should return error for invalid expressions', () => {
      const result = evaluator.evaluate('invalid expression!!!');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error for undefined variables', () => {
      const result = evaluator.evaluate('unknownVar + 5');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error for division by zero', () => {
      const result = evaluator.evaluate('1 / 0');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid result');
    });

    it('should handle negative numbers', () => {
      expect(evaluator.evaluate('-5 + 3')).toEqual({ success: true, value: -2 });
      expect(evaluator.evaluate('10 * -2')).toEqual({ success: true, value: -20 });
    });
  });

  describe('setVariables', () => {
    it('should update variables', () => {
      evaluator.setVariables({ x: 10 });
      expect(evaluator.evaluate('x * 2')).toEqual({ success: true, value: 20 });

      evaluator.setVariables({ x: 5 });
      expect(evaluator.evaluate('x * 2')).toEqual({ success: true, value: 10 });
    });
  });

  describe('evaluateAll', () => {
    it('should evaluate multiple expressions', () => {
      evaluator.setVariables({ a: 10, b: 5 });

      const results = evaluator.evaluateAll({
        sum: 'a + b',
        product: 'a * b',
        difference: 'a - b',
      });

      expect(results.sum).toEqual({ success: true, value: 15 });
      expect(results.product).toEqual({ success: true, value: 50 });
      expect(results.difference).toEqual({ success: true, value: 5 });
    });

    it('should handle mix of valid and invalid expressions', () => {
      const results = evaluator.evaluateAll({
        valid: '2 + 3',
        invalid: 'invalid!!!',
      });

      expect(results.valid.success).toBe(true);
      expect(results.invalid.success).toBe(false);
    });
  });
});

describe('evaluateExpression', () => {
  it('should evaluate expression with context', () => {
    const result = evaluateExpression('x + y', { x: 10, y: 5 });
    expect(result).toEqual({ success: true, value: 15 });
  });

  it('should handle empty context', () => {
    const result = evaluateExpression('2 + 3', {});
    expect(result).toEqual({ success: true, value: 5 });
  });

  it('should return error for missing variables', () => {
    const result = evaluateExpression('x + y', {});
    expect(result.success).toBe(false);
  });

  it('should handle non-Error exceptions gracefully', () => {
    // Create a context with a getter that throws a non-Error
    const problematicContext = {
      get x() {
        throw 'String error';
      }
    };

    const result = evaluateExpression('x + 1', problematicContext);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Evaluation error');
  });
});
