import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    const res = await axios.post("http://localhost:5000/auth/google", {
      token: credentialResponse.credential,
    });

    // save token + update auth state
    login(res.data.token);

    navigate("/");
  };

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      {/* Gradient Wave Background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 left-1/2 w-[900px] h-[300px] 
          bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
          opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Login Card */}
      <div
        className="relative z-10 bg-white/10 backdrop-blur-xl 
        rounded-2xl px-10 py-12 shadow-2xl border border-white/20 text-center w-[380px]"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Big(O) Analyzer</h1>

        <p className="text-gray-300 text-sm mb-8">
          Sign in to analyze your DSA code and discover hidden issues
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
            theme="filled_black"
            size="large"
            shape="pill"
          />
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Login required only to run analysis
        </p>
      </div>
    </div>
  );
}
