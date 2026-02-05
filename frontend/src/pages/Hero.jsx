import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const handleCTA = () => {
    navigate(isAuth ? "/analyze" : "/login");
  };

  return (
    // 🔥 Scroll container
    <div className="relative z-50 h-screen overflow-y-auto bg-transparent text-white">
      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Big<span>(O)</span> Analyzer
          </h1>

          <p className="text-lg md:text-xl mb-10">
            Analyze your DSA code for runtime errors, bad practices, and weak
            topics — like a LeetCode pro.
          </p>

          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-2 rounded-xl
              bg-white px-8 py-4 text-black font-semibold
              hover:bg-zinc-200 transition"
          >
            Analyze Code
          </button>

          <p className="mt-4 text-sm md:text-base text-white/70">
            Paste your code, get instant feedback, and track your progress over
            time.
          </p>

          <p className="mt-6 text-sm text-white/80">
            Login required only to run analysis
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-32 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Why Big(O) Analyzer?
        </h2>

        <p className="text-lg text-white/70 leading-relaxed">
          Most coding platforms tell you that your solution failed — but rarely
          explain
          <span className="text-white"> why</span>.
          <br />
          <br />
          Big(O) Analyzer was built to bridge that gap. It focuses on helping
          developers understand their mistakes, identify weak problem-solving
          patterns, and improve consistently instead of relying on trial and
          error.
        </p>
      </section>
     
      {/* ================= DEVELOPER SECTION ================= */}
      <section className="max-w-4xl mx-auto mt-32 px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Built by a Developer, for Developers
        </h2>

        <p className="text-lg text-white/70 leading-relaxed">cd
          Big(O) Analyzer was built by student developers who faced the same
          struggles most programmers do — unclear feedback, repeated mistakes,
          and no reliable way to track real improvement.
          <br />
          <br />
          This project started as a personal learning experiment and evolved
          into a platform focused on clarity, consistency, and long-term growth
          for developers preparing for interviews and competitive programming.
        </p>

        <p className="mt-6 text-sm text-white/50">
          🚀 Built with real learning challenges in mind — not shortcuts
        </p>
      </section>

      {/* <ReviewsSection /> */}
    </div>
  );
}
