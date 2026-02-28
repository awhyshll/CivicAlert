# Mall AI System - Litter Detection using YOLOv8

## 📌 Project Overview

This project implements a deep learning-based litter detection system using YOLOv8. The system is designed to analyze CCTV footage and detect litter objects in real-time or recorded video streams.

The model was trained on a custom dataset containing labeled litter images and deployed using GPU acceleration (CUDA).

---

## 🏗️ Project Structure
mall-ai-system/
│
├── notebooks/
│ └── model_train.ipynb # Model training notebook
│
├── dataset/
│ ├── images/
│ │ ├── train/
│ │ └── val/
│ ├── labels/
│ │ ├── train/
│ │ └── val/
│ └── data.yaml # Dataset configuration
│
├── models/
│ └── best.pt # Trained YOLO model weights
│
├── videos/
│ ├── input/ # Test CCTV videos/images
│ └── output/ # Output detection results
│
├── scripts/
│ └── live_cctv_gpu.py # Deployment script

---

## 🧠 Model Details

- Model: YOLOv8 (Ultralytics)
- Task: Object Detection
- Classes: 1 (Litter)
- Image Size: 640
- Hardware: NVIDIA RTX 4050 (CUDA 11.8)
- Python Version: 3.10.11

---

## 🚀 Training the Model

## Activate virtual environment:
    yolo_gpu_env\Scripts\activate

Run training:

```python
from ultralytics import YOLO

model = YOLO("yolov8n.pt")

model.train(
    data="dataset/data.yaml",
    epochs=50,
    imgsz=640
)

## On Image
    model.predict(
    source="videos/input/test.jpg",
    save=True
)