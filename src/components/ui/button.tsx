import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "cyan" | "ghost" | "outline" | "link" | "destructive"
  size?: "sm" | "default" | "lg"
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, children, ...props }, ref) => {
    
    const Comp = asChild ? Slot : "button"

    const sizeClasses = {
      sm: "h-8 px-4 text-[10px] tracking-wider",
      default: "h-10 px-6 text-xs tracking-widest",
      lg: "h-12 px-8 text-sm tracking-widest",
    }

    // Configure the borderBg and innerBg as tailwind classes for before/after pseudo-elements
    const variantStyles = {
      primary: 
        "before:bg-neutral-800 hover:before:bg-cyan-500 after:bg-white text-black hover:text-white hover:after:bg-black",
      secondary: 
        "before:bg-neutral-800 hover:before:bg-neutral-700 after:bg-black text-neutral-400 hover:text-white hover:after:bg-black",
      cyan: 
        "before:bg-cyan-500/30 hover:before:bg-cyan-400 after:bg-cyan-950/20 text-cyan-400 hover:text-cyan-300 hover:after:bg-cyan-950/50",
      ghost: 
        "before:bg-transparent hover:before:bg-neutral-800 after:bg-transparent text-neutral-500 hover:text-neutral-200",
      outline:
        "before:bg-white/20 hover:before:bg-white/40 after:bg-transparent hover:after:bg-white/10 text-white/80 hover:text-white",
      link:
        "before:bg-transparent after:bg-transparent text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline",
      destructive:
        "before:bg-red-500/30 hover:before:bg-red-400 after:bg-red-950/20 text-red-300 hover:text-red-200 hover:after:bg-red-950/50",
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center uppercase font-orbitron font-semibold select-none cursor-pointer group active:scale-98 transition-all duration-150 outline-none focus-visible:ring-1 focus-visible:ring-cyan-500",
          // Before element represents the border layer
          "before:absolute before:inset-0 before:-z-20 before:[clip-path:polygon(0_6px,_6px_0,_100%_0,_100%_calc(100%-6px),_calc(100%-6px)_100%,_0_100%)] before:transition-colors before:duration-150",
          // After element represents the inner background layer
          "after:absolute after:inset-[1px] after:-z-10 after:[clip-path:polygon(0_5.5px,_5.5px_0,_100%_0,_100%_calc(100%-5.5px),_calc(100%-5.5px)_100%,_0_100%)] after:transition-colors after:duration-150",
          sizeClasses[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"
