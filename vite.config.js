import { resolve } from 'path'
import { defineConfig } from 'vite'
import fs from 'fs';
import handlebars from 'vite-plugin-handlebars';
import culmenu from './src/js/cul-main-menu.json';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
const banner = `/*!
 * CUL Menu
 * Version: ${pkg.version}
 * Built: ${new Date().toISOString()}
 */`;

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
  '/examples/online_exhibitions-site_home.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL Online Exhibitions',
    whichHero: '_online-exhibitions-site-hero',
    heroTitle: 'Online Exhibitions',
	hideAddr: true,
    stylesheet: ['_example-styles.scss', '_online-exhibitions-styles.scss'],
    adobeFontsKit: 'uhm4ygw',
	adobeFonts: true,
	tocOpen: false,
  },
  '/examples/online_exhibitions-individual_home.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL Online Exhibitions Individual Home',
    whichHero: '_online-exhibitions-hero',
    heroTitle: 'Roar, Lion, Roar!',
    stylesheet: ['_example-styles.scss', '_online-exhibitions-styles.scss'],
    adobeFontsKit: 'uhm4ygw',
	adobeFonts: true,
	tocOpen: true,
  },
  '/examples/online_exhibitions-standard_page.html': {
    title: 'cul-toolkit &raquo; examples &raquo; CUL Online Exhibitions Standard Page',
    whichHero: '_online-exhibitions-hero',
	compactHero: true,
    heroTitle: 'Roar, Lion, Roar!',
    stylesheet: ['_example-styles.scss', '_online-exhibitions-styles.scss'],
    adobeFontsKit: 'uhm4ygw',
	adobeFonts: true,
	tocOpen: false,
	tocOverlay: true,
  },
};

const decodeHtml = (html) => {
  return html
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/g, "'");
};

export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '',
  define: {
    __VERSION__: JSON.stringify(pkg.version)
  },
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
          if (typeof str !== 'string') return '';
          str = decodeHtml(str);
          let result = str
            .toLowerCase()
            .trim()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''); 
          if (!/^[a-z]/.test(result)) {
            result = 'id-' + result;
          }
          return result;
        }
      },
      runtimeOptions: {
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
        onlineExhibitionsSiteHome: resolve(__dirname, 'src/examples/online_exhibitions-site_home.html'),
        onlineExhibitionsIndividualHome: resolve(__dirname, 'src/examples/online_exhibitions-individual_home.html'),
        onlineExhibitionsStandardPage: resolve(__dirname, 'src/examples/online_exhibitions-standard_page.html'),
      },
      output: {
        //entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})
