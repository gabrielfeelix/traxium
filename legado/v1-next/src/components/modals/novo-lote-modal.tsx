"use client";

import { useState } from "react";
import { Plus, PackageCheck, X, MapPin } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fazendas } from "@/lib/mock-data";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatNumber } from "@/lib/utils";

export function NovoLoteModal() {
  const { addLote } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [produto, setProduto] = useState("Soja em grão");
  const [hsCode, setHsCode] = useState("1201.90");
  const [destinatario, setDestinatario] = useState("");
  const [pais, setPais] = useState("");
  const [origens, setOrigens] = useState<{ id: string; nome: string; toneladas: number }[]>([]);
  const [fazSel, setFazSel] = useState("");
  const [ton, setTon] = useState("");

  function addOrigem() {
    const f = fazendas.find((x) => x.id === fazSel);
    if (!f || !ton) return;
    if (origens.some((o) => o.id === f.id)) return;
    setOrigens((s) => [...s, { id: f.id, nome: f.nome, toneladas: Number(ton) || 0 }]);
    setFazSel(""); setTon("");
  }
  function reset() { setProduto("Soja em grão"); setHsCode("1201.90"); setDestinatario(""); setPais(""); setOrigens([]); setFazSel(""); setTon(""); }

  const total = origens.reduce((a, o) => a + o.toneladas, 0);
  const valido = produto && destinatario && pais && origens.length > 0;

  function salvar() {
    addLote({ produto, hsCode, origens, destinatarioFinal: destinatario, paisDestino: pais });
    toast("Lote criado", { desc: `${origens.length} origem(ns) · ${formatNumber(total)} t · status Rascunho.` });
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm"><Plus className="size-4" /> Novo lote</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><PackageCheck className="size-4 text-[hsl(176_84%_25%)]" /> Novo lote EUDR</DialogTitle>
          <DialogDescription>Uma remessa pode agregar várias fazendas (lote misto). A conformidade depende de todas as origens.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <F label="Produto"><Input value={produto} onChange={(e) => setProduto(e.target.value)} className="h-9" /></F>
          <F label="HS Code"><Input value={hsCode} onChange={(e) => setHsCode(e.target.value)} className="h-9 font-mono" /></F>
          <F label="Destinatário"><Input value={destinatario} onChange={(e) => setDestinatario(e.target.value)} placeholder="Cargill BV…" className="h-9" /></F>
          <F label="País destino"><Input value={pais} onChange={(e) => setPais(e.target.value)} placeholder="Holanda" className="h-9" /></F>
        </div>

        <div>
          <Label className="text-[11px]">Origens (fazendas)</Label>
          <div className="flex items-end gap-2 mt-1">
            <Select value={fazSel} onValueChange={setFazSel}>
              <SelectTrigger className="h-9 flex-1"><SelectValue placeholder="Fazenda…" /></SelectTrigger>
              <SelectContent>{fazendas.map((f) => <SelectItem key={f.id} value={f.id}>{f.nome} · {f.uf}</SelectItem>)}</SelectContent>
            </Select>
            <Input value={ton} onChange={(e) => setTon(e.target.value)} type="number" placeholder="ton" className="h-9 w-24" />
            <Button variant="outline" size="sm" onClick={addOrigem} disabled={!fazSel || !ton}>Add</Button>
          </div>
          <div className="mt-2 space-y-1">
            {origens.map((o) => (
              <div key={o.id} className="flex items-center gap-2 rounded-md border border-[hsl(200_18%_92%)] px-2.5 py-1.5 text-[12px]">
                <MapPin className="size-3 text-[hsl(176_84%_25%)]" />
                <span className="flex-1">{o.nome}</span>
                <span className="num text-[hsl(210_14%_42%)]">{formatNumber(o.toneladas)} t</span>
                <button onClick={() => setOrigens((s) => s.filter((x) => x.id !== o.id))} className="text-[hsl(210_12%_58%)] hover:text-[hsl(0_70%_45%)]"><X className="size-3.5" /></button>
              </div>
            ))}
            {origens.length > 0 && <p className="text-[11px] text-[hsl(210_14%_42%)] text-right pt-1">Total: <strong className="num">{formatNumber(total)} t</strong></p>}
            {!origens.length && <p className="text-[11px] text-[hsl(210_12%_58%)]">Adicione ao menos uma origem.</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}>Criar lote</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-[11px]">{label}</Label><div className="mt-1">{children}</div></div>;
}
