// Page-specific rendering logic.

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 2200);
}

function svgCheck() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
}

function productCardHtml(p) {
  return `
    <div class="product-card">
      <a href="product.html?sku=${p.sku}" class="product-card-img">
        <span class="product-badge">${field(p.badge)}</span>
        <img src="${p.image}" alt="${field(p.name)}">
      </a>
      <div class="product-card-body">
        <a href="product.html?sku=${p.sku}">
          <div class="product-card-name">${field(p.name)}</div>
        </a>
        <div class="product-card-tagline">${field(p.tagline)}</div>
        <div class="product-card-price">${formatPrice(p.price)}</div>
      </div>
      <div class="product-card-actions">
        <a href="product.html?sku=${p.sku}" class="btn btn-outline btn-sm" data-i18n="product.viewDetail"></a>
        <button class="btn btn-primary btn-sm" onclick="quickAdd('${p.sku}')" data-i18n="product.addToCart"></button>
      </div>
    </div>
  `;
}

function quickAdd(sku) {
  const p = getProductBySku(sku);
  if (!p) return;
  addToCart(sku, p.colors[0], 1);
  showToast(t("product.added") + " — " + field(p.name));
}

function renderFeaturedGrid() {
  const el = document.getElementById("featured-grid");
  if (!el) return;
  el.innerHTML = PRODUCTS.map(productCardHtml).join("");
  applyI18n();
  document.addEventListener("langchange", () => {
    el.innerHTML = PRODUCTS.map(productCardHtml).join("");
    applyI18n();
  });
}

/* ---------------- Shop page ---------------- */
function initShopPage() {
  const params = new URLSearchParams(location.search);
  let currentFilter = params.get("series") || "all";
  let currentSort = "default";

  const grid = document.getElementById("shop-grid");
  const tabs = document.querySelectorAll(".filter-tab");
  const sortSelect = document.getElementById("sort-select");

  function render() {
    let list = PRODUCTS.slice();
    if (currentFilter !== "all") list = list.filter((p) => p.series === currentFilter);
    if (currentSort === "priceAsc") list.sort((a, b) => a.price - b.price);
    if (currentSort === "priceDesc") list.sort((a, b) => b.price - a.price);
    grid.innerHTML = list.map(productCardHtml).join("");
    applyI18n();
  }

  tabs.forEach((tab) => {
    if (tab.dataset.filter === currentFilter) tab.classList.add("active");
    tab.addEventListener("click", () => {
      currentFilter = tab.dataset.filter;
      tabs.forEach((tb) => tb.classList.toggle("active", tb === tab));
      render();
    });
  });
  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    render();
  });

  render();
  document.addEventListener("langchange", render);
}

