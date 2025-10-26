/* eslint-disable react/no-inline-styles */
import { createFileRoute } from "@tanstack/react-router";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { lazy, Suspense, useRef, useState } from "react";
import { useAdminContacts } from "@features/admin/hooks/useAdminContacts.tsx";
import { useConfirm } from "@hooks/useConfirm.tsx";
import ContactRow from "@features/admin/components/ContactRow.tsx";
const ContactDetailsSidebar = lazy(
  () => import("@blocks/ContactDetailsSidebar.tsx"),
);

export const Route = createFileRoute("/admin/")({ component: AdminContacts });

function AdminContacts() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const { query, verifyMutation, deleteMutation, updateMutation } =
    useAdminContacts();
  const [selected, setSelected] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedContact = (query.data ?? []).find((c) => c.id === selected) ??
    null;

  const data = query.data ?? [];

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  if (query.isLoading) return <div className="p-4">Loading contacts...</div>;

  if (query.isError) {
    return <div className="p-4 text-(--danger)">Error loading contacts</div>;
  }

  const virtualItems = rowVirtualizer.getVirtualItems();
  const confirm = useConfirm();

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Admin - Contacts</h2>
      <div ref={parentRef} className="overflow-auto h-[calc(100vh-8rem)]">
        <div
          className="relative"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {virtualItems.map((virtualRow: VirtualItem) => {
            const contact = data[virtualRow.index];
            return (
              <div
                key={contact.id}
                className="absolute top-0 left-0 w-full px-2 pb-2"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
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
                  onView={(c) => {
                    setSelected(c.id);
                    setSidebarOpen(true);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <Suspense fallback={null}>
        <ContactDetailsSidebar
          open={sidebarOpen}
          contact={selectedContact}
          onRequestClose={() => setSidebarOpen(!sidebarOpen)}
          onClose={() => setSelected(null)}
          onSave={async (id, payload) => {
            await updateMutation.mutateAsync({ id, payload });
          }}
        />
      </Suspense>
    </>
  );
}
