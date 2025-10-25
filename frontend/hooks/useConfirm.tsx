import { useConfirmContext } from "@ui/ConfirmDialog.tsx";

export function useConfirm() {
  const ctx = useConfirmContext();
  return ctx.confirm;
}

export default useConfirm;
