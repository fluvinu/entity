import * as React from "react"
import { cn } from "@/lib/utils"

const Toaster = ({ className }: { className?: string }) => (
  <div className={cn("fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4", className)} />
)

export { Toaster }
