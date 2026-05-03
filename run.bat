@echo off
echo ==================================================
echo Starting Rainfall Prediction System (Next-Gen AI)
echo ==================================================
echo.

:: Install missing python dependencies just in case
echo [1/3] Checking Backend Dependencies...
cd api
call .\venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

echo.
echo [2/3] Starting FastAPI Backend...
:: Start the backend in a new command prompt window
start "FastAPI Backend" cmd /k "cd api && call .\venv\Scripts\activate.bat && uvicorn index:app --reload"

echo.
echo [3/3] Starting Vite React Frontend...
:: Start the frontend in the current window
npm run dev
