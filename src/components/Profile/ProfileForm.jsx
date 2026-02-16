"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const isAdminType = user?.role === "admin" || user?.role === "superAdmin";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Populate initial form values from user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Keep only digits and limit to 15
      const numericValue = value.replace(/\D/g, "").slice(0, 15);
      setFormData((prev) => ({ ...prev, phone: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user) return;

    const isAdminType = user.role === "admin" || user.role === "superAdmin";

    // Phone validation (ONLY for admin/superAdmin)
    if (isAdminType) {

      if (formData.phone && (formData.phone.length < 8 || formData.phone.length > 15)) {
        return setError("Phone number must be between 8 and 15 digits");
      }
    }

    // Password validation
    if (formData.password) {
      if (formData.password.length < 6) {
        return setError("Password must be at least 6 characters");
      }

      if (formData.password !== formData.confirmPassword) {
        return setError("Passwords do not match");
      }
    }

    const updatedData = {
      name: formData.name,
      email: formData.email,
    };

    // Only include phone if admin/superAdmin
    if (isAdminType) {
      updatedData.phone = formData.phone;
    }

    if (formData.password) {
      updatedData.password = formData.password;
    }

    try {
      await updateProfile(updatedData);
      setMessage("Profile updated successfully");
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="form-group">
        <label>Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {isAdminType && (
        <div className="form-group">
          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="8–15 digits"
          />
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />

      <div className="form-group">
        <label>New Password</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Leave blank to keep current"
        />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Leave blank to keep current"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Save Changes
      </button>
    </form>
  );
}
