import type { ContactRow as ContactRowType } from "@features/admin/hooks/useAdminContacts.tsx";
import Button from "@ui/Primitives/Button.tsx";
import { CheckCheck } from "lucide-react";
import ShinyCard from "@ui/Affects/ShinyCard.tsx";

interface Props {
  contact: ContactRowType;
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (contact: ContactRowType) => void;
}

// TODO: improve the layout of the contact row. use grid and also be prepared for it
// to become a card in a grid instead of a vertical stack like we have at the moment.

export function ContactRow({ contact, onVerify, onDelete, onView }: Props) {
  return (
    <ShinyCard className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-(--text)">
            {contact.firstName} {contact.lastName}
          </div>
          <div className="text-sm text-(--muted)">{contact.email}</div>
          <div className="text-sm text-(--muted)">{contact.phone}</div>
        </div>
        <div className="text-sm">
          {contact.verified
            ? (
              <span className="text-(--success)" title="Verified">
                <CheckCheck />
              </span>
            )
            : (
              <Button
                type="button"
                variant="outline"
                size="small"
                icon="CheckCircle"
                onClick={() => onVerify(contact.id)}
              >
                Verify
              </Button>
            )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="muted"
          size="small"
          icon="Eye"
          onClick={() => onView?.(contact)}
        >
          View
        </Button>
        <Button
          type="button"
          variant="danger"
          size="small"
          icon="Trash2"
          onClick={() => onDelete(contact.id)}
        >
          Delete
        </Button>
      </div>
    </ShinyCard>
  );
}

export default ContactRow;
