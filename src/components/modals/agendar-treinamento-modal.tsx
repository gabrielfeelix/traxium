"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motoristas } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { formatDate, cn } from "@/lib/utils";

const TIPOS = ["GMP+ Básico", "GMP+ Avançado", "MOPP", "EUDR"];

export function AgendarTreinamentoModal({
  open, onOpenChange, preselect = [],
}: { open: boolean; onOpenChange: (o: boolean) => void; preselect?: string[] }) {
  const { toast } = useToast();
  const [tipo, setTipo] = useState("GMP+ Básico");
  const [data, setData] = useState("");
  const [local, setLocal] = useState("");
  const [participantes, setParticipantes] = useState<string[]>(preselect);

  // Sincroniza a pré-seleção sempre que o modal reabre (ex.: item do dropdown de um motorista).
  useEffect(() => {
    if (open) setParticipantes(preselect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const valido = data && participantes.length > 0;

  function toggle(id: string) {
    setParticipantes((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function salvar() {
    const n = participantes.length;
    toast(`Treinamento ${tipo} agendado`, {
      desc: `${formatDate(data)} · ${n} participante${n > 1 ? "s" : ""}${local ? ` · ${local}` : ""}`,
    });
    onOpenChange(false);
    setTipo("GMP+ Básico"); setData(""); setLocal(""); setParticipantes([]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><GraduationCap className="size-4 text-[hsl(176_84%_25%)]" /> Agendar treinamento</DialogTitle>
          <DialogDescription>Convocação de motoristas para capacitação obrigatória.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <F label="Tipo">
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F label="Data"><Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="h-9" /></F>
          <F label="Local" full><Input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Ex.: Sede · Rondonópolis/MT" className="h-9" /></F>
        </div>

        <div>
          <Label className="text-[11px]">Participantes ({participantes.length})</Label>
          <div className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-[hsl(200_18%_90%)] divide-y divide-[hsl(200_18%_94%)]">
            {motoristas.map((m) => {
              const sel = participantes.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(m.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-[12px] transition-colors",
                    sel ? "bg-[hsl(174_64%_97%)]" : "hover:bg-[hsl(200_18%_98%)]"
                  )}
                >
                  <span>
                    <span className="font-medium">{m.nome}</span>
                    <span className="text-[hsl(210_14%_42%)]"> · {m.tipo} · {m.cidade}/{m.uf}</span>
                  </span>
                  <span className={cn(
                    "size-4 rounded border flex items-center justify-center shrink-0 text-[10px] font-bold",
                    sel ? "bg-[hsl(176_84%_25%)] border-[hsl(176_84%_25%)] text-white" : "border-[hsl(200_18%_75%)]"
                  )}>
                    {sel && "✓"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}><GraduationCap className="size-4" /> Agendar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><Label className="text-[11px]">{label}</Label><div className="mt-1">{children}</div></div>;
}
