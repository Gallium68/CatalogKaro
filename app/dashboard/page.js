"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { geocodeAddress } from "@/lib/geocode";
import DashboardNav from "@/components/DashboardNav";
import AdBanner from "@/components/AdBanner";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [productCount, setProductCount] = useState(0);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    whatsapp_number: "",
    address: "",
    logo_url: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        router.push("/login");
        return;
      }
      setUser(userData.user);

      const { data: biz } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (biz) {
        setBusiness(biz);
        setForm({
          name: biz.name || "",
          slug: biz.slug || "",
          whatsapp_number: biz.whatsapp_number || "",
          address: biz.address || "",
          logo_url: biz.logo_url || "",
        });

        const { count } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("business_id", biz.id);
        setProductCount(count || 0);
      }

      setLoading(false);
    }
    load();
  }, [router]);

  function handleNameChange(name) {
    setForm((f) => ({
      ...f,
      name,
      // Only auto-suggest a slug while creating a new business
      slug: business ? f.slug : slugify(name),
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMsg("");

    let lat = business?.lat || null;
    let lng = business?.lng || null;

    // If the address changed, look up its location (free geocoding)
    if (form.address && form.address !== business?.address) {
      const geo = await geocodeAddress(form.address);
      if (geo) {
        lat = geo.lat;
        lng = geo.lng;
      }
    }

    const payload = {
      user_id: user.id,
      name: form.name,
      slug: slugify(form.slug || form.name),
      whatsapp_number: form.whatsapp_number,
      address: form.address,
      logo_url: form.logo_url,
      lat,
      lng,
    };

    let result;
    if (business) {
      result = await supabase
        .from("businesses")
        .update(payload)
        .eq("id", business.id)
        .select()
        .single();
    } else {
      result = await supabase.from("businesses").insert(payload).select().single();
    }

    if (result.error) {
      if (result.error.message.includes("duplicate")) {
        setErrorMsg("This link is already taken. Please try a different one.");
      } else {
        setErrorMsg(result.error.message);
      }
    } else {
      setBusiness(result.data);
      setMessage("Saved!");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 100 }}>
        <p className="muted">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <DashboardNav />
      <div className="container" style={{ maxWidth: 640, paddingTop: 36, paddingBottom: 60 }}>
        <AdBanner isPaid={business?.is_paid} />

        <h2>Business Profile</h2>
        <p className="muted" style={{ marginBottom: 24 }}>
          This information will appear on your public catalog page.
        </p>

        {business && (
          <div className="card" style={{ marginBottom: 24, background: "var(--paper)" }}>
            <p style={{ margin: 0, fontSize: 14 }} className="muted">
              Your live catalog link:
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
              <code style={{ fontSize: 14 }}>catalogkaro.in/{business.slug}</code>
              <Link href={`/${business.slug}`} className="btn btn-outline" target="_blank" style={{ padding: "6px 14px" }}>
                View ↗
              </Link>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 10, marginBottom: 0 }}>
              {productCount} / {business.is_paid ? "∞" : "10"} items used
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="card">
          <div className="field">
            <label className="label" htmlFor="name">Business name</label>
            <input
              id="name"
              className="input"
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Priya Boutique"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="slug">Your catalog link</label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="muted" style={{ fontSize: 14 }}>catalogkaro.in/</span>
              <input
                id="slug"
                className="input"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="whatsapp">WhatsApp number (customers will order through this)</label>
            <input
              id="whatsapp"
              className="input"
              required
              value={form.whatsapp_number}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp_number: e.target.value }))}
              placeholder="91XXXXXXXXXX"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="logo">Logo/Photo URL (optional)</label>
            <input
              id="logo"
              className="input"
              value={form.logo_url}
              onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="address">Shop/business address</label>
            <input
              id="address"
              className="input"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="e.g. MG Road, Ahmedabad, Gujarat"
            />
            <p className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>
              As soon as this is saved, a map showing this location will appear for customers automatically.
            </p>
          </div>

          {errorMsg && <p style={{ color: "var(--danger)", fontSize: 13.5 }}>{errorMsg}</p>}
          {message && <p style={{ color: "var(--leaf-dark)", fontSize: 13.5 }}>{message}</p>}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </form>

        {business && (
          <div style={{ marginTop: 20 }}>
            <Link href="/dashboard/products" className="btn btn-outline">
              Manage products →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
