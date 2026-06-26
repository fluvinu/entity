import * as React from "react"
import { cn } from "@/lib/utils"

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("inline-flex items-center rounded-md border", className)} {...props} />
))
ToggleGroup.displayName = "ToggleGroup"

export { ToggleGroup }
