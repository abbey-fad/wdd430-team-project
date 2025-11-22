"use client";

import React, { useState } from "react";
import FormInput from "../../components/FormInput";
import { useRouter } from "next/navigation";

const SellerProfilePage: React.FC = () => {
  const router = useRouter();

  const [shopName, setShopName] = useState("My Handmade Shop");
  const [bio, setBio] = useState("Write a short bio about yourself and your craft.");
  const [errors, setErrors] = useState<{ shopName?: string; bio?: string }>({});
  const [message, setMessage] = useState("");

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!shopName.trim()) newErrors.shopName = "Shop Name is required";
    if (!bio.trim()) newErrors.bio = "Bio is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setMessage("Profile saved successfully!");

    // Redirect after 1 second so user can see the success message
    setTimeout(() => {
      router.push("/products/new"); // or any page you want
    }, 1000);
  };

  return (
    <div className="form-container">
      <h1>Seller Profile</h1>
      <form onSubmit={handleSave}>
        <FormInput
          label="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          error={errors.shopName}
        />

        <FormInput
          label="Bio"
          type="textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          error={errors.bio}
        />

        <button type="submit">Save Profile</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default SellerProfilePage;
