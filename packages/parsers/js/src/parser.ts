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
 */
export function parseFile(content: string, filename?: string, options: ParserOptions = {}): ParseResult {
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

    // Parse each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (line === '') continue;

      // Check for section headers
      if (isSectionHeader(line, format)) {
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
          });
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

        // Add to section's variables
        const section = sectionsMap.get(currentSection);
        if (section) {
          section.variables.push(variable);
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
