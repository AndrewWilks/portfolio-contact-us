import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import ContactForm from "@features/contact/components/ContactForm.tsx";
import ShinyCard from "@ui/Affects/ShinyCard.tsx";

const CompanyContactDetails = lazy(
  () => import("@blocks/CompanyContactDetails.tsx"),
);
const OfficeHours = lazy(() => import("@blocks/OfficeHours.tsx"));
const PostalAddress = lazy(() => import("@blocks/PostalAddress.tsx"));

export const Route = createFileRoute("/contact/")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="p-4 mt-24 max-w-xl mx-auto">
        <ShinyCard>
          <ContactForm />
        </ShinyCard>
      </section>
      <section className="p-4 mt-18 mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <h2 className="text-xl font-semibold mb-4 col-span-1 lg:col-span-3 xl:col-start-2 xl:col-span-5">
          Here are extra ways to contact us
        </h2>
        <ShinyCard className=" xl:col-start-2 xl:col-end-3">
          <Suspense fallback={null}>
            <CompanyContactDetails />
          </Suspense>
        </ShinyCard>
        <ShinyCard className="xl:col-start-3 xl:col-end-4">
          <Suspense fallback={null}>
            <OfficeHours />
          </Suspense>
        </ShinyCard>
        <ShinyCard className="xl:col-start-4 xl:col-end-5">
          <Suspense fallback={null}>
            <PostalAddress />
          </Suspense>
        </ShinyCard>
      </section>
    </>
  );
}
