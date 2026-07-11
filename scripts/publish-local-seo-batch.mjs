/**
 * Publish 50 hyper-local SEO pages + hub + SEO grade report.
 * node scripts/publish-local-seo-batch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCAL_SEO_SPECS, LOCAL_SEO_COUNT } from './local-seo-specs.mjs';
import { buildLocalPage } from './local-seo-factory.mjs';
import { publishLocalPage } from './publish-local-seo-page.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_JSON = path.join(ROOT, 'seo-pages', 'local-batch');
fs.mkdirSync(OUT_JSON, { recursive: true });

const pages = LOCAL_SEO_SPECS.map((spec) => buildLocalPage(spec));
console.log(`Building ${pages.length} local pages (target ${LOCAL_SEO_COUNT})...`);

for (const page of pages) {
  fs.writeFileSync(path.join(OUT_JSON, `${page.slug}.json`), JSON.stringify(page, null, 2) + '\n');
  const out = publishLocalPage(page);
  console.log('Published', path.basename(out));
}

// ── areas/index.html hub ──
const hubCards = pages
  .map(
    (p) => `
        <a href="${p.slug}.html" class="related-card" style="text-align:left;padding:20px">
          <h4 style="margin:0 0 6px">${p.place_name}${p.parent_city ? `, ${p.parent_city}` : ''}</h4>
          <p style="margin:0;font-size:.85rem;color:var(--text-light)">${p.primary_keyword}</p>
        </a>`
  )
  .join('\n');

const hubHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Local HVAC Service Areas — Neighborhoods & Towns | Frost Fire</title>
  <meta name="description" content="Hyper-local HVAC guides for Clayton neighborhoods, Johnston County towns, and east Wake communities — Barber Mill, Flowers Plantation, Youngsville, Princeton, and more.">
  <link rel="canonical" href="https://frostfirehvacr.com/areas/">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
  <header class="header"><div class="container">
    <a href="../index.html" class="logo"><span class="logo-icon">🔥❄️</span><span class="logo-text"><span class="frost">FROST</span> <span class="fire">FIRE</span></span></a>
    <nav class="nav">
      <a href="../index.html">Home</a><a href="../services.html">Services</a><a href="../service-areas.html">Service Areas</a>
      <a href="../contact.html">Contact</a><a href="tel:9192304439" class="nav-phone">📞 (919) 230-4439</a>
    </nav>
  </div></header>
  <section class="page-hero"><div class="container">
    <div class="breadcrumb"><a href="../index.html">Home</a> / Local Area Guides</div>
    <h1>Neighborhood &amp; Town HVAC Guides</h1>
    <p>Low-competition local pages for Clayton neighborhoods, Johnston County towns, and east Wake — not generic Raleigh keywords.</p>
  </div></section>
  <section class="content-section"><div class="container">
    <p>Frost Fire is headquartered in <a href="../service-areas/clayton-nc.html">Clayton, NC</a>. These guides target the streets and communities we actually drive every day — <strong>Barber Mill</strong>, <strong>Flowers Plantation</strong>, <strong>Wendell Falls</strong>, <strong>Youngsville</strong>, <strong>Princeton</strong>, and dozens more.</p>
    <div class="related-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-top:32px">
${hubCards}
    </div>
  </div></section>
  <footer class="footer"><div class="container"><p>&copy; 2026 Frost Fire · <a href="tel:9192304439">(919) 230-4439</a></p></div></footer>
  <script src="../js/main.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join(ROOT, 'areas', 'index.html'), hubHtml);

// sitemap hub
let xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const hubLoc = 'https://frostfirehvacr.com/areas/';
if (!xml.includes(hubLoc)) {
  xml = xml.replace('</urlset>', `  <url><loc>${hubLoc}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><priority>0.8</priority></url>\n</urlset>`);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
}

// Wire Clayton city page — neighborhood links
const claytonPath = path.join(ROOT, 'service-areas', 'clayton-nc.html');
let clayton = fs.readFileSync(claytonPath, 'utf8');
if (!clayton.includes('../areas/barber-mill-clayton-nc.html')) {
  const nhBlock = `
      <div class="info-box">
        <h3><i class="fas fa-map" style="color:var(--accent);margin-right:8px"></i> Clayton Neighborhood Guides</h3>
        <p>Looking for HVAC help in a specific Clayton community — not generic Triangle results? See our local guides:</p>
        <p style="line-height:2">
          <a href="../areas/barber-mill-clayton-nc.html">Barber Mill</a> ·
          <a href="../areas/flowers-plantation-clayton-nc.html">Flowers Plantation</a> ·
          <a href="../areas/riverwood-clayton-nc.html">Riverwood</a> ·
          <a href="../areas/shotwell-clayton-nc.html">Shotwell</a> ·
          <a href="../areas/wendell-falls-nc.html">Wendell Falls</a> ·
          <a href="../areas/index.html"><strong>All ${pages.length} local guides →</strong></a>
        </p>
      </div>`;
  clayton = clayton.replace('<div class="why-box">', `${nhBlock}\n\n      <div class="why-box">`);
  fs.writeFileSync(claytonPath, clayton);
  console.log('Wired Clayton neighborhood links');
}

// ── SEO Grade ──
const grades = [];
const keywords = new Set();
let totalWords = 0;

for (const page of pages) {
  const html = fs.readFileSync(path.join(ROOT, 'areas', `${page.slug}.html`), 'utf8');
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text.split(' ').filter(Boolean).length;
  totalWords += words;

  const issues = [];
  const wins = [];
  let score = 100;

  if (words < 1500) {
    issues.push(`Thin content: ${words} words (target 1500+)`);
    score -= 25;
  } else wins.push(`${words} words`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
  const meta = html.match(/name="description" content="([^"]*)"/)?.[1] || '';
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '').replace(/<[^>]+>/g, '');

  if (!html.includes('FAQPage')) {
    issues.push('Missing FAQ schema');
    score -= 8;
  } else wins.push('FAQ schema');

  if (!html.includes('"@type": "Service"')) {
    issues.push('Missing Service schema');
    score -= 8;
  } else wins.push('Service schema');

  const internalLinks = (html.match(/href="\.\.\//g) || []).length;
  if (internalLinks < 8) {
    issues.push(`Low internal links: ${internalLinks}`);
    score -= 10;
  } else wins.push(`${internalLinks} internal links`);

  if (/ac repair raleigh|hvac raleigh nc/i.test(title + meta + h1) && !page.slug.includes('raleigh')) {
    issues.push('Competitive Raleigh head term — wrong strategy');
    score -= 20;
  } else wins.push('No Raleigh head-term spam');

  if (keywords.has(page.primary_keyword)) {
    issues.push('Duplicate primary keyword');
    score -= 15;
  }
  keywords.add(page.primary_keyword);

  if (!h1.toLowerCase().includes(page.place_name.toLowerCase().split(' ')[0])) {
    issues.push('H1 missing place name');
    score -= 5;
  }

  if (meta.length > 160) {
    issues.push(`Meta too long: ${meta.length}`);
    score -= 3;
  }

  const letter = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  grades.push({ slug: page.slug, place: page.place_name, words, score, letter, issues, wins, keyword: page.primary_keyword });
}

grades.sort((a, b) => b.score - a.score);
const avgScore = Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length);
const avgWords = Math.round(totalWords / grades.length);
const failing = grades.filter((g) => g.words < 1500 || g.score < 70);

const report = {
  generated_at: new Date().toISOString(),
  pages_published: pages.length,
  avg_seo_score: avgScore,
  avg_word_count: avgWords,
  strategy: 'Hyper-local neighborhoods & small towns — avoid Raleigh head terms',
  lead_goal: '100 leads/month via long-tail local intent',
  grade_distribution: {
    A: grades.filter((g) => g.letter === 'A').length,
    B: grades.filter((g) => g.letter === 'B').length,
    C: grades.filter((g) => g.letter === 'C').length,
    D: grades.filter((g) => g.letter === 'D').length,
    F: grades.filter((g) => g.letter === 'F').length,
  },
  failing_pages: failing.map((g) => ({ slug: g.slug, words: g.words, score: g.score, issues: g.issues })),
  top_10: grades.slice(0, 10),
  bottom_5: grades.slice(-5),
  recommendations: [
    'Phase down Raleigh-titled service pages (/services/*-raleigh-nc.html) — add canonical links to Clayton/local equivalents',
    'Build Google Business posts targeting Barber Mill, Flowers Plantation, Wendell Falls keywords',
    'Submit updated sitemap in GSC; monitor impressions for "hvac [neighborhood] clayton" within 30 days',
    'Add call tracking UTM ?src=areas-[slug] on CTAs for lead attribution',
    'Next wave: Princeton/Selma commercial restaurant pages + Garner White Oak heat pump cluster',
  ],
  all_grades: grades,
};

fs.writeFileSync(path.join(ROOT, 'seo-pages', 'local-seo-grade-report.json'), JSON.stringify(report, null, 2));

console.log('\n========== SEO GRADE REPORT ==========');
console.log(`Pages: ${pages.length} | Avg score: ${avgScore}/100 | Avg words: ${avgWords}`);
console.log(`Distribution: A=${report.grade_distribution.A} B=${report.grade_distribution.B} C=${report.grade_distribution.C} D=${report.grade_distribution.D} F=${report.grade_distribution.F}`);
if (failing.length) {
  console.log(`\nNeeds work (${failing.length}):`);
  failing.forEach((g) => console.log(` - ${g.slug}: ${g.words} words, score ${g.score}`, g.issues.join('; ')));
} else {
  console.log('\nAll pages pass 1500-word and score thresholds.');
}
console.log(`\nReport: seo-pages/local-seo-grade-report.json`);
