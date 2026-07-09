// Mock data completo para Traxium SaaS — base do domínio GMP+ FSA e EUDR

export type Tenant = {
  id: string;
  name: string;
  cnpj: string;
  cidade: string;
  uf: string;
  plano: "Essencial" | "Profissional" | "Enterprise";
  certificacaoGMP: boolean;
  certificacaoEUDR: boolean;
  motoristas: number;
  caminhoes: number;
  logo?: string;
  /** Tenant de demonstração criado pelo Console (§6) — semeado, descartável. */
  sandbox?: boolean;
};

export const tenants: Tenant[] = [
  {
    id: "bom-frete",
    name: "Bom Frete Transportes",
    cnpj: "12.345.678/0001-90",
    cidade: "Rondonópolis",
    uf: "MT",
    plano: "Enterprise",
    certificacaoGMP: true,
    certificacaoEUDR: false,
    motoristas: 487,
    caminhoes: 312,
  },
  {
    id: "g10",
    name: "G10 Logística",
    cnpj: "98.765.432/0001-12",
    cidade: "Maringá",
    uf: "PR",
    plano: "Enterprise",
    certificacaoGMP: true,
    certificacaoEUDR: true,
    motoristas: 1240,
    caminhoes: 892,
  },
  {
    id: "agroplan",
    name: "Agroplan Transportes",
    cnpj: "55.443.221/0001-77",
    cidade: "Sorriso",
    uf: "MT",
    plano: "Profissional",
    certificacaoGMP: true,
    certificacaoEUDR: false,
    motoristas: 156,
    caminhoes: 98,
  },
];

// ── Filial (dentro do tenant · PLANO-PERFIS §5) ──────────────────────────────
// O switcher do header troca de FILIAL (controle interno), não de transportadora
// (isso é ação do Console A). Trocar de filial RE-ESCOPA o dado, não só o rótulo.
export type Filial = { id: string; nome: string; cidade: string; uf: string; tenantId: string };

/** Sentinela "Todas as filiais" — visão matriz consolidada (sem escopo). */
export const FILIAL_TODAS = "todas";

export const filiais: Filial[] = [
  { id: "fil-matriz", nome: "Matriz Rondonópolis", cidade: "Rondonópolis", uf: "MT", tenantId: "bom-frete" },
  { id: "fil-sorriso", nome: "Filial Sorriso", cidade: "Sorriso", uf: "MT", tenantId: "bom-frete" },
  { id: "fil-maringa", nome: "Filial Maringá", cidade: "Maringá", uf: "PR", tenantId: "bom-frete" },
];

export const findFilial = (id: string): Filial | undefined => filiais.find((f) => f.id === id);

/** Filial responsável por uma viagem — determinístico, sem editar o mock, por região
 *  da origem: PR → Maringá; origem em Sorriso → Filial Sorriso; demais MT → Matriz. */
export function filialDaViagem(v: { id: string; origem: string }): string {
  if (/\/PR\b/.test(v.origem)) return "fil-maringa";
  if (/Sorriso/i.test(v.origem)) return "fil-sorriso";
  return "fil-matriz";
}

/** True se a entidade pertence à filial ativa (ou se a visão é "Todas"). */
export function pertenceAFilial(filialAtiva: string, filialEntidade: string): boolean {
  return filialAtiva === FILIAL_TODAS || filialAtiva === filialEntidade;
}

export type KPIData = {
  label: string;
  value: string | number;
  delta: number;
  deltaLabel: string;
  hint?: string;
};

export const dashboardKPIs: KPIData[] = [
  {
    label: "Viagens ativas",
    value: 184,
    delta: 12.4,
    deltaLabel: "vs 7 dias",
    hint: "Em trânsito ou aguardando carregamento",
  },
  {
    label: "Conformidade GMP+",
    value: "97.8%",
    delta: 2.1,
    deltaLabel: "vs mês anterior",
    hint: "Checklists aprovados sem ressalva",
  },
  {
    label: "Bloqueios ativos",
    value: 7,
    delta: -36.4,
    deltaLabel: "vs 7 dias",
    hint: "Cargas impedidas por NC crítica",
  },
  {
    label: "Risco EUDR médio",
    value: "Baixo",
    delta: -8.2,
    deltaLabel: "polígonos verificados",
    hint: "Score consolidado de fazendas avaliadas",
  },
];

export type Viagem = {
  id: string;
  codigo: string;
  status: "Agendada" | "Em carregamento" | "Em trânsito" | "Descarregando" | "Concluída" | "Bloqueada";
  motorista: string;
  motoristaCpf: string;
  cavalo: string;
  carreta: string;
  origem: string;
  destino: string;
  produto: string;
  cargasAnteriores: { produto: string; data: string; regime: string }[];
  regimeLimpeza: "A" | "B" | "C" | "D";
  conformidade: number;
  iniciadaEm: string;
  previsaoEntrega: string;
  fazendaOrigem?: string;
  loteEUDR?: string;
  km: number;
  alertas: number;
  /** Justificativa registrada quando a viagem é criada sob ALERTA do motor. */
  justificativa?: string;
};

