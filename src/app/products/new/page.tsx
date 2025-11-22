"use client";

import React, { useState } from "react";
import FormInput from "../../../components/FormInput";
import { useRouter } from "next/navigation";

const NewProductPage: React.FC = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (title.length > 100) newErrors.title = "Title cannot exceed 100 characters";
    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(Number(price)) || Number(price) <= 0)
      newErrors.price = "Price must be a positive number";
    if (!category.trim()) newErrors.category = "Category is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (description.length > 500)
      newErrors.description = "Description cannot exceed 500 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert(
      `Product submitted!\nTitle: ${title}\nPrice: $${price}\nCategory: ${category}\nDescription: ${description}`
    );

    // Clear form
    setTitle("");
    setPrice("");
    setCategory("");
    setDescription("");
    setErrors({});

    // Redirect to seller profile (or change to any page you want)
    router.push("/seller");
  };

  return (
    <div className="form-container">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
        <FormInput label="Price" value={price} onChange={(e) => setPrice(e.target.value)} error={errors.price} />
        <FormInput label="Category" value={category} onChange={(e) => setCategory(e.target.value)} error={errors.category} />
        <FormInput label="Description" type="textarea" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} />
        <button type="submit">Submit Product</button>
      </form>
    </div>
  );
};

export default NewProductPage;
