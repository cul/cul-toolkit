/**
 * culmenu-navbar.js
 *
 * navbar / dropdown-style cul menu renderer.
 * matches bootstrap 5 navbar + dropdown + mega-menu pattern.
 */

import culmenuFallback from './cul-main-menu.json';
import { fetchCULmenu } from './culmenu-fetch.js';
import { Dropdown } from 'bootstrap';

/**
 * initialize navbar menus
 * @param {string} selector - element containing the navbar <ul>
 * @param {string} jsonUrl - optional runtime json url
 */
export async function makeCULNavbarMenu(selector, jsonUrl) {
  const root = document.querySelector(selector);
  if (!root) return;

  const ul = root.querySelector('ul');
  if (!ul) {
    console.warn('CUL navbar menu: <ul> not found');
    return;
  }

  const menuData = await fetchCULmenu(jsonUrl, culmenuFallback);
  const prefix = root.dataset.menuId || 'cul-navbar';

  ul.replaceChildren(buildNavbarItems(menuData, prefix));

  // initialize bootstrap dropdowns
  ul.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    const dropdown = toggle.nextElementSibling;
    if (dropdown) new Dropdown(toggle);
  });

  markLoaded(root);
}

/* ------------------------------------------------------------------
 * internal helpers (not exported)
 * ------------------------------------------------------------------ */

function buildNavbarItems(data, prefix) {
  const fragment = document.createDocumentFragment();

  for (const section in data) {
    const slugBase = `${prefix}-${slugify(section)}`;

    const li = document.createElement('li');
    li.className = 'nav-item dropdown position-static d-inline-flex';

    const toggle = document.createElement('a');
    toggle.href = '#';
    toggle.className = 'nav-link dropdown-toggle my-2 me-3';
    toggle.setAttribute('data-bs-toggle', 'dropdown');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = section;

    li.appendChild(toggle);

    const dropdown = document.createElement('div');
    dropdown.id = `${slugBase}-dropdown`;
    dropdown.className =
      'dropdown-menu w-100 border-top-0 border-left-0 border-right-0 rounded-0 py-0 my-0';

    const innerBg = document.createElement('div');
    innerBg.className = 'py-3 bg-secondary text-white';

    const container = document.createElement('div');
    container.className = 'container cul-cols';

    data[section].forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'd-block py-1 text-white dropdown-item bg-secondary';
      a.textContent = item.value;
      container.appendChild(a);
    });

    innerBg.appendChild(container);
    dropdown.appendChild(innerBg);
    li.appendChild(dropdown);

    fragment.appendChild(li);
  }

  return fragment;
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '');
}

function markLoaded(el) {
  el.classList.remove('cul-menu-loading');
  el.classList.add('cul-menu-loaded');
}

