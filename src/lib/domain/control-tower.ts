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

import { excecoes, HOJE, type Excecao, type NivelAutoridade } from "./model";
import { avaliarCarregamento, type Decisao } from "./rules-engine";
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
  // Corrigível com evidência: o gestor valida a correção e libera.
  "Checklist reprovado": "gestor",
  // Alerta: opera, mas alguém assina o risco residual.
  "Pendência sem risco direto": "gestor",
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
