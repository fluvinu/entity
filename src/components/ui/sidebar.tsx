import * as React from "react"
import { cn } from "@/lib/utils"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-full w-[250px] flex-col border-r bg-background", className)} {...props} />
))
Sidebar.displayName = "Sidebar"

export { Sidebar }
