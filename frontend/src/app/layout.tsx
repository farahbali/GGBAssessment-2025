import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feedback Board",
  description:
    "A modern feedback management system built with Next.js, TypeScript, and Tailwind CSS",
  keywords: ["feedback", "management", "nextjs", "typescript", "tailwind"],
  authors: [{ name: "Feedback Board Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff", // ✅ Used for mobile browser theme
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-512x512.png",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json", // ✅ Important for Android
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* ✅ Extra PWA & iOS meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Feedback Board" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
