# becvar.xyz

Personal portfolio website of Lukáš Bečvář – live at [becvar.xyz](https://becvar.xyz).

A static site built with [Vite](https://vite.dev). Fonts, icons and images are bundled into the build, so nothing is loaded from a CDN. Every push to `main` builds the site, publishes a `.tar.gz` release and deploys it to GitHub Pages.

## Requirements

- Node.js 22 (see `.nvmrc`)
- npm

## Commands

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:5173
npm run build      # build the static site into dist/
npm run preview    # serve the built site locally
npm run lint       # check code with ESLint and Prettier
npm run format     # format all files
```

## License

[MIT](LICENSE) © 2026 Lukáš Bečvář
