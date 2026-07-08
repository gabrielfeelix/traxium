"use client";

// Superfície C — Inspetor de pátio (PLANO-PERFIS §2 · C2). Irmão do motorista:
// mesma linguagem full-screen, mas o objeto é a INSPEÇÃO do compartimento à frente.
// Fluxo: fila de compartimentos → LCI (tri-state + 6 ângulos de foto) → aprovar/reprovar.
// Reprovar é honesto entre superfícies: registra InspectionEvent E abre uma NC que
// aparece no /bloqueios do Gestor.

import { useState } from "react";
import {
  Signal,
  Wifi,
  WifiOff,
  Battery,
  Camera,
  Check,
  X,
  Minus,
  ChevronLeft,
  ClipboardCheck,
  ShieldAlert,
  ThumbsUp,
} from "lucide-react";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { compartimentos, findImplemento, HOJE, PAPEL_LABEL } from "@/lib/domain/model";
import { cn } from "@/lib/utils";

type TriState = "ok" | "na" | "nok" | null;

const ITENS_LCI = [
  "Sem resíduo da carga anterior",
  "Superfície seca, sem umidade",
  "Sem odor estranho ou contaminante",
  "Vedação / tampa / bica íntegras",
  "Sem ferrugem, trinca ou avaria",
];

const ANGULOS = [
  "Visão geral interna",
  "Cantos e frestas",
  "Teto / lona / tampa",
  "Piso / fundo",
  "Descarga / bica / porta",
  "Identificação externa",
];

