"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, LayoutDashboard, Truck, Boxes, ClipboardCheck, Droplets, AlertOctagon, Gavel,
  Container, IdCard, Building2, Trees, PackageCheck, Database, ShieldCheck, FileCheck2,
  BadgeCheck, FileText, Activity, Smartphone, Settings, Plus, CornerDownLeft,
} from "lucide-react";
import {
  viagens, motoristas, fazendas, lotes, documentos, naoConformidades,
} from "@/lib/mock-data";
import { subcontratados } from "@/lib/domain/model";
import { cn } from "@/lib/utils";

/**
 * Busca global do topo — dropdown inline abaixo do input (balão, como as
 * notificações), sem modal centralizado. Busca registros reais: viagens,
 * motoristas, fazendas, lotes, subcontratados, documentos, NCs e páginas.
 */

type Icone = React.ComponentType<{ className?: string }>;
type Resultado = { key: string; grupo: string; label: string; sub?: string; href: string; icon: Icone };

const NAV: { label: string; href: string; icon: Icone }[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Viagens", href: "/viagens", icon: Truck },
  { label: "Motor IDTF", href: "/idtf", icon: Boxes },
  { label: "Inspeção LCI", href: "/checklists", icon: ClipboardCheck },
  { label: "Limpezas", href: "/limpezas", icon: Droplets },
  { label: "Não conformidades", href: "/bloqueios", icon: AlertOctagon },
  { label: "Exceções", href: "/excecoes", icon: Gavel },
  { label: "Ativos e frota", href: "/frota", icon: Container },
  { label: "Motoristas", href: "/motoristas", icon: IdCard },
  { label: "Subcontratados", href: "/subcontratados", icon: Building2 },
  { label: "Fazendas e polígonos", href: "/fazendas", icon: Trees },
  { label: "Lotes e DDS", href: "/lotes", icon: PackageCheck },
  { label: "Gateway TRACES", href: "/traces", icon: Database },
  { label: "Auditoria", href: "/auditoria", icon: ShieldCheck },
  { label: "Dossiê de auditoria", href: "/dossie", icon: FileCheck2 },
  { label: "Conformidade", href: "/conformidade", icon: BadgeCheck },
  { label: "Documentos", href: "/documentos", icon: FileText },
  { label: "Atividade", href: "/atividade", icon: Activity },
  { label: "Preview Mobile", href: "/mobile", icon: Smartphone },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];

const ACOES: { label: string; href: string }[] = [
  { label: "Nova viagem", href: "/viagens" },
  { label: "Reportar NC manual", href: "/bloqueios" },
  { label: "Registrar limpeza", href: "/limpezas" },
  { label: "Nova inspeção LCI", href: "/checklists" },
  { label: "Qualificar subcontratado", href: "/subcontratados" },
  { label: "Adicionar ativo", href: "/frota" },
];

const LIMITE = 4; // por grupo — a busca refina, não pagina

