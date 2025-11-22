"use client";

import React, { useState } from "react";
import FormInput from "../../components/FormInput";
import { useRouter } from "next/navigation";

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
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

    alert("Signup successful!");
    router.push("/login"); // ← redirect after signup
  };

  return (
    <div className="form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignupPage;
