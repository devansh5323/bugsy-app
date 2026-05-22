"use client";

import { useEffect, useRef, useState } from "react";

function charDelay(ch: string): number {
  if (ch === "." || ch === "!" || ch === "?") return 320;
  if (ch === ",") return 180;
  if (ch === " ") return 30;
  return 28;
}

export function Typewriter({
  text,
  onDone,
  className,
  style,
}: {
  text: string;
  onDone?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    setShown("");
    setDone(false);

    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i >= text.length) {
        setDone(true);
        onDoneRef.current?.();
        return;
      }
      i += 1;
      setShown(text.slice(0, i));
      const prev = text.charAt(i - 1);
      timer = setTimeout(tick, charDelay(prev));
    };

    timer = setTimeout(tick, 220); // small lead-in pause
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [text]);

  const skip = () => {
    setShown(text);
    setDone(true);
    onDoneRef.current?.();
  };

  return (
    <span
      onClick={skip}
      className={className}
      style={{ cursor: done ? "default" : "pointer", ...style }}
    >
      {shown}
      {!done && (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "0.55em",
            marginLeft: 2,
            background: "currentColor",
            height: "1em",
            verticalAlign: "-0.15em",
            opacity: 0.5,
            animation: "tw-caret 0.8s steps(2) infinite",
          }}
        />
      )}
    </span>
  );
}
