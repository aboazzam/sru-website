// js/home-news.js

// دالة للحصول على اللغة الحالية من الـ <html>
function getLang() {
  return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

// تحميل بيانات الصفحة الرئيسية من home.json واستخدام جزء الأخبار منها
async function loadHomeNews() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  try {
    const res = await fetch('data/home.json'); // عدّلي المسار حسب مكان الملف الحقيقي
    if (!res.ok) throw new Error('Failed to load home.json');

    const homeData = await res.json();
    const newsItems = homeData.news || [];

    // خزن البيانات في global لإعادة البناء عند تغيير اللغة (إن رغبتِ)
    window.homeNewsData = newsItems;

    renderNewsGrid(newsItems);
  } catch (err) {
    console.error('Error loading news:', err);
  }
}

// تحويل عنصر خبر من home.json إلى كرت HTML
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
        <a href="${item.url || '#'}" class="news-link">
          ${lang === 'ar' ? 'اقرأ المزيد ←' : 'Read More →'}
        </a>
      </div>
    </article>
  `;
}

// رسم الشبكة داخل #news-grid
function renderNewsGrid(newsItems) {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  grid.innerHTML = newsItems.map(buildNewsCard).join('');
}

// إعادة بناء الأخبار عند تغيير اللغة (اختياري)
// استدعي هذه من applyLanguage(lang) إن أحببت أن تتغيّر الأخبار فوراً
function rebuildNewsGrid() {
  if (!window.homeNewsData) return;
  renderNewsGrid(window.homeNewsData);
}

// تحميل الأخبار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  loadHomeNews();
});
