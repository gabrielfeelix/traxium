"use client";

import { use } from "react";
import {
  ArrowLeft,
  Truck,
  MapPin,
  Calendar,
  Package,
  User,
  Container as ContainerIcon,
  Camera,
  Shield,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  Phone,
  Navigation,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StatusBadge, RegimeBadge } from "@/components/shell/status-badge";
import { viagens } from "@/lib/mock-data";
import { formatDate, formatDateTime, cn } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function ViagemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const viagem = viagens.find((v) => v.id === id);
  if (!viagem) return notFound();

  const blocked = viagem.status === "Bloqueada";

  const checklist = [
    { item: "Inspeção visual do compartimento", status: "ok", quando: "08:14" },
    { item: "Validação T-3 das últimas cargas", status: "ok", quando: "08:14" },
    { item: "Aplicação de regime de limpeza", status: blocked ? "fail" : "ok", quando: "08:32" },
    { item: "Foto pré-carregamento com GPS", status: blocked ? "pending" : "ok", quando: "—" },
    { item: "Validação documental (CT-e, manifesto)", status: "ok", quando: "08:44" },
    { item: "Validação de certificação do motorista", status: "ok", quando: "08:46" },
    { item: "Validação de certificação da carreta", status: blocked ? "fail" : "ok", quando: "08:47" },
  ];

  return (
    <div className="space-y-5">
      <Link
        href="/viagens"
        className="inline-flex items-center gap-1.5 text-[12px] text-[hsl(210_14%_42%)] hover:text-[hsl(176_84%_25%)] transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Voltar para viagens
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[12px] font-semibold text-[hsl(210_14%_42%)]">{viagem.codigo}</span>
            <StatusBadge status={viagem.status} />
            <RegimeBadge regime={viagem.regimeLimpeza} />
          </div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[hsl(195_30%_8%)]">
            {viagem.produto} · <span className="num">{viagem.km}</span> km
          </h1>
          <p className="text-[13px] text-[hsl(210_14%_42%)] mt-1.5 max-w-2xl">
            {viagem.origem} → {viagem.destino}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Phone className="size-4" /> Contatar motorista
          </Button>
          <Button variant="outline" size="sm">
            <Download className="size-4" /> Guia
          </Button>
          <Button variant="gradient" size="sm">
            <Sparkles className="size-4" /> Re-validar regras
          </Button>
        </div>
      </div>

      {blocked && (
        <div className="rounded-xl border border-[hsl(0_72%_70%)] bg-[hsl(0_72%_98%)] p-4 flex items-start gap-3 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 size-44 rounded-full bg-gradient-to-br from-[hsl(0_72%_85%_/_0.4)] to-transparent" />
          <div className="relative size-10 rounded-lg bg-[hsl(0_78%_50%)] flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="size-5 text-white" />
          </div>
          <div className="relative flex-1">
            <p className="text-[14px] font-semibold text-[hsl(0_70%_28%)]">Carga bloqueada pelo motor de regras</p>
            <p className="text-[12px] text-[hsl(0_70%_38%)] mt-1 leading-relaxed">
              A última carga registrada para o compartimento <span className="font-mono font-semibold">{viagem.carreta}</span> foi{" "}
              <strong>{viagem.cargasAnteriores[0].produto}</strong> em {formatDate(viagem.cargasAnteriores[0].data)}. A
              IDTF determina regime <strong>D (Desinfecção)</strong> antes do carregamento atual ({viagem.produto}).
              Limpeza correspondente não foi evidenciada.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="destructive" size="sm">
                Bloquear definitivamente
              </Button>
              <Button variant="outline" size="sm">
                Solicitar evidência ao motorista
              </Button>
              <Button variant="ghost" size="sm">
                Liberar sob exceção (requer aprovação)
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="resumo">
            <TabsList>
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="sequenciamento">Sequenciamento T-3</TabsTrigger>
              <TabsTrigger value="checklist">Checklist LCI</TabsTrigger>
              <TabsTrigger value="evidencias">Evidências</TabsTrigger>
              <TabsTrigger value="rastreio">Rastreio</TabsTrigger>
            </TabsList>

            <TabsContent value="resumo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Operação</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Field label="Origem" value={viagem.origem} icon={<MapPin className="size-3.5" />} />
                  <Field label="Destino" value={viagem.destino} icon={<Navigation className="size-3.5" />} />
                  <Field label="Produto" value={viagem.produto} icon={<Package className="size-3.5" />} />
                  <Field label="Distância prevista" value={`${viagem.km} km`} icon={<MapPin className="size-3.5" />} />
                  <Field
                    label="Saída"
                    value={formatDateTime(viagem.iniciadaEm)}
                    icon={<Calendar className="size-3.5" />}
                  />
                  <Field
                    label="Previsão entrega"
                    value={formatDateTime(viagem.previsaoEntrega)}
                    icon={<Calendar className="size-3.5" />}
                  />
                  {viagem.fazendaOrigem && (
                    <Field label="Fazenda origem" value={viagem.fazendaOrigem} icon={<MapPin className="size-3.5" />} />
                  )}
                  {viagem.loteEUDR && (
                    <Field
                      label="Lote EUDR vinculado"
                      value={viagem.loteEUDR}
                      icon={<Shield className="size-3.5" />}
                      mono
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Motorista e veículo</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Field label="Motorista" value={viagem.motorista} icon={<User className="size-3.5" />} />
                  <Field label="CPF" value={viagem.motoristaCpf} icon={<User className="size-3.5" />} mono />
                  <Field label="Cavalo" value={viagem.cavalo} icon={<Truck className="size-3.5" />} mono />
                  <Field
                    label="Carreta"
                    value={viagem.carreta}
                    icon={<ContainerIcon className="size-3.5" />}
                    mono
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sequenciamento">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico T-3 do compartimento {viagem.carreta}</CardTitle>
                  <CardDescription>
                    A última carga determina o regime de limpeza para o próximo carregamento, conforme tabela IDTF do GMP+ FSA.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative pb-4 pl-2">
                    <div className="absolute left-[28px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[hsl(200_18%_88%)] via-[hsl(176_60%_70%)] to-[hsl(176_84%_25%)]" />

                    {viagem.cargasAnteriores.map((carga, i) => (
                      <div key={i} className="relative pl-16 pb-5">
                        <div
                          className={cn(
                            "absolute left-0 top-0 size-12 rounded-xl border-[3px] border-white flex items-center justify-center font-bold text-[11px] shadow-brand-sm",
                            i === 0
                              ? "bg-gradient-to-br from-[hsl(176_84%_28%)] to-[hsl(200_92%_28%)] text-white"
                              : "bg-[hsl(200_18%_94%)] text-[hsl(210_14%_42%)]"
                          )}
                        >
                          T-{i + 1}
                        </div>
                        <div className="bg-white rounded-lg border border-[hsl(200_18%_92%)] p-3">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className="font-semibold text-[14px]">{carga.produto}</span>
                            <RegimeBadge regime={carga.regime as "A" | "B" | "C" | "D"} size="sm" />
                            {i === 0 && (
                              <Badge variant="default" className="text-[9px]">
                                <Zap className="size-2.5" /> Determinante
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-[hsl(210_14%_42%)]">
                            Carregada em {formatDate(carga.data)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Carga atual */}
                    <div className="relative pl-16">
                      <div className="absolute left-0 top-0 size-12 rounded-xl bg-gradient-to-br from-[hsl(176_84%_25%)] to-[hsl(200_92%_28%)] text-white border-[3px] border-white flex items-center justify-center animate-pulse-ring shadow-brand-md">
                        <Truck className="size-5" />
                      </div>
                      <div className="bg-gradient-to-br from-[hsl(174_64%_97%)] to-[hsl(200_60%_97%)] rounded-lg border border-[hsl(176_60%_70%)] p-3">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="font-semibold text-[14px]">{viagem.produto}</span>
                          <RegimeBadge regime={viagem.regimeLimpeza} size="sm" />
                          <Badge variant="secondary" className="text-[9px]">
                            Atual
                          </Badge>
                        </div>
                        <p className="text-[11px] text-[hsl(180_80%_18%)]">
                          Regime <strong>{viagem.regimeLimpeza}</strong> exigido por cruzamento IDTF com a última carga.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-3" />
                  <div className="rounded-lg bg-[hsl(195_30%_8%)] text-white p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-32 rounded-full bg-gradient-to-br from-[hsl(176_84%_45%_/_0.15)] to-transparent blur-2xl" />
                    <div className="relative flex items-start gap-3">
                      <Sparkles className="size-5 text-[hsl(176_84%_55%)] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[12px] font-bold text-white uppercase tracking-wider mb-1">
                          Decisão do motor de regras
                        </p>
                        <p className="text-[13px] text-white/85 leading-relaxed">
                          Regime <strong className="text-[hsl(176_84%_65%)]">{viagem.regimeLimpeza}</strong> aplicado automaticamente.
                          Checklist correspondente foi atribuído ao motorista no app mobile com captura fotográfica e geolocalização.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checklist">
              <Card>
                <CardHeader>
                  <CardTitle>LCI Pré-carregamento</CardTitle>
                  <CardDescription>
                    Itens validados pelo motorista no app mobile. Cada item exige foto com geolocalização e timestamp.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {checklist.map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border",
                        item.status === "ok" && "border-[hsl(142_60%_75%)] bg-[hsl(142_65%_98%)]",
                        item.status === "fail" && "border-[hsl(0_72%_75%)] bg-[hsl(0_72%_98%)]",
                        item.status === "pending" && "border-[hsl(48_95%_75%)] bg-[hsl(48_95%_98%)]"
                      )}
                    >
                      <div
                        className={cn(
                          "size-7 rounded-md flex items-center justify-center shrink-0",
                          item.status === "ok" && "bg-[hsl(142_71%_36%)] text-white",
                          item.status === "fail" && "bg-[hsl(0_78%_50%)] text-white",
                          item.status === "pending" && "bg-[hsl(48_95%_50%)] text-white"
                        )}
                      >
                        {item.status === "ok" && <CheckCircle2 className="size-3.5" />}
                        {item.status === "fail" && <AlertTriangle className="size-3.5" />}
                        {item.status === "pending" && <Clock className="size-3.5" />}
                      </div>
                      <p className="flex-1 text-[13px] font-medium">{item.item}</p>
                      <span className="text-[11px] font-mono text-[hsl(210_14%_42%)] num">{item.quando}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidencias">
              <Card>
                <CardHeader>
                  <CardTitle>Evidências fotográficas</CardTitle>
                  <CardDescription>
                    Capturadas pelo motorista com GPS, timestamp e watermark anti-tampering automático.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-lg border border-[hsl(200_18%_92%)] bg-gradient-to-br from-[hsl(28_30%_75%)] via-[hsl(40_25%_70%)] to-[hsl(30_30%_60%)] flex items-center justify-center relative overflow-hidden group cursor-pointer"
                    >
                      <Camera className="size-7 text-white/60 group-hover:scale-110 transition-transform" />
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md rounded px-1.5 py-0.5 text-[9px] text-white font-mono">
                        FOTO {i + 1}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-1.5 text-[10px] text-white font-mono flex items-center gap-1.5">
                        <MapPin className="size-2.5 text-[hsl(176_84%_55%)]" />
                        -12.534, -55.701
                        <span className="ml-auto">08:{32 + i}:14</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rastreio">
              <Card>
                <CardHeader>
                  <CardTitle>Rastreio em tempo real</CardTitle>
                  <CardDescription>Integração com seguradora de carga e telemetria OEM</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-[hsl(180_14%_94%)] to-[hsl(200_18%_88%)] relative overflow-hidden border border-[hsl(200_18%_92%)]">
                    <svg viewBox="0 0 800 450" className="w-full h-full">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(200 18% 88%)" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="800" height="450" fill="url(#grid)" />
                      <path
                        d="M 100 320 Q 250 280 400 220 T 700 80"
                        stroke="hsl(176 84% 25%)"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="6 3"
                      />
                      <circle cx="100" cy="320" r="10" fill="hsl(176 84% 25%)" />
                      <text x="115" y="325" fontSize="12" fill="hsl(195 30% 8%)" fontWeight="600">
                        Origem · MT
                      </text>
                      <circle cx="450" cy="200" r="14" fill="hsl(200 90% 36%)">
                        <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <text x="470" y="205" fontSize="12" fill="hsl(195 30% 8%)" fontWeight="600">
                        Posição atual · 62% da rota
                      </text>
                      <circle cx="700" cy="80" r="10" fill="hsl(0 78% 50%)" />
                      <text x="610" y="70" fontSize="12" fill="hsl(195 30% 8%)" fontWeight="600">
                        Destino · Santos
                      </text>
                    </svg>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <MetricBox label="Velocidade" value="78 km/h" />
                    <MetricBox label="Restante" value="699 km" />
                    <MetricBox label="Última pos." value="há 2 min" />
                    <MetricBox label="Status seguro" value="Ativo" tone="success" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score de conformidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-5">
                <div className="relative size-32 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(200 18% 92%)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={
                        viagem.conformidade >= 90
                          ? "hsl(142 71% 36%)"
                          : viagem.conformidade >= 70
                          ? "hsl(28 92% 48%)"
                          : "hsl(0 78% 50%)"
                      }
                      strokeWidth="8"
                      strokeDasharray={`${(viagem.conformidade / 100) * 264} 264`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p
                      className={cn(
                        "text-[34px] font-bold num leading-none tracking-tight",
                        viagem.conformidade >= 90
                          ? "text-[hsl(142_71%_24%)]"
                          : viagem.conformidade >= 70
                          ? "text-[hsl(24_88%_32%)]"
                          : "text-[hsl(0_70%_38%)]"
                      )}
                    >
                      {viagem.conformidade}
                    </p>
                    <p className="text-[10px] text-[hsl(210_14%_42%)] uppercase tracking-wider font-semibold mt-0.5">
                      score
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-[hsl(210_14%_42%)] mt-3">
                  {viagem.conformidade >= 90
                    ? "Conformidade alta"
                    : viagem.conformidade >= 70
                    ? "Conformidade média — atenção"
                    : "Conformidade crítica"}
                </p>
              </div>
              <div className="space-y-2">
                <ScoreLine label="Checklist LCI" value={blocked ? 50 : 100} />
                <ScoreLine label="Certificações" value={blocked ? 60 : 100} />
                <ScoreLine label="Documentação" value={100} />
                <ScoreLine label="Foto + GPS" value={blocked ? 0 : 100} />
                <ScoreLine label="Sequenciamento T-3" value={blocked ? 0 : 100} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos gerados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { nome: "Manifesto eletrônico", tipo: "MDF-e" },
                { nome: "Conhecimento de Transporte", tipo: "CT-e" },
                { nome: "Guia GMP+ FSA", tipo: "PDF" },
                { nome: "Checklist LCI assinado", tipo: "PDF" },
                ...(viagem.loteEUDR ? [{ nome: "Vínculo DDS", tipo: "XML" }] : []),
              ].map((doc, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-[hsl(174_64%_97%)] transition-colors text-left"
                >
                  <FileText className="size-3.5 text-[hsl(176_84%_25%)] shrink-0" />
                  <p className="text-[12px] flex-1 truncate">{doc.nome}</p>
                  <Badge variant="outline" className="text-[9px]">
                    {doc.tipo}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linha do tempo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {[
                { t: "08:14", ev: "Viagem criada", a: "Despachante" },
                { t: "08:32", ev: "Motor T-3 executado", a: "Sistema" },
                { t: "08:46", ev: "Motorista designado", a: "Sistema" },
                { t: "09:02", ev: "Checklist LCI iniciado", a: viagem.motorista },
                { t: "09:18", ev: blocked ? "Bloqueio emitido" : "Carregamento liberado", a: "Sistema" },
              ].map((ev, i) => (
                <div key={i} className="flex gap-2.5 text-[12px]">
                  <span className="font-mono text-[hsl(210_14%_42%)] num shrink-0 w-10">{ev.t}</span>
                  <div className="flex-1 border-l border-[hsl(200_18%_92%)] pl-3">
                    <p className="font-medium leading-tight">{ev.ev}</p>
                    <p className="text-[10px] text-[hsl(210_12%_58%)] mt-0.5">{ev.a}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  icon,
  mono,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(210_14%_42%)] font-semibold mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-[hsl(176_84%_25%)] shrink-0">{icon}</span>}
        <span className={cn("text-[13px] font-medium text-[hsl(195_30%_8%)]", mono && "font-mono text-[12px]")}>
          {value}
        </span>
      </div>
    </div>
  );
}

function ScoreLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-[11px]">
        <span className="text-[hsl(210_14%_42%)]">{label}</span>
        <span className="font-bold num">{value}%</span>
      </div>
      <div className="h-1 rounded-full bg-[hsl(200_18%_94%)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${value}%`,
            background:
              value >= 90
                ? "linear-gradient(90deg, hsl(176 84% 30%), hsl(142 71% 36%))"
                : value >= 50
                ? "linear-gradient(90deg, hsl(28 92% 48%), hsl(36 95% 45%))"
                : "linear-gradient(90deg, hsl(0 78% 50%), hsl(0 70% 38%))",
          }}
        />
      </div>
    </div>
  );
}

function MetricBox({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="rounded-md bg-[hsl(200_18%_96%)] p-2.5">
      <p className="text-[10px] text-[hsl(210_14%_42%)] uppercase tracking-wider font-semibold">{label}</p>
      <p
        className={cn(
          "text-[14px] font-bold num mt-0.5",
          tone === "success" && "text-[hsl(142_71%_24%)]"
        )}
      >
        {value}
      </p>
    </div>
  );
}
