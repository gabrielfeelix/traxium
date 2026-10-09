# Plano de construção do protótipo v2

Registro de 08/10/2026. Leva ao protótipo a arquitetura de `04-arquitetura-proposta.md`. As perguntas ao Rafael (`03-diagnostico.md`, seção 5) e as divergências com a diretriz (seção 6) ainda não têm resposta; o protótipo segue com as premissas da seção 1, cada uma reversível.

## 1. Premissas adotadas

| Tema | Premissa | Se a resposta vier diferente |
| --- | --- | --- |
| Cliente da v1 | Transportadora certificada com afretamento (granel sólido, multi-filial, TAC sob gatekeeper) | Embarcador com gatekeeper entra como variação da mesma mesa |
| Verificação do compartimento | Feita pelo afretador da filial, no celular, com checklist por tipo de implemento e fotos opcionais por modelo | Se for do motorista, o passo vai para o link da viagem |
| CT-e | Emitido no TMS do cliente (ex.: Atua); o Traxium entrega o texto da declaração positiva e recebe número do CT-e e da NF por digitação ou importação | Se nascer no Traxium, a viagem ganha emissão |
| TAC e ETC | Maioria TAC; ETC recorrente existe e tem cadastro com estados de qualificação | Se ETC for raro, estados de empresa somem |
| Exceções | Raras; registro de 9 campos dentro da viagem; três alçadas padrão (Gestor da qualidade, Direção e RT, Técnico = ninguém), configuráveis | Se forem frequentes, volta uma fila própria |
| Limpeza | Regime seco é o caso comum; campos por regime continuam para B, C e D | |
| Auditor | Não opera o sistema; recebe exportação | Acesso leitura volta como segunda versão |
| Academy | Manual versionado com ciência na viagem e registro de treinamentos; trilhas com prova ficam para depois | |
| Ocorrência | Evento da viagem, contado no transportador; exportável para o SGQ | |
| Base entre filiais | Base de transportadores e frota compartilhada; viagens filtradas pela filial do usuário | |
| Base IDTF | Mantida pela Traxium (Console); o cliente consulta e pede classificação | |

## 2. Telas da v2

Arquivos novos em `SaaS moderno estilo Dribbble/`. Os antigos ficam no disco e no git para comparação, fora da sidebar, listados em `versao-anterior.html`.

| Arquivo | Tela | Parâmetro de URL |
| --- | --- | --- |
| `Hoje.dc.html` | Mesa do afretador e painel da qualidade (filial "todas") | `?filial=` |
| `Viagens v2.dc.html` | Lista de viagens, filtros fixos, visões salvas, exportação | |
| `Viagem.dc.html` | Detalhe da viagem: passos, decisão, verificação, documentos, liberação, ocorrências, linha do tempo | `?id=VG-xxxx` |
| `Transportadores.dc.html` | Base de TACs e ETCs com drawer de detalhe, convite na linha | `?id=` |
| `Frota.dc.html` | Frota própria com escopo GMP+ | |
| `Compartimento v2.dc.html` | Histórico do compartimento (journey sheet) | `?placa=&pos=` |
| `Auditoria.dc.html` | Rastrear por placa, CT-e, NF ou período; amostra; exportações | |
| `Cadastros.dc.html` | Produtos e regimes, Manual e treinamentos, Fornecedores, Filiais | `?aba=` |
| `Configuracoes v2.dc.html` | Usuários e papéis, alçadas, regras com piso, modelos, LGPD, integrações | |
| `Link da Viagem.dc.html` | Página do motorista, mobile, sem login | `?id=` |

`index.html` passa a redirecionar para `Hoje.dc.html`.

### Sidebar canônica v2

Hoje (badge: viagens do dia com pendência), Viagens, Transportadores (badge: documentos vencendo em 15 dias), Frota própria, Auditoria; grupo Cadastros; rodapé: Configurações, Link do motorista (demonstração), Versão anterior. Badges calculados da base comum, iguais em todas as telas. Gerada por script a partir de uma definição única, nunca copiada à mão.

