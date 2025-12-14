/**
 * Detect file format from content or filename
 */
export function detectFormat(content: string, filename?: string): 'org' | 'markdown' {
  // Check filename extension first
  if (filename) {
    if (filename.endsWith('.md')) return 'markdown';
    if (filename.endsWith('.org')) return 'org';
  }

  // Check content patterns
  // Markdown uses # for headers, org-mode uses *
  const hasMarkdownHeaders = /\n## /m.test(content) || /^# /m.test(content);
  const hasOrgHeaders = /\n\*\* /m.test(content) || /^\* /m.test(content);

  if (hasMarkdownHeaders) return 'markdown';
  if (hasOrgHeaders) return 'org';

  // Default to markdown if unclear
  return 'markdown';
}

/**
 * Strip emojis from text
 */
export function stripEmojis(text: string): string {
  // Remove all emoji characters
  return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
}

/**
 * Check if expression is a simple numeric value (input variable)
 */
export function isSimpleValue(expression: string): boolean {
  const trimmed = expression.trim();

  // Empty expressions are inputs
  if (trimmed === '') return true;

  // Check if it's a simple number (positive or negative, with optional decimals)
  return /^-?\d*\.?\d+$/.test(trimmed);
}

/**
 * Extract tags from header line (e.g., :hidden:, :tag1:tag2:)
 */
export function extractTags(line: string): string[] {
  // Match tags in the format :tag1:tag2: at the end of the line
  const tagMatch = line.match(/:([a-zA-Z_][a-zA-Z0-9_]*(?::[a-zA-Z_][a-zA-Z0-9_]*)*):$/);

  if (!tagMatch) return [];

  // Split tags by colon and filter out empty strings
  return tagMatch[1].split(':').filter(tag => tag.length > 0);
}

/**
 * Extract section name from header line (removes tags)
 */
export function extractSectionName(line: string, format: 'org' | 'markdown'): string {
  let name = line;

  if (format === 'markdown') {
    // Remove markdown header markers (#)
    name = name.replace(/^#+\s*/, '');
  } else {
    // Remove org-mode header markers (*)
    name = name.replace(/^\*+\s*/, '');
  }

  // Remove tags (e.g., :hidden:, :tag1:tag2:)
  name = name.replace(/\s*:[a-zA-Z_][a-zA-Z0-9_:]*:\s*$/, '');

  // Remove emojis and trim
  name = stripEmojis(name).trim();

  return name;
}

/**
 * Check if section has hidden tag
 */
export function isHiddenSection(line: string): boolean {
  const tags = extractTags(line);
  return tags.includes('hidden');
}

/**
 * Extract heading level from header line
 * Returns the number of # or * symbols
 */
export function extractHeadingLevel(line: string, format: 'org' | 'markdown'): number {
  if (format === 'markdown') {
    const match = line.match(/^(#{1,6})\s+/);
    return match ? match[1].length : 0;
  } else {
    const match = line.match(/^(\*+)\s+/);
    return match ? match[1].length : 0;
  }
}

/**
 * Check if line is a section header
 */
export function isSectionHeader(line: string, format: 'org' | 'markdown'): boolean {
  if (format === 'markdown') {
    // Markdown: All heading levels (# to ######)
    return /^#{1,6}\s+/.test(line);
  } else {
    // Org-mode: All heading levels (* to any number of *)
    return /^\*+\s+/.test(line);
  }
}

/**
 * Parse variable assignment line
 * Returns null if line is not a variable assignment
 */
export function parseVariableAssignment(line: string): { name: string; expression: string } | null {
  // Pattern: varName = expression
  const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/);

  if (!match) return null;

  return {
    name: match[1],
    expression: match[2].trim()
  };
}
