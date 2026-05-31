  /* ═══════════════════════════════════════════════════════════════
     11. HOME NEWS — load from home.json
  ═══════════════════════════════════════════════════════════════ */

  // اين يوجد ملف البيانات (عدّلي المسار إذا لزم)
  const HOME_DATA_URL = 'assets/data/home.json';

  let homeData = null;

  function getLang() {
    return state.lang === 'ar' ? 'ar' : 'en';
  }

  function t(obj, key) {
    const lang = getLang();
    const value = obj[key];
    if (!value) return '';
    if (typeof value === 'object') {
      return value[lang] || value.en || '';
    }
    return value;
  }

  // يبني بطاقة خبر واحدة
  function buildNewsCard(item) {
    const lang = getLang();
    const imgContent = item.image
      ? `<img src="${item.image}" alt="${t(item,'title')}" style="width:100%;height:100%;object-fit:cover;" />`
      : `<span class="news-type">${t(item,'type')}</span>`;

    return `
      <article class="news-card reveal">
        <div class="news-img" style="background:${item.color || '#EAE2FF'};">
          ${imgContent}
        </div>
        <div class="news-body">
          <div class="news-date">
            <span class="date-day">${item.day}</span>
            <span class="date-month">${t(item,'month')}</span>
          </div>
          <h3 class="news-title">${t(item,'title')}</h3>
          <p class="news-excerpt">${t(item,'excerpt')}</p>
          <a href="${item.url || '#'}" class="news-link">
            ${lang === 'ar' ? 'اقرأ المزيد ←' : 'Read More →'}
          </a>
        </div>
      </article>`;
  }

  function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid || !homeData || !homeData.news) return;

    grid.innerHTML = homeData.news.map(buildNewsCard).join('');

    // إعادة تفعيل الـ reveal على البطاقات الجديدة
    if ('IntersectionObserver' in window) {
      document.querySelectorAll('.news-card.reveal').forEach(function (el) {
        el.classList.remove('visible');
      });
    } else {
      document.querySelectorAll('.news-card.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  function loadHomeData() {
    if (!document.getElementById('news-grid')) return; // الصفحة ليست الرئيسية

    fetch(HOME_DATA_URL)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        homeData = data;
        renderNews();
      })
      .catch(function (err) {
        console.error('Failed to load home.json', err);
      });
  }

  // حمّل الأخبار عند تحميل الصفحة
  window.addEventListener('DOMContentLoaded', loadHomeData);

  // أعد بناء الأخبار عند تغيير اللغة
  const _applyLanguage = applyLanguage;
  applyLanguage = function (lang) {
    _applyLanguage(lang);
    renderNews();
  };
