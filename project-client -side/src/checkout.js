function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '{}');
}

function renderCheckoutSummary() {
  const cart = getCart();
  const items = Object.values(cart);
  const container = document.getElementById('checkout-summary');
  const form = document.getElementById('checkout-form');
  if (items.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    if (form) form.style.display = 'none';
    return;
  }
  let total = 0;
  let html = `<table>\n<tr>\n<th>Product</th>\n<th>Qty</th>\n<th>Subtotal</th>\n</tr>`;
  items.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    html += `<tr>\n<td>${item.title}</td>\n<td>${item.quantity}</td>\n<td>$${subtotal.toFixed(2)}</td>\n</tr>`;
  });
  html += `<tr>\n<td colspan="2" style="text-align:right;font-weight:bold;">Total:</td>\n<td style="font-weight:bold;">$${total.toFixed(2)}</td>\n</tr></table>`;
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  renderCheckoutSummary();
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const address = document.getElementById('address').value.trim();
      if (!name || !email || !address) {
        alert('Please fill in all fields.');
        return;
      }
      
      if (!/\S+@\S+\.\S+/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      document.getElementById('success-message').textContent = "Thank you for your order! Your order has been placed successfully.";
      document.getElementById('success-message').style.display = 'block';
      document.getElementById('checkout-form').style.display = 'none';
      
      localStorage.removeItem('cart');
    });
  }
});