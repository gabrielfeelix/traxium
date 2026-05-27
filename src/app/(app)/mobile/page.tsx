"use client";

import { useState } from "react";
import {
  Smartphone,
  Truck,
  Camera,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Bell,
  Signal,
  Battery,
  Wifi,
  ArrowLeft,
  AlertTriangle,
  Phone,
  Sparkles,
  Hand,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Screen = "login" | "home" | "viagem" | "checklist" | "foto" | "bloqueio";

export default function MobilePreviewPage() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Preview · App do motorista"
        description="Simulação interativa do app mobile offline-first. Interface otimizada para motoristas e tractionairs subcontratados com baixo letramento digital, uso em condições adversas e operação sem internet."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Phone mockup */}
        <div className="lg:col-span-7 flex justify-center items-start">
          <div className="relative">
            {/* Phone shadow */}
            <div className="absolute -inset-6 bg-gradient-to-br from-[hsl(176_84%_25%_/_0.1)] to-[hsl(200_92%_30%_/_0.05)] rounded-[60px] blur-3xl" />

            {/* Phone frame */}
            <div className="relative w-[370px] h-[760px] rounded-[44px] bg-[hsl(195_30%_6%)] p-[14px] shadow-brand-lg ring-1 ring-black/20">
              {/* Buttons on side */}
              <div className="absolute -left-[3px] top-32 w-1 h-12 bg-[hsl(195_30%_10%)] rounded-l" />
              <div className="absolute -left-[3px] top-48 w-1 h-20 bg-[hsl(195_30%_10%)] rounded-l" />
              <div className="absolute -left-[3px] top-72 w-1 h-20 bg-[hsl(195_30%_10%)] rounded-l" />
              <div className="absolute -right-[3px] top-44 w-1 h-28 bg-[hsl(195_30%_10%)] rounded-r" />

              {/* Dynamic island / notch */}
              <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-full z-20" />

              {/* Screen */}
              <div className="w-full h-full rounded-[32px] overflow-hidden bg-white relative">
                {/* Status bar */}
                <div className="absolute top-0 left-0 right-0 h-[44px] flex items-center justify-between px-7 pt-3 text-[11px] font-semibold z-10">
                  <span className="num">09:42</span>
                  <div className="flex items-center gap-1">
                    <Signal className="size-3" />
                    <Wifi className="size-3" />
                    <Battery className="size-3.5" />
                  </div>
                </div>

                <div className="h-full pt-[44px]">
                  {screen === "home" && <HomeScreen onSelect={setScreen} />}
                  {screen === "viagem" && <ViagemScreen onBack={() => setScreen("home")} onChecklist={() => setScreen("checklist")} />}
                  {screen === "checklist" && <ChecklistScreen onBack={() => setScreen("viagem")} onFoto={() => setScreen("foto")} />}
                  {screen === "foto" && <FotoScreen onBack={() => setScreen("checklist")} />}
                  {screen === "bloqueio" && <BloqueioScreen onBack={() => setScreen("home")} />}
                  {screen === "login" && <LoginScreen onLogin={() => setScreen("home")} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navegação do simulador</CardTitle>
              <CardDescription>Explore as 6 principais telas do app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <ScreenButton active={screen === "login"} onClick={() => setScreen("login")} icon={<Smartphone className="size-4" />} label="Login do motorista" />
              <ScreenButton active={screen === "home"} onClick={() => setScreen("home")} icon={<Truck className="size-4" />} label="Início · Viagens" />
              <ScreenButton active={screen === "viagem"} onClick={() => setScreen("viagem")} icon={<MapPin className="size-4" />} label="Detalhe da viagem" />
              <ScreenButton active={screen === "checklist"} onClick={() => setScreen("checklist")} icon={<CheckCircle2 className="size-4" />} label="Checklist LCI" />
              <ScreenButton active={screen === "foto"} onClick={() => setScreen("foto")} icon={<Camera className="size-4" />} label="Captura de foto com GPS" />
              <ScreenButton active={screen === "bloqueio"} onClick={() => setScreen("bloqueio")} icon={<AlertTriangle className="size-4" />} label="Bloqueio com instruções" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Hand className="size-4 text-[hsl(176_84%_25%)]" />
                <CardTitle>Princípios de UX mobile</CardTitle>
              </div>
              <CardDescription>Decisões de design para o público real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { t: "Offline-first", d: "Funciona em sinal fraco. Sincroniza quando volta a rede." },
                { t: "Hierarquia simples", d: "Uma ação principal por tela. Botão grande, contraste alto." },
                { t: "Texto reduzido", d: "Ícones, fotos e cor explicam mais do que palavras." },
                { t: "Foto + GPS automáticos", d: "Geolocalização e timestamp embarcados, anti-fraude." },
                { t: "Bloqueio explicativo", d: "Sempre que bloquear, mostra o porquê e o que fazer." },
                { t: "Sem dependência de digitação", d: "Seletores e toques no lugar de inputs de texto." },
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-md border border-[hsl(200_18%_92%)]">
                  <div className="size-5 rounded-full bg-[hsl(174_64%_94%)] text-[hsl(180_80%_18%)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 num">
                    {i + 1}
                  </div>
                  <div className="text-[12px]">
                    <p className="font-semibold text-[hsl(195_30%_8%)]">{p.t}</p>
                    <p className="text-[hsl(210_14%_42%)] mt-0.5 leading-snug">{p.d}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ScreenButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-md text-left transition-all w-full",
        active
          ? "bg-gradient-to-r from-[hsl(176_84%_25%)] to-[hsl(200_92%_28%)] text-white shadow-brand-sm"
          : "hover:bg-[hsl(174_64%_97%)] border border-[hsl(200_18%_92%)]"
      )}
    >
      <span className={cn(active ? "text-white" : "text-[hsl(176_84%_25%)]")}>{icon}</span>
      <span className="text-[13px] font-medium flex-1">{label}</span>
      <ChevronRight className={cn("size-4", active ? "text-white" : "text-[hsl(210_12%_70%)]")} />
    </button>
  );
}

