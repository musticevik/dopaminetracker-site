# Dopamine Tracker — Website redesign brief

Live site: https://dopaminetracker.site (GitHub Pages, static HTML, no build step).
The current pages in this project are the shipped v1: `index.html` (Turkish),
`en/index.html` (English), `assets/site.css`, screenshots under
`assets/img/screens/` (placeholders until real captures land).

## Product in one paragraph
Android app. Screen time tracking, a daily dopamine score (0–100), app blocking
with a daily limit per app or full-day blocks, a block screen that reminds the
user why they installed the app, focus sessions, daily goal and streak.
Blocking is FREE for everyone; Pro (₺59,99/month, ₺289,99/year) sells getting
out early: unlock a block for today, loosen a limit, strict focus mode,
unbreakable block.

## Goals of the site
1. Rank for: ekran süresi, uygulama engelleme, telefon bağımlılığı, dijital
   detoks (TR) and screen time tracker, app blocker, phone addiction (EN).
2. Convert to a Google Play install. One primary CTA, repeated.
3. Look like the app: dark #0f0f14 ground, green #2ECC71 light source, no cards,
   Baloo 2 headings, Nunito body. Editorial, Opal / AppBlock-class polish.

## Design system (must keep)
- Colors: bg #0f0f14, surface #1a1a22, muted #2a2a35, text #e8e8ed,
  secondary text #9ca3af, accent #2ECC71 (text on it #05291A), teal #2CB1BC
  only as support, danger #f87171.
- Type: Baloo 2 700 for display, Nunito 600–900 for body/labels; 11px tracked
  uppercase eyebrows.
- Radii: 28px buttons, 38px phone frames. Radial green glow behind heroes.
- Real app numbers only: score 72, today 5 sa 12 dk, Instagram 2 sa 05 dk,
  TikTok 1 sa 30 dk, 7-day streak. No lorem ipsum.

## Asks for Claude Design
Produce 2–3 structurally different directions for the Turkish home page at
1440 desktop and 390 mobile:
- A) Long-scroll editorial: giant headline, phone frame as the light source,
  feature rows alternating text/screenshot.
- B) Story-first: the "limit reached → block screen → back to your goal"
  sequence told as three phone frames in a row, everything else secondary.
- C) Comparison-led: Free vs Pro table as the hero's second act, aimed at
  users coming from competitor searches.
Keep the sections that exist today (screens, features, how it works, Free/Pro,
FAQ, final CTA, footer with privacy). Add one line per direction: why it, and
what changes versus v1.
