# Design Spec — Minh Tran Portfolio

Pairs with `CONTENT.md` (words) and `AGENTS.md` (stack rules) in the same
repo. This file controls the visual system only: palette, type, layout,
components. Full Clean direction, no serif anywhere, one accent color.

This spec describes the **current, live design** — a full-screen,
scroll-snap "deck" you page through, not a fixed sidebar. If you're
building this from scratch, this is the actual target: don't reach for
a conventional sidebar-plus-scrolling-content layout, that was an
earlier direction and was deliberately replaced.

## Why this shape (read before building)

Two decisions shaped everything below, and both came from real user
feedback during earlier builds, not from first principles — know the
reasoning so you don't accidentally undo it:

1. **It's a deck, not a webpage.** This portfolio is demoed live at a
   meetup talk (Vietnamese tech community, Finland) — clicked through on
   a laptop/projector, not casually scrolled by a stranger. Every
   section is a full-screen slide (`min-height: 100dvh`) with
   `scroll-snap`, numbered `01`–`07` in the nav, with a slide counter and
   arrow-key paging. The numbering earns its place *because* of this —
   order is real information (which slide you're on), unlike a
   generic portfolio where `01/02/03` markers are just decoration
   borrowed from "the classic developer portfolio pattern."
2. **Exactly one dark slide, not alternating.** An earlier pass tried
   strictly alternating light/dark backgrounds every section. It was
   built, screenshotted, and rejected live: it read as arbitrary
   strobing with no content-driven reason for which sections were which
   color, and it fought the palette's own "precise and confident, warm
   rather than sterile" character. The fix, and the current rule: only
   `#intro` (the hero) is dark. That's "spend your boldness in one
   place" — the opening slide is the one moment built to hit hardest
   (bright marathon photo against near-black), and everything after it
   settles into one calm, consistent light palette all the way to the
   footer. **Do not reintroduce alternating dark sections** — if you
   want to experiment with a second dark slide, that's a real design
   decision to raise with the user first, not a default to reach for.

## Foundational `global.css` block — copy this first, verbatim

This is the single source of truth for `global.css`'s foundation:
both `@import`s, the `@theme` tokens, the dark-slide override, the
deck/scroll-snap mechanics, and the reveal/reduced-motion rules — in
the exact order they must appear in the file. Every later section of
this document (Color Palette, Typography, Deck mechanics,
Micro-Animations) explains the *reasoning* behind pieces of this block,
but the block itself lives only here — copy it once, verbatim, top to
bottom, as the entire starting content of `global.css`. Do not
reassemble it yourself from the explanatory sections below; that
re-derivation is exactly how a stray second `@import` or a malformed
selector gets introduced. Component-specific CSS (nav, timeline, tags,
lightbox, buttons — described in prose later in this file) gets
appended *after* this block, never interleaved inside it.

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700;800&family=Geist+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  --color-bg:           #F8F7F3;  /* warm paper white, never pure #FFF */
  --color-bg-subtle:    #EFEAE2;  /* alternate section background, derived */
  --color-bg-card:      #FDFCFA;  /* derived, marginally lifted off bg */
  --color-border:       #BCB3A6;  /* warm taupe hairline */
  --color-text-primary: #302E2C;  /* warm near-black, not pure black */
  --color-text-secondary: #6B6459;  /* derived, interpolated */
  --color-text-muted:   #8C8375;  /* derived, interpolated */
  --color-accent:       #797454;  /* olive, from reference palette */
  --color-accent-hover: #875F45;  /* warm brown, also from reference palette */
  --color-accent-text:  #F8F7F3;  /* text on a filled accent button */
}

section[data-theme="dark"] {
  --color-bg: #302E2C;
  --color-bg-subtle: #3D3A35;
  --color-bg-card: #383530;
  --color-border: #55504A;
  --color-text-primary: #F8F7F3;
  --color-text-secondary: #C9C2B4;
  --color-text-muted: #9B9284;
  --color-accent: #B5AE82;
  --color-accent-hover: #D19E77;
  --color-accent-text: #302E2C;
}

