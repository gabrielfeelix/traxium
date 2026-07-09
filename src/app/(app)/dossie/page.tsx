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
  Fingerprint,
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

const EMISSAO = "2026-07-08";

/** Hash djb2-32 determinístico — o mesmo conteúdo gera sempre o mesmo selo. */
function hash32(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0");
}

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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
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
                      <TableRow key={v.id} className={cn(foco === v.id && "bg-brand-50/50")}>
                        <TableCell>
                          <Checkbox checked={sel.has(v.id)} onCheckedChange={() => toggle(v.id)} aria-label={`Selecionar ${v.codigo}`} />
                        </TableCell>
                        <TableCell>
                          <p className="font-mono text-[12px] font-semibold">{v.codigo}</p>
                          <p className="text-[10px] text-fg-soft">{v.produto} · {formatDate(v.iniciadaEm)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[12px] font-mono">{imp?.placa}</p>
                          <p className="text-[10px] text-fg-soft">{comp?.identificador}</p>
                        </TableCell>
                        <TableCell><TierChip tier={d.tier} /></TableCell>
                        <TableCell>
                          <button
                            onClick={() => setFoco(v.id)}
                            className="text-brand-600 hover:bg-brand-50 rounded p-1"
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
          <div className="rounded-xl border border-border bg-bg-elev p-3 flex items-center gap-3 flex-wrap sticky bottom-0">
            <div className="flex-1 min-w-[160px]">
              <p className="text-[13px] font-semibold">
                <span className="num">{sel.size}</span> viagem(ns) selecionada(s)
              </p>
              <p className="text-[10px] text-fg-muted">
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
                downloadJSON("dossie-gmp-eudr", { geradoEm: EMISSAO, modulo: "Traxium · Dossiê de auditoria", viagens: sels.map(reconstrucaoDe) });
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
                <FileCheck2 className="size-4 text-brand-600" />
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
  if (!v) return <p className="text-[12px] text-fg-muted">Selecione uma viagem para reconstruir.</p>;

  const d = avaliarCarregamento(v.id);
  const compId = compartimentoPorViagem[v.id] ?? "";
  const comp = findCompartimento(compId);
  const imp = comp ? findImplemento(comp.implementoId) : undefined;
  const sub = findSubcontratado(imp?.subcontratadoId);
  const t3 = getT3(compId);
  const cronologico = [...t3].reverse(); // T-3 mais antiga → T-1 determinante
  const inspecao = inspecaoDaViagem(v.id);
  const produto = findProduto(produtoAtualPorViagem[v.id] ?? "");

  // Hash-chain: cada seção sela o próprio conteúdo + o selo da anterior.
  const secoes: { titulo: string; icon: React.ReactNode; conteudo: string; jsx: React.ReactNode }[] = [
    {
      titulo: "Decisão do motor",
      icon: <Boxes className="size-3.5" />,
      conteudo: `${d.tier}|${d.regra}|${d.mensagem}`,
      jsx: (
        <>
          <p className="text-[12px] leading-snug">{d.mensagem}</p>
          <p className="text-[10px] text-fg-soft mt-1 font-mono">regra: {d.regra} · base {d.versaoBaseIDTF}</p>
        </>
      ),
    },
    {
      titulo: "Compartimento",
      icon: <Truck className="size-3.5" />,
      conteudo: `${imp?.placa}|${comp?.identificador}`,
      jsx: (
        <>
          <Link href={`/frota/compartimento/${compId}`} className="text-[12px] font-mono text-brand-600 hover:underline">
            {imp?.placa} · {comp?.identificador}
          </Link>
          <p className="text-[10px] text-fg-soft">{imp?.tipo} · {produto?.nomeCanonico}</p>
        </>
      ),
    },
    {
      titulo: "Histórico T-3 · cronológico",
      icon: <Boxes className="size-3.5" />,
      conteudo: cronologico.map((e) => `${e.produto?.nomeCanonico}@${e.load.data}`).join(">"),
      jsx: (
        <div className="space-y-1.5">
          {cronologico.map((e) => (
            <div key={e.load.id} className="flex items-center gap-2 text-[11px]">
              {/* carimbo de data */}
              <span className="font-mono text-[9px] font-bold border border-fg-soft/50 text-fg-muted rounded-sm px-1 py-px num shrink-0">
                {formatDate(e.load.data)}
              </span>
              <span className={cn("flex-1 truncate", e.determinante && "font-bold")}>{e.produto?.nomeCanonico}</span>
              <span className="font-mono text-[10px] text-fg-soft">{e.load.cavaloPlaca}</span>
              {e.determinante && (
                <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-brand-700 border border-brand-500/50 rounded-sm px-1 py-px shrink-0">
                  determinante
                </span>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      titulo: "Limpeza",
      icon: <Droplets className="size-3.5" />,
      conteudo: `exigido:${d.regimeExigido ?? "-"}|aplicado:${d.regimeAplicado ?? "-"}`,
      jsx: (
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-fg-muted">Exigido</span>
          {d.regimeExigido ? <RegimeBadge regime={d.regimeExigido} size="sm" /> : "—"}
          <span className="text-fg-muted">· Aplicado</span>
          {d.regimeAplicado ? <RegimeBadge regime={d.regimeAplicado} size="sm" /> : <span className="text-danger-700 text-[11px] font-semibold">não evidenciada</span>}
        </div>
      ),
    },
    {
      titulo: "Inspeção LCI",
      icon: <ClipboardCheck className="size-3.5" />,
      conteudo: inspecao ? `${inspecao.resultado}|${inspecao.itensOk}/${inspecao.itensTotal}|${inspecao.inspetor}` : "sem-inspecao",
      jsx: inspecao ? (
        <p className="text-[12px] capitalize">
          {inspecao.resultado} · <span className="num">{inspecao.itensOk}/{inspecao.itensTotal}</span> · {inspecao.inspetor}
          {inspecao.offline && <span className="text-warning-700"> · offline</span>}
        </p>
      ) : (
        <p className="text-[12px] text-fg-muted">Sem inspeção registrada.</p>
      ),
    },
    ...(sub
      ? [{
          titulo: "Subcontratado no momento",
          icon: <Building2 className="size-3.5" />,
          conteudo: `${sub.razaoSocial}|${sub.certGMP.numero}|${sub.certGMP.validade}`,
          jsx: (
            <>
              <p className="text-[12px]">{sub.razaoSocial}</p>
              <p className="text-[10px] text-fg-soft">
                Cert {sub.certGMP.numero} · válido até {formatDate(sub.certGMP.validade)} · base pública: {sub.certGMP.statusBasePublica}
              </p>
            </>
          ),
        }]
      : []),
    {
      titulo: "Evidências",
      icon: <Camera className="size-3.5" />,
      conteudo: `evidencias@${v.iniciadaEm}`,
      jsx: (
        <>
          <p className="text-[12px] text-fg-muted leading-snug">Fotos com geo, timestamp e hash · vinculadas ao compartimento · imutáveis após sincronização.</p>
          <p className="text-[10px] text-fg-soft mt-1 num">Trilha registrada em {formatDateTime(v.iniciadaEm)}.</p>
        </>
      ),
    },
  ];

  // Encadeia: selo(n) = hash(selo(n-1) + conteúdo(n)). Adulterou uma seção, quebra tudo à frente.
  const selos: string[] = [];
  secoes.forEach((s, i) => selos.push(hash32((i ? selos[i - 1] : v.codigo) + s.conteudo)));
  const seloFinal = selos[selos.length - 1];

  return (
    <div className="space-y-3">
      {/* Papel timbrado */}
      <div className="border-y-2 border-fg/70 py-2.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-fg-muted">Traxium · Dossiê de auditoria</p>
        <div className="flex items-start justify-between gap-3 mt-1">
          <div className="min-w-0">
            <p className="font-mono text-[15px] font-bold text-fg leading-tight">DOS·{v.codigo}</p>
            <p className="text-[11px] text-fg-muted truncate mt-0.5">{v.origem} → {v.destino}</p>
            <div className="flex items-center gap-1.5 mt-1.5"><StatusBadge status={v.status} size="sm" /></div>
          </div>
          <Carimbo tier={d.tier} />
        </div>
        <p className="font-mono text-[9px] text-fg-soft mt-2 num">
          emitido {formatDate(EMISSAO)} · base IDTF {d.versaoBaseIDTF} · {secoes.length} seções
        </p>
      </div>

      {/* Seções encadeadas */}
      <div className="space-y-2.5">
        {secoes.map((s, i) => (
          <BlocoDossie key={s.titulo} num={i + 1} titulo={s.titulo} icon={s.icon} selo={selos[i]} ultimo={i === secoes.length - 1}>
            {s.jsx}
          </BlocoDossie>
        ))}
      </div>

      {/* Selo de integridade */}
      <div className="rounded-md border border-dashed border-brand-500/50 bg-brand-50/40 p-2.5 flex items-center gap-2.5">
        <Fingerprint className="size-4 text-brand-600 shrink-0" />
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">Selo de integridade</p>
          <p className="font-mono text-[10px] text-fg-muted truncate">
            hash-chain #{seloFinal} · {secoes.length} seções encadeadas · djb2-32
          </p>
        </div>
      </div>
    </div>
  );
}

/** Seção do dossiê: numerada, com selo próprio e trilho de cadeia à esquerda. */
function BlocoDossie({
  num,
  titulo,
  icon,
  selo,
  ultimo,
  children,
}: {
  num: number;
  titulo: string;
  icon: React.ReactNode;
  selo: string;
  ultimo?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-5">
      {!ultimo && <span className="absolute left-[5px] top-4 -bottom-[14px] w-px bg-border" aria-hidden />}
      <span className="absolute left-0 top-2 size-[11px] rounded-full border-2 border-brand-500 bg-bg-elev" aria-hidden />
      <div className="rounded-md border border-border-soft bg-bg-elev p-2.5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="text-[10px] uppercase tracking-[0.1em] text-fg-muted font-semibold flex items-center gap-1.5 min-w-0">
            <span className="text-brand-600 shrink-0">{icon}</span>
            <span className="font-mono shrink-0">§{num}</span>
            <span className="truncate">{titulo}</span>
          </p>
          <span className="font-mono text-[9px] text-fg-soft shrink-0">#{selo}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Carimbo de borracha do veredito — o dossiê chega batido. */
function Carimbo({ tier }: { tier: Tier }) {
  const cfg: Record<Tier, string> = {
    BLOQUEIO: "border-danger-500 text-danger-500",
    ALERTA: "border-warning-500 text-warning-700",
    LIBERADO: "border-success-500 text-success-700",
  };
  return (
    <span
      className={cn(
        "inline-block -rotate-6 border-[2.5px] rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] opacity-85 shrink-0 select-none",
        cfg[tier]
      )}
    >
      {tier}
    </span>
  );
}

function TierChip({ tier }: { tier: Tier }) {
  const style: Record<Tier, string> = {
    BLOQUEIO: "bg-danger-500 text-white",
    ALERTA: "bg-warning-500 text-white",
    LIBERADO: "bg-success-500 text-white",
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
  const pacote = {
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
  // Selo de integridade do pacote — mesmo conteúdo, mesmo hash, sempre.
  return { ...pacote, selo: { hash: hash32(JSON.stringify(pacote)), algoritmo: "djb2-32" } };
}
