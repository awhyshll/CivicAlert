import { useRef, useState, useCallback, useEffect } from "react";
import { callDetectAPI } from "../utils/detectAPI";
import { startAlert, stopAlert } from "../utils/alertSound";

/**
 * Detection states shown in the UI.
 *
 *   SAFE       → no trash detected (green)
 *   DETECTING  → building consecutive positive count, timer not started (yellow)
 *   WARNING    → timer actively counting down (orange)
 *   ALERT      → timer hit zero (red)
 */
export const STATUS = {
  SAFE: "SAFE",
  DETECTING: "DETECTING",
  WARNING: "WARNING",
  ALERT: "ALERT",
};

// How many consecutive frames of the same result before we act
const CONSECUTIVE_THRESHOLD = 3;
// Minimum confidence to count a detection as "positive"
const CONFIDENCE_THRESHOLD = 0.5;

/**
 * useDetectionLogic — State-machine hook for the litter detection flow.
 *
 * @param {React.RefObject<HTMLVideoElement>} videoRef - live video element
 * @param {boolean} isActive - true when monitoring is on
 * @param {boolean} demoMode - when true, timer is 5 s instead of 30 s
 * @returns {{ status, secondsLeft, latestDetections, demoMode }}
 */
export default function useDetectionLogic(videoRef, isActive, demoMode = false, onAlert = null) {
  // ── public state ──
  const [status, setStatus] = useState(STATUS.SAFE);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [latestDetections, setLatestDetections] = useState([]);
  const [consecutivePosCount, setConsecutivePosCount] = useState(0);
  const [apiStatus, setApiStatus] = useState("idle"); // "idle" | "calling" | "error"

  // ── internal counters (refs so they survive re-renders) ──
  const consecutivePos = useRef(0);
  const consecutiveNeg = useRef(0);
  const timerStarted = useRef(false);
  const countdownRef = useRef(null); // setInterval id
  const secondsLeftRef = useRef(null); // mirrors state for interval closure
  const processingRef = useRef(false); // guard against overlapping API calls

  const TIMER_DURATION = demoMode ? 5 : 30;

  // ------------------------------------------------------------------
  // Reset everything (called on stop or unmount)
  // ------------------------------------------------------------------
  const resetAll = useCallback(() => {
    consecutivePos.current = 0;
    consecutiveNeg.current = 0;
    timerStarted.current = false;
    processingRef.current = false;
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    secondsLeftRef.current = null;
    setSecondsLeft(null);
    setStatus(STATUS.SAFE);
    setLatestDetections([]);
    setConsecutivePosCount(0);
    setApiStatus("idle");
    stopAlert();
  }, []);

  // ------------------------------------------------------------------
  // Dismiss the alert manually (user clicks "Dismiss")
  // ------------------------------------------------------------------
  const dismissAlert = useCallback(() => {
    stopAlert();
    consecutivePos.current = 0;
    consecutiveNeg.current = 0;
    timerStarted.current = false;
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    secondsLeftRef.current = null;
    setSecondsLeft(null);
    setStatus(STATUS.SAFE);
    setConsecutivePosCount(0);
    setApiStatus("idle");
  }, []);

  // ------------------------------------------------------------------
  // Start the countdown timer
  // ------------------------------------------------------------------
  const startCountdown = useCallback(() => {
    // Avoid double-starting
    if (countdownRef.current) return;

    timerStarted.current = true;
    secondsLeftRef.current = TIMER_DURATION;
    setSecondsLeft(TIMER_DURATION);
    setStatus(STATUS.WARNING);

    countdownRef.current = setInterval(() => {
      secondsLeftRef.current -= 1;
      setSecondsLeft(secondsLeftRef.current);

      if (secondsLeftRef.current <= 0) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        setStatus(STATUS.ALERT);
        startAlert();
        if (onAlert) onAlert();
        console.log("ALERT TRIGGERED");
      }
    }, 1000);
  }, [TIMER_DURATION]);

  // ------------------------------------------------------------------
  // Stop the countdown timer (trash was picked up)
  // ------------------------------------------------------------------
  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    timerStarted.current = false;
    secondsLeftRef.current = null;
    setSecondsLeft(null);
    setStatus(STATUS.SAFE);
  }, []);

  // ------------------------------------------------------------------
  // Process a single frame: call API → update state machine
  // ------------------------------------------------------------------
  const processFrame = useCallback(
    async (base64) => {
      // Skip if a previous frame is still being processed (prevents overlap)
      if (processingRef.current) return;
      processingRef.current = true;

      setApiStatus("calling");
      const detections = await callDetectAPI(base64);

      processingRef.current = false;

      // API error — skip this frame, don't change counters
      if (detections === null) {
        setApiStatus("error");
        return;
      }

      setApiStatus("idle");
      setLatestDetections(detections);

      // Does this frame have a valid (high-confidence) detection?
      const hasPositive = detections.some(
        (d) => d.confidence >= CONFIDENCE_THRESHOLD
      );

      if (hasPositive) {
        // ── Positive frame ──
        consecutivePos.current += 1;
        consecutiveNeg.current = 0; // reset negative streak
        setConsecutivePosCount(consecutivePos.current);

        if (!timerStarted.current) {
          if (consecutivePos.current >= CONSECUTIVE_THRESHOLD) {
            // 3 consecutive positives → start duration timer
            startCountdown();
          } else {
            // Building up consecutive count
            setStatus(STATUS.DETECTING);
          }
        }
        // If timer already running, nothing extra to do — it keeps ticking
      } else {
        // ── Negative frame ──
        consecutiveNeg.current += 1;
        consecutivePos.current = 0; // reset positive streak
        setConsecutivePosCount(0);

        if (consecutiveNeg.current >= CONSECUTIVE_THRESHOLD) {
          if (timerStarted.current) {
            // 3 consecutive negatives while timer running → trash picked up
            stopAlert();
            stopCountdown();
          }
          // Also go back to SAFE if we were in DETECTING
          consecutiveNeg.current = 0;
          setStatus(STATUS.SAFE);
        }
        // If we haven't hit 3 negatives yet, keep current status
      }
    },
    [startCountdown, stopCountdown]
  );

  // ------------------------------------------------------------------
  // Reset when monitoring stops
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isActive) {
      resetAll();
    }
  }, [isActive, resetAll]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return { status, secondsLeft, latestDetections, processFrame, dismissAlert, consecutivePosCount, apiStatus };
}
