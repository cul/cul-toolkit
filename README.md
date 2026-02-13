# CUL Toolkit

_Version 5.x_

## Requirements
```
nodejs >= v22
```

## Development
Start the Vite dev server:
```
npm run dev
```
The app is available at http://localhost:5173

## Preview production build
Serve the production build locally:
```
npm run preview
```

## Build
Install dependencies and build:
```bash
npm install
npm run build
```
The output is written to the dist/ directory.

## Deployment requirements

Local machine:
```
ruby >= 2.7.5 (we currently have a .ruby-version file requiring 2.7.5)
bundler
```

Remote deployment server:
```
node >= 22
npm >= 10
```
## Deploying a versioned release

Update the version in your package.json file.

Run bundle install the first time you want to deploy, or if the Gemfile/Gemfile.lock has changed:
```
bundle install
```

Use capistrano to deploy to the desired environment (dev/test/prod):

Dev deployment example:

```
cap dev deploy # or replace "dev" with "test" or "prod"
```

Note: In order to deploy, you need to have your public key in the remote server user's authorized_keys file on your dev/test/prod hosts.


---

## CUL Menu Usage

CUL Menu is a portable BS5-compatible menu system that renders two styles of navigational menus from an authoritative JSON data source.

Purpose:

* **Menu content changes more often than apps**
* Avoid editing/redeploying multiple sites for a simple label or link change
* Centralized menu control
* Safe degradation when offline or blocked by CORS

Supports:

* **Runtime menu updates** (no rebuild required)
* **Graceful fallback** to a bundled example menu
* **Multiple render styles** (vertical collapse menu (CUL global menu / v5 theme), navbar (lweb v3 style))

Features:

* Fetch menu JSON from **remote authoritative source**
* Fallback to a **bundled example menu** if remote fails
* Cache-busting via app version
* Works in: Dynamic/JS apps, Static HTML pages, WP themes, etc.

Requirements:

* Bootstrap 5 CSS (**part of CUL Toolkit v5!**)
* Bootstrap 5 JS (dropdowns / collapse) (**part of CUL Toolkit v5!**)
* Modern browser (ES2019+)

---

### CUL Menu JSON Format

```json
{
  "Services & Tools": [
    {
      "href": "https://library.columbia.edu/services.html",
      "value": "Services & Tools"
    },
  ],
  "Libraries": [
    {
      "href": "https://library.columbia.edu/libraries.html",
      "value": "Libraries & Affiliates"
    },
    {
      "href": "https://library.columbia.edu/libraries/avery.html",
      "value": "Avery Architectural & Fine Arts Library"
    },
  ]
}
```

### Usage in this app (CUL Toolkit examples, etc)

#### Environmental Variable 

Create root `.env`:

```env
VITE_CUL_MENU_URL=https://toolkit.library.columbia.edu/v5/assets/cul-main-menu.json
```

#### main.js

```js
import { makeCULmenu } from './culmenu.js';
import { makeCULNavbarMenu } from './culmenu-navbar.js';

const MENU_URL = import.meta.env.VITE_CUL_MENU_URL || undefined;

makeCULmenu(MENU_URL);
makeCULNavbarMenu('[data-cul-navbar]', MENU_URL);
```

---

### Markup

#### Vertical / Collapse Menu

```html
<nav data-cul-menu class="cul-menu-loading"></nav>
```

#### Navbar / Dropdown Menu

```html
<nav
  class="navbar navbar-expand-lg cul-menu-loading"
  data-cul-navbar
  data-menu-id="main"
>
  <ul class="navbar-nav"></ul>
</nav>
```

The JS will replace the contents at runtime.

---

### Loading & Fallback Behavior

1. Attempt to fetch menu from:

   * `VITE_CUL_MENU_URL` (if provided)
2. If fetch fails:

   * Use bundled example menu (`cul-main-menu.json`)
3. Cache-busting is applied using app version

Console warning when fallback is used:

```
[CUL Menu] Remote menu unavailable, using bundled example.
```

