import type { Metadata } from "next";
import "./globals.css";
import { mplus } from "./fonts";

export const metadata: Metadata = {
  title: "Translation",
  description:
    "Translation service that queries multiple translations services in one location",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mplus.className} bg-[#0A122A]`}>{children}</body>
    </html>
  );
}
