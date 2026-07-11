/** 50 low-competition local SEO page specs — neighborhoods & small towns, NOT Raleigh head terms. */
export const LOCAL_SEO_SPECS = [
  // ── Clayton neighborhoods (15) ──
  spec('barber-mill-clayton-nc', 'Barber Mill', 'Clayton', '27520', 'hvac barber mill clayton nc', 'Barber Mill Rd, Veterans Pkwy, US-70 Business', 'Townhomes and single-family along Barber Mill Rd', ['flowers-plantation-clayton-nc', 'riverwood-clayton-nc', 'wilsons-mills-clayton-nc']),
  spec('flowers-plantation-clayton-nc', 'Flowers Plantation', 'Clayton', '27527', 'hvac flowers plantation clayton nc', 'Flowers Pkwy, Buffalo Rd, US-70', 'Large master-planned community with newer heat pumps', ['barber-mill-clayton-nc', 'riverwood-clayton-nc', 'crescent-mills-clayton-nc']),
  spec('riverwood-clayton-nc', 'Riverwood', 'Clayton', '27527', 'ac repair riverwood clayton nc', 'Riverwood Pkwy, Buffalo Rd, athletic club area', 'Mix of 2000s–2010s homes with central heat pumps', ['flowers-plantation-clayton-nc', 'glen-laurel-clayton-nc', 'shotwell-clayton-nc']),
  spec('glen-laurel-clayton-nc', 'Glen Laurel', 'Clayton', '27527', 'heating and cooling glen laurel clayton', 'Glen Laurel Dr, Cornith Holders Rd', 'Established subdivision with aging furnaces and AC combos', ['riverwood-clayton-nc', 'covered-bridge-clayton-nc', 'shotwell-clayton-nc']),
  spec('shotwell-clayton-nc', 'Shotwell', 'Clayton', '27520', 'hvac shotwell clayton nc', 'Shotwell Rd, Buffalo Rd, rural-residential edge', 'Older homes and acreage properties with varied systems', ['barber-mill-clayton-nc', 'flowertown-clayton-nc', 'wilsons-mills-clayton-nc']),
  spec('parks-at-meadowbrook-clayton-nc', 'Parks at Meadowbrook', 'Clayton', '27527', 'hvac meadowbrook clayton nc', 'Meadowbrook Dr, Buffalo Rd corridor', 'Newer construction with high-efficiency heat pumps', ['flowers-plantation-clayton-nc', 'crescent-mills-clayton-nc', 'riverwood-clayton-nc']),
  spec('covered-bridge-clayton-nc', 'Covered Bridge', 'Clayton', '27527', 'ac service covered bridge clayton', 'Covered Bridge Rd, Glen Laurel area', 'Family neighborhood with split systems and heat pumps', ['glen-laurel-clayton-nc', 'plantation-pointe-clayton-nc', 'riverwood-clayton-nc']),
  spec('plantation-pointe-clayton-nc', 'Plantation Pointe', 'Clayton', '27527', 'hvac plantation pointe clayton nc', 'Plantation Pointe Blvd, Flowers area', 'Newer homes with heat pumps and smart thermostats', ['flowers-plantation-clayton-nc', 'covered-bridge-clayton-nc', 'parks-at-meadowbrook-clayton-nc']),
  spec('crescent-mills-clayton-nc', 'Crescent Mills', 'Clayton', '27527', 'hvac crescent mills clayton nc', 'HWY-70, pool and amenity center, Starlight community', 'Brand-new heat pumps and tight-home airflow issues', ['flowers-plantation-clayton-nc', 'parks-at-meadowbrook-clayton-nc', 'smithfield-outlets-corridor-nc']),
  spec('flowertown-clayton-nc', 'Flowertown', 'Clayton', '27520', 'hvac flowertown clayton nc', 'Flowertown Rd, NC-42, Wilson\'s Mills edge', 'Mixed-age housing between Clayton and Wilson\'s Mills', ['shotwell-clayton-nc', 'wilsons-mills-clayton-nc', 'barber-mill-clayton-nc']),
  spec('downtown-clayton-nc', 'Downtown Clayton', 'Clayton', '27520', 'hvac downtown clayton nc', 'Main St, Clayton Center, Neuse St', 'Historic downtown mix — retrofits and mini-splits', ['barber-mill-clayton-nc', 'veterans-parkway-clayton-nc', 'neuse-river-clayton-nc']),
  spec('neuse-river-clayton-nc', 'Neuse River area', 'Clayton', '27527', 'hvac neuse river clayton nc', 'Neuse River Trail, Riverwood, waterfront roads', 'Humid river-adjacent homes with coil and drain stress', ['riverwood-clayton-nc', 'downtown-clayton-nc', 'flowers-plantation-clayton-nc']),
  spec('veterans-parkway-clayton-nc', 'Veterans Parkway corridor', 'Clayton', '27520', 'commercial hvac veterans parkway clayton', 'Veterans Pkwy, Lombard St, US-70 retail', 'Residential + restaurant RTU and cooler calls', ['barber-mill-clayton-nc', 'downtown-clayton-nc', 'benson-nc']),
  spec('corinth-holders-clayton-nc', 'Corinth-Holders', 'Clayton', '27527', 'hvac corinth holders clayton nc', 'Corinth Holders Rd, Glen Laurel, Buffalo Rd', 'Growing corridor with new and established homes', ['glen-laurel-clayton-nc', 'riverwood-clayton-nc', 'shotwell-clayton-nc']),
  spec('buffalo-road-clayton-nc', 'Buffalo Road corridor', 'Clayton', '27527', 'hvac buffalo road clayton nc', 'Buffalo Rd, Flowers Pkwy, Riverwood access', 'Main residential artery — fast Clayton routing', ['flowers-plantation-clayton-nc', 'riverwood-clayton-nc', 'garner-white-oak-nc']),

  // ── Small towns — Johnston / Harnett / Wake edge (15) ──
  spec('youngsville-nc', 'Youngsville', null, '27596', 'hvac youngsville nc', 'US-1, Main St Youngsville, north Franklin County edge', 'Small-town homes and new Wake/Franklin growth', ['rolesville-crossing-nc', 'heritage-wake-forest-nc', 'wake-forest-nc'], 'Franklin / Wake edge'),
  spec('princeton-nc', 'Princeton', null, '27569', 'hvac princeton nc', 'Princeton downtown, US-70, Selma corridor', 'Johnston County town — fast from Clayton', ['selma-nc', 'smithfield-nc', 'four-oaks-nc'], 'Johnston County'),
  spec('four-oaks-nc', 'Four Oaks', null, '27524', 'hvac four oaks nc', 'Four Oaks downtown, US-301, I-95 corridor', 'Rural Johnston with furnaces and heat pumps', ['princeton-nc', 'benson-nc', 'kenly-nc'], 'Johnston County'),
  spec('kenly-nc', 'Kenly', null, '27542', 'hvac kenly nc', 'Kenly downtown, I-95, US-301', 'Johnston edge town — commercial and residential', ['four-oaks-nc', 'smithfield-nc', 'princeton-nc'], 'Johnston County'),
  spec('buies-creek-nc', 'Buies Creek', null, '27506', 'hvac buies creek nc', 'Campbell University area, NC-27', 'Student housing, rentals, and local homes', ['lillington-nc', 'angier-nc', 'coats-nc'], 'Harnett County'),
  spec('coats-nc', 'Coats', null, '27521', 'hvac coats nc', 'Coats downtown, NC-55, Harnett corridor', 'Small Harnett town south of Clayton', ['angier-nc', 'buies-creek-nc', 'lillington-nc'], 'Harnett County'),
  spec('micro-nc', 'Micro', null, '27555', 'hvac micro nc', 'Micro downtown, US-301, Johnston County', 'Tiny community with residential HVAC needs', ['kenly-nc', 'princeton-nc', 'selma-nc'], 'Johnston County'),
  spec('pine-level-nc', 'Pine Level', null, '27568', 'hvac pine level nc', 'Pine Level, US-70, Johnston County', 'Crossroads community between Clayton and Smithfield', ['princeton-nc', 'selma-nc', 'micro-nc'], 'Johnston County'),
  spec('willow-spring-nc', 'Willow Spring', null, '27592', 'hvac willow spring nc', 'Willow Spring, NC-42, Fuquay edge', 'Southern Wake / Johnston rural-residential', ['fuquay-varina-nc', 'angier-nc', 'clayton-nc'], 'Wake / Johnston'),
  spec('eagle-rock-nc', 'Eagle Rock', 'Wendell', '27591', 'hvac eagle rock wendell nc', 'Eagle Rock area, Wendell edge', 'East Wake residential near Wendell', ['wendell-falls-nc', 'wendell-nc', 'zebulon-nc'], 'Wake County'),
  spec('archer-lodge-nc', 'Archer Lodge', null, '27527', 'hvac archer lodge nc', 'Archer Lodge, Wendell/Zebulon edge', 'Rural Wake with acreage and larger systems', ['wendell-nc', 'zebulon-nc', 'clayton-nc'], 'Wake / Johnston edge'),
  spec('lillington-nc', 'Lillington', null, '27546', 'hvac lillington nc', 'Lillington downtown, Cape Fear River, US-401', 'Harnett County seat — furnaces and heat pumps', ['buies-creek-nc', 'angier-nc', 'coats-nc'], 'Harnett County'),
  spec('middlesex-nc', 'Middlesex', null, '27557', 'hvac middlesex nc', 'Middlesex, US-231, Nash/Johnston edge', 'Small community with residential service needs', ['micro-nc', 'pine-level-nc', 'kenly-nc'], 'Johnston / Nash edge'),
  spec('sims-nc', 'Sims', null, '27880', 'hvac sims nc', 'Sims, Wilson County edge from Clayton routes', 'Rural eastern NC homes — honest drive-time service', ['middlesex-nc', 'kenly-nc', 'clayton-nc'], 'Wilson / Johnston edge'),
  spec('smithfield-outlets-corridor-nc', 'Smithfield outlets corridor', 'Smithfield', '27577', 'hvac smithfield outlets nc', 'I-95 outlets, Booker Dairy Rd, US-70', 'Retail HVAC + nearby residential neighborhoods', ['smithfield-nc', 'selma-nc', 'princeton-nc'], 'Johnston County'),

  // ── Garner neighborhoods (5) ──
  spec('white-oak-garner-nc', 'White Oak', 'Garner', '27529', 'hvac white oak garner nc', 'White Oak Rd, Vandora Springs Rd', 'Established Garner neighborhood — aging systems', ['vandora-springs-garner-nc', 'garner-nc', 'clayton-nc'], 'Wake County'),
  spec('vandora-springs-garner-nc', 'Vandora Springs', 'Garner', '27529', 'ac repair vandora springs garner', 'Vandora Springs Rd, White Oak area', 'Mid-century and updated homes near downtown Garner', ['white-oak-garner-nc', 'lake-benson-garner-nc', 'garner-nc'], 'Wake County'),
  spec('cleveland-garner-nc', 'Cleveland', 'Garner', '27529', 'hvac cleveland garner nc', 'Cleveland Rd, Garner south', 'Residential streets south of Garner center', ['white-oak-garner-nc', 'lake-benson-garner-nc', 'clayton-nc'], 'Wake County'),
  spec('lake-benson-garner-nc', 'Lake Benson', 'Garner', '27529', 'hvac lake benson garner nc', 'Lake Benson Park, Vandora Springs', 'Lakeside homes with humidity and heat pump load', ['vandora-springs-garner-nc', 'white-oak-garner-nc', 'garner-nc'], 'Wake County'),
  spec('garner-station-nc', 'Garner Station', 'Garner', '27529', 'hvac garner station nc', 'Garner Station Blvd, downtown Garner', 'Mixed-use growth — commercial and townhomes', ['vandora-springs-garner-nc', 'garner-nc', 'white-oak-garner-nc'], 'Wake County'),

  // ── East / north Wake neighborhoods (10) ──
  spec('wendell-falls-nc', 'Wendell Falls', 'Wendell', '27591', 'hvac wendell falls nc', 'Wendell Falls Pkwy, town center', 'Fast-growing master plan — warranty and new-build HVAC', ['wendell-nc', 'eagle-rock-nc', 'knightdale-nc'], 'Wake County'),
  spec('knightdale-station-nc', 'Knightdale Station', 'Knightdale', '27545', 'hvac knightdale station nc', 'Knightdale Station Park, Hodge Rd', 'Newer east Wake homes with heat pumps', ['knightdale-nc', 'mingo-creek-knightdale-nc', 'wendell-nc'], 'Wake County'),
  spec('mingo-creek-knightdale-nc', 'Mingo Creek', 'Knightdale', '27545', 'ac repair mingo creek knightdale', 'Mingo Creek subdivision, Knightdale', 'Family neighborhood east of Raleigh sprawl', ['knightdale-station-nc', 'knightdale-nc', 'wendell-nc'], 'Wake County'),
  spec('heritage-wake-forest-nc', 'Heritage', 'Wake Forest', '27587', 'hvac heritage wake forest nc', 'Heritage Lake, Heritage High area', 'Large Wake Forest community — heat pump heavy', ['wake-forest-nc', 'holding-village-wake-forest-nc', 'rolesville-nc'], 'Wake County'),
  spec('holding-village-wake-forest-nc', 'Holding Village', 'Wake Forest', '27587', 'hvac holding village wake forest', 'Holding Village, downtown Wake Forest', 'Walkable village homes with modern HVAC', ['heritage-wake-forest-nc', 'wake-forest-nc', 'youngsville-nc'], 'Wake County'),
  spec('rolesville-crossing-nc', 'Rolesville Crossing', 'Rolesville', '27571', 'hvac rolesville crossing nc', 'Rolesville Crossing, Main St Rolesville', 'North Wake growth neighborhood', ['rolesville-nc', 'granite-falls-rolesville-nc', 'wake-forest-nc'], 'Wake County'),
  spec('south-lakes-fuquay-varina-nc', 'South Lakes', 'Fuquay-Varina', '27526', 'hvac south lakes fuquay varina', 'South Lakes, Sunset Lake Rd', 'Fuquay master plan with newer heat pumps', ['fuquay-varina-nc', 'bentwinds-fuquay-varina-nc', 'willow-spring-nc'], 'Wake County'),
  spec('bentwinds-fuquay-varina-nc', 'Bentwinds', 'Fuquay-Varina', '27526', 'hvac bentwinds fuquay varina', 'Bentwinds, golf community Fuquay', 'Established homes with furnaces and heat pumps', ['south-lakes-fuquay-varina-nc', 'fuquay-varina-nc', 'holly-springs-nc'], 'Wake County'),
  spec('sunset-lake-holly-springs-nc', 'Sunset Lake', 'Holly Springs', '27540', 'hvac sunset lake holly springs', 'Sunset Lake, Cassidy Hill area', 'Holly Springs neighborhood with humidity load', ['holly-springs-nc', 'fuquay-varina-nc', 'apex-nc'], 'Wake County'),
  spec('granite-falls-rolesville-nc', 'Granite Falls', 'Rolesville', '27571', 'hvac granite falls rolesville nc', 'Granite Falls, Rolesville north', 'Subdivision north of Rolesville center', ['rolesville-crossing-nc', 'rolesville-nc', 'wake-forest-nc'], 'Wake County'),

  // ── Service-intent long-tail local (5) — still neighborhood/town focused ──
  spec('heat-pump-repair-flowers-plantation-clayton', 'Flowers Plantation', 'Clayton', '27527', 'heat pump repair flowers plantation clayton', 'Flowers Pkwy, master-planned streets', 'Heat pump-dominant newer homes', ['flowers-plantation-clayton-nc', 'riverwood-clayton-nc', 'parks-at-meadowbrook-clayton-nc'], 'Johnston County', 'heat pump repair'),
  spec('emergency-ac-barber-mill-clayton', 'Barber Mill', 'Clayton', '27520', 'emergency ac repair barber mill clayton', 'Barber Mill Rd, Veterans Pkwy', 'Same-day no-cool focus for Barber Mill area', ['barber-mill-clayton-nc', 'downtown-clayton-nc', 'veterans-parkway-clayton-nc'], 'Johnston County', 'emergency AC repair'),
  spec('sunday-hvac-youngsville-nc', 'Youngsville', null, '27596', 'sunday hvac repair youngsville nc', 'US-1, Youngsville Main St', 'Weekend HVAC without surcharge — Youngsville', ['youngsville-nc', 'rolesville-nc', 'wake-forest-nc'], 'Franklin / Wake edge', 'Sunday HVAC repair'),
  spec('mini-split-installation-princeton-nc', 'Princeton', null, '27569', 'mini split installation princeton nc', 'Princeton, US-70 corridor', 'Ductless installs for Princeton homes and additions', ['princeton-nc', 'selma-nc', 'four-oaks-nc'], 'Johnston County', 'mini-split installation'),
  spec('furnace-repair-four-oaks-nc', 'Four Oaks', null, '27524', 'furnace repair four oaks nc', 'Four Oaks downtown, US-301', 'Heating repair for Four Oaks furnaces and heat pumps', ['four-oaks-nc', 'kenly-nc', 'benson-nc'], 'Johnston County', 'furnace repair'),
];

