# Shell global (prototype-shell.js e index.html)
Arquivo: prototype-shell.js e index.html (com vercel.json como configuração de publicação). Item da sidebar: não se aplica; a sidebar não é injetada pelo shell, está escrita no fonte de cada tela. Perfil a quem se destina (pelo que a tela diz): todos os perfis; o usuário fixo do protótipo é "Rafael Antunes", "Gestor de qualidade / GMP+". Objetivo declarado: não há texto de objetivo; o shell acrescenta comportamento comum (tema escuro, menu de perfil para telas sem menu próprio, estilos da sidebar, toast) e o index.html redireciona para a tela principal.

Convenção deste inventário: o separador ponto médio da interface aparece como " / " nas citações.

## Entradas e saídas
- Como se chega: `index.html` é a raiz publicada. Título "Traxium Compliance", `robots: noindex, nofollow`. Executa `window.location.replace('./Torre%20de%20Controle%20v2.dc.html')`; sem JavaScript mostra o link "Abrir o protótipo Traxium" para o mesmo arquivo.
- Carregamento: as 21 telas `.dc.html` carregam `./support.js` e `./prototype-shell.js` (com `defer`). `vercel.json` desliga cache de `support.js`, `image-slot.js`, `android-frame.jsx` e `prototype-shell.js` e aplica cabeçalhos `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin`.
- Para onde leva (navegação controlada pelo shell):
  - Nenhum link ativo é criado pelo shell na configuração atual. As funções que criavam o link "Motoristas" na sidebar, os links "Configurações", "Onboarding público" e "Protótipo Mobile" e o botão flutuante "Voltar ao back-office" (para App de Campo e Onboarding Publico, apontando a Torre de Controle v2.dc.html) existem no arquivo mas estão desligadas por comentário ("agora sao links reais no fonte").
  - Conversão de badges "em breve": se um item com badge exatamente "em breve" tiver rótulo "Inspeções", "Limpezas", "Indicadores", "Não conformidades" ou "Motoristas", o shell troca o badge (3, 3, 11/15, 4, 42) e o item passa a navegar para Inspecoes.dc.html, Limpezas.dc.html, Indicadores.dc.html, Nao Conformidades.dc.html ou Motoristas.dc.html. Outros rótulos com "em breve" mostram toast "{rótulo}: tela planejada para a próxima etapa do protótipo." Nenhuma sidebar atual tem badge "em breve".
  - Lista de páginas indisponíveis: vazia, sem efeito.

## Estrutura da tela

### 1. Sidebar (no fonte de cada tela, não injetada)
As 17 telas com sidebar canônica (Torre de Controle v2, Viagens, Viagem Detalhe, Excecoes, Inspecoes, Limpezas, Motor IDTF, Subcontratados, Motoristas, Acessos Externos, Academy, Ativos e Frota, Compartimento Detalhe, Dossie, Indicadores, Nao Conformidades, Configuracoes) têm os mesmos rótulos e badges, nesta ordem (verificado por comparação de rótulos e badges). Console Traxium tem sidebar diferente; App de Campo e Onboarding Publico não têm esta sidebar; Torre de Controle.dc.html (v1) tem sidebars próprias sem link.

| Ordem | Seção | Rótulo | Badge | Destino |
|---|---|---|---|---|
| 0 | (marca) | "Traxium" / "Compliance" | | sem link |
| 1 | (topo) | Torre de Controle | 7 | Torre de Controle v2.dc.html |
| 2 | OPERAÇÃO | Viagens | | Viagens.dc.html |
| 3 | OPERAÇÃO | Exceções e liberações | 5 | Excecoes.dc.html |
| 4 | OPERAÇÃO | Inspeções | 3 | Inspecoes.dc.html |
| 5 | OPERAÇÃO | Limpezas | 3 | Limpezas.dc.html |
| 6 | PILARES | Motor IDTF | | Motor IDTF.dc.html |
| 7 | PILARES | Subcontratados | | Subcontratados.dc.html |
| 8 | PILARES | Motoristas | 42 | Motoristas.dc.html |
| 9 | PILARES | Acessos externos | 2 | Acessos Externos.dc.html |
| 10 | PILARES | Academy | | Academy.dc.html |
| 11 | PILARES | Ativos e frota | | Ativos e Frota.dc.html |
| 12 | PROVA | Dossiê de auditoria | | Dossie.dc.html |
| 13 | PROVA | Indicadores | 11/15 | Indicadores.dc.html |
| 14 | PROVA | Não conformidades | 4 | Nao Conformidades.dc.html |
| 15 | (rodapé) | Configurações | | Configuracoes.dc.html |
| 16 | (rodapé) | Onboarding público | 6 passos | Onboarding Publico.dc.html |
| 17 | (rodapé) | Protótipo mobile | 12 telas | App de Campo.dc.html |
| 18 | (rodapé) | Recolher menu | | alterna sidebar |