function buscar(q: string): Resultado[] {
  const hit = (...campos: (string | undefined)[]) =>
    campos.some((c) => c?.toLowerCase().includes(q));
  const r: Resultado[] = [];

  viagens.filter((v) => hit(v.codigo, v.motorista, v.produto, v.cavalo, v.carreta)).slice(0, LIMITE)
    .forEach((v) => r.push({ key: v.id, grupo: "Viagens", label: v.codigo, sub: `${v.motorista} · ${v.produto}`, href: `/viagens/${v.id}`, icon: Truck }));
  motoristas.filter((m) => hit(m.nome, m.cpf, m.cidade)).slice(0, LIMITE)
    .forEach((m) => r.push({ key: m.id, grupo: "Motoristas", label: m.nome, sub: `${m.tipo} · ${m.cidade}/${m.uf}`, href: "/motoristas", icon: IdCard }));
  fazendas.filter((f) => hit(f.nome, f.produtor, f.cidade, f.car)).slice(0, LIMITE)
    .forEach((f) => r.push({ key: f.id, grupo: "Fazendas", label: f.nome, sub: `${f.produtor} · ${f.cidade}/${f.uf}`, href: "/fazendas", icon: Trees }));
  lotes.filter((l) => hit(l.codigo, l.destinatarioFinal, l.produto)).slice(0, LIMITE)
    .forEach((l) => r.push({ key: l.id, grupo: "Lotes e DDS", label: l.codigo, sub: `${l.produto} · ${l.destinatarioFinal}`, href: "/lotes", icon: PackageCheck }));
  subcontratados.filter((s) => hit(s.razaoSocial, s.cnpj)).slice(0, LIMITE)
    .forEach((s) => r.push({ key: s.id, grupo: "Subcontratados", label: s.razaoSocial, sub: s.cnpj, href: "/subcontratados", icon: Building2 }));
  documentos.filter((d) => hit(d.nome, d.tipo, d.autor)).slice(0, LIMITE)
    .forEach((d) => r.push({ key: d.id, grupo: "Documentos", label: d.nome, sub: d.tipo, href: "/documentos", icon: FileText }));
  naoConformidades.filter((n) => hit(n.codigo, n.descricao, n.motorista)).slice(0, LIMITE)
    .forEach((n) => r.push({ key: n.id, grupo: "Não conformidades", label: n.codigo, sub: n.severidade, href: "/bloqueios", icon: AlertOctagon }));
  NAV.filter((n) => n.label.toLowerCase().includes(q)).slice(0, LIMITE)
    .forEach((n) => r.push({ key: n.href, grupo: "Páginas", label: n.label, href: n.href, icon: n.icon }));

  return r;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const raizRef = useRef<HTMLDivElement>(null);

  // ⌘K foca a busca (sem modal); clique fora fecha o balão.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (!raizRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const query = q.trim().toLowerCase();
  const resultados = useMemo<Resultado[]>(() => {
    if (!query) {
      return [
        ...ACOES.map((a) => ({ key: a.label, grupo: "Ações rápidas", label: a.label, href: a.href, icon: Plus as Icone })),
        ...NAV.slice(0, 6).map((n) => ({ key: n.href, grupo: "Navegar", label: n.label, href: n.href, icon: n.icon })),
      ];
    }
    return buscar(query);
  }, [query]);

  useEffect(() => setIdx(0), [query]);

  function go(item: Resultado) {
    setOpen(false);
    setQ("");
    inputRef.current?.blur();
    router.push(item.href);
  }

  // Agrupa preservando a ordem para render com cabeçalhos.
  const grupos = useMemo(() => {
    const g: { titulo: string; itens: { item: Resultado; flatIdx: number }[] }[] = [];
    resultados.forEach((item, flatIdx) => {
      let ultimo = g[g.length - 1];
      if (!ultimo || ultimo.titulo !== item.grupo) {
        ultimo = { titulo: item.grupo, itens: [] };
        g.push(ultimo);
      }
      ultimo.itens.push({ item, flatIdx });
    });
    return g;
  }, [resultados]);

  return (
    <div ref={raizRef} className="relative flex-1 max-w-2xl mx-2">
      <div
        className={cn(
          "flex items-center h-9 rounded-md bg-bg border px-3 transition-colors",
          open ? "border-brand-500/50 bg-bg-elev shadow-brand-sm" : "border-transparent hover:border-border"
        )}
      >
        <Search className="size-[14px] text-fg-muted shrink-0" aria-hidden />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
            if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, resultados.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
            if (e.key === "Enter" && resultados[idx]) go(resultados[idx]);
          }}
          role="combobox"
          aria-expanded={open}
          aria-label="Buscar no Traxium"
          placeholder="Buscar viagens, motoristas, fazendas, lotes…"
          className="ml-2 flex-1 bg-transparent outline-none text-[13px] placeholder:text-fg-muted min-w-0"
        />
        <kbd className="ml-2 hidden sm:inline-flex h-[18px] items-center rounded border border-border-soft bg-bg-elev px-1.5 text-[10px] font-semibold text-fg-muted num shrink-0">⌘K</kbd>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-40 rounded-xl border border-border-soft bg-bg-elev shadow-brand-lg overflow-hidden animate-fade-in">
          <div className="max-h-[420px] overflow-y-auto p-2">
            {grupos.map((g) => (
              <div key={g.titulo} className="mb-1">
                <p className="px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-fg-soft">{g.titulo}</p>
                {g.itens.map(({ item, flatIdx }) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={`${g.titulo}-${item.key}`}
                      onClick={() => go(item)}
                      onMouseEnter={() => setIdx(flatIdx)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-md px-3 py-2 text-left group",
                        flatIdx === idx ? "bg-brand-50/70" : "hover:bg-brand-50/50"
                      )}
                    >
                      <Icon className="size-4 text-brand-600 shrink-0" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium text-fg truncate">{item.label}</span>
                        {item.sub && <span className="block text-[11px] text-fg-muted truncate">{item.sub}</span>}
                      </span>
                      <CornerDownLeft className={cn("size-3 text-fg-soft shrink-0", flatIdx === idx ? "opacity-100" : "opacity-0 group-hover:opacity-60")} aria-hidden />
                    </button>
                  );
                })}
              </div>
            ))}
            {!resultados.length && (
              <p className="text-[13px] text-fg-muted px-3 py-6 text-center">
                Nada encontrado para “{q}”.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
