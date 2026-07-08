"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight, ArrowLeft, Truck, CheckCircle2, AlertTriangle, ShieldAlert, Zap } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RegimeBadge } from "@/components/shell/status-badge";
import {
  produtosIDTF, cavalos, implementos, compartimentos, findImplemento, HOJE,
} from "@/lib/domain/model";
import { getT3, avaliarNovoCarregamento, type Tier } from "@/lib/domain/rules-engine";
import { motoristas, viagens } from "@/lib/mock-data";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDate, cn } from "@/lib/utils";

const tierStyle: Record<Tier, { bg: string; ring: string; text: string; icon: React.ReactNode; label: string }> = {
  LIBERADO: { bg: "bg-[hsl(142_65%_97%)]", ring: "border-[hsl(142_60%_75%)]", text: "text-[hsl(142_71%_24%)]", icon: <CheckCircle2 className="size-5" />, label: "Liberado" },
  ALERTA: { bg: "bg-[hsl(36_95%_97%)]", ring: "border-[hsl(28_92%_78%)]", text: "text-[hsl(24_88%_32%)]", icon: <AlertTriangle className="size-5" />, label: "Alerta" },
  BLOQUEIO: { bg: "bg-[hsl(0_72%_97%)]", ring: "border-[hsl(0_72%_80%)]", text: "text-[hsl(0_70%_38%)]", icon: <ShieldAlert className="size-5" />, label: "Bloqueio" },
};