html {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}
main.content > section,
main.content > footer {
  width: 100%;
  scroll-snap-align: start;
  background: var(--color-bg);
  color: var(--color-text-primary);
  transition: background-color 0.4s ease, color 0.4s ease;
}
main.content > section {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-block: clamp(3rem, 6vw, 5rem);
}
.slide-inner {
  max-width: 760px;
  width: 100%;
  margin-inline: auto;
  padding-inline: clamp(1.5rem, 5vw, 3rem);
}

.reveal { opacity: 0; transform: translateY(-4rem); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
  .reveal, .reveal.is-visible { opacity: 1; transform: none; }
}
```

**Why this exact order matters, in one line each:**
- Both `@import`s must come first — CSS requires every `@import` to
  precede all other rules; a build only warns about a violation, it
  doesn't fail, so a misplaced one ships silently broken.
- The Google Fonts `@import` must come **before** `@import "tailwindcss"`,
  not after. This is the opposite of the intuitive "framework first"
  order, and it's not optional: `@import "tailwindcss"` doesn't stay a
  single import statement once built — Tailwind v4 inlines its own
  generated CSS in its place, starting with a non-import `@layer`
  block. Anything after it in source (including a second `@import`)
  ends up positioned after that inlined content once built, which is
  exactly the "@import must precede all other rules" violation this
  section exists to prevent. Verified empirically: `tailwindcss` first
  produces the warning, fonts first does not.
- `@theme` before the dark override — the override block re-declares
  the same token names, so the base values must exist first.
- The dark override before the deck-mechanics `section` rules — not
  load-bearing order-wise (custom properties resolve at paint time,
  not declaration time), but keeping all token-related blocks together
  before all layout-related blocks keeps the file easy to scan.
- `.reveal` and reduced-motion last — they're independent of
  everything above and are pure additions once the foundation exists.

## Visual Style

- **Aesthetic**: Clean, product-grade, whitespace-first. Bold geometric
  sans, subtle shadows, restrained borders. The same register as Linear,
  Stripe, or Loom, not a literary or editorial register.
- **Layout reference**: a full-screen scroll-snap deck — a sticky top
  nav (name + numbered section links) and seven full-viewport slides you
  page through in order, each one its own section. Not a fixed sidebar,
  not a conventional scrolling single-column page.
- **Mood**: precise and confident, warm rather than sterile. No corporate
  blue anywhere on the page. Calm — the one dark slide is a deliberate
  accent, not a recurring mood swing.

## Color Palette

One palette, one accent, plus a single deliberate inversion of that same
palette for the one dark slide. Do not introduce a second color anywhere,
including in placeholder or example content, and do not invent a second,
different "dark mode" system — the mechanism below is the only one.

The exact token values live in the "Foundational `global.css` block"
above — don't retype them here, that block is the only copy.

**Rules:**
- This khaki-olive-beige accent is the only non-neutral color on the page.
  Never substitute blue, indigo, or green, even as a placeholder or a
  "common override" example, those are the wrong palette for this project.
- No gradients, anywhere, on anything.
- Use `--color-accent` sparingly: link hover states, active nav
  indicator, small icon accents, the slide counter's current number. It
  should read as a considered detail, not a wash of color.

### The dark slide (`#intro` only)

The exact same tokens, re-declared with inverted values, scoped to
`section[data-theme="dark"]`. Every rule elsewhere in this file already
reads colors from `var(--color-*)`, so this one block re-themes the
whole slide with zero per-component overrides — that's the entire
mechanism, don't build a second one (no separate `theme.css`, no
hardcoded `#0a0a0a` sidebar background, no `class="dark"` on `<html>`).

Again, the exact values are in the "Foundational `global.css` block"
above, not repeated here.

