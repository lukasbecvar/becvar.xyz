# becvar.xyz

Personal portfolio website of **Lukáš Bečvář**, a backend developer focused on PHP/Symfony, Linux, DevOps and AI automation.
Live at **[becvar.xyz](https://becvar.xyz)**.

The site is built with [Vite](https://vite.dev) into a fully static bundle. Everything is served from its own domain: fonts, icons, images and scripts are all bundled at build time, with **no CDN and no third-party requests**.

## Features

- English by default, with a Czech translation (switch in the header, remembered in `localStorage`, or forced with `?lang=cs`)
- Animated hero with a typing effect, terminal, letter-by-letter name and glows that follow the mouse
- Experience timeline, services, skills, and a filterable project list generated from data
- Scroll-reveal animations, count-up stats, scroll progress, parallax and hover spotlight effects
- Respects `prefers-reduced-motion`
- SEO: canonical URL, `hreflang`, Open Graph and Twitter cards, JSON-LD `Person`, `sitemap.xml`, `robots.txt`
- Self-hosted fonts via Fontsource (latin and latin-ext only)
- Tree-shaken Bootstrap Icons: a Vite plugin embeds only the SVG icons that are used, instead of the whole icon font
- Custom 404 page

## Requirements

- Node.js **20.19+** or **22.12+** (see `.nvmrc`)
- npm

## Getting started

```bash
npm install
npm run dev        # dev server with hot reload at http://localhost:5173
```

## Scripts

| Command            | Description                                   |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Start the development server                  |
| `npm run build`    | Build the static site into `dist/`            |
| `npm run preview`  | Serve the production build locally            |
| `npm run lint`     | Run ESLint and check formatting with Prettier |
| `npm run lint:fix` | Auto-fix lint issues and format all files     |
| `npm run format`   | Format all files with Prettier                |
| `npm run check`    | Lint and build (the same steps CI runs)       |

## Project structure

```
.
├── index.html              # page markup; English texts live here
├── 404.html                # not-found page
├── public/                 # copied as-is to dist/ (CNAME, favicon, OG image, robots, sitemap, manifest)
├── src/
│   ├── main.js             # entry point: imports fonts, icons and styles, then initializes modules
│   ├── 404.js              # entry point for the 404 page
│   ├── assets/             # images processed by Vite (hashed file names)
│   ├── data/
│   │   ├── projects.js     # project list (EN + CS descriptions, status, language)
│   │   └── profile.js      # birth date and coding start year
│   ├── i18n/
│   │   └── cs.js           # Czech translations
│   ├── js/                 # feature modules (header, hero, terminal, projects, contact, effects, i18n)
│   └── styles/
│       └── main.css        # all styles (design tokens in :root)
├── vite.config.js          # build config and icon-subsetting plugin
└── .github/workflows/      # CI and deploy pipelines
```

## Editing content

| What                           | Where                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| Texts (English)                | `index.html`, on elements with a `data-i18n` key                                       |
| Texts (Czech)                  | `src/i18n/cs.js`, under the same key                                                   |
| Roles in the typing effect     | `data-words` on `#typed` in `index.html` (EN) and `TYPED_WORDS_CS` in `src/i18n/cs.js` |
| Projects                       | `src/data/projects.js` (`status: 'open'` / `'closed'`, `featured: true` to highlight)  |
| Experience timeline            | `#experience` section in `index.html`                                                  |
| Terminal animation             | `src/js/terminal.js`                                                                   |
| Birth date / coding start year | `src/data/profile.js`                                                                  |
| Colors, fonts, spacing         | CSS variables in `:root` in `src/styles/main.css`                                      |

To translate a new text, add `data-i18n="some.key"` to the element in `index.html` and add `'some.key': '…'` to `src/i18n/cs.js`. For attributes, use `data-i18n-attr="aria-label:some.key"`.

Icons use [Bootstrap Icons](https://icons.getbootstrap.com/) class names (`<i class="bi bi-github"></i>`). Any `bi-*` class used in `index.html` or `src/` is picked up by the build automatically.

## Deployment

Every push to `main` runs the **Build, release & deploy** workflow (`.github/workflows/deploy.yml`):

1. Install dependencies, lint and build
2. Package `dist/` as `becvar.xyz-vX.Y.Z-build.N.tar.gz` and publish it as a **GitHub release**
3. Deploy `dist/` to **GitHub Pages**

Pull requests run lint and build only (`.github/workflows/ci.yml`).

### One-time GitHub setup

1. Create the repository and push `main`.
2. Go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Custom domain: `public/CNAME` contains `becvar.xyz`. In DNS, point the apex domain to GitHub Pages with `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and add a `CNAME` record for `www` pointing to `<user>.github.io`. Then enable **Enforce HTTPS**.

### Self-hosting

The build is plain static files, so you can serve them from any web server:

```bash
npm run build                 # or download the .tar.gz from a GitHub release
rsync -av dist/ server:/var/www/becvar.xyz/
```

Serve `404.html` for missing pages. In nginx, that is `error_page 404 /404.html;`.

## Credits

- [Bootstrap Icons](https://icons.getbootstrap.com/) (MIT)
- [Manrope](https://fonts.google.com/specimen/Manrope) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (SIL OFL), self-hosted via [Fontsource](https://fontsource.org)

## License

The source code is licensed under the [MIT License](LICENSE) © 2026 Lukáš Bečvář.

The personal content of the site (texts about me, my photo/logo and the background image) is not meant for reuse. If you fork this project as a template for your own portfolio, please replace it with your own.

Third-party assets keep their own licenses: Bootstrap Icons (MIT) and the Manrope and JetBrains Mono fonts (SIL Open Font License 1.1).
