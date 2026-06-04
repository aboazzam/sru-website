// js/news.js

function getLang() {
  return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

// يُرجع رابط الخبر: رابط خارجي إن وُجد، وإلا صفحة التفاصيل
function resolveUrl(item) {
  if (item.url && item.url !== '#' && item.url.trim() !== '') {
    return item.url;
  }
  return 'news-detail.html?id=' + encodeURIComponent(item.id);
}

async function loadHomeNews() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  try {
    const res = await fetch('admin/data/news.json');
    if (!res.ok) throw new Error('Failed to load news.json');

    const homeData = await res.json();
    const newsItems = homeData.news || [];

    window.homeNewsData = newsItems;
    renderNewsGrid(newsItems);

  } catch (err) {
    console.error('Error loading news:', err);
    // Fallback: أخبار افتراضية عند فشل fetch (مثلاً عند الفتح المحلي)
    const fallback = window._sruNewsData || [];
    if (fallback.length) {
      window.homeNewsData = fallback;
      renderNewsGrid(fallback);
    }
  }
}

function buildNewsCard(item) {
  const lang = getLang();

  const type    = lang === 'ar' ? item.type_ar    : item.type_en;
  const month   = lang === 'ar' ? item.month_ar   : item.month_en;
  const title   = lang === 'ar' ? item.title_ar   : item.title_en;
  const excerpt = lang === 'ar' ? item.excerpt_ar : item.excerpt_en;

  const imgContent = item.image
    ? `<img src="${item.image}" alt="${title}"
            style="width:100%;height:100%;object-fit:cover;" />`
    : `<span class="news-type">${type}</span>`;

  return `
    <article class="news-card reveal">
      <div class="news-img" style="background:${item.color};">
        ${imgContent}
      </div>
      <div class="news-body">
        <div class="news-date">
          <span class="date-day">${item.day}</span>
          <span class="date-month">${month}</span>
        </div>
        <h3 class="news-title">${title}</h3>
        <p class="news-excerpt">${excerpt}</p>
        <a href="${resolveUrl(item)}" class="news-link">
          ${lang === 'ar' ? 'اقرأ المزيد ←' : 'Read More →'}
        </a>
      </div>
    </article>
  `;
}

function renderNewsGrid(newsItems) {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  if (!Array.isArray(newsItems) || !newsItems.length) {
    grid.innerHTML = '<p class="empty-msg">لا توجد أخبار حالياً.</p>';
    return;
  }

  grid.innerHTML = newsItems.map(buildNewsCard).join('');

  // تفعيل الظهور — إضافة visible مباشرةً أولاً لضمان الظهور
  grid.querySelectorAll('.reveal').forEach(function (el) {
    el.classList.add('visible');
  });
  // إعادة تسجيل المراقب للعناصر الجديدة كذلك (للتأثيرات الإضافية)
  if (window.reObserveReveal) {
    window.reObserveReveal();
  }
}

function rebuildNewsGrid() {
  if (!window.homeNewsData) return;
  renderNewsGrid(window.homeNewsData);
}

// تحميل الأخبار مرة واحدة فقط
document.addEventListener('DOMContentLoaded', function () {
  loadHomeNews();
});
