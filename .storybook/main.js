import { resolve } from 'path';

/** @type { import('@storybook/react-vite').StorybookConfig } */
export default {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': resolve(__dirname, '../src'),
      '@components': resolve(__dirname, '../src/components'),
    };
    return config;
  },
};
