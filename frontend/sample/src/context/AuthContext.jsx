
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../service/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the user's session when the app opens
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/auth/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Register a new user
  const register = async (formData) => {
    const response = await api.post(
      "/auth/register",
      formData
    );

    return response.data;
  };

  // Login existing user
  const login = async (credentials) => {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    const { access_token, user } = response.data;

    localStorage.setItem("access_token", access_token);
    setUser(user);

    return user;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
