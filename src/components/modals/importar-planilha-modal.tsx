"use client";

// Importação em lote de subcontratados (Fase 9.2).
//
// Sem dependência de parser: a planilha chega colada, como chega de verdade —
// alguém copia do Excel e cola. O separador é detectado (tab, ponto e vírgula
// ou vírgula) porque o Excel brasileiro cola com tab e o CSV exportado vem com
// ponto e vírgula.
//
// A regra que importa é a duplicidade: o cadastro não apodrece por falta de
// importação, apodrece por importar a mesma empresa três vezes com grafias
// diferentes. A conferência acontece ANTES de gravar, linha a linha, e o que
// está duplicado não entra — em vez de entrar e virar limpeza depois.

import { useMemo, useState } from "react";
import { Upload, FileSpreadsheet, CircleAlert, CopyX, CircleCheck } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { subcontratados, TIPOS_VINCULO, type TipoVinculo } from "@/lib/domain/model";
import { useSession, type LinhaImportacao } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const EXEMPLO = `razao social;cnpj;vinculo;responsavel;telefone;placa
Transportes Vale Verde ME;12.345.678/0001-90;ETC subcontratada;Marcos Vale;(66) 9 9123-4567;VVE-1A23
Nogueira Cargas Ltda;98.765.432/0001-10;Agregado;Ana Nogueira;(65) 9 9876-5432;NGC-4B56`;

/** Só os dígitos: é assim que duas grafias do mesmo CNPJ viram a mesma chave. */
function digitos(s: string): string {
  return s.replace(/\D/g, "");
}

function separador(linha: string): string {
  if (linha.includes("\t")) return "\t";
  if (linha.includes(";")) return ";";
  return ",";
}

function parse(texto: string): LinhaImportacao[] {
  const linhas = texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!linhas.length) return [];

  const sep = separador(linhas[0]);
  const temCabecalho = /cnpj/i.test(linhas[0]);
  const corpo = temCabecalho ? linhas.slice(1) : linhas;

  const cnpjsExistentes = new Set(subcontratados.map((s) => digitos(s.cnpj)));
  const vistosNoLote = new Map<string, number>();

  return corpo.map((linha, i) => {
    const col = linha.split(sep).map((c) => c.trim());
    const [razaoSocial = "", cnpjBruto = "", vinculo = "", responsavel = "", telefone = "", placa = ""] = col;
    const numero = digitos(cnpjBruto);
    const item: LinhaImportacao = {
      linha: i + 1 + (temCabecalho ? 1 : 0),
      razaoSocial,
      cnpj: cnpjBruto,
      tipoVinculo: TIPOS_VINCULO.find((t) => t.toLowerCase() === vinculo.toLowerCase()) as TipoVinculo | undefined,
      responsavel: responsavel || undefined,
      telefone: telefone || undefined,
      implementoPlaca: placa || undefined,
    };

    if (!razaoSocial) item.problema = "Sem razão social.";
    else if (numero.length !== 14) item.problema = "CNPJ não tem 14 dígitos.";

    if (!item.problema) {
      if (cnpjsExistentes.has(numero)) {
        item.duplicada = true;
        const existente = subcontratados.find((s) => digitos(s.cnpj) === numero);
        item.problema = `Já cadastrada como “${existente?.razaoSocial}”.`;
      } else if (vistosNoLote.has(numero)) {
        item.duplicada = true;
        item.problema = `Repetida na linha ${vistosNoLote.get(numero)} desta planilha.`;
      } else {
        vistosNoLote.set(numero, item.linha);
      }
    }
    return item;
  });
}

