# Arquitetura proposta

Etapa 5 da revisão, 08/10/2026. Parte do diagnóstico (`03-diagnostico.md`) e dos trabalhos (`02-usuarios-e-trabalhos.md`). É proposta para aprovação: nenhuma tela do protótipo foi alterada. Os pontos que dependem de decisão de produto estão na seção 7.

## 1. Princípio de organização

O produto se organiza pela **viagem**. É a viagem que o afretador libera, que o auditor amostra, que leva a declaração positiva no CT-e e que alimenta o histórico do compartimento. Terceiros, frota, produtos e treinamentos existem para que a viagem seja decidida depressa e provada depois.

Consequências:

1. A tela inicial é a fila de viagens do dia da filial, com o que falta em cada uma.
2. Inspeção, limpeza, termo, ciência do manual e ocorrência são passos e registros **da viagem**, não telas próprias.
3. As bases (transportadores, frota, produtos, fornecedores) são consultadas a partir da viagem e mantidas em telas de cadastro.
4. A auditoria começa por uma busca: placa, CT-e, nota fiscal ou período.

## 2. Navegação

### 2.1 Back-office da transportadora

| Item | O que é | Vem de |
| --- | --- | --- |
| **Hoje** | Mesa do afretador: viagens do dia da filial, agrupadas por "falta algo", "pronta", "bloqueada"; em "todas as filiais", painel da qualidade com pendências e vencimentos | Torre de Controle + fila de Exceções |
| **Viagens** | Lista de todas as viagens, com filtros fixos (filial, período, situação, frota própria ou afretamento), visões salvas e exportação; abre a Viagem | Viagens |
| **Transportadores** | Base de TACs e ETCs: pessoa ou empresa, documentos com validade, conjuntos (placas), motoristas, histórico de viagens, reincidência de ocorrências, convite e acesso na própria linha | Subcontratados + Motoristas + Acessos externos |
| **Frota própria** | Conjuntos da empresa com marcação "no escopo GMP+", placa do cavalo e de cada compartimento; abre o histórico do compartimento | Ativos e frota + Compartimento Detalhe |
| **Auditoria** | Rastrear por placa, CT-e, NF ou período; montar e exportar amostra; exportar frota no escopo, treinamentos e registro de protocolos gatekeeper | Dossiê |
| **Cadastros** (grupo recolhido) | Produtos e regimes (consulta IDTF), Manual e treinamentos, Fornecedores (lavadores e outros), Filiais | Motor IDTF, Academy reduzida, novo |
| **Configurações** | Usuários e papéis, alçadas de liberação, classes das regras com piso, modelos (termo, declaração do CT-e, checklist por tipo de implemento), LGPD, integrações | Configurações |

São 5 itens principais, um grupo de cadastros e configurações, contra 17 itens hoje.

### 2.2 Outras superfícies

| Superfície | Quem | O que é |
| --- | --- | --- |
| **Link da viagem** | Motorista TAC e motorista próprio | Página aberta pelo WhatsApp, sem instalar e sem senha: confirma identidade e placas, informa as três últimas cargas de cada compartimento, lê o manual vigente, assina o termo. Funciona offline depois de aberto. Substitui o Onboarding público |
| **Hoje no celular** | Afretador no pátio do cliente | A mesma mesa em formato de celular, com a verificação do compartimento (checklist do tipo de implemento e fotos) |
| **Console Traxium** | Equipe Traxium | Clientes e contratos, base IDTF de referência e suas versões, indicadores do produto (incluindo os não medidos) |

O App de campo de 12 telas fica como referência de interação. Se o Rafael confirmar que o motorista próprio também faz checklist de viagem, o link da viagem ganha esse passo; app instalado não é necessário na primeira versão (pergunta 4 do diagnóstico).

### 2.3 O que sai

