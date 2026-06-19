@echo off
cd /d "%~dp0"
if not exist "dist\index.html" (
  echo Generando version compilada...
  "C:\Program Files\nodejs\npm.cmd" run build
)
start "" "dist\index.html"
