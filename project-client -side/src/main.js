let allProducts = [];

async function fetchDataFromAPI() {
  try {
    const response = await fetch('https://fakestoreapi.com/products/');
    const data = await response.json();
    allProducts = data;
    renderCategoryOptions(data);
    filterAndSearch();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderProducts(products) {
  let html = "";
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  products.forEach((item) => {
    const isFav = favs.includes(String(item.id));
    html += `<div class="card">
      <img src="${item.image}" class="images" alt="">
      <div class="title">${item.title}</div>
      <div class="category">${item.category}</div>
      <div class="price">$${item.price}</div>
      <div class="rate">
        ${item.rating.rate}
        <span class="material-symbols-outlined">star</span>
        <span class="material-symbols-outlined heart-icon" data-id="${item.id}" style="cursor:pointer;color:${isFav ? 'red' : '#bbb'};font-size:2rem;">favorite</span>
        <button class="btn add-cart" data-id="${item.id}">Add to cart</button>
      </div>
      <div class="description">${item.description.substring(0, 60)}...</div>
    </div>`;
  });
  document.getElementById("products").innerHTML = html || "<p>no products found.</p>";

  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.onclick = function() {
      const id = this.getAttribute('data-id');
      const product = products.find(p => String(p.id) === id);
      if (!product) return;
      let cart = JSON.parse(localStorage.getItem('cart') || '{}');
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
      alert("add to cart");
      updateCartCount();
    };
  });

  document.querySelectorAll('.heart-icon').forEach(icon => {
    icon.onclick = function() {
      const id = this.getAttribute('data-id');
      let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
      } else {
        favs.push(id);
        // Falling heart animation
        const heart = document.createElement('span');
        heart.className = 'falling-heart material-symbols-outlined';
        heart.textContent = 'favorite';
        heart.style.position = 'fixed';
        const rect = this.getBoundingClientRect();
        heart.style.left = rect.left + rect.width/2 + 'px';
        heart.style.top = rect.top + 'px';
        heart.style.fontSize = '2.5rem';
        heart.style.color = 'red';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = 9999;
        document.body.appendChild(heart);
        setTimeout(() => {
          heart.style.transition = 'transform 1s cubic-bezier(.4,2,.6,1), opacity 1s';
          heart.style.transform = 'translateY(120px) scale(1.7)';
          heart.style.opacity = '0';
        }, 10);
        setTimeout(() => heart.remove(), 1100);
      }
      localStorage.setItem('favorites', JSON.stringify(favs));
      renderProducts(products);
    };
  });
  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart') || '{}');
  let count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  let cartIcon = document.querySelector('.icons a[href="cart.html"]');
  if (!cartIcon) return;
  let badge = cartIcon.querySelector('.cart-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.style.background = '#e79ea7';
    badge.style.color = '#fff';
    badge.style.borderRadius = '50%';
    badge.style.fontSize = '1rem';
    badge.style.padding = '0.1em 0.6em';
    badge.style.position = 'absolute';
    badge.style.top = '-10px';
    badge.style.right = '-10px';
    badge.style.zIndex = '10';
    cartIcon.style.position = 'relative';
    cartIcon.appendChild(badge);
  }
  badge.textContent = count > 0 ? count : '';
}

function renderCategoryOptions(products) {
  const categories = Array.from(new Set(products.map(p => p.category)));
  const select = document.getElementById('category-filter');
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(option);
  });
}

function filterAndSearch() {
  const category = document.getElementById('category-filter')?.value || 'all';
  const search = document.getElementById('search-bar')?.value.toLowerCase() || '';
  let filtered = allProducts;
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(search));
  }
  renderProducts(filtered);
}

fetchDataFromAPI();







