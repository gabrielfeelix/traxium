# TRAXIUM — Pesquisa UX por Personas (19 jornadas reais)

> Método: usability walkthrough baseado em personas + auditoria de comportamento **real do código** (não da promessa dos planos).
> Base: `traxium_perguntas_rafael_v2` (30 perguntas, RD Insight/Bom Frete) + `PLANO-PRODUTO` + `PLANO-INTERACOES` + `PLANO-CORRECOES` + `DESIGN.md` + leitura das 18 rotas e ~20 modais.
> Data de referência do sistema: `HOJE = 2026-07-08`. Store em memória: recarregar zera tudo.

**Legenda de veredito por tarefa:**
- ✅ **Consegue** — o fluxo funciona ponta-a-ponta como esperado.
- ⚠️ **Consegue com atrito** — chega ao fim, mas com fricção, microação faltante ou confusão.
- 🟥 **Não consegue** — o fluxo trava, não existe, ou o botão é morto.
- 👻 **Ilusão** — parece que fez (toast/tela de sucesso), mas nada aconteceu de verdade. **O mais perigoso num produto de compliance.**

---

## 0. A verdade estrutural que atravessa TODAS as 19 pessoas

Antes das jornadas, quatro fatos do código que reescrevem quase todo o resto. Não são bugs de tela — são a fundação:

1. **Não existe RBAC. Existe uma identidade só.** Não há usuário, papel ou permissão no store (`session.tsx` não tem `user`/`role`). O login (`login/page.tsx:70`) aceita qualquer coisa e vai pra `/`. A topbar mostra `"Gabriel Felix · UX · Admin"` fixo. **Todas as 19 pessoas veem exatamente a mesma tela de admin onipotente, com os mesmos dados da Bom Frete.** O motorista pode aprovar exceção. O auditor externo — que por design *não* deveria ter login — entraria e veria tudo. Metade do valor regulatório do produto (matriz de autoridade, "motorista nunca libera sozinho", "auditor só exporta") é **texto na tela, não regra no sistema.**
2. **O app do motorista (`/mobile`) é uma maquete 100% estática.** Importa só `useState` — não fala com o store. Câmera não tem `onClick` (não captura nada). Checklist tem progresso "3/7 · 43%" hardcoded, sem toggle. Nada persiste. É um vídeo clicável, não um app. **Toda a tese offline-first/antifraude existe como cópia, não como comportamento.**
3. **BLOQUEIO não bloqueia.** A demonstração central do produto — "o sistema impede carregar sobre compartimento sujo" — não impede. O wizard de nova viagem cria a viagem mesmo assim, com status "Bloqueada" (`nova-viagem-modal.tsx:67`). É etiqueta, não trava.
4. **Polimento alto sobre interação oca.** O design system é sofisticado de verdade (sombras brand-tinted, Leaflet real, T-3 com pulse-ring, densidade calibrada). Mas muitos números "duros" (score 92.4, risco EUDR, latência TRACES 312ms, fontes "Sincronizado") são constantes. Num produto de auditoria, **um protótipo bonito demais mente sobre o quanto já é auditável.**

Guarde esses 4. Eles aparecem em quase toda persona abaixo.

---

# PARTE I — AS 19 JORNADAS

---

## 1. Jéssica Silva — Despachante/Tráfego · matriz Rondonópolis-MT · desktop · safra em pico

*(Perfil real citado no doc do Rafael, pergunta 30.)*

**O que ela faz no dia:** cria 30-40 viagens, troca veículo de última hora, resolve pendências rápidas, avisa motorista no WhatsApp.

- **Criar viagem nova** — ✅/⚠️. Wizard de 3 passos funciona e é o melhor fluxo do sistema. Passo 2 mostra **prévia real do T-3** do compartimento assim que ela escolhe a boca (`getT3`, dado verdadeiro). Passo 3 roda o motor de verdade e mostra o tier. **Atrito:** produtos `em_fila` somem do seletor (bom), mas **"Defensivo agrícola líquido" (proibido) fica selecionável como carga a transportar** — o motor só olha a carga *anterior*, não trava a atual. Ela cria uma viagem de defensivo sem um pio.
- **Despachar sobre compartimento bloqueado** — 👻. O compartimento `MNB-7D29` teve defensivo e nunca foi limpo. O passo 3 mostra 🔴 BLOQUEIO com mensagem impecável. Ela clica **"Criar como bloqueada"** e... a viagem é criada. O toast diz "Abra uma exceção para tratar". A tese "o sistema impede" virou "o sistema avisa e deixa passar".
- **Troca de veículo de última hora** — 🟥. Não existe editar viagem. Ela teria que... criar outra? Não há "trocar cavalo/carreta" numa viagem existente — exatamente o cenário que o Rafael marcou como o mais comum da safra (pergunta 06, passo 2).
- **Avisar o motorista** — ✅. "Contatar motorista" abre modal com `wa.me/55...` e `tel:+55...` reais. Ótimo detalhe.
- **Filtrar a fila do dia** — ⚠️. Busca e filtro de status funcionam. Mas **"Mais filtros" é botão morto**, e no dropdown de cada linha "Re-validar regras / Imprimir guia / Cancelar viagem" **não fazem nada**.

