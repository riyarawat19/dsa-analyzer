import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) console.error(error.message);
  };

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
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
        <h1 className="text-3xl font-bold text-white mb-2">
          Big(O) Analyzer
        </h1>

        <p className="text-gray-300 text-sm mb-8">
          Sign in to analyze your DSA code
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-black text-white rounded-full
          hover:bg-gray-900 transition"
        >
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Login required only to run analysis
        </p>
      </div>
    </div>
  );
}
