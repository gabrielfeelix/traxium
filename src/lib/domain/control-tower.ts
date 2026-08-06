// TRAXIUM — Control Tower (Fase 3)
//
// O motor de regras diz SE a carga é conforme. Esta camada diz o que fazer com
// isso: libera sozinha o que está conforme, escala ao humano só o que sobra e
// registra quem tinha autoridade para cada decisão.
//
// Duas afirmações que o resto do produto depende:
//   1. Verde não é "ninguém olhou" — é "o motor decidiu, com regra e evidência".
//   2. Vermelho técnico não tem botão de aprovar. Nenhuma assinatura substitui
//      um certificado vencido ou uma limpeza que não aconteceu. O que derruba
//      um bloqueio técnico é a regularização do fato, não a hierarquia.

import {
  excecoes,
  HOJE,
  FOTOS_MINIMAS,
  compartimentoPorViagem,
  inspecaoDaViagem,
  documentosDaViagem,
  limpezasApos,
  NIVEL_CURTO,
  type Excecao,
  type NivelAutoridade,
} from "./model";
import { avaliarCarregamento, getT3, type Decisao } from "./rules-engine";
import { ORDEM_CLASSE, REGRA_LABEL, type RegraId } from "./motor-config";
import type { Viagem } from "@/lib/mock-data";

export type Faixa = "verde" | "amarelo" | "vermelho";

/**
 * Tempo em fila (PDF §Control Tower, painel administrativo).
 *
 * Conta contra `HOJE` do protótipo, não contra `Date.now()`: a linha do tempo
 * dos dados é fixa, então o relógio real faria a idade crescer sozinha e mentir.
 */
export function tempoEmFila(desde: string): { horas: number; dias: number; rotulo: string } {
  const ms = new Date(`${HOJE}T12:00:00`).getTime() - new Date(desde).getTime();
  const horas = Math.max(0, Math.floor(ms / 3_600_000));
  const dias = Math.floor(horas / 24);
  const rotulo = horas < 1 ? "agora" : horas < 24 ? `há ${horas}h` : `há ${dias}d`;
  return { horas, dias, rotulo };
}

/** Quem liberou de fato. `null` = ninguém liberou ainda (amarelo/vermelho). */
export type Liberador = "motor" | "autoridade" | null;

// ─────────────────────────────────────────────────────────────────────────────
// Autoridade por regra do motor
//
// Mapeia cada `Decisao.regra` ao nível que pode liberá-la. `tecnico` é o nível
// de ninguém: existe para tornar explícito no modelo o que a matriz de exceções
// já dizia em texto ("Crítico — sem liberação operacional").
// ─────────────────────────────────────────────────────────────────────────────

const AUTORIDADE_POR_REGRA: Record<string, NivelAutoridade> = {
  // Fatos que nenhuma assinatura desfaz — só a regularização.
  "Compartimento não vinculado": "tecnico",
  "T-3 ausente/incompleto": "tecnico",
  "Carga anterior proibida": "tecnico",
  "Limpeza incompatível": "tecnico",
  "Certificado vencido/incompatível": "tecnico",
  // Acrescentadas na Fase 5, junto com as condições que faltavam no verde.
  // Cadastro e acordo são fato documental: nenhuma autoridade os substitui.
  "Subcontratado não apto": "tecnico",
  "Acordo de qualidade não vigente": "tecnico",
  // Competência resolve-se registrando a trilha — quem pode fazer isso é a
  // Qualidade, não uma assinatura de exceção.
  "Competência do motorista": "gestor",
  "Produto não reconhecido": "gestor",
  // Condição física do compartimento (Fase 7): quem esteve no pátio atesta o
  // que viu. Gestor e diretoria continuam cobrindo, porque autoridade escala
  // para cima — o que não existe é decidir sem ter olhado.
  "Checklist reprovado": "inspetor",
  "Fotos mínimas ausentes": "inspetor",
  // Pendência simples, sem risco de feed: é do tráfego (Fase 7). Certificado
  // que VENCEU é outra coisa e continua em `tecnico`, logo acima.
  "Pendência sem risco direto": "trafego",
  "Inspeção pendente de sincronização": "trafego",
};

/** Nível exigido para liberar um bloqueio/alerta do motor. Desconhecido → gestor. */
export function autoridadeDaRegra(regra: string): NivelAutoridade {
  return AUTORIDADE_POR_REGRA[regra] ?? "gestor";
}

/** Bloqueio que nenhuma autoridade libera — só a regularização do fato. */
export function ehBloqueioTecnico(regra: string): boolean {
  return autoridadeDaRegra(regra) === "tecnico";
}

// ─────────────────────────────────────────────────────────────────────────────
// Triagem
// ─────────────────────────────────────────────────────────────────────────────

export type ItemTriagem = {
  viagem: Viagem;
  decisao: Decisao;
  faixa: Faixa;
  /** Nível que pode liberar. Em verde do motor, não se aplica. */
  autoridade: NivelAutoridade;
  /** Decidido sem humano nenhum no caminho. */
  automatica: boolean;
  liberadaPor: Liberador;
  /** Exceção humana associada à viagem, se alguém já pediu análise. */
  excecao?: Excecao;
};

