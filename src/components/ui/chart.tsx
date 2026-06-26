import * as React from "react"
import { cn } from "@/lib/utils"

const ChartContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("w-full", className)}>{children}</div>
)

export { ChartContainer }
