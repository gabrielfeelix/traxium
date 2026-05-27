import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-[hsl(200_18%_88%)] bg-white px-3 py-2 text-[13px] text-[hsl(200_25%_12%)] transition-all",
        "placeholder:text-[hsl(210_12%_58%)] focus:outline-none focus:border-[hsl(176_60%_55%)] focus:ring-2 focus:ring-[hsl(176_84%_45%_/_0.18)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
