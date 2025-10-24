import { createFileRoute } from "@tanstack/react-router";
import HeroText from "@ui/HeroText.tsx";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <section className="flex flex-col items-center justify-center py-32 px-4 text-(--text) max-w-2xl mx-auto text-center">
      <h2 className="text-4xl font-semibold text-center">Welcome to</h2>
      <HeroText
        text="OpenAgent"
        className="text-8xl font-semibold text-center dark:text-green-400 text-green-500 pb-10 mx-auto"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        tag="h1"
      />
      <p className="text-lg text-(--muted)">
        We've been around since 2013, and our vision is to make it easy for
        people to <strong>Buy, Sell and Own Property.</strong>
      </p>
    </section>
  );
}
