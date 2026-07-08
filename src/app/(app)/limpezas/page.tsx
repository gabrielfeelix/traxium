"use client";

import { useMemo, useState } from "react";
import {
  Droplets,
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  Lock,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegimeBadge } from "@/components/shell/status-badge";
import {
  cleaningEvents,
  compartimentos,
  findImplemento,
  type Regime,
} from "@/lib/domain/model";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDate, cn } from "@/lib/utils";

type Campo = {
  id: string;
  label: string;
  tipo: "select" | "text" | "toggle" | "photos";
  opcoes?: string[];
  hint?: string;
};

// Campos cumulativos: D ⊃ C ⊃ B ⊃ A. A evidência sobe com a severidade do regime.
const camposA: Campo[] = [
  { id: "metodo", label: "Método de limpeza seca", tipo: "select", opcoes: ["Varrição", "Sucção", "Sopro"] },
  { id: "fotos", label: "Fotos antes/depois", tipo: "photos", hint: "mín. 2 — pontos difíceis e visão geral" },
  { id: "ausenciaResiduos", label: "Ausência de resíduos confirmada", tipo: "toggle" },
  { id: "assinatura", label: "Assinatura do executor", tipo: "toggle" },
];
const camposB: Campo[] = [
  ...camposA,
  { id: "local", label: "Local da lavagem", tipo: "text" },
  { id: "responsavel", label: "Responsável", tipo: "text" },
  { id: "drenagem", label: "Drenagem / secagem executada", tipo: "toggle" },
  { id: "ausenciaUmidade", label: "Ausência de umidade excessiva", tipo: "toggle" },
];
const camposC: Campo[] = [
  ...camposB,
  { id: "produtoQuimico", label: "Produto químico food grade", tipo: "text" },
  { id: "concentracao", label: "Concentração / dosagem", tipo: "text" },
  { id: "tempoAcao", label: "Tempo de ação", tipo: "text" },
  { id: "enxague", label: "Enxágue completo", tipo: "toggle" },
  { id: "comprovante", label: "Comprovante da estação", tipo: "toggle" },
  { id: "fispq", label: "FISPQ do produto disponível", tipo: "toggle" },
];
const camposD: Campo[] = [
  ...camposC,
  { id: "desinfetante", label: "Desinfetante food grade permitido", tipo: "text" },
  { id: "dosagemDesinf", label: "Dosagem do desinfetante", tipo: "text" },
  { id: "tempoContato", label: "Tempo mínimo de contato", tipo: "text" },
  { id: "eficacia", label: "Evidência de eficácia", tipo: "toggle" },
  { id: "aprovacao", label: "Aprovação de responsável treinado", tipo: "toggle" },
];

const REGIMES: Record<Regime, { nome: string; desc: string; campos: Campo[] }> = {
  A: { nome: "Regime A · Limpeza seca", desc: "Varrição/sucção/sopro. Evidência mínima.", campos: camposA },
  B: { nome: "Regime B · Limpeza com água", desc: "Lavagem + drenagem e secagem.", campos: camposB },
  C: { nome: "Regime C · Água + detergente food grade", desc: "Produto químico, dosagem, tempo, enxágue.", campos: camposC },
  D: { nome: "Regime D · Limpeza + desinfecção", desc: "Tudo do C + desinfecção validada e aprovação.", campos: camposD },
};

type Valor = string | boolean | number;

