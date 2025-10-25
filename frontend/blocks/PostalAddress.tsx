import { Pin } from "lucide-react";

export default function PostalAddress() {
  return (
    <>
      <Pin size={18} />
      <h3 className="text-lg font-semibold mb-2">Postal Address</h3>
      <p className="text-gray-700 dark:text-gray-400">
        PO Box 419, Alexandria <br />
        NSW 1435, Australia
      </p>
    </>
  );
}
