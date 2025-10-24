/* eslint-disable react/no-inline-styles */
import { createFileRoute } from "@tanstack/react-router";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { useRef } from "react";
import { useAdminContacts } from "../../hooks/useAdminContacts.tsx";
import { useConfirm } from "../../hooks/useConfirm.tsx";
import ContactRow from "@components/Admin/ContactRow.tsx";

export const Route = createFileRoute("/admin/")({ component: AdminContacts });

// TODO: Add a button view to see the contact'e details
function AdminContacts() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const { query, verifyMutation, deleteMutation } = useAdminContacts();

  const data = query.data ?? [];

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  if (query.isLoading) return <div className="p-4">Loading contacts...</div>;

  if (query.isError)
    return <div className="p-4 text-(--danger)">Error loading contacts</div>;

  const virtualItems = rowVirtualizer.getVirtualItems();
  const confirm = useConfirm();

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Admin - Contacts</h2>
      <div
        ref={parentRef}
        className="overflow-auto h-[calc(100vh-8rem)] border"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualItems.map((virtualRow: VirtualItem) => {
            const contact = data[virtualRow.index];
            return (
              <div
                key={contact.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="px-2 pb-2"
              >
                <ContactRow
                  contact={contact}
                  onVerify={(id) => verifyMutation.mutate(id)}
                  onDelete={(id) => {
                    (async () => {
                      const ok = await confirm("Delete this contact?");
                      if (ok) deleteMutation.mutate(id);
                    })();
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
