export default function StreakChart({ activity = [] }) {
  return (
    <div className="flex gap-2 items-end h-20">
      {activity.map((day, idx) => (
        <div
          key={idx}
          title={`${day.date}: ${day.count} runs`}
          className={`w-3 rounded-sm transition-all ${
            day.count === 0
              ? "bg-white/10 h-3"
              : "bg-green-400/80"
          }`}
          style={{
            height: `${Math.min(day.count * 12 + 6, 80)}px`,
          }}
        />
      ))}
    </div>
  );
}
