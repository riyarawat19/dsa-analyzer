import { WavyBackground } from "@/components/ui/wavy-background";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const handleCTA = () => {
    navigate(isAuth ? "/dashboard" : "/login");
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* 🔥 BACKGROUND LAYER (ISOLATED) */}
     

      {/* 🔥 CONTENT LAYER (ALWAYS ON TOP) */}
      <div className="relative z-50 flex min-h-screen items-center justify-center px-6 bg-transparent">
        <div className="max-w-3xl text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Big<span className="text-white">(O)</span> Analyzer
          </h1>

          <p className="text-lg md:text-xl text-white mb-10">
            Analyze your DSA code for runtime errors, bad practices,
            and weak topics — like a LeetCode pro.
          </p>

          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-black font-semibold hover:bg-zinc-200 transition"
          >
            Analyze Code <span className="text-xl"></span>
          </button>

          <p className="mt-6 text-sm text-white">
            Login required only to run analysis
          </p>
        </div>
      </div>
    </div>
  );
}
