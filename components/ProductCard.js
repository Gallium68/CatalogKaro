import WhatsAppButton from "./WhatsAppButton";

export default function ProductCard({ product, businessName, whatsappNumber }) {
  return (
    <div className="product-card">
      <div
        className="product-photo"
        style={{
          backgroundImage: product.photo_url ? `url(${product.photo_url})` : undefined,
        }}
      >
        {!product.photo_url && <span className="product-photo-fallback">📦</span>}
      </div>
      <div className="product-info">
        <h4>{product.name}</h4>
        {product.price != null && (
          <div className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</div>
        )}
        {product.description && <p className="product-desc">{product.description}</p>}
        <WhatsAppButton
          phone={whatsappNumber}
          businessName={businessName}
          productName={product.name}
        />
      </div>
    </div>
  );
}
