// TRAXIUM — os 15 indicadores do MVP (§8 da diretriz · Fase 10.3).
//
// Regra desta tela, e a razão de ela existir: **indicador que não pode ser
// medido aparece como não medido**. Um protótipo sem backend não tem telemetria
// de tempo de preenchimento; inventar "8 minutos para cadastrar um TAC" seria
// mentir com aparência de dado, e é exatamente o tipo de número que ninguém
// confere e todo mundo repete em reunião.
//
// Onze saem do store. Quatro dependem de telemetria que não existe e dizem o
// que falta para passarem a existir.

import {
  subcontratados,
  inspecaoDaViagem,
  estadoQualificacao,
  ESTADO_QUALIFICACAO,
  excecoes,
  FOTOS_MINIMAS,
  compartimentoPorViagem,
  subcontratadoNaData,
  HOJE,
} from "./model";
import { competenciaMotorista } from "./academy";
import { getT3 } from "./rules-engine";
import { triarViagens, automacao, tempoEmFila, ehBloqueioTecnico } from "./control-tower";
import { registrosLiberacao } from "./liberacao";
import { viagens, motoristas, naoConformidades } from "@/lib/mock-data";

export type Indicador = {
  id: string;
  nome: string;
  /** O que a diretriz quer saber com este número. */
  pergunta: string;
  /** `null` quando não é medível — e aí `porqueNaoMedido` explica. */
  valor: number | null;
  unidade: "%" | "un" | "dias";
  /** De onde o número sai. Auditar um indicador começa por aqui. */
  fonte: string;
  porqueNaoMedido?: string;
  /** Quanto maior, melhor? Usado só para a cor, nunca para o valor. */
  sentido: "maior_melhor" | "menor_melhor" | "neutro";
};

function pct(parte: number, total: number): number | null {
  return total > 0 ? Math.round((parte / total) * 100) : null;
}

/**
 * Calcula os 15 no momento da chamada. Nada é cacheado: o store muta in-place e
 * um indicador velho é pior do que indicador nenhum.
 */
