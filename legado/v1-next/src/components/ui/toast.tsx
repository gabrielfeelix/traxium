"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; msg: string; desc?: string; type: ToastType };

type ToastCtx = { toast: (msg: string, opts?: { desc?: string; type?: ToastType }) => void };

const Ctx = createContext<ToastCtx | null>(null);

let tid = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => setToasts((s) => s.filter((t) => t.id !== id)), []);

  const toast = useCallback<ToastCtx["toast"]>((msg, opts) => {
    const id = ++tid;
    setToasts((s) => [...s, { id, msg, desc: opts?.desc, type: opts?.type ?? "success" }]);
    setTimeout(() => remove(id), 3800);
  }, [remove]);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-2.5 rounded-xl border bg-white p-3 shadow-brand-lg animate-in slide-in-from-right-4 fade-in",
              t.type === "success" && "border-[hsl(142_60%_78%)]",
              t.type === "error" && "border-[hsl(0_72%_82%)]",
              t.type === "info" && "border-[hsl(176_60%_78%)]"
            )}
          >
            <span
              className={cn(
                "size-6 rounded-md flex items-center justify-center text-white shrink-0",
                t.type === "success" && "bg-[hsl(142_71%_36%)]",
                t.type === "error" && "bg-[hsl(0_78%_50%)]",
                t.type === "info" && "bg-[hsl(176_84%_25%)]"
              )}
            >
              {t.type === "success" && <CheckCircle2 className="size-3.5" />}
              {t.type === "error" && <AlertTriangle className="size-3.5" />}
              {t.type === "info" && <Info className="size-3.5" />}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[hsl(195_30%_8%)] leading-tight">{t.msg}</p>
              {t.desc && <p className="text-[11px] text-[hsl(210_14%_42%)] mt-0.5 leading-snug">{t.desc}</p>}
            </div>
            <button onClick={() => remove(t.id)} className="text-[hsl(210_14%_42%)] hover:text-[hsl(195_30%_8%)] shrink-0">
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast fora do ToastProvider");
  return c;
}
