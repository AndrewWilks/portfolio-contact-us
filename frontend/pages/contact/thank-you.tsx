import { createFileRoute } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/contact/thank-you")({
  component: ThankYou,
});

function ThankYou() {
  const navigate = useNavigate();

  return (
    <Dialog.Root
      open
      onOpenChange={(open: boolean) => {
        if (!open) {
          // Navigate back to the contact page via the router
          navigate({ to: "/contact" });
        }
      }}
    >
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <Dialog.Content className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto bg-white dark:bg-gray-800 rounded-md p-6 max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold">
            Thanks for getting in touch
          </Dialog.Title>
          <p className="mt-2">
            We received your message and will get back to you shortly.
          </p>
          <div className="mt-4 text-right">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => navigate({ to: "/contact" })}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
