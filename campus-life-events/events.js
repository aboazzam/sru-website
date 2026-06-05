/**
 * SRU Campus Life Events Module — campus-life-events/events.js
 */
(function (global) {
  'use strict';

  var EVENTS_JSON = 'campus-life-events/data/events.json';
  var LS_KEY      = 'sru_campuslife_events_v1';

  var MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  var MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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

  // Build event card (campus-life style)
  function buildCard(item) {
    var lang     = getLang();
    var title    = t(item, 'title');
    var desc     = t(item, 'desc');
    var type     = t(item, 'type');
    var location = t(item, 'location');
    var duration = t(item, 'duration');
    var spots    = t(item, 'spots');
    var month    = t(item, 'month');
    var regUrl   = item.register_url || 'services.html#portal';
    var regLabel = lang === 'ar' ? 'سجّل' : 'Register';
    var spotsLabel= lang === 'ar' ? 'المتبقي' : 'left';

    var imgStyle = item.image
      ? 'background:' + (item.color||'#3D1F6E') + ';background-image:url(' + item.image + ');background-size:cover;background-position:center'
      : 'background:' + (item.color || '#3D1F6E');

    return [
      '<article class="event-card reveal" data-category="' + (item.category||'') + '">',
      '  <div class="event-card-header">',
      '    <div class="event-date-block" style="' + imgStyle + ';">',
      '      <div class="event-date-day">'  + (item.day   || '') + '</div>',
      '      <div class="event-date-month">' + (month      || '') + '</div>',
      '    </div>',
      '    <div class="event-card-meta">',
      '      <span class="event-type-chip" style="color:' + (item.color||'var(--color-purple)') + ';">' + type + '</span>',
      '      <h3 class="event-card-title">' + title + '</h3>',
      '    </div>',
      '  </div>',
      '  <div class="event-card-body">',
      '    <p class="event-card-desc">' + desc + '</p>',
      '    <div class="event-card-info">',
      '      <span class="event-info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>' + location + '</span></span>',
      '      <span class="event-info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>' + duration + '</span></span>',
      '    </div>',
      '  </div>',
      '  <div class="event-card-footer">',
      '    <span class="event-spots">' + spots + '</span>',
      '    <a href="' + regUrl + '" class="event-register-btn">' + regLabel + '</a>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function renderPanel(items, panelId) {
    var el = document.getElementById(panelId);
    if (!el) return;
    if (!items.length) {
      el.innerHTML = '<p style="text-align:center;padding:40px;color:#9CA3AF;">' +
        (getLang() === 'ar' ? 'لا توجد فعاليات حالياً.' : 'No events at the moment.') + '</p>';
      return;
    }
    el.innerHTML = items.map(buildCard).join('');
    el.querySelectorAll('.reveal').forEach(function(e){ e.classList.add('visible'); });
    if (global.reObserveReveal) global.reObserveReveal();
  }

  function loadAndRender() {
    var lsItems = getLSEvents();
    fetch(EVENTS_JSON)
      .then(function(r){ return r.json(); })
      .then(function(data){
        var all = mergeEvents(data.events || [], lsItems);
        renderByCategory(all);
      })
      .catch(function(){
        renderByCategory(mergeEvents([], lsItems));
      });
  }

  function renderByCategory(all) {
    var categories = ['sports','cultural','academic'];
    var panelMap   = { sports:'tab-sports', cultural:'tab-cultural', academic:'tab-academic-events' };
    categories.forEach(function(cat){
      var items = all.filter(function(e){ return e.category === cat; });
      renderPanel(items, panelMap[cat]);
    });
  }

  global.CampusLifeEvents = {
    load:       loadAndRender,
    clearCache: function(){ /* stateless */ }
  };

  document.addEventListener('DOMContentLoaded', function(){
    if (document.getElementById('tab-sports')) loadAndRender();
  });

}(window));