export function NovaViagemModal() {
  const { addViagem, addExcecao } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [cliente, setCliente] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [km, setKm] = useState("");
  const [previsao, setPrevisao] = useState("");
  const [cavaloPlaca, setCavaloPlaca] = useState("");
  const [implementoId, setImplementoId] = useState("");
  const [compartimentoId, setCompartimentoId] = useState("");
  const [motorista, setMotorista] = useState("");
  const [justificativa, setJustificativa] = useState("");

  // Carga ATUAL a transportar: só produtos classificados e não-proibidos.
  // Em fila (trava até a qualidade classificar) e proibidos p/ feed ficam fora do seletor.
  const produtos = produtosIDTF.filter((p) => p.statusClassificacao === "classificado" && !p.bloqueiaFeed);
  const comps = compartimentos.filter((c) => c.implementoId === implementoId);
  const t3 = compartimentoId ? getT3(compartimentoId) : [];
  const decisao = compartimentoId ? avaliarNovoCarregamento(compartimentoId) : null;

  const step1Ok = cliente && produtoId && origem && destino;
  const step2Ok = cavaloPlaca && implementoId && compartimentoId && motorista;
  const precisaJustificar = decisao?.tier === "ALERTA";
  const podeCriar = step2Ok && decisao && (!precisaJustificar || justificativa.trim().length > 0);

  function reset() {
    setStep(1); setCliente(""); setProdutoId(""); setOrigem(""); setDestino(""); setKm(""); setPrevisao("");
    setCavaloPlaca(""); setImplementoId(""); setCompartimentoId(""); setMotorista(""); setJustificativa("");
  }

  function criar() {
    if (!decisao) return;
    const prod = produtosIDTF.find((p) => p.id === produtoId);
    const imp = findImplemento(implementoId);
    const status = decisao.tier === "BLOQUEIO" ? "Bloqueada" : "Agendada";
    const id = addViagem({
      cliente, produtoId, produtoNome: prod?.nomeCanonico ?? "—",
      origem, destino, cavaloPlaca, implementoPlaca: imp?.placa ?? "", compartimentoId,
      motorista, km: Number(km) || 0, previsao: previsao ? `${previsao}T18:00:00` : "", status,
      justificativa: decisao.tier === "ALERTA" ? justificativa.trim() : undefined,
    });
    if (decisao.tier === "BLOQUEIO") {
      // O motor não deixa nascer uma viagem liberada sobre compartimento sujo: nasce
      // Bloqueada E já abre uma exceção pendente roteada ao nível de autoridade correto.
      const v = viagens.find((x) => x.id === id);
      const proibida = /proibida/i.test(decisao.motivo);
      addExcecao({
        viagemId: id,
        codigoViagem: v?.codigo ?? id,
        motivoBloqueio: decisao.motivo,
        regra: proibida ? "Carga anterior proibida" : "Bloqueio do motor no despacho",
        nivelRequerido: proibida ? "diretoria_rt" : "gestor",
        solicitante: `${motorista} · motorista (registrou ocorrência)`,
        solicitadoEm: `${HOJE}T10:00:00`,
        evidencias: [],
        observacao: proibida
          ? "Contaminação não é liberável por tráfego nem 'perdoada' pelo cliente. Exige limpeza D, inspeção qualificada e aprovação formal."
          : undefined,
      });
      toast("Viagem criada como BLOQUEADA", { type: "error", desc: "Exceção aberta e roteada à autoridade. Trate em Exceções." });
    } else if (decisao.tier === "ALERTA") {
      toast("Viagem criada com alerta justificado", { type: "info", desc: `${id} · justificativa registrada.` });
    } else {
      toast("Viagem criada e liberada", { desc: `${id} · compartimento apto.` });
    }
    setOpen(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm"><Plus className="size-4" /> Nova viagem</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nova viagem</DialogTitle>
          <DialogDescription>
            Passo {step} de 3 · {step === 1 ? "Pedido de frete" : step === 2 ? "Veículo e compartimento" : "Validação do motor de regras"}
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn("h-1 flex-1 rounded-full", s <= step ? "bg-[hsl(176_84%_25%)]" : "bg-[hsl(200_18%_90%)]")} />
          ))}
        </div>

        {/* Passo 1 */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cliente" className="col-span-2"><Input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Ex.: Cargill BV" className="h-9" /></Field>
            <Field label="Produto (IDTF)" className="col-span-2">
              <Select value={produtoId} onValueChange={setProdutoId}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecionar produto…" /></SelectTrigger>
                <SelectContent>
                  {produtos.map((p) => <SelectItem key={p.id} value={p.id}>{p.nomeCanonico}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Origem"><Input value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="Fazenda/cidade" className="h-9" /></Field>
            <Field label="Destino"><Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Porto/terminal" className="h-9" /></Field>
            <Field label="Distância (km)"><Input value={km} onChange={(e) => setKm(e.target.value)} type="number" placeholder="0" className="h-9" /></Field>
            <Field label="Previsão de entrega"><Input value={previsao} onChange={(e) => setPrevisao(e.target.value)} type="date" className="h-9" /></Field>
          </div>
        )}

        {/* Passo 2 */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cavalo">
                <Select value={cavaloPlaca} onValueChange={setCavaloPlaca}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Cavalo…" /></SelectTrigger>
                  <SelectContent>{cavalos.map((c) => <SelectItem key={c.id} value={c.placa}>{c.placa} · {c.modelo}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Motorista">
                <Select value={motorista} onValueChange={setMotorista}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Motorista…" /></SelectTrigger>
                  <SelectContent>{motoristas.map((m) => <SelectItem key={m.id} value={m.nome}>{m.nome} · {m.tipo}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Implemento (carreta)">
                <Select value={implementoId} onValueChange={(v) => { setImplementoId(v); setCompartimentoId(""); }}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Implemento…" /></SelectTrigger>
                  <SelectContent>{implementos.map((i) => <SelectItem key={i.id} value={i.id}>{i.placa} · {i.tipo}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Compartimento">
                <Select value={compartimentoId} onValueChange={setCompartimentoId} disabled={!implementoId}>
                  <SelectTrigger className="h-9"><SelectValue placeholder={implementoId ? "Compartimento…" : "Escolha o implemento"} /></SelectTrigger>
                  <SelectContent>{comps.map((c) => <SelectItem key={c.id} value={c.id}>{c.identificador}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>

            {compartimentoId && (
              <div className="rounded-lg border border-[hsl(200_18%_90%)] bg-[hsl(200_18%_98%)] p-3">
                <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[hsl(210_14%_42%)] mb-2">Prévia do T-3 deste compartimento</p>
                <div className="space-y-1">
                  {t3.map((e) => (
                    <div key={e.load.id} className="flex items-center gap-2 text-[11px]">
                      <span className="font-mono text-[hsl(210_12%_58%)]">T-{e.ordem}</span>
                      <span className="flex-1">{e.produto?.nomeCanonico}</span>
                      {e.produto?.bloqueiaFeed && <Badge variant="destructive" className="text-[8px]">proibida</Badge>}
                      {e.determinante && <Zap className="size-3 text-[hsl(176_84%_25%)]" />}
                      <span className="text-[hsl(210_12%_58%)] num">{formatDate(e.load.data)}</span>
                    </div>
                  ))}
                  {!t3.length && <p className="text-[11px] text-[hsl(210_14%_42%)]">Sem histórico — compartimento novo.</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Passo 3 */}
        {step === 3 && decisao && (
          <div className="space-y-3">
            <div className={cn("rounded-xl border p-4 flex items-start gap-3", tierStyle[decisao.tier].bg, tierStyle[decisao.tier].ring)}>
              <span className={tierStyle[decisao.tier].text}>{tierStyle[decisao.tier].icon}</span>
              <div className="flex-1">
                <p className={cn("text-[15px] font-bold", tierStyle[decisao.tier].text)}>{tierStyle[decisao.tier].label}</p>
                <p className="text-[12px] text-[hsl(210_14%_42%)] mt-1 leading-relaxed">{decisao.motivo}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <Info label="Produto" value={produtosIDTF.find((p) => p.id === produtoId)?.nomeCanonico ?? "—"} />
              <Info label="Compartimento" value={compartimentos.find((c) => c.id === compartimentoId)?.identificador ?? "—"} />
              <Info label="Regime exigido" value={decisao.regimeExigido ?? "—"} />
              <Info label="Motorista" value={motorista} />
            </div>

            {precisaJustificar && (
              <Field label="Justificativa obrigatória (alerta)">
                <Input value={justificativa} onChange={(e) => setJustificativa(e.target.value)} placeholder="Motivo para liberar com pendência…" className="h-9" />
              </Field>
            )}

            {decisao.tier === "BLOQUEIO" && (
              <p className="text-[11px] text-[hsl(0_70%_38%)] bg-[hsl(0_72%_98%)] border border-[hsl(0_72%_90%)] rounded-lg p-2.5">
                A viagem será criada como <strong>Bloqueada</strong>. Trate em{" "}
                <DialogClose asChild><Link href="/excecoes" className="underline font-semibold">Exceções</Link></DialogClose>.
              </p>
            )}
          </div>
        )}

        <DialogFooter className="justify-between sm:justify-between">
          {step > 1 ? (
            <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}><ArrowLeft className="size-4" /> Voltar</Button>
          ) : <span />}
          {step < 3 ? (
            <Button variant="gradient" size="sm" disabled={step === 1 ? !step1Ok : !step2Ok} onClick={() => setStep(step + 1)}>
              Avançar <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              variant={decisao?.tier === "BLOQUEIO" ? "destructive" : "gradient"}
              size="sm"
              disabled={!podeCriar}
              onClick={criar}
            >
              <Truck className="size-4" />
              {decisao?.tier === "BLOQUEIO" ? "Criar como bloqueada" : "Criar viagem"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-[11px]">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[hsl(200_18%_96%)] p-2">
      <p className="text-[9px] uppercase tracking-[0.1em] text-[hsl(210_12%_58%)] font-semibold">{label}</p>
      <p className="text-[12px] font-medium text-[hsl(195_30%_8%)]">{value}</p>
    </div>
  );
}
