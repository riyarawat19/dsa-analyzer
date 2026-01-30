import { Routes, Route, Navigate } from "react-router-dom";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Profile from "@/pages/Profile";
import { useAuth } from "@/context/AuthContext";
import SidebarLayout from "./layouts/SidebarLayout";
import AppShell from "./layouts/AppShell";

function App() {
  const { isAuth } = useAuth();

  return (
    <Routes>
      <Route element={<AppShell />}>
        
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Hero />} />
        <Route
          path="login"
          element={isAuth ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          element={isAuth ? <SidebarLayout /> : <Navigate to="/login" />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analyze" element={<Analyze />} />
          <Route path="profile" element={<Profile />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
