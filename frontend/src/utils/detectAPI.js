/**
 * detectAPI.js — Utility for communicating with the local FastAPI server.
 *
 * IMPORTANT: The FastAPI server must be running BEFORE using these functions.
 * Start it with:
 *   cd d:\CivicGuard
 *   uvicorn server:app --reload --port 8000
 */

const API_BASE = "http://localhost:8000";

// ------------------------------------------------------------------
// callDetectAPI — Send a base64 frame to the YOLO detection endpoint
// ------------------------------------------------------------------
/**
 * Posts a base64-encoded JPEG image to the /detect endpoint and
 * returns the array of detections.
 *
 * @param {string} base64Image - Full data-URI or raw base64 string
 * @returns {Array|null} Array of { class_name, confidence } or null on error
 */
export async function callDetectAPI(base64Image) {
  try {
    const response = await fetch(`${API_BASE}/detect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
      // 10-second timeout prevents the UI from hanging if the server is slow
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(`Detection API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.detections ?? [];
  } catch (err) {
    console.error("Failed to reach detection API:", err.message);
    return null;
  }
}

// ------------------------------------------------------------------
// checkServerHealth — Ping the root endpoint to verify server is up
// ------------------------------------------------------------------
/**
 * Pings http://localhost:8000/ and returns true if the server responds,
 * false otherwise. Used on app load to show a warning banner.
 *
 * @returns {Promise<boolean>}
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE}/`, {
      method: "GET",
      // Short timeout so the UI doesn't hang if server is down
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
