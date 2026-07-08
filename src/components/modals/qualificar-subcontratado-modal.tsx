"use client";

import { useState } from "react";
import { Plus, Building2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Subcontratado, nivelVencimento } from "@/lib/domain/model";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type Escopo = "Road Transport of Feed" | "Affreightment of Road Transport";

export function QualificarSubcontratadoModal() {
  const { addSubcontratado } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [cnpj, setCnpj] = useState("");
  const [razao, setRazao] = useState("");
  const [numero, setNumero] = useState("");
  const [certificadora, setCertificadora] = useState("Único Organismo Certificador BR");
  const [escopos, setEscopos] = useState<Escopo[]>(["Road Transport of Feed"]);
  const [validade, setValidade] = useState("");
  const [sites, setSites] = useState("");
  const [statusBase, setStatusBase] = useState<Subcontratado["certGMP"]["statusBasePublica"]>("Ativo");
  const [veiculos, setVeiculos] = useState("");
  const [mot, setMot] = useState("");
  const [tComprovante, setTComprovante] = useState(false);
  const [tQuiz, setTQuiz] = useState(false);
  const [tAceite, setTAceite] = useState(false);

  function reset() {
    setCnpj(""); setRazao(""); setNumero(""); setEscopos(["Road Transport of Feed"]); setValidade("");
    setSites(""); setStatusBase("Ativo"); setVeiculos(""); setMot(""); setTComprovante(false); setTQuiz(false); setTAceite(false);
  }
  const toggleEscopo = (e: Escopo) => setEscopos((s) => (s.includes(e) ? s.filter((x) => x !== e) : [...s, e]));

  const valido = cnpj && razao && numero && validade && escopos.length > 0;

  function salvar() {
    addSubcontratado({
      cnpj, razaoSocial: razao,
      certGMP: {
        numero, certificadora, escopo: escopos, validade,
        sitesCobertos: sites.split(",").map((s) => s.trim()).filter(Boolean),
        statusBasePublica: statusBase,
      },
      veiculosAutorizados: veiculos.split(",").map((s) => s.trim()).filter(Boolean),
      motoristasAutorizados: mot.split(",").map((s) => s.trim()).filter(Boolean),
      treinamento: { comprovante: tComprovante, quiz: tQuiz, aceiteRegras: tAceite },
    });
    // Mesma lógica do card de /subcontratados: vencido OU base pública ≠ Ativo → bloqueado.
    const vencido = nivelVencimento(validade).nivel === "vencido";
    const bloqueado = vencido || statusBase !== "Ativo";
    toast(`${razao} qualificado`, {
      type: bloqueado ? "error" : "success",
      desc: bloqueado
        ? vencido
          ? "Certificado GMP+ vencido → bloqueado até renovar."
          : "Status na base pública não é Ativo → bloqueado."
        : "Escopo válido e certificado vigente — apto a operar cadeia GMP+.",
    });
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm"><Plus className="size-4" /> Qualificar subcontratado</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Building2 className="size-4 text-[hsl(176_84%_25%)]" /> Qualificar subcontratado</DialogTitle>
          <DialogDescription>Valida mais que o CNPJ: escopo, validade, base pública e autorizados.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Secao titulo="Empresa">
            <div className="grid grid-cols-2 gap-3">
              <F label="CNPJ"><Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" className="h-9" /></F>
              <F label="Razão social"><Input value={razao} onChange={(e) => setRazao(e.target.value)} placeholder="Transportes…" className="h-9" /></F>
            </div>
          </Secao>

          <Secao titulo="Certificação GMP+">
            <div className="grid grid-cols-2 gap-3">
              <F label="Nº do certificado"><Input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="GMP-BR-…" className="h-9" /></F>
              <F label="Validade"><Input value={validade} onChange={(e) => setValidade(e.target.value)} type="date" className="h-9" /></F>
              <F label="Certificadora" full><Input value={certificadora} onChange={(e) => setCertificadora(e.target.value)} className="h-9" /></F>
              <F label="Status na base pública">
                <Select value={statusBase} onValueChange={(v) => setStatusBase(v as Subcontratado["certGMP"]["statusBasePublica"])}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                    <SelectItem value="Não localizado">Não localizado</SelectItem>
                  </SelectContent>
                </Select>
              </F>
              <F label="Sites cobertos (vírgula)"><Input value={sites} onChange={(e) => setSites(e.target.value)} placeholder="Sorriso/MT, …" className="h-9" /></F>
            </div>
            <div className="mt-2">
              <Label className="text-[11px]">Escopo</Label>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {(["Road Transport of Feed", "Affreightment of Road Transport"] as Escopo[]).map((e) => (
                  <button
                    key={e}
                    onClick={() => toggleEscopo(e)}
                    className={cn(
                      "h-9 rounded-md border text-[12px] font-medium transition-all",
                      escopos.includes(e) ? "border-[hsl(176_84%_25%)] bg-[hsl(174_64%_97%)] text-[hsl(180_80%_18%)]" : "border-[hsl(200_18%_88%)] text-[hsl(210_14%_42%)]"
                    )}
                  >{e}</button>
                ))}
              </div>
            </div>
          </Secao>

          <Secao titulo="Autorização e treinamento">
            <div className="grid grid-cols-2 gap-3">
              <F label="Veículos autorizados (vírgula)"><Input value={veiculos} onChange={(e) => setVeiculos(e.target.value)} placeholder="ABC-1D23, …" className="h-9" /></F>
              <F label="Motoristas autorizados (vírgula)"><Input value={mot} onChange={(e) => setMot(e.target.value)} placeholder="Nome, …" className="h-9" /></F>
            </div>
            <div className="space-y-2 mt-2">
              {[
                { l: "Comprovante de treinamento", v: tComprovante, set: setTComprovante },
                { l: "Quiz mínimo aprovado", v: tQuiz, set: setTQuiz },
                { l: "Aceite das regras GMP+/EUDR", v: tAceite, set: setTAceite },
              ].map((t) => (
                <div key={t.l} className="flex items-center justify-between rounded-md border border-[hsl(200_18%_90%)] px-3 h-9">
                  <Label className="text-[12px] cursor-pointer">{t.l}</Label>
                  <Switch checked={t.v} onCheckedChange={t.set} />
                </div>
              ))}
            </div>
          </Secao>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}>Qualificar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[hsl(210_14%_42%)] mb-2">{titulo}</p>
      {children}
    </div>
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
