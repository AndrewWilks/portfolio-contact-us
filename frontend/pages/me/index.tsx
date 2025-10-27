import { createFileRoute } from "@tanstack/react-router";
import { LightRaysBackground } from "@ui/Affects/index.ts";
import ShinyCard from "@ui/Affects/ShinyCard.tsx";
import ProfileCard from "@ui/Cards/ProfileCard.tsx";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/me/")({
  component: MePage,
});

function MePage() {
  const navigate = useNavigate();
  return (
    <>
      <section className="relative min-h-[60vh] md:min-h-[70vh] grid place-items-center rounded-xl overflow-hidden bg-neutral-900/40">
        {/* Animated background */}
        <LightRaysBackground
          className="absolute inset-0 z-0"
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

        {/* Profile card */}
        <div className="relative z-10 w-full px-4 grid place-items-center">
          <ProfileCard
            name="Andrew Wilks"
            title="Software Developer"
            avatarUrl="/me/avatar.jpg"
            miniAvatarUrl="/profile.jpg"
            handle="AndrewWilksy"
            status="Online"
            contactText="Contact Me"
            onContactClick={() => {
              globalThis.location.href = "mailto:me@andrewwilks.au";
            }}
            enableTilt
            className="mx-auto"
          />
        </div>
      </section>
      <section className="py-10">
        {/* Contacts below the card */}
        <div className="relative z-10 w-full px-4 mt-6 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ShinyCard className="backdrop-blur supports-backdrop-filter:bg-white/5 dark:supports-backdrop-filter:bg-black/20">
            <a
              href="https://andrewwilks.au/"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-between gap-4 p-2"
              aria-label="Visit website andrewwilks.au"
            >
              <div>
                <div className="text-sm opacity-70">Website</div>
                <div className="font-medium">andrewwilks.au</div>
              </div>
              <span className="text-xs opacity-70">Open</span>
            </a>
          </ShinyCard>
          <ShinyCard className="backdrop-blur supports-backdrop-filter:bg-white/5 dark:supports-backdrop-filter:bg-black/20">
            <a
              href="https://www.linkedin.com/in/andrew-wilksy/"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-between gap-4 p-2"
              aria-label="Open LinkedIn profile"
            >
              <div>
                <div className="text-sm opacity-70">LinkedIn</div>
                <div className="font-medium">andrew-wilksy</div>
              </div>
              <span className="text-xs opacity-70">Open</span>
            </a>
          </ShinyCard>
          <ShinyCard className="backdrop-blur supports-backdrop-filter:bg-white/5 dark:supports-backdrop-filter:bg-black/20">
            <a
              href="https://github.com/AndrewWilks"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-between gap-4 p-2"
              aria-label="Open GitHub profile"
            >
              <div>
                <div className="text-sm opacity-70">GitHub</div>
                <div className="font-medium">AndrewWilks</div>
              </div>
              <span className="text-xs opacity-70">Open</span>
            </a>
          </ShinyCard>
        </div>
      </section>
    </>
  );
}
