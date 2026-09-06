import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className="top-nav">
        <div className="container top-nav-inner">
          <Link href="/" className="brand">
            CatalogKaro<span className="brand-dot">.</span>
          </Link>
          <Link href="/login" className="btn btn-outline">
            Login
          </Link>
        </div>
      </nav>

      <section className="container hero">
        <div>
          <h1>Build your catalog, share it on WhatsApp, get orders.</h1>
          <p className="lede">
            Whether you're a tailor, a baker, or a freelancer — put every
            product and service into one shareable link. Customers open it,
            browse, and message you directly on WhatsApp.
          </p>
          <div className="hero-cta-row">
            <Link href="/login" className="btn btn-primary">
              Start for free
            </Link>
            <span className="muted">Free forever for up to 10 items</span>
          </div>
        </div>

        <div className="phone-mock">
          <div className="phone-screen">
            <div className="phone-topbar">Priya Boutique</div>
            <div className="phone-item">
              <div
                className="phone-item-thumb"
                style={{ background: "#F0A22E" }}
              />
              <div className="phone-item-text">
                <div className="name">Cotton Kurti</div>
                <div className="price">₹899</div>
              </div>
            </div>
            <div className="phone-item">
              <div
                className="phone-item-thumb"
                style={{ background: "#4C7A5E" }}
              />
              <div className="phone-item-text">
                <div className="name">Silk Saree</div>
                <div className="price">₹2,499</div>
              </div>
            </div>
            <div className="phone-item" style={{ borderBottom: "none" }}>
              <div
                className="phone-item-thumb"
                style={{ background: "#1C2B4A" }}
              />
              <div className="phone-item-text">
                <div className="name">Designer Blouse</div>
                <div className="price">₹649</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Live in three steps</h2>
        </div>
        <div className="steps-grid">
          <div>
            <div className="step-num">1</div>
            <h3>Sign up for free</h3>
            <p className="muted">Use email or Google — your account is ready in a minute.</p>
          </div>
          <div>
            <div className="step-num">2</div>
            <h3>Add your items</h3>
            <p className="muted">
              Photo, name, price — as many as you need. Free for up to 10 items.
            </p>
          </div>
          <div>
            <div className="step-num">3</div>
            <h3>Share your link</h3>
            <p className="muted">
              Post your catalog link on your WhatsApp status, groups, or bio.
            </p>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Simple pricing, no hidden terms</h2>
        </div>
        <div className="pricing-grid">
          <div className="card">
            <span className="badge">Free</span>
            <div className="price-tag">₹0</div>
            <p className="muted">Free forever</p>
            <ul className="feature-list">
              <li>Catalog with up to 10 items</li>
              <li>Shareable public link</li>
              <li>WhatsApp order button</li>
              <li>Location map</li>
            </ul>
          </div>
          <div className="card" style={{ borderColor: "var(--marigold)" }}>
            <span className="badge badge-warn">One-time upgrade</span>
            <div className="price-tag">₹199</div>
            <p className="muted">Pay once, keep it forever</p>
            <ul className="feature-list">
              <li>Unlimited items</li>
              <li>Remove branding</li>
              <li>Your own custom link</li>
              <li>No ads on your dashboard</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          © {new Date().getFullYear()} CatalogKaro — Your business, your catalog.
        </div>
      </footer>
    </>
  );
}
