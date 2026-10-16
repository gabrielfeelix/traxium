import { cn } from "@/lib/utils";

type BoneProps = {
  className?: string;
};

function Bone({ className }: BoneProps) {
  return <span aria-hidden="true" className={cn("skeleton block rounded-md", className)} />;
}

function LoadingStatus({ label }: { label: string }) {
  return <span className="sr-only">{label}</span>;
}

export function BackOfficePageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-6"
      data-testid="back-office-page-skeleton"
    >
      <LoadingStatus label="Carregando página" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Bone className="h-7 w-44 sm:w-56" />
          <Bone className="h-3.5 w-full max-w-2xl sm:w-[560px]" />
          <Bone className="h-3.5 w-4/5 max-w-xl sm:w-[430px]" />
        </div>
        <div className="flex gap-2">
          <Bone className="h-9 w-24" />
          <Bone className="h-9 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-xl border border-border-soft bg-bg-elev p-4 shadow-brand-sm">
            <div className="flex items-center justify-between gap-3">
              <Bone className="size-9 rounded-lg" />
              <Bone className="h-3 w-16" />
            </div>
            <Bone className="mt-5 h-7 w-20" />
            <Bone className="mt-2 h-3 w-28 max-w-full" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border-soft bg-bg-elev p-4 shadow-brand-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Bone className="h-9 flex-1" />
          <Bone className="h-9 w-full sm:w-40" />
          <Bone className="h-9 w-full sm:w-28" />
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-border-soft">
          <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,.8fr)_110px] gap-4 bg-bg px-4 py-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(130px,1fr)_130px_110px]">
            {Array.from({ length: 4 }, (_, index) => (
              <Bone key={index} className={cn("h-3", index === 3 && "hidden sm:block")} />
            ))}
          </div>
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,.8fr)_110px] items-center gap-4 border-t border-border-soft px-4 py-3.5 sm:grid-cols-[minmax(0,1.5fr)_minmax(130px,1fr)_130px_110px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Bone className="size-9 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Bone className="h-3.5 w-4/5" />
                  <Bone className="h-2.5 w-3/5" />
                </div>
              </div>
              <Bone className="h-4 w-4/5" />
              <Bone className="h-6 w-20 rounded-full" />
              <Bone className="hidden h-8 w-24 sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-screen bg-bg"
      data-testid="auth-page-skeleton"
    >
      <LoadingStatus label="Carregando acesso" />
      <div className="relative hidden w-1/2 overflow-hidden bg-[hsl(195_30%_8%)] p-12 lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(180_80%_12%)] via-[hsl(195_30%_8%)] to-[hsl(202_92%_14%)]" />
        <div className="relative z-10">
          <Bone className="h-8 w-36 bg-white/10" />
        </div>
        <div className="relative z-10 my-auto max-w-md space-y-5">
          <Bone className="h-6 w-64 bg-white/10" />
          <Bone className="h-12 w-full bg-white/10" />
          <Bone className="h-12 w-4/5 bg-white/10" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Bone className="size-8 shrink-0 bg-white/10" />
                <Bone className="h-3 w-72 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-5">
          <Bone className="h-8 w-52" />
          <Bone className="h-3.5 w-72 max-w-full" />
          <div className="space-y-4 pt-4">
            <div className="space-y-2"><Bone className="h-3 w-28" /><Bone className="h-10 w-full" /></div>
            <div className="space-y-2"><Bone className="h-3 w-20" /><Bone className="h-10 w-full" /></div>
            <Bone className="h-11 w-full" />
          </div>
          <Bone className="mx-auto h-3 w-44" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }, (_, index) => <Bone key={index} className="h-14 w-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicOnboardingSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-bg px-4 py-6 sm:px-6"
      data-testid="public-onboarding-skeleton"
    >
      <LoadingStatus label="Carregando cadastro público" />
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Bone className="h-8 w-36" />
          <Bone className="h-6 w-24 rounded-full" />
        </div>
        <div className="mt-8 flex gap-2">
          {Array.from({ length: 6 }, (_, index) => <Bone key={index} className="h-1.5 flex-1 rounded-full" />)}
        </div>
        <div className="mt-6 rounded-2xl border border-border-soft bg-bg-elev p-5 shadow-brand-md sm:p-7">
          <Bone className="h-7 w-64 max-w-full" />
          <Bone className="mt-2 h-3.5 w-full max-w-lg" />
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className={cn("space-y-2", index < 2 && "sm:col-span-2")}>
                <Bone className="h-3 w-28" />
                <Bone className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end"><Bone className="h-10 w-36" /></div>
        </div>
      </div>
    </div>
  );
}
