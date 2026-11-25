# dopaminetracker.site

Static marketing site for Neurofast, published with GitHub Pages
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

- Blog: one file per article in `_src/blog/en/` and `_src/blog/tr/`. The file starts with an HTML comment of
  `key: value` lines (`title`, `h1`, `description`, `excerpt`, `date`, optional `updated`, optional `pair` = the
  translation's file name without `.html`), then the article body as HTML. `python _src/build.py` writes
  `blog/<slug>/`, `tr/blog/<slug>/`, both blog index pages, the three newest cards on each home page and
  `sitemap.xml`. In a body, `{{IOS}}`, `{{PLAY}}`, `{{HOME}}`, `{{PRIVACY}}`, `{{SUPPORT}}` and `{{POST:<slug>}}`
  expand to links. Styles: `assets/blog.css`.
- Store links: `downloadUrl` (Google Play) and `appStoreUrl` (App Store) in `assets/config.js`.
- `sitemap.xml` is generated; hand-written pages are listed in `STATIC_PAGES` in `_src/build.py`.
- CSS and JS URLs carry `?v=<hash>`, set by the build, so run the build after changing any file in `assets/`.
- Privacy policy: `privacy/index.html` (EN), `tr/gizlilik/index.html` (TR), hand-written.
- `en/`, `en/privacy/`, `gizlilik/` are redirect stubs for the v1 URLs.
- App screens: `assets/img/screens/{home,analytics,block,focus,smart}.jpg` (English) and `assets/img/screens/tr/` (Turkish),
  748×1440. They are the phone screens of the Play listing screenshots, rendered on their own.
- Comparison articles (`opal-alternative`, `screenzen-alternative`, `best-social-media-blocker-apps` and their Turkish
  pairs) state competitor facts as checked on 2026-11-25 from each maker's own site and US store pages. Re-check prices
  and features before changing them, keep the source links, and keep the "not affiliated" line.

## Flags

`stats.showImpact` in `config.js` hides the "Impact so far" and "Time is the
real currency" scenes until `usersHelped` and `hoursReclaimed` are real,
measured numbers. Never publish invented metrics.

The hero and the reviews section show two figures, "300+ active users" and "1,000+ hours saved"
(`copy.*.proof_*`, FAQ answer `a8`, and the "What is Neurofast?" article in both languages). They are the
owner's numbers as of 2026-11-25; update all three places together when they change.
