"use client"

import { useToast } from './use-toast'
import { Toast } from '@/components/ui/toast'

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="fixed top-0 right-0 p-4 space-y-4 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  )
}