/**
 * Builds 1500+ word local SEO pages from neighborhood/town specs.
 * Strategy: hyper-local keywords — NOT generic "AC repair Raleigh".
 */
export function buildLocalPage(spec) {
  const place = spec.place_name;
  const city = spec.parent_city;
  const loc = city ? `${place}, ${city}` : place;
  const kw = spec.primary_keyword;
  const systems = spec.common_systems || ['central AC', 'heat pumps', 'gas furnaces'];
  const years = spec.housing_years || '1990s–2020s';
  const nearby = (spec.nearby_places || []).slice(0, 4).join(', ');
  const svc = spec.service_focus || 'HVAC repair and installation';

  const serviceLinks = {
    ac: '<a href="../services/ac-repair.html">AC repair</a>',
    heat: '<a href="../services/heating-repair.html">heating repair</a>',
    hp: '<a href="../services/heat-pump.html">heat pump service</a>',
    maint: '<a href="../services/maintenance.html">maintenance plans</a>',
    emerg: '<a href="../services/emergency-ac-repair-clayton-nc.html">emergency AC repair</a>',
    sunday: '<a href="../services/open-sundays-no-extra-charge-hvac.html">open Sundays — no surcharge</a>',
    mini: '<a href="../services/mini-split.html">mini-split installation</a>',
    comm: '<a href="../services/commercial.html">commercial HVAC</a>',
    clayton: `<a href="../service-areas/clayton-nc.html">${city || 'Clayton'}, NC</a>`,
    parent: city
      ? `<a href="../service-areas/${city.toLowerCase().replace(/\s+/g, '-')}-nc.html">${city}</a>`
      : '',
  };

  const intro = [
    `If you live in <strong>${loc}</strong> and your system is struggling, you do not need a generic Triangle contractor — you need someone who already runs your roads. Frost Fire is headquartered in Clayton and built for neighborhoods like ${place}: same-day triage when we can, clear pricing, and <strong>${kw}</strong> without the weekend markup most companies add.`,
    `${spec.unique_hook || `Homes around ${spec.landmarks || place} often run ${systems.join(', ')} from the ${years} build era. That mix creates predictable failure patterns — capacitors in July, heat pump defrost issues in January, and condensate backups when humidity spikes. We diagnose the cause, explain options in plain language, and fix it right.`}`,
    `This page is a local guide for ${place} homeowners: what breaks, what you can check safely, when to call, and how Frost Fire serves ${city || 'your area'} differently than distant Raleigh-centric shops. Need help now? Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a>.`,
  ];

  const sections = [
    {
      id: 'about-area',
      title: `About ${place}`,
      paragraphs: [
        `${place} sits in ${spec.county || 'the Triangle region'}${city ? ` within the ${city} community` : ''}. ${spec.about || `Residents here value quick response and honest local service — not a call center three counties away.`}`,
        `Landmarks and routes our technicians know: ${spec.landmarks || 'local NC roads and subdivisions'}. When you call from ${place}, we route from Clayton — often faster than a Raleigh shop that treats your neighborhood as an add-on zip code.`,
        `Whether you are in an established street or a newer master-planned section, ${spec.housing_profile || 'local housing'} shapes the HVAC work we do most often.`,
      ],
    },
    {
      id: 'housing-hvac',
      title: `Housing & HVAC in ${place}`,
      paragraphs: [
        `Most calls in ${place} involve equipment from the ${years} period: ${systems.join(', ')}. Newer heat pumps dominate many streets; older sections may still mix furnaces with central AC or benefit from ${serviceLinks.mini}.`,
        `North Carolina humidity means coils work hard and condensate drains clog. Pollen seasons load filters fast. If your home backs up to trees or sits in full afternoon sun, outdoor units age quicker — especially without ${serviceLinks.maint}.`,
      ],
      list: spec.housing_issues || [
        `Short-cycling on newer tight homes in ${place}`,
        'Capacitor and contactor failures on aging outdoor units',
        'Clogged filters after spring pollen around Johnston/Wake',
        'Condensate float switch trips from blocked drains',
        'Heat pump aux heat stuck on during cold snaps',
        'Thermostat miswires after DIY smart thermostat installs',
      ],
    },
    {
      id: 'services',
      title: `HVAC Services We Provide Near ${place}`,
      paragraphs: [
        `Frost Fire offers full ${svc} for ${loc}: ${serviceLinks.ac}, ${serviceLinks.heat}, ${serviceLinks.hp}, ${serviceLinks.maint}, and ${serviceLinks.emerg}. We also handle ${serviceLinks.comm} and restaurant refrigeration along commercial corridors.`,
        `We are not a one-trick "AC only" van. Heat pumps — common in ${place} — need reversing valve, defrost, and auxiliary heat expertise that furnace-only techs miss.`,
      ],
      list: [
        `Same-day ${serviceLinks.ac} triage (when capacity allows)`,
        `${serviceLinks.heat} and heat pump diagnostics`,
        `${serviceLinks.maint} before summer and winter peaks`,
        `${serviceLinks.mini} for additions and problem rooms`,
        `${serviceLinks.sunday} — same rates as weekdays`,
        'Commercial RTU and walk-in cooler support for local businesses',
      ],
    },
    {
      id: 'common-problems',
      title: `Common HVAC Problems in ${place}`,
      paragraphs: [
        `These are the failures we see most often within a few miles of ${place} — not generic national lists:`,
        `Mid-summer no-cool calls usually trace to capacitors, dirty coils, or weak airflow from neglected filters. Mid-winter no-heat on heat pumps often involves defrost boards, iced outdoor coils, or aux heat that will not engage.`,
      ],
      ordered_list: [
        'Thermostat in wrong mode or schedule hold fighting your setpoint',
        'Tripped breaker after storms — reset once, then call if it trips again',
        'Filter packed with pollen — replace before assuming "low freon"',
        'Outdoor fan not spinning while compressor hums — shut down and call',
        'Water at the indoor unit — condensate drain or frozen coil thaw issue',
        'Uneven rooms — duct leaks or return starvation, not always "bad AC"',
      ],
    },
    {
      id: 'diy-checks',
      title: `What You Can Check Before Calling`,
      paragraphs: [
        `Homeowners in ${place} can safely verify thermostat settings (Cool/Heat, fan Auto, setpoint past room temp), replace a dirty filter, and confirm the outdoor disconnect is seated. Check both indoor and outdoor breakers once.`,
        `Do not open refrigerant lines, do not keep resetting breakers, and shut the system off if you hear grinding or smell burning. See our <a href="../blog/things-to-check-when-ac-not-working.html">AC troubleshooting checklist</a> for the full safe sequence.`,
      ],
    },
    {
      id: 'why-local',
      title: `Why a Clayton-Based Company Fits ${place} Better Than a Raleigh Hub`,
      paragraphs: [
        `Big Raleigh brands buy ads for "AC repair Raleigh" and then dispatch whoever is available — sometimes from an hour away, often with weekend surcharges. Frost Fire is local to ${serviceLinks.clayton}. ${place} is on routes we already drive for ${nearby || 'neighboring communities'}.`,
        `That matters when your house is 88°F inside on a Sunday. We answer, triage honestly, and charge the same on Sundays as Tuesday — a differentiator worth comparing before you pay overtime rates elsewhere.`,
        `Local also means we recognize ${spec.housing_profile || 'your housing stock'} and do not recommend furnace-only fixes on heat pump systems.`,
      ],
    },
    {
      id: 'seasonal',
      title: 'Seasonal HVAC Tips for This Area',
      paragraphs: [
        `<strong>Spring (March–April):</strong> Schedule cooling maintenance before the first heat wave. Clear debris around outdoor units after pollen season starts.`,
        `<strong>Summer:</strong> Check filters monthly. ${place} afternoons can push systems nonstop — capacitors fail when they are hottest.`,
        `<strong>Fall:</strong> Heating tune-up for heat pumps and furnaces. Verify defrost before the first hard freeze.`,
        `<strong>Winter:</strong> If ice builds on the outdoor unit, read <a href="../blog/heat-pump-icing-up-what-to-do.html">heat pump icing guide</a> — some frost is normal, solid ice is not.`,
      ],
    },
    {
      id: 'commercial',
      title: 'Commercial & Restaurant Support Nearby',
      paragraphs: [
        `Food service and retail along ${spec.commercial_corridor || 'US-70, Main Street, and local retail corridors'} depend on working RTUs and walk-in coolers. We prioritize inventory-threatening refrigeration calls and Sunday kitchen failures at weekday rates.`,
        `See <a href="../services/walk-in-cooler-repair-raleigh-nc.html">walk-in cooler repair</a> and <a href="../services/commercial-rtu-repair-clayton-nc.html">RTU repair Clayton</a> for commercial depth — we serve ${city || 'Johnston and east Wake'} businesses, not just houses.`,
      ],
    },
    {
      id: 'local-tips',
      title: `Practical HVAC Tips for ${place} Homeowners`,
      paragraphs: [
        `Set your thermostat fan to <strong>Auto</strong> during humid ${city || 'Johnston'} summers — constant fan can re-evaporate moisture off a wet coil and make the house feel clammy even when the temperature looks correct on the display.`,
        `If your home was built in the ${years} era common around ${place}, budget for capacitor replacements every few summers and a full ${serviceLinks.maint} visit before Memorial Day weekend. That single visit prevents a large share of the no-cool Sunday calls we take from ${place} and ${nearby || 'nearby streets'}.`,
        `Keep at least two feet clear around outdoor units — lawn clippings and cottonwood from ${spec.county || 'local'} tree lines are silent efficiency killers. Rinse the exterior gently with a hose (not a pressure washer on the fins) if you notice debris after mowing.`,
        `When comparing quotes, ask whether the company is dispatching from Clayton or from a Raleigh hub. Drive time is billable one way or another — a Clayton-based crew serving ${place} is structurally faster and often more honest about Sunday pricing.`,
      ],
    },
    {
      id: 'nearby',
      title: `Also Serving Neighborhoods Near ${place}`,
      paragraphs: [
        `We connect ${place} with nearby coverage so you are never stuck in a single-page silo: ${(spec.nearby_links || [])
          .map((n) => `<a href="${n.href}">${n.title}</a>`)
          .join(', ') || nearby}.`,
        `Parent city hub: ${serviceLinks.parent || serviceLinks.clayton}. Educational guides: <a href="../blog/">HVAC blog</a>.`,
      ],
    },
  ].filter((s) => s.paragraphs?.length || s.list?.length);

  const faqs = [
    {
      q: `Do you serve ${place} specifically?`,
      a: `Yes. ${place} is part of our core ${city || 'Clayton'} routing — not an "out of area" surcharge zone. Call (919) 230-4439 for the current ETA.`,
    },
    {
      q: `How fast can you reach ${place}?`,
      a_html: spec.eta_answer || `Because we are Clayton-based, ${place} is often among our faster response zones compared to Raleigh-centric companies. Same-day depends on seasonal demand — call early on heat-wave days.`,
    },
    {
      q: 'Is Sunday service more expensive?',
      a: 'No. Frost Fire charges the same rates on Sundays and weekends as weekdays.',
    },
    {
      q: `What HVAC systems are most common in ${place}?`,
      a: `We most often service ${systems.join(', ')} in homes built from the ${years} era around ${place}.`,
    },
    {
      q: 'Do you offer maintenance plans?',
      a_html: `Yes — ${serviceLinks.maint} help prevent the mid-summer capacitor and frozen coil calls we see every year in ${city || 'Johnston County'}.`,
    },
    {
      q: 'Can you install mini-splits in additions or garages?',
      a_html: `Yes. ${serviceLinks.mini} is popular in ${place} for bonus rooms, sunrooms, and garage conversions where ductwork is impractical.`,
    },
    {
      q: 'Do you work on heat pumps?',
      a_html: `Absolutely. ${serviceLinks.hp} including defrost, aux heat, and reversing valve issues — critical for ${place} homes.`,
    },
  ];

  const related = spec.related || [
    { href: '../services/ac-repair.html', icon: 'fa-snowflake', title: 'AC Repair' },
    { href: '../services/heat-pump.html', icon: 'fa-wind', title: 'Heat Pumps' },
    { href: '../services/emergency-ac-repair-clayton-nc.html', icon: 'fa-bolt', title: 'Emergency AC' },
    { href: '../services/open-sundays-no-extra-charge-hvac.html', icon: 'fa-calendar-check', title: 'Open Sundays' },
    { href: '../service-areas/clayton-nc.html', icon: 'fa-map-marker-alt', title: 'Clayton Hub' },
    { href: '../blog/things-to-check-when-ac-not-working.html', icon: 'fa-list-check', title: 'AC Checklist' },
  ];

  return {
    slug: spec.slug,
    title: spec.title,
    meta_description: spec.meta_description,
    h1: spec.h1,
    h1_html: spec.h1_html,
    subtitle: spec.subtitle,
    place_name: place,
    parent_city: city,
    county: spec.county,
    zip: spec.zip,
    landmarks: spec.landmarks,
    housing_profile: spec.housing_profile,
    primary_keyword: kw,
    service_type: spec.service_type || svc,
    hero_image: spec.hero_image,
    hero_alt: spec.hero_alt,
    intro,
    sections,
    why_local: spec.why_local,
    why_bullets: spec.why_bullets,
    faqs,
    related,
    cta_body: spec.cta_body || `Call Frost Fire for ${kw} in ${loc} — Clayton-based, Sunday-same-price, licensed & insured.`,
  };
}
