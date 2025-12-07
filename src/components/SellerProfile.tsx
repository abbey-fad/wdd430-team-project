"use client";

import React, { useEffect, useState, useActionState } from "react";
import FormInput from "./FormInput";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";
import { saveProfile, getProfile, State } from "../app/actions/profile";
import { Skeleton } from "./Skeleton";

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    images: string[];
}

interface SellerProfileProps {
    profileId?: string;
}

const initialState: State = {
    message: "",
    error: "",
    success: false,
};

const SellerProfile: React.FC<SellerProfileProps> = ({ profileId }) => {
    const router = useRouter();
    const [state, formAction] = useActionState<State, FormData>(saveProfile, initialState);

    const [shopName, setShopName] = useState("");
    const [bio, setBio] = useState("");
    const [isOwner, setIsOwner] = useState(false);

    const [displayedProfile, setDisplayedProfile] = useState<{ shopName: string; bio: string } | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<{ shopName?: string; bio?: string }>({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile(profileId);
                if (profile) {
                    setShopName(profile.shopName);
                    setBio(profile.bio);
                    setIsOwner(profile.isOwner);
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
    }, [profileId]);

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

            {isOwner && (
                <>
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
                </>
            )}

            <div style={{ marginTop: "3rem" }}>
                <h2>{isOwner ? "My Products" : "Products"}</h2>
                {products.length === 0 ? (
                    <p>No products listed yet.</p>
                ) : (
                    <div className="product-grid" style={{ marginTop: "1rem" }}>
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                price={product.price}
                                image={product.images?.[0]}
                                category={product.category}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerProfile;
