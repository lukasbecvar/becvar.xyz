import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = resolve(root, 'node_modules/bootstrap-icons/icons');
const HTML_PAGES = ['index.html', '404.html'];

/** Recursively collect source files that may reference icons. */
function sourceFiles(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return sourceFiles(path);
        return /\.(js|html|css)$/.test(entry.name) ? [path] : [];
    });
}

/**
 * Self-hosted Bootstrap Icons, tree-shaken.
 *
 * Scans the HTML pages and `src/` for `bi-<name>` classes and emits a small CSS
 * module (`virtual:icons.css`) that embeds only those SVGs as CSS masks.
 * No icon font and no CDN – just the handful of icons the site actually uses.
 */
function bootstrapIcons() {
    const VIRTUAL_ID = 'virtual:icons.css';
    const RESOLVED_ID = '\0' + VIRTUAL_ID;

    return {
        name: 'bootstrap-icons-subset',
        resolveId(id) {
            return id === VIRTUAL_ID ? RESOLVED_ID : null;
        },
        load(id) {
            if (id !== RESOLVED_ID) return null;

            const files = [...HTML_PAGES.map((p) => resolve(root, p)), ...sourceFiles(resolve(root, 'src'))];
            const names = new Set();
            for (const file of files) {
                if (!existsSync(file)) continue;
                this.addWatchFile(file);
                for (const [, name] of readFileSync(file, 'utf8').matchAll(/\bbi-([a-z0-9-]+)/g)) {
                    if (existsSync(join(ICONS_DIR, `${name}.svg`))) names.add(name);
                }
            }

            const rules = [...names].sort().map((name) => {
                const svg = readFileSync(join(ICONS_DIR, `${name}.svg`), 'utf8')
                    .replace(/\s+/g, ' ')
                    .replace(/ class="[^"]*"/, '')
                    .trim();
                const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                return `.bi-${name}{--bi:url("${uri}")}`;
            });

            return ['.bi::before{content:"";display:inline-block;width:1em;height:1em;vertical-align:-.125em;', 'background-color:currentColor;-webkit-mask:var(--bi) center/contain no-repeat;', 'mask:var(--bi) center/contain no-repeat}', ...rules].join('\n');
        },
    };
}

export default defineConfig({
    plugins: [bootstrapIcons()],
    build: {
        target: 'es2020',
        cssMinify: true,
        // never inline fonts as base64 – they are cached separately
        assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined),
        rollupOptions: {
            input: Object.fromEntries(HTML_PAGES.map((p) => [p.replace('.html', ''), resolve(root, p)])),
        },
    },
    server: {
        open: true,
    },
});
