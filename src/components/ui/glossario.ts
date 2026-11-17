/*
 * Glossário único do Traxium. O componente Termo (termo.tsx) e o SeloRegime leem daqui; nenhuma
 * tela escreve a explicação de um termo por conta própria. Texto curto: uma ou duas frases, sem
 * travessão. Fontes: regimes em src/lib/tx/tx-dados.js (REGIMES, alcadas), evidências de auditoria
 * em docs/revisao-telas/evidencia-auditoria-real.md e o Top 9 de docs/revisao-telas/12-revisao-ux.md.
 *
 * `termo` é o rótulo padrão que o Termo mostra quando não recebe children.
 */
export type Verbete = { termo: string; texto: string };

export const GLOSSARIO = {
  'T-3': {
    termo: 'T-3',
    texto: 'As três últimas cargas do compartimento, da mais recente (T-1) para a mais antiga (T-3). A GMP+ exige conhecê-las antes de carregar ração.',
  },
  'T-1': {
    termo: 'T-1',
    texto: 'A carga mais recente do compartimento. É ela que define a limpeza exigida antes da próxima carga de ração.',
  },
  IDTF: {
    termo: 'IDTF',
    texto: 'Base internacional da GMP+ que classifica cada produto transportado e diz a limpeza exigida depois dele, antes de carregar ração.',
  },
  regime: {
    termo: 'regime',
    texto: 'Limpeza exigida no compartimento depois de uma carga, antes de carregar ração. Vai de A (seco) a D (desinfecção); X é carga proibida.',
  },
  'regime-A': { termo: 'Regime A', texto: 'Limpeza seca: varrição e limpeza a seco do compartimento.' },
  'regime-B': { termo: 'Regime B', texto: 'Lavagem com água.' },
  'regime-C': { termo: 'Regime C', texto: 'Lavagem com água e detergente.' },
  'regime-D': { termo: 'Regime D', texto: 'Lavagem e desinfecção.' },
  'regime-X': {
    termo: 'Carga proibida',
    texto: 'Regime X: carga anterior proibida pela IDTF. Nenhuma limpeza resolve; o compartimento não carrega ração.',
  },
  'regime-?': {
    termo: 'Regime não definido',
    texto: 'Carga anterior que não está na base IDTF. Sem classificação não se sabe a limpeza exigida: bloqueio técnico até a Traxium classificar.',
  },
  'GMP+ FSA': {
    termo: 'GMP+ FSA',
    texto: 'Feed Safety Assurance: o esquema de certificação GMP+ para segurança de ração. Viagem assegurada segue as regras dele.',
  },
  TAC: { termo: 'TAC', texto: 'Transportador autônomo de cargas: pessoa física com RNTRC, dona do próprio caminhão.' },
  ETC: { termo: 'ETC', texto: 'Empresa de transporte rodoviário de cargas: transportadora com CNPJ e RNTRC.' },
  RNTRC: { termo: 'RNTRC', texto: 'Registro Nacional de Transportadores Rodoviários de Cargas, da ANTT. Obrigatório para TAC e ETC.' },
  'CT-e': {
    termo: 'CT-e',
    texto: 'Conhecimento de transporte eletrônico: o documento fiscal do frete. Na viagem assegurada, o DACTE leva a frase "O serviço fornecido é assegurado GMP+FSA".',
  },
  OC: {
    termo: 'OC',
    texto: 'Ordem de carregamento: o número que identifica a viagem no embarque. No Traxium, OC nunca é organismo certificador.',
  },
  certificadora: {
    termo: 'certificadora',
    texto: 'Organismo certificador: a empresa que audita e emite o certificado GMP+. Precisa ser comunicada antes de a empresa usar o gatekeeper (TS1.2).',
  },
  alcada: {
    termo: 'alçada',
    texto: 'Quem pode liberar uma viagem bloqueada: Gestor da qualidade (pendência corrigível) ou Direção e RT (risco residual aceito). Bloqueio técnico não tem alçada.',
  },
  conjunto: { termo: 'conjunto', texto: 'O cavalo (caminhão trator) com a carreta ou as carretas que ele puxa, identificado pelas placas.' },
  compartimento: {
    termo: 'compartimento',
    texto: 'Cada espaço de carga de uma carreta (C1, C2). As três últimas cargas e a limpeza são controladas por compartimento.',
  },
  gatekeeper: {
    termo: 'gatekeeper',
    texto: 'Protocolo da GMP+ (TS1.2) para usar transportador sem certificado GMP+, como o TAC: a empresa certificada qualifica o transportador viagem a viagem.',
  },
  escopo: {
    termo: 'escopo GMP+',
    texto: 'Conjuntos da frota própria declarados na certificação. Só eles fazem viagem assegurada sem gatekeeper.',
  },
  'bloqueio-tecnico': {
    termo: 'Bloqueio técnico',
    texto: 'Bloqueio que nenhuma alçada libera: só resolve trocando o conjunto ou regularizando conforme a TS1.9.',
  },
  'liberada-autoridade': {
    termo: 'Liberada por autoridade',
    texto: 'Viagem com pendência liberada por quem tem alçada, com motivo, risco residual e assinatura registrados.',
  },
} as const satisfies Record<string, Verbete>;

export type ChaveGlossario = keyof typeof GLOSSARIO;

/** Regimes de limpeza na ordem de exigência. X = proibida; ? = carga não classificada na IDTF. */
export type Regime = 'A' | 'B' | 'C' | 'D' | 'X' | '?';
export const PALAVRA_REGIME: Record<Regime, string> = { A: 'seco', B: 'água', C: 'água e detergente', D: 'desinfecção', X: 'proibida', '?': 'não definido' };
