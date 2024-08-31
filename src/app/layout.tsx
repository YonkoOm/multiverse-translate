import type { Metadata } from "next";
import Image from "next/image";
import { mplus } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Multiverse Translate",
  description:
    "Translation service that queries multiple translations services all in one location for ease and faster learning",
  authors: [
    { name: "Om Moradia", url: "https://multiverse-translate.vercel.app" },
    { name: "YonkoOm", url: "https://yonkoom.vercel.app" },
  ],
  keywords: [
    "translator",
    "translation service",
    "multi-translation",
    "multilingual translation",
  ],
  openGraph: {
    type: "website",
    title: "Multiverse Translate",
    description:
      "Translation service that queries multiple translations services all in one location for ease and faster learning",
    images: [
      {
        url: "https://multiverse-translate.vercel.app/icon.png",
        alt: "Multiverse Translate Icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0A122A]">
        <div className="flex flex-col w-full h-screen">
          <div className="p-2 w-fit border-b border-r bg-[#2A3E5F]/70 rounded-br-lg rounded-tr-md border-[#E7DECD] flex items-center gap-x-2">
            <div className="relative w-7 h-7 md:w-9 md:h-9">
              <Image
                src="/icon.png"
                priority
                fill
                sizes="48px"
                alt="translation-logo"
              />
            </div>
            <div
              className={`text-[#fff7ed] text-center text-xs md:text-sm font-bold ${mplus.className}`}
            >
              Multiverse Translate
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
