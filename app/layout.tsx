import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// Single font, multiple weights — heavy throughout (Duolingo system)
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bugsy",
  description: "Sharpen your brain — 5 minutes at a time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FF5C8A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
