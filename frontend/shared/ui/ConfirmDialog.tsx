import React, { createContext, useCallback, useContext, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "./Primitives/Button.tsx";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmContextValue = {
  confirm: (message: string, opts?: ConfirmOptions) => Promise<boolean>;
  // New: three-way confirm used by components that need Save|Discard|Cancel
  confirmThreeWay: (
    message: string,
    opts?: ConfirmOptions,
  ) => Promise<"save" | "discard" | "cancel">;
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
  const [threeWayResolver, setThreeWayResolver] = useState<
    ((v: "save" | "discard" | "cancel") => void) | null
  >(null);
  // three-way state is inferred from threeWayResolver presence

  const confirm = useCallback((msg: string, opts?: ConfirmOptions) => {
    setMessage(msg);
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const confirmThreeWay = useCallback((msg: string, opts?: ConfirmOptions) => {
    setMessage(msg);
    setOptions(opts);
    setOpen(true);
    return new Promise<"save" | "discard" | "cancel">((resolve) => {
      setThreeWayResolver(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (resolver) {
      resolver(false);
      setResolver(null);
    }
    if (threeWayResolver) {
      threeWayResolver("cancel");
      setThreeWayResolver(null);
    }
  }, [resolver, threeWayResolver]);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    if (resolver) {
      resolver(true);
      setResolver(null);
    }
    if (threeWayResolver) {
      threeWayResolver("save");
      setThreeWayResolver(null);
    }
  }, [resolver, threeWayResolver]);

  const handleThreeWayDiscard = useCallback(() => {
    setOpen(false);
    if (threeWayResolver) {
      threeWayResolver("discard");
      setThreeWayResolver(null);
    }
  }, [threeWayResolver]);

  return (
    <ConfirmContext.Provider value={{ confirm, confirmThreeWay }}>
      {children}
      <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-9999" />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-10000">
            <Dialog.Content className="bg-(--card) border-(--border) p-4 rounded shadow-lg w-full max-w-md z-10001">
              <Dialog.Title className="font-semibold">
                {options?.title ?? "Please confirm"}
              </Dialog.Title>
              <Dialog.Description className="mt-2">
                {options?.description ?? message}
              </Dialog.Description>
              <div className="mt-4 flex justify-end gap-2">
                {/* If a three-way confirm is active, render Cancel | Discard | Save */}
                {threeWayResolver
                  ? (
                    <>
                      <Button onClick={handleClose} variant="secondary">
                        {options?.cancelText ?? "Cancel"}
                      </Button>
                      <Button variant="ghost" onClick={handleThreeWayDiscard}>
                        {options?.cancelText ?? "Discard"}
                      </Button>
                      <Button variant="primary" onClick={handleConfirm}>
                        {options?.confirmText ?? "Save"}
                      </Button>
                    </>
                  )
                  : (
                    <>
                      <Button onClick={handleClose} variant="secondary">
                        {options?.cancelText ?? "Cancel"}
                      </Button>
                      <Button variant="danger" onClick={handleConfirm}>
                        {options?.confirmText ?? "Delete"}
                      </Button>
                    </>
                  )}
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
  if (!ctx) {
    throw new Error(
      "useConfirmContext must be used within ConfirmDialogProvider",
    );
  }
  return ctx;
}

export default ConfirmDialogProvider;
