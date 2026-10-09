# Torre de Controle (v1, histórico)
Arquivo: Torre de Controle.dc.html. Item da sidebar: nenhum (nenhuma tela linka para este arquivo; a sidebar canônica aponta para Torre de Controle v2.dc.html). Perfil a quem se destina (pelo que a tela diz): "Rafael Antunes", "Gestor de qualidade" (direção 1c). Objetivo declarado na tela: título do canvas "Torre de Controle: 3 direções", com a legenda "1a / sidebar teal profunda, 1b / claro flutuante, 1c / hero escuro. Clique nos itens da fila para expandir." O HANDOFF.md registra o arquivo como "v1 antiga com as 3 direções (1a/1b/1c). NÃO evoluir; manter como histórico".

Convenção deste inventário: o separador ponto médio da interface aparece como " / " nas citações.

## Entradas e saídas
- Como se chega: nenhum link no protótipo; só abrindo o arquivo diretamente.
- Para onde leva: nenhum elemento navega. Itens de sidebar e de nav em pílulas são divs ou spans sem link; "Abrir viagem", "Ver todos", "Ver todas →", "+ Nova viagem" e os botões secundários não têm ação.

## Estrutura da tela
Canvas (`design_doc_mode: canvas`) com três pranchas de 1920px lado a lado, mesmos dados nas três:
1. 1a "Sidebar teal profunda": sidebar com itens sem link (Torre de Controle 7, Viagens, Exceções e liberações 5, Inspeções, Limpezas, Motor IDTF, Subcontratados, Academy, Ativos e frota, Dossiê de auditoria, Indicadores, Não conformidades; sem Motoristas, Acessos externos, Configurações, Onboarding, Protótipo mobile) e card "Base IDTF Brasil". Cabeçalho fixo "Terça, 5 ago / Filial Rondonópolis MT / 44 viagens no dia", busca estática "Buscar viagem, placa, CNPJ…", "Hoje ▾" estático, avatar RA. 4 cards de triagem (79%, 34 pelo motor / 3 por autoridade, 3, 5 "mais antiga: 42 min", 2 "1 bloqueio técnico"). Fila em tabela com chips estáticos "Todas / 7", "Bloqueadas / 2", "Em análise / 5" e as mesmas 5 VGs da v2 (VG-2487, VG-2490, VG-2492, VG-2494, VG-2496), expansível com "MOTIVO", "AÇÃO", "SEIS EVIDÊNCIAS ESSENCIAIS", "PENDÊNCIAS EM ABERTO". Rail "Onde a pendência está" (barras horizontais) e "Vai travar em breve" (contadores 1 / 3 / 8 e 4 linhas).
2. 1b "Claro flutuante: nav em pílulas": nav superior em pílulas (Torre de Controle, Viagens, Exceções 5, Motor IDTF, Subcontratados, Academy, Dossiê), saudação "Bom dia, Rafael", "7 decisões esperam por alguém / a mais antiga há 3h 12min", "Ter, 5 ago ▾", "+ Nova viagem", 4 tiles com faixas pastel, fila em cards com filtros "Severidade ▾" e "Pilar ▾", rail "Motor × autoridade", "Onde a pendência está" (barras verticais), "Vai travar em breve" "12 certificados".
3. 1c "Hero escuro: sidebar clara": sidebar branca com perfil no rodapé, cabeçalho com "Filial Rondonópolis ▾", "Hoje ▾", "Exportar" (estáticos), hero escuro "Liberadas sem intervenção humana / hoje" com "34 de 43 decisões saíram sem chegar à mesa de ninguém" e 4 mini cards (incluindo "12 certificados vencem em ≤ 60 dias"), fila compacta com motivo curto, rail "Pendências por pilar" e "Vai travar em breve".

## Ações

| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| Linha da fila | 1a, 1b, 1c | muda estado | Expande ou recolhe; cada prancha tem seu item aberto (VG-2487, VG-2490, VG-2492). |
| Avatar "RA" da 1a | Cabeçalho | menu do shell | O arquivo não está na lista de telas com menu nativo; o shell liga ao primeiro avatar "RA" redondo de 36 a 40px o menu "Meu perfil", "Preferências e notificações", "Aparência". |
| Demais botões, filtros, busca | Todas | nada | Estáticos. |

## Estados e simulações
Sem loading, sem estado vazio, sem erro, sem props. Valores fixos (motor 34, autoridade 3, análise 5, bloqueadas 2, 79%).

## Entidades e operações
Viagem, compartimento, motorista, subcontratado, certificado, trilha: só consulta. Nenhuma operação.

## Regras de negócio visíveis
As mesmas da v2 nos textos dos itens: bloqueio técnico "ninguém libera", competência derivada da trilha, suspensão na base pública bloqueia, regra de alerta para documentação do implemento.

## Observações factuais
- Diferenças em relação à v2: três direções visuais em vez de uma tela; nenhuma navegação; sem filial, período, busca, exportação, plano de regularização, drawer de vencimentos, modais de perfil, papel ativo ou skeleton; KPIs e chips fixos.
- Os chips da 1a dizem "Todas / 7" e "Em análise / 5" com 5 itens listados; a v2 calcula "Todas / 5" e "Em análise / 3".
- O percentual "79%" é fixo; com os mesmos números (34 de 44) a v2 calcula 77%. A 1c fala em "34 de 43 decisões".
- A sidebar da 1a não tem Motoristas, Acessos externos, Configurações, Onboarding público nem Protótipo mobile.
- O arquivo não tem `data-screen-label`, por isso os estilos de sidebar do shell não se aplicam.
