import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <GoogleOAuthProvider clientId="450140745604-nh43c3mq9vjpmn03suoe45ca94168dre.apps.googleusercontent.com">
      <Routes>
        <Route
          path="/"
          element={
            isAuth ? <Navigate to="/dashboard" /> : <Login setIsAuth={setIsAuth} />
          }
        />
        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
