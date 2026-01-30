import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error("PROFILE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-white">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-red-400">Failed to load profile</p>;
  }

  return (
    <div className="flex justify-center items-start text-white pt-20">
      <div className="w-full max-w-xl rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-8">

        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={user.avatar}
            alt="avatar"
            className="h-28 w-28 rounded-full border border-white/20"
          />

          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-white/60">{user.email}</p>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Info */}
        <div className="space-y-4 text-sm">
          <ProfileRow label="User ID" value={user._id} />
          <ProfileRow
            label="Joined On"
            value={new Date(user.createdAt).toLocaleDateString()}
          />
          <ProfileRow label="Auth Provider" value="Google" />
        </div>

      </div>
    </div>
  );
}

/* ===== SMALL COMPONENT ===== */

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between text-white/80">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
