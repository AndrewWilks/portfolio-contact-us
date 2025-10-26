import { type UseFormReset } from "react-hook-form";
import type { ContactCreate } from "@shared/schema";

export function onDiscard(
  initialValues: ContactCreate | undefined,
  reset: UseFormReset<ContactCreate>,
) {
  reset(
    initialValues || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  );
}
