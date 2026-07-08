"use client";

import { useState } from "react";
import { FileText, Search, Upload, Download, Folder, Filter, MoreHorizontal, Calendar, Check } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { documentos, type Documento } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { formatDate } from "@/lib/utils";
import { EnviarDocumentoModal } from "@/components/modals/enviar-documento-modal";

export default function DocumentosPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState<Documento[]>(documentos);
  const [enviarOpen, setEnviarOpen] = useState(false);
  const filtered = docs.filter((d) => d.nome.toLowerCase().includes(search.toLowerCase()));

  const tipoIcon: Record<string, string> = {
    Certificado: "🏆",
    Política: "📋",
    Procedimento: "📑",
    DDS: "🌍",
    Auditoria: "🔍",
    Treinamento: "🎓",
    Relatório: "📊",
  };

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

      <div className="grid grid-cols-2 lg:grid-cols-7 gap-2">
        {Object.keys(tipoIcon).map((tipo) => {
          const count = docs.filter((d) => d.tipo === tipo).length;
          return (
            <Card key={tipo} className="p-3 hover:shadow-md transition-shadow cursor-pointer text-center">
              <div className="text-2xl">{tipoIcon[tipo]}</div>
              <p className="text-[11px] font-semibold mt-1">{tipo}</p>
              <p className="text-[10px] text-[hsl(215_16%_47%)] tabular-nums">{count}</p>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="vigentes">Vigentes</TabsTrigger>
          <TabsTrigger value="arquivados">Arquivados</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[hsl(215_16%_47%)]" />
                <Input placeholder="Buscar documento…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
              </div>
              <Button variant="outline" size="sm" onClick={() => toast("Filtro por tipo", { type: "info" })}>
                <Filter className="size-4" /> Tipo
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast("Filtro por período", { type: "info" })}>
                <Calendar className="size-4" /> Período
              </Button>
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
                  {filtered.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <FileText className="size-4 text-[hsl(174_72%_35%)]" />
                          <p className="text-sm font-medium">{d.nome}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{d.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-[hsl(215_16%_47%)] tabular-nums">{d.tamanho}</TableCell>
                      <TableCell className="text-xs">{d.autor}</TableCell>
                      <TableCell className="text-xs text-[hsl(215_16%_47%)] tabular-nums">{formatDate(d.atualizadoEm)}</TableCell>
                      <TableCell>
                        {d.vigente && (
                          <Badge variant="success" className="text-[10px]">
                            <Check className="size-2.5" /> Vigente
                          </Badge>
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vigentes">
          <Card>
            <CardContent className="pt-6 text-center text-sm text-[hsl(215_16%_47%)]">
              {filtered.filter((d) => d.vigente).length} documentos vigentes no momento.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arquivados">
          <Card>
            <CardContent className="pt-6 text-center text-sm text-[hsl(215_16%_47%)]">
              Nenhum documento arquivado.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
