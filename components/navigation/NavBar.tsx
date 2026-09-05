"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "Udupi Krishna Janmashtami";
  const qs = `?q=${encodeURIComponent(q)}`;

  const links = [
    { href: `/dashboard${qs}`, label: "Overview" },
    { href: `/creators${qs}`, label: "Creators" },
    { href: `/businesses${qs}`, label: "Businesses" },
  ];

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-serif text-lg text-slate-100">
          Trend Radar
        </Link>
        <div className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-1.5 text-sm ${
                pathname === l.href.split("?")[0] ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
