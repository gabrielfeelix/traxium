# Revisão do protótipo v2: lacunas e interface

Iniciada em 14/10/2026, a partir da seção 6 e 7 de `HANDOFF.md`. Uma etapa por commit. Cada etapa registra o problema visto como usuário, o que mudou e as premissas adotadas.

## Etapa 1. Viagens (14/10/2026)

**Problema como usuário.** Três faixas com cerca de 27 chips antes da primeira linha (período, tipo, filial, situação com contagem, visões salvas). Visões salvas ficavam por último, abaixo dos filtros. "Limpar filtros" aparecia mesmo sem filtro. Em 1366 px a tela estourava para a direita e escondia "Exportar planilha" e a coluna Situação. A segunda linha da Situação repetia a data do carregamento.

**O que mudou.**

1. Visões viram abas acima da lista: Todas, Limpeza exigida, Aguardando CT-e, Liberadas por autoridade, Com ocorrência, e as visões salvas pelo usuário (com botão para apagar). Filas com ação mostram contagem em âmbar. Cada visão de fábrica tem uma linha de explicação e, quando cabe, a ação dela (Conciliar CT-e em lote; link para as ocorrências em Auditoria).
2. Uma linha de controles: busca, Período e Situação em seletores compactos, "Filtros" (tipo e filial) em popover com contador. Filtro escondido aparece como chip removível ao lado. "Limpar" e "Salvar como visão" só aparecem com filtro ativo. Salvar pede um nome.
3. Cortes para nada filtrar duas vezes: "Hoje com pendência" saiu (é a tela Hoje); "Aguardando CT-e" saiu da Situação e ficou só como aba; "Bloqueio técnico" virou opção da Situação. Na fila de CT-e o seletor Situação some, porque só teria uma opção.
4. "Conciliar CT-e em lote" saiu do topo e virou a ação da aba Aguardando CT-e. O link `?conciliar=1` vindo de Hoje continua abrindo o modal, já na aba certa.
5. Tabela com 6 colunas: CT-e e NF passam para baixo da ordem (sem CT-e, mostra o código interno). A segunda linha da Situação diz o que falta ("Limpeza conforme o regime e mais 3"), a descarga prevista ou o motivo do cancelamento.
6. `min-width` do wrapper desta tela caiu de 1560 para 1280 px. Em 1366 px a tela cabe inteira.
7. Novo parâmetro `?visao=` (`limpeza`, `sem_cte`, `autoridade`, `ocorrencia`) para outras telas abrirem uma fila.

**Mudança na semente (versão 8).** Toda a semente era regime A, então nenhuma viagem demonstrava lavagem com comprovante. A VG-3119 passou a ter fosfato monoamônico (regime B) como última carga declarada, sem comprovante: entra em Falta algo com a limpeza pendente. A VG-3116 recebeu a mesma carga anterior com lavagem registrada no Lavador Posto Trevo: continua pronta e mostra o comprovante anexado.

**Premissas.**

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| Quem procurava a antiga tela Limpezas quer ver as viagens que pediram lavagem, com as pendentes destacadas, e não um cadastro de lavagens | Criar uma lista de lavagens por fornecedor em Cadastros, Fornecedores |
| Visões salvas ficam no navegador do usuário | Passar a gravar por usuário na base quando houver backend |
