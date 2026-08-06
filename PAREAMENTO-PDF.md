# Pareamento — diretriz do P.O. × o que está entregue

Fonte: `Traxium - 5 Pilares prioritários.pdf`. Conferido item a item contra o código em 05/08/2026, branch `fix/ux-fase-1-3`.

Legenda: **✓ entregue** · **~ parcial** · **✗ não iniciado**

## Resumo

| Pilar | Situação | Leitura curta |
| --- | --- | --- |
| 1 · Gatekeeper | ~ 2/3 | Estados, acordo e passaporte existem. Falta o fluxo público do transportador. |
| 2 · Academy | ~ 2/3 ✅ | **Fase 4 entregue.** Competência derivada, elegibilidade no despacho, sala virtual, just-in-time. Falta o conteúdo em si (vídeo/PDF) e as regras por cliente/filial. |
| 3 · IDTF Brasil | ~ 2/3 | Motor e camada brasileira de busca existem. Falta cadastro completo e governança. |
| 4 · Control Tower | ~ 4/5 ✅ | **Fase 5 entregue.** Verde com as 8 condições, motor configurável com piso. Falta liberação padronizada e dossiê com os 16 itens. |
| 5 · Network | ~ 1/4 | O modelo de ativos está certo. A operação em massa não existe. |
| Transversais | ~ 3/4 ✅ | Offline, imutabilidade, RBAC e **motor configurável com 4 classes** ok. LGPD incompleto. |
| §5 Ajustes no protótipo | ✓ 4/4 | Todos aplicados. |
| §8 Indicadores | ✗ 1/15 | Só "% liberadas automaticamente". |

> **Atualização — Fase 4 entregue (commits `a76cf16`…`e1a0bf2`).** O princípio central do Pilar 2 saiu do PDF e entrou no código: `competenciaMotorista()` deriva elegibilidade das trilhas concluídas, e motorista sem competência não é selecionável no despacho. As linhas do Pilar 2 abaixo estão marcadas com o estado atual. **O que segue pendente e é o buraco maior agora: `avaliarCarregamento()` ainda não consulta competência** — a trava existe no despacho, mas não como uma das oito condições do verde. É a Fase 5.

> **Atualização — Fase 5 entregue (commit `50427c7`).** O motor avalia as 12 condições e decide pela classe mais severa; as 8 do verde estão cobertas. Ganhou as 4 classes da diretriz e configuração com piso por regra. **Efeito medido: a automação caiu de 60% para 40%** — duas viagens sem nenhuma inspeção registrada eram liberadas porque a regra antiga só bloqueava inspeção explicitamente reprovada. O 60% superestimava.

**A resposta curta para "implementamos tudo?": ainda não.** Fecharam os pilares 2 e 4 no essencial. Os maiores gaps agora são o **Network** (Fase 9: importação, m:n, operação em massa), o **onboarding público do Gatekeeper** (Fase 6) e os **indicadores** (Fase 10).

---

## Pilar 1 · TRAXIUM GATEKEEPER

| O PDF pede | | Onde está / o que falta |
| --- | --- | --- |
| Estados de qualificação (9) | ✓ | `EstadoQualificacao` tem os 9, **derivados** de fato real (cert, base pública, acordo, treinamento) — não é campo editável. `model.ts:535` |
| Bloqueio automático quando o acordo expira | ✓ | `estadoQualificacao()` verifica `vigenciaFim` antes de liberar. `model.ts:678` |
| Acordo de GQ como registro controlado | ~ | `AcordoQA` tem versão, vigência, assinante, dispositivo, data. Falta: renovação, associação com representantes, termo específico de ciência do motorista. |
| Assinatura eletrônica | ✗ | O acordo registra `assinadoEm`/`assinante`, mas não existe fluxo de assinatura. |
| Onboarding por link / WhatsApp / QR | ~ | `onboarding-link-modal.tsx` gera link e envia por WhatsApp. **QR é só menção em texto** — não há QR gerado. |
| Os 11 campos do onboarding (CPF/CNPJ, CNH, RNTRC, placas, vínculo, T-3, limpezas, aceite…) | ✗ | Não existe a página pública. O modal atual só coleta o celular para enviar o convite. |
| Distinguir os 7 tipos de vínculo | ~ | `TipoVinculo` tem 5. Faltam **"motorista empregado"** e **"motorista vinculado a empresa terceira"**. `model.ts:496` |
| Checklist: imutável, assinado, vinculado, offline, fotos guiadas | ✓ | `/checklists` + `/mobile`: registro imutável com geo/hash, assinatura, retificação em vez de sobrescrita. |
| Checklist **dinâmico por tipo de implemento** | ✗ | O formulário é único; não muda entre carreta, tanque e caçamba. |
| Reprovação automática por item crítico negativo | ✗ | A reprovação é manual; nenhum item é marcado como crítico. |
| Passaporte Feed Safety (8 blocos) | ~ | 6 de 8: situação cadastral, acordo, treinamento, veículos, ocorrências/reincidências, validade. Faltam **inspeções realizadas** e **produtos/operações para os quais está apto**. |

