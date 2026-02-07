// src/setup.js

// src/setup.js
import * as bootstrap from 'bootstrap';

// expose bootstrap for legacy scripts
if (typeof window !== 'undefined') {
  window.bootstrap = bootstrap;
}

