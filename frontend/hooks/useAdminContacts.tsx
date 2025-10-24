import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
      return { previous } as { previous: ContactRow[] };
    },
    onError: (_err, _id, context?: { previous: ContactRow[] }) => {
      if (context?.previous)
        queryClient.setQueryData(["contacts"], context.previous);
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
      return { previous } as { previous: ContactRow[] };
    },
    onError: (_err, _id, context?: { previous: ContactRow[] }) => {
      if (context?.previous)
        queryClient.setQueryData(["contacts"], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });

  return { query, verifyMutation, deleteMutation };
}

export type { ContactRow };
