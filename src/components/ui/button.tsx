"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[13px] font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(176_84%_45%)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(176_84%_25%)] text-white hover:bg-[hsl(180_80%_18%)] shadow-brand-sm",
        gradient:
          "bg-brand-grad text-white shadow-brand-md hover:shadow-brand-lg hover:-translate-y-[1px] active:translate-y-0",
        secondary:
          "bg-[hsl(200_92%_30%)] text-white hover:bg-[hsl(202_92%_24%)]",
        destructive:
          "bg-[hsl(0_78%_50%)] text-white hover:bg-[hsl(0_70%_38%)] shadow-brand-sm",
        outline:
          "border border-[hsl(200_18%_88%)] bg-white text-[hsl(200_25%_18%)] hover:bg-[hsl(174_64%_96%)] hover:text-[hsl(180_80%_18%)] hover:border-[hsl(176_60%_55%)] shadow-brand-sm",
        ghost:
          "text-[hsl(200_25%_18%)] hover:bg-[hsl(174_64%_96%)] hover:text-[hsl(180_80%_18%)]",
        link: "text-[hsl(176_84%_25%)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3.5 py-2",
        sm: "h-8 px-3 text-[12px]",
        lg: "h-11 px-5 text-[14px]",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7 [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
