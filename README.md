# suitangi.github.io

Personal site of **Ignatius Liu** — a minimal, monochrome homepage with a
film-grain / glass aesthetic, and sections for projects, photography, and
socials. Plain static HTML/CSS/JS, no build step, served by GitHub Pages at
**[www.suitangi.me](https://www.suitangi.me)**.

## Structure

```
index.html              editorial homepage (enormous type, live clock,
                        cursor spotlight, numbered section links)
projects/index.html     → /projects/
photography/index.html  → /photography/   (masonry + lightbox)
socials/index.html      → /socials/
404.html                not-found page

assets/css/site.css     design system (tokens, glass, grain, components)
assets/js/site.js       scroll reveal, mobile nav, lightbox, clock, spotlight
assets/img/             IL monogram logo + favicons + webmanifest
img/                    original photos
img/photos/             optimized thumbnails (800px) + full/ (2000px) for lightbox

.nojekyll               tells GitHub Pages to serve files as-is (no Jekyll)
optimize-photos.mjs     dev-only script that regenerates img/photos/
```

The head/nav/footer/background are inlined into each page (no templating),
so there's no build step and nothing to install.

## Run locally

Any static file server works — Python is easiest:

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Editing content

- **Projects** — edit `projects/index.html` (each card is an `<article class="glass project-card">`).
- **Photos** — drop originals into `img/`, run the optimizer below, then add a
  `<figure>` block in `photography/index.html`.
- **Socials** — edit the `<a class="glass social-card">` blocks in `socials/index.html`.
- **Homepage copy** — the name, lede, and section links live in `index.html`.
- **Colors / type / motion** — tokens are at the top of `assets/css/site.css`.

## Optimizing photos

Photos are large straight off a camera, so optimized web copies live in
`img/photos/`. Regenerate them after adding or changing originals:

```bash
npm install sharp          # one-time, dev only (not committed)
node optimize-photos.mjs   # writes img/photos/ + img/photos/full/
```

Originals are left untouched. `node_modules` is gitignored.
