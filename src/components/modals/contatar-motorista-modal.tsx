"use client";

import { useState } from "react";
import { Phone, MessageCircle, PhoneCall } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motoristas } from "@/lib/mock-data";

export function ContatarMotoristaModal({ nome }: { nome: string }) {
  const [open, setOpen] = useState(false);
  const m = motoristas.find((x) => x.nome === nome);
  const tel = m?.telefone ?? "(00) 0 0000-0000";
  const digits = tel.replace(/\D/g, "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Phone className="size-4" /> Contatar motorista</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{nome}</DialogTitle>
          <DialogDescription>{m ? `${m.tipo} · ${m.cidade}/${m.uf}` : "Motorista"} · <span className="font-mono">{tel}</span></DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="gradient" size="sm">
            <a href={`https://wa.me/55${digits}`} target="_blank" rel="noopener"><MessageCircle className="size-4" /> WhatsApp</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={`tel:+55${digits}`}><PhoneCall className="size-4" /> Ligar</a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
