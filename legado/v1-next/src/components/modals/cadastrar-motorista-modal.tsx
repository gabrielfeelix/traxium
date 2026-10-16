"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, IdCard } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";

export function CadastrarMotoristaModal() {
  const { addMotorista } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipo, setTipo] = useState<"Próprio" | "Agregado">("Próprio");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [letramento, setLetramento] = useState<"Alto" | "Médio" | "Básico">("Médio");
  const [cnhNumero, setCnhNumero] = useState("");
  const [cnhCategoria, setCnhCategoria] = useState("E");
  const [cnhVenc, setCnhVenc] = useState("");
  const [moppVenc, setMoppVenc] = useState("");
  const [gmpTipo, setGmpTipo] = useState("GMP+ Básico");
  const [gmpVenc, setGmpVenc] = useState("");

  const valido = nome.trim() && cidade.trim() && uf.trim() && cnhVenc;

  function reset() {
    setNome(""); setCpf(""); setTipo("Próprio"); setTelefone(""); setCidade(""); setUf("");
    setLetramento("Médio"); setCnhNumero(""); setCnhCategoria("E"); setCnhVenc("");
    setMoppVenc(""); setGmpTipo("GMP+ Básico"); setGmpVenc("");
  }

  function salvar() {
    const certificacoes = [
      ...(moppVenc ? [{ nome: "MOPP", status: "Válida" as const, vencimento: moppVenc }] : []),
      ...(gmpVenc ? [{ nome: `Treinamento ${gmpTipo}`, status: "Válida" as const, vencimento: gmpVenc }] : []),
    ];
    addMotorista({
      nome, cpf, tipo, telefone, cidade, uf,
      letramentoDigital: letramento,
      cnh: { numero: cnhNumero || "********", categoria: cnhCategoria, vencimento: cnhVenc },
      certificacoes,
    });
    toast("Motorista cadastrado", { desc: `${nome} · ${tipo} · ${cidade}/${uf}` });
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm"><Plus className="size-4" /> Cadastrar motorista</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><IdCard className="size-4 text-[hsl(176_84%_25%)]" /> Cadastrar motorista</DialogTitle>
          <DialogDescription>Motorista próprio ou agregado — opera sob o FSMS da transportadora.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <F label="Nome completo" full><Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do motorista" className="h-9" /></F>
          <F label="CPF"><Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" className="h-9 font-mono" /></F>
          <F label="Telefone"><Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 0 0000-0000" className="h-9" /></F>
          <F label="Tipo">
            <Select value={tipo} onValueChange={(v) => setTipo(v as "Próprio" | "Agregado")}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Próprio">Próprio</SelectItem>
                <SelectItem value="Agregado">Agregado</SelectItem>
              </SelectContent>
            </Select>
          </F>
          <F label="Letramento digital">
            <Select value={letramento} onValueChange={(v) => setLetramento(v as "Alto" | "Médio" | "Básico")}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Alto">Alto</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Básico">Básico</SelectItem>
              </SelectContent>
            </Select>
          </F>
          <F label="Município"><Input value={cidade} onChange={(e) => setCidade(e.target.value)} className="h-9" /></F>
          <F label="UF"><Input value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} placeholder="MT" maxLength={2} className="h-9" /></F>
        </div>

        <div className="rounded-lg border border-[hsl(200_18%_90%)] bg-[hsl(200_18%_98%)] p-3">
          <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[hsl(210_14%_42%)] mb-2">CNH</p>
          <div className="grid grid-cols-3 gap-3">
            <F label="Número"><Input value={cnhNumero} onChange={(e) => setCnhNumero(e.target.value)} className="h-9 font-mono" /></F>
            <F label="Categoria">
              <Select value={cnhCategoria} onValueChange={setCnhCategoria}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{["A", "B", "C", "D", "E"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Validade"><Input type="date" value={cnhVenc} onChange={(e) => setCnhVenc(e.target.value)} className="h-9" /></F>
          </div>
        </div>

        <div className="rounded-lg border border-[hsl(200_18%_90%)] bg-[hsl(200_18%_98%)] p-3">
          <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[hsl(210_14%_42%)] mb-2">Certificações iniciais (opcional)</p>
          <div className="grid grid-cols-3 gap-3">
            <F label="MOPP — validade"><Input type="date" value={moppVenc} onChange={(e) => setMoppVenc(e.target.value)} className="h-9" /></F>
            <F label="Treinamento GMP+">
              <Select value={gmpTipo} onValueChange={setGmpTipo}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GMP+ Básico">GMP+ Básico</SelectItem>
                  <SelectItem value="GMP+ Avançado">GMP+ Avançado</SelectItem>
                </SelectContent>
              </Select>
            </F>
            <F label="GMP+ — validade"><Input type="date" value={gmpVenc} onChange={(e) => setGmpVenc(e.target.value)} className="h-9" /></F>
          </div>
        </div>

        <div className="rounded-md bg-[hsl(174_64%_97%)] border border-[hsl(176_60%_85%)] p-2.5">
          <p className="text-[11px] text-[hsl(180_80%_18%)] leading-snug">
            É motorista de <strong>subcontratado</strong>? Não cadastre aqui —{" "}
            <DialogClose asChild><Link href="/subcontratados" className="underline font-semibold">qualifique a empresa em Subcontratados</Link></DialogClose>.
          </p>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}><Plus className="size-4" /> Cadastrar motorista</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><Label className="text-[11px]">{label}</Label><div className="mt-1">{children}</div></div>;
}
