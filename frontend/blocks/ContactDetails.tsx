import { Contact } from "lucide-react";

export default function PostalAddress() {
  return (
    <>
      <Contact size={18} />
      <h3 className="text-lg font-semibold mb-2">Contact Details</h3>

      <a className="text-gray-700 dark:text-gray-400" href="tel:132434">
        13 24 34
      </a>
      <br />
      <a
        className="text-gray-700 dark:text-gray-400"
        href="mailto:support@openagent.com.au"
      >
        support@openagent.com.au
      </a>
    </>
  );
}
