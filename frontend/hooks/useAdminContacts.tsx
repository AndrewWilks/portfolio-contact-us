import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast.tsx";

type ContactRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  verified?: boolean;
  createdAt?: number;
};

export function useAdminContacts() {
  const queryClient = useQueryClient();

  const fetchContacts = async (): Promise<ContactRow[]> => {
    const res = await fetch("/api/contacts");
    if (!res.ok) throw new Error("Failed to load contacts");
    const body = await res.json();
    return body.data as ContactRow[];
  };

  const query = useQuery({ queryKey: ["contacts"], queryFn: fetchContacts });
  const toast = useToast();

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contacts/${id}/verify`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to verify");
      const body = await res.json();
      return body.data as ContactRow;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["contacts"] });
      const previous =
        queryClient.getQueryData<ContactRow[]>(["contacts"]) || [];
      queryClient.setQueryData<ContactRow[]>(["contacts"], (old = []) =>
        old.map((c) => (c.id === id ? { ...c, verified: true } : c))
      );
      // show a processing toast and keep id in context
      const toastId = toast.open({
        title: "Verifying...",
        variant: "info",
        duration: 60000,
      });
      return { previous, toastId } as {
        previous: ContactRow[];
        toastId: string;
      };
    },
    onError: (
      _err,
      _id,
      context?: { previous: ContactRow[]; toastId?: string }
    ) => {
      if (context?.previous)
        queryClient.setQueryData(["contacts"], context.previous);
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      toast.open({
        title: "Verify failed",
        description: "Could not verify contact.",
        variant: "error",
      });
    },
    onSuccess: (
      data,
      id,
      context?: { previous: ContactRow[]; toastId?: string }
    ) => {
      if (context?.toastId) toast.dismiss(context.toastId);
      // show success with undo
      toast.open({
        title: "Contact verified",
        description: `${data.first_name} ${data.last_name} marked as verified.`,
        variant: "success",
        actionLabel: "Undo",
        onAction: () => unverifyMutation.mutate(String(id)),
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
      return id;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["contacts"] });
      const previous =
        queryClient.getQueryData<ContactRow[]>(["contacts"]) || [];
      queryClient.setQueryData<ContactRow[]>(["contacts"], (old = []) =>
        old.filter((c) => c.id !== id)
      );
      const toastId = toast.open({
        title: "Deleting...",
        variant: "info",
        duration: 60000,
      });
      return { previous, toastId } as {
        previous: ContactRow[];
        toastId: string;
      };
    },
    onError: (
      _err,
      _id,
      context?: { previous: ContactRow[]; toastId?: string }
    ) => {
      if (context?.previous)
        queryClient.setQueryData(["contacts"], context.previous);
      if (context?.toastId) toast.dismiss(context.toastId);
      toast.open({
        title: "Delete failed",
        description: "Could not delete contact.",
        variant: "error",
      });
    },
    onSuccess: (
      _id,
      _variables,
      context?: { previous: ContactRow[]; toastId?: string }
    ) => {
      if (context?.toastId) toast.dismiss(context.toastId);
      toast.open({ title: "Contact deleted", variant: "success" });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });

  // mutation to undo verify
  const unverifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contacts/${id}/unverify`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to unverify");
      const body = await res.json();
      return body.data as ContactRow;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["contacts"] });
      const previous =
        queryClient.getQueryData<ContactRow[]>(["contacts"]) || [];
      queryClient.setQueryData<ContactRow[]>(["contacts"], (old = []) =>
        old.map((c) => (c.id === id ? { ...c, verified: false } : c))
      );
      return { previous } as { previous: ContactRow[] };
    },
    onError: (_err, _id, context?: { previous: ContactRow[] }) => {
      if (context?.previous)
        queryClient.setQueryData(["contacts"], context.previous);
      toast.open({ title: "Undo failed", variant: "error" });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });

  return { query, verifyMutation, deleteMutation };
}

export type { ContactRow };
