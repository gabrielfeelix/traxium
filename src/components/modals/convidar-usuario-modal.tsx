"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

export type Convidado = { nome: string; email: string; papel: string };

const PAPEIS = ["Admin", "Compliance", "Operação", "Auditor (acesso limitado)", "Visualizador"];

export function ConvidarUsuarioModal({
  open, onOpenChange, onInvite,
}: { open: boolean; onOpenChange: (o: boolean) => void; onInvite: (u: Convidado) => void }) {
  const { toast } = useToast();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [papel, setPapel] = useState("Compliance");

  const valido = email.includes("@") && email.includes(".");

  function reset() { setNome(""); setEmail(""); setPapel("Compliance"); }

  function salvar() {
    const u = { nome: nome.trim() || email.split("@")[0], email: email.trim(), papel };
    onInvite(u);
    toast("Convite enviado", { desc: `${u.email} · ${papel}` });
    onOpenChange(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><UserPlus className="size-4 text-[hsl(176_84%_25%)]" /> Convidar usuário</DialogTitle>
          <DialogDescription>Um e-mail de acesso será disparado ao convidado.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-[11px]">Nome (opcional)</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do convidado" className="h-9 mt-1" />
          </div>
          <div>
            <Label className="text-[11px]">E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="pessoa@empresa.com.br" className="h-9 mt-1" />
          </div>
          <div>
            <Label className="text-[11px]">Papel</Label>
            <Select value={papel} onValueChange={setPapel}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{PAPEIS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}><UserPlus className="size-4" /> Enviar convite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
