import { writable } from "svelte/store";

export type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
};

export const toasts = writable<Toast[]>([]);

export function addToast(
  message: string,
  type: Toast["type"] = "info",
  duration = 3000,
) {
  const id = crypto.randomUUID();
  const toast: Toast = { id, message, type, duration };

  toasts.update((current) => [...current, toast]);

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

export function removeToast(id: string) {
  toasts.update((current) => current.filter((toast) => toast.id !== id));
}

export function clearToasts() {
  toasts.set([]);
}

// Convenience functions
export const toast = {
  success: (message: string, duration?: number) =>
    addToast(message, "success", duration),
  error: (message: string, duration?: number) =>
    addToast(message, "error", duration),
  info: (message: string, duration?: number) =>
    addToast(message, "info", duration),
  warning: (message: string, duration?: number) =>
    addToast(message, "warning", duration),
};
