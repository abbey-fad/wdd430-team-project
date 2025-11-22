"use client";

import React from "react";

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, type = "text", value, onChange, error }) => {
  const InputTag = type === "textarea" ? "textarea" : "input";

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>
        {label}:
        <InputTag
          type={type !== "textarea" ? type : undefined}
          value={value}
          onChange={onChange}
          style={{ display: "block", width: "100%", padding: "0.5rem" }}
        />
      </label>
      {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
    </div>
  );
};

export default FormInput;