/* ---------------- Product detail page ---------------- */
function initProductPage() {
  const params = new URLSearchParams(location.search);
  const sku = params.get("sku");
  const product = getProductBySku(sku) || PRODUCTS[0];
  let selectedColor = product.colors[0];
  let qty = 1;

  function render() {
    document.getElementById("crumb-name").textContent = field(product.name);
    document.title = field(product.name) + " — MonsterDangDang";

    document.getElementById("product-detail").innerHTML = `
      <div class="product-gallery">
        <img src="${product.image}" alt="${field(product.name)}">
      </div>
      <div class="product-info">
        <span class="product-info-badge">${field(product.badge)}</span>
        <h1>${field(product.name)}</h1>
        <div class="product-info-tagline">${field(product.tagline)}</div>
        <div class="product-info-price">${formatPrice(product.price)}</div>
        <div class="product-info-pricenote" data-i18n="product.priceNote"></div>
        <p class="product-info-desc">${field(product.description)}</p>

        <div class="option-group">
          <div class="option-label"><span data-i18n="product.color"></span>: <span id="color-name">${field(COLOR_PALETTE[selectedColor])}</span></div>
          <div class="color-swatches" id="color-swatches"></div>
        </div>

        <div class="option-group">
          <div class="option-label" data-i18n="product.qty"></div>
          <div class="qty-control">
            <button id="qty-minus" type="button">−</button>
            <input type="text" id="qty-input" value="${qty}" readonly>
            <button id="qty-plus" type="button">+</button>
          </div>
        </div>

        <div class="product-actions">
          <button class="btn btn-primary btn-block" id="add-cart-btn" data-i18n="product.addToCart"></button>
        </div>

        <ul class="feature-list">
          ${product.features.map((f) => `<li>${svgCheck()}<span>${field(f)}</span></li>`).join("")}
        </ul>

        <div class="option-group">
          <div class="option-label" data-i18n="product.compat"></div>
          <div style="font-size:14px;color:var(--ink-soft);">${field(product.compat)}</div>
        </div>

        <div class="trust-badges">
          <span class="trust-badge">${svgCheck()} <span data-i18n="badge.warranty"></span></span>
          <span class="trust-badge">${svgCheck()} <span data-i18n="badge.oem"></span></span>
          <span class="trust-badge">${svgCheck()} <span data-i18n="badge.freeship"></span></span>
        </div>

        <div class="option-group" style="margin-top:28px;">
          <div class="option-label" data-i18n="product.specs"></div>
          <table class="spec-table">
            ${product.specs.map((s) => `<tr><td>${field(s.label)}</td><td>${field(s.value)}</td></tr>`).join("")}
          </table>
        </div>
      </div>
    `;

    // color swatches
    const swatchEl = document.getElementById("color-swatches");
    swatchEl.innerHTML = product.colors
      .map(
        (c) =>
          `<button class="color-swatch ${c === selectedColor ? "selected" : ""}" style="background:${COLOR_PALETTE[c].hex}" data-color="${c}" title="${field(COLOR_PALETTE[c])}"></button>`
      )
      .join("");
    swatchEl.querySelectorAll(".color-swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedColor = btn.dataset.color;
        document.getElementById("color-name").textContent = field(COLOR_PALETTE[selectedColor]);
        swatchEl.querySelectorAll(".color-swatch").forEach((b) => b.classList.toggle("selected", b === btn));
      });
    });

    document.getElementById("qty-minus").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      document.getElementById("qty-input").value = qty;
    });
    document.getElementById("qty-plus").addEventListener("click", () => {
      qty = qty + 1;
      document.getElementById("qty-input").value = qty;
    });
    document.getElementById("add-cart-btn").addEventListener("click", () => {
      addToCart(product.sku, selectedColor, qty);
      showToast(t("product.added") + " — " + field(product.name));
    });

    applyI18n();
    // re-apply color name after i18n text overwrite risk
    document.getElementById("color-name").textContent = field(COLOR_PALETTE[selectedColor]);

    // related
    const related = PRODUCTS.filter((p) => p.series === product.series && p.sku !== product.sku).slice(0, 4);
    document.getElementById("related-grid").innerHTML = related.map(productCardHtml).join("");
    applyI18n();
  }

  render();
  document.addEventListener("langchange", render);
}

/* ---------------- Cart page ---------------- */
function renderCartPage() {
  const container = document.getElementById("cart-container");
  if (!container) return;
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <h2 data-i18n="cart.empty"></h2>
        <p data-i18n="cart.empty.desc"></p>
        <a href="shop.html" class="btn btn-primary" data-i18n="cart.continue"></a>
      </div>
    `;
    applyI18n();
    return;
  }

  const itemsHtml = cart
    .map((item) => {
      const p = getProductBySku(item.sku);
      if (!p) return "";
      return `
        <div class="cart-item">
          <div class="cart-item-img"><img src="${p.image}" alt="${field(p.name)}"></div>
          <div>
            <div class="cart-item-name">${field(p.name)}</div>
            <div class="cart-item-meta">${t("cart.item.color")}: ${field(COLOR_PALETTE[item.color])}</div>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button type="button" onclick="changeCartQty('${item.sku}','${item.color}',${item.qty - 1})">−</button>
                <input type="text" value="${item.qty}" readonly>
                <button type="button" onclick="changeCartQty('${item.sku}','${item.color}',${item.qty + 1})">+</button>
              </div>
            </div>
          </div>
          <div>
            <div class="cart-item-price">${formatPrice(p.price * item.qty)}</div>
            <button class="cart-item-remove" onclick="removeCartItem('${item.sku}','${item.color}')" data-i18n="cart.remove"></button>
          </div>
        </div>
      `;
    })
    .join("");

  const total = cartTotal();

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">${itemsHtml}</div>
      <div class="summary-card">
        <h3 style="margin-bottom:18px;font-size:16px;" data-i18n="cart.summary"></h3>
        <div class="summary-row"><span data-i18n="cart.subtotal"></span><span>${formatPrice(total)}</span></div>
        <div class="summary-row"><span data-i18n="cart.shipping"></span><span data-i18n="cart.shipping.value"></span></div>
        <div class="summary-row total"><span data-i18n="cart.total"></span><span>${formatPrice(total)}</span></div>
        <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:16px;" data-i18n="cart.checkout"></a>
        <a href="shop.html" class="btn btn-outline btn-block" style="margin-top:10px;" data-i18n="cart.continue"></a>
      </div>
    </div>
  `;
  applyI18n();
}

function changeCartQty(sku, color, qty) {
  if (qty < 1) {
    removeCartItem(sku, color);
    return;
  }
  updateCartQty(sku, color, qty);
  renderCartPage();
}

