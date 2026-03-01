import { useRef, useEffect, useCallback } from "react";

/**
 * useFrameCapture — Custom hook that periodically captures a frame from a
 * <video> element, resizes it to 416×416 on an off-screen <canvas>, and
 * converts it to a base64 JPEG string.
 *
 * @param {React.RefObject<HTMLVideoElement>} videoRef - Ref to the live video element
 * @param {boolean} isActive - Whether capturing should be running
 * @param {function} onFrame - Callback receiving the base64 string each capture
 * @param {number} [intervalMs=5000] - Milliseconds between captures
 */
export default function useFrameCapture(
  videoRef,
  isActive,
  onFrame,
  intervalMs = 5000
) {
  // Hidden canvas used for resizing — never rendered to the DOM
  const canvasRef = useRef(null);

  // Lazily create the off-screen canvas once
  const getCanvas = useCallback(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
      canvasRef.current.width = 640;
      canvasRef.current.height = 640;
    }
    return canvasRef.current;
  }, []);

  // ------------------------------------------------------------------
  // Capture a single frame: draw video → 416×416 canvas → base64 JPEG
  // ------------------------------------------------------------------
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return; // not ready yet

    const canvas = getCanvas();
    const ctx = canvas.getContext("2d");

    // Draw the full video frame scaled down to 640×640 (matches model training size)
    ctx.drawImage(video, 0, 0, 640, 640);

    // Convert to base64 JPEG (quality 0.9 for better detail)
    const base64 = canvas.toDataURL("image/jpeg", 0.9);

    // Log the payload size so we can confirm capture is working
    console.log(`[useFrameCapture] captured frame — base64 length: ${base64.length}`);

    // Pass it to the consumer
    if (onFrame) {
      onFrame(base64);
    }
  }, [videoRef, getCanvas, onFrame]);

  // ------------------------------------------------------------------
  // Start / stop the interval based on isActive
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isActive) return;

    // Capture one frame immediately, then every intervalMs
    captureFrame();
    const id = setInterval(captureFrame, intervalMs);

    return () => clearInterval(id);
  }, [isActive, captureFrame, intervalMs]);
}
