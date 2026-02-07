FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for OpenCV and DocTR
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download YOLO model weights
RUN python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

COPY . .

# Hugging Face Spaces uses 7860
EXPOSE 7860

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
