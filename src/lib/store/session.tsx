"use client";

// Store de sessão do protótipo (sem backend).
// Estratégia: muta os arrays de domínio EXPORTADOS in-place (mesma referência que o
// motor de regras importa) e incrementa `version` para forçar re-render das telas.
// O motor (getT3, avaliarCarregamento, statusCompartimento) continua lendo os mesmos
// arrays — então tudo que é criado aqui é imediatamente validado pelas regras.
// Recarregar a página reseta (módulos são re-avaliados). É o comportamento esperado num protótipo.

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { avaliarCarregamento } from "@/lib/domain/rules-engine";
import {
  convitesAcesso,
  concluirConviteAcesso,
  criarConviteAcesso,
  enviarConviteAcesso,
  revogarConviteAcesso,
  type ConviteAcesso,
  type TipoAcessoExterno,
} from "@/lib/domain/access";
import {
  convitesOnboarding,
  criarEntradaCadastro,
  iniciarQualificacaoCadastro,
  transicionarConvite,
  type CanalConvite,
  type ConviteOnboarding,
  type EventoConvite,
} from "@/lib/domain/onboarding";
import {
  viagens,
  naoConformidades,
  lotes,
  fazendas,
  motoristas,
  auditorias,
  tenants,
  FILIAL_TODAS,
  type Viagem,
  type NaoConformidade,
  type Lote,
  type Fazenda,
  type Motorista,
  type AuditoriaEvento,
  type Tenant,
} from "@/lib/mock-data";
import { conclusoes, findTrilha, estadoTrilha, atribuirTrilha } from "@/lib/domain/academy";
import { anexarRegistro, podeConcluir } from "@/lib/domain/registro";
import { setClasseRegra, type RegraId, type ClasseRegra } from "@/lib/domain/motor-config";
import {
  registrarLiberacao,
  situacaoDaViagem,
  motivosDaRegra,
  type ImpactoId,
  type ValidadeId,
} from "@/lib/domain/liberacao";
import {
  cavalos,
  implementos,
  compartimentos,
  subcontratados,
  produtosIDTF,
  historicoBase,
  cleaningEvents,
  inspectionEvents,
  loadHistory,
  excecoes,
  retificacoes,
  compartimentoPorViagem,
  produtoAtualPorViagem,
  vinculos,
  vinculoVigente,
  vinculoVigenteDaEntidade,
  motoristasDoSubcontratado,
  notificacoes,
  diasEntre,
  findImplemento,
  VERSAO_BASE_IDTF,
  HOJE,
  PAPEL_LABEL,
  podeAprovarExcecao,
  vinculoEhPessoa,
  deriveSurface,
  PERFIL_POR_ID,
  type Cavalo,
  type Implemento,
  type Compartimento,
  type Subcontratado,
  type TipoVinculo,
  type AcordoQA,
  type CleaningEvent,
  type InspectionEvent,
  type Regime,
  type ProdutoIDTF,
  type Papel,
  type Excecao,
  type TipoEntidadeVinculo,
  type TipoNotificacao,
  type AccountType,
  type Surface,
  type PerfilDemoId,
} from "@/lib/domain/model";

let seq = 5000;
const nextId = (p: string) => `${p}-${++seq}`;

// ── Eixo de ESCOPO (produto) — decide QUANTA superfície aparece ───────────────
// Ortogonal ao accountType/papel: aqueles decidem QUAL superfície e o que o papel
// vê; este decide se o produto é o MVP (5 pilares) ou a Solução completa.
export type ProdutoModo = "mvp" | "completa";
const PRODUTO_KEY = "traxium.produto";

// ── Tipos de entrada dos formulários (parciais → o store completa) ────────────

export type NovaViagemInput = {
  cliente: string;
  produtoId: string;
  produtoNome: string;
  origem: string;
  destino: string;
  cavaloPlaca: string;
  implementoPlaca: string;
  compartimentoId: string;
  motorista: string;
  km: number;
  previsao: string;
  status: Viagem["status"];
  justificativa?: string;
};

export type NovoImplementoInput = {
  placa: string;
  tipo: Implemento["tipo"];
  nCompartimentos: number;
  proprietario: Implemento["proprietario"];
  subcontratadoId?: string;
  certValidade: string;
  escopo: string;
};

export type NovoLoteInput = {
  produto: string;
  hsCode: string;
  origens: { id: string; nome: string; toneladas: number }[];
  destinatarioFinal: string;
  paisDestino: string;
};

export type NovaFazendaInput = {
  nome: string;
  produtor: string;
  car: string;
  cidade: string;
  uf: string;
  cultura: string[];
};

export type NovoMotoristaInput = {
  nome: string;
  cpf: string;
  tipo: Motorista["tipo"];
  telefone: string;
  cidade: string;
  uf: string;
  letramentoDigital: Motorista["letramentoDigital"];
  cnh: Motorista["cnh"];
  certificacoes: Motorista["certificacoes"];
};

export type NovaAuditoriaInput = {
  tipo: AuditoriaEvento["tipo"];
  data: string;
  auditor: string;
  organismo: string;
};

export type NovaExcecaoInput = Omit<Excecao, "id" | "status" | "aprovador" | "decididoEm">;

/** O que o operador escolhe na liberação manual. Os demais campos dos nove são
 *  derivados pelo store: responsável, data/hora e as situações anterior/posterior. */
export type LiberacaoFormInput = {
  motivoPadronizado: string;
  justificativa: string;
  evidencias: string[];
  impacto: ImpactoId;
  validade: ValidadeId;
};

/**
 * Uma linha da planilha colada, já parseada. `duplicada` é decidido ANTES de
 * gravar: importação que cria o mesmo CNPJ duas vezes é como o cadastro
 * apodrece, e o PDF pede detecção de duplicidade, não deduplicação depois.
 */
export type LinhaImportacao = {
  linha: number;
  razaoSocial: string;
  cnpj: string;
  tipoVinculo?: TipoVinculo;
  responsavel?: string;
  telefone?: string;
  implementoPlaca?: string;
  /** Motivo do descarte, quando houver. */
  problema?: string;
  duplicada?: boolean;
};

export type RevisaoSubcontratadoInput = {
  cnpj: string;
  razaoSocial: string;
  tipoVinculo?: TipoVinculo;
  certificado: {
    numero: string;
    certificadora: string;
    escopo: Subcontratado["certGMP"]["escopo"];
    validade: string;
    sitesCobertos: string[];
    statusBasePublica: Subcontratado["certGMP"]["statusBasePublica"];
  };
};

export type TrocaVeiculoInput = {
  cavaloPlaca?: string;
  implementoId?: string;
  compartimentoId?: string;
  motivo: string;
};

export type Impersonation = { tenantId: string; tenantName: string } | null;

