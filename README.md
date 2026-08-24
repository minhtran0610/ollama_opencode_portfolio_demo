# Minh Tran — Portfolio (Ollama × OpenCode demo)

A personal portfolio site, and a live experiment in spec-driven
development with AI coding agents.

The site itself is a full-screen, scroll-snap "deck" (seven numbered
slides: Intro, About, Experience, Projects, Off the clock, Education,
Publications) built to be clicked through on a laptop/projector at a
Vietnamese tech community meetup in Finland — not a page meant for
casual scrolling.

The repo is also the demo: the whole site is built from three spec
files that any AI coding agent reads before touching code, so the same
build can be handed to different agents/models and compared.

## Spec-driven build

- **`AGENTS.md`** (symlinked as `CLAUDE.md`) — non-negotiable stack
  rules, the exact "correct shape" of an Astro component, file
  manifest, task-tracking and build/visual-validation requirements.
  This is the file an agent is actually instructed against.
- **`CONTENT.md`** — all copy: identity, about, projects, experience,
  education, publications. Content only, no layout instructions.
- **`DESIGN.md`** — the visual system: palette, type, spacing, deck
  mechanics (scroll-snap, slide counter, arrow-key paging), and the
  reasoning behind each major layout decision (why a deck and not a
  sidebar, why exactly one dark slide).

Both `AGENTS.md` and `CLAUDE.md` resolve to the same file, so the same
spec drives OpenCode and Claude Code without drift.

## Branches

- **`main`** — initial Astro scaffold.
- **`update-specs`** (this branch) — the three spec files consolidated
  after a full build-and-review pass; rules were rewritten to name the
  specific mistakes that broke earlier attempts (wrong Astro component
  shape, `threshold: 0.5` intersection-observer bug, alternating
  dark/light sections, etc.) so the next agent doesn't repeat them.
- **`opencode-plan-build`** — a full build of the site (`Header.astro`,
  `Layout.astro`, `reveal.js`, the complete `index.astro`, themed
  `global.css`) produced by [OpenCode](https://opencode.ai) driving a
  local **Ornith-1.5:9b** model through Ollama, following the same specs.

## Stack

- [Astro](https://astro.build) v7 — `.astro` components, no client
  framework, no React/hydration.
- [Tailwind CSS](https://tailwindcss.com) v4 — theme tokens live in
  `@theme {}` inside `src/styles/global.css`; there is no
  `tailwind.config.js`.
- Plain `<script>` tags for interactivity (deck scroll-tracking,
  keyboard paging, reveal-on-scroll).

## Development

```sh
npm install
npx astro dev --background   # astro is a local dep, run it via npx
```

Manage the background dev server with `npx astro dev stop` /
`npx astro dev status` / `npx astro dev logs`.

| Command           | Action                                       |
| :----------------- | :-------------------------------------------- |
| `npm run dev`      | Start the local dev server (`localhost:4321`) |
| `npm run build`    | Build the production site to `./dist/`        |
| `npm run preview`  | Preview the production build locally          |

## Structure

```
src/
├── layouts/Layout.astro       # <html>/<head>, fonts, global.css, Header, slide counter
├── components/Header.astro    # sticky top nav, 7 numbered section links
├── pages/index.astro          # every section, hardcoded, in spec order
├── scripts/reveal.js          # scroll-reveal + deck tracking + arrow-key paging
└── styles/global.css          # Tailwind v4 @theme tokens, dark-slide override, deck CSS
public/images/                 # minh.jpeg (hero portrait), pc_rack.jpg (home-lab photo)
```
