import * as React from "react"
import { cn } from "../../lib/utils"

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, error = false, ...props }, ref) => {
    if (!children) return null

    return (
      <p
        ref={ref}
        className={cn(
          "text-sm font-medium",
          error ? "text-red-500" : "text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export { FormMessage }
