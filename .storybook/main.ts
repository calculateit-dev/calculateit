import type { StorybookConfig } from '@storybook/react-vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../packages/react/src/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {},
  core: {
    disableTelemetry: true,
  },
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          react: resolve(__dirname, '../node_modules/react'),
          'react-dom': resolve(__dirname, '../node_modules/react-dom'),
        },
      },
      define: {
        ...config.define,
        'process.env': {},
      },
    };
  },
};

export default config;
