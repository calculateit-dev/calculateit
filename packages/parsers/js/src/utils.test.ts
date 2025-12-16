import { describe, it, expect } from 'vitest';
import {
  detectFormat,
  stripEmojis,
  isSimpleValue,
  extractTags,
  extractSectionName,
  isHiddenSection,
  extractHeadingLevel,
  isSectionHeader,
  parseVariableAssignment,
} from './utils';

describe('detectFormat', () => {
  it('should detect markdown from .md extension', () => {
    expect(detectFormat('', 'test.md')).toBe('markdown');
  });

  it('should detect org from .org extension', () => {
    expect(detectFormat('', 'test.org')).toBe('org');
  });

  it('should detect markdown from ## headers', () => {
    expect(detectFormat('## Section\nvar = 1')).toBe('markdown');
  });

  it('should detect markdown from # headers at start', () => {
    expect(detectFormat('# Title\n## Section')).toBe('markdown');
  });

  it('should detect org from ** headers', () => {
    expect(detectFormat('\n** Section\nvar = 1')).toBe('org');
  });

  it('should detect org from * headers at start', () => {
    expect(detectFormat('* Title\n** Section')).toBe('org');
  });

  it('should default to markdown when unclear', () => {
    expect(detectFormat('var = 1')).toBe('markdown');
  });
});

describe('stripEmojis', () => {
  it('should remove emojis from text', () => {
    expect(stripEmojis('Hello 👋 World 🌍')).toBe('Hello  World ');
  });

  it('should handle text without emojis', () => {
    expect(stripEmojis('Hello World')).toBe('Hello World');
  });

  it('should remove multiple emojis', () => {
    expect(stripEmojis('📊 Data 📈 Analytics 📉')).toBe(' Data  Analytics ');
  });
});

describe('isSimpleValue', () => {
  it('should return true for empty expression', () => {
    expect(isSimpleValue('')).toBe(true);
    expect(isSimpleValue('  ')).toBe(true);
  });

  it('should return true for simple integers', () => {
    expect(isSimpleValue('42')).toBe(true);
    expect(isSimpleValue('0')).toBe(true);
    expect(isSimpleValue('123')).toBe(true);
  });

  it('should return true for decimal numbers', () => {
    expect(isSimpleValue('3.14')).toBe(true);
    expect(isSimpleValue('0.5')).toBe(true);
    expect(isSimpleValue('.5')).toBe(true);
  });

  it('should return true for negative numbers', () => {
    expect(isSimpleValue('-42')).toBe(true);
    expect(isSimpleValue('-3.14')).toBe(true);
  });

  it('should return false for expressions', () => {
    expect(isSimpleValue('a + b')).toBe(false);
    expect(isSimpleValue('x * 2')).toBe(false);
    expect(isSimpleValue('sqrt(16)')).toBe(false);
  });

  it('should return false for variable names', () => {
    expect(isSimpleValue('myVar')).toBe(false);
  });
});

describe('extractTags', () => {
  it('should extract single tag', () => {
    expect(extractTags('## Section :hidden:')).toEqual(['hidden']);
  });

  it('should extract multiple tags', () => {
    expect(extractTags('## Section :tag1:tag2:tag3:')).toEqual(['tag1', 'tag2', 'tag3']);
  });

  it('should return empty array when no tags', () => {
    expect(extractTags('## Section')).toEqual([]);
  });

  it('should handle tags with underscores and numbers', () => {
    expect(extractTags('## Section :my_tag_1:another_2:')).toEqual(['my_tag_1', 'another_2']);
  });
});

describe('extractSectionName', () => {
  it('should extract markdown section name', () => {
    expect(extractSectionName('## My Section', 'markdown')).toBe('My Section');
    expect(extractSectionName('### Another Section', 'markdown')).toBe('Another Section');
  });

  it('should extract org section name', () => {
    expect(extractSectionName('** My Section', 'org')).toBe('My Section');
    expect(extractSectionName('*** Another Section', 'org')).toBe('Another Section');
  });

  it('should remove tags from section name', () => {
    expect(extractSectionName('## My Section :hidden:', 'markdown')).toBe('My Section');
    expect(extractSectionName('## Section :tag1:tag2:', 'markdown')).toBe('Section');
  });

  it('should remove emojis from section name', () => {
    expect(extractSectionName('## 📊 Data Analysis', 'markdown')).toBe('Data Analysis');
    expect(extractSectionName('** 🎯 Goals', 'org')).toBe('Goals');
  });

  it('should handle multiple heading levels', () => {
    expect(extractSectionName('# Level 1', 'markdown')).toBe('Level 1');
    expect(extractSectionName('#### Level 4', 'markdown')).toBe('Level 4');
  });
});

