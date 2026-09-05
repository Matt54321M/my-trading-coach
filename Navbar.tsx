"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "./client";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/rules", label: "My Rules" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-bold text-lg tracking-tight">
            <span className="text-primary">My</span>TradingCoach
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  pathname === l.href
                    ? "bg-primary/20 text-primary"
                    : "text-muted hover:text-foreground hover:bg-card-hover"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="text-sm text-muted hover:text-foreground transition px-3 py-1.5 rounded-md hover:bg-card-hover"
        >
          {loading ? "..." : "Logout"}
        </button>
      </div>
      {/* Mobile links */}
      <div className="sm:hidden flex border-t border-border">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex-1 text-center py-2 text-xs ${
              pathname === l.href ? "text-primary bg-primary/10" : "text-muted"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
