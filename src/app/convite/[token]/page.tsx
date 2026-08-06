"use client";

// Onboarding público do transportador (diretriz §Gatekeeper, "Onboarding
// simplificado"). Vive FORA de `(app)`: quem abre é um TAC no celular, no
// pátio, sem conta e sem app instalado — sidebar e topbar não fazem sentido.
//
// Regras de baixa fricção do §4: botões grandes, poucos campos por tela,
// mínimo de digitação, conclusão em até cinco minutos.
//
// O que ele cria NUNCA nasce apto: entra como `Pré-cadastrado`, e a
// qualificação continua sendo derivada dos fatos (certificado, base pública,
// acordo, treinamento) como em qualquer outro subcontratado.

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, Check, Truck, IdCard, Building2, ClipboardList,
  Droplets, ShieldCheck, PenLine, PartyPopper,
} from "lucide-react";
import { TraxiumLogo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssinaturaCanvas } from "@/components/gatekeeper/assinatura-canvas";
import { useSession } from "@/lib/store/session";
import { TIPOS_VINCULO, vinculoEhPessoa, produtosIDTF, ORDEM_REGIME, type TipoVinculo, type Regime } from "@/lib/domain/model";
import { cn } from "@/lib/utils";

const PASSOS = [
  { n: 1, titulo: "Quem é você", icon: IdCard },
  { n: 2, titulo: "Vínculo", icon: Building2 },
  { n: 3, titulo: "Veículo", icon: Truck },
  { n: 4, titulo: "Últimas 3 cargas", icon: ClipboardList },
  { n: 5, titulo: "Limpezas", icon: Droplets },
  { n: 6, titulo: "Regras de Feed Safety", icon: ShieldCheck },
];

const REGIMES: Regime[] = ["A", "B", "C", "D"];