export const viagens: Viagem[] = [
  {
    id: "v-001",
    codigo: "TX-2026-08471",
    status: "Em trânsito",
    motorista: "Edivaldo Souza",
    motoristaCpf: "***.456.789-**",
    cavalo: "OZE-4A82",
    carreta: "PHC-2B17",
    origem: "Fazenda Boa Esperança · Sorriso/MT",
    destino: "Porto de Santos · SP",
    produto: "Soja em grão",
    cargasAnteriores: [
      { produto: "Farelo de soja", data: "2026-05-20", regime: "A" },
      { produto: "Milho", data: "2026-05-14", regime: "A" },
      { produto: "Fertilizante NPK", data: "2026-05-08", regime: "C" },
    ],
    regimeLimpeza: "C",
    conformidade: 96,
    iniciadaEm: "2026-05-24T08:14:00",
    previsaoEntrega: "2026-05-28T18:00:00",
    fazendaOrigem: "Fazenda Boa Esperança",
    loteEUDR: "LOT-2026-0142",
    km: 1840,
    alertas: 0,
  },
  {
    id: "v-002",
    codigo: "TX-2026-08472",
    status: "Bloqueada",
    motorista: "Mauricio Lima",
    motoristaCpf: "***.123.456-**",
    cavalo: "JKL-9C44",
    carreta: "MNB-7D29",
    origem: "Cooperativa Coamo · Campo Mourão/PR",
    destino: "Terminal Paranaguá · PR",
    produto: "Farelo de soja",
    cargasAnteriores: [
      { produto: "Defensivo agrícola líquido", data: "2026-05-22", regime: "D" },
      { produto: "Soja em grão", data: "2026-05-18", regime: "A" },
      { produto: "Milho", data: "2026-05-12", regime: "A" },
    ],
    regimeLimpeza: "D",
    conformidade: 42,
    iniciadaEm: "2026-05-25T14:22:00",
    previsaoEntrega: "2026-05-27T10:00:00",
    km: 580,
    alertas: 3,
  },
  {
    id: "v-003",
    codigo: "TX-2026-08473",
    status: "Em carregamento",
    motorista: "Carlos Aparecido",
    motoristaCpf: "***.789.012-**",
    cavalo: "RTY-3F19",
    carreta: "GHJ-8K22",
    origem: "Fazenda Três Irmãos · Lucas do Rio Verde/MT",
    destino: "Porto de Itaqui · MA",
    produto: "Soja em grão",
    cargasAnteriores: [
      { produto: "Soja em grão", data: "2026-05-21", regime: "A" },
      { produto: "Milho", data: "2026-05-15", regime: "A" },
      { produto: "Soja em grão", data: "2026-05-09", regime: "A" },
    ],
    regimeLimpeza: "A",
    conformidade: 100,
    iniciadaEm: "2026-05-26T06:30:00",
    previsaoEntrega: "2026-05-30T16:00:00",
    fazendaOrigem: "Fazenda Três Irmãos",
    loteEUDR: "LOT-2026-0143",
    km: 2210,
    alertas: 0,
  },
  {
    id: "v-004",
    codigo: "TX-2026-08474",
    status: "Em trânsito",
    motorista: "José Roberto Santos",
    motoristaCpf: "***.345.678-**",
    cavalo: "WSX-5E73",
    carreta: "QAZ-1B88",
    origem: "Fazenda Santa Marta · Sapezal/MT",
    destino: "Terminal Rondonópolis · MT",
    produto: "Milho",
    cargasAnteriores: [
      { produto: "Milho", data: "2026-05-23", regime: "A" },
      { produto: "Sorgo", data: "2026-05-17", regime: "B" },
      { produto: "Milho", data: "2026-05-10", regime: "A" },
    ],
    regimeLimpeza: "B",
    conformidade: 88,
    iniciadaEm: "2026-05-25T09:00:00",
    previsaoEntrega: "2026-05-26T22:00:00",
    fazendaOrigem: "Fazenda Santa Marta",
    km: 740,
    alertas: 1,
  },
  {
    id: "v-005",
    codigo: "TX-2026-08475",
    status: "Concluída",
    motorista: "Pedro Henrique",
    motoristaCpf: "***.678.901-**",
    cavalo: "EDC-6T31",
    carreta: "BHN-4U16",
    origem: "Cooperativa Cocamar · Maringá/PR",
    destino: "Porto de Paranaguá · PR",
    produto: "Soja em grão",
    cargasAnteriores: [
      { produto: "Soja em grão", data: "2026-05-19", regime: "A" },
      { produto: "Trigo", data: "2026-05-13", regime: "B" },
      { produto: "Soja em grão", data: "2026-05-07", regime: "A" },
    ],
    regimeLimpeza: "B",
    conformidade: 100,
    iniciadaEm: "2026-05-23T07:00:00",
    previsaoEntrega: "2026-05-24T18:00:00",
    fazendaOrigem: "Coop. Cocamar",
    loteEUDR: "LOT-2026-0140",
    km: 480,
    alertas: 0,
  },
  {
    id: "v-006",
    codigo: "TX-2026-08476",
    status: "Agendada",
    motorista: "Antonio Marcos",
    motoristaCpf: "***.234.567-**",
    cavalo: "RFV-2Y58",
    carreta: "UHB-9I02",
    origem: "Fazenda Renascer · Querência/MT",
    destino: "Porto de Santos · SP",
    produto: "Soja em grão",
    cargasAnteriores: [
      { produto: "Soja em grão", data: "2026-05-22", regime: "A" },
      { produto: "Soja em grão", data: "2026-05-16", regime: "A" },
      { produto: "Milho", data: "2026-05-10", regime: "A" },
    ],
    regimeLimpeza: "A",
    conformidade: 100,
    iniciadaEm: "2026-05-27T07:00:00",
    previsaoEntrega: "2026-05-31T20:00:00",
    fazendaOrigem: "Fazenda Renascer",
    loteEUDR: "LOT-2026-0144",
    km: 1980,
    alertas: 0,
  },
];

export type Motorista = {
  id: string;
  nome: string;
  cpf: string;
  tipo: "Próprio" | "Agregado" | "Subcontratado";
  telefone: string;
  cnh: { numero: string; categoria: string; vencimento: string };
  certificacoes: { nome: string; status: "Válida" | "Vencida" | "Pendente"; vencimento: string }[];
  totalViagens: number;
  conformidadeMedia: number;
  ultimaViagem: string;
  cidade: string;
  uf: string;
  status: "Ativo" | "Em viagem" | "Inativo" | "Bloqueado";
  letramentoDigital: "Alto" | "Médio" | "Básico";
};

