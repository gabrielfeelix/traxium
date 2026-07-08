"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Plus,
  Search,
  FileEdit,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Camera,
  MapPin,
  PenLine,
  Clock,
  Hash,
  ImageOff,
  Check,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegimeBadge } from "@/components/shell/status-badge";
import { checklistsTemplates, viagens, type Checklist } from "@/lib/mock-data";
import { NovoModeloModal } from "@/components/modals/novo-modelo-modal";
import {
  compartimentos,
  findImplemento,
  findCompartimento,
  inspectionEvents,
  compartimentoPorViagem,
} from "@/lib/domain/model";
import { statusCompartimento } from "@/lib/domain/rules-engine";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatDateTime, cn } from "@/lib/utils";

// Condições visuais essenciais (mínimo obrigatório para liberar — pergunta 10/11)
const CONDICOES = [
  { id: "seco", label: "Compartimento seco" },
  { id: "odor", label: "Sem odor estranho" },
  { id: "residuo", label: "Sem resíduo visível (>1cm)" },
  { id: "pragas", label: "Sem pragas ou vestígios" },
  { id: "integro", label: "Estrutura íntegra (sem ferrugem/avaria)" },
  { id: "coberto", label: "Coberto / fechável" },
];

// Ângulos mínimos de foto obrigatórios (pergunta 11)
const ANGULOS = [
  { id: "geral", label: "Visão geral interna" },
  { id: "cantos", label: "Cantos e frestas" },
  { id: "teto", label: "Teto / lona / tampa" },
  { id: "piso", label: "Piso / fundo" },
  { id: "descarga", label: "Descarga / bica / porta" },
  { id: "placa", label: "Identificação externa (placa)" },
];

type Estado = "ok" | "nc" | undefined;