## Pilar 2 · TRAXIUM ACADEMY

> "O princípio central deve ser: motorista sem competência comprovada não aparece como elegível para a operação."

| O PDF pede | | Onde está / o que falta |
| --- | --- | --- |
| **Motorista sem competência não aparece elegível** | ✓ | `competenciaMotorista()` em `academy.ts`; o select do despacho desabilita com o motivo, e desde a Fase 5 é também uma das condições do motor (`competencia_motorista`, piso bloqueio). |
| Sala virtual: vídeos, PDF, avaliação objetiva | ~ | `/academy` com matriz de competência, catálogo de trilhas e registro de avaliação. O **conteúdo** (vídeo/PDF) não existe — só o registro da avaliação. |
| Nota obtida, número de tentativas, aceite de ciência | ✓ | `Conclusao` guarda os três; `registrarConclusao` recusa abaixo da nota mínima, acima das tentativas ou sem aceite. |
| Certificado interno, versão do conteúdo assistido | ✓ | `certificadoId` e `versaoConteudo` gravados na conclusão. |
| Validade / periodicidade do treinamento | ✓ | `validadeMeses` por trilha; `estadoTrilha()` deriva vigente/a vencer/vencida. |
| As 10 trilhas recomendadas | ✓ | `TRILHAS` em `academy.ts`, na ordem da diretriz, com gatilho por regime/gatekeeper/reincidência. |
| Treinamento acionado por risco (5 gatilhos) | ~ | 3 dos 5 modelados (regime, gatekeeper, reincidência em fotos) e o cartão just-in-time aparece em `/mobile`. Faltam os gatilhos de produto sensível e de item de checklist reprovado. |
| Regras de liberação (nota mínima, tentativas, reciclagem, bloqueio após reprovação, por cliente/produto/filial) | ~ | Nota mínima, tentativas, reciclagem e bloqueio após reprovação existem por trilha. **Por cliente, produto ou filial, não** — é configuração, fica para a Fase 5. |
| Relatório exportável para auditoria | ✓ | "Exportar para auditoria" em `/academy` gera CSV com situação, motivo, pendências e próximo vencimento. |

## Pilar 3 · TRAXIUM IDTF BRASIL

| O PDF pede | | Onde está / o que falta |
| --- | --- | --- |
| Busca por vocabulário brasileiro | ✓ | `alias[]` + `resolveProdutoPorNome()`. "casquinha", "farelo", "soybean hulls" resolvem para o canônico sem virar produto novo. |
| Motor cruzando produto + T-3 + limpeza + regra + evidência | ✓ | `avaliarCarregamento()` é exatamente isso. É o núcleo do produto. |
| Produto não reconhecido entra em fila e fica bloqueado até definição formal | ✓ | `statusClassificacao: "em_fila"` trava o uso; `/idtf` tem a fila. |
| Registro da versão da base usada em cada decisão | ✓ | `Decisao.versaoBaseIDTF`, gravada e exibida no dossiê. |
| Evidências dinâmicas por regime (A/B/C/D) | ✓ | `/limpezas` muda os campos exigidos por regime: dosagem, tempo, enxágue, concentração. |
| Carga proibida sem botão de "lavado" | ✓ | Exige procedimento formal; é bloqueio técnico desde a Fase 3. |
| Estrutura do cadastro (18 campos) | ~ | 11 de 18. Faltam: nome oficial da fonte, sinônimos regionais separados dos brasileiros, nomes comerciais, nomes em inglês, erros comuns de digitação, estado físico, restrições, esquema de certificação, data da última atualização, responsável pela validação, fonte da decisão. |
| Os 9 rótulos operacionais do resultado | ~ | O motor tem 8 regras internas, mas não expõe "Liberado após limpeza A/B/C/D" como estados distintos — resolve para LIBERADO/ALERTA/BLOQUEIO. |
| Governança da base (8 itens) | ~ | Versão e data existem. Faltam: histórico de alterações, procedimento de revisão, aprovação técnica dos sinônimos, análise de licenciamento. |