| Tela atual | Destino |
| --- | --- |
| Exceções e liberações | Vira um estado na mesa (Hoje) e uma seção da Viagem; o registro de 9 campos é mantido |
| Inspeções | Passo "Verificação do compartimento" da Viagem |
| Limpezas | Seção da Viagem e do histórico do compartimento; lavador vira fornecedor |
| Motoristas | Dentro de Transportadores (motoristas da ETC; o TAC é ele mesmo) e da Frota própria (motoristas da empresa) |
| Acessos externos | Convite e acesso na linha do transportador; o auditor não recebe acesso |
| Academy | Manual versionado e registro de treinamentos em Cadastros |
| Não conformidades | Ocorrência registrada na Viagem, contada no transportador |
| Indicadores | Console Traxium; a direção vê no Hoje os números ligados aos objetivos dela |
| Onboarding público | Link da viagem |
| Torre de Controle v1 | Removida da publicação |

## 3. Fluxos ponta a ponta

Cada fluxo diz quem faz, onde começa, onde termina, que registro produz, como se corrige e o que acontece com volume.

### F1. Viagem afretada com TAC (o fluxo principal)

1. **Início.** A ordem de carregamento chega. O afretador cria a viagem em Hoje: importa o PDF da ordem ou digita produto, embarcador, destinatário, data e filial. O sistema já diz se a viagem precisa ser assegurada GMP+ (produto ração e cliente certificado).
2. **Quem carrega.** O afretador digita a placa do cavalo ou o CPF do motorista. Se o conjunto ou o TAC já existem, os dados voltam preenchidos e os documentos vencidos aparecem marcados. Se não existem, nasce um cadastro mínimo (nome, telefone, placas).
3. **Link ao motorista.** O sistema envia o link da viagem por WhatsApp. O motorista confirma dados e placas, informa as três últimas cargas de cada compartimento, lê o manual e assina o termo. Cada resposta aparece na linha da viagem em Hoje.
4. **Decisão.** Com as três últimas cargas, o motor resolve o regime pela IDTF. Carga anterior proibida ou não classificada bloqueia, com caminho de regularização, nunca de aprovação. T-3 incompleto bloqueia. Documento vencido gera pendência.
5. **Verificação.** O afretador avalia o compartimento no celular (lona, correntes, cintas, carroceria, interior), com fotos quando o modelo pedir. Item crítico reprovado bloqueia.
6. **Pronta.** Sem pendências, a viagem fica "pronta para assegurar" e o sistema entrega o texto da declaração positiva para o CT-e. O número do CT-e e da nota fiscal são informados ou chegam por integração.
7. **Fim.** Após a descarga, a viagem é concluída e o produto entra no histórico dos compartimentos das placas usadas.

Registro produzido: a viagem com todos os itens que o auditor anota. Correção: evento de retificação com motivo; cancelamento como evento. Com 80 viagens no dia: Hoje agrupa por situação e mostra primeiro o que falta, com contagem; viagens prontas recolhem.

### F2. Viagem com frota própria
Igual ao F1, sem o passo 2 de terceiros: o despachante escolhe um conjunto no escopo GMP+ e um motorista da empresa. Conjunto fora do escopo não é selecionável para viagem assegurada, com o motivo escrito. O link da viagem vai ao motorista próprio para o checklist e a assinatura, se a empresa exigir.

### F3. Bloqueio e liberação
- **Bloqueio técnico** (carga proibida, não classificada, T-3 ausente, compartimento com resíduo): sem botão de aprovar. A viagem mostra o caminho: trocar o conjunto, ou regularizar conforme a TS1.9 (Opção A com inspetor independente, Opção B com cinco cargas não ração e liberação pelo inspetor do carregador), registrando cada passo.
- **Pendência corrigível** (documento a vencer, foto insuficiente, troca de veículo): a alçada configurada assina o registro de 9 campos. O motor continua reprovando e os dois registros convivem.
- **Manter bloqueio** é registro com responsável e motivo.

### F4. Transportador recorrente
Uma ETC ou um TAC frequente tem cadastro com documentos e validade (RNTRC, CRLV, CNH, certificado GMP+ quando for certificado, acordo quando houver). Vencimento avisa em 60, 30 e 15 dias. O convite para a própria transportadora manter os documentos é opcional e fica na linha dela, com estado (não convidado, enviado, aceito, expirado, revogado). Importação por planilha cria cadastros não convidados e mostra quantos estão sem documento.

