import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "icon"
    | "promo"
    | "tab-selected"
    | "tab-default";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-40 select-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a] shadow-none",
      secondary:
        "bg-[#ffffff] text-[#000000] border border-[#e6e6e6] hover:bg-[#f7f7f5] shadow-none",
      tertiary:
        "bg-transparent text-[#000000] hover:bg-[#f7f7f5]",
      icon:
        "bg-[#f7f7f5] text-[#000000] hover:bg-[#e6e6e6] rounded-full p-0 flex items-center justify-center",
      promo:
        "bg-[#ff3d8b] text-[#ffffff] hover:opacity-95 shadow-none",
      "tab-selected":
        "bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a]",
      "tab-default":
        "bg-[#ffffff] text-[#000000] border border-[#e6e6e6] hover:bg-[#f7f7f5]",
    };

    const sizes = {
      default: "h-11 px-5 py-2.5 text-sm",
      sm: "h-9 px-4 text-xs",
      lg: "h-13 px-7 text-base font-semibold",
      icon: "h-10 w-10 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
