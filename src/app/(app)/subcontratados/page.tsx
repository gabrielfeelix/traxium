"use client";

import { useState } from "react";
import {
  Building2,
  Search,
  Download,
  ShieldCheck,
  ShieldAlert,
  Truck,
  IdCard,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/kit/stat-tile";
import { ExpiryHorizon } from "@/components/kit/expiry-horizon";
import { subcontratados, nivelVencimento, estadoQualificacao, ESTADO_QUALIFICACAO, type Subcontratado } from "@/lib/domain/model";
import { QualificarSubcontratadoModal } from "@/components/modals/qualificar-subcontratado-modal";
import { PassaporteFeedSafetyModal } from "@/components/modals/passaporte-modal";
import { AssinarAcordoModal } from "@/components/modals/assinar-acordo-modal";
import { OnboardingLinkModal } from "@/components/modals/onboarding-link-modal";

const TONE_VARIANT = { success: "success", warning: "warning", danger: "destructive", muted: "muted" } as const;
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { formatDate, cn } from "@/lib/utils";

export default function SubcontratadosPage() {
  const { version } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  // Herói conectado ao detalhe: clicar numa linha do horizonte foca o card.
  const [foco, setFoco] = useState<string | null>(null);
  const q = search.trim().toLowerCase();
  const lista = subcontratados.filter((s) =>
    foco ? s.id === foco : s.razaoSocial.toLowerCase().includes(q) || s.cnpj.includes(q)
  );

  const estados = subcontratados.map((s) => estadoQualificacao(s).estado);
  const aptos = estados.filter((e) => ESTADO_QUALIFICACAO[e].opera).length;
  const pendentes = estados.filter((e) => e.startsWith("Pendente") || e === "Pré-cadastrado").length;
  const bloqueados = estados.filter((e) => e === "Bloqueado" || e === "Suspenso").length;

  const horizonItems = subcontratados.map((s) => {
    const v = nivelVencimento(s.certGMP.validade);
    return {
      id: s.id,
      rotulo: s.razaoSocial,
      sublabel: s.certGMP.numero,
      validade: s.certGMP.validade,
      dias: v.dias,
      nivel: v.nivel,
    };
  });


  return (
    <div className="space-y-6" data-v={version}>
      <PageHeader
        title="Subcontratados"
        description="Empresas terceiras que transportam sob a cadeia GMP+. A validação confere mais que o CNPJ: escopo (Road Transport of Feed / Affreightment), validade, site coberto, status na base pública, veículos e motoristas autorizados. Certificado vencido bloqueia automaticamente."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadCSV(
                  "traxium-subcontratados",
                  ["Razão social", "CNPJ", "Escopo", "Validade cert.", "Base pública", "Veículos", "Motoristas"],
                  subcontratados.map((s) => [
                    s.razaoSocial, s.cnpj, s.certGMP.escopo.join(" | "),
                    s.certGMP.validade, s.certGMP.statusBasePublica,
                    s.veiculosAutorizados.length, s.motoristasAutorizados.length,
                  ])
                );
                toast("CSV exportado", { desc: `${subcontratados.length} subcontratados.` });
              }}
            >
              <Download className="size-4" /> Exportar
            </Button>
            <OnboardingLinkModal />
            <QualificarSubcontratadoModal />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Building2} label="Cadastrados" value={subcontratados.length} />
        <StatTile icon={ShieldCheck} label="Aptos a operar" value={aptos} tone="success" />
        <StatTile icon={AlertTriangle} label="Pendentes" value={pendentes} tone="warning" />
        <StatTile icon={ShieldAlert} label="Bloqueados / suspensos" value={bloqueados} tone="danger" />
      </div>

      {/* Momento-assinatura: cada certificado contra a janela regulatória de 60 dias. */}
      <ExpiryHorizon
        titulo="Horizonte de vencimento GMP+"
        descricao="Cada certificado contra a janela regulatória: quem cruza a linha dos 60 dias entra em alerta de renovação; vencido bloqueia o carregamento automaticamente. Clique numa linha para focar a empresa."
        items={horizonItems}
        selectedId={foco}
        onSelect={setFoco}
      />

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
          <Input
            placeholder="Buscar razão social ou CNPJ…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        {foco && (
          <Button variant="outline" size="sm" onClick={() => setFoco(null)}>
            <XCircle className="size-3.5" /> Limpar foco
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {lista.map((s) => (
          <SubcontratadoCard key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}

function SubcontratadoCard({ s }: { s: Subcontratado }) {
  const venc = nivelVencimento(s.certGMP.validade);
  const { estado, motivo } = estadoQualificacao(s);
  const meta = ESTADO_QUALIFICACAO[estado];

  return (
    <Card className={cn(meta.tone === "danger" && "border-danger-500/40")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-md bg-gradient-to-br from-brand-600 to-sky-600 text-white flex items-center justify-center shrink-0">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate">{s.razaoSocial}</CardTitle>
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] text-fg-muted font-mono">{s.cnpj}</p>
                {s.tipoVinculo && (
                  <>
                    <span className="text-fg-soft">·</span>
                    <span className="text-[10px] font-medium text-fg-muted">{s.tipoVinculo}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Badge variant={TONE_VARIANT[meta.tone]} className="text-[9px] shrink-0">{estado}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Escopo GMP+ */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-fg-muted font-semibold mb-1.5">Escopo GMP+</p>
          <div className="flex flex-wrap gap-1.5">
            {s.certGMP.escopo.map((e) => (
              <Badge key={e} variant="secondary" className="text-[9px]">{e}</Badge>
            ))}
          </div>
        </div>

        {/* Certificado + validade com alerta */}
        <div className="rounded-lg border border-border-soft p-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.1em] text-fg-muted font-semibold">Certificado</p>
              <p className="text-[12px] font-mono">{s.certGMP.numero}</p>
              <p className="text-[10px] text-fg-soft">{s.certGMP.certificadora}</p>
            </div>
            <VencimentoBadge nivel={venc.nivel} dias={venc.dias} validade={s.certGMP.validade} />
          </div>
        </div>

        {/* Status base pública + site */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Globe className="size-3.5 text-fg-muted" />
            <span className="text-fg-muted">Base pública:</span>
            <span className={cn("font-semibold", s.certGMP.statusBasePublica === "Ativo" ? "text-success-700" : "text-danger-700")}>
              {s.certGMP.statusBasePublica}
            </span>
          </div>
          <div className="text-fg-muted truncate">Sites: {s.certGMP.sitesCobertos.join(", ")}</div>
        </div>

        {/* Autorizados */}
        <div className="flex items-center gap-4 text-[11px] text-fg-muted">
          <span className="inline-flex items-center gap-1"><Truck className="size-3.5" /> {s.veiculosAutorizados.length} veículos</span>
          <span className="inline-flex items-center gap-1"><IdCard className="size-3.5" /> {s.motoristasAutorizados.length} motoristas</span>
        </div>

        {/* Treinamento */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-fg-muted font-semibold mb-1.5 flex items-center gap-1">
            <GraduationCap className="size-3" /> Treinamento
          </p>
          <div className="flex flex-wrap gap-3 text-[11px]">
            <TreinoItem ok={s.treinamento.comprovante} label="Comprovante" />
            <TreinoItem ok={s.treinamento.quiz} label="Quiz mínimo" />
            <TreinoItem ok={s.treinamento.aceiteRegras} label="Aceite das regras" />
          </div>
        </div>

        {!meta.opera && (
          <div
            className={cn(
              "rounded-lg border p-2.5 flex items-start gap-2",
              meta.tone === "danger" ? "bg-danger-50 border-danger-500/30" : "bg-warning-50 border-warning-500/30"
            )}
          >
            <ShieldAlert className={cn("size-4 shrink-0 mt-0.5", meta.tone === "danger" ? "text-danger-500" : "text-warning-600")} />
            <p className={cn("text-[11px]", meta.tone === "danger" ? "text-danger-700" : "text-warning-700")}>{motivo}</p>
          </div>
        )}

        <div className="space-y-2 pt-0.5">
          <AssinarAcordoModal s={s} />
          <PassaporteFeedSafetyModal s={s} />
        </div>
      </CardContent>
    </Card>
  );
}

function VencimentoBadge({
  nivel,
  dias,
  validade,
}: {
  nivel: "vencido" | "critico" | "alto" | "alerta" | "ok";
  dias: number;
  validade: string;
}) {
  const map = {
    vencido: { bg: "bg-danger-50", text: "text-danger-700", label: "Vencido" },
    critico: { bg: "bg-danger-50", text: "text-danger-700", label: `${dias}d` },
    alto: { bg: "bg-warning-50", text: "text-warning-700", label: `${dias}d` },
    alerta: { bg: "bg-warning-50/60", text: "text-warning-700", label: `${dias}d` },
    ok: { bg: "bg-success-50", text: "text-success-700", label: "Válido" },
  }[nivel];
  return (
    <div className="text-right">
      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold", map.bg, map.text)}>
        {map.label}
      </span>
      <p className="text-[10px] text-fg-soft mt-1 num">{formatDate(validade)}</p>
    </div>
  );
}

function TreinoItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", ok ? "text-success-700" : "text-danger-700")}>
      {ok ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
      {label}
    </span>
  );
}