type SessionCtx = {
  version: number;
  /** Modo de produto (eixo de escopo): 'mvp' = 5 pilares · 'completa' = tudo. */
  produto: ProdutoModo;
  setProduto: (m: ProdutoModo) => void;
  /** Papel do usuário atual (RBAC-lite do protótipo — eixo 2). */
  papel: Papel;
  setPapel: (p: Papel) => void;
  // ── Eixo 1 (accountType) — entra POR CIMA do papel. Decide a superfície. ──
  /** Tipo de conta (eixo 1). Decide em qual superfície o usuário entra. */
  accountType: AccountType;
  setAccountType: (t: AccountType) => void;
  /** Superfície ativa, derivada de (accountType, papel) — ou B durante impersonation. */
  surface: Surface;
  /** Modo apresentação: destrava todas as abas da superfície B (chave-mestra de demo). */
  isMaster: boolean;
  /** Perfil-demo atualmente aplicado (para marcar o item ativo no seletor). */
  perfilId: PerfilDemoId;
  /** "Entrar como…" — aplica um perfil-demo do §2 (seta accountType+papel+master, limpa impersonation). */
  aplicarPerfil: (id: PerfilDemoId) => void;
  /** Admin operando como um tenant (§4). Null = não está impersonando. */
  impersonating: Impersonation;
  /** Console → "Entrar como [tenant]": cai na superfície B com banner fixo. */
  impersonar: (tenantId: string, tenantName: string) => void;
  /** Encerra a impersonation e volta ao Console. */
  sairImpersonation: () => void;
  /** Console → cria um tenant de demonstração (flag sandbox) para test users (§6). */
  addTenant: (input: { name: string; plano?: Tenant["plano"] }) => string;
  // ── Filial (dentro do tenant · §5) — re-escopa o dado, não só o rótulo. ──
  /** Filial ativa (id) ou FILIAL_TODAS para a visão matriz consolidada. */
  filialId: string;
  setFilial: (id: string) => void;
  addViagem: (i: NovaViagemInput) => string;
  addNaoConformidade: (nc: Omit<NaoConformidade, "id">) => string;
  updateNCCapa: (ncId: string, patch: Partial<NonNullable<NaoConformidade["capa"]>>) => void;
  addCavalo: (c: Omit<Cavalo, "id">) => string;
  addImplemento: (i: NovoImplementoInput) => string;
  addCompartimento: (c: Omit<Compartimento, "id">) => string;
  addSubcontratado: (s: Omit<Subcontratado, "id">) => string;
  /** Confirma os dados coletados e tira o registro da etapa de pré-cadastro. */
  iniciarQualificacaoSubcontratado: (
    id: string,
    i: RevisaoSubcontratadoInput
  ) => { ok: boolean; motivo: string };
  classificarProduto: (
    id: string,
    patch: {
      regimeAntesDeFeed: Regime;
      bloqueiaFeed: boolean;
      idtfCode?: string;
      justificativa: string;
      fonte: string;
    }
  ) => void;
  addCleaningEvent: (c: Omit<CleaningEvent, "id">) => string;
  addInspectionEvent: (i: Omit<InspectionEvent, "id">) => string;
  updateViagemStatus: (viagemId: string, status: Viagem["status"]) => void;
  /** Troca veículo/compartimento de uma viagem. Cavalo NÃO altera o T-3 (é do
   *  compartimento); trocar implemento/compartimento re-roda o motor. Cada campo
   *  travado alterado gera uma retificação (imutabilidade, pergunta 20). */
  trocarVeiculo: (viagemId: string, changes: TrocaVeiculoInput) => void;
  // ── Network (Fase 9) ────────────────────────────────────────────────────
  /** Cria vínculo com vigência. Recusa duplicata vigente do mesmo par. */
  vincular: (i: { subcontratadoId: string; tipo: TipoEntidadeVinculo; entidadeId: string; inicio?: string }) => string | null;
  /** Vincula um motorista já cadastrado, sem permitir duas empresas vigentes. */
  vincularMotoristaSubcontratado: (
    subcontratadoId: string,
    motoristaId: string
  ) => { ok: boolean; motivo: string };
  /** Cria o motorista terceiro e o vínculo com a empresa na mesma ação de UI. */
  cadastrarMotoristaSubcontratado: (
    subcontratadoId: string,
    i: Omit<NovoMotoristaInput, "tipo">
  ) => { ok: boolean; motivo: string; motoristaId?: string };
  /** Encerra o vínculo com data e motivo. O registro fica — é o histórico. */
  encerrarVinculo: (id: string, motivo: string) => boolean;
  /** Arquiva sem apagar: o cadastro sai das listas ativas e o passado permanece. */
  arquivarSubcontratado: (id: string, motivo: string) => boolean;
  desarquivarSubcontratado: (id: string) => boolean;
  /** Grava as linhas já conferidas da importação. Duplicadas não entram. */
  importarSubcontratados: (linhas: LinhaImportacao[]) => { criados: number; ignorados: number };
  /** Registra a geração do link. Gerar não é enviar e não cria acesso. */
  criarConviteOnboarding: (i: {
    token: string;
    destinatario?: string;
    canal: CanalConvite;
    expiraEm?: string;
  }) => ConviteOnboarding;
  /** Move o convite por uma transição auditável; recusa transições inválidas. */
  moverConviteOnboarding: (token: string, evento: EventoConvite) => boolean;
  criarConviteAcesso: (i: {
    token: string;
    tipo: TipoAcessoExterno;
    entidadeId: string;
    nome: string;
    destinatario?: string;
    expiraEm: string;
  }) => ConviteAcesso;
  moverConviteAcesso: (token: string, evento: "enviar" | "concluir" | "revogar") => boolean;
  /** Renovação coletiva de acordo. Só renova quem tem acordo a vencer ou vencido. */
  renovarAcordos: (subIds: string[]) => { renovados: number; ignorados: number };
  /** Atribui uma trilha aos motoristas vinculados às empresas escolhidas. */
  atribuirTrilhaEmMassa: (subIds: string[], trilhaId: string) => { atribuidas: number; jaVigentes: number };
  /** Registra o disparo de alerta. Não simula entrega — registra o envio. */
  enviarAlerta: (subIds: string[], tipo: TipoNotificacao, mensagem: string) => number;
  /** Anexa a evidência de uma regra classe `registro` (Fase 10.1). */
  anexarRegistroViagem: (i: { viagemId: string; regra: RegraId; descricao: string }) => boolean;
  /** Conclui a viagem, se o motor e os registros obrigatórios deixarem. */
  concluirViagem: (viagemId: string) => { ok: boolean; motivo: string };
  addExcecao: (i: NovaExcecaoInput) => string;
  /**
   * Decide uma exceção. Retorna o motivo da recusa quando não grava.
   *
   * Aprovar EXIGE o registro padronizado (Fase 7): motivo de lista fechada,
   * justificativa e evidência. Sem isso a liberação não acontece — a trava é do
   * store, não da tela, senão bastaria outro botão para contorná-la. Negar
   * mantém o bloqueio e não gera registro de liberação: não houve liberação.
   */
  decidirExcecao: (
    id: string,
    status: "aprovada" | "negada",
    registro?: LiberacaoFormInput
  ) => { ok: boolean; motivo: string };
  addLote: (i: NovoLoteInput) => string;
  updateLoteStatus: (id: string, status: Lote["statusDDS"]) => void;
  addFazenda: (i: NovaFazendaInput) => string;
  addMotorista: (i: NovoMotoristaInput) => string;
  /**
   * Registra conclusão de trilha da Academy. Retorna `false` quando a avaliação
   * reprova (nota abaixo do mínimo ou tentativas esgotadas) — reprovado NÃO vira
   * competência, e a regra de liberação da trilha é gate de verdade, não rótulo.
   */
  registrarConclusao: (i: {
    motoristaId: string;
    trilhaId: string;
    nota: number;
    tentativas: number;
    aceiteCiencia: boolean;
  }) => { ok: boolean; motivo: string };
  /** Altera a classe de uma regra do motor. Retorna false se ficar abaixo do piso. */
  setClasseRegraMotor: (regra: RegraId, classe: ClasseRegra) => boolean;
  /**
   * Cria o subcontratado vindo do onboarding público (`/convite/[token]`).
   * Nasce sempre `Pré-cadastrado`: sem certificado validado, sem base pública
   * consultada e sem treinamento, o estado derivado não poderia ser outro.
   */
  addSubcontratadoPreCadastro: (i: {
    token: string;
    razaoSocial: string;
    documento: string;
    tipoVinculo: TipoVinculo;
    responsavel: string;
    telefone: string;
    cavaloPlaca: string;
    implementoPlaca: string;
    assinouAceite: boolean;
  }) => string;
  /** Assina/renova o acordo de qualidade. Devolve o acordo gravado. */
  assinarAcordo: (
    subId: string,
    i: { versao: string; assinante: string; representantes: string[] }
  ) => AcordoQA;
  addAuditoria: (i: NovaAuditoriaInput) => string;
  renovarCertificadoMotorista: (motoristaId: string, certNome: string, novaValidade: string) => void;
  renovarCertificadoImplemento: (implementoId: string, novaValidade: string) => void;
  addProdutoIDTF: (p: {
    nomeCanonico: string; alias: string[]; hsCode?: string;
    categoria: ProdutoIDTF["categoria"]; regimeAntesDeFeed: Regime; bloqueiaFeed: boolean; idtfCode?: string;
  }) => string;
  touch: () => void;
};

