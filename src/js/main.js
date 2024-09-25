// Our main js goes here!

// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// import our CUL menu from JSON builder
import { makeCULmenu } from './culmenu.js'
makeCULmenu('main-menu');

