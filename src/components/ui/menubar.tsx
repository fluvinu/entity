import * as React from "react"
import { cn } from "@/lib/utils"

const Menubar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-1 rounded-md border bg-background p-1", className)} {...props} />
))
Menubar.displayName = "Menubar"

export { Menubar }
