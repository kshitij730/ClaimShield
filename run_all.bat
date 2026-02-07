@echo off
TITLE ClaimShield Launcher
echo ==========================================
echo    CLAIMSHIELD - MULTIMODAL FRAUD AI
echo ==========================================

:: Set the current directory
set ROOT_DIR=%~dp0
cd /d %ROOT_DIR%

:: Step 1: Python Virtual Environment Setup (Backend)
echo [1/3] Checking Backend Environment...
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo [2/3] Installing/Updating Backend Dependencies...
call venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r backend/requirements.txt

:: Step 2: Launch Services
echo [3/3] Starting Services...

echo Launching Backend Service (Port 8000)...
start cmd /k "echo ClaimShield Backend && cd backend && ..\venv\Scripts\activate && python -m app.main"

echo Launching Frontend Dashboard (Next.js)...
if not exist node_modules (
    echo [Note] Node modules not found. Running npm install...
    start /wait cmd /c "npm install"
)
start cmd /k "echo ClaimShield Frontend && npm run dev"

echo.
echo ==========================================
echo ClaimShield is launching!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ==========================================
echo.
pause
