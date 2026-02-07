---
description: How to run the ClaimShield platform
---

### Prerequisites
1.  Python 3.10+
2.  Node.js 18+
3.  Groq API Key (Optional but recommended for reports)

### Setup & Run

1.  **Backend Setup**:
    Open a terminal and install dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

2.  **Generate Evidence Images & Train Model**:
    (Already performed by Antigravity)
    ```bash
    python backend/data_gen/train_model.py
    ```

3.  **Start Backend**:
    ```bash
    cd backend
    python -m app.main
    ```

4.  **Frontend Setup**:
    Open a new terminal:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

5.  **Access Dashboard**:
    Open [http://localhost:3000](http://localhost:3000)

6.  **Test Investigation**:
    - Upload `backend/data/scene.png` as Accident Scene.
    - Upload `backend/data/damage.png` as Vehicle Damage.
    - Upload `backend/data/invoice.png` as Repair Invoice.
    - Click **RUN INVESTIGATION**.
