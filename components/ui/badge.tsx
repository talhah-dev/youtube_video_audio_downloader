import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "lime"
    | "lilac"
    | "cream"
    | "mint"
    | "pink"
    | "coral"
    | "navy"
    | "outline"
    | "soft";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#000000] text-[#ffffff] border-transparent",
    lime: "bg-[#dceeb1] text-[#000000] border-transparent",
    lilac: "bg-[#c5b0f4] text-[#000000] border-transparent",
    cream: "bg-[#f4ecd6] text-[#000000] border-transparent",
    mint: "bg-[#c8e6cd] text-[#000000] border-transparent",
    pink: "bg-[#efd4d4] text-[#000000] border-transparent",
    coral: "bg-[#f3c9b6] text-[#000000] border-transparent",
    navy: "bg-[#1f1d3d] text-[#ffffff] border-transparent",
    outline: "bg-transparent text-[#000000] border border-[#e6e6e6]",
    soft: "bg-[#f7f7f5] text-[#000000] border border-[#f1f1f1]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.54px] select-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
