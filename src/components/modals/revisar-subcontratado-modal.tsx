"use client";

import { useState } from "react";
import { FileCheck2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ESTADO_QUALIFICACAO,
  TIPOS_VINCULO,
  estadoQualificacao,
  podeExecutar,
  type Subcontratado,
  type TipoVinculo,
} from "@/lib/domain/model";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type Escopo = Subcontratado["certGMP"]["escopo"][number];
const ESCOPOS: Escopo[] = ["Road Transport of Feed", "Affreightment of Road Transport"];

export function RevisarSubcontratadoModal({ s }: { s: Subcontratado }) {
  const { papel, iniciarQualificacaoSubcontratado } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [cnpj, setCnpj] = useState(s.cnpj);
  const [razao, setRazao] = useState(s.razaoSocial);
  const [tipo, setTipo] = useState<TipoVinculo | undefined>(s.tipoVinculo);
  const [numero, setNumero] = useState(s.certGMP.numero === "—" ? "" : s.certGMP.numero);
  const [certificadora, setCertificadora] = useState(s.certGMP.certificadora === "—" ? "" : s.certGMP.certificadora);
  const [validade, setValidade] = useState(s.certGMP.validade);
  const [statusBase, setStatusBase] = useState<Subcontratado["certGMP"]["statusBasePublica"]>(s.certGMP.statusBasePublica);
  const [sites, setSites] = useState(s.certGMP.sitesCobertos.join(", "));
  const [escopos, setEscopos] = useState<Escopo[]>(s.certGMP.escopo);

  const bloqueado = !podeExecutar(papel, "qualificarSubcontratado");
  const valido = cnpj.trim() && razao.trim() && numero.trim() && certificadora.trim() && validade && escopos.length > 0;

  function carregarDadosAtuais() {
    setCnpj(s.cnpj);
    setRazao(s.razaoSocial);
    setTipo(s.tipoVinculo);
    setNumero(s.certGMP.numero === "—" ? "" : s.certGMP.numero);
    setCertificadora(s.certGMP.certificadora === "—" ? "" : s.certGMP.certificadora);
    setValidade(s.certGMP.validade);
    setStatusBase(s.certGMP.statusBasePublica);
    setSites(s.certGMP.sitesCobertos.join(", "));
    setEscopos(s.certGMP.escopo);
  }

  function toggleEscopo(escopo: Escopo) {
    setEscopos((atuais) => atuais.includes(escopo) ? atuais.filter((item) => item !== escopo) : [...atuais, escopo]);
  }

  function salvar() {
    const resultado = iniciarQualificacaoSubcontratado(s.id, {
      cnpj: cnpj.trim(),
      razaoSocial: razao.trim(),
      tipoVinculo: tipo,
      certificado: {
        numero: numero.trim(),
        certificadora: certificadora.trim(),
        escopo: escopos,
        validade,
        sitesCobertos: sites.split(",").map((site) => site.trim()).filter(Boolean),
        statusBasePublica: statusBase,
      },
    });
    if (!resultado.ok) {
      toast("Não foi possível iniciar a qualificação", { type: "error", desc: resultado.motivo });
      return;
    }
    const qualificacao = estadoQualificacao(s);
    const meta = ESTADO_QUALIFICACAO[qualificacao.estado];
    toast(`${s.razaoSocial} · ${qualificacao.estado}`, {
      type: meta.opera ? "success" : meta.tone === "danger" ? "error" : "info",
      desc: qualificacao.motivo,
    });
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(aberto) => {
        if (aberto) carregarDadosAtuais();
        setOpen(aberto);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm" className="w-full" disabled={bloqueado}>
          <FileCheck2 className="size-4" /> Revisar e iniciar qualificação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Revisar pré-cadastro</DialogTitle>
          <DialogDescription>
            Confirme os dados coletados e consulte o certificado. Só então o registro sai de pré-cadastro; acordo e treinamento continuam pendentes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Secao titulo="Identidade">
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo label="CNPJ ou documento"><Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} className="h-9" /></Campo>
              <Campo label="Razão social ou nome"><Input value={razao} onChange={(e) => setRazao(e.target.value)} className="h-9" /></Campo>
              <Campo label="Tipo de vínculo" full>
                <Select value={tipo} onValueChange={(valor) => setTipo(valor as TipoVinculo)}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{TIPOS_VINCULO.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </Campo>
            </div>
          </Secao>

          <Secao titulo="Certificado conferido">
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo label="Número"><Input value={numero} onChange={(e) => setNumero(e.target.value)} className="h-9" /></Campo>
              <Campo label="Validade"><Input type="date" value={validade} onChange={(e) => setValidade(e.target.value)} className="h-9" /></Campo>
              <Campo label="Certificadora"><Input value={certificadora} onChange={(e) => setCertificadora(e.target.value)} className="h-9" /></Campo>
              <Campo label="Status na base pública">
                <Select value={statusBase} onValueChange={(valor) => setStatusBase(valor as typeof statusBase)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                    <SelectItem value="Não localizado">Não localizado</SelectItem>
                  </SelectContent>
                </Select>
              </Campo>
              <Campo label="Sites cobertos (vírgula)" full><Input value={sites} onChange={(e) => setSites(e.target.value)} className="h-9" /></Campo>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ESCOPOS.map((escopo) => (
                <button
                  key={escopo}
                  type="button"
                  onClick={() => toggleEscopo(escopo)}
                  className={cn(
                    "min-h-10 rounded-lg border px-3 py-2 text-left text-[12px] font-medium",
                    escopos.includes(escopo) ? "border-brand-500 bg-brand-50 text-brand-800" : "border-border bg-bg-elev text-fg-muted"
                  )}
                >
                  {escopo}
                </button>
              ))}
            </div>
          </Secao>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}>
            Confirmar e iniciar qualificação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return <section><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted">{titulo}</p>{children}</section>;
}

function Campo({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "sm:col-span-2" : undefined}><Label className="text-[11px]">{label}</Label><div className="mt-1">{children}</div></div>;
}
