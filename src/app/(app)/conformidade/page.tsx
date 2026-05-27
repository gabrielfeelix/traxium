"use client";

import { BadgeCheck, TrendingUp, Award, Sparkles, ShieldCheck, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

const radarData = [
  { dimensao: "Higienização", score: 96 },
  { dimensao: "Documentação", score: 92 },
  { dimensao: "Treinamentos", score: 88 },
  { dimensao: "Certificações", score: 76 },
  { dimensao: "Rastreabilidade", score: 94 },
  { dimensao: "T-3 IDTF", score: 99 },
];

const motoristasRanking = [
  { nome: "Carlos Aparecido", conf: 99.1 },
  { nome: "Pedro Henrique", conf: 97.8 },
  { nome: "Edivaldo Souza", conf: 96.4 },
  { nome: "José Roberto Santos", conf: 94.7 },
  { nome: "Antonio Marcos", conf: 91.5 },
  { nome: "Mauricio Lima", conf: 78.2 },
];

export default function ConformidadePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Conformidade"
        description="Score consolidado de conformidade GMP+ FSA por dimensão, com ranking de motoristas, evolução temporal e identificação de gaps regulatórios prioritários."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hero score */}
        <Card className="bg-gradient-to-br from-[hsl(174_64%_97%)] via-white to-[hsl(200_60%_97%)] border-[hsl(176_60%_70%)] p-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 size-32 rounded-full bg-gradient-to-br from-[hsl(176_84%_25%_/_0.08)] to-transparent" />
          <div className="relative">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[hsl(180_80%_18%)] font-bold">
              Score consolidado
            </p>
            <div className="flex items-baseline gap-2 mt-1.5">
              <p className="text-[44px] font-bold text-[hsl(180_80%_18%)] tracking-tight num leading-none">92.4</p>
              <span className="text-[14px] text-[hsl(210_14%_42%)] num">/ 100</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px]">
              <Badge variant="success" className="text-[10px]">
                <TrendingUp className="size-2.5" /> +3.2 pts
              </Badge>
              <span className="text-[hsl(210_14%_42%)]">vs trimestre anterior</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[hsl(210_14%_42%)] font-bold">Selo GMP+ FSA</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="size-12 rounded-xl bg-gradient-to-br from-[hsl(176_84%_25%)] to-[hsl(200_92%_28%)] flex items-center justify-center shadow-brand-sm">
              <Award className="size-6 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-bold">Válido</p>
              <p className="text-[11px] text-[hsl(210_14%_42%)]">vence 15/01/2027</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[hsl(210_14%_42%)] font-bold">Preparação EUDR</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <p className="text-[32px] font-bold text-[hsl(202_92%_24%)] tracking-tight num leading-none">88%</p>
          </div>
          <div className="h-1.5 rounded-full bg-[hsl(200_18%_94%)] overflow-hidden mt-2">
            <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[hsl(176_84%_25%)] to-[hsl(200_92%_30%)]" />
          </div>
          <p className="text-[10px] text-[hsl(210_14%_42%)] mt-1.5">12 itens pendentes para conformidade total</p>
        </Card>

        <Card className="p-5">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[hsl(210_14%_42%)] font-bold">Recomendações ativas</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <p className="text-[32px] font-bold tracking-tight num leading-none">14</p>
          </div>
          <p className="text-[11px] text-[hsl(210_14%_42%)] mt-2">priorizadas pelo motor</p>
          <div className="flex items-center gap-1 mt-2">
            <Badge variant="success" className="text-[10px]">5 baixo esforço</Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Score por dimensão</CardTitle>
            <CardDescription>Performance em cada eixo do FSMS GMP+ FSA</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(200 18% 90%)" />
                <PolarAngleAxis
                  dataKey="dimensao"
                  tick={{ fontSize: 11, fill: "hsl(195 30% 8%)", fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: "hsl(210 14% 42%)" }}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(176 84% 25%)"
                  fill="hsl(176 84% 25%)"
                  fillOpacity={0.32}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(200 18% 92%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ranking por motorista</CardTitle>
            <CardDescription>Top 6 conformidade média · 90 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={motoristasRanking} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 18% 90%)" horizontal={false} />
                <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 11, fill: "hsl(210 14% 42%)" }} axisLine={false} />
                <YAxis
                  dataKey="nome"
                  type="category"
                  tick={{ fontSize: 11, fill: "hsl(195 30% 8%)" }}
                  width={140}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid hsl(200 18% 92%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "hsl(174 64% 97%)" }}
                />
                <Bar
                  dataKey="conf"
                  fill="hsl(176 84% 25%)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-gradient-to-br from-[hsl(176_84%_25%)] to-[hsl(200_92%_28%)] flex items-center justify-center shadow-brand-sm">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <CardTitle>Recomendações priorizadas do motor</CardTitle>
              <CardDescription>Ações que mais impactam o score nos próximos 30 dias</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { acao: "Renovar MOPP de 3 motoristas vencidos", impacto: "+4.2 pts", dim: "Certificações", esforco: "Baixo" },
            { acao: "Concluir 2 inspeções de carreta atrasadas", impacto: "+2.8 pts", dim: "Higienização", esforco: "Médio" },
            { acao: "Treinar 12 subcontratados em LCI versão 2026", impacto: "+5.1 pts", dim: "Treinamentos", esforco: "Alto" },
            { acao: "Atualizar política de sequenciamento conforme IDTF 2026.Q2", impacto: "+1.5 pts", dim: "Documentação", esforco: "Baixo" },
            { acao: "Validar polígonos de 3 fazendas pendentes", impacto: "+8.0 pts", dim: "Rastreabilidade EUDR", esforco: "Médio" },
          ].map((r, i) => (
            <div
              key={i}
              className="group flex items-center gap-3 p-3 rounded-lg border border-[hsl(200_18%_92%)] hover:border-[hsl(176_60%_60%)] hover:bg-[hsl(174_64%_99%)] transition-all cursor-pointer"
            >
              <div
                className={cn(
                  "size-9 rounded-md flex items-center justify-center shrink-0",
                  r.esforco === "Baixo" && "bg-[hsl(142_65%_93%)] text-[hsl(142_71%_24%)]",
                  r.esforco === "Médio" && "bg-[hsl(48_95%_90%)] text-[hsl(38_90%_28%)]",
                  r.esforco === "Alto" && "bg-[hsl(28_92%_92%)] text-[hsl(24_88%_32%)]"
                )}
              >
                <BadgeCheck className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium">{r.acao}</p>
                <p className="text-[11px] text-[hsl(210_14%_42%)] mt-0.5">
                  <span className="font-bold text-[hsl(142_71%_24%)] num">{r.impacto}</span> em {r.dim}
                </p>
              </div>
              <Badge
                variant={r.esforco === "Baixo" ? "success" : r.esforco === "Médio" ? "warning" : "destructive"}
                className="text-[10px]"
              >
                {r.esforco}
              </Badge>
              <ChevronRight className="size-4 text-[hsl(210_12%_70%)] group-hover:text-[hsl(176_84%_25%)]" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
