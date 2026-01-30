import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleAuth({ setUser }) {
  const handleSuccess = async (credentialResponse) => {
    const res = await axios.post("http://localhost:5000/auth/google", {
      token: credentialResponse.credential,
    });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      
      {/* Background Glow (same vibe as landing) */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 blur-3xl"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center shadow-xl">
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Big<span className="text-white">(O)</span> Analyzer
        </h1>

        <p className="text-white/70 mb-10">
          Login to analyze your DSA code like a LeetCode pro.
        </p>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
            theme="outline"
            size="large"
            shape="pill"
          />
        </div>

        <p className="mt-6 text-sm text-white/50">
          Login required only to run analysis
        </p>
      </div>
    </div>
  );
}
