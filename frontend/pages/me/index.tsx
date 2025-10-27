import { createFileRoute } from "@tanstack/react-router";
import { LightRaysBackground } from "@ui/Affects/index.ts";

export const Route = createFileRoute("/me/")({
  component: MePage,
});

function MePage() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] grid place-items-center rounded-xl overflow-hidden bg-neutral-900/40">
      {/* Animated background */}
      <LightRaysBackground
        className="absolute inset-0 -z-10"
        raysOrigin="top-center"
        raysColor="#9be6ff"
        raysSpeed={1}
        lightSpread={1.0}
        rayLength={2.0}
  pulsating
        fadeDistance={1.0}
        saturation={1.0}
  followMouse
        mouseInfluence={0.15}
        noiseAmount={0.05}
        distortion={0.1}
      />

      {/* Placeholder content – profile card will replace this */}
      <div className="relative z-10 text-center max-w-xl mx-auto px-6 py-10 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">About Me</h1>
        <p className="mt-3 text-sm md:text-base text-neutral-200">
          Previewing the light-ray background. The profile card will go here next.
        </p>
      </div>
    </section>
  );
}
