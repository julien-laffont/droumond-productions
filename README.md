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

| Command                 | What it does                                                                         |
| :---------------------- | :----------------------------------------------------------------------------------- |
| `npm run dev`           | Development server on `localhost:4321`, reloads on each change                       |
| `npm run check`         | Checks the types (`astro check`)                                                     |
| `npm run format`        | Formats the code with Prettier                                                       |
| `npm run build`         | Builds the site into `dist/`: plain HTML, CSS and images, in the published languages |
| `npm run build:english` | Builds a test site with English too into `dist-en/`, for the tests                   |
| `npm run preview`       | Serves `dist/` on `localhost:4321`, as the hosting would                             |
| `npm test`              | Playwright suite over `dist/` and `dist-en/`, which must already exist               |
| `npm run lighthouse`    | Lighthouse in mobile mode over every page of `dist/` (see below)                     |
| `npm run verify`        | Check, formatting, both builds, tests and Lighthouse, in that order                  |
| `npm run confirm`       | Checks that the published site serves each page of `dist/` with this commit          |

`npm test` serves `dist/` itself on port 4341 and `dist-en/` on 4342 (not 4331 or 4332, which Julien's landing page uses). To run part of it: `npm test -- --project=chromium` or `npm test -- tests/header.spec.ts`.

## Languages and settings

- European Portuguese at `/`, English at `/en/`, with translated addresses and anchors (`/filmagens/` and `/en/filming/`, `#projetos` and `#projects`). No redirection by the browser's language.
- English is only published once its texts are translated: until then `ENGLISH_PUBLISHED` is `false` in `src/config/site.ts`, so `npm run build` makes no `/en/` page and no language button. `npm run build:english` (`ENGLISH=1`) builds with English, so the tests check it now.
- The contact email and the company's legal data live in `src/config/site.ts`: changing the email there changes it on the whole site. `SITE` is the site's address, `https://droumondproductions.com`: the hreflang links use it (only when English is published), and so does the Publishing confirmation.

## Branches

- `main` only receives releases: each merge into it publishes the site (see Publishing).
- `develop` is where work lands. Start each branch from it and open the PR into it. Those PRs run the quick checks: Playwright on Chromium only, no Lighthouse run.
- Release: a PR from `develop` into `main`, which runs every check. Merge it with a merge commit, never a squash, so both branches keep the same history.
- Hotfix: a branch from `main`, a PR into `main`, then a PR from `main` into `develop`.
- Branch rules on `main` and `develop`: changes only arrive through a PR whose Checks passed, merged with a merge commit; no direct push, force push or deletion, for anyone. They live in Settings › Rules.

## Publishing

- Each merge into `main` runs the `Publish` workflow: the Chromium suite and Lighthouse again, then `publish/publish.sh` sends `dist/` over SFTP to the site's folder on the Infomaniak hosting (the same hosting as Julien's landing page), then `npm run confirm` checks that each page answers 200 with this commit, that `/en/` answers 404 while English is unpublished, and that HTTP redirects to HTTPS. Documentation-only merges do not publish.
- The secrets, with the landing page's Portuguese names: `PUBLICACAO_CHAVE_SSH` (the private key of an FTP + SSH account used only by Publishing), `PUBLICACAO_SERVIDOR` and `PUBLICACAO_UTILIZADOR`. Without them, the workflow skips Publishing with a warning. The account's password is not needed: the key is enough.
- Rolling back: a revert PR into `main`. In an emergency, "Re-run all jobs" on an older run of `Publish` publishes that commit again.
- `npm run confirm` also runs by hand, after `npm run build` on the published commit. `PUBLISHED_URL=https://… npm run confirm` points it at another address.

## Where things live