**Gotcha**: custom properties only cascade to *descendants*. If you ever
need to reference "the dark slide's color" or "the next slide's color"
from an element that is a *sibling* of the dark section (the lightbox,
for instance, which sits outside any section) — those variables aren't
in scope there. That's fine and expected; the lightbox and other
siblings correctly fall back to the root light tokens regardless of
which slide is currently on screen, which is the desired behavior (a
lightbox photo shouldn't get tinted by whichever slide opened it).

## Typography

- **Display / Headings**: Geist, weight 700 to 800. Bold, geometric,
  confident. (Available on Google Fonts.)
- **Labels / section numbers**: Geist Mono, weight 500, uppercase, tracked.
  Used for the nav's `01`–`07` numbered links and the section-number
  label above each slide's heading — the one deliberate nod to the
  code-adjacent layout reference.
- **Body**: DM Sans, weight 400.
- **Never use**: Inter, Roboto, Arial, system-ui, Space Grotesk. Never use
  a serif or an italic anywhere on the page, this is a Full Clean
  direction with no literary flourish.

This font `@import` is already the second line of the "Foundational
`global.css` block" above — don't add it again here or anywhere else
in the file.

| Role | Font | Weight | Size |
|---|---|---|---|
| Hero name (`#intro .name`) | Geist | 800 | `clamp(2.25rem, 5vw, 3.5rem)` |
| Top nav brand | Geist | 700 | `1.0625rem` |
| H1 (section title, `.title`) | Geist | 700 | `clamp(1.75rem, 3.5vw, 2.75rem)` |
| Timeline role (`.timeline .role`) | Geist | 500 | `1rem` |
| Section number / nav link label | Geist Mono | 500 | `0.75rem` nav-labels are `0.6875rem`, uppercase, `0.08em` tracking |
| Body / hook / description | DM Sans | 400 | `1rem`–`1.0625rem`, line-height `1.65` |
| Small / caption / dates / venue | DM Sans or Geist Mono | 400–500 | `0.75rem`–`0.8125rem` |
| Footer email (`.big-email`) | Geist | 700 | `clamp(1.75rem, 4vw, 3rem)` |

**Font reliability note**: this build likely runs live, on a local model,
possibly on unreliable venue wifi. If there's any doubt about internet
access during the demo, pre-download the three font files and self-host
them via `@font-face` instead of the Google Fonts CDN link above. Test
this the same day, not the morning of.

## Spacing & Layout

- **Structure**: a sticky top nav, then seven full-screen sections
  stacked vertically with CSS scroll-snap, so scrolling pages through
  them one at a time. See the "Deck mechanics" component section below
  for the exact CSS and the required two-element split (full-bleed
  slide vs. centered content column).
- **Container**: content column max-width `760px` (`.slide-inner`),
  centered, with `padding-inline: clamp(1.5rem, 5vw, 3rem)`.
- **Section vertical padding**: `padding-block: clamp(3rem, 6vw, 5rem)`
  on the section itself.
- **Base spacing unit**: 8px.
- **Card padding**: not applicable — there are no cards in the current
  design (see "Timeline, not cards" below). If a future pass reintroduces
  a card component, `28px`–`32px` internal padding, `border: 1px solid
  var(--color-border)`, `border-radius: 12px` is the established pattern
  to match.
- **Responsive**: no dedicated breakpoint has been built or tested below
  ~1024px. The nav uses `flex-wrap: wrap` so it degrades reasonably on
  narrow viewports, and every slide's `min-height: 100dvh` plus natural
  content overflow already works at any width — but this hasn't been
  hardened or screenshotted at phone widths. Treat mobile as a known gap,
  not a solved one; if it matters for the actual demo (laptop/projector
  is the primary target), say so explicitly rather than silently
  shipping untested mobile CSS.

## Borders & Radius

- `border-radius: 12px` on the portrait and the lightbox photo.
- `border-radius: 100px` on tag pills.
- `border-radius: 50%` on the lightbox close button and the nav's active-
  indicator dot (`.conductor`).
- Hairline `1px solid var(--color-border)` between timeline/article
  items — no boxes, no card borders anywhere in the current design.

## Shadows

- Nothing has a resting shadow in the current design (no cards). The
  lightbox close button has a small lift: `box-shadow: 0 2px 8px
  rgba(48,46,44,0.2)`.
- Flat everywhere else. If cards come back in a future pass:
  `box-shadow: 0 1px 3px rgba(48,46,44,0.05), 0 1px 2px rgba(48,46,44,0.04)`
  resting, `0 6px 20px rgba(48,46,44,0.08)` + `translateY(-2px)` on
  hover, established but currently unused.

## Buttons & Links

- There are no filled `<button>`-style CTAs anywhere in the current
  design — every action is a `.cta`: an underlined text link, `color:
  var(--color-accent)`, `var(--color-accent-hover)` on hover. "Read
  more →", "Watch the demo →", "View photo →", "See my work →", "Scroll
  to explore ↓" are all this same `.cta` class. Keep it this way —
  this is a portfolio, not a SaaS pricing page, don't add filled
  buttons unless explicitly asked.
- Every interactive text element: `transition: color 0.18s ease` (links)
  or the slightly longer `0.4s` on section background/color (the one
  dark→light boundary).

## Icons

- SVG only, Lucide-style, `stroke="currentColor"`, `stroke-width="2"`,
  no fill, rounded caps and joins. Only one SVG icon exists in the
  current build: the lightbox's × close icon. Social links (GitHub,
  LinkedIn, ORCID) are plain text links, not icons — deliberate, keeps
  them consistent with the rest of the page's text-link language and
  avoids hand-drawn brand-mark SVGs that risk looking off at small size.