**Veredito:** o coração do produto pulsa aqui, mas o músculo do bloqueio não contrai, e falta a operação nº1 da safra (trocar veículo). Justificativa de alerta é digitada e **descartada** (o toast mente "justificativa registrada", `nova-viagem-modal.tsx`).

---

## 2. Thiago Yamashida — Gestor GMP+/Qualidade · desktop · responde auditoria

*(Perfil real, pergunta 30.)*

**O que ele faz no dia:** aprova exceções, classifica produto na fila IDTF, monta dossiê pra auditoria, acompanha NCs.

- **Classificar produto na fila IDTF** — ✅. Melhor fluxo depois do wizard. Casca de soja está `em_fila`; ele abre "Classificar", define regime mínimo, marca proibido-p/-feed, salva. O produto **sai da fila na hora**, o contador cai, some do bloqueio, entra na base. Reativo e correto.
- **Aprovar uma exceção de bloqueio** — 👻. Ele vê a fila em `/excecoes`, clica "Aprovar liberação". A UI responde. Mas a decisão vive só em `useState` local (`excecoes/page.tsx:56`) — **não persiste**. Recarregou, sumiu. E o aprovador é gravado como `"Você · aprovação simulada"`.
- **Montar dossiê pra auditoria** — ✅/⚠️. A **reconstrução de decisão do dossiê é real e computada**: por viagem, mostra motor+tier, T-3 do compartimento, limpeza exigida×aplicada, inspeção, cert do subcontratado "no momento". É o entregável-central do MVP e ele existe. **Atrito:** a copy promete filtro "por compartimento e cliente" que **não existe**; a decisão é avaliada numa data fixa (2026-05-25) pra toda viagem, não na data de cada uma.
- **Exportar o pacote** — ⚠️/👻. CSV e JSON baixam de verdade. Mas o botão **"Gerar ZIP" baixa um `.json`** (rótulo mente), e o payload **omite o bloco de evidências** que a barra promete ("fotos com geo/hash"). "PDF" é `window.print()`.

**Veredito:** o Thiago é o usuário mais bem servido — a espinha auditável (IDTF→dossiê) está de pé. Mas a aprovação dele evapora no reload, e o pacote que ele entrega ao auditor está incompleto e mal-rotulado.

---

## 3. Seu Valdir — Motorista próprio, 58 anos · Android trincado · pátio de armazém sem sinal · letramento baixo

**O que ele faz no dia:** abre a viagem no celular, confere o compartimento, tira as 6 fotos, assina, envia. 4 minutos, fila atrás.

- **Abrir a viagem e ver o que fazer** — ⚠️. A tela mobile é limpa, uma ação por tela, linguagem operacional (a BloqueioScreen explica "Por quê?" + "O que fazer agora?" numerado — exatamente o tom certo do Rafael, pergunta 10). Visualmente honra o requisito.
- **Preencher o checklist** — 🟥. O checklist mobile é **estático**: itens hardcoded `ok:true/false`, "3/7 · 43%" fixo, **nada é clicável**. Seu Valdir não consegue marcar um item.
- **Tirar as 6 fotos** — 🟥. A tela de câmera mostra ângulo "Foto 6/6 · placa", geo, hash, "galeria bloqueada" — tudo certo no discurso. Mas **o botão do obturador não tem handler**. Ele aperta e não acontece nada.
- **Trabalhar sem sinal** — 👻. O toggle online/offline muda os banners ("Sem sinal · 3 itens salvos no aparelho"). Mas não há item real salvo — os estados de sync são derivados do booleano, não de dados. A fila é uma pintura.
- **Assinar e enviar** — 🟥. "Sincronizar agora" fica `disabled` offline; online, não faz nada.

**Veredito:** para a pessoa mais importante do sistema (é o dado dela que o auditor confia), **o app não é operável**. É uma maquete de apresentação. Requisito nº1 do Rafael (offline-first + 3-5 min) está presente como estética, ausente como função.

---

## 4. Cleiton — Motorista agregado · aparelho compartilhado · 1ª viagem com o app

