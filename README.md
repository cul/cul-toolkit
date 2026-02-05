# CUL Toolkit

_Version 5.x_

## Development requirements
```
nodejs >= v20
npm >= 10.2
```

## Vite for development
Dev server runs on http://localhost:8181 and auto-recompiles code when resources change.
```
npm start
```
Preview server runs on http://localhost:4173 and serves the built dist/ dir.
```
npm run preview
```

## Vite Build Instructions
Vite will bundle code and copy public/ files for distribution into the dist/ dir.
```
npm install # run the first time you want to build, or if the package-lock.json file has changed
```
```
npm run build
```

## Deployment requirements

Local machine:
```
ruby >= 2.5.3 (we currently have a .ruby-version file requiring 2.5.3)
bundler
```

Remote deployment server:
```
node >= 10.17.0
yarn >= 1.19.1
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

Create `src/.env`:

```env
VITE_CUL_MENU_URL=https://menus.example.com/cul-main-menu.json
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

#### Example (static HTML)

```html
<link rel="stylesheet" href="bootstrap.css">

<nav data-cul-menu></nav>

<script src="https://toolkit-dev.library.columbia.edu/v5/bundles/cul-menu.bundle.js"></script>
<script>
  CULMenu.initCollapse({
    url: 'https://toolkit.library.columbia.edu/v5/assets/cul-main-menu.json'
  });
</script>
```

*Note: script/JSON URLs can be local or remote or mixed.*

---

## Build Output

```
dist/assets/
	cul-main-menu.json 
dist/bundles/
	cul-menu.bundle.js
	cul-menu.bundle.es.js
```

---


