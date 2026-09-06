export default function WhatsAppButton({ phone, businessName, productName }) {
  if (!phone) return null;

  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message = productName
    ? `Hi ${businessName}, I'd like to know more about "${productName}".`
    : `Hi ${businessName}, I saw your catalog and had a question.`;

  const link = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-whatsapp"
    >
      Ask on WhatsApp
    </a>
  );
}
