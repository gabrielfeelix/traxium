# 15_DOCUMENTATION — CORE

## 1. Para que serve

Dono do **ato de registrar**: o elo entre *fazer* pesquisa e *ter* pesquisa utilizável. Define **o quê, quando e em que formato** registrar — notas de sessão, formato de insight, log de hipótese, readout. Fica no meio do caminho que os outros arquivos não cobrem:

> **04 pensa · 15 escreve · 11 guarda.**
> (`04` = como pensar: dado → insight. `11` = o sistema de repositório: governança, taxonomia. `15` = o ato de escrever.)

Princípio que manda em tudo: **pesquisa não documentada é pesquisa que não aconteceu** — vira memória, e memória não escala nem se defende. Mas o corolário pesa igual: **documentação enxuta que se mantém > documentação completa que ninguém atualiza.** Não é manual de processo; é como registrar sem virar burocrata.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Depois de **toda** entrevista, teste ou sessão — e ao comunicar achados a quem decide.
- Quando um insight ou hipótese precisa sobreviver ao sprint, ao designer e ao esquecimento.

**Quando NÃO usar (não vire burocracia):**
- Não transforme registro em **documento pesado** por reflexo — o esforço de documentar é **proporcional ao risco da decisão**.
- Decisão pequena e reversível → recap de duas linhas. Relatório de 20 páginas que custa mais que a decisão que apoia é desperdício com capa.

## 3. Processo operacional

**Captura em sessão** (durante):
- **Cada pessoa anota separado** antes de comparar — evita groupthink (o primeiro a falar ancora o resto).
- Use a **ferramenta mais simples** que funcione; a fricção da ferramenta mata o registro.
- Separe **fala literal + comportamento** de **interpretação** — três colunas distintas, nunca misturadas.
- Organize **por problema**, não por participante (lista por pessoa esconde o padrão).

**Debrief pós-sessão:** resuma os achados **logo após**, enquanto está fresco — em horas, não dias. Daí vai para o repositório (`11`). Memória de uma semana atrás já é ficção.

**Formato de insight rastreável:** todo insight carrega **achado + evidência (qual sessão/dado o sustenta) + força** (forte/médio/fraco). Insight sem rastro até o dado bruto é opinião com fonte bonita. (cadeia achado→insight em `_GLOSSARY §1`)

**Log de hipóteses:** *hipótese → previsão → como testei → resultado (confirmada / refutada / inconclusiva) → decisão.* Registre **o que falhou** (para não repetir) tanto quanto o que deu certo (para reusar). É o ativo que mais se perde e mais economiza retrabalho. (template copiável → `templates/`)

**Readout honesto:** diga **quem os dados representam** e as **limitações**, sempre. Não transforme 5 sessões em "60% dos usuários". Estrutura curta: **contexto → o que fiz → achados por severidade → recomendações → o que ainda é suposição**. (severidade → `07`)

**Registro contínuo leve:** prefira **recap curto e regular** a relatório gigante no fim. Em ritmo ágil, um resumo a cada rodada mantém a base viva sem virar projeto paralelo.

## 4. Checklist

Antes de considerar uma sessão "documentada":

- [ ] **Anotei durante** (cada um separado) e fiz **debrief** enquanto fresco?
- [ ] Cada **insight tem evidência rastreável** (sessão/dado) e força marcada?
- [ ] **Registrei as hipóteses** — inclusive as que falharam — com resultado e decisão?
- [ ] O **readout diz quem os dados representam** e as limitações (sem virar estatística)?
- [ ] O esforço é **proporcional** ao risco da decisão?
- [ ] Foi para o **repositório** (`11`), não para uma pasta pessoal perdida?

## 5. Erros comuns

- Não **confie na memória** — "depois eu escrevo" é como o insight morre; registre na hora.
- Não **liste por participante** — esconde o padrão que só aparece quando se organiza por problema.
- Não **misture interpretação com fala** — o que a pessoa disse, o que fez e o que você concluiu são três coisas; juntá-las contamina o achado.
- Não **trate quali como estatística** — "3 de 5" é sinal, não "60%"; readout desonesto destrói a credibilidade da próxima pesquisa.
- Não **faça relatório gigante** que custa mais do que a decisão que apoia — documentação que ninguém mantém é pior que recap curto que todos leem.

## 6. Relação com outros arquivos

- **Como pensar: dado → padrão → insight (análise)** → dono é `04`.
- **Onde guardar: repositório, taxonomia, governança, retenção** → dono é `11`.
- **Definições de achado, insight, hipótese de solução, evidência** → `_GLOSSARY §1`.
- **Como formular a hipótese que entra no log** → `06`.
- **Severidade dos achados no readout** → `07`.
- **Amostra, representatividade e por que 5 sessões ≠ percentual** → `08`.
- **Registro mínimo viável quando o contexto proíbe pesquisa formal** → `14`.
- **Templates copiáveis (log de hipótese, notas, readout)** → `templates/`.

## 7. Fontes principais

- **Group Notetaking for User Research — NN/g** — captura sem groupthink; organizar por problema, não por participante.
- **Lean UX Documentation for Tracking and Communicating in Agile — NN/g** — registro leve e recap regular em vez de relatório gigante.
- **How to Present UX Research Results Responsively (vídeo) — NN/g** — readout honesto: quem os dados representam e suas limitações.

Demais fontes (Documenting a UX-Benchmarking Study — NN/g) → `_SOURCES.md`.

---

→ Relacionados: `04` (análise dado→insight) · `11` (repositório/governança) · `06` (formular hipótese) · `07` (severidade) · `08` (amostra) · `14` (registro mínimo) · `_GLOSSARY §1` (achado/insight/hipótese) · `templates/`. Sem expanded: este CORE é autossuficiente.
