"use client";

// Configuração do motor de regras (diretriz §4: "cada regra deve ser
// classificada como bloqueio automático, alerta com justificativa, registro
// obrigatório ou informação complementar").
//
// Configurável não é negociável: as regras cujo piso é bloqueio aparecem
// travadas, com o motivo. Sem isso, a trava do bloqueio técnico da Fase 3
// seria contornável por esta tela.

import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import {
  ORDEM_REGRAS, REGRA_LABEL, REGRA_CHECAGEM, CLASSE_LABEL, CLASSE_DESC, CLASSE_MINIMA,
  MOTIVO_PISO, ORDEM_CLASSE, classeDe, regraTravada, type ClasseRegra, type RegraId,
} from "@/lib/domain/motor-config";
import { cn } from "@/lib/utils";

const CLASSES: ClasseRegra[] = ["bloqueio", "alerta", "registro", "informacao"];

const TOM: Record<ClasseRegra, string> = {
  bloqueio: "bg-danger-50 text-danger-700",
  alerta: "bg-warning-50 text-warning-700",
  registro: "bg-brand-50 text-brand-700",
  informacao: "bg-bg text-fg-muted",
};

export function MotorRegras() {
  const { version, setClasseRegraMotor } = useSession();
  const { toast } = useToast();
  void version;

  const travadas = ORDEM_REGRAS.filter(regraTravada).length;

  function alterar(regra: RegraId, classe: ClasseRegra) {
    const ok = setClasseRegraMotor(regra, classe);
    if (!ok) {
      toast("Classe recusada", {
        type: "error",
        desc: `${REGRA_LABEL[regra]} não pode ficar abaixo de ${CLASSE_LABEL[CLASSE_MINIMA[regra]]}.`,
      });
      return;
    }
    toast("Motor atualizado", {
      type: "info",
      desc: `${REGRA_LABEL[regra]} agora é ${CLASSE_LABEL[classe].toLowerCase()}. Vale nas próximas avaliações.`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Motor de regras</CardTitle>
        <CardDescription>
          Como cada condição entra na decisão. {travadas} das {ORDEM_REGRAS.length}{" "}
          regras são bloqueio técnico e não podem ser afrouxadas — o motor não tem &ldquo;aprovar mesmo assim&rdquo;,
          nem por configuração.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legenda das quatro classes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CLASSES.map((c) => (
            <div key={c} className="rounded-lg border border-border-soft p-2.5">
              <span className={cn("inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]", TOM[c])}>
                {CLASSE_LABEL[c]}
              </span>
              <p className="mt-1 text-[11px] text-fg-muted leading-snug">{CLASSE_DESC[c]}</p>
            </div>
          ))}
        </div>

        <ul className="divide-y divide-border-soft">
          {ORDEM_REGRAS.map((r, i) => {
            const atual = classeDe(r);
            const travada = regraTravada(r);
            return (
              <li
                key={r}
                className="flex items-start justify-between gap-4 py-3 animate-list-in"
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-semibold text-fg">{REGRA_LABEL[r]}</p>
                    <Badge variant="outline" className="text-[9px]">{REGRA_CHECAGEM[r]}</Badge>
                  </div>
                  {travada ? (
                    <p className="mt-1 flex items-start gap-1.5 text-[11px] text-danger-700">
                      <Lock className="size-3 shrink-0 mt-0.5" />
                      {MOTIVO_PISO[r]}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-fg-muted">
                      Pode ser endurecida; o mínimo é {CLASSE_LABEL[CLASSE_MINIMA[r]].toLowerCase()}.
                    </p>
                  )}
                </div>

                {travada ? (
                  <span className={cn("shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold", TOM[atual])}>
                    {CLASSE_LABEL[atual]}
                  </span>
                ) : (
                  <Select value={atual} onValueChange={(v) => alterar(r, v as ClasseRegra)}>
                    <SelectTrigger className="h-9 w-[210px] shrink-0"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CLASSES.map((c) => (
                        <SelectItem
                          key={c}
                          value={c}
                          disabled={ORDEM_CLASSE[c] < ORDEM_CLASSE[CLASSE_MINIMA[r]]}
                        >
                          {CLASSE_LABEL[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