- Item ativo: renderizado como div sem link, com fundo em degradê e badge branco.
- "Recolher menu" (tooltip "Recolher ou expandir o menu"): alterna largura 264px e 84px, esconde rótulos, badges, títulos de seção e o card de rodapé; estado salvo em localStorage `tx-nav` e compartilhado entre telas.
- Card de rodapé da sidebar: muda por tela. Exemplos: "Base IDTF Brasil" / "v2026.07 vigente" / "Revisada em 28 jul / Qualidade" (Torre de Controle v2, Excecoes, Viagens, Viagem Detalhe, Motor IDTF, Limpezas, Compartimento Detalhe); "Cobertura da medição" / "11 de 15 medidos" (Indicadores); outros títulos em outras telas ("Regra central" em Academy, "Rede de ativos" em Ativos e Frota, "Critério de aceite" em Dossie, "Checklist vigente" em Inspecoes, "Prazo vencido" em Nao Conformidades, "Safra 2026/27" em Subcontratados).
- Badges: valores fixos no fonte; não refletem o conteúdo das telas.
- Estilos que o shell aplica à sidebar (primeiro filho do elemento com `data-screen-label`): barra de rolagem fina teal, altura mínima de 44px por link, ícones ampliados para 19px (22px recolhida), rolagem horizontal desligada.

### 2. Barra superior (no fonte de cada tela, varia)
O shell não injeta barra superior nem busca global. Cada tela monta a própria barra. Levantamento por busca no código das 21 telas:

| Tela | Filial | Período | Campo de busca | Menu de perfil nativo | Papel ativo |
|---|---|---|---|---|---|
| Torre de Controle v2 | sim | sim | sim | sim | sim |
| Excecoes | sim | não | não | sim | sim |
| Indicadores | sim | sim | não | sim | sim |
| Inspecoes, Limpezas, Nao Conformidades | sim | não | sim | sim | sim |
| Viagens | não | sim | sim | sim | sim |
| Motor IDTF, Acessos Externos | não | não | sim | sim | sim |
| Academy, Ativos e Frota, Compartimento Detalhe, Configuracoes, Dossie, Motoristas, Subcontratados, Viagem Detalhe | não | não | não | sim | sim |
| Console Traxium | não | não | sim | sim | não identificado |
| App de Campo, Onboarding Publico, Torre de Controle (v1) | não | não | não | não | não |

- Busca global: não existe. As buscas existentes são locais a cada tela.

### 3. Menu de perfil
Dois mecanismos:
- Menu nativo (no fonte da tela) nas 18 páginas listadas pelo shell como "nativeProfilePages": Academy, Ativos e Frota, Compartimento Detalhe, Dossie, Excecoes, Torre de Controle v2, Inspecoes, Limpezas, Indicadores, Motor IDTF, Nao Conformidades, Subcontratados, Viagem Detalhe, Viagens, Configuracoes, Console Traxium, Acessos Externos, Motoristas. Conteúdo observado nas telas deste lote: cabeçalho "Rafael Antunes", "Gestor de qualidade / GMP+"; "Meu perfil"; "Preferências e notificações"; "Papel ativo" com chip do papel; separador; "Sair" em vermelho. Nessas páginas o shell:
  - insere o controle "Aparência" logo depois de "Preferências e notificações";
  - muda o menu para posição fixa (78px do topo, 20px da direita).
- Menu do shell nas demais páginas: o shell procura o primeiro div redondo de 36 a 40px com texto "RA" e liga a ele um menu com cabeçalho "Rafael Antunes", "Gestor de qualidade / GMP+", e os itens "Meu perfil", "Preferências e notificações", separador, "Aparência". Não tem "Papel ativo" nem "Sair". Na prática só se aplica à Torre de Controle v1 (App de Campo e Onboarding Publico não têm avatar "RA").

### 4. Seletor de papel
Não existe no shell. "Papel ativo" é implementado no fonte de cada tela com menu nativo (5 papéis: Inspetor de pátio 1, Tráfego 2, Gestor de qualidade 3, Diretoria e Resp. Técnico 4, Auditor interno 0). A escolha vale só para a página aberta; não é persistida.

### 5. Tema
- Controle "Aparência" com valor "Claro padrão" ou "Escuro Traxium", ícone de sol ou lua e interruptor.
- Preferência salva em localStorage `tx-prototype-theme` e aplicada ao carregar todas as páginas.
- O tema escuro sobrescreve cores por seletores de atributo de estilo (fundos brancos e claros, textos, bordas, campos, sidebar, cartões de modal).
- App de Campo e Onboarding Publico ficam sempre claros.
- Usa transição de visualização quando disponível; respeita redução de movimento.

### 6. Toast do shell
Pílula escura fixa no rodapé central, ponto verde com anel, 13px, some em 4,2 s. Usado só por ações do shell (tema, salvar preferências, itens "em breve"). Cada tela tem o próprio toast, com outro desenho (ícone ✓ em círculo, 13,5px).

### 7. API exposta
`window.txPrototype` com `showToast`, `openProfile`, `openPreferences`. Nenhuma tela chama essa API.