/* === SCREENS === */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[hsl(180_80%_18%)] via-[hsl(176_84%_22%)] to-[hsl(200_92%_24%)] text-white p-7 pt-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 size-64 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl" />
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div className="relative flex-1 flex flex-col justify-center">
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-5 shadow-xl">
          <Truck className="size-9 text-white" />
        </div>
        <h2 className="text-[22px] font-bold text-center tracking-tight">Traxium Motorista</h2>
        <p className="text-[13px] text-white/70 text-center mt-1">Entre com seu CPF e senha</p>
        <div className="space-y-3 mt-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/60 font-bold mb-1.5">CPF</p>
            <div className="bg-white/[0.08] backdrop-blur-md rounded-xl p-3.5 text-[15px] font-mono border border-white/[0.08]">
              000.000.000-00
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/60 font-bold mb-1.5">Senha</p>
            <div className="bg-white/[0.08] backdrop-blur-md rounded-xl p-3.5 text-[18px] font-mono border border-white/[0.08]">
              ••••••
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onLogin}
        className="relative w-full bg-white text-[hsl(180_80%_18%)] font-bold py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-transform"
      >
        Entrar
      </button>
      <p className="relative text-[10px] text-white/50 text-center mt-3 uppercase tracking-[0.14em] font-semibold">
        v 1.0 · Modo offline disponível
      </p>
    </div>
  );
}

