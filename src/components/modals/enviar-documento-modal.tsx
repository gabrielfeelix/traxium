"use client";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import type { Documento } from "@/lib/mock-data";

export type NovoDocumento = { nome: string; tipo: Documento["tipo"]; tamanho: string };

const TIPOS: Documento["tipo"][] = ["Certificado", "Relatório", "Política", "Procedimento", "DDS", "Auditoria", "Treinamento"];

const fmtBytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1048576 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1048576).toFixed(1)} MB`;

export function EnviarDocumentoModal({
  open, onOpenChange, onUpload,
}: { open: boolean; onOpenChange: (o: boolean) => void; onUpload: (d: NovoDocumento) => void }) {
  const { toast } = useToast();
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<Documento["tipo"]>("Certificado");
  const [arquivo, setArquivo] = useState("");
  const [tamanho, setTamanho] = useState("");

  const valido = nome.trim() && arquivo;

  function reset() { setNome(""); setTipo("Certificado"); setArquivo(""); setTamanho(""); }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setArquivo(f.name);
    setTamanho(fmtBytes(f.size));
    if (!nome.trim()) setNome(f.name.replace(/\.[^.]+$/, ""));
  }

  function salvar() {
    onUpload({ nome: nome.trim(), tipo, tamanho: tamanho || "—" });
    toast("Documento enviado", { desc: `${nome} · ${tipo} · versionado.` });
    onOpenChange(false); reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Upload className="size-4 text-[hsl(176_84%_25%)]" /> Enviar documento</DialogTitle>
          <DialogDescription>Adicionado ao repositório com versionamento.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-[11px]">Arquivo</Label>
            <label className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-[hsl(200_18%_82%)] px-3 py-3 cursor-pointer hover:border-[hsl(176_60%_60%)] hover:bg-[hsl(174_64%_99%)] transition-colors">
              <FileText className="size-4 text-[hsl(210_14%_42%)] shrink-0" />
              <span className="text-[12px] text-[hsl(210_14%_42%)] truncate">
                {arquivo ? `${arquivo} · ${tamanho}` : "Selecionar arquivo…"}
              </span>
              <input type="file" onChange={onFile} className="hidden" />
            </label>
          </div>
          <div>
            <Label className="text-[11px]">Nome do documento</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Certificado GMP+ 2026" className="h-9 mt-1" />
          </div>
          <div>
            <Label className="text-[11px]">Tipo</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as Documento["tipo"])}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="gradient" size="sm" disabled={!valido} onClick={salvar}><Upload className="size-4" /> Enviar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
