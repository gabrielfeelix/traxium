# Resposta ao PM: front-end, estágio das telas e caminho até o MVP

Rascunho de 15/10/2026, a partir de `HANDOFF.md`, `07-revisao-v2.md`, `03-diagnostico.md`, `04-arquitetura-proposta.md`, `05-plano-de-construcao.md` e `PLANO-PRODUTO.md`. Itens marcados com **[confirmar]** dependem do Gabriel antes de enviar.

## 1. Onde estamos, em uma frase

O protótipo v2 tem as dez telas do fluxo da transportadora e o link do motorista funcionando de ponta a ponta com dados simulados, revisadas tela a tela e cobertas por testes automáticos. Nenhum usuário real usou ainda. O próximo passo é validar com quem opera antes de desenvolver.

Há dois protótipos no repositório, e isso precisa ficar claro para o time:

| | Onde | Situação |
| --- | --- | --- |
| v1 | `src/` (Next.js, dados fixos) e telas antigas em `SaaS moderno estilo Dribbble/` | Superado. Organizado por módulos; foi revisto contra a auditoria real e reorganizado. Não deve ser base de desenvolvimento |
| v2 | `SaaS moderno estilo Dribbble/` (10 telas, `tx-dados.js`) | Aprovado em 14/10/2026. Organizado pela viagem. É a referência para validar e depois desenvolver |

O endereço publicado (`traxium-prototipo.vercel.app`) ainda mostra o v1. Publicar o v2 é a primeira coisa a fazer para os sócios testarem a versão certa.

## 2. Atividades e entregas que assumo **[confirmar disponibilidade e horas por semana]**

1. **Validação do protótipo (próximas duas semanas):** uso o sistema como cada perfil, refino o que travar, monto um roteiro de teste para os sócios e, se o Rafael conseguir, testo com um afretador e um motorista de cliente real.
2. **Especificação para desenvolvimento:** o protótipo v2 vira a especificação de telas, estados e textos. O motor de decisão em `tx-dados.js`, com 674 conferências automáticas, serve como especificação executável das regras para o back-end.
3. **Design system:** componentes, cores, tipografia e padrões (sidebar, listas, filtros, modais, estados vazios) documentados para o front-end.
4. **Front-end:** posso implementar telas na stack que o Bruno definir, ou fazer a revisão de interface de cada tela que ele entregar. **[confirmar qual dos dois]**
5. **Acompanhamento do piloto:** observação de uso, ajustes de usabilidade e textos.

## 3. Telas e fluxos que já funcionam (no protótipo)

**Gestão (escritório):**

| Tela | Para quem | O que faz |
| --- | --- | --- |
| Hoje | Afretador da filial; qualidade | Mesa do dia: o que falta, o que está bloqueado, o que está pronto, com a ação de cada linha. Nova viagem. Para a qualidade, a fila "Esperando sua assinatura" |
| Viagens | Todos | Histórico com filas prontas (limpeza exigida, aguardando CT-e, liberadas, com ocorrência), filtros, visões salvas e planilha |
| Viagem | Todos | A viagem inteira: decisão do sistema, o que falta e quem resolve, três últimas cargas, conferência das fotos, liberação, linha do tempo e registro para auditoria |
| Transportadores | Afretador; qualidade | TACs e ETCs com documentos, validade, conjuntos, ocorrências e convite |
| Frota própria | Gestor de frota | Conjuntos no escopo GMP+ e fora dele |
| Compartimento | Qualidade | Histórico de cargas por carreta e se pode carregar ração |
| Auditoria | Qualidade com o auditor ao lado | Rastreio por placa e período, amostra, documento da amostra, listas de apoio e ocorrências |
| Cadastros | Qualidade | Produtos e regimes (base IDTF), manual e treinamentos, fornecedores, filiais |
| Configurações | Administração | Usuários e convite, alçadas, regras, modelos, LGPD |

**Campo:** Link da Viagem, no celular do motorista, sem instalar nada: confirma CPF e placas, manda documentos que faltam, informa as três últimas cargas, faz o checklist com fotos, lê o manual e assina o termo.

**Fluxos completos no protótipo:** criação da viagem até a declaração do CT-e (F1); frota própria (F2); bloqueio, pedido de liberação e liberação por alçada (F3); transportador recorrente com vencimentos (F4); auditoria por placa e amostra (F5); ocorrência (F6).

## 4. O que é demonstrativo, incompleto ou depende do back-end

**Simulado no protótipo (precisa existir de verdade):**

- Os dados ficam no navegador de quem abre; não há banco, nem usuários reais, nem login. "Entrar como" troca de pessoa para demonstração.
- Fotos do checklist e de documentos são simuladas; não há câmera, arquivo, carimbo de hora e local, nem armazenamento.
- "Simular envio" do link, "sem sinal" (offline) e "usar ordem de exemplo" (leitura do PDF da ordem) são atalhos de demonstração.
- Conciliação de CT-e e NF usa um lote de exemplo; não lê planilha nem XML de verdade.
- Avisos (pedido de liberação, vencimentos, convite de usuário) aparecem só na tela; não saem por e-mail, WhatsApp ou celular.
- Integrações listadas (consulta RNTRC na ANTT, base pública de certificados GMP+) não consultam nada.
- Documentos exportados abrem para imprimir; não há PDF gerado no servidor, assinatura digital nem trilha imutável com hash.
- A base IDTF é uma lista fixa de 30 produtos.

**Fora do protótipo, por decisão pendente do Gabriel e do Rafael:** Academy com prova, ciclo de não conformidade, os 15 indicadores e a governança da base IDTF.