## Pilar 4 · TRAXIUM CONTROL TOWER

O pilar mais coberto — foi o alvo da Fase 3.

| O PDF pede | | Onde está / o que falta |
| --- | --- | --- |
| Tela principal como fila de decisões | ✓ | Torre de Controle. Agrupada por severidade, ordenada por idade. |
| Modelo de decisão em 3 níveis | ✓ | `control-tower.ts`: verde/amarelo/vermelho, com o verde separando "motor" de "autoridade". |
| **Sem botão genérico de "aprovar mesmo assim"** | ✓ | Nível `tecnico` = ninguém libera, nem diretoria nem master. `podeAprovarExcecao()` nega. |
| Tempo em fila | ✓ | Contado contra o `HOJE` do protótipo. Só aparece onde há carimbo real. |
| Dossiê automático reconstruindo a decisão | ✓ | 8 seções encadeadas por hash, exportável em CSV/PDF/JSON. |
| Motivo da pendência · responsável pela análise · prazo de carregamento | ✓ | Cada item da fila traz os três. |
| **Verde exige 8 condições** | ✓ | As 8 estão no motor, mais 4 de apoio (12 no total). `avaliarCarregamento` avalia todas e decide pela classe mais severa entre as falhas. |
| Hierarquia de autoridade (6 papéis) | ~ | 4 níveis: técnico, gestor, diretoria+RT, cliente. Faltam **operador de tráfego** (pendências simples) e **inspetor** (condição física do compartimento) como níveis de decisão. |
| Registro da liberação manual (9 campos) | ~ | Tem responsável, data/hora, evidência, justificativa. Faltam: **motivo padronizado** (hoje é texto livre), situação anterior, situação posterior, impacto, validade da decisão. |
| Dossiê com os 16 itens | ~ | 8 seções cobrem viagem, compartimento, T-3, limpeza, inspeção, subcontratado, evidências, autoridade. Faltam como bloco próprio: transportador, cavalo mecânico, assinaturas, acordo vigente, treinamentos, documentos da viagem. |
| Painel: fotos e documentos essenciais · risco GMP+ · notificações pendentes | ✗ | Não aparecem na fila. |

## Pilar 5 · TRAXIUM NETWORK

| O PDF pede | | Onde está / o que falta |
| --- | --- | --- |
| **T-3 no implemento/compartimento, não na placa do cavalo** | ✓ | É o princípio nº 1 do modelo de domínio. `loadHistory` mora no compartimento. |
| Separar cavalo, implemento, compartimento, motorista, proprietário | ✓ | `Cavalo` / `Implemento` / `Compartimento` distintos, com `/frota` mostrando a cadeia. |
| Relações m:n com datas de início/fim e histórico | ~ | `veiculosAutorizados[]` e `motoristasAutorizados[]` são listas de string dentro do subcontratado — não há tabela de vínculo nem vigência. |
| Cadastro sem atrito (link, WhatsApp, código temporário, CPF/CNPJ como referência) | ~ | Link e WhatsApp existem. Falta acesso temporário por código. |
| Importação por planilha · cadastro em lote | ✗ | Não existe. |
| Detecção de duplicidades | ✗ | Não existe. |
| Consulta rápida por CPF, CNPJ, placa ou telefone | ~ | A busca global cobre nome/placa/código, mas não CPF nem telefone. |
| Renovação coletiva de acordos · envio coletivo de treinamentos · alertas em massa | ✗ | Não existe. |
| Arquivamento sem apagar histórico | ✗ | Só em `/documentos`, não em cadastros. |
| Filtros por filial, contratante e período | ~ | Filial existe no shell. Contratante e período, não. |
| Teste de escala (3–5× o volume típico) | ✗ | Protótipo com 4 subcontratados e 6 viagens. |

## Requisitos transversais (§4)

