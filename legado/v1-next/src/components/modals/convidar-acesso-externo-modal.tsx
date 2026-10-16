"use client";

import { useMemo, useState } from "react";
import { Check, Copy, KeyRound, MessageCircle, ShieldOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import {
  convitesAcesso,
  ESTADO_ACESSO_LABEL,
  TIPO_ACESSO_LABEL,
  type TipoAcessoExterno,
} from "@/lib/domain/access";
import { useSession } from "@/lib/store/session";

export function ConvidarAcessoExternoModal({
  tipo,
  entidadeId,
  nome,
  compact = false,
}: {
  tipo: TipoAcessoExterno;
  entidadeId: string;
  nome: string;
  compact?: boolean;
}) {
  const { version, criarConviteAcesso, moverConviteAcesso } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [destinatario, setDestinatario] = useState("");
  const [tokenAtual, setTokenAtual] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const ultimo = useMemo(
    () => convitesAcesso.find((c) => c.token === tokenAtual) ?? convitesAcesso.find((c) => c.tipo === tipo && c.entidadeId === entidadeId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entidadeId, tipo, tokenAtual, version]
  );

  const link = ultimo
    ? `${typeof window === "undefined" ? "" : window.location.origin}/acesso/${ultimo.token}?tipo=${tipo}&nome=${encodeURIComponent(nome)}`
    : "";

  function gerar() {
    const expira = new Date();
    expira.setDate(expira.getDate() + 7);
    const convite = criarConviteAcesso({
      token: crypto.randomUUID(),
      tipo,
      entidadeId,
      nome,
      destinatario: destinatario.trim() || undefined,
      expiraEm: expira.toISOString(),
    });
    setTokenAtual(convite.token);
    setCopiado(false);
  }

  async function copiar() {
    await navigator.clipboard.writeText(link);
    setCopiado(true);
    toast("Link copiado", { desc: "Copiar não marca o convite como enviado." });
  }

  function enviarWhatsapp() {
    if (!ultimo) return;
    moverConviteAcesso(ultimo.token, "enviar");
    const texto = encodeURIComponent(`Olá, ${nome}. Ative seu acesso ao ${TIPO_ACESSO_LABEL[tipo]} da Traxium: ${link}`);
    window.open(`https://wa.me/?text=${texto}`, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={compact ? "h-7 px-2 text-[10px]" : "w-full"}>
          <KeyRound className="size-3.5" /> {compact ? "Convidar para o App" : "Convidar acesso ao portal"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><KeyRound className="size-4 text-brand-700" /> {TIPO_ACESSO_LABEL[tipo]}</DialogTitle>
          <DialogDescription>
            Este convite provisiona login para <strong>{nome}</strong>. Ele é separado do link usado para coletar dados cadastrais.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-[11px]">Telefone ou e-mail do destinatário</Label>
            <Input value={destinatario} onChange={(e) => setDestinatario(e.target.value)} placeholder="(00) 0 0000-0000 ou pessoa@empresa.com" className="mt-1" />
          </div>

          {!ultimo || ultimo.estado === "concluido" || ultimo.estado === "revogado" || ultimo.estado === "expirado" ? (
            <Button variant="gradient" size="sm" onClick={gerar}><KeyRound className="size-4" /> Gerar convite de acesso</Button>
          ) : (
            <div className="space-y-2 rounded-lg border border-border bg-bg p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-[9px]">{ESTADO_ACESSO_LABEL[ultimo.estado]}</Badge>
                <span className="text-[10px] text-fg-muted">expira em {new Date(ultimo.expiraEm).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex gap-2">
                <Input readOnly value={link} className="min-w-0 font-mono text-[10px]" />
                <Button variant="outline" size="icon" onClick={copiar} aria-label="Copiar link">
                  {copiado ? <Check className="size-4 text-success-600" /> : <Copy className="size-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-fg-muted">O estado muda para “Enviado” apenas ao usar um canal de envio.</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {ultimo && ultimo.estado !== "concluido" && ultimo.estado !== "revogado" ? (
            <Button variant="ghost" size="sm" className="text-danger-700" onClick={() => moverConviteAcesso(ultimo.token, "revogar")}>
              <ShieldOff className="size-4" /> Revogar
            </Button>
          ) : <span />}
          <Button variant="gradient" size="sm" disabled={!ultimo || ultimo.estado !== "nao_enviado"} onClick={enviarWhatsapp}>
            <MessageCircle className="size-4" /> Enviar por WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
