"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{
        width: 220, background: "#0d0d1a", borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0,
      }}>
        <div style={{ padding: "0 20px 24px", fontFamily: "monospace", fontSize: 13, color: "#00e5ff", letterSpacing: "0.08em" }}>
          STARQUIZ
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "0 12px" }}>
          {[
            { href: "/events", label: "// events" },
            { href: "/bookings", label: "// bookings" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: "10px 12px", borderRadius: 8, fontSize: 14,
              fontFamily: "monospace", textDecoration: "none",
              background: pathname === href ? "rgba(0,229,255,0.08)" : "transparent",
              color: pathname === href ? "#00e5ff" : "rgba(244,242,255,0.6)",
              transition: "all 0.15s",
            }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "0 12px" }}>
          <button onClick={handleSignOut} style={{
            width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14,
            fontFamily: "monospace", background: "transparent", border: "none",
            color: "rgba(244,242,255,0.4)", cursor: "pointer", textAlign: "left",
          }}>
            // sign out
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 32, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
