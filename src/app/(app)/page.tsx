"use client";

import {
  Truck,
  ShieldCheck,
  AlertOctagon,
  Trees,
  ArrowRight,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  ChevronRight,
  Activity,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Plus,
  Globe2,
  PackageCheck,
  TrendingUp,
  Zap,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shell/page-header";
import { KPICard } from "@/components/shell/kpi-card";
import { StatusBadge, RegimeBadge, RiscoBadge } from "@/components/shell/status-badge";
import {
  dashboardKPIs,
  viagens,
  atividades,
  conformidadeChart,
  viagensPorStatusChart,
  regimesDistribuicao,
  fazendas,
  naoConformidades,
  auditorias,
  filialDaViagem,
  pertenceAFilial,
} from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { formatDateTime, cn } from "@/lib/utils";
import { HOJE, diasEntre } from "@/lib/domain/model";
import { useEffect, useState } from "react";

const confClass = (n: number) =>
  n >= 90 ? "text-success-700" : n >= 70 ? "text-warning-700" : "text-danger-700";

/** Só o último ponto da série ganha marcador — o "onde estamos agora". */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dotUltimo = (cor: string, lastIdx: number) => (props: any) => {
  const { cx, cy, index } = props;
  if (index !== lastIdx) return <g key={index} />;
  return (
    <g key={index}>
      <circle cx={cx} cy={cy} r={7} fill={cor} opacity={0.15} />
      <circle cx={cx} cy={cy} r={4} fill={cor} stroke="var(--color-bg-elev)" strokeWidth={2} />
    </g>
  );
};
import { NovaViagemModal } from "@/components/modals/nova-viagem-modal";
import { ProgramarAuditoriaModal } from "@/components/modals/programar-auditoria-modal";
import { useSession } from "@/lib/store/session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PERIODOS = ["Últimos 7 dias", "Últimos 30 dias", "Últimos 90 dias", "Tudo"];

export default function DashboardPage() {
  const { version, filialId } = useSession();
  const [periodo, setPeriodo] = useState("Últimos 30 dias");
  // Dispara as animações de entrada (barras de regime) após a hidratação.
  const [pronto, setPronto] = useState(false);
  useEffect(() => setPronto(true), []);
  const ultimoConf = conformidadeChart[conformidadeChart.length - 1];
  const lastIdx = conformidadeChart.length - 1;
  const proximaAuditoria = auditorias.find((a) => a.status === "Programada");
  // Re-escopo por filial (§5) — KPIs de viagem e a lista recente seguem a filial ativa.
  const viagensEscopadas = viagens.filter((v) => pertenceAFilial(filialId, filialDaViagem(v)));
  const viagensRecentes = viagensEscopadas.slice(0, 5);
  const fazendasRisco = fazendas.filter((f) => f.scoreRiscoEUDR !== "Baixo");
  const ncCriticas = naoConformidades.filter(
    (nc) => nc.status === "Aberta" || nc.status === "Em tratamento"
  );

  // KPIs derivados do estado real (movem quando algo é criado). Deltas/sparklines
  // seguem como tendência ilustrativa; os valores-âncora são honestos.
  const viagensAtivas = viagensEscopadas.filter((v) => v.status !== "Concluída").length;
  const bloqueadas = viagensEscopadas.filter((v) => v.status === "Bloqueada").length;
  const confMedia = viagensEscopadas.length
    ? Math.round((viagensEscopadas.reduce((a, v) => a + v.conformidade, 0) / viagensEscopadas.length) * 10) / 10
    : 0;
  const diasAudit = proximaAuditoria ? diasEntre(HOJE, proximaAuditoria.data) : 0;

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Dashboard operacional"
        description="Visão consolidada das viagens em andamento, compliance GMP+ FSA, risco EUDR e integração ativa com o TRACES NT da Comissão Europeia."
        accessory={
          <Badge variant="outline" className="text-[10px]">
            <span className="size-1.5 rounded-full bg-[hsl(142_71%_36%)] animate-pulse" />
            Tempo real
          </Badge>
        }
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="size-4" /> {periodo}
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {PERIODOS.map((p) => (
                  <DropdownMenuItem
                    key={p}
                    onSelect={() => setPeriodo(p)}
                  >
                    {p}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ProgramarAuditoriaModal
              trigger={
                <Button variant="outline" size="sm">
                  <ShieldCheck className="size-4" /> Programar auditoria
                </Button>
              }
            />
            <NovaViagemModal />
          </>
        }
      />

      {/* Banner de auditoria */}
      {proximaAuditoria && (
        <div className="relative overflow-hidden rounded-xl border border-[hsl(176_60%_60%)] bg-gradient-to-r from-[hsl(174_64%_97%)] via-white to-[hsl(200_60%_97%)] p-4 flex items-center gap-4">
          <div className="absolute -right-12 -top-12 size-48 rounded-full bg-gradient-to-br from-[hsl(176_84%_25%_/_0.06)] to-transparent" />
          <div className="relative size-11 rounded-xl bg-white shadow-brand-sm border border-[hsl(176_60%_75%)] flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5 text-[hsl(176_84%_25%)]" />
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="warning" className="text-[10px]">{diasAudit >= 0 ? `D-${diasAudit}` : "Atrasada"}</Badge>
              <p className="text-[14px] font-semibold text-[hsl(195_30%_8%)]">
                Auditoria {proximaAuditoria.tipo} programada para {formatDateTime(proximaAuditoria.data).split(",")[0]}
              </p>
            </div>
            <p className="text-[12px] text-[hsl(200_25%_25%)]">
              <span className="font-medium">{proximaAuditoria.auditor}</span> · {proximaAuditoria.organismo} · Conformidade média{" "}
              <span className="font-bold text-[hsl(176_84%_25%)] num">{confMedia}%</span> · 12 itens preparatórios pendentes
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="relative shrink-0">
            <Link href="/auditoria">
              Plano de preparação <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard {...dashboardKPIs[0]} value={viagensAtivas} icon={<Truck className="size-4" />} sparkline={[42, 38, 51, 47, 58, 62, 68, 64, 71, 78, 82, 84]} />
        <KPICard {...dashboardKPIs[1]} value={`${confMedia}%`} icon={<ShieldCheck className="size-4" />} variant="success" sparkline={[88, 89, 90, 91, 91, 92, 94, 94, 95, 96, 97, 97.8]} />
        <KPICard {...dashboardKPIs[2]} value={bloqueadas} icon={<AlertOctagon className="size-4" />} variant="danger" sparkline={[14, 18, 12, 16, 11, 14, 9, 12, 8, 11, 9, 7]} />
        <KPICard {...dashboardKPIs[3]} icon={<Trees className="size-4" />} sparkline={[45, 48, 52, 55, 58, 62, 68, 72, 76, 80, 84, 88]} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <CardTitle>Evolução de conformidade</CardTitle>
                <CardDescription>GMP+ FSA e maturidade EUDR · 6 meses</CardDescription>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <Legend color="var(--color-brand-600)" label="GMP+ FSA" value={`${ultimoConf.gmpPlus}%`} />
                <Legend color="var(--color-sky-500)" label="EUDR" value={`${ultimoConf.eudr}%`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={conformidadeChart} margin={{ top: 10, right: 14, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.42} />
                    <stop offset="45%" stopColor="var(--color-brand-500)" stopOpacity={0.14} />
                    <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="eudr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-sky-500)" stopOpacity={0.3} />
                    <stop offset="45%" stopColor="var(--color-sky-500)" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="var(--color-sky-500)" stopOpacity={0} />
                  </linearGradient>
                  {/* Traço com sombra da marca — profundidade sem poluir */}
                  <filter id="glowGmp" x="-20%" y="-40%" width="140%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="var(--color-brand-600)" floodOpacity="0.28" />
                  </filter>
                  <filter id="glowEudr" x="-20%" y="-40%" width="140%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="var(--color-sky-500)" floodOpacity="0.22" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" vertical={false} />
                <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-fg-muted)" }} dy={4} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-fg-muted)" }} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-bg-elev)",
                    border: "1px solid var(--color-border-soft)",
                    borderRadius: 10,
                    fontSize: 12,
                    boxShadow: "0 8px 28px hsl(200 40% 20% / 0.14)",
                  }}
                  cursor={{ stroke: "var(--color-brand-500)", strokeDasharray: "4 4", strokeOpacity: 0.5 }}
                />
                <Area
                  type="monotone"
                  dataKey="eudr"
                  name="EUDR"
                  stroke="var(--color-sky-500)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  fill="url(#eudr)"
                  filter="url(#glowEudr)"
                  dot={dotUltimo("var(--color-sky-500)", lastIdx)}
                  activeDot={{ r: 4.5, strokeWidth: 2, stroke: "var(--color-bg-elev)" }}
                  animationDuration={1300}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="gmpPlus"
                  name="GMP+ FSA"
                  stroke="var(--color-brand-600)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  fill="url(#gmp)"
                  filter="url(#glowGmp)"
                  dot={dotUltimo("var(--color-brand-600)", lastIdx)}
                  activeDot={{ r: 4.5, strokeWidth: 2, stroke: "var(--color-bg-elev)" }}
                  animationDuration={1300}
                  animationBegin={150}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Viagens por status</CardTitle>
            <CardDescription>Distribuição atual · {viagensPorStatusChart.reduce((a, b) => a + b.quantidade, 0)} totais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie
                      data={viagensPorStatusChart}
                      dataKey="quantidade"
                      nameKey="status"
                      innerRadius={42}
                      outerRadius={58}
                      paddingAngle={2}
                      stroke="white"
                      strokeWidth={2}
                    >
                      {viagensPorStatusChart.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[20px] font-bold num leading-none">191</p>
                  <p className="text-[9px] text-[hsl(210_14%_42%)] uppercase tracking-wider font-semibold mt-0.5">total</p>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                {viagensPorStatusChart.map((s) => (
                  <div key={s.status} className="flex items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="size-2 rounded-full shrink-0" style={{ background: s.fill }} />
                      <span className="text-[hsl(210_14%_42%)] truncate">{s.status}</span>
                    </div>
                    <span className="font-semibold num">{s.quantidade}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Viagens em destaque</CardTitle>
                <CardDescription>Operações ativas e que requerem atenção</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/viagens">
                  Todas <ChevronRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {viagensRecentes.map((v) => (
              <Link
                key={v.id}
                href={`/viagens/${v.id}`}
                className={cn(
                  "group block rounded-lg border p-3 transition-all hover:shadow-brand-md hover:-translate-y-px",
                  v.status === "Bloqueada"
                    ? "border-danger-500/40 bg-danger-50/40 hover:border-danger-500/60"
                    : "border-border-soft hover:border-brand-500/50 hover:bg-brand-50/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "size-9 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                      v.status === "Bloqueada"
                        ? "bg-danger-50 text-danger-700"
                        : "bg-gradient-to-br from-brand-600 to-sky-600 text-white"
                    )}
                  >
                    <Truck className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="font-mono text-[11px] font-semibold text-fg">{v.codigo}</span>
                      <StatusBadge status={v.status} size="sm" />
                      <RegimeBadge regime={v.regimeLimpeza} size="sm" />
                      {v.alertas > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-danger-700">
                          <AlertTriangle className="size-2.5" />
                          {v.alertas}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-medium truncate">
                      {v.motorista}
                      <span className="text-fg-muted font-normal"> · {v.produto}</span>
                    </p>
                    <p className="text-[11px] text-fg-soft truncate mt-0.5">
                      {v.origem.split("·")[0].trim()} → {v.destino.split("·")[0].trim()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-[18px] font-bold num leading-none", confClass(v.conformidade))}>
                      {v.conformidade}%
                    </p>
                    <p className="text-[10px] text-fg-muted uppercase tracking-wider font-semibold mt-1">
                      conf.
                    </p>
                  </div>
                  <ChevronRight className="size-4 self-center shrink-0 text-fg-soft opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-600 transition-all" aria-hidden />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Atividade recente</CardTitle>
                <CardDescription>Últimos eventos do sistema</CardDescription>
              </div>
              <Activity className="size-4 text-[hsl(210_14%_42%)]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-3.5">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[hsl(200_18%_92%)]" />
              {atividades.slice(0, 6).map((a) => (
                <div key={a.id} className="relative pl-8">
                  <div
                    className={cn(
                      "absolute left-0 top-0.5 size-[22px] rounded-full border-[3px] border-white flex items-center justify-center",
                      a.severidade === "danger" && "bg-[hsl(0_78%_50%)]",
                      a.severidade === "warning" && "bg-[hsl(28_92%_48%)]",
                      a.severidade === "success" && "bg-[hsl(142_71%_36%)]",
                      a.severidade === "info" && "bg-[hsl(200_92%_30%)]"
                    )}
                  >
                    <div className="size-1.5 rounded-full bg-white" />
                  </div>
                  <p className="text-[12px] font-semibold leading-snug">{a.titulo}</p>
                  <p className="text-[11px] text-[hsl(210_14%_42%)] mt-0.5 leading-snug">{a.descricao}</p>
                  <p className="text-[10px] text-[hsl(210_12%_58%)] mt-1 uppercase tracking-wider font-semibold">
                    {formatDateTime(a.quando)} · {a.ator}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Regimes de limpeza</CardTitle>
            <CardDescription>Distribuição IDTF · últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {regimesDistribuicao.map((r, i) => {
              const regimeLetter = r.regime.charAt(7) as "A" | "B" | "C" | "D";
              const barra: Record<"A" | "B" | "C" | "D", string> = {
                A: "bg-gradient-to-r from-brand-500 to-success-500",
                B: "bg-gradient-to-r from-warning-500/60 to-warning-500",
                C: "bg-gradient-to-r from-warning-500 to-warning-700",
                D: "bg-gradient-to-r from-danger-500 to-danger-700",
              };
              return (
                <div key={r.regime}>
                  <div className="flex items-center justify-between mb-1.5">
                    <RegimeBadge regime={regimeLetter} size="sm" />
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[14px] font-bold num">{r.quantidade}</span>
                      <span className="text-[10px] text-fg-muted num">({r.percentual}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-bg overflow-hidden">
                    {/* Cresce em cascata na entrada — largura anima de 0 ao percentual */}
                    <div
                      className={cn("h-full rounded-full transition-[width] duration-700 ease-out", barra[regimeLetter])}
                      style={{ width: pronto ? `${r.percentual}%` : "0%", transitionDelay: `${i * 130}ms` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="mt-4 p-2.5 rounded-md bg-brand-50/60 border border-brand-500/30">
              <p className="text-[11px] text-brand-700 leading-snug">
                <Zap className="size-3 inline mr-1 -mt-0.5" />
                Regime determinado automaticamente pelo motor T-3 cruzando IDTF do GMP+ FSA.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Risco EUDR</CardTitle>
                <CardDescription>INPE · MapBiomas · CAR</CardDescription>
              </div>
              <Button variant="ghost" size="icon-sm" asChild>
                <Link href="/fazendas">
                  <ExternalLink className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {fazendasRisco.length === 0 ? (
              <p className="text-center text-[12px] text-[hsl(210_14%_42%)] py-8">
                Sem fazendas em risco no momento.
              </p>
            ) : (
              fazendasRisco.map((f) => (
                <Link
                  key={f.id}
                  href="/fazendas"
                  className="group flex items-start gap-2.5 p-2.5 rounded-lg border border-border-soft hover:border-brand-500/50 hover:bg-brand-50/30 hover:shadow-brand-sm transition-all"
                >
                  <div className="size-7 rounded-md bg-warning-50 text-warning-700 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                    <Trees className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold truncate">{f.nome}</p>
                    <p className="text-[10px] text-fg-muted mt-0.5 truncate">
                      {f.cidade}/{f.uf} · <span className="num">{f.areaTotalHa.toLocaleString("pt-BR")}</span> ha
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <RiscoBadge risco={f.scoreRiscoEUDR} />
                      {f.desmatamentoPos2020 && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-danger-700">
                          <ShieldAlert className="size-2.5" /> PÓS-2020
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="size-3.5 self-center shrink-0 text-fg-soft opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-600 transition-all" aria-hidden />
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Não conformidades</CardTitle>
                <CardDescription>{ncCriticas.length} em aberto · ação requerida</CardDescription>
              </div>
              <Button variant="ghost" size="icon-sm" asChild>
                <Link href="/bloqueios">
                  <ExternalLink className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {ncCriticas.slice(0, 4).map((nc) => (
              <Link
                key={nc.id}
                href="/bloqueios"
                className="group block p-2.5 rounded-lg border border-border-soft hover:border-brand-500/50 hover:bg-brand-50/30 hover:shadow-brand-sm transition-all"
              >
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      "size-7 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                      nc.severidade === "Crítica" && "bg-danger-50 text-danger-700",
                      nc.severidade === "Maior" && "bg-warning-50 text-warning-700",
                      nc.severidade === "Menor" && "bg-warning-50/60 text-warning-700"
                    )}
                  >
                    <AlertOctagon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold">{nc.codigo}</span>
                      <Badge
                        variant={
                          nc.severidade === "Crítica"
                            ? "destructive"
                            : nc.severidade === "Maior"
                            ? "warning"
                            : "muted"
                        }
                        className="text-[9px]"
                      >
                        {nc.severidade}
                      </Badge>
                    </div>
                    <p className="text-[11px] mt-1 line-clamp-2 leading-snug">{nc.descricao}</p>
                    <p className="text-[9px] text-fg-soft mt-1.5 uppercase tracking-wider font-semibold">
                      {formatDateTime(nc.abertaEm)}
                    </p>
                  </div>
                  <ChevronRight className="size-3.5 self-center shrink-0 text-fg-soft opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-600 transition-all" aria-hidden />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-2 rounded-full" style={{ background: color }} />
      <span className="text-[hsl(210_14%_42%)]">{label}</span>
      <span className="font-bold num text-[hsl(195_30%_8%)]">{value}</span>
    </div>
  );
}
