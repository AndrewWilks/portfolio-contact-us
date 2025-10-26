import Button from "@ui/Primitives/Button.tsx";
import { useConfirmContext } from "@ui/ConfirmDialog.tsx";

type Props = {
  title?: string;
  description?: string;
  onLocalConfirm?: (choice: "save" | "discard" | "cancel") => void;
};

export default function CloseConfirmModal({
  title,
  description,
  onLocalConfirm,
}: Props) {
  // Prefer the global confirmThreeWay when available
  type ThreeWayCtx = {
    confirmThreeWay?: (
      msg: string,
      opts?: unknown
    ) => Promise<"save" | "discard" | "cancel">;
  };

  let ctx: ThreeWayCtx | null = null;
  try {
    ctx = useConfirmContext() as ThreeWayCtx;
  } catch {
    ctx = null;
  }

  const handleOpen = async () => {
    if (ctx?.confirmThreeWay) {
      const res = await ctx.confirmThreeWay(description ?? "Save changes?");
      onLocalConfirm?.(res);
      return;
    }
    // Fallback to local UI modal if provider not present — simple confirm via globalThis
    const choice = globalThis.confirm(
      title ?? "You have unsaved changes. Save first?"
    );
    onLocalConfirm?.(choice ? "save" : "discard");
  };

  return (
    <div>
      <Button variant="secondary" onClick={handleOpen}>
        Close
      </Button>
    </div>
  );
}
