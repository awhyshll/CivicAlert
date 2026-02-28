import { Link, useNavigate } from "react-router-dom";

export default function DemoPage() {
  const navigate = useNavigate();

  const handleLaunch = () => {
    navigate("/dashboard");
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col items-center justify-center p-4 font-[Space_Grotesk,monospace]">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 w-full border-b border-slate-200 bg-white z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-900 text-2xl">security</span>
          <Link to="/">
            <h1 className="text-xl font-bold tracking-tight uppercase" style={{ letterSpacing: "0.05em" }}>
              CivicAlert
            </h1>
          </Link>
        </div>
        <div className="flex gap-4">
          <button className="uppercase text-[11px] font-bold border border-slate-200 px-4 py-2 hover:bg-slate-50 tracking-[0.05em]">
            SYSTEM_DOCS
          </button>
          <Link
            to="/login"
            className="uppercase text-[11px] font-bold bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 tracking-[0.05em]"
          >
            SECURE_LOGIN
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full max-w-[800px] border border-slate-900 bg-white mt-20">
        {/* Title bar */}
        <div className="border-b border-slate-900 p-4 flex justify-between items-center bg-white">
          <div>
            <h2 className="uppercase text-sm font-bold tracking-[0.05em]">CivicAlert Litter Detection Demo</h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.05em]">STATUS: FEED_ACTIVE // YOLOv8</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600" />
            <span className="uppercase text-[10px] font-bold tracking-[0.05em]">REC</span>
          </div>
        </div>

        {/* Camera feed preview */}
        <div className="relative aspect-video bg-slate-200 overflow-hidden border-b border-slate-900">
          <img
            alt="Public space litter detection feed"
            className="w-full h-full object-cover grayscale contrast-125"
            src="https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2025/08/kolkatametro-1755849763.webp"
          />
          <div className="absolute inset-0 scanlines pointer-events-none" />
          <div className="absolute top-6 left-6 uppercase text-white text-xs drop-shadow-md bg-black/40 px-2 py-1 font-mono tracking-[0.05em]">
            PUBLIC AREA — LITTER SCAN
          </div>
          <div className="absolute top-6 right-6 uppercase text-white text-right text-xs drop-shadow-md bg-black/40 px-2 py-1 font-mono tracking-[0.05em]">
            2026-02-28 14:32:05
            <br />
            FPS: 60.00
          </div>
          <div className="absolute bottom-6 left-6 uppercase text-white text-[10px] drop-shadow-md space-y-1 font-mono tracking-[0.05em]">
            <div className="bg-black/40 px-2 py-1">MODEL: YOLOv8 CUSTOM</div>
            <div className="bg-black/40 px-2 py-1">CONF: 0.25</div>
          </div>
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 border border-white/30 relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white" />
            </div>
          </div>
        </div>

        {/* Launch button area */}
        <div className="p-8 flex flex-col items-center justify-center bg-white">
          <p className="uppercase text-[10px] text-slate-500 mb-6 text-center max-w-md font-mono tracking-[0.05em]">
            Clicking the button below will open the live detection dashboard. Your webcam will be used to scan for litter and trash in real-time using our YOLOv8 model.
          </p>
          <button
            onClick={handleLaunch}
            className="w-full max-w-sm bg-slate-900 text-white py-5 font-bold uppercase hover:bg-slate-800 transition-colors border border-slate-900 tracking-[0.05em]"
          >
            Launch Litter Detection Demo
          </button>
        </div>
      </main>

      {/* Background dots */}
      <div className="fixed inset-0 -z-10 opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="uppercase text-[10px] text-slate-400 font-mono tracking-[0.05em]">
          CIVICALERT — ML-BASED LITTER DETECTION // YOLOv8 + FASTAPI // © 2026
        </p>
      </footer>
    </div>
  );
}
