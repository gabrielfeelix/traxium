"use client";

// Registro de conclusão de trilha. A regra de liberação é gate de verdade:
// nota abaixo do mínimo ou tentativas esgotadas NÃO registram competência — o
// modal mostra a reprovação e o estado do motorista não muda.

import { useState } from "react";
import { GraduationCap, Plus, ShieldAlert } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motoristas } from "@/lib/mock-data";
import { TRILHAS, findTrilha, competenciaMotorista, estadoTrilha } from "@/lib/domain/academy";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function AtribuirTrilhaModal() {
  const { registrarConclusao } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [motoristaId, setMotoristaId] = useState("");
  const [trilhaId, setTrilhaId] = useState("");
  const [nota, setNota] = useState("");
  const [tentativas, setTentativas] = useState("1");
  const [aceite, setAceite] = useState(false);

  const trilha = trilhaId ? findTrilha(trilhaId) : undefined;
  const notaNum = Number(nota);
  const podeRegistrar = motoristaId && trilha && nota !== "" && aceite;

  function reset() {
    setMotoristaId(""); setTrilhaId(""); setNota(""); setTentativas("1"); setAceite(false);
  }

  function registrar() {
    if (!trilha) return;
    const r = registrarConclusao({
      motoristaId,
      trilhaId,
      nota: notaNum,
      tentativas: Number(tentativas) || 1,
      aceiteCiencia: aceite,
    });
    if (!r.ok) {
      toast("Conclusão não registrada", { type: "error", desc: r.motivo });
      return;
    }
    const comp = competenciaMotorista(motoristaId);
    toast("Conclusão registrada", {
      type: "success",
      desc: `${r.motivo} ${comp.elegivel ? "Motorista elegível para o despacho." : comp.motivo}`,
    });
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm">
          <Plus className="size-4" /> Registrar conclusão
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar conclusão de trilha</DialogTitle>
          <DialogDescription>
            A avaliação vale como evidência de auditoria: nota, tentativas, aceite de ciência e versão do conteúdo
            ficam no registro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-[11px]">Motorista</Label>
            <Select value={motoristaId} onValueChange={setMotoristaId}>
              <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Motorista…" /></SelectTrigger>
              <SelectContent>
                {motoristas.map((m) => {
                  const c = competenciaMotorista(m.id);
                  return (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome} {!c.elegivel && <span className="text-danger-700">· não elegível</span>}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[11px]">Trilha</Label>
            <Select value={trilhaId} onValueChange={setTrilhaId} disabled={!motoristaId}>
              <SelectTrigger className="h-9 mt-1">
                <SelectValue placeholder={motoristaId ? "Trilha…" : "Escolha o motorista"} />
              </SelectTrigger>
              <SelectContent>
                {TRILHAS.map((t) => {
                  const e = motoristaId ? estadoTrilha(motoristaId, t) : "nunca";
                  return (
                    <SelectItem key={t.id} value={t.id}>
                      {t.codigo} · {t.titulo}
                      {e !== "nunca" && <span className="text-fg-muted"> · {e === "vigente" ? "vigente" : e === "a_vencer" ? "a vencer" : "vencida"}</span>}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {trilha && (
            <div className="rounded-lg border border-border-soft bg-bg p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted">Regra de liberação</p>
              <p className="mt-1 text-[12px] text-fg num">
                Nota mínima {trilha.notaMinima} · até {trilha.tentativasMax} tentativas · reciclagem a cada{" "}
                {trilha.validadeMeses} meses · conteúdo {trilha.versaoConteudo}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px]">Nota obtida</Label>
              <Input
                type="number" min={0} max={100} value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="0–100" className="h-9 mt-1"
              />
            </div>
            <div>
              <Label className="text-[11px]">Tentativa</Label>
              <Input
                type="number" min={1} value={tentativas}
                onChange={(e) => setTentativas(e.target.value)}
                className="h-9 mt-1"
              />
            </div>
          </div>

          {trilha && nota !== "" && notaNum < trilha.notaMinima && (
            <div className="rounded-lg border border-danger-500/30 bg-danger-50 p-2.5 flex items-start gap-2">
              <ShieldAlert className="size-4 shrink-0 mt-0.5 text-danger-500" />
              <p className="text-[11px] text-danger-700">
                Nota abaixo do mínimo. O registro será recusado — reprovação não gera competência.
              </p>
            </div>
          )}

          <label className="flex items-start gap-2.5 cursor-pointer">
            <Checkbox checked={aceite} onCheckedChange={(v) => setAceite(Boolean(v))} className="mt-0.5" />
            <span className="text-[12px] text-fg-muted">
              O motorista registrou <strong className="text-fg">aceite de ciência</strong> do conteúdo. Sem aceite, a
              evidência não vale para auditoria.
            </span>
          </label>
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" size="sm">Cancelar</Button></DialogClose>
          <Button
            size="sm"
            variant="gradient"
            disabled={!podeRegistrar}
            onClick={registrar}
            className={cn(!podeRegistrar && "opacity-50")}
          >
            <GraduationCap className="size-4" /> Registrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
