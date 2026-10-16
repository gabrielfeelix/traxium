"use client";

import { useState } from "react";
import {
  Trees,
  Search,
  Download,
  ShieldCheck,
  AlertTriangle,
  Satellite,
  ExternalLink,
  MapPin,
  Layers,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, RiscoBadge } from "@/components/shell/status-badge";
import { StatTile } from "@/components/kit/stat-tile";
import { FazendaMap } from "@/components/map/fazenda-map-dynamic";
import { fazendas } from "@/lib/mock-data";
import { NovaFazendaModal } from "@/components/modals/nova-fazenda-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { cn, formatDate, formatNumber } from "@/lib/utils";

export default function FazendasPage() {
  const { version } = useSession();
  const { toast } = useToast();
  const [selected, setSelected] = useState(fazendas[0]);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const filtered = fazendas.filter((f) =>
    f.nome.toLowerCase().includes(search.toLowerCase())
  );

  const riscoCounts = {
    baixo: fazendas.filter((f) => f.scoreRiscoEUDR === "Baixo").length,
    medio: fazendas.filter((f) => f.scoreRiscoEUDR === "Médio").length,
    alto: fazendas.filter((f) => f.scoreRiscoEUDR === "Alto").length,
    critico: fazendas.filter((f) => f.scoreRiscoEUDR === "Crítico").length,
  };
  const areaTotal = fazendas.reduce((acc, f) => acc + f.areaTotalHa, 0);
  const preservacao = fazendas.reduce((acc, f) => acc + f.areaPreservacaoHa, 0);

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Fazendas e polígonos EUDR"
        description="Polígonos geoespaciais cadastrados. Validação cruzada automática com INPE TerraBrasilis, MapBiomas Alerta e CAR estadual para detectar supressão pós-31/12/2020."
        actions={
          <>
            <NovaFazendaModal trigger="geojson" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadCSV(
                  "traxium-fazendas",
                  ["Nome", "Produtor", "CAR", "Município", "UF", "Área (ha)", "Risco EUDR", "Status"],
                  fazendas.map((f) => [f.nome, f.produtor, f.car, f.cidade, f.uf, f.areaTotalHa, f.scoreRiscoEUDR, f.status])
                );
                toast("CSV exportado", { desc: `${fazendas.length} fazendas.` });
              }}
            >
              <Download className="size-4" /> Exportar
            </Button>
            <NovaFazendaModal />
          </>
        }
      />

      {/* Resumo agregado */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatTile label="Fazendas" value={fazendas.length} hint={`em ${new Set(fazendas.map((f) => f.cidade)).size} municípios`} />
        <StatTile label="Área total" value={`${(areaTotal / 1000).toFixed(1)}k`} hint="hectares" />
        <StatTile label="Preservação" value={`${Math.round((preservacao / areaTotal) * 100)}%`} hint="da área total" tone="success" />
        <div className="lg:col-span-4 grid grid-cols-4 gap-2">
          <RiskCard label="Baixo" value={riscoCounts.baixo} color="hsl(142 71% 36%)" />
          <RiskCard label="Médio" value={riscoCounts.medio} color="hsl(36 95% 50%)" />
          <RiskCard label="Alto" value={riscoCounts.alto} color="hsl(28 92% 48%)" />
          <RiskCard label="Crítico" value={riscoCounts.critico} color="hsl(0 78% 50%)" />
        </div>
      </div>

      {/* Mapa + lista */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-4 flex flex-col" style={{ maxHeight: 680 }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <CardTitle>Polígonos cadastrados</CardTitle>
              <button
                onClick={() => setShowAll((v) => !v)}
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md border transition-colors",
                  showAll
                    ? "border-[hsl(176_84%_25%)] bg-[hsl(174_64%_94%)] text-[hsl(176_84%_25%)]"
                    : "border-border text-fg-muted hover:border-[hsl(176_60%_55%)]"
                )}
              >
                <Layers className="size-3 inline mr-1" />
                {showAll ? "Todas no mapa" : "Mostrar todas"}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-muted" />
              <Input
                placeholder="Buscar fazenda…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
            {filtered.map((f) => {
              const c =
                f.scoreRiscoEUDR === "Baixo"
                  ? "hsl(142 71% 36%)"
                  : f.scoreRiscoEUDR === "Médio"
                  ? "hsl(36 95% 50%)"
                  : f.scoreRiscoEUDR === "Alto"
                  ? "hsl(28 92% 48%)"
                  : "hsl(0 78% 50%)";
              return (
                <button
                  key={f.id}
                  onClick={() => setSelected(f)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all relative overflow-hidden",
                    selected.id === f.id
                      ? "border-[hsl(176_84%_45%)] bg-[hsl(174_64%_97%)] shadow-brand-sm"
                      : "border-border-soft hover:border-[hsl(176_60%_70%)] hover:bg-[hsl(174_64%_99%)]"
                  )}
                >
                  {selected.id === f.id && (
                    <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-gradient-to-b from-[hsl(176_84%_35%)] to-[hsl(200_92%_30%)]" />
                  )}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="size-7 rounded-md shrink-0 mt-0.5 flex items-center justify-center text-white"
                      style={{ background: c }}
                    >
                      <Trees className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-fg truncate">{f.nome}</p>
                        <RiscoBadge risco={f.scoreRiscoEUDR} />
                      </div>
                      <p className="text-[11px] text-fg-muted mt-0.5">
                        {f.cidade}/{f.uf} · <span className="num">{formatNumber(f.areaTotalHa)}</span> ha
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-mono text-fg-muted tracking-tight">
                          {f.car.split("-").slice(-1)[0].slice(0, 8)}…
                        </span>
                        <StatusBadge status={f.status} size="sm" />
                        {f.desmatamentoPos2020 && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[hsl(0_70%_38%)]">
                            <AlertTriangle className="size-2.5" />
                            ALERTA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Mapa */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft">
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight">{selected.nome}</h3>
                <p className="text-[12px] text-fg-muted">
                  {selected.produtor} · {selected.cidade}/{selected.uf} · Centroide <span className="font-mono text-[11px]">{selected.centroide.lat.toFixed(4)}, {selected.centroide.lng.toFixed(4)}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px]">
                  <Satellite className="size-2.5" /> OSM + Esri
                </Badge>
                <Badge variant={selected.desmatamentoPos2020 ? "destructive" : "success"} className="text-[10px]">
                  {selected.desmatamentoPos2020 ? "⚠ Alerta INPE" : "Sem alertas"}
                </Badge>
              </div>
            </div>
            <FazendaMap fazenda={selected} fazendas={fazendas} showAllPolygons={showAll} height={460} />
            <div className="grid grid-cols-3 gap-0 border-t border-border-soft">
              <AreaStat label="Área total" value={`${formatNumber(selected.areaTotalHa)} ha`} />
              <AreaStat label="Produtiva" value={`${formatNumber(selected.areaProdutivaHa)} ha`} accent="warning" />
              <AreaStat label="Preservação" value={`${formatNumber(selected.areaPreservacaoHa)} ha`} accent="success" border={false} />
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="validacao">
        <TabsList>
          <TabsTrigger value="validacao">Validação EUDR</TabsTrigger>
          <TabsTrigger value="info">Cadastro completo</TabsTrigger>
          <TabsTrigger value="historico">Histórico de cargas</TabsTrigger>
          <TabsTrigger value="alertas">Alertas de monitoramento</TabsTrigger>
        </TabsList>

        <TabsContent value="validacao">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className={cn("lg:col-span-2", selected.desmatamentoPos2020 ? "border-[hsl(0_72%_75%)]" : "border-[hsl(142_60%_70%)]")}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-10 rounded-lg flex items-center justify-center",
                      selected.desmatamentoPos2020
                        ? "bg-[hsl(0_72%_94%)] text-[hsl(0_70%_38%)]"
                        : "bg-[hsl(142_65%_93%)] text-[hsl(142_71%_24%)]"
                    )}
                  >
                    {selected.desmatamentoPos2020 ? <AlertTriangle className="size-5" /> : <ShieldCheck className="size-5" />}
                  </div>
                  <div>
                    <CardTitle>
                      {selected.desmatamentoPos2020
                        ? "Supressão detectada pós-31/12/2020"
                        : "Sem indícios de desmatamento pós-31/12/2020"}
                    </CardTitle>
                    <CardDescription>
                      Resultado consolidado de fontes governamentais e satélite
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] text-fg leading-relaxed mb-4">
                  {selected.desmatamentoPos2020
                    ? "INPE PRODES e MapBiomas Alerta indicam supressão de vegetação nativa em parcela aproximada de 18 ha após a data-corte da EUDR. Recomenda-se vistoria documental e análise multispectral antes de incluir esta fazenda em qualquer DDS."
                    : "Polígono validado contra todas as fontes obrigatórias da EUDR e auxiliares brasileiras. Nenhuma sobreposição com alertas de desmatamento, embargos IBAMA ou áreas indígenas/quilombolas."}
                </p>

                <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-semibold mb-2">
                  Fontes consultadas
                </p>
                <div className="space-y-1.5">
                  {[
                    { name: "INPE TerraBrasilis · PRODES", desc: "Dados oficiais de desmatamento Amazônia/Cerrado", on: true },
                    { name: "MapBiomas Alerta", desc: "Validação cruzada de supressão de vegetação", on: true },
                    { name: "CAR · Cadastro Ambiental Rural (MT)", desc: "Validação documental do imóvel rural", on: true },
                    { name: "IBAMA · Áreas embargadas", desc: "Cruzamento com lista oficial", on: true },
                    { name: "FUNAI · Terras indígenas", desc: "Sobreposição com TIs homologadas", on: true },
                    { name: "INCRA · Quilombolas", desc: "Sobreposição com territórios reconhecidos", on: true },
                  ].map((src, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2 rounded-md border border-border-soft bg-white">
                      <Satellite className="size-3.5 text-[hsl(176_84%_25%)] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium">{src.name}</p>
                        <p className="text-[10px] text-fg-muted">{src.desc}</p>
                      </div>
                      <Badge variant="success" className="text-[9px]">Sincronizado</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score detalhado</CardTitle>
                <CardDescription>Dimensões do risco EUDR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { d: "Desmatamento pós-2020", s: selected.desmatamentoPos2020 ? 30 : 96 },
                  { d: "Sobreposição com áreas protegidas", s: 100 },
                  { d: "Regularidade do CAR", s: 92 },
                  { d: "Embargos IBAMA", s: 100 },
                  { d: "Histórico do produtor", s: 88 },
                  { d: "Qualidade do polígono", s: 95 },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-fg-muted">{m.d}</span>
                      <span
                        className={cn(
                          "text-[12px] font-bold num",
                          m.s >= 90 ? "text-[hsl(142_71%_24%)]" : m.s >= 70 ? "text-[hsl(24_88%_32%)]" : "text-[hsl(0_70%_38%)]"
                        )}
                      >
                        {m.s}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-bg overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${m.s}%`,
                          background:
                            m.s >= 90
                              ? "linear-gradient(90deg, hsl(176 84% 30%), hsl(142 71% 36%))"
                              : m.s >= 70
                              ? "linear-gradient(90deg, hsl(36 95% 50%), hsl(24 88% 48%))"
                              : "linear-gradient(90deg, hsl(0 78% 50%), hsl(0 70% 38%))",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 pt-5">
              <DataField label="Produtor" value={selected.produtor} />
              <DataField label="Município" value={`${selected.cidade}/${selected.uf}`} />
              <DataField label="CAR" value={selected.car} mono />
              <DataField label="Status" value={<StatusBadge status={selected.status} size="sm" />} />
              <DataField label="Centroide" value={`${selected.centroide.lat.toFixed(5)}, ${selected.centroide.lng.toFixed(5)}`} mono />
              <DataField label="Vértices" value={`${selected.poligono.length} pontos`} />
              <DataField label="Culturas" value={selected.cultura.join(" · ")} />
              <DataField label="Última verificação" value={formatDate(selected.ultimaVerificacao)} />
              <DataField label="Área total" value={`${formatNumber(selected.areaTotalHa)} ha`} />
              <DataField label="Área produtiva" value={`${formatNumber(selected.areaProdutivaHa)} ha`} />
              <DataField label="Área de preservação" value={`${formatNumber(selected.areaPreservacaoHa)} ha`} />
              <DataField label="% preservação" value={`${Math.round((selected.areaPreservacaoHa / selected.areaTotalHa) * 100)}%`} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Cargas originadas nesta fazenda</CardTitle>
              <CardDescription>Últimos lotes que utilizaram este polígono como origem EUDR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border-soft">
                  <div className="size-9 rounded-md bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_28%)] text-white flex items-center justify-center">
                    <MapPin className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold font-mono">LOT-2026-014{i}</p>
                    <p className="text-[11px] text-fg-muted">
                      Soja em grão · {(1800 - i * 120).toLocaleString("pt-BR")}t · destino UE
                    </p>
                  </div>
                  <Badge variant="success" className="text-[10px]">DDS aprovado</Badge>
                  <p className="text-[11px] text-fg-muted num">há {i * 7}d</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de monitoramento contínuo</CardTitle>
              <CardDescription>Eventos detectados por satélite e fontes oficiais</CardDescription>
            </CardHeader>
            <CardContent>
              {selected.desmatamentoPos2020 ? (
                <div className="rounded-lg border border-[hsl(0_72%_75%)] bg-[hsl(0_72%_98%)] p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="size-5 text-[hsl(0_70%_38%)] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[14px] font-semibold text-[hsl(0_70%_28%)]">
                        Alerta crítico · MapBiomas Alerta 4.2
                      </p>
                      <p className="text-[12px] text-[hsl(0_70%_38%)] mt-1">
                        Detecção de supressão de vegetação nativa de aproximadamente 18.4 ha no quadrante NE do polígono. Imagem Sentinel-2 de 12/05/2026.
                      </p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => window.open("https://plataforma.brasil.mapbiomas.org/alertas", "_blank", "noopener")}>
                        <ExternalLink className="size-3.5" /> Ver no MapBiomas
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <ShieldCheck className="size-8 text-fg-soft" />
                  <p className="text-[13px] text-fg-muted">
                    Nenhum alerta de monitoramento nos últimos 90 dias.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RiskCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-lg border p-3 text-center"
      style={{ borderColor: `${color}55`, background: `${color}0D` }}
    >
      <div className="size-2 rounded-full mx-auto mb-1.5" style={{ background: color }} />
      <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color }}>
        Risco {label}
      </p>
      <p className="text-xl font-bold num mt-0.5" style={{ color: `hsl(from ${color} h s calc(l - 12))` }}>
        {value}
      </p>
    </div>
  );
}

function AreaStat({ label, value, accent, border = true }: { label: string; value: string; accent?: "success" | "warning"; border?: boolean }) {
  return (
    <div className={cn("p-4 text-center", border && "border-r border-border-soft")}>
      <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-fg-muted">{label}</p>
      <p
        className={cn(
          "text-base font-bold num tracking-tight mt-1",
          accent === "success" && "text-[hsl(142_71%_24%)]",
          accent === "warning" && "text-[hsl(24_88%_32%)]"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function DataField({ label, value, mono }: { label: string; value: string | React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.1em] text-fg-muted font-semibold mb-1">{label}</p>
      <div className={cn("text-[13px] font-medium text-fg", mono && "font-mono text-[12px] break-all")}>
        {value}
      </div>
    </div>
  );
}
