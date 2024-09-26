import { resolve } from 'path'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars';
import culmenu from './src/js/cul-main-menu.json'

const pageData = {
  '/index.html': {
    title: 'cul-toolkit',
	whichHero: null,
  },
  '/examples/index.html': {
    title: 'cul-toolkit &raquo; examples',
	whichHero: '_slimhero',
	heroTitle: 'Columbia University Libraries',
  },
  '/examples/blogs-index.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL Blogs Example Landing Page',
	whichHero: '_slimhero',
	heroTitle: 'Columbia University Libraries Blogs',
  },
};

export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '',
  plugins: [
	handlebars({
      partialDirectory: [ 
        resolve(__dirname, 'src','partials'),
        resolve(__dirname, 'src','examples'),
      ],
	  context(pagePath) {
		let pData = pageData[pagePath];
		pData.culmenu = culmenu;
		return pData;
	  },
      helpers: {
        lowerdash: (str) => {
          return str.fn(this).replace(/\s+/g, '-').toLowerCase()
        },
      },
      runtimeOptions: {
        // config option: define custom private @variables
        data: {
			apptitle: 'cul-toolkit',
        },
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
