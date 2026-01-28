import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconLogin,
  IconUserBolt,
  IconLogout,
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SidebarLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const links = isAuth
    ? [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <IconBrandTabler className="h-5 w-5" />,
        },
        {
          label: "Analyze",
          href: "/analyze",
          icon: <IconUserBolt className="h-5 w-5" />,
        },
        {
          label: "Logout",
          href: "#",
          icon: <IconLogout className="h-5 w-5" />,
          onClick: () => {
            logout();
            navigate("/");
          },
        },
      ]
    : [
        {
          label: "Home",
          href: "/",
          icon: <IconBrandTabler className="h-5 w-5" />,
        },
        {
          label: "Login",
          href: "/login",
          icon: <IconLogin className="h-5 w-5" />,
        },
      ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody>
          <h2 className="mb-8 text-xl font-bold">Big(O)</h2>

          <div className="flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(true)}
          className="mb-4 rounded-md bg-neutral-800 px-3 py-2 text-sm md:hidden"
        >
          ☰ Menu
        </button>

        {children}
      </main>
    </div>
  );
}
