import path from 'node:path';
import {mergeConfig} from 'vite';

module.exports = {
  framework: '@storybook/react-vite',
  core: {
    disableTelemetry: true,
  },
  stories: [
    {
      directory: '../playground/',
      files: 'stories.tsx',
    },
    {
      directory: '../src/components/',
      titlePrefix: 'All components',
      files: '**/*.stories.tsx',
    },
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
    './addons/global-controls-panel/preset.js',
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          // Stories import `@shopify/polaris` so they match the actual code
          // people will write. But when running in storybook, we want to use
          // the actual source code (not the built code) to avoid running build
          // twice (once to build Polaris, then again in storybook).
          '@shopify/polaris': path.resolve(__dirname, '..', 'src'),
          // Similarly, we want to link against the src version of
          // polaris-patterns
          '@shopify/polaris-patterns': path.resolve(
            __dirname,
            '..',
            '..',
            'polaris-patterns',
            'src',
          ),
        },
      },
    });
  },
};
