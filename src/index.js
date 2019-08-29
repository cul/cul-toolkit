// Trigger processing of index.scss
import './index.scss'

// Include bootstrap js in build. Note that boostrap relies on jQuery,
// and that jQuery is loaded as an external dependency in webpack.config.js.
// This means that for things to work, CUL Toolkit users must include their own
// jQuery in a script tag before importing our CUL Toolkit js. This is necessary
// in order to enable users to access the features that bootstrap adds to the
// $ object (e.g. tab component features).
import 'bootstrap';

// Include the rest of our js
import './js/main.js'