## 3. Base de dados comum

`tx-dados.js`, carregado no `<head>` de cada tela nova antes do `support.js`, define `window.TX`:

- **Semente** coerente: tenant Transrural Log Ltda, 4 filiais (Rondonópolis MT, Sorriso MT, Rio Verde GO, Paranaguá PR), usuários com papel (Rafael Antunes, gestor da qualidade; um afretador por filial), cerca de 14 transportadores (maioria TAC, 3 ETC), conjuntos com placas de cavalo e carretas e compartimentos com T-3, frota própria de 6 conjuntos (4 no escopo GMP+), cerca de 30 produtos da IDTF com sinônimos e matriz de regimes, 24 viagens em todas as situações, ocorrências, treinamentos, manual em duas versões, termo, fornecedores (lavadores), protocolos gatekeeper por filial.
- **Três viagens canônicas**: TAC liberada (pronta para assegurar), frota própria liberada, TAC bloqueada por carga anterior proibida.
- **Motor**: `TX.decidir(viagem)` deriva da semente as checagens (documentos do TAC e do conjunto, T-3 completo, regime IDTF, verificação, termo, ciência do manual, produto reconhecido), o resultado (pronta, falta algo, bloqueada, bloqueio técnico) e a lista do que falta com quem resolve. Estado nunca é campo editável.
- **Persistência**: mutações (criar viagem, registrar verificação, assinar pelo link, registrar ocorrência, cadastrar transportador, liberar com registro de 9 campos) gravadas em `localStorage` (`tx-v2`), com `TX.reset()` exposto em Configurações. Assim o link do motorista aberto em outra aba atualiza a mesa.
- **Teste**: script Node em `scripts/` que carrega `tx-dados.js` e confere a coerência (toda placa existe, toda viagem decide, contagens batem, as três canônicas dão o resultado esperado).

## 4. Convenções (valem para toda tela nova)

- Visual aprovado do `CLAUDE.md` e do `HANDOFF.md` da pasta do protótipo; nada de travessão nem ponto médio em texto de UI.
- Estrutura em `div`, perfil e nav no fonte, dropdowns fecham com clique fora e Esc, nenhum botão morto (memória `padrao-telas-prototipo`).
- Toda ação de escrita muda a base comum e o efeito aparece onde o usuário espera; toast só como confirmação.
- Toda lista com mais de 25 itens pagina, mostra total e mantém filtros visíveis.
- Toda tela de detalhe abre o registro do parâmetro de URL; sem parâmetro, abre a primeira viagem canônica.
- Filial e período filtram de fato.

## 5. Fases e commits

| Fase | Entrega | Verificação |
| --- | --- | --- |
| A | `tx-dados.js` e teste Node | teste passa |
| B | `Viagem.dc.html` como tela de referência, com a sidebar v2 e o script gerador | captura de tela das três viagens canônicas |
| C | `Hoje.dc.html` e `Link da Viagem.dc.html` | fluxo F1 de ponta a ponta no navegador |
| D | `Viagens v2`, `Transportadores`, `Frota`, `Compartimento v2` | capturas e links entre telas |
| E | `Auditoria`, `Cadastros`, `Configuracoes v2`, `versao-anterior.html`, `index.html` | fluxo F5; assinatura única de sidebar em todas as telas v2 |
| F | Revisão de consistência e publicação | busca por botão sem ação, travessão, links quebrados |

Cada fase termina em commit. Publicação na Vercel só com autorização.

Ferramentas de verificação disponíveis: Chromium em `~/.cache/ms-playwright/chromium-1243`, `playwright-core` em `/mnt/d/solar-buy-side-v2/node_modules/playwright-core`, servidor estático com `python3 -m http.server` na pasta do protótipo.
