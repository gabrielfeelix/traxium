"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Globe2, Truck, BadgeCheck } from "lucide-react";
import { TraxiumLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PerfilSwitcherLogin } from "@/components/shell/perfil-switcher";
import { useSession } from "@/lib/store/session";

export default function LoginPage() {
  const router = useRouter();
  const { aplicarPerfil } = useSession();
  return (
    <div className="min-h-screen flex bg-[hsl(180_14%_97%)]">
      {/* Left side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col p-12 text-white bg-[hsl(195_30%_8%)]">
        {/* Layered backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(180_80%_12%)] via-[hsl(195_30%_8%)] to-[hsl(202_92%_14%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[hsl(176_84%_25%_/_0.25)] via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Decorative big circle */}
        <div className="absolute -right-40 -bottom-40 size-[480px] rounded-full border border-white/[0.06]" />
        <div className="absolute -right-20 -top-20 size-[280px] rounded-full bg-gradient-to-br from-[hsl(176_84%_35%_/_0.15)] to-transparent blur-3xl" />

        <div className="relative z-10">
          <TraxiumLogo variant="light" size={32} />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md">
          <Badge>EXPORTAÇÃO · COMPLIANCE · RASTREABILIDADE</Badge>
          <h1 className="text-[42px] font-bold leading-[1.05] tracking-[-0.02em] mt-6">
            Compliance agrologístico que <span className="text-traxium-light">previne</span>, não apenas registra.
          </h1>
          <p className="mt-5 text-white/70 leading-relaxed text-[15px] max-w-md">
            Plataforma SaaS de rastreabilidade GMP+ FSA e EUDR para transportadoras, tradings e cooperativas que exportam
            commodities do Brasil para o mundo.
          </p>
          <div className="mt-10 space-y-3.5">
            <Feature icon={<ShieldCheck className="size-4" />} text="Motor de regras T-3 com base IDTF oficial do GMP+ FSA" />
            <Feature icon={<Truck className="size-4" />} text="App mobile offline-first para motoristas e tractionairs" />
            <Feature icon={<Globe2 className="size-4" />} text="Gateway M2M com TRACES NT da Comissão Europeia" />
            <Feature icon={<BadgeCheck className="size-4" />} text="Validação cruzada com INPE, MapBiomas e CAR estadual" />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/40">
          <p>© 2026 Traxium · Bom Frete · RD Insight · Weet</p>
          <p>v 1.0 beta</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <div className="lg:hidden mb-8 text-center">
            <TraxiumLogo />
          </div>
          <h2 className="text-[26px] font-bold tracking-[-0.02em] text-[hsl(195_30%_8%)]">Entrar no Traxium</h2>
          <p className="text-[13px] text-[hsl(210_14%_42%)] mt-1">Acesse o painel da sua transportadora.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              aplicarPerfil("gestor");
              router.push("/");
            }}
            className="mt-8 space-y-4"
          >
            <div>
              <Label htmlFor="email" className="text-[12px]">E-mail corporativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@empresa.com.br"
                className="mt-1.5"
                defaultValue="gabriel@traxium.com.br"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="senha" className="text-[12px]">Senha</Label>
                <Link href="#" className="text-[11px] text-[hsl(176_84%_25%)] font-semibold hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <Input id="senha" type="password" placeholder="••••••••••" className="mt-1.5" defaultValue="••••••••••" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="lembrar" defaultChecked />
              <Label htmlFor="lembrar" className="text-[11px] text-[hsl(210_14%_42%)]">
                Manter sessão ativa por 30 dias
              </Label>
            </div>
            <Button type="submit" variant="gradient" size="lg" className="w-full mt-2">
              Entrar como Gestor
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[hsl(200_18%_92%)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[hsl(180_14%_97%)] px-3 text-[10px] uppercase tracking-[0.14em] text-[hsl(210_14%_42%)] font-semibold">
                ou entre como (demonstração)
              </span>
            </div>
          </div>

          <p className="mb-4 text-[12px] leading-relaxed text-[hsl(210_14%_42%)]">
            O sistema <strong className="text-[hsl(195_30%_20%)]">muda inteiramente</strong> conforme quem entra.
            Escolha um perfil — o Traxium roteia para a superfície certa (Console, Back-office, App de campo, Portal ou Visão do auditor).
          </p>

          <PerfilSwitcherLogin />

          <p className="text-[12px] text-[hsl(210_14%_42%)] mt-8 text-center">
            Quer testar o Traxium?{" "}
            <Link href="#" className="font-semibold text-[hsl(176_84%_25%)] hover:underline">
              Falar com o time comercial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-white/70 uppercase">
      <span className="size-1 rounded-full bg-[hsl(176_84%_55%)] animate-pulse" />
      {children}
    </span>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 text-[hsl(176_84%_55%)]">
        {icon}
      </div>
      <span className="text-[13px] text-white/85 leading-snug mt-1">{text}</span>
    </div>
  );
}