- `src/localized-pages/<language>/`: one thin file per page and language; `src/integrations/localized-pages.ts` gives each its address (`pt/index.astro` is `/`, `en/index.astro` is `/en/`), only for the published languages. `src/pages/` is for pages without a language: the 404 (`404.astro`), which holds both.
- `src/lib/paths.ts`: each page's address and each section's anchor in both languages. A new page goes there too.
- `src/config/site.ts`: the contact email, the legal data, the consumer arbitration centre (it depends on the seat), the profiles, the languages and which ones are published.
- `src/config/projects.ts`: the Projects of the home page, in order, with their texts in both languages, image and link. Their images live in `src/assets/projects/`. A YouTube link becomes a teaser that only loads on click, from `youtube-nocookie.com`; the Privacy Policy describes it.
- `src/config/team.ts`: the Team members of Equipa, in order, with name, role in both languages, photo (4:5, in `src/assets/team/`) and alt text. Adding or removing a person rearranges the grid by itself (`src/lib/team-grid.ts`): never one alone on a row, rows as even as possible, portraits always the same size; at most 5 per row on a desktop and 3 on a tablet (only when 3 or 2 per row would leave one alone, as with 7 people, a tablet row holds more), and one strip that slides sideways below 700 px. Each person's edge codes and grease-pencil ring come from `src/lib/team-sheet.ts` (five hand-drawn rings, in turn). Until #18, Characters stand in for the team under a visible tag, which `TEAM_IS_PROVISIONAL` turns off.
- `src/config/hero.ts`: the photos of the strip that runs across the first screen, in order, after the title card with the logo symbol, and the part of each one its 3:2 frame keeps. Each photo names the files it uses: `src/config/image-files.ts` holds the widths and quality of each section's images, which the strip shares, so its photos add almost nothing to the page's weight.
- `src/content/privacy/`: the Privacy Policy in Markdown, one file per language. Placeholders such as `{email}` and `{legal.nipc}` take their values from `src/config/site.ts` (`src/lib/privacy.ts`); an unknown one fails the build.
- `src/content/about/`: the Sobre section in Markdown, one file per language: the text in the body (`_Efecto Placebo_` shows upright in amber), the image and its alt text in the frontmatter.
- `src/i18n/`: the interface texts, one dictionary per language (English reviewed in #18, except the first screen's (#37), the teaser's (#38), the team's tag and the codes of Sobre and Equipa (#39)).
- `src/layouts/Base.astro`: the `<html>` and `<head>` shared by every page (language, hreflang, icons, fonts, the build's commit), with the header and the footer.
- `src/components/`: the header (with the timecode, the language button and the phone menu), the footer (with the tail of the reel), `Film.astro` (a piece of 35 mm film: sprocket holes and amber edge codes around the frames in its slot), each page's content and the home page's sections: the first screen (`Hero.astro`, with its strip: it only runs with JavaScript, which shows its pause button, rests off screen and stands still with less motion), `Projects.astro`, `About.astro` and `Team.astro` (with its own CSS for the contact sheet, the sliding strip and the grease pencil, which redraws on hover) and the filming band (`FilmingBand.astro`). `Contact.astro` is the Contacto block, on the home page and at the end of the filming page, where its email fills in the subject "Serviço de filmagens"; the header's Contacto leads to the block of the page itself (`contactPath` in `src/lib/paths.ts`).
- `src/styles/global.css`: the colours of Película as Tailwind tokens (`bg-ink`, `text-paper`, `text-amber`…), the fonts (`font-name` for Big Shoulders Display; Space Mono everywhere else), the type styles (`type-label`, `type-name`, `type-meta`, `type-code`), the amber line under standalone links (`link-line`), and what Tailwind does badly: the logo mask and the reveal of the sections (`.reveal`: what is below the screen when the page opens fades in as it comes into view; the rest never fades). Less motion stops all of it.
- `src/assets/`: the fonts, Big Shoulders Display and Space Mono 400 and 700 (`fonts/`, with their OFL licences), the logo symbol, the official Livro de Reclamações icon and the images of Projects, Sobre and Equipa (`projects/`, `about/`, `team/`, provisional until #18). `public/`: the site icons and `.htaccess`, read only by the host's Apache: HTTPS, cache, compression and the 404 page for unknown addresses.
- `tests/`: the Playwright suite, over both builds. `all-pages.spec.ts` runs axe (WCAG A and AA) on every page found in `dist/` and `dist-en/`, at rest (every section shown, the first screen's animations over), so a new page is checked without touching the tests.
- `tests/lighthouse/`: Lighthouse in mobile mode, over every page of `dist/`. SEO, page weight (400 KB), JS weight (75 KB), fonts (at most 3, in woff2) and requests to other domains block. Performance, LCP and TBT only warn; CLS, accessibility and best practices only show in the summary. The HTML reports go to `lighthouse-report/`. `check.spec.ts` tests the checker itself on pages made to fail each target.
- `.github/workflows/ci.yml`: the `Checks` workflow, on each PR, documentation-only ones too. Into `main`: Chromium in 1 job, WebKit in 3, and Lighthouse. Into any other branch: Chromium in 4 jobs. The steps live in `.github/actions/verify/`.
- `.github/workflows/publish.yml`: the `Publish` workflow, after each merge into `main` (see Publishing). `publish/`: the SFTP upload (`publish.sh`, with the site's folder) and the server key (`known_hosts`). `tests/publish/`: the confirmation, against the published site.
- `.github/dependabot.yml`: once a month, a PR into `develop` for the actions and another for npm.