## Components

### Top nav (`Header.astro`, class `.topnav`)

Replaces the old fixed sidebar. Sticky, `top: 0`, translucent blurred
background (`color-mix(in srgb, var(--color-bg) 88%, transparent)` +
`backdrop-filter: blur(8px)`), hairline border-bottom. Contents: brand
name link (`Minh Tran`, links to `#intro`) on the left, the numbered nav
list on the right. Always uses the light-mode nav styling regardless of
which slide is currently scrolled behind it — the nav is persistent
chrome, it does not re-theme with the slide underneath it.

Nav links (`01. Intro` through `07. Publications`) are Geist Mono,
uppercase, `0.6875rem`, with a small dot (`.conductor`) that fills with
the accent color when that link is the current slide.
`aria-current="page"` is hardcoded on the Intro link in markup as the
no-JS default, then kept in sync by `reveal.js` as you scroll (see Deck
mechanics below) — don't remove the hardcoded default, it's the graceful
fallback.

### Deck mechanics: scroll-snap, slide counter, arrow-key paging

This is the trickiest part of the build — copy the pattern exactly, it
took several iterations to get right.

**The full-bleed-vs-centered-column split.** A single element cannot
both paint edge-to-edge (needed so a dark slide's background fills the
whole screen) and cap its own width (needed for a readable text column).
Two elements, not one:

This CSS is already in the "Foundational `global.css` block" above
(the `html`, `main.content > section`/`footer`, and `.slide-inner`
rules) — don't retype it here.

Markup shape for every section: `<section id="..." class="reveal">` (add
`data-theme="dark"` only on `#intro`) wrapping a single `<div
class="slide-inner">` that holds the actual content. Never put content
directly inside `<section>` without the `.slide-inner` wrapper — that's
exactly the bug that made a dark slide's background paint only a narrow
760px column instead of the full screen.

**Slide counter + active-nav tracking** (`reveal.js`). Tracks which of
the 7 sections is "current" to update a fixed bottom-right counter
(`03 / 07`) and move `aria-current="page"` on the matching nav link:

