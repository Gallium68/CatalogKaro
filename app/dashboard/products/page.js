"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import DashboardNav from "@/components/DashboardNav";
import AdBanner from "@/components/AdBanner";

const FREE_LIMIT = 10;
const emptyForm = { name: "", price: "", description: "", photo_url: "", category: "General" };

export default function ProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      await loadProducts(biz.id);
      setLoading(false);
    }
    load();
  }, [router]);

  async function loadProducts(businessId) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });
    setProducts(data || []);
  }

  const atLimit = !business?.is_paid && products.length >= FREE_LIMIT && !editingId;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (atLimit) {
      setErrorMsg(
        `The free plan allows up to ${FREE_LIMIT} items. Upgrade for unlimited items.`
      );
      return;
    }

    setSaving(true);
    const payload = {
      business_id: business.id,
      name: form.name,
      price: form.price ? Number(form.price) : null,
      description: form.description,
      photo_url: form.photo_url,
      category: form.category || "General",
    };

    let result;
    if (editingId) {
      result = await supabase.from("products").update(payload).eq("id", editingId);
    } else {
      result = await supabase.from("products").insert(payload);
    }

    if (result.error) {
      setErrorMsg(result.error.message);
    } else {
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts(business.id);
    }
    setSaving(false);
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price ?? "",
      description: product.description || "",
      photo_url: product.photo_url || "",
      category: product.category || "General",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    await supabase.from("products").delete().eq("id", id);
    await loadProducts(business.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
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
      <div className="container" style={{ maxWidth: 720, paddingTop: 36, paddingBottom: 60 }}>
        <AdBanner isPaid={business?.is_paid} />

        <h2>Products / Services</h2>
        <p className="muted" style={{ marginBottom: 8 }}>
          {products.length} / {business.is_paid ? "∞" : FREE_LIMIT} items
        </p>

        {atLimit && (
          <div className="card" style={{ borderColor: "var(--marigold)", marginBottom: 20 }}>
            <p style={{ margin: 0 }}>
              You've reached the free limit.{" "}
              <Link href="/dashboard/upgrade" style={{ color: "var(--marigold-dark)", fontWeight: 600 }}>
                Upgrade for unlimited items →
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 17 }}>{editingId ? "Edit item" : "Add a new item"}</h3>

          <div className="field">
            <label className="label" htmlFor="p-name">Name</label>
            <input
              id="p-name"
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Cotton Kurti"
            />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div className="field" style={{ flex: 1 }}>
              <label className="label" htmlFor="p-price">Price (₹)</label>
              <input
                id="p-price"
                type="number"
                className="input"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="899"
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="label" htmlFor="p-category">Category</label>
              <input
                id="p-category"
                className="input"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Sarees"
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="p-photo">Photo URL</label>
            <input
              id="p-photo"
              className="input"
              value={form.photo_url}
              onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="p-desc">Description</label>
            <textarea
              id="p-desc"
              className="input"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="A short detail..."
            />
          </div>

          {errorMsg && <p style={{ color: "var(--danger)", fontSize: 13.5 }}>{errorMsg}</p>}

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={saving || atLimit}>
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="product-manage-list">
          {products.length === 0 && (
            <p className="muted">No items yet. Add your first one above.</p>
          )}
          {products.map((p) => (
            <div key={p.id} className="product-manage-row">
              <div
                className="product-manage-thumb"
                style={{ backgroundImage: p.photo_url ? `url(${p.photo_url})` : undefined }}
              />
              <div style={{ flex: 1 }}>
                <strong>{p.name}</strong>
                <div className="muted" style={{ fontSize: 13 }}>
                  {p.price != null ? `₹${Number(p.price).toLocaleString("en-IN")}` : ""} · {p.category}
                </div>
              </div>
              <button className="btn btn-outline" style={{ padding: "6px 14px" }} onClick={() => handleEdit(p)}>
                Edit
              </button>
              <button className="btn-danger-text" onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
