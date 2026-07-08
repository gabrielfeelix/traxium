"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  ClipboardCheck,
  Boxes,
  Container,
  Droplets,
  Building2,
  IdCard,
  Trees,
  PackageCheck,
  ShieldCheck,
  AlertOctagon,
  Gavel,
  FileCheck2,
  FileText,
  Settings,
  Smartphone,
  Database,
  BadgeCheck,
  Activity,
  ChevronDown,
  Eye,
} from "lucide-react";
import { TraxiumLogo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/store/session";
import { produtosIDTF, subcontratados, excecoes, nivelVencimento, type Papel } from "@/lib/domain/model";
import { viagens, naoConformidades, lotes, filialDaViagem, pertenceAFilial } from "@/lib/mock-data";

type Acesso = "full" | "read";
// Visibilidade por papel de escritório, derivada da matriz §3. Papel ausente = oculto.
// Master (isMaster) vê tudo como `full`. Campo/portal/auditor têm nav própria (não usam esta).
type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeTone?: "default" | "danger" | "warning";
  access: Partial<Record<Papel, Acesso>>;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    title: "Operação",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard, access: { gestor: "full", despachante: "full", diretoria_rt: "full", admin_subcontratados: "full", auditor_interno: "read" } },
      { href: "/viagens", label: "Viagens", icon: Truck, access: { gestor: "read", despachante: "full", diretoria_rt: "read", auditor_interno: "read" } },
      { href: "/idtf", label: "Motor IDTF", icon: Boxes, badgeTone: "warning", access: { gestor: "full", despachante: "read", auditor_interno: "read" } },
      { href: "/checklists", label: "Inspeção LCI", icon: ClipboardCheck, access: { gestor: "read", auditor_interno: "read" } },
      { href: "/limpezas", label: "Limpezas", icon: Droplets, access: { gestor: "full", auditor_interno: "read" } },
      { href: "/bloqueios", label: "Não conformidades", icon: AlertOctagon, badgeTone: "danger", access: { gestor: "full", despachante: "read", diretoria_rt: "read", admin_subcontratados: "read", auditor_interno: "full" } },
      { href: "/excecoes", label: "Exceções", icon: Gavel, badgeTone: "warning", access: { gestor: "full", despachante: "full", diretoria_rt: "full", auditor_interno: "read" } },
    ],
  },
  {
    title: "Cadastros",
    items: [
      { href: "/frota", label: "Ativos e frota", icon: Container, access: { gestor: "read", despachante: "read", admin_subcontratados: "full", auditor_interno: "read" } },
      { href: "/motoristas", label: "Motoristas", icon: IdCard, access: { gestor: "read", despachante: "read", admin_subcontratados: "full", auditor_interno: "read" } },
      { href: "/subcontratados", label: "Subcontratados", icon: Building2, badgeTone: "danger", access: { gestor: "read", despachante: "read", admin_subcontratados: "full", auditor_interno: "read" } },
      { href: "/fazendas", label: "Fazendas e polígonos", icon: Trees, access: { gestor: "full", auditor_interno: "read" } },
    ],
  },
  {
    title: "EUDR · TRACES NT",
    items: [
      { href: "/lotes", label: "Lotes e DDS", icon: PackageCheck, access: { gestor: "full", auditor_interno: "read" } },
      { href: "/traces", label: "Gateway TRACES", icon: Database, access: { gestor: "full" } },
    ],
  },
  {
    title: "Compliance",
    items: [
      { href: "/auditoria", label: "Auditoria", icon: ShieldCheck, access: { gestor: "full", diretoria_rt: "read", auditor_interno: "full" } },
      { href: "/dossie", label: "Dossiê de auditoria", icon: FileCheck2, access: { gestor: "full", despachante: "read", diretoria_rt: "read", auditor_interno: "read" } },
      { href: "/conformidade", label: "Conformidade", icon: BadgeCheck, access: { gestor: "full", despachante: "read", diretoria_rt: "full", admin_subcontratados: "read", auditor_interno: "read" } },
      { href: "/documentos", label: "Documentos", icon: FileText, access: { gestor: "full", despachante: "read", diretoria_rt: "read", admin_subcontratados: "read", auditor_interno: "read" } },
      { href: "/atividade", label: "Atividade", icon: Activity, access: { gestor: "full", despachante: "read", diretoria_rt: "read", admin_subcontratados: "read", auditor_interno: "full" } },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/mobile", label: "Preview Mobile", icon: Smartphone, access: { gestor: "full" } },
      { href: "/configuracoes", label: "Configurações", icon: Settings, access: { gestor: "read", diretoria_rt: "full" } },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { version, papel, isMaster, filialId } = useSession();

  // Modo de acesso do papel atual a um item (Master vê tudo). undefined = oculto.
  const acessoDe = (item: NavItem): Acesso | undefined =>
    isMaster ? "full" : item.access[papel];

  // Badges derivados do estado real (movem quando algo é criado). Só o que é caro
  // de derivar (score EUDR etc.) fica fora — aqui tudo é .length/filter honesto.
  void version;
  const badgeFor = (href: string): number => {
    switch (href) {
      case "/viagens":
        return viagens.filter((v) => pertenceAFilial(filialId, filialDaViagem(v))).length;
      case "/idtf":
        return produtosIDTF.filter((p) => p.statusClassificacao === "em_fila").length;
      case "/bloqueios":
        return naoConformidades.length;
      case "/excecoes":
        return excecoes.filter((e) => e.status === "pendente").length;
      case "/subcontratados":
        return subcontratados.filter(
          (s) => nivelVencimento(s.certGMP.validade).nivel === "vencido" || s.certGMP.statusBasePublica !== "Ativo"
        ).length;
      case "/lotes":
        return lotes.length;
      default:
        return 0;
    }
  };

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
        {navigation.map((group) => {
          // Filtra pela matriz §3: some o que é `—`; grupo sem itens visíveis desaparece.
          const visiveis = group.items
            .map((item) => ({ item, mode: acessoDe(item) }))
            .filter((x): x is { item: NavItem; mode: Acesso } => Boolean(x.mode));
          if (visiveis.length === 0) return null;
          return (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                {group.title}
              </p>
              <ul className="space-y-px">
                {visiveis.map(({ item, mode }) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  const count = badgeFor(item.href);
                  const readOnly = mode === "read";
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all",
                          isActive
                            ? "bg-white/[0.07] text-white shadow-[inset_1px_0_0_hsl(176_84%_45%)]"
                            : readOnly
                            ? "text-white/45 hover:bg-white/[0.04] hover:text-white/70"
                            : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                        )}
                        title={readOnly ? `${item.label} · somente leitura` : item.label}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-gradient-to-b from-[hsl(176_84%_55%)] to-[hsl(200_92%_45%)]" />
                        )}
                        <Icon className={cn("size-[15px] shrink-0", isActive ? "text-[hsl(176_84%_55%)]" : readOnly ? "text-white/40 group-hover:text-white/60" : "text-white/55 group-hover:text-white/85")} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {count > 0 ? (
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
                            {count}
                          </span>
                        ) : (
                          readOnly && (
                            <Eye className="size-3.5 shrink-0 text-white/30" aria-label="somente leitura" />
                          )
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
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
