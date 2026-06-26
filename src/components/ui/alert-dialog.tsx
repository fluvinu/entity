import * as React from "react"
import { cn } from "@/lib/utils"

const AlertDialog = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  )
}

const AlertDialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("p-6", className)}>{children}</div>
)

const AlertDialogHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mb-4", className)}>{children}</div>
)

const AlertDialogFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex justify-end gap-2 mt-4", className)}>{children}</div>
)

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
)
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
)
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => <button ref={ref} className={cn("inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90", className)} {...props} />
)
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => <button ref={ref} className={cn("inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent", className)} {...props} />
)
AlertDialogCancel.displayName = "AlertDialogCancel"

const AlertDialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>

export { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger }
