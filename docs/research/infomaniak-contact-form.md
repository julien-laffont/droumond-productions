# Contact form options on Infomaniak with this stack

Research for issue [#2](https://github.com/juliensl/droumond-productions/issues/2), feeding [#7 "Como chegam os contactos de clientes"](https://github.com/juliensl/droumond-productions/issues/7). Sources read on 2026-11-12.

**Question.** How can a static Astro 7 site, hosted at Infomaniak with the same stack and deploy as Julien's landing page ([julien-devops-lp](https://github.com/juliensl/julien-devops-lp)), receive contact messages? For each option: how it works, cost, limits, personal data sent to third parties, effect on the Playwright tests and Lighthouse, and what library or configuration it needs.

## Short answer

- **Four options work:** (A) a `mailto:` link, (B) an HTML form posting to a PHP script on the Infomaniak hosting itself, (C) an HTML form posting to a third-party form backend (Web3Forms, Formspree), (D) a link to a form hosted elsewhere (Tally).
- **Simplest: A, the `mailto:` link.** It needs no code, no library, no configuration and no third party beyond the mailbox provider. It is what the landing page already does in its footer.
- **Simplest real form with no third party: B, using PHP `mail()`.** It needs one PHP file in `public/` and one setting in the Infomaniak Manager, with no npm library. Messages stay at Infomaniak (Switzerland) and the destination mailbox. The cost is a small amount of server code to write and test, plus its own spam handling.
- **Least code for a form: C.** It is a plain HTML form with a public key. The trade-off is personal data leaving the EEA (Web3Forms operates from India; Formspree processes data in the US), small free quotas, and branded or redirect pages on free plans.
- **Possible blocker for B:** PHP exists only on Infomaniak's paid **Web Hosting**. The free **Starter** offer that comes with a domain is HTML/CSS only, with FTP but no SSH. Which offer will host the Droummond site is not stated in `BRIEFING.md` (it says only "Alojamento: Infomaniak. O domínio já existe."). This is a question for Julien.

## What the landing page does today

Read at commit [`0c071af`](https://github.com/juliensl/julien-devops-lp/tree/0c071af7929484a4d27a193d793f931d010d9bc3) of `juliensl/julien-devops-lp`.

**No contact form.** The page has two contact paths:

- The main call to action is a plain link, in the same tab, to a Calendly booking page (`src/components/BookingButton.tsx`, `src/config/values.ts`: `bookingPage: 'https://calendly.com/contact-julienlaffont/appel-cadrage'`). LP issue [#10](https://github.com/juliensl/julien-devops-lp/issues/10) chose a link over an embed so that the page loads no Calendly JavaScript, cookies or requests.
- The footer has a `mailto:` link to `hello@julienlaffont.com` (`src/components/Footer.astro`). That mailbox is on Google Workspace, not Infomaniak (LP issue [#56](https://github.com/juliensl/julien-devops-lp/issues/56)).
- The privacy policy (`src/content/legal/pt/privacy.md`) lists "Emails recebidos" (Google Workspace) and "Marcações da Conversa" (Calendly, Google, US, Data Privacy Framework) as separate processing activities.

**Hosting: Infomaniak "Hébergement Web", with PHP.**

- LP issue [#57](https://github.com/juliensl/julien-devops-lp/issues/57) records the site data from the Manager: "PHP 8.5.11, Apache 2.4.67, MariaDB". Julien confirmed on 2026-10-23 that "o alojamento é o Hébergement Web, não a oferta Starter".
- Deploy: `.github/workflows/publish.yml` runs `publish/publish.sh`, which uploads `dist/` over **SFTP with an SSH key** (`lftp`, `sftp://`) to `sites/devops.julienlaffont.com`. Its third pass, `mirror --reverse --delete`, deletes every server file in that folder that is not in `dist/`.
- `public/.htaccess` configures Apache (HTTPS redirect, 404, cache). Its header comment notes that only the Infomaniak Apache reads it: "astro preview and the Playwright suite ignore it."

**Quality rules that a contact option must pass, if Droummond copies them:**

- `tests/all-pages.spec.ts`: on every page, "makes no requests to other domains" (checked at `networkidle` after load) and "sets no cookies and stores nothing in the browser".
- `tests/lighthouse/check.ts`: fails on any "request to another domain", a page over 400 KB, or JavaScript over 75 KB. LP issue [#15](https://github.com/juliensl/julien-devops-lp/issues/15) set "0 pedidos a outros domínios antes de um clique".
- The Playwright suite runs against `astro preview` (`playwright.config.ts`). Astro documents this as a server that "Starts a local server to serve the contents of your static directory" and says "It is not designed to be run in production" ([Astro CLI reference](https://docs.astro.build/en/reference/cli-reference/)). It does not run PHP.

## Infomaniak hosting offers that matter here

| | Starter | Web Hosting |
|---|---|---|
| Price | Free, "included with the purchase of a domain name" | "From CHF 10.91 / month", 30-day free trial |
| Technologies | "Basic technologies for a static website (HTML, CSS)" | "HTML, CSS, PHP, MySQL/MariaDB, Apache, etc." |
| Disk, traffic | "10 MB disc space", "Limited traffic (1 GB / month)" | 250 GB SSD, unlimited traffic |
| Sites | not stated | "From 20 to 100 websites (domains not included)" |
| Access | "FTP access without SSH" | "FTP and SSH access" |
| Email | none listed | "1 free email address with your domain" |

Sources: [Infomaniak hosting prices and characteristics](https://www.infomaniak.com/en/hosting/prices-and-characteristics), [Web Hosting page](https://www.infomaniak.com/en/hosting/web-hosting), [Discover Infomaniak's web hosting offers](https://www.infomaniak.com/en/support/faq/2019/discover-infomaniaks-web-hosting-offers) (Starter: "basic pages in HTML only - no PHP, no database").

Consequences:

- **The landing page's deploy assumes SSH.** `publish.sh` connects over SFTP with a key, and Starter lists "FTP access without SSH". On Starter the deploy script would need changing. This is an inference from the offer page and was not tested.
- **The Web Hosting Julien already pays for includes 20 websites.** Adding the Droummond site to it as a second site would cost nothing extra. Whether Julien wants that, or a separate hosting, is a decision for him.

## Option A: `mailto:` link (no form)

**How it works.** `<a href="mailto:...">`. MDN: links with the `mailto:` scheme "open in the user's email program to let them send a new message" ([MDN `<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)). A subject or body can be prefilled ([RFC 6068](https://datatracker.ietf.org/doc/html/rfc6068)).

- **Cost:** none beyond the mailbox.
- **Limits:**
  - It depends on the visitor having an email program set up. Without one, the click does nothing useful. This is a known UX limitation that no primary source here measures.
  - The address is visible in the HTML.
- **Personal data:** goes only to the destination mailbox provider (to be decided: Infomaniak, Google Workspace, other). No form processor.
- **Playwright / Lighthouse:** no requests, no JavaScript, no cookies. A test checks the `href`, as in the landing page.
- **Library / config:** none.
- **Counting contacts:** count the emails received. Clicks cannot be counted without analytics, which the map puts out of scope.

## Option B: HTML form posting to PHP on the Infomaniak hosting

**How it works.**

- A plain `<form method="POST" action="/contact.php">` in an Astro page. No JavaScript is needed.
- `public/contact.php` is copied into `dist/` as-is. Astro: "The files in this folder will be copied into the build folder untouched" ([Astro project structure](https://docs.astro.build/en/basics/project-structure/)).
- `publish.sh` then uploads it with the rest of `dist/`.
- The script validates the fields, sends an email and redirects to a static thank-you page.
- **Requires the Web Hosting offer** (PHP), not Starter.

Two ways to send the email.

### B1. PHP `mail()` (unauthenticated)

- **Setup.** Infomaniak says `mail()` is "disabled by default". It must be enabled for each site under "Manage advanced settings", then "PHP / Apache", then "Enable the mail function". An existing address must be entered in the "Sender Email" field ([FAQ 2150](https://www.infomaniak.com/en/support/faq/2150/use-unauthenticated-not-recommended-email-sending-from-a-website), updated 2026-10-13).
- **Reply address.** The Return-Path becomes a server address such as `root@h2web3.infomaniak.ch`. The reply address goes in a `Reply-To:` header set by the form's code (same FAQ).
- **Limit:** "Web Hosting = limit depends on the email service used; otherwise, 50 emails max. via PHP Mail() without authentication". The window is a rolling 24 hours ([FAQ 2065](https://www.infomaniak.com/en/support/faq/2065/understanding-the-limits-on-outgoing-emails-per-24-hours)). That is ample for a contact form.
- **Deliverability:** Infomaniak "strongly advises against using the PHP mail() function". Its deliverability "will be affected", and Infomaniak recommends authenticated SMTP (FAQ 2150). The risk is the message landing in the recipient's spam folder. How much this matters when sending to the site owner's own mailbox was not tested.
- **Security:**
  - The PHP manual requires a `From` header.
  - The manual warns about header injection: "If outside data are used to compose this header, the data should be sanitized so that no unwanted headers could be injected" ([PHP `mail()`](https://www.php.net/manual/en/function.mail.php)). The visitor's email goes into `Reply-To`, so it must be validated.
- **Library / config:**
  - No library (PHP built-in).
  - One Manager setting, done by hand by whoever has access to the Manager. It is not in the repo.
- **Cost:** included in Web Hosting.

### B2. Authenticated SMTP

- **Setup.** It needs "an email service" (Infomaniak or another provider), with server `mail.infomaniak.com`, port 587, STARTTLS, the full address as username and a device password ([FAQ 2023](https://www.infomaniak.com/en/support/faq/2023/use-authenticated-email-sending-from-a-website), updated 2026-10-13). Infomaniak's custom-PHP guide uses **PHPMailer**: port 465 SSL/TLS or 587 STARTTLS, and "the address used as the sender must match the email address used for SMTP authentication" ([FAQ 576](https://www.infomaniak.com/en/support/faq/576/using-phpmailer-on-infomaniak), updated 2026-11-12).
- **No SMTP auth in `mail()`.** The PHP manual does not document any SMTP authentication for `mail()`, so this route needs a PHP library (PHPMailer) or hand-written SMTP code.
- **Limit:** the limit of the sending address's email offer, for example "Mail Service Starter = 200", "Mail Service Premium = 500", "my kSuite = 200" per 24 hours (FAQ 2065).
- **Config:**
  - A mailbox password on the server. It must not be in the repo.
  - It must also not sit inside the published folder, because `publish.sh`'s `--delete` pass removes any server file that is not in `dist/`.
- **More moving parts than B1.** It adds a PHP library, a secret, and a dependency on a mailbox existing.

### B, both variants

- **Personal data:**
  - Form data goes only to Infomaniak (Switzerland) and the destination mailbox. Switzerland is on the European Commission's adequacy list ([EC adequacy decisions](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en)).
  - No other processor is involved.
- **Spam:** no built-in filter. I did not find any Infomaniak feature for custom PHP forms. A honeypot field and server-side checks have to be written.
- **Playwright:**
  - The page itself passes the landing page's rules: same-origin action, no requests or cookies before a click.
  - `astro preview` does not run PHP. Submission tests have to intercept the POST with `page.route` and `route.fulfill` ([Playwright network](https://playwright.dev/docs/network)), so they test the HTML side only.
  - The PHP script needs its own check, for example PHP in CI. The GitHub `ubuntu-24.04` image ships "PHP: 8.3.6" ([runner image readme](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md)), while the server runs 8.5.11 (LP #57). Alternatively, a post-publish check that does not send a real message. Either is new configuration.
- **Lighthouse:** no effect. No JavaScript is required, and no third-party request is made.
- **Counting contacts:** count the emails received. A server-side log would be extra code.

## Option C: HTML form posting to a third-party backend

**How it works.** `<form action="https://api.web3forms.com/submit" method="POST">` (or a Formspree endpoint) with a hidden public key. Without JavaScript, the browser leaves the site to post, then gets redirected. With a small script, a `fetch` keeps the visitor on the page ([Web3Forms HTML & JavaScript](https://docs.web3forms.com/how-to-guides/html-and-javascript)). Web3Forms has an Astro example ([Web3Forms Astro](https://docs.web3forms.com/how-to-guides/static-site-generators/astro)).

### Web3Forms

- **Cost and limits** ([pricing](https://web3forms.com/pricing)):
  - Free: "250 Monthly Submissions", unlimited forms, one email recipient per form, 2 linked emails, 30 days of submission history in the dashboard, data kept "up to 3 years" (configurable from 7 days).
  - Beyond the quota: "we will stop accepting new submissions until the next month".
  - Paid: Pro "$12 /mo" billed yearly ($149). Removing Web3Forms branding from emails costs "$9/mo".
- **Redirect:**
  - Without JavaScript, the hidden `redirect` field is "Required". The default is Web3Forms' own success page.
  - On free plans, "Free users must use same domain for redirection" ([custom redirection](https://docs.web3forms.com/getting-started/customizations/redirection.md)), which is fine for a thank-you page on the Droummond domain.
- **Spam:**
  - Server-side check on all submissions ([Captcha & SPAM](https://docs.web3forms.com/getting-started/customizations/spam-protection)).
  - The honeypot is marked "NOT RECOMMENDED" and "depreciated" ([honeypot](https://docs.web3forms.com/getting-started/customizations/spam-protection/spam-protection.md)).
  - hCaptcha is free but needs `<script src="https://web3forms.com/client/script.js">` on the page ([hCaptcha](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha.md)). reCAPTCHA and Turnstile are Pro only.
- **Personal data** ([privacy policy](https://web3forms.com/privacy), updated 2026-07-13):
  - The site owner is the controller and Web3Creative the processor, under a DPA.
  - "We operate from India", with infrastructure on AWS (including Amazon SES for email), Cloudflare and Hetzner. Transfers from the EEA use "Standard Contractual Clauses".
  - "The IP address and email address of form submitters may be sent to" CleanTalk and Akismet for spam filtering.
  - India is not on the EC adequacy list.

### Formspree

- **Cost and limits** ([plans](https://formspree.io/plans)):
  - Free: 50 submissions/month, 2 linked emails, dashboard shows the last 30 days, no custom thank-you page.
  - Personal: $15/month, or $10/month billed yearly, for 200 submissions.
- **Redirect:** "By default, after submitting a form the user is redirected to the Formspree 'Thank You' page". The custom redirect is on "Personal, Professional, Business plans" only ([Thank You redirect](https://help.formspree.io/hc/en-us/articles/360012378333--Thank-You-redirect)). On the free plan, the visitor ends on a Formspree page.
- **Spam:**
  - "Formshield" machine-learning filtering on all plans (plans page).
  - reCAPTCHA can be toggled per form on all plans ([reCAPTCHA settings](https://help.formspree.io/hc/en-us/articles/115008379328-reCAPTCHA-settings)). Without a custom key, it uses a Formspree-hosted page ([custom reCAPTCHA key](https://help.formspree.io/hc/en-us/articles/360022811154-Adding-a-custom-reCAPTCHA-v2-key)).
  - Whether reCAPTCHA is on by default today is not stated. The help page says only that it "was on by default for all forms" before February 2020.
- **Personal data:**
  - Formspree "will use your information in the United States and any other country where Formspree operates" ([privacy policy](https://formspree.io/legal/privacy-policy), last updated 2022-04-24).
  - The policy names no transfer mechanism: no Data Privacy Framework, no SCCs.
  - **Not verified:** whether Formspree participates in the EU-US Data Privacy Framework. The EC adequacy decision for the US covers only participating companies.

### C, both services

- **Playwright:**
  - A plain form makes no request before submit, so the landing page's "no requests to other domains" and "no cookies" tests still pass.
  - Submission tests must intercept the POST with `page.route` ([Playwright network](https://playwright.dev/docs/network)), or every CI run would send real messages and spend the monthly quota.
  - Adding hCaptcha (Web3Forms) loads a third-party script at page load, which **fails** the "no requests to other domains" test. Its effect on the cookie test was not verified.
- **Lighthouse:**
  - None for a plain form.
  - A `fetch` script adds a little JavaScript, well under the 75 KB budget.
  - A captcha script adds a request to another domain, which fails the landing page's Lighthouse check.
- **Library / config:** no npm library. An account and a key are created on the service's site.
- **Counting contacts:** the service dashboard (30 days of history on both free plans) or the emails received.

## Option D: link to a hosted form (Tally)

**How it works.** The same pattern as the landing page's Calendly button: a plain link to a form hosted by Tally. The visitor leaves the site to fill it in.

- **Cost and limits:**
  - Free: "unlimited forms and submissions", "within our fair usage guidelines", with "Self email notifications", "Custom 'Thank You' page" and "Redirect on completion".
  - Tally branding is removed only on Pro, "€ 20 per month" ([pricing](https://tally.so/pricing)).
- **Personal data** ([Tally GDPR](https://tally.so/help/gdpr)):
  - "Tally is based in Belgium (EU)". Form data is "stored in Europe" (Google Cloud, Belgium). A DPA is available.
  - The notification emails to the owner go through **SendGrid, US** ("opt-in: form email notifications").
- **Playwright / Lighthouse:** no effect. It is a link, so no requests or scripts load on the site. Embedding the form instead would load Tally's scripts and break the landing page's third-party rules.
- **Library / config:** none in the repo. A Tally account and the form are built by hand outside the repo.
- **Counting contacts:** Tally's submissions list.

## Comparison

| | A `mailto:` | B1 PHP `mail()` | B2 PHP + SMTP | C Web3Forms | C Formspree | D Tally link |
|---|---|---|---|---|---|---|
| Real form on the site | no | yes | yes | yes | yes | no (external) |
| Needs Web Hosting (PHP) | no | **yes** | **yes** | no | no | no |
| Cost | 0 | 0 (in Web Hosting) | 0 + a mailbox | 0 | 0 | 0 |
| Free limit | none | 50 emails / 24 h | mailbox offer (200+ / 24 h) | 250 / month | 50 / month | fair use |
| Processors besides the mailbox | none | Infomaniak (CH) | Infomaniak (CH) | Web3Forms (India), AWS, Cloudflare, Hetzner, CleanTalk, Akismet | Formspree (US) | Tally (BE), SendGrid (US) |
| npm library | no | no | no (PHP lib: PHPMailer) | no | no | no |
| Config outside code | none | Manager: enable `mail()` + sender | mailbox + password on server | account + key | account + endpoint | account + form |
| Passes the landing page's third-party / cookie tests | yes | yes | yes | yes, without captcha | yes, without custom reCAPTCHA | yes |
| Submission testable in Playwright on `astro preview` | n/a | only with a mock | only with a mock | only with a mock | only with a mock | n/a |
| Own spam handling needed | no | yes | yes | partly (server check) | partly (Formshield) | no |

## Not verified

- **Which Infomaniak offer will host the Droummond site:** Starter or Web Hosting, a new site on Julien's existing Web Hosting, or a separate one. This decides whether option B exists, and whether `publish.sh` works unchanged.
- **Which domain the site uses and where its email lives:** Infomaniak, Google Workspace or none. This decides the destination address and whether B2 is possible. These belong to [#4](https://github.com/juliensl/droumond-productions/issues/4) (Julien's answers).
- **How often `mail()` messages reach spam in practice:** not tested.
- **Whether Formspree is in the EU-US Data Privacy Framework.**
- **Whether Formspree's reCAPTCHA is on by default for new forms.**
- **Whether the Web3Forms hCaptcha widget sets cookies or storage.**
- **Whether Starter's "FTP access without SSH" also rules out SFTP:** inferred, not tested.
- **The legal notices each option requires** (privacy policy entries, information at the point of collection) are out of scope here and belong to [#3](https://github.com/juliensl/droumond-productions/issues/3).
