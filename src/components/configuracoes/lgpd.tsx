"use client";

// Aba LGPD (Fase 10.2): retenção, inativação, consentimentos e bases legais.
//
// A conta de retenção é feita contra o HOJE do protótipo e mostrada — "expira
// em 2031" é verificável; "conforme a política" não é.

import { ShieldCheck, Clock, UserMinus, FileSignature, CircleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  POLITICA_RETENCAO, POLITICA_INATIVACAO, consentimentos, efeitoDaRevogacao,
  vencimentoRetencao, diasParaExpurgo,
} from "@/lib/domain/lgpd";
import { HOJE } from "@/lib/domain/model";
import { inspectionEvents, cleaningEvents } from "@/lib/domain/model";
import { formatDate, cn } from "@/lib/utils";

export function LGPD() {
  // Aplicação da retenção sobre evidência que existe de verdade no store: cada
  // inspeção e cada limpeza tem data, e a conta sai daí.
  const evidencias = [
    ...inspectionEvents.map((i) => ({ id: i.id, rotulo: `Inspeção ${i.id}`, data: i.dataHora.slice(0, 10) })),
    ...cleaningEvents.map((c) => ({ id: c.id, rotulo: `Limpeza ${c.id}`, data: c.data })),
  ];
  const politicaEvidencia = POLITICA_RETENCAO[0];
  const expirando = evidencias
    .map((e) => ({ ...e, dias: diasParaExpurgo(e.data, politicaEvidencia.meses), venceEm: vencimentoRetencao(e.data, politicaEvidencia.meses) }))
    .sort((a, b) => a.dias - b.dias);
  const jaExpiradas = expirando.filter((e) => e.dias < 0).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-brand-600" />
            <CardTitle>Prazo de retenção por tipo de dado</CardTitle>
          </div>
          <CardDescription>
            Prazo conta da data do fato, não da data do cadastro. Cada linha declara a base legal que autoriza guardar
            e o que acontece no fim do prazo.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de dado</TableHead>
                <TableHead>Retenção</TableHead>
                <TableHead>Base legal</TableHead>
                <TableHead>No fim do prazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {POLITICA_RETENCAO.map((p) => (
                <TableRow key={p.tipo}>
                  <TableCell>
                    <p className="text-[12.5px] font-medium">{p.tipo}</p>
                    <p className="text-[10.5px] text-fg-muted leading-snug">{p.fundamento}</p>
                  </TableCell>
                  <TableCell className="num text-[12px] whitespace-nowrap">{p.meses} meses</TableCell>
                  <TableCell>
                    <Badge variant={p.baseLegal === "Consentimento" ? "warning" : "secondary"} className="text-[9px]">
                      {p.baseLegal}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[11.5px] text-fg-muted">{p.aoVencer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand-600" />
            <CardTitle>Retenção aplicada às evidências existentes</CardTitle>
          </div>
          <CardDescription>
            <span className="num">{evidencias.length}</span> evidência(s) no store, contadas contra {formatDate(HOJE)}{" "}
            pela política de {politicaEvidencia.meses} meses.{" "}
            {jaExpiradas === 0
              ? "Nenhuma passou do prazo — nada a expurgar hoje."
              : `${jaExpiradas} passou(aram) do prazo e aguarda(m) expurgo.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {expirando.slice(0, 6).map((e) => (
            <div key={e.id} className="flex items-center gap-2 text-[11.5px]">
              <span className="font-mono text-fg-muted w-[110px] shrink-0">{e.rotulo}</span>
              <span className="text-fg-soft">fato em {formatDate(e.data)}</span>
              <span className="flex-1" />
              <span className={cn("num", e.dias < 0 ? "text-danger-700 font-semibold" : "text-fg-muted")}>
                {e.dias < 0 ? `expirou há ${Math.abs(e.dias)}d` : `expurgo em ${formatDate(e.venceEm)}`}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <UserMinus className="size-4 text-brand-600" />
            <CardTitle>Política de inativação</CardTitle>
          </div>
          <CardDescription>
            O que sai de circulação, quando — e, principalmente, o que não é apagado junto.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {POLITICA_INATIVACAO.map((r) => (
            <div key={r.gatilho} className="rounded-lg border border-border-soft bg-bg p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-semibold text-fg">{r.gatilho}</p>
                <span className="text-[10px] font-medium text-fg-muted whitespace-nowrap num">{r.prazo}</span>
              </div>
              <p className="text-[11.5px] text-fg-muted mt-1 leading-relaxed">{r.efeito}</p>
              <p className="text-[11px] text-fg-soft mt-1.5 leading-relaxed">
                <strong className="font-semibold text-fg-muted">Preservado:</strong> {r.preservado}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileSignature className="size-4 text-brand-600" />
            <CardTitle>Consentimentos e bases legais</CardTitle>
          </div>
          <CardDescription>
            Consentimento não é a base legal de tudo. Onde a base é obrigação regulatória, revogar não interrompe o
            tratamento — e o titular tem direito de saber disso por escrito.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {consentimentos.map((c) => {
            const efeito = efeitoDaRevogacao(c);
            return (
              <div
                key={c.id}
                className={cn(
                  "rounded-lg border p-3",
                  c.revogadoEm ? "border-warning-500/30 bg-warning-50/40" : "border-border-soft bg-bg"
                )}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-fg">{c.titular}</p>
                    <p className="text-[11.5px] text-fg-muted">{c.finalidade}</p>
                  </div>
                  <Badge variant={c.baseLegal === "Consentimento" ? "warning" : "secondary"} className="text-[9px] shrink-0">
                    {c.baseLegal}
                  </Badge>
                </div>
                <p className="text-[10.5px] text-fg-soft mt-1 num">
                  {c.canal} · coletado em {formatDate(c.coletadoEm)}
                  {c.revogadoEm && ` · revogado em ${formatDate(c.revogadoEm)}`}
                </p>
                <p className="text-[11px] text-fg-muted mt-1.5 flex items-start gap-1.5">
                  <CircleAlert className="size-3 shrink-0 mt-0.5 text-fg-soft" aria-hidden />
                  <span>
                    <strong className="font-semibold">Se revogar:</strong> {efeito.para} {efeito.continua}
                  </span>
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
