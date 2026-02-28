import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#ffffff] font-sans text-[#0a0a0a] antialiased overflow-x-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 grid-bg" />

      <div className="relative z-10 flex h-full grow flex-col">
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
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <div className="flex items-center gap-8 font-mono text-[11px] tracking-[0.2em] text-[#777777] uppercase">
              <a className="hover:text-[#0a0a0a] transition-colors" href="#system">System</a>
              <a className="hover:text-[#0a0a0a] transition-colors" href="#deploy">Features</a>
              <a className="hover:text-[#0a0a0a] transition-colors" href="#specs">Specs</a>
            </div>
            <div className="h-4 w-px bg-[#dddddd]" />
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="flex cursor-pointer items-center justify-center overflow-hidden border border-[#0a0a0a]/20 hover:bg-[#0a0a0a] hover:text-white transition-all h-8 px-4 bg-transparent text-[#0a0a0a] text-[11px] font-mono font-bold uppercase tracking-widest"
              >
                LOGIN
              </Link>
            </div>
          </div>
          <div className="md:hidden text-[#0a0a0a] cursor-pointer">
            <span className="material-symbols-outlined">menu</span>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col flex-1">
          {/* Hero section */}
          <div className="border-b border-[#dddddd]" id="system">
            <div className="flex flex-col gap-10 px-6 py-12 md:px-20 md:py-20 max-w-[1400px] mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left text */}
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-2 text-[#0a0a0a] font-mono text-[10px] tracking-[0.3em] uppercase">
                    <span className="inline-block w-2 h-2 bg-red-600 animate-pulse" />
                    DETECTION ACTIVE
                    <span className="opacity-20 mx-2">|</span>
                    YOLOv8_MODEL
                  </div>
                  <div className="flex flex-col gap-4 text-left">
                    <h1 className="text-[#0a0a0a] text-6xl md:text-8xl font-mono font-bold leading-[0.85] tracking-tighter uppercase">
                      CIVIC<br />ALERT
                    </h1>
                    <h2 className="text-[#777777] text-base md:text-lg font-mono border-l border-[#0a0a0a] pl-6 py-2 max-w-md leading-relaxed">
                      ML-powered litter detection for public spaces. Real-time alerts to keep urban environments clean.
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Link
                      to="/access"
                      className="flex items-center justify-center h-12 px-10 bg-[#0a0a0a] text-white hover:bg-gray-800 transition-colors text-[11px] font-mono font-bold uppercase tracking-[0.2em] border border-[#0a0a0a] w-full sm:w-auto"
                    >
                      REQUEST ACCESS
                    </Link>
                    <Link
                      to="/demo"
                      className="flex items-center justify-center h-12 px-10 bg-transparent text-[#0a0a0a] hover:bg-gray-100 transition-colors text-[11px] font-mono font-bold uppercase tracking-[0.2em] border border-[#0a0a0a] w-full sm:w-auto group"
                    >
                      LIVE DEMO
                      <span className="material-symbols-outlined text-[16px] ml-2 group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Right camera feed */}
                <div className="relative w-full aspect-[4/3] bg-black border border-[#dddddd] overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-70 transition-transform duration-[2s] group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDeKLYwG24jdK45T1ifhup8-cVw7yjmWC-ADy1MJjXpwvacTMPZrqk4Pu8eaSF_F8HAqcqlGps3EH9jyv-WlRWNRYQoXylMlryF4ZZUlqEYAfMbrb9dFGgOoO0ru70jQSb3D0DGAo7cwr-wckA4mvI-_fQQ0KVTZm07mXvvFOqR23cTE6T6gc3Efr5Kx4_5j3fNLnBTI2ZDE8gUXYYza_AlrYzkMjFYYBw3Pjb4qzTxQAatLKg0e1IYV8hgSqwJzmahYpQ1yrn_e-M')",
                    }}
                  />
                  <div className="absolute inset-0 scanlines opacity-30" />
                  <div className="absolute inset-0 vignette" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start font-mono text-[10px] text-white tracking-widest uppercase">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-600" />
                          <span>CAM_01 [ACTIVE]</span>
                        </div>
                        <div className="opacity-60 text-[9px]">MODEL: YOLOv8 CUSTOM</div>
                        <div className="opacity-60 text-[9px]">CONF_THRESHOLD: 0.25</div>
                      </div>
                      <div className="text-right">
                        <div>ZONE: PUBLIC AREA</div>
                        <div className="opacity-60 mt-1">MODE: REAL-TIME</div>
                        <div className="opacity-60">CLASSES: LITTER/TRASH</div>
                      </div>
                    </div>
                    {/* Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-full h-px bg-white" />
                      <div className="h-full w-px bg-white absolute" />
                      <div className="w-32 h-32 border border-white" />
                    </div>
                    <div className="flex justify-between items-end font-mono text-[10px] text-white tracking-widest uppercase">
                      <div className="bg-black/40 backdrop-blur-sm p-2 border border-white/20">
                        DETECTION: ON<br />
                        ACCURACY: 92%
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-8 flex flex-col justify-between opacity-60">
                          <div className="w-12 h-px bg-white" />
                          <div className="w-8 h-px bg-white" />
                          <div className="w-12 h-px bg-white" />
                        </div>
                        <div className="text-right">
                          28-FEB-2026<br />
                          14:42:12 UTC
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee ticker */}
          <div className="w-full border-b border-[#dddddd] bg-[#f5f5f5] py-2 overflow-hidden">
            <div className="flex gap-16 font-mono text-[10px] text-[#0a0a0a] uppercase tracking-[0.2em] whitespace-nowrap animate-marquee px-6">
              <span className="flex items-center gap-2"><span className="w-1 h-1 bg-green-600" /> DETECTION ENGINE: ACTIVE</span>
              <span className="flex items-center gap-2">MODEL: YOLOv8</span>
              <span className="flex items-center gap-2">INFERENCE: &lt;150MS</span>
              <span className="flex items-center gap-2">CLEANLINESS INDEX: HIGH</span>
              <span className="flex items-center gap-2"><span className="w-1 h-1 bg-green-600" /> ALERTS: REAL-TIME</span>
              <span className="flex items-center gap-2">ACCURACY: 92%+</span>
              <span className="flex items-center gap-2">STATUS: MONITORING</span>
              <span className="flex items-center gap-2"><span className="w-1 h-1 bg-green-600" /> DETECTION ENGINE: ACTIVE</span>
              <span className="flex items-center gap-2">MODEL: YOLOv8</span>
              <span className="flex items-center gap-2">INFERENCE: &lt;150MS</span>
              <span className="flex items-center gap-2">CLEANLINESS INDEX: HIGH</span>
              <span className="flex items-center gap-2"><span className="w-1 h-1 bg-green-600" /> ALERTS: REAL-TIME</span>
              <span className="flex items-center gap-2">ACCURACY: 92%+</span>
              <span className="flex items-center gap-2">STATUS: MONITORING</span>
            </div>
          </div>

          {/* Deploy modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#dddddd] divide-y md:divide-y-0 md:divide-x divide-[#dddddd] bg-[#ffffff]" id="deploy">
            <div className="flex-1 p-10 group hover:bg-[#f5f5f5] transition-colors">
              <div className="flex items-start justify-between mb-8">
                <span className="material-symbols-outlined text-[#0a0a0a] text-[28px] group-hover:text-[#0056b3] transition-colors">delete</span>
                <span className="font-mono text-[9px] text-[#777777] border border-[#dddddd] px-2 py-0.5">MOD_01</span>
              </div>
              <h3 className="text-[#0a0a0a] text-base font-mono font-bold mb-4 uppercase tracking-widest">Litter Detection</h3>
              <p className="text-[#777777] text-xs leading-relaxed max-w-xs font-mono">
                Real-time identification of litter, trash, and waste in public spaces using YOLOv8 computer vision models.
              </p>
            </div>
            <div className="flex-1 p-10 group hover:bg-[#f5f5f5] transition-colors">
              <div className="flex items-start justify-between mb-8">
                <span className="material-symbols-outlined text-[#0a0a0a] text-[28px] group-hover:text-[#0056b3] transition-colors">notifications_active</span>
                <span className="font-mono text-[9px] text-[#777777] border border-[#dddddd] px-2 py-0.5">MOD_02</span>
              </div>
              <h3 className="text-[#0a0a0a] text-base font-mono font-bold mb-4 uppercase tracking-widest">Instant Alert System</h3>
              <p className="text-[#777777] text-xs leading-relaxed max-w-xs font-mono">
                Automated audio and visual alerts with configurable countdown timers when litter is detected in monitored zones.
              </p>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#dddddd]" id="specs">
            <div className="p-10 md:p-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#dddddd] bg-[#ffffff]">
              <div className="flex flex-col gap-8">
                <div>
                  <h4 className="text-[#0a0a0a] font-mono text-[10px] tracking-[0.3em] uppercase mb-4">TECHNICAL SPECS</h4>
                  <h2 className="text-[#0a0a0a] text-4xl md:text-5xl font-mono font-bold leading-tight uppercase mb-6">
                    BUILT FOR<br />CLEANER CITIES
                  </h2>
                  <p className="text-[#777777] text-sm max-w-md font-mono leading-relaxed">
                    CivicAlert uses a custom-trained YOLOv8 model served via FastAPI, processing live webcam feeds in the browser to detect litter and trigger instant cleanup alerts.
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-4 max-w-md">
                  <div className="flex items-center justify-between border-b border-[#dddddd] py-4">
                    <span className="text-[#0a0a0a] font-mono text-[11px] uppercase tracking-widest">INFERENCE</span>
                    <span className="text-[#0a0a0a] font-mono text-[11px] font-bold">&lt; 150MS</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#dddddd] py-4">
                    <span className="text-[#0a0a0a] font-mono text-[11px] uppercase tracking-widest">CONFIDENCE</span>
                    <span className="text-[#0a0a0a] font-mono text-[11px] font-bold">0.25 THRESHOLD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#dddddd] py-4">
                    <span className="text-[#0a0a0a] font-mono text-[11px] uppercase tracking-widest">ALERT TIMER</span>
                    <span className="text-[#0a0a0a] font-mono text-[11px] font-bold">30S / 5S DEMO</span>
                  </div>
                </div>
                <button className="w-fit mt-4 flex items-center justify-center h-10 px-8 bg-[#f5f5f5] hover:bg-[#dddddd] text-[#0a0a0a] text-[11px] font-mono font-bold uppercase tracking-widest border border-[#dddddd] transition-colors">
                  VIEW DOCUMENTATION
                </button>
              </div>
            </div>
            <div className="relative bg-[#f5f5f5] min-h-[500px] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center grayscale opacity-60"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPf1Ile5-Mm1JZ-KlFUANoT6185v2ccXUvIo3_hKqGVuI5k-Z6D3W3hRVnJDGCRW0dlN1vE3CDrSk2lDmpk5zgdpZnkzVKhyC3ccGrW7UWwXM_5MPQae8zdsAJSnZ683D0kU2fZJAr1iCUhJQ0aO8hwXOXEOjZtC3ovIECYMA4iU2pfKT1fYem363FnltF0jVzp2flw_iDpxmdTzxl48usEJYOeXpc8BDkxNyU-QLufJCX_sTZWj22n_AC2xYVzzjqoaOk4vs_hqA')",
                }}
              />
              <div className="absolute inset-0 scanlines opacity-10" />
              <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                <div className="bg-white/95 border border-[#dddddd] p-6 max-w-sm ml-auto shadow-sm backdrop-blur-md">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono text-red-600 font-bold tracking-widest">LITTER ALERT ACTIVE</span>
                    <span className="text-[10px] font-mono text-[#777777]">MONITORING</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 flex items-center justify-center border border-[#dddddd]">
                      <span className="material-symbols-outlined text-[#0a0a0a] text-2xl">eco</span>
                    </div>
                    <div>
                      <div className="text-[#0a0a0a] text-xs font-mono font-bold uppercase tracking-widest mb-1">SMART DETECTION</div>
                      <div className="text-[#777777] text-[10px] font-mono leading-relaxed">
                        YOLOv8 model running on FastAPI backend. Webcam feed processed in real-time.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request Access CTA */}
          <div className="relative py-24 px-6 overflow-hidden bg-[#ffffff]" id="request-access">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f5f5f5] to-white" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#dddddd]" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#dddddd]" />
            </div>
            <div className="relative z-10 max-w-[800px] mx-auto text-center flex flex-col gap-8 bg-white border border-[#dddddd] p-12 md:p-20">
              <div className="flex flex-col gap-4">
                <div className="mx-auto mb-4 w-14 h-14 border border-[#0a0a0a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#0a0a0a] text-3xl">shield</span>
                </div>
                <h2 className="text-[#0a0a0a] text-4xl md:text-5xl font-mono font-bold leading-tight uppercase tracking-tight">
                  GET STARTED
                </h2>
                <p className="text-[#777777] text-sm font-mono max-w-lg mx-auto">
                  Deploy CivicAlert in your municipality. Request access to the litter detection dashboard and start keeping your public spaces clean.
                </p>
              </div>
              <form
                className="flex flex-col md:flex-row gap-0 w-full max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="flex-1 bg-[#f5f5f5] text-[#0a0a0a] border border-[#dddddd] md:border-r-0 focus:ring-1 focus:ring-[#0a0a0a] focus:border-[#0a0a0a] h-12 px-5 placeholder:text-gray-400 font-mono text-xs outline-none uppercase tracking-widest"
                  placeholder="EMAIL@AGENCY.GOV"
                  required
                  type="email"
                />
                <button
                  className="bg-[#0a0a0a] text-white h-12 px-8 font-mono font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors border border-[#0a0a0a] whitespace-nowrap"
                  type="submit"
                >
                  REQUEST
                </button>
              </form>
              <div className="text-[9px] text-[#777777] font-mono uppercase tracking-[0.3em] mt-2">
                PROCESSING REQUEST • VERIFICATION PENDING
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#dddddd] bg-[#f5f5f5] px-8 py-16">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0a0a0a] text-xl">center_focus_strong</span>
                <span className="text-[#0a0a0a] font-mono text-sm font-bold tracking-[0.2em]">CIVIC ALERT SYSTEMS</span>
              </div>
              <div className="text-[10px] font-mono text-[#777777] uppercase tracking-widest">
                ML-Based Litter Detection v1.0.0
              </div>
            </div>
            <div className="flex flex-wrap gap-10 text-[10px] font-mono text-[#777777] uppercase tracking-widest">
              <a className="hover:text-[#0a0a0a] transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-[#0a0a0a] transition-colors" href="#">Terms of Use</a>
              <a className="hover:text-[#0a0a0a] transition-colors" href="#">Documentation</a>
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              © 2026 CIVIC ALERT INC. ALL RIGHTS RESERVED.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
