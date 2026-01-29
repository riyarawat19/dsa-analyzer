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
      setError("Please enter some code.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/analyze",
        {
          code,
          language,
          errorType,
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
      setError("Failed to analyze code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Analyze Code</h1>

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>

        <select
          value={errorType}
          onChange={(e) => setErrorType(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
        >
          <option value="RE">Runtime Error</option>
          <option value="TLE">Time Limit Exceeded</option>
          <option value="WA">Wrong Answer</option>
        </select>
      </div>

      {/* Code Editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// Paste your DSA code here"
        className="w-full h-64 bg-zinc-900 border border-zinc-700 rounded p-4 font-mono text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
      />

      {/* Actions */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-4 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Run Analysis 🚀"}
      </button>

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-400">{error}</p>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Analysis Result
          </h2>

          {result.findings?.map((item, idx) => (
            <div
              key={idx}
              className="mb-4 p-4 bg-black border border-zinc-800 rounded-lg"
            >
              <p className="font-semibold text-red-400">
                {item.rule}
              </p>
              <p className="text-sm text-zinc-300 mt-1">
                {item.reason}
              </p>
              <p className="text-sm text-green-400 mt-2">
                Fix: {item.fix}
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                Confidence: {item.confidence} | Error Type: {item.errorType}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
