import React, { createContext, useCallback, useContext, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmContextValue = {
  confirm: (message: string, opts?: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState<ConfirmOptions | undefined>(undefined);
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);

  const confirm = useCallback((msg: string, opts?: ConfirmOptions) => {
    setMessage(msg);
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (resolver) {
      resolver(false);
      setResolver(null);
    }
  }, [resolver]);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    if (resolver) {
      resolver(true);
      setResolver(null);
    }
  }, [resolver]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Content className="bg-(--card) border-(--border) p-4 rounded shadow-lg w-full max-w-md">
              <Dialog.Title className="font-semibold">
                {options?.title ?? "Please confirm"}
              </Dialog.Title>
              <Dialog.Description className="mt-2">
                {options?.description ?? message}
              </Dialog.Description>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-3 py-1"
                  onClick={handleClose}
                >
                  {options?.cancelText ?? "Cancel"}
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-(--danger) text-white rounded"
                  onClick={handleConfirm}
                >
                  {options?.confirmText ?? "Delete"}
                </button>
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </ConfirmContext.Provider>
  );
}

export function useConfirmContext() {
  const ctx = useContext(ConfirmContext);
  if (!ctx)
    throw new Error(
      "useConfirmContext must be used within ConfirmDialogProvider"
    );
  return ctx;
}

export default ConfirmDialogProvider;
