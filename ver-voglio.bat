@echo off
cd /d "%~dp0"
start "Voglio Dev" powershell.exe -ExecutionPolicy Bypass -NoExit -Command "Set-Location -LiteralPath '%~dp0'; npm run dev"
timeout /t 4 /nobreak >nul
start http://localhost:5173/
