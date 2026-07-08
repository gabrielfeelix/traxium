"use client";

import { useState } from "react";
import { Search, Download, Ban, Clock, ArrowRight, Info, Tag, X } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RegimeBadge } from "@/components/shell/status-badge";
import { RegimeMatrix } from "@/components/idtf/regime-matrix";
import { produtosIDTF, VERSAO_BASE_IDTF, type ProdutoIDTF, type Regime } from "@/lib/domain/model";
import { ClassificarIDTFModal } from "@/components/modals/classificar-idtf-modal";
import { NovoProdutoModal } from "@/components/modals/novo-produto-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";

const categoriaLabel: Record<ProdutoIDTF["categoria"], string> = {
  feed: "Feed",
  feed_material: "Feed material",
  risco: "Risco",
  proibido: "Proibido",
};

const regimeNome: Record<Regime, string> = {
  A: "A · Seco",
  B: "B · Água",
  C: "C · Detergente",
  D: "D · Desinfecção",
};

export default function IDTFPage() {
  const { version } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [regimeFiltro, setRegimeFiltro] = useState<Regime | null>(null);
  const q = search.trim().toLowerCase();

  const classificados = produtosIDTF.filter(
    (p) => p.statusClassificacao === "classificado" || p.statusClassificacao === "proibido"
  );
  const emFila = produtosIDTF.filter((p) => p.statusClassificacao === "em_fila");

  const baseFiltrada = classificados.filter((p) => {
    const matchQ =
      p.nomeCanonico.toLowerCase().includes(q) ||
      p.alias.some((a) => a.toLowerCase().includes(q)) ||
      (p.idtfCode?.toLowerCase().includes(q) ?? false);
    const matchR = regimeFiltro === null || p.regimeAntesDeFeed === regimeFiltro;
    return matchQ && matchR;
  });

  return (
    <div className="space-y-6" data-v={version}>
      <PageHeader
        title="Motor IDTF"
        description="A IDTF opera como motor de regra, não como PDF anexado. O usuário informa carga anterior e atual; o sistema sugere o regime mínimo e bloqueia carga proibida ou não classificada. Toda decisão guarda a versão da base."
        accessory={<Badge variant="outline" className="font-mono text-[10px]">{VERSAO_BASE_IDTF}</Badge>}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadCSV(
                  "traxium-base-idtf",
                  ["Produto", "Alias", "HS", "Categoria", "Regime antes de feed", "Proibido", "Status", "Versão"],
                  produtosIDTF.map((p) => [
                    p.nomeCanonico,
                    p.alias.join(" | "),
                    p.hsCode ?? "",
                    p.categoria,
                    p.regimeAntesDeFeed,
                    p.bloqueiaFeed ? "sim" : "não",
                    p.statusClassificacao,
                    p.versaoBase,
                  ])
                );
                toast("Base IDTF exportada", { desc: `${produtosIDTF.length} produtos.` });
              }}
            >
              <Download className="size-4" /> Exportar base
            </Button>
            <NovoProdutoModal />
          </>
        }
      />

      {/* Momento-assinatura — a matriz de sequenciamento é o herói da página */}
      <RegimeMatrix produtos={classificados} selected={regimeFiltro} onSelect={setRegimeFiltro} />

      {/* Fila de classificação — bloqueia uso até análise da qualidade */}
      {emFila.length > 0 && (
        <Card className="border-[hsl(28_92%_80%)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="size-7 rounded-md bg-warning-50 text-warning-700 flex items-center justify-center">
                <Clock className="size-4" />
              </span>
              <div>
                <CardTitle>Fila de classificação</CardTitle>
                <CardDescription>
                  Produtos não reconhecidos pela base. Uso bloqueado até a qualidade classificar e definir regime.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {emFila.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(28_92%_85%)] bg-[hsl(36_95%_98%)]"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-semibold">{p.nomeCanonico}</p>
                    <Badge variant="warning" className="text-[9px]">aguardando análise</Badge>
                    <Badge variant="outline" className="text-[9px]">{categoriaLabel[p.categoria]}</Badge>
                  </div>
                  <p className="text-[11px] text-fg-muted mt-0.5">
                    Alias: {p.alias.join(" · ")}
                    {p.hsCode && <span className="font-mono"> · HS {p.hsCode}</span>}
                  </p>
                </div>
                <ClassificarIDTFModal produto={p} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Base de produtos — detalhe pesquisável, filtrável pela matriz acima */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>Base de produtos e regra de sequenciamento</CardTitle>
            <CardDescription>
              Cada produto declara o regime mínimo de limpeza exigido quando é a <strong>carga anterior</strong> de um feed.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {regimeFiltro && (
              <button
                type="button"
                onClick={() => setRegimeFiltro(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-semibold px-2.5 py-1 hover:bg-brand-100 transition-colors"
              >
                Regime {regimeNome[regimeFiltro]}
                <X className="size-3" />
              </button>
            )}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
              <Input
                placeholder="Buscar nome, alias ou código IDTF…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>IDTF</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Se for carga anterior → regime mín.</TableHead>
                <TableHead>Risco EUDR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {baseFiltrada.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-[12px] text-fg-muted">
                    Nenhum produto{regimeFiltro ? ` no regime ${regimeFiltro}` : ""}
                    {q ? ` para “${search}”` : ""}.
                  </TableCell>
                </TableRow>
              ) : (
                baseFiltrada.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="text-[13px] font-semibold">{p.nomeCanonico}</p>
                      <p className="text-[10px] text-fg-soft flex items-center gap-1">
                        <Tag className="size-2.5" /> {p.alias.slice(0, 3).join(" · ")}
                        {p.hsCode && <span className="font-mono ml-1">HS {p.hsCode}</span>}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-fg-muted">{p.idtfCode ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={p.categoria === "proibido" ? "destructive" : p.categoria === "risco" ? "warning" : "secondary"}
                        className="text-[9px]"
                      >
                        {categoriaLabel[p.categoria]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {p.bloqueiaFeed ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-danger-700">
                          <Ban className="size-3.5" /> Bloqueia — liberação formal + Regime D
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-fg-muted">
                          <ArrowRight className="size-3.5" /> <RegimeBadge regime={p.regimeAntesDeFeed} size="sm" />
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] text-fg-muted">{p.riscoEUDR}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="flex items-center gap-1.5 text-[11px] text-fg-muted">
        <Info className="size-3.5" /> Alias resolvem nomes comerciais brasileiros ("farelo", "soja farelo", "soybean meal"). Toda regra aplicada grava a versão da base ({VERSAO_BASE_IDTF}).
      </p>
    </div>
  );
}
