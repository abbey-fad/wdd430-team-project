"use client";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function Nav({ user }: { user: any }) {
  return (
    <nav className="main-nav">
      <Link href="/">Home</Link>
      {user ? (
        <>
          <Link href="/seller">Seller Profile</Link>
          <Link href="/products/new">Add Product</Link>
          <button onClick={() => logout()} className="logout-button">
            Logout
          </button>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
