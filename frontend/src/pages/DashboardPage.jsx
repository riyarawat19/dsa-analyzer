import { useEffect, useState } from "react";
import axios from "axios";
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import DashboardContent from "../components/dashboard/DashboardContent";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabaseClient";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("No Supabase session");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      setData(res.data);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboard();
      window.addEventListener("focus", fetchDashboard);
    }

    return () => {
      window.removeEventListener("focus", fetchDashboard);
    };
  }, [authLoading, user]);

  if (authLoading || loading) return <p className="text-white">Loading...</p>;

  if (!data) return <p className="text-red-400">Failed to load</p>;

  return (
    <div className="flex gap-8 px-6 py-10">
      <ProfileSidebar user={data.user} weakTopics={data.weakTopics} />
      <DashboardContent data={data} />
    </div>
  );
}
