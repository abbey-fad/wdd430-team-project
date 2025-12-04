"use client";

import React, { useState, useActionState, useEffect } from "react";
import FormInput from "../../../components/FormInput";
import { useRouter } from "next/navigation";
import { saveProduct, State } from "../../actions/product";

const initialState: State = {
  message: "",
  error: "",
  success: false,
};

const NewProductPage: React.FC = () => {
  const router = useRouter();
  const [state, formAction] = useActionState<State, FormData>(saveProduct, initialState);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/seller");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (name.length > 100) newErrors.name = "Name cannot exceed 100 characters";
    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(Number(price)) || Number(price) <= 0)
      newErrors.price = "Price must be a positive number";
    if (!category.trim()) newErrors.category = "Category is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (description.length > 1000)
      newErrors.description = "Description cannot exceed 1000 characters";

    const validImages = images.filter(img => img.trim() !== "");
    if (validImages.length === 0) newErrors.images = "At least one image URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClientSubmit = (formData: FormData) => {
    if (!validate()) return;
    formAction(formData);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const removeImageField = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div className="form-container">
      <h1>Add New Product</h1>
      <form action={handleClientSubmit}>
        <FormInput label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <FormInput label="Price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} error={errors.price} />
        <FormInput label="Category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} error={errors.category} />
        <FormInput label="Description" name="description" type="textarea" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} />

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Image URLs</label>
          {images.map((img, index) => (
            <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input
                type="text"
                name="images"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={{ flex: 1, padding: "0.5rem" }}
              />
              {images.length > 1 && (
                <button type="button" onClick={() => removeImageField(index)} style={{ background: "red", color: "white", border: "none", padding: "0.5rem", width: "auto", height: "100%", marginBottom: 0 }}>
                  X
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImageField} className="btn-secondary" style={{ marginTop: "0.5rem" }}>Add Another Image</button>
          {errors.images && <p style={{ color: "red", fontSize: "0.875rem" }}>{errors.images}</p>}
        </div>

        <button type="submit">Submit Product</button>
      </form>

      {state.message && <p style={{ color: "green" }}>{state.message}</p>}
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
    </div>
  );
};

export default NewProductPage;
