"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";

// Leaflet relies on the browser's window object, so it can't be rendered on
// the server - it's loaded on the client only.
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function PublicCatalogPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function load() {
      const { data: biz } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!biz) {
        setLoading(false);
        return;
      }
      setBusiness(biz);

      const { data: items } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", biz.id)
        .order("created_at", { ascending: false });

      setProducts(items || []);
      setLoading(false);
    }
    load();
  }, [slug]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category || "General"));
    return ["All", ...Array.from(set)];
  }, [products]);

  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => (p.category || "General") === activeCategory);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 100, textAlign: "center" }}>
        <p className="muted">Loading...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container" style={{ paddingTop: 100, textAlign: "center" }}>
        <h2>Catalog not found</h2>
        <p className="muted">Check the link, or ask the business for it again.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      <header className="catalog-header">
        <div className="container catalog-header-inner">
          {business.logo_url && (
            <img src={business.logo_url} alt={business.name} className="catalog-logo" />
          )}
          <div>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>{business.name}</h1>
            {business.address && <p className="muted" style={{ margin: 0 }}>{business.address}</p>}
          </div>
        </div>
      </header>

      <div className="container" style={{ marginTop: 20 }}>
        <WhatsAppButton phone={business.whatsapp_number} businessName={business.name} />
      </div>

      {categories.length > 2 && (
        <div className="container category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cat-tab ${activeCategory === cat ? "cat-tab-active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="container product-grid">
        {visibleProducts.length === 0 && (
          <p className="muted">No items in this category yet.</p>
        )}
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            businessName={business.name}
            whatsappNumber={business.whatsapp_number}
          />
        ))}
      </div>

      {business.lat && business.lng && (
        <div className="container" style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16 }}>Location</h3>
          <MapView lat={business.lat} lng={business.lng} businessName={business.name} />
        </div>
      )}

      {!business.is_paid && (
        <div className="container" style={{ marginTop: 40, textAlign: "center" }}>
          <span className="muted" style={{ fontSize: 13 }}>
            Powered by <strong>CatalogKaro</strong>
          </span>
        </div>
      )}
    </div>
  );
}