function excecaoDaViagem(viagemId: string): Excecao | undefined {
  // A mais recente vence: `addExcecao` insere no topo.
  return excecoes.find((e) => e.viagemId === viagemId);
}

/**
 * Classifica uma viagem na faixa do Control Tower.
 *
 * Uma exceção aprovada libera a viagem SOBRE um bloqueio do motor — e o motor
 * continua reprovando, porque o fato não mudou. Guardamos os dois: a faixa vira
 * verde (opera), mas `liberadaPor: "autoridade"` mantém no registro que foi
 * decisão humana sobre bloqueio, não conformidade. É o que o auditor cobra.
 */
export function triarViagem(viagem: Viagem): ItemTriagem {
  const decisao = avaliarCarregamento(viagem.id);
  const autoridade = autoridadeDaRegra(decisao.regra);
  const exc = excecaoDaViagem(viagem.id);

  if (decisao.tier === "LIBERADO") {
    return { viagem, decisao, faixa: "verde", autoridade, automatica: true, liberadaPor: "motor" };
  }

  if (exc?.status === "aprovada") {
    return { viagem, decisao, faixa: "verde", autoridade, automatica: false, liberadaPor: "autoridade", excecao: exc };
  }

  return {
    viagem,
    decisao,
    faixa: decisao.tier === "ALERTA" ? "amarelo" : "vermelho",
    autoridade,
    automatica: false,
    liberadaPor: null,
    excecao: exc,
  };
}

/** Triagem de uma lista de viagens. Concluídas ficam de fora: nada a decidir. */
export function triarViagens(lista: Viagem[]): ItemTriagem[] {
  return lista.filter((v) => v.status !== "Concluída").map(triarViagem);
}

// ─────────────────────────────────────────────────────────────────────────────
// Painel da fila (Fase 7.5) — risco, evidência e o que se espera de alguém
//
// Três perguntas que a diretriz pede na fila e que a tela não respondia: qual o
// risco de feed deste item, quais evidências essenciais existem, e o que está
// pendente de resposta. As três se derivam do que já está no store — nada aqui
// é campo novo nem número plausível.
// ─────────────────────────────────────────────────────────────────────────────

export type NivelRisco = "critico" | "alto" | "medio" | "baixo" | "nenhum";

export type RiscoGMP = {
  nivel: NivelRisco;
  rotulo: string;
  motivo: string;
  /** Quantas condições do motor falharam. */
  falhas: number;
};

const RISCO_ROTULO: Record<NivelRisco, string> = {
  critico: "Risco crítico",
  alto: "Risco alto",
  medio: "Risco médio",
  baixo: "Risco baixo",
  nenhum: "Sem risco aberto",
};

/**
 * Risco GMP+ do carregamento, derivado da decisão do motor.
 *
 * Crítico não é "muitas falhas": é falha que ninguém libera — contaminação,
 * limpeza ausente, certificado vencido. Uma viagem com seis pendências
 * corrigíveis é menos perigosa para o feed do que uma com uma carga proibida.
 */
export function riscoGMP(decisao: Decisao): RiscoGMP {
  const falhas = decisao.checagens.filter((c) => !c.ok);
  if (!falhas.length) {
    return { nivel: "nenhum", rotulo: RISCO_ROTULO.nenhum, motivo: "Todas as condições avaliadas passaram.", falhas: 0 };
  }

  const tecnicas = falhas.filter((c) => ehBloqueioTecnico(REGRA_LABEL[c.regra]));
  if (tecnicas.length) {
    return {
      nivel: "critico",
      rotulo: RISCO_ROTULO.critico,
      motivo: `${tecnicas.length} condição(ões) que nenhuma autoridade libera: ${tecnicas.map((c) => c.nome).join(", ")}.`,
      falhas: falhas.length,
    };
  }

  const pior = falhas.reduce((a, b) => (ORDEM_CLASSE[b.classe] > ORDEM_CLASSE[a.classe] ? b : a));
  const nivel: NivelRisco = pior.classe === "bloqueio" ? "alto" : pior.classe === "alerta" ? "medio" : "baixo";
  return {
    nivel,
    rotulo: RISCO_ROTULO[nivel],
    motivo: `${falhas.length} condição(ões) pendente(s); a mais severa é ${pior.nome}.`,
    falhas: falhas.length,
  };
}

export type ChaveEvidencia = "t3" | "limpeza" | "inspecao" | "fotos" | "assinatura" | "documentos";

export type EvidenciaEssencial = {
  chave: ChaveEvidencia;
  rotulo: string;
  ok: boolean;
  detalhe: string;
};

/**
 * As seis evidências essenciais de um carregamento, na ordem em que a operação
 * as produz. Ausente aparece como ausente: a miniatura serve justamente para
 * ler de relance o que falta antes de abrir a viagem.
 */
