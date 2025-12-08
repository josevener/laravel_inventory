import { usePage } from "@inertiajs/react"
import { useEffect } from "react"
import { useToast } from "./use-toast"

export function useToastNotification() {
  const { toast } = useToast()
  const { flash, errors } = usePage().props

  useEffect(() => {
    // Success message
    if (flash?.success) {
      toast({
        title: "Success",
        description: flash.success,
      })
    }

    // Error message
    if (flash?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: flash.error,
      })
    }

    // Validation errors (Laravel)
    if (errors && Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0]
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: firstError,
      })
    }
  }, [flash, errors, toast])
}