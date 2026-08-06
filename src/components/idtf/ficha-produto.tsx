"use client";

// Ficha do produto na base brasileira (Fase 8.1).
//
// O cadastro da diretriz tem 18 campos, e quase metade existe para o mesmo fim:
// que um nome vindo do pátio resolva para o produto certo sem virar produto
// novo. Campo não preenchido aparece como "não informado" — em produto na fila
// de classificação, a lacuna É a informação.

import {
  historicoDoProduto,
  TIPO_ALTERACAO_LABEL,
  type ProdutoIDTF,
} from "@/lib/domain/model";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RegimeBadge } from "@/components/shell/status-badge";
import { formatDate, cn } from "@/lib/utils";

function Campo({ n, rotulo, children, largo }: { n: number; rotulo: string; children: React.ReactNode; largo?: boolean }) {
  return (
    <div className={cn(largo && "sm:col-span-2")}>
      <dt className="text-[9.5px] uppercase tracking-[0.08em] text-fg-soft">
        <span className="font-mono">{n}</span> · {rotulo}
      </dt>
      <dd className="text-[11.5px] text-fg leading-snug">{children}</dd>
    </div>
  );
}

/** Lista, ou a ausência dita com todas as letras. */
function Lista({ itens }: { itens?: string[] }) {
  if (!itens?.length) return <span className="text-fg-soft">não informado</span>;
  return <>{itens.join(" · ")}</>;
}

export function FichaProduto({ produto: p, children }: { produto: ProdutoIDTF; children: React.ReactNode }) {
  const historico = historicoDoProduto(p.id);
  const emFila = p.statusClassificacao === "em_fila";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{p.nomeCanonico}</DialogTitle>
          <DialogDescription>
            Cadastro completo na base {p.versaoBase}
            {emFila && " · produto ainda na fila de classificação"}
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          <Campo n={1} rotulo="Nome canônico">{p.nomeCanonico}</Campo>
          <Campo n={2} rotulo="Nome oficial na fonte">
            {p.nomeOficialFonte ?? <span className="text-fg-soft">não informado</span>}
          </Campo>
          <Campo n={3} rotulo="Código IDTF">
            <span className="font-mono">{p.idtfCode ?? <span className="text-fg-soft">sem código — não classificado</span>}</span>
          </Campo>
          <Campo n={4} rotulo="Código HS">
            <span className="font-mono">{p.hsCode ?? <span className="text-fg-soft">não informado</span>}</span>
          </Campo>
          <Campo n={5} rotulo="Categoria">{p.categoria}</Campo>
          <Campo n={6} rotulo="Estado físico">
            {p.estadoFisico ?? <span className="text-fg-soft">não informado</span>}
          </Campo>
          <Campo n={7} rotulo="Sinônimos brasileiros" largo><Lista itens={p.alias} /></Campo>
          <Campo n={8} rotulo="Sinônimos regionais" largo>
            {p.sinonimosRegionais?.length ? (
              p.sinonimosRegionais.map((s) => `${s.nome} (${s.regiao})`).join(" · ")
            ) : (
              <span className="text-fg-soft">não informado</span>
            )}
          </Campo>
          <Campo n={9} rotulo="Nomes comerciais" largo><Lista itens={p.nomesComerciais} /></Campo>
          <Campo n={10} rotulo="Nomes em inglês" largo><Lista itens={p.nomesIngles} /></Campo>
          <Campo n={11} rotulo="Erros comuns de digitação" largo><Lista itens={p.errosComuns} /></Campo>
          <Campo n={12} rotulo="Regime mínimo se for carga anterior">
            <span className="inline-flex items-center gap-1.5">
              <RegimeBadge regime={p.regimeAntesDeFeed} size="sm" />
              {p.bloqueiaFeed && <span className="text-danger-700 font-semibold">· proibida antes de feed</span>}
            </span>
          </Campo>
          <Campo n={13} rotulo="Risco EUDR">{p.riscoEUDR}</Campo>
          <Campo n={14} rotulo="Restrições" largo>
            {p.restricoes?.length ? (
              <ul className="space-y-0.5">
                {p.restricoes.map((r) => (
                  <li key={r} className="text-danger-700">{r}</li>
                ))}
              </ul>
            ) : p.restricoes ? (
              <span className="text-fg-muted">Nenhuma além do regime de limpeza.</span>
            ) : (
              <span className="text-fg-soft">não informado</span>
            )}
          </Campo>
          <Campo n={15} rotulo="Esquema de certificação" largo><Lista itens={p.esquemaCertificacao} /></Campo>
          <Campo n={16} rotulo="Última atualização">
            {p.atualizadoEm ? formatDate(p.atualizadoEm) : <span className="text-fg-soft">nunca atualizado</span>}
          </Campo>
          <Campo n={17} rotulo="Responsável pela validação">
            {p.responsavelValidacao ?? <span className="text-fg-soft">sem responsável — aguarda classificação</span>}
          </Campo>
          <Campo n={18} rotulo="Fonte da decisão" largo>
            {p.fonteDecisao ?? <span className="text-fg-soft">sem fonte registrada — a classificação ainda não foi tomada</span>}
          </Campo>
        </dl>

        <div className="mt-3">
          <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted mb-1.5">
            Histórico deste produto na base
          </p>
          {historico.length === 0 ? (
            <p className="text-[11.5px] text-fg-muted">
              Nenhuma alteração registrada desde a carga inicial da base.
            </p>
          ) : (
            <ul className="space-y-2">
              {historico.map((h) => (
                <li key={h.id} className="rounded-md border border-border-soft bg-bg p-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[9px]">{TIPO_ALTERACAO_LABEL[h.tipo]}</Badge>
                    <span className="font-mono text-[10px] text-fg-muted num">{formatDate(h.data)} · {h.versao}</span>
                  </div>
                  <p className="text-[11.5px] text-fg mt-1 leading-snug">{h.descricao}</p>
                  <p className="text-[10px] text-fg-soft mt-0.5">
                    {h.responsavel} · fonte: {h.fonte}
                    {h.aprovadoPor && ` · aprovado por ${h.aprovadoPor}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
