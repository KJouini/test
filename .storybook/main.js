import react from '@vitejs/plugin-react';

/** @type { import('@storybook/react-vite').StorybookConfig } */
export default {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  // Essentials est déjà inclus en SB9: pas besoin d'addons ici
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins || []), react()];
    return config;
  },
};
