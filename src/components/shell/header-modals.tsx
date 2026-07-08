"use client";

import { useState } from "react";
import { User, Settings, Sparkles, Keyboard, LifeBuoy } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";

type CtrlProps = { open: boolean; onOpenChange: (o: boolean) => void };

export function PerfilModal({ open, onOpenChange }: CtrlProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><User className="size-4 text-[hsl(176_84%_25%)]" /> Perfil</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar className="size-14"><AvatarFallback className="bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_30%)] text-white text-lg">GF</AvatarFallback></Avatar>
          <div>
            <p className="text-[15px] font-bold">Gabriel Felix</p>
            <p className="text-[12px] text-[hsl(210_14%_42%)]">gab.feelix@gmail.com</p>
            <p className="text-[11px] text-[hsl(176_84%_25%)] font-semibold mt-0.5">UX · Administrador</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <Info label="Tenant ativo" value="Bom Frete Transportes" />
          <Info label="Papel" value="Administrador" />
          <Info label="Filial" value="Rondonópolis/MT" />
          <Info label="MFA" value="Ativo" />
        </div>
        <DialogFooter><Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Fechar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PreferenciasModal({ open, onOpenChange }: CtrlProps) {
  const { toast } = useToast();
  const [densidade, setDensidade] = useState("confortável");
  const [idioma, setIdioma] = useState("pt-BR");
  const [notifCriticas, setNotifCriticas] = useState(true);
  const [notifVenc, setNotifVenc] = useState(true);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Settings className="size-4 text-[hsl(176_84%_25%)]" /> Preferências</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px]">Idioma</Label>
              <Select value={idioma} onValueChange={setIdioma}><SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="pt-BR">Português (BR)</SelectItem><SelectItem value="en">English</SelectItem></SelectContent></Select>
            </div>
            <div>
              <Label className="text-[11px]">Densidade das tabelas</Label>
              <Select value={densidade} onValueChange={setDensidade}><SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="confortável">Confortável</SelectItem><SelectItem value="compacta">Compacta</SelectItem></SelectContent></Select>
            </div>
          </div>
          {[
            { l: "Alertas de bloqueio crítico", v: notifCriticas, set: setNotifCriticas },
            { l: "Alertas de vencimento (60/30/15d)", v: notifVenc, set: setNotifVenc },
          ].map((t) => (
            <div key={t.l} className="flex items-center justify-between rounded-md border border-[hsl(200_18%_90%)] px-3 h-10">
              <Label className="text-[12px]">{t.l}</Label><Switch checked={t.v} onCheckedChange={t.set} />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="gradient" size="sm" onClick={() => { toast("Preferências salvas"); onOpenChange(false); }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AjudaModal({ open, onOpenChange }: CtrlProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><LifeBuoy className="size-4 text-[hsl(176_84%_25%)]" /> Ajuda e atalhos</DialogTitle>
          <DialogDescription>Navegação rápida do sistema.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {[
            { k: "⌘K", d: "Busca global e ações rápidas" },
            { k: "⌘J", d: "Copilot Traxium" },
            { k: "Esc", d: "Fechar modal / painel" },
          ].map((a) => (
            <div key={a.k} className="flex items-center gap-3 rounded-md border border-[hsl(200_18%_92%)] px-3 py-2">
              <kbd className="inline-flex h-6 items-center rounded border border-[hsl(200_18%_88%)] bg-[hsl(200_18%_97%)] px-2 text-[11px] font-semibold num"><Keyboard className="size-3 mr-1" />{a.k}</kbd>
              <span className="text-[12px]">{a.d}</span>
            </div>
          ))}
        </div>
        <DialogFooter><Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Fechar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CopilotModal({ open, onOpenChange }: CtrlProps) {
  const { toast } = useToast();
  const sugestoes = [
    "Quais compartimentos estão bloqueados agora?",
    "Monte o dossiê das viagens de soja deste mês",
    "Quais certificados vencem em 30 dias?",
    "Explique por que a TX-2026-08472 foi bloqueada",
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="size-4 text-[hsl(176_84%_25%)]" /> Copilot Traxium</DialogTitle>
          <DialogDescription>Assistente de compliance sobre seus dados. (Prévia)</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {sugestoes.map((s) => (
            <button
              key={s}
              onClick={() => { toast("Copilot em breve", { type: "info", desc: "Integração de IA na próxima fase." }); onOpenChange(false); }}
              className="w-full text-left rounded-lg border border-[hsl(200_18%_92%)] px-3 py-2.5 text-[13px] hover:bg-[hsl(174_64%_97%)] hover:border-[hsl(176_60%_60%)] transition-colors"
            >{s}</button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[hsl(200_18%_96%)] p-2">
      <p className="text-[9px] uppercase tracking-[0.1em] text-[hsl(210_12%_58%)] font-semibold">{label}</p>
      <p className="text-[12px] font-medium">{value}</p>
    </div>
  );
}
