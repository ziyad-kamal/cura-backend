@echo off

:: Request admin privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator access...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit
)

echo Starting services...

echo Starting Redis...
start "" "D:\redis\redis-x64-5.0.14.1\redis-server.exe"
@REM net start Redis


timeout /t 3 >nul

echo Starting MongoDB...
net start MongoDB

echo Starting Backend...
cd /d D:\final-project\backend

npm run dev

pause