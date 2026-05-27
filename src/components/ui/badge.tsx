import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-colors leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(174_64%_94%)] text-[hsl(180_80%_18%)]",
        secondary:
          "border-transparent bg-[hsl(200_60%_94%)] text-[hsl(202_92%_24%)]",
        success:
          "border-transparent bg-[hsl(142_65%_93%)] text-[hsl(142_71%_24%)]",
        warning:
          "border-transparent bg-[hsl(36_95%_92%)] text-[hsl(24_88%_32%)]",
        destructive:
          "border-transparent bg-[hsl(0_72%_94%)] text-[hsl(0_70%_38%)]",
        outline:
          "border-[hsl(200_18%_85%)] bg-white text-[hsl(200_25%_25%)]",
        muted:
          "border-transparent bg-[hsl(200_18%_94%)] text-[hsl(210_14%_42%)]",
        regimeA: "border-transparent bg-[hsl(142_65%_93%)] text-[hsl(142_71%_24%)]",
        regimeB: "border-transparent bg-[hsl(48_95%_90%)] text-[hsl(38_90%_28%)]",
        regimeC: "border-transparent bg-[hsl(28_92%_92%)] text-[hsl(24_88%_32%)]",
        regimeD: "border-transparent bg-[hsl(0_72%_94%)] text-[hsl(0_70%_38%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
