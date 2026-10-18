/* Frost Fire phone number by channel (one config, swap later).
 *
 * Any element marked data-ff-phone gets the channel's number:
 *   <a data-ff-phone href="tel:+19192304439">(919) 230-4439</a>   -> href + text swapped
 *   <a data-ff-phone href="tel:..."><svg/> <span data-ff-phone-text>(919) 230-4439</span></a>
 *                                                                  -> href + only the span text
 *   <a data-ff-phone="href" ...>Call now</a>                       -> only href swapped
 *   <span data-ff-phone>(919) 230-4439</span>                      -> text swapped
 *
 * Which channel?
 *   1. <html data-ff-phone-channel="chatgpt"> (a page built for one ad channel), else
 *   2. this session's utm_source / click id (see channelFromUrl), else
 *   3. "default".
 *
 * To turn on a dedicated tracking number: put its E.164 + display text in the
 * channel below. A null number falls back to the main line, so nothing breaks
 * before numbers are bought. See get-forge-flow docs/call_tracking_plan.md.
 */
(function () {
  var MAIN = { e164: '+19192304439', display: '(919) 230-4439' };

  var NUMBERS = {
    default: MAIN,
    // TODO(Jax): fill in after buying Twilio tracking numbers (docs/call_tracking_plan.md).
    chatgpt: null, // ChatGPT / OpenAI ads
    google_ads: null, // Google Search ads (gclid / utm_source=google + cpc)
    google_lsa: null, // Google Local Services Ads (set on the LSA profile itself, not the site)
    bing: null, // Microsoft / Bing ads (msclkid / utm_source=bing)
    meta: null, // Facebook / Instagram ads (fbclid / utm_source=facebook)
    offline: null, // Truck wrap, yard signs, door hangers (printed, not swapped on the site)
  };

  var SESSION_KEY = 'ff_phone_channel_v1';

  function channelFromUrl() {
    var q;
    try {
      q = new URLSearchParams(window.location.search);
    } catch (e) {
      return null;
    }
    var src = String(q.get('utm_source') || '').toLowerCase();
    var medium = String(q.get('utm_medium') || '').toLowerCase();
    if (q.get('oppref') || src === 'chatgpt' || src === 'openai' || src === 'chatgpt.com') return 'chatgpt';
    if (q.get('msclkid') || src === 'bing' || src === 'microsoft') return 'bing';
    if (q.get('fbclid') || src === 'facebook' || src === 'instagram' || src === 'meta' || src === 'fb' || src === 'ig') {
      return medium === 'organic' || medium === 'social' ? null : 'meta';
    }
    if (q.get('gclid') || q.get('gbraid') || q.get('wbraid') || (src === 'google' && (medium === 'cpc' || medium === 'ppc' || medium === 'paid'))) {
      return 'google_ads';
    }
    return null;
  }

  function resolveChannel() {
    var declared = document.documentElement.getAttribute('data-ff-phone-channel');
    if (declared) return declared;
    var fromUrl = channelFromUrl();
    try {
      if (fromUrl) sessionStorage.setItem(SESSION_KEY, fromUrl);
      return fromUrl || sessionStorage.getItem(SESSION_KEY) || 'default';
    } catch (e) {
      return fromUrl || 'default';
    }
  }

  function numberFor(channel) {
    return NUMBERS[channel] || MAIN;
  }

  function apply(root) {
    var channel = resolveChannel();
    var num = numberFor(channel);
    var nodes = (root || document).querySelectorAll('[data-ff-phone]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var mode = el.getAttribute('data-ff-phone');
      if (el.tagName === 'A') el.setAttribute('href', 'tel:' + num.e164);
      if (mode !== 'href') {
        // Keep icons: if the element has a [data-ff-phone-text] child, only that text changes.
        var label = el.querySelector('[data-ff-phone-text]');
        (label || el).textContent = num.display;
      }
      el.setAttribute('data-ff-phone-channel-used', NUMBERS[channel] ? channel : 'default');
    }
    return { channel: channel, number: num, dedicated: !!NUMBERS[channel] };
  }

  window.FrostFirePhone = { numbers: NUMBERS, main: MAIN, resolveChannel: resolveChannel, numberFor: numberFor, apply: apply };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      apply();
    });
  } else {
    apply();
  }
})();
