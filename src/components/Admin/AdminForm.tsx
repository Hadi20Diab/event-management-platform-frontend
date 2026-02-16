"use client";
import { useState } from "react";

interface AdminFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function AdminForm({ onSubmit, onCancel }: AdminFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      password: formData.password,
    });
  };

  return (
    <div className="auth-card">
      <h3>Add New Admin</h3>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input id="name" type="text" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input id="email" type="email" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input id="phone" type="text" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select id="role" onChange={handleChange} value={formData.role}>
            <option value="admin">Admin</option>
            <option value="superAdmin">Super Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            id="password"
            type="password"
            required
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            required
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="btn btn-primary">
            Create
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
