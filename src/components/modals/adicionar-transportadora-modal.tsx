"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import type { Tenant } from "@/lib/mock-data";

export type NovaTransportadora = { name: string; cnpj: string; cidade: string; uf: string; plano: Tenant["plano"] };

const PLANOS: Tenant["plano"][] = ["Essencial", "Profissional", "Enterprise"];

export function AdicionarTransportadoraModal({
  open, onOpenChange, onAdd,
}: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (t: NovaTransportadora) => void }) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [plano, setPlano] = useState<Tenant["plano"]>("Profissional");

  const valido = name.trim() && cnpj.trim();

  function reset() { setName(""); setCnpj(""); setCidade(""); setUf(""); setPlano("Profissional"); }

  function salvar() {
    onAdd({ name: name.trim(), cnpj: cnpj.trim(), cidade: cidade.trim(), uf: uf.trim(), plano });
    toast("Transportadora adicionada", { desc: `${name} · plano ${plano}` });
    onOpenChange(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Building2 className="size-4 text-[hsl(176_84%_25%)]" /> Adicionar transportadora</DialogTitle>
          <DialogDescription>Onboarding multiempresa — nova organização no ambiente.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-[11px]">Razão social</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Transportes …" className="h-9 mt-1" />
          </div>
          <div className="col-span-2">
            <Label className="text-[11px]">CNPJ</Label>
            <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" className="h-9 mt-1 font-mono" />
          </div>
          <div>
            <Label className="text-[11px]">Cidade</Label>
            <Input value={cidade} onChange={(e) => setCidade(e.target.value)} className="h-9 mt-1" />
          </div>
          <div>
            <Label className="text-[11px]">UF</Label>
            <Input value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} placeholder="MT" maxLength={2} className="h-9 mt-1" />
          </div>
          <div className="col-span-2">
            <Label className="text-[11px]">Plano</Label>
            <Select value={plano} onValueChange={(v) => setPlano(v as Tenant["plano"])}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{PLANOS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}><Building2 className="size-4" /> Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
