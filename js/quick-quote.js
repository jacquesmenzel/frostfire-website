/**
 * Short "get a quote" form on service and city pages (the Contact page was the
 * only real form, and it produced most website leads). Posts into the CRM via
 * FrostFireAttribution.trackLead so the lead carries its source and page.
 */
(function () {
  if (document.getElementById('ff-quick-quote')) return;
  var path = window.location.pathname.toLowerCase();
  if (!/^\/(services|service-areas|areas|guides)\//.test(path)) return;

  var h1 = document.querySelector('h1');
  var pageTopic = h1 ? h1.textContent.trim() : document.title.split('|')[0].trim();
  var guess = /furnace|heat(ing)?\b|heater|no heat/.test(path) ? 'Heating repair'
    : /heat-pump/.test(path) ? 'Heat pump service'
    : /install|replace/.test(path) ? 'New system / replacement'
    : /maint|tune/.test(path) ? 'Maintenance / tune-up'
    : /mini-split/.test(path) ? 'Mini-split'
    : /duct/.test(path) ? 'Ductwork'
    : /commercial|walk-in|rtu|cooler|freezer/.test(path) ? 'Commercial / refrigeration'
    : /ac|cool|air/.test(path) ? 'AC repair'
    : '';
  var services = ['AC repair', 'Heating repair', 'Heat pump service', 'New system / replacement', 'Maintenance / tune-up', 'Mini-split', 'Ductwork', 'Commercial / refrigeration', 'Something else'];

  var css = '#ff-quick-quote{padding:44px 20px;background:#0f172a;color:#fff}' +
    '#ff-quick-quote .qq{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 1.3fr;gap:28px;align-items:center}' +
    '#ff-quick-quote h2{font-family:Montserrat,Inter,system-ui,sans-serif;font-size:1.7rem;line-height:1.2;margin:0 0 10px;color:#fff}' +
    '#ff-quick-quote p{color:#cbd5e1;margin:0 0 8px;line-height:1.6}' +
    '#ff-quick-quote form{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '#ff-quick-quote input,#ff-quick-quote select,#ff-quick-quote textarea{width:100%;box-sizing:border-box;padding:12px 14px;border-radius:10px;border:1px solid #334155;background:#fff;color:#0f172a;font:inherit;font-size:16px}' +
    '#ff-quick-quote textarea{grid-column:1/-1;min-height:70px;resize:vertical}' +
    '#ff-quick-quote button{grid-column:1/-1;padding:14px;border:0;border-radius:10px;background:#dc2626;color:#fff;font-weight:700;font-size:1.05rem;cursor:pointer}' +
    '#ff-quick-quote button:disabled{opacity:.7}' +
    '#ff-quick-quote .qq-ok{grid-column:1/-1;background:#14532d;border-radius:10px;padding:16px;color:#dcfce7;font-weight:600}' +
    '#ff-quick-quote .qq-small{font-size:.85rem;color:#94a3b8}' +
    '#ff-quick-quote a{color:#fca5a5;font-weight:700}' +
    '@media (max-width:760px){#ff-quick-quote .qq{grid-template-columns:1fr}#ff-quick-quote form{grid-template-columns:1fr}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var section = document.createElement('section');
  section.id = 'ff-quick-quote';
  section.innerHTML =
    '<div class="qq">' +
      '<div>' +
        '<h2>Get a fast quote</h2>' +
        '<p>Tell us what’s going on and we’ll text or call you back fast. $59 diagnostic, waived if we do the repair. Same price on weekends.</p>' +
        '<p class="qq-small">Need help right now? Call <a href="tel:+19192304439">(919) 230-4439</a>. We answer 24/7.</p>' +
      '</div>' +
      '<form data-ff-quick="1" novalidate>' +
        '<input name="name" autocomplete="name" placeholder="Your name" required aria-label="Your name">' +
        '<input name="phone" type="tel" autocomplete="tel" placeholder="Mobile number" required aria-label="Mobile number">' +
        '<select name="service" aria-label="Service needed">' +
          '<option value=""' + (guess ? '' : ' selected') + '>What do you need?</option>' +
          services.map(function (s) { return '<option' + (s === guess ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
        '</select>' +
        '<input name="zip" inputmode="numeric" autocomplete="postal-code" placeholder="ZIP code" aria-label="ZIP code">' +
        '<input name="ff_hp_field" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">' +
        '<textarea name="message" placeholder="What’s happening? (optional)" aria-label="What is happening"></textarea>' +
        '<button type="submit">Get my quote</button>' +
      '</form>' +
    '</div>';

  var anchor = document.getElementById('areas-we-serve') || document.querySelector('footer');
  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(section, anchor);
  else document.body.appendChild(section);

  var form = section.querySelector('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var name = String(fd.get('name') || '').trim();
    var phone = String(fd.get('phone') || '').trim();
    if (!name || phone.replace(/\D/g, '').length < 10) {
      alert('Please add your name and a 10-digit phone number so we can reach you.');
      return;
    }
    var api = window.FrostFireAttribution;
    var lead = {
      context: api && api.getContext ? api.getContext() : { website: 'frostfire', page_url: location.href, page_path: location.pathname, page_title: document.title },
      lead_channel: 'form',
      full_name: name,
      phone: phone,
      email: null,
      service_requested: String(fd.get('service') || '').trim() || null,
      city: null,
      address: String(fd.get('zip') || '').trim() ? 'ZIP ' + String(fd.get('zip')).trim() : null,
      message: String(fd.get('message') || '').trim() || null,
      details: { source_page: location.pathname, page_topic: pageTopic, cta_type: 'quick_quote', hp: String(fd.get('ff_hp_field') || '') },
    };
    var btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    var send = api && api.trackLead
      ? api.trackLead(lead)
      : fetch('/api/v1/public/website/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
          .then(function (r) { if (!r.ok) throw new Error(String(r.status)); });
    Promise.resolve(send)
      .then(function () {
        if (api && api.trackEvent) api.trackEvent('form_submit', { lead_channel: 'form', cta_type: 'quick_quote' });
        form.innerHTML = '<div class="qq-ok">Got it, ' + name.split(' ')[0].replace(/[<>&"]/g, '') + '. We’ll reach out shortly at ' + phone.replace(/[<>&"]/g, '') + '. If it’s urgent, call (919) 230-4439.</div>';
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Get my quote';
        alert('That didn’t go through. Please call (919) 230-4439 and we’ll help right away.');
      });
  });
})();
