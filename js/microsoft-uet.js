/* Microsoft Advertising (Bing) UET tag + conversion events.
 *
 * Does nothing until UET_TAG_ID is set. Get it in Microsoft Advertising:
 * Tools -> UET tag -> (create) -> copy the numeric Tag ID, paste below, deploy.
 *
 * Events (create matching "Event" conversion goals in Microsoft Advertising):
 *   submit_lead_form  - any website lead form sent (FrostFireUET.lead(), called by attribution.js)
 *   phone_call_click  - a tap on any tel: link
 */
(function () {
  var UET_TAG_ID = '187281910'; // Microsoft Advertising UET tag "Frost Fire website" (created via API 10/19)

  var queue = [];
  function push(args) {
    if (!UET_TAG_ID) return false;
    if (window.uetq && typeof window.uetq.push === 'function') {
      window.uetq.push.apply(window.uetq, args);
    } else {
      queue.push(args);
    }
    return true;
  }

  function load() {
    if (!UET_TAG_ID || window.__ffUetLoaded) return;
    window.__ffUetLoaded = true;
    // Microsoft's standard UET snippet, with the tag id from the constant above.
    (function (w, d, t, r, u) {
      var f, n, i;
      w[u] = w[u] || [];
      f = function () {
        var o = { ti: UET_TAG_ID, enableAutoSpaTracking: true };
        o.q = w[u];
        w[u] = new UET(o);
        w[u].push('pageLoad');
        for (var k = 0; k < queue.length; k++) w[u].push.apply(w[u], queue[k]);
        queue = [];
      };
      n = d.createElement(t);
      n.src = r;
      n.async = 1;
      n.onload = n.onreadystatechange = function () {
        var s = this.readyState;
        if (!s || s === 'loaded' || s === 'complete') {
          f();
          n.onload = n.onreadystatechange = null;
        }
      };
      i = d.getElementsByTagName(t)[0];
      i.parentNode.insertBefore(n, i);
    })(window, document, 'script', '//bat.bing.com/bat.js', 'uetq');
  }

  function lead(extra) {
    return push([
      'event',
      'submit_lead_form',
      Object.assign({ event_category: 'lead', event_label: (extra && extra.cta_type) || 'form' }, extra || {}),
    ]);
  }

  function call(href) {
    return push(['event', 'phone_call_click', { event_category: 'lead', event_label: String(href || '').replace(/^tel:/, '') }]);
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
      if (a) call(a.getAttribute('href'));
    },
    true
  );

  window.FrostFireUET = { tagId: UET_TAG_ID, enabled: !!UET_TAG_ID, lead: lead, call: call };
  // bat.js waits until the page has painted (attribution.js); events queue until then.
  (window.FrostFireAfterPaint || function (f) { f(); })(load);
})();
