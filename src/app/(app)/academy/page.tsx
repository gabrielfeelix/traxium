"use client";

// TRAXIUM Academy — a sala virtual não é biblioteca de vídeo, é parte do
// processo de liberação (diretriz §Pilar 2). Por isso a peça central da tela é
// a MATRIZ motorista × trilha: quem opera, quem não opera e o que falta para
// destravar — não uma lista de cursos.

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, ShieldAlert, Clock, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatTile } from "@/components/kit/stat-tile";
import { Badge } from "@/components/ui/badge";
import { AnelCompetencia } from "@/components/academy/anel-competencia";
import { AtribuirTrilhaModal } from "@/components/modals/atribuir-trilha-modal";
import { useSession } from "@/lib/store/session";
import { motoristas } from "@/lib/mock-data";
import {
  TRILHAS, conclusoes, competenciaMotorista, trilhasExigidas, estadoTrilha,
  SITUACAO_COMPETENCIA, type EstadoTrilha,
} from "@/lib/domain/academy";
import { downloadCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CELULA: Record<EstadoTrilha, { classe: string; titulo: string; marca: string }> = {
  vigente: { classe: "bg-success-500", titulo: "Vigente", marca: "" },
  a_vencer: { classe: "bg-warning-500", titulo: "Vence em ≤30 dias", marca: "" },
  vencida: { classe: "bg-danger-500", titulo: "Vencida", marca: "" },
  nunca: { classe: "bg-danger-50 border-2 border-dashed border-danger-500", titulo: "Nunca concluída", marca: "" },
};

export default function AcademyPage() {
  const { version } = useSession();
  void version;
  const [foco, setFoco] = useState<string | null>(null);

  const base = trilhasExigidas({});
  const competencias = motoristas.map((m) => ({ m, c: competenciaMotorista(m.id) }));
  const aptos = competencias.filter((x) => x.c.situacao === "apto").length;
  const aVencer = competencias.filter((x) => x.c.situacao === "a_vencer").length;
  const inelegiveis = competencias.filter((x) => !x.c.elegivel).length;

  const listados = foco ? competencias.filter((x) => x.m.id === foco) : competencias;

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Academy"
        description="Competência é requisito de elegibilidade: sem trilha vigente, o motorista não é selecionável para a operação."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadCSV(
                  "traxium-academy-competencia",
                  ["Motorista", "Situação", "Motivo", "Trilhas pendentes", "Próximo vencimento"],
                  competencias.map(({ m, c }) => [
                    m.nome,
                    c.situacao,
                    c.motivo,
                    c.trilhasPendentes.map((t) => t.codigo).join(" ") || "—",
                    c.proximoVencimento ?? "—",
                  ])
                )
              }
            >
              Exportar para auditoria
            </Button>
            <AtribuirTrilhaModal />
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={GraduationCap} label="Motoristas" value={motoristas.length} />
        <StatTile icon={ShieldCheck} label="Competência vigente" value={aptos} tone="success" />
        <StatTile icon={Clock} label="Reciclagem próxima" value={aVencer} tone="warning" />
        <StatTile icon={ShieldAlert} label="Não elegíveis" value={inelegiveis} tone="danger" hint="Não aparecem no despacho" />
      </div>

      {/* Matriz motorista × trilha — o momento-assinatura da tela */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle>Matriz de competência</CardTitle>
              <CardDescription>
                Uma coluna por trilha obrigatória. Célula vazada = nunca concluída; vermelha = vencida.
              </CardDescription>
            </div>
            {foco && (
              <Button variant="ghost" size="sm" onClick={() => setFoco(null)}>Ver todos</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-1">
          {/* A matriz rola sozinha em tela estreita; a página nunca rola na horizontal. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted pb-2 pr-3">
                    Motorista
                  </th>
                  {base.map((t) => (
                    <th key={t.id} className="pb-2 px-1" title={t.titulo}>
                      <span className="block text-[10px] font-mono font-semibold text-fg-muted">{t.codigo}</span>
                    </th>
                  ))}
                  <th className="text-right text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted pb-2 pl-3">
                    Situação
                  </th>
                </tr>
              </thead>
              <tbody>
                {listados.map(({ m, c }, i) => {
                  const meta = SITUACAO_COMPETENCIA[c.situacao];
                  return (
                    <tr
                      key={m.id}
                      className="border-t border-border-soft animate-list-in"
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <td className="py-2.5 pr-3">
                        <button
                          onClick={() => setFoco(foco === m.id ? null : m.id)}
                          className="flex items-center gap-2.5 text-left group"
                        >
                          <AnelCompetencia
                            motoristaId={m.id}
                            iniciais={m.nome.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                            size={34}
                          />
                          <span className="min-w-0">
                            <span className="block text-[12.5px] font-semibold text-fg group-hover:text-brand-600 truncate">
                              {m.nome}
                            </span>
                            <span className="block text-[10.5px] text-fg-muted">{m.tipo}</span>
                          </span>
                        </button>
                      </td>
                      {base.map((t) => {
                        const e = estadoTrilha(m.id, t);
                        const cel = CELULA[e];
                        return (
                          <td key={t.id} className="px-1 py-2.5">
                            <span
                              className={cn("mx-auto block size-4 rounded", cel.classe)}
                              title={`${t.codigo} · ${t.titulo} — ${cel.titulo}`}
                            />
                          </td>
                        );
                      })}
                      <td className="py-2.5 pl-3 text-right">
                        <Badge
                          variant={meta.tone === "success" ? "success" : meta.tone === "warning" ? "warning" : "destructive"}
                          className="text-[9px]"
                        >
                          {meta.rotulo}
                        </Badge>
                        <p className="mt-0.5 text-[10.5px] text-fg-muted">{c.motivo}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Catálogo de trilhas */}
      <Card>
        <CardHeader>
          <CardTitle>Trilhas</CardTitle>
          <CardDescription>
            Regras de liberação por trilha: nota mínima, tentativas e periodicidade de reciclagem.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-1">
          <ul className="divide-y divide-border-soft">
            {TRILHAS.map((t, i) => {
              const vigentes = motoristas.filter((m) => estadoTrilha(m.id, t) === "vigente").length;
              const obrigatoria = t.gatilho.tipo === "sempre";
              return (
                <li
                  key={t.id}
                  className="flex items-start gap-3 py-3 animate-list-in"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className="mt-0.5 font-mono text-[11px] font-bold text-brand-600 shrink-0">{t.codigo}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-fg leading-tight">{t.titulo}</p>
                    <p className="mt-1 text-[11px] text-fg-muted num">
                      {t.duracaoMin} min · nota mínima {t.notaMinima} · até {t.tentativasMax} tentativas · reciclagem a
                      cada {t.validadeMeses} meses · conteúdo {t.versaoConteudo}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <Badge variant={obrigatoria ? "default" : "secondary"} className="text-[9px]">
                        {obrigatoria
                          ? "Obrigatória"
                          : t.gatilho.tipo === "regime"
                          ? `Acionada pelo regime ${t.gatilho.regime}`
                          : t.gatilho.tipo === "gatekeeper"
                          ? "Acionada em operação Gatekeeper"
                          : "Acionada por reincidência em fotos"}
                      </Badge>
                      <span className="text-[10.5px] text-fg-muted num">
                        {vigentes} de {motoristas.length} com a trilha vigente
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[11px] text-fg-muted">
            {conclusoes.length} conclusões registradas.{" "}
            <Link href="/motoristas" className="font-medium text-brand-600 hover:underline">
              Ver crachás <ArrowRight className="inline size-3" />
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
