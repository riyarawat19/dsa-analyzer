import { useEffect, useState } from "react";
import axios from "axios";
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import DashboardContent from "../components/dashboard/DashboardContent";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    window.addEventListener("focus", fetchDashboard);
    return () => window.removeEventListener("focus", fetchDashboard);
  }, []);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!data) return <p className="text-red-400">Failed to load</p>;

  return (
    <div className="flex gap-8 px-6 py-10">
      <ProfileSidebar
       user={data.user}
       weakTopics={data.weakTopics}
        />
      <DashboardContent data={data} />
    </div>
  );
}