export const motoristas: Motorista[] = [
  {
    id: "m-001",
    nome: "Edivaldo Souza",
    cpf: "***.456.789-**",
    tipo: "Subcontratado",
    telefone: "(65) 9 8421-7733",
    cnh: { numero: "********", categoria: "E", vencimento: "2027-08-15" },
    certificacoes: [
      { nome: "MOPP", status: "Válida", vencimento: "2026-11-20" },
      { nome: "Treinamento GMP+ Básico", status: "Válida", vencimento: "2027-03-10" },
    ],
    totalViagens: 142,
    conformidadeMedia: 96.4,
    ultimaViagem: "TX-2026-08471",
    cidade: "Sorriso",
    uf: "MT",
    status: "Em viagem",
    letramentoDigital: "Médio",
  },
  {
    id: "m-002",
    nome: "Mauricio Lima",
    cpf: "***.123.456-**",
    tipo: "Subcontratado",
    telefone: "(44) 9 9112-4488",
    cnh: { numero: "********", categoria: "E", vencimento: "2026-09-30" },
    certificacoes: [
      { nome: "MOPP", status: "Vencida", vencimento: "2026-04-12" },
      { nome: "Treinamento GMP+ Básico", status: "Pendente", vencimento: "—" },
    ],
    totalViagens: 87,
    conformidadeMedia: 78.2,
    ultimaViagem: "TX-2026-08472",
    cidade: "Campo Mourão",
    uf: "PR",
    status: "Bloqueado",
    letramentoDigital: "Básico",
  },
  {
    id: "m-003",
    nome: "Carlos Aparecido",
    cpf: "***.789.012-**",
    tipo: "Agregado",
    telefone: "(65) 9 8800-2211",
    cnh: { numero: "********", categoria: "E", vencimento: "2028-02-05" },
    certificacoes: [
      { nome: "MOPP", status: "Válida", vencimento: "2027-01-18" },
      { nome: "Treinamento GMP+ Avançado", status: "Válida", vencimento: "2027-06-22" },
    ],
    totalViagens: 211,
    conformidadeMedia: 99.1,
    ultimaViagem: "TX-2026-08473",
    cidade: "Lucas do Rio Verde",
    uf: "MT",
    status: "Em viagem",
    letramentoDigital: "Alto",
  },
  {
    id: "m-004",
    nome: "José Roberto Santos",
    cpf: "***.345.678-**",
    tipo: "Próprio",
    telefone: "(65) 9 9234-5678",
    cnh: { numero: "********", categoria: "E", vencimento: "2026-12-10" },
    certificacoes: [
      { nome: "MOPP", status: "Válida", vencimento: "2026-10-30" },
      { nome: "Treinamento GMP+ Básico", status: "Válida", vencimento: "2027-04-15" },
    ],
    totalViagens: 304,
    conformidadeMedia: 94.7,
    ultimaViagem: "TX-2026-08474",
    cidade: "Sapezal",
    uf: "MT",
    status: "Em viagem",
    letramentoDigital: "Médio",
  },
  {
    id: "m-005",
    nome: "Pedro Henrique",
    cpf: "***.678.901-**",
    tipo: "Subcontratado",
    telefone: "(44) 9 8501-3344",
    cnh: { numero: "********", categoria: "E", vencimento: "2027-05-22" },
    certificacoes: [
      { nome: "MOPP", status: "Válida", vencimento: "2027-02-08" },
      { nome: "Treinamento GMP+ Básico", status: "Válida", vencimento: "2027-09-12" },
    ],
    totalViagens: 178,
    conformidadeMedia: 97.8,
    ultimaViagem: "TX-2026-08475",
    cidade: "Maringá",
    uf: "PR",
    status: "Ativo",
    letramentoDigital: "Alto",
  },
  {
    id: "m-006",
    nome: "Antonio Marcos",
    cpf: "***.234.567-**",
    tipo: "Subcontratado",
    telefone: "(66) 9 9445-2207",
    cnh: { numero: "********", categoria: "E", vencimento: "2027-11-03" },
    certificacoes: [
      { nome: "MOPP", status: "Válida", vencimento: "2027-07-20" },
      { nome: "Treinamento GMP+ Básico", status: "Válida", vencimento: "2027-02-28" },
    ],
    totalViagens: 92,
    conformidadeMedia: 91.5,
    ultimaViagem: "TX-2026-08476",
    cidade: "Querência",
    uf: "MT",
    status: "Ativo",
    letramentoDigital: "Médio",
  },
];

export type Veiculo = {
  id: string;
  placa: string;
  tipo: "Cavalo" | "Carreta";
  modelo: string;
  ano: number;
  certificacaoGMP: { status: "Válida" | "Vencida" | "Pendente"; vencimento: string };
  tipoCarga?: "Granel sólido" | "Granel líquido" | "Tanque" | "Refrigerado";
  ultimaInspecao: string;
  proximaInspecao: string;
  motorista?: string;
};

export const veiculos: Veiculo[] = [
  { id: "vc-001", placa: "OZE-4A82", tipo: "Cavalo", modelo: "Scania R450", ano: 2021, certificacaoGMP: { status: "Válida", vencimento: "2027-04-15" }, ultimaInspecao: "2026-04-10", proximaInspecao: "2026-07-10", motorista: "Edivaldo Souza" },
  { id: "vc-002", placa: "PHC-2B17", tipo: "Carreta", modelo: "Randon Bitrem", ano: 2020, tipoCarga: "Granel sólido", certificacaoGMP: { status: "Válida", vencimento: "2027-04-15" }, ultimaInspecao: "2026-04-10", proximaInspecao: "2026-07-10" },
  { id: "vc-003", placa: "JKL-9C44", tipo: "Cavalo", modelo: "Volvo FH 540", ano: 2019, certificacaoGMP: { status: "Vencida", vencimento: "2026-03-22" }, ultimaInspecao: "2025-12-20", proximaInspecao: "2026-03-20", motorista: "Mauricio Lima" },
  { id: "vc-004", placa: "MNB-7D29", tipo: "Carreta", modelo: "Librelato Graneleiro", ano: 2018, tipoCarga: "Granel sólido", certificacaoGMP: { status: "Vencida", vencimento: "2026-03-22" }, ultimaInspecao: "2025-12-20", proximaInspecao: "2026-03-20" },
  { id: "vc-005", placa: "RTY-3F19", tipo: "Cavalo", modelo: "Mercedes Actros", ano: 2022, certificacaoGMP: { status: "Válida", vencimento: "2027-09-30" }, ultimaInspecao: "2026-05-01", proximaInspecao: "2026-08-01", motorista: "Carlos Aparecido" },
  { id: "vc-006", placa: "GHJ-8K22", tipo: "Carreta", modelo: "Noma Graneleiro", ano: 2021, tipoCarga: "Granel sólido", certificacaoGMP: { status: "Válida", vencimento: "2027-09-30" }, ultimaInspecao: "2026-05-01", proximaInspecao: "2026-08-01" },
];

