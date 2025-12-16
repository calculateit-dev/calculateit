import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'parsers',
      include: ['packages/parsers/js/**/*.test.ts'],
      globals: true,
      environment: 'node',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.test.ts',
          '**/*.config.ts',
        ],
      },
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'react',
      include: ['packages/react/**/*.test.{ts,tsx}'],
    },
  },
]);
