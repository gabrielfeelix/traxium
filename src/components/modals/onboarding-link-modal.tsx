"use client";

// Onboarding simplificado do subcontratado (Gatekeeper §3) — convite por link,
// sem instalação obrigatória e sem criação longa de conta. O transportador abre
// o link e informa os próprios dados. Aqui é o lado do escritório que gera o convite.

import { useState, useEffect } from "react";
import { Link2, Copy, Check, Send, QrCode } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { QRConvite } from "@/components/gatekeeper/qr-convite";
import { useSession } from "@/lib/store/session";
import { convitesOnboarding, ESTADO_CONVITE_LABEL } from "@/lib/domain/onboarding";

const COLETA = [
  "CPF ou CNPJ",
  "Nome e contatos",
  "CNH e RNTRC (quando aplicável)",
  "Placas do cavalo e implementos",
  "Vínculo com transportadora ou TAC",
  "Três últimas cargas do compartimento (T-3)",
  "Limpezas realizadas",
  "Aceite das regras de Feed Safety",
];

export function OnboardingLinkModal() {
  const { toast } = useToast();
  const { version, criarConviteOnboarding, moverConviteOnboarding } = useSession();
  void version;
  const [open, setOpen] = useState(false);
  const [tel, setTel] = useState("");
  const [validadeDias, setValidadeDias] = useState("7");
  const [token, setToken] = useState("");
  const [copiado, setCopiado] = useState(false);

  // Aponta para a rota pública real deste protótipo — o QR abre o formulário
  // de verdade, em vez de um domínio que não existe.
  const [origem, setOrigem] = useState("");
  useEffect(() => setOrigem(window.location.origin), []);
  const link = token && origem ? `${origem}/convite/${token}` : "";
  const convite = token ? convitesOnboarding.find((c) => c.token === token) : undefined;

  function gerar() {
    // Token gerado sob interação (sem Math.random no render → sem hydration mismatch).
    const t = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
    const expira = new Date();
    expira.setDate(expira.getDate() + Number(validadeDias));
    criarConviteOnboarding({
      token: t,
      destinatario: tel.trim() || undefined,
      canal: tel.trim() ? "WhatsApp" : "Link direto",
      expiraEm: expira.toISOString(),
    });
    setToken(t);
    setCopiado(false);
  }
  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      toast("Link copiado");
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      toast("Não foi possível copiar", { type: "error" });
    }
  }
  const waHref = () => {
    const num = tel.replace(/\D/g, "");
    const texto = encodeURIComponent(`Olá! Para operar sob a cadeia GMP+ da Bom Frete, faça seu cadastro rápido (sem instalar app): ${link}`);
    return num ? `https://wa.me/55${num}?text=${texto}` : `https://wa.me/?text=${texto}`;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setToken(""); setTel(""); } }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Link2 className="size-4" /> Convidar por link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="size-4 text-[hsl(176_84%_25%)]" /> Convidar transportador por link
          </DialogTitle>
          <DialogDescription>Sem instalação e sem conta longa. O transportador abre o link e informa os próprios dados.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-[11px]">Celular do transportador (opcional, para WhatsApp)</Label>
            <Input value={tel} onChange={(e) => setTel(e.target.value)} placeholder="(66) 99999-0000" className="mt-1 h-9" />
          </div>

          {!token ? (
            <Button variant="gradient" size="sm" onClick={gerar} className="w-full">
              <QrCode className="size-4" /> Gerar link de convite
            </Button>
          ) : (
            <div className="rounded-xl border border-[hsl(176_60%_75%)] bg-[hsl(174_64%_98%)] p-3 space-y-2.5">
              <div className="flex items-center gap-2">
                <Input readOnly value={link} className="h-9 font-mono text-[11px]" />
                <Button variant="outline" size="icon" onClick={copiar} title="Copiar link">
                  {copiado ? <Check className="size-4 text-[hsl(142_71%_36%)]" /> : <Copy className="size-4" />}
                </Button>
              </div>
              <Button variant="gradient" size="sm" asChild className="w-full">
                <a
                  href={waHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => moverConviteOnboarding(token, "enviar")}
                >
                  <Send className="size-4" /> {convite?.estado === "nao_enviado" ? "Enviar por WhatsApp" : "Abrir WhatsApp novamente"}
                </a>
              </Button>
              {convite ? (
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-fg-muted">
                  <span>Estado: <strong className="text-fg">{ESTADO_CONVITE_LABEL[convite.estado]}</strong></span>
                  <span>Expira em {convite.expiraEm ? new Date(convite.expiraEm).toLocaleDateString("pt-BR") : "—"}</span>
                </div>
              ) : null}
              <div className="flex items-start gap-3 pt-1">
                {link && <QRConvite url={link} size={112} />}
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-[hsl(180_80%_18%)]">QR para o pátio</p>
                  <p className="mt-0.5 text-[10.5px] leading-relaxed text-[hsl(210_14%_46%)]">
                    Imprima e afixe na portaria. O motorista aponta a câmera e cai direto no formulário — sem
                    instalar nada, sem criar conta.
                  </p>
                  <p className="mt-1 text-[10.5px] text-[hsl(210_14%_46%)]">Também pode ser enviado por SMS.</p>
                  <p className="mt-1 text-[10.5px] text-[hsl(210_14%_46%)]">Copiar o link não marca o convite como enviado; o envio pelo WhatsApp marca.</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(210_14%_42%)]">O transportador informa</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              {COLETA.map((c) => (
                <li key={c} className="flex items-center gap-1.5 text-[12px] text-[hsl(210_14%_38%)]">
                  <Check className="size-3 text-[hsl(176_84%_30%)] shrink-0" /> {c}
                </li>
              ))}
            </ul>
          </div>

          {!token ? (
            <div>
              <Label className="text-[11px]">Validade do convite</Label>
              <div className="mt-1.5 flex gap-2">
                {["3", "7", "14"].map((dias) => (
                  <button
                    key={dias}
                    type="button"
                    onClick={() => setValidadeDias(dias)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-[12px] font-semibold ${
                      validadeDias === dias ? "border-brand-500 bg-brand-50 text-brand-800" : "border-border bg-bg-elev text-fg-muted"
                    }`}
                  >
                    {dias} dias
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
