import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"

export function Toaster() {
  return (
    <ToastProvider>
      <Toast title="Session saved" description="Your level was auto-saved." />
      <ToastClose />
      <ToastViewport />
    </ToastProvider>
  )
}
