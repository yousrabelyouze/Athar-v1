document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const container = document.getElementById('article-detail');
  if (!id || !container) {
    container.innerHTML = '<p class="text-center text-red-600">المقال غير موجود.</p>';
    return;
  }
  const article = articles.find(a => a.id === id);
  if (!article) {
    container.innerHTML = '<p class="text-center text-red-600">المقال غير موجود.</p>';
    return;
  }

  // Charger commentaires et notes depuis localStorage
  const commentsKey = `athar_comments_${id}`;
  const ratingsKey = `athar_ratings_${id}`;
  let comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
  let ratings = JSON.parse(localStorage.getItem(ratingsKey) || '[]');

  function getAverageRating() {
    if (!ratings.length) return article.rating;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  }

  function render() {
    container.innerHTML = `
      <img src="${article.image}" alt="${article.title}" class="w-full h-64 object-cover rounded mb-6">
      <h2 class="text-3xl font-bold mb-2">${article.title}</h2>
      <div class="flex items-center gap-4 mb-4">
        <span class="text-primary-700 font-medium">${article.author}</span>
        <span class="flex text-yellow-400" id="rating-stars">${renderStars(getAverageRating())}</span>
        <span class="text-sm text-gray-500">(${getAverageRating()} / 5)</span>
      </div>
      <div class="mb-4">
        <span class="text-gray-700">قيّم هذا المقال:</span>
        <span id="rate-interactive" class="flex text-yellow-400 cursor-pointer text-2xl" style="direction:ltr; display:inline-flex; vertical-align:middle;">
          ${[1,2,3,4,5].map(i => `<i class="fa-star ${userRating() >= i ? 'fas' : 'far'}" data-star="${i}"></i>`).join('')}
        </span>
      </div>
      <p class="text-lg text-gray-700 mb-6">${article.excerpt}</p>
      <a href="index.html" class="text-primary-600 hover:underline">&larr; العودة إلى جميع المقالات</a>
      <hr class="my-8">
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-4">التعليقات</h3>
        <div id="comments-list">
          ${comments.length ? comments.map(c => `<div class='mb-2 p-3 bg-gray-50 rounded'><span class='font-bold text-primary-700'>${escapeHTML(c.name)}</span>: <span>${escapeHTML(c.text)}</span></div>`).join('') : '<div class="text-gray-400">لا توجد تعليقات بعد.</div>'}
        </div>
        <form id="comment-form" class="mt-4">
          <input type="text" name="name" placeholder="اسمك" class="border rounded px-3 py-2 mb-2 w-full" required>
          <textarea name="text" placeholder="اكتب تعليقك..." class="border rounded px-3 py-2 mb-2 w-full" required></textarea>
          <button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded">إرسال</button>
        </form>
      </div>
    `;
    // Ajout listeners pour rating interactif
    const rateStars = document.getElementById('rate-interactive');
    if (rateStars) {
      rateStars.querySelectorAll('i').forEach(star => {
        star.addEventListener('click', function(e) {
          const val = parseInt(star.getAttribute('data-star'), 10);
          ratings.push(val);
          localStorage.setItem(ratingsKey, JSON.stringify(ratings));
          render();
        });
      });
    }
    // Ajout listener pour le formulaire de commentaire
    const form = document.getElementById('comment-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = form.name.value.trim();
        const text = form.text.value.trim();
        if (name && text) {
          comments.push({ name, text });
          localStorage.setItem(commentsKey, JSON.stringify(comments));
          render();
        }
      });
    }
  }

  function userRating() {
    // Pour simplifier, on ne gère pas l'utilisateur, donc on ne surligne pas la note de l'utilisateur
    return 0;
  }

  render();
});

function renderStars(rating) {
  let html = '';
  rating = parseFloat(rating);
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += '<i class="fas fa-star"></i>';
    else if (rating >= i - 0.5) html += '<i class="fas fa-star-half-alt"></i>';
    else html += '<i class="far fa-star"></i>';
  }
  return html;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c];
  });
} 