/**
 * SRU University — Community Responsibility Page JS
 * Handles: page-tab scrollspy + smooth scroll,
 *          impact stats counter animation,
 *          gallery item entrance stagger,
 *          volunteer card stagger, initiative card stagger
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
      var headerH = header  ? header.offsetHeight  : 72;
      var tabsH   = tabsEl  ? tabsEl.offsetHeight  : 48;
      var top     = target.getBoundingClientRect().top + window.scrollY - (headerH + tabsH + 16);
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── Impact Stats Counter ──────────────────────────────────── */
  var statTargets = [
    { id: 'stat-volunteers', target: 4700, suffix: '+' },
    { id: 'stat-hours',      target: 28000, suffix: '+'  },
    { id: 'stat-partners',   target: 65,   suffix: '+'  },
    { id: 'stat-initiatives',target: 30,   suffix: '+'  }
  ];

  if ('IntersectionObserver' in window) {
    var impactSection = document.querySelector('.comm-impact');
    if (impactSection) {
      var counted = false;

      var statsObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !counted) {
          counted = true;

          statTargets.forEach(function (item) {
            var el = document.getElementById(item.id);
            if (!el) return;

            var dur       = 1800;
            var startTime = null;

            function step(ts) {
              if (!startTime) startTime = ts;
              var progress = Math.min((ts - startTime) / dur, 1);
              var ease     = 1 - Math.pow(1 - progress, 3);
              var current  = Math.round(ease * item.target);
              el.textContent = current.toLocaleString() + item.suffix;
              if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
          });

          statsObs.disconnect();
        }
      }, { threshold: 0.5 });

      statsObs.observe(impactSection);
    }
  }

  /* ─── Community Event Cards: stagger entrance ──────────────── */
  if ('IntersectionObserver' in window) {
    var eventCards = document.querySelectorAll('.comm-event-card');

    var eventObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(eventCards).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (idx % 3) * 90);
          eventObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    eventCards.forEach(function (card) {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(20px)';
      card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      eventObs.observe(card);
    });
  }

  /* ─── Volunteer Cards: stagger entrance ────────────────────── */
  if ('IntersectionObserver' in window) {
    var volCards = document.querySelectorAll('.vol-card');

    var volObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(volCards).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (idx % 3) * 80);
          volObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    volCards.forEach(function (card) {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(18px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      volObs.observe(card);
    });
  }

  /* ─── Initiative Cards: stagger entrance ───────────────────── */
  if ('IntersectionObserver' in window) {
    var initCards = document.querySelectorAll('.initiative-card');

    var initObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(initCards).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (idx % 2) * 90);
          initObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    initCards.forEach(function (card) {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(16px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      initObs.observe(card);
    });
  }

  /* ─── Gallery Items: stagger entrance ──────────────────────── */
  if ('IntersectionObserver' in window) {
    var galleryItems = document.querySelectorAll('.gallery-item');

    var galleryObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(galleryItems).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'scale(1)';
          }, idx * 60);
          galleryObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    galleryItems.forEach(function (item) {
      item.style.opacity    = '0';
      item.style.transform  = 'scale(0.95)';
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      galleryObs.observe(item);
    });
  }

  /* ─── Partner Logos: stagger entrance ──────────────────────── */
  if ('IntersectionObserver' in window) {
    var partnerLogos = document.querySelectorAll('.partner-logo');

    var partnerObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(partnerLogos).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, idx * 50);
          partnerObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    partnerLogos.forEach(function (logo) {
      logo.style.opacity    = '0';
      logo.style.transform  = 'translateY(12px)';
      logo.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      partnerObs.observe(logo);
    });
  }

})();