describe('isHiddenSection', () => {
  it('should return true for sections with :hidden: tag', () => {
    expect(isHiddenSection('## Section :hidden:')).toBe(true);
  });

  it('should return false for sections without :hidden: tag', () => {
    expect(isHiddenSection('## Section')).toBe(false);
  });

  it('should detect hidden tag among other tags', () => {
    expect(isHiddenSection('## Section :tag1:hidden:tag2:')).toBe(true);
  });
});

describe('extractHeadingLevel', () => {
  it('should extract markdown heading levels', () => {
    expect(extractHeadingLevel('# Level 1', 'markdown')).toBe(1);
    expect(extractHeadingLevel('## Level 2', 'markdown')).toBe(2);
    expect(extractHeadingLevel('### Level 3', 'markdown')).toBe(3);
    expect(extractHeadingLevel('#### Level 4', 'markdown')).toBe(4);
    expect(extractHeadingLevel('##### Level 5', 'markdown')).toBe(5);
    expect(extractHeadingLevel('###### Level 6', 'markdown')).toBe(6);
  });

  it('should extract org heading levels', () => {
    expect(extractHeadingLevel('* Level 1', 'org')).toBe(1);
    expect(extractHeadingLevel('** Level 2', 'org')).toBe(2);
    expect(extractHeadingLevel('*** Level 3', 'org')).toBe(3);
    expect(extractHeadingLevel('**** Level 4', 'org')).toBe(4);
  });

  it('should return 0 for non-headers', () => {
    expect(extractHeadingLevel('Not a header', 'markdown')).toBe(0);
    expect(extractHeadingLevel('var = 1', 'org')).toBe(0);
  });
});

describe('isSectionHeader', () => {
  it('should identify markdown headers', () => {
    expect(isSectionHeader('# Header', 'markdown')).toBe(true);
    expect(isSectionHeader('## Header', 'markdown')).toBe(true);
    expect(isSectionHeader('###### Header', 'markdown')).toBe(true);
  });

  it('should identify org headers', () => {
    expect(isSectionHeader('* Header', 'org')).toBe(true);
    expect(isSectionHeader('** Header', 'org')).toBe(true);
    expect(isSectionHeader('****** Header', 'org')).toBe(true);
  });

  it('should reject non-headers', () => {
    expect(isSectionHeader('Not a header', 'markdown')).toBe(false);
    expect(isSectionHeader('var = 1', 'org')).toBe(false);
  });

  it('should require space after header marker', () => {
    expect(isSectionHeader('#NoSpace', 'markdown')).toBe(false);
    expect(isSectionHeader('*NoSpace', 'org')).toBe(false);
  });
});

describe('parseVariableAssignment', () => {
  it('should parse simple assignments', () => {
    expect(parseVariableAssignment('x = 5')).toEqual({ name: 'x', expression: '5' });
    expect(parseVariableAssignment('total = 100')).toEqual({ name: 'total', expression: '100' });
  });

  it('should parse assignments with expressions', () => {
    expect(parseVariableAssignment('sum = a + b')).toEqual({ name: 'sum', expression: 'a + b' });
    expect(parseVariableAssignment('result = x * y / 2')).toEqual({ name: 'result', expression: 'x * y / 2' });
  });

  it('should handle whitespace', () => {
    expect(parseVariableAssignment('x   =   5  ')).toEqual({ name: 'x', expression: '5' });
  });

  it('should handle underscores and numbers in variable names', () => {
    expect(parseVariableAssignment('my_var_1 = 42')).toEqual({ name: 'my_var_1', expression: '42' });
  });

  it('should return null for non-assignments', () => {
    expect(parseVariableAssignment('## Header')).toBeNull();
    expect(parseVariableAssignment('just text')).toBeNull();
  });

  it('should return null for invalid variable names', () => {
    expect(parseVariableAssignment('123var = 5')).toBeNull();
    expect(parseVariableAssignment('my-var = 5')).toBeNull();
  });
});
