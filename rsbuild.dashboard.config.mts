import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],

  source: {
    entry: {
      'song-picker': './src/dashboard/song-picker.tsx',
    }
  },

  dev: {
    assetPrefix: '.',
    writeToDisk: true,
  },

  output: {
    assetPrefix: '.',
    cleanDistPath: true,
    distPath: {
      root: 'dashboard'
    }
  }
});
