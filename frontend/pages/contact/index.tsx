import { createFileRoute } from "@tanstack/react-router";
import ContactForm from "@components/ContactForm/ContactForm.tsx";
import OfficeHours from "../../blocks/OfficeHours.tsx";
import PostalAddress from "../../blocks/PostalAddress.tsx";
import ShinyCard from "@ui/Affects/ShinyCard.tsx";
import CompanyContactDetails from "../../blocks/contactDetails.tsx";

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
          <CompanyContactDetails />
        </ShinyCard>
        <ShinyCard className="xl:col-start-3 xl:col-end-4">
          <OfficeHours />
        </ShinyCard>
        <ShinyCard className="xl:col-start-4 xl:col-end-5">
          <PostalAddress />
        </ShinyCard>
      </section>
    </>
  );
}
