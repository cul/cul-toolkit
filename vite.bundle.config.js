import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
const banner = `/*!
 * CUL Menu
 * Version: ${pkg.version}
 * Built: ${new Date().toISOString()}
 */`;

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: false,
  base: '',
  define: {
    __VERSION__: JSON.stringify(pkg.version)
  },
  build: {
    outDir: resolve(__dirname, 'dist/bundles'),
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
    rollupOptions: {
      output: { banner }
    }
  }
});

