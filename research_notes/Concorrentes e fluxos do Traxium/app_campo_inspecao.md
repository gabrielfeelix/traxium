# App de campo e inspeção: como apps de motorista e de checklist estruturam seus fluxos

Pesquisa feita em 08/10/2026. Fontes: help centers dos fornecedores, changelogs, imprensa do setor e guias de UX. Observação de método: várias páginas de help center (kb.samsara.com, helpcenter.gomotive.com) devolveram HTTP 403 na leitura direta. Nesses casos o conteúdo vem do resumo do buscador sobre essas páginas e está marcado como "via busca". As páginas de ajuda e da comunidade da SafetyCulture hoje redirecionam para help.mitti.com e community.mitti.com, com o rodapé "Mitti by SafetyCulture". Parece um rebranding em andamento em 2026, mas não encontrei anúncio oficial.

## 1. Fluxos de DVIR em Samsara, Motive, Geotab Drive, Fleetio Go, Whip Around e Zonar EVIR

### Takeaway
Todos seguem o mesmo esqueleto: escolher o veículo ou reboque, ver os defeitos anteriores ainda abertos, percorrer os itens (OK ou defeito), anexar foto e comentário só quando há defeito ou quando o template exige, declarar se o veículo está seguro, assinar e enviar. O back office (mecânico ou gestor) resolve cada defeito separadamente e assina, e o próximo motorista confirma o reparo. O bloqueio vem de uma decisão explícita de "seguro/inseguro" ou de defeitos marcados como "major", nunca de uma regra escondida. A verificação de presença física evoluiu de tags RFID (Zonar) para GPS mais IA sobre a foto (Samsara, Whip Around).

### Cited Findings