function spec(slug, place, city, zip, keyword, landmarks, housing, nearbySlugs, county = 'Johnston County', serviceFocus = null) {
  const loc = city ? `${place}, ${city}` : place;
  const svc = serviceFocus || 'HVAC repair and installation';
  const titleBase = svc.includes('repair') || svc.includes('installation')
    ? `${titleCase(svc)} — ${loc}, NC`
    : `HVAC ${place} ${city || ''} NC`.replace(/\s+/g, ' ').trim();
  const title = `${titleBase} | Frost Fire`.slice(0, 60);
  const nearby_links = nearbySlugs.map((s) => ({
    href: `${s}.html`,
    title: s.replace(/-nc$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
  return {
    slug,
    place_name: place,
    parent_city: city,
    county,
    zip,
    primary_keyword: keyword,
    service_focus: svc,
    service_type: svc,
    landmarks,
    housing_profile: housing,
    housing_years: slug.includes('crescent') || slug.includes('wendell-falls') || slug.includes('flowers') ? '2010s–2020s' : slug.includes('downtown') || slug.includes('shotwell') ? '1960s–1990s' : '1995–2015',
    common_systems: svc.includes('furnace') ? ['gas furnaces', 'heat pumps', 'central AC'] : svc.includes('heat pump') ? ['heat pumps', 'dual-fuel systems'] : svc.includes('mini') ? ['ductless mini-splits', 'heat pumps'] : ['heat pumps', 'central AC', 'gas furnaces'],
    title: title.length > 58 ? `${place} HVAC ${city || 'NC'} | Frost Fire` : title,
    meta_description: `${svc} in ${loc}, NC. Clayton-based Frost Fire — same-day options, Sundays at weekday rates. (919) 230-4439.`.slice(0, 155),
    h1: `${svc.charAt(0).toUpperCase() + svc.slice(1)} in ${loc}, NC`,
    h1_html: `${svc.includes('HVAC') ? 'HVAC' : titleCase(svc)} in <span class="gradient-text">${place}</span>${city ? `, ${city}` : ''}`,
    subtitle: `Local ${svc} for ${place} homeowners — Clayton-based routing, no Sunday surcharge, licensed NC contractor.`,
    unique_hook: city === 'Clayton'
      ? `${place} is minutes from our Clayton headquarters — one of the fastest service zones on our map. We are not a Raleigh call center dispatching a van from downtown; we already run ${landmarks.split(',')[0]} weekly.`
      : `${place} is outside the Raleigh SEO noise but still inside our daily routes from Clayton. You get local response without paying "metro" weekend rates.`,
    nearby_places: nearbySlugs.map((s) => s.replace(/-nc$/, '').replace(/-/g, ' ')),
    nearby_links,
    eta_answer: city === 'Clayton' || !city
      ? `Very fast — Clayton HQ is often under 20 minutes to ${place} depending on traffic.`
      : `Faster than Raleigh-centric shops for ${place} — we route from Clayton through ${county} daily.`,
    commercial_corridor: landmarks,
    about: specAbout(place, city, county),
    related: [
      { href: '../services/ac-repair.html', icon: 'fa-snowflake', title: 'AC Repair' },
      { href: '../services/heat-pump.html', icon: 'fa-wind', title: 'Heat Pumps' },
      { href: '../services/emergency-ac-repair-clayton-nc.html', icon: 'fa-bolt', title: 'Emergency AC' },
      { href: '../service-areas/clayton-nc.html', icon: 'fa-map-marker-alt', title: 'Clayton' },
      ...(city && city !== 'Clayton'
        ? [{ href: `../service-areas/${city.toLowerCase().replace(/\s+/g, '-')}-nc.html`, icon: 'fa-map', title: city }]
        : []),
      { href: 'index.html', icon: 'fa-book', title: 'All Local Guides' },
    ],
  };
}

function titleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function specAbout(place, city, county) {
  if (place === 'Barber Mill') {
    return 'Barber Mill (often searched as "Barbara Mills") is a well-known Clayton neighborhood along Barber Mill Road — townhomes and single-family streets between Veterans Parkway and the US-70 corridor. Close-knit, family-oriented, and full of 1990s–2000s HVAC systems that need honest local service.';
  }
  if (place === 'Flowers Plantation') {
    return 'Flowers Plantation is one of Clayton\'s largest master-planned communities — thousands of homes, newer heat pumps, and homeowners who want fast service without Raleigh franchise pricing.';
  }
  if (place === 'Wendell Falls') {
    return 'Wendell Falls is east Wake\'s breakout master plan — new construction, builder-grade HVAC, and warranty-period issues that need a contractor who understands heat pumps and tight-home airflow.';
  }
  return `${place} is a ${county} community${city ? ` near ${city}` : ''} where homeowners search for specific local HVAC help — not generic "Triangle" results.`;
}

// Fix parent city for Crescent Mills (was set incorrectly during spec build)
const crescent = LOCAL_SEO_SPECS.find((s) => s.slug === 'crescent-mills-clayton-nc');
if (crescent) {
  crescent.place_name = 'Crescent Mills';
  crescent.parent_city = 'Clayton';
}

// Fix service long-tail slugs that duplicate town pages - they're different URLs/intent
const longTail = ['heat-pump-repair-flowers-plantation-clayton', 'emergency-ac-barber-mill-clayton', 'sunday-hvac-youngsville-nc', 'mini-split-installation-princeton-nc', 'furnace-repair-four-oaks-nc'];
for (const slug of longTail) {
  const s = LOCAL_SEO_SPECS.find((x) => x.slug === slug);
  if (s) {
    s.h1 = s.h1.replace('Hvac', 'HVAC');
    s.meta_description = s.meta_description.slice(0, 155);
  }
}

// youngsville-nc duplicate with sunday - different intent OK

// Add franklinton reference fix - youngsville doesn't have franklinton page, remove from nearby
const y = LOCAL_SEO_SPECS.find((s) => s.slug === 'youngsville-nc');
if (y) y.nearby_links = y.nearby_links.filter((l) => !l.href.includes('franklinton'));

// smithfield-nc link for outlets
const out = LOCAL_SEO_SPECS.find((s) => s.slug === 'smithfield-outlets-corridor-nc');
if (out) out.nearby_links.push({ href: '../service-areas/smithfield-nc.html', title: 'Smithfield' });

// garner-nc links
for (const s of LOCAL_SEO_SPECS.filter((x) => x.parent_city === 'Garner')) {
  s.nearby_links.push({ href: '../service-areas/garner-nc.html', title: 'Garner' });
}

// knightdale/wendell/wake forest parent links
for (const s of LOCAL_SEO_SPECS) {
  if (s.parent_city === 'Knightdale' && !s.nearby_links.some((l) => l.href.includes('knightdale-nc')))
    s.nearby_links.push({ href: '../service-areas/knightdale-nc.html', title: 'Knightdale' });
  if (s.parent_city === 'Wendell' && !s.nearby_links.some((l) => l.href.includes('wendell-nc')))
    s.nearby_links.push({ href: '../service-areas/wendell-nc.html', title: 'Wendell' });
  if (s.parent_city === 'Wake Forest' && !s.nearby_links.some((l) => l.href.includes('wake-forest')))
    s.nearby_links.push({ href: '../service-areas/wake-forest-nc.html', title: 'Wake Forest' });
}

export const LOCAL_SEO_COUNT = LOCAL_SEO_SPECS.length;
