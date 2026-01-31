import { useState } from "react";
import axios from "axios";

export default function Analyze() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [errorType, setErrorType] = useState("TLE");
  const [topic, setTopic] = useState("Array");
  const [constraints, setConstraints] = useState("");
  const [problemType] = useState("DSA");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/analyze",
        {
          code,
          language,
          errorType,
          topic,
          constraints,
          problemType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const findings = result?.findings || [];

  return (
    <div className="max-w-5xl mx-auto pt-16 pb-20 text-white space-y-10">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-4xl font-bold">Analyze Code</h1>
        <p className="text-white/60 mt-2">
          Paste your code and let us analyze it.
        </p>
      </div>

      {/* ===== INPUT FORM ===== */}
      <div className="space-y-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-8">

        {/* Code */}
        <div>
          <label className="block mb-2 text-sm text-white/70">Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            className="w-full rounded-lg bg-black/60 border border-white/10 p-4 font-mono text-sm outline-none focus:border-white/30"
            placeholder="// Paste your code here"
          />
        </div>

        {/* Selects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select label="Language" value={language} onChange={setLanguage}
            options={["cpp", "java", "python"]} />

          <Select label="Error Type" value={errorType} onChange={setErrorType}
            options={["TLE", "WA", "RE", "Overflow"]} />

          <Select label="Topic" value={topic} onChange={setTopic}
            options={["Array","DP","Graph","Tree","Stack","Queue","Greedy","Heap","String"]} />

          <div>
            <label className="block mb-2 text-sm text-white/70">Constraints</label>
            <input
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. n <= 1e5"
              className="w-full rounded-lg bg-black/60 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full rounded-xl bg-white text-black font-semibold py-4 hover:bg-zinc-200 transition disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze Code"}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* ===== RESULT ===== */}
      {result && (
        <div className="space-y-8">

          {/* Score & Complexity */}
          <div className="grid md:grid-cols-3 gap-6">
            <ResultCard label="Score" value={`${result.summary.score}%`} />
            <ResultCard label="Time Complexity" value={result.currentComplexity || "Unknown"} />
            <ResultCard label="Space Complexity" value={result.spaceComplexity || "Unknown"} />
          </div>

          {/* Issues */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Issues Found ({findings.length})
            </h2>

            {findings.length === 0 && (
              <div className="rounded-xl bg-green-500/10 border border-green-400/30 p-6 text-green-300">
                ✅ No critical issues detected. Code looks good!
              </div>
            )}

            {findings.map((f, idx) => (
              <div key={idx}
                className="rounded-xl bg-black/40 border border-white/10 p-6">
                <div className="flex justify-between">
                  <p className="font-semibold text-red-400">{f.rule}</p>
                  <span className="text-xs">{f.severity}</span>
                </div>
                <p className="text-white/70 mt-2">{f.reason}</p>
                <p className="text-green-400 mt-3 text-sm">Fix: {f.fix}</p>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

/* ===== COMPONENTS ===== */

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-2 text-sm text-white/70">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-black/60 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function ResultCard({ label, value }) {
  return (
    <div className="rounded-xl bg-black/40 border border-white/10 p-6">
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
