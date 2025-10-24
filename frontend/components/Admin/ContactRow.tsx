import Card from "@ui/Card.tsx";
import type { ContactRow as ContactRowType } from "../../hooks/useAdminContacts.tsx";

interface Props {
  contact: ContactRowType;
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContactRow({ contact, onVerify, onDelete }: Props) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-(--text)">
            {contact.first_name} {contact.last_name}
          </div>
          <div className="text-sm text-(--muted)">{contact.email}</div>
        </div>
        <div className="text-sm">
          {contact.verified ? (
            <span className="text-(--success)">Verified</span>
          ) : (
            <button
              type="button"
              className="px-2 py-1 text-sm bg-(--accent) text-(--text) rounded"
              onClick={() => onVerify(contact.id)}
            >
              Verify
            </button>
          )}
        </div>
      </div>

      {contact.phone ? (
        <div className="text-sm text-(--muted)">{contact.phone}</div>
      ) : null}
      {contact.message ? (
        <div className="text-sm">{contact.message}</div>
      ) : null}

      <div className="text-right">
        <button
          type="button"
          className="px-2 py-1 text-sm bg-(--danger) text-(--primary-foreground) rounded"
          onClick={() => onDelete(contact.id)}
        >
          Delete
        </button>
      </div>
    </Card>
  );
}

export default ContactRow;
