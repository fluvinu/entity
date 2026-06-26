import * as React from "react"
import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("h-10 w-10 rounded-md border text-center text-sm", className)} {...props} />
))
InputOTP.displayName = "InputOTP"

export { InputOTP }
