import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/me/")({
  component: MePage,
});

function MePage() {
  return <></>;
}
