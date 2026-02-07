# 🛡️ ClaimShield: Multimodal Forensic Fraud AI

<div align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge&logo=vercel" alt="Live Status">
  <img src="https://img.shields.io/badge/Backend-Hugging_Face-FFD21E?style=for-the-badge&logo=huggingface" alt="Backend">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</div>

---

## 🌍 Live Links

- **🚀 Live Dashboard**: [https://claim-shield.vercel.app/](https://claim-shield.vercel.app/)
- **⚙️ Backend API (HF)**: [https://huggingface.co/spaces/kshitij230/claimshield-api](https://huggingface.co/spaces/kshitij230/claimshield-api)
- **📚 API Documentation**: [https://kshitij230-claimshield-api.hf.space/docs](https://kshitij230-claimshield-api.hf.space/docs)

---

## 🚀 Key Features

### 1. 👁️ Vision AI (Visual Verification)
- **Damage Detection**: Uses YOLOv8 to automatically identify damaged parts and estimate severity.
- **Collision Geometry**: Analyzes impact direction and force to verify if the damage is consistent with the reported accident story.

### 2. 🧾 Document Intelligence (OCR & Audit)
- **OCR Processing**: Extracts line items from repair invoices using DocTR.
- **Financial Cross-Check**: Compares claimed repair costs with industry standards and visual evidence to flag price gouging or phantom repairs.

### 3. 🧠 Cognitive & Network Intel
- **Linguistic Deception Analysis**: Detects specific psychological indicators and "suggestive wording" in claim descriptions to predict deception.
- **Fraud Network Analysis**: Maps claimant IDs against high-risk clusters, suspicious repair shops, and historical fraud rings.
- **Forensic EXIF Analysis**: Checks image technical metadata for GPS mismatches (photo taken elsewhere) and timestamp inconsistencies.

---

## 🏗️ System Architecture

ClaimShield is built on a decoupled, multimodal architecture:

### **Backend (The Reasoning Engine)**
- **Framework**: FastAPI (Python 3.10)
- **AI Models**:
  - `Ultralytics YOLO`: Real-time object/damage detection.
  - `python-doctr`: High-accuracy OCR for document parsing.
  - `Sentence-Transformers/FAISS`: Semantic similarity for pattern matching.
  - `Scikit-Learn`: Random Forest classifier for final Fraud Scoring.
- **Brain**: Llama-3 (powered by Groq) for forensic report generation.

### **Frontend (The Command Center)**
- **Framework**: Next.js 15 (React)
- **Styling**: Vanilla CSS with Advanced Glassmorphism & Keyframe Animations.
- **Features**: Interactive tabbed navigation, real-time Markdown report rendering.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js, TypeScript, React Markdown, CSS Variables |
| **Backend API** | FastAPI, Uvicorn, Python 3.10 |
| **Machine Learning** | PyTorch, Scikit-Learn, YOLOv8 |
| **Computer Vision** | OpenCV, PIL, DocTR |
| **Vector Search** | FAISS, Sentence-Transformers |
| **Report Generation** | Groq (Llama-3.3-70b-versatile) |

---

## 🚦 Getting Started (Local Development)

### **Prerequisites**
- Node.js 18+
- Python 3.10+
- Groq API Key

### **Execution**
Simply run the included batch file to set up environments and launch both services:
```bash
.\run_all.bat
```

---

## ☁️ Deployment Reference

- **Backend**: Deployed on Hugging Face Spaces (Docker).
- **Frontend**: Deployed on Vercel (Next.js).
- **Critical Env Var**: `NEXT_PUBLIC_API_BASE_URL` (points to the HF Space URL).

---

## 📁 Project Structure

```text
ClaimShield/
├── app/                # Next.js App Router (Frontend)
├── backend/            # FastAPI Python Application
│   ├── app/            # Core logic (vision, report, main)
│   ├── models/         # Pre-trained ML classifiers
│   ├── Dockerfile      # For Hugging Face Deployment
│   └── requirements.txt
├── public/             # Static UI assets
├── LICENSE             # MIT License
├── run_all.bat         # Local automation script
└── README.md           # Project Documentation
```

---
*Developed by Kshitij Sharma for Advanced Forensic Insurance Analysis.*