### F5. Auditoria
1. Em Auditoria, a qualidade digita uma placa e um período. A lista mostra as viagens com data, CT-e, embarcador e destinatário, produto e nota fiscal: o teste de rastreabilidade.
2. Seleciona viagens para a amostra, frota própria ou afretamento.
3. Exporta a amostra num documento único, com os itens de cada viagem, e as listas de apoio: frota no escopo, treinamentos, protocolos gatekeeper do período com a data de comunicação ao organismo certificador.

O auditor não usa o sistema. Quem opera é a qualidade, ao lado dele.

### F6. Ocorrência
Durante ou depois da viagem, o afretador ou o motorista registra uma ocorrência (resíduo, lona rasgada, carga anterior divergente, reclamação no destino), com foto e descrição. Ela fica na viagem e conta na linha do transportador. Ocorrência grave pode bloquear o transportador para viagens asseguradas até revisão. O tratamento de causa raiz e a ação corretiva seguem no sistema de gestão do cliente; o Traxium exporta as ocorrências do período.

## 4. Modelo de dados: o que muda

| Entidade | Mudança |
| --- | --- |
| Viagem | Ganha CT-e, nota fiscal, embarcador, destinatário, filial, tipo (frota própria ou afretamento), marcação "assegurada GMP+", placas do conjunto; o código interno continua |
| Compartimento | Identificado pela placa da carreta e posição (bitrem: carreta 1 e carreta 2); histórico continua por compartimento |
| Veículo próprio | Ganha "no escopo GMP+" |
| Transportador | TAC é pessoa com conjunto(s); ETC é empresa com motoristas e conjuntos; documentos com validade; estados de qualificação só para ETC recorrente |
| Filial | Unidade com registro GMP+, afretador e escopo de dados |
| Termo e manual | Versionados; a ciência e a assinatura gravam a versão na viagem |
| Fornecedor | Lavador e outros, com documentos e validade |
| Ocorrência | Evento da viagem, ligado ao transportador |
| Protocolo gatekeeper | Registro da comunicação ao organismo certificador por filial |

## 5. O que não muda

Estado derivado do fato. T-3 por compartimento. Bloqueio técnico sem aprovação. Registro de liberação de 9 campos. Correção como evento novo. Versão da base gravada na decisão. Duplicidade por dígitos do documento. Ausência declarada. Motivo escrito junto de cada bloqueio. A linguagem visual aprovada do protótipo.

## 6. Ordem sugerida para levar ao protótipo

| Fase | Entrega | Telas |
| --- | --- | --- |
| A | Base de dados única do protótipo, com três viagens completas e distintas (TAC liberada, frota própria liberada, TAC bloqueada por carga anterior), usada por todas as telas | todas |
| B | Viagem com identidade real e passos (link, decisão, verificação, pronta) | Viagem, Viagens |
| C | Hoje como mesa do afretador | Hoje |
| D | Link da viagem para o motorista | Link da viagem |
| E | Transportadores e Frota própria | Transportadores, Frota própria, compartimento |
| F | Auditoria por busca e amostra | Auditoria |
| G | Cadastros e Configurações enxutos; cortes na navegação | Cadastros, Configurações |

Cada fase termina com commit e publicação do protótipo.

## 7. Decisões pendentes

Do Gabriel e do Rafael, antes da fase B:

1. As cinco divergências com a diretriz do P.O. (`03-diagnostico.md`, seção 6), em especial Academy e estados de qualificação.
2. As dez perguntas ao Rafael (`03-diagnostico.md`, seção 5). As de maior impacto: a 4 (quem faz a verificação e como), a 5 (quem emite o CT-e e onde) e a 3 (proporção TAC e ETC).
3. Se a primeira versão atende só transportadora com afretamento ou também embarcador que aplica gatekeeper.
