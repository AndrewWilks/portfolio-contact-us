/* eslint-disable react/no-inline-styles */
import { createFileRoute } from "@tanstack/react-router";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { useAdminContacts } from "@features/admin/hooks/useAdminContacts.tsx";
import { useConfirm } from "@hooks/useConfirm.tsx";
import ContactRow from "@features/admin/components/ContactRow.tsx";
import ContactDetailsSidebarBlock from "@blocks/ContactDetailsSidebar.tsx";

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

  // Responsive grid: compute items per row from container width
  const [containerWidth, setContainerWidth] = useState<number>(0);
  useEffect(() => {
    if (!parentRef.current) return;
    const el = parentRef.current;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setContainerWidth(w);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Card min width and gap should mirror CSS (gap-4 => 16px)
  const MIN_CARD_WIDTH = 340; // px
  const GAP = 16; // px
  const itemsPerRow = Math.max(
    1,
    Math.floor((containerWidth + GAP) / (MIN_CARD_WIDTH + GAP)),
  );
  const rowCount = Math.ceil(data.length / itemsPerRow);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    // A slightly generous default; real size will be measured below
    estimateSize: () => 200,
    overscan: 6,
    measureElement: (el) => el.getBoundingClientRect().height,
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
      <div ref={parentRef} className="overflow-auto h-[calc(100vh-16rem)]">
        <div
          className="relative"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {virtualItems.map((virtualRow: VirtualItem) => {
            const startIndex = virtualRow.index * itemsPerRow;
            const rowItems = data.slice(startIndex, startIndex + itemsPerRow);
            return (
              <div
                ref={rowVirtualizer.measureElement}
                key={virtualRow.key}
                className="absolute top-0 left-0 w-full px-2 pb-2"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns:
                      `repeat(${itemsPerRow}, minmax(0, 1fr))`,
                  }}
                >
                  {rowItems.map((contact) => (
                    <div key={contact.id}>
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
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ContactDetailsSidebarBlock
        open={sidebarOpen}
        contact={selectedContact}
        onRequestClose={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSelected(null)}
        onSave={async (id, payload) => {
          await updateMutation.mutateAsync({ id, payload });
        }}
      />
    </>
  );
}
