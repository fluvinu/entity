import * as React from "react"
import { cn } from "@/lib/utils"

const Calendar = ({ className }: { className?: string }) => (
  <div className={cn("p-3", className)}>
    <p className="text-sm text-muted-foreground">Calendar component</p>
  </div>
)

export { Calendar }
