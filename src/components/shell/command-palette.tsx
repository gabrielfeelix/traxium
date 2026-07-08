"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, LayoutDashboard, Truck, Boxes, ClipboardCheck, Droplets, AlertOctagon, Gavel,
  Container, IdCard, Building2, Trees, PackageCheck, Database, ShieldCheck, FileCheck2,
  BadgeCheck, FileText, Activity, Smartphone, Settings, Plus, CornerDownLeft,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Item = { label: string; href: string; icon: React.ComponentType<{ className?: string }>; kind: "nav" | "acao"; hint?: string };

const NAV: Item[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, kind: "nav" },
  { label: "Viagens", href: "/viagens", icon: Truck, kind: "nav" },
  { label: "Motor IDTF", href: "/idtf", icon: Boxes, kind: "nav" },
  { label: "Inspeção LCI", href: "/checklists", icon: ClipboardCheck, kind: "nav" },
  { label: "Limpezas", href: "/limpezas", icon: Droplets, kind: "nav" },
  { label: "Não conformidades", href: "/bloqueios", icon: AlertOctagon, kind: "nav" },
  { label: "Exceções", href: "/excecoes", icon: Gavel, kind: "nav" },
  { label: "Ativos e frota", href: "/frota", icon: Container, kind: "nav" },
  { label: "Motoristas", href: "/motoristas", icon: IdCard, kind: "nav" },
  { label: "Subcontratados", href: "/subcontratados", icon: Building2, kind: "nav" },
  { label: "Fazendas e polígonos", href: "/fazendas", icon: Trees, kind: "nav" },
  { label: "Lotes e DDS", href: "/lotes", icon: PackageCheck, kind: "nav" },
  { label: "Gateway TRACES", href: "/traces", icon: Database, kind: "nav" },
  { label: "Auditoria", href: "/auditoria", icon: ShieldCheck, kind: "nav" },
  { label: "Dossiê de auditoria", href: "/dossie", icon: FileCheck2, kind: "nav" },
  { label: "Conformidade", href: "/conformidade", icon: BadgeCheck, kind: "nav" },
  { label: "Documentos", href: "/documentos", icon: FileText, kind: "nav" },
  { label: "Atividade", href: "/atividade", icon: Activity, kind: "nav" },
  { label: "Preview Mobile", href: "/mobile", icon: Smartphone, kind: "nav" },
  { label: "Configurações", href: "/configuracoes", icon: Settings, kind: "nav" },
];

const ACOES: Item[] = [
  { label: "Nova viagem", href: "/viagens", icon: Plus, kind: "acao", hint: "abrir" },
  { label: "Reportar NC manual", href: "/bloqueios", icon: Plus, kind: "acao", hint: "abrir" },
  { label: "Registrar limpeza", href: "/limpezas", icon: Plus, kind: "acao", hint: "abrir" },
  { label: "Nova inspeção LCI", href: "/checklists", icon: Plus, kind: "acao", hint: "abrir" },
  { label: "Qualificar subcontratado", href: "/subcontratados", icon: Plus, kind: "acao", hint: "abrir" },
  { label: "Adicionar ativo", href: "/frota", icon: Plus, kind: "acao", hint: "abrir" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const query = q.trim().toLowerCase();
  const acoes = useMemo(() => ACOES.filter((i) => i.label.toLowerCase().includes(query)), [query]);
  const navs = useMemo(() => NAV.filter((i) => i.label.toLowerCase().includes(query)), [query]);
  const flat = [...acoes, ...navs];

  function go(item: Item) {
    setOpen(false); setQ("");
    router.push(item.href);
  }

  return (
    <>
      {/* Trigger estilizado como busca */}
      <button
        onClick={() => setOpen(true)}
        className="relative max-w-md flex-1 mx-2 flex items-center h-9 rounded-md bg-[hsl(200_18%_97%)] border border-transparent hover:border-[hsl(200_18%_85%)] px-3 text-left"
      >
        <Search className="size-[14px] text-[hsl(210_14%_42%)] shrink-0" />
        <span className="ml-2 text-[13px] text-[hsl(210_14%_42%)] truncate flex-1">Buscar viagens, motoristas, fazendas, lotes…</span>
        <kbd className="ml-2 inline-flex h-[18px] items-center rounded border border-[hsl(200_18%_88%)] bg-white px-1.5 text-[10px] font-semibold text-[hsl(210_14%_42%)] num shrink-0">⌘K</kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0 gap-0 top-[15%] translate-y-0">
          <DialogTitle className="sr-only">Busca e ações rápidas</DialogTitle>
          <div className="flex items-center gap-2 border-b border-[hsl(200_18%_92%)] px-4 py-3">
            <Search className="size-4 text-[hsl(210_14%_42%)]" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && flat[0]) go(flat[0]); }}
              placeholder="Navegar ou executar ação…"
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[hsl(210_12%_58%)]"
            />
          </div>
          <div className="max-h-[360px] overflow-y-auto p-2">
            {acoes.length > 0 && (
              <Grupo titulo="Ações rápidas">
                {acoes.map((i) => <Linha key={i.label} item={i} onGo={go} />)}
              </Grupo>
            )}
            {navs.length > 0 && (
              <Grupo titulo="Navegar">
                {navs.map((i) => <Linha key={i.href} item={i} onGo={go} />)}
              </Grupo>
            )}
            {!flat.length && <p className="text-[13px] text-[hsl(210_14%_42%)] px-3 py-6 text-center">Nada encontrado.</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[hsl(210_12%_58%)]">{titulo}</p>
      {children}
    </div>
  );
}

function Linha({ item, onGo }: { item: Item; onGo: (i: Item) => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onGo(item)}
      className={cn("w-full flex items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-[hsl(174_64%_97%)] group")}
    >
      <Icon className="size-4 text-[hsl(176_84%_25%)] shrink-0" />
      <span className="text-[13px] flex-1">{item.label}</span>
      {item.hint && <span className="text-[9px] uppercase tracking-wide text-[hsl(210_12%_58%)]">{item.hint}</span>}
      <CornerDownLeft className="size-3 text-[hsl(210_12%_70%)] opacity-0 group-hover:opacity-100" />
    </button>
  );
}
