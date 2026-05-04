# Contributing & Releasing

This document describes how releases are cut for the **Lapel** plugin (`id: lapel`). For commit conventions see [AGENTS.md](AGENTS.md); for build/test expectations see [BUILD.md](BUILD.md).

## Release model

Releases are **tag-driven**. Pushing a Git tag to GitHub triggers [`.github/workflows/publish.yml`](.github/workflows/publish.yml), which builds the plugin and creates a GitHub Release with the artifacts attached.

The tag itself is the trigger — the workflow matches `tags: ["*"]`, so any tag pushed to the repo will publish a release. Use plain semver tags (`0.1.6`, not `v0.1.6`) to match the existing tag history.

Existing tags, newest first: `0.1.6`, `0.1.5`, `0.1.4`, `0.1.3`, `0.1.2`, `0.1.1`, `0.1.0`, `0.0.3`, `0.0.2`, `0.0.1`.

## Versioning

Lapel follows [Semantic Versioning](https://semver.org/). The version lives in three places that **must agree**:

| File            | Field                            |
| --------------- | -------------------------------- |
| `manifest.json` | `version`                        |
| `package.json`  | `version`                        |
| `versions.json` | newest key (when `minAppVersion` of `manifest.json` changes) |

`versions.json` maps each plugin version that bumped the minimum Obsidian version to the required Obsidian version. Only add an entry when `manifest.json`'s `minAppVersion` changes — otherwise leave it alone.

## Cutting a release

1. **Confirm the build is healthy.** From a clean tree on `main`:

   ```bash
   pnpm install
   pnpm run build
   ```

   See [BUILD.md](BUILD.md) for the full pre-release checklist (lint, build, manual smoke test in Obsidian).

2. **Bump the version.** Update `version` in both `manifest.json` and `package.json` to the new value. If you raised `minAppVersion`, add a new entry to `versions.json` mapping the new plugin version to the new minimum Obsidian version.

3. **Commit using the release convention.** One commit, version metadata only:

   ```bash
   git add manifest.json package.json versions.json
   git commit -m "chore(release): 0.1.7"
   ```

4. **Tag and push.** The tag must match the version in `manifest.json` exactly:

   ```bash
   git tag 0.1.7
   git push origin main
   git push origin 0.1.7
   ```

5. **Watch the workflow.** [`publish.yml`](.github/workflows/publish.yml) will:
   - Check out the tag.
   - Install dependencies (`pnpm install --frozen-lockfile`) and run `pnpm run build`.
   - Zip up `main.js`, `manifest.json`, and `styles.css`.
   - Create a GitHub Release named after the tag (e.g. `refs/tags/0.1.7`).
   - Upload the zip plus loose `main.js`, `manifest.json`, and `styles.css` as release assets.

6. **Verify the GitHub Release.** Confirm all four assets are attached. The Obsidian community plugins directory pulls `main.js`, `manifest.json`, and `styles.css` directly from the release by tag, so missing assets will break installations.

## Known issues with the publish workflow

A couple of things in [`publish.yml`](.github/workflows/publish.yml) are worth fixing the next time someone touches it:

- **`PLUGIN_NAME: creases`** is a leftover from a copy-paste. The zip artifact is currently named `creases-<tag>.zip` instead of `lapel-<tag>.zip`. The loose assets are unaffected, so installations still work, but the zip is misleading. Change `env.PLUGIN_NAME` to `lapel`.
- **`actions/create-release@v1` and `actions/upload-release-asset@v1`** are archived and use the deprecated `::set-output` syntax. They still run, but plan to migrate to `softprops/action-gh-release` next time you edit this file.
- **`versions.json` is stale.** It stops at `0.1.2`. Bring it up to date the next time `minAppVersion` changes (or as a one-off cleanup).

## Hotfixes

If you need to ship a fix without a feature release:

1. Branch from the tag of the last release (`git checkout -b hotfix/0.1.7 0.1.6`) only if `main` has unreleased changes you want to leave out. Otherwise just work on `main`.
2. Land the fix as a normal `fix:` commit.
3. Cut a patch release using the steps above (`0.1.6` → `0.1.7`).

## Pre-releases

The history shows no pre-release tags for Lapel. If you need one, use a semver pre-release suffix (`0.2.0-beta.1`) and edit the resulting GitHub Release to mark it **Pre-release** — `publish.yml` currently sets `prerelease: false` unconditionally, so you must flip the flag manually in the GitHub UI (or update the workflow first).
