"use client";

import React from "react";
import ProductForm from "../../../components/ProductForm";
import { useRouter } from "next/navigation";
import { saveProduct } from "../../actions/product";

const NewProductPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="form-container">
      <h1>Add New Product</h1>
      <ProductForm
        action={saveProduct}
        onSuccess={() => {
          setTimeout(() => {
            router.push("/seller");
          }, 1000);
        }}
      />
    </div>
  );
};

export default NewProductPage;
