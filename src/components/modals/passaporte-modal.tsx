"use client";

// Passaporte Feed Safety do Transportador (Gatekeeper §3 — "grande diferencial").
// Transforma formulários, mensagens e arquivos dispersos em uma credencial
// operacional viva: situação cadastral, acordo, treinamento, ativos, ocorrências
// e aptidão — tudo derivado do estado real.

import {
  BadgeCheck, Building2, ShieldCheck, FileSignature, GraduationCap, Truck,
  IdCard, AlertOctagon, CheckCircle2, XCircle, Smartphone, CalendarClock, Download,
  ClipboardCheck, Boxes,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  type Subcontratado, estadoQualificacao, ESTADO_QUALIFICACAO, nivelVencimento,
  implementos, compartimentos, inspectionEvents, cleaningEvents, findCompartimento, ORDEM_REGIME, type Regime,
} from "@/lib/domain/model";
import { naoConformidades } from "@/lib/mock-data";
import { downloadCSV } from "@/lib/export";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatDateTime, cn } from "@/lib/utils";

const TONE_VARIANT = { success: "success", warning: "warning", danger: "destructive", muted: "muted" } as const;

export function PassaporteFeedSafetyModal({ s }: { s: Subcontratado }) {
  const { toast } = useToast();
  const { estado, motivo } = estadoQualificacao(s);
  const meta = ESTADO_QUALIFICACAO[estado];
  const venc = nivelVencimento(s.certGMP.validade);
  const acordoVencido = s.acordo ? nivelVencimento(s.acordo.vigenciaFim).nivel === "vencido" : true;

  // Inspeções dos compartimentos dos implementos desta empresa, mais recentes
  // primeiro. Sai do registro real — empresa sem inspeção mostra vazio.
  const compsDaEmpresa = implementos
    .filter((i) => i.subcontratadoId === s.id)
    .flatMap((i) => compartimentos.filter((c) => c.implementoId === i.id))
    .map((c) => c.id);
  const inspecoes = inspectionEvents
    .filter((i) => compsDaEmpresa.includes(i.compartimentoId))
    .sort((a, b) => b.dataHora.localeCompare(a.dataHora));

  // Regime máximo que a empresa EVIDENCIA manter: o mais alto que ela já
  // executou e registrou nos próprios compartimentos. Sem limpeza registrada
  // não há evidência, e capacidade não se presume.
  const limpezasDaEmpresa = cleaningEvents.filter((c) => compsDaEmpresa.includes(c.compartimentoId));
  const regimeMax: Regime | null = limpezasDaEmpresa.length
    ? limpezasDaEmpresa.reduce<Regime>((a, c) => (ORDEM_REGIME[c.regime] > ORDEM_REGIME[a] ? c.regime : a), "A")
    : null;

  const ocorrencias = naoConformidades.filter(
    (nc) =>
      (nc.veiculo && s.veiculosAutorizados.some((v) => nc.veiculo!.includes(v))) ||
      (nc.motorista && s.motoristasAutorizados.includes(nc.motorista))
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <BadgeCheck className="size-4" /> Passaporte Feed Safety
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-[hsl(176_84%_25%)]" /> Passaporte Feed Safety
          </DialogTitle>
          <DialogDescription>Credencial operacional viva, atualizada a cada transporte.</DialogDescription>
        </DialogHeader>

        {/* Identidade + estado */}
        <div className="rounded-xl border border-[hsl(200_18%_90%)] bg-gradient-to-br from-[hsl(180_14%_98%)] to-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-11 rounded-xl bg-gradient-to-br from-[hsl(176_84%_28%)] to-[hsl(200_92%_28%)] text-white flex items-center justify-center shrink-0">
                <Building2 className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-[hsl(200_25%_12%)] truncate">{s.razaoSocial}</p>
                <p className="font-mono text-[11px] text-[hsl(210_14%_46%)]">{s.cnpj}</p>
                {s.tipoVinculo && (
                  <span className="mt-1 inline-flex items-center rounded-md bg-[hsl(200_18%_94%)] px-1.5 py-0.5 text-[10px] font-semibold text-[hsl(200_25%_30%)]">
                    {s.tipoVinculo}
                  </span>
                )}
              </div>
            </div>
            <Badge variant={TONE_VARIANT[meta.tone]} className="shrink-0">{estado}</Badge>
          </div>
          <div
            className={cn(
              "mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-[12px] leading-snug",
              meta.opera ? "bg-[hsl(142_60%_96%)] text-[hsl(142_64%_28%)]" : "bg-[hsl(0_84%_97%)] text-[hsl(0_70%_38%)]"
            )}
          >
            {meta.opera ? <CheckCircle2 className="size-4 shrink-0 mt-0.5" /> : <AlertOctagon className="size-4 shrink-0 mt-0.5" />}
            <span><strong>{meta.opera ? "Apto a operar." : "Não apto a operar."}</strong> {motivo}</span>
          </div>
        </div>

        {/* Blocos da credencial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Certificação */}
          <Bloco icon={ShieldCheck} titulo="Certificação GMP+">
            <Linha k="Certificado" v={s.certGMP.numero} mono />
            <Linha k="Certificadora" v={s.certGMP.certificadora} />
            <Linha k="Validade" v={`${formatDate(s.certGMP.validade)} · ${venc.nivel === "vencido" ? "vencido" : `D-${venc.dias}`}`} tone={venc.nivel === "vencido" ? "danger" : venc.nivel === "ok" ? "ok" : "warn"} />
            <Linha k="Base pública" v={s.certGMP.statusBasePublica} tone={s.certGMP.statusBasePublica === "Ativo" ? "ok" : "danger"} />
            <div className="mt-1.5 flex flex-wrap gap-1">
              {s.certGMP.escopo.map((e) => (
                <Badge key={e} variant="secondary" className="text-[9px]">{e}</Badge>
              ))}
            </div>
          </Bloco>

          {/* Acordo QA digital */}
          <Bloco icon={FileSignature} titulo="Acordo de Garantia da Qualidade">
            {s.acordo ? (
              <>
                <Linha k="Versão" v={s.acordo.versao} mono />
                <Linha k="Vigência" v={`${formatDate(s.acordo.vigenciaInicio)} – ${formatDate(s.acordo.vigenciaFim)}`} tone={acordoVencido ? "danger" : "ok"} />
                <Linha k="Assinado por" v={s.acordo.assinante ?? "—"} />
                {s.acordo.assinadoEm && (
                  <p className="mt-1 flex items-center gap-1.5 text-[10.5px] text-[hsl(210_14%_48%)]">
                    <CalendarClock className="size-3" /> {formatDateTime(s.acordo.assinadoEm)}
                  </p>
                )}
                {s.acordo.dispositivo && (
                  <p className="flex items-center gap-1.5 text-[10.5px] text-[hsl(210_14%_48%)]">
                    <Smartphone className="size-3" /> {s.acordo.dispositivo}
                  </p>
                )}
              </>
            ) : (
              <p className="text-[12px] text-[hsl(0_70%_42%)]">Acordo não firmado. Envie para assinatura digital antes de liberar.</p>
            )}
          </Bloco>

          {/* Treinamento */}
          <Bloco icon={GraduationCap} titulo="Treinamento GMP+">
            <Check ok={s.treinamento.comprovante} label="Comprovante de treinamento" />
            <Check ok={s.treinamento.quiz} label="Quiz mínimo aprovado" />
            <Check ok={s.treinamento.aceiteRegras} label="Aceite das regras Feed Safety" />
          </Bloco>

          {/* Ativos vinculados */}
          <Bloco icon={Truck} titulo="Ativos e motoristas vinculados">
            <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(210_14%_48%)] font-semibold">Veículos / implementos</p>
            <div className="mb-1.5 flex flex-wrap gap-1">
              {s.veiculosAutorizados.map((v) => (
                <span key={v} className="rounded bg-[hsl(200_18%_95%)] px-1.5 py-0.5 font-mono text-[10.5px] text-[hsl(200_25%_28%)]">{v}</span>
              ))}
            </div>
            <p className="flex items-center gap-1 text-[11px] text-[hsl(210_14%_44%)]">
              <IdCard className="size-3.5" /> {s.motoristasAutorizados.join(", ") || "—"}
            </p>
          </Bloco>
        </div>

        {/* Ocorrências */}
        <div className="rounded-xl border border-[hsl(200_18%_90%)] p-3.5">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[hsl(210_14%_42%)]">
            <AlertOctagon className="size-3.5" /> Ocorrências e reincidências
          </p>
          {ocorrencias.length === 0 ? (
            <p className="text-[12px] text-[hsl(142_64%_30%)]">Sem não conformidades vinculadas aos ativos desta empresa.</p>
          ) : (
            <ul className="space-y-1.5">
              {ocorrencias.map((nc) => (
                <li key={nc.id} className="flex items-center gap-2 text-[12px]">
                  <Badge variant={nc.severidade === "Crítica" ? "destructive" : nc.severidade === "Maior" ? "warning" : "muted"} className="text-[9px] shrink-0">
                    {nc.severidade}
                  </Badge>
                  <span className="font-mono text-[10.5px] text-[hsl(210_14%_48%)] shrink-0">{nc.codigo}</span>
                  <span className="truncate text-[hsl(210_14%_38%)]">{nc.categoria}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Inspeções realizadas — a diretriz lista este bloco no Passaporte e
            ele faltava: sem histórico de inspeção, a credencial afirma
            qualificação sem mostrar a verificação física que a sustenta. */}
        <div className="rounded-xl border border-[hsl(200_18%_90%)] p-3.5">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[hsl(210_14%_42%)]">
            <ClipboardCheck className="size-3.5" /> Inspeções realizadas
          </p>
          {inspecoes.length === 0 ? (
            <p className="text-[12px] text-[hsl(210_14%_46%)]">
              Nenhuma inspeção pré-carregamento registrada nos implementos desta empresa.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {inspecoes.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-center gap-2 text-[12px]">
                  <Badge
                    variant={i.resultado === "aprovado" ? "success" : i.resultado === "reprovado" ? "destructive" : "warning"}
                    className="text-[9px] shrink-0"
                  >
                    {i.resultado}
                  </Badge>
                  <span className="font-mono text-[10.5px] text-[hsl(210_14%_48%)] shrink-0">
                    {findCompartimento(i.compartimentoId)?.identificador ?? i.compartimentoId}
                  </span>
                  <span className="truncate text-[hsl(210_14%_38%)] num">
                    {i.itensOk}/{i.itensTotal} itens · {i.fotos} fotos
                  </span>
                  <span className="ml-auto shrink-0 text-[10.5px] text-[hsl(210_14%_48%)] num">
                    {formatDate(i.dataHora)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Produtos e operações para os quais está apto */}
        <div className="rounded-xl border border-[hsl(200_18%_90%)] p-3.5">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[hsl(210_14%_42%)]">
            <Boxes className="size-3.5" /> Apto para
          </p>
          {!meta.opera ? (
            <p className="text-[12px] text-[hsl(0_70%_38%)]">
              Nada. {estado} — a empresa não opera sob a cadeia certificada até regularizar.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                {s.certGMP.escopo.map((e) => (
                  <Badge key={e} variant="secondary" className="text-[9px]">{e}</Badge>
                ))}
              </div>
              <p className="mt-2 text-[11.5px] text-[hsl(210_14%_42%)] leading-relaxed">
                {regimeMax ? (
                  <>
                    Regime de limpeza mais alto já executado e evidenciado nos compartimentos desta empresa:{" "}
                    <strong className="text-[hsl(200_25%_18%)]">{regimeMax}</strong>. Carga proibida exige
                    procedimento formal de liberação em qualquer caso.
                  </>
                ) : (
                  <>
                    Nenhuma limpeza registrada nos compartimentos desta empresa. A capacidade de executar cada
                    regime não é presumida — é evidenciada.
                  </>
                )}
              </p>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              downloadCSV(
                `passaporte-${s.cnpj.replace(/\D/g, "")}`,
                ["Campo", "Valor"],
                [
                  ["Razão social", s.razaoSocial],
                  ["CNPJ", s.cnpj],
                  ["Tipo de vínculo", s.tipoVinculo ?? "—"],
                  ["Estado de qualificação", estado],
                  ["Motivo", motivo],
                  ["Certificado GMP+", s.certGMP.numero],
                  ["Validade certificado", s.certGMP.validade],
                  ["Base pública", s.certGMP.statusBasePublica],
                  ["Escopo", s.certGMP.escopo.join(" | ")],
                  ["Acordo QA", s.acordo ? `${s.acordo.versao} (${s.acordo.vigenciaInicio}–${s.acordo.vigenciaFim})` : "não firmado"],
                  ["Veículos", s.veiculosAutorizados.join(" | ")],
                  ["Motoristas", s.motoristasAutorizados.join(" | ")],
                  ["Ocorrências vinculadas", String(ocorrencias.length)],
                ]
              );
              toast("Passaporte exportado", { desc: s.razaoSocial });
            }}
          >
            <Download className="size-4" /> Exportar passaporte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Bloco({ icon: Icon, titulo, children }: { icon: React.ComponentType<{ className?: string }>; titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[hsl(200_18%_90%)] p-3.5">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[hsl(210_14%_42%)]">
        <Icon className="size-3.5" /> {titulo}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Linha({ k, v, mono, tone }: { k: string; v: string; mono?: boolean; tone?: "ok" | "warn" | "danger" }) {
  const cor = tone === "danger" ? "text-[hsl(0_70%_42%)]" : tone === "warn" ? "text-[hsl(28_82%_38%)]" : tone === "ok" ? "text-[hsl(142_64%_30%)]" : "text-[hsl(200_25%_20%)]";
  return (
    <div className="flex items-baseline justify-between gap-3 text-[12px]">
      <span className="text-[hsl(210_14%_48%)]">{k}</span>
      <span className={cn("text-right font-medium", mono && "font-mono text-[11px]", cor)}>{v}</span>
    </div>
  );
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 text-[12px]", ok ? "text-[hsl(142_64%_30%)]" : "text-[hsl(0_70%_44%)]")}>
      {ok ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
      {label}
    </div>
  );
}
