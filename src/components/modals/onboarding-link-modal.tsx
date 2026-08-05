"use client";

// Onboarding simplificado do subcontratado (Gatekeeper §3) — convite por link,
// sem instalação obrigatória e sem criação longa de conta. O transportador abre
// o link e informa os próprios dados. Aqui é o lado do escritório que gera o convite.

import { useState } from "react";
import { Link2, Copy, Check, Send, QrCode } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

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
  const [open, setOpen] = useState(false);
  const [tel, setTel] = useState("");
  const [token, setToken] = useState("");
  const [copiado, setCopiado] = useState(false);

  const link = token ? `https://onboarding.traxium.com.br/c/${token}` : "";

  function gerar() {
    // Token gerado sob interação (sem Math.random no render → sem hydration mismatch).
    const t = Array.from({ length: 8 }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");
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
                <a href={waHref()} target="_blank" rel="noopener noreferrer">
                  <Send className="size-4" /> Enviar por WhatsApp
                </a>
              </Button>
              <p className="text-[10.5px] text-[hsl(210_14%_46%)]">Link de demonstração. Também pode ser enviado por SMS ou QR Code impresso no pátio.</p>
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
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