```js
const slideIds = ['intro', 'about', 'experience', 'projects', 'off', 'education', 'publications'];
const slides = slideIds.map((id) => document.getElementById(id)).filter(Boolean);

// A fixed threshold on the target's own intersection ratio (e.g.
// `threshold: 0.5`) breaks for any slide taller than one viewport —
// Experience has 5 items and can never show 50% of its own total
// height at once, so that threshold silently never fires for it.
// Instead, watch a thin band at the vertical center of the viewport;
// whichever slide overlaps that band is "current", regardless of how
// tall the slide itself is.
const slideObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const index = slides.indexOf(entry.target);
      if (index !== -1) setCurrentSlide(index);
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
slides.forEach((slide) => slideObserver.observe(slide));
```

The counter markup lives in `Layout.astro` (fixed, `pointer-events:
none`, `mix-blend-mode: difference` so it stays legible against both the
light slides and the one dark slide without any extra logic):

```html
<p class="slide-counter" aria-hidden="true">
  <span class="slide-counter-current">01</span><span>/07</span>
</p>
```

**Arrow-key paging.** `ArrowDown`/`ArrowUp` move one slide at a time via
`scrollIntoView`, skipped while focus is in a form field, and respecting
`prefers-reduced-motion` (instant jump instead of smooth scroll):

```js
window.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  if (document.activeElement?.tagName === 'INPUT') return;
  const direction = event.key === 'ArrowDown' ? 1 : -1;
  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= slides.length) return;
  event.preventDefault();
  slides[nextIndex].scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
});
```

### 01 — Intro (the hero slide, `data-theme="dark"`)

The only dark slide (see "Why this shape" above — do not add more).
Centered layout (`align-items: center; text-align: center` on the
section): portrait photo (`min(100%, 220px)` wide, `border-radius:
12px`, `aspect-ratio: 4/5`, `object-fit: cover`), name in Geist 800,
role in DM Sans below it, then the locked one-line hook, then a `.cta
.scroll-cue` link ("Scroll to explore ↓") pointing at `#about`. No
social links here — those live in About, not Intro (tried once, moved
back: a row of social links reads badly stacked centered under a
120-word statement, and About's left-aligned narrative voice is a more
natural place for a "here's where else to find me" aside). No gradient
transition into the next slide either — tried, didn't like it, removed;
the seam between Intro and About is a clean, deliberate hard cut.

### 02 — About

The About copy from `CONTENT.md` as plain paragraphs, DM Sans, max-width
`680px`. No card, no border, just type and whitespace. A `.cta` link
("See my work →") to `#experience`, then a `.socials` row (GitHub,
LinkedIn, ORCID — plain text links, `color: var(--color-text-muted)`,
accent on hover) directly beneath it.

### 03 — Experience

Timeline, not cards (see below) — 5 entries, most recent first, all 5
render. Each: role/company in Geist 500, dates in Geist Mono small and
muted, one-line description in DM Sans, then a small `.tags` row of
2–3 Skills tags pulled from `CONTENT.md`'s locked "Skills:" line per
entry. Hairline `border-top` between entries (`.timeline-item`), no
`border-top` on the first item.

### 04 — Work on the side

Same timeline treatment as Experience — **not** a card grid. (An earlier
version used a `.cards` grid with inline thumbnail images; two of the
four projects don't have a real photo, so two cards reused the sidebar
portrait as filler, which looked wrong and was the reason this changed.)
4 items: World Cup scoreline model, Context-window demo, Home lab /
rack, Jarvis memory assistant.

Order within each item, per `CONTENT.md`'s rendering note — **CTA
before tags, not after**: title → description (Hook + What it does
folded together) → `.cta` link → `.tags` stack row. Putting the CTA
right after the pitch keeps the "click here" moment attached to the text
that earns it, instead of behind a row of pills.

