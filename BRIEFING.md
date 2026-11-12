# Briefing: website da Droummond Productions

Documento de direção inicial. Última atualização: 2026-11-12. Tudo o que está em "Por decidir" ainda não está fechado: perguntar antes de assumir.

## Contexto

- Empresa: Droummond Productions, produtora audiovisual. Sócios: Julien e Carlos.
- A empresa ainda não tem site.
- Série em desenvolvimento: *Efeito Placebo*, suspense, em português de Portugal, em fase de gravação.
- YouTube: https://www.youtube.com/@DroumondProductions/videos (só existe um teaser).
- Instagram: mini-série com cerca de 4 episódios, feita a aproveitar o interesse por Resident Evil.
- Repositório: https://github.com/juliensl/droumond-productions.git (grafia "droumond", como no canal).
- Nota: o canal usa a grafia "Droumond" e o logótipo "Droummond". Grafia correta por confirmar.

## Objetivo

- Mostrar o trabalho da empresa e ganhar audiência.
- Métrica de sucesso: contactos de clientes.
- Público: adultos, sobretudo em Portugal. Idioma do site: português de Portugal.

## Âmbito

- O site é da empresa, não só da série.
- Mostra o teaser de *Efeito Placebo*, incorporado do YouTube. Não aloja episódios.
- Secções obrigatórias: Sobre, Equipa, Contacto.
- Qualquer outra secção (portfólio, notícias, loja, newsletter) só entra se for pedida.

## Direção visual

- Estilo: cinematográfico e escuro.
- Referência principal: The Mill (https://www.themill.com).
- Elementos a aproveitar de Oats Studios (https://oatsstudios.com) e de Rodeo FX (https://rodeofx.com).
- Outras referências: Blur, Territory Studio, Framestore, Imaginary Forces, Weta FX, DNEG, ILM, Critical Role.
- O Carlos gostou de um vídeo do Imaginary Forces porque lembra o logótipo da empresa. A estética de tinta e pincelada é um fio condutor possível.
- Logótipo: círculo desenhado a pincel (estilo enso) com um monograma caligráfico ao centro, a preto sobre fundo branco, com o nome por baixo (a confirmar). Ainda não foi enviado pelo Carlos.
- Problema em aberto: logótipo escuro sobre branco num site escuro. Pode ser preciso uma versão a branco ou transparente.

## Materiais

- Existem: fotografias, cartazes e o teaser.
- Fornecedor: Carlos, sem data prevista.
- Até chegarem, usar placeholders claramente marcados.

## Tecnologia e entrega

- Mesma stack que a landing page do Julien (https://github.com/juliensl/julien-devops-lp): Astro 7, React 19 (ilhas), Tailwind CSS 4, TypeScript, Node 24 (`.nvmrc`), npm.
- Qualidade na landing page: Playwright (testes), axe-core (acessibilidade), Lighthouse, Prettier, `astro check`. Script `npm run verify` corre tudo.
- Alojamento: Infomaniak. O domínio já existe.
- CI/CD, como na landing page: workflow `Checks` em cada PR (testes em 4 jobs + Lighthouse para `main`) e workflow `Publish` a cada merge em `main`, que publica na Infomaniak e confirma que cada página responde com o commit publicado. Os segredos de publicação são criados pelo Julien.
- Branches, como na landing page: o trabalho parte de `develop` e os PR vão para `develop`; `main` só recebe releases (PR de `develop`) e hotfixes, e cada merge em `main` publica o site.
- Convenção da landing page: tudo no repo em inglês (código, comentários, docs), issues e PR em português de Portugal. Confirmar se se mantém aqui.
- Quem atualiza o site depois de publicado: por decidir.

## Prazo

- O estágio do autor termina a 2026-11-29.
- O site tem de estar pronto alguns dias antes para validação final.

## Decisões e aprovações

- Trabalho em regime de colaboração, sem orçamento definido.
- Dúvidas simples e técnicas: aprovam o Julien e o autor.
- Direção visual: aprova o Carlos.

## Por decidir

- Quem atualiza o site depois de publicado.
- Versão do logótipo para fundo escuro.
- Pessoas da equipa a mostrar, e que outros projetos mostrar.
- Se haverá loja, apoio ou newsletter.
- Grafia correta do nome.
- Número de rondas de revisão.

## Regras de trabalho

- Responder em português de Portugal. Comentários de código em inglês.
- Perguntar antes de assumir o que estiver em "Por decidir".
- Começar pela solução mais simples. Não acrescentar secções, bibliotecas ou configuração que não foram pedidas.
- Mensagens de commit em inglês, formato convencional, uma linha.
- Documento de planeamento da reunião: https://claude.ai/artifact/L7TRTb89J2pimkBo1Nomag
