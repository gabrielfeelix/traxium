"use client";

import Link from "next/link";
import {
  Gavel,
  ShieldAlert,
  UserCog,
  Building,
  Handshake,
  Check,
  X,
  Paperclip,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { excecoes, NIVEL_LABEL, PAPEL_LABEL, podeAprovarExcecao, type Excecao, type Papel } from "@/lib/domain/model";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, cn } from "@/lib/utils";

const MATRIZ = [
  {
    icon: <ShieldAlert className="size-4" />,
    tone: "danger" as const,
    nivel: "Crítico — sem liberação operacional",
    casos: "Carga anterior proibida sem procedimento, compartimento com resíduo/odor/praga, certificado GMP+ vencido, produto não classificado no IDTF, T-3 ausente.",
  },
  {
    icon: <UserCog className="size-4" />,
    tone: "brand" as const,
    nivel: "Gestor GMP+/Qualidade",
    casos: "Divergência documental corrigível, foto reenviada, limpeza feita com comprovante pendente, troca de veículo pré-carregamento, checklist reprovado e corrigido.",
  },
  {
    icon: <Building className="size-4" />,
    tone: "warning" as const,
    nivel: "Diretoria + Resp. Técnico + Qualidade",
    casos: "Exceções com impacto contratual, uso emergencial de terceiro, pendência documental temporária, risco residual formalmente aceito.",
  },
  {
    icon: <Handshake className="size-4" />,
    tone: "info" as const,
    nivel: "Cliente/Embarcador (só escopo comercial)",
    casos: "Pode aceitar atraso ou troca de veículo. NUNCA reduz exigência de segurança de feed nem 'perdoa' contaminação.",
  },
];

