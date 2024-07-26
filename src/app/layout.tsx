import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multiverse Translate",
  description:
    "Translation service that queries multiple translations services all in one location for ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0A122A]">{children}</body>
    </html>
  );
}
