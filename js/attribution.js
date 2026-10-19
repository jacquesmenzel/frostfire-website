/* Frost Fire website attribution + event bridge */
(function () {
  const STORAGE_KEY = 'ff_attribution_v1';
  const VISITOR_KEY = 'ff_visitor_id';
  const SESSION_TOUCH_KEY = 'ff_session_touch_v1';
  // Ad-platform click ids we keep. gclid/gbraid/wbraid/fbclid also have their own
  // CRM columns; the rest (Bing msclkid, ChatGPT/OpenAI ads oppref) travel in
  // context.metadata.click_ids and lead.details.click_ids.
  const CLICK_ID_PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'oppref'];
  const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
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

  // Load /js/phone-numbers.js and /js/microsoft-uet.js once on every page that has this file.
  function ensureSiteScripts() {
    ['/js/phone-numbers.js', '/js/microsoft-uet.js'].forEach(function (src) {
      const name = src.split('/').pop();
      const have = Array.prototype.some.call(document.scripts, function (s) {
        return String(s.getAttribute('src') || '').split('?')[0].endsWith(name);
      });
      if (!have) loadScript(src);
    });
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
    // A page can declare its own type (e.g. <html data-ff-page-type="lp_chatgpt">)
    // so paid landing pages split cleanly in website_sessions.landing_page_type.
    const declared = document.documentElement.getAttribute('data-ff-page-type');
    if (declared) return declared;
    const path = String(pathname || '/').toLowerCase();
    if (path.indexOf('/lp/') === 0) return 'paid_landing';
    if (path === '/' || path.endsWith('/index.html')) return 'homepage';
    if (path.includes('/service-areas/') || path.endsWith('/service-areas.html')) return 'location';
    if (path.includes('/services/') || path.endsWith('/services.html')) return 'service';
    if (path.includes('/blog/')) return 'blog';
    if (path.includes('calculator')) return 'calculator';
    if (path.includes('contact')) return 'contact';
    return 'page';
  }

  function safeSessionGet(key) {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function readClickIds(query) {
    const out = {};
    CLICK_ID_PARAMS.forEach(function (name) {
      const value = query.get(name);
      if (value) out[name] = String(value).slice(0, 255);
    });
    return out;
  }

  // When the URL carries a campaign marker (any utm_* or ad click id), remember it
  // for this browser session so a returning visitor who clicks an ad (e.g. ChatGPT)
  // is attributed to that ad for this session instead of their old first touch.
  // First touch stays in localStorage and is still sent as metadata.first_touch.
  function persistSessionTouch() {
    const query = getQuery();
    const clickIds = readClickIds(query);
    const hasUtm = UTM_PARAMS.some(function (name) {
      return !!query.get(name);
    });
    if (!hasUtm && !Object.keys(clickIds).length) return;
    const touch = { captured_at: nowIso(), landing_page_path: getPagePath(), click_ids: clickIds };
    UTM_PARAMS.forEach(function (name) {
      touch[name] = query.get(name) || null;
    });
    try {
      sessionStorage.setItem(SESSION_TOUCH_KEY, JSON.stringify(touch));
    } catch {
      /* storage blocked: fall back to first touch */
    }
  }

  function getSessionTouch() {
    return safeJsonParse(safeSessionGet(SESSION_TOUCH_KEY));
  }

  function buildContext() {
    const firstTouch = getStoredAttribution();
    const sessionTouch = getSessionTouch();
    const stored = sessionTouch ? Object.assign({}, firstTouch, sessionTouch, {
      gclid: (sessionTouch.click_ids || {}).gclid || null,
      gbraid: (sessionTouch.click_ids || {}).gbraid || null,
      wbraid: (sessionTouch.click_ids || {}).wbraid || null,
      fbclid: (sessionTouch.click_ids || {}).fbclid || null,
      landing_page_url: firstTouch.landing_page_url,
      landing_page_path: firstTouch.landing_page_path,
    }) : firstTouch;
    const query = getQuery();
    const clickIds = Object.assign({}, firstTouch.click_ids || {}, (sessionTouch && sessionTouch.click_ids) || {}, readClickIds(query));
    const landingUrl = stored.landing_page_url || window.location.href;
    const landingPath = stored.landing_page_path || getPagePath();
    return {
      website: 'frostfire',
      session_key: ensureSessionKey(),
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
      metadata: {
        click_ids: clickIds,
        phone_channel: document.documentElement.getAttribute('data-ff-phone-channel') || null,
        first_touch: {
          utm_source: firstTouch.utm_source || null,
          utm_medium: firstTouch.utm_medium || null,
          utm_campaign: firstTouch.utm_campaign || null,
          landing_page_path: firstTouch.landing_page_path || null,
          first_touch_at: firstTouch.first_touch_at || null,
        },
        session_touch: sessionTouch || null,
      },
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
      click_ids: Object.assign({}, readClickIds(query), existing.click_ids || {}),
      last_seen_at: nowIso(),
    };
    setStoredAttribution(next);
    return next;
  }

  async function postJson(url, body, opts) {
    const requireOk = !!(opts && opts.requireOk);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      });
      if (requireOk && !resp.ok) {
        const text = await resp.text().catch(function () {
          return '';
        });
        throw new Error('Lead API ' + resp.status + (text ? ': ' + text.slice(0, 200) : ''));
      }
      return resp;
    } catch (err) {
      if (requireOk) throw err;
      // Best effort only for analytics/session events.
      return null;
    }
  }

  function eventMetadata(extra) {
    const clickIds = (buildContext().metadata || {}).click_ids || {};
    return {
      ...extra,
      click_ids: Object.keys(clickIds).length ? clickIds : undefined,
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
    // website_leads.details is persisted as-is, so non-column attribution
    // (oppref, msclkid, first vs session touch) is kept there for reporting.
    if (payload) {
      const meta = (payload.context && payload.context.metadata) || buildContext().metadata || {};
      payload.details = Object.assign({}, details, {
        click_ids: Object.assign({}, meta.click_ids || {}, details.click_ids || {}),
        first_touch: details.first_touch || meta.first_touch || null,
        session_touch: details.session_touch || meta.session_touch || null,
        phone_channel: details.phone_channel || meta.phone_channel || null,
        landing_page_type: details.landing_page_type || inferPageType(getPagePath()),
      });
    }
    pushDataLayer('website_lead', {
      lead_channel: payload && payload.lead_channel ? payload.lead_channel : 'website',
      cta_type: details.cta_type || undefined,
      service_requested: payload && payload.service_requested ? payload.service_requested : undefined,
      city: payload && payload.city ? payload.city : undefined,
      page_path: payload && payload.context ? payload.context.page_path : undefined,
      page_type: payload && payload.context ? payload.context.page_type : undefined
    });
    // Lead submits must surface failures so the form can show a retry/call message.
    return postJson(API.lead, payload, { requireOk: true }).then(function (resp) {
      // Microsoft UET conversion (no-op until js/microsoft-uet.js has a tag id).
      try {
        if (window.FrostFireUET) window.FrostFireUET.lead({ cta_type: details.cta_type || undefined });
      } catch {
        /* never block the form */
      }
      return resp;
    });
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
      if (href.indexOf('join.frostfirehvacr.com') >= 0) {
        // Comfort Club / Landlord / Commercial signup lives on the CRM's join site.
        // Carry this visit's UTMs + website session across so the CRM can attribute
        // the membership (the join page does not record them yet; see report).
        const ctx = buildContext();
        try {
          const target = new URL(link.href);
          ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (name) {
            if (ctx[name] && !target.searchParams.get(name)) target.searchParams.set(name, ctx[name]);
          });
          if (!target.searchParams.get('ff_session')) target.searchParams.set('ff_session', ctx.session_key);
          if (!target.searchParams.get('ff_src')) target.searchParams.set('ff_src', ctx.page_path || '');
          link.href = target.toString();
        } catch {
          /* leave the link as-is */
        }
        trackEvent('cta_click', { cta_type: 'comfort_club_join', lead_channel: 'membership', label: text, href: href });
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
    // Legacy hook used by older form handlers.
    const originalTrackLead = window.FrostFireTrackLead;
    window.FrostFireTrackLead = function (lead) {
      trackLead(lead);
      if (typeof originalTrackLead === 'function') {
        originalTrackLead(lead);
      }
    };

    // Any form marked data-ff-lead="true" (or #contact-form) posts into CRM.
    document.querySelectorAll('form[data-ff-lead="true"], form#contact-form').forEach(function (form) {
      if (form.dataset.ffLeadBound === '1') return;
      form.dataset.ffLeadBound = '1';
      // main.js owns #contact-form submit; only auto-bind other marked forms here.
      if (form.id === 'contact-form') return;
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const fd = new FormData(form);
        const lead = {
          context: buildContext(),
          lead_channel: form.getAttribute('data-ff-channel') || 'form',
          full_name: String(fd.get('name') || fd.get('full_name') || '').trim(),
          email: String(fd.get('email') || '').trim() || null,
          phone: String(fd.get('phone') || '').trim() || null,
          service_requested: String(fd.get('service') || fd.get('service_requested') || '').trim() || null,
          city: String(fd.get('city') || '').trim() || null,
          address: String(fd.get('address') || '').trim() || null,
          message: String(fd.get('message') || '').trim() || null,
          details: {
            source_page: window.location.pathname,
            cta_type: form.getAttribute('data-ff-cta') || 'marked_form',
            form_id: form.id || null,
          },
        };
        if (!lead.full_name || (!lead.phone && !lead.email)) {
          alert('Please provide your name and a phone or email so we can follow up.');
          return;
        }
        trackLead(lead)
          .then(function () {
            alert('Thanks! Your request is in our system. For immediate help call (919) 230-4439.');
            form.reset();
          })
          .catch(function () {
            alert('We hit a temporary issue submitting your request. Please call (919) 230-4439.');
          });
      });
    });
  }

  function installCalculatorHelpers() {
    const path = getPagePath().toLowerCase();
    if (path.indexOf('calculator') === -1) return;
    window.FrostFireTrackEvent = trackEvent;
    window.FrostFireBuildAttributionContext = buildContext;
    trackEvent('calculator_view', { lead_channel: 'calculator' });
  }

  // Site-wide helpers: ad-channel phone numbers + Microsoft UET (main.js loads them too).
  ensureSiteScripts();
  persistFirstTouch();
  persistSessionTouch();
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
