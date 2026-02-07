import { copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sass from 'sass';
import postcss from 'postcss';
import cssnano from 'cssnano';

copyFileSync(
  resolve('src/setup.js'),
  resolve('dist/setup.js')
);

const result = sass.compile(
  resolve('src/scss/styles.scss'),
  {
    loadPaths: [
      resolve('node_modules'),
      resolve('src/scss')
    ]
  }
);

const minified = await postcss([cssnano]).process(result.css, {
  from: undefined
});

writeFileSync(
  resolve('dist/setup.css'),
  minified.css
);

