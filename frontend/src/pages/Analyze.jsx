import { useState } from "react";
import axios from "axios";

export default function Analyze() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [errorType, setErrorType] = useState("RE");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please paste some code.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/analysis",
        {
          code,
          language,
          errorType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setResult(res.data.analysis);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-white">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Analyze Code</h1>
        <p className="text-white/60">
          Paste your DSA code and find runtime issues, weak topics, and fixes.
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-black/40 backdrop-blur border border-white/10 rounded-lg px-4 py-2"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>

        <select
          value={errorType}
          onChange={(e) => setErrorType(e.target.value)}
          className="bg-black/40 backdrop-blur border border-white/10 rounded-lg px-4 py-2"
        >
          <option value="RE">Runtime Error</option>
          <option value="TLE">Time Limit Exceeded</option>
          <option value="WA">Wrong Answer</option>
        </select>
      </div>

      {/* CODE INPUT */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// Paste your code here"
        className="w-full h-72 bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
      />

      {/* ACTION */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>

      {/* ERROR */}
      {error && <p className="text-red-400">{error}</p>}

      {/* RESULT */}
      {result && <AnalysisResult result={result} />}
    </div>
  );
}
function AnalysisResult({ result }) {
  const summary = result.summary || {};

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="rounded-xl bg-black/40 backdrop-blur border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>

        <div className="flex flex-wrap gap-6 text-sm">
          <Stat
            label="Score"
            value={
              summary.score !== undefined
                ? `${summary.score}%`
                : "Not calculated"
            }
          />
          <Stat
            label="Errors"
            value={
              summary.errorTypes?.length
                ? summary.errorTypes.join(", ")
                : "Unknown"
            }
          />
          <Stat
            label="Status"
            value={
              summary.hasErrors === undefined
                ? "Unknown"
                : summary.hasErrors
                ? "Issues Found"
                : "Clean"
            }
          />
        </div>
      </div>

      {/* FINDINGS */}
      {result.findings?.length > 0 ? (
        <div className="space-y-4">
          {result.findings.map((f, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-black/30 backdrop-blur border border-white/10 p-6"
            >
              <h3 className="font-semibold text-red-400">{f.rule}</h3>

              <p className="text-white/80 mt-2">{f.reason}</p>

              {f.fix && (
                <p className="text-green-400 mt-3">
                  <span className="font-semibold">Fix:</span> {f.fix}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/60">
                {f.confidence && <span>Confidence: {f.confidence}</span>}
                {f.errorType && <span>Error Type: {f.errorType}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/60">No findings returned.</p>
      )}
    </div>
  );
}


function Stat({ label, value }) {
  return (
    <div>
      <p className="text-white/50">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
