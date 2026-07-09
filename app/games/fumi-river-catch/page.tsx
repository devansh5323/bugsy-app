"use client";

// Standalone preview route for Fumi's River Catch, so the game can be
// opened directly at /games/fumi-river-catch without going through the
// onboarding flow. The actual game lives in the sibling
// "Fumi's River Catch" folder (matching the name the game was
// requested under); this route just mounts it full-screen.

import { useRouter } from "next/navigation";
import { FumiRiverCatch } from "../Fumi’s River Catch/FumiRiverCatch";

export default function FumiRiverCatchPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <FumiRiverCatch onExit={() => router.push("/")} />
    </div>
  );
}
