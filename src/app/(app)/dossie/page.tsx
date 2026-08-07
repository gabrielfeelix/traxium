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
  Gavel,
  Container,
  Handshake,
  IdCard,
  GraduationCap,
  PenLine,
  Files,
  ShieldCheck,
  Leaf,
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
import { viagens, motoristas } from "@/lib/mock-data";
import {
  compartimentoPorViagem,
  produtoAtualPorViagem,
  findCompartimento,
  findImplemento,
  findSubcontratado,
  findProduto,
  inspecaoDaViagem,
  cavaloPorPlaca,
  limpezasApos,
  documentosDaViagem,
  estadoQualificacao,
  FOTOS_MINIMAS,
  NIVEL_LABEL,
  HOJE,
} from "@/lib/domain/model";
import { competenciaMotorista, trilhasExigidas, conclusoes, findTrilha } from "@/lib/domain/academy";
import { avaliarCarregamento, getT3, type Tier } from "@/lib/domain/rules-engine";
import { triarViagem, type ItemTriagem } from "@/lib/domain/control-tower";
import { registrosDaViagem } from "@/lib/domain/liberacao";
import { rotuloOperacional } from "@/lib/domain/idtf";
import { RotuloOperacional } from "@/components/idtf/rotulo-operacional";
import { RegistroLiberacaoCard } from "@/components/modals/liberacao-modal";
import { useToast } from "@/components/ui/toast";
import { downloadCSV, downloadJSON, printPDF } from "@/lib/export";
import { formatDate, formatDateTime, cn, hash32 } from "@/lib/utils";

const EMISSAO = "2026-07-08";

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
                Inclui os 16 blocos: decisão e checagens, autoridade e registro da liberação, transportador, acordo,
                motorista, treinamentos, cavalo, implemento, produto, T-3, limpeza, inspeção, fotos, assinaturas e
                documentos.
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

function AutoridadeDaLiberacao({ t }: { t: ItemTriagem }) {
  if (t.liberadaPor === "motor") {
    return (
      <>
        <p className="text-[12px] leading-snug">
          Liberação <strong>automática</strong>. Nenhuma pessoa decidiu — o motor avaliou as{" "}
          <span className="num">{t.decisao.checagens.length}</span> checagens contra a base IDTF e todas passaram.
        </p>
        <p className="text-[10px] text-fg-soft mt-1 font-mono">
          motor · base {t.decisao.versaoBaseIDTF} · {formatDateTime(t.decisao.avaliadoEm)}
        </p>
      </>
    );
  }

  if (t.liberadaPor === "autoridade" && t.excecao) {
    return (
      <>
        <p className="text-[12px] leading-snug">
          Liberação <strong>humana sobre bloqueio do motor</strong>. O fato que motivou o bloqueio não foi desfeito —
          alguém com autoridade assumiu o risco residual.
        </p>
        <p className="text-[11px] text-fg-muted mt-1">
          {t.excecao.aprovador} · nível {NIVEL_LABEL[t.excecao.nivelRequerido]}
          {t.excecao.decididoEm && ` · ${formatDateTime(t.excecao.decididoEm)}`}
        </p>
        <p className="text-[10px] text-fg-soft mt-1 font-mono">motivo original: {t.excecao.motivoBloqueio}</p>
      </>
    );
  }

  if (t.autoridade === "tecnico") {
    return (
      <>
        <p className="text-[12px] leading-snug text-danger-700">
          Não liberada. <strong>Bloqueio técnico</strong> — não há nível de autoridade que libere. Derruba-se
          regularizando o fato e reavaliando.
        </p>
        <p className="text-[10px] text-fg-soft mt-1 font-mono">regra: {t.decisao.regra}</p>
      </>
    );
  }

  return (
    <>
      <p className="text-[12px] leading-snug">
        Não liberada. Aguarda decisão de <strong>{NIVEL_LABEL[t.autoridade]}</strong>.
      </p>
      <p className="text-[10px] text-fg-soft mt-1 font-mono">regra: {t.decisao.regra}</p>
    </>
  );
}

