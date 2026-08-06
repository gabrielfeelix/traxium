"use client";

// Governança da base IDTF (Fase 8.3).
//
// Uma base traduzida sem governança é opinião com aparência de norma. Esta aba
// responde as perguntas que o auditor faz antes de olhar qualquer produto: qual
// versão está vigente, quem mantém, de que fonte veio, com que periodicidade se
// revisa, como um sinônimo entra e o que acontece quando a tradução diverge.

import { ShieldCheck, CalendarClock, BookMarked, Scale, GitCompareArrows } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GOVERNANCA_BASE, historicoBase, TIPO_ALTERACAO_LABEL, findProduto } from "@/lib/domain/model";
import { formatDate } from "@/lib/utils";

const ITENS = [
  {
    icon: BookMarked,
    titulo: "Fonte oficial",
    valor: GOVERNANCA_BASE.fonteOficial,
    nota: "A base brasileira é tradução operacional; a fonte prevalece em qualquer divergência.",
  },
  {
    icon: CalendarClock,
    titulo: "Procedimento de revisão",
    valor: GOVERNANCA_BASE.periodicidadeRevisao,
    nota: `Próxima revisão programada para ${formatDate(GOVERNANCA_BASE.proximaRevisao)}.`,
  },
  {
    icon: ShieldCheck,
    titulo: "Aprovação técnica de sinônimo",
    valor: GOVERNANCA_BASE.aprovacaoSinonimo,
    nota: `Responsável técnico: ${GOVERNANCA_BASE.responsavelTecnico}.`,
  },
  {
    icon: Scale,
    titulo: "Licenciamento",
    valor: GOVERNANCA_BASE.licenciamento,
    nota: "Cada decisão do motor grava a versão usada — é o que permite reconstruir a regra vigente na data.",
  },
  {
    icon: GitCompareArrows,
    titulo: "Divergência e produto não reconhecido",
    valor: GOVERNANCA_BASE.politicaDivergencia,
    nota: `Manutenção da base: ${GOVERNANCA_BASE.responsavelManutencao}.`,
  },
];

export function GovernancaBase() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle>Versão vigente</CardTitle>
              <CardDescription>
                É esta versão que fica gravada em cada decisão do motor, e é por ela que uma carga antiga se reconstrói.
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="font-mono text-[15px] font-bold text-brand-700">{GOVERNANCA_BASE.versao}</p>
              <p className="text-[10px] text-fg-soft num">vigente desde {formatDate(GOVERNANCA_BASE.vigenteDesde)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ITENS.map((i) => (
            <div key={i.titulo} className="rounded-lg border border-border-soft bg-bg p-3 flex gap-3">
              <span className="size-7 shrink-0 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center">
                <i.icon className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-fg">{i.titulo}</p>
                <p className="text-[11.5px] text-fg-muted mt-0.5 leading-relaxed">{i.valor}</p>
                <p className="text-[10.5px] text-fg-soft mt-1 leading-relaxed">{i.nota}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de alterações</CardTitle>
          <CardDescription>
            Toda mudança na base com data, versão, responsável, fonte e aprovação técnica. É o que responde “desde
            quando esta regra vale”.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="relative space-y-3">
            <span aria-hidden className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
            {historicoBase.map((h) => {
              const produto = h.produtoId ? findProduto(h.produtoId) : undefined;
              return (
                <li key={h.id} className="relative pl-5">
                  <span aria-hidden className="absolute left-0 top-1.5 size-[11px] rounded-full border-2 border-brand-500 bg-bg-elev" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-fg-muted num">{formatDate(h.data)}</span>
                    <Badge variant="outline" className="text-[9px]">{TIPO_ALTERACAO_LABEL[h.tipo]}</Badge>
                    <span className="font-mono text-[10px] text-fg-soft">{h.versao}</span>
                    {produto && <span className="text-[10px] text-brand-700 font-medium">{produto.nomeCanonico}</span>}
                  </div>
                  <p className="text-[12px] text-fg mt-0.5 leading-snug">{h.descricao}</p>
                  <p className="text-[10.5px] text-fg-soft mt-0.5">
                    {h.responsavel} · fonte: {h.fonte}
                    {h.aprovadoPor && ` · aprovado por ${h.aprovadoPor}`}
                  </p>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
