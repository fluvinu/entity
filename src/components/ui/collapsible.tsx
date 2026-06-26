import * as React from "react"
import { cn } from "@/lib/utils"

const Collapsible = ({ children, open }: { children: React.ReactNode; open?: boolean }) => {
  return <>{children}</>
}

const CollapsibleTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("overflow-hidden transition-all", className)} {...props} />
))
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
