"use client";

import {
  Database,
  Send,
  Check,
  X,
  RefreshCw,
  Globe2,
  Code2,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { traceNTLogs } from "@/lib/mock-data";
import { cn, formatDateTime } from "@/lib/utils";

export default function TracesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gateway TRACES NT"
        description="Integração M2M com o portal da Comissão Europeia para submissão automática de Declarações de Devida Diligência (DDS). Protocolo SOAP com WS-Security."
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="size-4" /> Re-sincronizar
            </Button>
            <Button variant="gradient" size="sm">
              <Globe2 className="size-4" /> Testar conexão
            </Button>
          </>
        }
      />

      {/* Status do gateway */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-gradient-to-br from-[hsl(174_64%_97%)] via-white to-[hsl(200_60%_97%)] border-[hsl(174_72%_60%)]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Gateway operacional</CardTitle>
                <CardDescription>Conectado ao endpoint produtivo da CE · ec.europa.eu/traces</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="size-2.5 rounded-full bg-[hsl(142_71%_40%)] animate-pulse" />
                </div>
                <span className="text-xs font-semibold text-[hsl(142_71%_30%)]">Online</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPIBlock label="Latência" value="312ms" />
            <KPIBlock label="Sucesso 24h" value="98.4%" />
            <KPIBlock label="DDS hoje" value="14" />
            <KPIBlock label="Próx. sync" value="2 min" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[hsl(174_72%_35%)]" />
              Credenciais
            </CardTitle>
            <CardDescription>WS-Security X.509 + ICP-Brasil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <KV label="Certificado" value="ICP-Brasil A3" />
            <KV label="Algoritmo" value="RSA-2048 + SHA-256" />
            <KV label="Vencimento" value="14/11/2027" />
            <KV label="Autoridade emissora" value="Autoridade BR Federal" />
            <div className="flex items-center justify-between p-2 rounded-md bg-[hsl(142_71%_96%)]">
              <span className="text-[hsl(142_71%_28%)] font-medium">Certificado válido</span>
              <Check className="size-3.5 text-[hsl(142_71%_28%)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Logs SOAP</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="schemas">Schemas XSD</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-4" />
                Logs de comunicação · Últimos 7 dias
              </CardTitle>
              <CardDescription>Cada operação é registrada com payload, assinatura e resposta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5 font-mono text-xs">
              {traceNTLogs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[hsl(174_64%_98%)] border border-[hsl(215_20%_94%)]"
                >
                  <span className="text-[hsl(215_16%_47%)] tabular-nums shrink-0">{formatDateTime(log.ts)}</span>
                  <Badge
                    variant={log.direcao === "out" ? "secondary" : "default"}
                    className="text-[9px] font-mono"
                  >
                    {log.direcao === "out" ? "→ OUT" : "← IN"}
                  </Badge>
                  <span className="flex-1 truncate">{log.evento}</span>
                  <span className="text-[hsl(215_16%_47%)] truncate max-w-[200px]">{log.payload}</span>
                  <Badge
                    variant={
                      log.status === "Approved"
                        ? "success"
                        : log.status === "Accepted"
                        ? "default"
                        : log.status === "Pending Review"
                        ? "warning"
                        : "destructive"
                    }
                    className="text-[9px]"
                  >
                    {log.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

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
                  className="flex items-center gap-3 p-3 rounded-md border border-[hsl(215_20%_92%)] hover:bg-[hsl(174_64%_98%)]"
                >
                  <Code2 className="size-4 text-[hsl(174_72%_35%)]" />
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
                <div key={i} className="flex items-center gap-3 p-3 rounded-md border border-[hsl(215_20%_92%)]">
                  <Send className="size-4 text-[hsl(174_72%_35%)]" />
                  <div className="flex-1">
                    <p className="text-sm font-mono font-semibold">{w.ev}</p>
                    <p className="text-[11px] text-[hsl(215_16%_47%)]">{w.desc}</p>
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

function KPIBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[hsl(215_20%_92%)] bg-white/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-[hsl(215_16%_47%)] font-semibold">{label}</p>
      <p className="text-xl font-bold tabular-nums mt-0.5">{value}</p>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[hsl(215_16%_47%)]">{label}</span>
      <span className="font-semibold text-right truncate">{value}</span>
    </div>
  );
}

function ConfigRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-[hsl(215_20%_94%)]">
      <span className="text-xs text-[hsl(215_16%_47%)]">{label}</span>
      <span className={cn("text-xs font-medium text-right truncate max-w-[280px]", mono && "font-mono")}>{value}</span>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-md hover:bg-[hsl(174_64%_98%)]">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
