"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RegimeBadge } from "@/components/shell/status-badge";
import { type ProdutoIDTF, type Regime, podeExecutar } from "@/lib/domain/model";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function ClassificarIDTFModal({ produto }: { produto: ProdutoIDTF }) {
  const { classificarProduto, papel } = useSession();
  const { toast } = useToast();
  const bloqueado = !podeExecutar(papel, "classificarIDTF");
  const [open, setOpen] = useState(false);
  const [regime, setRegime] = useState<Regime>(produto.regimeAntesDeFeed);
  const [bloqueia, setBloqueia] = useState(produto.bloqueiaFeed);
  const [idtf, setIdtf] = useState(produto.idtfCode ?? "");

  function salvar() {
    classificarProduto(produto.id, { regimeAntesDeFeed: regime, bloqueiaFeed: bloqueia, idtfCode: idtf || undefined });
    toast(`${produto.nomeCanonico} classificado`, { desc: bloqueia ? "Marcado como proibido para feed." : `Regime mínimo ${regime} definido. Saiu da fila.` });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={bloqueado} title={bloqueado ? "Só a qualidade (gestor) classifica produtos" : undefined}>Classificar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Tag className="size-4 text-[hsl(176_84%_25%)]" /> Classificar produto</DialogTitle>
          <DialogDescription>{produto.nomeCanonico} · alias: {produto.alias.join(" · ")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-[11px]">Regime mínimo de limpeza antes de feed</Label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {(["A", "B", "C", "D"] as Regime[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegime(r)}
                  className={cn(
                    "h-11 rounded-md border flex flex-col items-center justify-center gap-0.5 transition-all",
                    regime === r ? "border-[hsl(176_84%_25%)] bg-[hsl(174_64%_97%)]" : "border-[hsl(200_18%_88%)]"
                  )}
                >
                  <span className="text-[15px] font-bold">{r}</span>
                </button>
              ))}
            </div>
            <div className="mt-1.5"><RegimeBadge regime={regime} size="sm" /></div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-[hsl(200_18%_90%)] px-3 h-10">
            <Label className="text-[12px] cursor-pointer">Proibido para feed (exige liberação formal + Regime D)</Label>
            <Switch checked={bloqueia} onCheckedChange={setBloqueia} />
          </div>

          <div>
            <Label className="text-[11px]">Código IDTF (opcional)</Label>
            <Input value={idtf} onChange={(e) => setIdtf(e.target.value)} placeholder="IDTF-…" className="h-9 mt-1 font-mono" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" onClick={salvar}>Classificar e liberar uso</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
