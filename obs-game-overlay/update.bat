@echo off
rem Vincent-Media: sprawdza i instaluje aktualizacje nakladki z GitHuba.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0update.ps1"
