@echo off
echo Starting RehaboVision AI Backend...
echo.

cd /d "%~dp0"

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

echo.
echo Backend starting at http://localhost:5000
echo Press Ctrl+C to stop
echo.

python run.py

pause
