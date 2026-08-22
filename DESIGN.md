# Design Spec — Minh Tran Portfolio

Pairs with `CONTENT.md` (words) and `AGENTS.md` (stack rules) in the same
repo. This file controls the visual system only: palette, type, layout,
components. Full Clean direction, no serif anywhere, one accent color.

## Visual Style

- **Aesthetic**: Clean, product-grade, whitespace-first. Bold geometric
  sans, subtle shadows, restrained borders. The same register as Linear,
  Stripe, or Loom, not a literary or editorial register.
- **Layout reference**: a fixed left sidebar (identity, hook, nav, socials)
  with scrolling numbered sections on the right, the classic developer
  portfolio pattern. Structure only, not the navy and teal palette that
  usually comes with it.
- **Mood**: precise and confident, warm rather than sterile. No corporate
  blue anywhere on the page.

## Color Palette

One palette, one accent. Do not introduce a second color anywhere,
including in placeholder or example content.

```css
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
```

**Rules:**
- This khaki-olive-beige accent is the only non-neutral color on the page.
  Never substitute blue, indigo, or green, even as a placeholder or a
  "common override" example, those are the wrong palette for this project.
- No gradients, anywhere, on anything.
- Use `--color-accent` sparingly: one primary CTA, link hover states,
  active nav indicator, small icon accents. It should read as a considered
  detail, not a wash of color.

## Typography

- **Display / Headings**: Geist, weight 700 to 800. Bold, geometric,
  confident. (Available on Google Fonts.)
- **Labels / section numbers**: Geist Mono, weight 500, uppercase, tracked.
  Used for the "01 / 02 / 03" numbered section markers in the sidebar nav
  and above each section heading, the one deliberate nod to the
  code-adjacent layout reference.
- **Body**: DM Sans, weight 400.
- **Never use**: Inter, Roboto, Arial, system-ui, Space Grotesk. Never use
  a serif or an italic anywhere on the page, this is a Full Clean
  direction with no literary flourish.

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700;800&family=Geist+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap');
```

| Role | Font | Weight | Size |
|---|---|---|---|
| Hero name | Geist | 800 | `clamp(2.5rem, 6vw, 4.5rem)` |
| H1 (section) | Geist | 700 | `clamp(1.75rem, 3.5vw, 2.75rem)` |
| H2 (project title) | Geist | 700 | `clamp(1.25rem, 2vw, 1.5rem)` |
| Section number label | Geist Mono | 500 | `0.75rem`, uppercase, `0.08em` tracking |
| Body | DM Sans | 400 | `1rem`, line-height `1.65` |
| Small / caption | DM Sans | 400 | `0.8125rem` |

**Font reliability note**: this build likely runs live, on a local model,
possibly on unreliable venue wifi. If there's any doubt about internet
access during the demo, pre-download the three font files and self-host
them via `@font-face` instead of the Google Fonts CDN link above. Test
this the same day, not the morning of.

## Spacing & Layout

- **Structure**: two-region desktop layout.
  - **Sidebar** (fixed, ~380px, left): photo, name, role, one-line hook,
    nav list (numbered, anchor-linked to sections), social icons
    (GitHub, LinkedIn, email, ORCID) at the bottom.
  - **Content** (scrolling, right, remaining width): numbered sections in
    order, each with a Geist Mono number label above a Geist heading.
- **Below 1024px**: sidebar collapses to a top block (photo shrinks, hook
  stays, nav becomes a simple horizontal or stacked link list, no
  hamburger animation), content stacks full-width below it.
- **Container**: content column max-width `720px` within its region.
- **Base spacing unit**: 8px. Section vertical padding: `clamp(4rem, 8vw, 6rem)`.
- **Card padding**: `28px` to `32px` internal.

## Borders & Radius

- Cards: `border: 1px solid var(--color-border)`, `border-radius: 12px`
- Buttons: `border-radius: 8px`
- Inputs (if any): `border-radius: 8px`
- No sharp corners anywhere, this is Full Clean, not Minimal Serif.

## Shadows

- Cards (default): `box-shadow: 0 1px 3px rgba(48,46,44,0.05), 0 1px 2px rgba(48,46,44,0.04)`
- Cards (hover): `box-shadow: 0 6px 20px rgba(48,46,44,0.08)`, paired with
  `transform: translateY(-2px)`
- Flat everywhere else. Shadows exist only to lift cards on hover, never
  as decoration.

## Buttons

- **Primary**: `background: var(--color-accent)`, `color: var(--color-accent-text)`,
  `border-radius: 8px`, `padding: 12px 24px`, weight 500. Hover:
  `background: var(--color-accent-hover)`.
- **Secondary / Ghost**: transparent background, `1px solid var(--color-border)`,
  `color: var(--color-text-primary)`. Hover: `background: var(--color-bg-subtle)`.
- Every button: `transition: all 0.18s ease`, `transform: scale(0.98)` on
  active/press.
- Keep primary buttons rare, most links on this page are plain text links
  with an underline, not buttons. This is a portfolio, not a SaaS pricing
  page, don't over-button it.

## Icons

- SVG only, Lucide-style, `stroke="currentColor"`, `stroke-width="1.5"`,
  no fill, rounded caps and joins.
- UI size 18 to 24px. No icon fonts, no emoji, no colored icon
  backgrounds or circles.

## Components

### Sidebar
- Photo: the marathon finish-line shot, square or portrait crop,
  `border-radius: 12px`.
- Name in Geist 800, role in DM Sans `--color-text-secondary` below it.
- The one-line hook rendered in DM Sans, not oversized, this is the
  hook's only appearance so let it read naturally as a sentence.
- Nav: Geist Mono numbered list (`01 About`, `02 Projects`,
  `03 Off the Clock`, `04 Experience`, `05 Education`, `06 Publications`),
  active section gets `color: var(--color-accent)` and a small accent-
  colored tick mark to its left.
- Socials: row of SVG icons at the sidebar bottom, `color: var(--color-text-muted)`,
  `var(--color-accent)` on hover.

### 01 — About
- The About copy from CONTENT.md as plain paragraphs, DM Sans, max-width
  `680px`. No card, no border, just type and whitespace.

### 02 — Projects
- Each project is an open card: `border`, `12px radius`, subtle shadow,
  hover lift per the Shadows section above.
- Card contents: H2 title, one-line hook in `--color-text-secondary`,
  short stack tag row (small Geist Mono pills, `--color-bg-subtle`
  background, no border), link out (text link with arrow icon, or ghost
  button if it's the primary CTA of the card).
- The home lab card uses the rack photo in place of a link/button, per
  CONTENT.md's decision to show it as an image rather than a repo.
- Jarvis's card gets a small `--color-text-muted` status label ("paused")
  near the title, Geist Mono, uppercase, small.

### 03 — Off the Clock
- Short section. Render as a compact tag row (Cars & Driving, Outdoors,
  Sport, Travel) in the same pill style as project stack tags, followed
  by the one or two sentences from CONTENT.md. Resist the urge to give
  this section its own hero treatment, it's a footnote to the personality,
  not a fifth project.

### 04 — Experience
- Compact vertical list, not a table. Each entry: role/company in Geist
  500, dates in Geist Mono small and muted, one-line description in DM
  Sans. Hairline `border-top` between entries, no cards here, this
  section should feel quieter than Projects.

### 05 — Education & 06 — Publications
- Same quiet list treatment as Experience. Publication titles link out
  directly, no author list per CONTENT.md's decision, small muted venue
  label beneath each title.

### Footer
- Email address rendered at a large display size (Geist 700,
  `clamp(1.75rem, 4vw, 3rem)`) as the visual anchor, matching the Clean
  pattern of treating the contact point as a deliberate design element
  rather than an afterthought.
- Social icons row beneath it. Copyright line, small and muted.

## Micro-Animations

```css
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
.reveal.visible { opacity: 1; transform: none; }
```

- Scroll fade-up on each section and each project card, Intersection
  Observer, threshold `0.12`.
- Staggered children within the Projects grid: 0s / 0.08s / 0.16s / 0.24s
  delays.
- Nav link underline draws in on hover, active section indicator
  transitions smoothly as you scroll (`scroll-spy` behavior, IO-based).
- Always include the reduced-motion override:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
  .reveal { opacity: 1; transform: none; }
}
```

