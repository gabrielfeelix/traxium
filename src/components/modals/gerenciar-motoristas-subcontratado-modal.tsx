"use client";

import { useMemo, useState } from "react";
import { IdCard, Link2, Plus, UsersRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { motoristas, type Motorista } from "@/lib/mock-data";
import {
  motoristasDoSubcontratado,
  vinculoVigenteDaEntidade,
  type Subcontratado,
} from "@/lib/domain/model";
import { useSession } from "@/lib/store/session";
import { cn } from "@/lib/utils";
import { ConvidarAcessoExternoModal } from "@/components/modals/convidar-acesso-externo-modal";

type Modo = "existente" | "novo";

export function GerenciarMotoristasSubcontratadoModal({ s }: { s: Subcontratado }) {
  const { version, vincularMotoristaSubcontratado, cadastrarMotoristaSubcontratado } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [modo, setModo] = useState<Modo>("existente");
  const [motoristaId, setMotoristaId] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cnhNumero, setCnhNumero] = useState("");
  const [cnhCategoria, setCnhCategoria] = useState("E");
  const [cnhVencimento, setCnhVencimento] = useState("");
  const [letramento, setLetramento] = useState<Motorista["letramentoDigital"]>("Médio");

  const vinculados = useMemo(
    () => motoristasDoSubcontratado(s.id).map((id) => motoristas.find((m) => m.id === id)).filter(Boolean) as Motorista[],
    // O registro do protótipo é mutável; version sinaliza as alterações da sessão.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [s.id, version]
  );
  const disponiveis = useMemo(
    () => motoristas.filter((m) => m.tipo === "Subcontratado" && !vinculoVigenteDaEntidade("motorista", m.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version]
  );

  const novoValido = Boolean(nome.trim() && cpf.trim() && cidade.trim() && uf.length === 2 && cnhVencimento);

  function reset() {
    setModo("existente");
    setMotoristaId("");
    setNome("");
    setCpf("");
    setTelefone("");
    setCidade("");
    setUf("");
    setCnhNumero("");
    setCnhCategoria("E");
    setCnhVencimento("");
    setLetramento("Médio");
  }

  function vincularExistente() {
    const resultado = vincularMotoristaSubcontratado(s.id, motoristaId);
    toast(resultado.ok ? "Motorista vinculado" : "Vínculo não realizado", {
      type: resultado.ok ? "success" : "error",
      desc: resultado.motivo,
    });
    if (resultado.ok) setMotoristaId("");
  }

  function cadastrarNovo() {
    const resultado = cadastrarMotoristaSubcontratado(s.id, {
      nome: nome.trim(),
      cpf: cpf.trim(),
      telefone: telefone.trim(),
      cidade: cidade.trim(),
      uf,
      letramentoDigital: letramento,
      cnh: {
        numero: cnhNumero.trim() || "********",
        categoria: cnhCategoria,
        vencimento: cnhVencimento,
      },
      certificacoes: [],
    });
    toast(resultado.ok ? "Motorista cadastrado e vinculado" : "Cadastro não realizado", {
      type: resultado.ok ? "success" : "error",
      desc: resultado.motivo,
    });
    if (resultado.ok) {
      setOpen(false);
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <UsersRound className="size-4" /> Gerenciar motoristas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UsersRound className="size-4 text-brand-700" /> Motoristas de {s.razaoSocial}
          </DialogTitle>
          <DialogDescription>
            Cadastre um condutor terceiro já ligado à empresa ou associe um cadastro existente. Isso não cria acesso ao aplicativo.
          </DialogDescription>
        </DialogHeader>

        <section className="rounded-lg border border-border bg-bg p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-fg">Vínculos vigentes</p>
            <Badge variant="secondary" className="text-[9px]">{vinculados.length} motorista(s)</Badge>
          </div>
          {vinculados.length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {vinculados.map((m) => (
                <div key={m.id} className="flex min-w-0 flex-wrap items-center gap-2 rounded-md border border-border-soft bg-bg-elev px-2.5 py-2">
                  <IdCard className="size-3.5 shrink-0 text-fg-muted" />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-fg">{m.nome}</p>
                    <p className="truncate text-[10px] text-fg-muted">{m.cidade}/{m.uf} · CNH {m.cnh.categoria}</p>
                  </div>
                  <div className="ml-auto">
                    <ConvidarAcessoExternoModal tipo="app_motorista" entidadeId={m.id} nome={m.nome} compact />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-fg-muted">Nenhum motorista está ligado a esta empresa.</p>
          )}
        </section>

        <div className="grid grid-cols-2 rounded-lg border border-border bg-bg p-1" role="group" aria-label="Forma de adicionar motorista">
          <ModoButton ativo={modo === "existente"} onClick={() => setModo("existente")} icon={Link2}>
            Vincular existente
          </ModoButton>
          <ModoButton ativo={modo === "novo"} onClick={() => setModo("novo")} icon={Plus}>
            Cadastrar novo
          </ModoButton>
        </div>

        {modo === "existente" ? (
          <div className="space-y-3">
            <Field label="Motorista terceiro sem vínculo vigente">
              <Select value={motoristaId} onValueChange={setMotoristaId}>
                <SelectTrigger><SelectValue placeholder="Selecione um motorista" /></SelectTrigger>
                <SelectContent>
                  {disponiveis.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.nome} · {m.cidade}/{m.uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {disponiveis.length === 0 && (
              <p className="rounded-md border border-dashed border-border p-3 text-[11px] text-fg-muted">
                Não há motorista terceiro livre. Cadastre um novo ou encerre o vínculo vigente antes de transferir alguém.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Nome completo" full><Input value={nome} onChange={(e) => setNome(e.target.value)} /></Field>
            <Field label="CPF"><Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" /></Field>
            <Field label="Telefone"><Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 0 0000-0000" /></Field>
            <Field label="Município"><Input value={cidade} onChange={(e) => setCidade(e.target.value)} /></Field>
            <Field label="UF"><Input value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} maxLength={2} placeholder="MT" /></Field>
            <Field label="CNH — número"><Input value={cnhNumero} onChange={(e) => setCnhNumero(e.target.value)} /></Field>
            <Field label="CNH — categoria">
              <Select value={cnhCategoria} onValueChange={setCnhCategoria}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["A", "B", "C", "D", "E"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="CNH — validade"><Input type="date" value={cnhVencimento} onChange={(e) => setCnhVencimento(e.target.value)} /></Field>
            <Field label="Letramento digital">
              <Select value={letramento} onValueChange={(v) => setLetramento(v as Motorista["letramentoDigital"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alto">Alto</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Básico">Básico</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        )}

        <DialogFooter>
          {modo === "existente" ? (
            <Button variant="gradient" size="sm" disabled={!motoristaId} onClick={vincularExistente}>
              <Link2 className="size-4" /> Criar vínculo
            </Button>
          ) : (
            <Button variant="gradient" size="sm" disabled={!novoValido} onClick={cadastrarNovo}>
              <Plus className="size-4" /> Cadastrar e vincular
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={cn(full && "sm:col-span-2")}>
      <Label className="text-[11px]">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ModoButton({
  ativo,
  onClick,
  icon: Icon,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  icon: typeof Link2;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={cn(
        "flex min-h-9 items-center justify-center gap-1.5 rounded-md px-2 text-[11px] font-semibold transition-colors",
        ativo ? "bg-bg-elev text-brand-800 shadow-sm" : "text-fg-muted hover:text-fg"
      )}
    >
      <Icon className="size-3.5" /> {children}
    </button>
  );
}
