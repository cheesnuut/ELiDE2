# ELıDE — redesigned lash studio site

A redesigned and improved build of the website from [`cheesnuut/Testing` PR #1](https://github.com/cheesnuut/Testing/pull/1), created as part of a full site review. The original **ELıDE logo, mark, and favicon are preserved exactly as the owner made them** — the redesign works around them.

## What's inside

```
index.html                  the redesigned single-page site
assets/css/styles.css       warm editorial design system built around the logo
assets/js/main.js           hero entrance, reveals, mobile nav, compare slider, honest booking form
assets/img/                 original logo SVGs + responsive generated photography (JPEG + WebP)
assets/fonts/               self-hosted Gloock · Karla · Space Mono (woff2)
tools/optimize_images.py    regenerates the responsive image derivatives
review/REVIEW.md            the full review: findings, fixes, scores, evidence
review/                     Lighthouse report + before/after screenshots
```

## Run it

```sh
npx http-server -p 8000
```

No build step, no dependencies, no external requests.

## What changed vs. the original PR

- **Real imagery** replaces the 16 empty proof placeholders, including an **interactive before/after slider** (drag or keyboard).
- **The booking form is honest** — it validates and composes a real email instead of faking "Sent." Set `BOOKING_EMAIL` in `assets/js/main.js` to the studio's real address.
- **Mobile navigation works** — hamburger menu with proper ARIA state, Escape-to-close, and focus handling.
- **Accessibility** — illegal `role="img"` on `<video>` removed, redundant list roles cleaned up, visible skip link; Lighthouse accessibility **100**.
- **Performance** — 2.38 MB autoplaying hero video replaced by a 97 KB responsive still; LCP 3.0 s → **2.1 s**, performance **99**.
- **SEO** — canonical, Open Graph, Twitter card, and `BeautySalon` JSON-LD added.
- **Validation** — `html-validate` passes with **0 errors** (was 16).

The full findings list and evidence are in [`review/REVIEW.md`](review/REVIEW.md).
