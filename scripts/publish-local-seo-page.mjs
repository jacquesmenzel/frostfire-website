/**
 * Publish hyper-local SEO pages (neighborhoods, small towns, long-tail).
 * Targets low-competition keywords — NOT generic Raleigh head terms.
 *
 * Usage: node scripts/publish-local-seo-page.mjs path/to/page.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SHARED_CSS = fs
  .readFileSync(path.join(ROOT, 'service-areas', 'clayton-nc.html'), 'utf8')
  .match(/<style>[\s\S]*?<\/style>/)?.[0];

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
      acceptedAnswer: {
        '@type': 'Answer',
        text: String(f.a || f.a_html || '').replace(/<[^>]+>/g, ''),
      },
    })),
  };
}

function serviceSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: page.service_type || 'HVAC Repair and Installation',
    name: page.h1,
    description: page.meta_description,
    url: `https://frostfirehvacr.com/areas/${page.slug}.html`,
    areaServed: {
      '@type': 'Place',
      name: `${page.place_name}, ${page.parent_city || ''} NC`.trim(),
      address: {
        '@type': 'PostalAddress',
        addressLocality: page.parent_city || page.place_name,
        addressRegion: 'NC',
        postalCode: page.zip || '27520',
        addressCountry: 'US',
      },
    },
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
    },
  };
}

function renderSections(sections) {
  return (sections || [])
    .map((s) => {
      const id = s.id ? ` id="${esc(s.id)}"` : '';
      const h = s.level === 3 ? 'h3' : 'h2';
      const body = (s.paragraphs || []).map((p) => `<p>${p}</p>`).join('\n');
      const ul = s.list?.length
        ? `<ul>\n${s.list.map((li) => `          <li>${li}</li>`).join('\n')}\n        </ul>`
        : '';
      const ol = s.ordered_list?.length
        ? `<ol>\n${s.ordered_list.map((li) => `          <li>${li}</li>`).join('\n')}\n        </ol>`
        : '';
      return `<${h}${id}>${s.title_html || esc(s.title)}</${h}>\n${body}\n${ul}\n${ol}`;
    })
    .join('\n\n');
}

function renderToc(sections) {
  const items = (sections || []).filter((s) => s.id && s.level !== 3);
  if (!items.length) return '';
  return `
      <div class="info-box">
        <h3><i class="fas fa-list" style="color:var(--accent);margin-right:8px"></i> On This Page</h3>
        <ol style="margin:0;padding-left:20px">
          ${items.map((s) => `<li style="margin-bottom:6px"><a href="#${esc(s.id)}">${esc(s.title)}</a></li>`).join('\n          ')}
          <li style="margin-bottom:6px"><a href="#faqs">Frequently Asked Questions</a></li>
        </ol>
      </div>`;
}

function renderRelated(related) {
  if (!related?.length) return '';
  return `
      <h2 id="related">Related Pages</h2>
      <div class="related-grid">
        ${related
          .map(
            (r) => `
        <a href="${esc(r.href)}" class="related-card">
          <i class="fas ${esc(r.icon || 'fa-link')}"></i>
          <h4>${esc(r.title)}</h4>
        </a>`
          )
          .join('\n')}
      </div>`;
}

function buildHtml(page) {
  const canonical = `https://frostfirehvacr.com/areas/${page.slug}.html`;
  const ogImage =
    page.hero_image ||
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.meta_description)}">
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
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.meta_description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:site_name" content="Frost Fire Heating & Cooling">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.meta_description)}">
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
      <a href="tel:9192304439" class="nav-phone"><i class="fas fa-phone"></i><span>(919) 230-4439</span></a>
      <button class="mobile-toggle" onclick="document.getElementById('mobileMenu').classList.add('active')"><i class="fas fa-bars"></i></button>
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
      <div class="breadcrumb"><a href="../">Home</a> <span>/ <a href="../service-areas.html">Areas</a> / ${esc(page.place_name)}</span></div>
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
      <p><em>Local HVAC guide for ${esc(page.place_name)}${page.parent_city ? `, ${esc(page.parent_city)}` : ''}, NC · Frost Fire — Clayton-based · Same price on Sundays</em></p>
      ${(page.intro || []).map((p) => `<p>${p}</p>`).join('\n')}
      ${renderToc(page.sections)}
      <div class="info-box">
        <h3><i class="fas fa-map-marker-alt" style="color:var(--accent);margin-right:8px"></i> ${esc(page.place_name)} at a Glance</h3>
        <p><strong>Area:</strong> ${esc(page.parent_city || page.place_name)}, ${esc(page.county || 'NC')}</p>
        <p><strong>Zip:</strong> ${esc(page.zip || '27520')}</p>
        <p><strong>Nearby roads / landmarks:</strong> ${esc(page.landmarks || '')}</p>
        <p><strong>Housing profile:</strong> ${esc(page.housing_profile || '')}</p>
        <p><strong>Primary service focus:</strong> ${esc(page.primary_keyword || 'local HVAC repair')}</p>
      </div>
      ${renderSections(page.sections)}
      <div class="why-box">
        <h3><i class="fas fa-star" style="color:var(--ice);margin-right:8px"></i> Why ${esc(page.place_name)} Homeowners Call a Clayton-Based Team</h3>
        <p style="color:rgba(255,255,255,.85);margin-bottom:16px">${page.why_local || 'Frost Fire is headquartered in Clayton — not a distant franchise dispatching from downtown Raleigh. That means faster routes, honest pricing, and technicians who already know Johnston and east Wake neighborhoods.'}</p>
        <ul>
          ${(page.why_bullets || [
            'Same-day triage when capacity allows',
            'No Sunday or weekend surcharge',
            'Heat pumps, AC, furnaces, and commercial refrigeration',
            'Licensed & insured North Carolina contractor',
            'Upfront approval before major repairs',
          ])
            .map((b) => `<li><i class="fas fa-check-circle"></i> ${esc(b)}</li>`)
            .join('\n')}
        </ul>
      </div>
      <h2 id="faqs">Frequently Asked Questions — ${esc(page.place_name)}</h2>
      ${(page.faqs || [])
        .map((f) => `<h3>${esc(f.q)}</h3><p>${f.a_html || esc(f.a)}</p>`)
        .join('\n')}
      ${renderRelated(page.related)}
    </div>
  </section>
  <section class="sunday-banner">
    <div class="container">
      <h2>🗓️ Same Great Price on Sundays</h2>
      <p>Weekend HVAC failures in ${esc(page.place_name)} do not deserve a markup. We charge the same rates seven days a week.</p>
    </div>
  </section>
  <section class="cta-section">
    <div class="container">
      <h2>Need HVAC Service in ${esc(page.place_name)}?</h2>
      <p>${esc(page.cta_body || 'Call Frost Fire — your Clayton-based HVAC team with fast local routing.')}</p>
      <div class="cta-buttons">
        <a href="tel:9192304439" class="btn-white"><i class="fas fa-phone"></i> Call (919) 230-4439</a>
        <a href="../contact.html" class="btn btn-primary" style="border:2px solid rgba(255,255,255,.3)"><i class="fas fa-calendar-alt"></i> Schedule Online</a>
      </div>
    </div>
  </section>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2026 Frost Fire Heating and Cooling. All rights reserved. Licensed & Insured in NC.</p>
      <p style="margin-top:8px"><a href="../">Home</a> · <a href="tel:9192304439">(919) 230-4439</a> · <a href="../service-areas.html">All Service Areas</a> · <a href="index.html">Local Area Guides</a></p>
    </div>
  </footer>
  <div class="floating-cta">
    <a href="tel:9192304439"><i class="fas fa-phone"></i> Call Now — (919) 230-4439</a>
  </div>
  <script src="../js/analytics-config.js"></script>
  <script src="../js/attribution.js"></script>
  <script src="../chat-widget.js"></script>
</body>
</html>`;
}

function upsertSitemap(slug) {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const loc = `https://frostfirehvacr.com/areas/${slug}.html`;
  const today = new Date().toISOString().slice(0, 10);
  const entry = `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.85</priority></url>\n`;
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

export function publishLocalPage(page) {
  if (!page.slug || !page.title || !page.h1 || !page.place_name) {
    throw new Error('slug, title, h1, place_name required');
  }
  const dir = path.join(ROOT, 'areas');
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `${page.slug}.html`);
  fs.writeFileSync(out, buildHtml(page));
  upsertSitemap(page.slug);
  return out;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node scripts/publish-local-seo-page.mjs page.json');
    process.exit(1);
  }
  const page = JSON.parse(fs.readFileSync(path.resolve(input), 'utf8'));
  console.log('Wrote', publishLocalPage(page));
}
