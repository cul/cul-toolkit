import { resolve } from 'path'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars';

const pageData = {
  '/index.html': {
    title: 'cul-toolkit',
  },
  '/examples/index.html': {
    title: 'cul-toolkit &raquo; examples',
  },
  '/examples/blogs-index.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL Blogs Example Landing Page',
  },
};

export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '',
  plugins: [
	handlebars({
      //partialDirectory: resolve(__dirname, './partials'),
      partialDirectory: [ 
        resolve(__dirname, 'src','partials'),
        resolve(__dirname, 'src','examples'),
      ],
	  context(pagePath) {
		return pageData[pagePath];
	  },
    }),
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        examples: resolve(__dirname, 'src/examples/index.html'),
        blogIndex: resolve(__dirname, 'src/examples/blogs-index.html'),
      },
      output: {
        //entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  server: {
    port: 8181
  }
})
