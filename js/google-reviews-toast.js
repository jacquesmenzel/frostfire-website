/**
 * Frost Fire Google Reviews social-proof toast.
 * Async, non-blocking. Collapsed badge always available; expands after a short delay.
 * Disable with: window.FF_REVIEWS_TOAST = { enabled: false }
 */
(function () {
  'use strict';

  var CFG = Object.assign({
    enabled: true,
    website: 'frostfire',
    apiUrl: '/api/v1/public/website/reviews',
    fallbackUrl: '/data/google-reviews.json',
    phone: '9192304439',
    phoneDisplay: '(919) 230-4439',
    scheduleUrl: '/contact.html',
    googleReviewsUrl: 'https://g.page/r/CSjVCnRtfVKPEBM/review',
    expandDelayMinMs: 3200,
    expandDelayMaxMs: 4800,
    rotateMinMs: 26000,
    rotateMaxMs: 34000,
    storageKey: 'ff_reviews_toast_collapsed',
  }, window.FF_REVIEWS_TOAST || {});

  if (CFG.enabled === false) return;
  if (document.getElementById('ff-reviews-toast-root')) return;

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* ignore */ }

  var state = {
    data: null,
    index: 0,
    expanded: false,
    userCollapsed: false,
    paused: false,
    formActive: false,
    tabHidden: false,
    rotateTimer: null,
    expandTimer: null,
    root: null,
  };

  function randBetween(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function track(eventType, extra) {
    try {
      if (window.FrostFireAttribution && typeof window.FrostFireAttribution.trackEvent === 'function') {
        window.FrostFireAttribution.trackEvent(eventType, Object.assign({ cta_type: 'google_reviews_toast' }, extra || {}));
        return;
      }
      if (typeof window.FrostFireTrackEvent === 'function') {
        window.FrostFireTrackEvent(eventType, Object.assign({ cta_type: 'google_reviews_toast' }, extra || {}));
      }
    } catch (e) { /* analytics best-effort */ }
  }

  function formatReviewDate(iso) {
    if (!iso) return '';
    var d;
    try {
      d = new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso);
      if (isNaN(d.getTime())) return '';
    } catch (e) {
      return '';
    }
    var now = new Date();
    var diffMs = now.getTime() - d.getTime();
    if (diffMs < 0) {
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    var days = Math.floor(diffMs / 86400000);
    // Truthful relative dates only — never invent "just now" / "today" for older reviews.
    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 14) return days + ' days ago';
    if (days < 45) {
      var weeks = Math.max(2, Math.floor(days / 7));
      return weeks + ' weeks ago';
    }
    if (d.getFullYear() === now.getFullYear()) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  function starsHtml(rating) {
    var n = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));
    var out = '';
    for (var i = 0; i < 5; i++) {
      out += '<span class="ffrt-star' + (i < n ? ' is-on' : '') + '" aria-hidden="true">★</span>';
    }
    return '<span class="ffrt-stars" aria-label="' + n + ' out of 5 stars">' + out + '</span>';
  }

  function googleMark() {
    return (
      '<span class="ffrt-gmark" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" focusable="false">' +
      '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>' +
      '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>' +
      '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>' +
      '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>' +
      '</svg></span>'
    );
  }

  function injectStyles() {
    if (document.getElementById('ff-reviews-toast-css')) return;
    var css = document.createElement('style');
    css.id = 'ff-reviews-toast-css';
    css.textContent = [
      '#ff-reviews-toast-root{position:fixed;z-index:99990;right:24px;bottom:100px;width:min(340px,calc(100vw - 24px));',
      'font-family:Inter,Montserrat,system-ui,-apple-system,sans-serif;color:#0f2b4c;pointer-events:none;',
      '--ffrt-accent:#E8531E;--ffrt-navy:#0f2b4c;--ffrt-muted:#5b6b7c;--ffrt-border:rgba(15,43,76,.1);',
      '--ffrt-shadow:0 10px 30px rgba(15,43,76,.18);}',
      '#ff-reviews-toast-root *{box-sizing:border-box}',
      '#ff-reviews-toast-root .ffrt-surface{pointer-events:auto}',
      '#ff-reviews-toast-root .ffrt-badge{display:none;align-items:center;gap:10px;padding:10px 14px;background:#fff;',
      'border:1px solid var(--ffrt-border);border-radius:999px;box-shadow:var(--ffrt-shadow);cursor:pointer;',
      'transition:transform .25s ease,box-shadow .25s ease;max-width:100%;min-height:44px}',
      '#ff-reviews-toast-root .ffrt-badge:hover,#ff-reviews-toast-root .ffrt-badge:focus-visible{',
      'transform:translateY(-1px);box-shadow:0 14px 34px rgba(15,43,76,.22);outline:2px solid rgba(232,83,30,.35);outline-offset:2px}',
      '#ff-reviews-toast-root .ffrt-badge-meta{display:flex;flex-direction:column;gap:1px;line-height:1.2;min-width:0}',
      '#ff-reviews-toast-root .ffrt-badge-rating{display:flex;align-items:center;gap:6px;font-weight:700;font-size:14px;color:var(--ffrt-navy)}',
      '#ff-reviews-toast-root .ffrt-badge-count{font-size:12px;color:var(--ffrt-muted);font-weight:500;white-space:nowrap}',
      '#ff-reviews-toast-root .ffrt-card{display:none;background:#fff;border:1px solid var(--ffrt-border);border-radius:16px;',
      'box-shadow:var(--ffrt-shadow);overflow:hidden;transform-origin:bottom right}',
      '#ff-reviews-toast-root.is-expanded .ffrt-card{display:block}',
      '#ff-reviews-toast-root.is-collapsed .ffrt-badge{display:inline-flex}',
      '#ff-reviews-toast-root.is-pulse .ffrt-card{animation:ffrt-pulse .7s ease}',
      '@keyframes ffrt-pulse{0%{transform:scale(1) translateY(0)}35%{transform:scale(1.035) translateY(-4px)}',
      '100%{transform:scale(1) translateY(0)}}',
      '@media (prefers-reduced-motion:reduce){#ff-reviews-toast-root.is-pulse .ffrt-card{animation:none}',
      '#ff-reviews-toast-root .ffrt-badge{transition:none}}',
      '#ff-reviews-toast-root .ffrt-head{display:flex;align-items:center;justify-content:space-between;gap:8px;',
      'padding:12px 12px 8px 14px;border-bottom:1px solid rgba(15,43,76,.06)}',
      '#ff-reviews-toast-root .ffrt-source{display:flex;align-items:center;gap:8px;min-width:0}',
      '#ff-reviews-toast-root .ffrt-source-label{font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--ffrt-navy)}',
      '#ff-reviews-toast-root .ffrt-source-sub{font-size:11px;color:var(--ffrt-muted);font-weight:500}',
      '#ff-reviews-toast-root .ffrt-controls{display:flex;align-items:center;gap:2px;flex-shrink:0}',
      '#ff-reviews-toast-root .ffrt-icon-btn{appearance:none;border:0;background:transparent;color:var(--ffrt-muted);',
      'width:36px;height:36px;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;',
      'font-size:16px;line-height:1}',
      '#ff-reviews-toast-root .ffrt-icon-btn:hover,#ff-reviews-toast-root .ffrt-icon-btn:focus-visible{',
      'background:rgba(15,43,76,.06);color:var(--ffrt-navy);outline:none}',
      '#ff-reviews-toast-root .ffrt-body{padding:12px 14px 10px}',
      '#ff-reviews-toast-root .ffrt-quote{margin:8px 0 0;font-size:14px;line-height:1.45;color:#243447;font-weight:500}',
      '#ff-reviews-toast-root .ffrt-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin-top:10px;',
      'font-size:12px;color:var(--ffrt-muted)}',
      '#ff-reviews-toast-root .ffrt-reviewer{font-weight:700;color:var(--ffrt-navy)}',
      '#ff-reviews-toast-root .ffrt-dot{opacity:.45}',
      '#ff-reviews-toast-root .ffrt-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;',
      'padding:0 12px 12px;flex-wrap:wrap}',
      '#ff-reviews-toast-root .ffrt-link{font-size:12px;font-weight:600;color:#1a73e8;text-decoration:none}',
      '#ff-reviews-toast-root .ffrt-link:hover,#ff-reviews-toast-root .ffrt-link:focus-visible{text-decoration:underline;outline:none}',
      '#ff-reviews-toast-root .ffrt-cta{display:inline-flex;align-items:center;justify-content:center;gap:6px;',
      'min-height:36px;padding:0 12px;border-radius:999px;background:var(--ffrt-accent);color:#fff;',
      'font-size:12px;font-weight:700;text-decoration:none;box-shadow:0 4px 14px rgba(232,83,30,.35)}',
      '#ff-reviews-toast-root .ffrt-cta:hover,#ff-reviews-toast-root .ffrt-cta:focus-visible{filter:brightness(1.05);outline:none}',
      '#ff-reviews-toast-root .ffrt-stars{color:#d1d5db;letter-spacing:1px;font-size:13px}',
      '#ff-reviews-toast-root .ffrt-star.is-on{color:#fbbc04}',
      '#ff-reviews-toast-root .ffrt-gmark{display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;',
      'background:#fff;border-radius:50%;flex-shrink:0}',
      '#ff-reviews-toast-root .ffrt-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;',
      'clip:rect(0,0,0,0);white-space:nowrap;border:0}',
      '@media (max-width:768px){#ff-reviews-toast-root{left:12px;right:auto;bottom:72px;width:min(320px,calc(100vw - 88px))}',
      '#ff-reviews-toast-root .ffrt-card{transform-origin:bottom left}',
      '#ff-reviews-toast-root .ffrt-quote{font-size:13px}}',
      '@media (max-width:380px){#ff-reviews-toast-root{width:calc(100vw - 76px)}',
      '#ff-reviews-toast-root .ffrt-cta{width:100%}}'
    ].join('');
    document.head.appendChild(css);
  }

  function currentReview() {
    var list = (state.data && state.data.reviews) || [];
    if (!list.length) return null;
    return list[state.index % list.length];
  }

  function renderCollapsed() {
    var d = state.data || {};
    var rating = Number(d.average_rating || 4.9).toFixed(1);
    var count = Number(d.review_count || 0);
    var countLabel = count > 0 ? count + ' Google reviews' : 'Google reviews';
    return (
      '<button type="button" class="ffrt-surface ffrt-badge" aria-expanded="false" aria-controls="ffrt-panel" id="ffrt-badge-btn">' +
      googleMark() +
      '<span class="ffrt-badge-meta">' +
      '<span class="ffrt-badge-rating">' + starsHtml(Math.round(Number(d.average_rating) || 5)) +
      '<span>' + escapeHtml(rating) + '</span></span>' +
      '<span class="ffrt-badge-count">' + escapeHtml(countLabel) + '</span>' +
      '</span></button>'
    );
  }

  function renderExpanded() {
    var d = state.data || {};
    var review = currentReview();
    var excerpt = review ? review.excerpt : '';
    var reviewer = review ? review.reviewer_name : '';
    var when = review ? formatReviewDate(review.review_date) : '';
    var rating = review ? review.rating : 5;
    var googleUrl = d.google_reviews_url || CFG.googleReviewsUrl;
    var phone = d.phone || CFG.phone;
    var phoneDisplay = d.phone_display || CFG.phoneDisplay;

    return (
      '<section class="ffrt-surface ffrt-card" id="ffrt-panel" role="region" aria-label="Google customer review" aria-live="polite">' +
      '<div class="ffrt-head">' +
      '<div class="ffrt-source">' + googleMark() +
      '<div><div class="ffrt-source-label">Google review</div>' +
      '<div class="ffrt-source-sub">From our Google Business Profile</div></div></div>' +
      '<div class="ffrt-controls">' +
      '<button type="button" class="ffrt-icon-btn" data-ffrt-action="prev" aria-label="Previous review">‹</button>' +
      '<button type="button" class="ffrt-icon-btn" data-ffrt-action="next" aria-label="Next review">›</button>' +
      '<button type="button" class="ffrt-icon-btn" data-ffrt-action="collapse" aria-label="Minimize reviews">–</button>' +
      '</div></div>' +
      '<div class="ffrt-body">' +
      starsHtml(rating) +
      (excerpt ? '<p class="ffrt-quote">“' + escapeHtml(excerpt) + '”</p>' : '<p class="ffrt-quote">Customers rate us highly on Google.</p>') +
      '<div class="ffrt-meta">' +
      (reviewer ? '<span class="ffrt-reviewer">' + escapeHtml(reviewer) + '</span>' : '') +
      (when ? '<span class="ffrt-dot" aria-hidden="true">·</span><time datetime="' + escapeHtml(review.review_date || '') + '">' + escapeHtml(when) + '</time>' : '') +
      '</div></div>' +
      '<div class="ffrt-foot">' +
      '<a class="ffrt-link" data-ffrt-action="google" href="' + escapeHtml(googleUrl) + '" target="_blank" rel="noopener noreferrer">Read our Google reviews</a>' +
      '<a class="ffrt-cta" data-ffrt-action="call" href="tel:' + escapeHtml(phone) + '">Call ' + escapeHtml(phoneDisplay) + '</a>' +
      '</div></section>'
    );
  }

  function setMode(expanded, opts) {
    opts = opts || {};
    state.expanded = !!expanded;
    if (!state.root) return;
    state.root.classList.toggle('is-expanded', state.expanded);
    state.root.classList.toggle('is-collapsed', !state.expanded);
    if (opts.trackExpand) track('review_toast_expand', { value: 1 });
    if (opts.trackCollapse) track('review_toast_collapse', { value: 1 });
  }

  function paint(opts) {
    opts = opts || {};
    if (!state.root) return;
    state.root.innerHTML = renderCollapsed() + renderExpanded();
    setMode(state.expanded);
    if (opts.pulse && state.expanded && !reduceMotion) {
      state.root.classList.remove('is-pulse');
      // Force reflow so repeated pulses retrigger.
      void state.root.offsetWidth;
      state.root.classList.add('is-pulse');
      window.setTimeout(function () {
        if (state.root) state.root.classList.remove('is-pulse');
      }, 750);
    }
  }

  function clearRotate() {
    if (state.rotateTimer) {
      window.clearTimeout(state.rotateTimer);
      state.rotateTimer = null;
    }
  }

  function scheduleRotate() {
    clearRotate();
    if (!state.expanded || state.userCollapsed) return;
    if (state.paused || state.formActive || state.tabHidden) return;
    var list = (state.data && state.data.reviews) || [];
    if (list.length < 2) return;
    state.rotateTimer = window.setTimeout(function () {
      rotate(1, { auto: true });
    }, randBetween(CFG.rotateMinMs, CFG.rotateMaxMs));
  }

  function rotate(delta, opts) {
    opts = opts || {};
    var list = (state.data && state.data.reviews) || [];
    if (!list.length) return;
    state.index = (state.index + delta + list.length) % list.length;
    paint({ pulse: !!opts.auto || !!opts.manual });
    if (opts.manual) track('review_toast_navigate', { value: delta, label: delta > 0 ? 'next' : 'prev' });
    if (opts.auto) track('review_toast_rotate', { value: 1, label: String(state.index) });
    scheduleRotate();
  }

  function collapseToBadge(fromUser) {
    state.userCollapsed = true;
    try { sessionStorage.setItem(CFG.storageKey, '1'); } catch (e) { /* ignore */ }
    clearRotate();
    setMode(false, { trackCollapse: !!fromUser });
    paint();
  }

  function expandFromBadge(fromUser) {
    state.userCollapsed = false;
    try { sessionStorage.removeItem(CFG.storageKey); } catch (e) { /* ignore */ }
    setMode(true, { trackExpand: !!fromUser });
    paint({ pulse: !!fromUser && !reduceMotion });
    scheduleRotate();
  }

  function onRootClick(e) {
    var t = e.target.closest('[data-ffrt-action], .ffrt-badge');
    if (!t) return;
    var action = t.getAttribute('data-ffrt-action');
    if (t.classList.contains('ffrt-badge')) {
      e.preventDefault();
      expandFromBadge(true);
      return;
    }
    if (action === 'collapse') {
      e.preventDefault();
      collapseToBadge(true);
      return;
    }
    if (action === 'prev') {
      e.preventDefault();
      rotate(-1, { manual: true });
      return;
    }
    if (action === 'next') {
      e.preventDefault();
      rotate(1, { manual: true });
      return;
    }
    if (action === 'google') {
      track('review_toast_google_click', { value: 1, href: t.getAttribute('href') || '' });
      return;
    }
    if (action === 'call') {
      track('click_to_call', { cta_type: 'review_toast_call', value: 1, href: t.getAttribute('href') || '' });
      return;
    }
  }

  function bindInteractions() {
    state.root.addEventListener('click', onRootClick);
    state.root.addEventListener('mouseenter', function () {
      state.paused = true;
      clearRotate();
    });
    state.root.addEventListener('mouseleave', function () {
      state.paused = false;
      scheduleRotate();
    });
    state.root.addEventListener('focusin', function () {
      state.paused = true;
      clearRotate();
    });
    state.root.addEventListener('focusout', function () {
      window.setTimeout(function () {
        if (!state.root) return;
        if (state.root.contains(document.activeElement)) return;
        state.paused = false;
        scheduleRotate();
      }, 0);
    });

    document.addEventListener('focusin', function (e) {
      var el = e.target;
      if (!el) return;
      var tag = (el.tagName || '').toLowerCase();
      var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
      if (typing) {
        state.formActive = true;
        clearRotate();
        if (state.expanded && !state.userCollapsed) {
          // Stay expanded but quiet while visitor types / books.
        }
      }
    });
    document.addEventListener('focusout', function () {
      window.setTimeout(function () {
        var el = document.activeElement;
        var tag = el && (el.tagName || '').toLowerCase();
        var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || (el && el.isContentEditable);
        state.formActive = !!typing;
        if (!state.formActive) scheduleRotate();
      }, 0);
    });

    document.addEventListener('visibilitychange', function () {
      state.tabHidden = document.hidden;
      if (state.tabHidden) clearRotate();
      else scheduleRotate();
    });
  }

  function normalizePayload(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var reviews = Array.isArray(raw.reviews) ? raw.reviews : [];
    var cleaned = [];
    for (var i = 0; i < reviews.length; i++) {
      var r = reviews[i] || {};
      var excerpt = String(r.excerpt || r.review_text || '').trim();
      if (!excerpt) continue;
      cleaned.push({
        id: String(r.id || ('r' + i)),
        reviewer_name: String(r.reviewer_name || 'Google reviewer').trim(),
        rating: Math.max(1, Math.min(5, Number(r.rating) || 5)),
        excerpt: excerpt.length > 240 ? excerpt.slice(0, 237).replace(/\s+\S*$/, '') + '…' : excerpt,
        review_date: r.review_date || null,
      });
    }
    return {
      source: 'google',
      business_name: raw.business_name || 'Frost Fire Heating & Cooling',
      google_reviews_url: raw.google_reviews_url || CFG.googleReviewsUrl,
      phone: raw.phone || CFG.phone,
      phone_display: raw.phone_display || CFG.phoneDisplay,
      schedule_url: raw.schedule_url || CFG.scheduleUrl,
      average_rating: Number(raw.average_rating) || 4.9,
      review_count: Number(raw.review_count) || cleaned.length,
      reviews: cleaned,
    };
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'omit', cache: 'default' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function loadData() {
    var api = CFG.apiUrl + (CFG.apiUrl.indexOf('?') >= 0 ? '&' : '?') + 'website=' + encodeURIComponent(CFG.website);
    return fetchJson(api)
      .then(normalizePayload)
      .catch(function () {
        return fetchJson(CFG.fallbackUrl).then(normalizePayload);
      })
      .catch(function () {
        return normalizePayload({
          average_rating: 4.9,
          review_count: 55,
          google_reviews_url: CFG.googleReviewsUrl,
          reviews: [],
        });
      });
  }

  function mount(data) {
    state.data = data;
    try {
      state.userCollapsed = sessionStorage.getItem(CFG.storageKey) === '1';
    } catch (e) {
      state.userCollapsed = false;
    }

    injectStyles();
    var root = document.createElement('div');
    root.id = 'ff-reviews-toast-root';
    root.className = 'is-collapsed';
    root.setAttribute('data-ffrt', '1');
    document.body.appendChild(root);
    state.root = root;
    state.expanded = false;
    paint();
    bindInteractions();
    track('review_toast_impression', {
      value: 1,
      label: String((data && data.review_count) || 0),
    });

    // Always show collapsed badge immediately. Expand shortly after if user hasn't minimized.
    if (!state.userCollapsed && (data.reviews || []).length) {
      state.expandTimer = window.setTimeout(function () {
        if (state.userCollapsed || state.formActive) return;
        setMode(true, { trackExpand: true });
        paint({ pulse: !reduceMotion });
        scheduleRotate();
      }, randBetween(CFG.expandDelayMinMs, CFG.expandDelayMaxMs));
    }
  }

  function start() {
    // Defer network until after first paint / idle.
    var kick = function () {
      loadData().then(function (data) {
        if (!data) return;
        mount(data);
      });
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(kick, { timeout: 2500 });
    } else {
      window.setTimeout(kick, 600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
