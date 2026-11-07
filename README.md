# becvar-site

Personal portfolio website of **Lukáš Bečvář**, a backend developer focused on PHP/Symfony, Linux and DevOps.

It is a fully static site written in plain HTML, CSS and vanilla JavaScript. It has no framework, no build step and no dependencies.

## Features

- Hero section with an animated name, a typing effect cycling through roles and an animated terminal
- Stats with count-up animation, a technology marquee, about, services and skills sections
- Project list with filters for active, all and archived projects, generated from data in `main.js`
- Scroll-reveal animations, scroll progress bar, parallax background and hover spotlight effects
- Responsive layout (breakpoints at 1024 / 860 / 600 px)
- Respects `prefers-reduced-motion`: most animations are disabled when the OS asks for reduced motion

## Project structure

```
.
├── index.html          # page markup and content
├── style.css           # all styles (design tokens in :root)
├── main.js             # interactivity, animations and project data
├── serve.py            # local development server
└── assets/
    ├── bg.webp         # hero / contact background
    ├── og-image.jpeg   # social sharing image
    ├── favicon.png
    ├── bootstrap-icons.css
    └── fonts/          # Bootstrap Icons webfonts
```

## Running locally

You can open `index.html` directly in a browser, or use the bundled development server, which disables caching so CSS and JS changes show up on a normal refresh:

```bash
python3 serve.py            # http://localhost:8000
python3 serve.py 3000       # custom port
python3 serve.py --open     # open the browser automatically
python3 serve.py --host 0.0.0.0   # make it reachable from other devices on the network
```

Requires Python 3 and uses only the standard library.

## Editing content

| What | Where |
|---|---|
| Roles in the typing effect | `data-words` attribute on `#typed` in `index.html` (separated by `\|`) |
| Projects | `PROJECTS` array at the top of `main.js` (`status: 'open'` or `'closed'`, `featured: true` to highlight) |
| Language colors | `LANG_COLORS` in `main.js` |
| Birth date / start year (age and years of experience) | `BIRTH` and `START_YEAR` in `main.js` |
| Terminal animation | `TERM_SCRIPT` in `main.js` |
| Colors, fonts, spacing | CSS variables in `:root` in `style.css` |

## Deployment

Upload the repository contents (except `serve.py`) to any static web host, for example GitHub Pages, Netlify, Cloudflare Pages or plain nginx/Apache.

## Credits

- [Bootstrap Icons](https://icons.getbootstrap.com/) (MIT)
- Fonts: [Manrope](https://fonts.google.com/specimen/Manrope) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts
