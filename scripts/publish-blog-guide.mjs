/**
 * Publish a long-form Frost Fire blog guide.
 * Usage: node scripts/publish-blog-guide.mjs path/to/guide.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function articleSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.meta_description,
    author: { '@type': 'Organization', name: 'Frost Fire Heating and Cooling' },
    publisher: {
      '@type': 'Organization',
      name: 'Frost Fire Heating and Cooling',
      url: 'https://frostfirehvacr.com',
      telephone: '+19192304439',
    },
    datePublished: page.date_published || '2026-07-10',
    dateModified: page.date_modified || new Date().toISOString().slice(0, 10),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://frostfirehvacr.com/blog/${page.slug}.html`,
    },
    image: page.hero_image,
  };
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

function howtoSchema(page) {
  if (!page.howto_steps?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: page.howto_name || page.h1,
    description: page.meta_description,
    step: page.howto_steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };
}

function renderToc(sections) {
  if (!sections?.length) return '';
  return `
        <div class="guide-toc" style="background:var(--off-white,#f7fafc);border:1px solid #e2e8f0;border-radius:12px;padding:24px 28px;margin:0 0 32px">
          <h2 style="font-size:1.15rem;margin:0 0 12px">In This Guide</h2>
          <ol style="margin:0;padding-left:20px">
            ${sections.map((s) => `<li style="margin-bottom:6px"><a href="#${esc(s.id)}">${esc(s.title)}</a></li>`).join('\n            ')}
          </ol>
        </div>`;
}

function renderSections(sections) {
  return (sections || [])
    .map((s) => {
      const level = s.level === 3 ? 'h3' : 'h2';
      const idAttr = s.id ? ` id="${esc(s.id)}"` : '';
      const heading = `<${level}${idAttr}>${s.title_html || esc(s.title)}</${level}>`;
      const body = (s.paragraphs || []).map((p) => `<p>${p}</p>`).join('\n');
      const list = s.list?.length
        ? `<ul>\n${s.list.map((li) => `          <li>${li}</li>`).join('\n')}\n        </ul>`
        : '';
      const ordered = s.ordered_list?.length
        ? `<ol>\n${s.ordered_list.map((li) => `          <li>${li}</li>`).join('\n')}\n        </ol>`
        : '';
      const callout = s.callout
        ? `<div style="padding:20px 24px;background:#fff7ed;border-left:4px solid #e8531e;border-radius:8px;margin:20px 0"><p style="margin:0"><strong>${esc(s.callout.title || 'Tip')}</strong> ${s.callout.body}</p></div>`
        : '';
      return `${heading}\n${body}\n${list}\n${ordered}\n${callout}`;
    })
    .join('\n\n');
}

function renderFaqs(faqs) {
  if (!faqs?.length) return '';
  return `
        <h2 id="faqs">Frequently Asked Questions</h2>
        ${faqs
          .map(
            (f) => `
        <h3>${esc(f.q)}</h3>
        <p>${f.a_html || esc(f.a)}</p>`
          )
          .join('\n')}`;
}

function renderRelated(related) {
  if (!related?.length) return '';
  return `
        <h2 id="related">Related Guides &amp; Services</h2>
        <ul>
          ${related.map((r) => `<li><a href="${esc(r.href)}">${esc(r.title)}</a>${r.blurb ? ` — ${esc(r.blurb)}` : ''}</li>`).join('\n          ')}
        </ul>`;
}

function buildHtml(page) {
  const canonical = `https://frostfirehvacr.com/blog/${page.slug}.html`;
  const howto = howtoSchema(page);
  const tocSections = (page.sections || [])
    .filter((s) => s.id && s.level !== 3)
    .map((s) => ({ id: s.id, title: s.title }))
    .concat(page.faqs?.length ? [{ id: 'faqs', title: 'Frequently Asked Questions' }] : []);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.meta_description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.meta_description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:site_name" content="Frost Fire Heating & Cooling">
  <meta property="og:image" content="${esc(page.hero_image)}">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.meta_description)}">
  <meta name="twitter:image" content="${esc(page.hero_image)}">
  <link rel="canonical" href="${esc(canonical)}">
  <script type="application/ld+json">
  ${JSON.stringify(articleSchema(page), null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(faqSchema(page.faqs), null, 2)}
  </script>
  ${howto ? `<script type="application/ld+json">\n  ${JSON.stringify(howto, null, 2)}\n  </script>` : ''}
</head>
<body>
  <header class="header">
    <div class="container">
      <a href="../index.html" class="logo">
        <span class="logo-icon">🔥❄️</span>
        <span class="logo-text"><span class="frost">FROST</span> <span class="fire">FIRE</span><span class="sub">Heating & Cooling</span></span>
      </a>
      <button class="menu-toggle" aria-label="Menu">☰</button>
      <nav class="nav">
        <a href="../index.html">Home</a>
        <a href="../services.html">Services</a>
        <a href="../service-areas.html">Service Areas</a>
        <a href="../about.html">About</a>
        <a href="./" class="active">Blog</a>
        <a href="../reviews.html">Reviews</a>
        <a href="../contact.html">Contact</a>
        <a href="tel:9192304439" class="nav-phone">📞 (919) 230-4439</a>
      </nav>
    </div>
  </header>

  <section class="page-hero">
    <div class="container">
      <div class="breadcrumb"><a href="../index.html">Home</a> / <a href="./">Blog</a> / ${esc(page.category || 'Guides')}</div>
      <h1>${esc(page.h1)}</h1>
      <p style="max-width:720px;margin:12px auto 0;color:rgba(255,255,255,.85)">${esc(page.subtitle || '')}</p>
    </div>
  </section>

  <section style="padding:0;margin:0">
    <img src="${esc(page.hero_image)}" alt="${esc(page.hero_alt || page.h1)}" loading="lazy" style="width:100%;max-height:400px;object-fit:cover;display:block">
  </section>

  <section class="content-section">
    <div class="container">
      <div class="content-body">
        <p><em>Updated ${esc(page.date_modified || 'July 10, 2026')} · Written by Frost Fire Heating &amp; Cooling · Serving Clayton, Raleigh, Durham &amp; the Triangle</em></p>
        ${(page.intro || []).map((p) => `<p>${p}</p>`).join('\n')}
        ${renderToc(tocSections)}
        ${renderSections(page.sections)}
        ${renderFaqs(page.faqs)}
        ${renderRelated(page.related)}

        <div class="mt-40" style="padding:30px;background:var(--off-white);border-radius:var(--radius);text-align:center;margin-top:40px">
          <h3>${esc(page.cta_title || 'Need Help From a Local HVAC Pro?')}</h3>
          <p style="color:var(--text-light);margin-bottom:16px">${esc(page.cta_body || 'Frost Fire is open 7 days a week — same price on Sundays. Call (919) 230-4439.')}</p>
          <a href="tel:9192304439" class="btn btn-primary">📞 Call (919) 230-4439</a>
          <a href="../contact.html" class="btn btn-secondary" style="margin-left:8px">Request Service</a>
        </div>
        <div class="mt-30" style="text-align:center;margin-top:24px">
          <a href="./" class="btn btn-secondary btn-sm">← Back to Blog</a>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <h4>🔥❄️ Frost Fire Heating & Cooling</h4>
          <p>Locally owned HVAC and refrigeration company based in Clayton, NC.</p>
          <div class="footer-contact-item">📞 <a href="tel:9192304439">(919) 230-4439</a></div>
          <div class="footer-contact-item">📍 Clayton, NC 27520</div>
        </div>
        <div><h4>Services</h4><ul><li><a href="../services/ac-repair.html">AC Repair</a></li><li><a href="../services/heating-repair.html">Heating Repair</a></li><li><a href="../services/heat-pump.html">Heat Pumps</a></li><li><a href="../services/maintenance.html">Maintenance</a></li></ul></div>
        <div><h4>Areas</h4><ul><li><a href="../service-areas/clayton-nc.html">Clayton</a></li><li><a href="../service-areas/raleigh-nc.html">Raleigh</a></li><li><a href="../service-areas/durham-nc.html">Durham</a></li><li><a href="../service-areas/garner-nc.html">Garner</a></li></ul></div>
        <div><h4>Company</h4><ul><li><a href="../about.html">About</a></li><li><a href="./">Blog</a></li><li><a href="../reviews.html">Reviews</a></li><li><a href="../contact.html">Contact</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 Frost Fire Heating and Cooling. All rights reserved.</span>
        <span>Licensed HVAC Contractor — Clayton, NC</span>
      </div>
    </div>
  </footer>
  <a href="tel:9192304439" class="mobile-call-btn" aria-label="Call">📞</a>
  <script src="../js/main.js"></script>
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
  const loc = `https://frostfirehvacr.com/blog/${slug}.html`;
  const today = new Date().toISOString().slice(0, 10);
  const entry = `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.7</priority></url>\n`;
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

export function publishGuide(page) {
  if (!page.slug || !page.title || !page.h1) throw new Error('slug, title, h1 required');
  const out = path.join(ROOT, 'blog', `${page.slug}.html`);
  fs.writeFileSync(out, buildHtml(page));
  upsertSitemap(page.slug);
  return out;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node scripts/publish-blog-guide.mjs path/to/guide.json');
    process.exit(1);
  }
  const page = JSON.parse(fs.readFileSync(path.resolve(input), 'utf8'));
  console.log('Wrote', publishGuide(page));
}
