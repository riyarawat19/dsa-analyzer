import { WavyBackground } from "@/components/ui/wavy-background";
import { Outlet } from "react-router-dom";

export default function AppShell() {
  return (
    <WavyBackground className="min-h-screen w-full">
      {/* App content goes here */}
      <div className="relative min-h-screen w-full">
        <Outlet />
      </div>
    </WavyBackground>
  );
}
