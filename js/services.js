/**
 * SRU University — Services Page JS
 * Handles: how-to-apply accordions, page-tab scrollspy,
 *          smooth scroll with header offset
 */

(function () {
  'use strict';

  /* ─── How-To-Apply Accordion ────────────────────────────────── */
  var accordions = [
    { btn: 'housing-hta-btn',   body: 'housing-hta-body'   },
    { btn: 'transport-hta-btn', body: 'transport-hta-body' },
    { btn: 'hajj-hta-btn',      body: 'hajj-hta-body'      },
    { btn: 'financial-hta-btn', body: 'financial-hta-body' },
  ];

  accordions.forEach(function (pair) {
    var btn  = document.getElementById(pair.btn);
    var body = document.getElementById(pair.body);
    if (!btn || !body) return;

    btn.addEventListener('click', function () {
      var isOpen = this.getAttribute('aria-expanded') === 'true';

      // Close all other accordions
      accordions.forEach(function (other) {
        if (other.btn === pair.btn) return;
        var otherBtn  = document.getElementById(other.btn);
        var otherBody = document.getElementById(other.body);
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherBody) otherBody.classList.remove('open');
      });

      // Toggle this one
      this.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      body.classList.toggle('open', !isOpen);
    });

    // Keyboard support
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

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
      var tabsH   = tabsEl  ? tabsEl.offsetHeight  : 48;
      var offset  = headerH + tabsH + 16;
      var top     = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── Service nav cards: smooth scroll too ──────────────────── */
  document.querySelectorAll('.service-nav-card[href^="#"]').forEach(function (card) {
    card.addEventListener('click', function (e) {
      var target = document.getElementById(this.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();

      var header  = document.getElementById('site-header');
      var tabsEl  = document.querySelector('.page-tabs');
      var headerH = header ? header.offsetHeight : 72;
      var tabsH   = tabsEl  ? tabsEl.offsetHeight  : 48;
      var offset  = headerH + tabsH + 24;
      var top     = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── Portal CTA: track link clicks (analytics-ready stub) ─── */
  var portalLinks = document.querySelectorAll('a[href*="student.sru.edu.sa"]');
  portalLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // Stub: replace with real analytics call (e.g. gtag or Plausible)
      // console.log('Portal link clicked:', this.href);
    });
  });

})();
