# Handoff: revisão de produto e construção do protótipo v2

Atualizado em 08/10/2026. Este é o ponto de entrada para quem continuar o trabalho. Ele substitui as instruções de "próximos passos" do `HANDOFF.md` da raiz (app Next) e do `SaaS moderno estilo Dribbble/HANDOFF.md` (protótipo v1); as regras visuais e de domínio daqueles arquivos continuam valendo.

## 1. Em uma frase

O protótipo v1 (21 telas `.dc.html`) foi revisado contra o mercado, a norma e uma auditoria GMP+ real; a conclusão é que ele acerta a regra e erra o usuário, e o próximo passo é construir o protótipo v2 organizado pela viagem, seguindo `05-plano-de-construcao.md`.

## 2. Como chegamos aqui

1. **Pedido original do Gabriel** (texto colado no editor, 08/10/2026), em resumo: o sistema está bonito mas os fluxos não estão amarrados. Exemplos que ele deu: em Subcontratados não dá para cadastrar um só, só convidar ou importar; não está claro se quem é importado recebe convite; motorista e subcontratado usam o mesmo app?; o TAC é as duas coisas; como cadastrar e listar auditor; Motor IDTF não cadastrava produto e tinha botões soltos ("Ficha completa", "Editar matriz", "Classificar"); 80 não conformidades viram lista enorme?; filtros de Viagens não cabem no notebook se crescerem; tudo é cadastrável, editável, exportável?; o protótipo foi feito para ser minimalista, e ainda assim tem que resolver o problema principal. Pediu: auditoria de fluxos, pensando como usuário, sem sair fazendo.
2. **Leitura de toda a documentação** do repositório e dos três PDFs (diretriz dos 5 pilares, fases de UX, 30 perguntas do Rafael). Parte do pedido já tinha sido tratada em `SaaS moderno estilo Dribbble/REVISAO-FLUXOS.md` (08/08) e no commit `5161acc`.
3. **Pesquisa de mercado** em duas rodadas, dez frentes, consolidada em `reports/Concorrentes e fluxos do Traxium.md` com as notas em `research_notes/Concorrentes e fluxos do Traxium/`.
4. **Material do Rafael Domingos** (sócio) enviado no grupo do WhatsApp: resumo dos concorrentes, relatório de auditoria e plano de auditoria da Control Union. Registrado em `evidencia-auditoria-real.md`.
5. **Revisão em etapas**, cada uma commitada: plano, inventário, usuários, diagnóstico, arquitetura, plano de construção, análise como usuário.
6. **Decisão do Gabriel:** construir sem esperar as respostas do Rafael, com premissas registradas e reversíveis.

## 3. Mapa dos documentos

| Arquivo | Conteúdo |
| --- | --- |
| `docs/revisao-telas/00-plano.md` | Etapas e os seis critérios do diagnóstico |
| `docs/revisao-telas/01-inventario.md` | Mapa do site do protótipo v1, ligações entre telas, contagens, fatos transversais |
| `docs/revisao-telas/inventario/*.md` | Inventário factual de cada uma das 21 telas e do shell |
| `docs/revisao-telas/evidencia-auditoria-real.md` | O que o auditor GMP+ verificou de fato; tabela de premissas do v1 que a auditoria derruba |
| `docs/revisao-telas/02-usuarios-e-trabalhos.md` | Quem compra, quem usa, trabalhos por momento, dados essenciais |
| `docs/revisao-telas/03-diagnostico.md` | Veredito por tela, transversais, quadro final, 10 perguntas ao Rafael, divergências com a diretriz do P.O. |
| `docs/revisao-telas/04-arquitetura-proposta.md` | Navegação v2, superfícies, fluxos F1 a F6, modelo de dados, fases |
| `docs/revisao-telas/05-plano-de-construcao.md` | **Plano a executar**: premissas, telas e arquivos, base comum `tx-dados.js`, convenções, fases A a F |
| `docs/revisao-telas/06-analise-como-usuario.md` | Caminhada como afretador, motorista e qualidade; três correções já aplicadas ao 04 e ao 05 |
| `reports/Concorrentes e fluxos do Traxium.md` | Relatório de mercado com seção tela a tela |
| `research_notes/Concorrentes e fluxos do Traxium/*.md` | As dez notas de pesquisa, com fontes |

