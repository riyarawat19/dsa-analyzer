import { Routes, Route, Navigate } from "react-router-dom";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Analyze from "./pages/Analyze";
import Profile from "@/pages/Profile";
import SidebarLayout from "./layouts/SidebarLayout";
import AppShell from "./layouts/AppShell";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "@/context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  // 🔑 CRITICAL: wait for auth restore
  if (loading) return null; // or spinner

  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* PUBLIC */}
        <Route path="/" element={<Hero />} />

        <Route
          path="login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* PROTECTED */}
        <Route
          element={
            user ? <SidebarLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="analyze" element={<Analyze />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
