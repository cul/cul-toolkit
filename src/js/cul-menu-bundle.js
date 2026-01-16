import { makeCULmenu } from './culmenu.js';
import { makeCULNavbarMenu } from './culmenu-navbar.js';

function initCollapse(options) {
  return makeCULmenu(options.url);
}

function initNavbar(options) {
  return makeCULNavbarMenu(options.selector, options.url);
}

export default {
  initCollapse,
  initNavbar
};

