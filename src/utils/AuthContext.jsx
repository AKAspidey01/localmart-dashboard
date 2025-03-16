import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { config } from "../env-services";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [authToken, setAuthToken] = useState(() => {
        const storedToken = localStorage.getItem("adminToken");
        return storedToken ? JSON.parse(storedToken) : null;
    });

    const [userData, setUserData] = useState(null); // Global user data

    useEffect(() => {
        if (authToken) {
            getProfileData(authToken);
        }
    }, [authToken]); // Fetch user details when authToken changes

    const [userRole, setUserRole] = useState(() => {
        if (authToken) {
            const decodedToken = jwtDecode(authToken);
            return decodedToken?.roleSlug || null; // Extract role from token
        }
        return null;
    });

    const login = (token) => {
        localStorage.setItem("adminToken", JSON.stringify(token));
        setAuthToken(token);
        
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken?.roleSlug || null); // Store role in state
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        setAuthToken(null);
        setUserRole(null);
    };

    const getProfileData = async (token) => {
      try {
          const response = await axios.get(`${config.api}auth/user-details`, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  "content-type": "application/json",
              },
          });
          setUserData(response?.data?.data);
      } catch (error) {
          console.error("Error fetching profile data:", error);
      }
  };

    return (
        <AuthContext.Provider value={{ authToken, login, logout , userRole , userData}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);