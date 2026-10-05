// Cart state management via localStorage. No real payment processing —
// checkout submits an "order request" that a human sales rep follows up on.
const CART_KEY = "mdd_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(sku, color, qty) {
  const cart = getCart();
  const existing = cart.find((i) => i.sku === sku && i.color === color);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ sku, color, qty });
  }
  saveCart(cart);
}

function removeFromCart(sku, color) {
  let cart = getCart();
  cart = cart.filter((i) => !(i.sku === sku && i.color === color));
  saveCart(cart);
}

function updateCartQty(sku, color, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.sku === sku && i.color === color);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

function clearCart() {
  saveCart([]);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartTotal() {
  return getCart().reduce((sum, i) => {
    const p = getProductBySku(i.sku);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    const count = cartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function formatPrice(n) {
  return "$" + n.toFixed(2);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
