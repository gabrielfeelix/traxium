"use client";

// Assinatura do Acordo de Garantia da Qualidade.
//
// A Fase 5 fez `acordo_vigente` bloquear o carregamento, mas não havia como
// resolver pela interface: o motor travava e o produto não oferecia caminho.
// Regra que bloqueia sem oferecer saída é armadilha, não controle.
//
// O acordo aqui não é arquivo anexado: é registro com versão, vigência,
// assinatura, dispositivo e data de renovação — o que a diretriz §Gatekeeper
// pede para ele deixar de ser "um arquivo isolado".

import { useState } from "react";
import { FileSignature, CalendarClock, Check } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AssinaturaCanvas } from "@/components/gatekeeper/assinatura-canvas";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { estadoQualificacao, type Subcontratado } from "@/lib/domain/model";
import { formatDate } from "@/lib/utils";

const VERSAO_VIGENTE = "v3.0";

const CLAUSULAS = [
  "Transportar sob a cadeia GMP+ FSA apenas com compartimento inspecionado e evidenciado.",
  "Declarar as três últimas cargas de cada compartimento antes do carregamento.",
  "Executar o regime de limpeza que a IDTF exigir e guardar a evidência.",
  "Não carregar alimentação animal sobre resíduo de carga proibida, em nenhuma hipótese.",
  "Comunicar imediatamente qualquer suspeita de contaminação.",
  "Manter motoristas com as trilhas obrigatórias vigentes.",
];

export function AssinarAcordoModal({ s }: { s: Subcontratado }) {
  const { assinarAcordo } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [assinante, setAssinante] = useState("");
  const [representantes, setRepresentantes] = useState("");
  const [aceite, setAceite] = useState(false);
  const [assinatura, setAssinatura] = useState<string | null>(null);

  const vencido = s.acordo ? new Date(s.acordo.vigenciaFim) < new Date() : false;
  const pode = assinante.trim().length > 2 && aceite && Boolean(assinatura);

  function assinar() {
    const r = assinarAcordo(s.id, {
      versao: VERSAO_VIGENTE,
      assinante: assinante.trim(),
      representantes: representantes.split(",").map((x) => x.trim()).filter(Boolean),
    });
    const depois = estadoQualificacao({ ...s, acordo: r });
    toast("Acordo assinado", {
      type: "success",
      desc: `${VERSAO_VIGENTE} vigente até ${formatDate(r.vigenciaFim)}. Estado agora: ${depois.estado}.`,
    });
    setOpen(false);
    setAssinante(""); setRepresentantes(""); setAceite(false); setAssinatura(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={s.acordo && !vencido ? "outline" : "gradient"} size="sm" className="w-full">
          <FileSignature className="size-4" />
          {!s.acordo ? "Firmar acordo de qualidade" : vencido ? "Renovar acordo vencido" : "Ver acordo vigente"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Acordo de Garantia da Qualidade</DialogTitle>
          <DialogDescription>
            {s.razaoSocial} · {s.cnpj}
            {s.acordo && (
              <>
                {" "}· atual {s.acordo.versao}, {vencido ? "vencido" : "vigente"} até{" "}
                {formatDate(s.acordo.vigenciaFim)}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5">
          <div className="rounded-xl border border-border-soft bg-bg p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold text-fg">Cláusulas · {VERSAO_VIGENTE}</p>
              <span className="inline-flex items-center gap-1 text-[10.5px] text-fg-muted num">
                <CalendarClock className="size-3" /> vigência de 12 meses
              </span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {CLAUSULAS.map((c) => (
                <li key={c} className="flex items-start gap-1.5 text-[11.5px] text-fg-muted leading-relaxed">
                  <Check className="size-3 shrink-0 mt-0.5 text-brand-600" /> {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px]">Quem assina</Label>
              <Input
                value={assinante}
                onChange={(e) => setAssinante(e.target.value)}
                placeholder="Nome do responsável"
                className="h-9 mt-1"
              />
            </div>
            <div>
              <Label className="text-[11px]">Outros representantes</Label>
              <Input
                value={representantes}
                onChange={(e) => setRepresentantes(e.target.value)}
                placeholder="Separados por vírgula"
                className="h-9 mt-1"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox checked={aceite} onCheckedChange={(v) => setAceite(Boolean(v))} className="mt-0.5" />
            <span className="text-[12px] text-fg-muted">
              Declaro ter poderes para firmar este acordo em nome da empresa e aceito as cláusulas acima.
            </span>
          </label>

          <div>
            <Label className="text-[11px]">Assinatura</Label>
            <AssinaturaCanvas onChange={setAssinatura} altura={150} className="mt-1.5" />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" size="sm">Cancelar</Button></DialogClose>
          <Button size="sm" variant="gradient" disabled={!pode} onClick={assinar}>
            <FileSignature className="size-4" /> Assinar e registrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
