/**
 * Named formatters for result values
 * Can be used declaratively via formatter attribute
 */
export const formatters = {
  /**
   * Default formatter - fixed decimal places
   */
  default: (value: number, decimals: number = 6): string => {
    return value.toFixed(decimals);
  },

  /**
   * Currency formatter - $X.XX format
   */
  currency: (value: number): string => {
    return `$${value.toFixed(2)}`;
  },

  /**
   * Percentage formatter - X.XX% format
   */
  percentage: (value: number): string => {
    return `${value.toFixed(2)}%`;
  },

  /**
   * Compact number formatter - 1.2k, 1.2M, etc.
   */
  compact: (value: number): string => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1e9) {
      return `${sign}${(absValue / 1e9).toFixed(1)}B`;
    }
    if (absValue >= 1e6) {
      return `${sign}${(absValue / 1e6).toFixed(1)}M`;
    }
    if (absValue >= 1e3) {
      return `${sign}${(absValue / 1e3).toFixed(1)}k`;
    }
    return value.toFixed(2);
  },

  /**
   * Scientific notation formatter
   */
  scientific: (value: number): string => {
    return value.toExponential(2);
  },
};

export type FormatterName = keyof typeof formatters;

/**
 * Get formatter function by name
 */
export function getFormatter(name: FormatterName): (value: number) => string {
  return (value: number) => formatters[name](value);
}