export function indicadores(): Indicador[] {
  const ativas = viagens.filter((v) => v.status !== "Concluída");
  const triagem = triarViagens(viagens);
  const auto = automacao(triagem);
  const aguardando = triagem.filter((t) => t.liberadaPor === null);

  const comT3 = viagens.filter((v) => getT3(compartimentoPorViagem[v.id] ?? "").length >= 3).length;
  const comFotos = viagens.filter((v) => (inspecaoDaViagem(v.id)?.fotos ?? 0) >= FOTOS_MINIMAS).length;
  const inspecoes = viagens.map((v) => inspecaoDaViagem(v.id)).filter(Boolean);
  const inspecoesAprovadas = inspecoes.filter((i) => i!.resultado === "aprovado").length;

  const motoristasElegiveis = motoristas.filter((m) => competenciaMotorista(m.id).elegivel).length;
  const empresasAptas = subcontratados.filter(
    (s) => !s.arquivadoEm && ESTADO_QUALIFICACAO[estadoQualificacao(s).estado].opera
  ).length;
  const empresasAtivas = subcontratados.filter((s) => !s.arquivadoEm).length;

  const bloqueiosTecnicos = aguardando.filter((t) => ehBloqueioTecnico(t.decisao.regra)).length;
  const excecoesPendentes = excecoes.filter((e) => e.status === "pendente");
  const idadeMedia = excecoesPendentes.length
    ? Math.round(
        excecoesPendentes.reduce((n, e) => n + tempoEmFila(e.solicitadoEm).dias, 0) / excecoesPendentes.length
      )
    : null;

  const aprovadas = excecoes.filter((e) => e.status === "aprovada");
  const comRegistroCompleto = aprovadas.filter((e) =>
    registrosLiberacao.some((r) => r.excecaoId === e.id)
  ).length;

  // Duplicidade medida no cadastro que existe, não na importação: a importação
  // recusa duplicata na entrada, e o que interessa aqui é o passivo acumulado.
  const chaveCadastro = (s: (typeof subcontratados)[number]) => [
    s.cnpj.replace(/\D/g, ""),
    s.razaoSocial.trim().toLowerCase().replace(/\s+/g, " "),
  ];
  const repetidos = subcontratados.filter((s, _, arr) => {
    const [cnpj, razao] = chaveCadastro(s);
    return arr.some((o) => o !== s && (chaveCadastro(o)[0] === cnpj || chaveCadastro(o)[1] === razao));
  }).length;
  const pctDuplicados = pct(repetidos, subcontratados.length);
  // A NC não guarda a empresa: guarda placa e motorista. Quem responde por ela
  // sai do vínculo vigente NA DATA da ocorrência — é para isso que a tabela de
  // vínculo com vigência existe (Fase 9.1).
  const empresaDaNC = (n: (typeof naoConformidades)[number]): string | undefined => {
    const data = n.abertaEm.slice(0, 10);
    if (n.veiculo) {
      const placa = n.veiculo.split(/[^A-Z0-9-]/i).find((p) => /[A-Z]{3}-?\d/i.test(p)) ?? n.veiculo;
      const porPlaca = subcontratadoNaData("implemento", placa, data);
      if (porPlaca) return porPlaca;
    }
    if (n.motorista) {
      const m = motoristas.find((x) => x.nome === n.motorista);
      if (m) return subcontratadoNaData("motorista", m.id, data);
    }
    return undefined;
  };
  const porEmpresa = naoConformidades.map(empresaDaNC).filter((x): x is string => Boolean(x));
  const reincidentes = new Set(porEmpresa.filter((s, _, arr) => arr.filter((x) => x === s).length > 1)).size;

  return [
    {
      id: "automacao",
      nome: "Operações liberadas automaticamente",
      pergunta: "Quanto do trabalho nunca chegou à mesa de ninguém?",
      valor: auto.pct,
      unidade: "%",
      fonte: "control-tower · automacao() sobre todas as viagens em rota, pendentes incluídos.",
      sentido: "maior_melhor",
    },
    {
      id: "t3_completo",
      nome: "Viagens com histórico T-3 completo",
      pergunta: "Em quantas cargas dá para afirmar algo sobre contaminação cruzada?",
      valor: pct(comT3, viagens.length),
      unidade: "%",
      fonte: "rules-engine · getT3() por compartimento da viagem.",
      sentido: "maior_melhor",
    },
    {
      id: "competencia",
      nome: "Motoristas com treinamento vigente",
      pergunta: "Quantos condutores estão elegíveis para operar hoje?",
      valor: pct(motoristasElegiveis, motoristas.length),
      unidade: "%",
      fonte: "academy · competenciaMotorista() sobre as trilhas obrigatórias.",
      sentido: "maior_melhor",
    },
    {
      id: "empresas_aptas",
      nome: "Subcontratados aptos a operar",
      pergunta: "Que parte da rede está qualificada neste momento?",
      valor: pct(empresasAptas, empresasAtivas),
      unidade: "%",
      fonte: "model · estadoQualificacao() das empresas não arquivadas.",
      sentido: "maior_melhor",
    },
    {
      id: "fotos_minimas",
      nome: "Viagens com evidência fotográfica completa",
      pergunta: "Quantas cargas têm os seis ângulos obrigatórios?",
      valor: pct(comFotos, viagens.length),
      unidade: "%",
      fonte: `model · inspecaoDaViagem().fotos contra FOTOS_MINIMAS (${FOTOS_MINIMAS}).`,
      sentido: "maior_melhor",
    },
    {
      id: "inspecoes_aprovadas",
      nome: "Inspeções pré-carregamento aprovadas",
      pergunta: "Qual a taxa de aprovação do checklist na primeira tentativa?",
      valor: pct(inspecoesAprovadas, inspecoes.length),
      unidade: "%",
      fonte: "model · inspectionEvents vinculados a viagem.",
      sentido: "maior_melhor",
    },
    {
      id: "bloqueios_tecnicos",
      nome: "Bloqueios técnicos abertos",
      pergunta: "Quantas cargas estão paradas por fato que nenhuma autoridade libera?",
      valor: bloqueiosTecnicos,
      unidade: "un",
      fonte: "control-tower · triagem com autoridade `tecnico`.",
      sentido: "menor_melhor",
    },
    {
      id: "idade_fila",
      nome: "Idade média da fila de exceções",
      pergunta: "Há quanto tempo, em média, uma exceção espera decisão?",
      valor: idadeMedia,
      unidade: "dias",
      fonte: `control-tower · tempoEmFila() contra a data de referência (${HOJE}).`,
      porqueNaoMedido: idadeMedia === null ? "Nenhuma exceção pendente para medir." : undefined,
      sentido: "menor_melhor",
    },
    {
      id: "liberacao_registrada",
      nome: "Liberações manuais com os nove campos",
      pergunta: "Que parte das liberações sobrevive a uma auditoria?",
      valor: pct(comRegistroCompleto, aprovadas.length),
      unidade: "%",
      fonte: "liberacao · registrosLiberacao cruzados com as exceções aprovadas.",
      porqueNaoMedido: aprovadas.length === 0 ? "Nenhuma exceção aprovada ainda." : undefined,
      sentido: "maior_melhor",
    },
    {
      id: "cadastros_duplicados",
      nome: "Cadastros duplicados na base",
      pergunta: "O cadastro está apodrecendo por empresa repetida?",
      valor: pctDuplicados,
      unidade: "%",
      fonte: "model · subcontratados com mesmo CNPJ (só dígitos) ou mesma razão social normalizada.",
      sentido: "menor_melhor",
    },
    {
      id: "reincidencia",
      nome: "Subcontratados com não conformidade reincidente",
      pergunta: "Quem repete o mesmo problema?",
      valor: reincidentes,
      unidade: "un",
      fonte: "naoConformidades atribuídas pela empresa que respondia pelo ativo na data da ocorrência (vínculo vigente).",
      sentido: "menor_melhor",
    },
    // ── Os quatro que dependem de telemetria inexistente ────────────────────
    {
      id: "tempo_cadastro_tac",
      nome: "Tempo médio para cadastrar um TAC",
      pergunta: "O onboarding cabe nos cinco minutos que a diretriz pede?",
      valor: null,
      unidade: "dias",
      fonte: "—",
      porqueNaoMedido:
        "Exige carimbar início e fim de cada sessão de onboarding. O protótipo grava o cadastro, não a duração — e um número estimado aqui não seria verificável.",
      sentido: "menor_melhor",
    },
    {
      id: "tempo_checklist",
      nome: "Tempo médio de preenchimento do checklist",
      pergunta: "Quanto tempo o motorista gasta no pátio?",
      valor: null,
      unidade: "dias",
      fonte: "—",
      porqueNaoMedido:
        "Depende de telemetria do app de campo (abertura, foto a foto, envio). Só a inspeção final é registrada.",
      sentido: "menor_melhor",
    },
    {
      id: "fotos_rejeitadas",
      nome: "Percentual de fotos rejeitadas",
      pergunta: "Quanta evidência volta por qualidade da imagem?",
      valor: null,
      unidade: "%",
      fonte: "—",
      porqueNaoMedido:
        "Não existe etapa de rejeição de foto no modelo: a inspeção guarda quantas vieram, não quantas foram recusadas.",
      sentido: "menor_melhor",
    },
    {
      id: "tempo_dossie",
      nome: "Tempo para gerar um dossiê",
      pergunta: "Em quanto tempo o auditor recebe a reconstrução?",
      valor: null,
      unidade: "dias",
      fonte: "—",
      porqueNaoMedido:
        "O dossiê é gerado na hora, sem fila; medir exigiria instrumentar a exportação. O indicador só faz sentido com volume real.",
      sentido: "menor_melhor",
    },
  ];
}

/** Quantos dos 15 são efetivamente medidos hoje. */
export function coberturaIndicadores(): { medidos: number; total: number } {
  const todos = indicadores();
  return { medidos: todos.filter((i) => i.valor !== null).length, total: todos.length };
}
