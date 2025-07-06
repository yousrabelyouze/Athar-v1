document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.grid');
  if (!container) return;
  container.innerHTML = '';
  const theatreArticles = articles.filter(a => a.category === 'المسرح');
  theatreArticles.forEach(article => {
    const card = document.createElement('article');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
    card.innerHTML = `
      <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover" loading="lazy">
      <div class="p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-xl font-bold text-gray-800">${article.title}</h3>
          <div class="flex text-yellow-400">${renderStars(article.rating)}</div>
        </div>
        <p class="text-gray-600 mb-4">${article.excerpt}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-primary-600">${article.author}</span>
          <button class="text-primary-700 hover:text-primary-900 text-sm font-medium">التفاصيل والتعليقات →</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
});

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += '<i class="fas fa-star"></i>';
    else if (rating >= i - 0.5) html += '<i class="fas fa-star-half-alt"></i>';
    else html += '<i class="far fa-star"></i>';
  }
  return html;
} 