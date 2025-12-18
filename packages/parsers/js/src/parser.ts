import { marked } from 'marked';
import type { ParsedDocument, ParseResult, ParserOptions, Section, Variable } from './types.js';
import {
  detectFormat,
  extractHeadingLevel,
  extractSectionName,
  isHiddenSection,
  isSectionHeader,
  isSimpleValue,
  parseVariableAssignment,
} from './utils.js';

/**
 * Parse an org-mode or markdown file with literate calculations
 * Uses a two-pass approach:
 * 1. Parse structure (sections, variables, raw text content)
 * 2. Convert markdown content to HTML
 */
export function parseFile(content: string, filename?: string, options: ParserOptions = {}): ParseResult {
  try {
    // PASS 1: Parse document structure
    const document = parseStructure(content, filename, options);

    // PASS 2: Convert markdown content to HTML
    convertMarkdownContent(document);

    return {
      success: true,
      data: document,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown parsing error',
        context: 'Failed to parse file content',
      },
    };
  }
}

/**
 * PASS 1: Parse document structure - extracts sections, variables, and raw text content
 */
function parseStructure(content: string, filename?: string, options: ParserOptions = {}): ParsedDocument {
  try {
    const {
      autoDetectInputs = true,
      explicitInputs = [],
      language = 'javascript',
    } = options;

    // Detect file format
    const format = detectFormat(content, filename);

    // Split into lines
    const lines = content.split('\n');

    // Track current section
    let currentSection = '';
    let sectionOrder = 0;
    const sectionsMap = new Map<string, Section>();
    const variables: Variable[] = [];
    const inputVariables: string[] = [];

    // Track variable order within sections
    const sectionVariableCounts = new Map<string, number>();

    // Track raw content lines (non-formula text) for each section
    const sectionContentLines = new Map<string, string[]>();

    // Parse each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (line === '') continue;

      // Check for section headers
      if (isSectionHeader(line, format)) {
        // Flush content buffer from previous section before switching
        const prevSection = sectionsMap.get(currentSection);
        const prevContentLines = sectionContentLines.get(currentSection);
        if (prevSection && prevContentLines && prevContentLines.length > 0) {
          const contentText = prevContentLines.join('\n');
          if (contentText.trim()) {
            prevSection.items!.push({ type: 'content', html: contentText });
          }
          prevContentLines.length = 0;
        }

        const sectionName = extractSectionName(line, format);
        const hidden = isHiddenSection(line);
        const level = extractHeadingLevel(line, format);
        currentSection = sectionName;

        // Create section if it doesn't exist
        if (!sectionsMap.has(sectionName)) {
          sectionsMap.set(sectionName, {
            name: sectionName,
            order: sectionOrder++,
            variables: [],
            hidden,
            level,
            items: [], // Initialize items array for interleaved content and variables
          });
          sectionContentLines.set(sectionName, []);
        }
        continue;
      }

      // Skip comment lines and directives
      if (format === 'markdown') {
        // Skip malformed headers (# without space) and code blocks
        if (line.startsWith('#') || line.startsWith('```')) {
          continue;
        }
      } else {
        // Skip org-mode directives (lines starting with #)
        if (line.startsWith('#')) {
          continue;
        }
      }

      // Try to parse variable assignment
      const assignment = parseVariableAssignment(line);
      if (assignment) {
        // Flush content buffer before adding variable
        const section = sectionsMap.get(currentSection);
        const contentLines = sectionContentLines.get(currentSection);
        if (section && contentLines && contentLines.length > 0) {
          const contentText = contentLines.join('\n');
          // Only add if not empty/whitespace
          if (contentText.trim()) {
            section.items!.push({ type: 'content', html: contentText });
          }
          contentLines.length = 0; // Clear buffer
        }

        const { name, expression } = assignment;

        // Determine variable order within section
        const currentCount = sectionVariableCounts.get(currentSection) || 0;
        sectionVariableCounts.set(currentSection, currentCount + 1);

        // Determine if this is an input variable
        let isInput = false;
        if (explicitInputs.includes(name)) {
          isInput = true;
        } else if (autoDetectInputs) {
          isInput = isSimpleValue(expression);
        }

        // Create variable
        const variable: Variable = {
          name,
          expression,
          isInput,
          section: currentSection,
          order: currentCount,
        };

        // Add to variables list
        variables.push(variable);

        // Track input variables
        if (isInput) {
          inputVariables.push(name);
        }

        // Add to section's variables and items
        if (section) {
          section.variables.push(variable);
          section.items!.push({ type: 'variable', variable });
        }
      } else {
        // Line is not a formula - add to content buffer
        const contentLines = sectionContentLines.get(currentSection);
        if (contentLines) {
          contentLines.push(line);
        }
      }
    }

    // Flush any remaining content at the end of each section
    for (const [sectionName, contentLines] of sectionContentLines.entries()) {
      if (contentLines.length > 0) {
        const section = sectionsMap.get(sectionName);
        if (section) {
          const contentText = contentLines.join('\n');
          if (contentText.trim()) {
            section.items!.push({ type: 'content', html: contentText });
          }
        }
      }
    }

    // Convert sections map to array
    const sections = Array.from(sectionsMap.values()).sort((a, b) => a.order - b.order);

    // Create parsed document
    const document: ParsedDocument = {
      format,
      language,
      sections,
      variables,
      inputVariables,
    };

    return document;
  } catch (error) {
    throw error; // Let parseFile handle the error
  }
}

/**
 * PASS 2: Convert markdown content to HTML
 */
function convertMarkdownContent(document: ParsedDocument): void {
  for (const section of document.sections) {
    if (section.items) {
      for (const item of section.items) {
        if (item.type === 'content') {
          // Convert raw markdown text to HTML
          item.html = marked.parse(item.html) as string;
        }
      }
    }
  }
}

/**
 * Parse an org-mode file (convenience function)
 */
export function parseOrgFile(content: string, options?: ParserOptions): ParseResult {
  return parseFile(content, undefined, options);
}

/**
 * Parse a markdown file (convenience function)
 */
export function parseMarkdownFile(content: string, options?: ParserOptions): ParseResult {
  return parseFile(content, undefined, options);
}
