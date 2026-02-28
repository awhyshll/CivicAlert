/**
 * CivicAlert — Industrial White Dashboard
 */
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
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

  // ── Status config ──
  const statusConfig = {
    [STATUS.SAFE]: { label: "SAFE", color: "text-slate-500", dot: "bg-green-500", border: "border-[#dddddd]" },
    [STATUS.DETECTING]: { label: "DETECTING", color: "text-slate-700", dot: "bg-amber-500 animate-pulse", border: "border-slate-400" },
    [STATUS.WARNING]: { label: `WARNING — ${secondsLeft}s`, color: "text-slate-900 font-bold", dot: "bg-red-600 animate-pulse", border: "border-red-400" },
    [STATUS.ALERT]: { label: "ALERT — PICK UP THE TRASH", color: "text-red-700 font-black", dot: "bg-red-600 animate-pulse", border: "border-red-600" },
  };
  const st = statusConfig[status] || statusConfig[STATUS.SAFE];

  const apiDot = apiStatus === "calling" ? "bg-green-500 animate-pulse" : apiStatus === "error" ? "bg-red-500" : "bg-slate-300";
  const apiLabel = apiStatus === "calling" ? "CALLING API" : apiStatus === "error" ? "API ERROR" : "IDLE";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-[Space_Grotesk,monospace] flex flex-col overflow-x-hidden">
      {/* ═══ Header ═══ */}
      <header className="flex items-center justify-between border-b border-black px-6 py-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-6 bg-black flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-sm">security</span>
          </div>
          <Link to="/">
            <h1 className="text-xl font-bold tracking-tight uppercase" style={{ letterSpacing: "0.05em" }}>
              CivicAlert
            </h1>
          </Link>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-l border-slate-200 pl-3 ml-1">
            DASHBOARD
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Server status */}
          {serverUp === true && (
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
              <span className="w-2 h-2 bg-green-500 animate-pulse" />
              SERVER_ONLINE
            </span>
          )}
          {serverUp === false && (
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-red-500">
              <span className="w-2 h-2 bg-red-500" />
              SERVER_OFFLINE
              <button
                onClick={() => { setServerUp(null); checkServerHealth().then(setServerUp); }}
                className="ml-1 underline hover:text-slate-900 cursor-pointer"
              >
                RETRY
              </button>
            </span>
          )}
          {serverUp === null && (
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">CHECKING...</span>
          )}
          <Link
            to="/demo"
            className="hidden sm:flex uppercase text-[11px] font-bold border border-slate-200 px-4 py-2 hover:bg-slate-50 tracking-[0.05em]"
          >
            DEMO
          </Link>
          <Link
            to="/"
            className="hidden sm:flex uppercase text-[11px] font-bold bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 tracking-[0.05em]"
          >
            HOME
          </Link>
        </div>
      </header>

      {/* ═══ Main ═══ */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] border-x border-[#dddddd]">

        {/* ── Left column: feed + controls ── */}
        <div className="flex flex-col border-r border-[#dddddd]">

          {/* Status bar */}
          {isStreaming && (
            <div className={`flex items-center justify-between px-6 py-3 border-b ${st.border} bg-slate-50 transition-all`}>
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 ${st.dot}`} />
                <span className={`font-mono text-xs uppercase tracking-[0.15em] ${st.color}`}>
                  {st.label}
                </span>
                {status === STATUS.DETECTING && (
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider ml-1">
                    [{consecutivePosCount}/3]
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {status === STATUS.WARNING && secondsLeft !== null && (
                  <span className="font-mono text-2xl font-black text-slate-900 tabular-nums">
                    {secondsLeft}s
                  </span>
                )}
                <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">
                  <span className={`w-1.5 h-1.5 ${apiDot}`} />
                  {apiLabel}
                </span>
              </div>
            </div>
          )}

          {/* Video feed */}
          <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-[#dddddd]">
            {isStreaming ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 scanlines pointer-events-none" />

                {/* HUD overlays */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-2 py-1">
                  <span className="w-2 h-2 bg-red-600 animate-pulse" />
                  <span className="font-mono text-[10px] text-white uppercase tracking-[0.1em]">REC // LIVE</span>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 text-right">
                  <span className="font-mono text-[10px] text-white uppercase tracking-[0.1em]">
                    MODEL: YOLOv8 CUSTOM
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1">
                  <span className="font-mono text-[10px] text-white uppercase tracking-[0.1em]">
                    CONF: 0.25 // {demoMode ? "DEMO_5S" : "STANDARD_30S"}
                  </span>
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

                {/* Countdown overlay */}
                {status === STATUS.WARNING && secondsLeft !== null && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[120px] font-black text-white/15 tabular-nums select-none font-mono">
                      {secondsLeft}
                    </span>
                  </div>
                )}

                {/* Alert overlay */}
                {status === STATUS.ALERT && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-600/10 pointer-events-none border-4 border-red-600">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-red-600 text-6xl animate-pulse">warning</span>
                      <span className="font-mono text-2xl font-black text-red-600 uppercase tracking-[0.2em] animate-pulse">
                        ALERT TRIGGERED
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                <span className="material-symbols-outlined text-[64px] text-slate-300">videocam_off</span>
                <p className="font-mono text-xs uppercase tracking-[0.15em]">Camera offline — click start monitoring</p>
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-[#dddddd] bg-white flex-wrap">
            {!isStreaming ? (
              <button
                onClick={startCamera}
                className="bg-slate-900 text-white px-6 py-3 font-bold text-xs uppercase tracking-[0.15em] hover:bg-slate-800 transition-colors cursor-pointer border border-slate-900"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  START MONITORING
                </span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="bg-white text-slate-900 px-6 py-3 font-bold text-xs uppercase tracking-[0.15em] hover:bg-slate-50 transition-colors cursor-pointer border border-slate-900"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">stop</span>
                  STOP MONITORING
                </span>
              </button>
            )}

            {/* Demo mode toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none border border-[#dddddd] px-4 py-3">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="w-3.5 h-3.5 accent-slate-900 cursor-pointer"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                DEMO MODE <span className="text-slate-400">(5s TIMER)</span>
              </span>
            </label>

            {/* Alert-state controls */}
            {status === STATUS.ALERT && (
              <>
                <button
                  onClick={() => { const next = !muted; setMutedState(next); setMuted(next); }}
                  className="border border-[#dddddd] px-4 py-3 font-bold text-[10px] uppercase tracking-[0.15em] text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">{muted ? "volume_off" : "volume_up"}</span>
                  {muted ? "UNMUTE" : "MUTE"}
                </button>
                <button
                  onClick={dismissAlert}
                  className="bg-red-600 text-white px-6 py-3 font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-red-700 transition-colors cursor-pointer border border-red-600 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  DISMISS ALERT
                </button>
              </>
            )}
          </div>

          {/* Camera errors */}
          {camError === "denied" && (
            <div className="mx-6 my-4 border border-red-300 bg-red-50 p-4">
              <p className="font-bold text-xs uppercase tracking-[0.1em] text-red-700 mb-1">
                <span className="material-symbols-outlined text-[14px] align-middle mr-1">error</span>
                CAMERA ACCESS DENIED
              </p>
              <p className="font-mono text-[10px] text-red-600 uppercase leading-relaxed tracking-wider">
                Click the lock icon in Chrome → set Camera to Allow → reload the page.
              </p>
            </div>
          )}
          {camError === "not-found" && (
            <div className="mx-6 my-4 border border-amber-300 bg-amber-50 p-4">
              <p className="font-bold text-xs uppercase tracking-[0.1em] text-amber-700 mb-1">
                <span className="material-symbols-outlined text-[14px] align-middle mr-1">warning</span>
                NO CAMERA FOUND
              </p>
              <p className="font-mono text-[10px] text-amber-600 uppercase leading-relaxed tracking-wider">
                Ensure your webcam is connected and not used by another app.
              </p>
            </div>
          )}
        </div>

        {/* ── Right column: side panels ── */}
        <aside className="flex flex-col">

          {/* Session stats */}
          <div className="p-6 border-b border-[#dddddd]">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
              SESSION_STATS
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-3xl font-black text-slate-900 tabular-nums">{totalAlerts}</p>
                <p className="font-mono text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-1">TOTAL ALERTS</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 tabular-nums">{latestDetections.length}</p>
                <p className="font-mono text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-1">OBJECTS NOW</p>
              </div>
              <div>
                <p className={`text-xl font-black tabular-nums uppercase ${
                  status === STATUS.ALERT ? "text-red-600" :
                  status === STATUS.WARNING ? "text-amber-600" :
                  status === STATUS.DETECTING ? "text-slate-700" : "text-green-600"
                }`}>
                  {status}
                </p>
                <p className="font-mono text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-1">STATUS</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 tabular-nums">{demoMode ? "5s" : "30s"}</p>
                <p className="font-mono text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-1">TIMER MODE</p>
              </div>
            </div>
          </div>

          {/* Detection details */}
          {isStreaming && latestDetections.length > 0 && (
            <div className="p-6 border-b border-[#dddddd]">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                LATEST_DETECTIONS
              </h2>
              <div className="space-y-3">
                {latestDetections.map((d, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-[#dddddd] pb-2">
                    <span className="font-mono text-xs text-slate-700 uppercase tracking-wider">{d.class_name}</span>
                    <span className={`font-mono text-xs font-bold tabular-nums ${d.confidence >= 0.15 ? "text-slate-900" : "text-slate-400"}`}>
                      {(d.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isStreaming && latestDetections.length === 0 && (
            <div className="p-6 border-b border-[#dddddd]">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                LATEST_DETECTIONS
              </h2>
              <p className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">No litter detected in current frame.</p>
            </div>
          )}

          {/* Incident log */}
          <div className="p-6 flex-1">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
              INCIDENT_LOG <span className="text-slate-300">(LAST 5)</span>
            </h2>
            {incidents.length === 0 ? (
              <p className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">No incidents recorded.</p>
            ) : (
              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div key={inc.id} className="flex items-start gap-3 border-l-2 border-red-400 pl-3 py-1">
                    <span className="material-symbols-outlined text-red-500 text-[14px] mt-0.5">error</span>
                    <div>
                      <p className="font-mono text-xs text-slate-700 font-bold uppercase tracking-wider">Litter Alert</p>
                      <p className="font-mono text-[10px] text-slate-400 tracking-wider">{inc.time} · {inc.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-black px-6 py-4 flex justify-between items-center bg-white">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
          CivicAlert v1.0.0
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
          ML-BASED LITTER DETECTION // YOLOv8 + FASTAPI
        </span>
      </footer>
    </div>
  );
}

export default DashboardPage;
