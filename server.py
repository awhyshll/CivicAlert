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
from PIL import Image
import numpy as np
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
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
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
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid base64 image: {e}",
        )

    # 3. Convert PIL image to numpy array for YOLOv8
    frame = np.array(image)

    # 4. Run inference (confidence threshold 0.25)
    try:
        results = model.predict(source=frame, conf=0.25, verbose=False)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Inference failed: {e}",
        )

    # 5. Parse results into a clean list
    detections: list[Detection] = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            class_name = model.names.get(class_id, "unknown")

            detections.append(
                Detection(class_name=class_name, confidence=round(confidence, 4))
            )

    logger.info(f"Detected {len(detections)} object(s)")
    return DetectResponse(detections=detections)
