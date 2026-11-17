# Droumond Productions website

The public website of Droumond Productions, a Portuguese audiovisual production company. Static site in Astro, with Tailwind. The context and open decisions are in `BRIEFING.md`; the vocabulary is in `GLOSSARY.md`.

## Install

With Node 24 (`nvm use` reads `.nvmrc`):

```sh
npm ci
npx playwright install chromium webkit
```

The second command downloads the browsers the tests use. On a Linux machine that never ran Playwright, add `--with-deps` to also install their system libraries.

## Commands

| Command              | What it does                                                     |
| :------------------- | :--------------------------------------------------------------- |
| `npm run dev`        | Development server on `localhost:4321`, reloads on each change   |
| `npm run check`      | Checks the types (`astro check`)                                 |
| `npm run format`     | Formats the code with Prettier                                   |
| `npm run build`      | Builds the site into `dist/`: plain HTML, CSS and images         |
| `npm run preview`    | Serves `dist/` on `localhost:4321`, as the hosting would         |
| `npm test`           | Playwright suite over `dist/`, which must already exist          |
| `npm run lighthouse` | Lighthouse in mobile mode over every page of `dist/` (see below) |
| `npm run verify`     | Check, formatting, build, tests and Lighthouse, in that order    |

`npm test` serves `dist/` itself on port 4341 (not 4331 or 4332, which Julien's landing page uses). To run part of it: `npm test -- --project=chromium` or `npm test -- tests/home-page.spec.ts`.

## Branches

- `main` only receives releases: each merge into it will publish the site (#11).
- `develop` is where work lands. Start each branch from it and open the PR into it. Those PRs run the quick checks: Playwright on Chromium only, no Lighthouse run.
- Release: a PR from `develop` into `main`, which runs every check. Merge it with a merge commit, never a squash, so both branches keep the same history.
- Hotfix: a branch from `main`, a PR into `main`, then `main` merged into `develop`.

## Where things live

- `src/pages/`: one file per page; the file's path is the page's address (`index.astro` is `/`).
- `src/layouts/Base.astro`: the `<html>` and `<head>` shared by every page, with the page's language (`pt-PT`).
- `src/styles/global.css`: Tailwind. The site's colours and font come with #12.
- `tests/`: the Playwright suite. `all-pages.spec.ts` runs axe (WCAG A and AA) on every page found in `dist/`, so a new page is checked without touching the tests.
- `tests/lighthouse/`: Lighthouse in mobile mode, over every page of `dist/`. SEO, page weight (400 KB), JS weight (75 KB), fonts (at most 2, in woff2) and requests to other domains block. Performance, LCP and TBT only warn; CLS, accessibility and best practices only show in the summary. The HTML reports go to `lighthouse-report/`. `check.spec.ts` tests the checker itself on pages made to fail each target.
- `.github/workflows/ci.yml`: the `Checks` workflow, on each PR. Into `main`: Chromium in 1 job, WebKit in 3, and Lighthouse. Into any other branch: Chromium in 4 jobs. The steps live in `.github/actions/verify/`.
- `.github/dependabot.yml`: once a month, a PR into `develop` for the actions and another for npm.
