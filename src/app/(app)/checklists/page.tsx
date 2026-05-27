"use client";

import {
  ClipboardCheck,
  Plus,
  Search,
  FileEdit,
  Copy,
  Trash2,
  CheckCircle2,
  Camera,
  MapPin,
  PenLine,
  Shield,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegimeBadge } from "@/components/shell/status-badge";
import { checklistsTemplates, idtfRules } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function ChecklistsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Checklists LCI"
        description="Templates de Loading Compartment Inspection (GMP+ B4) e regras IDTF que determinam o regime de limpeza por par de cargas."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Copy className="size-4" /> Importar template
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="size-4" /> Novo checklist
            </Button>
          </>
        }
      />

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="idtf">Base IDTF</TabsTrigger>
          <TabsTrigger value="recentes">Execuções recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[hsl(215_16%_47%)]" />
              <Input placeholder="Buscar template…" className="pl-9 h-9" />
            </div>
            <Badge variant="outline">{checklistsTemplates.length} templates</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checklistsTemplates.map((ck) => (
              <Card key={ck.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-lg bg-[hsl(174_64%_96%)] p-2">
                      <ClipboardCheck className="size-5 text-[hsl(174_72%_35%)]" />
                    </div>
                    {ck.regime && <RegimeBadge regime={ck.regime} size="sm" />}
                  </div>
                  <CardTitle className="mt-2">{ck.titulo}</CardTitle>
                  <CardDescription>{ck.tipo}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-[hsl(215_16%_47%)] mb-3">
                    <span>{ck.itens} itens · {ck.obrigatorio ? "Obrigatório" : "Opcional"}</span>
                    <span>{ck.fonteNormativa}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="default" className="text-[10px]">
                      <Camera className="size-2.5" /> Foto
                    </Badge>
                    <Badge variant="default" className="text-[10px]">
                      <MapPin className="size-2.5" /> GPS
                    </Badge>
                    <Badge variant="default" className="text-[10px]">
                      <PenLine className="size-2.5" /> Assinatura
                    </Badge>
                  </div>
                  <p className="text-[10px] text-[hsl(215_16%_60%)] mb-3">
                    Última revisão: {formatDate(ck.ultimaRevisao)}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="flex-1 h-8">
                      <FileEdit className="size-3.5" /> Editar
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <Copy className="size-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="idtf">
          <Card>
            <CardHeader>
              <CardTitle>Base IDTF · Tabela de produtos e regimes</CardTitle>
              <CardDescription>
                International Database Transport for Feed. Determina o regime de limpeza para cada par de cargas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {idtfRules.map((rule) => (
                <div
                  key={rule.produto}
                  className="border border-[hsl(215_20%_92%)] rounded-lg p-4 hover:bg-[hsl(174_64%_98%)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{rule.produto}</p>
                        {rule.hsCode && (
                          <Badge variant="outline" className="text-[10px] font-mono">
                            HS {rule.hsCode}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[hsl(215_16%_47%)] mt-1">{rule.observacoes}</p>
                    </div>
                    <RegimeBadge regime={rule.regimePadrao} />
                  </div>
                  {rule.combinacoesProibidas.length > 0 && (
                    <div className="mt-3 p-2 bg-[hsl(0_72%_98%)] rounded-md border border-[hsl(0_72%_92%)]">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-[hsl(0_72%_40%)] mb-1.5 flex items-center gap-1">
                        <Shield className="size-3" /> Combinações que exigem regime elevado
                      </p>
                      <ul className="space-y-0.5">
                        {rule.combinacoesProibidas.map((c, i) => (
                          <li key={i} className="text-xs text-[hsl(0_72%_30%)]">
                            · {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recentes">
          <Card>
            <CardHeader>
              <CardTitle>Execuções recentes</CardTitle>
              <CardDescription>Últimos checklists preenchidos por motoristas no app mobile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(215_20%_92%)] hover:bg-[hsl(174_64%_98%)]"
                >
                  <div className="rounded-md bg-[hsl(142_71%_95%)] p-2">
                    <CheckCircle2 className="size-4 text-[hsl(142_71%_28%)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">LCI Pré-carregamento · TX-2026-0847{i}</p>
                    <p className="text-[11px] text-[hsl(215_16%_47%)] mt-0.5">
                      Carlos Aparecido · 14 de 14 itens · Conformidade 100%
                    </p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Aprovado
                  </Badge>
                  <span className="text-[11px] text-[hsl(215_16%_47%)] tabular-nums">há {i * 12} min</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