**Samsara Driver App**
- O motorista escolhe o defeito numa lista, descreve e pode anexar foto. O limite é de 3 fotos por reboque e 4 por veículo. (Fonte, via busca: [Samsara KB 12017949275405](https://kb.samsara.com/hc/articles/12017949275405); [Samsara KB 115000771767](https://kb.samsara.com/hc/en-us/articles/115000771767))
  - Relevância para o Traxium: App de campo (checklist, revisão pós-captura). A foto em DVIR é ligada ao defeito, não é um conjunto fixo de ângulos. O Traxium exige 6 ângulos obrigatórios, o que é mais rígido que o padrão de mercado e precisa caber em 3 a 5 minutos.
- O administrador pode exigir foto ou comentário por defeito no template e marcar defeitos como "major". Com a opção ligada, um defeito major marca o veículo como unsafe automaticamente. (Fonte, via busca: [Samsara KB 12017949275405](https://kb.samsara.com/hc/articles/12017949275405))
  - Relevância para o Traxium: App de campo (explicação de bloqueio), Inspeções (configuração de itens críticos). É o mesmo modelo de "item crítico que reprova automaticamente".
- No "DVIR 2.0", segundo o resumo da busca, as fotos precisam ter menos de 1 hora e corresponder à vista pedida (senão o formulário mostra erro), e o motorista precisa estar perto do veículo para usar "Sign and Submit". (Fonte, via busca: [Samsara KB 43217017570829](https://kb.samsara.com/hc/en-us/articles/43217017570829)). Não consegui ler a página direto (403), e uma segunda busca específica não confirmou esses detalhes.
  - Relevância para o Traxium: App de campo (câmera antifraude, assinatura). Pode servir de precedente para "foto recente + vista correta + proximidade" como regra antifraude.
- A página de produto afirma que a IA confere se as fotos mostram componentes reais do veículo e se o motorista está perto dele, verificando em tempo real foto, duração do envio e localização. Também cita transcrição por voz, criação de ordem de serviço e "automatic DVIR resolution". (Fonte: [Samsara DVIR](https://samsara.com/products/samsara-apps/dvir)). São alegações do fornecedor, sem verificação independente.
  - Relevância para o Traxium: App de campo (câmera antifraude), Inspeções (sinais de fraude visíveis ao back office: duração e localização).
- Mecânicos resolvem defeitos no dashboard, e a assinatura do mecânico entra no relatório quando todos os defeitos estão resolvidos. Defeitos não resolvidos passam automaticamente para o próximo DVIR do mesmo veículo. O relatório tem três assinaturas separadas: motorista que enviou, mecânico que confirmou o status e próximo motorista que verifica o reparo. O status do defeito é independente do status de segurança do DVIR. (Fonte, via busca: [Samsara KB 115000771767](https://kb.samsara.com/hc/en-us/articles/115000771767); [Samsara KB 360036517012](https://kb.samsara.com/hc/en-us/articles/360036517012))
  - Relevância para o Traxium: Compartimento detalhe (histórico de pendências que passam para a próxima inspeção), Inspeções, Limpezas (a limpeza resolve a pendência do compartimento e o próximo motorista confirma).
- O próximo motorista vê os "Previous Defects" não resolvidos e precisa confirmar que o veículo está seguro antes de usar. (Fonte, via busca: [Samsara KB 115000771767](https://kb.samsara.com/hc/articles/115000771767))
  - Relevância para o Traxium: App de campo (viagem de hoje, checklist). O motorista deve ver o histórico de carga anterior e a limpeza do compartimento antes de começar.

**Motive (ex-KeepTruckin)**
- Fluxo: escolher veículo e tipo de inspeção, percorrer o checklist marcando "No defects" ou "Defect found" em cada item, tocar "Add notes" para descrever e anexar fotos opcionais. Depois o motorista responde se o equipamento está seguro para rodar. Responder "No" marca o veículo como Unsafe e notifica o fleet manager na hora. Por fim, revisa, assina eletronicamente para certificar e toca "Save", e o relatório vai para o gestor e a manutenção. (Fonte, via busca: [Motive Help Center: Inspections](https://helpcenter.gomotive.com/hc/en-us/articles/30870666684957-Inspections)). Há duas versões do artigo indexadas e não confirmei se ambas as etapas coexistem na versão atual.
  - Relevância para o Traxium: App de campo (checklist, assinatura, explicação de bloqueio). A pergunta binária "seguro para carregar?" antes da assinatura é um padrão simples para baixa letramento.
- No dashboard, o gestor marca defeitos como "corrected" ou "need not be corrected" e adiciona assinatura do mecânico quando necessário. (Fonte, via busca: [Motive Help Center](https://helpcenter.gomotive.com/hc/en-us/articles/30870666684957))
  - Relevância para o Traxium: Inspeções (ações de back office sobre uma não conformidade: corrigido, dispensado com justificativa).
- DVIR eletrônico é aceito legalmente nos EUA desde 2018 sob 49 CFR 390.32, segundo um blog de terceiro (não verifiquei o texto da norma). (Fonte: [Oxmaint](https://oxmaint.com/industries/fleet-management/fleet-driver-defect-reporting-app-workflow))

**Fleetio Go**
- Passo a passo: (1) iniciar por "Start Inspection" na Home ou pelo veículo; se o form não aparece, é porque não está habilitado para aquele veículo ou uma regra o exclui; (2) se houver issues resolvidas recentemente, o app pede para confirmar ou rejeitar cada uma e assinar (rejeitar cria nova issue); (3) itens um por vez com "Previous" e "Next", itens "Required" obrigatórios, ícones contando fotos e comentários; (4) tipos de item: Date/Time, Drop-down, Meter Entry (com alerta de leitura incoerente e foto de verificação só por câmera), Pass/Fail, Tire Readings, Signature (assinatura salva reaproveitável); (5) itens com issue aberta ficam sinalizados, e "Pass" não fecha a issue, só Service Entry, Work Order ou fechamento manual; (6) item reprovado pode gerar issue automaticamente; (7) "Submit" lista o que falta ou mostra resumo com Cancel/Submit; (8) o app precisa ficar aberto durante o upload. (Fonte: [Fleetio: Submit Inspections in Fleetio Go](https://help.fleetio.com/en_US/submit-inspections-in-fleetio-go))
  - Relevância para o Traxium: App de campo (checklist, assinatura, sucesso, fila de sincronização), Compartimento detalhe. A assinatura salva reaproveitável reduz tempo; o resumo antes de enviar substitui uma tela de revisão separada.
- Rascunhos: inspeção iniciada fica "in progress", só acessível naquele aparelho, retomável pela Home. "Start Over" reinicia. Edição depois do envio não é feita pelo motorista: é preciso pedir ao Account Owner ou Administrator. (Fonte: [Fleetio Go](https://help.fleetio.com/en_US/submit-inspections-in-fleetio-go))
  - Relevância para o Traxium: App de campo (fila de sincronização, resolução de divergência), Inspeções (correção feita pelo back office, não no app).
- Forms permitem item Photo obrigatório, e itens Pass/Fail podem exigir foto ou comentário para enviar. (Fonte: [Fleetio Inspection Forms](https://fleetio.helpjuice.com/en_US/inspections-forms))
- Formulários são habilitados por veículo e por regras de form. (Fonte: [Fleetio Go](https://help.fleetio.com/en_US/submit-inspections-in-fleetio-go))
  - Relevância para o Traxium: Inspeções (template por tipo de compartimento ou implemento).

**Geotab Drive**
- Tem co-driver no mesmo aparelho: até 3 motoristas no veículo; o motorista atual toca no nome, escolhe "Add driver" e passa o aparelho para o outro fazer login com as próprias credenciais. Um ícone de volante indica o motorista ativo. (Fonte: [Geotab: Adding a co-driver](https://support.geotab.com/help/geotab-drive/main-dashboard/adding-a-co-driver); [Geotab: co-drivers](https://support.geotab.com/help/geotab-drive/main-dashboard/co-drivers))
  - Relevância para o Traxium: App de campo (identidade em aparelho compartilhado, visão do inspetor no tablet).
- O manual de ELD diz que o app sincroniza os registros de DVIR no login. (Fonte, via busca: [FMCSA ELD registration, Geotab](https://eld.fmcsa.dot.gov/File/Index/040c9ab6-c1c6-149f-e053-0100007f5913))

**Whip Around**
- O motorista reporta falhas no app, e o gestor dá status e atribui ao mecânico. Motorista, gestor e mecânico veem as fotos e comentam na mesma falha. (Fonte: [HDT Trucking Info, 2020](https://www.truckinginfo.com/news/whip-around-app-manages-vehicle-faults)). O anúncio é de 2020 e o fluxo atual pode ter mudado.
  - Relevância para o Traxium: Inspeções e Compartimento detalhe (thread de comentários na não conformidade). App de campo (o motorista vê a resposta do back office).
- O add-on "AI Inspections Pro" confere se os passos exigidos foram feitos (por exemplo, sinaliza quando a foto enviada é a errada) e procura danos nas fotos. Os itens sinalizados vão para um módulo de revisão no back office. (Fonte: [Whip Around AI Inspections Pro](https://whiparound.com/ai-inspections-pro/))
  - Relevância para o Traxium: App de campo (câmera antifraude), Inspeções (fila de revisão das fotos sinalizadas).

**Zonar EVIR**
- Uma tag RFID/NFC fica em cada zona de inspeção do veículo, e o motorista precisa ir até cada zona e ler a tag. Sem isso a inspeção não fecha. Cada leitura é registrada com horário, o que mostra início, fim e tempo por zona. (Fonte: [FleetOwner: Zonar EVIR](https://fleetowner.com/safety/article/21169177/zonar-evir-can-help-fleets-verify-safety-inspections); [Zonar cut sheet](https://www.zonar.com/hubfs/Zonar-Cutsheets/PCS-Zonar-EVIR-Verified-Inspections.pdf))
  - Relevância para o Traxium: App de campo (câmera antifraude), Compartimento detalhe. Os 6 ângulos do Traxium cumprem papel equivalente às "zonas", e o tempo por ângulo pode ser exposto ao back office.

### Inferences
- Nenhum produto pesquisado tem uma tela de "revisão pós-captura" separada do checklist. O padrão é o contador de fotos no próprio item (Fleetio) e um resumo único antes do envio. A revisão pós-captura e a tela de assinatura do Traxium podem virar uma só etapa: resumo + "está seguro para carregar?" + assinar.
- O modelo de três assinaturas da Samsara (motorista, quem resolveu, próximo motorista que confirma) se adapta bem ao ciclo compartimento → limpeza → próxima carga do GMP+. No Traxium, a "assinatura de quem resolveu" seria o certificado do lavador e a "confirmação do próximo motorista" seria o checklist de pré-carregamento.
- Em todos os produtos, quem bloqueia é uma regra configurada no back office (defeito major, item obrigatório), e o app só explica. Isso apoia a tela de "explicação do bloqueio" como peça central do app do motorista.

### Gaps
- Não consegui ler diretamente os artigos de DVIR da Samsara e da Motive (403). Os detalhes do DVIR 2.0 (foto com menos de 1 hora, correspondência de vista, proximidade) vêm só do resumo da busca e não foram confirmados por segunda fonte.
- Não encontrei documentação do comportamento offline do DVIR em Samsara, Motive ou Whip Around.
- Não encontrei avaliações em português da Google Play sobre esses apps.

## 2. Plataformas de checklist: SafetyCulture, GoAudits, Lumiform, Fulcrum, GoCanvas, Checklist Fácil

### Takeaway
A lógica condicional por resposta é o centro: uma resposta "reprovado" dispara pergunta extra, exige foto, exige ação corretiva ou notifica alguém. Itens que exigem ação impedem fechar a inspeção até a ação ser criada. Editar depois de concluído é controlado por permissão e geralmente fica com o back office. Os apps mostram status de sincronização por inspeção (synced, syncing, error) com botão de nova tentativa.

### Cited Findings
- SafetyCulture: campos de lógica disparam perguntas de follow-up, exigem ações, exigem evidência ou notificam, conforme a resposta. Uma pergunta marcada como "requer ações" obriga criar ou vincular ações abertas para marcar a inspeção como concluída. "Require media" obriga anexar mídia para uma resposta específica. Configuração no web app: Edit template → selecionar pergunta → Add logic → condição "If…" → Require actions / Require evidence / Notify / Add questions → publicar. (Fonte, via busca: [SafetyCulture help 002285](https://help.safetyculture.com/002285))
  - Relevância para o Traxium: Inspeções (configuração de itens críticos e ações corretivas), App de campo (checklist com pergunta condicional).
- A lógica só funciona em alguns tipos de resposta (múltipla escolha, texto, número, checkbox, slider, assinatura etc.). O tipo Asset não aparece na lista. (Fonte, via busca: [SafetyCulture help 002285](https://help.safetyculture.com/002285))
  - Relevância para o Traxium: Inspeções (perguntas condicionais por tipo de compartimento precisam de um campo de tipo explícito, não só do ativo).
- O app da SafetyCulture mostra o status de sincronização de cada inspeção: synced, syncing ou syncing error, a partir da versão 24.35. Com erro, toca-se na inspeção e em "Retry". Inspeções com erro sobem para o topo da lista "In Progress & Complete". Também há sincronização manual pelo menu. O suporte pede para não desinstalar o app, porque isso pode perder dados. (Fonte, via busca: [SafetyCulture community: Inspections syncing at a glance](https://community.safetyculture.com/product-updates/post/inspections-syncing-at-a-glance-FS0wiwZAwPQGPWS); [SafetyCulture help 000153](https://help.safetyculture.com/000153))
  - Relevância para o Traxium: App de campo (fila de sincronização, minhas viagens). O status aparece na própria lista, não numa tela separada.
- Se houver dados não sincronizados, o app avisa quando o usuário minimiza o app, faz logout ou troca de organização. (Fonte: [Mitti by SafetyCulture help 000011](https://help.mitti.com/en-US/000011/))
  - Relevância para o Traxium: App de campo (troca de motorista em aparelho compartilhado, logout).
- Editar inspeção concluída depende do nível de acesso ("view, edit" no mínimo), e a API permite remover o acesso do dono a uma inspeção concluída para impedir que ele a veja ou edite. Arquivar, desarquivar e atualizar são eventos distintos. (Fonte: [SafetyCulture developer use cases](https://developer.safetyculture.com/reference/use-cases); [Zapier](https://zapier.com/de/apps/safetyculture/integrations/slack/1188119/send-a-channel-message-in-slack-when-an-inspection-is-completed-in-safetyculture); [Integrately](https://integrately.com/integrations/form-data/safetyculture))
  - Relevância para o Traxium: Inspeções (bloquear edição após envio; correção via back office com trilha de auditoria).
- Checklist Fácil (produto brasileiro): o app de plano de ação permite registrar não conformidades com ou sem internet, com evidências em foto, vídeo, texto e assinatura. A gestão inclui fluxo de aprovação, prazo de solução e relatório de reincidência. Os planos podem ser por item, por área ou gerais, e o app funciona junto com o sistema web, onde fica a configuração. (Fonte, via busca: [App Store: Checklist Fácil Plano de Ação](https://apps.apple.com/app/id1398498927); [B2B Stack](https://www.b2bstack.com.br/product/checklist-facil); [Mobile Time, 2022](https://www.mobiletime.com.br/noticias/06/09/2022/checklist-facil-ajuda-empresas-em-auditorias-e-inspecoes/))
  - Relevância para o Traxium: Inspeções, Limpezas (plano de ação com prazo e reincidência). Também é referência de vocabulário em português ("não conformidade", "plano de ação").
- A nota do Checklist Fácil Plano de Ação na App Store é 3,9/5, com poucas avaliações. Na Capterra há reclamações sobre atendimento e renegociação de preço. Uma matéria de 2022 diz ao mesmo tempo que o app funciona offline e que precisa de internet, uma contradição. (Fonte, via busca: [App Store](https://apps.apple.com/app/id1398498927); [Capterra](https://www.capterra.com/p/201781/Checklistfacil/reviews/); [Mobile Time](https://www.mobiletime.com.br/noticias/06/09/2022/checklist-facil-ajuda-empresas-em-auditorias-e-inspecoes/))

### Inferences
- O fluxo "item crítico reprovado → bloqueio → ação corretiva obrigatória" que o Traxium precisa já tem nome e forma conhecidos no mercado (SafetyCulture: Require actions, Checklist Fácil: plano de ação). O back office de Inspeções deveria tratar a ação corretiva como objeto próprio, com responsável, prazo e status.
- Edição após envio não acontece no app de campo em nenhum produto encontrado. Isso reforça manter a inspeção enviada imutável no app, com correção pelo back office.

### Gaps
- Não pesquisei GoAudits, Lumiform, Fulcrum e GoCanvas por limite de chamadas. Não há dados sobre template builder nem lógica condicional desses quatro.
- Não confirmei se o Checklist Fácil tem modo offline completo no app principal de checklists (só no de plano de ação).

## 3. Evidência fotográfica antifraude

### Takeaway
O padrão consolidado é uma configuração do administrador, não do usuário: "somente câmera do app" (bloqueia galeria) mais marca d'água de data/hora e localização. O app mostra ao usuário que a regra foi imposta pela empresa, sem deixá-lo mudar. Verificação por IA (foto certa, foto recente, perto do veículo) aparece como add-on pago. Não encontrei produto que mostre hash ao usuário.

### Cited Findings
- SafetyCulture: em Organization settings → Features, o dropdown "Media uploads" tem "Camera only" (só fotos novas da câmera do app) e "Camera and media library". A seção "Media watermarks" liga e desliga "Timestamp" e "Location". (Fonte, via busca: [SafetyCulture help 005938](https://help.safetyculture.com/005938); [SafetyCulture help 001588](https://help.safetyculture.com/001588))
  - Relevância para o Traxium: App de campo (câmera antifraude), configuração da empresa.
- Changelog de 3 de fevereiro (provavelmente 2026, pelo rodapé): os admins podem impor timestamp e localização nas fotos e exigir foto nova pelo app. O usuário vê no app quais ajustes foram impostos pelo admin, mas não pode alterá-los. Disponível nos planos Premium e Enterprise, com rollout gradual a partir do próximo login. (Fonte: [Mitti/SafetyCulture changelog](https://community.mitti.com/changelog/post/control-photo-timestamps-and-uploads-DEvzV4pfOkTP48s))
  - Relevância para o Traxium: App de campo (câmera antifraude). O padrão de "regra imposta e visível, mas travada" ajuda a explicar ao motorista por que não pode usar a galeria.
- A configuração depende das permissões de câmera, galeria e localização do aparelho. Se forem revogadas, a regra pode deixar de funcionar. (Fonte, via busca: [SafetyCulture help 005938](https://help.safetyculture.com/005938))
  - Relevância para o Traxium: App de campo (onboarding de permissões; estado de "localização negada" na câmera).
- Fleetio: checkbox "Prevent Use of Stored Photos" no form, que impede escolher fotos da galeria e força a câmera. Para hodômetro existe "Require Photo Verification". (Fonte: [Fleetio Updates](https://updates.fleetio.com/inspection-form-photo-setting-1OXNNS); [Fleetio Go](https://help.fleetio.com/en_US/submit-inspections-in-fleetio-go))
  - Relevância para o Traxium: App de campo (câmera antifraude), Inspeções (config por template).
- Samsara (DVIR 2.0, via busca): foto com menos de 1 hora e correspondente à vista pedida. Na página de produto: IA confere se a foto mostra componente real, se o motorista está perto e analisa a duração do envio. (Fonte: [Samsara KB 43217017570829](https://kb.samsara.com/hc/en-us/articles/43217017570829) via busca; [Samsara DVIR](https://samsara.com/products/samsara-apps/dvir))
- Whip Around AI Inspections Pro sinaliza foto errada para o passo pedido. (Fonte: [Whip Around](https://whiparound.com/ai-inspections-pro/))
- Zonar: prova de presença por tag RFID/NFC por zona, com tempo por zona. (Fonte: [Zonar cut sheet](https://www.zonar.com/hubfs/Zonar-Cutsheets/PCS-Zonar-EVIR-Verified-Inspections.pdf))

### Inferences
- A "câmera antifraude" do Traxium pode ser só o modo da câmera do checklist, não uma tela à parte: câmera do app com moldura do ângulo pedido, marca d'água automática e aviso "sua empresa exige foto na hora". Os produtos de mercado não fazem disso uma etapa separada para o usuário.
- O hash e a cadeia de custódia são valor para auditoria (back office, Compartimento detalhe), não para o motorista. Nenhum produto pesquisado mostra isso ao usuário de campo.

### Gaps
- Não encontrei produto que documente publicamente uso de hash criptográfico de fotos.
- Não encontrei como os apps lidam com relógio do aparelho alterado (marca d'água baseada em hora local vs. hora do servidor).

## 4. Padrões offline-first: estados de sincronização, conflitos, edição após sync

### Takeaway
O consenso: gravar localmente primeiro; cada registro tem um estado (pendente, sincronizado, conflito/erro); mostrar o estado no próprio item e um contador global ("N aguardando envio", "última sincronização há X min"); falhas permanentes continuam visíveis com botão de tentar de novo; avisar antes de logout ou troca de usuário se há dados não enviados. Conflito de edição é raro em inspeções porque cada uma tem um único autor e fica imutável após o envio.

### Cited Findings
- Guia offline-first: cada entidade tem um campo de status "synced", "pending" ou "conflicted", com versão e timestamp, o que permite badge por item. (Fonte: [Product Builder: offline-first](https://productbuilder.net/es/skills/offline-first); [skills.sh: web-pwa-offline-first](https://skills.sh/agents-inc/skills/web-pwa-offline-first))
  - Relevância para o Traxium: App de campo (minhas viagens, fila de sincronização).
- Camadas visíveis recomendadas: indicador de conexão (badge "Offline", contagem para nova tentativa), progresso ("Uploading 3 of 12 changes..."), frescor ("Last synced: 5 min ago") e UI de resolução de conflito. As estatísticas de redução de abandono citadas pelo autor são do próprio fornecedor e não foram verificadas. (Fonte: [GeekyAnts CX book, cap. 47](https://customer-experience.geekyants.com/book/it_services/chapter_47.md))
  - Relevância para o Traxium: App de campo (fila de sincronização, sucesso).
- Expensify separa ações que não precisam de confirmação do servidor das que precisam. Para estas, recomenda estado visível em vez de sucesso silencioso. (Fonte: [Expensify App: offline-first](https://www.mintlify.com/Expensify/App/developers/architecture/offline-first))
  - Relevância para o Traxium: App de campo (tela de sucesso). "Salvo no aparelho" e "Enviado à empresa" são estados diferentes e a tela de sucesso deveria dizer qual dos dois aconteceu.
- Itens que falham depois do limite de tentativas são marcados como falhos e continuam visíveis ("Some changes could not be synced"). Não se deve confiar só na API de status de rede, porque o aparelho pode dizer que está online com o servidor fora. (Fonte: [AppMaster: offline-first background sync](https://appmaster.io/blog/offline-first-background-sync-conflict-retries-ux))
  - Relevância para o Traxium: App de campo (fila de sincronização). Sinal instável de estrada é exatamente esse caso.
- Last-write-wins às cegas pode descartar edições. Merge por campo ou perguntar ao usuário evita isso na maioria dos casos. (Fonte: [Design Gurus](https://www.designgurus.io/answers/detail/explain-offline-first-sync-patterns); [AppMaster](https://appmaster.io/blog/offline-first-background-sync-conflict-retries-ux))
  - Relevância para o Traxium: App de campo (resolução de divergência).
- SafetyCulture: status por inspeção (synced/syncing/syncing error), "Retry" na inspeção, erros sobem para o topo da lista, aviso ao minimizar, deslogar ou trocar de organização com dados não sincronizados. (Fonte, via busca: [SafetyCulture community](https://community.safetyculture.com/product-updates/post/inspections-syncing-at-a-glance-FS0wiwZAwPQGPWS); [Mitti by SafetyCulture help 000011](https://help.mitti.com/en-US/000011/))
- Fleetio Go: o rascunho fica só no aparelho onde começou; o upload exige o app aberto; não há edição pelo usuário após envio. (Fonte: [Fleetio Go](https://help.fleetio.com/en_US/submit-inspections-in-fleetio-go))
  - Relevância para o Traxium: App de campo (fila de sincronização, resolução de divergência).

### Inferences
- A tela de "resolução de divergência de sincronização" do Traxium pode ser excesso para o motorista. Nos produtos pesquisados, a inspeção tem um único autor e vira imutável ao ser enviada, então o conflito real é de outro tipo: o servidor mudou o estado do compartimento ou da viagem enquanto o motorista estava offline (por exemplo, a carga foi bloqueada ou reatribuída). Isso se resolve melhor como mensagem simples ("Sua inspeção foi recebida, mas a viagem mudou: fale com X") do que como tela de escolha entre versões.
- A fila de sincronização pode virar um indicador na lista de viagens (badge por item mais contador global), em vez de uma tela de primeiro nível, como no SafetyCulture.

### Gaps
- Não encontrei documentação de produto de inspeção com UI explícita de conflito entre duas versões da mesma inspeção.

## 5. Identidade em aparelho compartilhado, login sem e-mail e acesso de motoristas terceirizados

### Takeaway
Os apps de frota americanos usam Fleet ID + usuário + senha criados pelo admin, com recuperação por telefone. Aparelho compartilhado é resolvido por "team/co-driver" (vários logados, um ativo) e por modo kiosk. No Brasil, sistemas de pátio e agendamento usam o CPF como chave do motorista, com cadastro completo na primeira vez e só o CPF nas seguintes. Não encontrei documentação pública de convite por link ou código para motoristas de transportadoras subcontratadas.

### Cited Findings
- Samsara: cada motorista recebe do admin Fleet ID, username e senha. Fleet ID e username diferenciam maiúsculas e minúsculas. O motorista faz Sign Out no fim do turno. A redefinição de senha no app exige telefone vinculado à conta. (Fonte, via busca: [Samsara KB: Sign In and Select Vehicle](https://kb.samsara.com/hc/en-us/articles/12018015960717-Sign-In-and-Select-Vehicle))
  - Relevância para o Traxium: App de campo (login). Case-sensitive e três campos é atrito alto para motorista com pouco letramento digital, um contraexemplo útil.
- Samsara Team Driving: até 3 motoristas no mesmo aparelho; "Team" → "+ Add Passenger" → usuário e senha do outro. Não funciona com SSO. Existe um artigo "Kiosk Mode Driver Portal" para administradores, cujo conteúdo não consegui ler. (Fonte, via busca: [Samsara KB: Team Driving](https://kb.samsara.com/hc/en-us/articles/360043176892-Team-Driving); [Samsara KB: Driver App for Administrators](https://kb.samsara.com/hc/en-us/sections/360009159332-Samsara-Driver-App-for-Administrators))
  - Relevância para o Traxium: App de campo (visão do inspetor em tablet compartilhado no pátio).
- Geotab Drive: até 3 co-drivers; "Add driver" e entrega do aparelho; ícone de volante para o motorista ativo; se o ativo faz logout, o co-driver assume. (Fonte: [Geotab: Adding a co-driver](https://support.geotab.com/help/geotab-drive/main-dashboard/adding-a-co-driver); [Geotab: Removing a co-driver](https://support.geotab.com/help/geotab-drive/main-dashboard/removing-a-co-driver))
  - Relevância para o Traxium: App de campo (troca de usuário no tablet do pátio).
- Sistema brasileiro de agendamento de pátio (Trizy YMS, manual para transportadoras de um embarcador): no primeiro agendamento, a transportadora informa todos os dados do motorista, incluindo cópia da CNH e foto; nos seguintes, só o CPF. Documentos do cavalo e da carreta só são pedidos de novo no vencimento. (Fonte: [Manual de Acessos Transportadoras, Trizy/Inpasa](https://inpasa.yms.trizy.com.br/Content/Manual%20de%20Acessos%20Transportadoras.pdf))
  - Relevância para o Traxium: App de campo (login por CPF; código/contingência), Viagem detalhe (cadastro do motorista feito pela transportadora contratada, não pelo próprio motorista).
- Num ERP brasileiro, não pode haver dois motoristas com o mesmo CPF na mesma transportadora, o que implica que o mesmo CPF pode existir em transportadoras diferentes. (Fonte: [Senior: Cadastro de Motoristas](https://documentacao.senior.com.br/gestaoempresarialerp/5.10.4/menu_cadastros/f073mot.htm))
  - Relevância para o Traxium: App de campo e Viagem detalhe. O mesmo motorista (CPF) pode estar vinculado a várias empresas, como agregado ou terceiro, e o app precisa de um seletor de contexto ou de uma lista de viagens que agregue todas.

### Inferences
- Para a dúvida "o subcontratado que também é motorista vê o mesmo app?": em todos os produtos pesquisados a identidade é a pessoa e o papel vem do vínculo. Ninguém documenta um app separado para o dono da transportadora terceira que também dirige. O caminho coerente é o mesmo app, com a lista de viagens filtrada pelos vínculos do CPF, e com funções de gestão (cadastrar motoristas e placas da própria frota) no portal web da transportadora, como no Trizy, em vez de no app de campo.
- Login por CPF + código por SMS/WhatsApp, ou código de viagem, é mais adequado ao público do Traxium do que o modelo Fleet ID + usuário + senha da Samsara. É uma inferência; não encontrei produto brasileiro documentando esse fluxo exato.

### Gaps
- Não encontrei documentação pública de convite (link, QR, código) para motoristas de transportadoras subcontratadas em apps de embarcador.
- Não li o conteúdo do Kiosk Mode da Samsara.
- Não encontrei apps brasileiros de checklist de motorista (por exemplo, de gerenciadoras de risco) com fluxo de login documentado.

## 6. Apps de lavagem de tanque e compartimento: encontrar postos e receber certificado digital

### Takeaway
Os dois lados existem separados. Na Europa, o BulkRadar resolve "onde lavar" (mapa, fila, horário, filtro por produto e tipo de equipamento, grátis para motorista). O eECD 2.0 (documento eletrônico de limpeza EFTCO) resolve "provar a limpeza" com QR code verificável por quem vai carregar. Não encontrei app que junte as duas coisas para o motorista, nem equivalente brasileiro.

### Cited Findings
- BulkRadar: buscador de estações de limpeza de caminhão na Europa por mapa, com status de espera atual, horário de funcionamento e detalhes da estação, filtros por tipo de produto e tipo de contêiner, status de ocupação ao vivo e uso gratuito para motoristas. (Fonte: [App Store id1516346953](https://apps.apple.com/app/id1516346953))
  - Relevância para o Traxium: App de campo (postos de lavagem próximos). Filtrar por tipo de produto carregado anteriormente e pelo tipo de compartimento é o equivalente GMP+.
- eECD (electronic EFTCO Cleaning Document) é a versão digital do ECD em papel, parceria EFTCO e ECLIC. O eECD 2.0 foi lançado no 3º trimestre de 2023 com ECTA, essenscia/Cefic e EFTCO. Cada documento tem QR code padronizado EFTCO para verificar a validade, inclusive por embarcadores sem licença eECD. Papel e digital coexistem, e a cópia digital tem o mesmo layout do ECD em papel. (Fonte: [ECLIC: introduction to eECD](https://documentation.nxtport.com/eclic/introduction-to-eecd); [ECTA: eECD 2.0 flyer](https://ecta.com/wp-content/uploads/2023/07/eECD-2_0-communication-flyer-V6final.pdf); [ECTA: Memorandum EFTCO Electronic ECD](https://ecta.com/wp-content/uploads/2023/07/Memorandum-EFTCO-Electronic-ECD.pdf))
  - Relevância para o Traxium: Limpezas, Compartimento detalhe, App de campo (motorista apresenta ou recebe o certificado). QR verificável pelo embarcador é o padrão a imitar.
- No eECD, o operador da estação de lavagem seleciona o EquipmentOperator e depois o ID do equipamento no check-in. A captura é feita pelo lavador, não pelo motorista. A página é antiga (cita trabalho planejado para 2020). (Fonte: [ECLIC/NxtPort](https://documentation.nxtport.com/eclic/introduction-to-eecd))
  - Relevância para o Traxium: Limpezas (quem registra a limpeza é o posto ou o back office, o motorista só consome).
- Softwares de gestão de lavagem de tanque imprimem certificado ao fim do serviço com logs, avisos legais e lista detalhada dos procedimentos. (Fonte: [Bulk Transporter: paperless processing](https://www.bulktransporter.com/archive/article/21646875/paperless-processing))
  - Relevância para o Traxium: Limpezas (conteúdo mínimo do certificado).

### Inferences
- No app do motorista, "postos próximos" faz sentido só no contexto de um bloqueio ("compartimento precisa de lavagem tipo X antes de carregar: veja postos que fazem X perto de você"), e não como menu solto. É assim que o BulkRadar filtra (por produto e equipamento).
- O certificado de limpeza deve chegar ao Traxium pelo posto ou pelo back office, com QR verificável. O motorista só precisaria fotografar ou escanear o certificado em papel quando o posto não for integrado (contingência).

### Gaps
- Não encontrei app brasileiro de rede de lavagem de carretas graneleiras ou tanques com certificado digital.
- Não encontrei como o motorista recebe ou exibe o eECD no celular.

## 7. Usabilidade: baixo letramento, motoristas, luvas, sol, alvos de toque grandes

### Takeaway
A evidência acadêmica sobre baixo letramento converge para idioma nativo, ícones e imagens, voz e o mínimo de texto. Para luvas e sol, só achei guias de praticantes: alvos de toque grandes, alto contraste (evitar cinza claro sobre branco), texto grande, botões físicos quando possível. Não encontrei estudo com medidas específicas para motoristas de caminhão.

### Cited Findings
- Estudo revisado por pares (Islam, Ahmed e Islam, 2020), app Chakuri-Bazaar para analfabetos e semianalfabetos: princípios derivados de levantamento de requisitos incluem idioma nativo, uso de voz, símbolos, imagens e o mínimo de texto. O app foi testado em campo com 40 pessoas. (Fonte: [Univ. de Turku: Chakuri-Bazaar](https://research.utu.fi/converis/portal/detail/Publication/49140883?lang=en_GB); [IDEAS/RePEc](https://ideas.repec.org/a/igg/jmhci0/v12y2020i2p22-39.html))
  - Relevância para o Traxium: App de campo (todas as telas do motorista, sobretudo explicação de bloqueio e checklist). Ilustração do ângulo pedido na câmera e áudio explicativo no bloqueio.
- Guia para apps de construção: alvos pequenos não funcionam com luvas; texto cinza claro sobre fundo branco fica ilegível sob sol do meio-dia. (Fonte: [Glance: designing apps for construction workers](https://thisisglance.com/learning-centre/how-should-i-design-apps-for-construction-workers); [Affective](https://weareaffective.com/learning-centre/how-should-i-design-apps-for-construction-workers))
  - Relevância para o Traxium: App de campo (inspetor de pátio com luvas; motorista ao sol).
- Telas capacitivas não respondem bem a dedos com luva; recomenda-se alvos grandes e suporte a botões físicos. Alto contraste e texto grande são requisito básico ao ar livre, não um extra de acessibilidade. (Fonte: [Apario: writing software for people who work outside](https://blog.apario.net/on-writing-software-for-people-who-work-outside))
  - Relevância para o Traxium: App de campo (câmera: botão de volume como disparador; tema de alto contraste).
- O Samsara Driver App diz que o DVIR é mais rápido que papel em qualquer smartphone ou tablet, e a página de produto cita transcrição por voz. (Fonte: [Samsara DVIR solution guide](https://www.samsara.com/pdf/docs/dvir-solution-guide.pdf); [Samsara DVIR](https://samsara.com/products/samsara-apps/dvir))
  - Relevância para o Traxium: App de campo (comentário de não conformidade por áudio em vez de digitação).
- Fleetio Go mostra um item por vez com "Previous" e "Next". (Fonte: [Fleetio Go](https://help.fleetio.com/en_US/submit-inspections-in-fleetio-go))
  - Relevância para o Traxium: App de campo (checklist). Um item por tela com botões grandes é compatível com luva e baixo letramento.

### Inferences
- Para o público do Traxium, a combinação "um passo por tela + ilustração do ângulo + botão grande + resposta OK/Problema + áudio opcional" segue os princípios encontrados e cabe na meta de 3 a 5 minutos.
- Cada tela a mais no caminho principal (revisão pós-captura separada, câmera antifraude como etapa à parte, sucesso + fila) custa tempo e compreensão. As 12 telas podem ser agrupadas em um caminho principal curto (viagem de hoje → checklist com câmera embutida → resumo e assinatura → enviado/aguardando envio) e telas de exceção (bloqueio, contingência, erro de envio).

### Gaps
- Não encontrei estudo com tamanho mínimo de alvo para uso com luvas, razão de contraste para luz solar ou estudos com caminhoneiros (brasileiros ou não).
- Não encontrei avaliações da Google Play em português sobre apps de checklist de motorista que mostrem queixas recorrentes (por exemplo, perda de dados offline ou consumo de bateria).
