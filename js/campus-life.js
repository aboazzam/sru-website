/**
 * SRU University — Campus Life Page JS
 * Handles: club category filtering, event tab switching,
 *          club join toggle, page-tab scrollspy
 */

(function () {
  'use strict';

  /* ─── Club Category Filter ──────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const clubCards  = document.querySelectorAll('.club-card[data-category]');

  if (filterBtns.length && clubCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = this.dataset.filter;

        // Update active state on buttons
        filterBtns.forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });

        // Show / hide cards
        clubCards.forEach(function (card) {
          const match = filter === 'all' || card.dataset.category === filter;
          card.setAttribute('data-hidden', match ? 'false' : 'true');

          // Animate in matching cards
          if (match) {
            card.style.animationName = '';
            requestAnimationFrame(function () {
              card.style.opacity   = '0';
              card.style.transform = 'translateY(12px)';
              requestAnimationFrame(function () {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity    = '1';
                card.style.transform  = 'translateY(0)';
              });
            });
          }
        });
      });
    });
  }

  /* ─── Club Join Button Toggle ───────────────────────────────── */
  document.querySelectorAll('.club-join-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // prevent card click
      const isJoined = this.classList.contains('joined');
      if (isJoined) {
        this.classList.remove('joined');
        const enText = this.dataset.en   || 'Join';
        const arText = this.dataset.ar   || 'انضم';
        const lang   = document.documentElement.lang;
        this.textContent = lang === 'ar' ? arText : enText;
      } else {
        this.classList.add('joined');
        const lang = document.documentElement.lang;
        this.textContent = lang === 'ar' ? 'تم الانضمام ✓' : 'Joined ✓';
      }
    });

    btn.setAttribute('tabindex', '0');
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  /* ─── Events Tab Switcher ───────────────────────────────────── */
  const eventTabBtns = document.querySelectorAll('.event-tab-btn[data-tab]');
  const eventPanels  = document.querySelectorAll('.events-panel[id]');

  function activateEventTab(tabId) {
    // Buttons
    eventTabBtns.forEach(function (btn) {
      const isActive = btn.dataset.tab === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Panels
    eventPanels.forEach(function (panel) {
      const isTarget = panel.id === 'tab-' + tabId;
      panel.classList.toggle('active', isTarget);

      if (isTarget) {
        // Re-trigger reveal on newly visible cards
        panel.querySelectorAll('.reveal').forEach(function (el) {
          el.classList.remove('visible');
          requestAnimationFrame(function () {
            el.classList.add('visible');
          });
        });
      }
    });
  }

  if (eventTabBtns.length) {
    eventTabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateEventTab(this.dataset.tab);
      });
    });

    // Keyboard arrow navigation
    eventTabBtns.forEach(function (btn, idx) {
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          var next = eventTabBtns[idx + 1] || eventTabBtns[0];
          next.focus();
          activateEventTab(next.dataset.tab);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          var prev = eventTabBtns[idx - 1] || eventTabBtns[eventTabBtns.length - 1];
          prev.focus();
          activateEventTab(prev.dataset.tab);
        }
      });
    });

    // Activate first tab on load
    var firstTab = eventTabBtns[0];
    if (firstTab) activateEventTab(firstTab.dataset.tab);
  }

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
                tab.classList.toggle('active', (tab.getAttribute('href') || '') === '#' + id);
              });
            }
          });
        },
        { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
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

      var header = document.getElementById('site-header');
      var tabsEl = document.querySelector('.page-tabs');
      var headerH = header ? header.offsetHeight : 72;
      var tabsH   = tabsEl  ? tabsEl.offsetHeight  : 48;
      var offset  = headerH + tabsH + 16;
      var top     = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
