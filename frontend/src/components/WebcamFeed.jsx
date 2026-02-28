import { useRef, useState, useCallback, useEffect } from "react";
import useFrameCapture from "../hooks/useFrameCapture";
import useDetectionLogic, { STATUS } from "../hooks/useDetectionLogic";
import { initAudio, setMuted, isMuted } from "../utils/alertSound";

/**
 * WebcamFeed — Captures live video from the laptop webcam.
 *
 * - "Start Monitoring" requests camera access and begins streaming.
 *   This click also serves as the first user interaction so the browser
 *   unlocks Web Audio API permissions (required for alert sounds later).
 * - "Stop Monitoring" stops all tracks and releases the camera.
 * - Shows a helpful error banner if camera access is denied.
 * - Displays detection status: SAFE / DETECTING / WARNING / ALERT.
 */
export default function WebcamFeed() {
  // Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // State
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [muted, setMutedState] = useState(false);

  // Detection logic — state machine + API calls
  const { status, secondsLeft, latestDetections, processFrame, dismissAlert } =
    useDetectionLogic(videoRef, isStreaming, demoMode);

  // Frame capture — grabs a 416×416 JPEG every 5 seconds while streaming
  useFrameCapture(videoRef, isStreaming, processFrame);

  // ------------------------------------------------------------------
  // Start the webcam stream
  // ------------------------------------------------------------------
  const startCamera = useCallback(async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "environment", // prefer rear camera on laptops with two
        },
        audio: false,
      });

      // Store the stream and flip state — the video element isn't in the
      // DOM yet (it renders conditionally), so we attach it in a useEffect.
      streamRef.current = stream;
      setIsStreaming(true);

      // ── Initialise Web Audio API on this user gesture ──
      // This ensures the browser allows audio playback for future alerts.
      initAudio();
    } catch (err) {
      console.error("Camera access error:", err);

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError("denied");
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        setError("not-found");
      } else {
        setError("unknown");
      }
    }
  }, []);

  // ------------------------------------------------------------------
  // Stop the webcam stream
  // ------------------------------------------------------------------
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Attach the stream to the <video> element once React renders it
  useEffect(() => {
    if (isStreaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isStreaming]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  // Status badge config
  const statusConfig = {
    [STATUS.SAFE]: {
      label: "SAFE",
      color: "bg-white/5 text-neutral-400",
      border: "border-white/10",
    },
    [STATUS.DETECTING]: {
      label: "DETECTING",
      color: "bg-white/8 text-neutral-300",
      border: "border-white/15",
    },
    [STATUS.WARNING]: {
      label: `WARNING — ${secondsLeft}s`,
      color: "bg-white/10 text-white animate-pulse",
      border: "border-white/20",
    },
    [STATUS.ALERT]: {
      label: "ALERT — Pick up the trash!",
      color: "bg-white/15 text-white animate-pulse",
      border: "border-white/30",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig[STATUS.SAFE];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* ── Status banner (only while streaming) ── */}
      {isStreaming && (
        <div
          className={`w-[640px] max-w-full text-center text-sm font-semibold py-2 px-4 rounded-lg border ${currentStatus.color} ${currentStatus.border}`}
        >
          {currentStatus.label}
          {latestDetections.length > 0 && status !== STATUS.SAFE && (
            <span className="ml-2 font-normal opacity-80">
              ({latestDetections.length} object{latestDetections.length !== 1 ? "s" : ""} detected)
            </span>
          )}
        </div>
      )}

      {/* ── Video container ── */}
      <div
        className={`relative w-[640px] max-w-full aspect-[4/3] bg-neutral-950 rounded-xl overflow-hidden shadow-lg border-2 ${
          isStreaming ? currentStatus.border : "border-white/10"
        }`}
      >
        {isStreaming ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-600 gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"
              />
            </svg>
            <p className="text-sm">Camera is off</p>
          </div>
        )}

        {isStreaming && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur">
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="flex gap-4 items-center">
        {!isStreaming ? (
          <button
            onClick={startCamera}
            className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Start Monitoring
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors cursor-pointer border border-white/10"
          >
            Stop Monitoring
          </button>
        )}

        {/* Demo mode toggle */}
        <label className="flex items-center gap-2 text-sm text-neutral-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => setDemoMode(e.target.checked)}
            className="w-4 h-4 accent-white cursor-pointer"
          />
          Demo Mode
          <span className="text-xs text-neutral-600">(5s timer)</span>
        </label>

        {/* Mute / Unmute toggle */}
        {isStreaming && (
          <button
            onClick={() => {
              const next = !muted;
              setMutedState(next);
              setMuted(next);
            }}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold rounded-lg transition-colors cursor-pointer border border-white/10"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        )}

        {/* Dismiss alert button */}
        {status === STATUS.ALERT && (
          <button
            onClick={dismissAlert}
            className="px-4 py-2.5 bg-white hover:bg-neutral-200 text-black text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Dismiss Alert
          </button>
        )}
      </div>

      {/* ── Error messages ── */}
      {error === "denied" && (
        <div className="max-w-md bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-neutral-300">
          <p className="font-semibold text-white mb-1">
            Camera access denied
          </p>
          <p className="mb-2">
            CivicGuard needs your camera to detect litter. To fix this:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-neutral-400">
            <li>
              Click the <strong>lock icon</strong> (or camera icon) in Chrome's
              address bar
            </li>
            <li>
              Set <strong>Camera</strong> to <strong>Allow</strong>
            </li>
            <li>Reload the page and click "Start Monitoring" again</li>
          </ol>
        </div>
      )}

      {error === "not-found" && (
        <div className="max-w-md bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-neutral-400">
          <p className="font-semibold text-neutral-200 mb-1">
            No camera found
          </p>
          <p>
            Make sure your laptop webcam is not disabled and no other app is
            using it, then try again.
          </p>
        </div>
      )}

      {error === "unknown" && (
        <div className="max-w-md bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-neutral-400">
          <p className="font-semibold text-neutral-200 mb-1">
            Something went wrong
          </p>
          <p>
            Could not access the camera. Check the browser console for details.
          </p>
        </div>
      )}
    </div>
  );
}
