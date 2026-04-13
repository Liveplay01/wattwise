import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wattwise — Finde deine beste Energiequelle",
  description:
    "Wattwise zeigt dir, ob sich auf deinem Grundstück eine Solaranlage, ein Windrad oder ein Wasserrad am meisten lohnt — basierend auf echten Daten.",
  keywords: ["Solar", "Wind", "Wasserkraft", "Erneuerbare Energie", "Deutschland"],
  icons: {
    icon: "/wattwise/icon.svg",
    shortcut: "/wattwise/icon.svg",
    apple: "/wattwise/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
