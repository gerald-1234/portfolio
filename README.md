<p align="center">
  <picture>
    <img src="assets/banner.svg" alt="Portfolio" width="820">
  </picture>
</p>

<p align="center">
  <strong>The personal website of Mathew Gerald Chukwudera, software engineering student and full-stack developer.</strong>
</p>

<p align="center">
  <a href="https://gerald-mathew.netlify.app/"><img src="https://img.shields.io/badge/live-gerald--mathew.netlify.app-2dd4bf?style=for-the-badge&logo=netlify&logoColor=white" alt="Live site"></a>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>
<p align="center">
  <img src="https://img.shields.io/badge/build-none-2dd4bf?style=for-the-badge" alt="No build step">
  <img src="https://img.shields.io/badge/hosted%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify">
  <img src="https://img.shields.io/badge/License-MIT-2dd4bf?style=for-the-badge" alt="MIT license">
</p>

A hand-built, dependency-light portfolio site. No frameworks and no build step: plain HTML, CSS and JavaScript served straight from the repository root by Netlify.

## Highlights

| Section | What it shows |
| --- | --- |
| Hero | Animated, pointer-reactive particle canvas and a short positioning statement |
| About | Background, focus areas and engineering values |
| Projects | Selected work with links to live demos and source |
| Skills | Languages, frameworks and tooling |
| Contact | Direct links plus a thank-you confirmation page |

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Markup | Hand-written HTML5 | Full control, zero build tooling |
| Styling | Modern CSS (custom properties, grid, flexbox) | No preprocessor needed |
| Behaviour | Vanilla JavaScript | Small, fast, no runtime dependencies |
| Icons | Self-hosted SVG icons | Crisp SVG icons, no CDN dependency |
| Hosting | Netlify | Static hosting, security headers and redirects as code |

## Project structure

```text
.
├── index.html              # one-page portfolio
├── thanks.html             # form confirmation page
├── 404.html                # custom not-found page
├── netlify.toml            # headers, redirects and cache policy
├── robots.txt              # crawler policy
├── sitemap.xml             # single-page sitemap
├── site.webmanifest        # PWA metadata
└── assets/
  ├── style.css         # design tokens and layout
  ├── script.js         # scroll state, menu, reveal animations, canvas
  ├── icons/            # local UI and technology SVG icons
  └── images/           # MGC monogram, favicons and app icons
```

The favicon set is generated from a single source of truth, `assets/images/mgc-monogram.svg` — a dark rounded square with the teal `MGC` initials. The `MGC` letterforms are stored as vector paths rather than live text, so the monogram needs no web font and renders identically in every browser and at every size. `favicon.ico` and the PNG sizes are rasterised from that same file, and `banner.svg` inlines the same paths.

## Run locally

No tooling required. Serve the folder with any static server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly from disk also works, though the Netlify headers and redirects only apply when the site is served by Netlify.

## Deployment

Netlify is configured as code in `netlify.toml`:

- `publish = "."` publishes the repository root.
- A catch-all rewrite serves `index.html` for unknown routes.
- Security headers include a `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` and a strict referrer policy.
- Long-lived immutable caching for images and icons, one-week caching for CSS and JavaScript.

Pushing to the default branch triggers a deploy.

## Performance notes

The particle canvas caps its device-pixel ratio at 2 and stops animating entirely when the visitor prefers reduced motion, so the page stays light even with the full animation layer enabled.

## License

Released under the [MIT License](LICENSE).

<p align="center"><sub>Built and maintained by <a href="https://github.com/gerald-mathew">Gerald-Mathew</a></sub></p>
