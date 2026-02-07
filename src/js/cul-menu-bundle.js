/**
 * cul-menu-bundle.js
 *
 * public bundle entry for cul menu.
 * exposed as global `culmenu` (iife) and es module.
 */

// bundled version for external usage via <script>

import { makeCULmenu } from './culmenu.js';
import { makeCULNavbarMenu } from './culmenu-navbar.js';

function initCollapse(options) {
  return makeCULmenu(options.url);
}

function initNavbar(options) {
  return makeCULNavbarMenu(options.selector, options.url);
}

export { makeCULmenu, initCollapse, initNavbar };

