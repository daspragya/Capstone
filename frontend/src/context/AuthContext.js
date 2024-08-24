// src/context/AuthContext.js
import React, { createContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signup = async (username, password, role) => {
    try {
      await axios.post("http://localhost:5000/signup", {
        username,
        password,
        role,
      });
      alert("User registered successfully");
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      setUser({
        username: response.data.username,
        role: response.data.role,
        details: response.data.details,
      });
      return true;
    } catch (error) {
      alert(error.response.data.message);
      console.error(error.response.data.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const refreshUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/refresh-user-details`,
        {
          params: { username: user.username },
        }
      );

      // Update the user state with the refreshed details
      setUser(response.data);
    } catch (error) {
      console.error("Error refreshing user details:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, refreshUserDetails }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
