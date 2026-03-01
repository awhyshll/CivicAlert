"""
CivicAlert — Local FastAPI Server
Loads a YOLOv8 model and exposes a /detect endpoint that accepts
base64-encoded JPEG frames from the React frontend, runs inference,
and returns detected litter/trash objects.
"""

import base64
import io
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import cv2
from ultralytics import YOLO

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("civicalert")

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="CivicAlert Detection Server",
    description="YOLOv8-powered litter detection API",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the Vite React dev server to call us
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Load the YOLOv8 model once at startup
# ---------------------------------------------------------------------------
MODEL_PATH = "./mall-ai-system/models/best.pt"

try:
    model = YOLO(MODEL_PATH)
    logger.info(f"YOLOv8 model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logger.error(f"Failed to load model from {MODEL_PATH}: {e}")
    model = None

# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------
class DetectRequest(BaseModel):
    """Incoming frame from the frontend."""
    image: str  # base64-encoded JPEG string


class Detection(BaseModel):
    """A single detected object."""
    class_name: str   # e.g. "litter", "trash", "garbage"
    confidence: float  # 0.0 – 1.0


class DetectResponse(BaseModel):
    """Response sent back to the frontend."""
    detections: list[Detection]

# ---------------------------------------------------------------------------
# Health-check endpoint
# ---------------------------------------------------------------------------
@app.get("/")
def health_check():
    """Quick health check — also confirms the model is loaded."""
    return {
        "status": "ok",
        "model_loaded": model is not None,
    }

# ---------------------------------------------------------------------------
# Detection endpoint
# ---------------------------------------------------------------------------
@app.post("/detect", response_model=DetectResponse)
def detect(req: DetectRequest):
    """
    Accepts a base64-encoded JPEG image, runs YOLOv8 inference,
    and returns a list of detections with class names and confidence scores.
    """

    # 1. Make sure the model is loaded
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Place best.pt in ./mall-ai-system/models/ and restart.",
        )

    # 2. Decode the base64 image
    try:
        # Strip the optional data-URI prefix (e.g. "data:image/jpeg;base64,")
        image_data = req.image
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]

        image_bytes = base64.b64decode(image_data)
        # Use OpenCV to decode — this produces a BGR numpy array,
        # which is exactly what YOLO expects internally.
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            raise ValueError("cv2.imdecode returned None")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid base64 image: {e}",
        )

    # 3. Run inference (confidence threshold 0.25)
    try:
        results = model.predict(source=frame, conf=0.25, imgsz=640, verbose=False)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Inference failed: {e}",
        )

    # 4. Parse results into a clean list
    detections: list[Detection] = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            class_name = model.names.get(class_id, "unknown")

            detections.append(
                Detection(class_name=class_name, confidence=round(confidence, 4))
            )

    if detections:
        for d in detections:
            logger.info(f"  → {d.class_name}: {d.confidence*100:.1f}%")
    logger.info(f"Detected {len(detections)} object(s)")
    return DetectResponse(detections=detections)
