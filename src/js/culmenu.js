/**
 * culmenu.js
 *
 * vertical / collapse-style cul menu renderer.
 * bootstrap 5 dependent.
 */

import culmenuFallback from './cul-main-menu.json';
import { fetchCULmenu } from './culmenu-fetch.js';
import { Collapse } from 'bootstrap';

/**
 * initialize all collapse-style menus
 * @param {string} jsonUrl - optional runtime json url
 */
export async function makeCULmenu(jsonUrl) {
  const targets = document.querySelectorAll('[data-cul-menu]');
  if (!targets.length) return;

  const menuData = await fetchCULmenu(jsonUrl, culmenuFallback);

  targets.forEach((el, index) => {
    const config = getConfig(el, index);
    const menu = buildCollapseMenu(menuData, config);
    el.replaceChildren(menu);

    // initialize bootstrap collapse
    if (config.useCollapse) {
      menu.querySelectorAll('[data-bs-toggle="collapse"]').forEach(toggle => {
        const collapseSelector = toggle.dataset.bsTarget;
        if (!collapseSelector) return;

        const collapseEl = document.querySelector(
          CSS.escape(collapseSelector.slice(1))
        );
        if (collapseEl) new Collapse(collapseEl, { toggle: false });
      });
    }

    // mark menu container as loaded
    markLoaded(el);
  });
}

/**
 * read config from data-attributes with safe defaults
 */
function getConfig(el, index) {
  return {
    prefix: el.dataset.menuId || `culmenu-${index}`,
    toggleTag: el.dataset.toggleTag || 'button',
    toggleClasses:
      el.dataset.toggleClasses ||
      'btn btn-toggle ps-0 d-inline-flex w-100 align-items-center rounded border-0 collapsed',
    listClasses: el.dataset.listClasses || 'list-unstyled w-100',
    itemClasses: el.dataset.itemClasses || 'd-block',
    useCollapse: el.dataset.useCollapse !== 'false'
  };
}

/**
 * Build collapse menu DOM
 */
function buildCollapseMenu(data, config) {
  const ul = document.createElement('ul');
  ul.className = config.listClasses;

  for (const section in data) {
    const li = document.createElement('li');
    li.className = 'mb-1';

    const collapseId = `${config.prefix}-${slug(section)}-collapse`;

    // toggle element
    const toggle = document.createElement(config.toggleTag);
    toggle.className = config.toggleClasses;
    toggle.textContent = section;

    if (config.useCollapse) {
      toggle.setAttribute('data-bs-toggle', 'collapse');
      toggle.setAttribute('data-bs-target', `#${collapseId}`);
      toggle.setAttribute('aria-expanded', 'false');
    }

    li.appendChild(toggle);

    // collapsible content
    const collapseDiv = document.createElement('div');
    collapseDiv.className = config.useCollapse ? 'collapse' : '';
    collapseDiv.id = collapseId;

    const subUl = document.createElement('ul');
    subUl.className = 'btn-toggle-nav list-unstyled fw-normal pb-1';

    data[section].forEach(item => {
      const li2 = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.value;
      a.className = config.itemClasses;
      li2.appendChild(a);
      subUl.appendChild(li2);
    });

    collapseDiv.appendChild(subUl);
    li.appendChild(collapseDiv);
    ul.appendChild(li);
  }

  return ul;
}

/**
 * utility
 */
function slug(str) {
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

