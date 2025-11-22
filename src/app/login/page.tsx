"use client";

import React, { useState } from "react";
import FormInput from "../../components/FormInput";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert("Login successful!");
    router.push("/products/new"); // ← redirect after login
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default LoginPage;
