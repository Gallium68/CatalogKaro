import "./globals.css";

export const metadata = {
  title: "CatalogKaro — Take your business online in 2 minutes",
  description:
    "Build a catalog of your products or services, share it on WhatsApp, and reach new customers. Free to get started.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
