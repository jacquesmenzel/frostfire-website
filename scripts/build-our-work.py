#!/usr/bin/env python3
"""Build /our-work: the gallery of real Frost Fire job photos.

The page shell reuses the guides template (same header, footer, fonts and CSS).
Photos load live from /api/v1/public/website/work-photos via js/work-photos.js, so
approving a photo on the CRM Content page shows it here with no redeploy.

    python3 scripts/build-our-work.py
"""

from __future__ import annotations

import importlib.util
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("build_guides", ROOT / "scripts" / "build-guides.py")
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)  # type: ignore[union-attr]

URL = f"{g.SITE}/our-work"


def build() -> str:
    schema = [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Our Work: Real HVAC Job Photos",
            "description": "Photos from real Frost Fire Heating & Cooling jobs across Raleigh, Durham, the Triangle and Clayton: furnaces, heat pumps, AC, ductwork, mini-splits and commercial refrigeration.",
            "url": URL,
            "publisher": g.ORG,
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{g.SITE}/"},
                {"@type": "ListItem", "position": 2, "name": "Our Work", "item": URL},
            ],
        },
    ]
    body = f"""
  <section class="page-hero">
    <div class="container">
      <div class="breadcrumb"><a href="/">Home</a> <span>/ Our Work</span></div>
      <h1>Our work</h1>
      <p class="subtitle">Real photos from real Frost Fire jobs across Raleigh, Durham, the Triangle and Clayton. No stock photos.</p>
    </div>
  </section>
  <section class="guide-wrap" style="max-width:1200px">
    <p>Furnace and heat pump repairs, AC service, new systems, ductwork, mini-splits and commercial coolers. Every photo here came off one of our jobs. We never show addresses or customers, just the work.</p>
    <div id="ff-work-gallery" aria-live="polite"><p>Loading photos from our jobs…</p></div>
    <noscript><p>Turn on JavaScript to see the photo gallery, or call us at <a href="tel:{g.PHONE_TEL}">{g.PHONE}</a>.</p></noscript>
    {g.cta_box()}
  </section>
"""
    page = g.head(
        "Our Work: Real HVAC Job Photos in Raleigh, Durham & the Triangle",
        "Photos from real Frost Fire Heating & Cooling jobs: furnace and heat pump repair, AC service, new systems, ductwork, mini-splits and commercial refrigeration across Raleigh, Durham, the Triangle and Clayton.",
        URL,
        schema,
    )
    return page + "  " + g.header() + body + g.footer() + "</body>\n</html>\n"


def main() -> None:
    (ROOT / "our-work.html").write_text(build(), encoding="utf-8")
    print("built our-work.html")


if __name__ == "__main__":
    main()
