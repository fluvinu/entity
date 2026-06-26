import * as React from "react"
import { cn } from "@/lib/utils"

const ContextMenu = ({ children }: { children: React.ReactNode }) => <>{children}</>
const ContextMenuTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>
const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} />
))
ContextMenuContent.displayName = "ContextMenuContent"

export { ContextMenu, ContextMenuTrigger, ContextMenuContent }
