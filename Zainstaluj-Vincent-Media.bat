@echo off
rem Vincent-Media: instalator nakladek do OBS. Pobiera najnowsza wersje z GitHuba.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; irm -UseBasicParsing ('https://raw.githubusercontent.com/V-Cancrosa/Vincent-Media/main/install.ps1?t=' + [DateTime]::Now.Ticks) | iex"
pause