## Imagery

- Two real photos on this site: the marathon shot (sidebar) and the home
  lab rack shot (Projects card). Both sit adjacent to type, never behind
  it with a color overlay or gradient tint.
- No stock photography, no illustrations, no abstract decorative shapes.

## What NOT to Do

| Never | Instead |
|---|---|
| Blue, indigo, or green accent, even as a placeholder | The olive/brown accent pair only, `#797454` / `#875F45` |
| Navy or teal anywhere | Warm neutrals only, per the palette above |
| Serif or italic type anywhere | Geist / Geist Mono / DM Sans only |
| Purple-to-blue gradients | No gradients, period |
| Emoji as icons or bullets | Thin-stroke SVG icons |
| Giant hero gradient blobs or abstract shapes | Plain warm background, photo does the visual work |
| Generic "Get Started Today" hero language | Use the actual hook line from CONTENT.md verbatim |
| Author-list clutter on Publications | Title, venue, link only, per CONTENT.md |
| A hamburger menu with animation on mobile | Simple collapsed stacked nav |
| Pure `#FFFFFF` background | `--color-bg` is warm off-white, `#F8F7F3` |

## Replication Notes for AI Coding Tools

1. This is a Full Clean direction: bold sans, whitespace, subtle shadows,
   rounded corners. There is no serif anywhere on this page, not even for
   a single accent line.
2. The accent color is locked: olive `#797454` as primary, warm brown
   `#875F45` on hover. Both come from the same reference palette, don't
   substitute a different hue even if it seems like a reasonable default.
3. The sidebar/scrolling-content structure is the layout, not a generic
   stacked SaaS landing page. Build the two-region layout first, then
   fill in sections.
4. Numbered section labels (`01`, `02`...) in Geist Mono are a signature
   detail carried over from the layout reference, don't drop them.
5. Two real photos exist for this build: a hero/sidebar portrait and a
   home-lab rack photo for the Projects section. Reference them by
   filename once provided, don't generate placeholder imagery.
6. Content comes from `CONTENT.md` verbatim where marked as locked (the
   one-line hook, the Publications list). Everything else can be
   lightly adapted to fit the layout, but don't rewrite the voice.