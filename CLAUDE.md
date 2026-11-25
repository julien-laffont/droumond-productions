# Droumond Productions website

Read `BRIEFING.md` first: it holds the context, goals, scope, visual direction and open decisions for this site.

## Agent skills

### Issue tracker

Issues and specs live in this repo's GitHub Issues (`julien-laffont/droumond-productions`), managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root, created when needed. See `docs/agents/domain.md`.

## Before each push

To save CI minutes, the `Checks` workflow only runs on PRs into `main` (releases and hotfixes). PRs into `develop` get no CI, so you are the CI:

- Run `npm run verify` before every push, and push only when it passes.
- Before merging a Dependabot PR into `develop`, check out its branch and run `npm run verify` there.
- Never push to `main` or `develop` directly: every change arrives through a PR, merged with a merge commit. In a private repository, the organisation's free plan does not enforce the branch rules, so this rule is the only guard.
