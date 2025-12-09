"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/app/actions/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Search from "@/components/Search";
import { useSearchParams } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  numReviews: number;
}

export default function HomePage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();

  // 1️⃣ Read query from URL
  const query = searchParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getAllProducts();

      // 2️⃣ No search? → Show all
      if (!query) {
        setFilteredProducts(allProducts);
        return;
      }

      // 3️⃣ Filter by query
      setFilteredProducts(
        allProducts.filter((product) =>
          product.name.toLowerCase().includes(query)
        )
      );
    }

    fetchProducts();
  }, [query]); // runs every time the URL query changes

  return (
    <div>
      <main>
        <h1>Welcome to Handcrafted Haven</h1>
        <p>Your digital marketplace for handmade crafts.</p>

        <div style={{ marginBottom: "2rem" }}>
          <Link href="/signup">Sign Up</Link>{" "}
          <Link href="/login">Login</Link>
        </div>

        {/* 4️⃣ Search bar — NO onSearch needed */}
        <div style={{ marginBottom: "1rem" }}>
          <Search placeholder="Search products..." />
        </div>

        <section className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.images[0]}
                category={product.category}
                rating={product.rating}
                numReviews={product.numReviews}
              />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </section>
      </main>
    </div>
  );
}
