"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  ClipboardCheck,
  Container,
  IdCard,
  Trees,
  PackageCheck,
  ShieldCheck,
  AlertOctagon,
  FileText,
  Settings,
  Smartphone,
  Database,
  BadgeCheck,
  Activity,
  ChevronDown,
} from "lucide-react";
import { TraxiumLogo } from "@/components/logo";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeTone?: "default" | "danger" | "warning";
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    title: "Operação",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/viagens", label: "Viagens", icon: Truck, badge: "184" },
      { href: "/checklists", label: "Checklists LCI", icon: ClipboardCheck },
      { href: "/bloqueios", label: "Não conformidades", icon: AlertOctagon, badge: "7", badgeTone: "danger" },
    ],
  },
  {
    title: "Cadastros",
    items: [
      { href: "/frota", label: "Frota", icon: Container },
      { href: "/motoristas", label: "Motoristas", icon: IdCard },
      { href: "/fazendas", label: "Fazendas e polígonos", icon: Trees },
    ],
  },
  {
    title: "EUDR · TRACES NT",
    items: [
      { href: "/lotes", label: "Lotes e DDS", icon: PackageCheck, badge: "4" },
      { href: "/traces", label: "Gateway TRACES", icon: Database },
    ],
  },
  {
    title: "Compliance",
    items: [
      { href: "/auditoria", label: "Auditoria", icon: ShieldCheck },
      { href: "/conformidade", label: "Conformidade", icon: BadgeCheck },
      { href: "/documentos", label: "Documentos", icon: FileText },
      { href: "/atividade", label: "Atividade", icon: Activity },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/mobile", label: "Preview Mobile", icon: Smartphone },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-[260px] shrink-0 flex-col bg-[hsl(195_30%_8%)] text-[hsl(195_15%_82%)] sticky top-0 relative overflow-hidden">
      {/* Subtle gradient overlay top */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[hsl(176_84%_25%_/_0.15)] to-transparent pointer-events-none" />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center">
          <TraxiumLogo variant="light" />
        </Link>
      </div>

      <nav className="relative flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navigation.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
              {group.title}
            </p>
            <ul className="space-y-px">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all",
                        isActive
                          ? "bg-white/[0.07] text-white shadow-[inset_1px_0_0_hsl(176_84%_45%)]"
                          : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-gradient-to-b from-[hsl(176_84%_55%)] to-[hsl(200_92%_45%)]" />
                      )}
                      <Icon className={cn("size-[15px] shrink-0", isActive ? "text-[hsl(176_84%_55%)]" : "text-white/55 group-hover:text-white/85")} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "min-w-[20px] h-[18px] rounded-[5px] px-1 text-[10px] font-semibold flex items-center justify-center num",
                            item.badgeTone === "danger"
                              ? "bg-[hsl(0_78%_50%)] text-white"
                              : item.badgeTone === "warning"
                              ? "bg-[hsl(28_92%_48%)] text-white"
                              : isActive
                              ? "bg-white/15 text-white"
                              : "bg-white/[0.07] text-white/70"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="relative p-3 border-t border-white/[0.06]">
        <button className="w-full flex items-center gap-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] transition-colors p-2.5 group">
          <div className="size-9 rounded-md bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_28%)] flex items-center justify-center text-white font-bold text-xs shadow-md">
            BF
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-white/45 font-semibold leading-tight">
              Tenant ativo
            </p>
            <p className="text-[12px] font-semibold text-white truncate leading-tight mt-0.5">
              Bom Frete Transportes
            </p>
            <p className="text-[10px] text-white/50 leading-tight">
              Rondonópolis/MT · Enterprise
            </p>
          </div>
          <ChevronDown className="size-3.5 text-white/40 group-hover:text-white/70" />
        </button>
      </div>
    </aside>
  );
}
