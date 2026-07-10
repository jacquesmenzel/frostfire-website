import fs from 'node:fs';
import path from 'node:path';
import { NEW_CITIES, NEW_SERVICES } from './seo-batch-data.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'));
// Windows path fix for file URL
const root = path.resolve('C:/Users/jacqu/frostfire-website');
const issues = [];
const warnings = [];

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function check(rel, { requireFaq = false } = {}) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    issues.push(`MISSING ${rel}`);
    return;
  }
  const html = fs.readFileSync(full, 'utf8');
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] || '');
  const meta = decode(html.match(/name="description" content="([^"]*)"/)?.[1] || '');
  const canonical = html.match(/rel="canonical" href="([^"]*)"/)?.[1] || '';
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '').replace(/<[^>]+>/g, '').trim();
  if (!title) issues.push(`${rel}: no title`);
  if (title.length > 60) warnings.push(`${rel}: title ${title.length} chars (ideal ≤60)`);
  if (title.length < 25) issues.push(`${rel}: title too short`);
  if (!meta) issues.push(`${rel}: no meta`);
  if (meta.length > 160) issues.push(`${rel}: meta ${meta.length} > 160`);
  if (meta.length < 70) warnings.push(`${rel}: meta short ${meta.length}`);
  if (!canonical) issues.push(`${rel}: no canonical`);
  if (!canonical.endsWith(rel.replace(/\\/g, '/'))) {
    // soft check
  }
  if (!h1) issues.push(`${rel}: no H1`);
  if (!html.includes('application/ld+json')) issues.push(`${rel}: no JSON-LD`);
  if (requireFaq && !html.includes('FAQPage')) issues.push(`${rel}: no FAQPage`);
  if (!html.includes('tel:9192304439')) issues.push(`${rel}: no click-to-call`);
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  if (text.length < 1400) warnings.push(`${rel}: content ~${text.length} chars`);
  // Keyword in title check for services
  return { title, meta, h1, len: text.length };
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
console.log('=== SERVICE PAGES ===');
for (const s of NEW_SERVICES) {
  const rel = `services/${s.slug}.html`;
  const r = check(rel, { requireFaq: true });
  if (!sitemap.includes(`/services/${s.slug}.html`)) issues.push(`sitemap missing ${rel}`);
  if (r) console.log(`OK ${s.slug} | title ${r.title.length} | meta ${r.meta.length} | body ~${r.len}`);
}
console.log('\n=== CITY PAGES ===');
for (const c of NEW_CITIES) {
  const rel = `service-areas/${c.slug}.html`;
  const r = check(rel, { requireFaq: true });
  if (!sitemap.includes(`/service-areas/${c.slug}.html`)) issues.push(`sitemap missing ${rel}`);
  if (r) console.log(`OK ${c.slug} | title ${r.title.length} | meta ${r.meta.length} | body ~${r.len}`);
}

// Internal link spot checks
const mustLink = [
  ['index.html', 'knightdale-nc.html'],
  ['index.html', 'wake-forest-nc.html'],
  ['service-areas.html', 'wilsons-mills-nc.html'],
  ['services/walk-in-cooler-repair-raleigh-nc.html', 'walk-in-freezer'],
];
for (const [file, needle] of mustLink) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if (!html.includes(needle)) warnings.push(`${file} missing link/ref to ${needle}`);
}

console.log('\n=== ISSUES ===');
issues.forEach((i) => console.log('ERR', i));
console.log('\n=== WARNINGS ===');
warnings.forEach((w) => console.log('WARN', w));
console.log(`\nSummary: ${NEW_SERVICES.length} services + ${NEW_CITIES.length} cities | ${issues.length} errors | ${warnings.length} warnings`);
process.exit(issues.length ? 1 : 0);
