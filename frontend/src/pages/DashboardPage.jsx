/**
 * CivicAlert — Monochrome Black & White Dashboard
 */
import { useEffect, useState, useRef, useCallback } from "react";
import { checkServerHealth } from "../utils/detectAPI";
import { initAudio, setMuted } from "../utils/alertSound";
import useDetectionLogic, { STATUS } from "../hooks/useDetectionLogic";
import useFrameCapture from "../hooks/useFrameCapture";

function DashboardPage() {
  // ── Server health ──
  const [serverUp, setServerUp] = useState(null);

  // ── Camera ──
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [camError, setCamError] = useState(null);

  // ── Controls ──
  const [demoMode, setDemoMode] = useState(false);
  const [muted, setMutedState] = useState(false);

  // ── Incident log ──
  const [incidents, setIncidents] = useState([]);
  const [totalAlerts, setTotalAlerts] = useState(0);

  const handleAlert = useCallback(() => {
    setTotalAlerts((c) => c + 1);
    setIncidents((prev) => {
      const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      };
      return [entry, ...prev].slice(0, 5);
    });
  }, []);

  // ── Detection logic ──
  const {
    status,
    secondsLeft,
    latestDetections,
    processFrame,
    dismissAlert,
    consecutivePosCount,
    apiStatus,
  } = useDetectionLogic(videoRef, isStreaming, demoMode, handleAlert);

  // ── Frame capture ──
  useFrameCapture(videoRef, isStreaming, processFrame);

  // ── Health check on mount ──
  useEffect(() => {
    checkServerHealth().then(setServerUp);
  }, []);

  // ── Attach stream when video renders ──
  useEffect(() => {
    if (isStreaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isStreaming]);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ── Start camera ──
  const startCamera = useCallback(async () => {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setIsStreaming(true);
      initAudio();
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") setCamError("denied");
      else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") setCamError("not-found");
      else setCamError("unknown");
    }
  }, []);

  // ── Stop camera ──
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreaming(false);
  }, []);

  // ── Status styling (monochrome) ──
  const statusStyles = {
    [STATUS.SAFE]: { bg: "bg-white/5", border: "border-white/10", text: "text-neutral-400", dot: "bg-neutral-400", glow: "" },
    [STATUS.DETECTING]: { bg: "bg-white/8", border: "border-white/15", text: "text-neutral-300", dot: "bg-neutral-300", glow: "" },
    [STATUS.WARNING]: { bg: "bg-white/10", border: "border-white/20", text: "text-white", dot: "bg-white", glow: "shadow-[0_0_30px_rgba(255,255,255,0.15)]" },
    [STATUS.ALERT]: { bg: "bg-white/15", border: "border-white/30", text: "text-white", dot: "bg-white", glow: "shadow-[0_0_40px_rgba(255,255,255,0.25)]" },
  };
  const s = statusStyles[status] || statusStyles[STATUS.SAFE];

  const apiDot = apiStatus === "calling" ? "bg-white animate-pulse" : apiStatus === "error" ? "bg-neutral-500" : "bg-neutral-700";
  const apiLabel = apiStatus === "calling" ? "Calling API…" : apiStatus === "error" ? "API Error" : "Idle";

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col">
      {/* ═══ Top bar ═══ */}
      <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">CivicAlert</h1>
              <p className="text-[10px] text-neutral-500 -mt-0.5 tracking-wider uppercase">Smart Civic Monitoring System</p>
            </div>
          </div>

          {/* Server status */}
          <div className="flex items-center gap-4">
            {serverUp === true && (
              <span className="flex items-center gap-1.5 text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Server Connected
              </span>
            )}
            {serverUp === false && (
              <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-neutral-500" />
                Server Offline
                <button
                  onClick={() => { setServerUp(null); checkServerHealth().then(setServerUp); }}
                  className="ml-1 underline hover:text-neutral-300 cursor-pointer"
                >
                  retry
                </button>
              </span>
            )}
            {serverUp === null && (
              <span className="text-xs text-neutral-600">Checking server…</span>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Main content ═══ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* ── Left column: video + controls ── */}
        <div className="flex flex-col gap-4">
          {/* Status badge bar */}
          {isStreaming && (
            <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${s.bg} ${s.border} ${s.glow} transition-all duration-500`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${s.dot} ${status === STATUS.WARNING || status === STATUS.ALERT ? "animate-pulse" : ""}`} />
                <span className={`font-semibold text-sm ${s.text}`}>
                  {status === STATUS.WARNING ? `WARNING` : status === STATUS.ALERT ? "ALERT — Pick up the trash!" : status}
                </span>
                {status === STATUS.DETECTING && (
                  <span className="text-xs text-neutral-500 ml-1">
                    Detection confidence: {consecutivePosCount}/3
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {status === STATUS.WARNING && secondsLeft !== null && (
                  <span className="font-mono text-2xl font-bold text-white tabular-nums">
                    {secondsLeft}s
                  </span>
                )}
                {/* API status indicator */}
                <span className="flex items-center gap-1.5 text-[10px] text-neutral-600">
                  <span className={`w-1.5 h-1.5 rounded-full ${apiDot}`} />
                  {apiLabel}
                </span>
              </div>
            </div>
          )}

          {/* Video feed */}
          <div className={`relative aspect-video bg-neutral-950 rounded-2xl overflow-hidden border ${isStreaming ? s.border : "border-white/5"} ${isStreaming ? s.glow : ""} transition-all duration-500`}>
            {isStreaming ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-neutral-700 gap-3">
                <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
                </svg>
                <p className="text-sm text-neutral-600">Click Start Monitoring to begin</p>
              </div>
            )}
            {/* LIVE badge */}
            {isStreaming && (
              <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                LIVE
              </span>
            )}
            {/* Countdown overlay */}
            {status === STATUS.WARNING && secondsLeft !== null && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-8xl font-black text-white/20 tabular-nums select-none">
                  {secondsLeft}
                </span>
              </div>
            )}
            {/* Alert overlay */}
            {status === STATUS.ALERT && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/10 pointer-events-none">
                <span className="text-5xl font-black text-white/40 animate-pulse select-none">
                  ⚠ ALERT
                </span>
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div className="flex items-center gap-3 flex-wrap">
            {!isStreaming ? (
              <button onClick={startCamera} className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black text-sm font-semibold rounded-lg transition-colors cursor-pointer">
                Start Monitoring
              </button>
            ) : (
              <button onClick={stopCamera} className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer border border-white/10">
                Stop Monitoring
              </button>
            )}

            {/* Demo mode toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 rounded-full peer-checked:bg-white transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-neutral-400 rounded-full shadow peer-checked:bg-black peer-checked:translate-x-4 transition-all" />
              </div>
              <span className="text-xs text-neutral-500">Demo Mode <span className="text-neutral-700">(5s)</span></span>
            </label>

            {/* Alert-state controls */}
            {status === STATUS.ALERT && (
              <>
                <button
                  onClick={() => { const next = !muted; setMutedState(next); setMuted(next); }}
                  className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-white/10"
                >
                  {muted ? "🔇 Unmute" : "🔊 Mute"}
                </button>
                <button
                  onClick={dismissAlert}
                  className="px-3 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Dismiss Alert
                </button>
              </>
            )}
          </div>

          {/* Camera error */}
          {camError === "denied" && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-neutral-300">
              <p className="font-semibold text-white mb-1">Camera access denied</p>
              <p>Click the lock icon in Chrome → set Camera to Allow → reload the page.</p>
            </div>
          )}
          {camError === "not-found" && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-neutral-400">
              <p className="font-semibold text-neutral-200 mb-1">No camera found</p>
              <p>Ensure your webcam is connected and not used by another app.</p>
            </div>
          )}
        </div>

        {/* ── Right column: side panels ── */}
        <aside className="flex flex-col gap-4">
          {/* Session stats */}
          <div className="bg-neutral-950 rounded-2xl border border-white/10 p-5">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Session Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-white tabular-nums">{totalAlerts}</p>
                <p className="text-[10px] text-neutral-600 uppercase tracking-wider mt-0.5">Total Alerts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tabular-nums">{latestDetections.length}</p>
                <p className="text-[10px] text-neutral-600 uppercase tracking-wider mt-0.5">Objects Now</p>
              </div>
              <div>
                <p className={`text-2xl font-bold tabular-nums ${s.text}`}>{status}</p>
                <p className="text-[10px] text-neutral-600 uppercase tracking-wider mt-0.5">Status</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tabular-nums">{demoMode ? "5s" : "30s"}</p>
                <p className="text-[10px] text-neutral-600 uppercase tracking-wider mt-0.5">Timer Mode</p>
              </div>
            </div>
          </div>

          {/* Detection details */}
          {isStreaming && latestDetections.length > 0 && (
            <div className="bg-neutral-950 rounded-2xl border border-white/10 p-5">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Latest Detections</h2>
              <div className="space-y-2">
                {latestDetections.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">{d.class_name}</span>
                    <span className={`font-mono font-semibold ${d.confidence >= 0.5 ? "text-white" : "text-neutral-600"}`}>
                      {(d.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incident log */}
          <div className="bg-neutral-950 rounded-2xl border border-white/10 p-5 flex-1">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Incident Log <span className="text-neutral-700">(last 5)</span>
            </h2>
            {incidents.length === 0 ? (
              <p className="text-xs text-neutral-700 italic">No incidents yet.</p>
            ) : (
              <div className="space-y-2">
                {incidents.map((inc) => (
                  <div key={inc.id} className="flex items-center gap-3 text-xs border-l-2 border-white/20 pl-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-white/50 shrink-0" />
                    <div>
                      <p className="text-neutral-300 font-medium">Litter Alert Triggered</p>
                      <p className="text-neutral-600">{inc.time} · {inc.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-white/10 py-3 text-center">
        <p className="text-[10px] text-neutral-700">
          CivicAlert v1.0 — Built for cleaner public spaces
        </p>
      </footer>
    </div>
  );
}

export default DashboardPage;
