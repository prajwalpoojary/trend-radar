import type { Metadata } from "next";
import { Suspense } from "react";
import { NavBar } from "@/components/navigation/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trend Radar — See attention before everyone else does",
  description: "Momentum, spikes, and opportunities for Udupi Krishna Janmashtami content — demo mode.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-200 antialiased">
        <Suspense fallback={<div className="h-14 border-b border-slate-800" />}>
          <NavBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