function Reconstrucao({ viagemId }: { viagemId: string }) {
  const v = viagens.find((x) => x.id === viagemId);
  if (!v) return <p className="text-[12px] text-fg-muted">Selecione uma viagem para reconstruir.</p>;

  const d = avaliarCarregamento(v.id);
  const triagem = triarViagem(v);
  const compId = compartimentoPorViagem[v.id] ?? "";
  const comp = findCompartimento(compId);
  const imp = comp ? findImplemento(comp.implementoId) : undefined;
  const sub = findSubcontratado(imp?.subcontratadoId);
  const t3 = getT3(compId);
  const cronologico = [...t3].reverse(); // T-3 mais antiga → T-1 determinante
  const inspecao = inspecaoDaViagem(v.id);
  const produto = findProduto(produtoAtualPorViagem[v.id] ?? "");
  // Fase 7 — os itens que faltavam para o dossiê responder sozinho.
  const cavalo = cavaloPorPlaca(v.cavalo);
  const motorista = motoristas.find((m) => m.nome === v.motorista);
  const competencia = motorista
    ? competenciaMotorista(motorista.id, HOJE, { regime: d.regimeExigido })
    : undefined;
  const limpeza = limpezasApos(compId, t3[0]?.load.data ?? "1970-01-01")[0];
  const acordo = sub?.acordo;
  const docs = documentosDaViagem(v.id);
  const registro = registrosDaViagem(v.id)[0];
  const qualificacao = sub ? estadoQualificacao(sub) : undefined;
  // Rótulo operacional da IDTF (Fase 8.2) — entra no selo da seção do produto.
  const resultadoIDTF = rotuloOperacional(v.id);

  // Assinaturas reunidas do que EXISTE no registro. Passo executado não implica
  // assinatura colhida: limpeza sem `assinatura` não entra na lista.
  const assinaturas: { ato: string; quem: string; quando: string; onde?: string }[] = [];
  if (inspecao?.assinatura) {
    assinaturas.push({
      ato: "Checklist LCI",
      quem: `${inspecao.assinatura.nome} · ${inspecao.assinatura.papel}`,
      quando: formatDateTime(inspecao.assinatura.assinadoEm),
      onde: inspecao.assinatura.dispositivo,
    });
  }
  if (limpeza?.assinatura) {
    assinaturas.push({
      ato: `Limpeza Regime ${limpeza.regime}`,
      quem: limpeza.executor,
      quando: formatDate(limpeza.data),
      onde: limpeza.local,
    });
  }
  if (acordo?.assinadoEm) {
    assinaturas.push({
      ato: `Acordo de qualidade ${acordo.versao}`,
      quem: acordo.assinante ?? "assinante não identificado",
      quando: formatDateTime(acordo.assinadoEm),
      onde: acordo.dispositivo,
    });
  }
  if (acordo?.cienciaMotorista) {
    const m = motoristas.find((x) => x.id === acordo.cienciaMotorista!.motoristaId);
    assinaturas.push({
      ato: "Ciência do motorista no acordo",
      quem: m?.nome ?? acordo.cienciaMotorista.motoristaId,
      quando: formatDate(acordo.cienciaMotorista.aceitoEm),
    });
  }
  if (motorista) {
    const aceites = conclusoes.filter((c) => c.motoristaId === motorista.id && c.aceiteCiencia);
    if (aceites.length) {
      const ultima = aceites.reduce((a, b) => (a.concluidoEm > b.concluidoEm ? a : b));
      assinaturas.push({
        ato: "Aceite de ciência das trilhas",
        quem: `${motorista.nome} · ${aceites.length} trilha(s)`,
        quando: `última em ${formatDate(ultima.concluidoEm)}`,
        onde: findTrilha(ultima.trilhaId)?.codigo,
      });
    }
  }

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
          {d.checagens.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {d.checagens.map((c) => (
                <li key={c.nome} className="flex items-start gap-1.5 text-[10.5px]">
                  <span className={cn("mt-[3px] size-1.5 shrink-0 rounded-full", c.ok ? "bg-success-500" : "bg-danger-500")} />
                  <span className="text-fg-muted">
                    <span className="font-medium text-fg">{c.nome}</span> — {c.detalhe}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      ),
    },
    {
      // O auditor não pergunta só "foi liberado?", pergunta "por quem". Máquina e
      // pessoa deixam rastros diferentes: uma cita regra e versão da base, a outra
      // cita nome e nível de autoridade. Separar as duas é o ponto da seção.
      titulo: "Autoridade da liberação",
      icon: <Gavel className="size-3.5" />,
      conteudo: `${triagem.liberadaPor ?? "pendente"}|${triagem.autoridade}|${triagem.excecao?.aprovador ?? "-"}`,
      jsx: <AutoridadeDaLiberacao t={triagem} />,
    },
    {
      // O registro que a diretriz exige de toda liberação manual. Ausente não é
      // buraco: viagem liberada pelo motor não tem liberação manual nenhuma, e
      // dizer isso é mais informativo do que esconder o bloco.
      titulo: "Registro da liberação",
      icon: <ShieldCheck className="size-3.5" />,
      conteudo: registro
        ? `${registro.motivoPadronizado}|${registro.impacto}|${registro.validade}|${registro.responsavel}|${registro.dataHora}`
        : "sem-liberacao-manual",
      jsx: registro ? (
        <RegistroLiberacaoCard r={registro} compacto />
      ) : triagem.liberadaPor === "autoridade" ? (
        <p className="text-[12px] text-fg-muted leading-snug">
          Liberada por autoridade antes do registro padronizado — os nove campos não existem para esta decisão.
        </p>
      ) : (
        <p className="text-[12px] text-fg-muted leading-snug">
          Sem liberação manual. {triagem.liberadaPor === "motor" ? "A carga passou pelas checagens do motor." : "A viagem segue pendente de decisão."}
        </p>
      ),
    },
    {
      titulo: "Transportador",
      icon: <Building2 className="size-3.5" />,
      conteudo: sub
        ? `${sub.razaoSocial}|${sub.cnpj}|${sub.tipoVinculo ?? "-"}|${qualificacao?.estado}`
        : `frota-propria|${imp?.placa ?? "-"}`,
      jsx: sub ? (
        <>
          <p className="text-[12px] font-medium">{sub.razaoSocial}</p>
          <p className="text-[10px] text-fg-soft font-mono">{sub.cnpj} · {sub.tipoVinculo ?? "vínculo não informado"}</p>
          <p className="text-[10px] text-fg-soft">
            Cert {sub.certGMP.numero} · {sub.certGMP.certificadora} · válido até {formatDate(sub.certGMP.validade)} ·
            base pública: {sub.certGMP.statusBasePublica}
          </p>
          <p className="text-[11px] mt-1">
            <span className={cn("font-semibold", qualificacao && ["Apto", "Apto com restrição"].includes(qualificacao.estado) ? "text-success-700" : "text-danger-700")}>
              {qualificacao?.estado}
            </span>
            <span className="text-fg-muted"> — {qualificacao?.motivo}</span>
          </p>
        </>
      ) : (
        <p className="text-[12px] text-fg-muted">
          Frota própria. O implemento {imp?.placa} não pertence a subcontratado — não há empresa terceira na cadeia
          desta carga.
        </p>
      ),
    },
    {
      titulo: "Acordo de qualidade vigente",
      icon: <Handshake className="size-3.5" />,
      conteudo: acordo
        ? `${acordo.versao}|${acordo.vigenciaInicio}>${acordo.vigenciaFim}|${acordo.assinadoEm ?? "nao-assinado"}`
        : sub
        ? "sem-acordo"
        : "nao-se-aplica",
      jsx: acordo ? (
        <>
          <p className="text-[12px]">
            {acordo.versao} · vigência {formatDate(acordo.vigenciaInicio)} a {formatDate(acordo.vigenciaFim)}
          </p>
          <p className="text-[10px] text-fg-soft mt-0.5">
            {acordo.assinadoEm
              ? `Assinado por ${acordo.assinante ?? "—"} em ${formatDateTime(acordo.assinadoEm)} · ${acordo.dispositivo ?? "dispositivo não registrado"}`
              : "Não assinado."}
          </p>
          {acordo.representantes?.length ? (
            <p className="text-[10px] text-fg-soft">Representantes: {acordo.representantes.join(", ")}</p>
          ) : null}
          {new Date(acordo.vigenciaFim) < new Date(v.iniciadaEm) && (
            <p className="text-[11px] text-danger-700 font-semibold mt-1">
              Vencido na data do carregamento.
            </p>
          )}
        </>
      ) : sub ? (
        <p className="text-[12px] text-danger-700">Nenhum acordo firmado com {sub.razaoSocial}.</p>
      ) : (
        <p className="text-[12px] text-fg-muted">Frota própria — o acordo de qualidade não se aplica.</p>
      ),
    },
    {
      titulo: "Motorista",
      icon: <IdCard className="size-3.5" />,
      conteudo: motorista
        ? `${motorista.nome}|${motorista.cpf}|${motorista.tipo}|CNH:${motorista.cnh.vencimento}`
        : `${v.motorista}|nao-cadastrado`,
      jsx: motorista ? (
        <>
          <p className="text-[12px] font-medium">{motorista.nome}</p>
          <p className="text-[10px] text-fg-soft font-mono">
            {motorista.cpf} · {motorista.tipo} · CNH {motorista.cnh.categoria} até {formatDate(motorista.cnh.vencimento)}
          </p>
          <p className="text-[10px] text-fg-soft">{motorista.cidade}/{motorista.uf} · {motorista.telefone}</p>
        </>
      ) : (
        <p className="text-[12px] text-danger-700">
          {v.motorista} não está no cadastro de motoristas — a viagem não tem motorista identificável.
        </p>
      ),
    },
    {
      titulo: "Treinamentos",
      icon: <GraduationCap className="size-3.5" />,
      conteudo: motorista && competencia
        ? `${competencia.situacao}|${competencia.motivo}`
        : "motorista-nao-identificado",
      jsx: motorista && competencia ? (
        <>
          <p className="text-[12px] leading-snug">
            <span className={cn("font-semibold", competencia.elegivel ? "text-success-700" : "text-danger-700")}>
              {competencia.elegivel ? "Competência comprovada" : "Sem competência para esta operação"}
            </span>{" "}
            <span className="text-fg-muted">— {competencia.motivo}</span>
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {trilhasExigidas({ regime: d.regimeExigido }).map((t) => {
              const c = conclusoes.find((x) => x.motoristaId === motorista.id && x.trilhaId === t.id);
              const pendente = competencia.trilhasPendentes.some((p) => p.id === t.id);
              return (
                <li key={t.id} className="flex items-start gap-1.5 text-[10.5px]">
                  <span className={cn("mt-[3px] size-1.5 shrink-0 rounded-full", pendente ? "bg-danger-500" : c ? "bg-success-500" : "bg-border")} />
                  <span className="text-fg-muted">
                    <span className="font-medium text-fg">{t.codigo}</span> {t.titulo}
                    {c ? ` — nota ${c.nota}, ${formatDate(c.concluidoEm)}, ${c.versaoConteudo}` : " — nunca concluída"}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="text-[12px] text-fg-muted">Motorista não identificado no cadastro — sem trilhas a comprovar.</p>
      ),
    },
    {
      titulo: "Cavalo mecânico",
      icon: <Truck className="size-3.5" />,
      conteudo: cavalo ? `${cavalo.placa}|${cavalo.modelo}|${cavalo.ano}` : `${v.cavalo}|nao-cadastrado`,
      jsx: cavalo ? (
        <>
          <p className="text-[12px] font-mono">{cavalo.placa}</p>
          <p className="text-[10px] text-fg-soft">
            {cavalo.modelo} · {cavalo.ano} · documentação {cavalo.documentacaoOk ? "regular" : "pendente"}
          </p>
          <p className="text-[10px] text-fg-muted mt-1 leading-snug">
            Não toca a carga: o histórico T-3 é do compartimento, não desta placa.
          </p>
        </>
      ) : (
        <p className="text-[12px] text-fg-muted">Cavalo {v.cavalo} não consta no cadastro de ativos.</p>
      ),
    },
    {
      titulo: "Implemento e compartimento",
      icon: <Container className="size-3.5" />,
      conteudo: `${imp?.placa}|${comp?.identificador}|${imp?.certGMP.validade}`,
      jsx: (
        <>
          <Link href={`/frota/compartimento/${compId}`} className="text-[12px] font-mono text-brand-600 hover:underline">
            {imp?.placa} · {comp?.identificador}
          </Link>
          <p className="text-[10px] text-fg-soft">
            {imp?.tipo} · {comp?.material} · <span className="num">{comp?.capacidadeT}</span> t · conservação {comp?.estadoConservacao}
          </p>
          <p className="text-[10px] text-fg-soft">
            Cert. GMP+ {imp?.certGMP.status} até {imp ? formatDate(imp.certGMP.validade) : "—"} · escopo {imp?.certGMP.escopo}
          </p>
        </>
      ),
    },
    {
      titulo: "Produto e base IDTF",
      icon: <Leaf className="size-3.5" />,
      conteudo: produto
        ? `${produto.nomeCanonico}|${produto.idtfCode ?? "-"}|${produto.statusClassificacao}|${d.versaoBaseIDTF}|${resultadoIDTF.rotulo}`
        : `${v.produto}|nao-resolvido|${resultadoIDTF.rotulo}`,
      jsx: produto ? (
        <>
          <div className="mb-1.5"><RotuloOperacional viagemId={v.id} compacto /></div>
          <p className="text-[12px] font-medium">{produto.nomeCanonico}</p>
          <p className="text-[10px] text-fg-soft font-mono">
            {produto.idtfCode ?? "sem código IDTF"} · base {d.versaoBaseIDTF} · {produto.statusClassificacao === "em_fila" ? "aguardando classificação" : "classificado"}
          </p>
          <p className="text-[10px] text-fg-soft">
            Declarado na viagem como “{v.produto}” · regime exigido antes de feed: {produto.regimeAntesDeFeed}
            {produto.bloqueiaFeed && " · proibido antes de feed"}
          </p>
        </>
      ) : (
        <p className="text-[12px] text-danger-700">
          “{v.produto}” não resolveu para nenhum item da base IDTF {d.versaoBaseIDTF}.
        </p>
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
      conteudo: `exigido:${d.regimeExigido ?? "-"}|aplicado:${d.regimeAplicado ?? "-"}|${limpeza?.id ?? "sem-evento"}`,
      jsx: (
        <>
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <span className="text-fg-muted">Exigido</span>
            {d.regimeExigido ? <RegimeBadge regime={d.regimeExigido} size="sm" /> : "—"}
            <span className="text-fg-muted">· Aplicado</span>
            {d.regimeAplicado ? <RegimeBadge regime={d.regimeAplicado} size="sm" /> : <span className="text-danger-700 text-[11px] font-semibold">não evidenciada</span>}
          </div>
          {limpeza && (
            <p className="text-[10px] text-fg-soft mt-1">
              {formatDate(limpeza.data)} · {limpeza.metodo} · {limpeza.local} · executor {limpeza.executor} ·{" "}
              <span className="num">{limpeza.fotos}</span> foto(s)
            </p>
          )}
        </>
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
    {
      titulo: "Evidências fotográficas",
      icon: <Camera className="size-3.5" />,
      conteudo: inspecao
        ? `fotos:${inspecao.fotos}/${FOTOS_MINIMAS}|geo:${inspecao.geo ? `${inspecao.geo.lat},${inspecao.geo.lng}` : "-"}|offline:${inspecao.offline}`
        : `sem-evidencia@${v.iniciadaEm}`,
      jsx: inspecao ? (
        <>
          <p className="text-[12px]">
            <span className={cn("num font-semibold", inspecao.fotos >= FOTOS_MINIMAS ? "text-success-700" : "text-danger-700")}>
              {inspecao.fotos}/{FOTOS_MINIMAS}
            </span>{" "}
            ângulos obrigatórios · {inspecao.geo ? "com geo" : "sem geo registrada"}
            {inspecao.offline && <span className="text-warning-700"> · capturadas offline</span>}
          </p>
          <p className="text-[10px] text-fg-soft mt-1 num">
            Vinculadas ao compartimento {comp?.identificador} · carimbo {formatDateTime(inspecao.dataHora)} · imutáveis
            após sincronização.
          </p>
        </>
      ) : (
        <p className="text-[12px] text-fg-muted">
          Nenhuma evidência fotográfica: a viagem não tem inspeção registrada.
        </p>
      ),
    },
    {
      // Assinatura é o que liga um ato a uma pessoa. O dossiê reúne as que
      // existem no registro — nenhuma é presumida por o passo ter acontecido.
      titulo: "Assinaturas",
      icon: <PenLine className="size-3.5" />,
      conteudo: assinaturas.map((a) => `${a.ato}:${a.quem}@${a.quando}`).join(">") || "sem-assinatura",
      jsx: assinaturas.length ? (
        <ul className="space-y-1">
          {assinaturas.map((a) => (
            <li key={a.ato} className="text-[11px]">
              <span className="font-medium text-fg">{a.ato}</span>{" "}
              <span className="text-fg-muted">— {a.quem}</span>
              <span className="block text-[10px] text-fg-soft font-mono">
                {a.quando} {a.onde && `· ${a.onde}`}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-fg-muted">Nenhuma assinatura registrada para esta viagem.</p>
      ),
    },
    {
      titulo: "Documentos da viagem",
      icon: <Files className="size-3.5" />,
      conteudo: docs.map((doc) => `${doc.tipo}:${doc.numero}@${doc.situacao}`).join(">") || "sem-documento",
      jsx: docs.length ? (
        <ul className="space-y-1">
          {docs.map((doc) => (
            <li key={`${doc.tipo}-${doc.numero}`} className="text-[11px]">
              <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-brand-700 border border-brand-500/50 rounded-sm px-1 py-px mr-1.5">
                {doc.tipo}
              </span>
              <span className="font-mono num">{doc.numero === "—" ? "sem número" : doc.numero}</span>
              <span
                className={cn(
                  "block text-[10px]",
                  doc.situacao === "Autorizado" || doc.situacao === "Emitido" ? "text-fg-soft" : "text-warning-700"
                )}
              >
                {doc.situacao} · {formatDate(doc.emitidoEm)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-fg-muted">Nenhum documento emitido para esta viagem.</p>
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
          emitido {formatDate(EMISSAO)} · base {d.versaoBaseIDTF} · {secoes.length} seções
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
  const cavalo = cavaloPorPlaca(v.cavalo);
  const motorista = motoristas.find((m) => m.nome === v.motorista);
  const competencia = motorista ? competenciaMotorista(motorista.id, HOJE, { regime: d.regimeExigido }) : undefined;
  const registro = registrosDaViagem(v.id)[0];
  const pacote = {
    codigo: v.codigo,
    status: v.status,
    produto: produto?.nomeCanonico ?? v.produto,
    rota: `${v.origem} -> ${v.destino}`,
    compartimento: `${imp?.placa ?? ""} · ${comp?.identificador ?? ""}`,
    decisao: { tier: d.tier, regra: d.regra, mensagem: d.mensagem, regimeExigido: d.regimeExigido ?? null, regimeAplicado: d.regimeAplicado ?? null, versaoBaseIDTF: d.versaoBaseIDTF },
    checagens: d.checagens.map((c) => ({ regra: c.regra, ok: c.ok, detalhe: c.detalhe, classe: c.classe })),
    // Liberação manual: presente só quando existiu. Nulo é resposta, não lacuna.
    liberacao: registro
      ? {
          motivoPadronizado: registro.motivoPadronizado,
          justificativa: registro.justificativa,
          evidencias: registro.evidencias,
          responsavel: registro.responsavel,
          dataHora: registro.dataHora,
          situacaoAnterior: registro.situacaoAnterior.resumo,
          situacaoPosterior: registro.situacaoPosterior.resumo,
          impacto: registro.impacto,
          validade: registro.validade,
          expiraEm: registro.expiraEm,
        }
      : null,
    t3: getT3(compId).map((e) => ({ ordem: e.ordem, produto: e.produto?.nomeCanonico ?? "", data: e.load.data, cavalo: e.load.cavaloPlaca })),
    inspecao: inspecao ? { resultado: inspecao.resultado, itens: `${inspecao.itensOk}/${inspecao.itensTotal}`, inspetor: inspecao.inspetor, fotos: `${inspecao.fotos}/${FOTOS_MINIMAS}`, assinatura: inspecao.assinatura ?? null } : null,
    transportador: sub
      ? {
          razaoSocial: sub.razaoSocial,
          cnpj: sub.cnpj,
          tipoVinculo: sub.tipoVinculo ?? null,
          qualificacao: estadoQualificacao(sub).estado,
          cert: sub.certGMP.numero,
          validade: sub.certGMP.validade,
          basePublica: sub.certGMP.statusBasePublica,
        }
      : { proprietario: "Frota própria" },
    acordo: sub?.acordo
      ? {
          versao: sub.acordo.versao,
          vigencia: `${sub.acordo.vigenciaInicio} -> ${sub.acordo.vigenciaFim}`,
          assinadoEm: sub.acordo.assinadoEm ?? null,
          assinante: sub.acordo.assinante ?? null,
        }
      : null,
    motorista: motorista
      ? { nome: motorista.nome, cpf: motorista.cpf, tipo: motorista.tipo, cnhVencimento: motorista.cnh.vencimento }
      : null,
    treinamentos: competencia
      ? {
          situacao: competencia.situacao,
          elegivel: competencia.elegivel,
          motivo: competencia.motivo,
          pendentes: competencia.trilhasPendentes.map((t) => t.codigo),
        }
      : null,
    cavalo: cavalo ? { placa: cavalo.placa, modelo: cavalo.modelo, ano: cavalo.ano } : null,
    documentos: documentosDaViagem(v.id),
    resultadoIDTF: rotuloOperacional(v.id),
  };
  // Selo de integridade do pacote — mesmo conteúdo, mesmo hash, sempre.
  return { ...pacote, selo: { hash: hash32(JSON.stringify(pacote)), algoritmo: "djb2-32" } };
}
