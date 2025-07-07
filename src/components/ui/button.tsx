import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-card hover:bg-primary/90 hover:shadow-card-hover hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-card hover:bg-destructive/90 hover:shadow-card-hover hover:-translate-y-0.5",
        outline:
          "border border-input bg-background shadow-card hover:bg-accent hover:text-accent-foreground hover:shadow-card-hover hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-card hover:bg-secondary/80 hover:shadow-card-hover hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline",
        academic: "bg-gradient-academic text-white shadow-academic hover:shadow-floating hover:-translate-y-1 transition-all duration-300 hover:scale-[1.02]",
        academicOutline: "border-2 border-academic-blue text-academic-blue bg-background/50 backdrop-blur-sm hover:bg-academic-blue hover:text-white shadow-card hover:shadow-academic transition-all duration-300 hover:-translate-y-0.5",
        paper: "bg-gradient-paper text-academic-text border border-border/50 shadow-paper hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5",
        glass: "glass text-foreground shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300",
        gradient: "bg-gradient-hero text-white shadow-deep hover:shadow-floating hover:-translate-y-1 transition-all duration-300 hover:scale-[1.02] animate-pulse-glow",
        status: "bg-status-saved text-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
