// Shared header / footer / cart-drawer injected on every page.
function renderHeader(activePage) {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML = `
    <header class="site-header">
      <div class="header-inner container">
        <a href="index.html" class="brand">
          <img src="images/logo.png" alt="MonsterDangDang" class="brand-logo" />
        </a>
        <nav class="main-nav" id="main-nav">
          <a href="index.html" data-i18n="nav.home" data-page="home"></a>
          <a href="shop.html" data-i18n="nav.shop" data-page="shop"></a>
          <a href="about.html" data-i18n="nav.about" data-page="about"></a>
        </nav>
        <div class="header-actions">
          <div class="lang-switch">
            <button class="lang-btn" data-lang="zh">中文</button>
            <button class="lang-btn" data-lang="en">EN</button>
          </div>
          <a href="cart.html" class="cart-link" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="cart-count">0</span>
          </a>
          <button class="nav-toggle" id="nav-toggle" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>
    </header>
  `;
  el.querySelectorAll("[data-page]").forEach((a) => {
    if (a.dataset.page === activePage) a.classList.add("active");
  });
  el.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (toggle) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
  applyI18n();
  updateCartBadge();
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-col footer-brand">
          <img src="images/logo.png" alt="MonsterDangDang" class="footer-logo" />
          <p data-i18n="footer.desc"></p>
        </div>
        <div class="footer-col">
          <h4 data-i18n="footer.shop"></h4>
          <a href="shop.html" data-i18n="nav.shop"></a>
          <a href="shop.html?series=magic" data-i18n="nav.magic"></a>
          <a href="shop.html?series=folio" data-i18n="nav.folio"></a>
        </div>
        <div class="footer-col">
          <h4 data-i18n="footer.company"></h4>
          <a href="about.html" data-i18n="nav.about"></a>
          <a href="about.html#contact" data-i18n="about.contact.title"></a>
        </div>
        <div class="footer-col">
          <h4 data-i18n="footer.contact"></h4>
          <a href="tel:15686086666">+86 156 8608 6666</a>
          <a href="mailto:980686092@qq.com">980686092@qq.com</a>
          <span class="footer-address" data-i18n="about.contact.addressValue"></span>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>&copy; 2026 Shenzhen Mingzhenhui Technology Co., Ltd. <span data-i18n="footer.rights"></span></span>
      </div>
    </footer>
  `;
  applyI18n();
}

document.addEventListener("langchange", () => {
  updateCartBadge();
});