---

### Using the Bundle on Another Site

Standalone bundle:

* `cul-menu.bundle.js` (IIFE, for `<script>` tags)
* `cul-menu.bundle.es.js` (ES module)

#### Example static HTML / IIFE usage

```html
<link rel="stylesheet" href="https://toolkit.library.columbia.edu/v5/setup.css">

<nav data-cul-menu></nav>

<script src="https://toolkit.library.columbia.edu/v5/bundles/cul-menu.bundle.js"></script>
<script>
  CULMenu.initCollapse({
    url: 'https://toolkit.library.columbia.edu/v5/assets/cul-main-menu.json'
  });
</script>
```

*Note: script/JSON URLs can be local or remote or mixed.*

---

#### ES module app usage

##### *Installation*

```bash
npm install @columbia-libraries/cul-toolkit
```

##### *Import and usage*

```js
import '@columbia-libraries/cul-toolkit/styles';
import '@columbia-libraries/cul-toolkit/setup';

import { makeCULmenu } from '@columbia-libraries/cul-toolkit';

const MENU_URL =
  import.meta.env.VITE_CUL_MENU_URL ||
  'https://toolkit.library.columbia.edu/v5/assets/cul-main-menu.json';

makeCULmenu(MENU_URL);
```

##### *Importing Individual SCSS Partials*

SCSS source files are exposed enabling finer‑grained control and theming.

You can import the **full SCSS entrypoint**:

```scss
@import "@columbia-libraries/cul-toolkit/src/scss/styles";
```
Or import individual SCSS modules:
```scss
// Step 1: CUL Toolkit variables (must come before Bootstrap variables)
@import '@columbia-libraries/cul-toolkit/src/scss/_variables';

// Step 2: Your project-specific variables
@import '../src/styles/variables';
@import '../src/styles/fontawesome-pro';

// Step 3: Bootstrap core
@import 'bootstrap';
@import 'blacklight-frontend/app/assets/stylesheets/blacklight/blacklight';

// Step 4: CUL Toolkit components
@import '@columbia-libraries/cul-toolkit/src/scss/_cul';
@import '@columbia-libraries/cul-toolkit/src/scss/_sidebars';
```

This allows you to override variables, functions, or partials before compiling with your own build pipeline (Sass, Rails asset pipeline, Webpack, Vite, etc.).


##### *Framework Notes*

	makeCULmenu(MENU_URL) manipulates DOM elements with [data-cul-menu].
	It must be called after the elements exist in the DOM:

	- Vue: call after app.mount() or inside onMounted() / nextTick().
	- React: call inside useEffect(() => { ... }, []).

###### *Vue note:*
```js
import { createApp, nextTick } from 'vue';
import App from './App.vue';
import { makeCULmenu } from '@columbia-libraries/cul-toolkit';

const app = createApp(App);

// for after app is mounted:
app.mount('#app');
nextTick(() => {
  makeCULmenu(MENU_URL);
});

// or for inside a component:
onMounted(() => {
  makeCULmenu(MENU_URL);
});
```

###### *React/other frameworks:*

	Call after the component that contains [data-my-menu] has mounted.

##### *Markup requirement*

	Must include target element: <nav data-my-menu></nav>

--- 

#### Available Globals

- CULMenu.initCollapse({ url });
- CULMenu.initNavbar({ selector, url });

---

### Build Output (npm package)

```bash
dist/
├── assets/
│   ├── columbia_crown_logo-square-135x135.svg
│   ├── cul-main-menu.json
│   ├── cul-text-logo.svg
│   ├── favicon.ico
│   ├── main.css
│   └── main.js
├── bundles/
│   ├── cul-menu.bundle.es.js
│   ├── cul-menu.bundle.es.js.map
│   ├── cul-menu.bundle.js
│   └── cul-menu.bundle.js.map
├── js/
│   ├── quicksearch.js
│   └── typeahead-0.11.1.bundle.min.js
├── setup.css
└── setup.js
```

---


