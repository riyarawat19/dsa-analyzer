export default function ProfileSidebar({ user, weakTopics = [] }) {
  return (
    <aside className="sticky top-24 h-fit w-full max-w-xs
      rounded-2xl bg-black/40 backdrop-blur-xl
      border border-white/10 p-6 text-white space-y-6">

      {/* ===== PROFILE INFO ===== */}
      <div className="flex flex-col items-center gap-4 text-center">
        <img
          src={user.avatar}
          alt="avatar"
          className="h-24 w-24 rounded-full border border-white/20"
        />

        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-white/60">{user.email}</p>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* ===== META INFO ===== */}
      <div className="space-y-2 text-sm">
        <ProfileRow
          label="Joined"
          value={new Date(user.createdAt).toLocaleDateString()}
        />
        <ProfileRow label="Provider" value="Google" />
      </div>

      <div className="h-px bg-white/10" />

      {/* ===== WEAK TOPICS ===== */}
      <div>
        <h3 className="text-sm font-semibold text-white/80 mb-3">
          Topics to Improve
        </h3>

        {weakTopics.length === 0 ? (
          <p className="text-xs text-white/50">
            No weak topics yet 🎯
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((t, idx) => (
              <span
                key={idx}
                className="
                  rounded-full px-3 py-1 text-xs
                  bg-red-500/10 text-red-300
                  border border-red-500/20
                "
              >
                {t._id}
              </span>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

/* ===== LOCAL COMPONENT ===== */
function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between text-white/70">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