const Ctx = createContext<SessionCtx | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);
  const [papel, setPapel] = useState<Papel>("gestor");

  // Eixo de escopo (MVP vs completa). Default 'mvp'; persistido em localStorage
  // (é preferência de visão, não dado de domínio). Hydration-safe: o estado inicial
  // é sempre 'mvp' (bate no SSR); a leitura do localStorage acontece pós-mount.
  const [produto, setProdutoState] = useState<ProdutoModo>("mvp");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(PRODUTO_KEY) : null;
    if (saved === "mvp" || saved === "completa") setProdutoState(saved);
  }, []);
  const setProduto = useCallback((m: ProdutoModo) => {
    setProdutoState(m);
    try { window.localStorage.setItem(PRODUTO_KEY, m); } catch { /* modo privado */ }
  }, []);

  // ── Eixo 1 — accountType + superfície + impersonation ───────────────────────
  const [accountType, setAccountType] = useState<AccountType>("tenant_user");
  const [isMaster, setIsMaster] = useState(false);
  const [perfilId, setPerfilId] = useState<PerfilDemoId>("gestor");
  const [impersonating, setImpersonating] = useState<Impersonation>(null);
  const [filialId, setFilial] = useState<string>(FILIAL_TODAS);

  const aplicarPerfil = useCallback((id: PerfilDemoId) => {
    const p = PERFIL_POR_ID[id];
    if (!p) return;
    setPerfilId(id);
    setAccountType(p.accountType);
    setPapel(p.papel);
    setIsMaster(!!p.isMaster);
    setImpersonating(null);
    setFilial(FILIAL_TODAS); // novo contexto → visão matriz
    bump();
  }, [bump]);

  const impersonar = useCallback((tenantId: string, tenantName: string) => {
    // Admin opera como o tenant na superfície B (papel gestor = nav larga), banner fixo (§4).
    setImpersonating({ tenantId, tenantName });
    setPapel("gestor");
    setFilial(FILIAL_TODAS); // troca de tenant re-escopa filial
    bump();
  }, [bump]);

  const sairImpersonation = useCallback(() => {
    setImpersonating(null);
    bump();
  }, [bump]);

  const addTenant = useCallback<SessionCtx["addTenant"]>((input) => {
    const id = nextId("tnt");
    tenants.push({
      id,
      name: input.name,
      cnpj: "00.000.000/0001-00",
      cidade: "Sandbox",
      uf: "MT",
      plano: input.plano ?? "Profissional",
      certificacaoGMP: true,
      certificacaoEUDR: false,
      motoristas: 0,
      caminhoes: 0,
      sandbox: true,
    });
    bump();
    return id;
  }, [bump]);

  // Impersonation força a superfície B; senão deriva de (accountType, papel).
  const surface: Surface = impersonating ? "B" : deriveSurface(accountType, papel);

  const addViagem = useCallback<SessionCtx["addViagem"]>((i) => {
    const id = nextId("v");
    const codigo = `TX-2026-0${9000 + (seq % 1000)}`;
    const v: Viagem = {
      id,
      codigo,
      status: i.status,
      motorista: i.motorista,
      motoristaCpf: "***.***.***-**",
      cavalo: i.cavaloPlaca,
      carreta: i.implementoPlaca,
      origem: i.origem,
      destino: i.destino,
      produto: i.produtoNome,
      cargasAnteriores: [],
      regimeLimpeza: "A",
      conformidade: i.status === "Bloqueada" ? 40 : 100,
      iniciadaEm: "2026-07-08T08:00:00",
      previsaoEntrega: i.previsao || "2026-07-12T18:00:00",
      km: i.km,
      alertas: i.status === "Bloqueada" ? 1 : 0,
      justificativa: i.justificativa,
    };
    viagens.unshift(v);
    compartimentoPorViagem[id] = i.compartimentoId;
    produtoAtualPorViagem[id] = i.produtoId;
    bump();
    return id;
  }, [bump]);

  const addNaoConformidade = useCallback<SessionCtx["addNaoConformidade"]>((nc) => {
    const id = nextId("nc");
    naoConformidades.unshift({ ...nc, id });
    bump();
    return id;
  }, [bump]);

  const updateNCCapa = useCallback<SessionCtx["updateNCCapa"]>((ncId, patch) => {
    const nc = naoConformidades.find((x) => x.id === ncId);
    if (!nc) return;
    const base = nc.capa ?? {
      acaoImediata: "", causaRaiz: "", acaoCorretiva: "",
      responsavelAcao: nc.responsavel ?? "", prazo: "", eficaciaVerificada: false,
    };
    nc.capa = { ...base, ...patch };
    bump();
  }, [bump]);

  const addCavalo = useCallback<SessionCtx["addCavalo"]>((c) => {
    const id = nextId("cav");
    cavalos.push({ ...c, id });
    bump();
    return id;
  }, [bump]);

  const addImplemento = useCallback<SessionCtx["addImplemento"]>((i) => {
    const id = nextId("imp");
    implementos.push({
      id,
      placa: i.placa,
      tipo: i.tipo,
      nCompartimentos: i.nCompartimentos,
      certGMP: { status: "Válida", validade: i.certValidade, escopo: i.escopo },
      proprietario: i.proprietario,
      subcontratadoId: i.subcontratadoId,
    });
    // Cadastrar implemento cria automaticamente N compartimentos (subasset com T-3)
    for (let n = 1; n <= i.nCompartimentos; n++) {
      compartimentos.push({
        id: nextId("comp"),
        implementoId: id,
        identificador: i.nCompartimentos === 1 ? "Compartimento único" : `Boca ${n}`,
        capacidadeT: 30,
        material: "Aço carbono",
        estadoConservacao: "Bom",
      });
    }
    bump();
    return id;
  }, [bump]);

  const addCompartimento = useCallback<SessionCtx["addCompartimento"]>((c) => {
    const id = nextId("comp");
    compartimentos.push({ ...c, id });
    bump();
    return id;
  }, [bump]);

  const addSubcontratado = useCallback<SessionCtx["addSubcontratado"]>((s) => {
    const id = nextId("sub");
    subcontratados.push({
      ...s,
      id,
      cadastro: s.cadastro ?? criarEntradaCadastro({
        origem: "manual",
        criadoEm: `${HOJE}T10:00:00`,
        criadoPor: PAPEL_LABEL[papel],
      }),
    });
    bump();
    return id;
  }, [papel, bump]);

  const iniciarQualificacaoSubcontratado = useCallback<SessionCtx["iniciarQualificacaoSubcontratado"]>((id, i) => {
    const s = subcontratados.find((x) => x.id === id);
    if (!s) return { ok: false, motivo: "Subcontratado não encontrado." };
    if (s.arquivadoEm) return { ok: false, motivo: "Reative o cadastro antes de iniciar a qualificação." };
    if (!s.cadastro || s.cadastro.etapa !== "pre_cadastro")
      return { ok: false, motivo: "Este cadastro já saiu da etapa de pré-cadastro." };

    s.cnpj = i.cnpj;
    s.razaoSocial = i.razaoSocial;
    s.tipoVinculo = i.tipoVinculo;
    s.certGMP = { ...i.certificado };
    s.cadastro = iniciarQualificacaoCadastro(s.cadastro);
    bump();
    return { ok: true, motivo: "Dados revisados. A qualificação agora é derivada dos documentos, acordo e treinamento." };
  }, [bump]);

  const classificarProduto = useCallback<SessionCtx["classificarProduto"]>((id, patch) => {
    const p = produtosIDTF.find((x) => x.id === id);
    if (p) {
      const estavaNaFila = p.statusClassificacao === "em_fila";
      const regimeAnterior = p.regimeAntesDeFeed;
      const bloqueioAnterior = p.bloqueiaFeed;
      p.statusClassificacao = "classificado";
      p.regimeAntesDeFeed = patch.regimeAntesDeFeed;
      p.bloqueiaFeed = patch.bloqueiaFeed;
      if (patch.idtfCode) p.idtfCode = patch.idtfCode;
      p.versaoBase = VERSAO_BASE_IDTF;
      p.atualizadoEm = HOJE;
      p.responsavelValidacao = PAPEL_LABEL[papel];
      p.fonteDecisao = patch.fonte;
      historicoBase.unshift({
        id: nextId("hb"),
        data: HOJE,
        versao: VERSAO_BASE_IDTF,
        tipo: estavaNaFila ? "reclassificacao" : regimeAnterior !== patch.regimeAntesDeFeed ? "regime" : "reclassificacao",
        produtoId: p.id,
        descricao: `${patch.justificativa} Regime ${regimeAnterior} → ${patch.regimeAntesDeFeed}; bloqueio ${bloqueioAnterior ? "sim" : "não"} → ${patch.bloqueiaFeed ? "sim" : "não"}.`,
        responsavel: PAPEL_LABEL[papel],
        fonte: patch.fonte,
        aprovadoPor: PAPEL_LABEL[papel],
      });
      bump();
    }
  }, [papel, bump]);

  const addCleaningEvent = useCallback<SessionCtx["addCleaningEvent"]>((c) => {
    const id = nextId("cl");
    cleaningEvents.unshift({ ...c, id });
    bump();
    return id;
  }, [bump]);

  const addInspectionEvent = useCallback<SessionCtx["addInspectionEvent"]>((i) => {
    const id = nextId("insp");
    inspectionEvents.unshift({ ...i, id });
    bump();
    return id;
  }, [bump]);

  const updateViagemStatus = useCallback<SessionCtx["updateViagemStatus"]>((viagemId, status) => {
    const v = viagens.find((x) => x.id === viagemId);
    if (v) { v.status = status; bump(); }
  }, [bump]);

  const trocarVeiculo = useCallback<SessionCtx["trocarVeiculo"]>((viagemId, changes) => {
    const v = viagens.find((x) => x.id === viagemId);
    if (!v) return;
    const resp = PAPEL_LABEL[papel];
    const stamp = `${HOJE}T10:00:00`;
    const retif = (campo: string, orig: string, novo: string) => {
      if (orig === novo) return;
      retificacoes.unshift({
        id: nextId("ret"), entidade: "viagem", entidadeId: viagemId, campo,
        valorOriginal: orig, valorNovo: novo, motivo: changes.motivo, responsavel: resp, dataHora: stamp,
      });
    };
    // Trocar o CAVALO não toca o T-3 — o histórico é do compartimento, não do cavalo.
    if (changes.cavaloPlaca) retif("cavalo", v.cavalo, changes.cavaloPlaca), (v.cavalo = changes.cavaloPlaca);
    if (changes.implementoId) {
      const imp = findImplemento(changes.implementoId);
      if (imp) { retif("carreta", v.carreta, imp.placa); v.carreta = imp.placa; }
    }
    if (changes.compartimentoId && changes.compartimentoId !== compartimentoPorViagem[viagemId]) {
      retif("compartimento", compartimentoPorViagem[viagemId] ?? "—", changes.compartimentoId);
      compartimentoPorViagem[viagemId] = changes.compartimentoId;
      // Trocar implemento/compartimento RE-RODA o motor: pode virar Bloqueada ou liberar.
      const d = avaliarCarregamento(viagemId);
      v.status = d.tier === "BLOQUEIO" ? "Bloqueada" : v.status === "Bloqueada" ? "Agendada" : v.status;
      v.alertas = d.tier === "BLOQUEIO" ? 1 : 0;
      v.regimeLimpeza = (d.regimeAplicado ?? d.regimeExigido ?? v.regimeLimpeza) as Viagem["regimeLimpeza"];
    }
    bump();
  }, [papel, bump]);

  // ── Network (Fase 9) ──────────────────────────────────────────────────────

  const vincular = useCallback<SessionCtx["vincular"]>((i) => {
    // Um motorista só responde por uma transportadora por vez. O histórico
    // continua aceitando várias empresas em períodos diferentes.
    if (i.tipo === "motorista" && vinculoVigenteDaEntidade("motorista", i.entidadeId)) return null;
    const jaVigente = vinculos.some(
      (v) => v.subcontratadoId === i.subcontratadoId && v.tipo === i.tipo && v.entidadeId === i.entidadeId && vinculoVigente(v)
    );
    if (jaVigente) return null;
    const id = nextId("vin");
    vinculos.push({ id, subcontratadoId: i.subcontratadoId, tipo: i.tipo, entidadeId: i.entidadeId, inicio: i.inicio ?? HOJE });
    bump();
    return id;
  }, [bump]);

  const encerrarVinculo = useCallback<SessionCtx["encerrarVinculo"]>((id, motivo) => {
    const v = vinculos.find((x) => x.id === id);
    if (!v || v.fim) return false;
    // Não apaga: carimba o fim. O dossiê de uma viagem antiga continua achando
    // o vínculo que valia naquele dia.
    v.fim = HOJE;
    v.motivoFim = motivo;
    bump();
    return true;
  }, [bump]);

  const arquivarSubcontratado = useCallback<SessionCtx["arquivarSubcontratado"]>((id, motivo) => {
    const s = subcontratados.find((x) => x.id === id);
    if (!s || s.arquivadoEm) return false;
    s.arquivadoEm = HOJE;
    s.motivoArquivo = motivo;
    // Arquivar a empresa encerra os vínculos vigentes: ativo de empresa
    // arquivada não pode continuar "autorizado" por omissão.
    for (const v of vinculos.filter((x) => x.subcontratadoId === id && vinculoVigente(x))) {
      v.fim = HOJE;
      v.motivoFim = `Empresa arquivada: ${motivo}`;
    }
    bump();
    return true;
  }, [bump]);

  const desarquivarSubcontratado = useCallback<SessionCtx["desarquivarSubcontratado"]>((id) => {
    const s = subcontratados.find((x) => x.id === id);
    if (!s?.arquivadoEm) return false;
    // Reativar não ressuscita vínculo: o que foi encerrado ficou encerrado, e a
    // empresa volta com o estado que os fatos derivarem — não com o antigo.
    s.arquivadoEm = undefined;
    s.motivoArquivo = undefined;
    bump();
    return true;
  }, [bump]);

  const importarSubcontratados = useCallback<SessionCtx["importarSubcontratados"]>((linhas) => {
    let criados = 0;
    let ignorados = 0;
    for (const l of linhas) {
      if (l.problema || l.duplicada) { ignorados++; continue; }
      const id = nextId("sub");
      subcontratados.unshift({
        id,
        cnpj: l.cnpj,
        razaoSocial: l.razaoSocial,
        tipoVinculo: l.tipoVinculo,
        // Importar é trazer o cadastro, não atestar conformidade: o certificado
        // continua não comprovado até alguém consultar a base pública.
        certGMP: {
          numero: "—", certificadora: "—", escopo: [], validade: HOJE,
          statusBasePublica: "Não localizado", sitesCobertos: [],
        },
        treinamento: { comprovante: false, quiz: false, aceiteRegras: false },
        cadastro: criarEntradaCadastro({
          origem: "importacao",
          criadoEm: `${HOJE}T10:00:00`,
          criadoPor: PAPEL_LABEL[papel],
        }),
      });
      if (l.implementoPlaca)
        vinculos.push({ id: nextId("vin"), subcontratadoId: id, tipo: "implemento", entidadeId: l.implementoPlaca, inicio: HOJE });
      criados++;
    }
    if (criados) bump();
    return { criados, ignorados };
  }, [papel, bump]);

  const criarConviteOnboarding = useCallback<SessionCtx["criarConviteOnboarding"]>((i) => {
    const existente = convitesOnboarding.find((c) => c.token === i.token);
    if (existente) return existente;
    const convite: ConviteOnboarding = {
      token: i.token,
      estado: "nao_enviado",
      canal: i.canal,
      destinatario: i.destinatario,
      criadoEm: new Date().toISOString(),
      expiraEm: i.expiraEm,
    };
    convitesOnboarding.unshift(convite);
    bump();
    return convite;
  }, [bump]);

  const moverConviteOnboarding = useCallback<SessionCtx["moverConviteOnboarding"]>((token, evento) => {
    const indice = convitesOnboarding.findIndex((c) => c.token === token);
    if (indice < 0) return false;
    const atualizado = transicionarConvite(convitesOnboarding[indice], evento, new Date().toISOString());
    if (!atualizado) return false;
    convitesOnboarding[indice] = atualizado;
    bump();
    return true;
  }, [bump]);

  const criarConviteAcessoStore = useCallback<SessionCtx["criarConviteAcesso"]>((i) => {
    const convite = criarConviteAcesso(i);
    convitesAcesso.unshift(convite);
    bump();
    return convite;
  }, [bump]);

  const moverConviteAcesso = useCallback<SessionCtx["moverConviteAcesso"]>((token, evento) => {
    const indice = convitesAcesso.findIndex((c) => c.token === token);
    if (indice < 0) return false;
    const agora = new Date().toISOString();
    const atual = convitesAcesso[indice];
    const proximo = evento === "enviar"
      ? enviarConviteAcesso(atual, agora)
      : evento === "concluir"
        ? concluirConviteAcesso(atual, agora)
        : revogarConviteAcesso(atual, agora);
    if (!proximo) return false;
    convitesAcesso[indice] = proximo;
    bump();
    return true;
  }, [bump]);

  const renovarAcordos = useCallback<SessionCtx["renovarAcordos"]>((subIds) => {
    let renovados = 0;
    let ignorados = 0;
    for (const id of subIds) {
      const s = subcontratados.find((x) => x.id === id);
      if (!s?.acordo) { ignorados++; continue; }
      // Renovação coletiva não renova o que ainda tem folga: acordo com mais de
      // 60 dias de vigência não precisa, e renovar cedo demais só reinicia o
      // relógio sem ninguém reler o termo.
      if (diasEntre(HOJE, s.acordo.vigenciaFim) > 60) { ignorados++; continue; }
      const fim = new Date(`${HOJE}T00:00:00`);
      fim.setFullYear(fim.getFullYear() + 1);
      const vigenciaFim = fim.toISOString().slice(0, 10);
      const ren = new Date(`${vigenciaFim}T00:00:00`);
      ren.setDate(ren.getDate() - 60);
      s.acordo = {
        ...s.acordo,
        versao: s.acordo.versao,
        vigenciaInicio: HOJE,
        vigenciaFim,
        renovacaoEm: ren.toISOString().slice(0, 10),
        assinadoEm: undefined,
        assinante: undefined,
        dispositivo: undefined,
      };
      renovados++;
    }
    if (renovados) bump();
    return { renovados, ignorados };
  }, [bump]);

  const atribuirTrilhaEmMassa = useCallback<SessionCtx["atribuirTrilhaEmMassa"]>((subIds, trilhaId) => {
    let atribuidas = 0;
    let jaVigentes = 0;
    for (const subId of subIds) {
      for (const motoristaId of motoristasDoSubcontratado(subId)) {
        if (estadoTrilha(motoristaId, findTrilha(trilhaId)!) === "vigente") { jaVigentes++; continue; }
        if (atribuirTrilha(motoristaId, trilhaId, `${PAPEL_LABEL[papel]} · envio coletivo`)) atribuidas++;
      }
    }
    if (atribuidas) bump();
    return { atribuidas, jaVigentes };
  }, [papel, bump]);

  const enviarAlerta = useCallback<SessionCtx["enviarAlerta"]>((subIds, tipo, mensagem) => {
    for (const subcontratadoId of subIds) {
      notificacoes.unshift({
        id: nextId("not"),
        subcontratadoId,
        tipo,
        mensagem,
        enviadaEm: `${HOJE}T10:00:00`,
        canal: "WhatsApp",
        remetente: PAPEL_LABEL[papel],
      });
    }
    bump();
    return subIds.length;
  }, [papel, bump]);

  const anexarRegistroViagem = useCallback<SessionCtx["anexarRegistroViagem"]>((i) => {
    const ok = Boolean(anexarRegistro({ ...i, anexadoPor: PAPEL_LABEL[papel] }));
    if (ok) bump();
    return ok;
  }, [papel, bump]);

  const concluirViagem = useCallback<SessionCtx["concluirViagem"]>((viagemId) => {
    const veredicto = podeConcluir(viagemId);
    if (!veredicto.ok) return veredicto;
    const v = viagens.find((x) => x.id === viagemId);
    if (v) v.status = "Concluída";
    bump();
    return veredicto;
  }, [bump]);

  const addExcecao = useCallback<SessionCtx["addExcecao"]>((i) => {
    const id = nextId("exc");
    excecoes.unshift({ ...i, id, status: "pendente" });
    bump();
    return id;
  }, [bump]);

  const decidirExcecao = useCallback<SessionCtx["decidirExcecao"]>((id, status, registro) => {
    const e = excecoes.find((x) => x.id === id);
    if (!e) return { ok: false, motivo: "Exceção não encontrada." };
    // Gate de autoridade (pergunta 04): quem não pode aprovar, não decide. Defesa no
    // store além de esconder o botão — impede persistir uma liberação por papel errado.
    if (!podeAprovarExcecao(papel, e.nivelRequerido))
      return { ok: false, motivo: `${PAPEL_LABEL[papel]} não decide exceção deste nível.` };

    if (status === "aprovada") {
      if (!motivosDaRegra(e.regra).length)
        return {
          ok: false,
          motivo: `Não há motivo padronizado que libere “${e.regra}”. O caminho é regularizar o fato.`,
        };
      if (!registro) return { ok: false, motivo: "Liberação exige o registro padronizado." };
    }

    // Situação ANTES da decisão — depois de mudar o status, esse estado não
    // existe mais em lugar nenhum.
    const anterior = situacaoDaViagem(e.viagemId);
    const dataHora = `${HOJE}T10:00:00`;
    const statusOriginal = e.status;

    e.status = status;
    e.aprovador = `${PAPEL_LABEL[papel]} · aprovação simulada`;
    e.decididoEm = dataHora;
    // Aprovada → destrava a viagem bloqueada (Bloqueada → Agendada).
    if (status === "aprovada" && e.viagemId) {
      const v = viagens.find((x) => x.id === e.viagemId);
      if (v && v.status === "Bloqueada") { v.status = "Agendada"; v.alertas = 0; }
    }

    if (status === "aprovada" && registro) {
      const gravado = registrarLiberacao({
        excecao: e,
        ...registro,
        responsavel: `${PAPEL_LABEL[papel]} · aprovação simulada`,
        situacaoAnterior: anterior,
        // Depois de mutar: a situação posterior é lida do mesmo derivador, não
        // descrita à mão. Se a liberação não mudou nada, o registro mostra isso.
        situacaoPosterior: situacaoDaViagem(e.viagemId),
        dataHora,
      });
      if (!gravado) {
        // Registro recusado pelo domínio → a liberação inteira é desfeita. Não
        // existe viagem liberada sem os nove campos.
        e.status = statusOriginal;
        e.aprovador = undefined;
        e.decididoEm = undefined;
        const v = viagens.find((x) => x.id === e.viagemId);
        if (v && anterior.statusViagem === "Bloqueada") { v.status = "Bloqueada"; v.alertas = 1; }
        bump();
        return { ok: false, motivo: "Registro incompleto: motivo padronizado, justificativa e evidência são obrigatórios." };
      }
    }

    bump();
    return {
      ok: true,
      motivo: status === "aprovada" ? "Liberação registrada com os nove campos." : "Bloqueio mantido.",
    };
  }, [papel, bump]);

  const registrarConclusao = useCallback<SessionCtx["registrarConclusao"]>((i) => {
    const t = findTrilha(i.trilhaId);
    if (!t) return { ok: false, motivo: "Trilha inexistente." };
    if (!i.aceiteCiencia) return { ok: false, motivo: "Sem aceite de ciência — a evidência não vale para auditoria." };
    if (i.tentativas > t.tentativasMax)
      return { ok: false, motivo: `Tentativas esgotadas: ${i.tentativas} de ${t.tentativasMax} permitidas.` };
    if (i.nota < t.notaMinima)
      return { ok: false, motivo: `Reprovado — nota ${i.nota}, mínimo ${t.notaMinima}. Tentativa ${i.tentativas} de ${t.tentativasMax}.` };

    // Reciclagem substitui a conclusão anterior da mesma trilha; o histórico de
    // uma trilha é a conclusão vigente, não a pilha.
    const idx = conclusoes.findIndex((c) => c.motoristaId === i.motoristaId && c.trilhaId === i.trilhaId);
    const nova = {
      motoristaId: i.motoristaId,
      trilhaId: i.trilhaId,
      concluidoEm: HOJE,
      nota: i.nota,
      tentativas: i.tentativas,
      aceiteCiencia: true,
      versaoConteudo: t.versaoConteudo,
      certificadoId: nextId("CERT").toUpperCase(),
    };
    if (idx >= 0) conclusoes[idx] = nova;
    else conclusoes.unshift(nova);
    bump();
    return { ok: true, motivo: `${t.codigo} concluída com nota ${i.nota}. Válida por ${t.validadeMeses} meses.` };
  }, [bump]);

  const setClasseRegraMotor = useCallback<SessionCtx["setClasseRegraMotor"]>((regra, classe) => {
    const ok = setClasseRegra(regra, classe);
    if (ok) bump(); // a decisão de toda viagem é derivada — muda tudo de uma vez
    return ok;
  }, [bump]);

  const addSubcontratadoPreCadastro = useCallback<SessionCtx["addSubcontratadoPreCadastro"]>((i) => {
    const conviteIndex = convitesOnboarding.findIndex((c) => c.token === i.token);
    const concluidoEm = new Date().toISOString();
    if (conviteIndex >= 0) {
      const convite = convitesOnboarding[conviteIndex];
      if (convite.estado === "expirado" || convite.estado === "revogado") return "";
      const concluido = transicionarConvite(convite, "concluir", concluidoEm);
      if (concluido) convitesOnboarding[conviteIndex] = concluido;
    } else {
      // Link externo à sessão de demonstração: preservar a origem ainda é mais
      // honesto que fingir que o convite nunca existiu.
      convitesOnboarding.unshift({
        token: i.token,
        estado: "concluido",
        canal: "Link direto",
        criadoEm: concluidoEm,
        concluidoEm,
      });
    }
    const id = nextId("sub");
    subcontratados.unshift({
      id,
      cnpj: i.documento,
      razaoSocial: i.razaoSocial,
      tipoVinculo: i.tipoVinculo,
      certGMP: {
        // Nada é afirmado sobre o certificado: quem se cadastrou não o comprova.
        // "Não localizado" é o estado honesto até a consulta à base pública.
        numero: "—",
        certificadora: "—",
        escopo: [],
        validade: HOJE,
        statusBasePublica: "Não localizado",
        sitesCobertos: [],
      },
      // Aceitou as regras no convite, mas não fez trilha nem enviou comprovante.
      treinamento: { comprovante: false, quiz: false, aceiteRegras: i.assinouAceite },
      cadastro: criarEntradaCadastro({
        origem: "convite",
        criadoEm: `${HOJE}T10:00:00`,
        criadoPor: "Onboarding público",
        convite: {
          token: i.token,
          estado: "concluido",
          canal: "Link direto",
          concluidoEm,
        },
      }),
    });
    // Vínculo com vigência a partir de hoje (Fase 9.1). O implemento entra pela
    // placa; o responsável entra como motorista do cadastro, para que exista
    // alguém com id — e não um nome solto que ninguém consegue consultar.
    if (i.implementoPlaca)
      vinculos.push({ id: nextId("vin"), subcontratadoId: id, tipo: "implemento", entidadeId: i.implementoPlaca, inicio: HOJE });
    if (i.cavaloPlaca)
      vinculos.push({ id: nextId("vin"), subcontratadoId: id, tipo: "cavalo", entidadeId: i.cavaloPlaca, inicio: HOJE });
    if (i.responsavel) {
      const motoristaId = nextId("m");
      motoristas.unshift({
        id: motoristaId,
        nome: i.responsavel,
        cpf: "***.***.***-**",
        tipo: "Subcontratado",
        telefone: i.telefone,
        cnh: { numero: "********", categoria: "E", vencimento: HOJE },
        certificacoes: [],
        totalViagens: 0,
        conformidadeMedia: 0,
        ultimaViagem: "—",
        cidade: "—",
        uf: "—",
        status: "Ativo",
        letramentoDigital: "Básico",
      });
      vinculos.push({ id: nextId("vin"), subcontratadoId: id, tipo: "motorista", entidadeId: motoristaId, inicio: HOJE });
      if (vinculoEhPessoa(i.tipoVinculo)) {
        const pessoaTransportadora = subcontratados.find((s) => s.id === id);
        if (pessoaTransportadora) pessoaTransportadora.responsavelMotoristaId = motoristaId;
      }
    }
    bump();
    return id;
  }, [bump]);

  const assinarAcordo = useCallback<SessionCtx["assinarAcordo"]>((subId, i) => {
    const inicio = HOJE;
    const fim = new Date(HOJE);
    fim.setFullYear(fim.getFullYear() + 1);
    const vigenciaFim = fim.toISOString().slice(0, 10);
    // Renovação é disparada 60 dias ANTES do vencimento — mesma janela em que o
    // certificado entra em alerta, para a empresa tratar as duas de uma vez.
    const ren = new Date(vigenciaFim);
    ren.setDate(ren.getDate() - 60);

    const acordo: AcordoQA = {
      versao: i.versao,
      vigenciaInicio: inicio,
      vigenciaFim,
      assinadoEm: `${inicio}T10:00:00`,
      assinante: i.assinante,
      dispositivo: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 60) : "—",
      renovacaoEm: ren.toISOString().slice(0, 10),
      representantes: i.representantes,
    };
    const sub = subcontratados.find((x) => x.id === subId);
    if (sub) sub.acordo = acordo;
    bump();
    return acordo;
  }, [bump]);

  const addLote = useCallback<SessionCtx["addLote"]>((i) => {
    const id = nextId("l");
    const codigo = `LOT-2026-0${150 + (seq % 800)}`;
    lotes.unshift({
      id, codigo, produto: i.produto, hsCode: i.hsCode,
      toneladas: i.origens.reduce((a, o) => a + o.toneladas, 0),
      fazendas: i.origens,
      destinatarioFinal: i.destinatarioFinal, paisDestino: i.paisDestino,
      statusDDS: "Rascunho",
    });
    bump();
    return id;
  }, [bump]);

  const updateLoteStatus = useCallback<SessionCtx["updateLoteStatus"]>((id, status) => {
    const l = lotes.find((x) => x.id === id);
    if (l) {
      l.statusDDS = status;
      if (status === "Enviado TRACES") {
        l.numeroDDS = `DDS-${l.paisDestino.slice(0, 2).toUpperCase()}-2026-${Math.floor(Math.random() * 1e7).toString(16).toUpperCase()}`;
        l.dataEnvio = "2026-07-08T10:00:00";
      }
      bump();
    }
  }, [bump]);

  const addProdutoIDTF = useCallback<SessionCtx["addProdutoIDTF"]>((p) => {
    const id = nextId("p");
    // Produto novo entra na FILA de classificação da qualidade (pergunta 19):
    // regime informado é sugestão; trava o uso até confirmação em /idtf.
    produtosIDTF.push({
      id, nomeCanonico: p.nomeCanonico, alias: p.alias, hsCode: p.hsCode,
      categoria: p.categoria, idtfCode: p.idtfCode, regimeAntesDeFeed: p.regimeAntesDeFeed,
      bloqueiaFeed: p.bloqueiaFeed, riscoEUDR: "N/A", statusClassificacao: "em_fila",
      versaoBase: VERSAO_BASE_IDTF,
    });
    bump();
    return id;
  }, [bump]);

  const addMotorista = useCallback<SessionCtx["addMotorista"]>((i) => {
    const id = nextId("m");
    motoristas.unshift({
      id,
      nome: i.nome,
      cpf: i.cpf || "***.***.***-**",
      tipo: i.tipo,
      telefone: i.telefone,
      cnh: i.cnh,
      certificacoes: i.certificacoes,
      totalViagens: 0,
      conformidadeMedia: 100,
      ultimaViagem: "—",
      cidade: i.cidade,
      uf: i.uf,
      status: "Ativo",
      letramentoDigital: i.letramentoDigital,
    });
    bump();
    return id;
  }, [bump]);

  const vincularMotoristaSubcontratado = useCallback<SessionCtx["vincularMotoristaSubcontratado"]>((subcontratadoId, motoristaId) => {
    const empresa = subcontratados.find((s) => s.id === subcontratadoId);
    if (!empresa || empresa.arquivadoEm) {
      return { ok: false, motivo: "A transportadora não está ativa para receber motoristas." };
    }
    const motorista = motoristas.find((m) => m.id === motoristaId);
    if (!motorista) return { ok: false, motivo: "Motorista não encontrado." };

    const atual = vinculoVigenteDaEntidade("motorista", motoristaId);
    if (atual) {
      const responsavel = subcontratados.find((s) => s.id === atual.subcontratadoId)?.razaoSocial ?? "outra empresa";
      return {
        ok: false,
        motivo: atual.subcontratadoId === subcontratadoId
          ? `${motorista.nome} já está vinculado a esta transportadora.`
          : `${motorista.nome} já possui vínculo vigente com ${responsavel}. Encerre esse vínculo antes de transferir.`,
      };
    }

    const id = vincular({ subcontratadoId, tipo: "motorista", entidadeId: motoristaId });
    return id
      ? { ok: true, motivo: `${motorista.nome} foi vinculado a ${empresa.razaoSocial}.` }
      : { ok: false, motivo: "Não foi possível criar o vínculo." };
  }, [vincular]);

  const cadastrarMotoristaSubcontratado = useCallback<SessionCtx["cadastrarMotoristaSubcontratado"]>((subcontratadoId, i) => {
    const empresa = subcontratados.find((s) => s.id === subcontratadoId);
    if (!empresa || empresa.arquivadoEm) {
      return { ok: false, motivo: "A transportadora não está ativa para receber motoristas." };
    }
    const cpfNormalizado = i.cpf.replace(/\D/g, "");
    if (cpfNormalizado && motoristas.some((m) => m.cpf.replace(/\D/g, "") === cpfNormalizado)) {
      return { ok: false, motivo: "Já existe um motorista com este CPF. Use “Vincular existente”." };
    }

    const motoristaId = addMotorista({ ...i, tipo: "Subcontratado" });
    const resultado = vincularMotoristaSubcontratado(subcontratadoId, motoristaId);
    return resultado.ok ? { ...resultado, motoristaId } : resultado;
  }, [addMotorista, vincularMotoristaSubcontratado]);

  const addAuditoria = useCallback<SessionCtx["addAuditoria"]>((i) => {
    const id = nextId("a");
    auditorias.unshift({
      id,
      data: i.data,
      tipo: i.tipo,
      auditor: i.auditor,
      organismo: i.organismo,
      status: "Programada",
      ncEncontradas: 0,
    });
    bump();
    return id;
  }, [bump]);

  const renovarCertificadoMotorista = useCallback<SessionCtx["renovarCertificadoMotorista"]>((motoristaId, certNome, novaValidade) => {
    const m = motoristas.find((x) => x.id === motoristaId);
    const c = m?.certificacoes.find((x) => x.nome === certNome);
    if (c) { c.status = "Válida"; c.vencimento = novaValidade; bump(); }
  }, [bump]);

  const renovarCertificadoImplemento = useCallback<SessionCtx["renovarCertificadoImplemento"]>((implementoId, novaValidade) => {
    const i = implementos.find((x) => x.id === implementoId);
    if (i) { i.certGMP.status = "Válida"; i.certGMP.validade = novaValidade; bump(); }
  }, [bump]);

  const addFazenda = useCallback<SessionCtx["addFazenda"]>((i) => {
    const id = nextId("f");
    const c = { lat: -12.5 - (seq % 10) * 0.05, lng: -55.7 - (seq % 10) * 0.05 };
    fazendas.push({
      id, nome: i.nome, produtor: i.produtor, car: i.car, cidade: i.cidade, uf: i.uf,
      areaTotalHa: 5000, areaProdutivaHa: 3500, areaPreservacaoHa: 1500, cultura: i.cultura,
      poligono: [
        { lat: c.lat + 0.03, lng: c.lng - 0.03 }, { lat: c.lat + 0.03, lng: c.lng + 0.03 },
        { lat: c.lat - 0.03, lng: c.lng + 0.03 }, { lat: c.lat - 0.03, lng: c.lng - 0.03 },
      ],
      centroide: c,
      desmatamentoPos2020: false, scoreRiscoEUDR: "Baixo",
      ultimaVerificacao: "2026-07-08",
      fonteValidacao: ["INPE TerraBrasilis", "CAR"], status: "Em análise",
    } as Fazenda);
    bump();
    return id;
  }, [bump]);

  const value: SessionCtx = {
    version,
    produto,
    setProduto,
    papel,
    setPapel,
    accountType,
    setAccountType,
    surface,
    isMaster,
    perfilId,
    aplicarPerfil,
    impersonating,
    impersonar,
    sairImpersonation,
    addTenant,
    filialId,
    setFilial,
    addViagem,
    addNaoConformidade,
    updateNCCapa,
    addCavalo,
    addImplemento,
    addCompartimento,
    addSubcontratado,
    iniciarQualificacaoSubcontratado,
    classificarProduto,
    addCleaningEvent,
    addInspectionEvent,
    updateViagemStatus,
    trocarVeiculo,
    anexarRegistroViagem,
    concluirViagem,
    vincular,
    encerrarVinculo,
    arquivarSubcontratado,
    desarquivarSubcontratado,
    importarSubcontratados,
    criarConviteOnboarding,
    moverConviteOnboarding,
    criarConviteAcesso: criarConviteAcessoStore,
    moverConviteAcesso,
    renovarAcordos,
    atribuirTrilhaEmMassa,
    enviarAlerta,
    addExcecao,
    decidirExcecao,
    registrarConclusao,
    setClasseRegraMotor,
    addSubcontratadoPreCadastro,
    assinarAcordo,
    addLote,
    updateLoteStatus,
    addFazenda,
    addMotorista,
    vincularMotoristaSubcontratado,
    cadastrarMotoristaSubcontratado,
    addAuditoria,
    renovarCertificadoMotorista,
    renovarCertificadoImplemento,
    addProdutoIDTF,
    touch: bump,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSession fora do SessionProvider");
  return c;
}

// Load history helper — usado pelo modal de Nova viagem para "fechar" a carga anterior
export function registrarCargaNoCompartimento(compartimentoId: string, produtoId: string, cavaloPlaca: string, data: string) {
  loadHistory.unshift({
    id: nextId("lh"),
    compartimentoId,
    produtoId,
    data,
    cavaloPlaca,
    imutavel: true,
  });
}
