"use client";

import { useState } from "react";
import { Plus, Truck, Container, Boxes } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { implementos, subcontratados, type Implemento } from "@/lib/domain/model";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type Tipo = "cavalo" | "implemento" | "compartimento";

export function AdicionarAtivoModal() {
  const { addCavalo, addImplemento, addCompartimento } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<Tipo>("implemento");

  // cavalo
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  // implemento
  const [impTipo, setImpTipo] = useState<Implemento["tipo"]>("Graneleiro");
  const [nComp, setNComp] = useState("1");
  const [prop, setProp] = useState<Implemento["proprietario"]>("Frota própria");
  const [subId, setSubId] = useState("");
  const [certVal, setCertVal] = useState("");
  // compartimento
  const [impPai, setImpPai] = useState("");
  const [ident, setIdent] = useState("");
  const [capac, setCapac] = useState("30");

  function reset() {
    setPlaca(""); setModelo(""); setAno(""); setImpTipo("Graneleiro"); setNComp("1");
    setProp("Frota própria"); setSubId(""); setCertVal(""); setImpPai(""); setIdent(""); setCapac("30");
  }

  const valido =
    tipo === "cavalo" ? !!(placa && modelo) :
    tipo === "implemento" ? !!(placa && certVal && (prop === "Frota própria" || subId)) :
    !!(impPai && ident);

  function salvar() {
    if (tipo === "cavalo") {
      addCavalo({ placa, modelo, ano: Number(ano) || 2022, documentacaoOk: true });
      toast("Cavalo cadastrado", { desc: `${placa} · não carrega T-3.` });
    } else if (tipo === "implemento") {
      const n = Math.max(1, Number(nComp) || 1);
      addImplemento({
        placa, tipo: impTipo, nCompartimentos: n, proprietario: prop,
        subcontratadoId: prop === "Subcontratado" ? subId : undefined,
        certValidade: certVal, escopo: "Road Transport of Feed",
      });
      toast("Implemento cadastrado", { desc: `${placa} · ${n} compartimento(s) criado(s) automaticamente.` });
    } else {
      addCompartimento({ implementoId: impPai, identificador: ident, capacidadeT: Number(capac) || 30, material: "Aço carbono", estadoConservacao: "Bom" });
      toast("Compartimento cadastrado", { desc: `${ident} · nasce sem histórico T-3.` });
    }
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm"><Plus className="size-4" /> Adicionar ativo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar ativo</DialogTitle>
          <DialogDescription>Cavalo (sem T-3), implemento (cria compartimentos) ou compartimento avulso.</DialogDescription>
        </DialogHeader>

        {/* Seletor de tipo */}
        <div className="grid grid-cols-3 gap-2">
          {([
            { id: "cavalo", label: "Cavalo", icon: <Truck className="size-4" /> },
            { id: "implemento", label: "Implemento", icon: <Container className="size-4" /> },
            { id: "compartimento", label: "Compartimento", icon: <Boxes className="size-4" /> },
          ] as const).map((o) => (
            <button
              key={o.id}
              onClick={() => setTipo(o.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border p-2.5 text-[12px] font-medium transition-all",
                tipo === o.id ? "border-[hsl(176_84%_25%)] bg-[hsl(174_64%_97%)] text-[hsl(180_80%_18%)]" : "border-[hsl(200_18%_88%)] text-[hsl(210_14%_42%)]"
              )}
            >
              {o.icon} {o.label}
            </button>
          ))}
        </div>

        {tipo === "cavalo" && (
          <div className="grid grid-cols-2 gap-3">
            <F label="Placa"><Input value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="ABC-1D23" className="h-9" /></F>
            <F label="Ano"><Input value={ano} onChange={(e) => setAno(e.target.value)} type="number" placeholder="2022" className="h-9" /></F>
            <F label="Modelo" full><Input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Scania R450" className="h-9" /></F>
          </div>
        )}

        {tipo === "implemento" && (
          <div className="grid grid-cols-2 gap-3">
            <F label="Placa"><Input value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="XYZ-9A87" className="h-9" /></F>
            <F label="Tipo">
              <Select value={impTipo} onValueChange={(v) => setImpTipo(v as Implemento["tipo"])}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{(["Graneleiro", "Bitrem", "Rodotrem", "Tanque", "Caçamba", "Baú"] as const).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Nº de compartimentos"><Input value={nComp} onChange={(e) => setNComp(e.target.value)} type="number" min="1" className="h-9" /></F>
            <F label="Validade cert. GMP+"><Input value={certVal} onChange={(e) => setCertVal(e.target.value)} type="date" className="h-9" /></F>
            <F label="Proprietário">
              <Select value={prop} onValueChange={(v) => setProp(v as Implemento["proprietario"])}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frota própria">Frota própria</SelectItem>
                  <SelectItem value="Subcontratado">Subcontratado</SelectItem>
                </SelectContent>
              </Select>
            </F>
            {prop === "Subcontratado" && (
              <F label="Subcontratado">
                <Select value={subId} onValueChange={setSubId}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Empresa…" /></SelectTrigger>
                  <SelectContent>{subcontratados.map((s) => <SelectItem key={s.id} value={s.id}>{s.razaoSocial}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            )}
          </div>
        )}

        {tipo === "compartimento" && (
          <div className="grid grid-cols-2 gap-3">
            <F label="Implemento" full>
              <Select value={impPai} onValueChange={setImpPai}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecionar implemento…" /></SelectTrigger>
                <SelectContent>{implementos.map((i) => <SelectItem key={i.id} value={i.id}>{i.placa} · {i.tipo}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Identificador"><Input value={ident} onChange={(e) => setIdent(e.target.value)} placeholder="Boca 3" className="h-9" /></F>
            <F label="Capacidade (t)"><Input value={capac} onChange={(e) => setCapac(e.target.value)} type="number" className="h-9" /></F>
          </div>
        )}

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}>Salvar ativo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <Label className="text-[11px]">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
