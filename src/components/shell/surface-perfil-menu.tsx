"use client";

// Controle "Entrar como…" para as superfícies que NÃO são o back-office
// (A/C/D/E não têm a Topbar). Mantém a troca de perfil ao vivo em toda superfície,
// pra na demo você sempre conseguir "virar" outro perfil e voltar.

import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { PerfilSwitcherMenuItems } from "@/components/shell/perfil-switcher";
import { useSession } from "@/lib/store/session";
import { PERFIL_POR_ID } from "@/lib/domain/model";
import { cn } from "@/lib/utils";

export function SurfacePerfilMenu({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const router = useRouter();
  const { perfilId } = useSession();
  const p = PERFIL_POR_ID[perfilId];
  const dark = tone === "dark";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors",
            dark
              ? "border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
              : "border-[hsl(200_18%_90%)] bg-white hover:border-[hsl(176_60%_50%)] hover:shadow-brand-sm",
            className
          )}
        >
          <UserCog className={cn("size-4", dark ? "text-white/70" : "text-[hsl(210_14%_42%)]")} />
          <div className="text-left">
            <p
              className={cn(
                "text-[9px] uppercase tracking-[0.12em] font-semibold leading-none",
                dark ? "text-white/50" : "text-[hsl(210_14%_42%)]"
              )}
            >
              Entrar como
            </p>
            <p className="text-[12px] font-semibold leading-tight mt-0.5">{p.label}</p>
          </div>
          <ChevronDown className={cn("size-3.5", dark ? "text-white/50" : "text-[hsl(210_14%_42%)]")} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 max-h-[80vh] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[hsl(210_14%_42%)]">
          <UserCog className="size-3" /> Entrar como… (muda a superfície ao vivo)
        </DropdownMenuLabel>
        <PerfilSwitcherMenuItems />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/login")} className="text-[hsl(0_70%_38%)]">
          <LogOut className="size-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