export type Fazenda = {
  id: string;
  nome: string;
  produtor: string;
  car: string;
  cidade: string;
  uf: string;
  areaTotalHa: number;
  areaProdutivaHa: number;
  areaPreservacaoHa: number;
  cultura: string[];
  poligono: { lat: number; lng: number }[];
  centroide: { lat: number; lng: number };
  desmatamentoPos2020: boolean;
  scoreRiscoEUDR: "Baixo" | "Médio" | "Alto" | "Crítico";
  ultimaVerificacao: string;
  fonteValidacao: string[];
  status: "Aprovada" | "Em análise" | "Pendente" | "Bloqueada";
};

export const fazendas: Fazenda[] = [
  {
    id: "f-001",
    nome: "Fazenda Boa Esperança",
    produtor: "Agropecuária Boa Esperança Ltda",
    car: "MT-5108402-A1B2C3D4E5F6",
    cidade: "Sorriso",
    uf: "MT",
    areaTotalHa: 4280,
    areaProdutivaHa: 3010,
    areaPreservacaoHa: 1270,
    cultura: ["Soja", "Milho safrinha"],
    poligono: [
      { lat: -12.5447, lng: -55.7211 },
      { lat: -12.5398, lng: -55.7268 },
      { lat: -12.5312, lng: -55.7295 },
      { lat: -12.5234, lng: -55.7242 },
      { lat: -12.5188, lng: -55.7158 },
      { lat: -12.5167, lng: -55.7032 },
      { lat: -12.5189, lng: -55.6922 },
      { lat: -12.5212, lng: -55.6855 },
      { lat: -12.5278, lng: -55.6810 },
      { lat: -12.5358, lng: -55.6798 },
      { lat: -12.5438, lng: -55.6825 },
      { lat: -12.5478, lng: -55.6892 },
      { lat: -12.5502, lng: -55.6968 },
      { lat: -12.5499, lng: -55.7068 },
      { lat: -12.5478, lng: -55.7148 },
    ],
    centroide: { lat: -12.5329, lng: -55.7008 },
    desmatamentoPos2020: false,
    scoreRiscoEUDR: "Baixo",
    ultimaVerificacao: "2026-05-12",
    fonteValidacao: ["INPE TerraBrasilis", "CAR/MT", "MapBiomas Alerta"],
    status: "Aprovada",
  },
  {
    id: "f-002",
    nome: "Fazenda Três Irmãos",
    produtor: "Três Irmãos Agronegócio S.A.",
    car: "MT-5106307-F1E2D3C4B5A6",
    cidade: "Lucas do Rio Verde",
    uf: "MT",
    areaTotalHa: 7820,
    areaProdutivaHa: 5470,
    areaPreservacaoHa: 2350,
    cultura: ["Soja", "Milho", "Algodão"],
    poligono: [
      { lat: -13.0588, lng: -55.9012 },
      { lat: -13.0521, lng: -55.9098 },
      { lat: -13.0432, lng: -55.9145 },
      { lat: -13.0312, lng: -55.9112 },
      { lat: -13.0234, lng: -55.9032 },
      { lat: -13.0188, lng: -55.8932 },
      { lat: -13.0178, lng: -55.8812 },
      { lat: -13.0198, lng: -55.8688 },
      { lat: -13.0245, lng: -55.8588 },
      { lat: -13.0312, lng: -55.8512 },
      { lat: -13.0398, lng: -55.8478 },
      { lat: -13.0498, lng: -55.8492 },
      { lat: -13.0578, lng: -55.8548 },
      { lat: -13.0612, lng: -55.8645 },
      { lat: -13.0618, lng: -55.8762 },
      { lat: -13.0608, lng: -55.8898 },
    ],
    centroide: { lat: -13.0398, lng: -55.8765 },
    desmatamentoPos2020: false,
    scoreRiscoEUDR: "Baixo",
    ultimaVerificacao: "2026-05-18",
    fonteValidacao: ["INPE TerraBrasilis", "CAR/MT", "MapBiomas Alerta"],
    status: "Aprovada",
  },
  {
    id: "f-003",
    nome: "Fazenda Santa Marta",
    produtor: "Santa Marta Agropastoril Ltda",
    car: "MT-5107802-9X8Y7Z6W5V4",
    cidade: "Sapezal",
    uf: "MT",
    areaTotalHa: 12400,
    areaProdutivaHa: 8200,
    areaPreservacaoHa: 4200,
    cultura: ["Soja", "Milho", "Sorgo"],
    poligono: [
      { lat: -12.8901, lng: -58.7521 },
      { lat: -12.8812, lng: -58.7588 },
      { lat: -12.8702, lng: -58.7612 },
      { lat: -12.8588, lng: -58.7578 },
      { lat: -12.8488, lng: -58.7488 },
      { lat: -12.8412, lng: -58.7362 },
      { lat: -12.8388, lng: -58.7212 },
      { lat: -12.8398, lng: -58.7045 },
      { lat: -12.8442, lng: -58.6912 },
      { lat: -12.8512, lng: -58.6822 },
      { lat: -12.8612, lng: -58.6788 },
      { lat: -12.8721, lng: -58.6798 },
      { lat: -12.8832, lng: -58.6855 },
      { lat: -12.8912, lng: -58.6942 },
      { lat: -12.8945, lng: -58.7068 },
      { lat: -12.8932, lng: -58.7245 },
      { lat: -12.8912, lng: -58.7388 },
    ],
    centroide: { lat: -12.8688, lng: -58.7252 },
    desmatamentoPos2020: true,
    scoreRiscoEUDR: "Alto",
    ultimaVerificacao: "2026-05-20",
    fonteValidacao: ["INPE TerraBrasilis", "CAR/MT", "MapBiomas Alerta"],
    status: "Em análise",
  },
  {
    id: "f-004",
    nome: "Fazenda Renascer",
    produtor: "Renascer Sementes e Grãos",
    car: "MT-5103205-K1L2M3N4O5P6",
    cidade: "Querência",
    uf: "MT",
    areaTotalHa: 6150,
    areaProdutivaHa: 4400,
    areaPreservacaoHa: 1750,
    cultura: ["Soja"],
    poligono: [
      { lat: -12.6101, lng: -52.1812 },
      { lat: -12.6058, lng: -52.1898 },
      { lat: -12.5988, lng: -52.1932 },
      { lat: -12.5898, lng: -52.1912 },
      { lat: -12.5821, lng: -52.1845 },
      { lat: -12.5788, lng: -52.1742 },
      { lat: -12.5778, lng: -52.1612 },
      { lat: -12.5798, lng: -52.1488 },
      { lat: -12.5842, lng: -52.1398 },
      { lat: -12.5912, lng: -52.1345 },
      { lat: -12.6012, lng: -52.1342 },
      { lat: -12.6088, lng: -52.1388 },
      { lat: -12.6121, lng: -52.1488 },
      { lat: -12.6132, lng: -52.1612 },
      { lat: -12.6121, lng: -52.1718 },
    ],
    centroide: { lat: -12.5955, lng: -52.1610 },
    desmatamentoPos2020: false,
    scoreRiscoEUDR: "Médio",
    ultimaVerificacao: "2026-05-22",
    fonteValidacao: ["INPE TerraBrasilis", "CAR/MT"],
    status: "Aprovada",
  },
];

