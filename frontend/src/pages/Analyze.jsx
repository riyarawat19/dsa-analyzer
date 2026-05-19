import { useState } from "react";
import axios from "axios";
import { MultiStepLoader } from "../components/ui/MultiStepLoader";
import CodeEditor from "../components/CodeEditor";

const templates = {
  cpp: `#include<bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}
`,

  python: `def solve():
    pass

solve()
`,

  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {

    }
}
`,
};

export default function Analyze() {
  const [language, setLanguage] = useState("cpp");

  const [code, setCode] = useState(
    templates.cpp
  );

  const [errorType, setErrorType] =
    useState("TLE");

  const [topic, setTopic] =
    useState("Array");

  const [constraints, setConstraints] =
    useState("");

  const [problemType] =
    useState("DSA");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState(null);

  const loadingStates = [
    { text: "Reading your code" },
    {
      text: "Analyzing logic & edge cases",
    },
    {
      text: "Detecting DSA issues",
    },
    {
      text: "Running AI analysis",
    },
    {
      text: "Generating findings",
    },
  ];

  const MIN_LOADER_TIME = 3500;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(templates[lang]);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = Date.now();

    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/analysis`,
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

      setError(
        "Analysis failed. Please try again."
      );

    } finally {
      const elapsed =
        Date.now() - startTime;

      const remaining =
        MIN_LOADER_TIME - elapsed;

      setTimeout(() => {
        setLoading(false);
      }, remaining > 0 ? remaining : 0);
    }
  };

  const findings =
    result?.findings || [];

  return (
    <>
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        duration={700}
        loop={false}
      />

      <div className="min-h-screen bg-white/5 backdrop-blur-xl border border-white/10 text-white px-6 py-10">

        {/* HEADER */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-bold">
            DSA AI Analyzer
          </h1>

          <p className="text-white/60 mt-2">
            Analyze DSA code using
            heuristics + AI reasoning
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* CONTROLS */}
            <div className="rounded-2xl bg-zinc-900 border border-white/10 p-5">

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <Select
                  label="Language"
                  value={language}
                  onChange={
                    handleLanguageChange
                  }
                  options={[
                    "cpp",
                    "python",
                    "java",
                  ]}
                />

                <Select
                  label="Error Type"
                  value={errorType}
                  onChange={setErrorType}
                  options={[
                    "TLE",
                    "WA",
                    "RE",
                    "Overflow",
                  ]}
                />

                <Select
                  label="Topic"
                  value={topic}
                  onChange={setTopic}
                  options={[
                    "Array",
                    "DP",
                    "Graph",
                    "Tree",
                    "Greedy",
                    "Heap",
                    "Stack",
                    "Queue",
                    "String",
                  ]}
                />

                <div>
                  <label className="block mb-2 text-sm text-white/70">
                    Constraints
                  </label>

                  <input
                    value={constraints}
                    onChange={(e) =>
                      setConstraints(
                        e.target.value
                      )
                    }
                    placeholder="e.g. n <= 1e5"
                    className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </div>

            {/* CODE EDITOR */}
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {loading
                ? "Analyzing..."
                : "Analyze Code"}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* SUMMARY */}
            <div className="sticky top-6 space-y-6">

              <ResultCard
                label="Overall Score"
                value={`${
                  result?.summary?.score ||
                  0
                }%`}
              />

              <ResultCard
                label="Time Complexity"
                value={
                  result?.timeComplexity ||
                  "Unknown"
                }
              />

              <ResultCard
                label="Space Complexity"
                value={
                  result?.spaceComplexity ||
                  "Unknown"
                }
              />

              {/* FINDINGS */}
              <div className="rounded-2xl bg-zinc-900 border border-white/10 p-5">

                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold">
                    Findings
                  </h2>

                  <span className="text-sm text-white/50">
                    {findings.length}
                  </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">

                  {findings.length === 0 && (
                    <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-5 text-green-400">
                      No major issues detected.
                    </div>
                  )}

                  {findings.map((f, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-black border border-white/10 p-4"
                    >
                      <div className="flex items-center justify-between">

                        <h3 className="font-semibold text-red-400">
                          {f.rule}
                        </h3>

                        <span
                          className={`
                            px-2 py-1 rounded-full text-xs

                            ${
                              f.severity ===
                              "high"
                                ? "bg-red-500/20 text-red-400"

                                : f.severity ===
                                  "medium"
                                ? "bg-yellow-500/20 text-yellow-400"

                                : "bg-blue-500/20 text-blue-400"
                            }
                          `}
                        >
                          {f.severity}
                        </span>
                      </div>

                      <p className="text-white/70 text-sm mt-3">
                        {f.reason}
                      </p>

                      <div className="mt-4 text-green-400 text-sm">
                        Fix: {f.fix}
                      </div>

                      <div className="mt-3 flex justify-between text-xs text-white/40">
                        <span>
                          {f.source}
                        </span>

                        <span>
                          Confidence:{" "}
                          {f.confidence || 90}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="block mb-2 text-sm text-white/70">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 outline-none focus:border-white/30"
      >
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
          >
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResultCard({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-white/10 p-5">
      <p className="text-sm text-white/50">
        {label}
      </p>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}