function HomeScreen({ onSelect }: { onSelect: (s: Screen) => void }) {
  return (
    <div className="h-full overflow-y-auto bg-[hsl(180_14%_97%)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[hsl(180_80%_18%)] to-[hsl(200_92%_24%)] text-white p-5 pb-7 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 size-44 rounded-full bg-white/[0.06] blur-2xl" />
        <div className="relative flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/55 font-bold">Bom dia</p>
            <p className="text-[18px] font-bold mt-0.5 tracking-tight">Edivaldo Souza</p>
          </div>
          <button className="size-10 rounded-full bg-white/[0.08] backdrop-blur-md flex items-center justify-center relative border border-white/[0.08]">
            <Bell className="size-[18px]" />
            <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-[hsl(0_78%_55%)] text-[9px] font-bold flex items-center justify-center num shadow-md">
              3
            </span>
          </button>
        </div>
        <div className="relative grid grid-cols-3 gap-2">
          <Mini label="Viagens" value="3" />
          <Mini label="Conformidade" value="96%" />
          <Mini label="Treinamentos" value="OK" />
        </div>
      </div>

      <div className="p-4 -mt-4 relative z-10 space-y-4">
        {/* Active trip */}
        <div className="bg-white rounded-2xl shadow-brand-md border-2 border-[hsl(176_60%_70%)] p-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 size-20 rounded-full bg-gradient-to-br from-[hsl(174_64%_94%)] to-transparent" />
          <div className="relative flex items-center gap-2 mb-2">
            <div className="size-8 rounded-md bg-gradient-to-br from-[hsl(176_84%_25%)] to-[hsl(200_92%_28%)] text-white flex items-center justify-center">
              <Truck className="size-4" />
            </div>
            <div className="flex-1">
              <p className="font-mono text-[10px] text-[hsl(210_14%_42%)] font-semibold">TX-2026-08471</p>
              <p className="text-[15px] font-bold">Viagem ativa</p>
            </div>
            <Badge variant="default" className="text-[9px]">Em trânsito</Badge>
          </div>
          <p className="relative text-[12px] text-[hsl(210_14%_42%)]">Sorriso/MT → Santos/SP · 1.840 km</p>
          <div className="relative mt-2 p-2 rounded-lg bg-[hsl(174_64%_97%)] text-[11px] text-[hsl(180_80%_18%)]">
            <strong>Próxima ação:</strong> Checklist de descarregamento ao chegar
          </div>
          <button
            onClick={() => onSelect("viagem")}
            className="w-full mt-3 bg-gradient-to-r from-[hsl(176_84%_25%)] to-[hsl(200_92%_28%)] text-white font-bold py-3 rounded-xl text-[13px] shadow-brand-sm active:scale-[0.98] transition-transform"
          >
            Abrir viagem
          </button>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[hsl(210_14%_42%)] mb-2 px-1">
            Próximas viagens
          </p>
          <div className="space-y-2">
            {[
              { c: "TX-2026-08489", de: "Lucas do Rio Verde/MT", para: "Itaqui/MA", dia: "Amanhã 06:30" },
              { c: "TX-2026-08502", de: "Sorriso/MT", para: "Paranaguá/PR", dia: "29/05 07:00" },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-xl border border-[hsl(200_18%_92%)] p-3">
                <p className="font-mono text-[10px] text-[hsl(210_14%_42%)] font-semibold">{v.c}</p>
                <p className="text-[13px] font-semibold mt-0.5">
                  {v.de} → {v.para}
                </p>
                <p className="text-[11px] text-[hsl(210_14%_42%)] mt-0.5 num">{v.dia}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.1] backdrop-blur-md rounded-lg p-2 text-center border border-white/[0.06]">
      <p className="text-[9px] uppercase tracking-[0.12em] text-white/60 font-bold">{label}</p>
      <p className="text-[16px] font-bold mt-0.5 num">{value}</p>
    </div>
  );
}

function ViagemScreen({ onBack, onChecklist }: { onBack: () => void; onChecklist: () => void }) {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="bg-gradient-to-br from-[hsl(180_80%_18%)] to-[hsl(200_92%_24%)] text-white p-5 relative">
        <button onClick={onBack} className="text-white/80 mb-3 flex items-center gap-1 text-[12px] font-semibold">
          <ArrowLeft className="size-4" /> Voltar
        </button>
        <p className="font-mono text-[11px] text-white/70 font-semibold">TX-2026-08471</p>
        <h2 className="text-[20px] font-bold mt-1 tracking-tight">Soja em grão · 30t</h2>
        <p className="text-[13px] text-white/85 mt-1">Sorriso/MT → Santos/SP · <span className="num">1.840 km</span></p>
      </div>
      <div className="p-4 space-y-3">
        <div className="rounded-xl border-2 border-[hsl(28_92%_55%)] bg-[hsl(36_95%_98%)] p-3.5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 size-20 rounded-full bg-[hsl(28_92%_92%)]" />
          <div className="relative flex items-center gap-2 mb-1">
            <AlertTriangle className="size-4 text-[hsl(24_88%_32%)]" />
            <p className="text-[13px] font-bold text-[hsl(24_88%_32%)]">Ação obrigatória antes de carregar</p>
          </div>
          <p className="relative text-[12px] text-[hsl(24_88%_32%)] mt-1.5">
            Última carga: <strong>NPK Fertilizante</strong>. Regime de limpeza <strong>C</strong> exigido pela IDTF.
          </p>
          <button
            onClick={onChecklist}
            className="relative w-full mt-3 bg-[hsl(28_92%_48%)] text-white font-bold py-3 rounded-lg text-[13px] shadow-md active:scale-[0.98] transition-transform"
          >
            Iniciar checklist agora
          </button>
        </div>

        <InfoRow label="Cavalo · Carreta" value="OZE-4A82 · PHC-2B17" mono />
        <InfoRow
          label="Origem"
          value="Fazenda Boa Esperança"
          sub="CAR validado · Risco EUDR: Baixo"
        />
        <InfoRow label="Destino" value="Porto de Santos" sub="ETA: 28/05 18:00" />

        <div className="rounded-xl bg-[hsl(200_18%_96%)] p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[hsl(210_14%_42%)] font-bold">Despachante</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[14px] font-bold">Joana Almeida</p>
            <button className="size-9 rounded-full bg-[hsl(142_71%_36%)] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
              <Phone className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, sub, mono }: { label: string; value: string; sub?: string; mono?: boolean }) {
  return (
    <div className="rounded-xl bg-[hsl(200_18%_96%)] p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-[hsl(210_14%_42%)] font-bold">{label}</p>
      <p className={cn("text-[14px] font-bold mt-0.5", mono && "font-mono text-[13px]")}>{value}</p>
      {sub && <p className="text-[11px] text-[hsl(210_14%_42%)] mt-0.5">{sub}</p>}
    </div>
  );
}