export type Lote = {
  id: string;
  codigo: string;
  produto: string;
  hsCode: string;
  toneladas: number;
  fazendas: { id: string; nome: string; toneladas: number }[];
  destinatarioFinal: string;
  paisDestino: string;
  statusDDS: "Rascunho" | "Pronto para envio" | "Enviado TRACES" | "Aprovado" | "Rejeitado";
  numeroDDS?: string;
  dataEnvio?: string;
  dataAprovacao?: string;
  observacoesTRACES?: string;
};

export const lotes: Lote[] = [
  {
    id: "l-001",
    codigo: "LOT-2026-0140",
    produto: "Soja em grão",
    hsCode: "1201.90",
    toneladas: 2400,
    fazendas: [
      { id: "f-004", nome: "Fazenda Renascer", toneladas: 1400 },
      { id: "f-001", nome: "Fazenda Boa Esperança", toneladas: 1000 },
    ],
    destinatarioFinal: "Cargill BV — Rotterdam",
    paisDestino: "Holanda",
    statusDDS: "Aprovado",
    numeroDDS: "DDS-NL-2026-A4F71B92",
    dataEnvio: "2026-05-18T10:22:00",
    dataAprovacao: "2026-05-21T14:18:00",
  },
  {
    id: "l-002",
    codigo: "LOT-2026-0142",
    produto: "Soja em grão",
    hsCode: "1201.90",
    toneladas: 3200,
    fazendas: [
      { id: "f-001", nome: "Fazenda Boa Esperança", toneladas: 1800 },
      { id: "f-002", nome: "Fazenda Três Irmãos", toneladas: 1400 },
    ],
    destinatarioFinal: "ADM Hamburg GmbH",
    paisDestino: "Alemanha",
    statusDDS: "Enviado TRACES",
    numeroDDS: "DDS-DE-2026-B7C82E14",
    dataEnvio: "2026-05-25T16:40:00",
  },
  {
    id: "l-003",
    codigo: "LOT-2026-0143",
    produto: "Soja em grão",
    hsCode: "1201.90",
    toneladas: 2800,
    fazendas: [
      { id: "f-002", nome: "Fazenda Três Irmãos", toneladas: 2800 },
    ],
    destinatarioFinal: "Bunge Europe B.V.",
    paisDestino: "Bélgica",
    statusDDS: "Pronto para envio",
  },
  {
    id: "l-004",
    codigo: "LOT-2026-0144",
    produto: "Soja em grão",
    hsCode: "1201.90",
    toneladas: 1900,
    fazendas: [{ id: "f-004", nome: "Fazenda Renascer", toneladas: 1900 }],
    destinatarioFinal: "COFCO International — Geneva",
    paisDestino: "Suíça",
    statusDDS: "Rascunho",
  },
];

export type Checklist = {
  id: string;
  titulo: string;
  tipo: "LCI Pré-carregamento" | "LCI Pós-descarregamento" | "Inspeção de Carreta" | "Higienização Compartimento";
  regime?: "A" | "B" | "C" | "D";
  itens: number;
  obrigatorio: boolean;
  ultimaRevisao: string;
  fonteNormativa: string;
};

