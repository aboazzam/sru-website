/**
 * SRU Community Events Module — community-events/events.js
 */
(function (global) {
  'use strict';

  var EVENTS_JSON = 'community-events/data/events.json';
  var LS_KEY      = 'sru_community_events_v1';

  var MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  var MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  var TAG_COLORS = {
    environment: '#1B5E20', education: '#1A237E', health: '#BF360C',
    technology:  '#4A148C', volunteer: '#006064', social: '#E65100', other: '#263238'
  };

  function getLang() { return document.documentElement.lang === 'ar' ? 'ar' : 'en'; }

  function t(item, key) {
    var lang = getLang();
    return item[key + '_' + lang] || item[key + '_ar'] || item[key + '_en'] || '';
  }

  function getLSEvents() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch(e) { return []; }
  }

  function mergeEvents(jsonItems, lsItems) {
    if (!lsItems.length) return jsonItems;
    var map = {};
    jsonItems.forEach(function(e) { map[String(e.id)] = e; });
    lsItems.forEach(function(e) { map[String(e.id)] = e; });
    return Object.values(map).sort(function(a,b){ return (a.date||'') < (b.date||'') ? -1 : 1; });
  }

  // Build community event card
  function buildCard(item) {
    var lang      = getLang();
    var title     = t(item, 'title');
    var desc      = t(item, 'desc');
    var tag       = t(item, 'tag');
    var dateLabel = t(item, 'date_label');
    var location  = t(item, 'location');
    var colorGrad = item.color || 'linear-gradient(135deg,#1B5E20,#388E3C)';

    var thumbStyle = item.image
      ? 'background:' + colorGrad + ';background-image:url(' + item.image + ');background-size:cover;background-position:center'
      : 'background:' + colorGrad;

    return [
      '<article class="comm-event-card reveal">',
      '  <div class="comm-event-thumb" style="' + thumbStyle + ';">',
      '    <span class="comm-event-date">' + dateLabel + '</span>',
      '  </div>',
      '  <div class="comm-event-body">',
      '    <span class="comm-event-tag">' + tag + '</span>',
      '    <h3 class="comm-event-title">' + title + '</h3>',
      '    <p class="comm-event-desc" style="font-size:.85rem;color:#6B7280;line-height:1.6;margin-top:4px">' + desc + '</p>',
      '    <div class="comm-event-loc">',
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      '      <span>' + location + '</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function renderGrid(items, gridEl) {
    if (!gridEl) return;
    if (!items.length) {
      gridEl.innerHTML = '<p style="text-align:center;padding:40px;color:#9CA3AF;grid-column:1/-1">' +
        (getLang() === 'ar' ? 'لا توجد فعاليات حالياً.' : 'No events at the moment.') + '</p>';
      return;
    }
    gridEl.innerHTML = items.map(buildCard).join('');
    gridEl.querySelectorAll('.reveal').forEach(function(e){ e.classList.add('visible'); });
    if (global.reObserveReveal) global.reObserveReveal();
  }

  function loadAndRender() {
    var gridEl  = document.getElementById('comm-events-grid');
    if (!gridEl) return;

    var lsItems = getLSEvents();
    fetch(EVENTS_JSON)
      .then(function(r){ return r.json(); })
      .then(function(data){
        var all = mergeEvents(data.events || [], lsItems);
        renderGrid(all, gridEl);
      })
      .catch(function(){
        renderGrid(mergeEvents([], lsItems), gridEl);
      });
  }

  global.CommunityEvents = {
    load:       loadAndRender,
    clearCache: function(){}
  };

  document.addEventListener('DOMContentLoaded', function(){
    if (document.getElementById('comm-events-grid')) loadAndRender();
  });

}(window));
