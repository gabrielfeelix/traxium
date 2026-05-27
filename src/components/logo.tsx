import { cn } from "@/lib/utils";

export function TraxiumLogo({
  className,
  withText = true,
  size = 28,
  variant = "default",
}: {
  className?: string;
  withText?: boolean;
  size?: number;
  variant?: "default" | "light" | "mono";
}) {
  const isLight = variant === "light";
  const isMono = variant === "mono";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="trx-mark" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={isLight ? "#FFFFFF" : "#127670"} />
            <stop offset="0.55" stopColor={isLight ? "#FFFFFF" : "#0C5862"} />
            <stop offset="1" stopColor={isLight ? "#E6FAF6" : "#0A4974"} />
          </linearGradient>
          <linearGradient id="trx-mark-2" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={isLight ? "#FFFFFF" : "#1FA89F"} stopOpacity="0.9" />
            <stop offset="1" stopColor={isLight ? "#E6FAF6" : "#0E78B5"} stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Hexagonal container = certificado/selo */}
        <path
          d="M20 2.5 L34.5 11 V29 L20 37.5 L5.5 29 V11 Z"
          fill={isMono ? "transparent" : "url(#trx-mark)"}
          stroke={isMono ? "currentColor" : "none"}
          strokeWidth={isMono ? "1.5" : "0"}
        />

        {/* Inner trace lines = trajeto */}
        <path
          d="M11 26 L17 18 L23 22 L29 13"
          stroke={isMono ? "currentColor" : isLight ? "#127670" : "#FFFFFF"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Vertices = checkpoints */}
        <circle cx="11" cy="26" r="2" fill={isMono ? "currentColor" : isLight ? "#127670" : "#FFFFFF"} />
        <circle cx="17" cy="18" r="2" fill={isMono ? "currentColor" : isLight ? "#127670" : "#FFFFFF"} />
        <circle cx="23" cy="22" r="2" fill={isMono ? "currentColor" : isLight ? "#127670" : "#FFFFFF"} />
        <circle cx="29" cy="13" r="2.6" fill={isMono ? "currentColor" : isLight ? "#FFFFFF" : "#5EE0D2"} stroke={isMono ? "currentColor" : isLight ? "#127670" : "#FFFFFF"} strokeWidth="1.4" />
      </svg>
      {withText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "text-[17px] font-bold tracking-tight",
              isLight ? "text-white" : "text-[hsl(195_30%_8%)]"
            )}
            style={{ letterSpacing: "-0.02em" }}
          >
            Traxium
          </span>
          <span
            className={cn(
              "text-[9px] font-semibold uppercase tracking-[0.18em] mt-0.5",
              isLight ? "text-white/60" : "text-[hsl(176_60%_35%)]"
            )}
          >
            Compliance
          </span>
        </div>
      )}
    </div>
  );
}