export default function LimpezasPage() {
  const { addCleaningEvent, version } = useSession();
  const { toast } = useToast();
  const [regime, setRegime] = useState<Regime>("C");
  const [comp, setComp] = useState<string>(compartimentos[0]?.id ?? "");
  const [valores, setValores] = useState<Record<string, Valor>>({});

  const campos = REGIMES[regime].campos;

  const preenchido = (c: Campo): boolean => {
    const v = valores[c.id];
    if (c.tipo === "toggle") return v === true;
    if (c.tipo === "photos") return typeof v === "number" && v >= 2;
    return typeof v === "string" && v.trim().length > 0;
  };
  const totalObrig = campos.length;
  const okCount = campos.filter(preenchido).length;
  const completo = okCount === totalObrig;
  const pct = Math.round((okCount / totalObrig) * 100);

  const setVal = (id: string, v: Valor) => setValores((s) => ({ ...s, [id]: v }));

  const eventosRecentes = useMemo(
    () => [...cleaningEvents].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
    [version]
  );

  function registrar() {
    const s = (id: string) => (typeof valores[id] === "string" ? (valores[id] as string) : undefined);
    addCleaningEvent({
      compartimentoId: comp,
      regime,
      data: "2026-07-08",
      metodo: s("metodo") ?? "Limpeza",
      local: s("local") ?? "—",
      executor: s("responsavel") ?? "Inspetor de pátio",
      produtoQuimico: s("produtoQuimico"),
      concentracao: s("concentracao"),
      tempoAcao: s("tempoAcao"),
      comprovanteEstacao: valores["comprovante"] === true,
      fotos: typeof valores["fotos"] === "number" ? (valores["fotos"] as number) : 0,
      assinatura: valores["assinatura"] === true,
    });
    const imp = findImplemento(compartimentos.find((c) => c.id === comp)?.implementoId ?? "");
    toast(`Limpeza Regime ${regime} registrada`, { desc: `${imp?.placa ?? ""} · status do compartimento atualizado.` });
    setValores({});
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Limpezas"
        description="Registro de higienização por compartimento. O formulário é dinâmico: o regime selecionado muda os campos obrigatórios. Regime A não pede 20 campos; Regime D não é liberado com apenas 'limpo'."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Formulário dinâmico */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Registrar limpeza</CardTitle>
              <CardDescription>Selecione o regime — os campos obrigatórios se ajustam automaticamente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Compartimento + regime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="comp" className="text-[11px]">Compartimento</Label>
                  <Select value={comp} onValueChange={setComp}>
                    <SelectTrigger id="comp" className="h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {compartimentos.map((c) => {
                        const imp = findImplemento(c.implementoId);
                        return (
                          <SelectItem key={c.id} value={c.id}>
                            {imp?.placa} · {c.identificador}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px]">Regime de limpeza</Label>
                  <div className="flex gap-1 mt-1">
                    {(["A", "B", "C", "D"] as Regime[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRegime(r)}
                        className={cn(
                          "flex-1 h-9 rounded-md text-[13px] font-bold border transition-all",
                          regime === r
                            ? "bg-[hsl(176_84%_25%)] text-white border-[hsl(176_84%_25%)] shadow-brand-sm"
                            : "bg-white text-[hsl(210_14%_42%)] border-[hsl(200_18%_88%)] hover:border-[hsl(176_60%_60%)]"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regime info + progresso */}
              <div className="rounded-lg bg-[hsl(174_64%_97%)] border border-[hsl(176_60%_82%)] p-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-[13px] font-semibold text-[hsl(180_80%_18%)]">{REGIMES[regime].nome}</p>
                    <p className="text-[11px] text-[hsl(180_60%_28%)]">{REGIMES[regime].desc}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] num">{totalObrig} campos obrigatórios</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex-1 h-1.5 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: completo ? "hsl(142 71% 40%)" : "hsl(176 84% 30%)" }}
                    />
                  </div>
                  <span className="text-[11px] font-bold num">{okCount}/{totalObrig}</span>
                </div>
              </div>

              {/* Campos dinâmicos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {campos.map((c) => (
                  <CampoInput key={c.id} campo={c} valor={valores[c.id]} onChange={(v) => setVal(c.id, v)} ok={preenchido(c)} />
                ))}
              </div>

              {/* Antifraude automático */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { i: <MapPin className="size-3" />, t: "Geo capturada" },
                  { i: <Clock className="size-3" />, t: "Timestamp do aparelho" },
                  { i: <Lock className="size-3" />, t: "Hash + imutável após envio" },
                ].map((x) => (
                  <span key={x.t} className="inline-flex items-center gap-1 text-[10px] text-[hsl(180_80%_18%)] bg-[hsl(174_64%_94%)] rounded px-1.5 py-0.5 font-medium">
                    {x.i} {x.t}
                  </span>
                ))}
              </div>

              <Button variant={completo ? "gradient" : "outline"} disabled={!completo} className="w-full" onClick={registrar}>
                {completo ? (
                  <><ShieldCheck className="size-4" /> Registrar limpeza {regime}</>
                ) : (
                  `Faltam ${totalObrig - okCount} campo(s) obrigatório(s)`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Histórico + progressão de evidência */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Evidência exigida por regime</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {(["A", "B", "C", "D"] as Regime[]).map((r) => (
                <div key={r} className="flex items-center gap-2 text-[12px]">
                  <RegimeBadge regime={r} size="sm" />
                  <span className="text-[hsl(210_14%_42%)] flex-1">{REGIMES[r].desc}</span>
                  <span className="num font-semibold text-[hsl(195_30%_8%)]">{REGIMES[r].campos.length}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Limpezas recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {eventosRecentes.map((e) => {
                const c = compartimentos.find((x) => x.id === e.compartimentoId);
                const imp = c ? findImplemento(c.implementoId) : undefined;
                return (
                  <div key={e.id} className="rounded-lg border border-[hsl(200_18%_92%)] p-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <RegimeBadge regime={e.regime} size="sm" />
                      <span className="text-[12px] font-medium truncate">{e.metodo}</span>
                      <span className="ml-auto text-[10px] font-mono text-[hsl(210_12%_58%)] num">{formatDate(e.data)}</span>
                    </div>
                    <p className="text-[10px] text-[hsl(210_14%_42%)]">
                      <span className="font-mono">{imp?.placa}</span> · {c?.identificador} · {e.executor}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-[hsl(210_12%_58%)]">
                      <span className="inline-flex items-center gap-0.5"><Camera className="size-2.5" /> {e.fotos}</span>
                      {e.produtoQuimico && <span className="inline-flex items-center gap-0.5"><FlaskConical className="size-2.5" /> {e.produtoQuimico}</span>}
                      {e.comprovanteEstacao && <span className="inline-flex items-center gap-0.5"><CheckCircle2 className="size-2.5 text-[hsl(142_71%_40%)]" /> estação</span>}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CampoInput({
  campo,
  valor,
  onChange,
  ok,
}: {
  campo: Campo;
  valor: Valor | undefined;
  onChange: (v: Valor) => void;
  ok: boolean;
}) {
  return (
    <div className={cn(campo.tipo === "toggle" && "sm:col-span-2")}>
      {campo.tipo === "toggle" ? (
        <div className={cn(
          "flex items-center justify-between rounded-md border px-3 h-9",
          ok ? "border-[hsl(142_60%_75%)] bg-[hsl(142_65%_98%)]" : "border-[hsl(200_18%_88%)]"
        )}>
          <Label className="text-[12px] cursor-pointer">{campo.label}</Label>
          <Switch checked={valor === true} onCheckedChange={(v) => onChange(v)} />
        </div>
      ) : campo.tipo === "select" ? (
        <>
          <Label className="text-[11px] flex items-center gap-1">
            {campo.label} {ok && <CheckCircle2 className="size-3 text-[hsl(142_71%_40%)]" />}
          </Label>
          <Select value={(valor as string) ?? ""} onValueChange={onChange}>
            <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Selecionar…" /></SelectTrigger>
            <SelectContent>
              {campo.opcoes?.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </>
      ) : campo.tipo === "photos" ? (
        <>
          <Label className="text-[11px] flex items-center gap-1">
            {campo.label} {ok && <CheckCircle2 className="size-3 text-[hsl(142_71%_40%)]" />}
          </Label>
          <div className="flex items-center gap-2 mt-1">
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => onChange(((valor as number) ?? 0) + 1)}>
              <Camera className="size-4" /> Capturar
            </Button>
            <span className="text-[12px] num text-[hsl(210_14%_42%)]">{(valor as number) ?? 0} foto(s)</span>
          </div>
          {campo.hint && <p className="text-[10px] text-[hsl(210_12%_58%)] mt-0.5">{campo.hint}</p>}
        </>
      ) : (
        <>
          <Label className="text-[11px] flex items-center gap-1">
            {campo.label} {ok && <CheckCircle2 className="size-3 text-[hsl(142_71%_40%)]" />}
          </Label>
          <Input
            className="h-9 mt-1"
            value={(valor as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…"
          />
        </>
      )}
    </div>
  );
}
