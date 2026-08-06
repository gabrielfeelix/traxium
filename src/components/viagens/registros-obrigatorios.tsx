"use client";

// As classes `registro` e `informacao` com efeito visível (Fase 10.1).
//
// Registro obrigatório opera mas não fecha: a viagem anda com a pendência e
// trava na conclusão. Informação complementar não trava nada — aparece porque o
// auditor pergunta, e some do caminho de quem está decidindo.

import { useState } from "react";
import { Paperclip, CircleCheck, Info, Lock, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CLASSE_LABEL } from "@/lib/domain/motor-config";
import {
  pendenciasDeRegistro, registrosCumpridos, informacoesComplementares, podeConcluir,
} from "@/lib/domain/registro";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, cn } from "@/lib/utils";

export function RegistrosObrigatorios({ viagemId }: { viagemId: string }) {
  const { version, anexarRegistroViagem, concluirViagem } = useSession();
  const { toast } = useToast();
  const [rascunho, setRascunho] = useState<Record<string, string>>({});
  void version;

  const pendentes = pendenciasDeRegistro(viagemId);
  const cumpridos = registrosCumpridos(viagemId);
  const informacoes = informacoesComplementares(viagemId);
  const fecho = podeConcluir(viagemId);

  // Sem nada das três classes, o card não aparece: não é placeholder.
  if (!pendentes.length && !cumpridos.length && !informacoes.length) return null;

  function anexar(regra: string) {
    const descricao = rascunho[regra] ?? "";
    const ok = anexarRegistroViagem({ viagemId, regra: regra as never, descricao });
    toast(ok ? "Evidência anexada" : "Nada anexado", {
      type: ok ? "success" : "error",
      desc: ok
        ? "O registro entra na trilha com autor e data/hora. A conclusão da viagem destrava quando não sobrar pendência."
        : "Descreva a evidência: registro obrigatório sem descrição não vale para auditoria.",
    });
    if (ok) setRascunho((r) => ({ ...r, [regra]: "" }));
  }

  return (
    <Card className={cn(pendentes.length > 0 && "border-warning-500/40")}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Paperclip className="size-4 text-warning-700" />
          <CardTitle>Registro obrigatório e informação complementar</CardTitle>
        </div>
        <CardDescription>
          Classe <strong>{CLASSE_LABEL.registro}</strong> opera, mas não fecha sem evidência. Classe{" "}
          <strong>{CLASSE_LABEL.informacao}</strong> não interfere na decisão — fica registrada.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendentes.map((p) => (
          <div key={p.regra} className="rounded-lg border border-warning-500/30 bg-warning-50/50 p-3">
            <p className="text-[12.5px] font-semibold text-fg">{p.nome}</p>
            <p className="text-[11.5px] text-fg-muted">{p.detalhe}</p>
            <div className="flex gap-2 mt-2">
              <Input
                value={rascunho[p.regra] ?? ""}
                onChange={(e) => setRascunho((r) => ({ ...r, [p.regra]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); anexar(p.regra); } }}
                placeholder="Identificação da evidência anexada…"
                className="h-8 text-[12px]"
              />
              <Button size="sm" variant="outline" onClick={() => anexar(p.regra)} disabled={!(rascunho[p.regra] ?? "").trim()}>
                <Paperclip className="size-3.5" /> Anexar
              </Button>
            </div>
          </div>
        ))}

        {cumpridos.map((c) => (
          <div key={c.regra} className="flex items-start gap-2 text-[11.5px]">
            <CircleCheck className="size-3.5 shrink-0 mt-0.5 text-success-700" aria-hidden />
            <span className="text-fg-muted">
              <span className="font-medium text-fg">{c.nome}</span> — {c.anexo?.descricao}
              <span className="block text-[10px] text-fg-soft font-mono">
                {c.anexo?.anexadoPor} · {c.anexo && formatDateTime(c.anexo.anexadoEm)}
              </span>
            </span>
          </div>
        ))}

        {informacoes.map((i) => (
          <div key={i.regra} className="flex items-start gap-2 text-[11.5px]">
            <Info className="size-3.5 shrink-0 mt-0.5 text-fg-soft" aria-hidden />
            <span className="text-fg-muted">
              <span className="font-medium text-fg">{i.nome}</span> — {i.detalhe}
              <span className="block text-[10px] text-fg-soft">Informação complementar: não interfere na decisão.</span>
            </span>
          </div>
        ))}

        <div className="flex items-center gap-3 flex-wrap border-t border-border-soft pt-3">
          <Button
            size="sm"
            variant={fecho.ok ? "gradient" : "outline"}
            disabled={!fecho.ok}
            onClick={() => {
              const r = concluirViagem(viagemId);
              toast(r.ok ? "Viagem concluída" : "Conclusão bloqueada", {
                type: r.ok ? "success" : "error",
                desc: r.motivo,
              });
            }}
            className={cn(!fecho.ok && "opacity-60")}
          >
            {fecho.ok ? <Flag className="size-4" /> : <Lock className="size-4" />} Concluir viagem
          </Button>
          <p className={cn("text-[11.5px] flex-1 min-w-[200px]", fecho.ok ? "text-fg-muted" : "text-warning-700")}>
            {fecho.motivo}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
