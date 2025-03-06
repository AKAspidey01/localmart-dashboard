import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => {
        return localStorage.getItem("adminToken") ? JSON.parse(localStorage.getItem("adminToken")) : null;
      });

    const login = (token) => {
      localStorage.setItem("adminToken", JSON.stringify(token));
      setAuthToken(token);
    };
  
    const logout = () => {
      localStorage.removeItem("adminToken");
      setAuthToken(null);
    };
    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);