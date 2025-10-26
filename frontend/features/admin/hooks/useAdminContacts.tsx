import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "@hooks/useToast.tsx";
import type { Contact, ContactCreate } from "@shared/schema";
import { qk } from "../../../shared/lib/query/keys.ts";
import {
  listContacts,
  verifyContact,
  unverifyContact,
  updateContact,
  deleteContact,
} from "../services/contacts.api.ts";

type ContactRow = Contact;

export function useAdminContacts() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: qk.contacts.list, queryFn: listContacts });
  const toast = useToast();

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await verifyContact(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: qk.contacts.list });
      const previous = queryClient.getQueryData<ContactRow[]>(qk.contacts.list) || [];
      queryClient.setQueryData<ContactRow[]>(qk.contacts.list, (old = []) =>
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
      if (context?.previous) {
        queryClient.setQueryData(qk.contacts.list, context.previous);
      }
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
        description: `${data.firstName} ${data.lastName} marked as verified.`,
        variant: "success",
        actionLabel: "Undo",
        onAction: () => unverifyMutation.mutate(String(id)),
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.contacts.list }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteContact(id);
      return id;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: qk.contacts.list });
      const previous = queryClient.getQueryData<ContactRow[]>(qk.contacts.list) || [];
      queryClient.setQueryData<ContactRow[]>(qk.contacts.list, (old = []) =>
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
      if (context?.previous) {
        queryClient.setQueryData(qk.contacts.list, context.previous);
      }
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.contacts.list }),
  });

  // mutation to undo verify
  const unverifyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await unverifyContact(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: qk.contacts.list });
      const previous = queryClient.getQueryData<ContactRow[]>(qk.contacts.list) || [];
      queryClient.setQueryData<ContactRow[]>(qk.contacts.list, (old = []) =>
        old.map((c) => (c.id === id ? { ...c, verified: false } : c))
      );
      return { previous } as { previous: ContactRow[] };
    },
    onError: (_err, _id, context?: { previous: ContactRow[] }) => {
      if (context?.previous) {
        queryClient.setQueryData(qk.contacts.list, context.previous);
      }
      toast.open({ title: "Undo failed", variant: "error" });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.contacts.list }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ContactCreate;
    }) => {
      return await updateContact(id, payload);
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: qk.contacts.list });
      const previous = queryClient.getQueryData<ContactRow[]>(qk.contacts.list) || [];
      queryClient.setQueryData<ContactRow[]>(qk.contacts.list, (old = []) =>
        old.map((c) => (c.id === id ? { ...c, ...payload } : c))
      );
      const toastId = toast.open({
        title: "Saving...",
        variant: "info",
        duration: 60000,
      });
      return { previous, toastId } as {
        previous: ContactRow[];
        toastId?: string;
      };
    },
    onError: (
      _err,
      _vars,
      context?: { previous: ContactRow[]; toastId?: string }
    ) => {
      if (context?.previous) {
        queryClient.setQueryData(qk.contacts.list, context.previous);
      }
      if (context?.toastId) toast.dismiss(context.toastId);
      toast.open({ title: "Update failed", variant: "error" });
    },
    onSuccess: (
      _data,
      _vars,
      context?: { previous: ContactRow[]; toastId?: string }
    ) => {
      if (context?.toastId) toast.dismiss(context.toastId);
      toast.open({ title: "Contact updated", variant: "success" });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.contacts.list }),
  });

  return { query, verifyMutation, deleteMutation, updateMutation };
}

export type { ContactRow };
