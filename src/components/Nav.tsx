"use client";
import Link from "next/link";
import "./globals.css"; // Make sure your CSS variables are imported

export default function Nav() {
  return (
    <nav className="main-nav">
      <Link href="/">Home</Link>
      <Link href="/seller">Seller</Link>
      <Link href="/products/new">Add Product</Link>
    </nav>
  );
}
