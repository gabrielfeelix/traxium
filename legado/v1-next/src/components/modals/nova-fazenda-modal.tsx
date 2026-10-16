"use client";

import { useState } from "react";
import { Plus, Trees, Upload, CheckCircle2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function NovaFazendaModal({ trigger }: { trigger?: "cadastrar" | "geojson" }) {
  const { addFazenda } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [produtor, setProdutor] = useState("");
  const [car, setCar] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cultura, setCultura] = useState("Soja");
  const [poligonoOk, setPoligonoOk] = useState(false);
  const [formato, setFormato] = useState("");

  function reset() { setNome(""); setProdutor(""); setCar(""); setCidade(""); setUf(""); setCultura("Soja"); setPoligonoOk(false); setFormato(""); }
  function importarPoligono(fmt: string) { setFormato(fmt); setPoligonoOk(true); toast(`Polígono importado (${fmt})`, { desc: "Normalizado para campos pesquisáveis." }); }

  const valido = nome && produtor && car && cidade && uf;

  function salvar() {
    addFazenda({ nome, produtor, car, cidade, uf, cultura: cultura.split(",").map((s) => s.trim()).filter(Boolean) });
    toast("Fazenda cadastrada", { desc: `${nome} · em análise de risco EUDR.` });
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        {trigger === "geojson" ? (
          <Button variant="outline" size="sm"><Upload className="size-4" /> GeoJSON</Button>
        ) : (
          <Button variant="gradient" size="sm"><Plus className="size-4" /> Cadastrar fazenda</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Trees className="size-4 text-[hsl(176_84%_25%)]" /> Cadastrar fazenda</DialogTitle>
          <DialogDescription>A transportadora é guardiã da evidência de origem recebida, não dona do polígono.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <F label="Nome"><Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Fazenda…" className="h-9" /></F>
          <F label="Produtor"><Input value={produtor} onChange={(e) => setProdutor(e.target.value)} className="h-9" /></F>
          <F label="CAR" full><Input value={car} onChange={(e) => setCar(e.target.value)} placeholder="MT-…" className="h-9 font-mono" /></F>
          <F label="Município"><Input value={cidade} onChange={(e) => setCidade(e.target.value)} className="h-9" /></F>
          <F label="UF"><Input value={uf} onChange={(e) => setUf(e.target.value)} placeholder="MT" className="h-9" /></F>
          <F label="Cultura (vírgula)" full><Input value={cultura} onChange={(e) => setCultura(e.target.value)} className="h-9" /></F>
        </div>

        {/* Import de polígono */}
        <div className={cn("rounded-lg border border-dashed p-3", poligonoOk ? "border-[hsl(142_60%_75%)] bg-[hsl(142_65%_98%)]" : "border-[hsl(200_18%_82%)]")}>
          {poligonoOk ? (
            <p className="text-[12px] text-[hsl(142_71%_28%)] flex items-center gap-1.5"><CheckCircle2 className="size-4" /> Polígono {formato} vinculado · pronto para validação INPE/MapBiomas.</p>
          ) : (
            <>
              <p className="text-[11px] text-[hsl(210_14%_42%)] mb-2">Importar polígono de origem (aceita múltiplos formatos):</p>
              <div className="flex flex-wrap gap-2">
                {["Shapefile", "GeoJSON", "KML", "PDF declaração"].map((fmt) => (
                  <Button key={fmt} variant="outline" size="sm" onClick={() => importarPoligono(fmt)}><Upload className="size-3.5" /> {fmt}</Button>
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}>Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><Label className="text-[11px]">{label}</Label><div className="mt-1">{children}</div></div>;
}
