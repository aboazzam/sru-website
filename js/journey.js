/**
 * SRU University — Student Journey Page JS
 * Handles: stage tab switching, timeline node interaction
 */

(function () {
  'use strict';

  /* ─── Stage Switcher ────────────────────────────────────────── */
  const pills       = document.querySelectorAll('.stage-pill');
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const panels      = document.querySelectorAll('.stage-panel');

  function activateStage(stageNum) {
    const num = parseInt(stageNum, 10);

    // Pills
    pills.forEach(function (pill) {
      const isActive = parseInt(pill.dataset.stage, 10) === num;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Timeline nodes
    timelineSteps.forEach(function (step) {
      const stepNum = parseInt(step.dataset.step, 10);
      step.classList.remove('active');
      if (stepNum === num) step.classList.add('active');
    });

    // Panels
    panels.forEach(function (panel) {
      const panelNum = parseInt(panel.id.replace('panel-', ''), 10);
      panel.classList.remove('active');
      if (panelNum === num) {
        panel.classList.add('active');
        // Re-trigger reveal on newly shown panel elements
        panel.querySelectorAll('.reveal').forEach(function (el) {
          el.classList.remove('visible');
          requestAnimationFrame(function () {
            el.classList.add('visible');
          });
        });
      }
    });
  }

  // Pill click handlers
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      activateStage(this.dataset.stage);
    });
  });

  // Timeline node click handlers
  timelineSteps.forEach(function (step) {
    step.addEventListener('click', function () {
      activateStage(this.dataset.step);
    });
  });

  // Keyboard arrow navigation for pills
  pills.forEach(function (pill, idx) {
    pill.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = pills[idx + 1] || pills[0];
        next.focus();
        activateStage(next.dataset.stage);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = pills[idx - 1] || pills[pills.length - 1];
        prev.focus();
        activateStage(prev.dataset.stage);
      }
    });
  });

  // Initialise with stage 1 active
  activateStage(1);

  /* ─── Scrollspy for page tabs (if page-tabs exists) ────────── */
  const pageTabs = document.querySelectorAll('.page-tab');
  if (pageTabs.length) {
    const sectionIds = Array.from(pageTabs)
      .map(function (t) { return (t.getAttribute('href') || '').slice(1); })
      .filter(Boolean);

    const sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      const tabObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              pageTabs.forEach(function (tab) {
                tab.classList.toggle('active', (tab.getAttribute('href') || '') === '#' + id);
              });
            }
          });
        },
        { threshold: 0.35 }
      );
      sections.forEach(function (s) { tabObs.observe(s); });
    }
  }

})();
