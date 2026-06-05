/**
 * SRU News Module — news/news.js
 * Handles loading, rendering, and filtering news across all pages.
 */

(function (global) {
  'use strict';

  var NEWS_JSON       = 'news/data/news.json';
  var LS_KEY          = 'sru_news_v2';        // editor localStorage key
  var LS_PUBLISHED    = 'sru_news_published'; // published snapshot key

  // ── Merge helper: localStorage items override JSON items by id ──
  function mergeNews(jsonItems, lsItems) {
    if (!lsItems || !lsItems.length) return jsonItems;

    // Build a map of JSON items
    var map = {};
    jsonItems.forEach(function (n) { map[String(n.id)] = n; });

    // Add/override with localStorage items
    lsItems.forEach(function (n) {
      map[String(n.id)] = n;
    });

    // Sort by date descending
    return Object.values(map).sort(function (a, b) {
      return (b.date || '') > (a.date || '') ? 1 : -1;
    });
  }


  // ── Helpers ──────────────────────────────────────────────
  function getLang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'en';
  }

  function t(item, key) {
    var lang = getLang();
    return item[key + '_' + lang] || item[key + '_ar'] || item[key + '_en'] || '';
  }

  function resolveUrl(item) {
    if (item.url && item.url !== '#' && item.url.trim() !== '') return item.url;
    return 'news-detail.html?id=' + encodeURIComponent(item.id);
  }

  // ── Build homepage news card ──────────────────────────────
  function buildCard(item) {
    var lang    = getLang();
    var title   = t(item, 'title');
    var excerpt = t(item, 'excerpt');
    var type    = t(item, 'type');
    var month   = t(item, 'month');

    var imgContent = item.image
      ? '<img src="' + item.image + '" alt="' + title + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy">'
      : '<span class="news-type">' + type + '</span>';

    var collegeTag = item.college
      ? '<span class="news-college-tag" data-college="' + item.college + '">' + getCollegeLabel(item.college, lang) + '</span>'
      : '';

    return [
      '<article class="news-card reveal" data-college="' + (item.college || '') + '">',
      '  <div class="news-img" style="background:' + (item.color || '#3D1F6E') + ';">',
      '    ' + imgContent,
      '  </div>',
      '  <div class="news-body">',
      '    <div class="news-meta">',
      '      <div class="news-date">',
      '        <span class="date-day">'   + (item.day || '')   + '</span>',
      '        <span class="date-month">' + (month   || '')   + '</span>',
      '      </div>',
      collegeTag,
      '    </div>',
      '    <h3 class="news-title">' + title + '</h3>',
      '    <p class="news-excerpt">' + excerpt + '</p>',
      '    <a href="' + resolveUrl(item) + '" class="news-link">',
      '      ' + (lang === 'ar' ? 'اقرأ المزيد ←' : 'Read More →'),
      '    </a>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function getCollegeLabel(college, lang) {
    var labels = {
      medicine:  { ar: 'كلية الطب',            en: 'Medicine' },
      nursing:   { ar: 'كلية التمريض',          en: 'Nursing' },
      business:  { ar: 'كلية الأعمال',          en: 'Business' },
      sciences:  { ar: 'كلية العلوم التطبيقية', en: 'Sci. & Health' }
    };
    return labels[college] ? labels[college][lang] : college;
  }

  // ── Render grid ───────────────────────────────────────────
  function renderGrid(items, gridEl) {
    if (!gridEl) return;

    if (!Array.isArray(items) || !items.length) {
      gridEl.innerHTML = '<p class="empty-msg">' +
        (getLang() === 'ar' ? 'لا توجد أخبار حالياً.' : 'No news at the moment.') + '</p>';
      return;
    }

    gridEl.innerHTML = items.map(buildCard).join('');

    // Reveal
    gridEl.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
    if (global.reObserveReveal) global.reObserveReveal();
  }

  // ── Read localStorage news (from editor) ─────────────────
  function getLSNews() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch (e) { return []; }
  }

  // ── Load and cache ────────────────────────────────────────
  function loadNews(callback) {
    if (global._sruNewsCache) { callback(null, global._sruNewsCache); return; }

    var lsItems = getLSNews();

    fetch(NEWS_JSON)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var jsonItems = data.news || [];
        // Merge: localStorage items (editor drafts) override JSON items
        var merged = mergeNews(jsonItems, lsItems);
        global._sruNewsCache = merged;
        callback(null, merged);
      })
      .catch(function (err) {
        // fetch failed (local file:// or network error) — use localStorage + fallback
        var fallback = global._sruNewsData || [];
        var merged   = mergeNews(fallback, lsItems);
        global._sruNewsCache = merged;
        callback(err, merged);
      });
  }

  // ── Public API ────────────────────────────────────────────

  /**
   * Load all news into a grid (homepage)
   * @param {string} gridId  - DOM id of the grid container
   * @param {number} [limit] - max items (default: all)
   */
  function loadHomeNews(gridId, limit) {
    var grid = document.getElementById(gridId || 'news-grid');
    if (!grid) return;

    loadNews(function (err, items) {
      var shown = limit ? items.slice(0, limit) : items;
      renderGrid(shown, grid);
      global.homeNewsData = items;
    });
  }

  /**
   * Load college-specific news into a grid
   * @param {string} college - "medicine" | "nursing" | "business" | "sciences"
   * @param {string} gridId  - DOM id of the grid container
   * @param {number} [limit] - max items (default: 3)
   */
  function loadCollegeNews(college, gridId, limit) {
    var grid = document.getElementById(gridId || 'college-news-grid');
    if (!grid) return;

    loadNews(function (err, items) {
      var filtered = items.filter(function (n) {
        return n.college === college || n.cat === 'academic';
      });
      // Prefer college-tagged items first, then fallback to academic
      var tagged   = items.filter(function (n) { return n.college === college; });
      var academic = items.filter(function (n) { return !n.college && n.cat === 'academic'; });
      var shown    = tagged.concat(academic).slice(0, limit || 3);

      renderGrid(shown.length ? shown : items.slice(0, limit || 3), grid);
    });
  }

  /**
   * Rebuild grid (for language switch)
   */
  function rebuildNewsGrid() {
    if (!global.homeNewsData) return;
    var grid = document.getElementById('news-grid');
    renderGrid(global.homeNewsData, grid);
  }

  /**
   * Clear cache (call after editor saves new items)
   */
  function clearCache() {
    global._sruNewsCache = null;
  }

  // Expose API
  global.SRUNews = {
    load:        loadHomeNews,
    loadCollege: loadCollegeNews,
    rebuild:     rebuildNewsGrid,
    getLabel:    getCollegeLabel,
    clearCache:  clearCache
  };

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('news-grid')) {
      loadHomeNews('news-grid');
    }
  });

}(window));
