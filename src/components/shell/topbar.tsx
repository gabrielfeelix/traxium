"use client";

import { useState } from "react";
import { Bell, Search, ChevronDown, Building2, LogOut, Settings, User, HelpCircle, Sparkles, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { tenants, notificacoes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Topbar() {
  const [activeTenant, setActiveTenant] = useState(tenants[0]);
  const unread = notificacoes.filter((n) => !n.lida).length;

  return (
    <header className="sticky top-0 z-30 h-[60px] border-b border-[hsl(200_18%_90%)] bg-[hsl(0_0%_100%_/_0.78)] backdrop-blur-xl">
      <div className="flex h-full items-center gap-3 px-5">
        {/* Tenant switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-2.5 rounded-lg border border-[hsl(200_18%_90%)] bg-white px-2.5 py-1.5 hover:border-[hsl(176_60%_50%)] hover:shadow-brand-sm transition-all">
              <div className="size-7 rounded-md bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_28%)] flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                BF
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-[0.12em] text-[hsl(210_14%_42%)] font-semibold leading-none">
                  Operando como
                </p>
                <p className="text-[13px] font-semibold leading-tight mt-0.5">{activeTenant.name}</p>
              </div>
              <ChevronDown className="size-3.5 text-[hsl(210_14%_42%)] group-hover:text-[hsl(176_84%_25%)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            <DropdownMenuLabel>Tenants disponíveis</DropdownMenuLabel>
            {tenants.map((t) => {
              const initials = t.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
              return (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => setActiveTenant(t)}
                  className="flex items-center gap-3 py-2.5"
                >
                  <div className="size-9 rounded-md bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_28%)] flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[13px] truncate">{t.name}</span>
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4">
                        {t.plano}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[hsl(210_14%_42%)] mt-0.5">
                      {t.cidade}/{t.uf} · {t.caminhoes} caminhões · {t.motoristas} motoristas
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[hsl(176_84%_25%)] font-medium">
              <Plus className="size-3.5" /> Adicionar nova transportadora
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        <div className="relative max-w-md flex-1 mx-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[14px] text-[hsl(210_14%_42%)]" />
          <Input
            placeholder="Buscar viagens, motoristas, fazendas, lotes…"
            className="pl-9 pr-16 h-9 text-[13px] bg-[hsl(200_18%_97%)] border-transparent hover:border-[hsl(200_18%_85%)] focus:bg-white"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-[18px] items-center rounded border border-[hsl(200_18%_88%)] bg-white px-1.5 text-[10px] font-semibold text-[hsl(210_14%_42%)] num">
            ⌘K
          </kbd>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* AI assistant pill */}
          <Button variant="outline" size="sm" className="hidden lg:flex h-9 gap-1.5 border-[hsl(176_60%_75%)] text-[hsl(176_84%_25%)] hover:bg-[hsl(174_64%_96%)]">
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
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 rounded-full bg-[hsl(0_78%_50%)] px-1 text-[10px] font-bold text-white num shadow-sm">
                    {unread}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[400px] p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(200_18%_92%)]">
                <div>
                  <p className="text-sm font-semibold">Notificações</p>
                  <p className="text-[11px] text-[hsl(210_14%_42%)]">{unread} não lidas</p>
                </div>
                <button className="text-[11px] text-[hsl(176_84%_25%)] font-semibold hover:underline">
                  Marcar todas como lidas
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notificacoes.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex items-start gap-3 p-3 rounded-none cursor-pointer">
                    <span
                      className={cn(
                        "size-2 rounded-full mt-1.5 shrink-0",
                        n.tipo === "danger" && "bg-[hsl(0_78%_50%)]",
                        n.tipo === "warning" && "bg-[hsl(28_92%_48%)]",
                        n.tipo === "success" && "bg-[hsl(142_71%_36%)]",
                        n.tipo === "info" && "bg-[hsl(200_92%_30%)]"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[13px] leading-tight", !n.lida ? "font-semibold" : "font-medium")}>
                        {n.titulo}
                      </p>
                      <p className="text-[12px] text-[hsl(210_14%_42%)] mt-0.5 leading-snug">{n.descricao}</p>
                      <p className="text-[10px] text-[hsl(210_12%_58%)] mt-1.5 uppercase tracking-wider font-semibold">
                        há {n.tempo}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="my-0" />
              <DropdownMenuItem className="text-[hsl(176_84%_25%)] font-medium justify-center py-2.5">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="size-9 rounded-md hover:bg-[hsl(200_18%_94%)] flex items-center justify-center transition-colors">
            <HelpCircle className="size-[18px] text-[hsl(200_25%_25%)]" />
          </button>

          <div className="w-px h-6 bg-[hsl(200_18%_90%)] mx-1" />

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md pl-1 pr-2 py-1 hover:bg-[hsl(200_18%_94%)] transition-colors">
                <Avatar className="size-7 ring-2 ring-white shadow-sm">
                  <AvatarFallback className="text-[11px] bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_30%)] text-white">
                    GF
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="text-[12px] font-semibold leading-tight">Gabriel Felix</p>
                  <p className="text-[10px] text-[hsl(210_14%_42%)] leading-tight">UX · Admin</p>
                </div>
                <ChevronDown className="size-3 text-[hsl(210_14%_42%)]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="size-4" /> Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" /> Preferências
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[hsl(0_70%_38%)]">
                <LogOut className="size-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
