"use client";

// Superfície D — Portal do Subcontratado (accountType: subcontractor_admin).
// Tenant-lite escopado SÓ à própria empresa (Souza Transportes · sub-001): NÃO vê
// outros subcontratados, NÃO vê a operação do contratante, sem dado comercial (§2·D1).
// Os motoristas dele usam o App (C); aqui ele prova cert, motoristas e veículos.

import { useState } from "react";
import {
  Building2,
  IdCard,
  Container,
  GraduationCap,
  Share2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Paperclip,
  RefreshCw,
} from "lucide-react";
import { TraxiumLogo } from "@/components/logo";
import { SurfacePerfilMenu } from "@/components/shell/surface-perfil-menu";
import { useToast } from "@/components/ui/toast";
import { useSession } from "@/lib/store/session";
import { findSubcontratado, implementos, nivelVencimento } from "@/lib/domain/model";
import { viagens } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";

const SOUZA_ID = "sub-001";

const VENC_UI: Record<string, string> = {
  ok: "bg-[hsl(142_65%_94%)] text-[hsl(142_71%_28%)]",
  alerta: "bg-[hsl(45_92%_92%)] text-[hsl(38_70%_35%)]",
  alto: "bg-[hsl(38_92%_92%)] text-[hsl(28_70%_35%)]",
  critico: "bg-[hsl(0_80%_95%)] text-[hsl(0_70%_42%)]",
  vencido: "bg-[hsl(0_80%_95%)] text-[hsl(0_70%_42%)]",
};

const NAV = [
  { id: "empresa", label: "Minha empresa", icon: Building2 },
  { id: "motoristas", label: "Meus motoristas autorizados", icon: IdCard },
  { id: "veiculos", label: "Meus veículos / implementos", icon: Container },
  { id: "treinamento", label: "Treinamento", icon: GraduationCap },
  { id: "viagens", label: "Viagens compartilhadas comigo", icon: Share2 },
  { id: "pendencias", label: "Pendências", icon: AlertCircle },
] as const;

