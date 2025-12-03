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

const SellerProfilePage: React.FC = () => {
  const router = useRouter();
  const [state, formAction] = useActionState<State, FormData>(saveProfile, initialState);

  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ shopName?: string; bio?: string }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          setShopName(profile.shopName);
          setBio(profile.bio);
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
      const timer = setTimeout(() => {
        router.push("/products/new");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

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
      <h1>Seller Profile</h1>
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

      {state.message && <p style={{ color: "green" }}>{state.message}</p>}
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
    </div>
  );
};

export default SellerProfilePage;
