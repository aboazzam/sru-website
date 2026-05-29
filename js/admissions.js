/**
 * SRU University — Admissions Page JS
 * Handles: page-tabs scrollspy, doc-item hover, step highlighting,
 *          page-tab smooth scroll, dates table row highlight
 */

(function () {
  'use strict';

  /* ─── In-Page Tab Scrollspy ─────────────────────────────────── */
  const pageTabs = document.querySelectorAll('.page-tab');

  if (pageTabs.length && 'IntersectionObserver' in window) {
    const sectionIds = Array.from(pageTabs)
      .map(function (t) { return (t.getAttribute('href') || '').replace('#', ''); })
      .filter(Boolean);

    const sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    const tabObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            pageTabs.forEach(function (tab) {
              tab.classList.toggle('active', (tab.getAttribute('href') || '') === '#' + activeId);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach(function (s) { tabObs.observe(s); });
  }

  /* ─── Page Tab click: smooth scroll with offset ─────────────── */
  pageTabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();

      const header = document.getElementById('site-header');
      const tabsEl = document.querySelector('.page-tabs');
      const headerH = header ? header.offsetHeight : 72;
      const tabsH   = tabsEl  ? tabsEl.offsetHeight  : 48;
      const offset  = headerH + tabsH + 16;
      const top     = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── Process Step: highlight on scroll-into-view ───────────── */
  if ('IntersectionObserver' in window) {
    const steps = document.querySelectorAll('.process-step');

    const stepObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('step-active', entry.isIntersecting);
        });
      },
      { threshold: 0.6 }
    );

    steps.forEach(function (step) { stepObs.observe(step); });
  }

  /* ─── Dates Table: highlight today-ish row ───────────────────── */
  (function highlightNextDate() {
    const rows = document.querySelectorAll('.dates-table tbody tr');
    const now  = Date.now();

    // Parse date from cell text (format: "01 Jun 2026" or "24–28 Aug 2026")
    rows.forEach(function (row) {
      const dateCell = row.querySelector('.date-value');
      if (!dateCell) return;

      const rawText = dateCell.textContent.trim();
      // Take the first date segment (before any em-dash)
      const firstPart = rawText.split('–')[0].trim();
      const parsed    = Date.parse(firstPart);

      if (!isNaN(parsed)) {
        const diff = parsed - now;
        // If this date is the next upcoming one (within 30 days), style it
        if (diff > 0 && diff < 30 * 24 * 60 * 60 * 1000) {
          row.style.background = 'rgba(0,180,200,0.06)';
          row.style.fontWeight = '600';
        }
      }
    });
  })();

  /* ─── Document checklist: toggle check on click ─────────────── */
  document.querySelectorAll('.doc-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const check = this.querySelector('.doc-check');
      if (!check) return;

      const isChecked = check.getAttribute('data-checked') === 'true';

      if (isChecked) {
        check.removeAttribute('data-checked');
        check.style.background  = '';
        check.style.borderColor = '';
        check.innerHTML          = '';
      } else {
        check.setAttribute('data-checked', 'true');
        check.style.background  = 'var(--color-cyan)';
        check.style.borderColor = 'var(--color-cyan)';
        check.innerHTML          = '<svg viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2.5" style="width:10px;height:10px;"><polyline points="2,6 5,9 10,3"/></svg>';
      }
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  /* ─── Portal Feature cards: subtle stagger on scroll ────────── */
  if ('IntersectionObserver' in window) {
    const pfFeatures = document.querySelectorAll('.portal-feature');

    const pfObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, idx) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.style.opacity  = '1';
              entry.target.style.transform = 'translateY(0)';
            }, idx * 80);
            pfObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    pfFeatures.forEach(function (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      pfObs.observe(el);
    });
  }

})();
