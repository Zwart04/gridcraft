"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext<{
  toasts: Array<{ id: string; title?: string; description?: string }>
  addToast: (title?: string, description?: string) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<{ id: string; title?: string; description?: string }>>([])
  const addToast = React.useCallback((title?: string, description?: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, title, description }])
    setTimeout(() => removeToast(id), 4000)
  }, [])
  const removeToast = React.useCallback((id: string) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
  }, [])
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return React.useContext(ToastContext)
}

function ToastTitle({ children }: { children: React.ReactNode }) {
  return <div className="font-semibold">{children}</div>
}

function ToastDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm opacity-90">{children}</div>
}

export function Toast({ title, description, className, ...props }: { title?: string; description?: string; className?: string }) {
  return (
    <div className={cn("pointer-events-auto relative flex w-full max-w-md overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full", className)} {...props}>
      <div className="flex flex-col space-y-1 text-sm">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
      </div>
      <ToastClose className="absolute right-1 top-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-white data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ToastClose>
    </div>
  )
}

export function ToastClose({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 w-8 shrink-0 overflow-hidden rounded-md p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      aria-label="Close notification"
      {...props}
    />
  )
}

export function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 top-0 z-50 flex max-h-screen w-full items-start justify-end p-4 sm:px-0 sm:py-0",
        className
      )}
      aria-live="off"
      {...props}
    />
  )
}

export { ToastTitle, ToastDescription }
