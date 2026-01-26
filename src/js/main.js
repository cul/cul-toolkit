// main.js

// load styles first
import '../scss/styles.scss';

// load bootstrap js (dropdowns, collapse, etc.)
import * as bootstrap from 'bootstrap';

import { makeCULmenu } from './culmenu.js';
import { makeCULNavbarMenu } from './culmenu-navbar.js';

const MENU_URL =
  import.meta.env.VITE_CUL_MENU_URL || undefined;

makeCULmenu(MENU_URL);
makeCULNavbarMenu('[data-cul-navbar]', MENU_URL);

//console.log('MENU_URL:', import.meta.env.VITE_CUL_MENU_URL);