export function InspetorFlow() {
  const { papel, addInspectionEvent, addNaoConformidade } = useSession();
  const { toast } = useToast();
  const inspetorNome = PAPEL_LABEL[papel];

  const [tela, setTela] = useState<"fila" | "inspecao">("fila");
  const [ativoId, setAtivoId] = useState<string | null>(null);
  const [feitos, setFeitos] = useState<Record<string, "aprovado" | "reprovado">>({});
  const [itens, setItens] = useState<TriState[]>(Array(ITENS_LCI.length).fill(null));
  const [fotos, setFotos] = useState(0);

  const fila = compartimentos.filter((c) => !feitos[c.id]).slice(0, 6);
  const ativo = compartimentos.find((c) => c.id === ativoId);
  const implemento = ativo ? findImplemento(ativo.implementoId) : undefined;

  const abrir = (id: string) => {
    setAtivoId(id);
    setItens(Array(ITENS_LCI.length).fill(null));
    setFotos(0);
    setTela("inspecao");
  };

  const decididos = itens.every((v) => v !== null);
  const temReprova = itens.some((v) => v === "nok");
  const podeAprovar = decididos && !temReprova && fotos >= 6;

  const registrar = (resultado: "aprovado" | "reprovado") => {
    if (!ativo) return;
    const itensOk = itens.filter((v) => v === "ok" || v === "na").length;
    addInspectionEvent({
      compartimentoId: ativo.id,
      resultado,
      itensOk,
      itensTotal: ITENS_LCI.length,
      inspetor: inspetorNome,
      dataHora: `${HOJE}T10:00:00`,
      geo: { lat: -16.47, lng: -54.63 },
      offline: false,
    });
    if (resultado === "reprovado") {
      const reprovados = ITENS_LCI.filter((_, i) => itens[i] === "nok");
      addNaoConformidade({
        codigo: `NC-${1000 + Object.keys(feitos).length + 1}`,
        severidade: "Maior",
        categoria: "Limpeza inadequada",
        veiculo: implemento?.placa,
        descricao: `Inspeção LCI reprovada em ${ativo.identificador}${
          implemento ? ` (${implemento.placa})` : ""
        }: ${reprovados.join("; ")}.`,
        abertaEm: `${HOJE}T10:00:00`,
        status: "Aberta",
        responsavel: inspetorNome,
      });
    }
    setFeitos((f) => ({ ...f, [ativo.id]: resultado }));
    toast(
      resultado === "aprovado" ? "Compartimento aprovado" : "Compartimento reprovado · NC aberta",
      {
        type: resultado === "aprovado" ? "success" : "info",
        desc:
          resultado === "aprovado"
            ? "Inspeção registrada. LCI liberado para carregamento."
            : "Registrada e enviada ao Gestor (aparece em Não conformidades).",
      }
    );
    setTela("fila");
    setAtivoId(null);
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col bg-[hsl(180_14%_97%)] shadow-2xl">
      {/* Barra de status */}
      <div className="flex h-[38px] shrink-0 items-center justify-between px-6 pt-1.5 text-[11px] font-semibold">
        <span className="num flex items-center gap-1">09:42</span>
        <div className="flex items-center gap-1">
          <Signal className="size-3" />
          <Wifi className="size-3" />
          <Battery className="size-3.5" />
        </div>
      </div>

      {tela === "fila" ? (
        <div className="flex-1 overflow-y-auto">
          <div className="bg-gradient-to-br from-[hsl(180_80%_18%)] to-[hsl(200_92%_24%)] p-5 pb-7 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">Inspetor de pátio</p>
            <h1 className="mt-0.5 text-[20px] font-bold tracking-tight">Aguardando inspeção</h1>
            <p className="mt-1 text-[13px] text-white/70">
              {fila.length} compartimento{fila.length === 1 ? "" : "s"} na fila
            </p>
          </div>
          <div className="space-y-2.5 p-4">
            {fila.length === 0 && (
              <div className="rounded-xl border border-dashed border-[hsl(200_18%_82%)] bg-white p-8 text-center text-[13px] text-[hsl(210_14%_45%)]">
                Fila vazia — todas as inspeções do turno foram concluídas.
              </div>
            )}
            {fila.map((c) => {
              const imp = findImplemento(c.implementoId);
              return (
                <button
                  key={c.id}
                  onClick={() => abrir(c.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[hsl(200_18%_90%)] bg-white p-4 text-left shadow-sm active:scale-[0.99] transition-transform"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[hsl(174_64%_94%)] text-[hsl(180_80%_20%)]">
                    <ClipboardCheck className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-[hsl(195_30%_12%)]">{c.identificador}</p>
                    <p className="truncate text-[12px] text-[hsl(210_14%_42%)]">
                      {imp ? `${imp.placa} · ${imp.tipo}` : "Implemento —"} · {c.material}
                    </p>
                  </div>
                  <span className="rounded-full bg-[hsl(38_92%_92%)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[hsl(28_70%_35%)]">
                    LCI
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex items-center gap-2 border-b border-[hsl(200_18%_90%)] bg-white px-4 py-3">
            <button onClick={() => setTela("fila")} className="flex size-8 items-center justify-center rounded-md hover:bg-[hsl(200_18%_94%)]">
              <ChevronLeft className="size-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-tight">{ativo?.identificador}</p>
              <p className="truncate text-[11px] text-[hsl(210_14%_42%)]">{implemento?.placa} · Inspeção LCI pré-carregamento</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 p-4">
            {/* Tri-state itens */}
            <div className="space-y-2">
              {ITENS_LCI.map((label, i) => (
                <div key={i} className="rounded-xl border border-[hsl(200_18%_90%)] bg-white p-3">
                  <p className="mb-2 text-[13px] font-medium text-[hsl(195_30%_15%)]">{label}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    <TriBtn active={itens[i] === "ok"} tone="ok" onClick={() => setItens((a) => a.map((v, j) => (j === i ? "ok" : v)))} icon={<Check className="size-4" />} label="Conforme" />
                    <TriBtn active={itens[i] === "na"} tone="na" onClick={() => setItens((a) => a.map((v, j) => (j === i ? "na" : v)))} icon={<Minus className="size-4" />} label="N/A" />
                    <TriBtn active={itens[i] === "nok"} tone="nok" onClick={() => setItens((a) => a.map((v, j) => (j === i ? "nok" : v)))} icon={<X className="size-4" />} label="Não conf." />
                  </div>
                </div>
              ))}
            </div>

            {/* 6 ângulos de foto */}
            <div className="rounded-xl border border-[hsl(200_18%_90%)] bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[hsl(195_30%_15%)]">Fotos obrigatórias</p>
                <span className={cn("text-[12px] font-bold num", fotos >= 6 ? "text-[hsl(142_71%_30%)]" : "text-[hsl(28_88%_40%)]")}>{fotos}/6</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {ANGULOS.map((a, i) => {
                  const feita = i < fotos;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-center",
                        feita ? "border-[hsl(142_60%_75%)] bg-[hsl(142_65%_97%)]" : "border-dashed border-[hsl(200_18%_85%)] bg-[hsl(200_18%_98%)]"
                      )}
                    >
                      <Camera className={cn("size-4", feita ? "text-[hsl(142_71%_30%)]" : "text-[hsl(210_12%_65%)]")} />
                      <span className="px-1 text-[8px] leading-tight text-[hsl(210_14%_45%)]">{a}</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setFotos((f) => Math.min(6, f + 1))}
                disabled={fotos >= 6}
                className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg bg-[hsl(202_45%_12%)] py-2.5 text-[13px] font-semibold text-white disabled:opacity-40"
              >
                <Camera className="size-4" /> {fotos >= 6 ? "6 ângulos capturados" : "Capturar ângulo (GPS + hora)"}
              </button>
            </div>
          </div>

          {/* Ações */}
          <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-[hsl(200_18%_90%)] bg-white p-3">
            <button
              onClick={() => registrar("reprovado")}
              disabled={!temReprova}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[hsl(0_70%_75%)] bg-[hsl(0_80%_97%)] py-3 text-[14px] font-bold text-[hsl(0_70%_40%)] disabled:opacity-40"
            >
              <ShieldAlert className="size-4" /> Reprovar
            </button>
            <button
              onClick={() => registrar("aprovado")}
              disabled={!podeAprovar}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[hsl(142_71%_32%)] to-[hsl(160_71%_30%)] py-3 text-[14px] font-bold text-white disabled:opacity-40"
            >
              <ThumbsUp className="size-4" /> Aprovar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TriBtn({
  active,
  tone,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  tone: "ok" | "na" | "nok";
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const tones = {
    ok: "border-[hsl(142_60%_70%)] bg-[hsl(142_65%_95%)] text-[hsl(142_71%_28%)]",
    na: "border-[hsl(200_18%_80%)] bg-[hsl(200_18%_95%)] text-[hsl(210_14%_40%)]",
    nok: "border-[hsl(0_70%_75%)] bg-[hsl(0_80%_96%)] text-[hsl(0_70%_42%)]",
  } as const;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-lg border py-2 text-[10px] font-semibold transition-all",
        active ? tones[tone] : "border-[hsl(200_18%_90%)] bg-white text-[hsl(210_12%_55%)] hover:bg-[hsl(200_18%_97%)]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
