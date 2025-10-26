@echo off
echo ====================================
echo College Marketing Platform Setup
echo ====================================
echo.

echo [1/2] Setting up Frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    pause
    exit /b %errorlevel%
)
echo Frontend setup complete!
echo.

cd ..
echo [2/2] Backend folder is ready for FastAPI
echo Please follow backend/README.md for FastAPI setup
echo.

echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo To start the frontend:
echo   cd frontend
echo   npm run dev
echo.
echo To start the backend (after setup):
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn main:app --reload --port 8000
echo.
pause
