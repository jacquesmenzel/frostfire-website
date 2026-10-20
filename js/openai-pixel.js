/* ChatGPT (OpenAI Ads) Measurement Pixel + conversion events.
 *
 * Pixel "Frost Fire Website" (created via the Ads API 10/20). The pixel reads the
 * ad click id (?oppref=) into the __oppref cookie and keeps a browser reference in
 * __obref; attribution.js copies both into lead.details.openai so the CRM can send
 * the same events server-side (Conversions API) and OpenAI dedupes on event_id.
 *
 * Events:
 *   page_viewed            - every page load
 *   lead_created           - a website form lead (FrostFireOpenAI.lead(eventId), from attribution.js)
 *   custom phone_click     - a tap on a tel: link (the real call is counted server-side
 *                            as lead_created when it rings the ChatGPT tracking number)
 */
(function () {
  var PIXEL_ID = 'HMoPNM8ooiAtKHAbjjep5K';

  if (!PIXEL_ID || window.__ffOpenAiPixel) return;
  window.__ffOpenAiPixel = true;

  // OpenAI's loader snippet (docs: developers.openai.com/ads/measurement-pixel).
  (function (w, d, s, u) {
    if (w.oaiq) return;
    var q = function () {
      q.q.push(arguments);
    };
    q.q = [];
    w.oaiq = q;
    var js = d.createElement(s);
    js.async = true;
    js.src = u;
    var f = d.getElementsByTagName(s)[0];
    f.parentNode.insertBefore(js, f);
  })(window, document, 'script', 'https://bzrcdn.openai.com/sdk/oaiq.min.js');

  window.oaiq('init', { pixelId: PIXEL_ID });
  window.oaiq('measure', 'page_viewed', {
    type: 'contents',
    contents: [{ id: location.pathname || '/', name: document.title || 'page', content_type: 'page' }],
  });

  function cookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function newEventId(prefix) {
    var rand = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    return (prefix || 'evt') + '_' + rand;
  }

  function measure(name, data, opts) {
    try {
      window.oaiq('measure', name, data, opts || {});
      return true;
    } catch (e) {
      return false;
    }
  }

  window.FrostFireOpenAI = {
    pixelId: PIXEL_ID,
    newEventId: newEventId,
    // { oppref, obref } from the pixel's cookies (or the URL on the landing hit).
    refs: function () {
      var q = new URLSearchParams(location.search);
      return { oppref: q.get('oppref') || cookie('__oppref'), obref: cookie('__obref') };
    },
    lead: function (eventId) {
      return measure('lead_created', { type: 'customer_action' }, { event_id: eventId || newEventId('lead') });
    },
    phoneClick: function () {
      return measure('custom', { type: 'custom' }, { custom_event_name: 'phone_click', event_id: newEventId('call') });
    },
  };
})();