| O PDF pede | | Onde está / o que falta |
| --- | --- | --- |
| Offline-first: abrir, preencher, fotografar, assinar, salvar sem internet | ✓ | `/mobile` opera offline com toggle de sinal. |
| Os 4 estados de sincronização | ✓ | `EstadoSync`: sincronizado, sincronizando, salvo, divergente. |
| Evidência imutável, correção gera nova versão | ✓ | Hash-chain no dossiê; retificação em vez de sobrescrita. |
| Alterações de regra não mudam decisões históricas | ✓ | A decisão grava a versão da base e é avaliada na data da viagem, não "hoje". |
| Baixa fricção (botões grandes, poucos campos, fotos guiadas) | ✓ | `/mobile` segue o padrão. |
| Motor de regras com **4 classes** | ✓ | `ClasseRegra` em `motor-config.ts`: bloqueio, alerta, registro, informação. |
| Motor **configurável** | ✓ | Aba "Motor de regras" em `/configuracoes`, com **piso por regra**: as 7 de bloqueio técnico aparecem travadas com o motivo. Configurável não é negociável. |
| LGPD: acesso por função · logs · ocultação de documentos sensíveis | ✓ | RBAC por papel, `/atividade` com ator e payload, CPF mascarado. |
| LGPD: prazo de retenção · política de inativação · consentimentos e bases legais | ✗ | Não existem. |

## §5 · Ajustes pedidos no protótipo

| | | |
| --- | --- | --- |
| 5.1 Certificação é da empresa, não da carreta | ✓ | Aplicado na Fase 1. |
| 5.2 MOPP fora do requisito GMP+ | ✓ | Aplicado na Fase 1. |
| 5.3 "Inspeção pré-carregamento" no lugar de LCI isolado | ✓ | Aplicado na Fase 1. |
| 5.4 Dashboard como torre de controle, não vitrine de gráficos | ✓ | Torre de Controle é a home do modo MVP. |

## §6 · EUDR

O PDF pede **só o modelo de dados** agora (lote, fornecedor, origem, fazenda, CAR, polígono, documento de origem, DDS, segregação, vínculo carga–viagem) e nada de análise geoespacial.

Situação: `/lotes` e `/fazendas` já têm lote, fazenda, CAR, polígono e DDS. É a Fase 6 planejada — **sem risco de atraso**, e o PDF explicitamente manda não desviar os desenvolvedores para cá.

## §8 · Indicadores do MVP

**1 de 15.** Só "percentual de operações liberadas automaticamente" existe (os 60% da Torre, entregues na Fase 3).

Os outros 14 — tempo médio de cadastro de TAC, tempo de checklist, % de T-3 completos, tempo de análise das amarelas, % de motoristas com treinamento vigente, tempo para gerar dossiê, reincidência por subcontratado, % de cadastros duplicados etc. — não são medidos. Vários dependem de telemetria que o protótipo não tem.

### Metas funcionais do MVP (8)

| | | |
| --- | --- | --- |
| 1. Cadastrar ou recuperar um TAC rapidamente | ~ | Cadastro existe; o fluxo público do transportador, não. |
| 2. Vincular motorista, implemento e compartimento | ✓ | `nova-viagem-modal` faz os três. |
| 3. Coletar acordo, T-3, limpeza, inspeção e assinatura | ✓ | Todos existem, cada um na sua tela. |
| 4. Decidir se a carga pode seguir | ✓ | Motor de regras. |
| 5. Bloquear situações críticas | ✓ | Bloqueio técnico irrevogável. |
| 6. Encaminhar apenas exceções para análise | ✓ | Fila de decisões + auto-liberação. |
| 7. Produzir dossiê auditável em poucos cliques | ✓ | `/dossie`, com exportação. |
| 8. Funcionar em campo com sinal instável | ✓ | `/mobile` offline-first. |

**6 de 8 fechadas, 2 parciais.** As metas funcionais estão bem melhor cobertas que os pilares — o que faz sentido: elas medem o caminho crítico da operação, e é exatamente onde as fases 1–3 atacaram.

---

## O que eu recomendaria priorizar

1. **A regra de elegibilidade do Academy.** Não é a sala virtual inteira — é fazer `avaliarCarregamento()` checar competência do motorista e o select de motorista esconder quem não tem. É o princípio central do Pilar 2, é barato, e fecha junto duas das oito condições do verde do Pilar 4.
2. **Completar as condições do verde.** Acordo vigente e treinamento concluído já existem no modelo; falta o motor consultá-los. Sem isso, "liberação automática" libera com menos verificação do que o PDF define.
3. **Fluxo público de onboarding.** É o começo da jornada inteira do Gatekeeper e hoje o link não leva a lugar nenhum.
4. **Motivo padronizado na liberação manual.** Texto livre não sobrevive a auditoria; é uma lista fechada, barato de fazer.
