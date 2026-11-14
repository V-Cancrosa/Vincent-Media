#Requires -Version 5.1
<#
  Vincent-Media – włącza pilota z telefonu: pozwala wykrywaczowi nasłuchiwać w sieci domowej (port 7777).
  Robi dwie rzeczy jako administrator (jedno okienko zgody Windows):
    1. rezerwację adresu http://+:7777/ dla zwykłego użytkownika (bez tego Windows nie pozwala nasłuchiwać w sieci),
    2. regułę zapory przepuszczającą port 7777 TYLKO w sieciach prywatnych (dom), nie publicznych.
  Wyłączenie: uruchom z parametrem -Disable.
#>
param([switch]$Disable)
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    $a = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $PSCommandPath + '"'))
    if ($Disable) { $a += '-Disable' }
    try { Start-Process powershell.exe -Verb RunAs -ArgumentList $a -Wait } catch { Write-Host 'Nie udzielono zgody administratora – nic nie zmieniono.' -ForegroundColor Yellow; Start-Sleep 3 }
    exit
}
$Host.UI.RawUI.WindowTitle = 'Vincent-Media: pilot z telefonu'
netsh http delete urlacl url=http://+:7777/ | Out-Null
netsh advfirewall firewall delete rule name=VincentMediaPilot | Out-Null
if ($Disable) {
    Write-Host '  Pilot z telefonu wyłączony.' -ForegroundColor Yellow
} else {
    netsh http add urlacl url=http://+:7777/ 'sddl=D:(A;;GX;;;WD)' | Out-Null
    netsh advfirewall firewall add rule name=VincentMediaPilot dir=in action=allow protocol=TCP localport=7777 profile=private | Out-Null
    Write-Host '  Pilot z telefonu włączony (tylko w sieci prywatnej).' -ForegroundColor Green
    Write-Host '  Jeśli Twoja sieć Wi‑Fi jest w Windows oznaczona jako «publiczna», zmień ją na «prywatną»:' -ForegroundColor DarkGray
    Write-Host '  Ustawienia → Sieć i Internet → Wi‑Fi → [Twoja sieć] → Typ profilu sieci → Prywatna.' -ForegroundColor DarkGray
}
# poproś działający wykrywacz o restart, żeby od razu nasłuchiwał w nowym trybie
$data = Join-Path $PSScriptRoot 'data'
New-Item -ItemType Directory -Force -Path $data | Out-Null
Set-Content -Path (Join-Path $data 'restart.flag') -Value (Get-Date -Format o)
Write-Host '  Wykrywacz uruchomi się ponownie w ciągu 30 sekund.' -ForegroundColor DarkGray
Start-Sleep 4