- World Cup + Context-window demo: real GitHub links, `target="_blank"
  rel="noopener noreferrer"`, plus a stack tag row.
- Home lab / rack: no stack tags, no inline image. CTA is "View photo
  →", opening the rack photo in the Lightbox component below instead of
  showing it in the flow.
- Jarvis: small `"Paused"` `.tag` inline next to the title
  (`<h2 class="role">Jarvis memory assistant<span class="tag">Paused</span></h2>`),
  no CTA link — the repo stays unlinked, decided, don't add one.

### 05 — Off the clock

Short section. A `.tags` row (Driving, not taxiing · Time outdoors ·
Sports · Travel — locked list, from `CONTENT.md`) followed by the one or
two sentences from `CONTENT.md`. Resist the urge to give this section
its own hero treatment, it's a footnote to the personality, not a fifth
project.

### 06 — Education

Same quiet timeline treatment as Experience. 3 entries: M.Sc., B.Sc.,
and the high school entry (no thesis line for that last one — it's just
role/dates, nothing to link). Both degree entries get a `.card-sub`
line reading `Thesis: <a>...</a>` with the real thesis title as the
link text, linking to the real URN. Thesis links need their own small
`a` rule (`.timeline-item .card-sub a`) since a bare link inside
`.card-sub` otherwise inherits plain muted text with no underline —
easy to miss that it needs explicit styling to look clickable at all.

### 07 — Publications

Same quiet list treatment, `<ul class="articles">`. Publication titles
link out directly, no author list per `CONTENT.md`'s decision, small
muted venue label beneath each title.

### Footer

Not a numbered slide (no nav entry, no slide-counter increment) — the
natural end of the deck. Subtitle line, then the email address rendered
at a large display size (Geist 700, `clamp(1.75rem, 4vw, 3rem)`) as the
visual anchor, then the same `.socials` row as About (GitHub, LinkedIn,
ORCID), then a small muted copyright line.

### Lightbox (pure CSS, no JS)

