#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(SITE_ROOT, 'blog');
const BLOG_INDEX = path.join(BLOG_DIR, 'index.html');
const SITEMAP = path.join(SITE_ROOT, 'sitemap.xml');
const SITE_URL = 'https://frostfirehvacr.com';
const DEFAULT_HERO = 'https://images.unsplash.com/photo-1642749776312-aa42ce20c9f5?w=1200&q=80';

function usage() {
  console.error('Usage: node scripts/publish-blog-post.mjs path/to/blog-package.json');
  process.exit(1);
}

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function normalizePackage(raw) {
  const post = raw.blog_post || raw;
  const title = post.title || post.blog_title;
  if (!title) throw new Error('Blog package is missing title');
  const slug = slugify(post.slug || title);
  const category = post.category || post.tag || 'HVAC';
  const excerpt = post.excerpt || post.meta_description || post.description || '';
  const metaDescription = post.meta_description || excerpt || `${title} from Frost Fire Heating & Cooling.`;
  const heroImage = post.hero_image || post.heroImage || DEFAULT_HERO;
  const heroAlt = post.hero_alt || post.heroAlt || title;
  const emoji = post.emoji || emojiForCategory(category);
  const bodyHtml = post.body_html || htmlFromSections(post.sections || post.outline || [], post.intro || post.caption);

  return {
    title,
    slug,
    category,
    excerpt,
    metaDescription,
    heroImage,
    heroAlt,
    emoji,
    bodyHtml,
    canonicalUrl: `${SITE_URL}/blog/${slug}.html`,
    publishedDate: post.published_date || post.publishedDate || today(),
  };
}

function emojiForCategory(category = '') {
  const lower = category.toLowerCase();
  if (lower.includes('install')) return '🏗️';
  if (lower.includes('repair') || lower.includes('emergency')) return '🚨';
  if (lower.includes('maintenance')) return '🛡️';
  if (lower.includes('air')) return '🌿';
  if (lower.includes('heat')) return '🔥';
  if (lower.includes('ac') || lower.includes('cool')) return '❄️';
  return '🔥❄️';
}

function htmlFromSections(sections, intro) {
  const chunks = [];
  if (intro) chunks.push(`<p>${esc(intro)}</p>`);
  for (const section of sections) {
    if (typeof section === 'string') {
      chunks.push(`<h2>${esc(section)}</h2>`);
      continue;
    }
    if (!section) continue;
    if (section.heading) chunks.push(`<h2>${esc(section.heading)}</h2>`);
    if (section.body) chunks.push(`<p>${esc(section.body)}</p>`);
    if (Array.isArray(section.items) && section.items.length) {
      chunks.push('<ul>');
      for (const item of section.items) chunks.push(`          <li>${esc(item)}</li>`);
      chunks.push('        </ul>');
    }
  }
  return chunks.join('\n\n        ');
}

