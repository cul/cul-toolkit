class NavbarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {

    // inject fontawesome into the light dom
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://kit.fontawesome.com/698946c03a.css'; // fontawesome kit url
    document.head.appendChild(link); // append to the head of the light dom

    const menuData = await this.loadMenuItems();
    this.render(menuData);
    this.initializeOffcanvas();
  }

  async loadMenuItems() {
    const menuUrl = this.getAttribute('data-menu-url') || '/cul-menus.json';  // default to local cul-menus.json
    try {
      const response = await fetch(menuUrl);
      if (!response.ok) {
        throw new Error('Failed to load menu data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu:', error);
      return { culGlobalMenu: [], culMainMenu: [] };  // return empty data in case of an error
    }
  }
  

  render(menuData) {

    // access the data attribute from light dom
    var cdncss = this.getAttribute('data-cdncss'); 
    if (cdncss) {
      switch (cdncss) {
        case "dev":
          cdncss = "https://blogs-dev.library.columbia.edu/er2576/dist/assets/main.css";
          break;
        case "test":
          cdncss = "https://blogs-test.library.columbia.edu/er2576/dist/assets/main.css";
          break;
        default: // should be prod
          cdncss = "https://blogs-dev.library.columbia.edu/er2576/dist/assets/main.css";
      }
    } else {
      cdncss = "https://blogs-dev.library.columbia.edu/er2576/dist/assets/main.css";
    }
    
    this.shadowRoot.innerHTML = `
      <style>
        /* Apply Bootstrap 5 styles to the Shadow DOM */
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css');
      </style>
      <style>
        /* Apply Bootstrap 5 styles to the Shadow DOM */
        @import url('${cdncss}');
      </style>
      <style>        
        /* Apply fontawesome kit to shadow dom */
        @import url('https://kit.fontawesome.com/698946c03a.css');
      </style>

      <!-- Navbar with a right-aligned button to trigger offcanvas sidebar -->
      <nav id="cultopbar" class="navbar sticky-top navbar-expand-lg navbar-light bg-body border-bottom">
        <div class="container">
          <div id="CULnavbar" class="flex-grow-1">
            <a href="/" class="navbar-brand">
            <img id="CULbrand" class="img-fluid" src="./assets/cul-text-logo.svg" alt="Columbia University Libraries">
            </a>
          </div>
          <button class="navbar-toggler" type="button" aria-expanded="false" aria-label="Toggle navigation" id="toggleSidebar">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="global-menu">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              ${menuData.culGlobalMenu.map(item => `
                <li class="nav-item">
                  <a class="nav-link text-secondary" href="${item.url}">${item.name}</a>
                </li>
              `).join('')}
            </ul>
            <button class="btn btn-link text-secondary px-1 animate roll" id="openSidebarBtn"><span class="fa-light fa-sidebar-flip"></span></button>
          </div>
        </div>
      </nav>

      <!-- Off-canvas Sidebar -->
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasLabel">Sidebar</h5>
          <button type="button" class="btn-close" id="closeSidebarBtn" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="list-group">
            ${menuData.culMainMenu.map(parent => `
              <li class="list-group-item">
                <a class="btn btn-toggle ps-0 d-inline-flex w-100 align-items-center rounded border-0 collapsed" href="${parent.url}">${parent.name}</a>
                <ul class="list-group ms-3">
                  ${parent.children.map(child => `
                    <li class="list-group-item"><a href="${child.url}">${child.name}</a></li>
                  `).join('')}
                </ul>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // initialize offcanvas using bs js api
  initializeOffcanvas() {
    const offcanvasElement = this.shadowRoot.querySelector('#offcanvasSidebar');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);

    const openButton = this.shadowRoot.querySelector('#openSidebarBtn');
    openButton.addEventListener('click', () => {
      offcanvas.show();
    });

    const toggleButton = this.shadowRoot.querySelector('#toggleSidebar');
    toggleButton.addEventListener('click', () => {
      offcanvas.show();
    });

    const closeButton = this.shadowRoot.querySelector('#closeSidebarBtn');
    closeButton.addEventListener('click', () => {
      offcanvas.hide();
    });
  }
}

// register globally
customElements.define('cul-global-navbar-component', NavbarComponent);

