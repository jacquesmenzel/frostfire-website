/*
 * Real Frost Fire job photos (no stock).
 *
 * Reads /api/v1/public/website/work-photos (proxied by _worker.js to the CRM; only
 * photos Jax approved, EXIF stripped, city only, never a street).
 *
 *  - Every content page: a "Recent work" strip before the footer. City pages show
 *    that town's jobs first with anonymized check-ins ("Heat pump service · Garner ·
 *    Oct 2026"); service pages show matching work first.
 *  - /our-work: the full gallery (#ff-work-gallery) with service/city filters and a
 *    lightbox.
 * Nothing renders until there are at least 3 photos, so pages never show an empty box.
 */
(function () {
  'use strict';

  var API = '/api/v1/public/website/work-photos';
  var path = (location.pathname || '/').replace(/\.html$/, '').replace(/\/+$/, '') || '/';

  // Pages that keep their own layout clean.
  if (/^\/(lp|gmb)\//.test(path) || /mockup|prototype|funnel|^\/404/.test(path)) return;

  var SERVICE_BY_PATH = [
    [/walk-in|cooler|freezer|refrigeration|ice-machine/, 'refrigeration'],
    [/mini-split|ductless/, 'mini-split'],
    [/heat-pump/, 'heat-pump'],
    [/duct/, 'ductwork'],
    [/maintenance|tune-up/, 'maintenance'],
    [/furnace|heating|heater|carbon-monoxide|emergency-heat/, 'heating'],
    [/\bac\b|ac-|air-condition|cooling/, 'ac'],
  ];

  function serviceFromPath(p) {
    if (!/^\/(services|guides|blog)\//.test(p)) return null;
    for (var i = 0; i < SERVICE_BY_PATH.length; i++) if (SERVICE_BY_PATH[i][0].test(p)) return SERVICE_BY_PATH[i][1];
    return null;
  }

  var CITIES = ['angier', 'apex', 'benson', 'cary', 'clayton', 'durham', 'fayetteville', 'fuquay-varina', 'garner',
    'holly-springs', 'knightdale', 'morrisville', 'raleigh', 'rolesville', 'selma', 'smithfield', 'wake-forest',
    'wendell', 'wilsons-mills', 'zebulon', 'chapel-hill', 'four-oaks', 'clayton'];

  function cityFromPath(p) {
    var m = p.match(/\/(?:service-areas|areas|seo-pages)\/([a-z-]+?)(?:-nc)?$/);
    if (m) return m[1];
    for (var i = 0; i < CITIES.length; i++) {
      if (p.slice(-(CITIES[i].length + 4)) === '-' + CITIES[i] + '-nc' || p.slice(-(CITIES[i].length + 3)) === CITIES[i] + '-nc') return CITIES[i];
    }
    return null;
  }

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cityName(slug) {
    return String(slug || '').split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
  }

  var CSS =
    '.ffw{padding:56px 0;background:var(--off-white,#f7f9fb)}' +
    '.ffw h2{margin:0 0 6px}' +
    '.ffw .ffw-sub{color:var(--text-light,#5b6770);margin:0 0 18px}' +
    '.ffw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}' +
    '.ffw-item{position:relative;display:block;aspect-ratio:4/3;border-radius:10px;overflow:hidden;background:#e6ecf1;border:0;padding:0;cursor:zoom-in}' +
    '.ffw-item img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .25s}' +
    '.ffw-item:hover img{transform:scale(1.04)}' +
    '.ffw-item span{position:absolute;left:0;right:0;bottom:0;padding:18px 8px 6px;font-size:.74rem;line-height:1.3;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.65));text-align:left}' +
    '.ffw-checkins{list-style:none;padding:0;margin:0 0 18px;display:grid;gap:6px}' +
    '.ffw-checkins li{font-size:.95rem;color:var(--text,#1d2a33)}' +
    '.ffw-checkins li::before{content:"\\2713";color:var(--accent,#e8531e);font-weight:800;margin-right:8px}' +
    '.ffw-more{display:inline-block;margin-top:16px;font-weight:700;color:var(--accent,#e8531e)}' +
    '.ffw-filters{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}' +
    '.ffw-filters button{border:1px solid var(--gray-200,#dfe5ea);background:#fff;border-radius:999px;padding:7px 14px;font:600 .85rem Inter,sans-serif;color:var(--primary,#0b3954);cursor:pointer}' +
    '.ffw-filters button[aria-pressed="true"]{background:var(--primary,#0b3954);color:#fff;border-color:var(--primary,#0b3954)}' +
    '.ffw-box{position:fixed;inset:0;z-index:9999;background:rgba(5,15,25,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}' +
    '.ffw-box img{max-width:100%;max-height:80vh;border-radius:8px}' +
    '.ffw-box p{color:#fff;margin:12px 0 0;text-align:center;font-size:.95rem}' +
    '.ffw-box button{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));right:16px;background:none;border:0;color:#fff;font-size:2rem;cursor:pointer}' +
    '@media (prefers-reduced-motion:reduce){.ffw-item img{transition:none}}';

  function injectCss() {
    if (document.getElementById('ffw-css')) return;
    var s = el('style', { id: 'ffw-css' });
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function lightbox(photo) {
    var box = el('div', { class: 'ffw-box', role: 'dialog', 'aria-modal': 'true', 'aria-label': photo.alt || 'Job photo' });
    box.innerHTML =
      '<button type="button" aria-label="Close">&times;</button>' +
      '<img src="' + esc(photo.src) + '" alt="' + esc(photo.alt) + '">' +
      '<p>' + esc(photo.caption || '') + '</p>';
    function close() { box.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    box.addEventListener('click', function (e) { if (e.target === box || e.target.tagName === 'BUTTON') close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(box);
    box.querySelector('button').focus();
  }

  function tile(photo) {
    var b = el('button', { type: 'button', class: 'ffw-item', 'aria-label': 'View photo: ' + (photo.caption || photo.alt || 'job photo') });
    b.innerHTML =
      '<img src="' + esc(photo.thumb || photo.src) + '" alt="' + esc(photo.alt) + '" loading="lazy" decoding="async" width="600" height="450">' +
      (photo.caption ? '<span>' + esc(photo.caption) + '</span>' : '');
    b.addEventListener('click', function () { lightbox(photo); });
    return b;
  }

  function renderStrip(photos, city, service) {
    if (photos.length < 3) return;
    var local = city ? photos.filter(function (p) { return p.city_slug === city; }) : [];
    var name = city ? cityName(city) : '';
    var heading = local.length >= 2 ? 'Recent jobs in ' + name : service ? 'Recent work like this' : 'Recent work from our jobs';
    var sub = local.length >= 2
      ? 'Real photos from jobs we did in and around ' + name + '. No stock photos.'
      : 'Real photos from Frost Fire jobs around Raleigh, Durham, the Triangle and Clayton. No stock photos.';
    var sec = el('section', { class: 'ffw', 'aria-label': heading });
    var wrap = el('div', { class: 'container' });
    wrap.appendChild(el('h2', null, esc(heading)));
    wrap.appendChild(el('p', { class: 'ffw-sub' }, esc(sub)));
    if (local.length >= 2) {
      var seen = {};
      var lines = local.filter(function (p) { if (!p.caption || seen[p.caption]) return false; seen[p.caption] = 1; return true; }).slice(0, 5);
      var ul = el('ul', { class: 'ffw-checkins' });
      lines.forEach(function (p) { ul.appendChild(el('li', null, esc(p.caption))); });
      wrap.appendChild(ul);
    }
    var grid = el('div', { class: 'ffw-grid' });
    photos.slice(0, 8).forEach(function (p) { grid.appendChild(tile(p)); });
    wrap.appendChild(grid);
    wrap.appendChild(el('a', { class: 'ffw-more', href: '/our-work' + (city && local.length ? '?city=' + city : '') }, 'See more of our work &rarr;'));
    sec.appendChild(wrap);
    var footer = document.querySelector('footer');
    if (footer && footer.parentNode) footer.parentNode.insertBefore(sec, footer);
    else document.body.appendChild(sec);
  }

  function renderGallery(root, data) {
    var photos = data.photos || [];
    if (!photos.length) {
      root.innerHTML = '<p>New photos from our jobs are on the way. Check back soon.</p>';
      return;
    }
    var params = new URLSearchParams(location.search);
    var state = { service: params.get('service') || '', city: params.get('city') || '' };
    var filters = el('div', { class: 'ffw-filters', role: 'group', 'aria-label': 'Filter photos' });
    var grid = el('div', { class: 'ffw-grid' });
    var count = el('p', { class: 'ffw-sub', 'aria-live': 'polite' });

    function button(label, key, value) {
      var b = el('button', { type: 'button', 'aria-pressed': String(state[key] === value) }, esc(label));
      b.addEventListener('click', function () { state[key] = state[key] === value ? '' : value; draw(); });
      return b;
    }

    function draw() {
      filters.innerHTML = '';
      filters.appendChild(button('All work', 'service', ''));
      (data.services || []).forEach(function (s) { filters.appendChild(button(s.label, 'service', s.key)); });
      (data.cities || []).slice(0, 12).forEach(function (c) {
        filters.appendChild(button(c, 'city', String(c).toLowerCase().replace(/[^a-z0-9]+/g, '-')));
      });
      var list = photos.filter(function (p) {
        return (!state.service || p.service === state.service) && (!state.city || p.city_slug === state.city);
      });
      grid.innerHTML = '';
      list.forEach(function (p) { grid.appendChild(tile(p)); });
      count.textContent = list.length + ' photo' + (list.length === 1 ? '' : 's') + ' from real Frost Fire jobs';
    }

    root.innerHTML = '';
    root.appendChild(filters);
    root.appendChild(count);
    root.appendChild(grid);
    draw();
  }

  function start() {
    var gallery = document.getElementById('ff-work-gallery');
    var city = cityFromPath(path);
    var service = serviceFromPath(path);
    var qs = '?limit=' + (gallery ? 500 : 24) + (city ? '&city=' + encodeURIComponent(city) : '') + (service ? '&service=' + encodeURIComponent(service) : '');
    fetch(API + qs, { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : { photos: [] }; })
      .then(function (data) {
        injectCss();
        if (gallery) renderGallery(gallery, data);
        else if (path !== '/our-work') renderStrip(data.photos || [], city, service);
      })
      .catch(function () { /* the page works without photos */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
