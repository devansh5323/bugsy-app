"use client";

import { useState } from "react";
import { BugsyStage, ChunkyButton, ConvoStage, SpeechBubble } from "./ConvoUI";
import type { UserType } from "../../lib/data";

export function WhoAreYou({
  tint,
  onPick,
}: {
  tint: number;
  onPick: (t: UserType) => void;
}) {
  const [bubbleDone, setBubbleDone] = useState(false);

  return (
    <ConvoStage step={0}>
      <BugsyStage mood="waving" tint={tint} size={170} animationKey="who" />
      <div style={{ marginTop: 8 }} />
      <SpeechBubble
        text="Hi there. Are you a parent or a child?"
        onDone={() => setBubbleDone(true)}
        tail="up"
      />

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: bubbleDone ? 1 : 0,
          transition: "opacity 0.35s ease",
          pointerEvents: bubbleDone ? "auto" : "none",
        }}
      >
        <ChunkyButton onClick={() => onPick("parent")}>I&apos;m a parent</ChunkyButton>
        <ChunkyButton onClick={() => onPick("child")} variant="secondary">
          I&apos;m a child
        </ChunkyButton>
      </div>
    </ConvoStage>
  );
}
