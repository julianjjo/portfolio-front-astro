# julian-dev.dev

Source of [julian-dev.dev](https://julian-dev.dev), the personal portfolio of Julian Mican — backend & full stack developer. Built with Astro 4 (SSR) and Tailwind CSS, rendered over an animated neon canvas that drives the site's accent color in real time.

The contact form is backed by [portfolio-back](https://github.com/julianjjo/portfolio-back), a Rust/Rocket API served at `api.julian-dev.dev`.

## Stack

- [Astro 4](https://astro.build) in server output mode, with the Node adapter (middleware mode)
- [Tailwind CSS 3](https://tailwindcss.com) plus a small set of design tokens in `src/layouts/Layout.astro`
- Express (`run-server.mjs`) as the production entry point: serves the static client build, runs the SSR handler, and proxies `/api/*` to the backend

## Getting started

```sh
npm install
npm run dev
```

The dev server runs at `localhost:4321`.

> **Note:** `/api/*` is only proxied by the production server (`run-server.mjs`). In `npm run dev` the contact form's `POST /api/contact_me` has nothing to answer it — point it at a local backend or test the form against a production build (`npm run build && npm start`).

## Commands

| Command           | Action                                                                                     |
| :---------------- | :----------------------------------------------------------------------------------------- |
| `npm install`     | Install dependencies                                                                        |
| `npm run dev`     | Start the dev server at `localhost:4321`                                                    |
| `npm run build`   | Type-check (`astro check`) and build to `./dist/`                                           |
| `npm run preview` | Preview the build locally                                                                   |
| `npm start`       | Run the production server: SSR + static assets + `/api` proxy, on `PORT` (defaults to 4000) |

## Project structure

```text
/
├── public/
├── run-server.mjs          # production entry: express + SSR handler + /api proxy
└── src/
    ├── assets/
    ├── components/         # Canvas, Navbar, ExperienceCards, FormContact, Toast, ...
    ├── icons/
    ├── layouts/
    │   └── Layout.astro    # global styles and design tokens
    └── pages/              # / (about), /experience, /skills, /contact
```

## Design system: the living accent

The background canvas (`src/components/Canvas.astro`) rotates its hue through the full spectrum on a ~60 second cycle and writes the current value to `--accent-h` on `<html>`. Every accent in the UI — eyebrows, hairlines, skill bars, button glow, focus rings, text selection — derives from that variable through the tokens in `src/layouts/Layout.astro` (`--accent`, `--accent-2`, `--accent-soft`, ...), so the whole page drifts in sync with the canvas behind it.

The cycle starts at brand violet (270°). With `prefers-reduced-motion` the canvas renders a still frame instead of animating and the accent stays violet.

Typefaces: **Playfair Display** for display, **Outfit** for body, **IBM Plex Mono** for labels and data.

## Deploying

```sh
npm run build
npm start
```

`npm start` expects the build output in `./dist/` and listens on `PORT` (defaults to 4000).
