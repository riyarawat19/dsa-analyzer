import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleAuth from "./components/GoogleAuth";

function App() {
  const [user, setUser] = useState(null);

  return (
    <GoogleOAuthProvider clientId="450140745604-nh43c3mq9vjpmn03suoe45ca94168dre.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        {!user ? (
          <GoogleAuth setUser={setUser} />
        ) : (
          <Dashboard user={user} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
