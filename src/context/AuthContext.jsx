"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import api from "@/lib/apiClient";

/**
 * @typedef {Object} AuthUser
 * @property {number|string} id
 * @property {string} email
 * @property {string} name
 * @property {string} role
 * @property {string|undefined} phone
 * @property {Array<number>} registeredEvents
 *
 * @typedef {Object} AuthContextType
 * @property {AuthUser|null} user
 * @property {boolean} loading
 * @property {(email:string, password:string) => Promise<any>} login
 * @property {(userData:Object) => Promise<any>} register
 * @property {(updatedData:Object) => void} updateProfile
 * @property {() => void} logout
 * @property {() => boolean} isAdmin
 * @property {() => boolean} isSuperAdmin
 */

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        api.setToken(token);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ================= LOGIN =================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const saltRounds = parseInt(
        process.env.NEXT_APP_SALT_ROUNDS || process.env.NEXT_PUBLIC_SALT_ROUNDS || "10",
        10
      );

      // By default this project expects a bcrypt hash on the backend.
      const hashed = await bcrypt.hash(password, saltRounds);

      const res = await api.post("/api/auth/user/signin", {
        email,
        password: hashed,
      });

      const token = res?.token || res?.data?.token;
      const userResp = res?.user || res?.data?.user || res?.data;

      if (token) {
        api.setToken(token);
        try {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userResp));
        } catch (e) {}
        setUser(userResp);
        return { success: true, data: { token, user: userResp } };
      }

      return { success: false, message: res?.message || "Login failed" };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: err?.data?.message || err.message || "Login error" };
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const register = async (userData) => {
    setLoading(true);
    try {
      const saltRounds = parseInt(
        process.env.NEXT_APP_SALT_ROUNDS || process.env.NEXT_PUBLIC_SALT_ROUNDS || "10",
        10
      );

      const hashed = await bcrypt.hash(userData.password, saltRounds);

      const payload = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashed,
      };

      const res = await api.post("/api/users", payload);

      const token = res?.token || res?.data?.token;
      const userResp = res?.user || res?.data?.user || res?.data;

      if (token) {
        api.setToken(token);
        try {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userResp));
        } catch (e) {}
        setUser(userResp);
        return { success: true, data: { token, user: userResp } };
      }

      return { success: false, message: res?.message || "Registration failed" };
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, message: err?.data?.message || err.message || "Registration error" };
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE PROFILE =================
  const updateProfile = (updatedData) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updatedData,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // ================= LOGOUT =================
  const logout = () => {
    api.clearToken();
    setUser(null);
    router.push("/");
  };

  // ================= ROLE CHECKS =================
  const isAdmin = () => {
    return user?.role === "admin" || user?.role === "superAdmin";
  };

  const isSuperAdmin = () => {
    return user?.role === "superAdmin";
  };

  const value = {
    user,
    loading,
    login,
    register,
    updateProfile,
    logout,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
