import { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconUserBolt,
  IconLogout,
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import { getUserFromToken } from "@/utils/getUserFromToken";

export default function SidebarLayout() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const user = getUserFromToken();
  const navigate = useNavigate();

  const links = [
    {
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Analyze",
      onClick: () => navigate("/analyze"),
      icon: <IconUserBolt className="h-5 w-5" />,
    },
    {
      label: "Logout",
      onClick: () => {
        logout();
        navigate("#");
      },
      icon: <IconLogout className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen w-full">
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col h-full">
          <div className="flex flex-col gap-2">
            {links.map((l, i) => (
              <SidebarLink key={i} link={l} />
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-white/10">
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 p-2 cursor-pointer"
            >
              <img
                src={user?.picture}
                className="h-8 w-8 rounded-full"
              />
              {open && <span>{user?.name}</span>}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* 🔥 ONLY ROUTED CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
