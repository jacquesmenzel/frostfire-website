/**
 * Publish all long-form blog guides and update blog index + QA.
 * Usage: node scripts/publish-blog-guides-batch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GUIDES_PART1 } from './blog-guides-part1.mjs';
import { GUIDES_PART2 } from './blog-guides-part2.mjs';
import { publishGuide } from './publish-blog-guide.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GUIDES = [...GUIDES_PART1, ...GUIDES_PART2];
const OUT_DIR = path.join(ROOT, 'seo-pages', 'blog-guides');
fs.mkdirSync(OUT_DIR, { recursive: true });

const published = [];
for (const guide of GUIDES) {
  const jsonPath = path.join(OUT_DIR, `${guide.slug}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(guide, null, 2) + '\n');
  const out = publishGuide(guide);
  published.push(guide);
  console.log('Wrote', out);
}

// Update blog index — insert cards after opening of blog grid if present
const indexPath = path.join(ROOT, 'blog', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

function cardHtml(g) {
  const emoji =
    {
      Maintenance: '🛠️',
      Troubleshooting: '🔧',
      'Heat Pumps': '♨️',
      Emergency: '🚨',
      'Buying Guides': '📋',
      Airflow: '💨',
      'Indoor Air Quality': '🌬️',
    }[g.category] || '📖';
  const shortBlurb = (g.subtitle || g.meta_description || '').slice(0, 140);
  return `
        <a href="${g.slug}.html" class="blog-card">
          <div class="blog-card-img">${emoji}</div>
          <div class="blog-card-body">
            <span class="tag">${g.category || 'Guide'}</span>
            <h3>${g.h1}</h3>
            <p>${shortBlurb}</p>
            <span class="read-more">Read More →</span>
          </div>
        </a>`;
}

const marker = '<!-- NEW_GUIDES_START -->';
const endMarker = '<!-- NEW_GUIDES_END -->';
const block = `${marker}\n${published.map(cardHtml).join('\n')}\n        ${endMarker}`;

if (indexHtml.includes(marker) && indexHtml.includes(endMarker)) {
  indexHtml = indexHtml.replace(new RegExp(`${marker}[\\s\\S]*?${endMarker}`), block);
} else if (indexHtml.includes('<div class="blog-grid">')) {
  indexHtml = indexHtml.replace(
    '<div class="blog-grid">',
    `<div class="blog-grid">\n        ${block}\n`
  );
} else {
  indexHtml = indexHtml.replace(
    /<footer class="footer">/,
    `<section class="section"><div class="container"><div class="blog-grid">${published.map(cardHtml).join('\n')}</div></div></section>\n\n  <footer class="footer">`
  );
}
fs.writeFileSync(indexPath, indexHtml);
console.log('Updated blog/index.html');

// QA
const issues = [];
for (const g of published) {
  const rel = `blog/${g.slug}.html`;
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const meta = (html.match(/name="description" content="([^"]*)"/) || [])[1] || '';
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  if (!html.includes('FAQPage')) issues.push(`${rel}: missing FAQ schema`);
  if (!html.includes('Article')) issues.push(`${rel}: missing Article schema`);
  if (title.length > 65) issues.push(`${rel}: title ${title.length}`);
  if (meta.length > 165) issues.push(`${rel}: meta ${meta.length}`);
  if (text.length < 2500) issues.push(`${rel}: thin (~${text.length} chars)`);
  else console.log(`OK ${g.slug} ~${text.length} chars | title ${title.length} | meta ${meta.length}`);
}

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const g of published) {
  if (!sitemap.includes(`/blog/${g.slug}.html`)) issues.push(`sitemap missing ${g.slug}`);
}

console.log('\nPublished', published.length, 'guides');
if (issues.length) {
  console.log('ISSUES:');
  issues.forEach((i) => console.log(' -', i));
  process.exitCode = 1;
} else {
  console.log('QA: no issues');
}
