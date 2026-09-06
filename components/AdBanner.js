"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ck_last_ad_shown";
// The ad only reappears after this much time has passed (randomized between
// 30-45 minutes so it doesn't feel mechanical or predictable).
const MIN_GAP_MS = 30 * 60 * 1000;
const MAX_GAP_MS = 45 * 60 * 1000;

export default function AdBanner({ isPaid }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isPaid) return; // Paid users never see ads

    const lastShown = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const gap = MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
    const now = Date.now();

    if (now - lastShown > gap) {
      setVisible(true);
      localStorage.setItem(STORAGE_KEY, String(now));
    }
  }, [isPaid]);

  if (!visible || isPaid) return null;

  return (
    <div className="ad-banner">
      <div>
        <span className="ad-banner-label">Sponsored</span>
        <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>
          Want an ad-free dashboard? Upgrade once for ₹199, forever.
        </p>
      </div>
      <button
        className="ad-banner-close"
        aria-label="Dismiss ad"
        onClick={() => setVisible(false)}
      >
        ✕
      </button>
    </div>
  );
}
