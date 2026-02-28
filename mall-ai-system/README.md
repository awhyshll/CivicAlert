# Mall AI System — ML Model Directory

> **For the ML teammate**: Drop your trained model and related files into this
> directory following the structure below. The FastAPI server (`server.py` in the
> project root) automatically loads `models/best.pt` at startup.

## Directory Structure

```
mall-ai-system/
│
├── notebooks/
│   └── model_train.ipynb          # Training notebook
│
├── dataset/
│   ├── images/
│   │   ├── train/                 # Training images
│   │   └── val/                   # Validation images
│   ├── labels/
│   │   ├── train/                 # Training labels (YOLO format)
│   │   └── val/                   # Validation labels
│   └── data.yaml                  # Dataset config (class names, paths)
│
├── models/
│   └── best.pt                    # ⭐ Trained YOLOv8 weights (REQUIRED)
│
├── videos/
│   ├── input/
│   │   └── cctv_video.mp4         # Sample/test input videos
│   └── output/                    # Inference output videos
│
├── scripts/
│   └── live_cctv_gpu.py           # Standalone GPU inference script
│
└── logs/                          # Training / inference logs
```

## What the Server Needs

The **only file required** for the web app to work is:

```
mall-ai-system/models/best.pt
```

This is a YOLOv8 `.pt` weights file loaded by `ultralytics.YOLO()` in
`server.py`. Everything else (dataset, notebooks, videos, scripts, logs) is for
your own training/testing workflow and won't be used by the server directly.

## Quick Checklist

- [ ] Place `best.pt` in `mall-ai-system/models/`
- [ ] (Optional) Add `data.yaml` in `mall-ai-system/dataset/`
- [ ] (Optional) Add training notebook in `mall-ai-system/notebooks/`
- [ ] (Optional) Add helper scripts in `mall-ai-system/scripts/`

## Important Notes

- **Large files** (`.pt` weights, videos, images) are git-ignored by default.
  Use [Git LFS](https://git-lfs.github.com/) for files > 100 MB, or share them
  via Google Drive / cloud storage and document the link here.
- The server runs on `http://localhost:8000` — start it with:
  ```bash
  uvicorn server:app --reload --port 8000
  ```
