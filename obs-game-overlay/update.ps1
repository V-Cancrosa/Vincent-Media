#Requires -Version 5.1
<#
  Vincent-Media – aktualizacja plików nakładki z GitHuba.

  Uruchomiony sam (np. ze skrótu „Aktualizuj”): sprawdza wersję i podmienia zmienione pliki.
  Z parametrem -Library tylko definiuje funkcje (używa go wykrywacz).

  Twoje dane zostają: detector\data\ (logowanie Twitcha, baza gier) i detector\my-games.txt.
#>
param([switch]$Library, [switch]$Quiet, [switch]$Force)

$VMRepo = 'V-Cancrosa/Vincent-Media'
$VMBranch = 'main'

function Enable-VMTls {
    try { [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12 } catch {}
}

function Get-VMLocalVersion([string]$dir) {
    try { return [string]((Get-Content (Join-Path $dir 'version.json') -Raw -Encoding UTF8) | ConvertFrom-Json).version }
    catch { return '0.0.0' }
}

function Get-VMRemoteInfo {
    Enable-VMTls
    $u = "https://raw.githubusercontent.com/$VMRepo/$VMBranch/obs-game-overlay/version.json?nocache=$(Get-Random)"
    return Invoke-RestMethod -UseBasicParsing -TimeoutSec 20 -Uri $u -Headers @{ 'Cache-Control' = 'no-cache' }
}

function Test-VMNewer([string]$remote, [string]$local) {
    try { return ([version]$remote) -gt ([version]$local) } catch { return $remote -ne $local }
}

# Pobiera paczkę z GitHuba i kopiuje do $target tylko zmienione pliki. Zwraca liczbę podmienionych plików.
function Install-VMFiles([string]$target) {
    Enable-VMTls
    $tmp = Join-Path $env:TEMP ('vm-update-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $tmp | Out-Null
    try {
        $zip = Join-Path $tmp 'vm.zip'
        $old = $ProgressPreference; $ProgressPreference = 'SilentlyContinue'   # pasek postępu bardzo spowalnia pobieranie w PS 5.1
        try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 180 -Uri "https://codeload.github.com/$VMRepo/zip/refs/heads/$VMBranch" -OutFile $zip }
        finally { $ProgressPreference = $old }
        Expand-Archive -Path $zip -DestinationPath $tmp -Force
        $root = Get-ChildItem -Path $tmp -Directory | Select-Object -First 1
        $src = Join-Path $root.FullName 'obs-game-overlay'
        if (-not (Test-Path (Join-Path $src 'version.json'))) { throw 'pobrana paczka nie zawiera obs-game-overlay\version.json' }
        New-Item -ItemType Directory -Force -Path $target | Out-Null
        $changed = 0
        foreach ($f in Get-ChildItem -Path $src -Recurse -File) {
            $rel = $f.FullName.Substring($src.Length).TrimStart('\')
            if ($rel -like 'detector\data\*' -or $rel -eq 'detector\my-games.txt') { continue }
            $dst = Join-Path $target $rel
            if ((Test-Path $dst) -and ((Get-FileHash -Path $dst).Hash -eq (Get-FileHash -Path $f.FullName).Hash)) { continue }
            New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
            Copy-Item -Path $f.FullName -Destination $dst -Force
            $changed++
        }
        return $changed
    } finally {
        Remove-Item -Path $tmp -Recurse -Force -ErrorAction SilentlyContinue
    }
}

if ($Library) { return }

# ---------------------------------------------------------------- uruchomienie ręczne
$Host.UI.RawUI.WindowTitle = 'Vincent-Media: aktualizacja'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}
$dir = $PSScriptRoot
$local = Get-VMLocalVersion $dir
Write-Host ''
Write-Host '  Vincent-Media – aktualizacja' -ForegroundColor Magenta
Write-Host "  Folder: $dir" -ForegroundColor DarkGray
try {
    $remote = Get-VMRemoteInfo
    Write-Host "  Zainstalowana wersja: $local, najnowsza: $($remote.version)"
    if (-not $Force -and -not (Test-VMNewer ([string]$remote.version) $local)) {
        Write-Host '  Masz najnowszą wersję.' -ForegroundColor Green
    } else {
        $n = Install-VMFiles $dir
        Write-Host "  Zaktualizowano do $($remote.version) – podmienione pliki: $n." -ForegroundColor Green
        if ($remote.notes) { Write-Host "  Co nowego: $($remote.notes)" }
        Write-Host '  Wykrywacz sam uruchomi się w nowej wersji, a nakładki w OBS same się odświeżą.' -ForegroundColor DarkGray
    }
} catch {
    Write-Host "  Nie udało się: $($_.Exception.Message)" -ForegroundColor Red
    if (-not $Quiet) { Read-Host '  Enter = zamknij' }
    exit 1
}
if (-not $Quiet) { Read-Host '  Enter = zamknij' }
