import * as React from "react"
import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <nav ref={ref} className={cn("relative flex items-center", className)} {...props}>
    {children}
  </nav>
))
NavigationMenu.displayName = "NavigationMenu"

export { NavigationMenu }
