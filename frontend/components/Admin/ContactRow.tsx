import Card from "@ui/Card.tsx";
import type { ContactRow as ContactRowType } from "../../hooks/useAdminContacts.tsx";
import Button from "@ui/Button.tsx";
import { CheckCheck } from "lucide-react";

interface Props {
  contact: ContactRowType;
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (contact: ContactRowType) => void;
}

export function ContactRow({ contact, onVerify, onDelete, onView }: Props) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-(--text)">
            {contact.firstName} {contact.lastName}
          </div>
          <div className="text-sm text-(--muted)">{contact.email}</div>
        </div>
        <div className="text-sm">
          {contact.verified ? (
            <span className="text-(--success)" title="Verified">
              <CheckCheck />
            </span>
          ) : (
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

      {contact.phone ? (
        <div className="text-sm text-(--muted)">{contact.phone}</div>
      ) : null}

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
    </Card>
  );
}

export default ContactRow;
