# Legal obligations for the Droummond Productions website

Research for issue #3 ("Que obrigações legais tem o site de uma produtora portuguesa?").
Sources checked on 2026-11-12.

> **This is research, not legal advice.** It reads the primary texts as they apply to a small static company site. Where the law is unclear for this case, the document says so. Before launch, have the company's accountant or a lawyer confirm the points marked "ambiguous", and the company data listed at the end.

## Scope and assumptions

The site, as described in `BRIEFING.md`: a static institutional site in European Portuguese for a Portuguese audiovisual production company. Pages: Sobre, Equipa, Contacto, plus an embedded YouTube teaser. No shop, no accounts, no analytics, no newsletter. Hosted by Infomaniak. Audience: adults, mostly in Portugal.

Unknowns that change the answer (see [Data needed from the company](#data-needed-from-the-company)):

- The company's **legal form** (sociedade por quotas, unipessoal, empresário em nome individual, associação...). Several rules below apply only to a *sociedade comercial*.
- Whether the company **sells to consumers** (private individuals) or only to businesses.
- Whether it has an **establishment open to the public**.

## Short answer

| Item | Status | Main source |
|---|---|---|
| Company identification on the site (firma, tipo, sede, conservatória and número de matrícula, NIPC; capital social for an Lda/SA) | **Mandatory** if the company is a sociedade comercial | CSC art. 171 [S18] |
| Name, geographic address, **e-mail address**, registry number and NIF permanently online | **Mandatory** (very likely; see 1.2) | DL 7/2004 art. 10 [S19] |
| Privacy information at the contact form (who, why, legal basis, retention, rights, CNPD complaint) plus a full privacy policy page | **Mandatory** | RGPD art. 12 and 13 [S1] |
| A consent checkbox on the contact form | **Not required** (art. 6(1)(b)/(f) fit better) | RGPD art. 6 [S1] |
| Cookie banner | **Not needed** if the site itself stores nothing non-essential and the YouTube player is loaded only after a click | Lei 41/2004 art. 5 [S3] |
| Consent before loading the YouTube player, **including `youtube-nocookie.com`** | **Ambiguous, treat as mandatory**: privacy-enhanced mode still writes to browser storage and contacts Google on page load | Lei 41/2004 art. 5 [S3], EDPB 2/2023 [S6], own test [S29] |
| Livro de Reclamações Eletrónico: register on the platform and show its icon/link "em local visível e de forma destacada" (header or footer of the home page) | **Mandatory** on a literal reading (all goods/service providers); ambiguous only if the company deals exclusively with businesses | DL 156/2005 art. 2(2) and 5.º-B [S12] |
| Physical Livro de Reclamações | Only if there is a fixed establishment with contact with the public | DL 156/2005 art. 2(1) [S12] |
| Information on the consumer dispute resolution (RAL) entity, with its website | **Mandatory if the company contracts with consumers** (interpretation, see 5) | Lei 144/2015 art. 18 [S22], Lei 24/96 art. 14 [S23] |
| EU ODR platform link | **No longer required**: platform closed on 20 July 2025 | Reg. (EU) 2024/3228 [S24] |
| Written consent of each person whose photo appears on "Equipa" | **Mandatory** (Código Civil art. 79) | [S26] |
| Accessibility (WCAG) | **Recommended** only: the site is outside the European Accessibility Act scope | Directive (EU) 2019/882 [S25] |
| Self-host fonts (no Google Fonts CDN), link YouTube ToS and Google Privacy Policy | **Recommended** | [S28], [S10] |

---

## 1. Company identification

### 1.1 Código das Sociedades Comerciais (CSC), art. 171

If the company is a *sociedade comercial*, CSC art. 171(1) requires that "em todos os contratos, correspondência, publicações, anúncios, **sítios na Internet** e de um modo geral em toda a actividade externa" the company indicate clearly:

- the **firma** (registered company name),
- the **tipo** (e.g. "Lda.", "Sociedade Unipessoal Lda."),
- the **sede** (registered office address),
- the **conservatória do registo** where it is registered and the **número de matrícula**,
- the **número de identificação de pessoa colectiva** (NIPC),
- if applicable, that the company is in liquidation.

Art. 171(2): sociedades por quotas, anónimas and em comandita por acções must also show the **capital social**, the paid-up amount if different, and the equity per the last approved balance sheet whenever it is equal to or below half of the share capital. [S18]

This is the one rule that names websites explicitly, so it is the clearest obligation of all. It does not apply if the business is an *empresário em nome individual* or an association; then 1.2 still applies.

Note on the name: the firma must appear exactly as registered. The briefing still has the spelling ("Droumond" or "Droummond") as an open question; the certidão permanente settles it for the legal name.

### 1.2 Decreto-Lei 7/2004 (comércio eletrónico), art. 10

DL 7/2004 transposes the E-Commerce Directive. Art. 10(1) requires "prestadores de serviços" to make permanently available online, with easy and direct access, complete identification including: (a) nome ou denominação social; (b) endereço geográfico and **endereço electrónico** allowing direct communication; (c) inscrições em registos públicos and their numbers; (d) número de identificação fiscal. [S19]

Does an institutional site count as an "information society service"? DL 7/2004 art. 3(1) defines it as a service provided at a distance by electronic means "mediante remuneração ou pelo menos no âmbito de uma actividade económica". Recital 18 of Directive 2000/31/EC says such services "extend to services which are not remunerated by those who receive them, such as those offering on-line information or commercial communications". [S19] [S20] A company site that promotes the company's services is a commercial communication within an economic activity, so it is very likely in scope. It is cheap to comply, and 1.1 already overlaps.

**E-mail address, not only a form.** The CJEU held that the directive's contact requirement means the provider must give its **e-mail address** *in addition to* another rapid means of contact, which may be a web form (C-298/07, deutsche internet versicherung). [S21] So the Contacto page should show an e-mail address, not only the form.

Caveat: the text quoted is the original 2004 wording of art. 10. The consolidated DRE page (last consolidation 30 May 2023) could not be rendered by my tools, so later amendments to art. 10 were **not verified**.

### 1.3 What to put on the site

In the footer or on a "Informação legal" page reachable from every page:

```
<Firma exata> , <tipo>
Sede: <morada completa>
NIPC: <n.º> | Matrícula na Conservatória do Registo Comercial de <...> sob o n.º <...>
Capital social: <...> €            (only for Lda/SA)
E-mail: <...>
```

---

## 2. Contact form (RGPD)

### 2.1 Information is mandatory at the moment of collection

RGPD art. 13 applies whenever personal data are collected from the person. "At the time when personal data are obtained", the controller must give: identity and contact details of the controller (13(1)(a)); DPO contact where applicable (b); purposes and **legal basis** (c); the legitimate interest if relying on art. 6(1)(f) (d); recipients (e); transfers outside the EEA and their safeguard (f); retention period or criteria (13(2)(a)); the rights of access, rectification, erasure, restriction, objection and portability (b); the right to withdraw consent if consent is the basis (c); the right to lodge a complaint with a supervisory authority (d); whether providing the data is required and the consequence of not doing so (e); automated decision-making (f). [S1]

Form: "concise, transparent, intelligible and easily accessible form, using clear and plain language" (art. 12(1)). [S1]

For websites, the WP29 transparency guidelines (endorsed by the EDPB) recommend a **layered** notice: the first layer, "displayed as a data subject fills in an online form", should give the purposes, the identity of the controller and a description of the rights; the full information must also be available in one complete document. [S11]

In practice:

- **Next to the submit button:** one or two sentences in Portuguese: who processes the data (Droummond Productions, contact), why (answer the request / prepare a proposal), and a link to the full **Política de Privacidade**.
- **Política de Privacidade page** covering every art. 13 item. The supervisory authority to name is the **CNPD** (Comissão Nacional de Proteção de Dados). [S8]

### 2.2 Consent is not the right legal basis for a contact form

Art. 6(1) offers other bases that fit better: (b) "in order to take steps at the request of the data subject prior to entering into a contract" (a request for a quote or project), and (f) legitimate interests (general enquiries). [S1] A consent checkbox is therefore **not required**. If consent were used anyway, the person could withdraw it at any time (art. 7(3), art. 13(2)(c)), which does not fit the processing of an enquiry. Recommendation: no consent checkbox; state the legal basis in the notice.

Consent **is** required if the site later adds a newsletter or sends marketing e-mails (Lei 41/2004 art. 13.º-A). [S3] Out of scope today.

### 2.3 Other RGPD points that affect the build

- **Minimise fields** (art. 5(1)(c)): name, e-mail, message; phone optional. [S1]
- **Retention:** decide and state a period (art. 5(1)(e), 13(2)(a)). [S1] The period is a business decision for Julien and Carlos.
- **Processors:** whoever receives the form data (Infomaniak mail/hosting, any form service) acts as a processor and needs an art. 28 contract (usually the provider's DPA). [S1] Not checked for Infomaniak.
- **Transfers:** Infomaniak is Swiss. Switzerland has an adequacy decision (Commission Decision 2000/518/EC), which stays in force under RGPD art. 45(9). [S27] [S1] A US form service would need a different safeguard; this belongs to the ticket "Como chegam os contactos de clientes".
- **Spam protection:** a third-party captcha loaded on page view raises the same terminal-storage question as YouTube (section 3). A honeypot field avoids it.
- **Records of processing (art. 30):** the under-250-employees exemption does not apply when processing "is not occasional" (art. 30(5)). [S1] Handling client enquiries is ongoing, so a short internal record is advisable. Not a website item.

---

## 3. Cookies and the embedded YouTube video

### 3.1 The rule

ePrivacy Directive art. 5(3), transposed by **Lei 41/2004 art. 5** (as republished by Lei 46/2012): storing information, or accessing information already stored, in the user's terminal equipment is allowed only with **prior consent** based on clear and complete information. Exceptions: storage or access solely to transmit a communication, or "estritamente necessário" to provide a service "solicitado expressamente" by the user. [S3] [S2] In the 2012 republication, breaches of art. 5 are handled by the CNPD (art. 15(1)); art. 15 was later amended by Lei 18/2024, which I did not read. [S3]

Key interpretations:

- The rule covers any storage, **not only cookies**, and applies whether or not the data is personal (CJEU C-673/17 Planet49, point 2). Pre-ticked boxes are not consent (point 1). [S4]
- The EDPB: storing and accessing "do not need to be both present for Article 5(3) ePD to apply" (para. 30); it lists "cookies, local storage, WebSQL" as information stored in the browser, and Art. 5(3) applies once such information is accessed and leaves the device (para. 44). [S6]
- The site operator that embeds third-party content which makes the visitor's browser send data to the third party is a (joint) **controller** for that collection and transmission, and must inform visitors about it (CJEU C-40/17 Fashion ID, points 2 and 4). [S5]
- The CNPD (2021): website owners "são responsáveis por todos os cookies que permitem que sejam colocados no equipamento terminal do utilizador". [S8] The CNPD announced specific cookie guidelines in 2021; **I found no published final CNPD cookie guideline**.
- WP29 Opinion 04/2012: "multimedia player session cookies" that only store playback data (quality, buffering) and expire with the session can be exempt, because the video is part of the service the user requested; tracking by third-party plug-ins is not exempt. [S7]

### 3.2 What `youtube-nocookie.com` actually does

Google's documentation: privacy-enhanced mode "prevents the use of views of embedded YouTube content from influencing the viewer's browsing experience on YouTube"; ads on it are non-personalised; the view is not used to personalise advertising elsewhere. [S9] **Google does not say that the mode stores nothing on the device**, and does not say it removes the need for consent.

Own test (2026-11-12, headless Chromium build 1248, a local page embedding the company's teaser `Y785Re6Cyvk`; method in [S29]):

| | `www.youtube.com/embed` | `www.youtube-nocookie.com/embed` |
|---|---|---|
| HTTP cookies on page load (no click) | 5, including `VISITOR_INFO1_LIVE` and `__Secure-YNID` (expire 2027-05-11) | **none** |
| localStorage on page load | `yt-icons-last-purged`, `ytidb::LAST_RESULT_ENTRY_KEY` | **same two keys** |
| IndexedDB on page load | `LogsDatabaseV2:...`, `YtIdbMeta` | `YtIdbMeta` |
| Third-party hosts contacted before any click | youtube.com, googleads.g.doubleclick.net, static.doubleclick.net, www.google.com, jnn-pa.googleapis.com, ... | youtube-nocookie.com, www.google.com, jnn-pa.googleapis.com, ytimg/ggpht/gstatic |
| After clicking play | no new cookies or keys | no new cookies or keys |

Limits of the test: one run, one browser, one network; values of the keys were not inspected; Google can change the player at any time.

### 3.3 Analysis

Privacy-enhanced mode removes the advertising cookies and the doubleclick calls, which is a real improvement. But on page load, before any interaction, it still **writes to localStorage and IndexedDB** and sends the visitor's IP address to Google hosts (www.google.com, jnn-pa.googleapis.com) whose purpose is not documented. Under Lei 41/2004 art. 5 and the EDPB reading, that storage needs consent unless it is "strictly necessary" for a service the user explicitly requested. The WP29 exemption for player cookies is narrow (session-only, playback data only); persistent storage with undocumented purposes, set by a third party, is hard for Droummond to justify as strictly necessary. No Portuguese or EU authority has ruled on `youtube-nocookie.com` specifically (none found).

**Conclusion: the law is ambiguous for privacy-enhanced mode; it does not clearly avoid the need for consent.** The safe and simple design is:

1. **Click-to-load ("dois cliques")**: show a locally hosted poster image with a play button and one sentence, e.g. "Ao reproduzir, o vídeo é carregado a partir do YouTube (Google), que pode guardar dados no seu dispositivo. Ver Política de Privacidade." Only on click, insert the `youtube-nocookie.com` iframe. The click is "a clear affirmative action" after clear information, which is how consent is defined (RGPD art. 4(11); Planet49). [S1] [S4] Treating that click as valid consent is a common reading, but it is an **interpretation**, not a ruling.
2. With 1, and with no analytics and self-hosted fonts, **the site sets nothing non-essential itself, so no cookie banner is needed.** The privacy policy should still describe the YouTube embed (Fashion ID duty to inform) and say the site uses no cookies of its own.

Alternative: host the teaser file on the site's own server. That removes the third party entirely, but changes the briefing ("incorporado do YouTube"), so it is a decision for Julien and Carlos.

### 3.4 YouTube's own terms (contractual, not law)

Google's help page says "the YouTube API Terms of Service and Developer Policies apply to the access and use of the YouTube embedded player". [S9] The Developer Policies define an "API Client" as "a website or software application ... that accesses or uses the YouTube API Services", and require API Clients to display a link to YouTube's Terms of Service and to have a privacy policy that links to the Google Privacy Policy and discloses cookies or similar technology on users' devices, if any. [S10] Whether a plain iframe embed is held to all of this is not clear from the text; adding the two links to the privacy policy costs nothing. **Recommended.**

---

## 4. Livro de Reclamações Eletrónico

### 4.1 Is it mandatory for this company?

Decreto-Lei 156/2005, as amended and republished by DL 74/2017:

- Art. 2(2): "São abrangidos pela obrigação de disponibilização do formato eletrónico do livro de reclamações **todos os fornecedores de bens e prestadores de serviços** designadamente os identificados no anexo ao presente decreto-lei, quer desenvolvam a atividade em estabelecimento que cumpra os requisitos previstos no número anterior **ou através de meios digitais**." [S12]
- The annex is a non-exhaustive list ("designadamente"). Audiovisual production is not listed, but that does not exclude it. (Recintos de espetáculos and aluguer de videogramas are listed; a production company is neither.) [S12]
- The electronic format became mandatory for all providers (not only essential public services) from **1 July 2018** (DL 74/2017 art. 9(3)). [S12]
- Art. 2(1): the **physical** book is required only in establishments installed "com carácter fixo ou permanente" that "tenham contacto com o público". [S12]

So, on the text, an audiovisual production company that provides services must have the electronic book, whether or not it sells online, and needs the physical book only if it has premises open to the public. The AMT reads art. 2(2) the same way in its 2019 note to operators. [S16]

**Ambiguity:** the decree's purpose is consumer and *utente* protection (art. 1(1), art. 2(5)). A company that deals **only with businesses** could argue the regime does not reach it, but the decree contains **no B2B exemption**, and I found no official DGC statement on B2B-only providers. A production company's site invites contacts from anyone, and "clientes" may include private individuals. **Recommendation: treat it as mandatory.** It costs little (see 4.3).

### 4.2 How it must be shown on the site

- Art. 5.º-B(2): providers "devem divulgar nos respetivos sítios na Internet, **em local visível e de forma destacada**, o acesso à Plataforma Digital." [S12]
- Art. 5.º-B(1): the provider must "possuir o formato eletrónico" (i.e. be registered on the platform, livroreclamacoes.pt). Art. 5.º-B(4): reply to an electronic complaint within **15 dias úteis**. [S12]
- Art. 1(3): any in-house complaint tool on the site must be clearly distinct from the Livro de Reclamações. [S12]

The law does not fix the format. The Direção-Geral do Consumidor's manual on the icon (published via the AMT) sets its understanding: [S15]

- preferably use the official **Livro de Reclamações icon**, with a hyperlink to `https://www.livroreclamacoes.pt/inicio`;
- the icon "deverá constar na **página inicial (cabeçalho ou rodapé)**", visible and legible;
- allowed colours: red, blue, white or black; it must **contrast with the background** (relevant for a dark site: use the white version);
- good practice: also show it on a support/complaints page.

Practical answer: put the white icon in the global footer, linked to `https://www.livroreclamacoes.pt/inicio`.

### 4.3 Cost and sanctions

- The electronic book is bought from INCM. Portaria 201-A/2017 set its price at 50 % of the physical book (EUR 19.76 in 2017), with annual updates possible. [S14] **Current price not verified.**
- Since DL 9/2020 (art. 9.º-A), breaches of art. 5.º-B(1) to (3) are preceded by a notice giving **90 days** to comply before any fine. [S13]
- The fine amounts in the 2017 republication have since been reclassified under the Regime Jurídico das Contraordenações Económicas (DL 9/2021); an ERSE decision of 2026 applies RJCE arts. 18 and 19 to a DL 156/2005 breach. [S17] The current classification for art. 5.º-B was **not verified**.
- The residual inspecting authority, when no sector regulator applies, is the **ASAE** (DL 156/2005 art. 11(3)). [S12]

---

## 5. Consumer dispute resolution (RAL) information

Lei 144/2015 art. 18 (as amended): providers established in Portugal "devem informar os consumidores relativamente às entidades de RAL a que se encontram vinculados, por adesão ou por imposição legal decorrente de arbitragem necessária, e indicar o sítio eletrónico na Internet das mesmas", in a clear and easily accessible way "no sítio eletrónico na Internet dos fornecedores ... caso exista". [S22]

Since Lei 63/2019, Lei 24/96 art. 14(2) makes consumer disputes "de reduzido valor económico" (up to the *alçada* of first-instance courts, art. 14(3)) subject to **arbitragem necessária** at the consumer's option, before the authorised consumer arbitration centres. [S23]

Reading the two together, any provider that contracts with consumers is bound by law to the competent consumer arbitration centre, and so should name it and link to it on the site. This is **my interpretation**; I did not find a DGC text confirming it (the DGC site refused automated access). It applies **only if the company contracts with consumers**. Which centre is competent depends on where the company is based; this needs Julien's input.

The separate EU obligation to link to the ODR platform is gone: Regulation (EU) 2024/3228 repealed Regulation 524/2013 with effect from **20 July 2025** and discontinued the platform. [S24] Do not add an ODR link.

---

## 6. Other obligations found

- **Team photos and names (Equipa):** "O retrato de uma pessoa não pode ser exposto, reproduzido ou lançado no comércio sem o consentimento dela" (Código Civil art. 79(1)). [S26] Photos and names of team members are also personal data under the RGPD. Get each person's written consent to publish their photo and name, and remove on request.
- **Accessibility:** the European Accessibility Act covers specific services provided to consumers (e-commerce, access to audiovisual media services, transport, banking...), and exempts microenterprises providing services (Directive 2019/882 art. 2(2) and 4(5)). [S25] In my reading, a promotional company site with an embedded teaser is not one of those services, and a microenterprise would be exempt anyway. Accessibility is **recommended** (and already part of the project's axe-core checks), not mandatory.
- **Fonts:** loading Google Fonts from Google's servers sends visitors' IP addresses to Google. A German regional court found this unlawful without consent (LG München I, 20.01.2022, 3 O 17493/20). [S28] Not binding in Portugal, but self-hosting the fonts (supported by Astro) avoids the question. **Recommended.**
- **Server logs:** the host (Infomaniak) logs IP addresses; mention it in the privacy policy with its retention.

---

## Data needed from the company

Already in the questions to Julien: legal name, NIPC, address. Also needed:

1. **Legal form** (Lda, Unipessoal Lda, SA, empresário em nome individual, associação...). Decides whether CSC art. 171 applies.
2. **Firma exactly as registered** (settles "Droumond" vs "Droummond" for the legal name).
3. **Conservatória do Registo Comercial and número de matrícula** (may equal the NIPC; check the certidão permanente).
4. **Capital social** (if Lda/SA), and whether equity is at or below half of it.
5. **E-mail address** to publish (DL 7/2004 art. 10 requires one besides the form), and the e-mail for privacy requests.
6. Whether the company is **already registered on livroreclamacoes.pt**; if not, who registers it.
7. Whether the company has **premises open to the public** (physical Livro de Reclamações).
8. Whether it **sells to private individuals** or only to businesses (RAL info, Livro de Reclamações ambiguity).
9. If it sells to consumers: any **RAL entity** it has joined, and the municipality of the sede (competent arbitration centre).
10. **Retention period** for contact requests.
11. **Written consent** of each person shown on "Equipa".
12. Decision on the teaser: **YouTube click-to-load** or **self-hosted video**.

## Not verified or ambiguous

- Whether `youtube-nocookie.com` needs consent: **ambiguous**; no authority has ruled on it. Click-to-load avoids the question.
- Livro de Reclamações for a **B2B-only** company: no explicit exemption, no official statement found.
- RAL information duty for every B2C provider after Lei 63/2019: interpretation, no DGC confirmation found.
- Consolidated texts on diariodarepublica.pt could not be rendered by my tools. Texts were read from the official DR PDFs of the amending acts (DL 74/2017, DL 9/2020, Lei 46/2012, Lei 63/2019) and from consolidated copies hosted by the Procuradoria-Geral Distrital de Lisboa and Banco de Portugal. Later amendments to DL 7/2004 art. 10 and Lei 41/2004 art. 5 were not checked; Lei 18/2024 changed Lei 41/2004 art. 15 (sanctions) according to search results, not read.
- Current Livro de Reclamações price and current fine classification under the RJCE.
- No final CNPD cookie guideline was found (announced in 2021).
- Infomaniak's data processing agreement was not checked.

---

## Sources

- [S1] Regulation (EU) 2016/679 (RGPD), arts. 4, 5, 6, 7, 12, 13, 28, 30, 45. https://eur-lex.europa.eu/eli/reg/2016/679/oj (read via the EU Publications Office, CELEX 32016R0679)
- [S2] Directive 2002/58/EC (ePrivacy), consolidated 19.12.2009, art. 5(3). https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02002L0058-20091219
- [S3] Lei 41/2004, republished by Lei 46/2012, de 29 de agosto (arts. 5, 13.º-A, 15). Official PDF: https://files.diariodarepublica.pt/1s/2012/08/16700/0481304826.pdf ; https://diariodarepublica.pt/dr/detalhe/lei/46-2012-174793
- [S4] CJEU, C-673/17 Planet49, 1 October 2019, operative part. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62017CJ0673
- [S5] CJEU, C-40/17 Fashion ID, 29 July 2019, operative part. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62017CJ0040
- [S6] EDPB, Guidelines 2/2023 on Technical Scope of Art. 5(3) of ePrivacy Directive, v2.0, adopted 7 October 2024, paras. 34, 44. https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf
- [S7] Article 29 Working Party, Opinion 04/2012 on Cookie Consent Exemption (WP194), sections 3.4 and 4.1. https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf
- [S8] CNPD, Nota informativa relativa à utilização de cookies, 25 June 2021. https://www.cnpd.pt/media/x2zdus50/nota-informativa-cnpd_cookies_20210625.pdf
- [S9] YouTube Help, "Embed videos & playlists", section "Turn on privacy-enhanced mode". https://support.google.com/youtube/answer/171780
- [S10] YouTube API Services, Developer Policies, section III.A and Definitions (page last updated 2026-11-06). https://developers.google.com/youtube/terms/developer-policies
- [S11] Article 29 Working Party, Guidelines on transparency under Regulation 2016/679 (WP260 rev.01), endorsed by the EDPB, paras. 17, 36. https://www.edpb.europa.eu/system/files/documents/2023-09/wp260rev01_en.pdf
- [S12] Decreto-Lei 156/2005, as amended and republished by Decreto-Lei 74/2017, de 21 de junho (arts. 1, 2, 3, 5.º-B, 9, 11; DL 74/2017 art. 9). Official PDF: https://files.diariodarepublica.pt/1s/2017/06/11800/0314103157.pdf ; consolidated: https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2005-34431675
- [S13] Decreto-Lei 9/2020, de 10 de março (adds art. 9.º-A to DL 156/2005). https://files.diariodarepublica.pt/1s/2020/03/04900/0000300004.pdf
- [S14] Portaria 201-A/2017, de 30 de junho (arts. 3, 4, 6). https://files.diariodarepublica.pt/1s/2017/06/12501/0000200008.pdf
- [S15] Direção-Geral do Consumidor, "Livro de Reclamações Eletrónico: Obrigações do prestador de serviços ou fornecedor de bens" (icon usage manual), as published by the AMT. https://www.amt-autoridade.pt/media/2053/manual_utilizacao_icone_lre.pdf
- [S16] AMT, "Disponibilização do Livro de Reclamações Eletrónico: informação aos operadores económicos", 22 October 2019. https://www.amt-autoridade.pt/media/2162/disponibilizacaolre.pdf
- [S17] ERSE, Processo n.º 08/2026 (DL 156/2005 breach sanctioned under RJCE, DL 9/2021). https://www.erse.pt/atividade/sancionatoria/decisoes/2026/082026/
- [S18] Código das Sociedades Comerciais, art. 171 (consolidated, PGDL). https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?artigo_id=524A0171&nid=524&tabela=leis&pagina=1&ficha=1&so_miolo=&nversao=
- [S19] Decreto-Lei 7/2004, de 7 de janeiro, arts. 3 and 10 (original text, DR I-A n.º 5). https://www.wipo.int/wipolex/en/legislation/details/5537 ; consolidated: https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2004-73199154
- [S20] Directive 2000/31/EC (E-Commerce), recital 18 and art. 5. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32000L0031
- [S21] CJEU, C-298/07 Bundesverband der Verbraucherzentralen v deutsche internet versicherung, 16 October 2008, operative part. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62007CJ0298
- [S22] Lei 144/2015, de 8 de setembro, arts. 2, 3, 18 (consolidated copy, Banco de Portugal). https://www.bportugal.pt/sites/default/files/anexos/legislacoes/459446285_1.doc.pdf ; https://diariodarepublica.pt/dr/detalhe/lei/144-2015-70215248
- [S23] Lei 63/2019, de 16 de agosto (new art. 14 of Lei 24/96). https://files.diariodarepublica.pt/1s/2019/08/15600/0000600007.pdf ; Lei 24/96 consolidated (PGDL): https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=726&tabela=leis
- [S24] Regulation (EU) 2024/3228 repealing Regulation (EU) No 524/2013 (ODR), arts. 1 and 2. https://eur-lex.europa.eu/eli/reg/2024/3228/oj
- [S25] Directive (EU) 2019/882 (European Accessibility Act), arts. 2(2) and 4(5). https://eur-lex.europa.eu/eli/dir/2019/882/oj
- [S26] Código Civil, art. 79 (consolidated, PGDL). https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?artigo_id=775A0079&nid=775&tabela=leis&pagina=1&ficha=1&so_miolo=&nversao=
- [S27] Commission Decision 2000/518/EC (adequacy of Switzerland), art. 1. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32000D0518
- [S28] Landgericht München I, judgment of 20.01.2022, 3 O 17493/20 (Google Fonts). https://www.gesetze-bayern.de/Content/Document/Y-300-Z-BECKRS-B-2022-N-612
- [S29] Own test, 2026-11-12: Playwright (playwright-core 1.65.0) driving headless Chromium build 1248. A local page served from `http://localhost` embedded `https://<host>/embed/Y785Re6Cyvk` for both hosts; the script waited 8 s, listed all cookies in the browser context and the localStorage, sessionStorage and IndexedDB names of each frame, logged every requested host, then clicked the player's play button, waited 12 s and listed again.
