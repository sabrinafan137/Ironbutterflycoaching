# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A single-file static HTML landing page for **Iron Butterfly Coaching** — a wellness coaching business in Costa Mesa, CA offering free trial sessions with a THz Tera-P90+ device (PEMF + terahertz + thermal circulation technology).

The only source file is `index.html.txt`. There is no build system, no package manager, no framework, and no dependencies. To preview the page, rename or copy it to `index.html` and open it in a browser — or serve it with any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/index.html.txt  (or rename to .html first)
```

## File structure

Everything lives in `index.html.txt`: all CSS is in a `<style>` block in the `<head>`, all JS is in a `<script>` block at the bottom of `<body>`. The page is fully self-contained with no external stylesheets or scripts (the only external resource is the `cal.com/sabrinafan` iframe in the booking section).

## Page sections (in order)

`#top` → `#how` → `#benefits` → `#family` → `#testimonials` → `#roi` → `#book` → `#faq`

Nav links and CTA buttons target these anchor IDs. The sticky bottom CTA bar and the fixed top nav both link into this section structure.

## CSS architecture

All design tokens are CSS custom properties on `:root`:
- `--bg0/1/2`: dark background gradient stops
- `--accent` (`#79F2C0` teal) and `--accent2` (`#6BA7FF` blue): the two brand colors
- `--text`, `--muted`, `--muted2`: text hierarchy
- `--card`, `--stroke`: glass-card surface and border

Reusable layout classes: `.grid` (1.2fr/0.8fr two-col), `.grid2` (equal two-col), `.grid3` (three-col). All collapse to single-column at `max-width: 900px`.

Reusable component classes: `.card` (glass card), `.btn` (ghost button), `.btnP` (primary gradient button), `.li` + `.tick` (checklist row), `.tcard` (testimonial card), `.pill` (badge/chip), `.reveal` (scroll-animated element).

## JavaScript

Two behaviors only:
1. Scroll progress bar — updates `#progress` element width as percentage of page scroll.
2. `.reveal` scroll-animation — `IntersectionObserver` adds `.in` class when elements enter the viewport (triggers CSS opacity/translateY transition).

## Key content details

- Business: Iron Butterfly Coaching, Costa Mesa CA 92626
- Booking calendar: `https://cal.com/sabrinafan` (embedded as iframe + direct link)
- Testimonials section notes they are template quotes — replace with real client quotes before launch
- Disclaimer text ("Wellness support technology. Not medical advice.") appears in `.fine` elements throughout; preserve this pattern when adding new sections
