"use client";

// Store de sessão do protótipo (sem backend).
// Estratégia: muta os arrays de domínio EXPORTADOS in-place (mesma referência que o
// motor de regras importa) e incrementa `version` para forçar re-render das telas.
// O motor (getT3, avaliarCarregamento, statusCompartimento) continua lendo os mesmos
// arrays — então tudo que é criado aqui é imediatamente validado pelas regras.
// Recarregar a página reseta (módulos são re-avaliados). É o comportamento esperado num protótipo.

import { createContext, useContext, useState, useCallback } from "react";
import { avaliarCarregamento } from "@/lib/domain/rules-engine";
import {
  viagens,
  naoConformidades,
  lotes,
  fazendas,
  motoristas,
  auditorias,
  tenants,
  type Viagem,
  type NaoConformidade,
  type Lote,
  type Fazenda,
  type Motorista,
  type AuditoriaEvento,
  type Tenant,
} from "@/lib/mock-data";
import {
  cavalos,
  implementos,
  compartimentos,
  subcontratados,
  produtosIDTF,
  cleaningEvents,
  inspectionEvents,
  loadHistory,
  excecoes,
  retificacoes,
  compartimentoPorViagem,
  produtoAtualPorViagem,
  findImplemento,
  VERSAO_BASE_IDTF,
  HOJE,
  PAPEL_LABEL,
  podeAprovarExcecao,
  deriveSurface,
  PERFIL_POR_ID,
  type Cavalo,
  type Implemento,
  type Compartimento,
  type Subcontratado,
  type CleaningEvent,
  type InspectionEvent,
  type Regime,
  type ProdutoIDTF,
  type Papel,
  type Excecao,
  type AccountType,
  type Surface,
  type PerfilDemoId,
} from "@/lib/domain/model";

let seq = 5000;
const nextId = (p: string) => `${p}-${++seq}`;

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
  tipo: "Próprio" | "Agregado";
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

export type TrocaVeiculoInput = {
  cavaloPlaca?: string;
  implementoId?: string;
  compartimentoId?: string;
  motivo: string;
};

export type Impersonation = { tenantId: string; tenantName: string } | null;

type SessionCtx = {
  version: number;
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
  addViagem: (i: NovaViagemInput) => string;
  addNaoConformidade: (nc: Omit<NaoConformidade, "id">) => string;
  updateNCCapa: (ncId: string, patch: Partial<NonNullable<NaoConformidade["capa"]>>) => void;
  addCavalo: (c: Omit<Cavalo, "id">) => string;
  addImplemento: (i: NovoImplementoInput) => string;
  addCompartimento: (c: Omit<Compartimento, "id">) => string;
  addSubcontratado: (s: Omit<Subcontratado, "id">) => string;
  classificarProduto: (
    id: string,
    patch: { regimeAntesDeFeed: Regime; bloqueiaFeed: boolean; idtfCode?: string }
  ) => void;
  addCleaningEvent: (c: Omit<CleaningEvent, "id">) => string;
  addInspectionEvent: (i: Omit<InspectionEvent, "id">) => string;
  updateViagemStatus: (viagemId: string, status: Viagem["status"]) => void;
  /** Troca veículo/compartimento de uma viagem. Cavalo NÃO altera o T-3 (é do
   *  compartimento); trocar implemento/compartimento re-roda o motor. Cada campo
   *  travado alterado gera uma retificação (imutabilidade, pergunta 20). */
  trocarVeiculo: (viagemId: string, changes: TrocaVeiculoInput) => void;
  addExcecao: (i: NovaExcecaoInput) => string;
  /** Decide uma exceção. Retorna false se o papel atual não pode aprovar (gate de autoridade). */
  decidirExcecao: (id: string, status: "aprovada" | "negada") => boolean;
  addLote: (i: NovoLoteInput) => string;
  updateLoteStatus: (id: string, status: Lote["statusDDS"]) => void;
  addFazenda: (i: NovaFazendaInput) => string;
  addMotorista: (i: NovoMotoristaInput) => string;
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

  // ── Eixo 1 — accountType + superfície + impersonation ───────────────────────
  const [accountType, setAccountType] = useState<AccountType>("tenant_user");
  const [isMaster, setIsMaster] = useState(false);
  const [perfilId, setPerfilId] = useState<PerfilDemoId>("gestor");
  const [impersonating, setImpersonating] = useState<Impersonation>(null);

  const aplicarPerfil = useCallback((id: PerfilDemoId) => {
    const p = PERFIL_POR_ID[id];
    if (!p) return;
    setPerfilId(id);
    setAccountType(p.accountType);
    setPapel(p.papel);
    setIsMaster(!!p.isMaster);
    setImpersonating(null);
    bump();
  }, [bump]);

  const impersonar = useCallback((tenantId: string, tenantName: string) => {
    // Admin opera como o tenant na superfície B (papel gestor = nav larga), banner fixo (§4).
    setImpersonating({ tenantId, tenantName });
    setPapel("gestor");
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
    subcontratados.push({ ...s, id });
    bump();
    return id;
  }, [bump]);

  const classificarProduto = useCallback<SessionCtx["classificarProduto"]>((id, patch) => {
    const p = produtosIDTF.find((x) => x.id === id);
    if (p) {
      p.statusClassificacao = "classificado";
      p.regimeAntesDeFeed = patch.regimeAntesDeFeed;
      p.bloqueiaFeed = patch.bloqueiaFeed;
      if (patch.idtfCode) p.idtfCode = patch.idtfCode;
      p.versaoBase = VERSAO_BASE_IDTF;
      bump();
    }
  }, [bump]);

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

  const addExcecao = useCallback<SessionCtx["addExcecao"]>((i) => {
    const id = nextId("exc");
    excecoes.unshift({ ...i, id, status: "pendente" });
    bump();
    return id;
  }, [bump]);

  const decidirExcecao = useCallback<SessionCtx["decidirExcecao"]>((id, status) => {
    const e = excecoes.find((x) => x.id === id);
    if (!e) return false;
    // Gate de autoridade (pergunta 04): quem não pode aprovar, não decide. Defesa no
    // store além de esconder o botão — impede persistir uma liberação por papel errado.
    if (!podeAprovarExcecao(papel, e.nivelRequerido)) return false;
    e.status = status;
    e.aprovador = `${PAPEL_LABEL[papel]} · aprovação simulada`;
    e.decididoEm = `${HOJE}T10:00:00`;
    // Aprovada → destrava a viagem bloqueada (Bloqueada → Agendada).
    if (status === "aprovada" && e.viagemId) {
      const v = viagens.find((x) => x.id === e.viagemId);
      if (v && v.status === "Bloqueada") { v.status = "Agendada"; v.alertas = 0; }
    }
    bump();
    return true;
  }, [papel, bump]);

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
    addViagem,
    addNaoConformidade,
    updateNCCapa,
    addCavalo,
    addImplemento,
    addCompartimento,
    addSubcontratado,
    classificarProduto,
    addCleaningEvent,
    addInspectionEvent,
    updateViagemStatus,
    trocarVeiculo,
    addExcecao,
    decidirExcecao,
    addLote,
    updateLoteStatus,
    addFazenda,
    addMotorista,
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
