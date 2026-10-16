"use client";

import { useState } from "react";
import { Repeat, Zap, Info } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  cavalos, implementos, compartimentos, findImplemento, compartimentoPorViagem, podeExecutar,
} from "@/lib/domain/model";
import { getT3, avaliarNovoCarregamento } from "@/lib/domain/rules-engine";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { type Viagem } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";

export function TrocarVeiculoModal({ viagem }: { viagem: Viagem }) {
  const { trocarVeiculo, papel } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const bloqueado = !podeExecutar(papel, "criarViagem");
  const impAtual = implementos.find((i) => i.placa === viagem.carreta);

  const [cavaloPlaca, setCavaloPlaca] = useState(viagem.cavalo);
  const [implementoId, setImplementoId] = useState(impAtual?.id ?? "");
  const [compartimentoId, setCompartimentoId] = useState(compartimentoPorViagem[viagem.id] ?? "");
  const [motivo, setMotivo] = useState("");

  const comps = compartimentos.filter((c) => c.implementoId === implementoId);
  const t3 = compartimentoId ? getT3(compartimentoId) : [];
  const decisao = compartimentoId ? avaliarNovoCarregamento(compartimentoId) : null;

  const trocouCompartimento = compartimentoId !== (compartimentoPorViagem[viagem.id] ?? "");
  const podeSalvar = cavaloPlaca && implementoId && compartimentoId && motivo.trim().length > 0;

  function reset() {
    setCavaloPlaca(viagem.cavalo);
    setImplementoId(impAtual?.id ?? "");
    setCompartimentoId(compartimentoPorViagem[viagem.id] ?? "");
    setMotivo("");
  }

  function salvar() {
    trocarVeiculo(viagem.id, { cavaloPlaca, implementoId, compartimentoId, motivo: motivo.trim() });
    const reavaliou = trocouCompartimento;
    toast("Veículo trocado", {
      type: reavaliou && decisao?.tier === "BLOQUEIO" ? "error" : "info",
      desc: reavaliou
        ? `Motor re-avaliado: ${decisao?.tier}. Retificação registrada na trilha.`
        : "Cavalo trocado — T-3 do compartimento preservado. Retificação registrada.",
    });
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={bloqueado} title={bloqueado ? "Seu papel não troca veículo (despachante/gestor)" : undefined}>
          <Repeat className="size-4" /> Trocar veículo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Repeat className="size-4 text-[hsl(176_84%_25%)]" /> Trocar veículo · {viagem.codigo}</DialogTitle>
          <DialogDescription>
            Trocar o cavalo NÃO altera o T-3 (o histórico é do compartimento). Trocar implemento/compartimento re-roda o motor.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Cavalo">
            <Select value={cavaloPlaca} onValueChange={setCavaloPlaca}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Cavalo…" /></SelectTrigger>
              <SelectContent>{cavalos.map((c) => <SelectItem key={c.id} value={c.placa}>{c.placa} · {c.modelo}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Implemento (carreta)">
            <Select value={implementoId} onValueChange={(v) => { setImplementoId(v); setCompartimentoId(""); }}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Implemento…" /></SelectTrigger>
              <SelectContent>{implementos.map((i) => <SelectItem key={i.id} value={i.id}>{i.placa} · {i.tipo}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Compartimento" className="col-span-2">
            <Select value={compartimentoId} onValueChange={setCompartimentoId} disabled={!implementoId}>
              <SelectTrigger className="h-9"><SelectValue placeholder={implementoId ? "Compartimento…" : "Escolha o implemento"} /></SelectTrigger>
              <SelectContent>{comps.map((c) => <SelectItem key={c.id} value={c.id}>{c.identificador}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        {compartimentoId && (
          <div className="rounded-lg border border-[hsl(200_18%_90%)] bg-[hsl(200_18%_98%)] p-3">
            <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[hsl(210_14%_42%)] mb-2">T-3 do compartimento selecionado</p>
            <div className="space-y-1">
              {t3.map((e) => (
                <div key={e.load.id} className="flex items-center gap-2 text-[11px]">
                  <span className="font-mono text-[hsl(210_12%_58%)]">T-{e.ordem}</span>
                  <span className="flex-1">{e.produto?.nomeCanonico}</span>
                  {e.produto?.bloqueiaFeed && <Badge variant="destructive" className="text-[8px]">proibida</Badge>}
                  {e.determinante && <Zap className="size-3 text-[hsl(176_84%_25%)]" />}
                  <span className="text-[hsl(210_12%_58%)] num">{formatDate(e.load.data)}</span>
                </div>
              ))}
              {!t3.length && <p className="text-[11px] text-[hsl(210_14%_42%)]">Sem histórico — compartimento novo.</p>}
            </div>
            {decisao && trocouCompartimento && (
              <p className={cn(
                "text-[11px] mt-2 font-semibold",
                decisao.tier === "BLOQUEIO" ? "text-[hsl(0_70%_38%)]" : decisao.tier === "ALERTA" ? "text-[hsl(24_88%_32%)]" : "text-[hsl(142_71%_24%)]"
              )}>
                Nova decisão do motor: {decisao.tier} — {decisao.motivo}
              </p>
            )}
          </div>
        )}

        <div className="flex items-start gap-1.5 text-[11px] text-[hsl(210_14%_42%)] bg-[hsl(200_18%_97%)] rounded-md p-2">
          <Info className="size-3.5 mt-0.5 shrink-0" />
          A troca gera uma <strong className="mx-1">retificação</strong> na trilha (motivo + responsável + original preservado). Nada é apagado.
        </div>

        <Field label="Motivo da troca (obrigatório)">
          <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: cavalo quebrou no pátio; carreta remanejada…" className="h-9" />
        </Field>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!podeSalvar} onClick={salvar}>Confirmar troca</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-[11px]">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
