# 🛡️ ClaimShield: Multimodal Forensic Fraud AI

ClaimShield is a high-performance, AI-driven forensic platform designed to detect insurance fraud using multimodal reasoning. It analyzes visual evidence (accident scenes, vehicle damage), financial documents (repair invoices), and cognitive patterns (linguistic deception) to provide a comprehensive fraud risk assessment.

---

## 🚀 Key Features

### 1. 👁️ Vision AI (Visual Verification)
- **Damage Detection**: Uses YOLO (You Only Look Once) to automatically identify damaged parts and estimate severity.
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
  - `Sentence-Transformers/FAISS`: Semantic similarity for pattern matching against historical fraudulent cases.
  - `Scikit-Learn`: Random Forest classifier for final Fraud Scoring.
- **Deployment**: Dockerized for Hugging Face Spaces.

### **Frontend (The Command Center)**
- **Framework**: Next.js 15 (React)
- **Styling**: Vanilla CSS with Advanced Glassmorphism & Keyframe Animations.
- **Features**: Interactive tabbed navigation, real-time Markdown report rendering (`react-markdown`), and dynamic fraud risk visualizations.
- **Deployment**: Vercel.

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
- Groq API Key (for automated report generation)

### **Execution**
Simply run the included batch file to set up environments and launch both services:
```bash
.\run_all.bat
```

---

## ☁️ Deployment Guide

### **1. Backend (Hugging Face Spaces)**
1. Create a new **Docker Space**.
2. Upload the contents of the `backend/` directory.
3. Set the Secret Variable: `GROQ_API_KEY`.
4. The API will be available at `https://your-space-name.hf.space`.

### **2. Frontend (Vercel)**
1. Connect the root directory of this repository to Vercel.
2. Set the Environment Variable:
   - `NEXT_PUBLIC_API_BASE_URL`: (Your Hugging Face Space URL).
3. Vercel will auto-detect the Next.js project and deploy.

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
├── run_all.bat         # Local automation script
├── .gitignore          # Cloud-safe ignore list
└── README.md           # You are here
```

---

## ⚖️ Forensic Modules Overview

- **Fraud Score**: A weighted probability (0.0 to 1.0) calculated from visual mismatches, financial anomalies, and linguistic flags.
- **Physical Consistency**: Validates if the "Frontal Impact" claimed by the user matches the "Rear Bumper" damage detected by AI.
- **Invoice Consistency**: Flags parts listed on the invoice that do not appear to be damaged in the photos.

---
*Developed by Kshitij Sharma for Advanced Forensic Insurance Analysis.*
