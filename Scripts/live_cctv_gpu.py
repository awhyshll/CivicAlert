import cv2
from ultralytics import YOLO

model = YOLO(r"C:\Users\PRITAM\runs\detect\train11\weights\best.pt")

cap = cv2.VideoCapture("cctv_video2.mp4")

width = int(cap.get(3))
height = int(cap.get(4))
fps = int(cap.get(cv2.CAP_PROP_FPS))

out = cv2.VideoWriter(
    "output_detected.mp4",
    cv2.VideoWriter_fourcc(*'mp4v'),
    fps,
    (width, height)
)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, device=0)
    annotated = results[0].plot()

    out.write(annotated)

cap.release()
out.release()

print("Processing complete.")