"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  type ToastActionElement,
} from "@/components/ui/toast"

// Re-export the toast components
export {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  type ToastActionElement,
}

// Export the toast function from sonner
export { toast as sonnerToast } from "sonner"

type ToastVariant = "default" | "destructive"

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  action?: React.ReactNode
  duration?: number
}

// Create a custom toast function that uses sonner under the hood
export function toast({
  title,
  description,
  variant = "default",
  action,
  duration = 5000,
}: ToastOptions) {
  return sonnerToast.custom(
    (id: string) => (
      <div className="w-full">
        <Toast variant={variant}>
          <div className="grid gap-1">
            <ToastTitle>{title}</ToastTitle>
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      </div>
    ),
    { duration }
  )
}

// Create a simple useToast hook for convenience
export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}

// Create a Toaster component that renders the ToastViewport
export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}

