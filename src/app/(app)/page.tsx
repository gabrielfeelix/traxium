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
import { useState } from "react";
import { NovaViagemModal } from "@/components/modals/nova-viagem-modal";
import { ProgramarAuditoriaModal } from "@/components/modals/programar-auditoria-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PERIODOS = ["Últimos 7 dias", "Últimos 30 dias", "Últimos 90 dias", "Tudo"];

export default function DashboardPage() {
  const { version, filialId } = useSession();
  const { toast } = useToast();
  const [periodo, setPeriodo] = useState("Últimos 30 dias");
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
                <Legend color="hsl(176 84% 25%)" label="GMP+ FSA" value="97.8%" />
                <Legend color="hsl(200 90% 36%)" label="EUDR" value="88.0%" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={conformidadeChart} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(176 84% 25%)" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="hsl(176 84% 25%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="eudr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(200 90% 36%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(200 90% 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 18% 92%)" vertical={false} />
                <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(210 14% 42%)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(210 14% 42%)" }} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(200 18% 92%)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "0 4px 20px hsl(200 40% 20% / 0.1)",
                  }}
                  cursor={{ stroke: "hsl(176 84% 25%)", strokeDasharray: "3 3" }}
                />
                <Area type="monotone" dataKey="gmpPlus" stroke="hsl(176 84% 25%)" strokeWidth={2.5} fill="url(#gmp)" />
                <Area type="monotone" dataKey="eudr" stroke="hsl(200 90% 36%)" strokeWidth={2.5} fill="url(#eudr)" />
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
                  "block rounded-lg border p-3 transition-all hover:shadow-brand-sm",
                  v.status === "Bloqueada"
                    ? "border-[hsl(0_72%_80%)] bg-[hsl(0_72%_98%)] hover:border-[hsl(0_78%_60%)]"
                    : "border-[hsl(200_18%_92%)] hover:border-[hsl(176_60%_60%)] hover:bg-[hsl(174_64%_99%)]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "size-9 rounded-md flex items-center justify-center shrink-0",
                      v.status === "Bloqueada"
                        ? "bg-[hsl(0_72%_94%)] text-[hsl(0_70%_38%)]"
                        : "bg-gradient-to-br from-[hsl(176_84%_28%)] to-[hsl(200_92%_28%)] text-white"
                    )}
                  >
                    <Truck className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="font-mono text-[11px] font-semibold text-[hsl(195_30%_8%)]">{v.codigo}</span>
                      <StatusBadge status={v.status} size="sm" />
                      <RegimeBadge regime={v.regimeLimpeza} size="sm" />
                      {v.alertas > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[hsl(0_70%_38%)]">
                          <AlertTriangle className="size-2.5" />
                          {v.alertas}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-medium truncate">
                      {v.motorista}
                      <span className="text-[hsl(210_14%_42%)] font-normal"> · {v.produto}</span>
                    </p>
                    <p className="text-[11px] text-[hsl(210_12%_58%)] truncate mt-0.5">
                      {v.origem.split("·")[0].trim()} → {v.destino.split("·")[0].trim()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        "text-[18px] font-bold num leading-none",
                        v.conformidade >= 90
                          ? "text-[hsl(142_71%_24%)]"
                          : v.conformidade >= 70
                          ? "text-[hsl(24_88%_32%)]"
                          : "text-[hsl(0_70%_38%)]"
                      )}
                    >
                      {v.conformidade}%
                    </p>
                    <p className="text-[10px] text-[hsl(210_14%_42%)] uppercase tracking-wider font-semibold mt-1">
                      conf.
                    </p>
                  </div>
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
            {regimesDistribuicao.map((r) => {
              const regimeLetter = r.regime.charAt(7) as "A" | "B" | "C" | "D";
              const colors = {
                A: "linear-gradient(90deg, hsl(176 84% 30%), hsl(142 71% 36%))",
                B: "linear-gradient(90deg, hsl(48 95% 50%), hsl(38 90% 45%))",
                C: "linear-gradient(90deg, hsl(36 95% 50%), hsl(24 88% 42%))",
                D: "linear-gradient(90deg, hsl(0 78% 50%), hsl(0 70% 38%))",
              };
              return (
                <div key={r.regime}>
                  <div className="flex items-center justify-between mb-1.5">
                    <RegimeBadge regime={regimeLetter} size="sm" />
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[14px] font-bold num">{r.quantidade}</span>
                      <span className="text-[10px] text-[hsl(210_14%_42%)] num">({r.percentual}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-[hsl(200_18%_94%)] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.percentual}%`, background: colors[regimeLetter] }} />
                  </div>
                </div>
              );
            })}
            <div className="mt-4 p-2.5 rounded-md bg-[hsl(174_64%_97%)] border border-[hsl(176_60%_85%)]">
              <p className="text-[11px] text-[hsl(180_80%_18%)] leading-snug">
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
                <div
                  key={f.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[hsl(200_18%_92%)] hover:border-[hsl(176_60%_60%)] hover:bg-[hsl(174_64%_99%)] transition-colors"
                >
                  <div className="size-7 rounded-md bg-[hsl(36_95%_92%)] text-[hsl(24_88%_32%)] flex items-center justify-center shrink-0">
                    <Trees className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold truncate">{f.nome}</p>
                    <p className="text-[10px] text-[hsl(210_14%_42%)] mt-0.5 truncate">
                      {f.cidade}/{f.uf} · <span className="num">{f.areaTotalHa.toLocaleString("pt-BR")}</span> ha
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <RiscoBadge risco={f.scoreRiscoEUDR} />
                      {f.desmatamentoPos2020 && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[hsl(0_70%_38%)]">
                          <ShieldAlert className="size-2.5" /> PÓS-2020
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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
              <div
                key={nc.id}
                className="p-2.5 rounded-lg border border-[hsl(200_18%_92%)] hover:border-[hsl(176_60%_60%)] hover:bg-[hsl(174_64%_99%)] transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      "size-7 rounded-md flex items-center justify-center shrink-0",
                      nc.severidade === "Crítica" && "bg-[hsl(0_72%_94%)] text-[hsl(0_70%_38%)]",
                      nc.severidade === "Maior" && "bg-[hsl(36_95%_92%)] text-[hsl(24_88%_32%)]",
                      nc.severidade === "Menor" && "bg-[hsl(48_95%_90%)] text-[hsl(38_90%_28%)]"
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
                    <p className="text-[9px] text-[hsl(210_12%_58%)] mt-1.5 uppercase tracking-wider font-semibold">
                      {formatDateTime(nc.abertaEm)}
                    </p>
                  </div>
                </div>
              </div>
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