export const checklistsTemplates: Checklist[] = [
  { id: "ck-001", titulo: "LCI — Pré-carregamento Soja", tipo: "LCI Pré-carregamento", regime: "A", itens: 14, obrigatorio: true, ultimaRevisao: "2026-04-12", fonteNormativa: "GMP+ B4 / IDTF" },
  { id: "ck-002", titulo: "LCI — Pré-carregamento Farelo Animal", tipo: "LCI Pré-carregamento", regime: "B", itens: 18, obrigatorio: true, ultimaRevisao: "2026-04-12", fonteNormativa: "GMP+ B4 / IDTF" },
  { id: "ck-003", titulo: "LCI — Pós-descarregamento", tipo: "LCI Pós-descarregamento", itens: 9, obrigatorio: true, ultimaRevisao: "2026-04-12", fonteNormativa: "GMP+ B4" },
  { id: "ck-004", titulo: "Higienização Regime C — Detergente", tipo: "Higienização Compartimento", regime: "C", itens: 22, obrigatorio: true, ultimaRevisao: "2026-04-12", fonteNormativa: "GMP+ B4 / IDTF" },
  { id: "ck-005", titulo: "Higienização Regime D — Desinfecção", tipo: "Higienização Compartimento", regime: "D", itens: 31, obrigatorio: true, ultimaRevisao: "2026-04-12", fonteNormativa: "GMP+ B4 / IDTF" },
  { id: "ck-006", titulo: "Inspeção de Carreta — Estrutural", tipo: "Inspeção de Carreta", itens: 24, obrigatorio: true, ultimaRevisao: "2026-03-28", fonteNormativa: "GMP+ B4" },
];

export type NaoConformidade = {
  id: string;
  codigo: string;
  severidade: "Crítica" | "Maior" | "Menor";
  categoria: "Limpeza inadequada" | "Documentação ausente" | "Certificação vencida" | "Foto não auditável" | "Geolocalização inválida" | "Carga incompatível" | "Carreta não certificada";
  viagem?: string;
  motorista?: string;
  veiculo?: string;
  descricao: string;
  abertaEm: string;
  status: "Aberta" | "Em tratamento" | "Resolvida" | "Justificada";
  responsavel?: string;
  // CAPA — correção imediata NÃO basta; auditor cobra causa raiz + ação corretiva + eficácia
  capa?: {
    acaoImediata: string;
    causaRaiz: string;
    acaoCorretiva: string;
    responsavelAcao: string;
    prazo: string;
    eficaciaVerificada: boolean;
  };
};

export const naoConformidades: NaoConformidade[] = [
  {
    id: "nc-001",
    codigo: "NC-2026-1042",
    severidade: "Crítica",
    categoria: "Carga incompatível",
    viagem: "TX-2026-08472",
    motorista: "Mauricio Lima",
    veiculo: "JKL-9C44 / MNB-7D29",
    descricao: "Última carga registrada (defensivo agrícola líquido) exige regime D antes de transportar farelo de soja para ração animal. Limpeza não evidenciada.",
    abertaEm: "2026-05-25T14:35:00",
    status: "Aberta",
    responsavel: "Gerência de Compliance",
    capa: {
      acaoImediata: "Carregamento bloqueado pelo motor de regras; carreta retida para limpeza.",
      causaRaiz: "Histórico T-3 do compartimento não consultado antes do despacho e limpeza Regime D não executada após defensivo.",
      acaoCorretiva: "Consulta T-3 obrigatória no despacho, treinamento do tráfego e exigência de evidência de limpeza D.",
      responsavelAcao: "Gerência de Compliance",
      prazo: "2026-07-15",
      eficaciaVerificada: false,
    },
  },
  {
    id: "nc-002",
    codigo: "NC-2026-1041",
    severidade: "Maior",
    categoria: "Certificação vencida",
    motorista: "Mauricio Lima",
    descricao: "MOPP do motorista vencido em 12/04/2026. Renovação pendente.",
    abertaEm: "2026-05-25T14:35:00",
    status: "Em tratamento",
    responsavel: "RH",
    capa: {
      acaoImediata: "Motorista bloqueado para novas viagens sob cadeia GMP+.",
      causaRaiz: "Ausência de alerta automático de vencimento de certificação do motorista.",
      acaoCorretiva: "Ativar alerta 60/30/15 dias e renovar o MOPP.",
      responsavelAcao: "RH",
      prazo: "2026-07-20",
      eficaciaVerificada: false,
    },
  },
  {
    id: "nc-003",
    codigo: "NC-2026-1040",
    severidade: "Maior",
    categoria: "Certificação vencida",
    veiculo: "JKL-9C44",
    descricao: "Certificação GMP+ da carreta vencida em 22/03/2026. Recertificação não agendada.",
    abertaEm: "2026-05-25T14:35:00",
    status: "Em tratamento",
    responsavel: "Frota",
    capa: {
      acaoImediata: "Carreta impedida de operar sob cadeia GMP+ certificada.",
      causaRaiz: "Recertificação não agendada; controle de validade mantido em planilha manual.",
      acaoCorretiva: "Migrar controle de certificados para o sistema com bloqueio automático no vencimento.",
      responsavelAcao: "Frota",
      prazo: "2026-07-10",
      eficaciaVerificada: false,
    },
  },
  {
    id: "nc-004",
    codigo: "NC-2026-1038",
    severidade: "Menor",
    categoria: "Foto não auditável",
    viagem: "TX-2026-08474",
    motorista: "José Roberto Santos",
    descricao: "Foto de pós-limpeza sem metadados de GPS. Necessária recaptura.",
    abertaEm: "2026-05-25T11:18:00",
    status: "Resolvida",
    responsavel: "José Roberto Santos",
    capa: {
      acaoImediata: "Recaptura da foto com GPS solicitada ao motorista.",
      causaRaiz: "GPS do aparelho desativado no momento da captura.",
      acaoCorretiva: "App passa a bloquear a captura de foto crítica sem GPS ativo.",
      responsavelAcao: "José Roberto Santos",
      prazo: "2026-05-26",
      eficaciaVerificada: true,
    },
  },
];

export type AuditoriaEvento = {
  id: string;
  data: string;
  tipo: "GMP+ Anual" | "GMP+ Surpresa" | "Cliente comprador" | "Interna" | "EUDR";
  auditor: string;
  organismo: string;
  status: "Programada" | "Em execução" | "Concluída — Aprovada" | "Concluída — Com ressalvas" | "Concluída — Reprovada";
  ncEncontradas: number;
  documento?: string;
};

