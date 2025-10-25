import { useToastContext } from "@ui/ToastManager.tsx";

export function useToast() {
  const ctx = useToastContext();
  return {
    open: (opts: {
      title: string;
      description?: string;
      variant?: "default" | "success" | "error" | "info";
      actionLabel?: string;
      onAction?: (() => void) | null;
      duration?: number;
    }) => ctx.push(opts),
    dismiss: (id: string) => ctx.dismiss(id),
  };
}

export default useToast;
