@echo off
rem Vincent-Media: wykrywacz gier dla nakladki OBS. Zamknij okno, zeby wylaczyc.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0detector.ps1"
if errorlevel 1 pause
