"use client";

// Liberação manual com registro padronizado (Fase 7).
//
// O motivo é escolhido de uma lista fechada por regra — texto livre não agrupa,
// não compara e não sobrevive a auditoria. A justificativa continua obrigatória,
// mas como complemento: explica ESTE caso dentro de uma categoria que já existe.
//
// Situação anterior e posterior não são campos: a anterior é lida do estado da
// viagem na hora de abrir, a posterior é lida depois que a decisão é gravada.

import { useState } from "react";
import { Check, ShieldCheck, ShieldAlert, Paperclip, Plus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HOJE, NIVEL_LABEL, type Excecao } from "@/lib/domain/model";
import {
  motivosDaRegra, situacaoDaViagem, expiraEm, IMPACTOS, VALIDADES,
  type ImpactoId, type ValidadeId,
} from "@/lib/domain/liberacao";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, cn } from "@/lib/utils";

/** Carimbo da decisão. Conta contra o `HOJE` do protótipo, como o resto do domínio. */
const DECISAO_EM = `${HOJE}T10:00:00`;

export function LiberacaoModal({ excecao }: { excecao: Excecao }) {
  const { decidirExcecao } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set(excecao.evidencias));
  const [nova, setNova] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [impacto, setImpacto] = useState<ImpactoId | "">("");
  const [validade, setValidade] = useState<ValidadeId | "">("");

  const motivos = motivosDaRegra(excecao.regra);
  const anterior = situacaoDaViagem(excecao.viagemId);
  const evidencias = [...excecao.evidencias, ...extras].filter((e) => marcadas.has(e));
  const completo = Boolean(motivo && justificativa.trim() && evidencias.length && impacto && validade);

  function reset() {
    setMotivo(""); setJustificativa(""); setNova(""); setExtras([]);
    setMarcadas(new Set(excecao.evidencias)); setImpacto(""); setValidade("");
  }

  function marcar(ev: string) {
    setMarcadas((s) => {
      const n = new Set(s);
      n.has(ev) ? n.delete(ev) : n.add(ev);
      return n;
    });
  }

  function anexar() {
    const t = nova.trim();
    if (!t) return;
    setExtras((x) => [...x, t]);
    setMarcadas((s) => new Set(s).add(t));
    setNova("");
  }

  function liberar() {
    if (!completo) return;
    const r = decidirExcecao(excecao.id, "aprovada", {
      motivoPadronizado: motivo,
      justificativa,
      evidencias,
      impacto: impacto as ImpactoId,
      validade: validade as ValidadeId,
    });
    if (!r.ok) {
      toast("Liberação não registrada", { type: "error", desc: r.motivo });
      return;
    }
    const posterior = situacaoDaViagem(excecao.viagemId);
    toast("Liberação registrada", {
      type: "success",
      desc: `${anterior.faixa} → ${posterior.faixa}. Nove campos gravados na trilha de auditoria.`,
    });
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Check className="size-4" /> Aprovar liberação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registro da liberação manual</DialogTitle>
          <DialogDescription>
            {excecao.codigoViagem} · regra “{excecao.regra}” · exige {NIVEL_LABEL[excecao.nivelRequerido]}.
          </DialogDescription>
        </DialogHeader>

        {motivos.length === 0 ? (
          <div className="rounded-lg border border-danger-500/30 bg-danger-50 p-3 flex items-start gap-2">
            <ShieldAlert className="size-4 shrink-0 mt-0.5 text-danger-500" />
            <p className="text-[12px] text-danger-700">
              Não há motivo padronizado que libere esta regra. Nenhuma redação torna o fato conforme — o caminho é
              regularizar e deixar o motor reavaliar.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Campo 6 — capturado, não digitado */}
            <div className="rounded-lg border border-border-soft bg-bg p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted">
                Situação anterior · capturada do estado da viagem
              </p>
              <p className="mt-1 text-[12px] text-fg num">{anterior.resumo}</p>
            </div>

            {/* Campo 1 */}
            <div>
              <Label className="text-[11px]">Motivo padronizado</Label>
              <Select value={motivo} onValueChange={setMotivo}>
                <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Escolha o motivo…" /></SelectTrigger>
                <SelectContent>
                  {motivos.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-fg-soft mt-1">
                Lista fechada da regra. É o que permite comparar liberações entre viagens, meses e filiais.
              </p>
            </div>

            {/* Campo 2 */}
            <div>
              <Label className="text-[11px]" htmlFor="justificativa">Justificativa (complemento)</Label>
              <textarea
                id="justificativa"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                rows={3}
                placeholder="O que este caso tem de específico dentro do motivo escolhido."
                className={cn(
                  "mt-1 flex w-full rounded-md border border-[hsl(200_18%_88%)] bg-white px-3 py-2 text-[13px] text-[hsl(200_25%_12%)]",
                  "placeholder:text-[hsl(210_12%_58%)] focus:outline-none focus:border-[hsl(176_60%_55%)] focus:ring-2 focus:ring-[hsl(176_84%_45%_/_0.18)]"
                )}
              />
            </div>

            {/* Campo 3 */}
            <div>
              <Label className="text-[11px]">Evidência</Label>
              <div className="mt-1 space-y-1.5">
                {[...excecao.evidencias, ...extras].map((ev) => (
                  <label key={ev} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={marcadas.has(ev)} onCheckedChange={() => marcar(ev)} />
                    <span className="text-[12px] text-fg inline-flex items-center gap-1.5">
                      <Paperclip className="size-3 text-fg-soft" /> {ev}
                    </span>
                  </label>
                ))}
                {![...excecao.evidencias, ...extras].length && (
                  <p className="text-[11px] text-fg-muted">Nenhuma evidência anexada à solicitação.</p>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  value={nova}
                  onChange={(e) => setNova(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); anexar(); } }}
                  placeholder="Identificação de outra evidência…"
                  className="h-8 text-[12px]"
                />
                <Button variant="outline" size="sm" onClick={anexar} disabled={!nova.trim()}>
                  <Plus className="size-3.5" /> Anexar
                </Button>
              </div>
            </div>

            {/* Campos 8 e 9 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px]">Impacto</Label>
                <Select value={impacto} onValueChange={(v) => setImpacto(v as ImpactoId)}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Impacto…" /></SelectTrigger>
                  <SelectContent>
                    {IMPACTOS.map((i) => <SelectItem key={i.id} value={i.id}>{i.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {impacto && (
                  <p className="text-[10px] text-fg-soft mt-1">
                    {IMPACTOS.find((i) => i.id === impacto)?.desc}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-[11px]">Validade da decisão</Label>
                <Select value={validade} onValueChange={(v) => setValidade(v as ValidadeId)}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Validade…" /></SelectTrigger>
                  <SelectContent>
                    {VALIDADES.map((v) => <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {validade && (
                  <p className="text-[10px] text-fg-soft mt-1">
                    {VALIDADES.find((v) => v.id === validade)?.desc}
                    {/* A data de decisão é a do protótipo (HOJE), a mesma que o store grava. */}
                    {(() => {
                      const exp = expiraEm(validade as ValidadeId, DECISAO_EM);
                      return exp ? ` Expira em ${formatDateTime(exp)}.` : "";
                    })()}
                  </p>
                )}
              </div>
            </div>

            {/* Campos 4, 5 e 7 — o sistema preenche */}
            <div className="rounded-lg border border-dashed border-border bg-bg p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted">
                Preenchidos pelo sistema
              </p>
              <p className="text-[11px] text-fg-muted mt-1 leading-relaxed">
                Responsável (papel em sessão), data/hora da decisão e a situação posterior da viagem entram no registro
                automaticamente. Quem decidiu não descreve o efeito da própria decisão.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" size="sm">Cancelar</Button></DialogClose>
          {motivos.length > 0 && (
            <Button
              size="sm"
              variant="gradient"
              disabled={!completo}
              onClick={liberar}
              className={cn(!completo && "opacity-50")}
            >
              <ShieldCheck className="size-4" /> Registrar liberação
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Cartão dos nove campos, como aparece na exceção decidida e no dossiê. */
export function RegistroLiberacaoCard({
  r,
  compacto,
}: {
  r: import("@/lib/domain/liberacao").RegistroLiberacao;
  compacto?: boolean;
}) {
  const campos: { n: number; rotulo: string; valor: React.ReactNode }[] = [
    { n: 1, rotulo: "Motivo padronizado", valor: r.motivoPadronizado },
    { n: 2, rotulo: "Justificativa", valor: r.justificativa },
    { n: 3, rotulo: "Evidência", valor: r.evidencias.join(" · ") },
    { n: 4, rotulo: "Responsável", valor: r.responsavel },
    { n: 5, rotulo: "Data/hora", valor: formatDateTime(r.dataHora) },
    { n: 6, rotulo: "Situação anterior", valor: r.situacaoAnterior.resumo },
    { n: 7, rotulo: "Situação posterior", valor: r.situacaoPosterior.resumo },
    { n: 8, rotulo: "Impacto", valor: IMPACTOS.find((i) => i.id === r.impacto)?.label ?? r.impacto },
    {
      n: 9,
      rotulo: "Validade da decisão",
      valor: `${VALIDADES.find((v) => v.id === r.validade)?.label ?? r.validade}${r.expiraEm ? ` · expira ${formatDateTime(r.expiraEm)}` : ""}`,
    },
  ];

  return (
    <div className={cn("rounded-md border border-border-soft bg-bg", compacto ? "p-2" : "p-3")}>
      <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted">
        Registro da liberação · <span className="num">9</span> campos
      </p>
      <dl className="mt-1.5 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
        {campos.map((c) => (
          <div key={c.n} className={cn(c.n === 2 || c.n === 6 || c.n === 7 ? "sm:col-span-2" : "")}>
            <dt className="text-[9.5px] uppercase tracking-[0.08em] text-fg-soft">
              <span className="font-mono">{c.n}</span> · {c.rotulo}
            </dt>
            <dd className="text-[11.5px] text-fg leading-snug">{c.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
