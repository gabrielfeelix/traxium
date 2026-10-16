"use client";

// Operação em massa sobre subcontratados (Fase 9.4).
//
// Três ações, e nenhuma delas finge ter feito mais do que fez:
//   · renovar acordo → renova de verdade, e só quem precisa (≤60 dias ou vencido).
//     O acordo renovado volta NÃO ASSINADO: renovar é emitir a nova versão, não
//     colher assinatura, e o estado da empresa cai para pendente documental até
//     alguém assinar. É o comportamento certo, mesmo sendo o incômodo.
//   · atribuir trilha → cria pendência nominal por motorista vinculado. Atribuir
//     não é concluir, e competência continua vindo da avaliação.
//   · alertar → registra o disparo com destinatário, canal e remetente. Não
//     simula entrega nem leitura, porque disso o protótipo não sabe nada.

import { useState } from "react";
import { Send, Handshake, GraduationCap, Bell } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  subcontratados, motoristasDoSubcontratado, diasEntre, HOJE,
  TIPO_NOTIFICACAO_LABEL, type TipoNotificacao,
} from "@/lib/domain/model";
import { TRILHAS } from "@/lib/domain/academy";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type Acao = "acordo" | "trilha" | "alerta";

export function AcoesMassaModal({ ids }: { ids: string[] }) {
  const { renovarAcordos, atribuirTrilhaEmMassa, enviarAlerta } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [acao, setAcao] = useState<Acao>("acordo");
  const [trilhaId, setTrilhaId] = useState(TRILHAS[0].id);
  const [tipoAlerta, setTipoAlerta] = useState<TipoNotificacao>("certificado");
  const [mensagem, setMensagem] = useState("");

  const selecionados = subcontratados.filter((s) => ids.includes(s.id));
  // Quantos a ação REALMENTE atinge — o botão não promete mais do que fará.
  const alvosAcordo = selecionados.filter(
    (s) => s.acordo && diasEntre(HOJE, s.acordo.vigenciaFim) <= 60
  ).length;
  const alvosMotoristas = selecionados.reduce((n, s) => n + motoristasDoSubcontratado(s.id).length, 0);

  function executar() {
    if (acao === "acordo") {
      const r = renovarAcordos(ids);
      toast(`${r.renovados} acordo(s) renovado(s)`, {
        type: r.renovados ? "success" : "info",
        desc: r.renovados
          ? `Nova vigência de 12 meses, sem assinatura: até alguém assinar, a empresa fica pendente documental. ${r.ignorados} ignorada(s).`
          : "Nenhuma das selecionadas tem acordo vencido ou a menos de 60 dias do fim.",
      });
    } else if (acao === "trilha") {
      const r = atribuirTrilhaEmMassa(ids, trilhaId);
      toast(`${r.atribuidas} atribuição(ões) criada(s)`, {
        type: r.atribuidas ? "success" : "info",
        desc: r.jaVigentes
          ? `${r.jaVigentes} motorista(s) já tinham a trilha vigente e ficaram de fora. Atribuir não gera competência — a avaliação gera.`
          : "Atribuir não gera competência: a pendência aparece até a conclusão ser registrada.",
      });
    } else {
      const n = enviarAlerta(ids, tipoAlerta, mensagem.trim() || TIPO_NOTIFICACAO_LABEL[tipoAlerta]);
      toast(`${n} alerta(s) registrado(s)`, {
        type: "success",
        desc: "O registro guarda destinatário, canal, remetente e data. Entrega e leitura não são simuladas.",
      });
    }
    setOpen(false);
  }

  const podeExecutar = acao !== "alerta" || mensagem.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="gradient" disabled={!ids.length}>
          <Send className="size-4" /> Ação em massa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ação em massa</DialogTitle>
          <DialogDescription>
            <span className="num">{ids.length}</span> empresa(s) selecionada(s).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Opcao atual={acao} valor="acordo" onClick={setAcao} icon={Handshake} rotulo="Renovar acordo" />
            <Opcao atual={acao} valor="trilha" onClick={setAcao} icon={GraduationCap} rotulo="Atribuir trilha" />
            <Opcao atual={acao} valor="alerta" onClick={setAcao} icon={Bell} rotulo="Alertar" />
          </div>

          {acao === "acordo" && (
            <p className="text-[12px] text-fg-muted leading-relaxed rounded-lg border border-border-soft bg-bg p-3">
              <span className="num font-semibold text-fg">{alvosAcordo}</span> de{" "}
              <span className="num">{ids.length}</span> têm acordo vencido ou a menos de 60 dias do fim — só essas
              serão renovadas. As demais ficam como estão: renovar cedo demais só reinicia o relógio sem ninguém reler
              o termo.
            </p>
          )}

          {acao === "trilha" && (
            <>
              <div>
                <Label className="text-[11px]">Trilha</Label>
                <Select value={trilhaId} onValueChange={setTrilhaId}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TRILHAS.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.codigo} · {t.titulo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-[12px] text-fg-muted leading-relaxed rounded-lg border border-border-soft bg-bg p-3">
                Atinge <span className="num font-semibold text-fg">{alvosMotoristas}</span> motorista(s) vinculado(s)
                às empresas selecionadas. Quem já tem a trilha vigente fica de fora.
              </p>
            </>
          )}

          {acao === "alerta" && (
            <>
              <div>
                <Label className="text-[11px]">Assunto</Label>
                <Select value={tipoAlerta} onValueChange={(v) => setTipoAlerta(v as TipoNotificacao)}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TIPO_NOTIFICACAO_LABEL) as TipoNotificacao[]).map((t) => (
                      <SelectItem key={t} value={t}>{TIPO_NOTIFICACAO_LABEL[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px]" htmlFor="msg-alerta">Mensagem</Label>
                <Input
                  id="msg-alerta"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="O que a empresa precisa fazer, e até quando."
                  className="h-9 mt-1"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" size="sm">Cancelar</Button></DialogClose>
          <Button size="sm" variant="gradient" disabled={!podeExecutar} onClick={executar} className={cn(!podeExecutar && "opacity-50")}>
            <Send className="size-4" /> Executar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Opcao({
  atual,
  valor,
  onClick,
  icon: Icon,
  rotulo,
}: {
  atual: Acao;
  valor: Acao;
  onClick: (a: Acao) => void;
  icon: typeof Handshake;
  rotulo: string;
}) {
  const ativo = atual === valor;
  return (
    <button
      type="button"
      onClick={() => onClick(valor)}
      className={cn(
        "rounded-lg border p-2.5 text-left transition-colors",
        ativo ? "border-brand-500 bg-brand-50" : "border-border-soft bg-bg hover:bg-brand-50/40"
      )}
    >
      <Icon className={cn("size-4 mb-1", ativo ? "text-brand-700" : "text-fg-muted")} aria-hidden />
      <p className={cn("text-[11.5px] font-semibold leading-tight", ativo ? "text-brand-700" : "text-fg")}>{rotulo}</p>
    </button>
  );
}
