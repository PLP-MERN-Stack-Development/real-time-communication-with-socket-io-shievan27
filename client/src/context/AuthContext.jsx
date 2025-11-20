import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safely parse localStorage user
  const storedUser = localStorage.getItem("user");
  let initialUser = null;
  try {
    initialUser = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.warn("Invalid user data in localStorage, clearing it...");
    localStorage.removeItem("user");
  }

  const [user, setUser] = useState(initialUser);

  const login = async ( emailOrUsername, password ) => {
  try {
    const { data } = await axios.post("/auth/login", { emailOrUsername, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

  const register = async ( username, email, password ) => {
    try {
      const { data } = await axios.post("/auth/register", { username, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
