# Commit Message Rules

This repo follows [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must match:

```
<type>(<scope>): <subject>
```

The scope is optional; the colon and space after the type (or scope) are required.

## Allowed types

This repo follows the [Angular commit type convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#type) that the Conventional Commits spec recommends. Use one of:

| Type       | Use for                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------- |
| `feat`     | A new user-visible feature or setting                                                    |
| `fix`      | A bug fix                                                                                |
| `perf`     | A change that improves performance without changing behavior                             |
| `refactor` | A code change that neither fixes a bug nor adds a feature                                |
| `style`    | Formatting / whitespace changes that do not affect meaning (Prettier, ESLint --fix)      |
| `test`     | Adding or correcting tests                                                               |
| `docs`     | Documentation only (`README.md`, `AGENTS.md`, `BUILD.md`, `CONTRIBUTING.md`, code docs)  |
| `build`    | Build system, bundler config, package manager, lockfile, dependencies (`esbuild.config.mjs`, `package.json` scripts/deps, `pnpm-lock.yaml`, `versions.json`) |
| `ci`       | GitHub Actions workflows under `.github/workflows/`                                      |
| `chore`    | Maintenance work that does not fit the categories above (e.g. release version bumps)     |

If a change touches multiple types, pick the one that best describes the *primary* purpose of the commit. If two types feel equally important, that is usually a sign the change should be split into two commits.

## Allowed scopes

Scopes are optional. The most common one in this repo's history is `release`, used for version-bump commits:

- `chore(release): 0.1.6` — version bump in `manifest.json` / `package.json` (and `versions.json` if `minAppVersion` changed)

Otherwise, prefer no scope unless adding one genuinely clarifies the change. Do not invent new scopes ad-hoc.

## Subject rules

- Use the imperative mood ("Add menu", not "Added menu" or "Adds menu").
- Capitalize the first word of the subject. (Existing history is mixed; prefer capitalized going forward to match the more recent commits.)
- No trailing period.
- Keep the subject under ~72 characters. If you need more detail, use the body.
- Reference PRs in the subject only when the change is "this PR's followup" (e.g. `fix: readd missing return statement after PR #29`). Otherwise let GitHub link the PR.

## Body (optional)

Use a body when the *what* in the subject does not explain the *why*, or when the change has multiple notable points.

- Separate the body from the subject with a blank line.
- Wrap at ~72 characters.
- Bullet lists are fine; the existing history uses `*` bullets (see `fix: Improve heading menu click behavior`).

## Release commits

Cut releases with a dedicated commit:

```
chore(release): 0.1.6
```

The version number must match the new `version` in `manifest.json` and `package.json`. Do not combine a release bump with feature or fix changes — release commits should touch only version metadata (and `versions.json` when the minimum Obsidian version changes).

## Examples

Good:

- `feat: Add setting to display before or after line numbers`
- `fix: Hide gutter inside table cell editor`
- `perf: update and redraw the markers if necessary`
- `build: Switch from npm to pnpm`
- `ci: Cache pnpm store between runs`
- `docs: Document the release process`
- `chore(release): 0.1.5`

Avoid:

- `tmp`, `Qf`, `Cleanup` — not descriptive (these exist in sibling repos but should not be repeated here)
- `Update README` — be specific: `docs: Document gutter position setting`
- Mixing a release bump with a code change in one commit
