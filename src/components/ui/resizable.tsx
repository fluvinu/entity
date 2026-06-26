import * as React from "react"
import { cn } from "@/lib/utils"

const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1", className)} {...props} />
))
ResizablePanel.displayName = "ResizablePanel"

export { ResizablePanel }
