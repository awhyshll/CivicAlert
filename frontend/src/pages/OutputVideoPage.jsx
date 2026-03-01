import { Link } from "react-router-dom";

export default function OutputVideoPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#ffffff] font-sans text-[#0a0a0a] antialiased">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dddddd] bg-[#ffffff]/95 backdrop-blur-sm px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-4 text-[#0a0a0a]">
          <Link to="/" className="size-6 text-[#0a0a0a] flex items-center justify-center hover:text-[#0056b3] transition-colors">
            <span className="material-symbols-outlined text-[24px]">center_focus_strong</span>
          </Link>
          <Link to="/" className="text-[#0a0a0a] text-lg font-mono font-bold leading-tight tracking-widest hover:opacity-80 transition-opacity">
            CIVIC ALERT
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center justify-center h-8 px-4 bg-transparent text-[#0a0a0a] text-[11px] font-mono font-bold uppercase tracking-widest border border-[#0a0a0a]/20 hover:bg-[#0a0a0a] hover:text-white transition-all"
          >
            BACK
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-20 md:py-16 max-w-[1200px] mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]">
            <span className="inline-block w-2 h-2 bg-green-600" />
            OUTPUT VIDEO
          </div>
          <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-tighter uppercase">
            Detection Output
          </h1>
          <p className="text-[#777777] font-mono text-sm max-w-md">
            YOLOv8 inference output — litter detection on processed video feed.
          </p>
        </div>

        {/* Video player */}
        <div className="w-full max-w-[960px] bg-black border border-[#dddddd] relative">
          {/* HUD overlay top */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4 pointer-events-none font-mono text-[9px] text-white/70 tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500" />
              OUTPUT_FEED
            </div>
            <div>MODEL: YOLOv8 CUSTOM</div>
          </div>

          <video
            className="w-full aspect-video"
            controls
            autoPlay
            playsInline
          >
            <source src="http://localhost:8000/video" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Info bar below video */}
        <div className="w-full max-w-[960px] mt-4 flex flex-wrap gap-6 justify-between font-mono text-[10px] text-[#777777] tracking-widest uppercase border-t border-[#dddddd] pt-4">
          <span>FORMAT: MP4</span>
          <span>SOURCE: PROCESSED CCTV FEED</span>
          <span>MODEL: YOLOv8</span>
          <span>CLASSES: LITTER / TRASH</span>
        </div>
      </main>
    </div>
  );
}
