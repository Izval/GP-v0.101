import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
  onDismiss?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", onDismiss, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden",
          variant === "destructive" && "bg-red-600 text-white",
          className
        )}
        {...props}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-1">{props.children}</div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="ml-4 text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }