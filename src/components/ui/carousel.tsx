import * as React from "react"
import { cn } from "@/lib/utils"

const Carousel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative overflow-hidden", className)}>
    <div className="flex">{children}</div>
  </div>
)

export { Carousel }
