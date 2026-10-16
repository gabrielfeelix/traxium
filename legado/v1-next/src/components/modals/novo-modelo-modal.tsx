"use client";

import { useState } from "react";
import { Plus, ClipboardCheck } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import type { Checklist } from "@/lib/mock-data";

export type NovoModelo = {
  titulo: string;
  tipo: Checklist["tipo"];
  regime?: Checklist["regime"];
  itens: number;
};

const TIPOS: Checklist["tipo"][] = ["LCI Pré-carregamento", "LCI Pós-descarregamento", "Inspeção de Carreta", "Higienização Compartimento"];
const REGIMES = ["Nenhum", "A", "B", "C", "D"];

export function NovoModeloModal({
  open, onOpenChange, onAdd,
}: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (m: NovoModelo) => void }) {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<Checklist["tipo"]>("LCI Pré-carregamento");
  const [regime, setRegime] = useState("Nenhum");
  const [itens, setItens] = useState("12");

  const valido = titulo.trim() && Number(itens) > 0;

  function reset() { setTitulo(""); setTipo("LCI Pré-carregamento"); setRegime("Nenhum"); setItens("12"); }

  function salvar() {
    onAdd({
      titulo: titulo.trim(),
      tipo,
      regime: regime === "Nenhum" ? undefined : (regime as Checklist["regime"]),
      itens: Number(itens) || 0,
    });
    toast("Modelo criado", { desc: `${titulo} · ${itens} itens` });
    onOpenChange(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ClipboardCheck className="size-4 text-[hsl(176_84%_25%)]" /> Novo modelo de checklist</DialogTitle>
          <DialogDescription>Base para inspeções LCI, higienização e carreta.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-[11px]">Título</Label>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: LCI — Pré-carregamento Milho" className="h-9 mt-1" />
          </div>
          <div className="col-span-2">
            <Label className="text-[11px]">Tipo</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as Checklist["tipo"])}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px]">Regime</Label>
            <Select value={regime} onValueChange={setRegime}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{REGIMES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px]">Nº de itens</Label>
            <Input type="number" value={itens} onChange={(e) => setItens(e.target.value)} className="h-9 mt-1" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}><Plus className="size-4" /> Criar modelo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
