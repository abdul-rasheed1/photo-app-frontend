import { toast as sonnerToast } from "sonner"

export function useToast() {
  return {
    toast: (input, options = {}) => {
      if (typeof input === "string") {
        // Simple message
        sonnerToast(input, options)
      } else if (typeof input === "object") {
        // Support old style: toast({ title, description })
        const { title, description, variant } = input
        const msg = description ? `${title}: ${description}` : title
        if (variant === "destructive") sonnerToast.error(msg)
        else sonnerToast(msg)
      }
    },
  }
}
