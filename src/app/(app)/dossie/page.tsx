"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Search,
  FileText,
  FileSpreadsheet,
  FolderArchive,
  Boxes,
  Truck,
  Droplets,
  ClipboardCheck,
  Building2,
  Camera,
  ScanSearch,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, RegimeBadge } from "@/components/shell/status-badge";
import { viagens } from "@/lib/mock-data";
import {
  compartimentoPorViagem,
  produtoAtualPorViagem,
  findCompartimento,
  findImplemento,
  findSubcontratado,
  findProduto,
  inspecaoDaViagem,
} from "@/lib/domain/model";
import { avaliarCarregamento, getT3, type Tier } from "@/lib/domain/rules-engine";
import { useToast } from "@/components/ui/toast";
import { downloadCSV, downloadJSON, printPDF } from "@/lib/export";
import { formatDate, formatDateTime, cn } from "@/lib/utils";

export default function DossiePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("todos");
  const [produto, setProduto] = useState("todos");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [foco, setFoco] = useState<string>("v-002");

  const produtosUnicos = [...new Set(viagens.map((v) => v.produto))];

  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return viagens.filter((v) => {
      const mSearch = !q || v.codigo.toLowerCase().includes(q) || v.motorista.toLowerCase().includes(q) || v.carreta.toLowerCase().includes(q);
      const mStatus = status === "todos" || v.status === status;
      const mProduto = produto === "todos" || v.produto === produto;
      const dia = v.iniciadaEm.slice(0, 10);
      const mDe = !de || dia >= de;
      const mAte = !ate || dia <= ate;
      return mSearch && mStatus && mProduto && mDe && mAte;
    });
  }, [search, status, produto, de, ate]);

  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allSel = filtrados.length > 0 && filtrados.every((v) => sel.has(v.id));
  const toggleAll = () =>
    setSel((s) => {
      if (allSel) return new Set();
      return new Set(filtrados.map((v) => v.id));
    });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dossiê de auditoria"
        description="Reconstrói a trilha completa sem depender de WhatsApp: por que cada carga foi liberada ou bloqueada, qual carga anterior existia, qual limpeza foi exigida, quem validou e qual evidência comprova. Filtra por período, código/placa, produto e status; exporta CSV, PDF e pacote JSON de reconstrução."
      />

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2">
              <Label className="text-[11px]">Buscar</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[hsl(210_14%_42%)]" />
                <Input placeholder="Código, motorista ou placa…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Em trânsito">Em trânsito</SelectItem>
                  <SelectItem value="Bloqueada">Bloqueada</SelectItem>
                  <SelectItem value="Em carregamento">Em carregamento</SelectItem>
                  <SelectItem value="Agendada">Agendada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px]">Produto</Label>
              <Select value={produto} onValueChange={setProduto}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {produtosUnicos.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px]">De</Label>
                <Input type="date" value={de} onChange={(e) => setDe(e.target.value)} className="h-9 mt-1" />
              </div>
              <div>
                <Label className="text-[11px]">Até</Label>
                <Input type="date" value={ate} onChange={(e) => setAte(e.target.value)} className="h-9 mt-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tabela de seleção */}
        <div className="lg:col-span-7 space-y-3">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">
                      <Checkbox checked={allSel} onCheckedChange={toggleAll} aria-label="Selecionar todos" />
                    </TableHead>
                    <TableHead>Viagem</TableHead>
                    <TableHead>Compartimento</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.map((v) => {
                    const d = avaliarCarregamento(v.id);
                    const comp = findCompartimento(compartimentoPorViagem[v.id] ?? "");
                    const imp = comp ? findImplemento(comp.implementoId) : undefined;
                    return (
                      <TableRow key={v.id} className={cn(foco === v.id && "bg-[hsl(174_64%_98%)]")}>
                        <TableCell>
                          <Checkbox checked={sel.has(v.id)} onCheckedChange={() => toggle(v.id)} aria-label={`Selecionar ${v.codigo}`} />
                        </TableCell>
                        <TableCell>
                          <p className="font-mono text-[12px] font-semibold">{v.codigo}</p>
                          <p className="text-[10px] text-[hsl(210_12%_58%)]">{v.produto} · {formatDate(v.iniciadaEm)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px] font-mono">{imp?.placa}</p>
                          <p className="text-[10px] text-[hsl(210_12%_58%)]">{comp?.identificador}</p>
                        </TableCell>
                        <TableCell><TierChip tier={d.tier} /></TableCell>
                        <TableCell>
                          <button
                            onClick={() => setFoco(v.id)}
                            className="text-[hsl(176_84%_25%)] hover:bg-[hsl(174_64%_94%)] rounded p-1"
                            aria-label="Reconstruir"
                          >
                            <ScanSearch className="size-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Barra de exportação */}
          <div className="rounded-xl border border-[hsl(200_18%_88%)] bg-white p-3 flex items-center gap-3 flex-wrap sticky bottom-0">
            <div className="flex-1 min-w-[160px]">
              <p className="text-[13px] font-semibold">
                <span className="num">{sel.size}</span> viagem(ns) selecionada(s)
              </p>
              <p className="text-[10px] text-[hsl(210_14%_42%)]">
                Inclui: decisão do motor, T-3, limpezas, inspeções, certificados válidos no momento, fotos com geo/hash e trilha de aprovação.
              </p>
            </div>
            <Button
              variant="outline" size="sm" disabled={!sel.size}
              onClick={() => { printPDF(); toast("Abrindo impressão", { type: "info", desc: "Use 'Salvar como PDF'." }); }}
            ><FileText className="size-4" /> PDF</Button>
            <Button
              variant="outline" size="sm" disabled={!sel.size}
              onClick={() => {
                const sels = viagens.filter((v) => sel.has(v.id));
                downloadCSV(
                  "dossie-viagens",
                  ["Código", "Produto", "Compartimento", "Decisão", "Regra", "Status"],
                  sels.map((v) => { const r = reconstrucaoDe(v); return [r.codigo, r.produto, r.compartimento, r.decisao.tier, r.decisao.regra, r.status]; })
                );
                toast("Excel (CSV) exportado", { desc: `${sels.length} viagem(ns).` });
              }}
            ><FileSpreadsheet className="size-4" /> Excel</Button>
            <Button
              variant="gradient" size="sm" disabled={!sel.size}
              onClick={() => {
                const sels = viagens.filter((v) => sel.has(v.id));
                downloadJSON("dossie-gmp-eudr", { geradoEm: "2026-07-08", modulo: "Traxium · Dossiê de auditoria", viagens: sels.map(reconstrucaoDe) });
                toast("Pacote de dossiê gerado", { desc: `${sels.length} viagem(ns) · JSON de reconstrução.` });
              }}
            ><FolderArchive className="size-4" /> Baixar pacote JSON</Button>
          </div>
        </div>

        {/* Reconstrução da decisão */}
        <div className="lg:col-span-5">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="size-4 text-[hsl(176_84%_25%)]" />
                <CardTitle>Reconstrução da decisão</CardTitle>
              </div>
              <CardDescription>Trilha auditável de uma viagem — o que o auditor recebe.</CardDescription>
            </CardHeader>
            <CardContent>
              <Reconstrucao viagemId={foco} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Reconstrucao({ viagemId }: { viagemId: string }) {
  const v = viagens.find((x) => x.id === viagemId);
  if (!v) return <p className="text-[12px] text-[hsl(210_14%_42%)]">Selecione uma viagem para reconstruir.</p>;

  const d = avaliarCarregamento(v.id);
  const compId = compartimentoPorViagem[v.id] ?? "";
  const comp = findCompartimento(compId);
  const imp = comp ? findImplemento(comp.implementoId) : undefined;
  const sub = findSubcontratado(imp?.subcontratadoId);
  const t3 = getT3(compId);
  const inspecao = inspecaoDaViagem(v.id);
  const produto = findProduto(produtoAtualPorViagem[v.id] ?? "");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[12px] font-semibold">{v.codigo}</span>
        <StatusBadge status={v.status} size="sm" />
        <TierChip tier={d.tier} />
      </div>
      <p className="text-[12px] text-[hsl(210_14%_42%)]">{v.origem} → {v.destino}</p>

      <Bloco icon={<Boxes className="size-3.5" />} titulo="Decisão do motor">
        <p className="text-[12px]">{d.mensagem}</p>
        <p className="text-[10px] text-[hsl(210_12%_58%)] mt-1">Regra: {d.regra} · base {d.versaoBaseIDTF}</p>
      </Bloco>

      <Bloco icon={<Boxes className="size-3.5" />} titulo="Compartimento">
        <Link href={`/frota/compartimento/${compId}`} className="text-[12px] font-mono text-[hsl(176_84%_25%)] hover:underline">
          {imp?.placa} · {comp?.identificador}
        </Link>
        <p className="text-[10px] text-[hsl(210_12%_58%)]">{imp?.tipo} · {produto?.nomeCanonico}</p>
      </Bloco>

      <Bloco icon={<Truck className="size-3.5" />} titulo="Histórico T-3 (do compartimento)">
        <div className="space-y-1">
          {t3.map((e) => (
            <div key={e.load.id} className="flex items-center gap-2 text-[11px]">
              <span className="font-mono text-[hsl(210_12%_58%)]">T-{e.ordem}</span>
              <span className="flex-1">{e.produto?.nomeCanonico}</span>
              <span className="text-[hsl(210_12%_58%)] num">{formatDate(e.load.data)}</span>
              <span className="font-mono text-[hsl(210_12%_58%)]">{e.load.cavaloPlaca}</span>
            </div>
          ))}
        </div>
      </Bloco>

      <Bloco icon={<Droplets className="size-3.5" />} titulo="Limpeza">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-[hsl(210_14%_42%)]">Exigido</span>
          {d.regimeExigido ? <RegimeBadge regime={d.regimeExigido} size="sm" /> : "—"}
          <span className="text-[hsl(210_14%_42%)]">· Aplicado</span>
          {d.regimeAplicado ? <RegimeBadge regime={d.regimeAplicado} size="sm" /> : <span className="text-[hsl(0_70%_45%)] text-[11px]">não evidenciada</span>}
        </div>
      </Bloco>

      <Bloco icon={<ClipboardCheck className="size-3.5" />} titulo="Inspeção LCI">
        {inspecao ? (
          <p className="text-[12px] capitalize">
            {inspecao.resultado} · <span className="num">{inspecao.itensOk}/{inspecao.itensTotal}</span> · {inspecao.inspetor}
            {inspecao.offline && <span className="text-[hsl(38_90%_28%)]"> · offline</span>}
          </p>
        ) : (
          <p className="text-[12px] text-[hsl(210_14%_42%)]">Sem inspeção registrada.</p>
        )}
      </Bloco>

      {sub && (
        <Bloco icon={<Building2 className="size-3.5" />} titulo="Subcontratado (no momento da viagem)">
          <p className="text-[12px]">{sub.razaoSocial}</p>
          <p className="text-[10px] text-[hsl(210_12%_58%)]">
            Cert {sub.certGMP.numero} · válido até {formatDate(sub.certGMP.validade)} · base pública: {sub.certGMP.statusBasePublica}
          </p>
        </Bloco>
      )}

      <Bloco icon={<Camera className="size-3.5" />} titulo="Evidências">
        <p className="text-[12px] text-[hsl(210_14%_42%)]">Fotos com geo, timestamp e hash · vinculadas ao compartimento · imutáveis após sincronização.</p>
        <p className="text-[10px] text-[hsl(210_12%_58%)] mt-1">Trilha registrada em {formatDateTime(v.iniciadaEm)}.</p>
      </Bloco>
    </div>
  );
}

function Bloco({ icon, titulo, children }: { icon: React.ReactNode; titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[hsl(200_18%_92%)] p-2.5">
      <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(210_14%_42%)] font-semibold mb-1.5 flex items-center gap-1.5">
        <span className="text-[hsl(176_84%_25%)]">{icon}</span> {titulo}
      </p>
      {children}
    </div>
  );
}

function TierChip({ tier }: { tier: Tier }) {
  const style: Record<Tier, string> = {
    BLOQUEIO: "bg-[hsl(0_78%_50%)] text-white",
    ALERTA: "bg-[hsl(28_92%_48%)] text-white",
    LIBERADO: "bg-[hsl(142_71%_40%)] text-white",
  };
  return (
    <span className={cn("text-[9px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5", style[tier])}>{tier}</span>
  );
}

function reconstrucaoDe(v: (typeof viagens)[number]) {
  const d = avaliarCarregamento(v.id);
  const compId = compartimentoPorViagem[v.id] ?? "";
  const comp = findCompartimento(compId);
  const imp = comp ? findImplemento(comp.implementoId) : undefined;
  const sub = findSubcontratado(imp?.subcontratadoId);
  const inspecao = inspecaoDaViagem(v.id);
  const produto = findProduto(produtoAtualPorViagem[v.id] ?? "");
  return {
    codigo: v.codigo,
    status: v.status,
    produto: produto?.nomeCanonico ?? v.produto,
    rota: `${v.origem} -> ${v.destino}`,
    compartimento: `${imp?.placa ?? ""} · ${comp?.identificador ?? ""}`,
    decisao: { tier: d.tier, regra: d.regra, mensagem: d.mensagem, regimeExigido: d.regimeExigido ?? null, regimeAplicado: d.regimeAplicado ?? null, versaoBaseIDTF: d.versaoBaseIDTF },
    t3: getT3(compId).map((e) => ({ ordem: e.ordem, produto: e.produto?.nomeCanonico ?? "", data: e.load.data, cavalo: e.load.cavaloPlaca })),
    inspecao: inspecao ? { resultado: inspecao.resultado, itens: `${inspecao.itensOk}/${inspecao.itensTotal}`, inspetor: inspecao.inspetor } : null,
    subcontratado: sub ? { razaoSocial: sub.razaoSocial, cert: sub.certGMP.numero, validade: sub.certGMP.validade } : null,
  };
}
