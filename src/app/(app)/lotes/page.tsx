"use client";

import { useState } from "react";
import {
  Search,
  Send,
  Eye,
  Globe2,
  ArrowRight,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shell/status-badge";
import { lotes } from "@/lib/mock-data";
import { NovoLoteModal } from "@/components/modals/novo-lote-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, formatNumber, cn } from "@/lib/utils";

export default function LotesPage() {
  const { updateLoteStatus, version } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const filtered = lotes.filter(
    (l) =>
      l.codigo.toLowerCase().includes(search.toLowerCase()) ||
      l.destinatarioFinal.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    aprovados: lotes.filter((l) => l.statusDDS === "Aprovado").length,
    enviados: lotes.filter((l) => l.statusDDS === "Enviado TRACES").length,
    prontos: lotes.filter((l) => l.statusDDS === "Pronto para envio").length,
    rascunho: lotes.filter((l) => l.statusDDS === "Rascunho").length,
  };

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Lotes EUDR e Declarações DDS"
        description="Lotes de exportação para a União Europeia. Cada lote agrega cargas de fazendas verificadas e gera uma Declaração de Devida Diligência transmitida via gateway TRACES NT (SOAP/WS-Security)."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast("Modelos DDS", { type: "info", desc: "Biblioteca de modelos por país destino." })}>
              <FileText className="size-4" /> Modelos DDS
            </Button>
            <NovoLoteModal />
          </>
        }
      />

      {/* Pipeline visual */}
      <Card className="bg-gradient-to-br from-white via-[hsl(180_14%_98%)] to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pipeline TRACES NT</CardTitle>
              <CardDescription>
                Fluxo de uma DDS desde a composição do lote até a aprovação pela autoridade competente da UE
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px]">
              <Globe2 className="size-2.5" /> Atualizado há 2min
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
            {[
              { label: "Lote composto", desc: "Cargas das fazendas agregadas", count: counts.rascunho + counts.prontos + counts.enviados + counts.aprovados },
              { label: "DDS gerada", desc: "XML estruturado", count: counts.prontos + counts.enviados + counts.aprovados },
              { label: "Assinada", desc: "ICP-Brasil + WS-Security", count: counts.enviados + counts.aprovados },
              { label: "Enviada TRACES", desc: "Protocolo SOAP M2M", count: counts.enviados + counts.aprovados },
              { label: "Aprovada UE", desc: "Aceita pela autoridade", count: counts.aprovados },
            ].map((step, i, arr) => (
              <div key={i} className="flex items-center gap-1 flex-1 min-w-[180px]">
                <div className="flex-1 rounded-xl bg-white border border-[hsl(200_18%_92%)] p-3 text-center relative overflow-hidden shadow-brand-sm">
                  <div className="absolute -top-2 -right-2 size-12 rounded-full bg-gradient-to-br from-[hsl(174_64%_94%)] to-transparent" />
                  <div className="relative size-9 rounded-lg bg-gradient-to-br from-[hsl(176_84%_25%)] to-[hsl(200_92%_28%)] text-white font-bold text-[13px] mx-auto flex items-center justify-center mb-2 shadow-brand-sm num">
                    {i + 1}
                  </div>
                  <p className="relative text-[11px] font-bold text-[hsl(195_30%_8%)] leading-tight">{step.label}</p>
                  <p className="relative text-[10px] text-[hsl(210_14%_42%)] mt-0.5 leading-tight">{step.desc}</p>
                  <p className="relative text-[22px] font-bold text-traxium-grad text-[hsl(176_84%_25%)] mt-2 num leading-none">
                    {step.count}
                  </p>
                </div>
                {i < arr.length - 1 && <ArrowRight className="size-4 text-[hsl(210_12%_70%)] shrink-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[hsl(210_14%_42%)]" />
            <Input
              placeholder="Buscar lote ou destinatário…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Badge variant="outline">{filtered.length} lotes</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Tonelagem</TableHead>
                <TableHead>Fazendas</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>Status DDS</TableHead>
                <TableHead>Número DDS</TableHead>
                <TableHead>Envio</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <p className="font-mono text-[12px] font-bold text-[hsl(180_80%_18%)]">{l.codigo}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-[12px]">{l.produto}</p>
                    <p className="text-[10px] text-[hsl(210_12%_58%)] font-mono">HS {l.hsCode}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="text-[13px] font-bold num">{formatNumber(l.toneladas)}</p>
                    <p className="text-[10px] text-[hsl(210_12%_58%)]">toneladas</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-[12px]">{l.fazendas.length} fazenda{l.fazendas.length > 1 ? "s" : ""}</p>
                    <p className="text-[10px] text-[hsl(210_12%_58%)] truncate max-w-[180px]">
                      {l.fazendas.map((f) => f.nome).join(" · ")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-[12px] font-medium">{l.destinatarioFinal}</p>
                    <p className="text-[10px] text-[hsl(210_12%_58%)]">{l.paisDestino}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={l.statusDDS} size="sm" />
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-[hsl(210_14%_42%)]">
                    {l.numeroDDS || "—"}
                  </TableCell>
                  <TableCell className="text-[11px] text-[hsl(210_14%_42%)] num whitespace-nowrap">
                    {l.dataEnvio ? formatDateTime(l.dataEnvio) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {l.statusDDS === "Rascunho" && (
                        <Button variant="gradient" size="sm" onClick={() => { updateLoteStatus(l.id, "Pronto para envio"); toast(`${l.codigo} validado`, { desc: "DDS pronta para envio ao TRACES." }); }}>
                          <Sparkles className="size-3.5" /> Validar
                        </Button>
                      )}
                      {l.statusDDS === "Pronto para envio" && (
                        <Button variant="gradient" size="sm" onClick={() => { updateLoteStatus(l.id, "Enviado TRACES"); toast(`${l.codigo} enviado ao TRACES NT`, { desc: "Aguardando validação da autoridade UE." }); }}>
                          <Send className="size-3.5" /> Enviar
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" onClick={() => toast(l.codigo, { type: "info", desc: `${l.fazendas.length} origem(ns) · ${l.destinatarioFinal}` })}>
                        <Eye className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Validação de DDS · Pré-envio</CardTitle>
          <CardDescription>Checklist obrigatório antes de transmitir ao TRACES NT</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { ok: true, label: "Todas as fazendas com polígono validado" },
            { ok: true, label: "Cruzamento INPE/MapBiomas concluído" },
            { ok: true, label: "CAR vigente e regularizado para cada fazenda" },
            { ok: true, label: "HS Code presente na lista EUDR" },
            { ok: true, label: "Quantidade conferida com manifesto" },
            { ok: false, label: "Documento de operador/comerciante UE assinado" },
            { ok: true, label: "Assinatura digital ICP-Brasil válida" },
            { ok: true, label: "WS-Security configurado" },
          ].map((v, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md border",
                v.ok ? "border-[hsl(142_60%_85%)] bg-[hsl(142_65%_98%)]" : "border-[hsl(28_92%_80%)] bg-[hsl(36_95%_98%)]"
              )}
            >
              <div
                className={cn(
                  "size-5 rounded-full flex items-center justify-center shrink-0",
                  v.ok ? "bg-[hsl(142_71%_36%)] text-white" : "bg-[hsl(28_92%_48%)] text-white"
                )}
              >
                {v.ok ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
              </div>
              <span className="text-[12px] flex-1">{v.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
