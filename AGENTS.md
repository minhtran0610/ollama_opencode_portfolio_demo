## Stack rules (non-negotiable)

- Astro v7 + Tailwind v4. Components are `.astro` files: `---` JS fence at
  top (frontmatter), then plain HTML below it. The frontmatter is where you
  read props and compute variables — it is never where you define or
  return a component. There is no `export default`, ever, in a `.astro`
  file.
- Use `class=`, NEVER `className=`. This is HTML, not JSX.
- No React, no `useState`, no hooks, no `.jsx`/`.tsx` files, no `key={}`
  props anywhere (Astro's `.map()` doesn't need or want a `key`).
- Tailwind v4: theme lives in `@theme {}` inside `src/styles/global.css`.
  `global.css` already exists and is already correct — read it, don't
  regenerate it. There is no `tailwind.config.js` — don't create one.
- Every `--color-*` and `--font-*` token in `@theme` auto-generates a
  matching Tailwind utility class. `--color-accent` gives you `text-accent`,
  `bg-accent`, `border-accent`, `ring-accent`, `decoration-accent`.
  `--font-display` gives you `font-display`; `--font-mono` gives you
  `font-mono`. **Prefer these plain utility classes over
  `text-[var(--color-x)]` arbitrary-value syntax** — fewer brackets to
  balance, less to get wrong. Never hardcode a hex value or a raw color
  name in markup.
- `@theme` and its token names (`--color-accent`, `--font-display`, ...)
  are CSS-only. They belong inside the `@theme { }` block in `global.css`
  and nowhere else. Never write `@theme` itself, or a bare token name like
  `--font-sans`, as literal text in an HTML attribute or as rendered page
  content — that string is not a value, it does nothing outside CSS.
- Interactivity: plain `<script>` tags or CSS only. No client-side
  framework, no hydration directives (`client:load` etc.) unless
  explicitly asked.
- Fonts: `<link>` to Google Fonts in the layout `<head>`, then reference
  via a `--font-*` token in `@theme`.

## Correct shape of an .astro component (read this before writing any file)

This is the entire correct pattern. Copy this shape exactly — do not invent
a different one.

```astro
---
// frontmatter: read props, compute plain variables, nothing else
interface Props {
  title: string;
  hook: string;
}
const { title, hook } = Astro.props;
---

<!-- template: plain HTML, Tailwind classes, {expression} for values -->
<article class="rounded-xl border border-border bg-card p-8 shadow-sm">
  <h2 class="font-display text-2xl">{title}</h2>
  <p class="mt-2 text-secondary">{hook}</p>
</article>
```

That's it. No function wraps the markup. No `return`. No `export`. The
file *is* the component; the HTML below the fence *is* the output.

### The mistake that broke the last build — do not repeat this

The previous attempt produced files shaped like this. It is wrong in
every line. If what you're about to write looks anything like this,
stop and rewrite it in the correct shape above instead.

```astro
---
// WRONG — this is a React function component, not an Astro component
function ProjectCard() {
  return (
    <article class="project-card">
      <h2 class="@theme font-display text-heading-2lg">{title}</h2>
      {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
    </article>
  );
}
export default ProjectCard;
---
<div>{/** Slot for children */}</div>
```

Concretely banned, because each one appeared in the failed build:
- Defining a JS function in the frontmatter that `return`s markup.
- `export default` of any kind in a `.astro` file.
- `key={...}` inside `.map()`.
- Writing `@theme` or a token name (`--font-sans`, `--text-base`, ...) as
  literal text inside `class=` or as page content — those are not
  copy-pasteable strings, they only mean something inside the `@theme {}`
  block in `global.css`.
