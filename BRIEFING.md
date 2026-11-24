# Briefing: website da Droumond Productions

Documento de direção inicial. Última atualização: 2026-11-23. Tudo o que está em "Por decidir" ainda não está fechado: perguntar antes de assumir.

## Contexto

- Empresa: Droumond Productions, produtora audiovisual. Sócios: Julien e Carlos.
- A empresa ainda não tem site.
- Firma: Droumond & Laffont - Produções, Lda, sociedade por quotas com sede em Leiria, constituída a 26/02/2026. Trabalha também para particulares, por isso o rodapé indica o centro de arbitragem de consumo (CNIACC). Dados legais em `src/config/site.ts`.
- Minissérie em desenvolvimento: _Efecto Placebo_, suspense, em português de Portugal, em fase de gravação. Grafia da miniatura do teaser (decidido pelo Julien a 2026-11-19).
- YouTube: https://www.youtube.com/@DroumondProductions/videos (só existe um teaser).
- Instagram: a minissérie _Resident Evil_, com 5 episódios (o último ainda por estrear).
- Repositório: https://github.com/julien-laffont/droumond-productions.git (grafia "droumond", como no canal).
- Grafia: "Droumond" (decidido pelo Julien a 2026-11-13). O logótipo diz "Droummond".

## Objetivo

