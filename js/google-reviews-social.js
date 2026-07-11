/**
 * Homepage Google social proof: hero Excellent badge + below-fold review carousel.
 * Uses the same public reviews API / static JSON as the toast. 5-star excerpts only.
 */
(function () {
  'use strict';

  var CFG = Object.assign({
    website: 'frostfire',
    apiUrl: '/api/v1/public/website/reviews',
    fallbackUrl: '/data/google-reviews.json',
    googleReviewsUrl: 'https://g.page/r/CSjVCnRtfVKPEBM/review',
  }, window.FF_REVIEWS_SOCIAL || {});

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
        window.FrostFireAttribution.trackEvent(eventType, Object.assign({ cta_type: 'google_reviews_social' }, extra || {}));
      }
    } catch (e) { /* ignore */ }
  }

  function googleG() {
    return (
      '<svg class="ffgs-g" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
      '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>' +
      '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>' +
      '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>' +
      '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>' +
      '</svg>'
    );
  }

  function googleWordmark() {
    return (
      '<span class="ffgs-google-word" aria-label="Google">' +
      '<span style="color:#4285F4">G</span>' +
      '<span style="color:#EA4335">o</span>' +
      '<span style="color:#FBBC05">o</span>' +
      '<span style="color:#4285F4">g</span>' +
      '<span style="color:#34A853">l</span>' +
      '<span style="color:#EA4335">e</span>' +
      '</span>'
    );
  }

  function starsRow() {
    return '<span class="ffgs-stars" aria-hidden="true">★★★★★</span>';
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function ratingLabel(avg) {
    var n = Number(avg) || 0;
    if (n >= 4.5) return 'Excellent';
    if (n >= 4.0) return 'Great';
    if (n >= 3.5) return 'Good';
    return 'Rated';
  }

  function normalize(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var reviews = Array.isArray(raw.reviews) ? raw.reviews : [];
    var cleaned = [];
    for (var i = 0; i < reviews.length; i++) {
      var r = reviews[i] || {};
      if (Math.round(Number(r.rating) || 0) !== 5) continue;
      var excerpt = String(r.excerpt || r.review_text || '').trim();
      if (!excerpt) continue;
      cleaned.push({
        id: String(r.id || ('r' + i)),
        reviewer_name: String(r.reviewer_name || 'Google reviewer').trim(),
        rating: 5,
        excerpt: excerpt.length > 180 ? excerpt.slice(0, 177).replace(/\s+\S*$/, '') + '…' : excerpt,
        review_date: r.review_date || null,
      });
    }
    return {
      google_reviews_url: raw.google_reviews_url || CFG.googleReviewsUrl,
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
    if (window.FF_GOOGLE_REVIEWS_DATA) {
      return Promise.resolve(normalize(window.FF_GOOGLE_REVIEWS_DATA));
    }
    var api = CFG.apiUrl + (CFG.apiUrl.indexOf('?') >= 0 ? '&' : '?') + 'website=' + encodeURIComponent(CFG.website);
    return fetchJson(api)
      .then(normalize)
      .catch(function () { return fetchJson(CFG.fallbackUrl).then(normalize); })
      .then(function (data) {
        if (data) window.FF_GOOGLE_REVIEWS_DATA = data;
        return data;
      });
  }

  function fillHeroBadge(data) {
    var el = document.getElementById('ff-google-rating-badge');
    if (!el || !data) return;
    var count = Number(data.review_count) || 0;
    var label = ratingLabel(data.average_rating);
    var url = data.google_reviews_url || CFG.googleReviewsUrl;
    el.innerHTML =
      '<a class="ffgs-hero-link" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" data-ffgs="hero">' +
      '<span class="ffgs-hero-label">' + escapeHtml(label.toUpperCase()) + '</span>' +
      starsRow() +
      '<span class="ffgs-hero-count">' + escapeHtml(String(count)) + ' Google review' + (count === 1 ? '' : 's') + '</span>' +
      googleWordmark() +
      '</a>';
    el.hidden = false;
  }

  function buildCarousel(data) {
    var root = document.getElementById('ff-google-reviews-carousel');
    if (!root || !data || !data.reviews.length) return;

    var url = data.google_reviews_url || CFG.googleReviewsUrl;
    var cards = data.reviews.map(function (r) {
      var when = formatDate(r.review_date);
      return (
        '<article class="ffgs-card">' +
        '<div class="ffgs-card-top">' +
        '<div class="ffgs-card-who">' +
        '<div class="ffgs-card-name">' + escapeHtml(r.reviewer_name) + '</div>' +
        (when ? '<div class="ffgs-card-date">' + escapeHtml(when) + '</div>' : '') +
        '</div>' + googleG() +
        '</div>' +
        '<div class="ffgs-card-stars" aria-label="5 out of 5 stars">' + starsRow() + '</div>' +
        '<p class="ffgs-card-text">' + escapeHtml(r.excerpt) + '</p>' +
        '<a class="ffgs-card-more" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" data-ffgs="read-more">Read more</a>' +
        '</article>'
      );
    }).join('');

    root.innerHTML =
      '<div class="container">' +
      '<h2 class="ffgs-title">Reviews and Testimonials from Our Satisfied Customers!</h2>' +
      '<div class="ffgs-track-wrap">' +
      '<div class="ffgs-track" tabindex="0" role="region" aria-label="Five-star Google reviews">' + cards + '</div>' +
      '<button type="button" class="ffgs-next" aria-label="Scroll reviews">›</button>' +
      '</div>' +
      '<div class="ffgs-footer">' +
      '<a class="ffgs-all" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" data-ffgs="all">See all Google reviews</a>' +
      '</div></div>';

    root.hidden = false;

    var track = root.querySelector('.ffgs-track');
    var nextBtn = root.querySelector('.ffgs-next');
    var reduceMotion = false;
    try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* ignore */ }

    function scrollByCard(dir) {
      if (!track) return;
      var card = track.querySelector('.ffgs-card');
      var amount = card ? card.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: dir * amount, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        scrollByCard(1);
        track('review_carousel_next', { value: 1 });
      });
    }

    root.addEventListener('click', function (e) {
      var a = e.target.closest('[data-ffgs]');
      if (!a) return;
      track('review_carousel_click', { label: a.getAttribute('data-ffgs') || 'link' });
    });

    // Gentle auto-advance when in view and not reduced-motion.
    if (!reduceMotion && track && data.reviews.length > 1) {
      var timer = null;
      var paused = false;
      var start = function () {
        if (timer || paused || document.hidden) return;
        timer = window.setInterval(function () {
          if (!track) return;
          var max = track.scrollWidth - track.clientWidth - 4;
          if (track.scrollLeft >= max) track.scrollTo({ left: 0, behavior: 'smooth' });
          else scrollByCard(1);
        }, 5500);
      };
      var stop = function () {
        if (timer) { window.clearInterval(timer); timer = null; }
      };
      track.addEventListener('mouseenter', function () { paused = true; stop(); });
      track.addEventListener('mouseleave', function () { paused = false; start(); });
      track.addEventListener('focusin', function () { paused = true; stop(); });
      track.addEventListener('focusout', function () { paused = false; start(); });
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop();
        else start();
      });
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) start();
            else stop();
          });
        }, { threshold: 0.25 });
        io.observe(root);
      } else {
        start();
      }
    }

    track('review_carousel_impression', { value: data.reviews.length });
  }

  function start() {
    var needsHero = document.getElementById('ff-google-rating-badge');
    var needsCarousel = document.getElementById('ff-google-reviews-carousel');
    if (!needsHero && !needsCarousel) return;

    var run = function () {
      loadData().then(function (data) {
        if (!data) return;
        fillHeroBadge(data);
        buildCarousel(data);
      });
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 2500 });
    else window.setTimeout(run, 400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