export default function ConvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const { addSubcontratadoPreCadastro } = useSession();

  const [passo, setPasso] = useState(1);
  const [enviado, setEnviado] = useState(false);

  // 1 · identificação
  const [nome, setNome] = useState("");
  const [doc, setDoc] = useState("");
  const [tel, setTel] = useState("");
  const [cnh, setCnh] = useState("");
  // 2 · vínculo
  const [vinculo, setVinculo] = useState<TipoVinculo | "">("");
  const [rntrc, setRntrc] = useState("");
  const [contratante, setContratante] = useState("");
  // 3 · veículo
  const [cavalo, setCavalo] = useState("");
  const [implemento, setImplemento] = useState("");
  // 4 · T-3
  const [cargas, setCargas] = useState<{ produto: string; data: string }[]>([
    { produto: "", data: "" },
    { produto: "", data: "" },
    { produto: "", data: "" },
  ]);
  // 5 · limpezas
  const [limpezaRegime, setLimpezaRegime] = useState<Regime | "">("");
  const [limpezaData, setLimpezaData] = useState("");
  // 6 · aceite
  const [aceite, setAceite] = useState(false);
  const [assinatura, setAssinatura] = useState<string | null>(null);

  const pessoa = vinculoEhPessoa(vinculo || undefined);
  const okPasso: Record<number, boolean> = {
    1: nome.trim().length > 2 && doc.trim().length > 8 && tel.trim().length > 8 && cnh.trim().length > 3,
    2: Boolean(vinculo) && (pessoa || contratante.trim().length > 2),
    3: cavalo.trim().length > 6 && implemento.trim().length > 6,
    4: cargas.every((c) => c.produto && c.data),
    5: Boolean(limpezaRegime && limpezaData),
    6: aceite && Boolean(assinatura),
  };

  // O regime da limpeza declarada precisa cobrir o que a carga mais recente
  // exige — a checagem acontece aqui, no ato, não depois no escritório.
  const exigido = (() => {
    const maisRecente = [...cargas].filter((c) => c.produto && c.data).sort((a, b) => b.data.localeCompare(a.data))[0];
    if (!maisRecente) return undefined;
    const p = produtosIDTF.find((x) => x.nomeCanonico === maisRecente.produto);
    return p?.regimeAntesDeFeed;
  })();
  const limpezaInsuficiente =
    Boolean(limpezaRegime && exigido) && ORDEM_REGIME[limpezaRegime as Regime] < ORDEM_REGIME[exigido!];

  function enviar() {
    addSubcontratadoPreCadastro({
      razaoSocial: pessoa ? nome.trim() : contratante.trim() || nome.trim(),
      documento: doc.trim(),
      tipoVinculo: vinculo as TipoVinculo,
      responsavel: nome.trim(),
      telefone: tel.trim(),
      cavaloPlaca: cavalo.trim().toUpperCase(),
      implementoPlaca: implemento.trim().toUpperCase(),
      assinouAceite: true,
    });
    setEnviado(true);
  }

  if (enviado) {
    return (
      <Casca token={token}>
        <div className="flex flex-col items-center py-10 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-success-50">
            <PartyPopper className="size-7 text-success-700" />
          </div>
          <h1 className="text-[22px] font-bold tracking-[-0.015em]">Cadastro enviado</h1>
          <p className="mt-2 max-w-sm text-[13px] text-fg-muted leading-relaxed">
            Você entra como <strong className="text-fg">Pré-cadastrado</strong>. Nada opera ainda: a transportadora
            confere o certificado, o escopo e a base pública GMP+ antes de liberar. Você recebe um aviso no
            WhatsApp quando a qualificação avançar.
          </p>
          <div className="mt-5 w-full max-w-sm rounded-xl border border-border-soft bg-bg p-3.5 text-left">
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-fg-muted">O que falta</p>
            <ul className="mt-1.5 space-y-1 text-[12px] text-fg-muted">
              <li>· Validação do certificado GMP+ e do escopo Road Transport</li>
              <li>· Consulta na base pública GMP+ International</li>
              <li>· Trilhas obrigatórias da Academy</li>
              <li>· Inspeção pré-carregamento do implemento</li>
            </ul>
          </div>
        </div>
      </Casca>
    );
  }

  const PassoIcon = PASSOS[passo - 1].icon;

  return (
    <Casca token={token}>
      {/* Trilho de progresso — seis paradas curtas em vez de um formulário longo */}
      <div className="mb-5 flex items-center gap-1.5">
        {PASSOS.map((p) => (
          <div
            key={p.n}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              p.n < passo ? "bg-brand-500" : p.n === passo ? "bg-brand-600" : "bg-border-soft"
            )}
          />
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <PassoIcon className="size-[18px]" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-muted num">
            Passo {passo} de {PASSOS.length}
          </p>
          <h1 className="text-[19px] font-bold leading-tight tracking-[-0.015em]">{PASSOS[passo - 1].titulo}</h1>
        </div>
      </div>

      <div className="space-y-3.5">
        {passo === 1 && (
          <>
            <Campo label="Nome completo">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como está na CNH" className="h-11 text-[15px]" />
            </Campo>
            <Campo label="CPF ou CNPJ">
              <Input value={doc} onChange={(e) => setDoc(e.target.value)} placeholder="Só números" inputMode="numeric" className="h-11 text-[15px]" />
            </Campo>
            <Campo label="Celular (WhatsApp)">
              <Input value={tel} onChange={(e) => setTel(e.target.value)} placeholder="(00) 00000-0000" inputMode="tel" className="h-11 text-[15px]" />
            </Campo>
            <Campo label="Número da CNH">
              <Input value={cnh} onChange={(e) => setCnh(e.target.value)} inputMode="numeric" className="h-11 text-[15px]" />
            </Campo>
          </>
        )}

        {passo === 2 && (
          <>
            <Campo label="Como você opera">
              <Select value={vinculo} onValueChange={(v) => setVinculo(v as TipoVinculo)}>
                <SelectTrigger className="h-11 text-[15px]"><SelectValue placeholder="Escolha…" /></SelectTrigger>
                <SelectContent>
                  {TIPOS_VINCULO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Campo>
            {!pessoa && vinculo && (
              <Campo label="Razão social da empresa">
                <Input value={contratante} onChange={(e) => setContratante(e.target.value)} className="h-11 text-[15px]" />
              </Campo>
            )}
            <Campo label="RNTRC (se tiver)">
              <Input value={rntrc} onChange={(e) => setRntrc(e.target.value)} placeholder="Opcional" inputMode="numeric" className="h-11 text-[15px]" />
            </Campo>
          </>
        )}

        {passo === 3 && (
          <>
            <Campo label="Placa do cavalo">
              <Input value={cavalo} onChange={(e) => setCavalo(e.target.value.toUpperCase())} placeholder="ABC-1D23" className="h-11 text-[15px] font-mono" />
            </Campo>
            <Campo label="Placa do implemento (carreta)">
              <Input value={implemento} onChange={(e) => setImplemento(e.target.value.toUpperCase())} placeholder="ABC-4E56" className="h-11 text-[15px] font-mono" />
            </Campo>
            <p className="text-[12px] text-fg-muted leading-relaxed">
              O histórico de cargas acompanha o <strong className="text-fg">implemento</strong>, não o cavalo. É a
              carreta que toca o produto.
            </p>
          </>
        )}

        {passo === 4 && (
          <>
            <p className="text-[12px] text-fg-muted leading-relaxed">
              As três últimas cargas que esta carreta transportou, da mais recente para a mais antiga.
            </p>
            {cargas.map((c, i) => (
              <div key={i} className="rounded-xl border border-border-soft p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-muted">
                  T-{i + 1}
                </p>
                <div className="space-y-2">
                  <Select
                    value={c.produto}
                    onValueChange={(v) => setCargas((cs) => cs.map((x, j) => (j === i ? { ...x, produto: v } : x)))}
                  >
                    <SelectTrigger className="h-11 text-[15px]"><SelectValue placeholder="O que carregou…" /></SelectTrigger>
                    <SelectContent>
                      {produtosIDTF.map((p) => <SelectItem key={p.id} value={p.nomeCanonico}>{p.nomeCanonico}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={c.data}
                    onChange={(e) => setCargas((cs) => cs.map((x, j) => (j === i ? { ...x, data: e.target.value } : x)))}
                    className="h-11 text-[15px]"
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {passo === 5 && (
          <>
            <Campo label="Última limpeza realizada">
              <Select value={limpezaRegime} onValueChange={(v) => setLimpezaRegime(v as Regime)}>
                <SelectTrigger className="h-11 text-[15px]"><SelectValue placeholder="Regime…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A · Seco (varrição e aspiração)</SelectItem>
                  <SelectItem value="B">B · Água (lavagem e secagem)</SelectItem>
                  <SelectItem value="C">C · Detergente e enxágue</SelectItem>
                  <SelectItem value="D">D · Desinfecção validada</SelectItem>
                </SelectContent>
              </Select>
            </Campo>
            <Campo label="Data da limpeza">
              <Input type="date" value={limpezaData} onChange={(e) => setLimpezaData(e.target.value)} className="h-11 text-[15px]" />
            </Campo>
            {limpezaInsuficiente && (
              <div className="rounded-xl border border-danger-500/30 bg-danger-50 p-3">
                <p className="text-[13px] font-semibold text-danger-700">
                  Essa limpeza não cobre a última carga
                </p>
                <p className="mt-1 text-[12px] text-danger-700/90 leading-relaxed">
                  A carga que você declarou exige no mínimo o regime{" "}
                  <strong>{exigido}</strong>. Pode enviar assim mesmo — a transportadora vai pedir a limpeza correta
                  antes de liberar o carregamento.
                </p>
              </div>
            )}
            {/* Os regimes ficam visíveis o tempo todo: quem preenche muitas vezes
                não sabe de cor o que cada letra significa. */}
            <div className="rounded-xl bg-bg p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-muted">Escala de limpeza</p>
              <div className="mt-1.5 flex gap-1.5">
                {REGIMES.map((r) => (
                  <span
                    key={r}
                    className={cn(
                      "flex-1 rounded-md py-1 text-center text-[11px] font-bold",
                      limpezaRegime === r ? "bg-brand-600 text-white" : "bg-bg-elev text-fg-muted"
                    )}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {passo === 6 && (
          <>
            <div className="rounded-xl border border-border-soft bg-bg p-3.5">
              <p className="text-[13px] font-semibold text-fg">Compromisso de Feed Safety</p>
              <ul className="mt-2 space-y-1.5 text-[12px] text-fg-muted leading-relaxed">
                <li>· Declaro que as três últimas cargas informadas são verdadeiras.</li>
                <li>· Não carrego alimentação animal sobre resíduo de carga proibida.</li>
                <li>· Executo a limpeza no regime que a IDTF exigir e guardo a evidência.</li>
                <li>· Comunico imediatamente qualquer suspeita de contaminação.</li>
                <li>· Aceito inspeção do compartimento antes do carregamento.</li>
              </ul>
            </div>
            <label className="flex cursor-pointer items-start gap-2.5">
              <Checkbox checked={aceite} onCheckedChange={(v) => setAceite(Boolean(v))} className="mt-0.5" />
              <span className="text-[13px] text-fg">Li e aceito as regras acima</span>
            </label>
            <div>
              <Label className="text-[11px] flex items-center gap-1.5">
                <PenLine className="size-3.5" /> Assinatura
              </Label>
              <AssinaturaCanvas onChange={setAssinatura} className="mt-1.5" />
            </div>
          </>
        )}
      </div>

      {/* Navegação: um botão grande, ação principal por tela */}
      <div className="mt-6 flex items-center gap-2">
        {passo > 1 && (
          <button
            onClick={() => setPasso((p) => p - 1)}
            className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl border border-border px-4 text-[14px] font-semibold text-fg-muted transition-colors hover:bg-bg"
          >
            <ArrowLeft className="size-4" /> Voltar
          </button>
        )}
        {passo < PASSOS.length ? (
          <button
            disabled={!okPasso[passo]}
            onClick={() => setPasso((p) => p + 1)}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-bold text-white transition-opacity",
              okPasso[passo] ? "bg-brand-grad shadow-brand-md" : "bg-fg-soft opacity-50"
            )}
          >
            Continuar <ArrowRight className="size-4" />
          </button>
        ) : (
          <button
            disabled={!okPasso[6]}
            onClick={enviar}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-bold text-white transition-opacity",
              okPasso[6] ? "bg-brand-grad shadow-brand-md" : "bg-fg-soft opacity-50"
            )}
          >
            <Check className="size-4" /> Enviar cadastro
          </button>
        )}
      </div>
    </Casca>
  );
}

function Casca({ token, children }: { token: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border-soft bg-bg-elev">
        <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-3.5">
          <Link href="/" aria-label="Traxium">
            <TraxiumLogo />
          </Link>
          <span className="font-mono text-[10px] text-fg-soft">convite {token.slice(0, 8)}</span>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-5 py-6">{children}</main>
      <footer className="mx-auto max-w-lg px-5 pb-8">
        <p className="text-[11px] leading-relaxed text-fg-soft">
          Seus dados são usados para qualificar o transporte sob a cadeia GMP+ FSA. Coletamos o mínimo necessário e
          o documento fica mascarado nas telas da transportadora.
        </p>
      </footer>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[11px]">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
