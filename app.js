// Données d'exemple pour les articles
const articles = [
  {
    id: 1,
    title: 'قراءة في مسرحية حديثة',
    excerpt: 'مراجعة وتحليل لأحدث الأعمال المسرحية العربية...',
    image: 'assets/theatre1.jpg',
    author: 'سارة منصور',
    rating: 4,
    comments: ['مقال رائع!', 'أحببت التحليل.'],
    popular: true
  },
  {
    id: 2,
    title: 'فيلم الشهر: رؤية نقدية',
    excerpt: 'نظرة معمقة على فيلم أثار الجدل مؤخراً...',
    image: 'assets/cinema1.jpg',
    author: 'أحمد الجبالي',
    rating: 5,
    comments: ['مقال ممتاز.', 'تحليل موضوعي.'],
    popular: true
  },
  {
    id: 3,
    title: 'كتاب يستحق القراءة',
    excerpt: 'استعراض لكتاب جديد في الساحة الأدبية...',
    image: 'assets/book1.jpg',
    author: 'ليلى عبد الله',
    rating: 3,
    comments: ['شوقتني لقراءة الكتاب.'],
    popular: false
  }
];

function renderArticles(listId, filterFn) {
  const container = document.getElementById(listId);
  container.innerHTML = '';
  articles.filter(filterFn).forEach(article => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <img src="${article.image}" alt="صورة المقال">
      <div class="article-title">${article.title}</div>
      <div class="article-excerpt">${article.excerpt}</div>
      <div class="article-author">بقلم: ${article.author}</div>
      <div class="stars" data-id="${article.id}">
        ${[1,2,3,4,5].map(i => `<span class="star${i <= article.rating ? ' selected' : ''}" data-star="${i}">&#9733;</span>`).join('')}
      </div>
      <div class="comments-section">
        <div class="comments-list">
          ${article.comments.map(c => `<div class="comment">${c}</div>`).join('')}
        </div>
        <form class="comment-form" data-id="${article.id}">
          <textarea placeholder="أضف تعليقك..." required></textarea>
          <button type="submit">تعليق</button>
        </form>
      </div>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderArticles('recent-list', a => true);
  renderArticles('popular-list', a => a.popular);

  // Gestion de la notation par étoiles
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('star')) {
      const articleId = +e.target.parentElement.getAttribute('data-id');
      const starValue = +e.target.getAttribute('data-star');
      const article = articles.find(a => a.id === articleId);
      article.rating = starValue;
      renderArticles('recent-list', a => true);
      renderArticles('popular-list', a => a.popular);
    }
  });

  // Gestion des commentaires
  document.body.addEventListener('submit', function(e) {
    if (e.target.classList.contains('comment-form')) {
      e.preventDefault();
      const articleId = +e.target.getAttribute('data-id');
      const textarea = e.target.querySelector('textarea');
      const comment = textarea.value.trim();
      if (comment) {
        const article = articles.find(a => a.id === articleId);
        article.comments.push(comment);
        renderArticles('recent-list', a => true);
        renderArticles('popular-list', a => a.popular);
      }
    }
    if (e.target.id === 'feedback-form') {
      e.preventDefault();
      alert('شكراً لملاحظتك!');
      e.target.reset();
    }
  });
}); 