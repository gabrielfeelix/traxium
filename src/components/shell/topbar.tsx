"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Settings, User, HelpCircle, Sparkles, Building2, Check, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { notificacoes, filiais, findFilial, FILIAL_TODAS } from "@/lib/mock-data";
import { CommandPalette } from "@/components/shell/command-palette";
import { PerfilModal, PreferenciasModal, AjudaModal, CopilotModal } from "@/components/shell/header-modals";
import { useToast } from "@/components/ui/toast";
import { useSession } from "@/lib/store/session";
import { PERFIL_POR_ID } from "@/lib/domain/model";
import { PerfilSwitcherMenuItems } from "@/components/shell/perfil-switcher";
import { cn } from "@/lib/utils";

export function Topbar() {
  const router = useRouter();
  const { toast } = useToast();
  const { perfilId, filialId, setFilial, impersonating } = useSession();
  const [unread, setUnread] = useState(notificacoes.filter((n) => !n.lida).length);
  const [perfil, setPerfil] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [ajuda, setAjuda] = useState(false);
  const [copilot, setCopilot] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") { e.preventDefault(); setCopilot((o) => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const initials = (name: string) => name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const tenantNome = impersonating?.tenantName ?? "Bom Frete Transportes";
  const filialAtiva = filialId === FILIAL_TODAS ? "Todas as filiais" : findFilial(filialId)?.nome ?? "Filial";

  return (
    <header className="sticky top-0 z-30 h-[60px] border-b border-[hsl(200_18%_90%)] bg-[hsl(0_0%_100%_/_0.78)] backdrop-blur-xl">
      <div className="flex h-full items-center gap-3 px-5">
        {/* Filial switcher — troca de FILIAL dentro do tenant (§5), NÃO de transportadora.
            Selecionar re-escopa o dado (viagens, KPIs), não só o rótulo. */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-2.5 rounded-lg border border-[hsl(200_18%_90%)] bg-white px-2.5 py-1.5 hover:border-[hsl(176_60%_50%)] hover:shadow-brand-sm transition-all">
              <div className="size-7 rounded-md bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_28%)] flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                {initials(tenantNome)}
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-[0.12em] text-[hsl(210_14%_42%)] font-semibold leading-none">Filial ativa</p>
                <p className="text-[13px] font-semibold leading-tight mt-0.5">{filialAtiva}</p>
              </div>
              <ChevronDown className="size-3.5 text-[hsl(210_14%_42%)] group-hover:text-[hsl(176_84%_25%)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            <DropdownMenuLabel className="flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[hsl(210_14%_42%)]" /> {tenantNome} · filiais
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => { setFilial(FILIAL_TODAS); toast("Filial: Todas", { type: "info", desc: "Visão matriz consolidada." }); }}
              className={cn("flex items-center gap-2.5 py-2.5", filialId === FILIAL_TODAS && "bg-[hsl(174_64%_96%)]")}
            >
              <Check className={cn("size-4", filialId === FILIAL_TODAS ? "opacity-100 text-[hsl(176_84%_25%)]" : "opacity-0")} />
              <span className="font-semibold text-[13px]">Todas as filiais</span>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-[hsl(210_14%_45%)]">matriz</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {filiais.map((f) => (
              <DropdownMenuItem
                key={f.id}
                onClick={() => { setFilial(f.id); toast(`Filial: ${f.nome}`, { type: "info", desc: "Dados re-escopados para esta filial." }); }}
                className={cn("flex items-center gap-2.5 py-2.5", filialId === f.id && "bg-[hsl(174_64%_96%)]")}
              >
                <Check className={cn("size-4", filialId === f.id ? "opacity-100 text-[hsl(176_84%_25%)]" : "opacity-0")} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13px] truncate">{f.nome}</p>
                  <p className="text-[11px] text-[hsl(210_14%_42%)]">{f.cidade}/{f.uf}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Command palette (busca ⌘K) */}
        <CommandPalette />

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => setCopilot(true)} className="hidden lg:flex h-9 gap-1.5 border-[hsl(176_60%_75%)] text-[hsl(176_84%_25%)] hover:bg-[hsl(174_64%_96%)]">
            <Sparkles className="size-3.5" /> Copilot
            <kbd className="ml-1 inline-flex h-4 items-center rounded border border-[hsl(176_60%_75%)] bg-white px-1 text-[9px] font-semibold num">⌘J</kbd>
          </Button>

          <div className="w-px h-6 bg-[hsl(200_18%_90%)] mx-1" />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative size-9 rounded-md hover:bg-[hsl(200_18%_94%)] flex items-center justify-center transition-colors">
                <Bell className="size-[18px] text-[hsl(200_25%_25%)]" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 rounded-full bg-[hsl(0_78%_50%)] px-1 text-[10px] font-bold text-white num shadow-sm">{unread}</span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[400px] p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(200_18%_92%)]">
                <div>
                  <p className="text-sm font-semibold">Notificações</p>
                  <p className="text-[11px] text-[hsl(210_14%_42%)]">{unread} não lidas</p>
                </div>
                <button onClick={() => { setUnread(0); toast("Notificações marcadas como lidas"); }} className="text-[11px] text-[hsl(176_84%_25%)] font-semibold hover:underline">
                  Marcar todas como lidas
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notificacoes.map((n) => (
                  <DropdownMenuItem key={n.id} onClick={() => router.push("/atividade")} className="flex items-start gap-3 p-3 rounded-none cursor-pointer">
                    <span className={cn("size-2 rounded-full mt-1.5 shrink-0", n.tipo === "danger" && "bg-[hsl(0_78%_50%)]", n.tipo === "warning" && "bg-[hsl(28_92%_48%)]", n.tipo === "success" && "bg-[hsl(142_71%_36%)]", n.tipo === "info" && "bg-[hsl(200_92%_30%)]")} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[13px] leading-tight", !n.lida ? "font-semibold" : "font-medium")}>{n.titulo}</p>
                      <p className="text-[12px] text-[hsl(210_14%_42%)] mt-0.5 leading-snug">{n.descricao}</p>
                      <p className="text-[10px] text-[hsl(210_12%_58%)] mt-1.5 uppercase tracking-wider font-semibold">há {n.tempo}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="my-0" />
              <DropdownMenuItem onClick={() => router.push("/atividade")} className="text-[hsl(176_84%_25%)] font-medium justify-center py-2.5">Ver todas as notificações</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={() => setAjuda(true)} className="size-9 rounded-md hover:bg-[hsl(200_18%_94%)] flex items-center justify-center transition-colors">
            <HelpCircle className="size-[18px] text-[hsl(200_25%_25%)]" />
          </button>

          <div className="w-px h-6 bg-[hsl(200_18%_90%)] mx-1" />

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md pl-1 pr-2 py-1 hover:bg-[hsl(200_18%_94%)] transition-colors">
                <Avatar className="size-7 ring-2 ring-white shadow-sm">
                  <AvatarFallback className="text-[11px] bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_30%)] text-white">GF</AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="text-[12px] font-semibold leading-tight">Gabriel Felix</p>
                  <p className="text-[10px] text-[hsl(210_14%_42%)] leading-tight">{PERFIL_POR_ID[perfilId].label}</p>
                </div>
                <ChevronDown className="size-3 text-[hsl(210_14%_42%)]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 max-h-[80vh] overflow-y-auto">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setPerfil(true)}><User className="size-4" /> Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPrefs(true)}><Settings className="size-4" /> Preferências</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[hsl(210_14%_42%)]">
                <UserCog className="size-3" /> Entrar como… (muda a superfície ao vivo)
              </DropdownMenuLabel>
              <PerfilSwitcherMenuItems />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/login")} className="text-[hsl(0_70%_38%)]"><LogOut className="size-4" /> Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <PerfilModal open={perfil} onOpenChange={setPerfil} />
      <PreferenciasModal open={prefs} onOpenChange={setPrefs} />
      <AjudaModal open={ajuda} onOpenChange={setAjuda} />
      <CopilotModal open={copilot} onOpenChange={setCopilot} />
    </header>
  );
}
