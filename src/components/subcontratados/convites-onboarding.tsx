"use client";

import Link from "next/link";
import { Ban, Copy, ExternalLink, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useSession } from "@/lib/store/session";
import {
  convitesOnboarding,
  ESTADO_CONVITE_LABEL,
  type EstadoConvite,
} from "@/lib/domain/onboarding";
import { cn, formatDateTime } from "@/lib/utils";

const TOM: Record<EstadoConvite, string> = {
  nao_enviado: "border-border bg-bg text-fg-muted",
  enviado: "border-brand-200 bg-brand-50 text-brand-800",
  aberto: "border-warning-500/30 bg-warning-50 text-warning-700",
  concluido: "border-success-500/30 bg-success-50 text-success-700",
  expirado: "border-border bg-bg text-fg-soft",
  revogado: "border-danger-500/30 bg-danger-50 text-danger-700",
};

export function ConvitesOnboarding() {
  const { version, moverConviteOnboarding } = useSession();
  const { toast } = useToast();
  void version;

  const pendentes = convitesOnboarding.filter((c) => c.estado !== "concluido" && c.estado !== "expirado" && c.estado !== "revogado").length;

  async function copiar(token: string) {
    const link = `${window.location.origin}/convite/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast("Link copiado", { desc: "Copiar não altera o estado para enviado." });
    } catch {
      toast("Não foi possível copiar o link", { type: "error" });
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Link2 className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Convites de onboarding</CardTitle>
            <Badge variant="secondary" className="text-[9px]"><span className="num">{pendentes}</span> em andamento</Badge>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-fg-muted">
            O convite coleta dados e cria um pré-cadastro. Não cria conta no portal nem libera o transportador para operar.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {convitesOnboarding.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-bg px-4 py-5 text-center">
            <p className="text-[12px] font-medium text-fg">Nenhum convite gerado nesta sessão</p>
            <p className="mt-1 text-[11px] text-fg-muted">Use “Convidar por link” para iniciar um onboarding rastreável.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {convitesOnboarding.slice(0, 5).map((convite) => {
              const encerrado = convite.estado === "concluido" || convite.estado === "expirado" || convite.estado === "revogado";
              return (
                <div key={convite.token} className="flex flex-col gap-3 rounded-lg border border-border-soft p-3 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-fg">{convite.token.slice(0, 8)}</span>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide", TOM[convite.estado])}>
                        {ESTADO_CONVITE_LABEL[convite.estado]}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[11px] text-fg-muted">
                      {convite.destinatario || "Sem destinatário definido"} · {convite.canal} · criado {formatDateTime(convite.criadoEm)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => copiar(convite.token)}>
                      <Copy className="size-3.5" /> Copiar
                    </Button>
                    {!encerrado ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/convite/${convite.token}`}>
                          <ExternalLink className="size-3.5" /> Abrir
                        </Link>
                      </Button>
                    ) : null}
                    {!encerrado ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-700"
                        onClick={() => {
                          if (moverConviteOnboarding(convite.token, "revogar")) toast("Convite revogado", { type: "info" });
                        }}
                      >
                        <Ban className="size-3.5" /> Revogar
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
