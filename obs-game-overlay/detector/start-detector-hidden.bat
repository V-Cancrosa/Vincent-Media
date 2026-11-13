@echo off
rem Uruchamia wykrywacz w tle, bez okna (np. do autostartu). Wylaczenie: Menedzer zadan -> Windows PowerShell.
start "" powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0detector.ps1" -Hidden