function ChecklistScreen({ onBack, onFoto }: { onBack: () => void; onFoto: () => void }) {
  const items = [
    { ok: true, t: "Compartimento varrido e seco" },
    { ok: true, t: "Sem resíduos visíveis (>1cm)" },
    { ok: true, t: "Lavagem com água sob pressão" },
    { ok: false, t: "Aplicação de detergente neutro" },
    { ok: false, t: "Enxágue completo" },
    { ok: false, t: "Foto pré-carregamento" },
    { ok: false, t: "Assinatura digital" },
  ];
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="bg-gradient-to-br from-[hsl(180_80%_18%)] to-[hsl(200_92%_24%)] text-white p-5 relative">
        <button onClick={onBack} className="text-white/80 mb-2 flex items-center gap-1 text-[12px] font-semibold">
          <ArrowLeft className="size-4" /> Voltar
        </button>
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/70 font-bold">Regime C · Detergente</p>
        <h2 className="text-[18px] font-bold mt-1">Checklist de limpeza</h2>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-2 bg-white/15 rounded-full overflow-hidden">
            <div className="h-full bg-white shadow-md" style={{ width: "43%" }} />
          </div>
          <span className="text-[12px] font-bold num">3 / 7</span>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
              item.ok ? "border-[hsl(142_60%_75%)] bg-[hsl(142_65%_97%)]" : "border-[hsl(200_18%_88%)] bg-white"
            )}
          >
            <div
              className={cn(
                "size-8 rounded-full flex items-center justify-center shrink-0",
                item.ok
                  ? "bg-[hsl(142_71%_36%)] text-white shadow-md"
                  : "bg-[hsl(200_18%_94%)] border-2 border-[hsl(200_18%_75%)]"
              )}
            >
              {item.ok && <CheckCircle2 className="size-4" />}
            </div>
            <p className={cn("text-[13px] font-medium flex-1", item.ok && "text-[hsl(142_71%_24%)]")}>{item.t}</p>
          </div>
        ))}
        <button
          onClick={onFoto}
          className="w-full mt-2 bg-gradient-to-r from-[hsl(176_84%_25%)] to-[hsl(200_92%_28%)] text-white font-bold py-3.5 rounded-xl text-[13px] flex items-center justify-center gap-2 shadow-brand-md active:scale-[0.98] transition-transform"
        >
          <Camera className="size-4" /> Próximo passo
        </button>
      </div>
    </div>
  );
}

function FotoScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-black flex flex-col">
      <div className="absolute top-[44px] left-0 right-0 z-10 p-4 flex items-center justify-between text-white">
        <button
          onClick={onBack}
          className="size-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <ArrowLeft className="size-4" />
        </button>
        <p className="text-[13px] font-bold">Foto · Compartimento limpo</p>
        <div className="size-9" />
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(28_30%_30%)] via-[hsl(40_35%_45%)] to-[hsl(34_25%_38%)]" />
        {/* Suggestion of metal/dust texture */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2), transparent 40%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2), transparent 50%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-2 border-white/40 border-dashed rounded-xl w-[280px] h-[200px] flex items-center justify-center">
            <p className="text-white/70 text-[11px] font-medium">Enquadre o compartimento</p>
          </div>
        </div>

        <div className="absolute top-[100px] left-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-3 text-white border border-white/[0.08]">
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 text-[hsl(176_84%_55%)] animate-pulse" />
            <p className="text-[10px] font-mono num">-12.5447, -55.7211 · ±3m</p>
            <span className="ml-auto text-[10px] font-mono num">09:42:18</span>
          </div>
          <p className="text-[10px] text-white/70 mt-1 leading-tight">
            GPS bloqueado · Anti-fraude ativo · Watermark automático
          </p>
        </div>
      </div>

      <div className="p-6 pb-10 bg-black flex items-center justify-around">
        <button className="size-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10">
          <Sparkles className="size-5" />
        </button>
        <button className="size-20 rounded-full border-4 border-white flex items-center justify-center shadow-2xl">
          <div className="size-14 rounded-full bg-white" />
        </button>
        <button className="size-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10">
          <Camera className="size-5" />
        </button>
      </div>
    </div>
  );
}

function BloqueioScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto">
      <div className="bg-gradient-to-br from-[hsl(0_78%_50%)] to-[hsl(0_70%_38%)] text-white p-5 relative">
        <button onClick={onBack} className="text-white/80 mb-2 flex items-center gap-1 text-[12px] font-semibold">
          <ArrowLeft className="size-4" /> Voltar
        </button>
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto my-3 shadow-xl border border-white/[0.08]">
          <AlertTriangle className="size-9" />
        </div>
        <h2 className="text-[20px] font-bold text-center tracking-tight">Carregamento bloqueado</h2>
        <p className="text-[13px] text-white/80 text-center mt-1">Você não pode carregar agora</p>
      </div>
      <div className="p-4 flex-1 space-y-3">
        <div className="rounded-xl bg-[hsl(0_72%_97%)] border-2 border-[hsl(0_72%_85%)] p-3.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[hsl(0_70%_28%)] font-bold mb-1.5">Por quê?</p>
          <p className="text-[13px] text-[hsl(0_70%_28%)] leading-relaxed">
            A carreta <strong className="font-mono">MNB-7D29</strong> levou <strong>defensivo agrícola líquido</strong>{" "}
            na última viagem. Para carregar <strong>farelo de soja</strong> agora, o sistema exige{" "}
            <strong>limpeza Regime D</strong> (desinfecção completa).
          </p>
        </div>

        <div className="rounded-xl bg-[hsl(174_64%_97%)] border-2 border-[hsl(176_60%_70%)] p-3.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[hsl(180_80%_18%)] font-bold mb-2.5">
            O que fazer agora?
          </p>
          <ol className="space-y-2 text-[13px] text-[hsl(180_80%_18%)]">
            {[
              "Procure um ponto de lavagem certificado",
              "Faça a desinfecção completa (Regime D)",
              "Preencha o checklist no app com fotos",
              "O sistema vai liberar automaticamente",
            ].map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="size-5 rounded-full bg-[hsl(180_80%_18%)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 num">
                  {i + 1}
                </span>
                <span className="flex-1">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <button className="w-full bg-gradient-to-r from-[hsl(176_84%_25%)] to-[hsl(200_92%_28%)] text-white font-bold py-3.5 rounded-xl text-[13px] shadow-brand-md flex items-center justify-center gap-2">
          <MapPin className="size-4" /> Ver pontos de lavagem próximos
        </button>
        <button className="w-full bg-white border-2 border-[hsl(200_18%_85%)] text-[hsl(195_30%_8%)] font-bold py-3 rounded-xl text-[13px] flex items-center justify-center gap-2">
          <Phone className="size-4" /> Falar com despachante
        </button>
      </div>
    </div>
  );
}
