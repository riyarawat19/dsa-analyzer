import { WavyBackground } from "@/components/ui/wavy-background";

export default function AppShell({ children }) {
  return (
    <WavyBackground className="min-h-screen w-full">
      {/* DO NOT center */}
      <div className="relative h-screen w-full">
        {children}
      </div>
    </WavyBackground>
  );
}
