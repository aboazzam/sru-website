/**
 * SRU University — Main JavaScript
 * Handles: language toggle, sticky header, mobile nav,
 *          counter animation, scroll reveal, scrollspy
 */

(function () {
  'use strict';

  /* ─── State ──────────────────────────────────────────────────── */
  const state = {
    lang: localStorage.getItem('sru-lang') || 'en',
    navOpen: false,
    countersTriggered: false,
  };

  /* ─── DOM References ─────────────────────────────────────────── */
  const html         = document.documentElement;
  const header       = document.getElementById('site-header');
  const hamburger    = document.getElementById('hamburger');
  const primaryNav   = document.getElementById('primary-nav');
  const navOverlay   = document.getElementById('nav-overlay');
  const langToggle   = document.getElementById('lang-toggle');
  const langLabel    = document.getElementById('lang-label');
  const rtlLink      = document.getElementById('rtl-stylesheet');
  const body         = document.body;

  /* ═══════════════════════════════════════════════════════════════
     1. LANGUAGE TOGGLE
  ═══════════════════════════════════════════════════════════════ */

  /**
   * Swap all bilingual text nodes
   * Elements can use: data-ar / data-en  OR
   *                   data-lang="ar"  /  data-lang="en"  for logo spans
   */
  function applyLanguage(lang) {
    const isAr = lang === 'ar';

    // Set HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    // Toggle RTL stylesheet
    if (rtlLink) {
      rtlLink.disabled = !isAr;
    }

    // Update lang toggle button label
    if (langLabel) {
      langLabel.textContent = isAr ? 'English' : 'العربية';
    }

    // Swap all elements with data-ar / data-en attributes
    document.querySelectorAll('[data-ar][data-en]').forEach(function (el) {
      el.textContent = isAr ? el.dataset.ar : el.dataset.en;
    });

    // Persist
    localStorage.setItem('sru-lang', lang);
    state.lang = lang;
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      const next = state.lang === 'en' ? 'ar' : 'en';
      applyLanguage(next);
    });
  }

  // Apply saved language on load
  applyLanguage(state.lang);

  /* ═══════════════════════════════════════════════════════════════
     2. STICKY HEADER
  ═══════════════════════════════════════════════════════════════ */

  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on init

  /* ═══════════════════════════════════════════════════════════════
     3. MOBILE HAMBURGER NAV
  ═══════════════════════════════════════════════════════════════ */

  function openNav() {
    state.navOpen = true;
    body.classList.add('nav-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    // Prevent body scroll
    body.style.overflow = 'hidden';
  }

  function closeNav() {
    state.navOpen = false;
    body.classList.remove('nav-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      state.navOpen ? closeNav() : openNav();
    });
  }

  // Close on overlay click
  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }

  // Close on nav link click (mobile)
  if (primaryNav) {
    primaryNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) closeNav();
      });
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.navOpen) closeNav();
  });

  /* ═══════════════════════════════════════════════════════════════
     4. SCROLL REVEAL (IntersectionObserver)
  ═══════════════════════════════════════════════════════════════ */

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  function reObserveReveal() {
  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
    revealObserver.observe(el);
  });
}
window.reObserveReveal = reObserveReveal;
  /* ═══════════════════════════════════════════════════════════════
     5. COUNTER ANIMATION
  ═══════════════════════════════════════════════════════════════ */

  /**
   * Animate a number from 0 to target over ~1.8s with easeOutQuart
   */
  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start    = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = Math.round(eased * target);

      // Format with locale separator
      el.textContent = current.toLocaleString() + (progress < 1 ? '' : suffix);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const statsSection = document.getElementById('stats');

    if (statsSection) {
      const counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !state.countersTriggered) {
              state.countersTriggered = true;

              document.querySelectorAll('.stat-number').forEach(function (el) {
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                animateCounter(el, target, suffix);
              });

              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );

      counterObserver.observe(statsSection);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     6. SCROLLSPY — Active Nav Link
  ═══════════════════════════════════════════════════════════════ */

  (function initScrollspy() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!navLinks.length) return;

    const sectionIds = Array.from(navLinks).map(function (l) {
      return l.getAttribute('href').slice(1);
    });

    const sections = sectionIds.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    if (!sections.length) return;

    const spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            navLinks.forEach(function (link) {
              const isActive = link.getAttribute('href') === '#' + activeId;
              link.classList.toggle('active', isActive);
            });
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: '-' + (parseInt(getComputedStyle(html).getPropertyValue('--header-h') || '72', 10)) + 'px 0px 0px 0px',
      }
    );

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  })();

  /* ═══════════════════════════════════════════════════════════════
     7. SMOOTH ANCHOR SCROLL (offset for fixed header)
  ═══════════════════════════════════════════════════════════════ */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const headerH = header ? header.offsetHeight : 72;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 8;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ═══════════════════════════════════════════════════════════════
     8. RESIZE HANDLER — close mobile nav on desktop expand
  ═══════════════════════════════════════════════════════════════ */

  let resizeTimer;

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 768 && state.navOpen) {
        closeNav();
      }
    }, 150);
  });

  /* ═══════════════════════════════════════════════════════════════
     9. PAGE LOAD ANIMATION
  ═══════════════════════════════════════════════════════════════ */

  // Trigger hero reveal immediately on load
  window.addEventListener('DOMContentLoaded', function () {
    // Slight delay so CSS transition fires
    requestAnimationFrame(function () {
      document.querySelectorAll('.hero .reveal').forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('visible');
        }, i * 120);
      });
    });
  });

  /* ═══════════════════════════════════════════════════════════════
     10. PAGE TRANSITIONS (cross-page fade)
  ═══════════════════════════════════════════════════════════════ */

  // Fade out before navigating to another page
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    // Only intercept same-origin, non-hash, non-mailto/tel cross-page links
    if (!href
      || href.startsWith('#')
      || href.startsWith('mailto:')
      || href.startsWith('tel:')
      || href.startsWith('javascript:')
      || link.target === '_blank'
      || e.ctrlKey || e.metaKey || e.shiftKey) return;

    e.preventDefault();
    body.classList.add('page-leaving');
    setTimeout(function () {
      window.location.href = href;
    }, 220);
  });

})();
