import { defineConfig } from 'vite';
import { resolve } from 'path';
import pkg from './package.json';

const banner = `/*!
 * CUL Menu v${pkg.version}
 * (c) ${new Date().getFullYear()}
 */
`;

export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '',
  publicDir: false,
  define: {
    __VERSION__: JSON.stringify(pkg.version)
  },
  build: {
    outDir: '../dist/bundles',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/js/cul-menu-bundle.js'),
      name: 'CULMenu',
      formats: ['iife', 'es'],
      fileName: (format) =>
        format === 'iife'
          ? 'cul-menu.bundle.js'
          : 'cul-menu.bundle.es.js'
    },
    minify: 'oxc',
    sourcemap: true,
    rollupOptions: {
      output: { banner }
    }
  }
});

