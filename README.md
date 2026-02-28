# CivicAlert

ML-powered litter detection for shopping malls and public spaces. Uses a laptop webcam + YOLOv8 to detect when someone throws trash on the floor and doesn't pick it up within 30 seconds, then triggers a sound alert.

## Architecture

```
┌──────────────────────┐        base64 JPEG        ┌──────────────────────┐
│                      │  ───────────────────────►  │                      │
│   React Frontend     │    POST /detect            │  FastAPI + YOLOv8    │
│   (localhost:5173)   │  ◄───────────────────────  │  (localhost:8000)    │
│                      │    { detections: [...] }   │                      │
└──────────────────────┘                            └──────────────────────┘
        │                                                     │
   getUserMedia                                   mall-ai-system/models/
   Web Audio API                                       best.pt
   React Router                                    Ultralytics YOLO
```

- **Frontend** captures webcam frames every 5 seconds, resizes to 416×416, sends as base64 JPEG to the backend
- **Backend** runs YOLOv8 inference locally and returns detected objects with confidence scores
- **Alert** fires via Web Audio API if litter persists for 30+ seconds (5 s in demo mode)
- **Detection state machine**: SAFE → DETECTING → WARNING → ALERT — requires 3 consecutive positive frames before starting the countdown
- Everything runs on **one laptop**, no internet needed for inference

## Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Backend   | Python 3.10+, FastAPI, Ultralytics YOLOv8           |
| Frontend  | React 19, Vite 6, Tailwind CSS 4, React Router 7    |
| Webcam    | Browser `getUserMedia` API                           |
| Alerts    | Web Audio API (procedural beeps, no audio files)     |
| Compiler  | React Compiler (Babel plugin)                        |

## Pages & Routes

| Route        | Page                | Description                                      |
|--------------|---------------------|--------------------------------------------------|
| `/`          | Landing Page        | Hero section, feature overview, specs             |
| `/login`     | Login Page          | Email / password form → redirects to Dashboard    |
| `/access`    | Access Request Page | Organization access request form (tiered access)  |
| `/demo`      | Demo Page           | Static preview of the detection feed + launch btn |
| `/dashboard` | Dashboard Page      | Live webcam detection with status, alerts & logs  |

## Project Structure

```
CivicAlert/
├── server.py                       # FastAPI server — loads YOLOv8, exposes /detect
├── requirements.txt                # Python dependencies
├── mall-ai-system/
│   └── models/
│       └── best.pt                 # YOLOv8 trained weights (you provide this)
└── frontend/
    ├── src/
    │   ├── App.jsx                 # React Router setup (BrowserRouter + Routes)
    │   ├── main.jsx                # Entry point
    │   ├── components/
    │   │   └── WebcamFeed.jsx      # Standalone webcam component with controls
    │   ├── hooks/
    │   │   ├── useDetectionLogic.js # State machine: SAFE → DETECTING → WARNING → ALERT
    │   │   └── useFrameCapture.js   # Captures 416×416 frames every 5 s
    │   ├── pages/
    │   │   ├── LandingPage.jsx     # Public landing page
    │   │   ├── LoginPage.jsx       # Login form
    │   │   ├── AccessRequestPage.jsx # Tiered access request form
    │   │   ├── DemoPage.jsx        # Static demo preview
    │   │   └── DashboardPage.jsx   # Live detection dashboard
    │   └── utils/
    │       ├── alertSound.js       # Web Audio API beep generator
    │       └── detectAPI.js        # API client for /detect + health check
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Prerequisites

- **Python 3.10+**
- **Node.js 20.19+ or 22.12+**
- A trained YOLOv8 weights file (`best.pt`)

## Setup

### 1. Backend (FastAPI Server)

```bash
cd CivicAlert
pip install -r requirements.txt
```

Place your trained `best.pt` model file in the `mall-ai-system/models/` folder:

```
CivicAlert/mall-ai-system/models/best.pt
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
cd CivicAlert/frontend
npm install
npm run dev
```

Open http://localhost:5173 in Chrome.

## Usage

1. Start the backend server (Terminal 1)
2. Start the frontend dev server (Terminal 2)
3. Open http://localhost:5173 — you'll land on the **Landing Page**
4. Click **Live Demo** → then **Launch Litter Detection Demo** to enter the Dashboard
5. Or click **Login** → enter credentials → redirects to the Dashboard
6. On the Dashboard, click **Start Monitoring** — allow camera access when prompted
7. The webcam feed streams live; frames are captured every 5 seconds and sent to the API
8. Detection state progresses: SAFE → DETECTING (building confidence) → WARNING (countdown) → ALERT (sound)
9. If litter is detected and not picked up within 30 seconds (5 s in demo mode), an alert plays
10. Click **Dismiss** to clear the alert, or toggle **Mute** to silence sounds

## API Endpoints

| Method | Endpoint  | Description                              |
|--------|-----------|------------------------------------------|
| GET    | `/`       | Health check — confirms server & model   |
| POST   | `/detect` | Accepts `{ "image": "<base64>" }`, returns `{ "detections": [{ "class_name": "litter", "confidence": 0.87 }] }` |

## Detection Logic

The frontend implements a state machine with four stages:

1. **SAFE** — No litter detected. Counter resets after 3 consecutive negative frames.
2. **DETECTING** — Litter found, building consecutive positive count (threshold: 3 frames).
3. **WARNING** — Countdown timer starts (30 s normal / 5 s demo). Litter must be picked up before it expires.
4. **ALERT** — Timer expired. Audible alarm plays until manually dismissed.

Confidence threshold: **0.50** (detections below this are ignored).

## License

MIT
