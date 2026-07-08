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

export type ProdutoIDTF = {
  id: string;
  nomeCanonico: string;
  /** Sinônimos brasileiros; o motor resolve "farelo", "soja farelo", "soybean meal". */
  alias: string[];
  hsCode?: string;
  categoria: "feed" | "feed_material" | "risco" | "proibido";
  idtfCode?: string;
  /**
   * Se este produto foi a carga ANTERIOR, qual o regime mínimo de limpeza exigido
   * antes de carregar feed no mesmo compartimento.
   */
  regimeAntesDeFeed: Regime;
  /** Carga proibida: exige procedimento formal de liberação, não limpeza comum. */
  bloqueiaFeed: boolean;
  riscoEUDR: "N/A" | "Baixo" | "Médio" | "Alto";
  statusClassificacao: "classificado" | "em_fila" | "proibido";
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
    bloqueiaFeed: false,
    riscoEUDR: "Médio",
    statusClassificacao: "em_fila",
    versaoBase: VERSAO_BASE_IDTF,
  },
  {
    id: "p-sal-mineral",
    nomeCanonico: "Sal mineral",
    alias: ["sal mineral", "núcleo mineral", "premix mineral"],
    categoria: "risco",
    regimeAntesDeFeed: "C",
    bloqueiaFeed: false,
    riscoEUDR: "N/A",
    statusClassificacao: "em_fila",
    versaoBase: VERSAO_BASE_IDTF,
  },
];

export function findProduto(id: string): ProdutoIDTF | undefined {
  return produtosIDTF.find((p) => p.id === id);
}

/** Resolve um nome comercial (ou alias) para o produto IDTF canônico. */
export function resolveProdutoPorNome(nome: string): ProdutoIDTF | undefined {
  const n = nome.trim().toLowerCase();
  return produtosIDTF.find(
    (p) => p.nomeCanonico.toLowerCase() === n || p.alias.some((a) => a.toLowerCase() === n)
  );
}

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
  offline: boolean;
};

export const inspectionEvents: InspectionEvent[] = [
  { id: "insp-001", compartimentoId: "comp-001", viagemId: "v-001", resultado: "aprovado", itensOk: 14, itensTotal: 14, inspetor: "Edivaldo Souza", dataHora: "2026-05-24T08:14:00", geo: { lat: -12.5447, lng: -55.7211 }, offline: false },
  { id: "insp-002", compartimentoId: "comp-002", viagemId: "v-002", resultado: "reprovado", itensOk: 4, itensTotal: 18, inspetor: "Mauricio Lima", dataHora: "2026-05-25T14:22:00", offline: true },
  { id: "insp-003", compartimentoId: "comp-003", viagemId: "v-003", resultado: "aprovado", itensOk: 14, itensTotal: 14, inspetor: "Carlos Aparecido", dataHora: "2026-05-26T06:30:00", geo: { lat: -13.06, lng: -55.9 }, offline: false },
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

export type Subcontratado = {
  id: string;
  cnpj: string;
  razaoSocial: string;
  certGMP: {
    numero: string;
    certificadora: string;
    escopo: ("Road Transport of Feed" | "Affreightment of Road Transport")[];
    validade: string;
    sitesCobertos: string[];
    statusBasePublica: "Ativo" | "Suspenso" | "Não localizado";
  };
  veiculosAutorizados: string[];
  motoristasAutorizados: string[];
  treinamento: { comprovante: boolean; quiz: boolean; aceiteRegras: boolean };
};

export const subcontratados: Subcontratado[] = [
  {
    id: "sub-001",
    cnpj: "23.456.789/0001-01",
    razaoSocial: "Souza Transportes ME",
    certGMP: {
      numero: "GMP-BR-2024-8841",
      certificadora: "Único Organismo Certificador BR",
      escopo: ["Road Transport of Feed"],
      validade: "2027-04-15",
      sitesCobertos: ["Sorriso/MT"],
      statusBasePublica: "Ativo",
    },
    veiculosAutorizados: ["PHC-2B17", "UHB-9I02"],
    motoristasAutorizados: ["Edivaldo Souza", "Antonio Marcos"],
    treinamento: { comprovante: true, quiz: true, aceiteRegras: true },
  },
  {
    id: "sub-002",
    cnpj: "34.567.890/0001-12",
    razaoSocial: "Lima Logística Agrícola Ltda",
    certGMP: {
      numero: "GMP-BR-2023-5510",
      certificadora: "Único Organismo Certificador BR",
      escopo: ["Road Transport of Feed"],
      validade: "2026-03-22", // VENCIDO
      sitesCobertos: ["Campo Mourão/PR"],
      statusBasePublica: "Suspenso",
    },
    veiculosAutorizados: ["MNB-7D29"],
    motoristasAutorizados: ["Mauricio Lima"],
    treinamento: { comprovante: true, quiz: false, aceiteRegras: true },
  },
];

export function findSubcontratado(id?: string): Subcontratado | undefined {
  return id ? subcontratados.find((s) => s.id === id) : undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Exceções / Liberações — matriz de autoridade (pergunta 04, PLANO §3/§4.2)
// O motorista NUNCA libera exceção; apenas registra ocorrência e solicita análise.
// ─────────────────────────────────────────────────────────────────────────────

export type NivelAutoridade = "gestor" | "diretoria_rt" | "cliente";

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
  gestor: "Gestor GMP+/Qualidade",
  diretoria_rt: "Diretoria + Resp. Técnico + Qualidade",
  cliente: "Cliente/Embarcador (só escopo comercial)",
};

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

/** Quem pode aprovar uma exceção do nível exigido. Motorista/inspetor/despachante NUNCA. */
export function podeAprovarExcecao(papel: Papel, nivel: NivelAutoridade): boolean {
  if (nivel === "gestor") return papel === "gestor" || papel === "diretoria_rt";
  if (nivel === "diretoria_rt") return papel === "diretoria_rt";
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
    nivelRequerido: "diretoria_rt",
    solicitante: "Mauricio Lima · motorista (registrou ocorrência)",
    solicitadoEm: "2026-05-25T14:40:00",
    status: "pendente",
    evidencias: ["Foto do compartimento", "Solicitação de análise"],
    observacao:
      "Contaminação não é liberável por tráfego nem 'perdoada' pelo cliente. Exige procedimento de liberação: limpeza D, inspeção qualificada e aprovação formal.",
  },
  {
    id: "exc-002",
    viagemId: "v-004",
    codigoViagem: "TX-2026-08474",
    motivoBloqueio: "Certificação GMP+ do implemento vence em 2 dias — pendência sem risco direto.",
    regra: "Pendência sem risco direto",
    nivelRequerido: "gestor",
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