export const auditorias: AuditoriaEvento[] = [
  {
    id: "a-001",
    data: "2026-07-31",
    tipo: "GMP+ Anual",
    auditor: "Helena Marques",
    organismo: "Único Organismo Certificador BR",
    status: "Programada",
    ncEncontradas: 0,
  },
  {
    id: "a-002",
    data: "2026-04-22",
    tipo: "GMP+ Surpresa",
    auditor: "Carlos Mendonça",
    organismo: "Único Organismo Certificador BR",
    status: "Concluída — Com ressalvas",
    ncEncontradas: 3,
    documento: "Relatório-Auditoria-GMP-2026-04-22.pdf",
  },
  {
    id: "a-003",
    data: "2026-03-08",
    tipo: "Cliente comprador",
    auditor: "Equipe Cargill Compliance",
    organismo: "Cargill BV",
    status: "Concluída — Aprovada",
    ncEncontradas: 0,
    documento: "Relatório-Cargill-2026-03-08.pdf",
  },
];

export type Atividade = {
  id: string;
  tipo: "viagem" | "checklist" | "nc" | "dds" | "auditoria" | "fazenda";
  titulo: string;
  descricao: string;
  ator: string;
  quando: string;
  severidade?: "info" | "success" | "warning" | "danger";
};

export const atividades: Atividade[] = [
  { id: "at-1", tipo: "nc", titulo: "Carga bloqueada — TX-2026-08472", descricao: "Sequenciamento T-3 detectou incompatibilidade. Regime D não evidenciado.", ator: "Motor de regras", quando: "2026-05-25T14:35:00", severidade: "danger" },
  { id: "at-2", tipo: "dds", titulo: "DDS enviado ao TRACES NT", descricao: "Lote LOT-2026-0142 — Destinatário ADM Hamburg GmbH (DE)", ator: "Sistema TRACES Gateway", quando: "2026-05-25T16:40:00", severidade: "info" },
  { id: "at-3", tipo: "checklist", titulo: "LCI pré-carregamento concluído", descricao: "TX-2026-08473 · Carlos Aparecido · Regime A · Conformidade 100%", ator: "Carlos Aparecido", quando: "2026-05-26T07:12:00", severidade: "success" },
  { id: "at-4", tipo: "fazenda", titulo: "Fazenda Santa Marta · alerta de risco", descricao: "Validação cruzada INPE detectou supressão pós-2020 em parcela de 18ha.", ator: "Validador EUDR", quando: "2026-05-20T09:48:00", severidade: "warning" },
  { id: "at-5", tipo: "viagem", titulo: "Viagem concluída — TX-2026-08475", descricao: "Pedro Henrique · Maringá/PR → Paranaguá/PR · 480km · 100% conformidade", ator: "Sistema", quando: "2026-05-24T18:22:00", severidade: "success" },
  { id: "at-6", tipo: "auditoria", titulo: "Auditoria GMP+ agendada", descricao: "Auditoria anual marcada para 18/06/2026 · Helena Marques", ator: "Único Organismo Certificador BR", quando: "2026-05-23T11:00:00", severidade: "info" },
];

export type IDTFRule = {
  produto: string;
  hsCode?: string;
  regimePadrao: "A" | "B" | "C" | "D";
  observacoes: string;
  combinacoesProibidas: string[];
};

export const idtfRules: IDTFRule[] = [
  { produto: "Soja em grão", hsCode: "1201.90", regimePadrao: "A", observacoes: "Carga seca para ração ou esmagamento. Sem restrições maiores.", combinacoesProibidas: ["Defensivo agrícola", "Fertilizante NPK sem regime C prévio"] },
  { produto: "Farelo de soja", hsCode: "2304.00", regimePadrao: "A", observacoes: "Produto sensível para alimentação animal. Atenção a contaminação cruzada.", combinacoesProibidas: ["Defensivo agrícola", "Combustível", "Produtos químicos"] },
  { produto: "Milho", hsCode: "1005.90", regimePadrao: "A", observacoes: "Compatível com ração. Sem maiores restrições.", combinacoesProibidas: ["Defensivo agrícola líquido"] },
  { produto: "Fertilizante NPK", regimePadrao: "C", observacoes: "Após fertilizante exige regime C antes de carga para ração.", combinacoesProibidas: ["Farelo de soja sem regime C"] },
  { produto: "Defensivo agrícola líquido", regimePadrao: "D", observacoes: "Carga química. Regime D obrigatório antes de qualquer carga GMP+.", combinacoesProibidas: ["Qualquer ração", "Soja em grão sem regime D"] },
  { produto: "Algodão em pluma", hsCode: "5201.00", regimePadrao: "B", observacoes: "Cuidado com fibras residuais.", combinacoesProibidas: [] },
  { produto: "Trigo", hsCode: "1001.99", regimePadrao: "B", observacoes: "Cuidado com micotoxinas residuais.", combinacoesProibidas: [] },
];

export type ConformidadeChart = {
  data: string;
  gmpPlus: number;
  eudr: number;
};

export const conformidadeChart: ConformidadeChart[] = [
  { data: "Jan", gmpPlus: 88, eudr: 62 },
  { data: "Fev", gmpPlus: 90, eudr: 68 },
  { data: "Mar", gmpPlus: 91, eudr: 71 },
  { data: "Abr", gmpPlus: 94, eudr: 76 },
  { data: "Mai", gmpPlus: 96, eudr: 82 },
  { data: "Jun", gmpPlus: 97.8, eudr: 88 },
];

