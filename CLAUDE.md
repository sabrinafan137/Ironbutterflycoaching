# CLAUDE.md — Iron Butterfly Coaching

## Repository Overview

This is a **static HTML landing page** for Iron Butterfly Coaching, a wellness business offering PEMF and terahertz therapy sessions (THz Tera-P90+ device) in Costa Mesa, CA. The site is a single self-contained file with no build tools, frameworks, or dependencies.

## File Structure

```
Ironbutterflycoaching/
├── CLAUDE.md          # This file
└── index.html.txt     # The entire website (HTML + CSS + JS)
```

> Note: The site file is `index.html.txt`. When deploying, rename or copy it to `index.html`.

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — inline styles inside a `<style>` block (no external stylesheet)
- **Vanilla JavaScript** — minimal inline script inside a `<script>` block
- **No dependencies** — no npm, no bundler, no framework, no CDN imports

## Page Sections

The page is organized into anchor-linked sections:

| Section ID       | Content |
|------------------|---------|
| `#top`           | Hero / above-the-fold |
| `#how`           | How it works |
| `#benefits`      | Benefits grid (6 cards) |
| `#family`        | Family-focused messaging |
| `#testimonials`  | Testimonials (3 cards) |
| `#roi`           | ROI / value proposition |
| `#book`          | Booking (embedded cal.com iframe) |
| `#faq`           | FAQ |

## CSS Conventions

- **CSS custom properties** are defined at `:root` for the color scheme.
- **Class naming** uses camelCase (e.g., `.navInner`, `.btnP`, `.tcard`).
- **Layout** uses `.wrap` (max-width container) and `.grid` utility classes.
- **Responsive breakpoints**: `max-width: 900px` and `max-width: 680px`.
- **Design style**: dark theme, glassmorphism, backdrop-blur, radial gradients.

Key color variables:
```css
--teal: #79F2C0;
--blue: #6BA7FF;
```

## JavaScript Conventions

The JS block is minimal and handles:
1. **Scroll progress bar** — updates a `<div id="prog">` width on scroll.
2. **Reveal animations** — `IntersectionObserver` adds `.visible` class to `.reveal` elements.
3. **Smooth scrolling** — handled via `scroll-behavior: smooth` in CSS.

No external libraries, no modules, no transpilation.

## External Integrations

- **Booking calendar**: Embedded via `<iframe>` pointing to `https://cal.com/sabrinafan`. To change the booking link, update the `src` attribute of that iframe.

## Development Workflow

Since there is no build process, editing is direct:

1. Open `index.html.txt` in any text editor.
2. Make changes to HTML, the `<style>` block, or the `<script>` block.
3. Preview by opening the file in a browser (or rename to `.html` first).
4. Commit and push changes.

```bash
# Preview locally (rename to .html for browser to parse correctly)
cp index.html.txt index.html
open index.html   # macOS
# or: xdg-open index.html  # Linux
```

## Deployment

No build step required. To deploy:

- Copy or rename `index.html.txt` to `index.html`.
- Serve from any static file host (Netlify, GitHub Pages, Vercel, Apache, Nginx, etc.).
- No environment variables, no server-side processing needed.

## Git Conventions

- **Main branch**: `main`
- **Feature/AI branches**: `claude/<description>-<id>` (e.g., `claude/add-claude-documentation-wJAvV`)
- Single historical commit; keep commit messages descriptive.

## Key Constraints for AI Assistants

- **Do not introduce dependencies** — this site intentionally has zero external dependencies. Do not add npm, CDN scripts, or frameworks unless explicitly requested.
- **Do not split the file** — all HTML, CSS, and JS live in one file by design. Do not refactor into separate files unless explicitly requested.
- **Preserve the design system** — use existing CSS variables and class naming conventions when adding new elements.
- **No build tools** — do not add webpack, vite, rollup, or any bundler configuration.
- **No backend** — this is a purely static site; do not add server-side logic.
- **File extension note** — the working file is `index.html.txt`; treat it as HTML.
