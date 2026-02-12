"use client";
import { useState } from "react";
import { apiRequest } from "../../api/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Optional validation (recommended)
    if (form.phone.length < 8) {
      setError("Phone number must be at least 8 digits");
      return;
    }

    try {
      await apiRequest("/auth/register", "POST", form);
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={submit}>
        <input
          placeholder="Email"
          type="email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          required
          maxLength={15}
          value={form.phone}
          onChange={(e) => {
            // Allow only numbers
            const numericValue = e.target.value.replace(/\D/g, "");
            setForm({ ...form, phone: numericValue });
          }}
        />

        <button>Register</button>
      </form>
    </div>
  );
}
