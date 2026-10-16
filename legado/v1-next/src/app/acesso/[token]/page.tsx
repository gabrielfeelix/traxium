"use client";

import { use, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { TraxiumLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convitesAcesso, TIPO_ACESSO_LABEL, type TipoAcessoExterno } from "@/lib/domain/access";
import { useSession } from "@/lib/store/session";

export default function AtivarAcessoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const search = useSearchParams();
  const { moverConviteAcesso } = useSession();
  const convite = convitesAcesso.find((c) => c.token === token);
  const tipoQuery = search.get("tipo");
  const tipo: TipoAcessoExterno = convite?.tipo ?? (tipoQuery === "portal_subcontratado" ? tipoQuery : "app_motorista");
  const nome = convite?.nome ?? search.get("nome") ?? "Convidado";
  const indisponivel = convite?.estado === "revogado" || convite?.estado === "expirado";
  const [identificador, setIdentificador] = useState(convite?.destinatario ?? "");
  const [aceite, setAceite] = useState(false);
  const [ativado, setAtivado] = useState(convite?.estado === "concluido");

  function ativar() {
    if (convite) moverConviteAcesso(token, "concluir");
    setAtivado(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-elev p-6 shadow-xl">
        <TraxiumLogo />
        {indisponivel ? (
          <div className="mt-8 text-center">
            <ShieldCheck className="mx-auto size-10 text-warning-600" />
            <h1 className="mt-3 text-xl font-bold">Convite indisponível</h1>
            <p className="mt-2 text-[13px] text-fg-muted">Este convite foi {convite?.estado === "revogado" ? "revogado" : "expirado"}. Solicite um novo acesso.</p>
          </div>
        ) : ativado ? (
          <div className="mt-8 text-center">
            <CheckCircle2 className="mx-auto size-11 text-success-600" />
            <h1 className="mt-3 text-xl font-bold">Acesso ativado</h1>
            <p className="mt-2 text-[13px] text-fg-muted">{nome} agora pode entrar no {TIPO_ACESSO_LABEL[tipo]}. No produto real, o próximo passo é definir a senha ou validar o código recebido.</p>
          </div>
        ) : (
          <>
            <div className="mt-7 flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><KeyRound className="size-5" /></span>
              <div>
                <h1 className="text-xl font-bold">Ativar acesso</h1>
                <p className="mt-1 text-[13px] text-fg-muted">{nome} · {TIPO_ACESSO_LABEL[tipo]}</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <Label className="text-[11px]">Telefone ou e-mail</Label>
                <Input value={identificador} onChange={(e) => setIdentificador(e.target.value)} className="mt-1 h-11" />
              </div>
              <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 text-[12px] text-fg-muted">
                <Checkbox checked={aceite} onCheckedChange={(v) => setAceite(Boolean(v))} />
                <span>Confirmo minha identidade e aceito usar este acesso somente para a operação atribuída.</span>
              </label>
              <Button variant="gradient" className="w-full" disabled={!identificador.trim() || !aceite} onClick={ativar}>Ativar acesso</Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