- Inventing types, props, or APIs that don't exist (`Astro.LoopLink`,
  `Astra.TextAttributes`, `Astro.router.astroPrefix`, etc. — that last
  one is real, it appeared in an earlier build's `<meta name="generator"
  content={Astro.router.astroPrefix || Astro.generator} />` and threw at
  build time). If you're unsure a type or global exists, use `string`,
  `string[]`, or skip the `interface Props`/the API call entirely — an
  untyped prop that renders correctly beats a typed prop that doesn't
  exist, and no generator meta tag beats one that crashes the build.
- Writing `${expression}` in the HTML template body, e.g.
  `<title>${titleValue}</title>`. That's JS template-literal syntax and
  only means something inside a backtick string in the frontmatter.
  Astro's template uses plain `{expression}` — `<title>{titleValue}</title>`.
  The `${...}` form compiles without error and silently renders the
  literal characters `$`, `{`, `titleValue`, `}` as text on the page —
  it fails silently, not loudly, so double-check every `{}` in the
  template is bare, never `$`-prefixed.
- Loading `reveal.js` (or any `src/scripts/*.js` file) via an absolute
  root path without `is:inline`, e.g. `<script type="module"
  src="/scripts/reveal.js">`. An absolute `/...` path is a literal
  browser URL, not a `src/`-relative import — Astro/Vite won't resolve
  it into `src/scripts/`, so it 404s at runtime. `npm run build` won't
  catch this either, since it compiles fine; only a real browser request
  reveals the 404. Use the relative form from the File structure section
  below: `<script src="../scripts/reveal.js">`.
- Loading `global.css` via a `<script>` tag of any kind — CSS is never
  script content, `<script type="module" src="...global.css">` or
  `<script type="module" src="./styles/global.css">` are both wrong
  regardless of whether the path is absolute or relative. A browser
  tries to parse the CSS as JavaScript and fails at runtime; `npm run
  build` may not catch it either, since an absolute path isn't bundled
  as a JS entry and can silently compile away. The only correct way to
  load `global.css` is a plain top-of-frontmatter import in
  `Layout.astro`: `import "../styles/global.css";` — no `<script>`, no
  `<link>`, nothing in the template body. This is a different mechanism
  from `reveal.js` above on purpose: `reveal.js` is a `<script src=...>`
  tag in the template because it's JS; `global.css` is a frontmatter
  `import` because it's CSS. Don't copy the script-tag pattern from one
  to the other.
- Every `.astro` file under `src/pages/` must actually `import Layout
  from "../layouts/Layout.astro";` and wrap its content in
  `<Layout>...</Layout>`. A page that only contains bare section markup
  with no `<Layout>` wrapper will compile and build successfully with
  `npm run build` — Astro doesn't require a page to use any particular
  layout — but the rendered output has no `<html>`/`<head>`/`<body>`,
  no CSS, no fonts, no top nav, nothing from `Layout.astro` at all. A
  clean build is not proof this is wired up; open the actual rendered
  HTML (curl the dev server, or read `dist/index.html` after a build)
  and confirm a `<link rel="stylesheet">` and the top nav markup are
  actually present.
- Every opening tag must have a matching closing tag, and `<li>`
  elements must be inside a `<ul>` or `<ol>`, never a bare `<nav>` or
  `<div>`. An unclosed tag or a `<li>` with no `<ul>` parent will
  fail `npm run build` with a compiler error — but only once something
  actually imports and renders that component. A component with no
  render target yet (see the todo table below) can hide this kind of
  error indefinitely; don't assume a file is correct just because
  nothing has failed on it yet.
- Every section's content must sit inside a `.slide-inner` wrapper div,
  never directly inside the `<section>`. A single element can't both
  paint a full-bleed background (needed for the dark slide) and cap its
  own reading-width column (needed so text doesn't span the whole
  screen) — that's a hard CSS constraint, not a style preference. Full
  pattern and the exact CSS in DESIGN.md's "Deck mechanics."
- Any dark styling must go through the single `section[data-theme="dark"]`
  token-override block in `global.css` — never a second, ad-hoc dark
  system (a `class="dark"` on `<html>`, a separate `theme.css` file, a
  hardcoded hex like `#0a0a0a` on some element's background). All of
  those were tried in earlier builds and are explicitly banned in
  DESIGN.md's "What NOT to Do" table. And only `#intro` gets
  `data-theme="dark"` at all — every other section stays light. An
  earlier build alternated dark/light per section; it was reviewed live
  and rejected as arbitrary strobing. Don't reintroduce it.
- If you write any scroll-position-tracking logic (active nav, a slide
  counter, anything using `IntersectionObserver`), do not use a fixed
  `threshold` on the target's own intersection ratio (e.g. `threshold:
  0.5`) — it silently never fires for any section taller than one
  viewport, since "50% of the target visible" can be mathematically
  impossible for a tall element. Use `rootMargin: '-45% 0px -45% 0px'`
  (a thin band at the viewport's vertical center) instead — exact code
  in DESIGN.md's "Deck mechanics."

## Content approach: hardcode, don't loop

All the content in `CONTENT.md` is fixed and small: 4 projects, 5
experience entries, 3 education entries, 3 publications. It will never
grow or come from a CMS for this build. **Write each one out as static,
hardcoded markup — do not build a JS array of objects and `.map()` over
it.** A hardcoded block per item is more verbose but cannot have a broken
array literal, a broken callback, or a missing `key` — write five
separate, literal `<li class="timeline-item">` blocks for the five
experience entries, not one `.map()` over an array. This applies
everywhere: projects, experience, education, publications, nav links,
socials.

## File structure — keep it flat

Build exactly these files, nothing more. Do not split sections into
separate component files beyond what's listed here — every extra file is
another prop contract that can drift out of sync with where it's used,
which is what happened last time (`Project.astro` imported `Card.astro`
expecting one shape; `Card.astro` rendered a different, empty one).

- `src/layouts/Layout.astro` — `<html>`/`<head>` (title, meta, Google
  Fonts `<link>`), imports `global.css`, renders `<Header />` (the top
  nav — see below, not a sidebar), then `<main class="content"><slot
  /></main>` for the page content, then the fixed `.slide-counter`
  element. Takes no props beyond an optional page title.
- `src/components/Header.astro` — the one component split out, since it's
  reused nowhere else but is visually distinct chrome: the sticky top
  nav (brand name + the 7 numbered section links). Hardcode the nav
  items directly in this file; it doesn't need a `nav` prop. This
  replaced an earlier `Sidebar.astro` — the fixed-left-sidebar layout was
  tried and deliberately dropped in favor of the full-screen scroll-snap
  deck (see DESIGN.md's "Why this shape"). If you ever see references to
  `Sidebar.astro` elsewhere, that's stale — `Header.astro` is current.
- `src/pages/index.astro` — imports `Layout.astro`, wraps everything in
  it, and contains every section's markup directly and hardcoded, **in
  this exact order**: Intro (the hero, `data-theme="dark"`), About,
  Experience, Work on the side (`id="projects"`), Off the clock,
  Education, Publications, Footer. Every section is `<section id="..."
  class="reveal">` wrapping one `<div class="slide-inner">` — see
  DESIGN.md's "Deck mechanics" for exactly why that wrapper is required
  and what breaks without it. The one exception is the lightbox
  (`<div id="lightbox-rack">`), which sits as its own top-level sibling,
  not inside a section.
- `src/scripts/reveal.js` — plain vanilla JS doing three related jobs in
  one file, not three separate scripts: (1) `IntersectionObserver` for
  the `.reveal` fade-up class, (2) deck tracking — a second
  `IntersectionObserver` using `rootMargin: '-45% 0px -45% 0px'` (not a
  `threshold` on the target's own size, which breaks for any section
  taller than one viewport) to update the slide counter and move
  `aria-current` on the active nav link, (3) `ArrowDown`/`ArrowUp`
  keydown paging between slides via `scrollIntoView`, respecting
  `prefers-reduced-motion`. Full code for all three in DESIGN.md's "Deck
  mechanics" section — copy it, this took several iterations to get
  right and a plausible-looking rewrite will likely reintroduce the
  `threshold: 0.5` bug. It lives under `src/`, so load it with a
  **relative** `src=` path and no other attributes, e.g. `<script
  src="../scripts/reveal.js">` from `Layout.astro` — Astro bundles and
  processes this form automatically. Do not use an absolute path like
  `/scripts/reveal.js` or `is:inline` for this file; those only apply to
  scripts served as-is from `public/`, and this file isn't there.
- `src/styles/global.css` — currently just `@import "tailwindcss";` (one
  line, no theme tokens yet — check it yourself before assuming
  otherwise). You need to add the full `@theme {}` block from
  `DESIGN.md`'s Color Palette and Typography sections (all `--color-*`
  and `--font-*` tokens), the `section[data-theme="dark"]` token-override
  block, the deck/scroll-snap CSS, and the `.reveal` animation rules —
  all from DESIGN.md. This is foundational — do it first, before any
  component references a token or class that doesn't exist yet.

Images already exist in the repo as real binary JPEG photos — a marathon
finish-line shot and a home-lab rack photo, hundreds of KB to several MB
each, not placeholders. `/images/minh.jpeg` and `/images/pc_rack.jpg` are
the **web paths** you reference in markup (Astro serves everything under
`public/` at the site root). On disk, the same files are at
`public/images/minh.jpeg` and `public/images/pc_rack.jpg` — that's the
path to use with `ls`/`read`/any filesystem check. Checking the wrong
path (e.g. `images/` from the project root instead of `public/images/`)
and getting "not found" is a path mistake, not evidence the files are
missing.

**These two files are protected. Never write to them, under any
circumstance** — no placeholder content, no regeneration, no `cat > ...
<< EOF`, nothing. If a check makes it look like they don't exist, that
check is wrong: stop, verify the exact path above, and if they are
somehow genuinely missing, say so and stop instead of creating a
replacement yourself. A one-line text file named `minh.jpeg` is not an
acceptable substitute for a photo — it will pass no test that matters
and destroys a real file that cannot be regenerated by writing code.
Do not invent different filenames, and do not rename or move these
files. `CONTENT.md` and `DESIGN.md` both reference these same two exact
filenames — all three spec files agree, there is no other name to
consider.

## Task tracking — mandatory before writing any code

This has been skipped three build attempts in a row despite being
marked mandatory below — treat it as a hard precondition, not a
suggestion you can get to later: **if `todowrite` has not been called
yet in this session, do not call `write` or `edit` on any file.**
Calling `todowrite` is the first tool call of the build round, full
stop, before touching `global.css` or anything else.

Call `todowrite` once with the file manifest above as five discrete
items, in build order: `global.css`
theme tokens, `Header.astro`, `Layout.astro`, `reveal.js`,
`index.astro`.

Each item's text must state its own definition of done inline — not
just a filename. A todo item that just says `Header.astro` is not
usable; it must say what "done" means for that specific item. Derive
that from the artifact's type, using this table:

| Artifact type | Definition of done |
|---|---|
| Config/data file nothing else renders yet (`global.css`'s theme tokens) | `npm run build` passes AND every `--color-*`/`--font-*` token DESIGN.md lists actually exists in the file, including the `section[data-theme="dark"]` override block (check by reading it back, don't assume) |
| Script/asset not yet mounted on a page (`reveal.js`) | `npm run build` passes AND the exact URL it will be loaded from actually resolves (curl/fetch it once the dev server is up — this is a 404 check, not a full browser check) |
| Component with no independent render target (`Header.astro` before `Layout.astro` exists) | Cannot be `completed` alone. Leave it `in_progress`; its done-check is deferred to the first item that mounts it on an actual page |
| First page a set of components gets mounted on (`Layout.astro`, once it wraps `Header.astro`) | `npm run build` passes AND an `agent-browser` check scoped to only what should already be true at this point (e.g. top nav visible and sticky, all 7 nav links present, no console errors) — not the full final spec, since the rest of the page legitimately doesn't exist yet |
| Final deliverable (`index.astro`) | `npm run build` passes AND the full Visual validation checklist below (all seven sections in the correct order, exactly one dark slide, deck mechanics working, full DESIGN.md compliance, no console errors) |

Mark an item `in_progress` when you start it, and `completed` only once
its own stated done-check has actually been run and passed in the
current turn — not when the file merely exists.

This list is the source of truth for how far the build actually got,
not a guess from inspecting file contents. If you are resuming a
session that already has a todo list, read it first and continue from
the first item that isn't `completed` — don't restart from file
inspection, and don't re-plan from scratch. An incomplete todo list is
itself a reason the build isn't done: never report the build complete
while any item is not `completed`.

## Repeated failures — delegate, don't keep guessing

If any single command — `npm run build`, `npx astro dev status`, or
anything else — fails with the same error two times in a row, stop
trying inline fixes on the third attempt. Use the `task` tool to
delegate to the `explore` subagent: give it the exact command, the
exact error output, and the file(s) involved, and ask it to find the
actual root cause (reading the relevant code, checking Astro docs via
Context7 if needed). Apply the fix it reports back yourself. A
subagent starts with a clean context instead of the same reasoning
that already failed twice — use that instead of repeating a fix that
didn't work.

## Build validation — mandatory after every file

After writing or editing any `.astro` file, run `npm run build`.

- If it does not exit 0, the file is not done. Read the exact compiler
  error (file, line, column), fix only that error, and rebuild. Do not
  move on to the next file with a known-broken build.
- Never report a phase or the build as complete while the last
  `npm run build` you actually ran failed. "I ran the build earlier and
  it failed, but I'm continuing anyway" is not an acceptable state to
  hand back — fix it or say explicitly that it's still broken and why.
- Prefer the `write`/`edit` tools over `bash cat > file << EOF` heredocs
  for anything longer than a couple of lines — heredoc quoting is an
  extra way to corrupt a file that the write/edit tools don't have.

## Development

`astro` is a local dependency, not a global binary — running the bare
`astro` command fails with "command not found". Always go through `npx`:

```
npx astro dev --background
```

Manage the background server with `npx astro dev stop`,
`npx astro dev status`, and `npx astro dev logs`.

## Documentation — read these before writing any plan or any code

This is a required action, not a suggestion. In the **planning round**,
before producing the build plan, use the Context7 MCP tools to pull the
real Astro docs, then write one or two sentences per topic on what you
learned that's relevant to this build. Do not skip this because the
information looks like it's already summarized elsewhere in this file —
the summaries above exist to correct specific past mistakes, not to
replace reading the primitive itself.

1. Call `resolve-library-id` with library name `astro` to get the
   Context7-compatible library ID (expect something like
   `/withastro/astro`).
2. Call `get-library-docs` with that ID and topic `components` — this
   covers the component model, which is the single most important topic
   here: it is the source of truth for the "correct shape" section
   above. If anything above ever seems to disagree with what this
   returns, the docs win.
3. Call `get-library-docs` again with topic `styling` or `tailwind` — how
   `@theme` and Tailwind v4 integrate in Astro specifically, to confirm
   the auto-generated-utility-class behavior described above.

Do not pull docs on routing, content collections, framework components,
or i18n — this build has one static page, no dynamic routes, no content
collections, no other UI framework, and one language. Those topics are
not relevant here and pulling them just spends context on things this
build doesn't do.

If the Context7 MCP tools are unavailable for any reason, fall back to
`webfetch` on these two pages instead of skipping this step:
https://docs.astro.build/en/basics/astro-components/ and
https://docs.astro.build/en/guides/styling/. Full documentation for
anything not covered above: https://docs.astro.build

## Visual validation — mandatory before declaring the build done

`npm run build` only proves the code compiles. It does not prove the
page looks right, that a script doesn't error at runtime, or that an
image path resolves. Passing it is necessary but not sufficient. Before
reporting Phase 4 or the build as complete, do all of the following
using the `agent-browser` CLI.

**Do not use Playwright for this, in any form.** Not the Playwright MCP
server, not `npx playwright install`, not `import('playwright')` or
`import('playwright-core')` in a raw Node script, not a
`validate.mjs`/similar hand-rolled script. Every one of those was tried
on this project and burned real time on dead ends: the MCP server
defaulted to a system Chrome channel that doesn't exist on this machine
(`Chromium distribution 'chrome' is not found at /opt/google/chrome`),
and raw scripts hit missing-module and browsers-can't-self-install
errors since `playwright` was never a project dependency. Playwright is
retired from this workflow entirely — use `agent-browser` instead, which
is already installed globally as a CLI (`agent-browser --help` to
confirm) and needs no project dependency and no MCP server.

`agent-browser` is a real browser automation CLI (`vercel-labs/agent-browser`,
`agent-browser.dev`), driven with plain shell commands, not tool calls:

```
agent-browser open <url> --args "--no-sandbox"   # first navigate only
agent-browser screenshot [path]                  # add --full for full-page
agent-browser console                            # view captured console logs
agent-browser get text <selector>
agent-browser eval <js>
agent-browser close
```

The `--args "--no-sandbox"` flag is required on the **first** `open` of
a session in this environment — Chromium's user-namespace sandbox isn't
available in this container, and launch fails with `No usable sandbox!`
without it. Subsequent commands in the same session (`screenshot`,
`click`, `get`, `eval`, ...) don't need the flag repeated. Run
`agent-browser skills get core --full` once if you want the fuller
command reference and copy-paste examples; it ships with the CLI.

1. Make sure the dev server is running (`npx astro dev --background`;
   check the actual port with `npx astro dev status` — don't assume 4321).
2. Navigate to the site's URL and take a full-page screenshot of `#intro`.
3. Capture browser console output for the page load (`agent-browser
   console`). Any error-level console message (a failed `reveal.js`
   script, a broken import, a thrown exception) is a build defect
   exactly like a failed `npm run build` — go fix it, don't note it and
   move on.
4. Scroll through **every one of the 7 sections in order** (`agent-browser
   eval "document.getElementById('...').scrollIntoView()"`, one call per
   section — `intro`, `about`, `experience`, `projects`, `off`,
   `education`, `publications`), screenshotting each. For `experience`
   and `projects` (the two sections taller than one screen), also
   scroll to the bottom of that section specifically and screenshot
   again — a bug that only shows up in a tall section's later items
   (like the `threshold: 0.5` counter bug did) will not be visible from
   the top of the section alone.
5. Check both images actually loaded (no broken-image icon, no 404 in
   the network/console output): the portrait in `#intro`, and the
   home-lab photo — which only loads when you actually click "View
   photo →" and open the lightbox, so click it and screenshot the
   lightbox open, don't just check the closed page.
6. Compare every screenshot against `DESIGN.md`'s spec before calling
   anything done:
   - Sticky top nav (not a sidebar) with all 7 numbered links, `01.
     Intro` through `07. Publications`.
   - **Exactly one dark slide — `#intro` — and no other section.** If
     any other section rendered dark, that's the alternating-color bug
     from an earlier build; go back to "one dark slide only" in
     DESIGN.md.
   - Everywhere else: warm off-white background (never pure white
     `#FFFFFF`), the olive/brown accent pair and nothing else
     non-neutral (no blue, indigo, green, or gradient anywhere).
   - Geist/Geist Mono/DM Sans actually rendering (if a fallback system
     font is visibly in use, the `<link>` or `@theme` font tokens are
     wrong, not the screenshot).
   - The slide counter (bottom-right, `NN/07`) and the active nav link
     both update correctly as you scroll — check this specifically
     while scrolled into the *middle* of `experience` (a tall section),
     not just at a short section's top edge.
   - Work on the side renders as a quiet list (hairline dividers), not
     a card grid with thumbnail images.

If step 3 finds a console error, or step 6 finds a spec violation, treat
it exactly like a failed build: fix it, then repeat validation from step
2. Only report the build complete once every section has actually been
screenshotted and checked against this list in the current turn — a
screenshot from an earlier phase, or from only the top of the page,
doesn't count.

Navigating to `#intro` once and then stopping the dev server is not this
checklist — that has happened before and let bugs that only show up
lower in the page (a broken counter on a tall section, a second section
that went dark) go unnoticed. All six steps have to actually run, in
order, in the same turn, scrolled through every section — not just the
first screenful. If you stop the dev server before you've done all six,
the visual validation has not happened yet, no matter how many times
you've opened the browser.
