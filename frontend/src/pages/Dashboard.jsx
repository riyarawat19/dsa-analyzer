import { WavyBackground } from "@/components/ui/wavy-background";


export default function Dashboard() {
  return (
    <div className="h-screen bg-gray-900 text-red-500 flex items-center justify-center">
      <WavyBackground />
      <h1 className="text-3xl font-bold text-red-500 z-10">
        <p>Welcome to Big 🚀</p>
      </h1>
    </div>
  );
}
