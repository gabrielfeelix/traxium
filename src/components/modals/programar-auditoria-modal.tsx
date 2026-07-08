"use client";

import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession, type NovaAuditoriaInput } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

const TIPOS: NovaAuditoriaInput["tipo"][] = ["GMP+ Anual", "GMP+ Surpresa", "Cliente comprador", "Interna", "EUDR"];

export function ProgramarAuditoriaModal({ trigger }: { trigger?: React.ReactNode }) {
  const { addAuditoria } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<NovaAuditoriaInput["tipo"]>("GMP+ Anual");
  const [data, setData] = useState("");
  const [auditor, setAuditor] = useState("");
  const [organismo, setOrganismo] = useState("");

  const valido = data && auditor.trim() && organismo.trim();

  function reset() { setTipo("GMP+ Anual"); setData(""); setAuditor(""); setOrganismo(""); }

  function salvar() {
    addAuditoria({ tipo, data, auditor, organismo });
    toast("Auditoria programada", { desc: `${tipo} · ${formatDate(data)} · ${auditor}` });
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="gradient" size="sm"><Plus className="size-4" /> Programar auditoria</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ShieldCheck className="size-4 text-[hsl(176_84%_25%)]" /> Programar auditoria</DialogTitle>
          <DialogDescription>Adiciona um ciclo ao calendário de compliance.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <F label="Tipo" full>
            <Select value={tipo} onValueChange={(v) => setTipo(v as NovaAuditoriaInput["tipo"])}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F label="Data"><Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="h-9" /></F>
          <F label="Auditor"><Input value={auditor} onChange={(e) => setAuditor(e.target.value)} placeholder="Nome do auditor" className="h-9" /></F>
          <F label="Organismo certificador" full><Input value={organismo} onChange={(e) => setOrganismo(e.target.value)} placeholder="Ex.: Único Organismo Certificador BR" className="h-9" /></F>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}><Plus className="size-4" /> Programar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><Label className="text-[11px]">{label}</Label><div className="mt-1">{children}</div></div>;
}
