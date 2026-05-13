"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/events",    label: "// events" },
  { href: "/templates", label: "// templates" },
  { href: "/bookings",  label: "// bookings" },
  { href: "/settings",  label: "// settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-[220px] bg-[#0d0d1a] border-r border-white/[0.08] flex flex-col py-6 shrink-0">
        <div className="px-5 pb-6 font-mono text-[13px] text-[#00e5ff] tracking-[0.08em]">
          STARQUIZ
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-mono no-underline transition-colors",
                pathname === href
                  ? "bg-[#00e5ff]/[0.08] text-[#00e5ff]"
                  : "text-white/60 hover:text-white/90 hover:bg-white/[0.04]",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3">
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2.5 rounded-lg text-sm font-mono text-white/40 hover:text-white/60 bg-transparent border-none cursor-pointer text-left transition-colors"
          >
            // sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