export function evidenciasEssenciais(viagemId: string): EvidenciaEssencial[] {
  const compartimentoId = compartimentoPorViagem[viagemId];
  const t3 = compartimentoId ? getT3(compartimentoId) : [];
  const insp = inspecaoDaViagem(viagemId);
  const limpezas = compartimentoId ? limpezasApos(compartimentoId, t3[0]?.load.data ?? "1970-01-01") : [];
  const docs = documentosDaViagem(viagemId);

  return [
    {
      chave: "t3",
      rotulo: "Histórico T-3",
      ok: t3.length >= 3,
      detalhe: `${t3.length} de 3 cargas anteriores`,
    },
    {
      chave: "limpeza",
      rotulo: "Limpeza evidenciada",
      ok: limpezas.length > 0,
      detalhe: limpezas[0] ? `Regime ${limpezas[0].regime} em ${limpezas[0].data}` : "Nenhuma após a última carga",
    },
    {
      chave: "inspecao",
      rotulo: "Inspeção pré-carregamento",
      ok: insp?.resultado === "aprovado",
      detalhe: insp ? `${insp.resultado} (${insp.itensOk}/${insp.itensTotal})` : "Sem inspeção registrada",
    },
    {
      chave: "fotos",
      rotulo: "Fotos guiadas",
      ok: (insp?.fotos ?? 0) >= FOTOS_MINIMAS,
      detalhe: `${insp?.fotos ?? 0} de ${FOTOS_MINIMAS} ângulos`,
    },
    {
      chave: "assinatura",
      rotulo: "Assinatura do checklist",
      ok: Boolean(insp?.assinatura),
      detalhe: insp?.assinatura ? `${insp.assinatura.nome} · ${insp.assinatura.dispositivo}` : "Não assinado",
    },
    {
      chave: "documentos",
      rotulo: "Documentos da viagem",
      ok: docs.some((doc) => doc.situacao === "Autorizado"),
      detalhe: docs.length ? `${docs.length} documento(s), ${docs.filter((doc) => doc.situacao === "Autorizado").length} autorizado(s)` : "Nenhum emitido",
    },
  ];
}

export type PendenciaResposta = {
  rotulo: string;
  /** Desde quando espera. Ausente = a entidade não guarda carimbo — não se inventa. */
  desde?: string;
};

/**
 * O que está pendente de resposta de alguém nesta viagem.
 *
 * Não existe entidade de notificação no protótipo, e fabricar "enviado em" seria
 * inventar. Cada linha aqui é um fato do store que só sai do lugar quando
 * alguém age: exceção sem decisão, evidência offline sem sincronizar,
 * competência sem registro, acordo sem assinatura.
 */
export function pendenciasDeResposta(viagemId: string): PendenciaResposta[] {
  const pend: PendenciaResposta[] = [];
  const exc = excecaoDaViagem(viagemId);
  if (exc?.status === "pendente") {
    pend.push({
      rotulo:
        exc.nivelRequerido === "tecnico"
          ? "Exceção sem caminho de aprovação — espera regularização, não decisão"
          : `Exceção aguardando decisão de ${NIVEL_CURTO[exc.nivelRequerido]}`,
      desde: exc.solicitadoEm,
    });
  }

  const insp = inspecaoDaViagem(viagemId);
  if (insp?.offline) pend.push({ rotulo: "Evidência offline aguardando sincronização", desde: insp.dataHora });

  const d = avaliarCarregamento(viagemId);
  const falhou = (r: RegraId) => d.checagens.some((c) => c.regra === r && !c.ok);
  if (falhou("competencia_motorista")) pend.push({ rotulo: "Trilha pendente de registro na Academy" });
  if (falhou("acordo_vigente")) pend.push({ rotulo: "Acordo de qualidade aguardando assinatura" });
  if (falhou("produto_reconhecido")) pend.push({ rotulo: "Produto aguardando classificação da Qualidade" });

  return pend;
}

export type Automacao = {
  /** Liberadas pelo motor, sem humano. */
  auto: number;
  /** Liberadas por decisão humana sobre bloqueio/alerta. */
  humano: number;
  /** Ainda na fila, aguardando alguém. */
  pendente: number;
  /** Total triado (viagens ativas). */
  total: number;
  /** % do total em rota que o motor resolveu sozinho. `null` se não há viagem ativa. */
  pct: number | null;
};

/**
 * Taxa de automação sobre TUDO que está em rota, pendentes incluídos.
 *
 * Medir só sobre o que já foi resolvido dá 100% sempre que ninguém aprovou
 * exceção — inclusive com a fila cheia de bloqueio. O número que interessa é
 * quanto do trabalho nunca chegou a uma mesa: fila grande tem que puxar a taxa
 * para baixo, porque é exatamente isso que ela significa.
 */
export function automacao(itens: ItemTriagem[]): Automacao {
  const auto = itens.filter((i) => i.liberadaPor === "motor").length;
  const humano = itens.filter((i) => i.liberadaPor === "autoridade").length;
  const pendente = itens.length - auto - humano;
  return {
    auto,
    humano,
    pendente,
    total: itens.length,
    pct: itens.length > 0 ? Math.round((auto / itens.length) * 100) : null,
  };
}
