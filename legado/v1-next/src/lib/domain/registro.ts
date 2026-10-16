// TRAXIUM — as classes `registro` e `informacao` com efeito na tela (Fase 10.1).
//
// A Fase 5 deu quatro classes ao motor, mas só duas mudavam alguma coisa:
// `bloqueio` impedia e `alerta` escalava. `registro` e `informacao` existiam no
// tipo e não faziam nada — configuração sem consequência é decoração.
//
// Aqui elas ganham comportamento, e a diferença entre as duas é o ponto:
//   · `registro` OPERA, mas não FECHA sem a evidência anexada. A carga anda; a
//     viagem não é concluída enquanto faltar o que a norma manda registrar.
//   · `informacao` não interfere em nada. Aparece no dossiê e no detalhe da
//     viagem porque o auditor vai perguntar, e só.

import { HOJE } from "./model";
import { classeDe, REGRA_CHECAGEM, type RegraId } from "./motor-config";
import { avaliarCarregamento } from "./rules-engine";
import { viagens } from "@/lib/mock-data";

export type AnexoRegistro = {
  id: string;
  viagemId: string;
  regra: RegraId;
  descricao: string;
  anexadoPor: string;
  anexadoEm: string;
};

/** Store append-only: evidência anexada não se desfaz, se retifica. */
export const anexosRegistro: AnexoRegistro[] = [];

export function anexosDaViagem(viagemId: string): AnexoRegistro[] {
  return anexosRegistro.filter((a) => a.viagemId === viagemId);
}

export type ItemClasse = { regra: RegraId; nome: string; detalhe: string; anexo?: AnexoRegistro };

/**
 * O que a viagem precisa registrar antes de fechar: regras de classe `registro`
 * que falharam e ainda não têm evidência anexada.
 */
export function pendenciasDeRegistro(viagemId: string): ItemClasse[] {
  const anexos = anexosDaViagem(viagemId);
  return avaliarCarregamento(viagemId)
    .checagens.filter((c) => !c.ok && classeDe(c.regra) === "registro")
    .map((c) => ({
      regra: c.regra,
      nome: c.nome,
      detalhe: c.detalhe,
      anexo: anexos.find((a) => a.regra === c.regra),
    }))
    .filter((i) => !i.anexo);
}

/** Registros já cumpridos — o que foi anexado, por quem e quando. */
export function registrosCumpridos(viagemId: string): ItemClasse[] {
  const anexos = anexosDaViagem(viagemId);
  return avaliarCarregamento(viagemId)
    .checagens.filter((c) => classeDe(c.regra) === "registro")
    .map((c) => ({ regra: c.regra, nome: c.nome, detalhe: c.detalhe, anexo: anexos.find((a) => a.regra === c.regra) }))
    .filter((i) => Boolean(i.anexo));
}

/** Classe `informacao`: entra no dossiê, não interfere na decisão nem no fecho. */
export function informacoesComplementares(viagemId: string): ItemClasse[] {
  return avaliarCarregamento(viagemId)
    .checagens.filter((c) => !c.ok && classeDe(c.regra) === "informacao")
    .map((c) => ({ regra: c.regra, nome: c.nome, detalhe: c.detalhe }));
}

export function anexarRegistro(i: {
  viagemId: string;
  regra: RegraId;
  descricao: string;
  anexadoPor: string;
}): AnexoRegistro | null {
  if (!i.descricao.trim()) return null;
  // Só faz sentido anexar contra regra que a configuração classifica como
  // registro obrigatório: anexo solto em regra de bloqueio daria a impressão de
  // ter resolvido o que não se resolve com papel.
  if (classeDe(i.regra) !== "registro") return null;
  const anexo: AnexoRegistro = {
    id: `anx-${anexosRegistro.length + 1}`,
    viagemId: i.viagemId,
    regra: i.regra,
    descricao: i.descricao.trim(),
    anexadoPor: i.anexadoPor,
    anexadoEm: `${HOJE}T10:00:00`,
  };
  anexosRegistro.unshift(anexo);
  return anexo;
}

export type VeredictoFecho = { ok: boolean; motivo: string };

/**
 * Pode concluir a viagem?
 *
 * Duas travas, nesta ordem: carga que o motor bloqueia não fecha (concluir seria
 * afirmar que a operação aconteceu conforme), e viagem com registro obrigatório
 * pendente também não — é exatamente para isso que a classe existe.
 */
export function podeConcluir(viagemId: string): VeredictoFecho {
  const v = viagens.find((x) => x.id === viagemId);
  if (!v) return { ok: false, motivo: "Viagem não encontrada." };
  if (v.status === "Concluída") return { ok: false, motivo: "Viagem já concluída." };

  const d = avaliarCarregamento(viagemId);
  if (d.tier === "BLOQUEIO")
    return { ok: false, motivo: `Carga bloqueada pelo motor (${d.regra}). Concluir afirmaria uma conformidade que não existe.` };

  const pend = pendenciasDeRegistro(viagemId);
  if (pend.length)
    return {
      ok: false,
      motivo: `Falta anexar evidência de ${pend.length} registro(s) obrigatório(s): ${pend.map((p) => REGRA_CHECAGEM[p.regra]).join(", ")}.`,
    };

  return { ok: true, motivo: "Registros obrigatórios cumpridos e nenhuma condição bloqueando." };
}
