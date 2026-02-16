"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../api/api";
import { hashPassword } from "../utils/hash";

/**
 * @typedef {Object} AuthUser
 * @property {number|string} id
 * @property {string} email
 * @property {string} name
 * @property {string|undefined} role
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
    // Token is in httpOnly cookie (not accessible from JS)
    // Only restore user data from localStorage if available
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      console.log("Logging in with:", email);

      // Hash password with SHA256 before sending to backend
      const hashedPassword = await hashPassword(password);

      // Determine if this is admin or user login based on email or role context
      const isAdminLogin = email.includes("admin") || window.location.pathname === "/admin-login";
      const endpoint = isAdminLogin ? "/auth/admin/login" : "/auth/user/signin";

      // Send SHA256 hash - backend will bcrypt it for secure storage
      const response = await apiRequest(endpoint, "POST", {
        email,
        password: hashedPassword,
      });

      // Token is now in httpOnly cookie (set by backend)
      // Only store user data in localStorage
      const userData = response.admin || response.user;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true, data: { user: userData } };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Login failed. Please check your credentials.",
      };
    }
  };

  // ================= REGISTER =================
  const register = async (userData) => {
    try {
      console.log("Registering:", { ...userData, password: "[REDACTED]" });

      // Hash password with SHA256 before sending to backend
      const hashedPassword = await hashPassword(userData.password);

      // Send SHA256 hash - backend will bcrypt it for secure storage
      const response = await apiRequest("/auth/user/signup", "POST", {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
      });

      // Token is now in httpOnly cookie (set by backend)
      // Only store user data in localStorage
      const user = response.user;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, data: { user } };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "Registration failed. Please try again.",
      };
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
  const logout = async () => {
    try {
      // Call backend to clear httpOnly cookie
      await apiRequest("/auth/logout", "POST");
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    // Clear user data from localStorage
    localStorage.removeItem("user");
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
