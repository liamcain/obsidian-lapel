# Build & Test

Lapel is a single-file Obsidian plugin bundled by [esbuild](esbuild.config.mjs). There is no automated test suite; verification is a combination of linting, a clean production build, and manual smoke testing inside Obsidian.

## Prerequisites

- Node.js (the GitHub Actions release workflow uses Node 18; any recent LTS works locally).
- pnpm. The lockfile is `pnpm-lock.yaml`; do not use `npm` or `yarn` (they will produce a different lockfile and may resolve different versions).

Install dependencies once:

```bash
pnpm install
```

## Build commands

Defined in [package.json](package.json):

| Command          | What it does                                                                 |
| ---------------- | ---------------------------------------------------------------------------- |
| `pnpm run lint`  | Runs ESLint over `**/*.ts`. Must pass before a release.                      |
| `pnpm run dev`   | Runs esbuild in watch mode with inline sourcemaps; outputs `main.js`.        |
| `pnpm run build` | Runs `lint`, then a minified production esbuild. Output: `main.js` (no map). |

Production output is a single `main.js` written to the repo root (see `outfile` in [esbuild.config.mjs](esbuild.config.mjs)). `manifest.json` and `styles.css` are checked in and shipped as-is.

## Local development against an Obsidian vault

esbuild does not auto-copy the build into a vault. Two common workflows:

1. **Symlink the repo into a test vault's plugin folder:**

   ```bash
   ln -s "$PWD" "/path/to/TestVault/.obsidian/plugins/lapel"
   ```

   Then `pnpm run dev` rebuilds `main.js` in place; reload the plugin in Obsidian (Settings → Community plugins → toggle off/on, or use the *Hot Reload* community plugin) to pick up changes.

2. **Build and copy:**

   ```bash
   pnpm run build
   cp main.js manifest.json styles.css /path/to/TestVault/.obsidian/plugins/lapel/
   ```

## What "build tested" means for this plugin

There are no unit tests. Before merging or releasing, verify:

1. **Lint is clean** — `pnpm run lint` exits 0. CI ([`.github/workflows/main.yml`](.github/workflows/main.yml)) enforces this on push and PRs to `main`.
2. **Production build succeeds** — `pnpm run build` produces a `main.js` without errors or warnings.
3. **Manual smoke test in Obsidian** — load the built plugin in a real vault and confirm:
   - The gutter markers appear next to each heading in the editor.
   - Clicking a marker opens the heading-level menu; selecting a level rewrites the heading correctly.
   - Toggling the "show before/after line numbers" setting moves the gutter as expected.
   - Markers disappear inside table cell editors (regression covered by [`a2222e1`](https://github.com/liamcain/obsidian-lapel/commit/a2222e1)).
   - Folded headings still change level cleanly without wiping the block (regression covered by [`8da90a4`](https://github.com/liamcain/obsidian-lapel/commit/8da90a4)).
   - RTL mode aligns markers correctly (regression covered by [`dc0b699`](https://github.com/liamcain/obsidian-lapel/commit/dc0b699)).
4. **Sanity check on a popout window** — the menu should attach to the correct window (regression covered by [`2214276`](https://github.com/liamcain/obsidian-lapel/commit/2214276)).

If you add behavior that is not covered above, extend this checklist in the same PR.

## Continuous integration

[`main.yml`](.github/workflows/main.yml) runs on every push and PR to `main` and executes `pnpm run lint`. It does *not* run a production build today; if you change `esbuild.config.mjs` or external dependencies, run `pnpm run build` locally before pushing.
