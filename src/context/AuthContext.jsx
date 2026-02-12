"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ================= LOGIN =================
  const login = async (email, password) => {
    console.log("Logging in with:", email, password);

    const mockResponse = {
      token: "mock-jwt-token",
      user: {
        id: Date.now(),
        email,
        name: email.split("@")[0],
        role: email.includes("superadmin")
          ? "superAdmin"
          : email.includes("admin")
            ? "admin"
            : undefined,
        phone: "",
        registeredEvents: [1, 2],
      },
    };

    localStorage.setItem("token", mockResponse.token);
    localStorage.setItem("user", JSON.stringify(mockResponse.user));
    setUser(mockResponse.user);

    return { success: true, data: mockResponse };
  };

  // ================= REGISTER =================
  const register = async (userData) => {
    console.log("Registering:", userData);

    const mockResponse = {
      token: "mock-jwt-token",
      user: {
        id: Date.now(),
        ...userData,
        role: undefined,
        phone: userData.phone || "",
        registeredEvents: [],
      },
    };

    localStorage.setItem("token", mockResponse.token);
    localStorage.setItem("user", JSON.stringify(mockResponse.user));
    setUser(mockResponse.user);

    return { success: true, data: mockResponse };
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
    localStorage.removeItem("token");
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
