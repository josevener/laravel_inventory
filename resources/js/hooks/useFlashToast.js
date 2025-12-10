// resources/js/hooks/useFlashToast.js
import { useEffect } from "react"
import { usePage } from "@inertiajs/react"
import { useToast } from "./use-toast"

export function useFlashToast() {
  const { toast } = useToast()
  const { flash } = usePage().props

  useEffect(() => {
    if (flash.success) {
      toast({
        title: "Success",
        description: flash.success,
      })
    }

    if (flash.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: flash.error,
      })
    }

    if (flash.warning) {
      toast({
        title: "Warning",
        description: flash.warning,
        variant: "default",
      })
    }

    if (flash.info) {
      toast({
        title: "Info",
        description: flash.info,
      })
    }
  }, [flash, toast])
}