function removeCartItem(sku, color) {
  removeFromCart(sku, color);
  renderCartPage();
}

/* ---------------- Checkout page ---------------- */
function initCheckoutPage() {
  const container = document.getElementById("checkout-container");
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2 data-i18n="checkout.empty"></h2>
        <a href="shop.html" class="btn btn-primary" data-i18n="cart.continue"></a>
      </div>
    `;
    applyI18n();
    return;
  }

  function render() {
    const total = cartTotal();
    const itemsHtml = cart
      .map((item) => {
        const p = getProductBySku(item.sku);
        if (!p) return "";
        return `
          <div class="checkout-summary-item">
            <img src="${p.image}" alt="${field(p.name)}">
            <div style="flex:1;">
              <div class="name">${field(p.name)}</div>
              <div class="meta">${field(COLOR_PALETTE[item.color])} × ${item.qty}</div>
            </div>
            <div style="font-weight:700;">${formatPrice(p.price * item.qty)}</div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = `
      <div class="checkout-layout">
        <div>
          <form id="checkout-form">
            <div class="form-section">
              <h3 data-i18n="checkout.contact"></h3>
              <div class="form-grid">
                <div class="form-field"><label data-i18n="checkout.name"></label><input required name="name" type="text"></div>
                <div class="form-field"><label data-i18n="checkout.email"></label><input required name="email" type="email"></div>
                <div class="form-field"><label data-i18n="checkout.phone"></label><input required name="phone" type="tel"></div>
                <div class="form-field"><label data-i18n="checkout.company"></label><input name="company" type="text"></div>
              </div>
            </div>
            <div class="form-section">
              <h3 data-i18n="checkout.shipping"></h3>
              <div class="form-grid">
                <div class="form-field full"><label data-i18n="checkout.address"></label><input required name="address" type="text"></div>
                <div class="form-field"><label data-i18n="checkout.city"></label><input required name="city" type="text"></div>
                <div class="form-field"><label data-i18n="checkout.country"></label><input required name="country" type="text"></div>
                <div class="form-field"><label data-i18n="checkout.zip"></label><input name="zip" type="text"></div>
              </div>
            </div>
            <div class="form-section">
              <h3 data-i18n="checkout.payment"></h3>
              <div class="payment-options">
                <label class="payment-option"><input type="radio" name="payment" value="bank" checked><span data-i18n="checkout.payment.bank"></span></label>
                <label class="payment-option"><input type="radio" name="payment" value="paypal"><span data-i18n="checkout.payment.paypal"></span></label>
                <label class="payment-option"><input type="radio" name="payment" value="card"><span data-i18n="checkout.payment.card"></span></label>
              </div>
              <div class="payment-note" data-i18n="checkout.payment.note"></div>
            </div>
            <div class="form-section">
              <h3 data-i18n="checkout.notes"></h3>
              <div class="form-field full"><textarea name="notes"></textarea></div>
            </div>
          </form>
        </div>
        <div class="summary-card">
          <h3 style="margin-bottom:16px;font-size:16px;" data-i18n="cart.summary"></h3>
          <div class="checkout-summary-items">${itemsHtml}</div>
          <div class="summary-row"><span data-i18n="cart.subtotal"></span><span>${formatPrice(total)}</span></div>
          <div class="summary-row"><span data-i18n="cart.shipping"></span><span data-i18n="cart.shipping.value"></span></div>
          <div class="summary-row total"><span data-i18n="cart.total"></span><span>${formatPrice(total)}</span></div>
          <button class="btn btn-accent btn-block" id="submit-order-btn" style="margin-top:16px;" data-i18n="checkout.submit"></button>
          <a href="cart.html" class="btn btn-outline btn-block" style="margin-top:10px;" data-i18n="checkout.backToCart"></a>
        </div>
      </div>
    `;
    applyI18n();

    document.getElementById("submit-order-btn").addEventListener("click", () => {
      const form = document.getElementById("checkout-form");
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const orderRef = "MDD" + Date.now().toString().slice(-8);
      const order = {
        ref: orderRef,
        items: cart,
        total: cartTotal(),
        customer: Object.fromEntries(fd.entries()),
        createdAt: new Date().toISOString(),
      };
      const orders = JSON.parse(localStorage.getItem("mdd_orders") || "[]");
      orders.push(order);
      localStorage.setItem("mdd_orders", JSON.stringify(orders));
      localStorage.setItem("mdd_last_order_ref", orderRef);
      clearCart();
      location.href = "confirmation.html";
    });
  }

  render();
  document.addEventListener("langchange", render);
}