Used once, for the Home lab / rack photo. `:target`-triggered — a
`<div id="lightbox-rack" class="lightbox">` starts `display: none`,
and `.lightbox:target { display: block; }` shows it when the URL hash
matches. The trigger is a plain `<a href="#lightbox-rack">`; the
backdrop and the × close button both link back to `#projects` to close
it. Zero JavaScript, works with the back button, no focus-trap or
Escape-key handling (a known, accepted trade-off for something this
small — don't build a JS modal to fix it unless asked).

## Micro-Animations

Both the `.reveal` rules and the reduced-motion override below are
already in the "Foundational `global.css` block" near the top of this
file — don't retype them here.

- Every section and the footer carry `.reveal`; `reveal.js` adds
  `.is-visible` via `IntersectionObserver({ threshold: 0.15 })` the
  first time each one scrolls into view.
- The same `reveal.js` file also owns the deck-tracking (slide counter +
  active nav) and arrow-key paging described above — it's one script
  doing three related jobs, not three separate files.
- Nav link color transitions on hover (`0.18s ease`); the one dark→light
  section boundary transitions background/color over `0.4s ease`.
- Always include the reduced-motion override — and make sure it also
  turns off smooth scrolling, not just CSS transitions, or arrow-key
  paging still animates for someone who asked it not to (already
  included in the foundational block above).

## Imagery

- Two real photos on this site: the marathon shot (now in the Intro
  hero slide, not a sidebar) and the home-lab rack shot (shown only in
  the Lightbox, triggered from the Work-on-the-side list — not inline
  in a card, and not reused as filler on any other project item).
- No stock photography, no illustrations, no abstract decorative shapes.

## What NOT to Do

| Never | Instead |
|---|---|
| Blue, indigo, or green accent, even as a placeholder | The olive/brown accent pair only, `#797454` / `#875F45` (or their dark-slide equivalents `#B5AE82` / `#D19E77`) |
| Navy or teal anywhere | Warm neutrals only, per the palette above |
| Serif or italic type anywhere | Geist / Geist Mono / DM Sans only |
| Purple-to-blue gradients | No gradients, period |
| Emoji as icons or bullets | Thin-stroke SVG icons, or plain text links for socials |
| Giant hero gradient blobs or abstract shapes | Plain background, photo does the visual work |
| Generic "Get Started Today" hero language | Use the actual hook line from `CONTENT.md` verbatim |
| Author-list clutter on Publications | Title, venue, link only, per `CONTENT.md` |
| Pure `#FFFFFF` background | `--color-bg` is warm off-white, `#F8F7F3` |
| A fixed left sidebar | Sticky top nav + full-screen scroll-snap slides — the sidebar direction was tried and replaced |
| Alternating light/dark backgrounds per section | Exactly one dark slide (`#intro`), everything else stays light — tried alternating, rejected live as arbitrary strobing |
| A second, ad-hoc dark-mode system (`class="dark"`, a separate `theme.css`, a hardcoded `#0a0a0a`) | The single `section[data-theme="dark"]` token-override block above — one mechanism, not two |
| A `.cards` grid with thumbnail images for Work on the side | The timeline/list treatment — two of the four projects have no real photo, and filler images (reusing the portrait) looked wrong |
| Putting a project's tag row before its CTA link | CTA immediately after the description, tags after the CTA |
| A gradient/fade transition between the dark and light slides | Tried, didn't like it, removed — the seam is a clean hard cut |

## Replication Notes for AI Coding Tools

1. This is a Full Clean direction: bold sans, whitespace, subtle
   restraint, rounded corners on the few things that have corners
   (photo, tags, lightbox). There is no serif anywhere on this page, not
   even for a single accent line.
2. The accent color is locked: olive `#797454` as primary, warm brown
   `#875F45` on hover (lighter equivalents on the one dark slide, see
   the Color Palette section). Don't substitute a different hue even if
   it seems like a reasonable default.
3. The layout is a full-screen scroll-snap deck — sticky top nav, seven
   numbered slides, one slide counter, arrow-key paging. This is not a
   sidebar layout and not a conventional stacked scrolling page; both
   were tried in earlier passes and replaced. Build the deck mechanics
   (scroll-snap CSS, `.slide-inner` split, `reveal.js` tracking) *first*,
   the same way `global.css`'s theme tokens have to exist before any
   component references them — everything else depends on this
   structure being correct.
4. Numbered section labels (`01`–`07`) in Geist Mono, in both the nav
   and above each section heading, are a signature detail — carried over
   from the old layout reference, now genuinely earned since the
   sections really are a sequence of slides. Don't drop them.
5. Exactly one dark slide (`#intro`). If you find yourself about to add
   `data-theme="dark"` to a second section, stop — that's the exact
   thing that was tried and rejected. Ask before reintroducing it.
6. Two real photos exist for this build, already in the repo: the
   hero portrait at `public/images/minh.jpeg` and the home-lab rack
   photo at `public/images/pc_rack.jpg` (web paths `/images/minh.jpeg`
   and `/images/pc_rack.jpg`). Reference them by these exact filenames.
   Never generate, rename, or overwrite either file — they are real
   binary photos, not placeholders to be created.
7. Content comes from `CONTENT.md` verbatim where marked locked (the
   one-line hook, the Publications list, the Experience Skills tags, the
   Off-the-clock tags, the project rendering order). Everything else can
   be lightly adapted to fit the layout, but don't rewrite the voice.
8. For visual validation, use `agent-browser` (see `AGENTS.md`) and
   check specifically: the top nav is sticky and legible, `#intro` is
   the only dark slide (scroll through all seven and confirm none of
   the others went dark), the slide counter and active nav link update
   as you scroll past a tall section like Experience (not just a short
   one — that's exactly where the naive `threshold: 0.5` approach broke
   before), and arrow-key paging moves one slide at a time.
