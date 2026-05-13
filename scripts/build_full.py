#!/usr/bin/env python3
"""
Hoku Tech single-file build.

Reads `index.html` at the repo root and produces `dist/hoku-tech.html`,
a fully self-contained single HTML file with:

  * `<link rel="stylesheet" href="assets/css/style.css">` replaced by an
    inline `<style>` block.
  * Every `<script src="...">` referencing a local path replaced by an
    inline `<script>` block with the file's contents.
  * No other transformation, minification, or reformatting. The output
    must be byte-for-byte reproducible from the source.

Usage:
    python3 scripts/build_full.py
    python3 scripts/build_full.py --out dist/hoku-tech.html
    python3 scripts/build_full.py --root . --out /some/other/path.html

Exits non-zero on missing referenced files. No external dependencies.
"""

from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path


LINK_CSS_RE = re.compile(
    r'<link\s+[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*/?>',
    re.IGNORECASE,
)
SCRIPT_SRC_RE = re.compile(
    r'<script\s+[^>]*src=["\']([^"\']+)["\'][^>]*></script>',
    re.IGNORECASE,
)


def is_local(href: str) -> bool:
    return not (
        href.startswith("http://")
        or href.startswith("https://")
        or href.startswith("//")
        or href.startswith("data:")
    )


def inline_css(match: re.Match, root: Path) -> str:
    href = match.group(1)
    if not is_local(href):
        return match.group(0)
    path = (root / href).resolve()
    if not path.is_file():
        raise FileNotFoundError(f"CSS not found: {path}")
    body = path.read_text(encoding="utf-8")
    return f"<style data-src=\"{html.escape(href)}\">\n{body}\n</style>"


def inline_script(match: re.Match, root: Path) -> str:
    src = match.group(1)
    if not is_local(src):
        return match.group(0)
    path = (root / src).resolve()
    if not path.is_file():
        raise FileNotFoundError(f"Script not found: {path}")
    body = path.read_text(encoding="utf-8")
    # Defensive: a literal "</script>" inside JS would close the inlined
    # block. Replace it with the equivalent escaped form.
    body = body.replace("</script>", "<\\/script>")
    return f"<script data-src=\"{html.escape(src)}\">\n{body}\n</script>"


def build(root: Path, out: Path) -> tuple[int, int]:
    index = root / "index.html"
    if not index.is_file():
        raise FileNotFoundError(f"index.html not found at {index}")

    src = index.read_text(encoding="utf-8")

    css_count = [0]
    script_count = [0]

    def _css(m: re.Match) -> str:
        css_count[0] += 1
        return inline_css(m, root)

    def _script(m: re.Match) -> str:
        script_count[0] += 1
        return inline_script(m, root)

    out_html = LINK_CSS_RE.sub(_css, src)
    out_html = SCRIPT_SRC_RE.sub(_script, out_html)

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(out_html, encoding="utf-8")
    return css_count[0], script_count[0]


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=".", help="Repo root (default: .)")
    parser.add_argument(
        "--out",
        default="dist/hoku-tech.html",
        help="Output path (default: dist/hoku-tech.html)",
    )
    args = parser.parse_args(argv)

    root = Path(args.root).resolve()
    out = (root / args.out).resolve() if not Path(args.out).is_absolute() else Path(args.out)

    try:
        css_n, js_n = build(root, out)
    except FileNotFoundError as exc:
        print(f"[build_full] ERROR: {exc}", file=sys.stderr)
        return 1

    size_kb = out.stat().st_size / 1024
    print(
        f"[build_full] wrote {out} "
        f"({size_kb:,.1f} KB, inlined {css_n} CSS / {js_n} JS)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
