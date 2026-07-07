# Frost Fire Blog Publishing

The site is static HTML, so new blog posts should be generated into the same structure and CSS classes the existing site already uses.

## Publish From A Marketing Command Center Package

1. Export a website blog package from the Marketing Command Center.
2. Save the JSON package anywhere local.
3. From this website directory, run:

```bash
node scripts/publish-blog-post.mjs /path/to/blog-package.json
```

The script will:

- Create `blog/<slug>.html` with the existing Frost Fire header, footer, hero, article, CTA, schema, Open Graph, and Twitter metadata.
- Add the card to the top of `blog/index.html`.
- Add/update the URL in `sitemap.xml`.

## Expected JSON Shape

```json
{
  "blog_post": {
    "title": "What Homeowners Can Learn From This Heat Pump Repair",
    "slug": "what-homeowners-can-learn-heat-pump-repair",
    "category": "Repair",
    "emoji": "🚨",
    "excerpt": "A real job story showing how a small symptom can point to a bigger HVAC issue.",
    "meta_description": "Learn what homeowners can watch for after a real Frost Fire heat pump repair in the Triangle area.",
    "hero_image": "https://images.unsplash.com/photo-1642749776312-aa42ce20c9f5?w=1200&q=80",
    "hero_alt": "HVAC technician servicing equipment",
    "body_html": "<p>Article intro...</p><h2>What We Found</h2><p>...</p>"
  }
}
```

If `body_html` is missing, the script can also build basic article content from `sections`.