## 4. O que a pesquisa e a auditoria estabeleceram

Fatos que guiam tudo, com a fonte entre parênteses.

1. Ninguém automatiza a decisão de carregamento por compartimento a partir do T-3 e da IDTF; esse é o diferencial do Traxium (relatório, seção 1).
2. **Quali-e (Qualiforce)** é o concorrente direto em GMP+: gestão de embarque. Cria a viagem pelo PDF da ordem de carregamento (modelo padrão "MODELO SISTEMA ATUA"), gera declarações, colhe assinatura do motorista por link de WhatsApp com hash, cadastra lavador como fornecedor; "liberada" significa papel assinado, não elegibilidade; sem NC, plano de ação ou EUDR; infraestrutura Replit + Neon (nota `qualiforce_e_softwares_gmp_brasil.md`). A Qualiforce é consultoria pequena (2 a 10 pessoas) que afirma atender a maioria das certificações GMP+ do Brasil.
3. **ATUA (Atua by nstech, Passo Fundo/RS)** é TMS de emissão documental conforme ANTT (CT-e, MDF-e, CIOT, contrato de frete). Segundo a reunião de sócios de 08/10/2026, é o carro-chefe usado pelos clientes, tem falhas contínuas (viagens somem do sistema) e sistemas desse tipo cobram cerca de R$ 500 por mês. Para o Traxium: integrar pela ordem e pelo CT-e, e vender integridade (nada some, tudo com histórico).
4. **Smart Feed Program (Qualikadi)**: conteúdo, treinamento e suporte técnico, não operação. **Optel** (optelgroup.com): conformidade EUDR; não pesquisado (EUDR é segunda onda).
5. GMP+ é esquema privado, não lei. No Brasil o protocolo gatekeeper (TS1.2 §4.4.1) permite usar transportador não certificado sem prazo de validade; quem o aplica precisa de acordo, T-3, instruções de limpeza pela IDTF, inspeção inicial e periódica, registro de placas e comunicação prévia ao organismo certificador (nota `gmp_obrigatoriedade_mercado.md`).
6. TS1.9 não exige inspeção externa pré-carregamento (LCI) no rodoviário; exige T-3 e limpezas por compartimento com data e assinatura, regime pela IDTF, liberação após carga proibida só pelas Opções A ou B. R1.0: registros por 3 anos, rastreio em até 4 horas.
7. EUDR vale de 30/12/2026 (médios e grandes) e não cria obrigação legal para o transportador; o que cabe a ele são 2 ou 3 campos na viagem (nota `eudr_sistemas.md`).
8. Na auditoria real: o cliente é transportadora com afretamento e várias filiais; quem trabalha todo dia é o **afretador da filial**; o TAC é qualificado **motorista a motorista e compartimento a compartimento, por viagem**; a verificação é "de conformidade online" (lonas, correntes, cintas, carroceria); o auditor amostrou 11 viagens anotando NF, DACTE com a frase "O serviço fornecido é assegurado GMP+FSA", filial, subcontratado com RNTRC, motorista, placas, três últimas cargas, data do termo e da verificação; fez teste de rastreio por placa; só limpeza seca; treinamento é lista datada; NCs vivem no formulário da consultoria (`evidencia-auditoria-real.md`).
9. Mercado de qualificação de terceiros: três portas (manual, convite, importação), importados nascem não convidados, estados separados em convite, regras e decisão comercial; owner-operator é um cadastro só (nota `onboarding_terceiros_internacional.md`).
10. Apps de campo: caminho curto, regras configuradas no escritório, um resumo antes de enviar, sincronização visível por item (nota `app_campo_inspecao.md`).
11. Padrões B2B: um primário por área, ações de linha em menu quando passam de três, paginação com total, poucos filtros fixos mais "adicionar filtro" e visões salvas, escopo escrito em cada métrica (nota `padroes_ux_b2b.md`).

## 5. Decisões tomadas

- A revisão foi feita sem alterar telas; o v1 continua no disco e no git para comparação.
- **Academy não foi cortada**: é o pilar 2 da diretriz do P.O.; vira manual versionado com ciência na viagem e registro de treinamentos, com trilhas e prova para a segunda versão.
- **Dossiê mantém os 16 itens da diretriz como conteúdo**; muda a apresentação (busca e amostra primeiro, hash fora do primeiro plano).
- Construir sem as respostas do Rafael, com as premissas de `05-plano-de-construcao.md` seção 1.
- Correções da análise como usuário: o motorista responde checklist com fotos pelo link e o afretador confere na mesa; CT-e e NF por conciliação em lote; conclusão automática; registro da simulação de rastreabilidade.

