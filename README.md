# dopaminetracker.site

Static marketing site for Dopamine Tracker, published with GitHub Pages
(custom domain `dopaminetracker.site`, HTTPS enforced). No server-side build:
every committed file is served as-is.

## Editing

- Copy, numbers, prices, testimonials, flags: `assets/config.js` (single source of truth).
- Layout: `_src/landing.template.html`; styles: `assets/site.css` (design system),
  `assets/story.css`, `assets/landing.css`; scroll animations: `assets/landing.js`.
- After changing the template or `config.js`, regenerate the two pages:

  ```
  python _src/build.py
  ```

  This writes `index.html` (English, x-default, with a client-side geo/language
  redirect to `/tr/` for Turkish visitors) and `tr/index.html` (Turkish) with
  the copy baked in for SEO. English shows USD prices, Turkish shows TRY; a
  `null` price in `config.js` renders "see the price on Google Play". Commit the generated files together with the source.

- Privacy policy: `privacy/index.html` (EN), `tr/gizlilik/index.html` (TR), hand-written.
- `en/`, `en/privacy/`, `gizlilik/` are redirect stubs for the v1 URLs.
- Screenshots: `assets/img/screens/{home,analytics,block,focus,account}.jpg`, 973×2048.

## Flags

`stats.showImpact` in `config.js` hides the "Impact so far" and "Time is the
real currency" scenes until `usersHelped` and `hoursReclaimed` are real,
measured numbers. Never publish invented metrics.
