import { Routes, Route, Navigate } from "react-router-dom";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import { useAuth } from "@/context/AuthContext";
import SidebarLayout from "./layouts/SidebarLayout";
import { WavyBackground } from "./components/ui/wavy-background";
import AppShell from "./layouts/AppShell";
import Profile from "@/pages/Profile";


function App() {
  const { isAuth } = useAuth();

  return (
    <AppShell>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/login"
            element={isAuth ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/analyze"
            element={isAuth ? <Analyze /> : <Navigate to="/login" />}
          />
        </Routes>
      </SidebarLayout>
    </AppShell>
  );
}

export default App;