export default function ExcecoesPage() {
  const { version, papel, decidirExcecao } = useSession();
  const { toast } = useToast();
  void version;

  const decidir = (e: Excecao, status: "aprovada" | "negada") => {
    const ok = decidirExcecao(e.id, status);
    if (!ok) {
      toast("Sem autoridade para decidir", {
        type: "error",
        desc: `Seu papel (${PAPEL_LABEL[papel]}) não libera exceção que exige ${NIVEL_LABEL[e.nivelRequerido]}.`,
      });
      return;
    }
    toast(status === "aprovada" ? "Exceção aprovada — viagem liberada" : "Bloqueio mantido", {
      type: status === "aprovada" ? "success" : "info",
      desc: status === "aprovada" ? "Trilha de autoridade registrada; viagem destravada." : "Registro na trilha de auditoria.",
    });
  };

  const pendentes = excecoes.filter((e) => e.status === "pendente");
  const decididas = excecoes.filter((e) => e.status !== "pendente");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exceções e liberações"
        description="Quando o motor bloqueia, a liberação segue matriz de autoridade. O motorista nunca libera sozinho — apenas registra ocorrência, anexa evidência e solicita análise. Cada decisão fica na trilha de auditoria."
        accessory={
          <Badge variant="outline" className="text-[10px]">
            <UserCog className="size-3" /> Você: {PAPEL_LABEL[papel]}
          </Badge>
        }
      />

      {/* Matriz de autoridade */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Gavel className="size-4 text-[hsl(176_84%_25%)]" />
            <CardTitle>Matriz de autoridade</CardTitle>
          </div>
          <CardDescription>Quem pode liberar o quê. A severidade define o nível — nunca o tráfego.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MATRIZ.map((m) => (
            <div
              key={m.nivel}
              className={cn(
                "rounded-lg border p-3 flex gap-3",
                m.tone === "danger" && "border-[hsl(0_72%_82%)] bg-[hsl(0_72%_98%)]",
                m.tone === "brand" && "border-[hsl(176_60%_78%)] bg-[hsl(174_64%_98%)]",
                m.tone === "warning" && "border-[hsl(28_92%_82%)] bg-[hsl(36_95%_98%)]",
                m.tone === "info" && "border-[hsl(200_60%_82%)] bg-[hsl(200_60%_98%)]"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-md flex items-center justify-center shrink-0 text-white",
                  m.tone === "danger" && "bg-[hsl(0_78%_50%)]",
                  m.tone === "brand" && "bg-[hsl(176_84%_25%)]",
                  m.tone === "warning" && "bg-[hsl(28_92%_48%)]",
                  m.tone === "info" && "bg-[hsl(200_90%_36%)]"
                )}
              >
                {m.icon}
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[hsl(195_30%_8%)]">{m.nivel}</p>
                <p className="text-[11px] text-[hsl(210_14%_42%)] mt-0.5 leading-relaxed">{m.casos}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fila de pendências */}
      <div>
        <h2 className="text-[13px] font-semibold text-[hsl(195_30%_8%)] mb-2 flex items-center gap-2">
          <Clock className="size-4 text-[hsl(28_92%_48%)]" /> Pendentes de decisão
          <Badge variant="warning" className="num">{pendentes.length}</Badge>
        </h2>
        <div className="space-y-3">
          {pendentes.map((e) => (
            <ExcecaoCard key={e.id} e={e} papel={papel} onDecidir={decidir} />
          ))}
          {!pendentes.length && (
            <Card><CardContent className="p-6 text-center text-[13px] text-[hsl(210_14%_42%)]">Nenhuma exceção pendente.</CardContent></Card>
          )}
        </div>
      </div>

      {/* Decididas */}
      {decididas.length > 0 && (
        <div>
          <h2 className="text-[13px] font-semibold text-[hsl(195_30%_8%)] mb-2">Histórico de decisões</h2>
          <div className="space-y-3">
            {decididas.map((e) => (
              <ExcecaoCard key={e.id} e={e} papel={papel} onDecidir={decidir} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExcecaoCard({ e, papel, onDecidir }: { e: Excecao; papel: Papel; onDecidir: (e: Excecao, s: "aprovada" | "negada") => void }) {
  const critico = e.nivelRequerido === "diretoria_rt";
  const podeDecidir = podeAprovarExcecao(papel, e.nivelRequerido);
  return (
    <Card className={cn(e.status === "pendente" && critico && "border-[hsl(0_72%_82%)]")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Link href={`/viagens/${e.viagemId}`} className="font-mono text-[12px] font-semibold text-[hsl(176_84%_25%)] hover:underline">
                {e.codigoViagem}
              </Link>
              <Badge variant="outline" className="text-[9px]">{e.regra}</Badge>
              <StatusTag status={e.status} />
            </div>
            <p className="text-[13px] text-[hsl(195_30%_8%)]">{e.motivoBloqueio}</p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-wide font-semibold text-[hsl(210_14%_42%)]">Nível exigido:</span>
              <span
                className={cn(
                  "text-[10px] font-bold rounded px-1.5 py-0.5",
                  critico ? "bg-[hsl(0_72%_94%)] text-[hsl(0_70%_38%)]" : "bg-[hsl(174_64%_94%)] text-[hsl(180_80%_18%)]"
                )}
              >
                {NIVEL_LABEL[e.nivelRequerido]}
              </span>
            </div>

            <p className="text-[11px] text-[hsl(210_14%_42%)] mt-1.5">
              Solicitado por {e.solicitante} · {formatDateTime(e.solicitadoEm)}
            </p>

            {e.evidencias.length > 0 && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {e.evidencias.map((ev) => (
                  <span key={ev} className="inline-flex items-center gap-1 text-[10px] text-[hsl(210_14%_42%)] bg-[hsl(200_18%_96%)] rounded px-1.5 py-0.5">
                    <Paperclip className="size-2.5" /> {ev}
                  </span>
                ))}
              </div>
            )}

            {e.observacao && (
              <div className="mt-2 flex items-start gap-1.5 text-[11px] text-[hsl(0_70%_38%)] bg-[hsl(0_72%_98%)] border border-[hsl(0_72%_90%)] rounded-lg p-2">
                <Info className="size-3.5 shrink-0 mt-0.5" /> {e.observacao}
              </div>
            )}

            {e.status !== "pendente" && e.aprovador && (
              <p className="text-[11px] text-[hsl(210_14%_42%)] mt-2">
                {e.status === "aprovada" ? "Aprovada" : "Negada"} por {e.aprovador} · {e.decididoEm && formatDateTime(e.decididoEm)}
              </p>
            )}
          </div>

          {e.status === "pendente" && (
            podeDecidir ? (
              <div className="flex flex-col gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => onDecidir(e, "aprovada")}>
                  <Check className="size-4" /> Aprovar liberação
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDecidir(e, "negada")}>
                  <X className="size-4" /> Manter bloqueio
                </Button>
              </div>
            ) : (
              <div className="shrink-0 max-w-[170px] text-[10px] text-[hsl(210_14%_42%)] flex items-start gap-1.5 bg-[hsl(200_18%_97%)] rounded-md p-2">
                <Lock className="size-3.5 mt-0.5 shrink-0" />
                <span>Requer <strong>{NIVEL_LABEL[e.nivelRequerido]}</strong>. Seu papel não decide esta exceção.</span>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusTag({ status }: { status: Excecao["status"] }) {
  if (status === "aprovada")
    return <Badge variant="success" className="text-[9px]"><CheckCircle2 className="size-2.5" /> Aprovada</Badge>;
  if (status === "negada")
    return <Badge variant="destructive" className="text-[9px]"><XCircle className="size-2.5" /> Bloqueio mantido</Badge>;
  return <Badge variant="warning" className="text-[9px]"><Clock className="size-2.5" /> Pendente</Badge>;
}
