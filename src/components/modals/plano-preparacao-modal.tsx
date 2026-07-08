"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardCheck, CheckCircle2, AlertOctagon, Download, ArrowRight } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { downloadCSV } from "@/lib/export";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const ITENS = [
  { item: "Dossiê consolidado por período (viagens, checklists, NCs)", resp: "Compliance", ok: false },
  { item: "Amostragem auditável de viagens dos últimos 12 meses", resp: "Compliance", ok: true },
  { item: "Evidências de limpeza Regime D/C com foto e GPS", resp: "Operação", ok: false },
  { item: "Certificados GMP+ de subcontratados vigentes", resp: "Qualidade", ok: false },
  { item: "T-3 por compartimento reconstruído e imutável", resp: "Sistema", ok: true },
  { item: "Treinamentos GMP+/MOPP comprovados por motorista", resp: "RH", ok: false },
  { item: "Matriz de risco IDTF atualizada para produtos novos", resp: "Rafael · RD Insight", ok: true },
  { item: "Política de sequenciamento de cargas revisada", resp: "Rafael · RD Insight", ok: true },
  { item: "Relatório de NC dos últimos 12 meses com CAPA", resp: "Compliance", ok: false },
  { item: "Fotos com geolocalização das últimas 200 viagens", resp: "Sistema", ok: true },
  { item: "Plano de ação documentado para NC-2026-1042", resp: "Gerência", ok: false },
  { item: "Inspeção de carretas com certificação a vencer em 90d", resp: "Frota", ok: false },
];

export function PlanoPreparacaoModal({ trigger }: { trigger?: React.ReactNode }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const pend = ITENS.filter((i) => !i.ok).length;

  function exportar() {
    downloadCSV(
      "traxium-plano-preparacao-auditoria",
      ["Item", "Responsável", "Status"],
      ITENS.map((i) => [i.item, i.resp, i.ok ? "Concluído" : "Pendente"])
    );
    toast("Plano exportado", { desc: `${ITENS.length} itens · ${pend} pendentes.` });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="gradient" size="sm"><ClipboardCheck className="size-4" /> Plano de preparação</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ClipboardCheck className="size-4 text-[hsl(176_84%_25%)]" /> Plano de preparação · Auditoria GMP+ FSA</DialogTitle>
          <DialogDescription>
            {ITENS.length} itens preparatórios · <span className="font-semibold text-[hsl(24_88%_32%)]">{pend} pendentes</span>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[55vh] overflow-y-auto space-y-2 pr-1">
          {ITENS.map((p, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-md border",
                p.ok ? "border-[hsl(142_71%_85%)] bg-[hsl(142_71%_98%)]" : "border-[hsl(48_95%_85%)] bg-[hsl(48_95%_98%)]"
              )}
            >
              <div className={cn(
                "size-6 rounded-full flex items-center justify-center shrink-0 text-white",
                p.ok ? "bg-[hsl(142_71%_40%)]" : "bg-[hsl(48_95%_55%)]"
              )}>
                {p.ok ? <CheckCircle2 className="size-3.5" /> : <AlertOctagon className="size-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium">{p.item}</p>
                <p className="text-[11px] text-fg-muted mt-0.5">Responsável: {p.resp}</p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="justify-between sm:justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dossie">Abrir Dossiê <ArrowRight className="size-3.5" /></Link>
          </Button>
          <Button variant="gradient" size="sm" onClick={exportar}><Download className="size-4" /> Exportar plano</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
