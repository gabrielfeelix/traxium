// TRAXIUM — rótulos operacionais do resultado IDTF (Fase 8).
//
// O motor decide em três tiers (BLOQUEIO/ALERTA/LIBERADO) porque é assim que a
// operação se comporta. Mas a diretriz §Pilar 3 pede que o RESULTADO seja dito
// no vocabulário de quem carrega: "liberado após limpeza C" é acionável;
// "BLOQUEIO" não diz o que fazer.
//
// São nove rótulos, e a diferença entre dois deles é o ponto do pilar:
// "Liberado após limpeza X" quer dizer que a limpeza resolve; "Necessita
// procedimento especial" quer dizer que não resolve — tem laudo, liberação
// formal ou evidência específica pelo meio.

import {
  ORDEM_REGIME,
  compartimentoPorViagem,
  produtoAtualPorViagem,
  findProduto,
  limpezasApos,
  type Regime,
  type ProdutoIDTF,
} from "./model";
import { avaliarCarregamento, getT3 } from "./rules-engine";

export type RotuloOperacional =
  | "Liberado"
  | "Liberado após limpeza A"
  | "Liberado após limpeza B"
  | "Liberado após limpeza C"
  | "Liberado após limpeza D"
  | "Necessita procedimento especial"
  | "Carga anterior proibida"
  | "Produto não identificado"
  | "Aguardando análise da Qualidade";

/** Os nove, na ordem em que a diretriz os lista. */
export const ROTULOS_OPERACIONAIS: RotuloOperacional[] = [
  "Liberado",
  "Liberado após limpeza A",
  "Liberado após limpeza B",
  "Liberado após limpeza C",
  "Liberado após limpeza D",
  "Necessita procedimento especial",
  "Carga anterior proibida",
  "Produto não identificado",
  "Aguardando análise da Qualidade",
];

export type ResultadoIDTF = {
  rotulo: RotuloOperacional;
  /** Por que este rótulo, em uma frase. */
  motivo: string;
  /** O que fazer a seguir. Vazio em "Liberado" — não há próximo passo. */
  acao: string;
  tom: "ok" | "acao" | "bloqueio";
};

function rotuloLimpeza(r: Regime): RotuloOperacional {
  return `Liberado após limpeza ${r}` as RotuloOperacional;
}

export type EntradaIDTF = {
  /** Produto que vai subir. `undefined` = a base não reconheceu o nome. */
  atual?: ProdutoIDTF;
  /** Carga determinante do compartimento. `undefined` = T-3 não diz. */
  anterior?: ProdutoIDTF;
  /** Regime efetivamente evidenciado após a carga anterior. */
  regimeAplicado?: Regime | null;
  /**
   * Nota de contexto quando a carga está liberada pela IDTF mas travada por
   * outra condição do motor (certificado, competência, checklist). Sem isso o
   * rótulo diria "Liberado" para uma viagem que não sai — verdadeiro sobre a
   * base, enganoso sobre a operação.
   */
  travadaPor?: string;
};

/**
 * Rótulo operacional a partir do cruzamento cru — carga anterior, produto atual
 * e limpeza aplicada. Puro: serve tanto para uma viagem existente quanto para a
 * consulta "posso carregar X sobre Y?" antes de a viagem existir.
 *
 * A ordem importa e é a da severidade do fato, não a da tela: produto que a base
 * não reconhece vem antes de qualquer regime, porque sem saber o que é a carga
 * não há regra de limpeza a aplicar.
 */
