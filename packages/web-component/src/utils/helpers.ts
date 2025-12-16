import type { ParsedDocument } from '@calculateit/parser-js';

/**
 * Convert string to title case
 * Ported from CalcField.tsx:6-11
 */
export function toTitleCase(str: string): string {
  return str
    .split(/(?=[A-Z])|_|-/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Safely parse JSON string to ParsedDocument
 * Returns null if parsing fails
 */
export function parseDocumentJson(json: string): ParsedDocument | null {
  try {
    const parsed = JSON.parse(json);
    // Basic validation
    if (parsed && typeof parsed === 'object' && 'sections' in parsed && 'variables' in parsed) {
      return parsed as ParsedDocument;
    }
    return null;
  } catch (error) {
    console.error('Failed to parse document JSON:', error);
    return null;
  }
}