export const viagensPorStatusChart = [
  { status: "Em trânsito", quantidade: 84, fill: "hsl(174 72% 35%)" },
  { status: "Em carregamento", quantidade: 42, fill: "hsl(200 90% 36%)" },
  { status: "Descarregando", quantidade: 28, fill: "hsl(200 60% 55%)" },
  { status: "Agendada", quantidade: 30, fill: "hsl(174 50% 60%)" },
  { status: "Bloqueada", quantidade: 7, fill: "hsl(0 72% 51%)" },
];

export const regimesDistribuicao = [
  { regime: "Regime A · Seco", quantidade: 142, percentual: 58 },
  { regime: "Regime B · Água", quantidade: 67, percentual: 27 },
  { regime: "Regime C · Detergente", quantidade: 28, percentual: 11 },
  { regime: "Regime D · Desinfecção", quantidade: 9, percentual: 4 },
];

export type Documento = {
  id: string;
  nome: string;
  tipo: "Certificado" | "Relatório" | "Política" | "Procedimento" | "DDS" | "Auditoria" | "Treinamento";
  tamanho: string;
  atualizadoEm: string;
  autor: string;
  vigente: boolean;
  /** Data-limite do documento (vencimento do cert, revisão da política, janela da DDS). Ausente = não expira. */
  validade?: string;
};

export const documentos: Documento[] = [
  { id: "doc-1", nome: "Certificado GMP+ FSA — Bom Frete 2026", tipo: "Certificado", tamanho: "1.2 MB", atualizadoEm: "2026-01-15", autor: "Único Organismo Certificador BR", vigente: true, validade: "2027-01-15" },
  { id: "doc-2", nome: "Política de Sequenciamento de Cargas", tipo: "Política", tamanho: "320 KB", atualizadoEm: "2026-03-10", autor: "Rafael · RD Insight", vigente: true, validade: "2026-06-15" },
  { id: "doc-3", nome: "Procedimento de Higienização — Regime C", tipo: "Procedimento", tamanho: "880 KB", atualizadoEm: "2026-02-22", autor: "Rafael · RD Insight", vigente: true, validade: "2026-07-30" },
  { id: "doc-4", nome: "DDS LOT-2026-0140 — Cargill Rotterdam", tipo: "DDS", tamanho: "240 KB", atualizadoEm: "2026-05-21", autor: "Sistema TRACES Gateway", vigente: true, validade: "2026-06-05" },
  { id: "doc-5", nome: "Relatório de Auditoria Surpresa 2026-04-22", tipo: "Auditoria", tamanho: "2.1 MB", atualizadoEm: "2026-04-25", autor: "Único Organismo Certificador BR", vigente: true },
  { id: "doc-6", nome: "Material de Treinamento GMP+ — Motoristas", tipo: "Treinamento", tamanho: "5.6 MB", atualizadoEm: "2026-03-05", autor: "Rafael · RD Insight", vigente: true, validade: "2026-06-30" },
];

export type TraceLog = {
  ts: string;
  direcao: "out" | "in";
  evento: string;
  payload: string;
  status: "Accepted" | "Pending Review" | "Approved" | "Rejected";
  /** Latência do round-trip SOAP medida no gateway (ms). */
  latenciaMs: number;
};

export const traceNTLogs: TraceLog[] = [
  { ts: "2026-05-18T10:22:48", direcao: "out", evento: "SubmitDDS · LOT-2026-0140", payload: "DDS-NL-2026-A4F71B92", status: "Accepted", latenciaMs: 284 },
  { ts: "2026-05-19T09:04:31", direcao: "out", evento: "SubmitDDS · LOT-2026-0141", payload: "DDS-BE-2026-C9D04F55", status: "Rejected", latenciaMs: 1240 },
  { ts: "2026-05-19T09:04:33", direcao: "in", evento: "Rejection · schema", payload: "GeolocationPolygon inválido (v1.0)", status: "Rejected", latenciaMs: 98 },
  { ts: "2026-05-19T11:47:20", direcao: "out", evento: "SubmitDDS · LOT-2026-0141 (retry)", payload: "DDS-BE-2026-C9D04F55", status: "Accepted", latenciaMs: 318 },
  { ts: "2026-05-20T08:15:09", direcao: "in", evento: "DDS Validated", payload: "DDS-BE-2026-C9D04F55", status: "Approved", latenciaMs: 112 },
  { ts: "2026-05-21T14:18:02", direcao: "in", evento: "DDS Validated", payload: "DDS-NL-2026-A4F71B92", status: "Approved", latenciaMs: 104 },
  { ts: "2026-05-23T07:52:44", direcao: "out", evento: "StatusQuery · lote em análise", payload: "Reference: TRX-NT-99735", status: "Accepted", latenciaMs: 206 },
  { ts: "2026-05-25T16:40:12", direcao: "out", evento: "SubmitDDS · LOT-2026-0142", payload: "DDS-DE-2026-B7C82E14", status: "Accepted", latenciaMs: 342 },
  { ts: "2026-05-25T16:40:18", direcao: "in", evento: "ACK · TRACES NT", payload: "Reference: TRX-NT-99812", status: "Pending Review", latenciaMs: 91 },
];

export type Notificacao = {
  id: string;
  titulo: string;
  descricao: string;
  tempo: string;
  tipo: "danger" | "warning" | "info" | "success";
  lida: boolean;
};

export const notificacoes: Notificacao[] = [
  { id: "n-1", titulo: "Bloqueio crítico", descricao: "TX-2026-08472 — carga incompatível com histórico T-3", tempo: "12 min", tipo: "danger", lida: false },
  { id: "n-2", titulo: "Auditoria GMP+ em 23 dias", descricao: "Programada para 18/06/2026 · Helena Marques", tempo: "2h", tipo: "warning", lida: false },
  { id: "n-3", titulo: "DDS aprovado", descricao: "LOT-2026-0140 aceito pelo TRACES NT", tempo: "3 dias", tipo: "success", lida: true },
  { id: "n-4", titulo: "Fazenda Santa Marta requer revisão", descricao: "INPE detectou supressão pós-2020 em 18ha", tempo: "6 dias", tipo: "warning", lida: true },
];
