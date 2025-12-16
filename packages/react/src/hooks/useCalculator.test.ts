import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from './useCalculator';
import type { ParsedDocument } from '@calculateit/parser-js';

describe('useCalculator', () => {
  const mockDocument: ParsedDocument = {
    format: 'markdown',
    language: 'javascript',
    sections: [
      {
        name: 'Inputs',
        order: 0,
        variables: [
          { name: 'x', expression: '10', isInput: true, section: 'Inputs', order: 0 },
          { name: 'y', expression: '5', isInput: true, section: 'Inputs', order: 1 },
        ],
      },
      {
        name: 'Calculations',
        order: 1,
        variables: [
          { name: 'sum', expression: 'x + y', isInput: false, section: 'Calculations', order: 0 },
          { name: 'product', expression: 'x * y', isInput: false, section: 'Calculations', order: 1 },
        ],
      },
    ],
    variables: [
      { name: 'x', expression: '10', isInput: true, section: 'Inputs', order: 0 },
      { name: 'y', expression: '5', isInput: true, section: 'Inputs', order: 1 },
      { name: 'sum', expression: 'x + y', isInput: false, section: 'Calculations', order: 0 },
      { name: 'product', expression: 'x * y', isInput: false, section: 'Calculations', order: 1 },
    ],
    inputVariables: ['x', 'y'],
  };

  describe('Initialization', () => {
    it('should initialize with default values from expressions', () => {
      const { result } = renderHook(() => useCalculator(mockDocument));

      expect(result.current.state.inputValues).toEqual({
        x: 10,
        y: 5,
      });
    });

    it('should initialize with provided initial values', () => {
      const { result } = renderHook(() =>
        useCalculator(mockDocument, { x: 20, y: 15 })
      );

      expect(result.current.state.inputValues).toEqual({
        x: 20,
        y: 15,
      });
    });

    it('should handle invalid initial values by defaulting to 0', () => {
      const docWithInvalidValues: ParsedDocument = {
        ...mockDocument,
        variables: [
          { name: 'x', expression: 'invalid', isInput: true, section: 'Inputs', order: 0 },
        ],
        inputVariables: ['x'],
      };

      const { result } = renderHook(() => useCalculator(docWithInvalidValues));

      expect(result.current.state.inputValues.x).toBe(0);
    });
  });

  describe('Calculations', () => {
    it('should calculate values on mount', () => {
      const { result } = renderHook(() => useCalculator(mockDocument));

      expect(result.current.state.calculatedValues).toEqual({
        sum: 15,
        product: 50,
      });
    });

    it('should recalculate when input values change', () => {
      const { result } = renderHook(() => useCalculator(mockDocument));

      act(() => {
        result.current.handleInputChange('x', 20);
      });

      expect(result.current.state.calculatedValues).toEqual({
        sum: 25,
        product: 100,
      });
    });

    it('should handle dependent calculations', () => {
      const docWithDependencies: ParsedDocument = {
        format: 'markdown',
        language: 'javascript',
        sections: [],
        variables: [
          { name: 'a', expression: '10', isInput: true, section: 'Inputs', order: 0 },
          { name: 'b', expression: 'a * 2', isInput: false, section: 'Calcs', order: 0 },
          { name: 'c', expression: 'b + 5', isInput: false, section: 'Calcs', order: 1 },
        ],
        inputVariables: ['a'],
      };

      const { result } = renderHook(() => useCalculator(docWithDependencies));

      expect(result.current.state.calculatedValues).toEqual({
        b: 20,
        c: 25,
      });
    });

    it('should handle calculation errors gracefully', () => {
      const docWithError: ParsedDocument = {
        format: 'markdown',
        language: 'javascript',
        sections: [],
        variables: [
          { name: 'x', expression: '10', isInput: true, section: 'Inputs', order: 0 },
          { name: 'invalid', expression: 'unknownVar + 5', isInput: false, section: 'Calcs', order: 0 },
        ],
        inputVariables: ['x'],
      };

      const { result } = renderHook(() => useCalculator(docWithError));

      expect(result.current.state.errors.invalid).toBeDefined();
      expect(result.current.state.calculatedValues.invalid).toBe(0);
    });
  });

  describe('Callbacks', () => {
    it('should call onValuesChange when input changes', () => {
      const onValuesChange = vi.fn();
      const { result } = renderHook(() =>
        useCalculator(mockDocument, undefined, onValuesChange)
      );

      act(() => {
        result.current.handleInputChange('x', 15);
      });

      expect(onValuesChange).toHaveBeenCalledWith({ x: 15, y: 5 });
    });

    it('should call onCalculationsChange when calculations update', () => {
      const onCalculationsChange = vi.fn();
      const { result } = renderHook(() =>
        useCalculator(mockDocument, undefined, undefined, onCalculationsChange)
      );

      // Initial calculation
      expect(onCalculationsChange).toHaveBeenCalledWith({
        sum: 15,
        product: 50,
      });

      act(() => {
        result.current.handleInputChange('x', 20);
      });

      expect(onCalculationsChange).toHaveBeenCalledWith({
        sum: 25,
        product: 100,
      });
    });
  });

  describe('Manual Recalculation', () => {
    it('should allow manual recalculation', () => {
      const { result } = renderHook(() => useCalculator(mockDocument));

      const initialSum = result.current.state.calculatedValues.sum;

      act(() => {
        result.current.recalculate();
      });

      expect(result.current.state.calculatedValues.sum).toBe(initialSum);
    });
  });

  describe('Complex Calculations', () => {
    it('should handle mathematical functions', () => {
      const docWithFunctions: ParsedDocument = {
        format: 'markdown',
        language: 'javascript',
        sections: [],
        variables: [
          { name: 'x', expression: '16', isInput: true, section: 'Inputs', order: 0 },
          { name: 'squareRoot', expression: 'sqrt(x)', isInput: false, section: 'Calcs', order: 0 },
          { name: 'absolute', expression: 'abs(-10)', isInput: false, section: 'Calcs', order: 1 },
        ],
        inputVariables: ['x'],
      };

      const { result } = renderHook(() => useCalculator(docWithFunctions));

      expect(result.current.state.calculatedValues).toEqual({
        squareRoot: 4,
        absolute: 10,
      });
    });

    it('should handle power operations', () => {
      const docWithPower: ParsedDocument = {
        format: 'markdown',
        language: 'javascript',
        sections: [],
        variables: [
          { name: 'base', expression: '2', isInput: true, section: 'Inputs', order: 0 },
          { name: 'exponent', expression: '3', isInput: true, section: 'Inputs', order: 1 },
          { name: 'result', expression: 'base ^ exponent', isInput: false, section: 'Calcs', order: 0 },
        ],
        inputVariables: ['base', 'exponent'],
      };

      const { result } = renderHook(() => useCalculator(docWithPower));

      expect(result.current.state.calculatedValues.result).toBe(8);
    });

    it('should handle decimal calculations', () => {
      const docWithDecimals: ParsedDocument = {
        format: 'markdown',
        language: 'javascript',
        sections: [],
        variables: [
          { name: 'price', expression: '99.99', isInput: true, section: 'Inputs', order: 0 },
          { name: 'tax', expression: '0.08', isInput: true, section: 'Inputs', order: 1 },
          { name: 'total', expression: 'price * (1 + tax)', isInput: false, section: 'Calcs', order: 0 },
        ],
        inputVariables: ['price', 'tax'],
      };

      const { result } = renderHook(() => useCalculator(docWithDecimals));

      expect(result.current.state.calculatedValues.total).toBeCloseTo(107.9892, 4);
    });
  });
});
