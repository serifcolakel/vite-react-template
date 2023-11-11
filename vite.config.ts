/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // eslint-disable-next-line no-console
  console.log({ env, __dirname, __filename });

  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/main.tsx'),
        name: 'ui-components',
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
      sourcemap: true,
      emptyOutDir: true,
    },
    plugins: [react(), dts()],
  };
});