**O que ele faz:** login no aparelho de outro, achar a viagem dele, entender o que o sistema quer.

- **Fazer login** — ⚠️. A login screen do mobile existe. Mas como é aparelho compartilhado e não há identidade real, não há "trocar de motorista". Qualquer um vê tudo.
- **Descobrir o que fazer sem treino** — ⚠️ na estética, 🟥 na prática. A hierarquia visual ajuda um novato. Mas como nada é clicável (ver Valdir), ele não tem como *aprender fazendo*. Não há onboarding, tooltip, "primeiro passo".
- **Entender um bloqueio** — ✅ (visual). A BloqueioScreen é genuinamente boa para baixo letramento: causa + ação numerada + "pontos de lavagem". Se fosse real, seria exemplar.

**Veredito:** o design *pensa* no Cleiton (linguagem, uma-ação-por-tela). O sistema não *serve* o Cleiton (nada funciona). A distância entre os dois é o maior débito do produto.

---

## 5. Marcão — Inspetor de pátio · tablet sujo · apressado

**O que ele faz:** valida o compartimento visualmente, reprova o que tem ferrugem/resíduo, abre NC quando acha problema fora do checklist.

- **Rodar a inspeção LCI** — ✅/⚠️. `/checklists` é bom: tri-state conforme/não-conforme real, 6 condições mínimas ("Sem resíduo visível >1cm", "Estrutura íntegra (sem ferrugem)"), 6 ângulos de foto obrigatórios, resultado calculado ao vivo (aprovado/reprovado/pendente). Registrar persiste. **Atrito grave:** a inspeção é gravada com **`viagemId:""`** — ou seja, **não vincula a viagem nenhuma**, não destrava o LCI de nenhuma viagem real, e não aparece com link de viagem. A copy jura "vinculado ao compartimento e à viagem". Metade da promessa é falsa.
- **Reprovar por ferrugem** — ✅. Ele marca "Estrutura íntegra" como não-conforme → resultado vira 🔴 Reprovado ao vivo → botão vira "Registrar reprovação". Exatamente o cenário da pergunta 23 do Rafael (ferrugem no compartimento).
- **Abrir NC manual do que viu** — ⚠️/👻. `/bloqueios` → "Reportar NC manual" abre modal (severidade/categoria/descrição). Cria a NC. **Mas:** os campos "vincular a viagem/veículo/motorista" são **texto livre** (sem picker), a NC nasce **sem CAPA** (clicar "CAPA" nela depois não expande nada), e a busca+filtros da tela de bloqueios **são mortos**.
- **Anotar observação livre** — 🟥. O campo "Observações do inspetor…" no checklist **não é capturado** (input solto sem state).

**Veredito:** o Marcão quase tem uma ferramenta de verdade — é a segunda tela mais funcional. Mas a inspeção que ele registra não conversa com a viagem, e a NC que ele abre é um beco (nasce sem plano de ação e não vincula nada de forma estruturada).

---

## 6. Dona Sônia — Analista de qualidade júnior · desktop

**O que ela faz:** processa a fila de classificação IDTF, cadastra produto novo, registra limpezas regime C/D das estações.