- Mostrar o trabalho da empresa e ganhar audiência.
- Métrica de sucesso: contactos de clientes. Conta toda a mensagem real (não spam) que chega pelo site, venha de quem vier; quem recebe os emails conta-os à mão, fora do site (ver issue #7).
- Público: adultos, sobretudo em Portugal, e também pessoas de outras nacionalidades.
- Idiomas do site: português de Portugal (principal) e inglês. As páginas em inglês só são publicadas quando os textos estiverem traduzidos. A confirmar com o Julien (ver issue #6).

## Âmbito

- O site é da empresa, não só da série.
- Em Projetos, excertos curtos e sem som do teaser de _Efecto Placebo_ e de um episódio de _Resident Evil_, alojados no site; o teaser completo abre no YouTube. Não aloja episódios completos.
- Secções obrigatórias: Sobre, Equipa, Contacto. A equipa são os dois cofundadores, Carlos Droumond e Julien Laffont, e aparece no Sobre. Quem representa nos projetos fica à parte, no Elenco (#41).
- Outros projetos: a minissérie _Resident Evil_ do Instagram, além de _Efecto Placebo_.
- Secção pedida pelo Julien: contratar a Droumond Productions para filmagens ("Quer a Droumond Productions para gravação?").
- Sem loja, apoio nem newsletter na v1.
- Qualquer outra secção (portfólio, notícias, loja, newsletter) só entra se for pedida.
- Email de contacto: contact@droumondproductions.com, desde 2026-11-19 (#18), com a caixa no Google Workspace. Pode ainda mudar.
- Contacto só por email (`mailto:`), sem formulário. Só a página de filmagens pré-preenche o assunto. Ver issue #7.

## Direção visual

Película, aprovada pelo Carlos a 2026-11-20 na ronda de revisão (#8): "exatamente assim". Protótipo: https://claude.ai/artifact/J2Nrc3GjXxXfeBr8NRkfAs (código em `prototype/pelicula.html` no branch `prototype/visual-direction`, que nunca entra em `develop` nem em `main`). Substitui a direção da #5 (tela clara e pinceladas). Implementação por secção: a base na #36, depois #37 a #42 e #33.

- Ideia: uma bobina de 35 mm desenrolada pela página. Fitas de película atravessam o ecrã, com perfurações em cima e em baixo e códigos de borda em âmbar. Um só mundo escuro.
- Seguir o protótipo de perto. Melhorias (acessibilidade, telemóvel, desempenho) propõem-se ao Nal antes de as fazer. Os textos do site (#18) prevalecem sobre os do protótipo.
- Paleta: fundo `#0c0b09`, película `#1b1813`, claquete `#151411`, texto `#ece5d8` (16:1 sobre o fundo), secundário `#a59d8f` (7,3:1), âmbar `#e8a43a` e `#b5802e` (códigos de borda, números, timecode). O lápis vermelho `#d63a2f` é só para marcas à mão, nunca texto.
- Tipografia: Big Shoulders Display, condensada, para nomes e títulos; Space Mono (400 e 700) para tudo o resto. Ambas de licença aberta e alojadas no próprio site (sem Google Fonts, por causa do RGPD). Letra grande só para nomes e títulos das secções; a descrição da empresa fica sempre pequena e em segundo plano. Só o título do primeiro ecrã usa a Shree Devanagari 714, levemente transparente, como imagem SVG (#37).
- Cabeçalho: o símbolo, um timecode que corre com o scroll (decorativo), as secções, a língua e o Contacto, que no telemóvel passa para dentro do Menu.
- Primeiro ecrã: a linha de código "35 mm · Droumond 2026 · Leiria · Rolo 01", o nome, uma fita inclinada que passa sozinha, com botão de pausa (#37), "Produtora audiovisual" e as palavras (Séries, Suspense, Terror, Filmagens).
- Projetos: uma fita que avança para o lado com o scroll, do líder com contagem à ponta final, com os vídeos sem som sempre a passar (#38). Sobre: o texto ao lado da equipa, um fotograma por pessoa. Elenco: uma folha de contactos, cada pessoa rodeada a lápis vermelho (#39, #41). Filmagens: uma claquete. Contacto: o endereço em letra grande (#40).
- Rodapé: a ponta da bobina ("Fim da bobina"), depois a identificação legal.
- Logótipo: só o símbolo (círculo e monograma), claro sobre o escuro; o nome aparece em texto. Por agora, o JPEG do Carlos convertido para transparência; o SVG pede-se na #8.
- Movimento: só CSS e JavaScript simples (as fitas, o timecode, o lápis e a claquete no hover, o aparecimento discreto das secções). Quem pediu menos movimento vê tudo parado.

## Materiais

- Fotografias originais, o master do teaser e episódios de _Resident Evil_: enviados pelo Carlos a 2026-11-20. Os originais não entram no repo; as fotos do site são cortes preparados a partir deles (#41).
- Equipa: Carlos e Julien. A foto do Julien ainda é uma captura de ecrã; ele envia uma (#18).
- As pessoas das fotos do protótipo (as personagens do Instagram, com o Julien e o Bruno Moreira) deram o consentimento de uso de imagem.
- Elenco: personagens de _Efecto Placebo_, com fotos do Carlos. Só se sabem os nomes do Miguel Figueiredo e do Bruno Moreira; a foto do Bruno ainda é uma captura de ecrã.
- Textos (Sobre, Equipa): escrevem o Julien e o autor.
- A pedir ao Carlos na #8: o símbolo do logótipo em SVG e uma foto de bastidores para a faixa de filmagens. O fotograma limpo do teaser deixou de ser preciso: os posters de Projetos são o primeiro fotograma de cada excerto.

## Tecnologia e entrega

- Mesma stack que a landing page do Julien (https://github.com/julien-laffont/julien-devops-lp): Astro 7, React 19 (ilhas), Tailwind CSS 4, TypeScript, Node 24 (`.nvmrc`), npm.
- Qualidade na landing page: Playwright (testes), axe-core (acessibilidade), Lighthouse, Prettier, `astro check`. Script `npm run verify` corre tudo.
- Alojamento: Infomaniak, no Hébergement Web (com PHP), o mesmo da landing page do Julien. Domínio: `droumondproductions.com`, registado na Infomaniak, com HTTPS (Let's Encrypt); escolhido para a publicação (#11), o Julien confirma-o antes da primeira release em `main`. O email do domínio está no Google Workspace.
- CI/CD, como na landing page: workflow `Checks` em cada PR (testes em 4 jobs + Lighthouse para `main`) e workflow `Publish` a cada merge em `main`, que publica na Infomaniak e confirma que cada página responde com o commit publicado. Os segredos de publicação existem desde 2026-11-18, com uma conta FTP + SSH só para a publicação.
- Branches, como na landing page: o trabalho parte de `develop` e os PR vão para `develop`; `main` só recebe releases (PR de `develop`) e hotfixes, e cada merge em `main` publica o site.
- Convenção da landing page: tudo no repo em inglês (código, comentários, docs), issues e PR em português de Portugal. Confirmar se se mantém aqui.
- Quem atualiza o site depois de publicado: o Julien.

## Prazo

- O estágio do autor termina a 2026-11-29.
- O site tem de estar pronto alguns dias antes para validação final.

## Decisões e aprovações

- Trabalho em regime de colaboração, sem orçamento definido.
- Dúvidas simples e técnicas: aprovam o Julien e o autor.
- Direção visual: aprova o Carlos.

## Por decidir

- Os nomes do Elenco que faltam.
- Consentimento de uso de imagem das pessoas das fotos novas do Elenco (o Carlos sabe).
- Quem é o cliente (o Julien adiou a decisão).
- Quando fica feito o registo no Livro de Reclamações Eletrónico (obrigatório antes de publicar).
- Número de rondas de revisão.

## Regras de trabalho

- Responder em português de Portugal. Comentários de código em inglês.
- Perguntar antes de assumir o que estiver em "Por decidir".
- Começar pela solução mais simples. Não acrescentar secções, bibliotecas ou configuração que não foram pedidas.
- Mensagens de commit em inglês, formato convencional, uma linha.
- Documento de planeamento da reunião: https://claude.ai/artifact/L7TRTb89J2pimkBo1Nomag
