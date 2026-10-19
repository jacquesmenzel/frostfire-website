#!/usr/bin/env python3
"""Make every URL on the site the one Cloudflare Pages actually serves.

Pages 308-redirects /foo.html -> /foo and /dir/index.html -> /dir/, so canonicals,
og:url, schema URLs, sitemap <loc>s and internal links that end in .html all point
at redirects. Run after any publish script (idempotent):

    python3 scripts/normalize-urls.py
"""

from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", "node_modules", "scripts"}

ABS = re.compile(r"https?://(?:www\.)?frostfirehvacr\.com(/[^\"'\s<>)]*)?")
HREF = re.compile(r'(href=")([^"]+)(")')


def clean_path(path: str) -> str:
    """'/a/index.html#x' -> '/a/#x', '/a/b.html?q' -> '/a/b?q'."""
    m = re.match(r"^([^?#]*)(.*)$", path)
    base, rest = m.group(1), m.group(2)
    if base.endswith("index.html"):
        base = base[: -len("index.html")] or "./"
    elif base.endswith(".html"):
        base = base[: -len(".html")]
    return base + rest


def fix_abs(m: re.Match) -> str:
    return "https://frostfirehvacr.com" + clean_path(m.group(1) or "/")


def fix_href(m: re.Match) -> str:
    url = m.group(2)
    if re.match(r"^(mailto:|tel:|sms:|#|javascript:|data:)", url) or re.match(r"^https?://", url):
        return m.group(0)  # absolute site URLs are handled by ABS
    if ".html" not in url:
        return m.group(0)
    return m.group(1) + clean_path(url) + m.group(3)


def main() -> None:
    changed = 0
    files = [p for p in ROOT.rglob("*") if p.suffix in (".html", ".xml") and not (set(p.relative_to(ROOT).parts) & SKIP_DIRS)]
    for p in files:
        text = p.read_text(encoding="utf-8")
        new = ABS.sub(fix_abs, text)
        if p.suffix == ".html":
            new = HREF.sub(fix_href, new)
        if new != text:
            p.write_text(new, encoding="utf-8")
            changed += 1
    print(f"normalized {changed} of {len(files)} files")


if __name__ == "__main__":
    main()
