"use client";

// Consulta de sequenciamento (Fase 8.2).
//
// A página já dizia que "o usuário informa carga anterior e atual e o sistema
// sugere o regime mínimo". Dizia e não fazia — este é o cruzamento de verdade,
// com os nove rótulos operacionais como saída.
//
// O campo do produto atual é texto livre de propósito: é assim que o nome chega
// na ordem de carregamento. Digitar "casquinha" tem que mostrar o que a base
// resolve, e digitar algo que ela não conhece tem que travar, não adivinhar.

import { useState } from "react";
import { Search, CircleCheck, Droplets, FileWarning, Ban, HelpCircle, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegimeBadge } from "@/components/shell/status-badge";
import { produtosIDTF, resolveProdutoPorNome, findProduto, ORDEM_REGIME, type Regime } from "@/lib/domain/model";
import { resultadoIDTF, type ResultadoIDTF } from "@/lib/domain/idtf";
import { cn } from "@/lib/utils";

const SEM_LIMPEZA = "nenhuma";

function icone(r: ResultadoIDTF) {
  if (r.rotulo === "Liberado") return CircleCheck;
  if (r.rotulo.startsWith("Liberado após limpeza")) return Droplets;
  if (r.rotulo === "Necessita procedimento especial") return FileWarning;
  if (r.rotulo === "Carga anterior proibida") return Ban;
  if (r.rotulo === "Produto não identificado") return HelpCircle;
  return Clock;
}

export function ConsultaIDTF() {
  const [anteriorId, setAnteriorId] = useState("p-farelo-soja");
  const [nomeAtual, setNomeAtual] = useState("Soja em grão");
  const [regime, setRegime] = useState<string>(SEM_LIMPEZA);

  const anterior = findProduto(anteriorId);
  const atual = resolveProdutoPorNome(nomeAtual);
  const aplicado = regime === SEM_LIMPEZA ? null : (regime as Regime);
  const resultado = resultadoIDTF({ atual, anterior, regimeAplicado: aplicado });
  const Icon = icone(resultado);
  const exigido = anterior?.regimeAntesDeFeed;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Consulta de sequenciamento</CardTitle>
        <CardDescription>
          Informe a carga anterior do compartimento e o produto a carregar. A base devolve o rótulo operacional — o
          mesmo que o motor aplica na viagem.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-[11px]">Carga anterior (determinante)</Label>
            <Select value={anteriorId} onValueChange={setAnteriorId}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {produtosIDTF.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.nomeCanonico}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {exigido && (
              <p className="text-[10px] text-fg-soft mt-1 inline-flex items-center gap-1">
                Exige <RegimeBadge regime={exigido} size="sm" /> antes de feed
                {anterior?.bloqueiaFeed && <span className="text-danger-700 font-semibold">· proibida</span>}
              </p>
            )}
          </div>

          <div>
            <Label className="text-[11px]" htmlFor="produto-atual">Produto a carregar</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
              <Input
                id="produto-atual"
                value={nomeAtual}
                onChange={(e) => setNomeAtual(e.target.value)}
                placeholder="Como veio na ordem de carregamento…"
                className="pl-9 h-9"
              />
            </div>
            <p className="text-[10px] mt-1">
              {atual ? (
                <span className="text-fg-soft">
                  resolve para <strong className="text-fg">{atual.nomeCanonico}</strong>
                  {atual.idtfCode && <span className="font-mono"> · {atual.idtfCode}</span>}
                </span>
              ) : (
                <span className="text-danger-700">nenhum item da base responde por este nome</span>
              )}
            </p>
          </div>

          <div>
            <Label className="text-[11px]">Limpeza evidenciada</Label>
            <Select value={regime} onValueChange={setRegime}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={SEM_LIMPEZA}>Nenhuma</SelectItem>
                {(["A", "B", "C", "D"] as Regime[]).map((r) => (
                  <SelectItem key={r} value={r}>Regime {r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {exigido && aplicado && (
              <p className="text-[10px] text-fg-soft mt-1">
                {ORDEM_REGIME[aplicado] >= ORDEM_REGIME[exigido]
                  ? "Suficiente para a carga anterior."
                  : `Insuficiente: a carga anterior exige ${exigido}.`}
              </p>
            )}
          </div>
        </div>

        <div
          className={cn(
            "rounded-lg border p-3 flex items-start gap-3",
            resultado.tom === "ok" && "border-success-500/30 bg-success-50/60",
            resultado.tom === "acao" && "border-warning-500/30 bg-warning-50/60",
            resultado.tom === "bloqueio" && "border-danger-500/30 bg-danger-50/60"
          )}
        >
          <Icon
            className={cn(
              "size-5 shrink-0 mt-0.5",
              resultado.tom === "ok" && "text-success-700",
              resultado.tom === "acao" && "text-warning-700",
              resultado.tom === "bloqueio" && "text-danger-700"
            )}
            aria-hidden
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-[10px] uppercase tracking-[0.1em] text-fg-muted font-semibold">
              <span>{anterior?.nomeCanonico ?? "carga anterior"}</span>
              <ArrowRight className="size-3" aria-hidden />
              <span>{atual?.nomeCanonico ?? (nomeAtual || "produto")}</span>
            </div>
            <p
              className={cn(
                "text-[15px] font-bold leading-tight mt-0.5",
                resultado.tom === "ok" && "text-success-700",
                resultado.tom === "acao" && "text-warning-700",
                resultado.tom === "bloqueio" && "text-danger-700"
              )}
            >
              {resultado.rotulo}
            </p>
            <p className="text-[12px] text-fg-muted mt-1 leading-snug">{resultado.motivo}</p>
            {resultado.acao && (
              <p className="text-[11.5px] text-fg mt-1">
                <strong className="font-semibold">Próximo passo:</strong> {resultado.acao}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
