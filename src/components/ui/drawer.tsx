import * as React from "react"
import { cn } from "@/lib/utils"

const Drawer = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  return <>{children}</>
}

export { Drawer }
