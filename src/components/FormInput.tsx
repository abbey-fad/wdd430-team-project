"use client";

import React from "react";

interface FormInputProps {
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  id?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  name,
  placeholder,
  required,
  minLength,
  id
}) => {
  const InputTag = type === "textarea" ? "textarea" : "input";

  const inputProps = value !== undefined && onChange !== undefined
    ? { value, onChange }
    : {};

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor={id || name}>
        {label}:
        <InputTag
          type={type !== "textarea" ? type : undefined}
          {...inputProps}
          name={name}
          id={id || name}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          style={{ display: "block", width: "100%", padding: "0.5rem" }}
        />
      </label>
      {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
    </div>
  );
};

export default FormInput;
