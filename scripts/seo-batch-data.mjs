/**
 * SEO batch page definitions — differentiated keywords + underserved towns.
 * Avoids commodity "AC repair Raleigh" head terms.
 */
import { MORE_SERVICES } from './seo-batch-services.mjs';

export const EXISTING_CITIES = [
  { slug: 'clayton-nc', city: 'Clayton' },
  { slug: 'raleigh-nc', city: 'Raleigh' },
  { slug: 'durham-nc', city: 'Durham' },
  { slug: 'garner-nc', city: 'Garner' },
  { slug: 'cary-nc', city: 'Cary' },
  { slug: 'apex-nc', city: 'Apex' },
  { slug: 'holly-springs-nc', city: 'Holly Springs' },
  { slug: 'fuquay-varina-nc', city: 'Fuquay-Varina' },
  { slug: 'smithfield-nc', city: 'Smithfield' },
  { slug: 'fayetteville-nc', city: 'Fayetteville' },
];

export const NEW_CITIES = [
  {
    slug: 'knightdale-nc',
    city: 'Knightdale',
    title: 'HVAC Repair & Installation in Knightdale, NC | Frost Fire',
    meta_description:
      'HVAC repair & installation in Knightdale, NC. Same-day service, open Sundays with no surcharge. Call Frost Fire at (919) 230-4439.',
    subtitle:
      'Same-day heating, cooling, and emergency HVAC for Knightdale homes and businesses — no Sunday surcharge.',
    county: 'Wake County',
    zips: '27545',
    neighborhoods: 'Mingo Creek, Glenfield, Harper Park, Knightdale Station, Hodge Road corridor, Old Knight Road',
    landmarks: 'Knightdale Station Park, downtown Knightdale, US-64 Business, Neuse River Greenway access',
    population: 'About 20,000+ residents',
    wikipedia: 'https://en.wikipedia.org/wiki/Knightdale,_North_Carolina',
    intro_paragraphs: [
      'Knightdale has grown from a quiet Wake County town into one of the Triangle\'s fastest-expanding east-side communities. New subdivisions, renovated older homes, and a rising commercial corridor along US-64 all need reliable HVAC. Frost Fire Heating and Cooling provides <strong>HVAC repair in Knightdale, NC</strong> with same-day response, licensed technicians, and the same fair rates on Sundays.',
      'Housing in Knightdale ranges from established neighborhoods near downtown to newer construction around Knightdale Station and Mingo Creek. That mix means heat pumps, gas furnaces, central AC, and ductless mini-splits — and we service all of them. When summer humidity spikes or a winter cold snap hits, we keep Knightdale homes comfortable without weekend markup.',
      'Local restaurants and retail along the Business 64 corridor also call us for commercial refrigeration and rooftop unit issues. Searching for <em>emergency AC repair Knightdale</em> or a contractor open Sundays? Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a>.',
    ],
    why_intro:
      'Knightdale sits close enough to Raleigh for big-company noise, but residents still want a local team that shows up fast and prices honestly. Frost Fire is based in nearby Clayton and regularly runs Knightdale routes — we know the neighborhoods, the traffic patterns, and how hard Triangle summers are on aging condensers.',
    faqs: [
      {
        q: 'Do you offer same-day HVAC repair in Knightdale?',
        a: 'Yes. Call (919) 230-4439 and we will triage your call for the soonest available technician — including evenings and weekends when capacity allows.',
      },
      {
        q: 'Is there a Sunday surcharge for Knightdale service?',
        a: 'No. Frost Fire charges the same rates on Sundays and weekends as weekdays.',
      },
      {
        q: 'Do you service commercial equipment in Knightdale?',
        a: 'Yes. We repair commercial HVAC, RTUs, and walk-in coolers/freezers for Knightdale restaurants and businesses.',
      },
    ],
    cta_body:
      'From emergency AC repair to heat pump service, Frost Fire is Knightdale\'s go-to HVAC partner — fair prices, 7 days a week.',
  },
  {
    slug: 'wake-forest-nc',
    city: 'Wake Forest',
    title: 'HVAC Services in Wake Forest, NC | Same-Day | Frost Fire',
    meta_description:
      'HVAC repair & installation in Wake Forest, NC. Heat pumps, AC emergencies, and Sunday service with no surcharge. Call Frost Fire at (919) 230-4439.',
    subtitle:
      'Professional heating and cooling for Wake Forest homes — same-day help, open Sundays, no weekend premium.',
    county: 'Wake County',
    zips: '27587',
    neighborhoods: 'Heritage, Holding Village, Hasentree, Traditions, Wakefield nearby, downtown Wake Forest, Capsquare',
    landmarks: 'Southeastern Baptist Theological Seminary, downtown Wake Forest, Joyner Park, Falls Lake access',
    population: 'About 50,000+ residents',
    wikipedia: 'https://en.wikipedia.org/wiki/Wake_Forest,_North_Carolina',
    intro_paragraphs: [
      'Wake Forest blends historic downtown charm with large master-planned communities and growing commercial corridors. That diversity creates real HVAC variety — older homes near campus, high-efficiency systems in Heritage and Holding Village, and commercial rooftops along Capital Boulevard and Rogers Road. Frost Fire delivers <strong>HVAC services in Wake Forest, NC</strong> with same-day repair options and no Sunday surcharge.',
      'North Wake summers are long and humid. Heat pumps and central AC systems work hard from May through September, and capacitor, contactor, and refrigerant issues spike when temperatures climb. We diagnose fast, explain options clearly, and get cooling restored without the "weekend emergency" markup many national brands add.',
      'Looking for <em>heat pump repair Wake Forest NC</em> or after-hours help? Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a>. We also support restaurants with walk-in cooler and freezer repair across the north Triangle.',
    ],
    why_intro:
      'Wake Forest homeowners expect polished service and clear communication. We bring Clayton-based local ownership with Triangle-wide coverage — licensed techs, upfront approvals, and Sunday availability that matches how busy families actually live.',
    faqs: [
      {
        q: 'Can you repair heat pumps in Wake Forest?',
        a: 'Yes. Heat pumps are common in Wake Forest. We diagnose outdoor units, reversing valves, auxiliary heat, and thermostat issues.',
      },
      {
        q: 'Do you install mini-splits in Wake Forest?',
        a: 'Yes. Ductless mini-splits are a strong fit for additions, bonus rooms, and older homes near downtown.',
      },
      {
        q: 'Are you open Sundays in Wake Forest?',
        a: 'Yes — and we do not charge a Sunday or weekend surcharge.',
      },
    ],
  },
  {
    slug: 'wendell-nc',
    city: 'Wendell',
    title: 'HVAC Repair in Wendell, NC | Open Sundays | Frost Fire',
    meta_description:
      'HVAC repair in Wendell, NC — same-day AC and heating service with no Sunday surcharge. Serving Wendell Falls and surrounding areas. Call (919) 230-4439.',
    subtitle:
      'Fast HVAC repair for Wendell and Wendell Falls — fair weekend pricing, licensed local techs.',
    county: 'Wake County',
    zips: '27591',
    neighborhoods: 'Wendell Falls, downtown Wendell, Eagle Rock nearby, Rolesville Road corridor, Edgemont',
    landmarks: 'Wendell Falls town center, historic downtown Wendell, Wendell Park',
    population: 'Rapidly growing east Wake community',
    wikipedia: 'https://en.wikipedia.org/wiki/Wendell,_North_Carolina',
    intro_paragraphs: [
      'Wendell is one of east Wake\'s breakout towns — especially around Wendell Falls, where new homes and retail are expanding quickly. New construction systems still fail (install defects, low refrigerant, bad capacitors), and older downtown homes need honest repair options. Frost Fire provides <strong>HVAC repair in Wendell, NC</strong> with same-day triage and Sunday service at weekday rates.',
      'If your AC stopped cooling during a humid stretch or your heat pump is short-cycling, call us before a small part failure becomes a compressor replacement. We service all major brands and explain repair vs. replace in plain language.',
      'Searching <em>AC repair Wendell Falls</em> or need commercial cooler help for a local restaurant? Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a>.',
    ],
    why_intro:
      'Wendell\'s growth attracts big national HVAC brands with high weekend fees. Frost Fire competes on speed, transparency, and our no-Sunday-surcharge promise — the differentiator that matters when your system fails on a weekend.',
    faqs: [
      {
        q: 'Do you serve Wendell Falls?',
        a: 'Yes. Wendell Falls and greater Wendell are regular service areas for Frost Fire.',
      },
      {
        q: 'Can you help with new-construction HVAC issues?',
        a: 'Yes. We diagnose warranty-period failures, airflow problems, and systems that never cooled correctly from day one.',
      },
    ],
  },
  {
    slug: 'zebulon-nc',
    city: 'Zebulon',
    title: 'HVAC Services in Zebulon, NC | Emergency & Sunday Repair',
    meta_description:
      'HVAC services in Zebulon, NC. Emergency AC repair, heating service, and commercial refrigeration — open Sundays, no extra charge. Call (919) 230-4439.',
    subtitle:
      'Reliable HVAC for Zebulon homes and businesses — same-day response and no weekend surcharge.',
    county: 'Wake County',
    zips: '27597',
    neighborhoods: 'Downtown Zebulon, Shepard School Road area, US-64 corridor, Wakelon, Little River nearby',
    landmarks: 'Historic downtown Zebulon, Whitley Park, US-64 Business',
    population: 'Growing eastern Wake / Johnston edge community',
    wikipedia: 'https://en.wikipedia.org/wiki/Zebulon,_North_Carolina',
    intro_paragraphs: [
      'Zebulon sits on the eastern edge of the Triangle service area — close enough for fast response from our Clayton base, far enough that many Raleigh-centric companies treat it as an afterthought. Frost Fire does not. We provide full <strong>HVAC services in Zebulon, NC</strong>, including emergency AC repair, furnace and heat pump service, and commercial refrigeration for local food businesses.',
      'Eastern Wake summers are brutal on outdoor condensers sitting in full sun. We carry common failure parts and prioritize no-cool calls that threaten comfort and indoor air quality for families and seniors.',
      'Need <em>same day AC repair Zebulon</em>? Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a> — open Sundays with no surcharge.',
    ],
    why_intro:
      'Being Johnston/Wake adjacent is our advantage. Clayton-based routing means Zebulon is a natural service path, not a long-shot add-on fee zone.',
    faqs: [
      {
        q: 'How fast can you reach Zebulon?',
        a: 'Zebulon is within our core east Triangle coverage. Call for current ETA — emergency no-cool calls are prioritized.',
      },
      {
        q: 'Do you repair commercial coolers in Zebulon?',
        a: 'Yes. Walk-in coolers, freezers, and related restaurant refrigeration are part of our commercial offering.',
      },
    ],
  },
  {
    slug: 'morrisville-nc',
    city: 'Morrisville',
    title: 'HVAC Repair in Morrisville, NC | Heat Pump & AC Specialists',
    meta_description:
      'HVAC repair in Morrisville, NC — heat pumps, AC emergencies, and commercial service near RDU. Open Sundays, no surcharge. Call (919) 230-4439.',
    subtitle:
      'Fast HVAC repair for Morrisville homes and offices — heat pumps, mini-splits, and after-hours help.',
    county: 'Wake County',
    zips: '27560',
    neighborhoods: 'Breckenridge, Preston nearby, Key West, Cedar Fork, Airport Blvd corridor, McCrimmon Parkway',
    landmarks: 'RDU International Airport area, Morrisville Aquatics Center, Church Street downtown',
    population: 'About 30,000+ residents',
    wikipedia: 'https://en.wikipedia.org/wiki/Morrisville,_North_Carolina',
    intro_paragraphs: [
      'Morrisville\'s mix of townhomes, single-family neighborhoods, and corporate campuses creates constant HVAC demand — especially heat pumps and high-efficiency systems common in newer builds. Frost Fire offers <strong>HVAC repair in Morrisville, NC</strong> with clear diagnostics, same-day options, and Sunday service without overtime markup.',
      'Many Morrisville homes run heat pumps year-round. When auxiliary heat sticks on, outdoor units ice up, or summer cooling capacity drops, we find the root cause instead of guessing. We also support light commercial spaces and restaurant refrigeration near the airport corridor.',
      'Searching <em>heat pump repair Morrisville NC</em>? Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a>.',
    ],
    why_intro:
      'Morrisville customers value speed and technical clarity. We show up prepared, explain findings, and get approval before major work — including nights and Sundays when office-park and residential failures do not wait.',
    faqs: [
      {
        q: 'Do you service heat pumps in Morrisville?',
        a: 'Yes. Heat pump diagnostics and repair are a core part of our Morrisville residential work.',
      },
      {
        q: 'Can you help with condo or townhome HVAC?',
        a: 'Yes, where building access and HOA rules allow. Call with your system type and we will confirm.',
      },
    ],
  },
  {
    slug: 'rolesville-nc',
    city: 'Rolesville',
    title: 'HVAC Services in Rolesville, NC | Same-Day Repair',
    meta_description:
      'HVAC services in Rolesville, NC. Same-day AC and heating repair, open Sundays with no extra charge. Call Frost Fire at (919) 230-4439.',
    subtitle:
      'Local HVAC repair for Rolesville neighborhoods — fair pricing, licensed techs, Sunday availability.',
    county: 'Wake County',
    zips: '27571',
    neighborhoods: 'Rolesville Crossing, Main Street area, Youngsville nearby edge, Granite Falls nearby, Rolesville Road corridor',
    landmarks: 'Downtown Rolesville, Rolesville Community Center, Main Street shops',
    population: 'Fast-growing north Wake town',
    wikipedia: 'https://en.wikipedia.org/wiki/Rolesville,_North_Carolina',
    intro_paragraphs: [
      'Rolesville has exploded with new housing while keeping a small-town Main Street feel. That growth means brand-new systems that still need warranty-period service and older homes that need honest repair. Frost Fire provides <strong>HVAC services in Rolesville, NC</strong> with same-day triage and no Sunday surcharge.',
      'North Wake humidity and pollen load stress filters, coils, and outdoor units. Regular maintenance prevents mid-summer no-cool emergencies — and when emergencies do happen, we respond without weekend penalty pricing.',
      'Need <em>AC repair Rolesville NC</em>? Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a>.',
    ],
    why_intro:
      'Rolesville families often get quoted like they live in downtown Raleigh. We price fairly, communicate clearly, and treat Rolesville as a core north Triangle route.',
    faqs: [
      {
        q: 'Do you offer maintenance plans in Rolesville?',
        a: 'Yes. Seasonal tune-ups help prevent peak-season failures and keep warranties intact.',
      },
      {
        q: 'Are Sunday rates higher?',
        a: 'No. Same price on Sundays and weekends.',
      },
    ],
  },
  {
    slug: 'angier-nc',
    city: 'Angier',
    title: 'HVAC Repair in Angier, NC | Heating & Cooling',
    meta_description:
      'HVAC repair in Angier, NC. Same-day heating and AC service from Clayton-based Frost Fire — open Sundays, no surcharge. Call (919) 230-4439.',
    subtitle:
      'Dependable HVAC for Angier homes — emergency repair, heat pumps, and Sunday service at weekday rates.',
    county: 'Harnett / Johnston edge',
    zips: '27501',
    neighborhoods: 'Downtown Angier, NC-55 corridor, Rawls Church Road area, Buies Creek nearby edge',
    landmarks: 'Downtown Angier, Angier Depot area, NC-210 / NC-55 crossroads',
    population: 'Growing Harnett County town south of the Triangle',
    wikipedia: 'https://en.wikipedia.org/wiki/Angier,_North_Carolina',
    intro_paragraphs: [
      'Angier sits just south of our Clayton headquarters — a natural service path many Raleigh-only companies skip or surcharge. Frost Fire provides <strong>HVAC repair in Angier, NC</strong> for residential heat pumps, central AC, furnaces, and light commercial equipment.',
      'Rural and small-town systems often run longer between maintenance visits. We focus on clear diagnostics, fair parts pricing, and restoring comfort quickly when summer heat or winter cold snaps hit Harnett County.',
      'Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a> for same-day options — including Sundays with no extra charge.',
    ],
    why_intro:
      'Proximity matters. From Clayton, Angier is a short run — which means faster ETAs and no "out of area" attitude when your AC fails.',
    faqs: [
      {
        q: 'Is Angier in your regular service area?',
        a: 'Yes. Angier is part of our southern Triangle / Harnett coverage from Clayton.',
      },
      {
        q: 'Do you install new systems in Angier?',
        a: 'Yes. We handle repair and replacement, including heat pumps and high-efficiency AC systems.',
      },
    ],
  },
  {
    slug: 'benson-nc',
    city: 'Benson',
    title: 'HVAC Services in Benson, NC | Emergency AC & Heating',
    meta_description:
      'HVAC services in Benson, NC. Emergency AC repair, heating service, and Sunday calls with no surcharge. Call Frost Fire (919) 230-4439.',
    subtitle:
      'Johnston County HVAC for Benson — same-day repair, commercial refrigeration, no weekend markup.',
    county: 'Johnston County',
    zips: '27504',
    neighborhoods: 'Downtown Benson, I-40 / I-95 interchange area, NC-50 corridor, elevation neighborhoods near US-301',
    landmarks: 'Benson Museum of Local History, downtown Benson, I-95 Welcome Center nearby',
    population: 'Johnston County town at I-40/I-95 crossroads',
    wikipedia: 'https://en.wikipedia.org/wiki/Benson,_North_Carolina',
    intro_paragraphs: [
      'Benson\'s location at the I-40 and I-95 crossroads means travelers, restaurants, and local homes all depend on working HVAC and refrigeration. Frost Fire — based in Clayton — provides <strong>HVAC services in Benson, NC</strong> with emergency response and Sunday pricing that matches weekdays.',
      'We repair residential AC and heat pumps, and we support commercial kitchens with walk-in cooler and freezer service when inventory is on the line.',
      'Need help now? Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a>.',
    ],
    why_intro:
      'Johnston County is home turf. Benson customers get a local contractor that already runs US-301 and I-40 corridors regularly — not a distant franchise dispatching from another metro.',
    faqs: [
      {
        q: 'Do you handle restaurant refrigeration in Benson?',
        a: 'Yes. Walk-in coolers, freezers, and related commercial refrigeration are available.',
      },
      {
        q: 'Can you come on Sunday?',
        a: 'Yes, and we do not add a Sunday surcharge.',
      },
    ],
  },
  {
    slug: 'selma-nc',
    city: 'Selma',
    title: 'HVAC Repair in Selma, NC | Same-Day Service',
    meta_description:
      'HVAC repair in Selma, NC. Same-day AC and heating service near Smithfield — open Sundays with no extra charge. Call (919) 230-4439.',
    subtitle:
      'Fast HVAC repair for Selma homes and businesses — fair prices, licensed techs, Sunday availability.',
    county: 'Johnston County',
    zips: '27576',
    neighborhoods: 'Downtown Selma, US-70 corridor, Mitchener Field area, Princeton nearby edge',
    landmarks: 'Selma Union Station / Amtrak, historic downtown Selma, US-70 Business',
    population: 'Johnston County town east of Smithfield',
    wikipedia: 'https://en.wikipedia.org/wiki/Selma,_North_Carolina',
    intro_paragraphs: [
      'Selma sits minutes from Smithfield and within easy reach of our Clayton shop. Frost Fire provides <strong>HVAC repair in Selma, NC</strong> for homeowners and businesses that want same-day help without weekend penalty rates.',
      'Older housing stock near downtown often needs careful ductwork and system matching, while newer builds need warranty-friendly diagnostics. We handle both — plus commercial refrigeration for food service along the US-70 corridor.',
      'Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a> for emergency AC or heating repair.',
    ],
    why_intro:
      'Selma is part of our Johnston County core. You get local routing, honest pricing, and the same Sunday no-surcharge policy we offer in Clayton and Smithfield.',
    faqs: [
      {
        q: 'Do you serve Selma and Smithfield together?',
        a: 'Yes. Both are regular Johnston County routes for Frost Fire.',
      },
      {
        q: 'Is emergency service available?',
        a: 'Yes. Call (919) 230-4439 anytime for triage and the soonest available response.',
      },
    ],
  },
  {
    slug: 'wilsons-mills-nc',
    city: "Wilson's Mills",
    title: "HVAC Services in Wilson's Mills, NC | Frost Fire",
    meta_description:
      "HVAC services in Wilson's Mills, NC. Same-day repair near Clayton — open Sundays, no surcharge. Call Frost Fire at (919) 230-4439.",
    subtitle:
      "Hometown-adjacent HVAC for Wilson's Mills — emergency repair, heat pumps, and fair Sunday pricing.",
    county: 'Johnston County',
    zips: '27520 (shared Clayton area coverage)',
    neighborhoods: "Wilson's Mills proper, NC-42 corridor, Clayton edge neighborhoods, Flowertown nearby",
    landmarks: "Wilson's Mills town center, NC-42, proximity to Clayton and Flowers Plantation",
    population: 'Small Johnston County town next to Clayton',
    wikipedia: 'https://en.wikipedia.org/wiki/Wilson%27s_Mills,_North_Carolina',
    intro_paragraphs: [
      "Wilson's Mills sits next door to our Clayton headquarters — one of the fastest response zones in our entire service map. Frost Fire provides full <strong>HVAC services in Wilson's Mills, NC</strong>, from emergency AC repair to heat pump service and light commercial work.",
      'If you are comparing big Raleigh brands with long ETAs, call the local team that already drives NC-42 every day. Same-day options are common, and Sundays are priced like weekdays.',
      'Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a> now.',
    ],
    why_intro:
      "We are literally the neighbors. Wilson's Mills customers get Clayton-speed response with the same licensed, insured service Triangle residents expect.",
    faqs: [
      {
        q: "How quickly can you reach Wilson's Mills?",
        a: "Often among our fastest ETAs because we are based in adjacent Clayton. Call for live availability.",
      },
      {
        q: 'Do you charge extra on Sundays?',
        a: 'No. Same rates seven days a week.',
      },
    ],
  },
];

