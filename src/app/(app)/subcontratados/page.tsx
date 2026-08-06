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
  Archive,
  ArchiveRestore,
  History,
  Bell,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/kit/stat-tile";
import { ExpiryHorizon } from "@/components/kit/expiry-horizon";
import {
  subcontratados, nivelVencimento, estadoQualificacao, ESTADO_QUALIFICACAO,
  veiculosDoSubcontratado, motoristasDoSubcontratado, vinculosDoSubcontratado,
  notificacoesDoSubcontratado, TIPOS_VINCULO, type Subcontratado,
} from "@/lib/domain/model";
import { motoristas } from "@/lib/mock-data";
import { ImportarPlanilhaModal } from "@/components/modals/importar-planilha-modal";
import { AcoesMassaModal } from "@/components/modals/acoes-massa-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const { version, arquivarSubcontratado, desarquivarSubcontratado } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  // Herói conectado ao detalhe: clicar numa linha do horizonte foca o card.
  const [foco, setFoco] = useState<string | null>(null);
  // Filtros (Fase 9.5). Arquivadas ficam FORA por padrão e continuam existindo.
  const [vinculoFiltro, setVinculoFiltro] = useState("todos");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");
  const [verArquivadas, setVerArquivadas] = useState(false);
  const [sel, setSel] = useState<Set<string>>(new Set());

  const q = search.trim().toLowerCase();
  // A busca cobre razão social, CNPJ, placa vinculada, motorista e telefone —
  // o mesmo alcance da busca global (Fase 9.3).
  const casa = (s: Subcontratado) => {
    if (!q) return true;
    const placas = veiculosDoSubcontratado(s.id).join(" ").toLowerCase();
    const nomes = motoristasDoSubcontratado(s.id)
      .map((id) => motoristas.find((m) => m.id === id))
      .map((m) => `${m?.nome ?? ""} ${m?.telefone ?? ""} ${m?.cpf ?? ""}`)
      .join(" ")
      .toLowerCase();
    return (
      s.razaoSocial.toLowerCase().includes(q) ||
      s.cnpj.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
      s.cnpj.includes(q) ||
      placas.includes(q) ||
      nomes.includes(q)
    );
  };

  const lista = subcontratados.filter((s) => {
    if (foco) return s.id === foco;
    if (Boolean(s.arquivadoEm) !== verArquivadas) return false;
    if (vinculoFiltro !== "todos" && s.tipoVinculo !== vinculoFiltro) return false;
    // Período = janela de vigência do certificado, que é o que faz a empresa
    // entrar e sair da operação.
    if (de && s.certGMP.validade < de) return false;
    if (ate && s.certGMP.validade > ate) return false;
    return casa(s);
  });

  const ativas = subcontratados.filter((s) => !s.arquivadoEm);
  const arquivadas = subcontratados.filter((s) => s.arquivadoEm);
  const estados = ativas.map((s) => estadoQualificacao(s).estado);
  const aptos = estados.filter((e) => ESTADO_QUALIFICACAO[e].opera).length;
  const pendentes = estados.filter((e) => e.startsWith("Pendente") || e === "Pré-cadastrado").length;
  const bloqueados = estados.filter((e) => e === "Bloqueado" || e === "Suspenso").length;

  const horizonItems = ativas.map((s) => {
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
                  lista.map((s) => [
                    s.razaoSocial, s.cnpj, s.certGMP.escopo.join(" | "),
                    s.certGMP.validade, s.certGMP.statusBasePublica,
                    veiculosDoSubcontratado(s.id).length, motoristasDoSubcontratado(s.id).length,
                  ])
                );
                toast("CSV exportado", { desc: `${lista.length} subcontratado(s) do filtro atual.` });
              }}
            >
              <Download className="size-4" /> Exportar
            </Button>
            <ImportarPlanilhaModal />
            <OnboardingLinkModal />
            <QualificarSubcontratadoModal />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Building2} label="Cadastradas ativas" value={ativas.length} />
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

      <div className="flex items-end gap-2 flex-wrap">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
          <Input
            placeholder="Razão social, CNPJ, placa, motorista ou telefone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="w-[190px]">
          <Select value={vinculoFiltro} onValueChange={setVinculoFiltro}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo tipo de vínculo</SelectItem>
              {TIPOS_VINCULO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] text-fg-muted">Certificado vence entre</Label>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Input type="date" value={de} onChange={(e) => setDe(e.target.value)} className="h-9 w-[145px]" />
            <Input type="date" value={ate} onChange={(e) => setAte(e.target.value)} className="h-9 w-[145px]" />
          </div>
        </div>
        <Button
          variant={verArquivadas ? "gradient" : "outline"}
          size="sm"
          onClick={() => { setVerArquivadas((v) => !v); setSel(new Set()); setFoco(null); }}
        >
          <Archive className="size-3.5" /> Arquivadas <span className="num">{arquivadas.length}</span>
        </Button>
        {foco && (
          <Button variant="outline" size="sm" onClick={() => setFoco(null)}>
            <XCircle className="size-3.5" /> Limpar foco
          </Button>
        )}
      </div>

      {/* Seleção + operação em massa (Fase 9.4) */}
      {!verArquivadas && lista.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap rounded-xl border border-border bg-bg-elev p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={lista.length > 0 && lista.every((s) => sel.has(s.id))}
              onCheckedChange={() =>
                setSel((atual) =>
                  lista.every((s) => atual.has(s.id)) ? new Set() : new Set(lista.map((s) => s.id))
                )
              }
              aria-label="Selecionar todas as empresas do filtro"
            />
            <span className="text-[12px] font-medium text-fg">
              <span className="num">{sel.size}</span> selecionada(s)
            </span>
          </label>
          <p className="text-[11px] text-fg-muted flex-1 min-w-[200px]">
            Renovação de acordo, atribuição de trilha e alerta — cada uma diz quantas empresas realmente atinge antes
            de executar.
          </p>
          <AcoesMassaModal ids={[...sel]} />
        </div>
      )}

      {lista.length === 0 ? (
        <Card>
          <CardContent className="p-10 flex flex-col items-center gap-2 text-center">
            <Building2 className="size-8 text-fg-soft" />
            <p className="text-[13px] text-fg-muted">
              {verArquivadas ? "Nenhuma empresa arquivada." : "Nenhuma empresa para este filtro."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {lista.map((s) => (
            <SubcontratadoCard
              key={s.id}
              s={s}
              selecionada={sel.has(s.id)}
              onSelecionar={() =>
                setSel((atual) => {
                  const n = new Set(atual);
                  n.has(s.id) ? n.delete(s.id) : n.add(s.id);
                  return n;
                })
              }
              onArquivar={() => {
                const ok = arquivarSubcontratado(s.id, "Encerramento de contrato de transporte.");
                toast(ok ? "Empresa arquivada" : "Não foi possível arquivar", {
                  type: ok ? "info" : "error",
                  desc: ok
                    ? "Sai das listas ativas e os vínculos vigentes são encerrados. Nada é apagado: viagens e dossiês continuam apontando para ela."
                    : "A empresa já estava arquivada.",
                });
                setSel(new Set());
              }}
              onDesarquivar={() => {
                desarquivarSubcontratado(s.id);
                toast("Empresa reativada", {
                  type: "info",
                  desc: "Vínculos encerrados continuam encerrados — o estado volta a ser derivado dos fatos atuais.",
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SubcontratadoCard({
  s,
  selecionada,
  onSelecionar,
  onArquivar,
  onDesarquivar,
}: {
  s: Subcontratado;
  selecionada?: boolean;
  onSelecionar?: () => void;
  onArquivar?: () => void;
  onDesarquivar?: () => void;
}) {
  const venc = nivelVencimento(s.certGMP.validade);
  const { estado, motivo } = estadoQualificacao(s);
  const meta = ESTADO_QUALIFICACAO[estado];
  // Vínculo m:n (Fase 9.1): vigentes e encerrados, os dois visíveis.
  const placas = veiculosDoSubcontratado(s.id);
  const condutores = motoristasDoSubcontratado(s.id);
  const encerrados = vinculosDoSubcontratado(s.id, { incluirEncerrados: true }).filter((v) => v.fim);
  const alertas = notificacoesDoSubcontratado(s.id);

  return (
    <Card className={cn(meta.tone === "danger" && "border-danger-500/40", selecionada && "ring-2 ring-brand-500/40")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {onSelecionar && (
              <Checkbox
                checked={selecionada}
                onCheckedChange={onSelecionar}
                aria-label={`Selecionar ${s.razaoSocial}`}
              />
            )}
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

        {/* Vínculos vigentes — e o passado que não some */}
        <div className="flex items-center gap-4 text-[11px] text-fg-muted flex-wrap">
          <span className="inline-flex items-center gap-1"><Truck className="size-3.5" /> <span className="num">{placas.length}</span> implemento(s)</span>
          <span className="inline-flex items-center gap-1"><IdCard className="size-3.5" /> <span className="num">{condutores.length}</span> motorista(s)</span>
          {encerrados.length > 0 && (
            <span className="inline-flex items-center gap-1 text-fg-soft" title={encerrados.map((v) => `${v.entidadeId}: ${v.inicio} a ${v.fim} — ${v.motivoFim}`).join("\n")}>
              <History className="size-3.5" /> <span className="num">{encerrados.length}</span> encerrado(s)
            </span>
          )}
          {alertas.length > 0 && (
            <span className="inline-flex items-center gap-1 text-warning-700">
              <Bell className="size-3.5" /> <span className="num">{alertas.length}</span> alerta(s) enviado(s)
            </span>
          )}
        </div>
        {s.arquivadoEm && (
          <p className="text-[11px] text-fg-muted rounded-md border border-dashed border-border bg-bg p-2">
            Arquivada em {formatDate(s.arquivadoEm)}. {s.motivoArquivo} O histórico continua: viagens, dossiês e
            vínculos encerrados seguem apontando para esta empresa.
          </p>
        )}

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
          {s.arquivadoEm ? (
            <Button variant="outline" size="sm" className="w-full" onClick={onDesarquivar}>
              <ArchiveRestore className="size-4" /> Reativar cadastro
            </Button>
          ) : (
            onArquivar && (
              <Button variant="ghost" size="sm" className="w-full text-fg-muted" onClick={onArquivar}>
                <Archive className="size-4" /> Arquivar sem apagar histórico
              </Button>
            )
          )}
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
