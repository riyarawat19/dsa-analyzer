import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const login = (token) => {
    // 🔥 THIS WAS MISSING / BROKEN
    localStorage.setItem("token", token);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
