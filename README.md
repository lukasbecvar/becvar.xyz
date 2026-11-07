# becvar.xyz

Personal portfolio website of Lukáš Bečvář – live at [becvar.xyz](https://becvar.xyz).

A static site built with [Vite](https://vite.dev). Fonts, icons and images are bundled into the build, so nothing is loaded from a CDN. Every push to `main` builds the site, publishes a `.tar.gz` release and deploys it to GitHub Pages.

## Requirements

- Node.js 22 (see `.nvmrc`)
- npm

## Commands

```bash
npm install            # install dependencies
npm start              # start the dev server at http://localhost:5173 (same as npm run dev)
npm run build          # build the static site into dist/
npm run preview        # serve the built site locally
npm run lint           # check code with ESLint and Prettier
npm run lint:fix       # fix lint issues and format all files
npm run format         # format all files
npm run check          # lint and build
npm run clean          # delete dist/, node_modules/ and .tar.gz archives
npm run clean:install  # clean everything and reinstall dependencies
```

## License

[MIT](LICENSE) © 2026 Lukáš Bečvář
