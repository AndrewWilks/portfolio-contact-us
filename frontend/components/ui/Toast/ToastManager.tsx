import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import * as RadixToast from "@radix-ui/react-toast";

type Toast = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  variant?: "default" | "success" | "error" | "info";
  actionLabel?: string;
  onAction?: (() => void) | null;
};

type ToastContextValue = {
  push: (t: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    setToasts((s) => [...s, { id, ...t }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <RadixToast.Provider>
        <div aria-live="polite">
          {toasts.map((t) => {
            const base = "p-3 rounded shadow-md flex items-start gap-3 border ";
            const variantClass = t.variant === "error"
              ? "bg-[var(--danger)] text-white border-transparent"
              : t.variant === "success"
              ? "bg-[var(--success)] text-white border-transparent"
              : t.variant === "info"
              ? "bg-[var(--accent)] text-white border-transparent"
              : "bg-[var(--card)] text-[var(--text)] border-[var(--border)]";

            return (
              <RadixToast.Root
                key={t.id}
                open
                onOpenChange={(open) => {
                  if (!open) dismiss(t.id);
                }}
                duration={t.duration ?? 4000}
                className={base + variantClass}
              >
                <div className="flex-0 mt-0.5">
                  {t.variant === "error"
                    ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4a1 1 0 112 0 1 1 0 01-2 0zm0-7a1 1 0 012 0v4a1 1 0 11-2 0V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )
                    : t.variant === "success"
                    ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )
                    : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016.862 3H3.138a2 2 0 00-1.135 2.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    )}
                </div>
                <div className="flex-1">
                  <RadixToast.Title className="font-semibold">
                    {t.title}
                  </RadixToast.Title>
                  {t.description
                    ? (
                      <RadixToast.Description className="text-sm opacity-90">
                        {t.description}
                      </RadixToast.Description>
                    )
                    : null}
                </div>
                <div className="flex-0 ml-2 flex items-center gap-2">
                  {t.actionLabel
                    ? (
                      <button
                        type="button"
                        onClick={() => {
                          t.onAction?.();
                          dismiss(t.id);
                        }}
                        className={"px-2 py-1 rounded text-sm font-medium focus:outline-none " +
                          (t.variant === "error" || t.variant === "success"
                            ? "bg-white text-(--text) dark:bg-gray-700"
                            : "bg-(--primary) text-white")}
                      >
                        {t.actionLabel}
                      </button>
                    )
                    : null}
                  <RadixToast.Close className="ml-2">✕</RadixToast.Close>
                </div>
              </RadixToast.Root>
            );
          })}
        </div>
        <RadixToast.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToastContext must be used within ToastManagerProvider");
  }
  return ctx;
}

export default ToastManagerProvider;
