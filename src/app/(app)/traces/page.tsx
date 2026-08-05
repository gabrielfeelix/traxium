"use client";

import {
  Send,
  Check,
  RefreshCw,
  Globe2,
  Code2,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatTile } from "@/components/kit/stat-tile";
import { MonitorConexao } from "@/components/traces/monitor-conexao";
import { useState } from "react";
import { traceNTLogs, type TraceLog } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function TracesPage() {
  const { toast } = useToast();
  // Re-sincronizações disparadas nesta sessão entram no monitor de verdade.
  const [extras, setExtras] = useState<TraceLog[]>([]);
  const logs = [...traceNTLogs, ...extras];

  function resync() {
    const n = extras.length + 1;
    const novo: TraceLog = {
      ts: `2026-07-08T11:${String(n).padStart(2, "0")}:00`,
      direcao: "out",
      evento: `StatusQuery · re-sincronização manual #${n}`,
      payload: `Reference: TRX-NT-${99820 + n}`,
      status: "Accepted",
      latenciaMs: 190 + n * 7,
    };
    setExtras((cur) => [...cur, novo]);
    toast("Fila SOAP re-sincronizada", { desc: `StatusQuery enviado — resposta em ${novo.latenciaMs}ms.` });
  }

  // KPIs derivados do log real do gateway — nada chumbado.
  const saidas = logs.filter((l) => l.direcao === "out");
  const latMedia = Math.round(saidas.reduce((acc, l) => acc + l.latenciaMs, 0) / Math.max(saidas.length, 1));
  const sucesso = Math.round((saidas.filter((l) => l.status !== "Rejected").length / Math.max(saidas.length, 1)) * 100);
  const ddsEnviadas = saidas.filter((l) => l.evento.startsWith("SubmitDDS")).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gateway TRACES NT"
        description="Integração M2M com o portal da Comissão Europeia para submissão automática de Declarações de Devida Diligência (DDS). Protocolo SOAP com WS-Security."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={resync}>
              <RefreshCw className="size-4" /> Re-sincronizar
            </Button>
            <Button variant="gradient" size="sm" onClick={() => toast("Conexão OK", { desc: "Handshake WS-Security bem-sucedido." })}>
              <Globe2 className="size-4" /> Testar conexão
            </Button>
          </>
        }
      />

      {/* Status do gateway */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-gradient-to-br from-brand-50 via-bg-elev to-brand-50/40 border-brand-500/40">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Gateway operacional</CardTitle>
                <CardDescription>Conectado ao endpoint produtivo da CE · ec.europa.eu/traces</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-success-500 animate-pulse-ring" />
                <span className="text-xs font-semibold text-success-700">Online</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile label="Latência média" value={`${latMedia}ms`} hint="round-trip de envio" />
            <StatTile label="Sucesso (7d)" value={`${sucesso}%`} hint="submissões sem rejeição" tone={sucesso >= 90 ? "success" : "warning"} />
            <StatTile label="DDS enviadas (7d)" value={ddsEnviadas} hint="inclui retries" tone="brand" />
            <StatTile label="Próx. sync" value="2 min" hint="agenda do batch" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand-500" />
              Credenciais
            </CardTitle>
            <CardDescription>WS-Security X.509 + ICP-Brasil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <KV label="Certificado" value="ICP-Brasil A3" />
            <KV label="Algoritmo" value="RSA-2048 + SHA-256" />
            <KV label="Vencimento" value="14/11/2027" />
            <KV label="Autoridade emissora" value="Autoridade BR Federal" />
            <div className="flex items-center justify-between p-2 rounded-md bg-success-50">
              <span className="text-success-700 font-medium">Certificado válido</span>
              <Check className="size-3.5 text-success-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Momento-assinatura: o log SOAP como sequência bidirecional Traxium ↔ CE. */}
      <MonitorConexao logs={logs} />

      <Tabs defaultValue="config">
        <TabsList>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="schemas">Schemas XSD</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do gateway</CardTitle>
              <CardDescription>Ambiente, endpoint, autenticação e políticas de retry</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <ConfigRow label="Ambiente" value="Produção (PRD)" />
              <ConfigRow label="Endpoint primário" value="https://traces.ec.europa.eu/ws/eudr/v1" mono />
              <ConfigRow label="Endpoint fallback" value="https://traces-fb.ec.europa.eu/ws/eudr/v1" mono />
              <ConfigRow label="Protocolo" value="SOAP 1.2 + WS-Security" />
              <ConfigRow label="Timeout" value="60s" />
              <ConfigRow label="Máximo de retries" value="3 (exponential backoff)" />
              <ConfigRow label="Pool de conexões" value="8" />
              <ConfigRow label="Webhook callback" value="https://api.traxium.com.br/traces/callback" mono />
              <div className="md:col-span-2 mt-2 space-y-2">
                <ToggleRow label="Envio em lote (batch 50 DDS)" defaultChecked />
                <ToggleRow label="Notificar via Slack quando reprovado" defaultChecked />
                <ToggleRow label="Modo verbose (log de payload completo)" />
                <ToggleRow label="Tentar fallback automaticamente" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemas">
          <Card>
            <CardHeader>
              <CardTitle>Schemas XSD</CardTitle>
              <CardDescription>Esquemas oficiais da Comissão Europeia atualmente em uso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "EUDR_DueDiligenceStatement_v1.2.xsd",
                "EUDR_OperatorCommerciant_v1.1.xsd",
                "EUDR_GeolocationPolygon_v1.0.xsd",
                "EUDR_ProductIdentification_v1.1.xsd",
                "TRACES_Common_v3.0.xsd",
              ].map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-3 p-3 rounded-md border border-border-soft hover:bg-brand-50/50"
                >
                  <Code2 className="size-4 text-brand-500" />
                  <span className="text-sm font-mono flex-1">{s}</span>
                  <Badge variant="success" className="text-[10px]">
                    Atualizado
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de webhook</CardTitle>
              <CardDescription>Quando o TRACES NT envia notificações para o Traxium</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { ev: "dds.accepted", desc: "DDS aceita e em análise pela autoridade", on: true },
                { ev: "dds.approved", desc: "DDS aprovada — pode prosseguir com a exportação", on: true },
                { ev: "dds.rejected", desc: "DDS rejeitada — exige revisão", on: true },
                { ev: "dds.under_review", desc: "DDS em revisão manual da autoridade", on: true },
                { ev: "dds.expired", desc: "DDS expirada — recriar declaração", on: true },
                { ev: "system.maintenance", desc: "TRACES NT em manutenção programada", on: false },
              ].map((w, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md border border-border-soft">
                  <Send className="size-4 text-brand-500" />
                  <div className="flex-1">
                    <p className="text-sm font-mono font-semibold">{w.ev}</p>
                    <p className="text-[11px] text-fg-muted">{w.desc}</p>
                  </div>
                  <Switch defaultChecked={w.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-fg-muted">{label}</span>
      <span className="font-semibold text-right truncate">{value}</span>
    </div>
  );
}

function ConfigRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border-soft">
      <span className="text-xs text-fg-muted">{label}</span>
      <span className={cn("text-xs font-medium text-right truncate max-w-[280px]", mono && "font-mono")}>{value}</span>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-md hover:bg-brand-50/50">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
