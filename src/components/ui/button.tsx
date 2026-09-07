import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] font-normal uppercase tracking-[0.05em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:pointer-events-none disabled:opacity-50 shadow-none",
  {
    variants: {
      variant: {
        default:
          "border border-ink bg-transparent px-[19px] py-[8px] text-[11px] text-ink hover:bg-ink hover:text-parchment",
        destructive:
          "border border-ink bg-transparent px-[19px] py-[8px] text-[11px] text-ink hover:bg-ink hover:text-parchment",
        outline:
          "border border-ink bg-transparent px-[19px] py-[8px] text-[11px] text-ink hover:bg-ink hover:text-parchment",
        secondary:
          "border border-ink bg-transparent px-[19px] py-[8px] text-[11px] text-ink hover:bg-ink hover:text-parchment",
        ghost:
          "rounded-[10px] px-0 py-[5px] text-[15px] normal-case tracking-[0.15px] text-ink hover:underline",
        link: "rounded-[10px] px-0 py-[5px] text-[15px] normal-case tracking-[0.15px] text-ink underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto",
        sm: "h-auto px-[19px] py-[8px] text-[11px]",
        lg: "h-auto px-[19px] py-[8px] text-[11px]",
        icon: "size-10 p-0",
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