## Ações

| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| index.html | Raiz | navegação | Redireciona para Torre de Controle v2.dc.html. |
| Item de sidebar | Todas as telas canônicas | navegação | Ver tabela da sidebar. |
| "Recolher menu" | Sidebar | muda estado | localStorage `tx-nav`. |
| "Aparência" | Menu de perfil (nativo ou do shell) | muda estado + toast | Alterna tema; toast "Modo Escuro Traxium ativado." ou "Modo claro ativado." |
| Avatar "RA" (páginas sem menu nativo) | Barra superior | menu | Abre o menu do shell; novo clique fecha. Também abre com Enter ou espaço. |
| "Meu perfil" (menu do shell) | Menu do shell | modal | Modal do shell "Meu perfil". |
| "Preferências e notificações" (menu do shell) | Menu do shell | modal | Modal do shell "Preferências e notificações". |
| "Salvar preferências" | Modal do shell | muda estado + toast | Grava em localStorage `tx-prototype-prefs`; toast "Preferências salvas neste protótipo." |
| Clique fora | Global | fecha | Fecha o menu do shell. |
| Esc | Global | fecha | Fecha menu e modal do shell. |
| Redimensionar janela | Global | fecha | Fecha o menu do shell. |
| Badge "em breve" | Sidebar | navegação ou toast | Sem ocorrência nas telas atuais. |

Modais do shell (usados só onde não há menu nativo):
- "Meu perfil": avatar "RA", "Rafael Antunes", "Gestor de qualidade / GMP+", indicador "sessão ativa"; blocos "Filial: Rondonópolis MT" e "Autoridade: Gestor / nível 3"; linhas "E-mail: rafael.antunes@traxium.com.br" e "Último acesso: hoje, 08:02". Botão "Fechar". Somente leitura.
- "Preferências e notificações": texto "Escolha quais eventos operacionais devem chamar sua atenção."; 3 interruptores: "Item há mais de 2h na fila" ("aviso no app e por e-mail", ligado por padrão), "Certificado de terceiro a vencer" ("aos 30 e aos 15 dias", ligado), "Nova versão da base IDTF" ("quando a Qualidade publicar revisão", desligado). Botões "Fechar" e "Salvar preferências". Nenhum campo obrigatório.

## Estados e simulações
- O shell não tem loading, vazio nem erro próprios.
- Reaplica todas as melhorias a cada mudança no DOM (MutationObserver na página inteira).
- Estados persistidos entre telas pelo navegador: tema (`tx-prototype-theme`), sidebar recolhida (`tx-nav`), preferências do modal do shell (`tx-prototype-prefs`). Papel ativo, filial, período e preferências dos modais nativos não persistem.

## Entidades e operações
- Usuário (Rafael Antunes): consultar perfil.
- Preferências de notificação: editar e salvar (só no modal do shell).
- Tema da interface: alternar.
- Navegação entre telas: pela sidebar no fonte.

## Regras de negócio visíveis
- Nenhuma regra de domínio no shell. O modal nativo de preferências (no fonte das telas) declara "O alerta de bloqueio técnico não pode ser desligado: é requisito da certificação."; o modal do shell não mostra esse alerta.

## Observações factuais
- Existem duas versões de "Meu perfil" com conteúdos diferentes: a nativa mostra "Papel", "Autoridade na matriz: nível 3 / Gestor", "Filiais: Rondonópolis, Sorriso" e "Liberações assinadas em 2026: 14"; a do shell mostra "Filial: Rondonópolis MT", "Autoridade: Gestor / nível 3", e-mail e "Último acesso: hoje, 08:02".
- Existem duas versões de "Preferências e notificações": a nativa tem 4 interruptores (o primeiro, "Bloqueio técnico na filial", travado), sem botão salvar e sem persistência; a do shell tem 3 interruptores, botão "Salvar preferências" e grava em localStorage.
- O menu nativo tem "Papel ativo" e "Sair"; o menu do shell não tem nenhum dos dois.
- O shell move o menu nativo para posição fixa no canto superior direito, fora do botão que o abriu.
- As funções que injetavam itens de sidebar e o botão "Voltar ao back-office" continuam no arquivo, desligadas; o mapa de badges "em breve" (Inspeções, Limpezas, Indicadores, Não conformidades, Motoristas) e a lista de páginas indisponíveis (vazia) não têm efeito nas telas atuais.
- A API `window.txPrototype` não é usada por nenhuma tela.
- O shell tem um toast próprio com desenho diferente do toast de cada tela.
- Os badges da sidebar são texto fixo idêntico em todas as telas (ex.: "Exceções e liberações" 5, "Torre de Controle" 7), sem ligação com as listas das telas.
- O item da sidebar se chama "Protótipo mobile"; o código desligado do shell usava "Protótipo Mobile".
- index.html aponta para "Torre de Controle v2.dc.html"; o arquivo "Torre de Controle.dc.html" (v1) continua publicado sem link.
