"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DashboardNav from "@/components/DashboardNav";

const PAYMENT_LINK = process.env.NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK;

export default function UpgradePage() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        router.push("/login");
        return;
      }
      const { data: biz } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!biz) {
        router.push("/dashboard");
        return;
      }
      setBusiness(biz);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 100 }}>
        <p className="muted">Loading...</p>
      </div>
    );
  }

  if (business.is_paid) {
    return (
      <>
        <DashboardNav />
        <div className="container" style={{ maxWidth: 560, paddingTop: 60 }}>
          <div className="card">
            <span className="badge">Upgraded ✓</span>
            <h2 style={{ marginTop: 12 }}>You're already on the Pro plan</h2>
            <p className="muted">Unlimited items, no ads, no branding — all active.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNav />
      <div className="container" style={{ maxWidth: 560, paddingTop: 48, paddingBottom: 60 }}>
        <h2>Upgrade to unlimited</h2>
        <p className="muted" style={{ marginBottom: 24 }}>
          Pay once, and get all of this forever:
        </p>

        <div className="card">
          <div className="price-tag">₹199</div>
          <p className="muted" style={{ margin: "0 0 16px" }}>One-time payment</p>
          <ul className="feature-list">
            <li>Unlimited products/services</li>
            <li>No ads on your dashboard</li>
            <li>Remove the "Powered by CatalogKaro" badge</li>
            <li>Your own custom link</li>
          </ul>

          {PAYMENT_LINK ? (
            <a
              href={PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 20 }}
            >
              Pay ₹199
            </a>
          ) : (
            <div className="card" style={{ marginTop: 20, background: "var(--paper)" }}>
              <p style={{ margin: 0, fontSize: 14 }}>
                The payment link hasn't been set up yet. The app owner should follow the
                "Payments Setup" section in README.md.
              </p>
            </div>
          )}

          <p className="muted" style={{ fontSize: 12.5, marginTop: 16 }}>
            Your account will be upgraded shortly after payment. If there's any delay,
            send us a payment screenshot on WhatsApp.
          </p>
        </div>
      </div>
    </>
  );
}
