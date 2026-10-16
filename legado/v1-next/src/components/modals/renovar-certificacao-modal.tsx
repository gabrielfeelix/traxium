"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

export type RenovarTarget =
  | { kind: "motorista"; id: string; nome: string; certs: { nome: string; vencimento: string; status: string }[] }
  | { kind: "implemento"; id: string; placa: string; validadeAtual: string };

export function RenovarCertificacaoModal({
  open, onOpenChange, target,
}: { open: boolean; onOpenChange: (o: boolean) => void; target: RenovarTarget | null }) {
  const { renovarCertificadoMotorista, renovarCertificadoImplemento } = useSession();
  const { toast } = useToast();
  const [cert, setCert] = useState("");
  const [validade, setValidade] = useState("");

  useEffect(() => {
    if (!open) return;
    setValidade("");
    setCert(target?.kind === "motorista" ? target.certs[0]?.nome ?? "" : "");
  }, [open, target]);

  const valido = validade && (target?.kind !== "motorista" || cert);

  function salvar() {
    if (!target) return;
    if (target.kind === "motorista") {
      renovarCertificadoMotorista(target.id, cert, validade);
      toast("Certificação renovada", { desc: `${target.nome} · ${cert} · válida até ${formatDate(validade)}` });
    } else {
      renovarCertificadoImplemento(target.id, validade);
      toast("Certificação GMP+ renovada", { desc: `${target.placa} · válida até ${formatDate(validade)}` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><RefreshCw className="size-4 text-[hsl(176_84%_25%)]" /> Renovar certificação</DialogTitle>
          <DialogDescription>
            {target?.kind === "motorista"
              ? `Motorista ${target.nome}`
              : target?.kind === "implemento"
              ? `Implemento ${target.placa} · vence ${formatDate(target.validadeAtual)}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {target?.kind === "motorista" && (
            <div>
              <Label className="text-[11px]">Certificação</Label>
              <Select value={cert} onValueChange={setCert}>
                <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Selecionar…" /></SelectTrigger>
                <SelectContent>
                  {target.certs.map((c) => <SelectItem key={c.nome} value={c.nome}>{c.nome} · {c.status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label className="text-[11px]">Nova validade</Label>
            <Input type="date" value={validade} onChange={(e) => setValidade(e.target.value)} className="h-9 mt-1" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}><RefreshCw className="size-4" /> Renovar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
