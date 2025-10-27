import { useEffect, useMemo, useRef, useState } from "react";

export type UseEggTriggerOptions = {
  enabled?: boolean;
  requiredClicks?: number;
  windowMs?: number;
  keySequence?: string; // e.g., "ANDREW"
};

function getEnv(): Record<string, unknown> | undefined {
  try {
    return (import.meta as unknown as { env?: Record<string, unknown> }).env;
  } catch {
    return undefined;
  }
}

const env = getEnv();
const isDev = env?.DEV === true;
const envEnabled = env?.VITE_EASTER_EGG_ENABLED;
const defaultEnabled: boolean = typeof envEnabled === "boolean"
  ? envEnabled
  : typeof envEnabled === "string"
  ? envEnabled.toLowerCase() !== "false"
  : true;

export function useEggTrigger(options: UseEggTriggerOptions = {}) {
  const {
    enabled = defaultEnabled,
    requiredClicks = 7,
    windowMs = 5000,
    keySequence = "ANDREW",
  } = options;

  const [revealed, setRevealed] = useState(false);
  const clicksRef = useRef<number[]>([]);
  const keyBufRef = useRef<string>("");
  const seq = useMemo(() => keySequence.toUpperCase(), [keySequence]);

  const reset = () => {
    clicksRef.current = [];
    keyBufRef.current = "";
    setRevealed(false);
  };

  const onClick = () => {
    if (!enabled || revealed) return;
    const now = Date.now();
    clicksRef.current.push(now);
    // drop clicks older than window
    const cutoff = now - windowMs;
    clicksRef.current = clicksRef.current.filter((t) => t >= cutoff);
    if (clicksRef.current.length >= requiredClicks) {
      setRevealed(true);
    }
  };

  const onKeyDown = (e: KeyboardEvent | { key?: string }) => {
    if (!enabled || revealed) return;
    const key = (e as KeyboardEvent).key || (e as React.KeyboardEvent).key;
    if (!key) return;
    const up = key.toUpperCase();
    // Only letters
    if (!/^[A-Z]$/.test(up)) return;
    keyBufRef.current = (keyBufRef.current + up).slice(-seq.length);
    if (keyBufRef.current === seq) {
      setRevealed(true);
    }
  };

  useEffect(() => {
    if (!enabled || revealed) return;
    const handler = (e: KeyboardEvent) => onKeyDown(e);
    globalThis.addEventListener("keydown", handler as EventListener);
    return () =>
      globalThis.removeEventListener("keydown", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, revealed, seq]);

  useEffect(() => {
    if (isDev && enabled) {
      // Subtle dev hint
      // A New Discovery Requires Every (W)onder: Count to seven.
      // ANDREW
      //   A  New
      //   N  Discovery
      //   D  Requires
      //   R  Every
      //   E  (W)onder
      // ^ acrostic left as a developer hint
      console.info("Hint: Some say seven is lucky. Try it.");
    }
  }, [enabled]);

  return { revealed, reset, onClick, onKeyDown } as const;
}
