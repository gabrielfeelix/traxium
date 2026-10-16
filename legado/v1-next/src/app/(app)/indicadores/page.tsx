"use client";

// Indicadores do MVP (§8 · Fase 10.3).
//
// A tela existe para responder duas coisas ao mesmo tempo: o que os números
// dizem, e o que ainda não é medido. A segunda parte é a que costuma sumir dos
// painéis — e é a que evita decisão tomada sobre número inventado.

import { Download, Gauge, CircleSlash, Info } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { indicadores, coberturaIndicadores, type Indicador } from "@/lib/domain/indicadores";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { cn } from "@/lib/utils";

export default function IndicadoresPage() {
  const { version } = useSession();
  const { toast } = useToast();
  void version;

  const lista = indicadores();
  const { medidos, total } = coberturaIndicadores();
  const medidosList = lista.filter((i) => i.valor !== null);
  const naoMedidos = lista.filter((i) => i.valor === null);

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Indicadores do MVP"
        description="Os 15 indicadores da diretriz §8, calculados no momento da consulta a partir do store. O que não é medível aparece como não medido, com o que falta para passar a ser."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              downloadCSV(
                "traxium-indicadores",
                ["Indicador", "Pergunta", "Valor", "Unidade", "Medido", "Fonte / por que não medido"],
                lista.map((i) => [
                  i.nome,
                  i.pergunta,
                  i.valor === null ? "não medido" : String(i.valor),
                  i.unidade,
                  i.valor === null ? "não" : "sim",
                  i.valor === null ? i.porqueNaoMedido ?? "" : i.fonte,
                ])
              );
              toast("Indicadores exportados", { desc: `${total} indicadores, ${medidos} medidos.` });
            }}
          >
            <Download className="size-4" /> Exportar
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="size-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Gauge className="size-5" />
            </span>
            <div>
              <p className="text-[22px] font-bold leading-none text-fg num">
                {medidos}<span className="text-fg-soft">/{total}</span>
              </p>
              <p className="text-[11px] text-fg-muted mt-1">indicadores medidos hoje</p>
            </div>
          </div>
          <p className="text-[12px] text-fg-muted flex-1 min-w-[260px] leading-relaxed">
            Os {naoMedidos.length} restantes dependem de telemetria que um protótipo sem backend não tem. Cada um diz o
            que precisaria ser instrumentado — é decisão de arquitetura, não de tela.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {medidosList.map((i) => (
          <CartaoIndicador key={i.id} i={i} />
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CircleSlash className="size-4 text-fg-muted" />
            <CardTitle>Não medidos</CardTitle>
          </div>
          <CardDescription>
            Aparecem aqui em vez de aparecerem com um número plausível. Um indicador estimado é indistinguível de um
            medido depois que entra no slide.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {naoMedidos.map((i) => (
            <div key={i.id} className="rounded-lg border border-dashed border-border bg-bg p-3">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[12.5px] font-semibold text-fg">{i.nome}</p>
                <Badge variant="muted" className="text-[9px]">não medido</Badge>
              </div>
              <p className="text-[11.5px] text-fg-muted mt-0.5">{i.pergunta}</p>
              <p className="text-[11px] text-fg-soft mt-1 leading-relaxed flex items-start gap-1.5">
                <Info className="size-3 shrink-0 mt-0.5" aria-hidden />
                {i.porqueNaoMedido}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CartaoIndicador({ i }: { i: Indicador }) {
  const valor = i.valor ?? 0;
  // A cor lê o sentido do indicador, nunca o contrário: "2 bloqueios técnicos"
  // não é sucesso só porque é um número pequeno.
  const tom =
    i.sentido === "neutro"
      ? "neutro"
      : i.unidade === "%"
      ? (i.sentido === "maior_melhor" ? valor >= 80 : valor <= 20)
        ? "bom"
        : (i.sentido === "maior_melhor" ? valor >= 50 : valor <= 50)
        ? "atencao"
        : "ruim"
      : valor === 0
      ? "bom"
      : "atencao";

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[11.5px] font-semibold text-fg leading-tight">{i.nome}</p>
        <p className="text-[10.5px] text-fg-muted mt-0.5 leading-snug">{i.pergunta}</p>
        <p
          className={cn(
            "text-[26px] font-bold leading-none num mt-2",
            tom === "bom" && "text-success-700",
            tom === "atencao" && "text-warning-700",
            tom === "ruim" && "text-danger-700",
            tom === "neutro" && "text-fg"
          )}
        >
          {valor}
          <span className="text-[13px] font-semibold text-fg-muted ml-0.5">
            {i.unidade === "%" ? "%" : i.unidade === "dias" ? " dias" : ""}
          </span>
        </p>
        <p className="text-[10px] text-fg-soft mt-1.5 leading-snug">{i.fonte}</p>
      </CardContent>
    </Card>
  );
}
