"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ListToolbar({
  principal,
  filtros,
  acoes,
  className,
}: {
  principal: React.ReactNode;
  filtros?: React.ReactNode;
  acoes?: React.ReactNode;
  className?: string;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className={cn("flex flex-wrap items-end gap-2", className)}>
      <div className="min-w-[210px] flex-1">{principal}</div>
      {filtros && (
        <>
          <div className="hidden flex-wrap items-end gap-2 lg:flex">{filtros}</div>
          <Button variant={aberto ? "secondary" : "outline"} size="sm" className="lg:hidden" onClick={() => setAberto((v) => !v)} aria-expanded={aberto}>
            <SlidersHorizontal className="size-4" /> Mais filtros
          </Button>
        </>
      )}
      {acoes}
      {filtros && aberto && <div className="flex w-full flex-wrap items-end gap-2 rounded-lg border border-border bg-bg p-3 lg:hidden">{filtros}</div>}
    </div>
  );
}
