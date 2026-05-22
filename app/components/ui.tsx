"use client";

import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
};

export function PrimaryButton({ children, onClick, disabled, variant = "solid" }: ButtonProps) {
  const solid = variant === "solid";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-primary"
      style={{
        width: "100%",
        height: 56,
        borderRadius: 28,
        border: "none",
        cursor: disabled ? "default" : "pointer",
        fontFamily: "var(--font-inter), system-ui",
        fontSize: 17,
        fontWeight: 600,
        letterSpacing: -0.2,
        background: disabled ? "var(--ink-10)" : solid ? "var(--ink)" : "transparent",
        color: disabled ? "var(--ink-40)" : solid ? "var(--bg)" : "var(--ink)",
        boxShadow: solid && !disabled ? "0 6px 16px rgba(20, 14, 24, 0.18)" : "none",
        transition: "transform 0.12s ease, background 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

export function TextButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        height: 44,
        border: "none",
        background: "transparent",
        fontFamily: "var(--font-inter), system-ui",
        fontSize: 15,
        fontWeight: 500,
        color: "var(--ink-50)",
        cursor: "pointer",
        letterSpacing: -0.1,
      }}
    >
      {children}
    </button>
  );
}

export function Screen({
  children,
  padded = true,
  progress,
}: {
  children: ReactNode;
  padded?: boolean;
  progress?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        paddingTop: 68,
        paddingBottom: 44,
        paddingLeft: padded ? 28 : 0,
        paddingRight: padded ? 28 : 0,
        boxSizing: "border-box",
        background: "var(--bg)",
      }}
    >
      {progress !== undefined && (
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            height: 4,
            borderRadius: 2,
            background: "var(--ink-10)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: "var(--accent)",
              borderRadius: 2,
              transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
}

export function Heading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 500,
          fontSize: 30,
          lineHeight: 1.12,
          letterSpacing: -0.8,
          margin: 0,
          color: "var(--ink)",
          fontVariationSettings: "'SOFT' 60, 'WONK' 1",
        }}
      >
        {title}
      </h1>
      {sub && (
        <p
          style={{
            fontFamily: "var(--font-inter), system-ui",
            fontSize: 16,
            lineHeight: 1.4,
            margin: "10px 0 0",
            color: "var(--ink-60)",
            letterSpacing: -0.1,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-inter), system-ui",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--ink-50)",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        margin: "4px 0 10px",
      }}
    >
      {children}
    </div>
  );
}

export function BgBlobs() {
  return (
    <div className="bg-blobs">
      <div style={{ width: 220, height: 220, top: -40, right: -40, background: "var(--accent)", opacity: 0.18 }}/>
      <div style={{ width: 180, height: 180, bottom: 40, left: -60, background: "var(--accent)", opacity: 0.12 }}/>
      <div style={{ width: 140, height: 140, bottom: 160, right: 30, background: "var(--ink)", opacity: 0.04 }}/>
    </div>
  );
}
