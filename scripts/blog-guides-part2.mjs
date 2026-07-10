/** Long-form educational blog guides — part 2 (5). */
export const GUIDES_PART2 = [
  {
    slug: 'thermostat-not-working-troubleshooting',
    title: 'Thermostat Not Working? Troubleshooting Guide',
    meta_description:
      'Thermostat blank, wrong mode, or Wi-Fi issues? Troubleshoot batteries, breakers, C-wires, and calibration before calling for HVAC service in the Triangle.',
    h1: 'Thermostat Not Working: A Complete Troubleshooting Guide',
    subtitle:
      'Fix the common thermostat problems that look like full HVAC failures — and know when the equipment (not the thermostat) is the real culprit.',
    category: 'Troubleshooting',
    hero_image: 'https://images.unsplash.com/photo-1558002039-873aed8848d0?w=1200&q=80',
    hero_alt: 'Smart home thermostat on wall',
    date_published: '2026-07-10',
    date_modified: '2026-07-10',
    intro: [
      'A surprising number of "AC is dead" calls are thermostat problems: dead batteries, wrong mode, schedule holds, Wi-Fi dropouts, or a missing C-wire after a DIY smart thermostat install.',
      'Use this guide before you assume the worst. If the thermostat is fine and the equipment still will not run, move to our <a href="things-to-check-when-ac-not-working.html">AC checklist</a> or call for <a href="../services/thermostat.html">thermostat service</a>.',
    ],
    howto_name: 'Troubleshoot a thermostat that is not working',
    howto_steps: [
      { title: 'Check display power', body: 'Replace batteries or verify the thermostat is receiving power.' },
      { title: 'Confirm mode and setpoint', body: 'Set Cool/Heat correctly and move setpoint past room temperature.' },
      { title: 'Remove schedule/hold conflicts', body: 'Clear holds and temporary schedules that override your setpoint.' },
      { title: 'Check HVAC breakers', body: 'Reset air handler and condenser breakers if the thermostat has power but equipment is silent.' },
      { title: 'For smart thermostats, verify app/equipment config', body: 'Confirm Wi-Fi, equipment type, and C-wire requirements.' },
      { title: 'Call a pro if still failing', body: 'Wiring, control boards, and equipment faults need diagnosis.' },
    ],
    sections: [
      {
        id: 'blank-display',
        title: 'Blank or Dead Display',
        paragraphs: [
          'Replace batteries first on battery-powered models. If it is power-stealing or C-wire powered and still blank, check the air handler breaker and furnace door switch (many units will not power the thermostat if the door panel is ajar).',
          'After storms around <a href="../service-areas/raleigh-nc.html">Raleigh</a> and <a href="../service-areas/durham-nc.html">Durham</a>, breakers and surge damage are common.',
        ],
      },
      {
        id: 'wrong-mode',
        title: 'Wrong Mode, Fan Settings, and Setpoint Confusion',
        paragraphs: [
          'Cooling requires Cool mode and a setpoint below room temperature. Heating requires Heat mode and a setpoint above room temperature. Fan On circulates air continuously and can make people think the system is "running but not conditioning."',
          'Auto is usually correct for diagnosis.',
        ],
      },
      {
        id: 'schedules-holds',
        title: 'Schedules, Holds, and App Overrides',
        paragraphs: [
          'Smart thermostats may be following a schedule you forgot about, an energy-saving feature, or another household member\'s app change. Check for "Hold," "Away," or geofencing.',
          'If two apps control one thermostat, you will lose the setpoint war every time.',
        ],
      },
      {
        id: 'c-wire',
        title: 'C-Wire and Smart Thermostat Install Issues',
        paragraphs: [
          'Many modern thermostats need a common wire (C-wire) for stable power. Without it, symptoms include random reboots, blank screens, or weak Wi-Fi modules.',
          'Adapters exist, but incorrect wiring can damage controls. If you are not comfortable with low-voltage wiring, hire it — a miswire can be expensive.',
        ],
      },
      {
        id: 'calibration',
        title: 'Temperature Reading Feels Wrong',
        paragraphs: [
          'Thermostats in direct sun, near supply vents, or on exterior walls read poorly. The system may be doing exactly what the sensor says — even if the hallway feels different.',
          'Relocation or a remote sensor can fix "hot/cold room" complaints that are really thermostat placement problems.',
        ],
      },
      {
        id: 'rapid-cycling',
        title: 'Rapid Clicking or Short Cycling',
        paragraphs: [
          'If the thermostat calls for cooling every few minutes, look for oversized equipment, failing sensors, or incorrect cycle settings. Short cycling wears compressors.',
          'A professional can check temperature swing settings and equipment staging.',
        ],
      },
      {
        id: 'heat-pump-thermostats',
        title: 'Heat Pump Thermostat Quirks',
        paragraphs: [
          'Heat pump thermostats must be configured for heat pump equipment, not furnace-only. Wrong setup causes aux heat to run incorrectly or reversing valve logic to fail.',
          'If you recently replaced a thermostat on a heat pump in <a href="../service-areas/clayton-nc.html">Clayton</a> or <a href="../service-areas/cary-nc.html">Cary</a>, tell the technician — configuration is a top suspect.',
        ],
      },
      {
        id: 'when-equipment-is-fault',
        title: 'When the Thermostat Is Fine but Nothing Runs',
        paragraphs: [
          'If the thermostat clearly calls for cool/heat and contactors/boards do not respond, the fault is downstream: capacitor, contactor, control board, float switch, or safety lockout.',
          'Do not keep replacing thermostats hoping one will magically fix a dead condenser.',
        ],
      },
      {
        id: 'upgrade-guidance',
        title: 'When to Upgrade the Thermostat',
        paragraphs: [
          'Upgrade for better scheduling, remote sensors, or heat pump dual-fuel control — not as a first repair for a system that needs mechanical work. See <a href="../services/thermostat.html">thermostat services</a> for install options.',
        ],
      },
    ],
    faqs: [
      { q: 'Why does my thermostat go blank at night?', a: 'Often weak batteries or unstable power without a C-wire.' },
      { q: 'Can a bad thermostat ruin my compressor?', a: 'Short cycling and incorrect heat pump configuration can contribute to premature wear.' },
      { q: 'Do you install Google Nest / Ecobee?', a: 'We can advise on compatibility and install when the equipment supports it. Call with your system type.' },
      { q: 'My Wi-Fi thermostat is offline — will HVAC still work?', a: 'Usually yes for local control, but features and remote changes will not. Confirm local mode/setpoint.' },
      { q: 'Should I reset my thermostat?', a: 'A reboot can help electronics glitches. Write down settings first so you can restore schedules.' },
      { q: 'Can you come on Sunday for thermostat issues?', a: 'If it is causing a no-heat/no-cool emergency, call — no Sunday surcharge.' },
    ],
    related: [
      { href: '../services/thermostat.html', title: 'Thermostat Services', blurb: 'Install & setup' },
      { href: 'things-to-check-when-ac-not-working.html', title: 'AC Not Working Checklist', blurb: 'Broader troubleshooting' },
      { href: '../services/heat-pump.html', title: 'Heat Pump Services', blurb: 'Heat pump configs' },
      { href: 'hvac-noises-what-they-mean.html', title: 'HVAC Noises Guide', blurb: 'Clicking & more' },
    ],
    cta_title: 'Still Stuck After Thermostat Checks?',
    cta_body: 'Call Frost Fire at (919) 230-4439 — we diagnose controls and equipment, not just swap parts.',
  },
  {
    slug: 'when-to-call-emergency-hvac',
    title: 'When to Call Emergency HVAC Service',
    meta_description:
      'When is an HVAC problem a true emergency? Safety red flags, heat/cool extremes, water leaks, and when Triangle homeowners can wait until morning.',
    h1: 'When to Call Emergency HVAC (and When You Can Wait)',
    subtitle:
      'A clear decision guide for nights, weekends, and holidays — so you spend money on real emergencies, not panic.',
    category: 'Emergency',
    hero_image: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=1200&q=80',
    hero_alt: 'Nighttime city lights suggesting after-hours service',
    date_published: '2026-07-10',
    date_modified: '2026-07-10',
    intro: [
      'Not every hot house at 9pm is a life-critical emergency — but some are. The goal is to protect people, property, and equipment without paying panic prices (and for the record: Frost Fire does not add a Sunday surcharge).',
      'This guide helps Triangle homeowners decide <strong>when to call emergency HVAC</strong> versus booking the next morning. Related pages: <a href="../services/emergency.html">emergency service</a>, <a href="../services/after-hours-hvac-repair.html">after-hours repair</a>, and <a href="../services/open-sundays-no-extra-charge-hvac.html">open Sundays</a>.',
    ],
    sections: [
      {
        id: 'true-emergencies',
        title: 'True Emergencies: Call Now',
        list: [
          '<strong>Gas smell:</strong> evacuate, call the gas utility first, then HVAC for furnace follow-up',
          '<strong>Burning smell / smoke from equipment:</strong> shut power off if safe and call',
          '<strong>Active water leak</strong> damaging ceilings, floors, or electrical areas',
          '<strong>No heat</strong> during dangerous cold with vulnerable occupants',
          '<strong>No cooling</strong> during extreme heat with medical risk, infants, elderly, or no safe alternate location',
          '<strong>Commercial cooler/freezer down</strong> with inventory at risk',
        ],
        paragraphs: [
          'If any of the above apply, do not wait for "normal business hours." Call <a href="tel:9192304439">(919) 230-4439</a>.',
        ],
      },
      {
        id: 'can-wait',
        title: 'Usually Can Wait Until Morning',
        paragraphs: [
          'Mild discomfort with safe indoor temperatures, a single room imbalance, a noisy but still-cooling system (without grinding), or a cosmetic thermostat glitch while equipment still runs can often wait.',
          'Use the overnight hours to gather info: filter condition, breaker status, and thermostat settings. That makes the morning visit faster.',
        ],
      },
      {
        id: 'heat-wave-rules',
        title: 'Special Rules for Triangle Heat Waves',
        paragraphs: [
          'When it is 98°F in <a href="../service-areas/raleigh-nc.html">Raleigh</a>, indoor temperatures climb fast in closed homes. If you cannot cool below unsafe levels and cannot relocate, treat it as urgent — especially for medically vulnerable households.',
          'Close blinds, avoid oven use, drink water, and run fans as a bridge while waiting for dispatch.',
        ],
      },
      {
        id: 'cold-snap-rules',
        title: 'Special Rules for Cold Snaps',
        paragraphs: [
          'No heat with freezing outdoor temperatures risks pipe freezes. Open cabinet doors near plumbing on exterior walls, drip faucets if advised by local guidance, and use safe supplemental heat only (never unvented hazards).',
          'Heat pump owners: try Emergency Heat as a bridge and read our <a href="heat-pump-icing-up-what-to-do.html">icing guide</a>.',
        ],
      },
      {
        id: 'water-damage',
        title: 'Water Is an Emergency Even If the House Is Comfortable',
        paragraphs: [
          'A clogged condensate line can dump gallons into a closet or attic. Comfort may still be okay while flooring warps. Shut the system down and call — water damage restoration costs dwarf an after-hours drain clear.',
        ],
      },
      {
        id: 'commercial',
        title: 'Business and Restaurant Emergencies',
        paragraphs: [
          'Hot dining rooms and warm walk-ins are revenue emergencies. See <a href="../services/walk-in-cooler-repair-raleigh-nc.html">walk-in cooler repair</a> and <a href="../services/commercial-rtu-repair-raleigh-nc.html">RTU repair</a> for commercial-specific help.',
        ],
      },
      {
        id: 'what-to-say',
        title: 'What to Say When You Call',
        ordered_list: [
          'Describe the symptom and when it started',
          'Mention vulnerable occupants or property risk',
          'Share what you already checked (breaker, filter, thermostat)',
          'Note any burning smells, water, or ice',
          'Ask for the soonest triage window',
        ],
      },
      {
        id: 'cost-expectations',
        title: 'Cost Expectations Without the Games',
        paragraphs: [
          'You should get clear communication before major work. Frost Fire\'s differentiator is straightforward: we do not pile on a Sunday premium. That does not mean every after-hours scenario is identical — it means you will not be punished for the calendar.',
        ],
      },
      {
        id: 'prevent-next',
        title: 'Prevent the Next Emergency',
        paragraphs: [
          'Most peak-season emergencies are maintenance failures in disguise. Read <a href="why-hvac-maintenance-is-important.html">why maintenance is important</a> and schedule tune-ups before summer and winter.',
        ],
      },
    ],
    faqs: [
      { q: 'Do you answer the phone after hours?', a: 'Call (919) 230-4439 for triage. We prioritize unsafe conditions and equipment/property risks.' },
      { q: 'Is Sunday more expensive?', a: 'No. Same rates on Sundays.' },
      { q: 'What if I am not sure it is an emergency?', a: 'Call anyway and describe symptoms — we will help you decide.' },
      { q: 'Can you fix it the same night?', a: 'Sometimes. Parts and access matter. We will be honest about ETA and options.' },
      { q: 'Should I reset breakers repeatedly?', a: 'No. One reset max. Repeated trips mean stop and call.' },
      { q: 'Are restaurant cooler failures emergencies?', a: 'Yes when inventory or health-code risk is present.' },
    ],
    related: [
      { href: '../services/emergency.html', title: 'Emergency HVAC', blurb: '24/7 hub' },
      { href: '../services/after-hours-hvac-repair.html', title: 'After-Hours Repair', blurb: 'Nights & weekends' },
      { href: '../services/emergency-ac-repair-clayton-nc.html', title: 'Emergency AC Clayton', blurb: 'Same-day cooling' },
      { href: '../services/open-sundays-no-extra-charge-hvac.html', title: 'Open Sundays', blurb: 'No surcharge' },
    ],
    cta_title: 'Think It Might Be an Emergency?',
    cta_body: 'Call Frost Fire now at (919) 230-4439 — we will triage quickly and tell you the next best step.',
  },
  {
    slug: 'how-long-does-ac-last-north-carolina',
    title: 'How Long Does an AC Last in North Carolina?',
    meta_description:
      'How long does an AC last in North Carolina? Typical lifespan, humidity/heat stress, maintenance impact, and repair vs replace signals for Triangle homeowners.',
    h1: 'How Long Does an AC Last in North Carolina?',
    subtitle:
      'Realistic lifespan expectations for Triangle cooling systems — and the factors that shorten or extend them.',
    category: 'Buying Guides',
    hero_image: 'https://images.unsplash.com/photo-1631545806608-c8bba7639d4a?w=1200&q=80',
    hero_alt: 'Outdoor air conditioning condenser',
    date_published: '2026-07-10',
    date_modified: '2026-07-10',
    intro: [
      'Ask five neighbors how long an AC lasts and you will get five answers. The honest range for many central systems in North Carolina is roughly <strong>10–18 years</strong>, with maintenance quality, install quality, and runtime doing more work than brand logos.',
      'This guide explains what drives lifespan in the Triangle and how to decide between repair and <a href="../services/ac-installation.html">AC installation</a>. Also see <a href="replace-vs-repair-ac.html">replace vs repair</a>.',
    ],
    sections: [
      {
        id: 'typical-lifespan',
        title: 'Typical Lifespan Ranges',
        paragraphs: [
          'Central air conditioners and heat pumps in our climate often land around 12–15 years on average when moderately maintained. Excellent installs with diligent care can run longer. Neglected systems in full sun with dirty coils can fail earlier.',
          'Near-coastal humidity inland still matters: long cooling seasons mean more compressor hours per year than northern states.',
        ],
      },
      {
        id: 'what-shortens-life',
        title: 'What Shortens AC Life in the Triangle',
        list: [
          'Skipped maintenance and chronically dirty coils',
          'Low airflow from clogged filters/duct restrictions',
          'Untreated refrigerant leaks and repeated "top-offs"',
          'Electrical parts failing and stressing compressors',
          'Poor initial install (incorrect charge, airflow, or sizing)',
          'Oversized systems that short cycle',
        ],
        paragraphs: [
          'If your outdoor unit sits in direct west sun with no airflow clearance, expect harder summers.',
        ],
      },
      {
        id: 'what-extends-life',
        title: 'What Extends AC Life',
        paragraphs: [
          'Twice-yearly professional maintenance, monthly filter discipline in summer, clean outdoor clearance, prompt repair of small faults, and correct thermostat settings all help.',
          'Surge protection can be worth discussing in lightning-prone areas.',
        ],
      },
      {
        id: 'repair-or-replace',
        title: 'Repair or Replace? Decision Signals',
        paragraphs: [
          'Consider replacement when the system is 12+ years old and facing a major failure (compressor, coil), when repairs stack within a short window, when efficiency/comfort is poor despite repairs, or when R-22-era equipment makes parts scarce.',
          'Consider repair when the system is younger, the fault is a common wear part (capacitor, contactor, motor), and maintenance history is decent.',
        ],
        callout: {
          title: 'Ask for options',
          body: 'A good contractor explains repair vs replace with numbers — not fear. Get it in writing.',
        },
      },
      {
        id: 'cost-context',
        title: 'Cost Context (Without Fake Precision)',
        paragraphs: [
          'Repair costs vary widely by part and access. Full system replacements vary by tonnage, efficiency, duct repairs, electrical upgrades, and whether you replace furnace/air handler too. Beware online "average prices" that ignore your house.',
          'What you can control: get a load-appropriate design, not just a swap of the same size by habit.',
        ],
      },
      {
        id: 'heat-pumps',
        title: 'Heat Pumps vs. Straight AC Lifespan',
        paragraphs: [
          'Heat pumps run year-round, so outdoor units work in winter too. That can mean similar or slightly tougher wear patterns, offset by not having a separate AC outdoor unit idle all winter. Maintenance still rules outcomes.',
        ],
      },
      {
        id: 'planning-ahead',
        title: 'Plan Ahead Instead of Replacing in a Heat Wave',
        paragraphs: [
          'If your system is 13–15 years old, start budgeting and getting estimates in spring — not on the first 100°F Saturday. Emergency replacements limit your choices.',
          'Frost Fire can assess remaining life during <a href="../services/maintenance.html">maintenance</a> visits so you are not guessing.',
        ],
      },
      {
        id: 'warranty-note',
        title: 'Warranty and Registration Notes',
        paragraphs: [
          'Register new equipment and keep maintenance records. Warranty terms vary; unregistered equipment sometimes gets shorter coverage. Ask at install.',
        ],
      },
    ],
    faqs: [
      { q: 'Can an AC last 20 years in NC?', a: 'Sometimes, with excellent care and moderate runtime — but planning for replacement in the mid-teens is more realistic for many homes.' },
      { q: 'Does a bigger AC last longer?', a: 'No. Oversizing often short-cycles and can shorten life while hurting humidity control.' },
      { q: 'Is a 10-year-old AC old?', a: 'Not necessarily. It may have years left if maintained. Major component failures change the math.' },
      { q: 'Should I replace furnace and AC together?', a: 'Often yes for matched systems and efficiency, but not always mandatory. Ask for a matched-system proposal.' },
      { q: 'Do maintenance plans really extend life?', a: 'They help catch wear early and keep airflow/heat transfer healthy — both matter for longevity.' },
      { q: 'Can you estimate remaining life on a visit?', a: 'We can give a reasoned assessment based on age, condition, and repair history. Call (919) 230-4439.' },
    ],
    related: [
      { href: 'replace-vs-repair-ac.html', title: 'Replace vs Repair AC', blurb: 'Decision framework' },
      { href: '../services/ac-installation.html', title: 'AC Installation', blurb: 'Replacement systems' },
      { href: 'why-hvac-maintenance-is-important.html', title: 'Why Maintenance Matters', blurb: 'Extend lifespan' },
      { href: 'choosing-right-hvac-system-nc-summers.html', title: 'Choosing Systems for NC Summers', blurb: 'Buy right' },
    ],
    cta_title: 'Wondering If Your AC Is Near the End?',
    cta_body: 'Call Frost Fire at (919) 230-4439 for an honest assessment — repair when it makes sense, replace when it does not.',
  },
  {
    slug: 'ductwork-problems-signs-and-fixes',
    title: 'Ductwork Problems: Signs and Fixes',
    meta_description:
      'Hot and cold rooms, high bills, dusty air? Learn common ductwork problems, signs of leaky ducts, and fix options for Triangle NC homes.',
    h1: 'Ductwork Problems: Signs, Causes, and Fixes',
    subtitle:
      'Your ducts are the delivery system for every dollar you spend on heating and cooling. Here is how to spot trouble.',
    category: 'Airflow',
    hero_image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',
    hero_alt: 'Building mechanical systems',
    date_published: '2026-07-10',
    date_modified: '2026-07-10',
    intro: [
      'If rooms never even out, filters get filthy fast, or bills climb while comfort falls, the problem may not be the outdoor unit — it may be the duct system hiding in attics and crawlspaces.',
      'This guide covers common <strong>ductwork problems</strong>, what Triangle homeowners can spot, and when to call for <a href="../services/ductwork.html">ductwork services</a>.',
    ],
    sections: [
      {
        id: 'why-ducts-matter',
        title: 'Why Ducts Matter as Much as the AC',
        paragraphs: [
          'A perfect condenser cannot cool a room that never receives air. Leaky, crushed, or poorly designed ducts waste conditioned air into attics and crawlspaces — expensive in North Carolina summers.',
        ],
      },
      {
        id: 'common-symptoms',
        title: 'Common Symptoms of Duct Problems',
        list: [
          'Rooms that are always hotter or colder than the thermostat hallway',
          'Whistling, booming, or excessive air noise',
          'Dusty surfaces soon after cleaning',
          'High energy bills with mediocre comfort',
          'System short cycling or long runtimes',
          'Musty smells from crawlspace air being pulled through leaks',
        ],
      },
      {
        id: 'leak-types',
        title: 'Leak Types and Disconnects',
        paragraphs: [
          'Joints separate, mastic fails, flex duct gets torn by pests or traffic, and boots loosen at registers. In attics, every leak dumps expensive cool air into a 130°F space in July.',
          'DIY foil tape on a visible joint can help temporarily; proper mastic and professional sealing last longer.',
        ],
      },
      {
        id: 'flex-duct-issues',
        title: 'Flex Duct Problems We See Constantly',
        paragraphs: [
          'Flex duct that is kinked, sagging, or excessively long kills airflow. Compression behind knee walls is common in older Triangle homes and additions.',
          'Sometimes the fix is re-routing or replacing a run — not another thermostat upgrade.',
        ],
      },
      {
        id: 'return-air',
        title: 'Return Air: The Forgotten Half',
        paragraphs: [
          'Starved returns cause high static pressure, noise, and coil freezing. Closing doors in rooms without return paths makes it worse.',
          'Jumbo returns and proper pathways are comfort upgrades that feel like a new system.',
        ],
      },
      {
        id: 'insulation',
        title: 'Duct Insulation in Attics and Crawlspaces',
        paragraphs: [
          'Uninsulated or poorly insulated ducts sweat and lose capacity. In humid NC crawlspaces, sweating ducts also create moisture issues.',
        ],
      },
      {
        id: 'testing',
        title: 'How Pros Diagnose Duct Issues',
        paragraphs: [
          'Static pressure readings, airflow measurements, visual attic/crawl inspections, and sometimes duct leakage testing reveal whether the equipment or the distribution is the bottleneck.',
          'Guessing with bigger equipment on bad ducts wastes money.',
        ],
      },
      {
        id: 'fixes',
        title: 'Fix Options (From Simple to Major)',
        ordered_list: [
          'Replace filters and open registers — rule out simple airflow restrictions',
          'Seal accessible leaks and repair obvious disconnects',
          'Repair/replace damaged flex runs and crushed sections',
          'Improve return pathways',
          'Partial redesign for additions and problem rooms',
          'Coordinate duct fixes with system replacement when sizing changes',
        ],
      },
      {
        id: 'when-to-call',
        title: 'When to Call Frost Fire',
        paragraphs: [
          'Call if comfort imbalances persist after filter/vent checks, if you find disconnected ducts, or if you are replacing a system and want the distribution fixed correctly the first time. We serve <a href="../service-areas/clayton-nc.html">Clayton</a>, <a href="../service-areas/raleigh-nc.html">Raleigh</a>, and surrounding areas — including Sundays without a surcharge when urgent.',
        ],
      },
    ],
    faqs: [
      { q: 'Can leaky ducts make my AC freeze?', a: 'Airflow problems can contribute to freezing. Duct restrictions and return issues are suspects.' },
      { q: 'Is duct cleaning the same as duct sealing?', a: 'No. Cleaning addresses debris; sealing addresses leaks. You may need one, both, or neither.' },
      { q: 'Should I replace all ducts when I replace my AC?', a: 'Not always — but ducts should be evaluated. Bad ducts sabotage new equipment.' },
      { q: 'Are closed vents a good idea?', a: 'Closing many vents often raises static pressure and causes problems. Ask before experimenting.' },
      { q: 'Can mini-splits avoid duct problems?', a: 'Ductless systems bypass ducts for served zones. See our mini-split guides if ducts are a nightmare.' },
      { q: 'Do you work in crawlspaces and attics?', a: 'Yes — that is where most duct work lives. Call (919) 230-4439.' },
    ],
    related: [
      { href: '../services/ductwork.html', title: 'Ductwork Services', blurb: 'Seal, repair, improve' },
      { href: '../services/ac-repair.html', title: 'AC Repair', blurb: 'When airflow kills cooling' },
      { href: 'how-to-reduce-humidity-home-nc-summer.html', title: 'Reduce Home Humidity', blurb: 'Airflow & moisture' },
      { href: '../services/mini-split.html', title: 'Mini-Splits', blurb: 'Ductless options' },
    ],
    cta_title: 'Suspect Your Ducts Are Wasting Comfort?',
    cta_body: 'Call Frost Fire at (919) 230-4439 for an airflow-focused inspection — not just another outdoor-unit guess.',
  },
  {
    slug: 'how-to-reduce-humidity-home-nc-summer',
    title: 'How to Reduce Humidity at Home in NC',
    meta_description:
      'How to reduce humidity in your North Carolina home this summer: AC runtime, sizing, drains, ventilation, and dehumidifier tips for Triangle homeowners.',
    h1: 'How to Reduce Humidity in Your Home During a North Carolina Summer',
    subtitle:
      'Why Triangle homes feel muggy even at 72°F — and the practical fixes that actually work.',
    category: 'Indoor Air Quality',
    hero_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
    hero_alt: 'Comfortable home interior',
    date_published: '2026-07-10',
    date_modified: '2026-07-10',
    intro: [
      'North Carolina summers are not just hot — they are wet. Indoor relative humidity above ~50–55% feels sticky, stresses wood floors, encourages biological growth, and makes 75°F feel like 80°F.',
      'This guide covers <strong>how to reduce humidity at home</strong> with HVAC-focused strategies for <a href="../service-areas/raleigh-nc.html">Raleigh</a>, <a href="../service-areas/durham-nc.html">Durham</a>, and <a href="../service-areas/clayton-nc.html">Clayton</a> homes. Related: <a href="../services/indoor-air-quality.html">indoor air quality</a> and <a href="../services/ac-repair.html">AC repair</a>.',
    ],
    sections: [
      {
        id: 'why-muggy',
        title: 'Why Your House Feels Muggy at "Normal" Thermostat Settings',
        paragraphs: [
          'Air conditioners remove moisture when they run long enough for the coil to get cold and condensate to drain. Short runtimes cool the air thermometer quickly but leave humidity behind — classic oversized-system behavior.',
          'If your AC blasts on, satisfies the thermostat in 5 minutes, and shuts off, you may be comfortable on paper and clammy in reality.',
        ],
      },
      {
        id: 'thermostat-strategy',
        title: 'Thermostat Strategy That Helps Humidity',
        paragraphs: [
          'Avoid huge setbacks that cause short, aggressive recovery. Slightly higher setpoints with longer runtimes can feel better than ice-cold short cycles.',
          'Fan Auto is usually better for dehumidification than Fan On, which can re-evaporate moisture off a wet coil into the house.',
        ],
        callout: {
          title: 'Try this',
          body: 'If you have a thermostat with a humidity target or "humiditrax"-style features, set a realistic RH goal and let the system work — do not fight it with constant fan.',
        },
      },
      {
        id: 'maintenance-drains',
        title: 'Maintenance, Coils, and Condensate Drains',
        paragraphs: [
          'A dirty evaporator coil cannot exchange heat or condense moisture efficiently. Clogged drains cause shutdowns and water damage. Filter discipline matters.',
          'Schedule cooling-season <a href="../services/maintenance.html">maintenance</a> before peak humidity months.',
        ],
      },
      {
        id: 'oversizing',
        title: 'Oversized Systems and Humidity',
        paragraphs: [
          'Bigger is not better. Oversized AC removes heat too fast and under-dehumidifies. If humidity has been a lifelong problem since a replacement install, ask about load calculation history — not just tonnage on the data plate.',
        ],
      },
      {
        id: 'whole-home-dehumidifiers',
        title: 'Whole-Home Dehumidifiers and IAQ Gear',
        paragraphs: [
          'In some Triangle homes — especially tighter new builds — a whole-home dehumidifier paired with the HVAC system is the comfort breakthrough. Portable units help a room; ducted solutions help a house.',
          'See <a href="../services/indoor-air-quality.html">IAQ services</a> for options beyond portable boxes.',
        ],
      },
      {
        id: 'sources',
        title: 'Moisture Sources You Can Control',
        list: [
          'Run bath fans during/after showers',
          'Use kitchen exhaust when cooking',
          'Fix crawlspace vapor issues and standing water',
          'Avoid indoor clothes drying without venting',
          'Watch for duct leaks pulling crawlspace air',
        ],
        paragraphs: [
          'HVAC cannot outrun an open moisture source forever.',
        ],
      },
      {
        id: 'ducts-and-returns',
        title: 'Ducts, Returns, and Hot Attics',
        paragraphs: [
          'Leaky return ducts in humid crawlspaces import moisture. Supply leaks in attics waste capacity. If humidity and room imbalance travel together, read our <a href="ductwork-problems-signs-and-fixes.html">ductwork guide</a>.',
        ],
      },
      {
        id: 'when-ac-is-broken',
        title: 'When Humidity Means the AC Is Actually Failing',
        paragraphs: [
          'If the system runs constantly and never dries the air, you may have low refrigerant, failing blower performance, or a control issue. That is repair territory — use the <a href="things-to-check-when-ac-not-working.html">AC not working checklist</a>, then call.',
        ],
      },
      {
        id: 'targets',
        title: 'Humidity Targets That Feel Human',
        paragraphs: [
          'Many people feel best around 40–50% RH indoors in summer (exact comfort varies). Below the 30s can feel dry; above the mid-50s/60s feels sticky and risks moisture problems.',
          'Buy an inexpensive hygrometer. Guessing RH from "how it feels" is unreliable.',
        ],
      },
    ],
    faqs: [
      { q: 'Why is my house humid if the AC is on?', a: 'Short cycling, oversized equipment, dirty coils, fan-on settings, or moisture sources can all leave RH high even when temperature drops.' },
      { q: 'Should I close vents to dehumidify?', a: 'Usually no — it can raise static pressure and cause other problems.' },
      { q: 'Do heat pumps dehumidify in summer?', a: 'Yes, in cooling mode they condense moisture like an AC when they run properly.' },
      { q: 'Will a lower thermostat setting fix humidity?', a: 'Not always. You can get colder and still clammy if runtime patterns are wrong.' },
      { q: 'Are portable dehumidifiers enough?', a: 'They help a zone. Whole-home solutions are better for whole-house RH control.' },
      { q: 'Can you diagnose humidity issues on a visit?', a: 'Yes. Call (919) 230-4439 — we look at equipment, airflow, and moisture sources.' },
    ],
    related: [
      { href: '../services/indoor-air-quality.html', title: 'Indoor Air Quality', blurb: 'Humidity & IAQ solutions' },
      { href: 'ductwork-problems-signs-and-fixes.html', title: 'Ductwork Problems', blurb: 'Airflow & leaks' },
      { href: 'why-hvac-maintenance-is-important.html', title: 'Why Maintenance Matters', blurb: 'Coil & drain care' },
      { href: 'indoor-air-quality-tips-nc.html', title: 'IAQ Tips for NC', blurb: 'More IAQ advice' },
    ],
    cta_title: 'Tired of Sticky Indoor Air?',
    cta_body: 'Call Frost Fire at (919) 230-4439 — we fix humidity problems at the system level, not with guesswork.',
  },
];
