"use client";

import React from "react";
import ProfileForm from "../../../components/Profile/ProfileForm";

export default function ProfilePage() {
  return (
    <section className="dashboard-container">
      <div className="dashboard-header">
        <h1>Profile Settings</h1>
        <p>Manage your personal information</p>
      </div>

      <ProfileForm />
    </section>
  );
}
