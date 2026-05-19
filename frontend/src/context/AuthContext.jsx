import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session after OAuth redirect
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        localStorage.setItem("token", data.session.access_token);
        setUser(data.session.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem("token", session.access_token);
        setUser(session.user);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Add logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if Supabase call fails
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  // ✅ Add login function (optional, for consistency)
  const login = async (provider = "google") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    logout,
    login,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};