/**
 * Publish a Frost Fire city/town service-area landing page.
 * Usage: node scripts/publish-city-page.mjs path/to/city.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SHARED_CSS = fs
  .readFileSync(path.join(ROOT, 'service-areas', 'clayton-nc.html'), 'utf8')
  .match(/<style>[\s\S]*?<\/style>/)?.[0];

if (!SHARED_CSS) {
  console.error('Could not extract shared CSS from clayton-nc.html');
  process.exit(1);
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function businessSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HVACBusiness',
    name: 'Frost Fire Heating and Cooling',
    telephone: '+19192304439',
    url: 'https://frostfirehvacr.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Clayton',
      addressRegion: 'NC',
      postalCode: '27520',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: page.city,
      ...(page.wikipedia ? { sameAs: page.wikipedia } : {}),
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '$$',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `HVAC Services in ${page.city}, NC`,
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AC Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Emergency HVAC Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Heat Pump Services' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Refrigeration' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sunday HVAC Service' } },
      ],
    },
  };
}

function faqSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

const CORE_SERVICES = [
  { href: '../services/ac-repair.html', icon: 'fa-snowflake', title: 'AC Repair & Service' },
  { href: '../services/emergency.html', icon: 'fa-truck-medical', title: 'Emergency Repair' },
  { href: '../services/heating-repair.html', icon: 'fa-fire', title: 'Heating Repair' },
  { href: '../services/heat-pump.html', icon: 'fa-wind', title: 'Heat Pump Services' },
  { href: '../services/mini-split.html', icon: 'fa-temperature-arrow-down', title: 'Mini-Split Installation' },
  { href: '../services/commercial.html', icon: 'fa-building', title: 'Commercial HVAC & Refrigeration' },
  { href: '../services/open-sundays-no-extra-charge-hvac.html', icon: 'fa-calendar-check', title: 'Open Sundays — No Surcharge' },
  { href: '../services/walk-in-cooler-repair-raleigh-nc.html', icon: 'fa-snowflake', title: 'Walk-In Cooler Repair' },
  { href: '../services/maintenance.html', icon: 'fa-clipboard-check', title: 'Maintenance Plans' },
  { href: '../services/indoor-air-quality.html', icon: 'fa-lungs', title: 'Indoor Air Quality' },
];

function renderRelatedServices(city) {
  return CORE_SERVICES.map(
    (s) => `
        <a href="${s.href}" class="related-card">
          <i class="fas ${s.icon}"></i>
          <h4>${esc(s.title)}</h4>
        </a>`
  ).join('\n');
}

function renderOtherAreas(page, allCities) {
  const others = allCities.filter((c) => c.slug !== page.slug);
  const pills = others
    .map((c) => `<li><a href="${esc(c.slug)}.html">${esc(c.city)}, NC</a></li>`)
    .join('\n              ');
  const nearby = others
    .map(
      (c) =>
        `<a href="${esc(c.slug)}.html" style="color:var(--ice-light);text-decoration:none">${esc(c.city)}, NC</a>`
    )
    .join(' • ');
  return { pills, nearby };
}

function buildHtml(page, allCities) {
  const canonical = `https://frostfirehvacr.com/service-areas/${page.slug}.html`;
  const title = page.title;
  const meta = page.meta_description;
  const ogImage =
    page.hero_image ||
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80';
  const { pills, nearby } = renderOtherAreas(page, allCities);
  const faq = faqSchema(page.faqs);
  const faqBlock = page.faqs?.length
    ? `
      <h2>Frequently Asked <span class="gradient-text">Questions</span></h2>
      <div class="info-box">
        ${page.faqs
          .map(
            (f) =>
              `<p><strong>${esc(f.q)}</strong><br>${esc(f.a)}</p>`
          )
          .join('\n        ')}
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(meta)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="icon" type="image/svg+xml" href="../images/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script type="application/ld+json">
  ${JSON.stringify(businessSchema(page), null, 2)}
  </script>
  ${faq ? `<script type="application/ld+json">\n  ${JSON.stringify(faq, null, 2)}\n  </script>` : ''}
  ${SHARED_CSS}

  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(meta)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:site_name" content="Frost Fire Heating & Cooling">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(meta)}">
  <meta name="twitter:image" content="${esc(ogImage)}">
  <link rel="canonical" href="${esc(canonical)}">
</head>
<body>

  <div class="top-bar">
    <div class="container">
      <div class="top-bar-badges">
        <span><i class="fas fa-shield-halved"></i> Licensed & Insured</span>
        <span><i class="fas fa-calendar-check"></i> Same Price on Sundays!</span>
        <span><i class="fas fa-bolt"></i> 24/7 Emergency Service</span>
      </div>
      <div class="top-bar-right">
        <a href="tel:9192304439"><i class="fas fa-phone"></i> (919) 230-4439</a>
      </div>
    </div>
  </div>

  <header class="header">
    <nav class="nav">
      <a href="../" class="logo">
        <img src="../images/logo.svg" alt="Frost Fire Heating & Cooling" style="height:48px;width:auto;">
      </a>
      <ul class="nav-links">
        <li><a href="../#services">Services</a></li>
        <li><a href="../#why-us">Why Us</a></li>
        <li><a href="../#reviews">Reviews</a></li>
        <li><a href="../#areas">Service Areas</a></li>
        <li><a href="../contact.html">Contact</a></li>
      </ul>
      <a href="tel:9192304439" class="nav-phone">
        <i class="fas fa-phone"></i>
        <span>(919) 230-4439</span>
      </a>
      <button class="mobile-toggle" onclick="document.getElementById('mobileMenu').classList.add('active')">
        <i class="fas fa-bars"></i>
      </button>
    </nav>
  </header>

  <div class="mobile-menu" id="mobileMenu">
    <button class="mobile-menu-close" onclick="this.parentElement.classList.remove('active')"><i class="fas fa-times"></i></button>
    <a href="../#services" onclick="this.parentElement.classList.remove('active')">Services</a>
    <a href="../#why-us" onclick="this.parentElement.classList.remove('active')">Why Us</a>
    <a href="../#reviews" onclick="this.parentElement.classList.remove('active')">Reviews</a>
    <a href="../#areas" onclick="this.parentElement.classList.remove('active')">Service Areas</a>
    <a href="../contact.html" onclick="this.parentElement.classList.remove('active')">Contact</a>
    <a href="tel:9192304439" class="btn btn-primary" style="margin-top:12px"><i class="fas fa-phone"></i> Call Now</a>
  </div>

  <section class="page-hero">
    <div class="container">
      <div class="breadcrumb"><a href="../">Home</a> <span>/ <a href="../service-areas.html">Service Areas</a> / ${esc(page.city)}, NC</span></div>
      <h1>HVAC Services in <span class="gradient-text">${esc(page.city)}, NC</span></h1>
      <p class="subtitle">${esc(page.subtitle)}</p>
      <div style="margin-top:28px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a href="tel:9192304439" class="btn btn-primary"><i class="fas fa-phone"></i> Call (919) 230-4439</a>
        <a href="../contact.html" class="btn" style="background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.35)">Request Service</a>
      </div>
    </div>
  </section>

  <section style="padding:0;margin:0">
    <img src="${esc(ogImage)}" alt="${esc(page.hero_alt || `Homes and neighborhoods in ${page.city}, NC`)}" loading="lazy" style="width:100%;max-height:400px;object-fit:cover;display:block">
  </section>

  <section class="content-section">
    <div class="container">
      <h2>Trusted HVAC Service in <span class="gradient-text">${esc(page.city)}</span></h2>
      ${(page.intro_paragraphs || []).map((p) => `<p>${p}</p>`).join('\n')}

      <div class="info-box">
        <h3><i class="fas fa-map-marker-alt" style="color:var(--accent);margin-right:8px"></i> ${esc(page.city)} Service Area Details</h3>
        <p><strong>County:</strong> ${esc(page.county)}</p>
        <p><strong>Zip Codes Served:</strong> ${esc(page.zips)}</p>
        <p><strong>Neighborhoods & Areas:</strong> ${esc(page.neighborhoods)}</p>
        <p><strong>Local Landmarks:</strong> ${esc(page.landmarks)}</p>
        ${page.population ? `<p><strong>Population:</strong> ${esc(page.population)}</p>` : ''}
      </div>

      <div class="why-box">
        <h3><i class="fas fa-star" style="color:var(--ice);margin-right:8px"></i> Why ${esc(page.city)} Residents Choose Frost Fire</h3>
        <p style="color:rgba(255,255,255,.85);margin-bottom:20px;font-size:1.05rem">${page.why_intro || ''}</p>
        <ul>
          ${(page.why_bullets || [
            'Same-day service available 7 days a week',
            'No Sunday or weekend surcharges — ever',
            'Licensed and insured NC HVAC contractor',
            'Residential and commercial HVAC & refrigeration',
            'Transparent pricing — you approve before we start',
            '24/7 emergency HVAC repair',
          ])
            .map((b) => `<li><i class="fas fa-check-circle"></i> ${esc(b)}</li>`)
            .join('\n')}
        </ul>
      </div>
      ${faqBlock}
    </div>
  </section>

  <section class="sunday-banner">
    <div class="container">
      <h2>🗓️ Same Great Price on Sundays</h2>
      <p>Other companies charge extra for weekend service in ${esc(page.city)}. We don't. Your HVAC emergency doesn't check the calendar — neither do our rates.</p>
    </div>
  </section>

  <section class="related-services">
    <div class="container">
      <h2 class="text-center">HVAC Services Available in <span class="gradient-text">${esc(page.city)}</span></h2>
      <div class="related-grid">
        ${renderRelatedServices(page.city)}
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <h2>Need HVAC Service in ${esc(page.city)}? <span style="color:var(--white)">Call Today.</span></h2>
      <p>${esc(page.cta_body || `From emergency repairs to new installations, Frost Fire is ${page.city}'s trusted HVAC partner.`)}</p>
      <div class="cta-buttons">
        <a href="tel:9192304439" class="btn-white"><i class="fas fa-phone"></i> Call (919) 230-4439</a>
        <a href="../contact.html" class="btn btn-primary" style="border:2px solid rgba(255,255,255,.3)"><i class="fas fa-calendar-alt"></i> Schedule Online</a>
      </div>
    </div>
  </section>

  <section class="other-areas">
    <div class="container text-center">
      <h2>Other <span class="gradient-text">Service Areas</span></h2>
      <ul>
              ${pills}
      </ul>
    </div>
  </section>

  <section class="nearby-cities" style="background:var(--primary);padding:48px 0;text-align:center">
    <div class="container">
      <h3 style="color:var(--white);margin-bottom:16px">Also Serving Nearby Areas</h3>
      <p style="color:rgba(255,255,255,.7);line-height:2">${nearby}</p>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2026 Frost Fire Heating and Cooling. All rights reserved. Licensed & Insured in NC.</p>
      <p style="margin-top:8px"><a href="../">Home</a> · <a href="tel:9192304439">(919) 230-4439</a> · <a href="../contact.html">Contact</a> · <a href="../service-areas.html">All Service Areas</a></p>
    </div>
  </footer>

  <div class="floating-cta">
    <a href="tel:9192304439"><i class="fas fa-phone"></i> Call Now — (919) 230-4439</a>
  </div>

  <script src="../js/analytics-config.js"></script>
  <script src="../js/attribution.js"></script>
  <script src="../chat-widget.js"></script>
</body>
</html>
`;
}

function upsertSitemap(slug) {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const loc = `https://frostfirehvacr.com/service-areas/${slug}.html`;
  const today = new Date().toISOString().slice(0, 10);
  const entry = `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>\n`;
  if (xml.includes(loc)) {
    xml = xml.replace(
      new RegExp(
        `\\s*<url><loc>${loc.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}<\\/loc>[\\s\\S]*?<\\/url>`
      ),
      `\n${entry.trimEnd()}`
    );
  } else {
    xml = xml.replace('</urlset>', `${entry}</urlset>`);
  }
  fs.writeFileSync(sitemapPath, xml);
}

export function publishCity(page, allCities) {
  if (!page.slug || !page.city || !page.title || !page.meta_description) {
    throw new Error('city.json requires slug, city, title, meta_description');
  }
  const outPath = path.join(ROOT, 'service-areas', `${page.slug}.html`);
  fs.writeFileSync(outPath, buildHtml(page, allCities));
  upsertSitemap(page.slug);
  return outPath;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const inputPath = process.argv[2];
if (isMain && inputPath && !process.argv.includes('--export-only')) {
  const page = JSON.parse(fs.readFileSync(path.resolve(inputPath), 'utf8'));
  const allPath = path.join(ROOT, 'seo-pages', 'all-cities.json');
  const allCities = fs.existsSync(allPath)
    ? JSON.parse(fs.readFileSync(allPath, 'utf8'))
    : [{ slug: page.slug, city: page.city }];
  const out = publishCity(page, allCities);
  console.log(`Wrote ${out}`);
}
