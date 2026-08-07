// TRAXIUM — Modelo de domínio compartimento-cêntrico (Fase 0)
//
// Princípio nº 1 do PLANO-PRODUTO.md §1: a unidade de controle é o COMPARTIMENTO,
// não a viagem. O histórico de cargas (T-3) e as limpezas acompanham a carreta/
// compartimento que toca o produto — NUNCA a placa do cavalo.
//
//   Cavalo (não carrega T-3)   ─┐
//   Implemento (asset)          ├─ Viagem
//     └─ Compartimento (subasset)   ← LoadHistory / CleaningEvent / InspectionEvent moram aqui
//
// Este módulo é aditivo: convive com mock-data.ts sem quebrar exports existentes.

import type { EntradaCadastro } from "@/lib/domain/onboarding";

export const VERSAO_BASE_IDTF = "IDTF-BR 2026.05";

/** Data de referência "hoje" do protótipo (para alertas de vencimento). */
export const HOJE = "2026-07-08";

/** Dias entre duas datas (b − a). Positivo = b no futuro em relação a a. */
export function diasEntre(a: string, b: string): number {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

/** Nível de alerta de vencimento a partir de "hoje" (60/30/15 dias). */
export function nivelVencimento(validade: string, hoje = HOJE): {
  dias: number;
  nivel: "vencido" | "critico" | "alto" | "alerta" | "ok";
} {
  const dias = diasEntre(hoje, validade);
  if (dias < 0) return { dias, nivel: "vencido" };
  if (dias <= 15) return { dias, nivel: "critico" };
  if (dias <= 30) return { dias, nivel: "alto" };
  if (dias <= 60) return { dias, nivel: "alerta" };
  return { dias, nivel: "ok" };
}

export type Regime = "A" | "B" | "C" | "D";

/** Ordem de severidade dos regimes de limpeza. A < B < C < D. */
export const ORDEM_REGIME: Record<Regime, number> = { A: 1, B: 2, C: 3, D: 4 };

// ─────────────────────────────────────────────────────────────────────────────
// Produtos / IDTF — motor de regra, não PDF anexado (PLANO §1.2, perguntas 17/19)
// ─────────────────────────────────────────────────────────────────────────────

/** Estado físico do produto — muda o que resta no compartimento (§IDTF, cadastro). */
export type EstadoFisico = "Granel sólido" | "Granel líquido" | "Pó" | "Peletizado" | "Pastoso";

export type ProdutoIDTF = {
  id: string;
  nomeCanonico: string;
  /** Sinônimos brasileiros; o motor resolve "farelo", "soja farelo", "soybean meal". */
  alias: string[];
  hsCode?: string;
  categoria: "feed" | "feed_material" | "risco" | "proibido";
  idtfCode?: string;
  // ── Cadastro completo (Fase 8). Opcionais de propósito: produto em fila de
  // classificação não tem responsável nem fonte de decisão, e fingir que tem
  // seria pior do que a lacuna. A ficha mostra "não informado".
  /** Nome oficial na fonte (IDTF em inglês), quando existe correspondência. */
  nomeOficialFonte?: string;
  /**
   * Como o produto é chamado por região. A região fica em campo próprio: se
   * entrasse no nome ("casquinha (MT)"), duas grafias do mesmo apelido
   * resolveriam para produtos diferentes — foi o que um teste pegou.
   */
  sinonimosRegionais?: { nome: string; regiao: string }[];
  /** Nomes de mercado/marca que chegam na ordem de carregamento. */
  nomesComerciais?: string[];
  nomesIngles?: string[];
  /** Erros de digitação que já apareceram — o motor resolve sem criar produto novo. */
  errosComuns?: string[];
  estadoFisico?: EstadoFisico;
  /** O que a IDTF exige além da limpeza. Não vazio = procedimento especial. */
  restricoes?: string[];
  /** Esquemas sob os quais a classificação vale. */
  esquemaCertificacao?: string[];
  atualizadoEm?: string;
  responsavelValidacao?: string;
  /** De onde veio a decisão de classificação — o que o auditor pede primeiro. */
  fonteDecisao?: string;
  /**
   * Se este produto foi a carga ANTERIOR, qual o regime mínimo de limpeza exigido
   * antes de carregar feed no mesmo compartimento.
   */
  regimeAntesDeFeed: Regime;
  /** Carga proibida: exige procedimento formal de liberação, não limpeza comum. */
  bloqueiaFeed: boolean;
  riscoEUDR: "N/A" | "Baixo" | "Médio" | "Alto";
  statusClassificacao: "classificado" | "em_fila" | "proibido";
  /** Quando entrou na fila de classificação — alimenta o "tempo em fila" da Torre. */
  emFilaDesde?: string;
  versaoBase: string;
};

export const produtosIDTF: ProdutoIDTF[] = [
  {
    id: "p-soja",
    nomeCanonico: "Soja em grão",
    alias: ["soja", "soja grão", "soybean", "grão de soja"],
    hsCode: "1201.90",
    categoria: "feed_material",
    idtfCode: "IDTF-0101",
    regimeAntesDeFeed: "A",
    nomeOficialFonte: "Soya beans",
    sinonimosRegionais: [{ nome: "soja em caroço", regiao: "MT" }, { nome: "soja bruta", regiao: "PR" }],
    nomesComerciais: ["Soja Padrão 86", "Soja tipo exportação"],
    nomesIngles: ["soybean", "soya bean", "whole soybeans"],
    errosComuns: ["soija", "soja em grao", "soya"],
    estadoFisico: "Granel sólido",
    restricoes: [],
    esquemaCertificacao: ["GMP+ FSA", "GMP+ B4 Transporte"],
    atualizadoEm: "2026-05-04",
    responsavelValidacao: "Thiago Yamashida · Gestor Qualidade",
    fonteDecisao: "IDTF EN 2026.05, item 1201 — tradução conferida com a base oficial.",
    bloqueiaFeed: false,
    riscoEUDR: "Alto",
    statusClassificacao: "classificado",
    versaoBase: VERSAO_BASE_IDTF,
  },
  {
    id: "p-milho",
    nomeCanonico: "Milho",
    alias: ["milho", "milho grão", "corn", "maize"],
    hsCode: "1005.90",
    categoria: "feed_material",
    idtfCode: "IDTF-0102",
    regimeAntesDeFeed: "A",
    nomeOficialFonte: "Maize",
    sinonimosRegionais: [{ nome: "milho safrinha", regiao: "Centro-Oeste" }, { nome: "milho de segunda", regiao: "GO" }],
    nomesComerciais: ["Milho amarelo tipo 1"],
    nomesIngles: ["corn", "maize", "yellow corn"],
    errosComuns: ["mihlo", "milho graos"],
    estadoFisico: "Granel sólido",
    restricoes: [],
    esquemaCertificacao: ["GMP+ FSA", "GMP+ B4 Transporte"],
    atualizadoEm: "2026-05-04",
    responsavelValidacao: "Thiago Yamashida · Gestor Qualidade",
    fonteDecisao: "IDTF EN 2026.05, item 1005.",
    bloqueiaFeed: false,
    riscoEUDR: "N/A",
    statusClassificacao: "classificado",
    versaoBase: VERSAO_BASE_IDTF,
  },
  {
    id: "p-farelo-soja",
    nomeCanonico: "Farelo de soja",
    alias: ["farelo", "farelo de soja", "soja farelo", "soybean meal"],
    hsCode: "2304.00",
    categoria: "feed",
    idtfCode: "IDTF-0201",
    regimeAntesDeFeed: "A",
    nomeOficialFonte: "Soya bean meal",
    sinonimosRegionais: [{ nome: "farelinho", regiao: "PR" }, { nome: "farelo branco", regiao: "MT" }],
    nomesComerciais: ["Farelo 46% PB", "Farelo hipro"],
    nomesIngles: ["soybean meal", "soya bean meal", "SBM"],
    errosComuns: ["farelo soija", "farelo d soja"],
    estadoFisico: "Granel sólido",
    restricoes: [],
    esquemaCertificacao: ["GMP+ FSA", "GMP+ B4 Transporte"],
    atualizadoEm: "2026-05-04",
    responsavelValidacao: "Thiago Yamashida · Gestor Qualidade",
    fonteDecisao: "IDTF EN 2026.05, item 2304.",
    bloqueiaFeed: false,
    riscoEUDR: "Alto",
    statusClassificacao: "classificado",
    versaoBase: VERSAO_BASE_IDTF,
  },
  {
    id: "p-fert-npk",
    nomeCanonico: "Fertilizante NPK",
    alias: ["npk", "fertilizante", "adubo", "fertilizante npk"],
    categoria: "risco",
    idtfCode: "IDTF-0710",
    regimeAntesDeFeed: "C",
    nomeOficialFonte: "Fertiliser, NPK",
    sinonimosRegionais: [{ nome: "adubo formulado", regiao: "Nacional" }, { nome: "granulado", regiao: "MT" }],
    nomesComerciais: ["NPK 04-14-08", "NPK 20-05-20"],
    nomesIngles: ["NPK fertiliser", "compound fertilizer"],
    errosComuns: ["n p k", "fertilizanti"],
    estadoFisico: "Granel sólido",
    restricoes: ["Exige laudo de ausência de resíduo após a limpeza C, antes de feed."],
    esquemaCertificacao: ["GMP+ B4 Transporte"],
    atualizadoEm: "2026-03-18",
    responsavelValidacao: "Thiago Yamashida · Gestor Qualidade",
    fonteDecisao: "IDTF EN 2026.05, anexo de cargas de risco.",
    bloqueiaFeed: false,
    riscoEUDR: "N/A",
    statusClassificacao: "classificado",
    versaoBase: VERSAO_BASE_IDTF,
  },
  {
    id: "p-defensivo",
    nomeCanonico: "Defensivo agrícola líquido",
    alias: ["defensivo", "agrotóxico", "pesticida", "defensivo líquido"],
    categoria: "proibido",
    idtfCode: "IDTF-0901",
    regimeAntesDeFeed: "D",
    nomeOficialFonte: "Crop protection products, liquid",
    sinonimosRegionais: [{ nome: "veneno", regiao: "MT" }, { nome: "remédio de lavoura", regiao: "Nacional" }],
    nomesComerciais: ["Glifosato 480", "Herbicida líquido a granel"],
    nomesIngles: ["pesticide", "crop protection liquid", "agrochemical"],
    errosComuns: ["defensivo liquido", "agrotoxico"],
    estadoFisico: "Granel líquido",
    restricoes: [
      "Carga proibida antes de feed: exige procedimento formal de liberação, não apenas limpeza.",
      "Laudo de eficácia da desinfecção assinado pelo responsável técnico.",
    ],
    esquemaCertificacao: ["GMP+ B4 Transporte"],
    atualizadoEm: "2026-05-04",
    responsavelValidacao: "Rafael Duarte · Responsável Técnico",
    fonteDecisao: "IDTF EN 2026.05, lista de produtos proibidos antes de feed.",
    bloqueiaFeed: true, // exige procedimento de liberação formal antes de qualquer feed
    riscoEUDR: "N/A",
    statusClassificacao: "proibido",
    versaoBase: VERSAO_BASE_IDTF,
  },
  {
    id: "p-sorgo",
    nomeCanonico: "Sorgo",
    alias: ["sorgo", "sorghum"],
    categoria: "feed_material",
    idtfCode: "IDTF-0103",
    regimeAntesDeFeed: "B",
    nomeOficialFonte: "Sorghum",
    sinonimosRegionais: [{ nome: "sorgo granífero", regiao: "Nacional" }, { nome: "milho miúdo", regiao: "BA" }],
    nomesComerciais: ["Sorgo grão tipo 1"],
    nomesIngles: ["sorghum", "milo"],
    errosComuns: ["sorgho"],
    estadoFisico: "Granel sólido",
    restricoes: [],
    esquemaCertificacao: ["GMP+ FSA"],
    atualizadoEm: "2026-02-11",
    responsavelValidacao: "Thiago Yamashida · Gestor Qualidade",
    fonteDecisao: "IDTF EN 2026.05, item 1007.",
    bloqueiaFeed: false,
    riscoEUDR: "N/A",
    statusClassificacao: "classificado",
    versaoBase: VERSAO_BASE_IDTF,
  },
  {
    id: "p-trigo",
    nomeCanonico: "Trigo",
    alias: ["trigo", "wheat"],
    hsCode: "1001.99",
    categoria: "feed_material",
    idtfCode: "IDTF-0104",
    regimeAntesDeFeed: "B",
    nomeOficialFonte: "Wheat",
    sinonimosRegionais: [{ nome: "trigo pão", regiao: "Nacional" }, { nome: "trigo mole", regiao: "RS" }],
    nomesComerciais: ["Trigo PH 78"],
    nomesIngles: ["wheat", "soft wheat"],
    errosComuns: ["trigu"],
    estadoFisico: "Granel sólido",
    restricoes: [],
    esquemaCertificacao: ["GMP+ FSA"],
    atualizadoEm: "2026-02-11",
    responsavelValidacao: "Thiago Yamashida · Gestor Qualidade",
    fonteDecisao: "IDTF EN 2026.05, item 1001.",
    bloqueiaFeed: false,
    riscoEUDR: "N/A",
    statusClassificacao: "classificado",
    versaoBase: VERSAO_BASE_IDTF,
  },
  // Exige desinfecção sem ser proibida: é a diferença entre "liberado após
  // limpeza D" e "carga anterior proibida". Sem um produto assim na base, a
  // distinção entre os dois rótulos existiria só no código.
  {
    id: "p-farinha-peixe",
    nomeCanonico: "Farinha de peixe",
    alias: ["farinha de peixe", "fishmeal", "farinha marinha"],
    hsCode: "2301.20",
    categoria: "risco",
    idtfCode: "IDTF-0605",
    nomeOficialFonte: "Fish meal",
    sinonimosRegionais: [{ nome: "farinha de pescado", regiao: "Nacional" }],
    nomesComerciais: ["Fishmeal 65% PB"],
    nomesIngles: ["fish meal", "marine protein meal"],
    errosComuns: ["farinha peixe", "fish meal br"],
    estadoFisico: "Pó",
    restricoes: [],
    esquemaCertificacao: ["GMP+ FSA", "GMP+ B4 Transporte"],
    atualizadoEm: "2026-05-04",
    responsavelValidacao: "Rafael Duarte · Responsável Técnico",
    fonteDecisao: "IDTF EN 2026.05, item 2301 — proteína animal processada exige desinfecção antes de feed.",
    regimeAntesDeFeed: "D",
    bloqueiaFeed: false,
    riscoEUDR: "N/A",
    statusClassificacao: "classificado",
    versaoBase: VERSAO_BASE_IDTF,
  },
  // Produtos aguardando análise da qualidade — travam o uso até classificação
  // (pergunta 19: "Quando a base não reconhecer o produto, abre fila de classificação").
  {
    id: "p-casca-soja",
    nomeCanonico: "Casca de soja",
    alias: ["casca de soja", "casca soja", "soybean hulls"],
    hsCode: "2308.00",
    categoria: "feed_material",
    regimeAntesDeFeed: "A",
    sinonimosRegionais: [{ nome: "casquinha", regiao: "MT" }, { nome: "casquinha de soja", regiao: "Centro-Oeste" }],
    nomesIngles: ["soybean hulls", "soya hulls"],
    errosComuns: ["caska de soja"],
    estadoFisico: "Granel sólido",
    bloqueiaFeed: false,
    riscoEUDR: "Médio",
    statusClassificacao: "em_fila",
    emFilaDesde: "2026-06-24T08:15:00",
    versaoBase: VERSAO_BASE_IDTF,
  },
  {
    id: "p-sal-mineral",
    nomeCanonico: "Sal mineral",
    alias: ["sal mineral", "núcleo mineral", "premix mineral"],
    categoria: "risco",
    regimeAntesDeFeed: "C",
    sinonimosRegionais: [{ nome: "sal proteinado", regiao: "Nacional" }, { nome: "mistura mineral", regiao: "Nacional" }],
    nomesIngles: ["mineral salt", "mineral premix"],
    estadoFisico: "Pó",
    bloqueiaFeed: false,
    riscoEUDR: "N/A",
    statusClassificacao: "em_fila",
    emFilaDesde: "2026-07-06T16:40:00",
    versaoBase: VERSAO_BASE_IDTF,
  },
];

export function findProduto(id: string): ProdutoIDTF | undefined {
  return produtosIDTF.find((p) => p.id === id);
}

/** Comparação de nome: sem acento, sem caixa, sem espaço sobrando. "agrotóxico"
 *  digitado como "agrotoxico" tem que resolver — quem digita está no pátio. */
function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Todos os nomes pelos quais um produto pode chegar, do canônico ao erro de digitação. */
export function nomesDoProduto(p: ProdutoIDTF): string[] {
  return [
    p.nomeCanonico,
    ...(p.nomeOficialFonte ? [p.nomeOficialFonte] : []),
    ...p.alias,
    ...(p.sinonimosRegionais ?? []).map((x) => x.nome),
    ...(p.nomesComerciais ?? []),
    ...(p.nomesIngles ?? []),
    ...(p.errosComuns ?? []),
  ];
}

/**
 * Resolve um nome para o produto IDTF canônico varrendo TODAS as listas de
 * sinônimo — regional, comercial, inglês e erro comum de digitação.
 *
 * O ponto do Pilar 3 é este: "casquinha" não vira produto novo na base, vira
 * casca de soja. Produto novo de verdade entra pela fila de classificação, não
 * por divergência de vocabulário.
 */
export function resolveProdutoPorNome(nome: string): ProdutoIDTF | undefined {
  const n = normalizar(nome);
  if (!n) return undefined;
  return produtosIDTF.find((p) => nomesDoProduto(p).some((x) => normalizar(x) === n));
}

// ─────────────────────────────────────────────────────────────────────────────
// Vínculo m:n com vigência (Fase 9.1)
//
// Antes, `veiculosAutorizados: string[]` e `motoristasAutorizados: string[]`
// moravam dentro do subcontratado. Isso responde "quem opera hoje" e nada mais:
// não diz desde quando, não diz até quando, e some com o passado no instante em
// que alguém edita a lista. O dossiê de uma viagem de maio precisa saber que
// AQUELE motorista estava vinculado AQUELE dia.
//
// Um ativo pode passar por várias empresas ao longo do tempo, e uma empresa tem
// vários ativos — daí a tabela própria. A chave do motorista é `motorista.id`,
// nunca o CPF: os CPFs do protótipo estão mascarados por LGPD e não identificam
// ninguém.
// ─────────────────────────────────────────────────────────────────────────────

export type TipoEntidadeVinculo = "motorista" | "implemento" | "cavalo";

export type Vinculo = {
  id: string;
  subcontratadoId: string;
  tipo: TipoEntidadeVinculo;
  /** `motorista.id` para motorista; a placa para implemento e cavalo. */
  entidadeId: string;
  inicio: string;
  /** Ausente = vigente. Presente = encerrado, e o registro fica. */
  fim?: string;
  motivoFim?: string;
};

export const vinculos: Vinculo[] = [
  // Souza Transportes
  { id: "vin-001", subcontratadoId: "sub-001", tipo: "implemento", entidadeId: "PHC-2B17", inicio: "2025-06-01" },
  { id: "vin-002", subcontratadoId: "sub-001", tipo: "implemento", entidadeId: "UHB-9I02", inicio: "2026-02-10" },
  { id: "vin-003", subcontratadoId: "sub-001", tipo: "motorista", entidadeId: "m-001", inicio: "2025-06-01" },
  { id: "vin-004", subcontratadoId: "sub-001", tipo: "motorista", entidadeId: "m-006", inicio: "2025-09-15" },
  // Encerrado: o histórico é o ponto da tabela — a viagem de novembro continua
  // apontando para o vínculo que existia naquele dia.
  {
    id: "vin-005", subcontratadoId: "sub-001", tipo: "motorista", entidadeId: "m-004",
    inicio: "2025-03-01", fim: "2025-11-30", motivoFim: "Fim do contrato de agregação.",
  },
  // Lima Logística
  { id: "vin-006", subcontratadoId: "sub-002", tipo: "implemento", entidadeId: "MNB-7D29", inicio: "2025-01-20" },
  { id: "vin-007", subcontratadoId: "sub-002", tipo: "motorista", entidadeId: "m-002", inicio: "2025-01-20" },
  // Rondon Fretes (TAC): a pessoa é a empresa, e o vínculo diz isso.
  { id: "vin-008", subcontratadoId: "sub-003", tipo: "implemento", entidadeId: "RDN-5A18", inicio: "2025-08-04" },
  { id: "vin-009", subcontratadoId: "sub-003", tipo: "motorista", entidadeId: "m-007", inicio: "2025-08-04" },
  // Agro Sul
  { id: "vin-010", subcontratadoId: "sub-004", tipo: "implemento", entidadeId: "ASL-3C55", inicio: "2026-04-02" },
  { id: "vin-011", subcontratadoId: "sub-004", tipo: "implemento", entidadeId: "ASL-7D19", inicio: "2026-04-02" },
  { id: "vin-012", subcontratadoId: "sub-004", tipo: "motorista", entidadeId: "m-008", inicio: "2026-04-02" },
  { id: "vin-013", subcontratadoId: "sub-004", tipo: "motorista", entidadeId: "m-009", inicio: "2026-05-11" },
  {
    id: "vin-014", subcontratadoId: "sub-004", tipo: "implemento", entidadeId: "ASL-1B22",
    inicio: "2025-05-02", fim: "2026-03-28", motivoFim: "Implemento vendido; baixa no cadastro do proprietário.",
  },
];

// ── Notificações enviadas (Fase 9.4) ─────────────────────────────────────────
//
// Começa VAZIO. O protótipo não tem histórico de envio porque nada foi enviado
// ainda; inventar "alertas enviados em maio" seria fabricar. O que entra aqui é
// o que a operação disparou nesta sessão, com destinatário, canal e quem mandou.

export type TipoNotificacao = "acordo" | "certificado" | "treinamento" | "documento";

export const TIPO_NOTIFICACAO_LABEL: Record<TipoNotificacao, string> = {
  acordo: "Renovação de acordo",
  certificado: "Certificado a vencer",
  treinamento: "Treinamento pendente",
  documento: "Documento pendente",
};

export type Notificacao = {
  id: string;
  subcontratadoId: string;
  tipo: TipoNotificacao;
  mensagem: string;
  enviadaEm: string;
  canal: "WhatsApp" | "E-mail";
  remetente: string;
};

export const notificacoes: Notificacao[] = [];

export function notificacoesDoSubcontratado(subcontratadoId: string): Notificacao[] {
  return notificacoes.filter((n) => n.subcontratadoId === subcontratadoId);
}

/** Vigente na data de referência: começou e não terminou. */
export function vinculoVigente(v: Vinculo, hoje = HOJE): boolean {
  return v.inicio <= hoje && (!v.fim || v.fim >= hoje);
}

/** Vínculo vigente de uma entidade, independentemente da empresa responsável. */
export function vinculoVigenteDaEntidade(
  tipo: TipoEntidadeVinculo,
  entidadeId: string,
  hoje = HOJE
): Vinculo | undefined {
  return vinculos.find(
    (v) => v.tipo === tipo && v.entidadeId === entidadeId && vinculoVigente(v, hoje)
  );
}

export function vinculosDoSubcontratado(
  subcontratadoId: string,
  opts: { tipo?: TipoEntidadeVinculo; incluirEncerrados?: boolean; hoje?: string } = {}
): Vinculo[] {
  const hoje = opts.hoje ?? HOJE;
  return vinculos
    .filter((v) => v.subcontratadoId === subcontratadoId)
    .filter((v) => (opts.tipo ? v.tipo === opts.tipo : true))
    .filter((v) => (opts.incluirEncerrados ? true : vinculoVigente(v, hoje)))
    .sort((a, b) => b.inicio.localeCompare(a.inicio));
}

/** Placas de implemento vigentes da empresa. */
export function veiculosDoSubcontratado(subcontratadoId: string, hoje = HOJE): string[] {
  return vinculosDoSubcontratado(subcontratadoId, { tipo: "implemento", hoje }).map((v) => v.entidadeId);
}

/** Ids de motorista vigentes da empresa. */
export function motoristasDoSubcontratado(subcontratadoId: string, hoje = HOJE): string[] {
  return vinculosDoSubcontratado(subcontratadoId, { tipo: "motorista", hoje }).map((v) => v.entidadeId);
}

/** Toda a vida de um ativo ou motorista, mais recente primeiro. */
export function historicoVinculos(tipo: TipoEntidadeVinculo, entidadeId: string): Vinculo[] {
  return vinculos
    .filter((v) => v.tipo === tipo && v.entidadeId === entidadeId)
    .sort((a, b) => b.inicio.localeCompare(a.inicio));
}

/**
 * A quem o ativo/motorista respondia NA DATA. É esta função — e não a lista de
 * hoje — que o dossiê precisa para não reescrever o passado.
 */
export function subcontratadoNaData(
  tipo: TipoEntidadeVinculo,
  entidadeId: string,
  data = HOJE
): string | undefined {
  return historicoVinculos(tipo, entidadeId).find((v) => vinculoVigente(v, data))?.subcontratadoId;
}

// ─────────────────────────────────────────────────────────────────────────────
// Governança da base IDTF (Fase 8)
//
// A base é uma norma traduzida e operada, não uma planilha. Sem histórico de
// alteração, responsável e fonte, "a IDTF diz que sim" é opinião: o auditor
// pergunta quem decidiu, quando, com base em quê, e quem aprovou o sinônimo.
// ─────────────────────────────────────────────────────────────────────────────

export type TipoAlteracaoBase =
  | "inclusao"
  | "reclassificacao"
  | "sinonimo"
  | "regime"
  | "revisao";

export const TIPO_ALTERACAO_LABEL: Record<TipoAlteracaoBase, string> = {
  inclusao: "Inclusão de produto",
  reclassificacao: "Reclassificação",
  sinonimo: "Sinônimo aprovado",
  regime: "Mudança de regime",
  revisao: "Revisão da base",
};

export type AlteracaoBase = {
  id: string;
  data: string;
  versao: string;
  tipo: TipoAlteracaoBase;
  produtoId?: string;
  descricao: string;
  responsavel: string;
  /** De onde veio: item da IDTF oficial, parecer técnico, consulta ao esquema. */
  fonte: string;
  /** Aprovação técnica — sinônimo entra na base assinado, não por sugestão solta. */
  aprovadoPor?: string;
};

export const historicoBase: AlteracaoBase[] = [
  {
    id: "hb-006", data: "2026-05-04", versao: "IDTF-BR 2026.05", tipo: "revisao",
    descricao: "Revisão trimestral da base contra a IDTF EN 2026.05: 7 produtos conferidos, 2 traduções ajustadas.",
    responsavel: "Thiago Yamashida · Gestor Qualidade",
    fonte: "GMP+ International — IDTF EN, edição 2026.05",
    aprovadoPor: "Rafael Duarte · Responsável Técnico",
  },
  {
    id: "hb-005", data: "2026-05-04", versao: "IDTF-BR 2026.05", tipo: "sinonimo", produtoId: "p-farelo-soja",
    descricao: "“farelinho” aprovado como sinônimo regional de Farelo de soja no Paraná. “casquinha” foi recusado no mesmo parecer: no campo é casca de soja, produto diferente.",
    responsavel: "Joana Almeida · Despachante (sugestão de campo)",
    fonte: "Ocorrência de ordem de carregamento em 28/04/2026 · Cooperativa Coamo",
    aprovadoPor: "Thiago Yamashida · Gestor Qualidade",
  },
  {
    id: "hb-004", data: "2026-03-18", versao: "IDTF-BR 2026.03", tipo: "regime", produtoId: "p-fert-npk",
    descricao: "Fertilizante NPK passa a exigir Regime C e laudo de ausência de resíduo antes de feed.",
    responsavel: "Rafael Duarte · Responsável Técnico",
    fonte: "IDTF EN 2026.03, anexo de cargas de risco",
    aprovadoPor: "Rafael Duarte · Responsável Técnico",
  },
  {
    id: "hb-003", data: "2026-02-11", versao: "IDTF-BR 2026.02", tipo: "inclusao", produtoId: "p-trigo",
    descricao: "Trigo incluído na base brasileira com regime B como carga anterior.",
    responsavel: "Thiago Yamashida · Gestor Qualidade",
    fonte: "IDTF EN 2026.02, item 1001",
    aprovadoPor: "Rafael Duarte · Responsável Técnico",
  },
  {
    id: "hb-002", data: "2026-01-22", versao: "IDTF-BR 2026.01", tipo: "reclassificacao", produtoId: "p-defensivo",
    descricao: "Defensivo agrícola líquido confirmado como proibido antes de feed; exige liberação formal, não só limpeza.",
    responsavel: "Rafael Duarte · Responsável Técnico",
    fonte: "IDTF EN 2026.01, lista de produtos proibidos",
    aprovadoPor: "Rafael Duarte · Responsável Técnico",
  },
  {
    id: "hb-001", data: "2026-01-08", versao: "IDTF-BR 2026.01", tipo: "revisao",
    descricao: "Carga inicial da base brasileira a partir da IDTF EN, com vocabulário regional mapeado.",
    responsavel: "Thiago Yamashida · Gestor Qualidade",
    fonte: "GMP+ International — IDTF EN, edição 2026.01",
    aprovadoPor: "Rafael Duarte · Responsável Técnico",
  },
];

/** Histórico de um produto, mais recente primeiro. Vazio = nunca alterado. */
export function historicoDoProduto(produtoId: string): AlteracaoBase[] {
  return historicoBase.filter((h) => h.produtoId === produtoId);
}

/**
 * Governança vigente da base. Os itens que a diretriz cobra em §Pilar 3, cada um
 * com um valor verificável — não "processo definido" genérico.
 */
export const GOVERNANCA_BASE = {
  versao: VERSAO_BASE_IDTF,
  vigenteDesde: "2026-05-04",
  fonteOficial: "GMP+ International — IDTF (EN), edição 2026.05",
  periodicidadeRevisao: "Trimestral, ou imediata quando a fonte publica errata",
  proximaRevisao: "2026-08-04",
  responsavelTecnico: "Rafael Duarte · Responsável Técnico",
  responsavelManutencao: "Thiago Yamashida · Gestor Qualidade",
  aprovacaoSinonimo:
    "Sinônimo sugerido no campo entra como proposta; só passa a resolver depois de aprovação técnica registrada no histórico.",
  licenciamento:
    "A IDTF é conteúdo da GMP+ International. A base brasileira é tradução operacional de uso interno, sem redistribuição — cada decisão grava a versão usada.",
  politicaDivergencia:
    "Divergência entre a tradução e a fonte prevalece a fonte. Produto não reconhecido vai para a fila e trava o uso até classificação formal.",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Ativos: Cavalo · Implemento · Compartimento
// ─────────────────────────────────────────────────────────────────────────────

export type Cavalo = {
  id: string;
  placa: string;
  modelo: string;
  ano: number;
  /** O cavalo não toca a carga; não carrega histórico T-3. */
  documentacaoOk: boolean;
};

export type Implemento = {
  id: string;
  placa: string;
  tipo: "Graneleiro" | "Bitrem" | "Rodotrem" | "Tanque" | "Caçamba" | "Baú";
  nCompartimentos: number;
  certGMP: { status: "Válida" | "Vencida" | "Pendente"; validade: string; escopo: string };
  proprietario: "Frota própria" | "Subcontratado";
  subcontratadoId?: string;
};

export type Compartimento = {
  id: string;
  implementoId: string;
  identificador: string; // "Compartimento único", "Boca 1", "Tanque A"…
  capacidadeT: number;
  material: string;
  estadoConservacao: "Bom" | "Regular" | "Atenção";
};

export const cavalos: Cavalo[] = [
  { id: "cav-001", placa: "OZE-4A82", modelo: "Scania R450", ano: 2021, documentacaoOk: true },
  { id: "cav-002", placa: "JKL-9C44", modelo: "Volvo FH 540", ano: 2019, documentacaoOk: true },
  { id: "cav-003", placa: "RTY-3F19", modelo: "Mercedes Actros", ano: 2022, documentacaoOk: true },
  { id: "cav-004", placa: "WSX-5E73", modelo: "Scania R500", ano: 2020, documentacaoOk: true },
  { id: "cav-005", placa: "EDC-6T31", modelo: "Volvo FH 460", ano: 2021, documentacaoOk: true },
  { id: "cav-006", placa: "RFV-2Y58", modelo: "DAF XF", ano: 2022, documentacaoOk: true },
  // Cavalos "de passagem" — puxaram cargas anteriores destas carretas em outras viagens.
  { id: "cav-x01", placa: "VWX-3344", modelo: "Iveco S-Way", ano: 2018, documentacaoOk: true },
  { id: "cav-x02", placa: "GHT-7788", modelo: "Scania R440", ano: 2017, documentacaoOk: true },
];

export const implementos: Implemento[] = [
  {
    id: "imp-001",
    placa: "PHC-2B17",
    tipo: "Bitrem",
    nCompartimentos: 2,
    certGMP: { status: "Válida", validade: "2027-04-15", escopo: "Road Transport of Feed" },
    proprietario: "Subcontratado",
    subcontratadoId: "sub-001",
  },
  {
    id: "imp-002",
    placa: "MNB-7D29",
    tipo: "Graneleiro",
    nCompartimentos: 1,
    certGMP: { status: "Vencida", validade: "2026-03-22", escopo: "Road Transport of Feed" },
    proprietario: "Subcontratado",
    subcontratadoId: "sub-002",
  },
  {
    id: "imp-003",
    placa: "GHJ-8K22",
    tipo: "Graneleiro",
    nCompartimentos: 1,
    certGMP: { status: "Válida", validade: "2027-09-30", escopo: "Road Transport of Feed" },
    proprietario: "Frota própria",
  },
  {
    id: "imp-004",
    placa: "QAZ-1B88",
    tipo: "Graneleiro",
    nCompartimentos: 1,
    certGMP: { status: "Válida", validade: "2026-07-10", escopo: "Road Transport of Feed" }, // a vencer em ~46d → ALERTA
    proprietario: "Frota própria",
  },
  {
    id: "imp-005",
    placa: "BHN-4U16",
    tipo: "Graneleiro",
    nCompartimentos: 1,
    certGMP: { status: "Válida", validade: "2027-06-10", escopo: "Road Transport of Feed" },
    proprietario: "Frota própria",
  },
  {
    id: "imp-006",
    placa: "UHB-9I02",
    tipo: "Graneleiro",
    nCompartimentos: 1,
    certGMP: { status: "Válida", validade: "2027-11-20", escopo: "Road Transport of Feed" },
    proprietario: "Subcontratado",
    subcontratadoId: "sub-001",
  },
];

export const compartimentos: Compartimento[] = [
  { id: "comp-001", implementoId: "imp-001", identificador: "Boca 1", capacidadeT: 18, material: "Aço carbono", estadoConservacao: "Bom" },
  { id: "comp-001b", implementoId: "imp-001", identificador: "Boca 2", capacidadeT: 18, material: "Aço carbono", estadoConservacao: "Bom" },
  { id: "comp-002", implementoId: "imp-002", identificador: "Compartimento único", capacidadeT: 32, material: "Aço carbono", estadoConservacao: "Atenção" },
  { id: "comp-003", implementoId: "imp-003", identificador: "Compartimento único", capacidadeT: 34, material: "Alumínio", estadoConservacao: "Bom" },
  { id: "comp-004", implementoId: "imp-004", identificador: "Compartimento único", capacidadeT: 30, material: "Aço carbono", estadoConservacao: "Bom" },
  { id: "comp-005", implementoId: "imp-005", identificador: "Compartimento único", capacidadeT: 30, material: "Aço carbono", estadoConservacao: "Regular" },
  { id: "comp-006", implementoId: "imp-006", identificador: "Compartimento único", capacidadeT: 33, material: "Alumínio", estadoConservacao: "Bom" },
];

export function findImplemento(id: string): Implemento | undefined {
  return implementos.find((i) => i.id === id);
}
export function findCompartimento(id: string): Compartimento | undefined {
  return compartimentos.find((c) => c.id === id);
}
export function cavaloPorPlaca(placa: string): Cavalo | undefined {
  return cavalos.find((c) => c.placa === placa);
}

// ─────────────────────────────────────────────────────────────────────────────
// LoadHistory — carga anterior POR COMPARTIMENTO (append-only, imutável)
// Repare: cada carga registra o cavalo que a puxou. O histórico permanece no
// compartimento mesmo quando o cavalo muda de uma viagem para outra.
// ─────────────────────────────────────────────────────────────────────────────

export type LoadHistory = {
  id: string;
  compartimentoId: string;
  produtoId: string;
  data: string; // ISO
  cavaloPlaca: string; // cavalo que puxou ESSA carga (varia entre cargas)
  viagemId?: string;
  imutavel: true;
};

export const loadHistory: LoadHistory[] = [
  // comp-001 (PHC-2B17) — 3 cavalos diferentes ao longo das 3 últimas cargas
  { id: "lh-001", compartimentoId: "comp-001", produtoId: "p-farelo-soja", data: "2026-05-20", cavaloPlaca: "OZE-4A82", imutavel: true },
  { id: "lh-002", compartimentoId: "comp-001", produtoId: "p-milho", data: "2026-05-14", cavaloPlaca: "RTY-3F19", imutavel: true },
  { id: "lh-003", compartimentoId: "comp-001", produtoId: "p-fert-npk", data: "2026-05-08", cavaloPlaca: "JKL-9C44", imutavel: true },

  // comp-002 (MNB-7D29) — BLOQUEIO: última carga proibida (defensivo), puxada por
  // cavalo DIFERENTE do atual (VWX-3344 ≠ JKL-9C44). Prova que o T-3 é do compartimento.
  { id: "lh-004", compartimentoId: "comp-002", produtoId: "p-defensivo", data: "2026-05-22", cavaloPlaca: "VWX-3344", imutavel: true },
  { id: "lh-005", compartimentoId: "comp-002", produtoId: "p-soja", data: "2026-05-18", cavaloPlaca: "JKL-9C44", imutavel: true },
  { id: "lh-006", compartimentoId: "comp-002", produtoId: "p-milho", data: "2026-05-12", cavaloPlaca: "GHT-7788", imutavel: true },

  // comp-003 (GHJ-8K22) — limpo, sequência de grãos
  { id: "lh-007", compartimentoId: "comp-003", produtoId: "p-soja", data: "2026-05-21", cavaloPlaca: "RTY-3F19", imutavel: true },
  { id: "lh-008", compartimentoId: "comp-003", produtoId: "p-milho", data: "2026-05-15", cavaloPlaca: "OZE-4A82", imutavel: true },
  { id: "lh-009", compartimentoId: "comp-003", produtoId: "p-soja", data: "2026-05-09", cavaloPlaca: "RTY-3F19", imutavel: true },

  // comp-004 (QAZ-1B88) — grãos; cert do implemento a vencer gera ALERTA
  { id: "lh-010", compartimentoId: "comp-004", produtoId: "p-milho", data: "2026-05-23", cavaloPlaca: "WSX-5E73", imutavel: true },
  { id: "lh-011", compartimentoId: "comp-004", produtoId: "p-sorgo", data: "2026-05-17", cavaloPlaca: "WSX-5E73", imutavel: true },
  { id: "lh-012", compartimentoId: "comp-004", produtoId: "p-milho", data: "2026-05-10", cavaloPlaca: "GHT-7788", imutavel: true },

  // comp-005 (BHN-4U16)
  { id: "lh-013", compartimentoId: "comp-005", produtoId: "p-soja", data: "2026-05-19", cavaloPlaca: "EDC-6T31", imutavel: true },
  { id: "lh-014", compartimentoId: "comp-005", produtoId: "p-trigo", data: "2026-05-13", cavaloPlaca: "EDC-6T31", imutavel: true },
  { id: "lh-015", compartimentoId: "comp-005", produtoId: "p-soja", data: "2026-05-07", cavaloPlaca: "VWX-3344", imutavel: true },

  // comp-006 (UHB-9I02)
  { id: "lh-016", compartimentoId: "comp-006", produtoId: "p-soja", data: "2026-05-22", cavaloPlaca: "RFV-2Y58", imutavel: true },
  { id: "lh-017", compartimentoId: "comp-006", produtoId: "p-soja", data: "2026-05-16", cavaloPlaca: "RFV-2Y58", imutavel: true },
  { id: "lh-018", compartimentoId: "comp-006", produtoId: "p-milho", data: "2026-05-10", cavaloPlaca: "OZE-4A82", imutavel: true },

  // comp-001b (PHC-2B17 · Boca 2) — última carga fertilizante (exige C); limpeza só B → requer limpeza
  { id: "lh-019", compartimentoId: "comp-001b", produtoId: "p-fert-npk", data: "2026-05-21", cavaloPlaca: "OZE-4A82", imutavel: true },
  { id: "lh-020", compartimentoId: "comp-001b", produtoId: "p-milho", data: "2026-05-15", cavaloPlaca: "RTY-3F19", imutavel: true },
  { id: "lh-021", compartimentoId: "comp-001b", produtoId: "p-soja", data: "2026-05-09", cavaloPlaca: "JKL-9C44", imutavel: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// CleaningEvent — limpeza entre cargas, evidência dinâmica por regime (PLANO §1.2)
// ─────────────────────────────────────────────────────────────────────────────

export type CleaningEvent = {
  id: string;
  compartimentoId: string;
  regime: Regime;
  data: string;
  metodo: string;
  local: string;
  executor: string;
  produtoQuimico?: string;
  concentracao?: string;
  tempoAcao?: string;
  comprovanteEstacao?: boolean;
  fotos: number;
  geo?: { lat: number; lng: number };
  assinatura: boolean;
  /** Todos os campos coletados pelo formulário dinâmico (inclui a evidência específica
   *  do Regime D: desinfetante, dosagem, tempo de contato, eficácia, aprovação). Nada
   *  do que a norma exige por regime é descartado. */
  camposEvidencia?: Record<string, string | boolean | number>;
};

export const cleaningEvents: CleaningEvent[] = [
  // comp-001: limpeza A após farelo → suficiente para soja
  {
    id: "cl-001", compartimentoId: "comp-001", regime: "A", data: "2026-05-23",
    metodo: "Varrição + sopro", local: "Pátio Sorriso/MT", executor: "Edivaldo Souza",
    fotos: 4, geo: { lat: -12.5447, lng: -55.7211 }, assinatura: true,
  },
  // comp-002: NENHUMA limpeza após o defensivo → limpeza não evidenciada (bloqueio)
  // comp-001b: limpeza B insuficiente (última carga NPK exige C) → requer limpeza
  {
    id: "cl-002", compartimentoId: "comp-001b", regime: "B", data: "2026-05-22",
    metodo: "Lavagem com água", local: "Pátio Sorriso/MT", executor: "Edivaldo Souza",
    comprovanteEstacao: false, fotos: 3, assinatura: true,
  },
  // comp-003: limpeza A
  {
    id: "cl-003", compartimentoId: "comp-003", regime: "A", data: "2026-05-25",
    metodo: "Varrição + sucção", local: "Base Lucas do Rio Verde/MT", executor: "Carlos Aparecido",
    fotos: 5, geo: { lat: -13.06, lng: -55.9 }, assinatura: true,
  },
  // comp-004: limpeza B após sorgo (última carga milho → só A necessário; ok)
  {
    id: "cl-004", compartimentoId: "comp-004", regime: "B", data: "2026-05-24",
    metodo: "Lavagem com água", local: "Estação Sapezal/MT", executor: "José Roberto Santos",
    comprovanteEstacao: true, fotos: 6, geo: { lat: -12.86, lng: -58.72 }, assinatura: true,
  },
  // comp-005: limpeza B após trigo
  {
    id: "cl-005", compartimentoId: "comp-005", regime: "B", data: "2026-05-20",
    metodo: "Lavagem com água", local: "Estação Maringá/PR", executor: "Pedro Henrique",
    comprovanteEstacao: true, fotos: 5, geo: { lat: -23.42, lng: -51.93 }, assinatura: true,
  },
  // comp-006: limpeza A
  {
    id: "cl-006", compartimentoId: "comp-006", regime: "A", data: "2026-05-23",
    metodo: "Varrição", local: "Pátio Querência/MT", executor: "Antonio Marcos",
    fotos: 4, assinatura: true,
  },
];

/** Limpezas de um compartimento após uma data (mais recentes primeiro). */
export function limpezasApos(compartimentoId: string, dataRef: string): CleaningEvent[] {
  const ref = new Date(dataRef).getTime();
  return cleaningEvents
    .filter((c) => c.compartimentoId === compartimentoId && new Date(c.data).getTime() >= ref)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

/** Todas as limpezas de um compartimento (mais recentes primeiro). */
export function limpezasDoCompartimento(compartimentoId: string): CleaningEvent[] {
  return cleaningEvents
    .filter((c) => c.compartimentoId === compartimentoId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

/** Última limpeza registrada do compartimento. */
export function ultimaLimpeza(compartimentoId: string): CleaningEvent | undefined {
  return limpezasDoCompartimento(compartimentoId)[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// InspectionEvent — checklist LCI pré-carregamento (vinculado a comp + viagem)
// ─────────────────────────────────────────────────────────────────────────────

export type InspectionEvent = {
  id: string;
  compartimentoId: string;
  /** Opcional: inspeção standalone no pátio ocorre ANTES da viagem existir (pergunta 11).
   *  Quando vinculada a uma viagem, destrava o LCI dela. */
  viagemId?: string;
  resultado: "aprovado" | "reprovado" | "pendente";
  itensOk: number;
  itensTotal: number;
  inspetor: string;
  dataHora: string;
  geo?: { lat: number; lng: number };
  /** Fotos guiadas enviadas. O mínimo é `FOTOS_MINIMAS` (um ângulo por face). */
  fotos: number;
  offline: boolean;
  /**
   * Assinatura de quem fechou o checklist. O fluxo de campo já pede a assinatura
   * antes de enviar; guardá-la no evento é o que permite o dossiê responder
   * "quem assinou isto, em que aparelho e quando" sem depender de memória.
   */
  assinatura?: { nome: string; papel: string; assinadoEm: string; dispositivo: string };
};

/** Ângulos obrigatórios da inspeção pré-carregamento — o piso de evidência. */
export const FOTOS_MINIMAS = 6;

export const inspectionEvents: InspectionEvent[] = [
  { id: "insp-001", compartimentoId: "comp-001", viagemId: "v-001", resultado: "aprovado", itensOk: 14, itensTotal: 14, inspetor: "Edivaldo Souza", dataHora: "2026-05-24T08:14:00", geo: { lat: -12.5447, lng: -55.7211 }, fotos: 6, offline: false, assinatura: { nome: "Edivaldo Souza", papel: "Motorista", assinadoEm: "2026-05-24T08:19:00", dispositivo: "Android · app de campo" } },
  { id: "insp-002", compartimentoId: "comp-002", viagemId: "v-002", resultado: "reprovado", itensOk: 4, itensTotal: 18, inspetor: "Mauricio Lima", dataHora: "2026-05-25T14:22:00", fotos: 2, offline: true, assinatura: { nome: "Mauricio Lima", papel: "Motorista", assinadoEm: "2026-05-25T14:31:00", dispositivo: "Android · app de campo (offline)" } },
  { id: "insp-003", compartimentoId: "comp-003", viagemId: "v-003", resultado: "aprovado", itensOk: 14, itensTotal: 14, inspetor: "Carlos Aparecido", dataHora: "2026-05-26T06:30:00", geo: { lat: -13.06, lng: -55.9 }, fotos: 6, offline: false, assinatura: { nome: "Carlos Aparecido", papel: "Motorista", assinadoEm: "2026-05-26T06:37:00", dispositivo: "Android · app de campo" } },
];

export function inspecaoDaViagem(viagemId: string): InspectionEvent | undefined {
  return inspectionEvents.find((i) => i.viagemId === viagemId);
}

/** Inspeções de um compartimento (mais recentes primeiro). */
export function inspecoesDoCompartimento(compartimentoId: string): InspectionEvent[] {
  return inspectionEvents
    .filter((i) => i.compartimentoId === compartimentoId)
    .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcontratado (empresa) — entidade própria, escopo GMP+ validado (PLANO §1.2)
// ─────────────────────────────────────────────────────────────────────────────

// Como o transportador se relaciona com a operação (Gatekeeper §3 — o sistema
// precisa distinguir, não tratar todo terceiro como "fornecedor genérico").
export type TipoVinculo =
  | "TAC pessoa física"
  | "ETC subcontratada"
  | "Agregado"
  | "Motorista empregado"
  | "Motorista vinculado a empresa terceira"
  | "Transportador certificado"
  | "Condição Gatekeeper";

/** Os sete vínculos que a diretriz §Gatekeeper manda distinguir, em ordem. */
export const TIPOS_VINCULO: TipoVinculo[] = [
  "TAC pessoa física",
  "ETC subcontratada",
  "Agregado",
  "Motorista empregado",
  "Motorista vinculado a empresa terceira",
  "Transportador certificado",
  "Condição Gatekeeper",
];

/** Vínculo que é pessoa física conduzindo — não empresa contratada. */
export function vinculoEhPessoa(t?: TipoVinculo): boolean {
  return t === "TAC pessoa física" || t === "Motorista empregado" || t === "Motorista vinculado a empresa terceira";
}

// Acordo de Garantia da Qualidade digital (Gatekeeper §3) — deixa de ser arquivo
// isolado e vira registro operacional controlado, com versão, vigência e assinatura.
export type AcordoQA = {
  versao: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  assinadoEm?: string;
  assinante?: string;
  dispositivo?: string;
  /** Quando a renovação deve ser disparada — antes do vencimento, não depois. */
  renovacaoEm?: string;
  /** Quem responde pela empresa no acordo (§Gatekeeper: "associação com empresa, TAC e representantes"). */
  representantes?: string[];
  /**
   * Termo específico de ciência do motorista, separado do acordo da empresa: o
   * acordo é da pessoa jurídica, a ciência é de quem dirige.
   */
  cienciaMotorista?: { motoristaId: string; aceitoEm: string };
};

export type Subcontratado = {
  id: string;
  cnpj: string;
  razaoSocial: string;
  tipoVinculo?: TipoVinculo;
  /** Quando o transportador é uma pessoa (ex.: TAC), aponta para a mesma
   * identidade operacional no cadastro de motoristas — não é outra pessoa. */
  responsavelMotoristaId?: string;
  certGMP: {
    numero: string;
    certificadora: string;
    escopo: ("Road Transport of Feed" | "Affreightment of Road Transport")[];
    validade: string;
    sitesCobertos: string[];
    statusBasePublica: "Ativo" | "Suspenso" | "Não localizado";
  };
  treinamento: { comprovante: boolean; quiz: boolean; aceiteRegras: boolean };
  acordo?: AcordoQA;
  /** Como o registro entrou e em qual etapa do Gatekeeper ele está. */
  cadastro?: EntradaCadastro;
  /**
   * Arquivamento (Fase 9.5). Guardar a data em vez de apagar o registro é o que
   * mantém o histórico: viagem antiga continua apontando para a empresa que a
   * fez, e o dossiê de 2026 não fica órfão porque alguém "limpou o cadastro".
   */
  arquivadoEm?: string;
  motivoArquivo?: string;
};

// Estados de qualificação do transportador (Gatekeeper §3). Derivados do estado
// real (cert, base pública, acordo, treinamento) — não um campo editável solto.
export type EstadoQualificacao =
  | "Pré-cadastrado"
  | "Pendente documental"
  | "Pendente de treinamento"
  | "Pendente de inspeção"
  | "Apto"
  | "Apto com restrição"
  | "Bloqueado"
  | "Suspenso"
  | "Inativo";

export const ESTADO_QUALIFICACAO: Record<
  EstadoQualificacao,
  { tone: "success" | "warning" | "danger" | "muted"; opera: boolean }
> = {
  Apto: { tone: "success", opera: true },
  "Apto com restrição": { tone: "warning", opera: true },
  "Pré-cadastrado": { tone: "muted", opera: false },
  "Pendente documental": { tone: "warning", opera: false },
  "Pendente de treinamento": { tone: "warning", opera: false },
  "Pendente de inspeção": { tone: "warning", opera: false },
  Bloqueado: { tone: "danger", opera: false },
  Suspenso: { tone: "danger", opera: false },
  Inativo: { tone: "muted", opera: false },
};

export const subcontratados: Subcontratado[] = [
  {
    id: "sub-001",
    cnpj: "23.456.789/0001-01",
    razaoSocial: "Souza Transportes ME",
    tipoVinculo: "Transportador certificado",
    certGMP: {
      numero: "GMP-BR-2024-8841",
      certificadora: "Único Organismo Certificador BR",
      escopo: ["Road Transport of Feed"],
      validade: "2027-04-15",
      sitesCobertos: ["Sorriso/MT"],
      statusBasePublica: "Ativo",
    },
    treinamento: { comprovante: true, quiz: true, aceiteRegras: true },
    acordo: {
      versao: "v3.0",
      vigenciaInicio: "2026-01-10",
      vigenciaFim: "2027-01-10",
      assinadoEm: "2026-01-10T09:12:00",
      assinante: "Edivaldo Souza",
      dispositivo: "Android 12 · Motorola E22",
    },
  },
  {
    id: "sub-002",
    cnpj: "34.567.890/0001-12",
    razaoSocial: "Lima Logística Agrícola Ltda",
    tipoVinculo: "ETC subcontratada",
    certGMP: {
      numero: "GMP-BR-2023-5510",
      certificadora: "Único Organismo Certificador BR",
      escopo: ["Road Transport of Feed"],
      validade: "2026-03-22", // VENCIDO
      sitesCobertos: ["Campo Mourão/PR"],
      statusBasePublica: "Suspenso",
    },
    treinamento: { comprovante: true, quiz: false, aceiteRegras: true },
    acordo: {
      versao: "v2.0",
      vigenciaInicio: "2025-02-01",
      vigenciaFim: "2026-02-01", // vencido
      assinadoEm: "2025-02-01T11:40:00",
      assinante: "Mauricio Lima",
      dispositivo: "Android 10 · Samsung A03",
    },
  },
  {
    id: "sub-003",
    cnpj: "45.678.901/0001-23",
    razaoSocial: "Rondon Fretes — José A. Ferreira (TAC)",
    tipoVinculo: "TAC pessoa física",
    responsavelMotoristaId: "m-007",
    certGMP: {
      numero: "GMP-BR-2025-2077",
      certificadora: "Único Organismo Certificador BR",
      escopo: ["Road Transport of Feed"],
      validade: "2026-08-04", // a vencer (~27 dias de HOJE)
      sitesCobertos: ["Rondonópolis/MT"],
      statusBasePublica: "Ativo",
    },
    treinamento: { comprovante: true, quiz: true, aceiteRegras: true },
    acordo: {
      versao: "v3.0",
      vigenciaInicio: "2026-03-15",
      vigenciaFim: "2027-03-15",
      assinadoEm: "2026-03-15T08:05:00",
      assinante: "José A. Ferreira",
      dispositivo: "Android 11 · Xiaomi Redmi 9",
    },
  },
  {
    id: "sub-004",
    cnpj: "56.789.012/0001-34",
    razaoSocial: "Agro Sul Agregados Ltda",
    tipoVinculo: "Agregado",
    certGMP: {
      numero: "GMP-BR-2025-6642",
      certificadora: "Único Organismo Certificador BR",
      escopo: ["Road Transport of Feed", "Affreightment of Road Transport"],
      validade: "2027-09-30",
      sitesCobertos: ["Rondonópolis/MT", "Sorriso/MT"],
      statusBasePublica: "Ativo",
    },
    treinamento: { comprovante: true, quiz: false, aceiteRegras: false },
    acordo: {
      versao: "v3.0",
      vigenciaInicio: "2026-04-02",
      vigenciaFim: "2027-04-02",
      assinadoEm: "2026-04-02T14:20:00",
      assinante: "Reginaldo Alves",
      dispositivo: "Android 13 · Motorola G13",
    },
  },
];

export function findSubcontratado(id?: string): Subcontratado | undefined {
  return id ? subcontratados.find((s) => s.id === id) : undefined;
}

/** Estado de qualificação derivado do estado real (cert, base pública, acordo,
 *  treinamento). Ordem = prioridade do que impede operar. Retorna estado + motivo. */
export function estadoQualificacao(s: Subcontratado): { estado: EstadoQualificacao; motivo: string } {
  // Arquivada não opera, e isso vem antes de qualquer análise de certificado:
  // o estado continua derivado de fato — o fato aqui é a data do arquivamento.
  if (s.arquivadoEm)
    return {
      estado: "Inativo",
      motivo: `Arquivada em ${s.arquivadoEm.slice(0, 10)}. ${s.motivoArquivo ?? ""}`.trim(),
    };
  // Importação e onboarding público só coletam fatos. Antes de alguém iniciar a
  // qualificação, certificado ausente significa pré-cadastro — não uma empresa
  // já avaliada e bloqueada. Ao avançar a etapa, as regras abaixo assumem.
  if (s.cadastro?.etapa === "pre_cadastro") {
    const origem = s.cadastro.origem === "importacao" ? "importação" : "convite público";
    return {
      estado: "Pré-cadastrado",
      motivo: `Cadastro recebido por ${origem}. Revise os dados e inicie a qualificação; nenhuma aptidão foi afirmada.`,
    };
  }
  const venc = nivelVencimento(s.certGMP.validade);
  if (s.certGMP.statusBasePublica === "Suspenso")
    return { estado: "Suspenso", motivo: "Status “Suspenso” na base pública GMP+ International." };
  if (s.certGMP.statusBasePublica === "Não localizado")
    return { estado: "Bloqueado", motivo: "Empresa não localizada na base pública GMP+ — escopo não confirmado." };
  if (venc.nivel === "vencido")
    return { estado: "Bloqueado", motivo: `Certificado GMP+ da empresa vencido há ${Math.abs(venc.dias)} dias.` };
  if (!s.acordo || !s.acordo.assinadoEm || diasEntre(HOJE, s.acordo.vigenciaFim) < 0)
    return {
      estado: "Pendente documental",
      motivo: !s.acordo ? "Acordo de Garantia da Qualidade não firmado." : "Acordo de Garantia da Qualidade vencido ou não assinado.",
    };
  if (!s.treinamento.comprovante || !s.treinamento.quiz || !s.treinamento.aceiteRegras)
    return { estado: "Pendente de treinamento", motivo: "Treinamento GMP+ incompleto: falta comprovante, quiz ou aceite das regras." };
  if (venc.nivel === "critico" || venc.nivel === "alto" || venc.nivel === "alerta")
    return { estado: "Apto com restrição", motivo: `Certificado GMP+ vence em ${venc.dias} dias — programar renovação.` };
  return { estado: "Apto", motivo: "Qualificação vigente. Apto a operar sob cadeia GMP+ FSA." };
}

// ─────────────────────────────────────────────────────────────────────────────
// Exceções / Liberações — matriz de autoridade (pergunta 04, PLANO §3/§4.2)
// O motorista NUNCA libera exceção; apenas registra ocorrência e solicita análise.
// ─────────────────────────────────────────────────────────────────────────────

// `tecnico` é o nível de NINGUÉM: existe para que "não há liberação possível"
// seja um estado do modelo, e não só um texto na matriz. Ver control-tower.ts.
//
// Fase 7: `trafego` e `inspetor` fecham os seis níveis da diretriz. Não são
// enfeite hierárquico — são os dois níveis em que a decisão depende de quem
// está no lugar certo: o tráfego resolve pendência de agenda e documento sem
// risco de feed; o inspetor é o único que pode atestar a condição FÍSICA do
// compartimento, porque é quem tem olho no aço. Escalar para cima continua
// valendo (gestor decide o que o inspetor decidiria); para baixo, nunca.
export type NivelAutoridade = "tecnico" | "diretoria_rt" | "gestor" | "inspetor" | "trafego" | "cliente";

export type Excecao = {
  id: string;
  viagemId: string;
  codigoViagem: string;
  motivoBloqueio: string;
  regra: string;
  nivelRequerido: NivelAutoridade;
  solicitante: string;
  solicitadoEm: string;
  status: "pendente" | "aprovada" | "negada";
  aprovador?: string;
  decididoEm?: string;
  evidencias: string[];
  observacao?: string;
};

export const NIVEL_LABEL: Record<NivelAutoridade, string> = {
  tecnico: "Bloqueio técnico — sem liberação por autoridade",
  diretoria_rt: "Diretoria + Resp. Técnico + Qualidade",
  gestor: "Gestor GMP+/Qualidade",
  inspetor: "Inspetor de pátio (condição física)",
  trafego: "Operador de tráfego (pendência simples)",
  cliente: "Cliente/Embarcador (só escopo comercial)",
};

/** Rótulo curto para chip/badge, onde o nome completo não cabe. */
export const NIVEL_CURTO: Record<NivelAutoridade, string> = {
  tecnico: "Ninguém libera",
  diretoria_rt: "Diretoria + RT",
  gestor: "Gestor GMP+",
  inspetor: "Inspetor de pátio",
  trafego: "Tráfego",
  cliente: "Cliente",
};

/**
 * Escopo de cada nível — fonte única da matriz de autoridade exibida em
 * /excecoes. Antes a matriz era um array solto na página com 4 cartões contra
 * 3 níveis no tipo; agora tipo e tela não podem divergir.
 */
export const NIVEL_ESCOPO: Record<NivelAutoridade, string> = {
  tecnico:
    "Carga anterior proibida sem procedimento, compartimento com resíduo/odor/praga, certificado GMP+ vencido, limpeza exigida não evidenciada, T-3 ausente. Nenhuma assinatura desfaz o fato — só a regularização derruba o bloqueio.",
  diretoria_rt:
    "Exceções com impacto contratual, uso emergencial de terceiro, pendência documental temporária, risco residual formalmente aceito.",
  gestor:
    "Divergência documental corrigível, foto reenviada, limpeza feita com comprovante pendente, troca de veículo pré-carregamento, competência do motorista regularizada na Academy.",
  inspetor:
    "Condição física do compartimento verificada no pátio: reprovação de checklist já corrigida, ângulo de foto refeito, avaria sanada. Atesta o que viu — não decide documento nem contrato.",
  trafego:
    "Pendência simples sem risco de feed: janela de carregamento, protocolo de renovação em curso, sincronização de evidência atrasada. Nunca toca contaminação, limpeza ou certificação vencida.",
  cliente:
    "Pode aceitar atraso ou troca de veículo. Nunca reduz exigência de segurança de feed nem perdoa contaminação.",
};

/** Ordem de exibição da matriz: do mais duro ao mais frouxo. */
export const NIVEIS_AUTORIDADE: NivelAutoridade[] = [
  "tecnico",
  "diretoria_rt",
  "gestor",
  "inspetor",
  "trafego",
  "cliente",
];

// ─────────────────────────────────────────────────────────────────────────────
// Papéis (RBAC) — Fase I usa: gestor/qualidade, despachante, motorista, inspetor,
// diretoria/RT e admin de subcontratados (PLANO §3, pergunta 03).
// Regra dura (pergunta 04): o MOTORISTA nunca libera exceção sozinho.
// ─────────────────────────────────────────────────────────────────────────────

export type Papel =
  | "gestor"
  | "despachante"
  | "motorista"
  | "inspetor"
  | "diretoria_rt"
  | "admin_subcontratados"
  | "auditor_interno";

export const PAPEL_LABEL: Record<Papel, string> = {
  gestor: "Gestor GMP+/Qualidade",
  despachante: "Despachante/Tráfego",
  motorista: "Motorista",
  inspetor: "Inspetor de pátio",
  diretoria_rt: "Diretoria + Resp. Técnico",
  admin_subcontratados: "Admin de subcontratados",
  auditor_interno: "Auditor interno",
};

// Papéis de CAMPO roteiam para o App (superfície C); os demais são de ESCRITÓRIO
// (superfície B). É o que decide o eixo 2 dentro de um tenant_user.
export const PAPEIS_CAMPO: Papel[] = ["motorista", "inspetor"];
export const isPapelCampo = (p: Papel): boolean => p === "motorista" || p === "inspetor";

/**
 * Quem pode aprovar uma exceção do nível exigido. O MOTORISTA nunca aprova, em
 * nível nenhum: registra ocorrência e solicita análise.
 *
 * Autoridade escala para cima, nunca para baixo — quem decide o mais severo
 * decide o menos severo. Por isso o gestor cobre `inspetor` e `trafego`: se
 * pode liberar divergência documental, pode liberar pendência de agenda.
 */
export function podeAprovarExcecao(papel: Papel, nivel: NivelAutoridade): boolean {
  // Bloqueio técnico não escala: nem diretoria, nem master, nem ninguém. O que
  // libera é regularizar o fato (limpar, renovar o certificado, registrar o T-3).
  if (nivel === "tecnico") return false;
  if (nivel === "diretoria_rt") return papel === "diretoria_rt";
  if (nivel === "gestor") return papel === "gestor" || papel === "diretoria_rt";
  // Condição física do compartimento: quem viu decide, e a Qualidade cobre.
  if (nivel === "inspetor") return papel === "inspetor" || papel === "gestor" || papel === "diretoria_rt";
  // Pendência simples: o tráfego resolve o que é de agenda e documento em curso.
  if (nivel === "trafego")
    return papel === "despachante" || papel === "gestor" || papel === "diretoria_rt";
  // "cliente" = escopo comercial (atraso/troca), nunca contaminação — fora do gate interno.
  return false;
}

/** Ações de escrita gated por papel — usado para esconder/mostrar botões (RBAC-lite). */
export function podeExecutar(
  papel: Papel,
  acao: "criarViagem" | "classificarIDTF" | "qualificarSubcontratado" | "registrarInspecao" | "registrarLimpeza" | "aprovarExcecao"
): boolean {
  switch (acao) {
    case "criarViagem":
      return papel === "despachante" || papel === "gestor" || papel === "diretoria_rt";
    case "classificarIDTF":
      return papel === "gestor" || papel === "diretoria_rt";
    case "qualificarSubcontratado":
      return papel === "gestor" || papel === "diretoria_rt" || papel === "admin_subcontratados";
    case "registrarInspecao":
      return papel === "inspetor" || papel === "motorista" || papel === "gestor";
    case "registrarLimpeza":
      return papel === "inspetor" || papel === "motorista" || papel === "gestor";
    case "aprovarExcecao":
      return papel === "gestor" || papel === "diretoria_rt";
    default:
      return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EIXO 1 — accountType (decide a SUPERFÍCIE). Entra POR CIMA do `papel` (eixo 2).
// Regra (PLANO-PERFIS §0/§9): login resolve accountType → escolhe superfície;
// dentro de tenant_user o `papel` de campo (motorista/inspetor) desvia p/ o App (C).
// ─────────────────────────────────────────────────────────────────────────────

export type AccountType = "traxium_admin" | "tenant_user" | "subcontractor_admin" | "auditor";

/** A·Console · B·Back-office · C·App de campo · D·Portal subcontratado · E·Visão auditor. */
export type Surface = "A" | "B" | "C" | "D" | "E";

export function deriveSurface(accountType: AccountType, papel: Papel): Surface {
  switch (accountType) {
    case "traxium_admin":
      return "A";
    case "subcontractor_admin":
      return "D";
    case "auditor":
      return "E";
    case "tenant_user":
      return isPapelCampo(papel) ? "C" : "B";
  }
}

export const SURFACE_LABEL: Record<Surface, string> = {
  A: "Console Traxium",
  B: "Back-office",
  C: "App de campo",
  D: "Portal do subcontratado",
  E: "Visão do auditor",
};

// Catálogo de logins do protótipo (§2). "Entrar como…" seleciona um destes:
// seta (accountType, papel) e roteia para a superfície derivada. `master` é a
// chave-mestra de demonstração (ortogonal — destrava todas as abas da superfície B).
export type PerfilDemoId =
  | "master"
  | "traxium_admin"
  | "gestor"
  | "despachante"
  | "diretoria"
  | "admin_sub"
  | "auditor_interno"
  | "motorista"
  | "inspetor"
  | "subcontratado"
  | "auditor_externo";

export type PerfilDemo = {
  id: PerfilDemoId;
  label: string;
  pessoa: string; // persona do §2 (contexto de demo)
  descricao: string;
  accountType: AccountType;
  papel: Papel; // para superfícies não-tenant é indiferente; guardamos um default coerente
  isMaster?: boolean;
  fase2?: boolean; // D/E são prévia rotulada no MVP
};

export const PERFIS_DEMO: PerfilDemo[] = [
  {
    id: "master",
    label: "Apresentação — Master",
    pessoa: "Chave-mestra de palco",
    descricao: "Todas as abas de todas as superfícies. Não é papel de produção.",
    accountType: "tenant_user",
    papel: "gestor",
    isMaster: true,
  },
  {
    id: "traxium_admin",
    label: "Traxium Admin",
    pessoa: "Console",
    descricao: "Tenants, faturamento, IDTF global, impersonation. Não opera o cliente.",
    accountType: "traxium_admin",
    papel: "gestor",
  },
  {
    id: "gestor",
    label: "Gestor GMP+/Qualidade",
    pessoa: "Thiago",
    descricao: "Dono da conformidade — nav mais larga do tenant.",
    accountType: "tenant_user",
    papel: "gestor",
  },
  {
    id: "despachante",
    label: "Despachante/Tráfego",
    pessoa: "Jéssica",
    descricao: "Dono da viagem. Não aprova exceção nem classifica IDTF.",
    accountType: "tenant_user",
    papel: "despachante",
  },
  {
    id: "diretoria",
    label: "Diretoria + Resp. Técnico",
    pessoa: "Roberto",
    descricao: "Nav enxuta. Foco em exceção nível 2 + painel executivo.",
    accountType: "tenant_user",
    papel: "diretoria_rt",
  },
  {
    id: "admin_sub",
    label: "Admin de Subcontratados",
    pessoa: "Fernanda",
    descricao: "Nav focada em subcontratados e certificados a vencer.",
    accountType: "tenant_user",
    papel: "admin_subcontratados",
  },
  {
    id: "auditor_interno",
    label: "Auditor interno",
    pessoa: "Patrícia",
    descricao: "Somente leitura + abrir NC. Investigação contínua.",
    accountType: "tenant_user",
    papel: "auditor_interno",
  },
  {
    id: "motorista",
    label: "Motorista",
    pessoa: "Valdir / Cleiton / Wesley",
    descricao: "Só o App. Sem sidebar, sem back-office.",
    accountType: "tenant_user",
    papel: "motorista",
  },
  {
    id: "inspetor",
    label: "Inspetor de pátio",
    pessoa: "Marcão",
    descricao: "App/tablet focado em inspeção LCI.",
    accountType: "tenant_user",
    papel: "inspetor",
  },
  {
    id: "subcontratado",
    label: "Subcontratado (Portal)",
    pessoa: "Souza Transportes",
    descricao: "Portal tenant-lite, escopado só à própria empresa.",
    accountType: "subcontractor_admin",
    papel: "gestor",
    fase2: true,
  },
  {
    id: "auditor_externo",
    label: "Auditor externo",
    pessoa: "Organismo certificador",
    descricao: "Somente leitura, amostra liberada. Prévia de Fase 2.",
    accountType: "auditor",
    papel: "gestor",
    fase2: true,
  },
];

export const PERFIL_POR_ID: Record<PerfilDemoId, PerfilDemo> = PERFIS_DEMO.reduce(
  (acc, p) => ((acc[p.id] = p), acc),
  {} as Record<PerfilDemoId, PerfilDemo>
);

export const excecoes: Excecao[] = [
  {
    id: "exc-001",
    viagemId: "v-002",
    codigoViagem: "TX-2026-08472",
    motivoBloqueio: "Carga anterior proibida (defensivo agrícola líquido) sem limpeza Regime D evidenciada.",
    regra: "Carga anterior proibida",
    // Técnico, não diretoria: enquanto a limpeza D não existir, não há assinatura
    // que torne o compartimento apto. A hierarquia entra depois da regularização.
    nivelRequerido: "tecnico",
    solicitante: "Mauricio Lima · motorista (registrou ocorrência)",
    solicitadoEm: "2026-05-25T14:40:00",
    status: "pendente",
    evidencias: ["Foto do compartimento", "Solicitação de análise"],
    observacao:
      "Contaminação não é liberável por tráfego, por diretoria nem 'perdoada' pelo cliente. O bloqueio cai quando a limpeza Regime D for executada e evidenciada e o motor reavaliar — não por aprovação.",
  },
  {
    id: "exc-002",
    viagemId: "v-004",
    codigoViagem: "TX-2026-08474",
    motivoBloqueio: "Certificação GMP+ do implemento vence em 2 dias — pendência sem risco direto.",
    regra: "Pendência sem risco direto",
    // Tráfego (Fase 7): protocolo de renovação em curso é pendência de agenda,
    // não de segurança de feed. Gestor e diretoria continuam podendo decidir.
    nivelRequerido: "trafego",
    solicitante: "Joana Almeida · despachante",
    solicitadoEm: "2026-07-06T09:12:00",
    status: "pendente",
    evidencias: ["Protocolo de renovação do certificado"],
  },
  {
    id: "exc-003",
    viagemId: "v-005",
    codigoViagem: "TX-2026-08475",
    motivoBloqueio: "Troca de veículo antes do carregamento com nova inspeção aprovada.",
    regra: "Mudança de veículo pré-carregamento",
    nivelRequerido: "gestor",
    solicitante: "Joana Almeida · despachante",
    solicitadoEm: "2026-05-23T06:40:00",
    status: "aprovada",
    aprovador: "Thiago Yamashida · Gestor Qualidade",
    decididoEm: "2026-05-23T06:58:00",
    evidencias: ["Nova inspeção LCI", "Foto pós-limpeza"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Vínculo viagem → compartimento (sem editar mock-data.ts)
// Mapeia cada viagem existente ao compartimento que efetivamente toca o produto.
// ─────────────────────────────────────────────────────────────────────────────

export const compartimentoPorViagem: Record<string, string> = {
  "v-001": "comp-001",
  "v-002": "comp-002",
  "v-003": "comp-003",
  "v-004": "comp-004",
  "v-005": "comp-005",
  "v-006": "comp-006",
};

// ─────────────────────────────────────────────────────────────────────────────
// Documentos da viagem (Fase 7 — item do dossiê).
//
// Documento fiscal e operacional é evidência de auditoria como qualquer outra:
// o auditor pergunta qual CT-e amparava a carga que o motor liberou. Viagem sem
// documento emitido mostra vazio — a ausência é informação, não motivo para
// inventar um número plausível.
// ─────────────────────────────────────────────────────────────────────────────

export type DocumentoViagem = {
  tipo: "CT-e" | "MDF-e" | "NF-e" | "Ordem de carregamento" | "Ticket de balança";
  numero: string;
  emitidoEm: string;
  situacao: "Autorizado" | "Emitido" | "Pendente" | "Cancelado";
};

const DOCS_POR_VIAGEM: Record<string, DocumentoViagem[]> = {
  "v-001": [
    { tipo: "CT-e", numero: "351260-00842177", emitidoEm: "2026-05-24T08:41:00", situacao: "Autorizado" },
    { tipo: "MDF-e", numero: "351260-00019044", emitidoEm: "2026-05-24T08:47:00", situacao: "Autorizado" },
    { tipo: "Ordem de carregamento", numero: "OC-2026-4471", emitidoEm: "2026-05-24T07:55:00", situacao: "Emitido" },
    { tipo: "Ticket de balança", numero: "BAL-88213", emitidoEm: "2026-05-24T09:12:00", situacao: "Emitido" },
  ],
  // v-002 está bloqueada: a ordem saiu, o fiscal não. É exatamente o que se
  // espera de uma carga que nunca deveria ter sido carregada.
  "v-002": [
    { tipo: "Ordem de carregamento", numero: "OC-2026-4472", emitidoEm: "2026-05-25T13:50:00", situacao: "Emitido" },
    { tipo: "CT-e", numero: "—", emitidoEm: "2026-05-25T14:40:00", situacao: "Pendente" },
  ],
  "v-003": [
    { tipo: "CT-e", numero: "351260-00842190", emitidoEm: "2026-05-26T07:02:00", situacao: "Autorizado" },
    { tipo: "MDF-e", numero: "351260-00019051", emitidoEm: "2026-05-26T07:08:00", situacao: "Autorizado" },
    { tipo: "Ordem de carregamento", numero: "OC-2026-4473", emitidoEm: "2026-05-26T06:20:00", situacao: "Emitido" },
  ],
  "v-004": [
    { tipo: "Ordem de carregamento", numero: "OC-2026-4474", emitidoEm: "2026-07-06T08:30:00", situacao: "Emitido" },
  ],
};

/** Documentos emitidos para a viagem, mais recentes primeiro. Vazio = nenhum. */
export function documentosDaViagem(viagemId: string): DocumentoViagem[] {
  return [...(DOCS_POR_VIAGEM[viagemId] ?? [])].sort(
    (a, b) => new Date(b.emitidoEm).getTime() - new Date(a.emitidoEm).getTime()
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Retificação — imutabilidade (pergunta 20). Depois de enviado/sincronizado, um
// campo travado não é sobrescrito: a correção é um EVENTO NOVO que preserva o
// valor original, com motivo, responsável e data/hora. Nunca apagar o passado.
// ─────────────────────────────────────────────────────────────────────────────

export type Retificacao = {
  id: string;
  entidade: "viagem" | "compartimento" | "limpeza" | "inspecao";
  entidadeId: string;
  campo: string;
  valorOriginal: string;
  valorNovo: string;
  motivo: string;
  responsavel: string;
  dataHora: string;
};

export const retificacoes: Retificacao[] = [];

/** Retificações de uma entidade (mais recentes primeiro). */
export function retificacoesDe(entidade: Retificacao["entidade"], entidadeId: string): Retificacao[] {
  return retificacoes
    .filter((r) => r.entidade === entidade && r.entidadeId === entidadeId)
    .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
}

/** Produto atual de cada viagem, resolvido para o IDTF canônico. */
export const produtoAtualPorViagem: Record<string, string> = {
  "v-001": "p-soja",
  "v-002": "p-farelo-soja",
  "v-003": "p-soja",
  "v-004": "p-milho",
  "v-005": "p-soja",
  "v-006": "p-soja",
};
