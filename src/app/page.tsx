"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllProducts } from "@/app/actions/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Search from "@/components/Search";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  numReviews: number;
}

// Debounce utility to prevent search from firing too often
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Fetch all products on mount
  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    }
    fetchProducts();
  }, []);

  // Handle search with debounce
  const handleSearch = useCallback(
    debounce((query: string) => {
      if (!query) {
        setFilteredProducts(products);
        return;
      }
      const lowerQuery = query.toLowerCase();
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(lowerQuery)
      );
      setFilteredProducts(filtered);
    }, 300),
    [products]
  );

  return (
    <div>
      <main>
        <h1>Welcome to Handcrafted Haven</h1>
        <p>Your digital marketplace for handmade crafts.</p>

        <div style={{ marginBottom: "2rem" }}>
          <Link href="/signup">Sign Up</Link>{" "}
          <Link href="/login">Login</Link>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <Search placeholder="Search products..." onSearch={handleSearch} />
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
