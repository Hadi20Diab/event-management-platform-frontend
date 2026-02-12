import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
/**
 * @typedef {Object} AuthUser
 * @property {number|string} id
 * @property {string} email
 * @property {string} name
 * @property {string} role
 * @property {Array<number>} registeredEvents
 *
 * @typedef {Object} AuthContextType
 * @property {AuthUser|null} user
 * @property {boolean} loading
 * @property {(email:string, password:string) => Promise<any>} login
 * @property {(userData:Object) => Promise<any>} register
 * @property {() => void} logout
 * @property {() => boolean} isAdmin
 * @property {() => boolean} isSuperAdmin
 */

/** @type {React.Context<AuthContextType>} */
const AuthContext = createContext(/** @type {AuthContextType} */ ({}));

/** @returns {AuthContextType} */
export const useAuth = () =>
  /** @type {AuthContextType} */ (useContext(AuthContext));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token on mount
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

  const login = async (email, password) => {
    console.log("Logging in with:", email, password);

    // Mock response - Replace with actual API call
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
            : undefined, // normal user has no role
        registeredEvents: [1, 2],
      },
    };

    localStorage.setItem("token", mockResponse.token);
    localStorage.setItem("user", JSON.stringify(mockResponse.user));
    setUser(mockResponse.user);

    return { success: true, data: mockResponse };
  };

  const register = async (userData) => {
    console.log("Registering:", userData);

    const mockResponse = {
      token: "mock-jwt-token",
      user: {
        id: Date.now(),
        ...userData,
        role: undefined, // normal users have no role
        registeredEvents: [],
      },
    };

    localStorage.setItem("token", mockResponse.token);
    localStorage.setItem("user", JSON.stringify(mockResponse.user));
    setUser(mockResponse.user);

    return { success: true, data: mockResponse };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  // Checks if the user is admin OR superAdmin
  const isAdmin = () => {
    return user?.role === "admin" || user?.role === "superAdmin";
  };

  // Checks if the user is superAdmin
  const isSuperAdmin = () => {
    return user?.role === "superAdmin";
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
