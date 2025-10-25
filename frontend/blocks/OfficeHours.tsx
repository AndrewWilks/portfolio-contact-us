import { DoorOpen } from "lucide-react";

export default function OfficeHours() {
  return (
    <>
      <DoorOpen size={18} />
      <h3 className="text-lg font-semibold mb-2">Office Hours</h3>
      <p className="text-gray-700 dark:text-gray-400">
        Monday - Friday
        <br />
        9:00 AM - 5:00 PM
      </p>
    </>
  );
}
