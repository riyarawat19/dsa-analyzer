import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";

export default function DashboardContent({ data }) {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 364); // 12 weeks

  function getClass(value) {
    if (!value || value.count === 0) return "color-empty";
    if (value.count < 2) return "color-github-1";
    if (value.count < 4) return "color-github-2";
    if (value.count < 6) return "color-github-3";
    return "color-github-4";
  }

  function getTooltip(value) {
    return {
      "data-tip": value ? `${value.date}: ${value.count} runs` : "No activity",
    };
  }

  return (
    <div className="flex-1 space-y-10 text-white">
      <h1 className="text-3xl font-bold">
        Welcome back, {data.user?.name.split(" ")[0]}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Analyses" value={data.totalAnalyses} />
        <StatCard label="Error Types" value={data.errorBreakdown.length} />
        <StatCard label="Weak Topics" value={data.weakTopics.length} />
        <StatCard label="Recent Runs" value={data.recentAnalyses.length} />
      </div>

      <Section title="Activity Overview">
        <div className="heatmap-wrapper">
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={data.heatmap}
            showMonthLabels
            showWeekdayLabels={false}
            classForValue={getClass}
            tooltipDataAttrs={(value) => ({
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": value
                ? `${value.date} • ${value.count} submission${
                    value.count !== 1 ? "s" : ""
                  }`
                : "No submissions",
            })}
          />

          <Tooltip
            id="heatmap-tooltip"
            place="top"
            className="!bg-black !text-white !text-xs !px-2 !py-1 !rounded-md"
          />
        </div>
      </Section>

      {/* Recent Analyses */}
      <Section title="Recent Analyses">
        {data.recentAnalyses.length === 0 ? (
          <p className="text-white/60">No analyses yet.</p>
        ) : (
          data.recentAnalyses.map((item, idx) => (
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
          ))
        )}
      </Section>

      {/* Weak Topics */}
    </div>
  );
}

/* ===== LOCAL COMPONENTS ===== */

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
