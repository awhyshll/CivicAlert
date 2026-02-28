# CivicGuard

Real-time litter detection for shopping malls and public spaces. Uses a laptop webcam + YOLOv8 to detect when someone throws trash on the floor and doesn't pick it up within 30 seconds, then triggers a sound alert.

## Architecture

```
┌──────────────────────┐        base64 JPEG        ┌──────────────────────┐
│                      │  ───────────────────────►  │                      │
│   React Frontend     │    POST /detect            │  FastAPI + YOLOv8    │
│   (localhost:5173)   │  ◄───────────────────────  │  (localhost:8000)    │
│                      │    { detections: [...] }   │                      │
└──────────────────────┘                            └──────────────────────┘
        │                                                     │
   getUserMedia                                        model/best.pt
   Web Audio API                                     Ultralytics YOLO
```

- **Frontend** captures webcam frames every 5 seconds, resizes to 416×416, sends as base64 JPEG to the backend
- **Backend** runs YOLOv8 inference locally and returns detected objects with confidence scores
- **Alert** fires via Web Audio API if litter persists for 30+ seconds
- Everything runs on **one laptop**, no internet needed for inference

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Python, FastAPI, Ultralytics YOLOv8 |
| Frontend | React, Vite, Tailwind CSS           |
| Webcam   | Browser getUserMedia API            |
| Alerts   | Web Audio API (no audio files)      |

## Project Structure

```
CivicGuard/
├── server.py                  # FastAPI server — loads YOLOv8, exposes /detect
├── requirements.txt           # Python dependencies
├── model/
│   └── best.pt                # YOLOv8 trained weights (you provide this)
└── frontend/
    ├── src/
    │   ├── App.jsx            # Main app with server health check
    │   ├── components/
    │   │   └── WebcamFeed.jsx # Webcam stream + start/stop controls
    │   ├── hooks/
    │   │   └── useFrameCapture.js  # Captures 416×416 frames every 5s
    │   └── utils/
    │       └── detectAPI.js   # API client for /detect + health check
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Prerequisites

- **Python 3.10+**
- **Node.js 20.19+ or 22.12+**
- A trained YOLOv8 weights file (`best.pt`) placed in `model/`

## Setup

### 1. Backend (FastAPI Server)

```bash
cd CivicGuard
pip install -r requirements.txt
```

Place your trained `best.pt` model file in the `model/` folder:

```
CivicGuard/model/best.pt
```

Start the server:

```bash
uvicorn server:app --reload --port 8000
```

Verify it's running: open http://localhost:8000 — you should see:

```json
{ "status": "ok", "model_loaded": true }
```

> **Keep this terminal open** while using the frontend.

### 2. Frontend (React App)

In a **separate terminal**:

```bash
cd CivicGuard/frontend
npm install
npm run dev
```

Open http://localhost:5173 in Chrome.

## Usage

1. Start the backend server (Terminal 1)
2. Start the frontend dev server (Terminal 2)
3. Open http://localhost:5173
4. Verify you see "✓ Detection server connected"
5. Click **Start Monitoring** — allow camera access when prompted
6. The webcam feed will appear with a LIVE badge
7. Frames are captured every 5 seconds and sent to the detection API
8. If litter is detected and not picked up within 30 seconds, an alert sound plays

## API Endpoints

| Method | Endpoint  | Description                              |
|--------|-----------|------------------------------------------|
| GET    | `/`       | Health check — confirms server & model   |
| POST   | `/detect` | Accepts `{ "image": "<base64>" }`, returns `{ "detections": [{ "class_name": "litter", "confidence": 0.87 }] }` |

## License

MIT
