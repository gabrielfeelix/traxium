"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Pagination({
  pagina,
  totalPaginas,
  porPagina,
  inicio,
  fim,
  total,
  onPagina,
  onPorPagina,
}: {
  pagina: number;
  totalPaginas: number;
  porPagina: number;
  inicio: number;
  fim: number;
  total: number;
  onPagina: (pagina: number) => void;
  onPorPagina: (quantidade: number) => void;
}) {
  return (
    <nav className="flex flex-wrap items-center gap-2 border-t border-border-soft px-3 py-3" aria-label="Paginação">
      <p className="min-w-[130px] flex-1 text-[11px] text-fg-muted">
        <span className="num">{inicio}–{fim}</span> de <span className="num font-semibold text-fg">{total}</span>
      </p>
      <Select value={String(porPagina)} onValueChange={(v) => onPorPagina(Number(v))}>
        <SelectTrigger className="h-8 w-[108px] text-[11px]" aria-label="Itens por página"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="25">25 por página</SelectItem>
          <SelectItem value="50">50 por página</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon-sm" disabled={pagina <= 1} onClick={() => onPagina(pagina - 1)} aria-label="Página anterior"><ChevronLeft className="size-4" /></Button>
      <span className="min-w-[60px] text-center text-[11px] text-fg-muted"><span className="num font-semibold text-fg">{pagina}</span> / <span className="num">{totalPaginas}</span></span>
      <Button variant="outline" size="icon-sm" disabled={pagina >= totalPaginas} onClick={() => onPagina(pagina + 1)} aria-label="Próxima página"><ChevronRight className="size-4" /></Button>
    </nav>
  );
}