export default function ChecklistsPage() {
  const { addInspectionEvent, version } = useSession();
  const { toast } = useToast();
  const [modelos, setModelos] = useState<Checklist[]>(checklistsTemplates);
  const [modeloOpen, setModeloOpen] = useState(false);
  const [comp, setComp] = useState(compartimentos[0]?.id ?? "");
  const [viagemLink, setViagemLink] = useState<string>("");
  const [cond, setCond] = useState<Record<string, Estado>>({});
  const [fotos, setFotos] = useState<Record<string, number>>({});
  const [assinatura, setAssinatura] = useState(false);
  const [modeloBusca, setModeloBusca] = useState("");

  const modelosFiltrados = modelos.filter((m) => {
    const q = modeloBusca.trim().toLowerCase();
    return (
      !q ||
      m.titulo.toLowerCase().includes(q) ||
      m.tipo.toLowerCase().includes(q) ||
      (m.fonteNormativa?.toLowerCase().includes(q) ?? false)
    );
  });

  const st = statusCompartimento(comp);
  const imp = findImplemento(findCompartimento(comp)?.implementoId ?? "");
  // Viagens que usam este compartimento — para vincular a inspeção (opcional).
  const viagensDoComp = viagens.filter((v) => compartimentoPorViagem[v.id] === comp);

  const anyNC = CONDICOES.some((c) => cond[c.id] === "nc");
  const allOk = CONDICOES.every((c) => cond[c.id] === "ok");
  const fotosOk = ANGULOS.every((a) => (fotos[a.id] ?? 0) >= 1);
  const fotosCount = ANGULOS.filter((a) => (fotos[a.id] ?? 0) >= 1).length;
  const resultado: "aprovado" | "reprovado" | "pendente" = anyNC
    ? "reprovado"
    : allOk && fotosOk && assinatura
    ? "aprovado"
    : "pendente";

  function registrar() {
    if (resultado === "pendente") return;
    const vinc = viagemLink || undefined;
    addInspectionEvent({
      compartimentoId: comp,
      viagemId: vinc,
      resultado,
      itensOk: CONDICOES.filter((c) => cond[c.id] === "ok").length,
      itensTotal: CONDICOES.length,
      inspetor: "Inspetor de pátio",
      dataHora: "2026-07-08T10:00:00",
      offline: false,
    });
    const codViagem = vinc ? viagens.find((v) => v.id === vinc)?.codigo : undefined;
    toast(
      resultado === "aprovado" ? "Inspeção aprovada registrada" : "Reprovação registrada",
      {
        type: resultado === "reprovado" ? "error" : "success",
        desc: vinc
          ? `${imp?.placa ?? ""} · vinculada à viagem ${codViagem ?? ""}${resultado === "aprovado" ? " (LCI liberado)" : ""}.`
          : `${imp?.placa ?? ""} · inspeção de pátio (sem viagem vinculada).`,
      }
    );
    setCond({}); setFotos({}); setAssinatura(false); setViagemLink("");
  }

  return (
    <div className="space-y-6" data-v={version}>
      <PageHeader
        title="Inspeção LCI"
        description="Loading Compartment Inspection pré-carregamento. Separa o mínimo obrigatório para liberar (condições visuais, fotos por ângulo, assinatura) da evidência complementar. Cada inspeção gera um registro imutável vinculado ao compartimento — e à viagem quando feita em contexto de despacho."
      />

      <Tabs defaultValue="nova">
        <TabsList>
          <TabsTrigger value="nova">Nova inspeção</TabsTrigger>
          <TabsTrigger value="recentes">Inspeções recentes</TabsTrigger>
          <TabsTrigger value="modelos">Modelos</TabsTrigger>
        </TabsList>

        {/* ── Captura ──────────────────────────────────────────────────── */}
        <TabsContent value="nova" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 space-y-4">
              {/* Contexto do compartimento */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Compartimento inspecionado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px]">Selecionar compartimento</Label>
                      <Select value={comp} onValueChange={(v) => { setComp(v); setViagemLink(""); }}>
                        <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {compartimentos.map((c) => {
                            const i = findImplemento(c.implementoId);
                            return <SelectItem key={c.id} value={c.id}>{i?.placa} · {c.identificador}</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[11px]">Vincular à viagem (opcional)</Label>
                      <Select value={viagemLink || "none"} onValueChange={(v) => setViagemLink(v === "none" ? "" : v)}>
                        <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Inspeção de pátio (sem viagem)</SelectItem>
                          {viagensDoComp.map((v) => <SelectItem key={v.id} value={v.id}>{v.codigo} · {v.status}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[hsl(174_64%_97%)] border border-[hsl(176_60%_82%)] p-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Ctx label="Implemento" value={imp?.placa ?? "—"} mono />
                    <Ctx label="Última carga" value={st.ultimaCarga?.nomeCanonico ?? "—"} />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(180_60%_28%)] font-semibold">Regime exigido</p>
                      {st.regimeExigido ? <RegimeBadge regime={st.regimeExigido} size="sm" /> : "—"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mínimo obrigatório */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Mínimo obrigatório para liberar</CardTitle>
                  <CardDescription>Condições visuais essenciais. Uma reprovação bloqueia a liberação.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {CONDICOES.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border-soft">
                      <p className="flex-1 text-[13px] font-medium">{c.label}</p>
                      <TriState value={cond[c.id]} onChange={(v) => setCond((s) => ({ ...s, [c.id]: v }))} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Fotos por ângulo */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Fotos obrigatórias por ângulo</CardTitle>
                  <CardDescription>Captura só pela câmera do app · geo, timestamp e hash embarcados.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ANGULOS.map((a) => {
                      const n = fotos[a.id] ?? 0;
                      return (
                        <button
                          key={a.id}
                          onClick={() => setFotos((s) => ({ ...s, [a.id]: (s[a.id] ?? 0) + 1 }))}
                          className={cn(
                            "rounded-lg border p-2.5 text-left transition-all",
                            n >= 1 ? "border-[hsl(142_60%_75%)] bg-[hsl(142_65%_98%)]" : "border-dashed border-border hover:border-[hsl(176_60%_60%)]"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            {n >= 1 ? <CheckCircle2 className="size-4 text-[hsl(142_71%_36%)]" /> : <Camera className="size-4 text-fg-muted" />}
                            <span className="text-[10px] num text-fg-muted">{n}</span>
                          </div>
                          <p className="text-[11px] font-medium mt-1 leading-tight">{a.label}</p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Chip icon={<MapPin className="size-3" />} t="Geo" />
                    <Chip icon={<Clock className="size-3" />} t="Timestamp" />
                    <Chip icon={<Hash className="size-3" />} t="SHA-256" />
                    <Chip icon={<ImageOff className="size-3" />} t="Galeria bloqueada" />
                  </div>
                </CardContent>
              </Card>

              {/* Complementar */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Evidência complementar</CardTitle>
                  <CardDescription>Opcional — detalhe longo fica para qualidade, não trava a liberação.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder="Observações do inspetor…" className="h-9" />
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-border-soft">
                    <Label htmlFor="assin" className="text-[13px] cursor-pointer flex items-center gap-2">
                      <PenLine className="size-4 text-[hsl(176_84%_25%)]" /> Assinatura digital do inspetor
                    </Label>
                    <Switch id="assin" checked={assinatura} onCheckedChange={setAssinatura} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resultado ao vivo */}
            <div className="lg:col-span-4">
              <Card className="sticky top-4">
                <CardHeader className="pb-2">
                  <CardTitle>Resultado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ResultadoBadge resultado={resultado} />

                  <div className="space-y-1.5 text-[12px]">
                    <Linha ok={allOk && !anyNC} label="Condições visuais" detalhe={anyNC ? "reprovação registrada" : `${CONDICOES.filter((c) => cond[c.id] === "ok").length}/${CONDICOES.length} conformes`} />
                    <Linha ok={fotosOk} label="Fotos por ângulo" detalhe={`${fotosCount}/${ANGULOS.length}`} />
                    <Linha ok={assinatura} label="Assinatura" detalhe={assinatura ? "coletada" : "pendente"} />
                  </div>

                  <Button
                    variant={resultado === "aprovado" ? "gradient" : resultado === "reprovado" ? "destructive" : "outline"}
                    disabled={resultado === "pendente"}
                    className="w-full"
                    onClick={registrar}
                  >
                    {resultado === "aprovado" && <><CheckCircle2 className="size-4" /> Registrar inspeção aprovada</>}
                    {resultado === "reprovado" && <><XCircle className="size-4" /> Registrar reprovação</>}
                    {resultado === "pendente" && "Complete o mínimo obrigatório"}
                  </Button>

                  <p className="text-[10px] text-fg-muted leading-relaxed">
                    O registro vincula-se ao compartimento (e à viagem, se selecionada), com geo, timestamp e hash. Fica imutável após envio; correção só por retificação.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── Recentes ─────────────────────────────────────────────────── */}
        <TabsContent value="recentes" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Inspeções recentes</CardTitle>
              <CardDescription>Registros de InspectionEvent vinculados a compartimento e viagem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {inspectionEvents
                .slice()
                .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
                .map((i) => {
                  const c = findCompartimento(i.compartimentoId);
                  const im = c ? findImplemento(c.implementoId) : undefined;
                  return (
                    <div
                      key={i.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border",
                        i.resultado === "aprovado" && "border-[hsl(142_60%_78%)] bg-[hsl(142_65%_98%)]",
                        i.resultado === "reprovado" && "border-[hsl(0_72%_82%)] bg-[hsl(0_72%_98%)]",
                        i.resultado === "pendente" && "border-[hsl(48_95%_78%)] bg-[hsl(48_95%_98%)]"
                      )}
                    >
                      <div
                        className={cn(
                          "size-8 rounded-md flex items-center justify-center text-white shrink-0",
                          i.resultado === "aprovado" ? "bg-[hsl(142_71%_36%)]" : i.resultado === "reprovado" ? "bg-[hsl(0_78%_50%)]" : "bg-[hsl(48_95%_50%)]"
                        )}
                      >
                        {i.resultado === "aprovado" ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium">
                          <span className="font-mono">{im?.placa}</span> · {c?.identificador}
                        </p>
                        <p className="text-[11px] text-fg-muted">
                          {i.inspetor} · <span className="num">{i.itensOk}/{i.itensTotal}</span> itens · {formatDateTime(i.dataHora)}
                          {i.offline && <span className="text-[hsl(38_90%_28%)]"> · offline</span>}
                        </p>
                      </div>
                      <Badge variant={i.resultado === "aprovado" ? "success" : i.resultado === "reprovado" ? "destructive" : "warning"} className="text-[10px] capitalize shrink-0">
                        {i.resultado}
                      </Badge>
                      {i.viagemId && (
                        <Link href={`/viagens/${i.viagemId}`} className="text-[11px] text-[hsl(176_84%_25%)] hover:underline shrink-0">
                          viagem
                        </Link>
                      )}
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Modelos ──────────────────────────────────────────────────── */}
        <TabsContent value="modelos" className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
              <Input
                placeholder="Buscar modelo…"
                value={modeloBusca}
                onChange={(e) => setModeloBusca(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button variant="gradient" size="sm" onClick={() => setModeloOpen(true)}><Plus className="size-4" /> Novo modelo</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelosFiltrados.map((ck) => (
              <Card key={ck.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-lg bg-[hsl(174_64%_96%)] p-2">
                      <ClipboardCheck className="size-5 text-[hsl(174_72%_35%)]" />
                    </div>
                    {ck.regime && <RegimeBadge regime={ck.regime} size="sm" />}
                  </div>
                  <CardTitle className="mt-2">{ck.titulo}</CardTitle>
                  <CardDescription>{ck.tipo}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-fg-muted mb-3">
                    <span>{ck.itens} itens · {ck.obrigatorio ? "Obrigatório" : "Opcional"}</span>
                    <span>{ck.fonteNormativa}</span>
                  </div>
                  <p className="text-[10px] text-fg-soft mb-3">Última revisão: {formatDate(ck.ultimaRevisao)}</p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="flex-1 h-8" onClick={() => toast("Edição de modelo", { type: "info", desc: "Editor de modelos — em breve." })}><FileEdit className="size-3.5" /> Editar</Button>
                    <Button
                      variant="outline" size="sm" className="h-8"
                      onClick={() => {
                        setModelos((cur) => {
                          const idx = cur.findIndex((x) => x.id === ck.id);
                          const clone = { ...ck, id: `${ck.id}-copy-${cur.length}`, titulo: `${ck.titulo} (cópia)` };
                          const next = [...cur];
                          next.splice(idx + 1, 0, clone);
                          return next;
                        });
                        toast("Modelo duplicado", { desc: ck.titulo });
                      }}
                    ><Copy className="size-3.5" /></Button>
                    <Button
                      variant="outline" size="sm" className="h-8"
                      onClick={() => {
                        setModelos((cur) => cur.filter((x) => x.id !== ck.id));
                        toast("Modelo removido", { type: "error", desc: ck.titulo });
                      }}
                    ><Trash2 className="size-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {modelosFiltrados.length === 0 && (
              <div className="col-span-full flex flex-col items-center gap-2 py-12 text-center">
                <ClipboardCheck className="size-8 text-fg-soft" />
                <p className="text-[13px] text-fg-muted">Nenhum modelo encontrado.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <NovoModeloModal
        open={modeloOpen}
        onOpenChange={setModeloOpen}
        onAdd={(m) =>
          setModelos((cur) => [
            { id: `ck-new-${cur.length}`, titulo: m.titulo, tipo: m.tipo, regime: m.regime, itens: m.itens, obrigatorio: true, ultimaRevisao: "2026-07-08", fonteNormativa: "GMP+ B4" },
            ...cur,
          ])
        }
      />
    </div>
  );
}

function TriState({ value, onChange }: { value: Estado; onChange: (v: Estado) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(value === "ok" ? undefined : "ok")}
        className={cn(
          "size-8 rounded-md flex items-center justify-center border transition-all",
          value === "ok" ? "bg-[hsl(142_71%_36%)] text-white border-[hsl(142_71%_36%)]" : "border-border text-[hsl(142_71%_36%)] hover:bg-[hsl(142_65%_96%)]"
        )}
        aria-label="Conforme"
      >
        <Check className="size-4" />
      </button>
      <button
        onClick={() => onChange(value === "nc" ? undefined : "nc")}
        className={cn(
          "size-8 rounded-md flex items-center justify-center border transition-all",
          value === "nc" ? "bg-[hsl(0_78%_50%)] text-white border-[hsl(0_78%_50%)]" : "border-border text-[hsl(0_78%_50%)] hover:bg-[hsl(0_72%_97%)]"
        )}
        aria-label="Não conforme"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function ResultadoBadge({ resultado }: { resultado: "aprovado" | "reprovado" | "pendente" }) {
  const cfg = {
    aprovado: { bg: "bg-[hsl(142_65%_96%)]", ring: "border-[hsl(142_60%_75%)]", text: "text-[hsl(142_71%_24%)]", label: "Pronto para aprovar", icon: <CheckCircle2 className="size-6" /> },
    reprovado: { bg: "bg-[hsl(0_72%_97%)]", ring: "border-[hsl(0_72%_82%)]", text: "text-[hsl(0_70%_38%)]", label: "Reprovado", icon: <XCircle className="size-6" /> },
    pendente: { bg: "bg-bg", ring: "border-border", text: "text-fg-muted", label: "Pendente", icon: <Clock className="size-6" /> },
  }[resultado];
  return (
    <div className={cn("rounded-xl border p-4 flex items-center gap-3", cfg.bg, cfg.ring)}>
      <span className={cfg.text}>{cfg.icon}</span>
      <div>
        <p className={cn("text-[15px] font-bold", cfg.text)}>{cfg.label}</p>
        <p className="text-[11px] text-fg-muted">resultado calculado ao vivo</p>
      </div>
    </div>
  );
}

function Linha({ ok, label, detalhe }: { ok: boolean; label: string; detalhe: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? <CheckCircle2 className="size-3.5 text-[hsl(142_71%_36%)] shrink-0" /> : <Clock className="size-3.5 text-fg-muted shrink-0" />}
      <span className="text-fg-muted">{label}:</span>
      <span className="font-medium text-fg ml-auto">{detalhe}</span>
    </div>
  );
}

function Ctx({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(180_60%_28%)] font-semibold">{label}</p>
      <p className={cn("text-[13px] font-medium text-[hsl(180_80%_18%)]", mono && "font-mono")}>{value}</p>
    </div>
  );
}

function Chip({ icon, t }: { icon: React.ReactNode; t: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-[hsl(180_80%_18%)] bg-[hsl(174_64%_94%)] rounded px-1.5 py-0.5 font-medium">
      {icon} {t}
    </span>
  );
}