**O que o back-end precisa entregar para o MVP:** banco e trilha de eventos (nada se apaga, correção vira evento), autenticação com papéis e filiais, link único e seguro por viagem, envio e guarda de fotos e documentos, funcionamento sem sinal no celular com envio quando o sinal volta, avisos, importação de planilha ou XML do TMS, geração de PDF e manutenção da base IDTF.

## 5. O que falta para o usuário executar o fluxo do MVP

Do lado do produto, o fluxo está desenhado e testável: a ordem chega, o afretador cria a viagem, o motorista preenche o link, o sistema decide pela base IDTF, o afretador confere as fotos, e a viagem fica pronta, bloqueada ou vai para liberação por alçada. Para um usuário real executar, faltam:

1. **Validar com usuário real** que esse é o jeito que a filial trabalha (hoje é premissa nossa, baseada no relatório de auditoria da Control Union).
2. **Confirmar como é a inspeção.** O protótipo assume que o motorista faz o checklist com fotos e o afretador confere à distância. Se o cliente faz inspeção presencial no pátio, precisa de uma variação da mesma etapa (pergunta 4 ao Rafael).
3. **Confirmar onde nasce o CT-e** e como os dados voltam do TMS (pergunta 5).
4. **O back-end do item 4.**

## 6. Definições que preciso do time

**Rafael (negócio e cliente):**

1. Um cliente ou contato para teste de usabilidade agora e para o piloto depois: um afretador e, se possível, um motorista.
2. As perguntas abertas de `03-diagnostico.md`, seção 5. As de maior impacto: a 4 (quem faz a inspeção e como), a 5 (quem emite o CT-e e onde) e a 3 (quanto é TAC e quanto é ETC).
3. Junto com o Gabriel: as cinco divergências com a diretriz dos 5 pilares (Academy, estados de qualificação, dossiê, alçadas, indicadores), registradas em `03-diagnostico.md`, seção 6.

**PM:**

1. Escopo fechado do MVP: o que entra no piloto e o que fica para depois.
2. Critério de sucesso do piloto (exemplos: número de viagens registradas, tempo do motorista no link, auditoria simulada aprovada).
3. Quem testa o protótipo nas próximas duas semanas e como registrar o que encontrarem.

**Bruno (desenvolvimento):**

1. Stack, banco, hospedagem e autenticação.
2. Como fica o celular sem sinal (PWA ou outro caminho) e onde guardar fotos.
3. Divisão do front-end entre nós dois.
4. Se aproveita o motor de regras do protótipo como ponto de partida.

**Operacional:** acesso à conta da Vercel do projeto `traxium-prototipo`, para publicar o v2.

## 7. Prazos que considero viáveis **[confirmar com o Bruno e o Rafael]**

| Período | Entrega | Depende de |
| --- | --- | --- |
| 16/10 a 30/10/2026 | v2 publicado; roteiro de teste; testes com os sócios e, se houver, com um cliente; refino do protótipo | Acesso à Vercel; contato do Rafael |
| 03/11 a 13/11/2026 | Achados consolidados; protótipo ajustado; especificação para o desenvolvimento (telas, estados, regras, modelo de dados) | Respostas às perguntas 3, 4 e 5 |
| 16/11/2026 a 26/02/2027 | Desenvolvimento em três entregas: (1) base, login, filiais, cadastros e motor de regras; (2) viagem completa com link do motorista e fotos; (3) liberação, auditoria, conciliação e exportação | Stack e equipe definidas |
| 01/03 a 31/03/2027 | Piloto com um cliente, uma filial | Cliente confirmado |

Pontos de atenção no prazo: fim de ano no meio do desenvolvimento, e março é colheita de soja no MT, ótimo para volume e ruim para a atenção do cliente. Com um desenvolvedor só, as três entregas são justas.

## 8. Prioridades, usabilidade e riscos

**Prioridades:**

1. Validar o fluxo principal (afretador e motorista) com gente real antes de desenvolver tela.
2. O desenvolvimento não precisa esperar parado: modelo de dados, motor de regras, trilha de eventos, login e filiais não mudam com o teste de telas e podem começar em paralelo. O que espera a validação são as telas.
3. Escopo enxuto no piloto: o fluxo da viagem, liberação e auditoria. Academy, não conformidade e indicadores depois.

**Usabilidade:** o protótipo foi revisto pelos critérios de entender a tela em 5 segundos, uma ação principal por área, nenhum botão sem efeito e funcionar em notebook de 1366 px. O que mais precisa de teste real:

- o motorista no link: se termina em 5 minutos num celular simples e com sinal ruim;
- o afretador num dia de safra com muitas viagens;
- a liberação por alçada: se o pedido chega a quem assina a tempo do carregamento.

**Riscos:**

| Risco | Efeito | Como reduzir |
| --- | --- | --- |
| Desenvolver sem validação com cliente | Retrabalho de telas e fluxo | Duas semanas de teste agora; desenvolvimento começa pelo núcleo que não muda |
| Motorista não usar o link (sinal, celular, pressa) | O fluxo inteiro depende dele | Teste com motorista real; funcionamento sem sinal; afretador pode preencher em nome dele, com registro |
| Inspeção diferente da premissa | Etapa central do fluxo muda | Responder a pergunta 4 antes da especificação |
| Integração com o TMS (Atua) | CT-e e NF não voltam | Conciliação por planilha no MVP; integração depois |
| Base IDTF: quem mantém e com que direito de uso | Regra sem fonte confiável | Definir a governança com o Rafael |
| Escopo crescer com a diretriz dos 5 pilares | MVP não chega no trimestre | Fechar o escopo do piloto por escrito |
| Protótipo v1 em `src/` ser tomado como base | Desenvolvimento na estrutura antiga | Deixar claro que a referência é o v2 |
| Prazo com um desenvolvedor e fim de ano | Atraso do piloto | Entregas em três partes, com corte possível na terceira |
