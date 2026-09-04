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

  This writes `index.html` (Turkish) and `en/index.html` (English) with the
  copy baked in for SEO. Commit the generated files together with the source.

- Privacy policy: `gizlilik/index.html`, `en/privacy/index.html` (hand-written).
- Screenshots: `assets/img/screens/{home,analytics,block,focus,account}.jpg`, 973×2048.

## Flags

`stats.showImpact` in `config.js` hides the "Impact so far" and "Time is the
real currency" scenes until `usersHelped` and `hoursReclaimed` are real,
measured numbers. Never publish invented metrics.
