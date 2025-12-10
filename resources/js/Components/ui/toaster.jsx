import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()
  
  const getToastStyle = (title) => {
    const t = title?.toLowerCase() || ""
    if (t.includes("success")) {
      return "border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"
    }
    if (t.includes("error") || t.includes("fail")) {
      return "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
    }
    if (t.includes("warning")) {
      return "border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100"
    }
    if (t.includes("info")) {
      return "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
    }
    return "border-gray-200 bg-white dark:bg-gray-800"
  }

  const getIcon = (title) => {
    const t = title?.toLowerCase() || ""
    if (t.includes("success")) return <CheckCircle2 className="h-5 w-5 text-green-600" />
    if (t.includes("error") || t.includes("fail")) return <AlertCircle className="h-5 w-5 text-red-600" />
    if (t.includes("warning")) return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    if (t.includes("info")) return <Info className="h-5 w-5 text-blue-600" />
    return null
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const style = getToastStyle(title)
        const icon = getIcon(title)

        return (
          <Toast key={id} {...props} className={cn("border-2 shadow-lg", style)}>
            {icon && <div className="mt-0.5">{icon}</div>}
            <div className="grid gap-1 flex-1">
              {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
