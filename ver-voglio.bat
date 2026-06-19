@echo off
cd /d "%~dp0"
start "" cmd /k ""C:\Program Files\nodejs\npm.cmd" run dev -- --host 127.0.0.1 --port 4173"
timeout /t 4 /nobreak >nul
start http://127.0.0.1:4173/
