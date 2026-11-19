# Briefing: website da Droumond Productions

Documento de direção inicial. Última atualização: 2026-11-19. Tudo o que está em "Por decidir" ainda não está fechado: perguntar antes de assumir.

## Contexto

- Empresa: Droumond Productions, produtora audiovisual. Sócios: Julien e Carlos.
- A empresa ainda não tem site.
- Firma: Droumond & Laffont - Produções, Lda, sociedade por quotas com sede em Leiria, constituída a 26/02/2026. Trabalha também para particulares, por isso o rodapé indica o centro de arbitragem de consumo (CNIACC). Dados legais em `src/config/site.ts`.
- Mini-série em desenvolvimento: _Efecto Placebo_, suspense, em português de Portugal, em fase de gravação. Grafia da miniatura do teaser (decidido pelo Julien a 2026-11-19).
- YouTube: https://www.youtube.com/@DroumondProductions/videos (só existe um teaser).
- Instagram: a mini-série _Resident Evil_, com 5 episódios (o último ainda por estrear).
- Repositório: https://github.com/julien-laffont/droumond-productions.git (grafia "droumond", como no canal).
- Grafia: "Droumond" (decidido pelo Julien a 2026-11-13). O logótipo diz "Droummond".

## Objetivo

- Mostrar o trabalho da empresa e ganhar audiência.
- Métrica de sucesso: contactos de clientes. Conta toda a mensagem real (não spam) que chega pelo site, venha de quem vier; quem recebe os emails conta-os à mão, fora do site (ver issue #7).
- Público: adultos, sobretudo em Portugal, e também pessoas de outras nacionalidades.
- Idiomas do site: português de Portugal (principal) e inglês. As páginas em inglês só são publicadas quando os textos estiverem traduzidos. A confirmar com o Julien (ver issue #6).

## Âmbito

- O site é da empresa, não só da série.
- Mostra o teaser de _Efecto Placebo_, incorporado do YouTube. Não aloja episódios.
- Secções obrigatórias: Sobre, Equipa, Contacto.
- Outros projetos: a mini-série _Resident Evil_ do Instagram, além de _Efecto Placebo_.
- Secção pedida pelo Julien: contratar a Droumond Productions para filmagens ("Quer a Droumond Productions para gravação?").
- Sem loja, apoio nem newsletter na v1.
- Qualquer outra secção (portfólio, notícias, loja, newsletter) só entra se for pedida.
- Email de contacto: por enquanto, o gmail do Carlos recebe os contactos e é o endereço mostrado no site (o endereço não fica neste documento porque o repo é público). Carlos talvez crie um email novo.
- Contacto só por email (`mailto:`), sem formulário. Só a página de filmagens pré-preenche o assunto. Ver issue #7.

## Direção visual

Provisória: escolhida pelo Nal a 2026-11-16 (issue #5); o Carlos valida na ronda de revisão (issue #8). Protótipo: https://claude.ai/artifact/7GfVFwmvAaQbBiRZ1Uyby6 (código em `prototype/` no branch `prototype/visual-direction`, que nunca entra em `develop` nem em `main`).

- Estilo: cinematográfico e escuro, com a estética de tinta e pincelada como fio condutor (o Carlos gostou de um vídeo do Imaginary Forces porque lembra o logótipo).
- Referências: The Mill (https://www.themill.com) para a grelha de Projetos; Rodeo FX (https://rodeofx.com) para a tipografia e o primeiro ecrã. Outras: Oats Studios, Blur, Territory Studio, Framestore, Imaginary Forces, Weta FX, DNEG, ILM, Critical Role.
- Paleta: fundo `#0e0d10`, texto cor de tela `#dbcdc6`, cinzentos tirados da tela. O carmim `#79081b` é só decoração (no vídeo de fundo), nunca texto nem botões.
- Zonas: o primeiro ecrã e o bloco Contacto em tela clara, o resto escuro, o cabeçalho sempre quase preto. A passagem do claro para o escuro é uma pincelada a fazer de borda.
- Tipografia: só Archivo, de licença aberta e alojada no próprio site (sem Google Fonts, por causa do RGPD), em várias larguras. Letra grande só para nomes (empresa, projetos, pessoas); a descrição da empresa fica sempre pequena e em segundo plano. Sem pincelada por baixo dos títulos das secções.
- Primeiro ecrã: vídeo de fundo gerado por código (pinceladas escuras e um traço carmim sobre tela, 8 s em ciclo). Ao centro, o símbolo do logótipo aparece por uma máscara que segue o pincel; por baixo, o nome e palavras que passam uma a uma (Séries, Suspense, Terror, Filmagens) até ficar "Produtora audiovisual", como na Rodeo FX.
- Projetos: grelha assimétrica 2:1 com o título por baixo de cada imagem (16:9 para a série, 4:5 para a mini-série, que é vertical). Sobre: texto pequeno à esquerda, uma imagem larga à direita. Equipa: retratos 4:5 com nome e papel.
- Logótipo: só o símbolo (círculo e monograma); o nome aparece em texto. Preto sobre a tela e claro sobre o escuro, a partir do mesmo ficheiro. Por agora, o JPEG do Carlos convertido para transparência; o SVG pede-se na #8.
- Movimento: só CSS e JavaScript simples (revelação do logótipo, aparecimento discreto das secções, pincelada no hover dos links). Quem pediu menos movimento vê tudo parado.

## Materiais

- Existem: fotografias, cartazes e o teaser.
- Fornecedor: Carlos, sem data prevista.
- Até chegarem, usar placeholders claramente marcados.
- Equipa: no protótipo, os personagens do perfil do Instagram (https://www.instagram.com/droumond_productions). A equipa deu o consentimento de uso de imagem.
- Textos (Sobre, Equipa): escrevem o Julien e o autor.
- A pedir ao Carlos na #8: o símbolo do logótipo em SVG, uma foto de bastidores para a faixa de filmagens e um fotograma limpo do teaser (a miniatura do YouTube tem texto por cima).

## Tecnologia e entrega

- Mesma stack que a landing page do Julien (https://github.com/julien-laffont/julien-devops-lp): Astro 7, React 19 (ilhas), Tailwind CSS 4, TypeScript, Node 24 (`.nvmrc`), npm.
- Qualidade na landing page: Playwright (testes), axe-core (acessibilidade), Lighthouse, Prettier, `astro check`. Script `npm run verify` corre tudo.
- Alojamento: Infomaniak, no Hébergement Web (com PHP), o mesmo da landing page do Julien. Domínio: `droumondproductions.com`, registado na Infomaniak, com HTTPS (Let's Encrypt); escolhido para a publicação (#11), o Julien confirma-o antes da primeira release em `main`. Ainda não há email do domínio.
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

- Pessoas da equipa a mostrar depois do protótipo.
- Quem é o cliente (o Julien adiou a decisão).
- Quando fica feito o registo no Livro de Reclamações Eletrónico (obrigatório antes de publicar).
- Número de rondas de revisão.

## Regras de trabalho

- Responder em português de Portugal. Comentários de código em inglês.
- Perguntar antes de assumir o que estiver em "Por decidir".
- Começar pela solução mais simples. Não acrescentar secções, bibliotecas ou configuração que não foram pedidas.
- Mensagens de commit em inglês, formato convencional, uma linha.
- Documento de planeamento da reunião: https://claude.ai/artifact/L7TRTb89J2pimkBo1Nomag
