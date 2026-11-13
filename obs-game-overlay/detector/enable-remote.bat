@echo off
rem Vincent-Media: wlacza pilota z telefonu (prosi o zgode administratora).
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0enable-remote.ps1" %*
