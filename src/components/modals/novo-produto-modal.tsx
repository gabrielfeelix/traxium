"use client";

import { useState } from "react";
import { Plus, Boxes } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegimeBadge } from "@/components/shell/status-badge";
import { type ProdutoIDTF, type Regime, podeExecutar } from "@/lib/domain/model";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function NovoProdutoModal() {
  const { addProdutoIDTF, papel } = useSession();
  const { toast } = useToast();
  const bloqueado = !podeExecutar(papel, "classificarIDTF");
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [alias, setAlias] = useState("");
  const [hs, setHs] = useState("");
  const [cat, setCat] = useState<ProdutoIDTF["categoria"]>("feed_material");
  const [regime, setRegime] = useState<Regime>("A");
  const [bloqueia, setBloqueia] = useState(false);

  function reset() { setNome(""); setAlias(""); setHs(""); setCat("feed_material"); setRegime("A"); setBloqueia(false); }

  function salvar() {
    addProdutoIDTF({
      nomeCanonico: nome,
      alias: alias.split(",").map((s) => s.trim()).filter(Boolean),
      hsCode: hs || undefined, categoria: cat, regimeAntesDeFeed: regime, bloqueiaFeed: bloqueia,
    });
    toast(`${nome} enviado à fila de classificação`, { type: "info", desc: `Regime sugerido ${regime}. Trava o uso até a qualidade confirmar em Motor IDTF.` });
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm" disabled={bloqueado} title={bloqueado ? "Só a qualidade (gestor) adiciona produtos" : undefined}>
          <Plus className="size-4" /> Novo produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Boxes className="size-4 text-[hsl(176_84%_25%)]" /> Novo produto IDTF</DialogTitle>
          <DialogDescription>Entra na fila de classificação da qualidade — o regime é uma sugestão que trava o uso até confirmação.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <F label="Nome canônico" full><Input value={nome} onChange={(e) => setNome(e.target.value)} className="h-9" /></F>
          <F label="Alias (vírgula)" full><Input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="farelo, soja farelo…" className="h-9" /></F>
          <F label="HS Code"><Input value={hs} onChange={(e) => setHs(e.target.value)} className="h-9 font-mono" /></F>
          <F label="Categoria">
            <Select value={cat} onValueChange={(v) => setCat(v as ProdutoIDTF["categoria"])}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="feed">Feed</SelectItem>
                <SelectItem value="feed_material">Feed material</SelectItem>
                <SelectItem value="risco">Risco</SelectItem>
                <SelectItem value="proibido">Proibido</SelectItem>
              </SelectContent>
            </Select>
          </F>
        </div>
        <div>
          <Label className="text-[11px]">Regime mínimo antes de feed</Label>
          <div className="grid grid-cols-4 gap-2 mt-1">
            {(["A", "B", "C", "D"] as Regime[]).map((r) => (
              <button key={r} onClick={() => setRegime(r)} className={cn("h-10 rounded-md border font-bold transition-all", regime === r ? "border-[hsl(176_84%_25%)] bg-[hsl(174_64%_97%)]" : "border-[hsl(200_18%_88%)]")}>{r}</button>
            ))}
          </div>
          <div className="mt-1.5"><RegimeBadge regime={regime} size="sm" /></div>
        </div>
        <div className="flex items-center justify-between rounded-md border border-[hsl(200_18%_90%)] px-3 h-10">
          <Label className="text-[12px]">Proibido para feed</Label><Switch checked={bloqueia} onCheckedChange={setBloqueia} />
        </div>
        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!nome.trim()} onClick={salvar}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><Label className="text-[11px]">{label}</Label><div className="mt-1">{children}</div></div>;
}
