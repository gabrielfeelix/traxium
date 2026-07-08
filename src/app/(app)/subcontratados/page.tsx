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
import { subcontratados, nivelVencimento, type Subcontratado } from "@/lib/domain/model";
import { QualificarSubcontratadoModal } from "@/components/modals/qualificar-subcontratado-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { formatDate, cn } from "@/lib/utils";

export default function SubcontratadosPage() {
  const { version } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const lista = subcontratados.filter(
    (s) => s.razaoSocial.toLowerCase().includes(q) || s.cnpj.includes(q)
  );

  const vencidos = subcontratados.filter((s) => nivelVencimento(s.certGMP.validade).nivel === "vencido").length;
  const aVencer = subcontratados.filter((s) => {
    const n = nivelVencimento(s.certGMP.validade).nivel;
    return n === "critico" || n === "alto" || n === "alerta";
  }).length;

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
            <QualificarSubcontratadoModal />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Building2} label="Cadastrados" value={subcontratados.length} />
        <StatTile icon={ShieldCheck} label="Escopo válido" value={subcontratados.length - vencidos} tone="success" />
        <StatTile icon={AlertTriangle} label="A vencer (≤60d)" value={aVencer} tone="warning" />
        <StatTile icon={ShieldAlert} label="Vencidos / bloqueados" value={vencidos} tone="danger" />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
        <Input
          placeholder="Buscar razão social ou CNPJ…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
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
  const bloqueado = venc.nivel === "vencido" || s.certGMP.statusBasePublica !== "Ativo";

  return (
    <Card className={cn(bloqueado && "border-[hsl(0_72%_80%)]")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-md bg-gradient-to-br from-[hsl(176_84%_28%)] to-[hsl(200_92%_28%)] text-white flex items-center justify-center shrink-0">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate">{s.razaoSocial}</CardTitle>
              <p className="text-[11px] text-fg-muted font-mono">{s.cnpj}</p>
            </div>
          </div>
          {bloqueado ? (
            <Badge variant="destructive" className="text-[9px] shrink-0">Bloqueado</Badge>
          ) : (
            <Badge variant="success" className="text-[9px] shrink-0">Apto</Badge>
          )}
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
            <span className={cn("font-semibold", s.certGMP.statusBasePublica === "Ativo" ? "text-[hsl(142_71%_28%)]" : "text-[hsl(0_70%_45%)]")}>
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

        {bloqueado && (
          <div className="rounded-lg bg-[hsl(0_72%_97%)] border border-[hsl(0_72%_88%)] p-2.5 flex items-start gap-2">
            <ShieldAlert className="size-4 text-[hsl(0_70%_45%)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[hsl(0_70%_38%)]">
              {venc.nivel === "vencido"
                ? `Certificado vencido em ${formatDate(s.certGMP.validade)}. `
                : ""}
              {s.certGMP.statusBasePublica !== "Ativo" ? `Status "${s.certGMP.statusBasePublica}" na base GMP+. ` : ""}
              Carregamento sob cadeia certificada bloqueado até regularização.
            </p>
          </div>
        )}
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
    vencido: { bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]", label: "Vencido" },
    critico: { bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]", label: `${dias}d` },
    alto: { bg: "bg-[hsl(28_92%_92%)]", text: "text-[hsl(24_88%_32%)]", label: `${dias}d` },
    alerta: { bg: "bg-[hsl(48_95%_90%)]", text: "text-[hsl(38_90%_28%)]", label: `${dias}d` },
    ok: { bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]", label: "Válido" },
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
    <span className={cn("inline-flex items-center gap-1", ok ? "text-[hsl(142_71%_28%)]" : "text-[hsl(0_70%_45%)]")}>
      {ok ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
      {label}
    </span>
  );
}
