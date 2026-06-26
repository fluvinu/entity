import * as React from "react"
import { cn } from "@/lib/utils"

const Sheet = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed inset-y-0 right-0 h-full w-3/4 max-w-sm border-l bg-background p-6 shadow-lg">
        {children}
      </div>
    </div>
  )
}

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col h-full", className)} {...props} />
))
SheetContent.displayName = "SheetContent"

const SheetTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>

export { Sheet, SheetContent, SheetTrigger }
