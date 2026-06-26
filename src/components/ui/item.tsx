import * as React from "react"
import { cn } from "@/lib/utils"

const Item = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
Item.displayName = "Item"

export { Item }
