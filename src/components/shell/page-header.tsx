import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: string[];
  className?: string;
  accessory?: React.ReactNode;
}

export function PageHeader({ title, description, actions, breadcrumb, className, accessory }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between mb-5", className)}>
      <div className="min-w-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[11px] text-[hsl(210_14%_42%)] mb-1.5">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[hsl(210_12%_70%)]">/</span>}
                <span
                  className={
                    i === breadcrumb.length - 1
                      ? "text-[hsl(200_25%_25%)] font-semibold"
                      : "hover:text-[hsl(176_84%_25%)] cursor-pointer"
                  }
                >
                  {item}
                </span>
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold tracking-[-0.015em] text-[hsl(195_30%_8%)] leading-tight">
            {title}
          </h1>
          {accessory}
        </div>
        {description && (
          <p className="mt-1.5 text-[13px] text-[hsl(210_14%_42%)] max-w-3xl leading-snug">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
