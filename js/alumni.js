/**
 * SRU University — Alumni Page JS
 * Handles: page-tab scrollspy + smooth scroll,
 *          login form interactions, career card entrance,
 *          alumni network stats counter
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

  /* ─── Alumni Stats Counter ──────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var statsStrip = document.querySelector('#network .journey-stats');
    if (statsStrip) {
      var statNums = statsStrip.querySelectorAll('.j-stat-num');
      var counted  = false;

      var statsObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !counted) {
          counted = true;

          statNums.forEach(function (el) {
            var raw   = el.textContent.trim();
            var match = raw.match(/^([\d,]+)/);
            if (!match) return;

            var target    = parseFloat(match[1].replace(/,/g, ''));
            var suffix    = raw.replace(/^[\d,]+/, '');
            var dur       = 1600;
            var startTime = null;

            function step(ts) {
              if (!startTime) startTime = ts;
              var progress = Math.min((ts - startTime) / dur, 1);
              var ease     = 1 - Math.pow(1 - progress, 3);
              var current  = Math.round(ease * target);
              el.textContent = current.toLocaleString() + suffix;
              if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
          });
          statsObs.disconnect();
        }
      }, { threshold: 0.6 });

      statsObs.observe(statsStrip);
    }
  }

  /* ─── Benefit items: stagger entrance ──────────────────────── */
  if ('IntersectionObserver' in window) {
    var benefitItems = document.querySelectorAll('.benefit-item');

    var benefitObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(benefitItems).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (idx % 2) * 80);
          benefitObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    benefitItems.forEach(function (el) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(16px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      benefitObs.observe(el);
    });
  }

  /* ─── Login Form: basic UX interactions ────────────────────── */
  var loginInputs = document.querySelectorAll('.login-input');
  loginInputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      this.parentElement.style.position = 'relative';
    });
  });

  /* Alumni account creation button — scroll to ID fields */
  var createBtn = document.querySelector('.alumni-login-card .btn-outline-purple');
  if (createBtn) {
    createBtn.addEventListener('click', function () {
      var idInput = document.querySelector('.login-two-col input');
      if (idInput) {
        idInput.focus();
        idInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ─── Career cards: stagger on scroll ──────────────────────── */
  if ('IntersectionObserver' in window) {
    var careerCards = document.querySelectorAll('.career-card');

    var careerObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(careerCards).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, idx * 100);
          careerObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    careerCards.forEach(function (card) {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(20px)';
      card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      careerObs.observe(card);
    });
  }

  /* ─── Edu cards: stagger on scroll ─────────────────────────── */
  if ('IntersectionObserver' in window) {
    var eduCards = document.querySelectorAll('.edu-card');

    var eduObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(eduCards).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, idx * 90);
          eduObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    eduCards.forEach(function (card) {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(20px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      eduObs.observe(card);
    });
  }

})();
