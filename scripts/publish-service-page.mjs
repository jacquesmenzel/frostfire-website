/**
 * Publish a Frost Fire service landing page (SEO decision-intent pages).
 * Usage: node scripts/publish-service-page.mjs path/to/page.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SHARED_CSS = fs.readFileSync(path.join(ROOT, 'services', 'commercial.html'), 'utf8')
  .match(/<style>[\s\S]*?<\/style>/)?.[0];

if (!SHARED_CSS) {
  console.error('Could not extract shared CSS from commercial.html');
  process.exit(1);
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function serviceSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: page.service_type,
    name: page.h1,
    description: page.meta_description,
    url: `https://frostfirehvacr.com/services/${page.slug}.html`,
    provider: {
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
      areaServed: page.area_served || [
        'Clayton, NC',
        'Raleigh, NC',
        'Durham, NC',
        'Garner, NC',
        'Cary, NC',
      ],
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
    },
  };
}

function renderCards(cards) {
  return (cards || [])
    .map(
      (c) => `
        <div class="problem-card">
          <i class="fas ${esc(c.icon || 'fa-check')}"></i>
          <h4>${esc(c.title)}</h4>
          <p>${esc(c.body)}</p>
        </div>`
    )
    .join('\n');
}

function renderSteps(steps) {
  return (steps || [])
    .map(
      (s, i) => `
        <div class="step">
          <div class="step-number">${i + 1}</div>
          <h4>${esc(s.title)}</h4>
          <p>${esc(s.body)}</p>
        </div>`
    )
    .join('\n');
}

function renderFaqs(faqs) {
  return (faqs || [])
    .map(
      (f) => `
        <div class="problem-card" style="grid-column:1/-1">
          <h4>${esc(f.q)}</h4>
          <p>${esc(f.a)}</p>
        </div>`
    )
    .join('\n');
}

function renderRelated(related) {
  return (related || [])
    .map(
      (r) => `
        <a href="${esc(r.href)}" class="related-card">
          <i class="fas ${esc(r.icon || 'fa-link')}"></i>
          <h4>${esc(r.title)}</h4>
          <p>${esc(r.body || '')}</p>
        </a>`
    )
    .join('\n');
}

function renderBodyParagraphs(paragraphs) {
  return (paragraphs || []).map((p) => `<p>${p}</p>`).join('\n');
}

function buildHtml(page) {
  const canonical = `https://frostfirehvacr.com/services/${page.slug}.html`;
  const title = page.title;
  const meta = page.meta_description;
  const ogImage = page.hero_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80';
  const breadcrumb = page.breadcrumb || page.h1;

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
  ${JSON.stringify(serviceSchema(page), null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(faqSchema(page.faqs), null, 2)}
  </script>
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
      <div class="breadcrumb"><a href="../">Home</a> <span>/ <a href="../services.html">Services</a> / ${esc(breadcrumb)}</span></div>
      <h1>${page.h1_html || esc(page.h1)}</h1>
      <p class="subtitle">${esc(page.subtitle)}</p>
      <div style="margin-top:28px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a href="tel:9192304439" class="btn btn-primary"><i class="fas fa-phone"></i> Call (919) 230-4439</a>
        <a href="../contact.html" class="btn" style="background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.35)">Request Service</a>
      </div>
    </div>
  </section>

  <section style="padding:0;margin:0">
    <img src="${esc(ogImage)}" alt="${esc(page.hero_alt || page.h1)}" loading="lazy" style="width:100%;max-height:400px;object-fit:cover;display:block">
  </section>

  <section class="content-section">
    <div class="container">
      <h2>${page.intro_h2_html || esc(page.intro_h2)}</h2>
      ${renderBodyParagraphs(page.intro_paragraphs)}

      <h2>${page.cards_h2_html || esc(page.cards_h2)}</h2>
      <div class="problems-grid">
        ${renderCards(page.cards)}
      </div>

      <h2>${page.process_h2_html || esc(page.process_h2)}</h2>
      <div class="process-steps">
        ${renderSteps(page.steps)}
      </div>

      <div class="why-box">
        <h3><i class="fas fa-star" style="color:var(--ice);margin-right:8px"></i> ${esc(page.why_title || 'Why Triangle Businesses Call Frost Fire')}</h3>
        <ul>
          ${(page.why_bullets || [])
            .map((b) => `<li><i class="fas fa-check-circle"></i> ${esc(b)}</li>`)
            .join('\n')}
        </ul>
      </div>

      <div class="pricing-section">
        <h3><i class="fas fa-map-marker-alt" style="color:var(--accent);margin-right:8px"></i> ${esc(page.areas_title || 'Service Area')}</h3>
        ${renderBodyParagraphs(page.areas_paragraphs)}
        <p style="margin-top:16px"><strong>Need help now?</strong> Call <a href="tel:9192304439" style="color:var(--accent);font-weight:700">(919) 230-4439</a> — open 24/7, same price on Sundays.</p>
      </div>

      <h2>Frequently Asked <span class="gradient-text">Questions</span></h2>
      <div class="problems-grid">
        ${renderFaqs(page.faqs)}
      </div>
    </div>
  </section>

  <section class="sunday-banner">
    <div class="container">
      <h2>🗓️ Same Great Price on Sundays</h2>
      <p>Most HVAC companies charge weekend premiums. We don't. Same fair rates 7 days a week — including holidays.</p>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <h2>${esc(page.cta_title || 'Ready for Fast Service?')}</h2>
      <p>${esc(page.cta_body || 'Call Frost Fire for same-day help across the Triangle.')}</p>
      <div class="cta-buttons">
        <a href="tel:9192304439" class="btn-white"><i class="fas fa-phone"></i> Call (919) 230-4439</a>
        <a href="../contact.html" class="btn btn-primary" style="border:2px solid rgba(255,255,255,.3)"><i class="fas fa-calendar-alt"></i> Schedule Online</a>
      </div>
    </div>
  </section>

  <section class="related-services">
    <div class="container">
      <h2 class="text-center">Related <span class="gradient-text">Pages</span></h2>
      <div class="related-grid">
        ${renderRelated(page.related)}
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2026 Frost Fire Heating and Cooling. All rights reserved. Licensed & Insured in NC.</p>
      <p style="margin-top:8px"><a href="../">Home</a> · <a href="tel:9192304439">(919) 230-4439</a> · <a href="../contact.html">Contact</a> · <a href="../services.html">Services</a></p>
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
  const loc = `https://frostfirehvacr.com/services/${slug}.html`;
  const today = new Date().toISOString().slice(0, 10);
  const entry = `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>\n`;
  if (xml.includes(loc)) {
    xml = xml.replace(
      new RegExp(`\\s*<url><loc>${loc.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}<\\/loc>[\\s\\S]*?<\\/url>`),
      `\n${entry.trimEnd()}`
    );
  } else {
    xml = xml.replace('</urlset>', `${entry}</urlset>`);
  }
  fs.writeFileSync(sitemapPath, xml);
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/publish-service-page.mjs path/to/page.json');
  process.exit(1);
}

const page = JSON.parse(fs.readFileSync(path.resolve(inputPath), 'utf8'));
if (!page.slug || !page.title || !page.h1) {
  console.error('page.json requires slug, title, h1');
  process.exit(1);
}

const outPath = path.join(ROOT, 'services', `${page.slug}.html`);
fs.writeFileSync(outPath, buildHtml(page));
upsertSitemap(page.slug);
console.log(`Wrote ${outPath}`);
console.log(`Updated sitemap for /services/${page.slug}.html`);
