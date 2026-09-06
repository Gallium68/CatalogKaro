"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const tabs = [
    { href: "/dashboard", label: "Business Profile" },
    { href: "/dashboard/products", label: "Products" },
    { href: "/dashboard/upgrade", label: "Upgrade" },
  ];

  return (
    <nav className="top-nav">
      <div className="container top-nav-inner">
        <Link href="/dashboard" className="brand">
          CatalogKaro<span className="brand-dot">.</span>
        </Link>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`dash-tab ${pathname === tab.href ? "dash-tab-active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="btn-danger-text">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
