
async function fetchAllProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products/');
    if (!res.ok) throw new Error("Failed response");
    return await res.json();
  } catch (error) {
    const container = document.getElementById('favorites');
    if (container) container.innerHTML = "<p>Failed to load products.</p>";
    return [];
  }
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function removeFavorite(id) {
  let favs = getFavorites().filter(favId => favId !== String(id));
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function renderFavorites(products) {
  const favIds = getFavorites();
  const favProducts = products.filter(p => favIds.includes(String(p.id)));
  const container = document.getElementById('favorites');
  if (!container) return;

  if (favProducts.length === 0) {
    container.innerHTML = "<p>No favorites yet</p>";
    return;
  }

  container.innerHTML = favProducts.map(product => `
    <div class="card">
      
      <img src="${product.image}" class="images" alt="">
      <div class="title">${product.title}</div>
      <div class="category">${product.category}</div>
      <div class="price">$${product.price}</div>
      <div class="rate">
        ${product.rating?.rate ?? 'N/A'}
        <span class="material-symbols-outlined">star</span>
      </div>
      <div class="description">${product.description.substring(0, 60)}...</div>
      <span class="favorite-heart" data-id="${product.id}" style="cursor:pointer;font-size:2rem;color:red;">&#10084;</span>
      <button class="remove-fav-btn" data-id="${product.id}">remove</button>
    </div>
  `).join('');

  container.querySelectorAll('.remove-fav-btn, .favorite-heart').forEach(el => {
    el.addEventListener('click', function() {
      removeFavorite(this.dataset.id);
      renderFavorites(products);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  fetchAllProducts().then(renderFavorites);
});
