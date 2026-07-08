"use client";

import { useState } from "react";
import { Plus, AlertOctagon } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type NaoConformidade } from "@/lib/mock-data";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const CATEGORIAS: NaoConformidade["categoria"][] = [
  "Limpeza inadequada", "Documentação ausente", "Certificação vencida",
  "Foto não auditável", "Geolocalização inválida", "Carga incompatível", "Carreta não certificada",
];

export function ReportarNCModal() {
  const { addNaoConformidade } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [sev, setSev] = useState<NaoConformidade["severidade"]>("Maior");
  const [cat, setCat] = useState<NaoConformidade["categoria"]>("Limpeza inadequada");
  const [desc, setDesc] = useState("");
  const [viagem, setViagem] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [motorista, setMotorista] = useState("");
  const [resp, setResp] = useState("");

  function reset() { setSev("Maior"); setCat("Limpeza inadequada"); setDesc(""); setViagem(""); setVeiculo(""); setMotorista(""); setResp(""); }

  function salvar() {
    const codigo = `NC-2026-${1050 + Math.floor(Math.random() * 900)}`;
    addNaoConformidade({
      codigo, severidade: sev, categoria: cat, descricao: desc,
      abertaEm: "2026-07-08T10:00:00", status: "Aberta",
      responsavel: resp || undefined,
      viagem: viagem || undefined, veiculo: veiculo || undefined, motorista: motorista || undefined,
    });
    toast(`NC ${codigo} registrada`, { type: sev === "Crítica" ? "error" : "info", desc: sev === "Crítica" ? "Crítica — pode exigir exceção." : "Aberta para tratamento (CAPA)." });
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm"><Plus className="size-4" /> Reportar NC manual</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><AlertOctagon className="size-4 text-[hsl(0_78%_50%)]" /> Reportar não conformidade</DialogTitle>
          <DialogDescription>Registro do que o motor não pega automaticamente (ex.: ferrugem vista em pátio).</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-[11px]">Severidade</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(["Crítica", "Maior", "Menor"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSev(s)}
                  className={cn(
                    "h-9 rounded-md border text-[12px] font-semibold transition-all",
                    sev === s
                      ? s === "Crítica" ? "bg-[hsl(0_78%_50%)] text-white border-[hsl(0_78%_50%)]" : s === "Maior" ? "bg-[hsl(28_92%_48%)] text-white border-[hsl(28_92%_48%)]" : "bg-[hsl(48_95%_50%)] text-white border-[hsl(48_95%_50%)]"
                      : "border-[hsl(200_18%_88%)] text-[hsl(210_14%_42%)]"
                  )}
                >{s}</button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[11px]">Categoria</Label>
            <Select value={cat} onValueChange={(v) => setCat(v as NaoConformidade["categoria"])}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[11px]">Descrição</Label>
            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="O que foi observado…" className="h-9 mt-1" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div><Label className="text-[11px]">Viagem</Label><Input value={viagem} onChange={(e) => setViagem(e.target.value)} placeholder="TX-…" className="h-9 mt-1" /></div>
            <div><Label className="text-[11px]">Veículo</Label><Input value={veiculo} onChange={(e) => setVeiculo(e.target.value)} placeholder="Placa" className="h-9 mt-1" /></div>
            <div><Label className="text-[11px]">Motorista</Label><Input value={motorista} onChange={(e) => setMotorista(e.target.value)} placeholder="Nome" className="h-9 mt-1" /></div>
          </div>

          <div><Label className="text-[11px]">Responsável pelo tratamento</Label><Input value={resp} onChange={(e) => setResp(e.target.value)} placeholder="Ex.: Gerência de Compliance" className="h-9 mt-1" /></div>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!desc.trim()} onClick={salvar}>Registrar NC</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
