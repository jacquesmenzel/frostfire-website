/**
 * Generate + publish SEO batch (niche services + new city pages),
 * wire hubs, then run a QA pass.
 *
 * Usage: node scripts/seo-batch-publish.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { NEW_CITIES, NEW_SERVICES, ALL_CITIES_FOR_LINKS, EXISTING_CITIES } from './seo-batch-data.mjs';
import { publishCity } from './publish-city-page.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SEO_DIR = path.join(ROOT, 'seo-pages');
const CITY_DIR = path.join(SEO_DIR, 'cities');

fs.mkdirSync(CITY_DIR, { recursive: true });

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

// Persist city link index for publish-city-page CLI
writeJson(path.join(SEO_DIR, 'all-cities.json'), ALL_CITIES_FOR_LINKS);

console.log(`Publishing ${NEW_SERVICES.length} service pages...`);
for (const page of NEW_SERVICES) {
  const jsonPath = path.join(SEO_DIR, `${page.slug}.json`);
  writeJson(jsonPath, page);
  const result = spawnSync(process.execPath, [path.join(__dirname, 'publish-service-page.mjs'), jsonPath], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
  console.log(result.stdout.trim());
}

console.log(`Publishing ${NEW_CITIES.length} city pages...`);
for (const city of NEW_CITIES) {
  const jsonPath = path.join(CITY_DIR, `${city.slug}.json`);
  writeJson(jsonPath, city);
  const out = publishCity(city, ALL_CITIES_FOR_LINKS);
  console.log(`Wrote ${out}`);
}

// --- Hub wiring ---
function upsertIndexAreaTags() {
  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const marker = 'Fuquay-Varina, NC</a>';
  if (!html.includes('knightdale-nc.html')) {
    const extra = NEW_CITIES.map(
      (c) =>
        `\n            <a href="service-areas/${c.slug}.html" class="area-tag" style="text-decoration:none"><i class="fas fa-map-pin"></i> ${c.city}, NC</a>`
    ).join('');
    html = html.replace(marker, `${marker}${extra}`);
  }
  // Footer city list
  if (!html.includes('service-areas/knightdale-nc.html">Knightdale')) {
    const footerMarker = '<li><a href="service-areas/smithfield-nc.html">Smithfield, NC</a></li>';
    const footerExtra = NEW_CITIES.map(
      (c) => `\n            <li><a href="service-areas/${c.slug}.html">${c.city}, NC</a></li>`
    ).join('');
    if (html.includes(footerMarker)) {
      html = html.replace(footerMarker, `${footerMarker}${footerExtra}`);
    }
  }
  fs.writeFileSync(indexPath, html);
  console.log('Updated index.html area tags/footer');
}

function upsertServiceAreasHub() {
  const hubPath = path.join(ROOT, 'service-areas.html');
  let html = fs.readFileSync(hubPath, 'utf8');

  // Expand ItemList schema
  const schemaBlock = ALL_CITIES_FOR_LINKS.map(
    (c, i) =>
      `      {"@type": "ListItem", "position": ${i + 1}, "url": "https://frostfirehvacr.com/service-areas/${c.slug}.html", "name": "${c.city}, NC"}`
  ).join(',\n');
  html = html.replace(
    /"itemListElement": \[[\s\S]*?\]/,
    `"itemListElement": [\n${schemaBlock}\n    ]`
  );

  // Append city sections before footer if missing
  if (!html.includes('id="knightdale"')) {
    const sections = NEW_CITIES.map(
      (c) => `
      <div class="area-card animate" id="${c.slug.replace('-nc', '')}" style="margin-bottom:48px">
        <h2><a href="service-areas/${c.slug}.html" style="color:inherit;text-decoration:none;">HVAC Services in ${c.city}, NC</a></h2>
        <p>${c.meta_description.replace(/\s*Call \(919\) 230-4439\.?/, '')}</p>
        <p>📞 <a href="tel:9192304439"><strong>(919) 230-4439</strong></a> — Same price on Sundays. <a href="service-areas/${c.slug}.html"><strong>Learn more about our ${c.city} services →</strong></a></p>
      </div>`
    ).join('\n');
    html = html.replace('</section>\n\n  <footer', `${sections}\n    </div>\n  </section>\n\n  <footer`);
    // If that replace failed, try a simpler anchor
    if (!html.includes('id="knightdale"')) {
      html = html.replace(
        '<footer class="footer">',
        `<section class="content-section"><div class="container">${sections}</div></section>\n\n  <footer class="footer">`
      );
    }
  }
  fs.writeFileSync(hubPath, html);
  console.log('Updated service-areas.html hub');
}

function patchExistingCityCrossLinks() {
  const areaDir = path.join(ROOT, 'service-areas');
  const all = ALL_CITIES_FOR_LINKS;
  for (const existing of EXISTING_CITIES) {
    const file = path.join(areaDir, `${existing.slug}.html`);
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const others = all.filter((c) => c.slug !== existing.slug);
    const pills = others
      .map((c) => `<li><a href="${c.slug}.html">${c.city}, NC</a></li>`)
      .join('\n              ');
    const nearby = others
      .map(
        (c) =>
          `<a href="${c.slug}.html" style="color:var(--ice-light);text-decoration:none">${c.city}, NC</a>`
      )
      .join(' • ');

    html = html.replace(
      /<section class="other-areas">[\s\S]*?<\/section>/,
      `<section class="other-areas">
    <div class="container text-center">
      <h2>Other <span class="gradient-text">Service Areas</span></h2>
      <ul>
              ${pills}
      </ul>
    </div>
  </section>`
    );

    html = html.replace(
      /<section class="nearby-cities"[\s\S]*?<\/section>/,
      `<section class="nearby-cities" style="background:var(--primary);padding:48px 0;text-align:center">
    <div class="container">
      <h3 style="color:var(--white);margin-bottom:16px">Also Serving Nearby Areas</h3>
      <p style="color:rgba(255,255,255,.7);line-height:2">${nearby}</p>
    </div>
  </section>`
    );

    // Add niche related cards if missing
    if (!html.includes('open-sundays-no-extra-charge-hvac.html')) {
      html = html.replace(
        /(<a href="\.\.\/services\/ductwork\.html" class="related-card">[\s\S]*?<\/a>)/,
        `$1
        <a href="../services/open-sundays-no-extra-charge-hvac.html" class="related-card">
          <i class="fas fa-calendar-check"></i>
          <h4>Open Sundays — No Surcharge</h4>
        </a>
        <a href="../services/walk-in-cooler-repair-raleigh-nc.html" class="related-card">
          <i class="fas fa-snowflake"></i>
          <h4>Walk-In Cooler Repair</h4>
        </a>
        <a href="../services/emergency-ac-repair-clayton-nc.html" class="related-card">
          <i class="fas fa-bolt"></i>
          <h4>Emergency AC Repair</h4>
        </a>`
      );
    }

    fs.writeFileSync(file, html);
  }
  console.log('Patched existing city cross-links');
}

function wireServicesHub() {
  const servicesPath = path.join(ROOT, 'services.html');
  let html = fs.readFileSync(servicesPath, 'utf8');
  const newLinks = [
    ['walk-in-freezer-repair-raleigh-nc.html', 'Walk-In Freezer Repair'],
    ['emergency-ac-repair-clayton-nc.html', 'Emergency AC Clayton'],
    ['after-hours-hvac-repair.html', 'After-Hours HVAC'],
    ['restaurant-cooler-repair-raleigh-nc.html', 'Restaurant Cooler Repair'],
    ['commercial-refrigeration-repair-raleigh-nc.html', 'Commercial Refrigeration'],
    ['sunday-ac-repair-raleigh-nc.html', 'Sunday AC Repair'],
    ['same-day-ac-repair-clayton-nc.html', 'Same-Day AC Clayton'],
    ['commercial-hvac-repair-raleigh-nc.html', 'Commercial HVAC Repair'],
    ['heat-pump-repair-clayton-nc.html', 'Heat Pump Repair Clayton'],
    ['mini-split-installation-cary-nc.html', 'Mini-Split Install Cary'],
  ];
  // Extend ItemList if present
  if (html.includes('ItemList') && !html.includes('walk-in-freezer-repair-raleigh-nc.html')) {
    let pos = 12;
    const extras = newLinks
      .map(([url, name]) => {
        pos += 1;
        return `      {"@type": "ListItem", "position": ${pos}, "url": "https://frostfirehvacr.com/services/${url}", "name": "${name}"}`;
      })
      .join(',\n');
    html = html.replace(
      /(\{"@type": "ListItem", "position": 11,[\s\S]*?\}\n)(\s*\])/,
      `$1,\n${extras}\n$2`
    );
  }
  fs.writeFileSync(servicesPath, html);
  console.log('Updated services.html schema links');
}

upsertIndexAreaTags();
upsertServiceAreasHub();
patchExistingCityCrossLinks();
wireServicesHub();

// --- QA ---
const issues = [];
function checkFile(rel, opts = {}) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    issues.push(`MISSING: ${rel}`);
    return;
  }
  const html = fs.readFileSync(full, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
  const meta = html.match(/name="description" content="([^"]*)"/)?.[1] || '';
  const canonical = html.match(/rel="canonical" href="([^"]*)"/)?.[1] || '';
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '') || '';
  if (!title) issues.push(`${rel}: missing title`);
  if (title.length > 65) issues.push(`${rel}: title too long (${title.length}): ${title}`);
  if (title.length < 30) issues.push(`${rel}: title short (${title.length})`);
  if (!meta) issues.push(`${rel}: missing meta description`);
  if (meta.length > 160) issues.push(`${rel}: meta too long (${meta.length})`);
  if (meta.length < 70) issues.push(`${rel}: meta short (${meta.length})`);
  if (!canonical) issues.push(`${rel}: missing canonical`);
  if (!h1) issues.push(`${rel}: missing H1`);
  if (!html.includes('application/ld+json')) issues.push(`${rel}: missing JSON-LD`);
  if (!html.includes('tel:9192304439')) issues.push(`${rel}: missing click-to-call`);
  if (opts.requireFaq && !html.includes('FAQPage')) issues.push(`${rel}: missing FAQPage schema`);
  // Thin content check
  const textLen = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').length;
  if (textLen < 1200) issues.push(`${rel}: thin content (~${textLen} chars)`);
}

for (const s of NEW_SERVICES) {
  checkFile(`services/${s.slug}.html`, { requireFaq: true });
}
for (const c of NEW_CITIES) {
  checkFile(`service-areas/${c.slug}.html`, { requireFaq: true });
}

// Sitemap presence
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const s of NEW_SERVICES) {
  if (!sitemap.includes(`/services/${s.slug}.html`)) issues.push(`sitemap missing services/${s.slug}.html`);
}
for (const c of NEW_CITIES) {
  if (!sitemap.includes(`/service-areas/${c.slug}.html`)) issues.push(`sitemap missing service-areas/${c.slug}.html`);
}

console.log('\n=== QA REPORT ===');
console.log(`Published: ${NEW_SERVICES.length} services + ${NEW_CITIES.length} cities = ${NEW_SERVICES.length + NEW_CITIES.length} pages`);
if (issues.length) {
  console.log(`Issues (${issues.length}):`);
  for (const i of issues) console.log(' -', i);
} else {
  console.log('No issues found.');
}

writeJson(path.join(SEO_DIR, 'last-batch-qa.json'), {
  published_at: new Date().toISOString(),
  services: NEW_SERVICES.map((s) => s.slug),
  cities: NEW_CITIES.map((c) => c.slug),
  issues,
});