function renderArticle(post) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    author: {
      '@type': 'Organization',
      name: 'Frost Fire Heating and Cooling',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Frost Fire Heating and Cooling',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonicalUrl,
    },
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(post.title)} | Frost Fire HVACR</title>
  <meta name="description" content="${esc(post.metaDescription)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(post.title)} | Frost Fire HVACR">
  <meta property="og:description" content="${esc(post.metaDescription)}">
  <meta property="og:url" content="${esc(post.canonicalUrl)}">
  <meta property="og:site_name" content="Frost Fire Heating & Cooling">
  <meta property="og:image" content="${esc(post.heroImage)}">
  <meta property="og:locale" content="en_US">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(post.title)} | Frost Fire HVACR">
  <meta name="twitter:description" content="${esc(post.metaDescription)}">
  <meta name="twitter:image" content="${esc(post.heroImage)}">
  <!-- Canonical -->
  <link rel="canonical" href="${esc(post.canonicalUrl)}">

  <script type="application/ld+json">
  ${JSON.stringify(schema, null, 2)}
  </script>
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
      <div class="breadcrumb"><a href="../index.html">Home</a> / <a href="./">Blog</a> / ${esc(post.category)}</div>
      <h1>${esc(post.title)}</h1>
    </div>
  </section>
  <!-- Hero Photo -->
  <section style="padding:0;margin:0">
    <img src="${esc(post.heroImage)}" alt="${esc(post.heroAlt)}" loading="lazy" style="width:100%;max-height:400px;object-fit:cover;display:block">
  </section>
  <section class="content-section">
    <div class="container">
      <div class="content-body">

        ${post.bodyHtml}

        <div class="mt-40" style="padding:30px;background:var(--off-white);border-radius:var(--radius);text-align:center;">
          <h3>Need HVAC Service?</h3>
          <p style="color:var(--text-light);margin-bottom:16px;">Frost Fire Heating & Cooling serves Clayton, Raleigh, Durham, Garner, and the surrounding Triangle area. Same great price on Sundays!</p>
          <a href="tel:9192304439" class="btn btn-primary">📞 Call (919) 230-4439</a>
        </div>
        <div class="mt-30" style="text-align:center;">
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
        <div><h4>Services</h4><ul><li><a href="../services.html#ac-repair">AC Repair</a></li><li><a href="../services.html#heating">Heating</a></li><li><a href="../services.html#heat-pump">Heat Pumps</a></li></ul></div>
        <div><h4>Areas</h4><ul><li><a href="../service-areas.html#clayton">Clayton</a></li><li><a href="../service-areas.html#raleigh">Raleigh</a></li><li><a href="../service-areas.html#durham">Durham</a></li></ul></div>
        <div><h4>Company</h4><ul><li><a href="../about.html">About</a></li><li><a href="./">Blog</a></li><li><a href="../reviews.html">Reviews</a></li><li><a href="../contact.html">Contact</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 Frost Fire Heating and Cooling. All rights reserved.</span>
        <span>Licensed HVAC Contractor — Clayton, NC 27520</span>
      </div>
    </div>
  </footer>
  <a href="tel:9192304439" class="mobile-call-btn" aria-label="Call">📞</a>
  <script src="../js/main.js"></script>
<script src="../chat-widget.js"></script>
</body>
</html>
`;
}

function blogCard(post) {
  return `        <a href="${esc(post.slug)}.html" class="blog-card">
          <div class="blog-card-img">${esc(post.emoji)}</div>
          <div class="blog-card-body">
            <span class="tag">${esc(post.category)}</span>
            <h3>${esc(post.title)}</h3>
            <p>${esc(post.excerpt || post.metaDescription)}</p>
            <span class="read-more">Read More →</span>
          </div>
        </a>`;
}

function updateBlogIndex(post) {
  let html = fs.readFileSync(BLOG_INDEX, 'utf8');
  const card = blogCard(post);
  const existingHref = `href="${post.slug}.html"`;
  if (html.includes(existingHref)) {
    html = html.replace(/        <a href="[^"]+" class="blog-card">[\s\S]*?        <\/a>/, (match) =>
      match.includes(existingHref) ? card : match,
    );
  } else {
    html = html.replace('      <div class="blog-grid">\n', `      <div class="blog-grid">\n${card}\n`);
  }
  fs.writeFileSync(BLOG_INDEX, html);
}

function updateSitemap(post) {
  const loc = `${SITE_URL}/blog/${post.slug}.html`;
  let xml = fs.readFileSync(SITEMAP, 'utf8');
  if (xml.includes(`<loc>${loc}</loc>`)) {
    xml = xml.replace(
      new RegExp(`<url><loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc><lastmod>[^<]+</lastmod><priority>0\\.6</priority></url>`),
      `<url><loc>${loc}</loc><lastmod>${post.publishedDate}</lastmod><priority>0.6</priority></url>`,
    );
  } else {
    xml = xml.replace('</urlset>', `  <url><loc>${loc}</loc><lastmod>${post.publishedDate}</lastmod><priority>0.6</priority></url>\n</urlset>`);
  }
  fs.writeFileSync(SITEMAP, xml);
}

const input = process.argv[2];
if (!input) usage();

const raw = JSON.parse(fs.readFileSync(path.resolve(input), 'utf8'));
const post = normalizePackage(raw);
const outputFile = path.join(BLOG_DIR, `${post.slug}.html`);

if (!post.bodyHtml.trim()) {
  throw new Error('Blog package did not include body_html or sections/outline content');
}

fs.writeFileSync(outputFile, renderArticle(post));
updateBlogIndex(post);
updateSitemap(post);

console.log(`Created blog/${post.slug}.html`);
console.log(`Updated blog/index.html`);
console.log(`Updated sitemap.xml`);
console.log(`${post.canonicalUrl}`);
