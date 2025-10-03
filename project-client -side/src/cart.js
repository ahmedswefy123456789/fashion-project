function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '{}');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  const items = Object.values(cart);
  const container = document.getElementById('cart');
  if (!container) return;
  if (items.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  let total = 0;
  let c = `<table style="width:100%;max-width:1100px;margin:auto;border-collapse:collapse;background:#fff;border-radius:8px;box-shadow:0 2px 8px #0001;">\n<tr>\n<th>Product</th>\n<th>Title</th>\n<th>Price</th>\n<th>Qty</th>\n<th>Subtotal</th>\n<th>Remove</th>\n</tr>`;
  items.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    c += `<tr>
      <td><img src="${item.image}" alt="" style="width:50px;height:50px;object-fit:contain;"></td>
      <td>${item.title}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="qty-input" style="width:50px;" aria-label="Quantity">
      </td>
      <td>$${subtotal.toFixed(2)}</td>
      <td>
        <button class="remove-cart-btn" data-id="${item.id}" aria-label="Remove from cart" style="min-width:90px;padding:0.5rem 1.2rem;font-size:1rem;">Remove</button>
      </td>
    </tr>`;
  });
  c += `<tr>\n<td colspan="4" style="text-align:right;font-weight:bold;">Total:</td>\n<td colspan="2" style="font-weight:bold;">$${total.toFixed(2)}</td>\n</tr>`;
  c += `<tr>\n<td colspan="6" style="text-align:center;">\n<button id="checkout-btn" style="margin:1.5rem auto;display:inline-block;font-size:1.2rem;padding:0.7rem 2rem;background:#e79ea7;color:#fff;border:none;border-radius:4px;cursor:pointer;transition:background 0.2s;">Checkout</button>\n</td>\n</tr>`;
  c += `</table>`;
  container.innerHTML = c;

  
  container.querySelectorAll('.remove-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      removeFromCart(id);
    });
  });
  
  container.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', function() {
      const id = this.getAttribute('data-id');
      let qty = parseInt(this.value);
      if (isNaN(qty) || qty < 1) qty = 1;
      updateQuantity(id, qty);
    });
  });
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      const cart = getCart();
      if (Object.keys(cart).length === 0) {
        alert('Your cart is empty. Add items before checking out.');
        return;
      }
      window.location.href = 'checkout.html';
    });
  }
}
// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
  renderCart();
});
function removeFromCart(id) {
  let cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}
function updateQuantity(id, qty) {
  let cart = getCart();
  if (cart[id]) {
    cart[id].quantity = qty;
    if (cart[id].quantity < 1) {
      delete cart[id];
    }
    saveCart(cart);
    renderCart();
  }
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart') || '{}');
  const id = String(product.id);
  if (cart[id]) {
    cart[id].quantity += 1;
  } else {
    cart[id] = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    };
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart');
}