export function PortalD() {
  const { toast } = useToast();
  const { version } = useSession();
  void version;
  const [aba, setAba] = useState<(typeof NAV)[number]["id"]>("empresa");

  const souza = findSubcontratado(SOUZA_ID);
  const meusImplementos = implementos.filter((i) => i.subcontratadoId === SOUZA_ID);
  const minhasViagens = souza
    ? viagens.filter((v) => souza.veiculosAutorizados.includes(v.carreta))
    : [];

  // Pendências derivadas honestamente do estado da própria empresa.
  const pendencias: string[] = [];
  if (souza) {
    const nv = nivelVencimento(souza.certGMP.validade).nivel;
    if (nv !== "ok") pendencias.push(`Certificado GMP+ ${nv === "vencido" ? "vencido" : "próximo do vencimento"} (${formatDate(souza.certGMP.validade)}).`);
    if (souza.certGMP.statusBasePublica !== "Ativo") pendencias.push(`Status na base pública: ${souza.certGMP.statusBasePublica}.`);
    if (!souza.treinamento.comprovante) pendencias.push("Comprovante de treinamento pendente.");
    if (!souza.treinamento.quiz) pendencias.push("Quiz de treinamento não concluído.");
    if (!souza.treinamento.aceiteRegras) pendencias.push("Aceite das regras pendente.");
    meusImplementos
      .filter((i) => i.certGMP.status === "Vencida")
      .forEach((i) => pendencias.push(`Implemento ${i.placa}: certificado vencido.`));
  }

  return (
    <div className="flex min-h-screen bg-[hsl(200_20%_96%)]">
      <aside className="hidden md:flex h-screen w-[250px] shrink-0 flex-col bg-white border-r border-[hsl(200_18%_88%)] sticky top-0">
        <div className="px-5 pt-5 pb-4 border-b border-[hsl(200_18%_92%)]">
          <TraxiumLogo />
          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[hsl(200_70%_35%)] font-bold">Portal do subcontratado</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-px">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = aba === item.id;
            const badge = item.id === "pendencias" ? pendencias.length : 0;
            return (
              <button
                key={item.id}
                onClick={() => setAba(item.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-left transition-all",
                  active ? "bg-[hsl(174_64%_96%)] text-[hsl(195_30%_15%)]" : "text-[hsl(210_14%_40%)] hover:bg-[hsl(200_18%_95%)]"
                )}
              >
                <Icon className={cn("size-[15px] shrink-0", active ? "text-[hsl(176_84%_30%)]" : "text-[hsl(210_12%_55%)]")} />
                <span className="truncate">{item.label}</span>
                {badge > 0 && (
                  <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] bg-[hsl(0_78%_50%)] px-1 text-[10px] font-semibold text-white num">{badge}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[hsl(200_18%_92%)] text-[10px] text-[hsl(210_14%_50%)]">Escopo: só a sua empresa</div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-[60px] border-b border-[hsl(200_18%_88%)] bg-white/80 backdrop-blur-xl">
          <div className="flex h-full items-center gap-3 px-6">
            <div className="size-9 rounded-lg bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_28%)] flex items-center justify-center text-white font-bold text-xs">ST</div>
            <div>
              <p className="text-[13px] font-semibold leading-tight">{souza?.razaoSocial ?? "Souza Transportes"}</p>
              <p className="text-[10px] text-[hsl(210_14%_45%)] leading-tight">{souza?.cnpj}</p>
            </div>
            <div className="ml-auto">
              <SurfacePerfilMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 max-w-screen-lg w-full mx-auto space-y-5">
          {!souza ? (
            <p className="text-[13px] text-[hsl(210_14%_45%)]">Empresa não encontrada.</p>
          ) : aba === "empresa" ? (
            <>
              <h1 className="text-[20px] font-bold tracking-[-0.01em]">Minha empresa</h1>
              <div className="rounded-xl border border-[hsl(200_18%_88%)] bg-white p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-[hsl(176_84%_28%)]" />
                  <p className="text-[15px] font-semibold">Certificado GMP+ FSA</p>
                  <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", VENC_UI[nivelVencimento(souza.certGMP.validade).nivel])}>
                    {souza.certGMP.statusBasePublica}
                  </span>
                </div>
                <div className="mt-3 grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
                  <Campo label="Número" valor={souza.certGMP.numero} />
                  <Campo label="Certificadora" valor={souza.certGMP.certificadora} />
                  <Campo label="Escopo" valor={souza.certGMP.escopo.join(", ")} />
                  <Campo label="Validade" valor={formatDate(souza.certGMP.validade)} />
                  <Campo label="Sites cobertos" valor={souza.certGMP.sitesCobertos.join(", ")} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => toast("Solicitação de renovação enviada", { type: "success", desc: "A Traxium acompanha o novo certificado." })} className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(202_45%_12%)] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[hsl(202_45%_18%)]">
                    <RefreshCw className="size-3.5" /> Renovar certificado
                  </button>
                  <button onClick={() => toast("Comprovante anexado (simulado)")} className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(200_18%_85%)] bg-white px-3 py-2 text-[12px] font-semibold hover:border-[hsl(176_60%_55%)]">
                    <Paperclip className="size-3.5" /> Anexar comprovante
                  </button>
                </div>
              </div>
            </>
          ) : aba === "motoristas" ? (
            <>
              <h1 className="text-[20px] font-bold tracking-[-0.01em]">Meus motoristas autorizados</h1>
              <p className="text-[13px] text-[hsl(210_14%_42%)] -mt-3">Escopo validado pela qualificação da sua empresa. Eles operam pelo App do motorista.</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {souza.motoristasAutorizados.map((m) => (
                  <div key={m} className="flex items-center gap-3 rounded-xl border border-[hsl(200_18%_88%)] bg-white p-3.5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[hsl(174_64%_94%)] text-[hsl(180_80%_20%)]"><IdCard className="size-4" /></div>
                    <p className="text-[14px] font-medium">{m}</p>
                    <span className="ml-auto rounded-full bg-[hsl(142_65%_94%)] px-2 py-0.5 text-[10px] font-bold uppercase text-[hsl(142_71%_28%)]">Autorizado</span>
                  </div>
                ))}
              </div>
            </>
          ) : aba === "veiculos" ? (
            <>
              <h1 className="text-[20px] font-bold tracking-[-0.01em]">Meus veículos / implementos</h1>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {meusImplementos.length === 0 && <p className="text-[13px] text-[hsl(210_14%_45%)]">Nenhum implemento vinculado.</p>}
                {meusImplementos.map((i) => (
                  <div key={i.id} className="rounded-xl border border-[hsl(200_18%_88%)] bg-white p-4">
                    <div className="flex items-center gap-2">
                      <Container className="size-4 text-[hsl(210_14%_45%)]" />
                      <p className="text-[14px] font-semibold num">{i.placa}</p>
                      <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", i.certGMP.status === "Válida" ? "bg-[hsl(142_65%_94%)] text-[hsl(142_71%_28%)]" : "bg-[hsl(0_80%_95%)] text-[hsl(0_70%_42%)]")}>{i.certGMP.status}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-[hsl(210_14%_42%)]">{i.tipo} · {i.nCompartimentos} compartimento{i.nCompartimentos === 1 ? "" : "s"}</p>
                    <p className="mt-0.5 text-[11px] text-[hsl(210_14%_48%)]">Cert. válida até {formatDate(i.certGMP.validade)}</p>
                  </div>
                ))}
              </div>
            </>
          ) : aba === "treinamento" ? (
            <>
              <h1 className="text-[20px] font-bold tracking-[-0.01em]">Treinamento</h1>
              <p className="text-[13px] text-[hsl(210_14%_42%)] -mt-3">Comprove que a equipe passou pelas regras de transporte de feed.</p>
              <div className="space-y-2.5">
                {[
                  { k: "comprovante", label: "Comprovante de treinamento anexado", ok: souza.treinamento.comprovante },
                  { k: "quiz", label: "Quiz de conhecimento concluído", ok: souza.treinamento.quiz },
                  { k: "aceiteRegras", label: "Aceite das regras registrado", ok: souza.treinamento.aceiteRegras },
                ].map((t) => (
                  <div key={t.k} className="flex items-center gap-3 rounded-xl border border-[hsl(200_18%_88%)] bg-white p-3.5">
                    {t.ok ? <CheckCircle2 className="size-5 text-[hsl(142_71%_36%)]" /> : <XCircle className="size-5 text-[hsl(0_78%_50%)]" />}
                    <p className="text-[13px] font-medium">{t.label}</p>
                    {!t.ok && (
                      <button onClick={() => toast("Item marcado como comprovado (simulado)")} className="ml-auto rounded-lg border border-[hsl(200_18%_85%)] px-2.5 py-1 text-[11px] font-semibold hover:border-[hsl(176_60%_55%)]">Comprovar</button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : aba === "viagens" ? (
            <>
              <h1 className="text-[20px] font-bold tracking-[-0.01em]">Viagens compartilhadas comigo</h1>
              <p className="text-[13px] text-[hsl(210_14%_42%)] -mt-3">Só as viagens dos seus veículos. Você não vê a operação do contratante.</p>
              <div className="space-y-2.5">
                {minhasViagens.length === 0 && <p className="text-[13px] text-[hsl(210_14%_45%)]">Nenhuma viagem compartilhada no momento.</p>}
                {minhasViagens.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 rounded-xl border border-[hsl(200_18%_88%)] bg-white p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold num">{v.codigo}</p>
                      <p className="truncate text-[12px] text-[hsl(210_14%_42%)]">{v.produto} · {v.carreta} · {v.origem} → {v.destino}</p>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", v.status === "Bloqueada" ? "bg-[hsl(0_80%_95%)] text-[hsl(0_70%_42%)]" : "bg-[hsl(200_18%_93%)] text-[hsl(210_14%_40%)]")}>{v.status}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-[20px] font-bold tracking-[-0.01em]">Pendências</h1>
              {pendencias.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl border border-[hsl(142_60%_80%)] bg-[hsl(142_65%_97%)] p-5">
                  <CheckCircle2 className="size-6 text-[hsl(142_71%_34%)]" />
                  <div>
                    <p className="text-[14px] font-semibold text-[hsl(142_71%_24%)]">Sem pendências</p>
                    <p className="text-[12px] text-[hsl(142_40%_35%)]">Certificado, treinamento e veículos em dia.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendencias.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-[hsl(28_80%_80%)] bg-[hsl(38_92%_96%)] p-3.5">
                      <AlertCircle className="mt-0.5 size-4 shrink-0 text-[hsl(28_88%_42%)]" />
                      <p className="text-[13px] text-[hsl(28_60%_28%)]">{p}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[hsl(210_14%_50%)]">{label}</p>
      <p className="text-[13px] text-[hsl(195_30%_18%)]">{valor}</p>
    </div>
  );
}
