/**
 * SRU University — Digital Experience Page JS
 * Handles: page-tab scrollspy + smooth scroll,
 *          connected-item hover pulse, tech-stat counter
 */

(function () {
  'use strict';

  /* ─── Page-Tab Scrollspy ────────────────────────────────────── */
  var pageTabs = document.querySelectorAll('.page-tab');

  if (pageTabs.length && 'IntersectionObserver' in window) {
    var sectionIds = Array.from(pageTabs)
      .map(function (t) { return (t.getAttribute('href') || '').slice(1); })
      .filter(Boolean);

    var sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (sections.length) {
      var tabObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var id = entry.target.id;
              pageTabs.forEach(function (tab) {
                tab.classList.toggle('active',
                  (tab.getAttribute('href') || '') === '#' + id);
              });
            }
          });
        },
        { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' }
      );

      sections.forEach(function (s) { tabObs.observe(s); });
    }
  }

  /* ─── Page-Tab smooth scroll with offset ───────────────────── */
  pageTabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();

      var header  = document.getElementById('site-header');
      var tabsEl  = document.querySelector('.page-tabs');
      var headerH = header ? header.offsetHeight : 72;
      var tabsH   = tabsEl ? tabsEl.offsetHeight : 48;
      var top     = target.getBoundingClientRect().top + window.scrollY - (headerH + tabsH + 16);
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── Tech Stats Counter Animation ─────────────────────────── */
  if ('IntersectionObserver' in window) {
    var statsEl = document.querySelector('.tech-stats');
    if (statsEl) {
      var statNums = statsEl.querySelectorAll('.tech-stat-num');
      var counted  = false;

      var statsObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          statNums.forEach(function (el) {
            var raw = el.textContent.trim();
            // Extract leading numeric part (handles "20,000+", "99.9%", "15+", "<2 min")
            var match = raw.match(/^[<]?([\d,]+\.?\d*)/);
            if (!match) return;

            var target = parseFloat(match[1].replace(/,/g, ''));
            var prefix = raw.startsWith('<') ? '<' : '';
            var suffix = raw.replace(/^[<]?[\d,]+\.?\d*/, '');
            var start  = 0;
            var dur    = 1800;
            var startTime = null;

            function step(ts) {
              if (!startTime) startTime = ts;
              var progress = Math.min((ts - startTime) / dur, 1);
              var ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
              var current = Math.round(ease * target);
              // Format with comma thousands separator if original had it
              var formatted = raw.includes(',')
                ? current.toLocaleString()
                : current.toString();
              // Preserve decimal for e.g. 99.9
              if (match[1].includes('.')) {
                formatted = (ease * target).toFixed(1);
              }
              el.textContent = prefix + formatted + suffix;
              if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
          });
          statsObs.disconnect();
        }
      }, { threshold: 0.5 });

      statsObs.observe(statsEl);
    }
  }

  /* ─── Connected items: entrance stagger ────────────────────── */
  if ('IntersectionObserver' in window) {
    var connItems = document.querySelectorAll('.conn-item');

    var connObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(connItems).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (idx % 4) * 60 + Math.floor(idx / 4) * 80);
          connObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    connItems.forEach(function (el) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(14px)';
      el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      connObs.observe(el);
    });
  }

  /* ─── Feature cards: stagger on scroll ─────────────────────── */
  if ('IntersectionObserver' in window) {
    var cards = document.querySelectorAll('.feature-card');

    var cardObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, localIdx) {
        if (entry.isIntersecting) {
          var globalIdx = Array.from(cards).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (globalIdx % 3) * 80);
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card) {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(20px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      cardObs.observe(card);
    });
  }

})();
