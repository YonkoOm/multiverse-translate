import type { Metadata } from "next";
import Image from "next/image";
import { mplus } from "./fonts";
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
      <body className="bg-[#0A122A]">
        <div className="flex flex-col w-full h-screen">
          <div className="p-2 w-fit border-b border-r bg-[#2A3E5F]/70 rounded-br-lg rounded-tr-md border-[#E7DECD] flex items-center gap-x-2">
            <div className="relative w-7 h-7 md:w-9 md:h-9">
              <Image src="/icon.png" fill sizes="48px" alt="translation-logo" />
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