export function ImportarPlanilhaModal() {
  const { importarSubcontratados } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState("");

  const linhas = useMemo(() => parse(texto), [texto]);
  const validas = linhas.filter((l) => !l.problema);
  const duplicadas = linhas.filter((l) => l.duplicada);
  const invalidas = linhas.filter((l) => l.problema && !l.duplicada);

  function importar() {
    const r = importarSubcontratados(linhas);
    toast(`${r.criados} empresa(s) importada(s)`, {
      type: r.criados ? "success" : "info",
      desc: r.ignorados
        ? `${r.ignorados} linha(s) não entraram. Toda importada nasce sem certificado comprovado — a base pública ainda não foi consultada.`
        : "Todas nascem sem certificado comprovado: importar traz o cadastro, não a conformidade.",
    });
    setOpen(false);
    setTexto("");
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTexto(""); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="size-4" /> Importar planilha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar subcontratados</DialogTitle>
          <DialogDescription>
            Cole as linhas da planilha. Colunas: razão social, CNPJ, vínculo, responsável, telefone, placa do
            implemento. A conferência de duplicidade acontece antes de gravar.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex items-center justify-between gap-2">
            <Label className="text-[11px]" htmlFor="planilha">Conteúdo colado</Label>
            <button
              type="button"
              onClick={() => setTexto(EXEMPLO)}
              className="text-[11px] font-medium text-brand-600 hover:underline"
            >
              Usar exemplo
            </button>
          </div>
          <textarea
            id="planilha"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={6}
            spellCheck={false}
            placeholder={EXEMPLO}
            className="mt-1 flex w-full rounded-md border border-[hsl(200_18%_88%)] bg-white px-3 py-2 font-mono text-[12px] text-[hsl(200_25%_12%)] placeholder:text-[hsl(210_12%_70%)] focus:outline-none focus:border-[hsl(176_60%_55%)] focus:ring-2 focus:ring-[hsl(176_84%_45%_/_0.18)]"
          />
        </div>

        {linhas.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Resumo icon={CircleCheck} tom="ok" n={validas.length} rotulo="prontas para importar" />
              <Resumo icon={CopyX} tom="dup" n={duplicadas.length} rotulo="duplicadas" />
              <Resumo icon={CircleAlert} tom="erro" n={invalidas.length} rotulo="com problema" />
            </div>

            <div className="rounded-lg border border-border-soft overflow-hidden">
              <table className="w-full text-[11.5px]">
                <thead className="bg-bg">
                  <tr className="text-left text-[10px] uppercase tracking-[0.08em] text-fg-muted">
                    <th className="px-2 py-1.5 font-semibold">Linha</th>
                    <th className="px-2 py-1.5 font-semibold">Razão social</th>
                    <th className="px-2 py-1.5 font-semibold">CNPJ</th>
                    <th className="px-2 py-1.5 font-semibold">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((l) => (
                    <tr key={l.linha} className="border-t border-border-soft">
                      <td className="px-2 py-1.5 font-mono text-fg-soft num">{l.linha}</td>
                      <td className="px-2 py-1.5">{l.razaoSocial || <span className="text-fg-soft">—</span>}</td>
                      <td className="px-2 py-1.5 font-mono">{l.cnpj || <span className="text-fg-soft">—</span>}</td>
                      <td
                        className={cn(
                          "px-2 py-1.5",
                          l.duplicada ? "text-warning-700" : l.problema ? "text-danger-700" : "text-success-700"
                        )}
                      >
                        {l.problema ?? "Nova"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" size="sm">Cancelar</Button></DialogClose>
          <Button
            size="sm"
            variant="gradient"
            disabled={!validas.length}
            onClick={importar}
            className={cn(!validas.length && "opacity-50")}
          >
            <FileSpreadsheet className="size-4" /> Importar {validas.length > 0 && <span className="num">{validas.length}</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Resumo({
  icon: Icon,
  tom,
  n,
  rotulo,
}: {
  icon: typeof CircleCheck;
  tom: "ok" | "dup" | "erro";
  n: number;
  rotulo: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-2 flex items-center gap-2",
        tom === "ok" && "border-success-500/30 bg-success-50/60",
        tom === "dup" && "border-warning-500/30 bg-warning-50/60",
        tom === "erro" && "border-danger-500/30 bg-danger-50/60"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          tom === "ok" && "text-success-700",
          tom === "dup" && "text-warning-700",
          tom === "erro" && "text-danger-700"
        )}
        aria-hidden
      />
      <p className="text-[11.5px] leading-tight">
        <span className="num font-bold">{n}</span> {rotulo}
      </p>
    </div>
  );
}
