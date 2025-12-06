"use client";

import React, { useEffect, useState, useActionState } from "react";
import FormInput from "../../components/FormInput";
import { useRouter } from "next/navigation";
import { saveProfile, getProfile, State } from "../actions/profile";
import { Skeleton } from "../../components/Skeleton";

const initialState: State = {
  message: "",
  error: "",
  success: false,
};


interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
}

const SellerProfilePage: React.FC = () => {
  const router = useRouter();
  const [state, formAction] = useActionState<State, FormData>(saveProfile, initialState);

  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");

  const [displayedProfile, setDisplayedProfile] = useState<{ shopName: string; bio: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ shopName?: string; bio?: string }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          setShopName(profile.shopName);
          setBio(profile.bio);
          setDisplayedProfile({
            shopName: profile.shopName,
            bio: profile.bio
          });
          if (profile.products) {
            setProducts(profile.products);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (state.success) {
      setDisplayedProfile({
        shopName: shopName,
        bio: bio
      });
    }
  }, [state.success, shopName, bio]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!shopName.trim()) newErrors.shopName = "Shop Name is required";
    if (!bio.trim()) newErrors.bio = "Bio is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClientSubmit = (formData: FormData) => {
    if (!validate()) return;
    formAction(formData);
  };

  if (loading) {
    return (
      <div className="form-container">
        <h1>Seller Profile</h1>
        <div style={{ marginBottom: "1.5rem" }}>
          <Skeleton className="h-4 w-24 mb-2" style={{ height: "1rem", marginBottom: "0.5rem" }} />
          <Skeleton className="h-10 w-full" style={{ height: "2.5rem" }} />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <Skeleton className="h-4 w-16 mb-2" style={{ height: "1rem", marginBottom: "0.5rem" }} />
          <Skeleton className="h-32 w-full" style={{ height: "8rem" }} />
        </div>
        <Skeleton className="h-10 w-32" style={{ height: "2.5rem", width: "8rem" }} />
      </div>
    );
  }

  return (
    <div className="form-container">
      {displayedProfile && (
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
          <h2>{displayedProfile.shopName}</h2>
          <p style={{ color: "#666" }}>{displayedProfile.bio}</p>
        </div>
      )}

      <h1>Edit Profile</h1>
      <form action={handleClientSubmit}>
        <FormInput
          label="Shop Name"
          name="shopName"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          error={errors.shopName}
        />

        <FormInput
          label="Bio"
          name="bio"
          type="textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          error={errors.bio}
        />

        <button type="submit">Save Profile</button>
      </form>

      {state.message && <p style={{ color: "green", marginTop: "1rem" }}>{state.message}</p>}
      {state.error && <p style={{ color: "red", marginTop: "1rem" }}>{state.error}</p>}
      <div style={{ marginTop: "3rem" }}>
        <h2>My Products</h2>
        {products.length === 0 ? (
          <p>No products listed yet.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "1rem"
          }}>
            {products.map((product) => (
              <a href={`/products/${product._id}`} key={product._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.2s"
                }}>
                  <div style={{ height: "200px", overflow: "hidden", position: "relative", backgroundColor: "#f9f9f9" }}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#aaa" }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "10px" }}>
                    <h3 style={{ fontSize: "1.1rem", margin: "0 0 5px 0" }}>{product.name}</h3>
                    <p style={{ color: "#555", fontSize: "0.9rem", margin: "0 0 5px 0" }}>{product.category}</p>
                    <p style={{ fontWeight: "bold", color: "#333", margin: 0 }}>${product.price ? product.price.toFixed(2) : "0.00"}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage;
