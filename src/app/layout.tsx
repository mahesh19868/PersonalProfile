import type { Metadata, Viewport } from "next";
import { Syne, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/data/profile";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} | ${site.title}`,
  description: site.summary,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: site.name,
    description: site.summary,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${ibmPlex.variable}`}>
      <body className="mesh-bg min-h-screen antialiased">{children}</body>
    </html>
  );
}
