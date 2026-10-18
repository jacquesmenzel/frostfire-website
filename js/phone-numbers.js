/* Frost Fire phone number by channel (dynamic number insertion).
 *
 * Any element marked data-ff-phone gets the channel's number:
 *   <a data-ff-phone href="tel:+19192304439">(919) 230-4439</a>   -> href + text swapped
 *   <a data-ff-phone href="tel:..."><svg/> <span data-ff-phone-text>(919) 230-4439</span></a>
 *                                                                  -> href + only the span text
 *   <a data-ff-phone="href" ...>Call now</a>                       -> only href swapped
 *   <span data-ff-phone>(919) 230-4439</span>                      -> text swapped
 * On ad-click visits (a dedicated channel number), plain tel: links to the main line
 * are swapped too, so every page works without markup. Mark anything that must keep
 * the main line (NAP, schema) with data-ff-phone-keep.
 *
 * Which channel?
 *   1. <html data-ff-phone-channel="chatgpt"> (a page built for one ad channel), else
 *   2. this visit's utm_source / click id (see channelFromUrl), remembered for the session, else
 *   3. "default" (main line, also for organic / direct visits).
 *
 * Numbers are Twilio tracking lines: they forward to the main line and log the channel
 * in the CRM (get-forge-flow /api/v1/twilio/tracking/voice). A null number falls back to
 * the main line.
 */
(function () {
  var MAIN = { e164: '+19192304439', display: '(919) 230-4439' };

  var NUMBERS = {
    default: MAIN,
    chatgpt: { e164: '+19842058039', display: '(984) 205-8039' }, // ChatGPT / OpenAI ads (oppref / utm_source=chatgpt + cpc)
    google_ads: { e164: '+19844597404', display: '(984) 459-7404' }, // Google Search ads (gclid / utm_source=google + cpc)
    google_lsa: { e164: '+19842057954', display: '(984) 205-7954' }, // Google LSA: set on the LSA profile; never swapped from a URL
    bing: { e164: '+19842054933', display: '(984) 205-4933' }, // Microsoft / Bing ads (msclkid / utm_source=bing)
    meta: { e164: '+19847894886', display: '(984) 789-4886' }, // Facebook / Instagram ads (fbclid / utm_source=facebook, paid)
    offline: null, // Truck wrap / yard signs (+19842054264): printed only, never swapped on the site
  };

  var SESSION_KEY = 'ff_phone_channel_v1';
  var PAID = { cpc: 1, ppc: 1, paid: 1, paid_search: 1, paid_social: 1, ads: 1 };

  function channelFromUrl() {
    var q;
    try {
      q = new URLSearchParams(window.location.search);
    } catch (e) {
      return null;
    }
    var src = String(q.get('utm_source') || '').toLowerCase();
    var medium = String(q.get('utm_medium') || '').toLowerCase();
    // ChatGPT: only paid clicks. Organic ChatGPT answers add utm_source=chatgpt.com themselves.
    if (q.get('oppref') || ((src === 'chatgpt' || src === 'openai' || src === 'chatgpt.com') && PAID[medium])) return 'chatgpt';
    if (q.get('msclkid') || src === 'bing' || src === 'microsoft') return 'bing';
    if (q.get('fbclid') || src === 'facebook' || src === 'instagram' || src === 'meta' || src === 'fb' || src === 'ig') {
      return medium === 'organic' || medium === 'social' ? null : 'meta';
    }
    if (q.get('gclid') || q.get('gbraid') || q.get('wbraid') || (src === 'google' && PAID[medium])) {
      return 'google_ads';
    }
    return null;
  }

  function resolveChannel() {
    var declared = document.documentElement.getAttribute('data-ff-phone-channel');
    var fromUrl = channelFromUrl();
    var pick = declared || fromUrl;
    try {
      // Remember an ad landing for the session so the rest of the site keeps the ad's number.
      if (pick && NUMBERS[pick] && pick !== 'google_lsa') sessionStorage.setItem(SESSION_KEY, pick);
      return pick || sessionStorage.getItem(SESSION_KEY) || 'default';
    } catch (e) {
      return pick || 'default';
    }
  }

  function numberFor(channel) {
    return NUMBERS[channel] || MAIN;
  }

  var MAIN_DIGITS = MAIN.e164.replace(/\D/g, '').slice(-10);
  // (919) 230-4439 / 919-230-4439 / 919.230.4439 / 9192304439 / +1 919 230 4439
  var MAIN_TEXT = /(\+?1[\s.-]?)?\(?919\)?[\s.-]?230[\s.-]?4439/g;

  function isMainTel(href) {
    var d = String(href || '').replace(/^tel:/i, '').replace(/\D/g, '');
    return d.slice(-10) === MAIN_DIGITS;
  }

  function swapEl(el, num, mode) {
    if (el.tagName === 'A') el.setAttribute('href', 'tel:' + num.e164);
    if (mode !== 'href') {
      // Keep icons: if the element has a [data-ff-phone-text] child, only that text changes.
      var label = el.querySelector('[data-ff-phone-text]');
      if (label) {
        label.textContent = num.display;
      } else if (mode !== 'auto' && el.children.length === 0) {
        el.textContent = num.display;
      } else {
        swapTextNodes(el, num);
      }
    }
  }

  function swapTextNodes(root, num) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      if (MAIN_TEXT.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(MAIN_TEXT, num.display);
      MAIN_TEXT.lastIndex = 0;
    }
  }

  function apply(root) {
    var scope = root || document;
    var channel = resolveChannel();
    var num = numberFor(channel);
    var dedicated = !!NUMBERS[channel] && channel !== 'default';
    var nodes = scope.querySelectorAll('[data-ff-phone]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      swapEl(el, num, el.getAttribute('data-ff-phone'));
      el.setAttribute('data-ff-phone-channel-used', dedicated ? channel : 'default');
    }
    if (dedicated) {
      // Unmarked tel: links to the main line (the rest of the site) get the ad's number too.
      var links = scope.querySelectorAll('a[href^="tel:"]:not([data-ff-phone])');
      for (var j = 0; j < links.length; j++) {
        var a = links[j];
        if (a.closest('[data-ff-phone-keep]') || !isMainTel(a.getAttribute('href'))) continue;
        swapEl(a, num, 'auto');
        a.setAttribute('data-ff-phone-channel-used', channel);
      }
    }
    return { channel: channel, number: num, dedicated: dedicated };
  }

  window.FrostFirePhone = {
    numbers: NUMBERS,
    main: MAIN,
    resolveChannel: resolveChannel,
    channelFromUrl: channelFromUrl,
    numberFor: numberFor,
    apply: apply,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      apply();
    });
  } else {
    apply();
  }
})();
