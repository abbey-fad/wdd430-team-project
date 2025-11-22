import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Artisan Marketplace",
  description: "Platform for artisans to showcase their products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return (
  <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <nav className="main-nav">
        <Link href="/">Home</Link>
        <Link href="/seller">Seller</Link>
        <Link href="/products/new">Add Product</Link>
      </nav>
      {children}
    </body>
  </html>
);
  
}
