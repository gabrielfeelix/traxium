"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Upload,
  Download,
  Folder,
  MoreHorizontal,
  Check,
  X,
  Award,
  Scale,
  ClipboardList,
  Globe,
  ShieldCheck,
  GraduationCap,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { documentos, type Documento } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { formatDate, cn } from "@/lib/utils";
import { EnviarDocumentoModal } from "@/components/modals/enviar-documento-modal";

type Tipo = Documento["tipo"];
type Aba = "todos" | "vigentes" | "arquivados";

// Ícones da biblioteca do sistema (lucide, DESIGN §9) — nada de emoji decorativo (§10).
const tipoIcon: Record<Tipo, LucideIcon> = {
  Certificado: Award,
  Política: Scale,
  Procedimento: ClipboardList,
  DDS: Globe,
  Auditoria: ShieldCheck,
  Treinamento: GraduationCap,
  Relatório: BarChart3,
};
const TIPOS = Object.keys(tipoIcon) as Tipo[];

export default function DocumentosPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState<Documento[]>(documentos);
  const [tipoFiltro, setTipoFiltro] = useState<Tipo | null>(null);
  const [aba, setAba] = useState<Aba>("todos");
  const [enviarOpen, setEnviarOpen] = useState(false);

  const visible = docs.filter((d) => {
    const mq = d.nome.toLowerCase().includes(search.toLowerCase());
    const mt = !tipoFiltro || d.tipo === tipoFiltro;
    const ms = aba === "todos" ? true : aba === "vigentes" ? d.vigente : !d.vigente;
    return mq && mt && ms;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos"
        description="Repositório central de certificados, políticas, procedimentos, DDS, relatórios de auditoria e materiais de treinamento."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast("Pastas", { type: "info", desc: "Organização por tipo de documento." })}>
              <Folder className="size-4" /> Pastas
            </Button>
            <Button variant="gradient" size="sm" onClick={() => setEnviarOpen(true)}>
              <Upload className="size-4" /> Enviar documento
            </Button>
          </>
        }
      />

      {/* Tira de tipos — filtro real (clique alterna), ícone de sistema em chip de marca */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-2">
        {TIPOS.map((tipo) => {
          const Icon = tipoIcon[tipo];
          const count = docs.filter((d) => d.tipo === tipo).length;
          const isSel = tipoFiltro === tipo;
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => setTipoFiltro(isSel ? null : tipo)}
              aria-pressed={isSel}
              className={cn(
                "rounded-xl border bg-bg-elev p-3 flex flex-col items-center text-center gap-1.5 transition-all hover:shadow-brand-md",
                isSel ? "border-transparent ring-2 ring-brand-500" : "border-border-soft"
              )}
            >
              <span
                className={cn(
                  "size-9 rounded-lg flex items-center justify-center transition-colors",
                  isSel ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700"
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="text-[11px] font-semibold text-fg leading-tight">{tipo}</span>
              <span className="num text-[10px] text-fg-muted">{count}</span>
            </button>
          );
        })}
      </div>

      <Tabs value={aba} onValueChange={(v) => setAba(v as Aba)}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="vigentes">Vigentes</TabsTrigger>
          <TabsTrigger value="arquivados">Arquivados</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
            <Input placeholder="Buscar documento…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          {tipoFiltro && (
            <button
              type="button"
              onClick={() => setTipoFiltro(null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-semibold px-2.5 py-1 hover:bg-brand-100 transition-colors"
            >
              {tipoFiltro}
              <X className="size-3" />
            </button>
          )}
          <span className="ml-auto num text-[11px] text-fg-muted">{visible.length} documento{visible.length === 1 ? "" : "s"}</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-[12px] text-fg-muted">
                    Nenhum documento
                    {tipoFiltro ? ` do tipo ${tipoFiltro}` : ""}
                    {aba !== "todos" ? ` ${aba}` : ""}
                    {search ? ` para “${search}”` : ""}.
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((d) => {
                  const Icon = tipoIcon[d.tipo];
                  return (
                    <TableRow key={d.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className="size-7 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                            <Icon className="size-3.5" />
                          </span>
                          <p className="text-[13px] font-medium text-fg">{d.nome}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{d.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-[11px] text-fg-muted num">{d.tamanho}</TableCell>
                      <TableCell className="text-[12px] text-fg">{d.autor}</TableCell>
                      <TableCell className="text-[11px] text-fg-muted num">{formatDate(d.atualizadoEm)}</TableCell>
                      <TableCell>
                        {d.vigente ? (
                          <Badge variant="success" className="text-[10px]">
                            <Check className="size-2.5" /> Vigente
                          </Badge>
                        ) : (
                          <Badge variant="muted" className="text-[10px]">Arquivado</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => toast(`Baixando ${d.nome}`, { desc: `${d.tipo} · ${d.tamanho}` })}>
                            <Download className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => toast(d.nome, { type: "info", desc: `Autor: ${d.autor}` })}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EnviarDocumentoModal
        open={enviarOpen}
        onOpenChange={setEnviarOpen}
        onUpload={(nd) =>
          setDocs((cur) => [
            { id: `doc-new-${cur.length}`, nome: nd.nome, tipo: nd.tipo, tamanho: nd.tamanho, atualizadoEm: "2026-07-08", autor: "Gabriel Felix", vigente: true },
            ...cur,
          ])
        }
      />
    </div>
  );
}