## 6. Próximo passo

Executar as fases A a F de `05-plano-de-construcao.md`, uma por vez, com commit ao fim de cada uma:

- A: `SaaS moderno estilo Dribbble/tx-dados.js` (base comum e motor) e teste Node em `scripts/`.
- B: `Viagem.dc.html` como tela de referência, com sidebar v2 gerada por script.
- C: `Hoje.dc.html` e `Link da Viagem.dc.html`, testando o fluxo F1 com o link aberto em outra aba.
- D: `Viagens v2`, `Transportadores`, `Frota`, `Compartimento v2`.
- E: `Auditoria`, `Cadastros`, `Configuracoes v2`, `versao-anterior.html`, `index.html` para Hoje.
- F: revisão de consistência; publicação só com autorização do Gabriel.

Formato das telas: componente `.dc.html` com `<x-dc>`, `<helmet>`, template com `{{ }}`, `<sc-for>` e `<sc-if>`, e `class Component extends DCLogic` com `renderVals()`; o runtime é `support.js` (gerado, não editar). Ver `Viagens.dc.html` como exemplo de padrão de sidebar, perfil, toast e skeleton.

Verificação: `python3 -m http.server` na pasta do protótipo; Chromium em `~/.cache/ms-playwright/chromium-1243`; `playwright-core` em `/mnt/d/solar-buy-side-v2/node_modules/playwright-core`. Olhar as capturas; quadro em branco é falha.

## 7. Regras do Gabriel que valem sempre

- Commit ao fim de cada etapa, em português, convencional, com a linha de coautoria.
- Nada de botão morto; toda ação deixa efeito visível.
- Texto de UI e documentos internos sem travessão (—) nem ponto médio (·); tom impessoal, sem byline, com datas absolutas.
- Visual aprovado: `SaaS moderno estilo Dribbble/CLAUDE.md` e `HANDOFF.md` (Hanken Grotesk e Spline Sans Mono, teal e azul, nada de fill pastel chapado, nada de emoji).
- Sidebar canônica idêntica em todas as telas, gerada de uma definição única; estrutura em `div`; perfil no fonte; dropdowns fecham com clique fora e Esc.
- Não publicar na Vercel nem fazer push sem pedir.
- Ele trabalha por "vibe coding" com agentes e quer opinião de produto fundamentada, decidida, com premissas explícitas quando faltar dado.

## 8. Em aberto

**Perguntas ao Rafael** (detalhe em `03-diagnostico.md` seção 5 e `06-analise-como-usuario.md` seção 6): frequência e alçadas de exceção; uso de tanque e regimes C e D; proporção TAC e ETC; quem faz a verificação e se tem fotos; quem emite o CT-e e quando; se o auditor já pediu acesso; onde vive o registro de treinamentos; ocorrências no Traxium; base compartilhada entre filiais; quem mantém a base IDTF; se o motorista próprio usa o mesmo link; quem manda o link na filial.

**Lacunas da pesquisa**: manual de usuário da IDTF não lido; preço real e número de clientes do Quali-e; o que tradings pedem hoje ao transportador sobre GMP+ e EUDR; número de empresas GMP+ com escopo de transporte no Brasil (a base pública bloqueou acesso automatizado); detalhes de Samsara e Motive vindos de resumos de busca; Checklist Fácil, Produttivo, TruckPad, CargoX, Repom, Pamcary e Reclame Aqui não pesquisados; Optel não pesquisada; datas do CIOT vindas de blogs.

**Documentos de auditoria**: os PDFs da Control Union estão na máquina do Gabriel em `D:\Downloads` (`FL_20261007222246_P11_Reporting_GMP__Annex_I_Audit_Report_G.pdf`, `9 - P08 Planning GMP.pdf` e a versão em inglês). Não entram no repositório: têm dados pessoais e de clientes.

**Outros**: o Rafael sugeriu nomes para o produto no mesmo grupo (Vantix ou Vantrix, TrustWay, Rovier System); não houve decisão. `ola.txt` na raiz é a transcrição de uma sessão antiga e não está versionado.