export const ALL_CITIES_FOR_LINKS = [
  ...EXISTING_CITIES,
  ...NEW_CITIES.map((c) => ({ slug: c.slug, city: c.city })),
];

/** 14 niche service pages (includes freezer + 13 more). Combined with 10 cities = 24 new pages. */
export const NEW_SERVICES = [
  {
    slug: 'walk-in-freezer-repair-raleigh-nc',
    title: 'Walk-In Freezer Repair Raleigh NC | Same-Day | Frost Fire',
    meta_description:
      'Walk-in freezer not freezing in Raleigh? Same-day commercial freezer repair across the Triangle — open Sundays, no surcharge. Call (919) 230-4439.',
    service_type: 'Walk-In Freezer Repair',
    h1: 'Walk-In Freezer Repair — Same-Day Commercial Service',
    h1_html: 'Walk-In Freezer Repair — <span class="gradient-text">Same-Day</span> Commercial Service',
    subtitle:
      'Restaurant and food-service freezer repair in Raleigh, Durham, Clayton, and the Triangle. Protect frozen inventory fast.',
    breadcrumb: 'Walk-In Freezer Repair',
    hero_image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1200&q=80',
    hero_alt: 'Commercial freezer and cold storage',
    intro_h2: 'Fast Walk-In Freezer Repair in Raleigh & the Triangle',
    intro_h2_html: 'Fast Walk-In Freezer Repair in <span class="gradient-text">Raleigh & the Triangle</span>',
    intro_paragraphs: [
      'When a walk-in freezer climbs above safe temperature, frozen inventory and food cost are on the clock. Frost Fire provides same-day <strong>walk-in freezer repair in Raleigh, NC</strong> and across the Triangle — diagnosing compressors, evaporators, defrost systems, door heaters, and refrigerant issues before product loss piles up.',
      'Freezer failures often look like "not freezing" but stem from iced coils, failed defrost timers, door seal leaks, or low refrigerant. We work restaurant hours, carry common commercial parts, and prioritize calls that threaten inventory.',
      'Searching <em>walk in freezer repair Raleigh NC</em> or <em>restaurant walk in freezer repair</em>? Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a>. <a href="open-sundays-no-extra-charge-hvac.html">Same price on Sundays</a>.',
    ],
    cards_h2: 'Common Walk-In Freezer Failures We Fix',
    cards_h2_html: 'Common Walk-In Freezer Failures <span class="gradient-text">We Fix</span>',
    cards: [
      { icon: 'fa-fan', title: 'Compressor Failures', body: 'Hard starts, overheating, short cycling, or a unit that runs without pulling down to setpoint.' },
      { icon: 'fa-icicles', title: 'Defrost & Ice Buildup', body: 'Failed defrost heaters, timers, or sensors that leave the evaporator buried in ice.' },
      { icon: 'fa-droplet', title: 'Refrigerant Leaks', body: 'Gradual warm-up, oil stains, and low suction — we locate, repair, and recharge correctly.' },
      { icon: 'fa-door-closed', title: 'Door Heaters & Gaskets', body: 'Ice around the frame, doors that will not seal, and energy waste from air infiltration.' },
      { icon: 'fa-gauge-high', title: 'Controls & Sensors', body: 'Bad probes, controllers, and setpoints that leave the box too warm or locked in defrost.' },
      { icon: 'fa-triangle-exclamation', title: 'After-Hours Emergencies', body: 'Nights and weekends — freezer emergencies get commercial priority response.' },
    ],
    process_h2: 'Our Freezer Repair Process',
    process_h2_html: 'Our Freezer Repair <span class="gradient-text">Process</span>',
    steps: [
      { title: 'Call & Triage', body: 'Tell us box temperature, alarms, and whether product is at risk so we can prioritize.' },
      { title: 'Diagnose On-Site', body: 'We check pressures, defrost, seals, electrical, and airflow — then explain the fix clearly.' },
      { title: 'Repair & Verify', body: 'We complete the repair and confirm the freezer is pulling down before we leave.' },
      { title: 'Prevent the Next Failure', body: 'We flag condenser cleaning, gasket wear, and maintenance needs.' },
    ],
    why_title: 'Why Restaurants Call Frost Fire for Freezer Repair',
    why_bullets: [
      'Same-day walk-in freezer emergency response across the Triangle',
      'No Sunday or weekend surcharge',
      'Commercial refrigeration experience for restaurants and food service',
      'Licensed & insured NC HVAC/R contractor',
      'Also available for walk-in cooler and RTU repair',
    ],
    areas_title: 'Where We Repair Walk-In Freezers',
    areas_paragraphs: [
      'We repair walk-in freezers in <a href="../service-areas/raleigh-nc.html">Raleigh</a>, <a href="../service-areas/durham-nc.html">Durham</a>, <a href="../service-areas/clayton-nc.html">Clayton</a>, Garner, Cary, and surrounding cities.',
      'Related: <a href="walk-in-cooler-repair-raleigh-nc.html">walk-in cooler repair</a>, <a href="commercial-rtu-repair-raleigh-nc.html">RTU repair</a>, and <a href="commercial.html">commercial HVAC</a>.',
    ],
    faqs: [
      { q: 'Do you offer same-day walk-in freezer repair in Raleigh?', a: 'Yes. Inventory-threatening freezer failures are prioritized. Call (919) 230-4439.' },
      { q: 'Is Sunday freezer repair more expensive?', a: 'No. Same rates on Sundays and weekends.' },
      { q: 'Can you also repair walk-in coolers?', a: 'Yes. Coolers and freezers are both part of our commercial refrigeration service.' },
      { q: 'What should I do while waiting?', a: 'Keep doors closed, consolidate product if you have backup freezer space, and note the current temperature.' },
    ],
    cta_title: 'Freezer Warming Up? Call Now.',
    cta_body: 'Same-day walk-in freezer repair across Raleigh and the Triangle.',
    related: [
      { href: 'walk-in-cooler-repair-raleigh-nc.html', icon: 'fa-snowflake', title: 'Walk-In Cooler Repair', body: 'Same-day cooler emergencies' },
      { href: 'commercial-rtu-repair-raleigh-nc.html', icon: 'fa-industry', title: 'RTU Repair', body: 'Rooftop unit repair' },
      { href: 'emergency.html', icon: 'fa-bolt', title: 'Emergency Service', body: '24/7 response' },
      { href: 'open-sundays-no-extra-charge-hvac.html', icon: 'fa-calendar-check', title: 'Open Sundays', body: 'No weekend surcharge' },
    ],
  },
  ...MORE_SERVICES,
];
