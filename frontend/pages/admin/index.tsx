import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/")({ component: AdminContacts });

type ContactRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
};

async function fetchContacts(): Promise<ContactRow[]> {
  const res = await fetch("/api/contacts");
  if (!res.ok) throw new Error("Failed to load contacts");
  return res.json();
}

function AdminContacts() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
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
            <div key={c.id} className="p-3 border rounded">
              <div className="font-medium">
                {c.first_name} {c.last_name}
              </div>
              <div className="text-sm text-gray-600">{c.email}</div>
              {c.phone ? <div className="text-sm">{c.phone}</div> : null}
              {c.message ? (
                <div className="mt-2 text-sm">{c.message}</div>
              ) : null}
            </div>
          ))
        ) : (
          <div>No contacts found</div>
        )}
      </div>
    </div>
  );
}
