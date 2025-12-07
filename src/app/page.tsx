import { getAllProducts } from "@/app/actions/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function Home() {
  const products = await getAllProducts();

  return (
    <div>
      <main>
        <h1>Welcome to Handcrafted Haven</h1>
        <p>Your digital marketplace for handmade crafts.</p>

        <div style={{ marginBottom: "2rem" }}>
          <Link href="/signup">Sign Up</Link>
          <Link href="/login">Login</Link>
        </div>

        <section className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.images[0]}
              category={product.category}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
