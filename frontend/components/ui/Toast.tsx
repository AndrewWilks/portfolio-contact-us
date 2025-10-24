import * as RadixToast from "@radix-ui/react-toast";
import React from "react";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <RadixToast.Provider>{children}</RadixToast.Provider>;
}

export function Viewport() {
  return (
    <RadixToast.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" />
  );
}

export function ToastRoot({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <RadixToast.Root className="bg-(--card) border-(--border) p-3 rounded shadow-md">
      <RadixToast.Title className="font-semibold">{title}</RadixToast.Title>
      {description ? (
        <RadixToast.Description>{description}</RadixToast.Description>
      ) : null}
      <RadixToast.Close className="ml-2">Close</RadixToast.Close>
    </RadixToast.Root>
  );
}

export default { ToastProvider, Viewport, ToastRoot };
