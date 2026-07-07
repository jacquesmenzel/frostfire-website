/* Frost Fire website attribution + event bridge */
(function () {
  const STORAGE_KEY = 'ff_attribution_v1';
  const VISITOR_KEY = 'ff_visitor_id';
  const ANALYTICS_CONFIG = window.FrostFireAnalyticsConfig || {};
  const API = {
    session: '/api/v1/public/website/session',
    event: '/api/v1/public/website/event',
    lead: '/api/v1/public/website/lead',
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function safeJsonParse(value) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function loadScript(src) {
    if (!src) return;
    if (document.querySelector('script[src="' + src + '"]')) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }

  function pushDataLayer(eventName, payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(
      Object.assign(
        {
          event: eventName,
        },
        payload || {}
      )
    );
  }

  function installVendorAnalytics() {
    if (ANALYTICS_CONFIG.gtmId) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        const f = d.getElementsByTagName(s)[0];
        const j = d.createElement(s);
        const dl = l !== 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', ANALYTICS_CONFIG.gtmId);
    }

    if (ANALYTICS_CONFIG.ga4MeasurementId && !window.gtag) {
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ANALYTICS_CONFIG.ga4MeasurementId));
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', ANALYTICS_CONFIG.ga4MeasurementId, { send_page_view: false });
    }

    if (ANALYTICS_CONFIG.clarityProjectId && !window.clarity) {
      (function (c, l, a, r, i, t, y) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', ANALYTICS_CONFIG.clarityProjectId);
    }

    if (ANALYTICS_CONFIG.enableCloudflareWebAnalytics && ANALYTICS_CONFIG.cloudflareBeaconToken) {
      loadScript('https://static.cloudflareinsights.com/beacon.min.js');
    }
  }

  function getStoredAttribution() {
    return safeJsonParse(localStorage.getItem(STORAGE_KEY)) || {};
  }

  function setStoredAttribution(value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }

  function randomId(prefix) {
    return prefix + '-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function ensureVisitorId() {
    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
      visitorId = randomId('visitor');
      localStorage.setItem(VISITOR_KEY, visitorId);
    }
    return visitorId;
  }

  function getQuery() {
    return new URLSearchParams(window.location.search);
  }

  function getPagePath() {
    return window.location.pathname || '/';
  }

  function inferPageType(pathname) {
    const path = String(pathname || '/').toLowerCase();
    if (path === '/' || path.endsWith('/index.html')) return 'homepage';
    if (path.includes('/service-areas/') || path.endsWith('/service-areas.html')) return 'location';
    if (path.includes('/services/') || path.endsWith('/services.html')) return 'service';
    if (path.includes('/blog/')) return 'blog';
    if (path.includes('calculator')) return 'calculator';
    if (path.includes('contact')) return 'contact';
    return 'page';
  }

  function buildContext() {
    const stored = getStoredAttribution();
    const query = getQuery();
    const landingUrl = stored.landing_page_url || window.location.href;
    const landingPath = stored.landing_page_path || getPagePath();
    return {
      website: 'frostfire',
      session_key: sessionStorage.getItem('ff_session_key') || '',
      visitor_id: ensureVisitorId(),
      landing_page_url: landingUrl,
      landing_page_path: landingPath,
      current_page_url: window.location.href,
      current_page_path: getPagePath(),
      page_url: window.location.href,
      page_path: getPagePath(),
      page_title: document.title,
      page_type: inferPageType(getPagePath()),
      referrer_url: stored.referrer_url || document.referrer || null,
      utm_source: stored.utm_source || query.get('utm_source'),
      utm_medium: stored.utm_medium || query.get('utm_medium'),
      utm_campaign: stored.utm_campaign || query.get('utm_campaign'),
      utm_term: stored.utm_term || query.get('utm_term'),
      utm_content: stored.utm_content || query.get('utm_content'),
      gclid: stored.gclid || query.get('gclid'),
      gbraid: stored.gbraid || query.get('gbraid'),
      wbraid: stored.wbraid || query.get('wbraid'),
      fbclid: stored.fbclid || query.get('fbclid'),
      user_agent: navigator.userAgent,
    };
  }

  function ensureSessionKey() {
    let sessionKey = sessionStorage.getItem('ff_session_key');
    if (!sessionKey) {
      sessionKey = randomId('session');
      sessionStorage.setItem('ff_session_key', sessionKey);
    }
    return sessionKey;
  }

  function persistFirstTouch() {
    const query = getQuery();
    const existing = getStoredAttribution();
    const next = {
      ...existing,
      visitor_id: ensureVisitorId(),
      landing_page_url: existing.landing_page_url || window.location.href,
      landing_page_path: existing.landing_page_path || getPagePath(),
      referrer_url: existing.referrer_url || document.referrer || null,
      first_touch_at: existing.first_touch_at || nowIso(),
      utm_source: existing.utm_source || query.get('utm_source'),
      utm_medium: existing.utm_medium || query.get('utm_medium'),
      utm_campaign: existing.utm_campaign || query.get('utm_campaign'),
      utm_term: existing.utm_term || query.get('utm_term'),
      utm_content: existing.utm_content || query.get('utm_content'),
      gclid: existing.gclid || query.get('gclid'),
      gbraid: existing.gbraid || query.get('gbraid'),
      wbraid: existing.wbraid || query.get('wbraid'),
      fbclid: existing.fbclid || query.get('fbclid'),
      last_seen_at: nowIso(),
    };
    setStoredAttribution(next);
    return next;
  }

  async function postJson(url, body) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      });
    } catch {
      // Best effort only.
    }
  }

  function eventMetadata(extra) {
    return {
      ...extra,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      page_title: document.title,
    };
  }

  function trackEvent(eventType, extra) {
    const context = buildContext();
    const eventPayload = {
      page_location: context.page_url,
      page_path: context.page_path,
      page_title: context.page_title,
      page_type: context.page_type,
      cta_type: extra && extra.cta_type ? extra.cta_type : undefined,
      lead_channel: extra && extra.lead_channel ? extra.lead_channel : undefined,
      value: extra && typeof extra.value === 'number' ? extra.value : undefined
    };
    pushDataLayer(eventType, eventPayload);
    if (window.gtag && ANALYTICS_CONFIG.ga4MeasurementId) {
      window.gtag('event', eventType, eventPayload);
    }
    return postJson(API.event, {
      context,
      event_type: eventType,
      lead_channel: extra && extra.lead_channel ? extra.lead_channel : null,
      cta_type: extra && extra.cta_type ? extra.cta_type : null,
      value: extra && typeof extra.value === 'number' ? extra.value : null,
      metadata: eventMetadata(extra || {}),
    });
  }

  function trackLead(payload) {
    const details = (payload && payload.details) || {};
    pushDataLayer('website_lead', {
      lead_channel: payload && payload.lead_channel ? payload.lead_channel : 'website',
      cta_type: details.cta_type || undefined,
      service_requested: payload && payload.service_requested ? payload.service_requested : undefined,
      city: payload && payload.city ? payload.city : undefined,
      page_path: payload && payload.context ? payload.context.page_path : undefined,
      page_type: payload && payload.context ? payload.context.page_type : undefined
    });
    return postJson(API.lead, payload);
  }

  function bootSession() {
    ensureSessionKey();
    persistFirstTouch();
    installVendorAnalytics();
    const context = buildContext();
    return postJson(API.session, { context }).then(function () {
      return trackEvent('page_view', { page_type: context.page_type });
    });
  }

  function installScrollTracking() {
    const checkpoints = [25, 50, 75, 90];
    const seen = new Set();
    window.addEventListener(
      'scroll',
      function () {
        const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
        if (height <= 0) return;
        const depth = Math.round((window.scrollY / height) * 100);
        checkpoints.forEach(function (point) {
          if (depth >= point && !seen.has(point)) {
            seen.add(point);
            trackEvent('scroll_depth', { value: point, cta_type: 'scroll' });
          }
        });
      },
      { passive: true }
    );
  }

  function installClickTracking() {
    document.addEventListener('click', function (event) {
      const link = event.target && event.target.closest ? event.target.closest('a') : null;
      if (!link) return;
      const href = String(link.getAttribute('href') || '');
      const text = (link.textContent || '').trim().slice(0, 120);
      if (href.startsWith('tel:')) {
        trackEvent('click_to_call', { cta_type: 'phone', value: 1, label: text, href: href });
        return;
      }
      if (href.indexOf('contact.html') >= 0) {
        trackEvent('cta_click', { cta_type: 'contact', label: text, href: href });
        return;
      }
      if (href.indexOf('calculator') >= 0) {
        trackEvent('cta_click', { cta_type: 'calculator', label: text, href: href });
      }
    });
  }

  function installContactFormTracking() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const originalTrackLead = window.FrostFireTrackLead;
    window.FrostFireTrackLead = function (lead) {
      trackLead(lead);
      if (typeof originalTrackLead === 'function') {
        originalTrackLead(lead);
      }
    };
  }

  function installCalculatorHelpers() {
    const path = getPagePath().toLowerCase();
    if (path.indexOf('calculator') === -1) return;
    window.FrostFireTrackEvent = trackEvent;
    window.FrostFireBuildAttributionContext = buildContext;
    trackEvent('calculator_view', { lead_channel: 'calculator' });
  }

  persistFirstTouch();
  bootSession();
  installScrollTracking();
  installClickTracking();
  installContactFormTracking();
  installCalculatorHelpers();

  window.FrostFireAttribution = {
    getContext: buildContext,
    getStored: getStoredAttribution,
    trackEvent: trackEvent,
    trackLead: trackLead,
  };
})();
