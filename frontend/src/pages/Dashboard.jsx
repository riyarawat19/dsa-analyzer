import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-white">Loading dashboard...</p>;
  }

  if (!data) {
    return <p className="text-red-400">Failed to load dashboard</p>;
  }

  return (
    <div className="space-y-10 text-white">
      <h1 className="text-3xl font-bold">Hello, {data.user?.name || "User"}!</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Analyses" value={data.totalAnalyses} />
        <StatCard label="Error Types" value={data.errorBreakdown.length} />
        <StatCard label="Weak Topics" value={data.weakTopics.length} />
        <StatCard label="Recent Runs" value={data.recentAnalyses.length} />
      </div>

      {/* Recent */}
      <Section title="Recent Analyses">
        {data.recentAnalyses.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between rounded-lg bg-black/40 p-4"
          >
            <div>
              <p className="font-medium">
                {item.language} • {item.topic}
              </p>
              <p className="text-sm text-white/60">
                Errors: {item.summary.errorTypes.join(", ")}
              </p>
            </div>
            <p className="font-semibold">{item.summary.score}%</p>
          </div>
        ))}
      </Section>

      {/* Weak topics */}
      <Section title="Weak Topics">
        <div className="flex flex-wrap gap-3">
          {data.weakTopics.map((t, idx) => (
            <span
              key={idx}
              className="rounded-full bg-white/10 px-4 py-2 text-sm"
            >
              {t._id}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 p-6">
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