- **Classificar a fila** — ✅ (ver Thiago #2). Funciona bem.
- **Cadastrar produto novo na base** — ⚠️. "Novo produto IDTF" funciona, mas **pula a fila**: nasce `classificado` com `riscoEUDR: "N/A"` hardcoded. Ou seja, o mecanismo "produto desconhecido trava até a qualidade analisar" (pergunta 19) só vale para os 2 seeds; nada novo cai na fila de verdade.
- **Registrar limpeza Regime C** — ✅/⚠️. O form **dinâmico por regime é real** e é um brilho: A pede 4 campos, D pede 19, cumulativo. Progresso ao vivo, trava até 100%. Registrar persiste e **muda o status do compartimento** de verdade. **Atritos:** (a) a página **nunca mostra o status do compartimento** — ela registra e não vê "bloqueio removido" sem navegar pra Frota; (b) **sem guarda contra regime insuficiente** — ela pode registrar Regime A num compartimento que exige D, persiste, e nada avisa; (c) num Regime D, os campos que *definem* o D (desinfetante, dosagem, tempo de contato, eficácia, aprovação) são coletados e **descartados** — não entram no `CleaningEvent`. A evidência de desinfecção some.
- **Registrar limpeza de carga proibida** — 🟥. Não há o "procedimento de liberação de carga proibida ≠ limpeza comum" (pergunta 18). É só mais um regime no seletor.

**Veredito:** a Sônia tem o form mais bem-pensado do sistema (dinâmico por regime), mas ele **guarda menos do que coleta** e **não fecha o loop visualmente** — ela nunca vê o efeito do próprio trabalho sem sair da tela.

---

## 7. Roberto — Diretor + Responsável Técnico · desktop · 3 min entre reuniões

**O que ele faz:** aprova só exceção nível 2 (impacto contratual, uso de terceiro emergencial, risco residual aceito).

- **Ver só o que exige a autoridade dele** — 🟥. Não há filtro por nível de autoridade nem visão "o que espera *minha* assinatura". A `/excecoes` mostra tudo pra todos. A "matriz de 4 níveis" na tela é decorativa (só 3 níveis reais no modelo; o card "Crítico" não tem chave de autoridade).
- **Co-assinar uma exceção nível 2** — 👻. O modelo tem `diretoria_rt` como nível, mas **nenhuma checagem** compara o nível requerido com quem está clicando. O Roberto e o motorista têm o mesmo botão "Aprovar liberação". A co-assinatura (gestor + diretoria) da pergunta 04 não existe.
- **Aceitar risco residual formalmente** — 🟥. Não há campo de "risco residual aceito" no fluxo de aprovação (existe no modelo de dados, não na UI).

**Veredito:** para o Roberto, o sistema é **indistinguível do de qualquer outro usuário**. Toda a razão de existir do perfil dele — ser o único que pode assumir certas exceções — não está implementada. É o rosto mais claro do problema estrutural nº1.

---

## 8. Fernanda — Admin de subcontratados · desktop

**O que ela faz:** qualifica empresas terceiras, monitora vencimento de certificados, bloqueia terceiro vencido antes da safra.

- **Qualificar um subcontratado novo** — ✅/⚠️. O modal cobre o essencial (CNPJ, cert GMP+, escopo Road/Affreightment, sites, veículos/motoristas autorizados, treinamento). **Atrito:** é um diálogo rolável, não o wizard de 3 passos que o plano descreve; e o **escopo incompatível não valida nada** — o escopo vira badge decorativo, nunca é comparado com a operação. A pergunta 21 ("validar mais que o CNPJ, conferir escopo") fica pela metade.
- **Confiar no status Apto/Bloqueado** — 👻/⚠️. O card computa Bloqueado por *vencido* ou *status base pública ≠ Ativo* — bom. Mas o **toast do próprio modal só checa a base pública**: ela pode salvar um subcontratado com validade **vencida**, receber "Escopo válido — apto a operar", e o card ao lado mostrar **"Bloqueado"**. Contradição na cara.
- **Caçar certificados vencendo** — ✅ (display). Badges 60/30/15d e card "A vencer (≤60d)" existem e contam certo. Bom para triagem visual.
- **Garantir que o vencido não opera** — 🟥. O "bloqueado" aqui **não trava nada downstream**. Não impede o despachante de escolher aquele terceiro numa viagem. É um selo, não um portão. (O motor *tem* a regra de cert vencido, mas a tela de subcontratados não a aciona.)

**Veredito:** boa tela de *monitoramento*, fraca de *enforcement*. E o toast que contradiz o card mina a confiança dela no primeiro uso.

---

## 9. Dr. Klaus — Auditor externo/certificadora · **não deveria ter login** · recebe ZIP/PDF

*(Por design, pergunta 05: auditor externo trabalha por amostragem e recebe evidência exportada.)*

**O que ele quer:** pegar uma viagem de 3-6 meses atrás e reconstruir a decisão — por que liberou, qual carga anterior, qual limpeza, quem validou, cadê a foto.

- **Receber o dossiê** — ⚠️. O Thiago consegue exportar CSV/JSON com a reconstrução computada — isso é forte. **Mas** o "ZIP" é um JSON, o PDF é print de tela, e o payload **não traz as evidências** (fotos/geo/hash) que são justamente o que o Klaus mais quer conferir. A pergunta 14 (integridade: "confiar que o dado pertence àquele compartimento naquele momento") não é demonstrável — não há foto real, nem hash de verdade no export.
- **Reconstruir a decisão** — ✅ (no conteúdo textual). A estrutura da reconstrução é exatamente a certa: motor+T-3+limpeza+inspeção+cert-no-momento. Se as evidências estivessem no pacote, passaria.
- **NÃO acessar o sistema** — 🟥. Se alguém der o link/login pra ele, ele **entra como admin e vê tudo** (LGPD, dados comerciais de terceiros, viagens fora do escopo). O risco que o Rafael explicitou na pergunta 05 está aberto.

**Veredito:** o *formato* da entrega convence; o *conteúdo* (evidência travada com hash) e a *contenção de acesso* não existem. Para um auditor, é a diferença entre "organizado" e "confiável".

---

## 10. Patrícia — Auditora interna/consultora · desktop

**O que ela faz:** amostra viagens por período, abre NC do que encontra, gera relatório interno.

- **Amostrar viagens por período** — ✅/⚠️. Dossiê filtra por período/status/produto. Funciona. Falta filtro por compartimento/placa dedicado (só busca текст).
- **Abrir NC com causa raiz e CAPA** — 🟥. Ela reporta a NC, mas **não consegue preencher a CAPA** (causa raiz → ação corretiva → eficácia). O painel CAPA é read-only e a NC nova nasce sem ele. A pergunta 23 do Rafael ("NCs tratadas só com correção imediata, sem causa raiz e ação corretiva") — o sistema **reproduz o anti-padrão** em vez de corrigi-lo.
- **Consultar continuamente (não "arrumado pra auditoria")** — ⚠️. A auditoria como consulta contínua (pergunta 24) existe em partes (dossiê, atividade), mas /atividade tem **busca, filtros e export mortos**, então a investigação livre trava rápido.

**Veredito:** ela encontra o problema, mas não consegue **tratá-lo com rigor** (CAPA), que é o ponto inteiro de uma auditoria interna.

---

## 11. Zé da Lava-Jato — Fornecedor de limpeza/estação

**O que ele faz:** executa a limpeza C/D e devolve comprovante/foto/método/produto.

- **Lançar o comprovante da estação** — 🟥. Não há perfil nem tela para o fornecedor de limpeza (pergunta 11). A evidência dele só existe como *toggle* "Comprovante da estação" no form que a Sônia preenche — ou seja, alguém do escritório afirma que existe, sem o anexo real. É o exato buraco de integridade que o Rafael cita ("limpeza informada como 'lavado' sem método/evidência/responsável").

**Veredito:** persona não atendida (aceitável para MVP, mas a evidência-fim dela fica sem lastro — vira declaração, não comprovante).

---

## 12. Marina — Analista EUDR · desktop

**O que ela faz:** recebe CAR/polígono da trading, cadastra fazenda, monta lote com N origens, gera pacote DDS.

- **Cadastrar fazenda + importar polígono** — 👻. O framing "guardiã de evidência" está certo na copy. Mas **não há file input**: os 4 botões (Shapefile/GeoJSON/KML/PDF) só dão toast "Polígono importado". Salvar grava **5000ha fixo, polígono quadrado de 4 vértices, risco "Baixo"** — inventado. O mapa Leaflet é real e bonito, mas mostra dados falsos.
- **Confiar no score de risco** — 👻. "Score detalhado" e "Fontes consultadas: Sincronizado (INPE/MapBiomas/CAR)" são **constantes**. Nada é validado. Só o item "desmatamento pós-2020" muda com um booleano.
- **Montar lote com várias fazendas** — ✅. Ponto forte: novo lote suporta **N origens com toneladas** (add/dedupe/soma ao vivo), com o framing de mistura correto (pergunta 27). Isso está genuinamente bom.
- **Gerar e enviar a DDS** — ⚠️/👻. "Enviar" muda o status (Rascunho→Pronto→Enviado TRACES) e gera um número DDS — mas **nunca aparece no log do Gateway TRACES** (a tela do gateway é 100% inerte), e nunca volta pra "Aprovado". O workflow real (Rascunho→Pronto→Enviado→Aprovado) diverge do plano (pendente→recebido→validado→exportado→DDS).

**Veredito:** a espinha EUDR (lote→origens) é sólida; tudo que depende de **dado externo** (polígono, risco, TRACES) é encenação. Para preparar pro marco de 30/12/2026, o cadastro-rede existe, a validação-de-origem não.

---

## 13. Hans — Cliente embarcador (trading exportadora) · externo

**O que ele quer:** antes de fechar carga de exportação, evidência confiável de origem; poder liberar só escopo comercial (atraso/troca de veículo), nunca "perdoar" contaminação.

- **Receber evidência de origem** — 👻. O que a Marina exporta é o lote com origens declaradas — mas os polígonos/scores são inventados (ver #12). Não é evidência confiável, é estrutura preenchida com placeholder.
- **Liberar escopo comercial** — 🟥. Não há papel "cliente/embarcador" nem ação "aceitar atraso/troca". A matriz mostra o card "Cliente (só escopo comercial · NUNCA reduz exigência)" como **texto**. A pergunta 04 (cliente libera comercial, nunca contaminação) não é operável.

**Veredito:** persona externa não atendida; a salvaguarda que a protege ("cliente não perdoa contaminação") é slogan, não regra.

---

## 14. Lucas — Estagiário de tráfego · 1º dia · sem treino

**O que ele faz:** tentar entender o sistema sozinho, usar busca pra achar as coisas, não quebrar nada.

- **Navegar e se localizar** — ✅. A sidebar (5 grupos, 20 itens, ícones claros, sem 404) é boa arquitetura de informação. Ele se acha.
- **Usar o ⌘K pra agir rápido** — 👻. Ele abre a busca, vê "Ações rápidas → Nova viagem", clica esperando o wizard... e cai na **lista** `/viagens`. As "ações rápidas" **só navegam, não executam** (`command-palette.tsx`). Enganoso — promete verbo, entrega substantivo.
- **Pedir ajuda / IA** — 👻. O Copilot (⌘J) abre e todo botão dá toast "Copilot em breve · próxima fase". Descoberta zero.
- **Aprender pelos badges** — ⚠️. Os contadores da sidebar (184 viagens, 7 NCs, 2 exceções) são **hardcoded** — não mudam quando ele cria coisas. Ele aprende um número que é mentira.

**Veredito:** ótima navegação de primeiro contato, mas as duas affordances de "produtividade rápida" (⌘K ações, Copilot) prometem e não entregam — frustração clássica de novato.

---

## 15. Seu Antônio — Motorista em queda sistêmica · app fora do ar · offline total

**O que ele quer:** quando o sistema cai, ainda liberar a carga por formulário contingencial aprovado pela qualidade (pergunta 13), com lançamento posterior.

- **Achar o modo contingencial** — 🟥. Não existe. O plano cita "formulário contingencial aprovado pela qualidade" como requisito; a UI não tem. Em queda real, o Seu Antônio não tem plano B no sistema — volta pro WhatsApp, que é o que o produto quer matar.

**Veredito:** cenário-limite crítico do Rafael não coberto. Aceitável priorizar depois, mas é o buraco que reabre o WhatsApp.

---

## 16. Cláudia — Gestora multi-filial (Bom Frete tem 3 filiais) · desktop

**O que ela faz:** troca de filial/tenant, compara indicadores entre unidades.

- **Trocar de tenant/filial** — 👻. O seletor de tenant na topbar troca **só o rótulo e as iniciais** + um toast. **Nenhuma tela lê o tenant ativo** — os dados não re-escopam. Ela "troca de empresa" e vê exatamente os mesmos números.
- **Consolidar indicadores** — 🟥. Não há visão multi-filial. O DESIGN.md promete multi-tenant "explícito no topbar"; é verdade visualmente, falso funcionalmente. A pergunta 15 (nascer multiempresa/multifilial) está representada, não implementada.

**Veredito:** multi-tenant é uma pintura na topbar. Para uma gestora de rede, o sistema é mono-filial disfarçado.

---

## 17. Wesley — Motorista bloqueado no pátio · Android · fila atrás dele

**O que ele vive:** chega pra carregar, o motor bloqueia (carga anterior proibida), e agora?

- **Entender por que bloqueou** — ✅ (conteúdo). A mensagem do motor é exemplar: *"A última carga do compartimento MNB-7D29 foi Defensivo agrícola líquido em 22/05. A IDTF exige regime D antes de carregar farelo. Limpeza correspondente não foi evidenciada."* + ação sugerida + base IDTF. Isso é ouro de UX regulatória.
- **Registrar ocorrência e pedir liberação (do celular)** — 🟥. No app mobile, a BloqueioScreen explica lindamente o "o que fazer", mas **nada é clicável** — ele não registra ocorrência, não anexa evidência, não solicita análise. No desktop, o banner tem "Solicitar evidência ao motorista" (👻 toast) e "Liberar sob exceção" (→ link real /excecoes).
- **Esperar a decisão** — 👻. Mesmo que alguém aprove no desktop, a decisão **não persiste** e a viagem-bloqueada não muda de status (não há transição Bloqueada→Liberada após exceção aprovada). O Wesley fica bloqueado pra sempre no protótipo.

**Veredito:** a **explicação** do bloqueio é o melhor momento de UX do produto inteiro. A **resolução** do bloqueio é um beco sem saída — o loop bloqueio→ocorrência→autoridade→liberação (pergunta 04) não fecha.

---

## 18. Rita — Analista administrativo · desktop

**O que ela faz:** convida usuário novo, gerencia plano/tokens, envia documentos normativos.

- **Convidar usuário** — ✅/⚠️. Funciona (prepend na equipe local). Mas o "Papel" que ela escolhe é **string decorativa** — não muda o que a pessoa pode fazer (ver problema estrutural nº1). "Gerenciar" por usuário é morto.
- **Enviar documento normativo** — ⚠️/👻. Tem file input real (lê nome/tamanho), mas **não faz upload**: prepend em state local que **some no reload**. Download por linha = toast sem arquivo.
- **Mexer no plano/faturamento** — 🟥/👻. Inputs uncontrolled, "Mudar plano"/"Cancelar" mortos, "Baixar fatura"/"Gerar token" só toast.

**Veredito:** camada administrativa é a mais decorativa (esperado para P2), mas "convidar com papel que não faz nada" reforça a ilusão de RBAC.

---

## 19. Sr. Nogueira — Dono/CEO · celular · abre 1x/dia

**O que ele quer em 20 segundos:** "Tô exposto? Quantos bloqueios hoje? Tem auditoria chegando?"

- **Ler o dashboard** — ✅ (visual) / 👻 (dado). Bonito, denso, KPIs com sparkline, banner "Auditoria em D-23 · conformidade 97.8%". Responde a pergunta emocional dele. **Mas os números são estáticos** — o "97.8%", o "191", os deltas não computam. Se a operação piorar, o dashboard não sabe.
- **Filtrar período** — 👻. "Últimos 30 dias" troca o rótulo e dá toast "(protótipo)"; os KPIs **não recalculam**.
- **Abrir no celular** — 🟥. O app é desktop-first denso; não há layout responsivo do back-office pro celular do dono (o /mobile é o app do *motorista*, não a visão executiva).

**Veredito:** o painel *sente* como a resposta que o CEO quer — e essa é a armadilha. Num produto de risco, um número tranquilizador que não é calculado é pior que nenhum número.

---

# PARTE II — SÍNTESE

## A. O que eu senti falta (gaps de produto)

1. **Enforcement real, não etiqueta.** O trio "BLOQUEIO que bloqueia · cert vencido que trava despacho · não-classificado que trava o motor" é a razão de existir do produto e hoje é aviso. (Personas 1, 8, 17.)
2. **RBAC de verdade** — nem que seja um seletor de papel no protótipo que esconda/mostra ações. Sem isso, 7 das 19 personas (diretor, auditor externo, cliente, motorista, inspetor, admin subcontratado, gestor) colapsam numa só. (Personas 7, 9, 13, 16.)
3. **App do motorista operável** — o cliente #1 do Rafael. Marcar checklist, capturar foto (mesmo mock), enfileirar offline de verdade, enviar. (Personas 3, 4, 17.)
4. **Fechar o loop de exceção** — bloqueio → ocorrência do motorista → roteamento por autoridade → aprovação persistente → **viagem muda de Bloqueada→Liberada**. Hoje quebra em 3 pontos. (Personas 2, 7, 17.)
5. **CAPA editável** — causa raiz/ação corretiva/eficácia. É o que separa "auditável" de "planilha bonita". (Personas 5, 10.)
6. **Editar viagem / trocar veículo** — a operação nº1 da safra não existe. (Persona 1.)
7. **Evidência com lastro no export** — fotos+geo+hash no pacote do auditor, e contenção de acesso do auditor externo. (Persona 9.)
8. **Formulário contingencial** para queda sistêmica. (Persona 15.)

## B. O que está mais complexo do que deveria

- **Dois motores de regra com duas datas de referência** (`avaliarNovoCarregamento` @hoje simples × `avaliarCarregamento` @2026-05-25 completo). A mesma viagem lê tiers diferentes no wizard e no detalhe. Unificar num motor só, uma data só.
- **Dois conceitos de "subcontratado"** paralelos (entidade em `/subcontratados` × aba Tipo="Subcontratado" em `/motoristas`, hoje só-leitura e confusa). O modal já manda "não cadastre aqui" — então **remova a aba**.
- **Duas entradas idênticas** pro mesmo modal de fazenda (botão GeoJSON + botão Cadastrar). E o **plano de preparação duplicado** (8 itens na aba × 12 no modal, divergentes). Escolher uma fonte.
- **Limpezas coleta 19 campos e guarda ~9** — o form pede mais do que o schema aceita. Ou guarda tudo, ou não pede.

## C. Onde a UX confunde (padrões, não casos isolados)

- **Toast que mente.** "Justificativa registrada" (descartada), "Modelo removido" (permanece), "Escopo válido — apto" (card diz Bloqueado), "Gerar ZIP" (baixa JSON). Num produto de compliance, **feedback falso é o pior pecado** — treina o usuário a não confiar no sistema. Regra de ouro: *nenhum toast de sucesso sem efeito real por trás.*
- **Botões mortos disfarçados de vivos.** Busca+filtros mortos em /bloqueios e /atividade, "Mais filtros", dropdowns de linha, "Gerenciar", "Mudar plano". Ou funciona, ou vira `disabled` com tooltip "em breve" — nunca um botão vivo que não faz nada.
- **Copy que promete além do código.** "Vinculado à viagem" (viagemId vazio), "validação cruzada automática INPE/MapBiomas" (constante), "filtro por compartimento e cliente" (inexistente). A voz do produto está *à frente* da função — perigoso quando o comprador é auditor.
- **Ação sem confirmação de efeito.** A Sônia registra limpeza e não vê o compartimento destravar sem trocar de tela. Falta o "antes→depois" no lugar da ação.
- **⌘K "ações" que só navegam.** Verbo prometido, substantivo entregue.

## D. E a UI — está bonita?

**Sim, e é o maior trunfo *e* a maior armadilha do protótipo.**

O que está genuinamente forte:
- Design system coeso e distintivo (não parece "qualquer SaaS"): sombras brand-tinted, borda com toque azul, tabular-nums, uppercase com tracking, gradiente 135°, fundo levemente verde-azulado. O DESIGN.md é levado a sério no código.
- Sinal regulatório com 3 canais (cor+ícone+rótulo) — acessível e correto pro contexto.
- Densidade calibrada de back-office: tabelas e KPIs densos sem ruído.
- **Mapa Leaflet real** com 4 provedores, polígonos por risco, dashed pra desmatamento — sofisticado.
- Momentos de excelência: a **mensagem de bloqueio** (causa+ação+base), a **BloqueioScreen mobile** (baixo letramento), a **reconstrução do dossiê**, o **T-3 timeline com pulse-ring**.

A armadilha:
- **O polimento sugere função que não existe.** Score 92.4, risco EUDR, TRACES 312ms/98.4%, fontes "Sincronizado", badges da sidebar — tudo *parece* medido. Num produto cujo princípio nº1 (DESIGN.md) é *"trust pelo dado, não pela decoração"*, decorar dado inexistente é violar o próprio princípio.
- **Beleza uniforme achata a prioridade.** Uma NC crítica e um card de faturamento têm o mesmo capricho. O olho não é guiado pro que exige ação — o oposto do que o Rafael pediu ("cada tela responde: o que exige ação imediata").

Veredito de UI: **8/10 de execução visual, 4/10 de honestidade visual.** Para um protótipo de *demo* é excelente. Para um protótipo de *validação com auditor/gestor*, o capricho precisa ser rebaixado onde o dado é fake, e concentrado onde a decisão acontece — senão o protótipo vende uma maturidade que o produto ainda não tem, e a primeira auditoria de verdade fura a bola.

## E. Top 12 correções priorizadas (ordenadas por impacto/esforço)

**Tier 1 — honestidade (barato, alto impacto, protege a demo):**
1. Matar todo toast-que-mente: ou o efeito é real, ou o texto muda pra "(em breve)". Começar por justificativa/ZIP/modelo-removido/escopo-apto.
2. Desarmar botões mortos: busca/filtros de /bloqueios e /atividade, "Mais filtros", dropdowns de linha → `disabled` com tooltip, ou remover.
3. Rótulos verdadeiros: "Gerar ZIP"→"Baixar JSON"; "vinculado à viagem" só quando `viagemId` existe.

**Tier 2 — a tese (médio esforço, é o produto):**
4. BLOQUEIO **impede** criar liberada (só permite "criar como bloqueada" explicitamente separado, sem liberar).
5. Unificar num motor de regra só, uma data de referência só.
6. Inspeção LCI grava com `viagemId` real e destrava o LCI da viagem.
7. Limpeza: guardar os campos do regime D; mostrar status antes→depois na própria tela; avisar regime insuficiente.
8. Fechar o loop de exceção: aprovação **persiste** no store e transiciona a viagem Bloqueada→Liberada.

**Tier 3 — as personas invisíveis (maior esforço, desbloqueia metade do valor):**
9. RBAC mínimo no protótipo: seletor de papel que esconde/mostra ações (mesmo mock) — ressuscita diretor, auditor, cliente, motorista.
10. App do motorista operável: checklist clicável + captura mock + fila offline real ligada ao store.
11. CAPA editável (causa raiz→ação→eficácia) + NC nasce com CAPA.
12. Editar viagem / trocar veículo.

---

*Elaborado a partir de leitura integral das 18 rotas, ~20 modais, motor de regras, store e do documento de requisitos (30 perguntas). Cada veredito é rastreável a um comportamento real do código, não à promessa dos planos.*
