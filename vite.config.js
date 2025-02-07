import { resolve } from 'path'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars';
import culmenu from './src/js/cul-main-menu.json'

const pageData = {
  '/index.html': {
    title: 'cul-toolkit',
  },
  '/examples/index.html': {
    title: 'cul-toolkit &raquo; examples',
    whichHero: '_slimhero',
    stylesheet: ['_example-styles.scss'],
    heroTitle: 'Columbia University Libraries',
  },
  '/examples/blogs-index.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL Blogs Example Landing Page',
    whichHero: '_slimhero',
    stylesheet: ['_example-styles.scss', '_blogs-styles.scss'],
    heroTitle: 'Columbia University Libraries Blogs',
  },
  '/examples/lweb-home.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL LWeb Example Landing Page',
    searchHero: true,
    searchHeroPlaceholder: '&#x1F50D; Search CLIO & the Libraries&hellip;',
    stylesheet: ['_example-styles.scss', '_lweb-styles.scss'],
    heroTitle: 'Columbia University Libraries',
  },
  '/examples/staffweb-home.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL StaffWeb Example Landing Page',
    searchHero: true,
    searchHeroPlaceholder: '&#x1F50D; Search StaffWeb pages&hellip;',
    searchInputAddClasses: 'fs-5',
    stylesheet: ['_example-styles.scss', '_staffweb-styles.scss'],
  },
  '/examples/staffweb-inner-hr.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL StaffWeb Example Inner HR Home',
    stylesheet: ['_example-styles.scss', '_staffweb-styles.scss'],
  },
  '/examples/staffweb-inner-hr-jobs.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL StaffWeb Example Inner HR Jobs Page',
    stylesheet: ['_example-styles.scss', '_staffweb-styles.scss'],
  },
};

export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '',
  plugins: [
    handlebars({
      partialDirectory: [
        resolve(__dirname, 'src', 'partials'),
        resolve(__dirname, 'src', 'examples'),
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
        lwebIndex: resolve(__dirname, 'src/examples/lweb-home.html'),
        staffIndex: resolve(__dirname, 'src/examples/staffweb-home.html'),
        staffInner: resolve(__dirname, 'src/examples/staffweb-inner-hr.html'),
        staffInnerInner: resolve(__dirname, 'src/examples/staffweb-inner-hr-jobs.html'),
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
