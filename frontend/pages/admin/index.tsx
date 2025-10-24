import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/")({ component: AdminContacts });

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

async function fetchContacts(): Promise<ContactRow[]> {
  const res = await fetch("/api/contacts");
  if (!res.ok) throw new Error("Failed to load contacts");
  const body = await res.json();
  return body.data as ContactRow[];
}

function AdminContacts() {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
  });

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
    onError: (
      _err: unknown,
      _id: string,
      context?: { previous: ContactRow[] }
    ) => {
      if (context?.previous) {
        queryClient.setQueryData(["contacts"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
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
    onError: (
      _err: unknown,
      _id: string,
      context?: { previous: ContactRow[] }
    ) => {
      if (context?.previous) {
        queryClient.setQueryData(["contacts"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  if (isLoading) return <div className="p-4">Loading contacts...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error loading contacts</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Admin — Contacts</h2>
      <div className="space-y-2">
        {data && data.length ? (
          data.map((c) => (
            <div key={c.id} className="p-3 card rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    {c.first_name} {c.last_name}
                  </div>
                  <div className="text-sm text-(--muted)">{c.email}</div>
                </div>
                <div className="text-sm">
                  {c.verified ? (
                    <span className="text-(--success)">Verified</span>
                  ) : (
                    <button
                      type="button"
                      className="px-2 py-1 text-sm bg-(--accent) text-(--text) rounded"
                      onClick={() => verifyMutation.mutate(c.id)}
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
              {c.phone ? <div className="text-sm mt-2">{c.phone}</div> : null}
              {c.message ? (
                <div className="mt-2 text-sm">{c.message}</div>
              ) : null}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  className="px-2 py-1 text-sm bg-(--danger) text-(--primary-foreground) rounded"
                  onClick={() => {
                    if (confirm("Delete this contact?"))
                      deleteMutation.mutate(c.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No contacts found</div>
        )}
      </div>
    </div>
  );
}
