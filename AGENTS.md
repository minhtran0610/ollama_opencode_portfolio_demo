## Stack rules (non-negotiable)

- Astro v6 + Tailwind v4. Components are `.astro` files: `---` JS fence at top, then plain HTML.
- Use `class=`, NEVER `className=`. This is HTML, not JSX.
- No React, no `useState`, no hooks, no `.jsx`/`.tsx` files.
- Tailwind v4: theme lives in `@theme {}` inside `src/styles/global.css`. There is no `tailwind.config.js` — don't create one.
- Never hardcode a hex value or a raw color name in markup. Every color comes from a `--color-*` token defined in `@theme`.
- Interactivity: plain `<script>` tags or CSS only. No client-side framework, no hydration directives (`client:load` etc.) unless explicitly asked.
- Fonts: `<link>` to Google Fonts in the layout `<head>`, then reference via a `--font-*` token in `@theme`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)