export function resultadoIDTF({ atual, anterior, regimeAplicado, travadaPor }: EntradaIDTF): ResultadoIDTF {
  // 1. Sem produto resolvido não há regra: a base não sabe o que está subindo.
  if (!atual) {
    return {
      rotulo: "Produto não identificado",
      motivo: "O produto declarado não resolveu para nenhum item da base IDTF.",
      acao: "Cadastrar o produto ou corrigir o nome na ordem de carregamento.",
      tom: "bloqueio",
    };
  }

  // 2. Reconhecido, mas ainda sem decisão formal da Qualidade.
  if (atual.statusClassificacao === "em_fila") {
    return {
      rotulo: "Aguardando análise da Qualidade",
      motivo: `${atual.nomeCanonico} está na fila de classificação da base.`,
      acao: "Classificar o produto no Motor IDTF antes de liberar o uso.",
      tom: "bloqueio",
    };
  }

  // 3. Carga anterior proibida: limpeza nenhuma resolve sozinha.
  if (anterior?.bloqueiaFeed) {
    return {
      rotulo: "Carga anterior proibida",
      motivo: `A carga determinante do compartimento foi ${anterior.nomeCanonico}, proibida antes de feed.`,
      acao: "Procedimento formal de liberação com Regime D evidenciado e laudo assinado.",
      tom: "bloqueio",
    };
  }

  const exigido = anterior?.regimeAntesDeFeed;
  const aplicado = regimeAplicado ?? undefined;
  const limpezaOk = Boolean(exigido && aplicado && ORDEM_REGIME[aplicado] >= ORDEM_REGIME[exigido]);

  // 4. Restrição da base é procedimento, não limpeza: laudo, segregação, ensaio.
  const restricoes = [...(anterior?.restricoes ?? []), ...(atual.restricoes ?? [])];
  if (restricoes.length) {
    return {
      rotulo: "Necessita procedimento especial",
      motivo: `A base impõe exigência além da limpeza: ${restricoes[0]}`,
      acao: limpezaOk
        ? "Anexar a evidência exigida pela restrição antes de liberar."
        : `Executar Regime ${exigido ?? "exigido"} e anexar a evidência da restrição.`,
      tom: "acao",
    };
  }

  // 5. Falta a limpeza que resolve — e o rótulo diz qual.
  if (exigido && !limpezaOk) {
    return {
      rotulo: rotuloLimpeza(exigido),
      motivo: aplicado
        ? `Limpeza aplicada (Regime ${aplicado}) é insuficiente para a carga anterior ${anterior?.nomeCanonico}.`
        : `Nenhuma limpeza evidenciada após ${anterior?.nomeCanonico}.`,
      acao: `Executar limpeza Regime ${exigido} com evidência e reavaliar.`,
      tom: "acao",
    };
  }

  // 6. Sem T-3 não há como afirmar nada sobre a carga anterior.
  if (!exigido) {
    return {
      rotulo: "Necessita procedimento especial",
      motivo: "Sem histórico T-3 completo não há carga anterior conhecida para derivar o regime.",
      acao: "Registrar as cargas anteriores do compartimento e reavaliar.",
      tom: "bloqueio",
    };
  }

  return {
    rotulo: "Liberado",
    motivo: travadaPor
      ? `Do ponto de vista da IDTF a carga está liberada; o bloqueio vem de outra condição (${travadaPor}).`
      : `Regime ${aplicado} aplicado e evidenciado; a base não impõe restrição adicional.`,
    acao: travadaPor ? "Resolver a condição pendente fora da IDTF." : "",
    tom: travadaPor ? "acao" : "ok",
  };
}

/** Rótulo operacional de uma viagem existente — monta a entrada a partir do store. */
export function rotuloOperacional(viagemId: string): ResultadoIDTF {
  const decisao = avaliarCarregamento(viagemId);
  const compartimentoId = compartimentoPorViagem[viagemId];
  const t3 = compartimentoId ? getT3(compartimentoId) : [];
  const limpezas = compartimentoId ? limpezasApos(compartimentoId, t3[0]?.load.data ?? "1970-01-01") : [];

  return resultadoIDTF({
    atual: findProduto(produtoAtualPorViagem[viagemId] ?? ""),
    anterior: t3[0]?.produto,
    regimeAplicado: limpezas[0]?.regime ?? null,
    travadaPor: decisao.tier === "LIBERADO" ? undefined : decisao.regra,
  });
}
