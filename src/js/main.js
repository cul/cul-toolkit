// our main js goes here!

// import our custom css
import '../scss/styles.scss'

// import all of bootstrap's js
import * as bootstrap from 'bootstrap'

const CUL_MENU_URL = "/cul-main-menu.json"; // or a remote aka: "http://localhost:4173/cul-main-menu.json";

import { makeCULmenu } from './culmenu.js';
makeCULmenu(CUL_MENU_URL); 

import { makeCULNavbarMenu } from './culmenu-navbar.js';
makeCULNavbarMenu('[data-cul-navbar]', CUL_MENU_URL); 

