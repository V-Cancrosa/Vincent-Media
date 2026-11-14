#Requires -Version 5.1
<#
  Vincent-Media – wykrywacz gier dla nakładki OBS.

  Działa jak wykrywanie gier w Discordzie:
    1. pobiera publiczną bazę gier Discorda (nazwy plików .exe -> nazwa gry),
    2. co kilka sekund sprawdza uruchomione programy,
    3. dodatkowo pyta Steama, jaka gra jest uruchomiona (pewna nazwa + okładka),
    4. wystawia wynik pod http://localhost:7777/game dla nakładki.

  Uruchamianie: dwuklik na start-detector.bat (albo: powershell -ExecutionPolicy Bypass -File detector.ps1)
#>
param(
    [int]$Port = 7777,
    [double]$Interval = 3,
    [int]$DbMaxAgeDays = 7,
    [switch]$Hidden,          # uruchomiony bez okna (start-detector-hidden.bat)
    [int]$WaitStart = 0       # po aktualizacji: poczekaj, aż poprzednia wersja zwolni port
)
if ($WaitStart -gt 0) { Start-Sleep -Seconds $WaitStart }
# jedna kopia naraz: gdy wykrywacz już działa, kolejne uruchomienie (np. z panelu w OBS) od razu się kończy.
# Po aktualizacji nowa wersja czeka, aż stara się zamknie.
$script:Mutex = New-Object Threading.Mutex($false, 'Local\VincentMediaDetector')
$gotMutex = $false
try { $gotMutex = $script:Mutex.WaitOne([TimeSpan]::FromSeconds([Math]::Max(1, $WaitStart * 6))) } catch [Threading.AbandonedMutexException] { $gotMutex = $true }
if (-not $gotMutex) { exit 0 }

$ErrorActionPreference = 'Stop'
$Host.UI.RawUI.WindowTitle = 'Vincent-Media: wykrywacz gier'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$Root       = $PSScriptRoot
$DataDir    = Join-Path $Root 'data'
$IndexFile  = Join-Path $DataDir 'games-index.tsv'
$SteamCache = Join-Path $DataDir 'steam-names.tsv'
$CustomFile = Join-Path $Root 'my-games.txt'
$Utf8NoBom  = New-Object Text.UTF8Encoding $false
New-Item -ItemType Directory -Force -Path $DataDir | Out-Null

# Programy, które nigdy nie są grą (np. okno OBS, gdy klikasz w panel).
$NeverGame = @('obs64.exe','obs32.exe','obs.exe','explorer.exe','powershell.exe','pwsh.exe','conhost.exe',
               'windowsterminal.exe','cmd.exe','discord.exe','steam.exe','steamwebhelper.exe','applicationframehost.exe',
               'shellexperiencehost.exe','searchhost.exe','startmenuexperiencehost.exe','lockapp.exe','textinputhost.exe')
# Aplikacje Steama, które nie są grami.
$SteamNotGames = @('228980','431960','250820','1070560','1391110','1628350')  # redist, Wallpaper Engine, SteamVR, Steam Linux Runtime...

function Log([string]$msg, [string]$color = 'Gray') {
    Write-Host ("[{0:HH:mm:ss}] {1}" -f (Get-Date), $msg) -ForegroundColor $color
}
function Get-Val($dict, [string]$key) {
    if ($null -ne $dict -and $dict.ContainsKey($key)) { return $dict[$key] }
    return $null
}
function Clean($s) {
    if ($null -eq $s) { return '' }
    return ([string]$s) -replace "[`t`r`n]", ' '
}

# ---------------------------------------------------------------- baza gier
function Update-Index {
    $sources = @(
        'https://discord.com/api/v9/applications/detectable',
        'https://raw.githubusercontent.com/OpenAsar/arrpc/main/src/process/detectable.json'
    )
    Add-Type -AssemblyName System.Web.Extensions
    foreach ($url in $sources) {
        try {
            Log "Pobieram bazę gier: $url"
            $wc = New-Object Net.WebClient
            $wc.Headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VincentMediaGameDetector/1.0'
            $wc.Encoding = [Text.Encoding]::UTF8
            $json = $wc.DownloadString($url)
            $ser = New-Object Web.Script.Serialization.JavaScriptSerializer
            $ser.MaxJsonLength = [int]::MaxValue
            $ser.RecursionLimit = 100
            $apps = $ser.DeserializeObject($json)
            $sb = New-Object Text.StringBuilder
            $count = 0
            foreach ($a in $apps) {
                $steam = ''
                foreach ($sku in @(Get-Val $a 'third_party_skus')) {
                    if ($sku -and (Get-Val $sku 'distributor') -eq 'steam') { $steam = Clean (Get-Val $sku 'id'); break }
                }
                $id = Clean (Get-Val $a 'id'); $name = Clean (Get-Val $a 'name'); $icon = Clean (Get-Val $a 'icon_hash')
                foreach ($e in @(Get-Val $a 'executables')) {
                    if (-not $e) { continue }
                    if ((Get-Val $e 'os') -ne 'win32' -or (Get-Val $e 'is_launcher')) { continue }
                    $exe = (Clean (Get-Val $e 'name')).ToLowerInvariant()
                    if (-not $exe) { continue }
                    $argz = Clean (Get-Val $e 'arguments')
                    [void]$sb.Append($exe).Append("`t").Append($id).Append("`t").Append($name).Append("`t").Append($icon).Append("`t").Append($steam).Append("`t").Append($argz).Append("`n")
                    $count++
                }
            }
            if ($count -lt 1000) { throw "podejrzanie mało wpisów ($count)" }
            [IO.File]::WriteAllText($IndexFile, $sb.ToString(), $Utf8NoBom)
            Log "Baza gier zapisana: $count plików .exe" 'Green'
            return
        } catch {
            Log "  nie udało się: $($_.Exception.Message)" 'Yellow'
        }
    }
}

$script:ByExe = @{}
$script:BySteam = @{}
function Import-Index {
    $script:ByExe = @{}; $script:BySteam = @{}
    if (-not (Test-Path $IndexFile)) { Log 'Brak bazy gier – działa tylko Steam i my-games.txt.' 'Yellow'; return }
    foreach ($line in [IO.File]::ReadAllLines($IndexFile, [Text.Encoding]::UTF8)) {
        $f = $line.Split("`t")
        if ($f.Length -lt 6) { continue }
        $entry = [pscustomobject]@{ Exe = $f[0]; Id = $f[1]; Name = $f[2]; Icon = $f[3]; Steam = $f[4]; Args = $f[5] }
        if (-not $script:ByExe.ContainsKey($f[0])) { $script:ByExe[$f[0]] = New-Object Collections.ArrayList }
        [void]$script:ByExe[$f[0]].Add($entry)
        if ($f[4] -and -not $script:BySteam.ContainsKey($f[4])) { $script:BySteam[$f[4]] = $entry }
    }
    Log ("Wczytano bazę: {0} gier/plików" -f $script:ByExe.Count)
}

# ---------------------------------------------------------------- my-games.txt
$script:Custom = @{}
$script:Ignore = @{}
$script:CustomStamp = $null
function Initialize-CustomFile {
    if (Test-Path $CustomFile) { return }
    $txt = @"
# Twoje gry, których nie wykrywa baza Discorda (albo chcesz zmienić im nazwę).
# Jedna gra w linii:
#   plik.exe = Nazwa gry
#   plik.exe = Nazwa gry | https://adres-okladki.jpg
# Ignorowanie programu, który nie jest grą:
#   !plik.exe
# Ignorowanie aplikacji Steama po numerze:
#   !steam:431960
#
# Plik możesz edytować w trakcie działania – zmiany wchodzą od razu.
# Panel w OBS też umie tu dopisywać gry (przycisk «Dodaj jako grę»).

"@
    [IO.File]::WriteAllText($CustomFile, $txt, (New-Object Text.UTF8Encoding $true))
}
function Import-Custom {
    $stamp = (Get-Item $CustomFile).LastWriteTimeUtc
    if ($stamp -eq $script:CustomStamp) { return }
    $script:CustomStamp = $stamp
    $script:Custom = @{}; $script:Ignore = @{}
    foreach ($raw in [IO.File]::ReadAllLines($CustomFile, [Text.Encoding]::UTF8)) {
        $line = $raw.Trim()
        if (-not $line -or $line.StartsWith('#')) { continue }
        if ($line.StartsWith('!')) { $script:Ignore[$line.Substring(1).Trim().ToLowerInvariant().Replace('\','/')] = $true; continue }
        $eq = $line.IndexOf('=')
        if ($eq -lt 1) { continue }
        $exe = $line.Substring(0, $eq).Trim().ToLowerInvariant().Replace('\','/')
        $rest = $line.Substring($eq + 1)
        $img = ''
        $bar = $rest.IndexOf('|')
        if ($bar -ge 0) { $img = $rest.Substring($bar + 1).Trim(); $rest = $rest.Substring(0, $bar) }
        $script:Custom[$exe] = [pscustomobject]@{ Name = $rest.Trim(); Image = $img }
    }
    $script:MatchCache = @{}
    Log ("my-games.txt: {0} gier, {1} ignorowanych" -f $script:Custom.Count, $script:Ignore.Count)
}
function Add-CustomLine([string]$line) {
    $existing = [IO.File]::ReadAllText($CustomFile, [Text.Encoding]::UTF8)
    if ($existing.Length -and -not $existing.EndsWith("`n")) { $line = "`r`n" + $line }
    [IO.File]::AppendAllText($CustomFile, $line + "`r`n", $Utf8NoBom)
    Import-Custom
}

# ---------------------------------------------------------------- dopasowanie procesu
function Get-Variants([string]$path) {
    $p = $path.ToLowerInvariant().Replace('\', '/')
    $parts = $p.Split('/')
    $list = New-Object Collections.Generic.List[string]
    for ($i = 1; $i -lt $parts.Length; $i++) {
        $list.Add([string]::Join('/', $parts, $parts.Length - $i, $i))
    }
    foreach ($x in @($list)) {   # jak Discord: tolerancja na dopiski 64-bit
        foreach ($t in @('64', '.x64', 'x64', '_64')) {
            $y = $x.Replace($t, '')
            if ($y -ne $x -and -not $list.Contains($y)) { $list.Add($y) }
        }
    }
    return , $list
}

$script:MatchCache = @{}
function Find-Game([string]$path, [string]$cmd) {
    $key = $path + '|' + $cmd
    if ($script:MatchCache.ContainsKey($key)) { return $script:MatchCache[$key] }
    $result = $null
    $v = Get-Variants $path
    $base = $v[0]
    $ignored = $NeverGame -contains $base
    foreach ($k in $v) { if ($script:Ignore.ContainsKey($k)) { $ignored = $true; break } }
    if (-not $ignored) {
        foreach ($k in @($v | Sort-Object Length -Descending)) {
            if ($script:Custom.ContainsKey($k)) {
                $c = $script:Custom[$k]
                $result = [pscustomobject]@{ Exe = $base; Id = ''; Name = $c.Name; Icon = ''; Steam = ''; Args = ''; Image = $c.Image; Via = 'my-games' }
                break
            }
        }
        if (-not $result -and $MakeApps.ContainsKey($base)) {
            $result = [pscustomobject]@{ Exe = $base; Id = ''; Name = $MakeApps[$base]; Icon = ''; Steam = ''; Args = ''; Image = ''; Via = 'app'; Kind = 'make' }
        }
        if (-not $result) {
            # najpierw najdłuższe (najbardziej konkretne) ścieżki, np. garrysmod/hl2.exe przed hl2.exe
            $keys = @($v | Sort-Object Length -Descending) + @('>' + $base)
            foreach ($k in $keys) {
                if (-not $script:ByExe.ContainsKey($k)) { continue }
                foreach ($e in $script:ByExe[$k]) {
                    if ($e.Args -and ($null -eq $cmd -or $cmd.IndexOf($e.Args, [StringComparison]::OrdinalIgnoreCase) -lt 0)) { continue }
                    $result = [pscustomobject]@{ Exe = $base; Id = $e.Id; Name = $e.Name; Icon = $e.Icon; Steam = $e.Steam; Args = $e.Args; Image = ''; Via = 'discord-db' }
                    break
                }
                if ($result) { break }
            }
        }
    }
    if (-not $result -and -not $ignored -and $path) {
        $rp = $null; try { $rp = Get-RenPyName $path } catch {}
        if ($rp) { $result = [pscustomobject]@{ Exe = $base; Id = ''; Name = $rp; Icon = ''; Steam = ''; Args = ''; Image = ''; Via = 'renpy'; Kind = 'vn' } }
    }
    $script:MatchCache[$key] = $result
    return $result
}

# ---------------------------------------------------------------- Steam
$script:SteamNames = @{}
if (Test-Path $SteamCache) {
    foreach ($line in [IO.File]::ReadAllLines($SteamCache, [Text.Encoding]::UTF8)) {
        $f = $line.Split("`t"); if ($f.Length -ge 3) { $script:SteamNames[$f[0]] = [pscustomobject]@{ Name = $f[1]; Header = $f[2] } }
    }
}
function Get-SteamInfo([string]$id) {
    if ($script:SteamNames.ContainsKey($id)) { return $script:SteamNames[$id] }
    $name = ''; $header = ''
    try { $name = [string](Get-ItemProperty "HKCU:\Software\Valve\Steam\Apps\$id" -Name Name -ErrorAction Stop).Name } catch {}
    try {
        $r = Invoke-RestMethod -UseBasicParsing -TimeoutSec 5 -Uri "https://store.steampowered.com/api/appdetails?appids=$id&filters=basic"
        $d = $r.$id
        if ($d -and $d.success) {
            if ($d.data.type -and $d.data.type -ne 'game' -and $d.data.type -ne 'demo') { $name = '' ; $header = 'not-a-game' }
            else { if (-not $name) { $name = [string]$d.data.name }; $header = [string]$d.data.header_image }
        }
    } catch {}
    if (-not $name -and $header -ne 'not-a-game' -and $script:BySteam.ContainsKey($id)) { $name = $script:BySteam[$id].Name }
    $info = [pscustomobject]@{ Name = (Clean $name); Header = (Clean $header) }
    # zapamiętaj tylko pewny wynik; bez internetu spróbujemy znowu przy kolejnym uruchomieniu
    if ($info.Name -or $info.Header -eq 'not-a-game') {
        $script:SteamNames[$id] = $info
        [IO.File]::AppendAllText($SteamCache, "$id`t$($info.Name)`t$($info.Header)`n", $Utf8NoBom)
    }
    return $info
}
function Get-SteamRunning {
    try { $id = [string](Get-ItemProperty 'HKCU:\Software\Valve\Steam' -Name RunningAppID -ErrorAction Stop).RunningAppID } catch { return $null }
    if (-not $id -or $id -eq '0') { return $null }
    if ($SteamNotGames -contains $id -or $script:Ignore.ContainsKey("steam:$id")) { return $null }
    $info = Get-SteamInfo $id
    if (-not $info.Name -or $info.Header -eq 'not-a-game') { return $null }
    return [pscustomobject]@{ Steam = $id; Name = $info.Name; Header = $info.Header }
}

# ---------------------------------------------------------------- okno na pierwszym planie
if (-not ('VMGameDetector.Win' -as [type])) {
    Add-Type -Namespace VMGameDetector -Name Win -MemberDefinition @'
[DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
[DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
'@
}
# okno gry dla OBS: «tytuł:klasa:plik.exe» (tak zapisuje je źródło przechwytywania okna / gry)
if (-not ('VMGameDetector.Win2' -as [type])) {
    Add-Type -Namespace VMGameDetector -Name Win2 -MemberDefinition @'
[DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetClassName(IntPtr hWnd, System.Text.StringBuilder s, int n);
'@
}
function Get-WindowSpec([int]$procId) {
    if (-not $procId) { return $null }
    try {
        $pr = Get-Process -Id $procId -ErrorAction Stop
        $h = $pr.MainWindowHandle
        if ($h -eq [IntPtr]::Zero) { return $null }
        $sb = New-Object Text.StringBuilder 256
        [void][VMGameDetector.Win2]::GetClassName($h, $sb, 256)
        $exe = [IO.Path]::GetFileName($pr.Path)
        $enc = { param($t) ([string]$t).Replace('#', '#22').Replace(':', '#3A') }
        return [pscustomobject]@{ spec = (& $enc $pr.MainWindowTitle) + ':' + (& $enc $sb.ToString()) + ':' + (& $enc $exe); title = $pr.MainWindowTitle; exe = $exe }
    } catch { return $null }
}

function Get-ForegroundPid {
    $h = [VMGameDetector.Win]::GetForegroundWindow()
    $fgPid = [uint32]0
    [void][VMGameDetector.Win]::GetWindowThreadProcessId($h, [ref]$fgPid)
    return [int]$fgPid
}

# ---------------------------------------------------------------- skan
$script:State = [pscustomobject]@{ game = $null; recent = @() }
$script:Current = $null          # klucz bieżącej gry
$script:FirstSeen = @{}
$script:Recent = New-Object Collections.ArrayList

function Get-Images($m) {
    $list = New-Object Collections.ArrayList
    if ($m.Image) { [void]$list.Add($m.Image) }
    if ($m.Header) { [void]$list.Add($m.Header) }
    if ($m.Steam) {
        [void]$list.Add("https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/$($m.Steam)/header.jpg")
        [void]$list.Add("https://cdn.cloudflare.steamstatic.com/steam/apps/$($m.Steam)/header.jpg")
    }
    if ($m.Id -and $m.Icon) { [void]$list.Add("https://cdn.discordapp.com/app-icons/$($m.Id)/$($m.Icon).png?size=256") }
    return , @($list | Select-Object -Unique)
}

# gry, które startują launcherem, a potem uruchamiają osobny program dla każdej części (Steam wciąż zgłasza launcher)
# Re – nazwa pliku procesu, Name – nazwa części, Family – do jakiej wykrytej gry (launchera) pasuje
$GameParts = @(
    @{ Re = '^masseffect1?\.exe$'; Name = 'Mass Effect 1'; Family = 'mass effect' }
    @{ Re = '^masseffect2\.exe$'; Name = 'Mass Effect 2'; Family = 'mass effect' }
    @{ Re = '^masseffect3\.exe$'; Name = 'Mass Effect 3'; Family = 'mass effect' }
    @{ Re = '^masseffectandromeda\.exe$'; Name = 'Mass Effect: Andromeda'; Family = 'mass effect' }
    @{ Re = '^gamemd\.exe$'; Name = "Command & Conquer: Red Alert 2 – Yuri's Revenge"; Family = 'red alert|command|c&c' }
    @{ Re = '^ra3ep1.*\.game$'; Name = 'Command & Conquer: Red Alert 3 – Uprising'; Family = 'red alert|command|c&c' }
    @{ Re = '^ra3_.*\.game$'; Name = 'Command & Conquer: Red Alert 3'; Family = 'red alert|command|c&c' }
    @{ Re = '^cnc3ep1.*\.(dat|exe)$'; Name = "Command & Conquer 3: Kane's Wrath"; Family = 'command|c&c|tiberium' }
    @{ Re = '^cnc3game\.dat$'; Name = 'Command & Conquer 3: Tiberium Wars'; Family = 'command|c&c|tiberium' }
)
# programy do tworzenia (nie gry): karta mówi «Teraz tworzę», a flagowanie botów nie traktuje tego jak grania
$MakeApps = @{
    'blender.exe' = 'Blender'; 'blender-launcher.exe' = 'Blender'; 'zbrush.exe' = 'ZBrush'; 'substance painter.exe' = 'Substance 3D Painter'
    'adobe substance 3d painter.exe' = 'Substance 3D Painter'; 'houdini.exe' = 'Houdini'; 'houdinifx.exe' = 'Houdini'; 'maya.exe' = 'Maya'
    '3dsmax.exe' = '3ds Max'; 'cinema 4d.exe' = 'Cinema 4D'; 'krita.exe' = 'Krita'; 'aseprite.exe' = 'Aseprite'; 'clipstudiopaint.exe' = 'Clip Studio Paint'
    'photoshop.exe' = 'Photoshop'; 'procreate.exe' = 'Procreate'; 'unity.exe' = 'Unity'; 'unrealeditor.exe' = 'Unreal Editor'; 'godot.exe' = 'Godot'
}
# gra na silniku Ren'Py (visual novel): nazwa z folderu gry, np. «Soulcreek-0.10-pc» → «Soulcreek»
function Get-RenPyName([string]$path) {
    $dir = Split-Path $path
    $root = $null
    if ($path -match '\\lib\\(py\d-)?windows-(x86_64|i686)\\[^\\]+$') { $root = Split-Path (Split-Path $dir) }
    elseif ((Test-Path (Join-Path $dir 'renpy')) -and (Test-Path (Join-Path $dir 'game'))) { $root = $dir }
    if (-not $root) { return $null }
    $leaf = Split-Path $root -Leaf
    $n = ($leaf -replace '[-_ ]v?\d+([._]\d+)*.*$', '') -replace '[-_]+', ' '
    if (-not $n.Trim()) { $n = $leaf }
    return $n.Trim()
}
# ---------------------------------------------------------------- biblioteka: każda wykryta gra / program, do uruchamiania z panelu
$LibraryFile = Join-Path $DataDir 'library.json'
$script:Library = @{}
if (Test-Path $LibraryFile) { try { $lj = (Get-Content $LibraryFile -Raw -Encoding UTF8) | ConvertFrom-Json; foreach ($pp in $lj.PSObject.Properties) { $script:Library[$pp.Name] = $pp.Value } } catch {} }
$script:LibDirty = $false; $script:LibSaved = Get-Date; $script:LibCurrent = ''; $script:LibTick = Get-Date
function Save-Library([switch]$Force) {
    if (-not $script:LibDirty) { return }
    if (-not $Force -and ((Get-Date) - $script:LibSaved).TotalSeconds -lt 30) { return }
    $script:LibDirty = $false; $script:LibSaved = Get-Date
    try { [IO.File]::WriteAllText($LibraryFile, ([pscustomobject]$script:Library | ConvertTo-Json -Depth 4 -Compress), $Utf8NoBom) } catch {}
}
# ---------------------------------------------------------------- Steam: zainstalowane gry i grafiki z pamięci Steama
# Grafiki (logo, tło, nagłówek) bierzemy z folderu, który Steam sam pobrał na ten komputer (appcache\librarycache),
# a gdy ich tam nie ma – z publicznego CDN Steama. Niczego nie kopiujemy do repozytorium; prawa do grafik
# mają ich właściciele (patrz CREDITS.md → «Grafiki gier»).
function Get-SteamRoot {
    try { $p = [string](Get-ItemProperty 'HKCU:\Software\Valve\Steam' -Name SteamPath -ErrorAction Stop).SteamPath; if ($p) { return $p.Replace('/', '\') } } catch {}
    return ''
}
function Get-SteamLibraries {
    $root = Get-SteamRoot; if (-not $root) { return @() }
    $libs = New-Object Collections.ArrayList; [void]$libs.Add((Join-Path $root 'steamapps'))
    $vdf = Join-Path $root 'steamapps\libraryfolders.vdf'
    if (Test-Path $vdf) {
        foreach ($mm in [regex]::Matches([IO.File]::ReadAllText($vdf), '"path"\s+"([^"]+)"')) {
            $sa = Join-Path ($mm.Groups[1].Value.Replace('\\', '\')) 'steamapps'
            if ((Test-Path $sa) -and -not ($libs -contains $sa)) { [void]$libs.Add($sa) }
        }
    }
    return @($libs)
}
$script:SteamInstalled = $null; $script:SteamInstalledAt = [DateTime]::MinValue
function Get-SteamInstalled {
    if ($script:SteamInstalled -and ((Get-Date) - $script:SteamInstalledAt).TotalMinutes -lt 10) { return $script:SteamInstalled }
    $list = New-Object Collections.ArrayList
    foreach ($lib in Get-SteamLibraries) {
        foreach ($f in @(Get-ChildItem -LiteralPath $lib -Filter 'appmanifest_*.acf' -ErrorAction SilentlyContinue)) {
            try {
                $t = [IO.File]::ReadAllText($f.FullName)
                $id = ([regex]::Match($t, '"appid"\s+"(\d+)"')).Groups[1].Value
                $nm = ([regex]::Match($t, '"name"\s+"([^"]+)"')).Groups[1].Value
                $dir = ([regex]::Match($t, '"installdir"\s+"([^"]+)"')).Groups[1].Value
                if (-not $id -or $SteamNotGames -contains $id -or $nm -match '(?i)redistributable|steamworks|proton|runtime|dedicated server|sdk$') { continue }
                [void]$list.Add([pscustomobject]@{ id = "steam:$id"; name = (Clean $nm); steam = $id; dir = (Join-Path $lib "common\$dir") })
            } catch {}
        }
    }
    $script:SteamInstalled = @($list); $script:SteamInstalledAt = Get-Date
    return $script:SteamInstalled
}
# numer gry Steam z ścieżki programu (…\steamapps\common\<folder>\…)
function Get-SteamIdFromPath([string]$path) {
    if (-not $path) { return '' }
    $mm = [regex]::Match($path, '\\steamapps\\common\\([^\\]+)', 'IgnoreCase'); if (-not $mm.Success) { return '' }
    $dir = $mm.Groups[1].Value
    $hit = @(Get-SteamInstalled | Where-Object { (Split-Path $_.dir -Leaf) -eq $dir }) | Select-Object -First 1
    if ($hit) { return $hit.steam } else { return '' }
}
$ArtNames = @{ logo = @('logo.png'); hero = @('library_hero.jpg', 'library_hero.png'); header = @('header.jpg'); cover = @('library_600x900.jpg', 'library_capsule.jpg') }
function Get-SteamArtFile([string]$id, [string]$kind) {
    if ($id -notmatch '^\d+$' -or -not $ArtNames.ContainsKey($kind)) { return '' }
    $root = Get-SteamRoot; if (-not $root) { return '' }
    $lc = Join-Path $root 'appcache\librarycache'
    foreach ($n in $ArtNames[$kind]) { $f = Join-Path $lc "${id}_$n"; if (Test-Path -LiteralPath $f) { return $f } }
    $d = Join-Path $lc $id
    if (Test-Path -LiteralPath $d) {
        foreach ($n in $ArtNames[$kind]) { $f = @(Get-ChildItem -LiteralPath $d -Recurse -Filter $n -ErrorAction SilentlyContinue) | Select-Object -First 1; if ($f) { return $f.FullName } }
    }
    return ''
}
function Get-GameArt([string]$id) {
    if ($id -notmatch '^\d+$') { return $null }
    # /art podaje plik z pamięci Steama, a gdy go nie ma – przekierowuje na CDN Steama
    return [pscustomobject]@{ logo = "/art?id=$id&k=logo"; hero = "/art?id=$id&k=hero"; header = "/art?id=$id&k=header"; cover = "/art?id=$id&k=cover" }
}

function Update-Library($m, [string]$path) {
    if (-not $m.Steam -and $path) { $sid = Get-SteamIdFromPath $path; if ($sid) { $m = $m.PSObject.Copy(); $m.Steam = $sid } }
    $id = if ($m.Steam) { 'steam:' + $m.Steam } elseif ($path) { 'exe:' + $path.ToLowerInvariant() } else { '' }
    if (-not $id) { return }
    $now = Get-Date
    $e = $script:Library[$id]
    if (-not $e) {
        $e = [pscustomobject]@{ id = $id; name = $m.Name; path = $path; exe = $m.Exe; steam = [string]$m.Steam; kind = [string]$m.Kind; first = $now.ToString('o'); last = ''; plays = 0; minutes = 0; hidden = $false }
        $script:Library[$id] = $e
        Log "Biblioteka: zapisano $($m.Name)" 'DarkCyan'
    }
    if (-not $e.path -and $path) { $e.path = $path }
    if ($script:LibCurrent -ne $id) { $e.plays = [int]$e.plays + 1; $script:LibCurrent = $id; $script:LibTick = $now }
    $e.minutes = [Math]::Round([double]$e.minutes + ($now - $script:LibTick).TotalMinutes, 1); $script:LibTick = $now
    $e.last = $now.ToString('o'); $script:LibDirty = $true
    Save-Library
}
function Start-LibraryItem([string]$id) {
    $e = $script:Library[$id]
    if (-not $e -and $id -match '^steam:(\d+)$') { Start-Process ("steam://rungameid/" + $Matches[1]); Log "Uruchamiam: $id (Steam)" 'Cyan'; return '' }
    if (-not $e) { return 'nie ma takiej pozycji w bibliotece' }
    if ($e.steam) { Start-Process ("steam://rungameid/" + $e.steam); Log "Uruchamiam: $($e.name) (Steam)" 'Cyan'; return '' }
    if ($e.path -and (Test-Path -LiteralPath $e.path)) { Start-Process -FilePath $e.path -WorkingDirectory (Split-Path $e.path); Log "Uruchamiam: $($e.name)" 'Cyan'; return '' }
    return 'nie znaleziono pliku programu'
}

function Update-State {
    Import-Custom
    $fgPid = Get-ForegroundPid
    $procs = Get-CimInstance -ClassName Win32_Process -Property ProcessId, ExecutablePath, CommandLine, CreationDate -ErrorAction SilentlyContinue
    $found = New-Object Collections.ArrayList
    $fgPath = $null
    $part = $null
    foreach ($p in $procs) {
        $path = $p.ExecutablePath
        if (-not $path) { continue }
        if ($p.ProcessId -eq $fgPid) { $fgPath = $path }
        $pexe = [IO.Path]::GetFileName($path).ToLowerInvariant()
        foreach ($gp in $GameParts) {
            if ($pexe -notmatch $gp.Re) { continue }
            $pn = $gp.Name; if ($path -match 'legendary' -and $pn -match '^Mass Effect \d') { $pn += ' (Legendary Edition)' }
            $part = [pscustomobject]@{ Name = $pn; Exe = $pexe; Start = $p.CreationDate; Family = $gp.Family; Pid = $p.ProcessId; Path = $path }
            break
        }
        $m = Find-Game $path $p.CommandLine
        if ($m) { [void]$found.Add([pscustomobject]@{ M = $m; Pid = $p.ProcessId; Start = $p.CreationDate; Path = $path }) }
    }

    # ostatnie okna na pierwszym planie (do «Dodaj jako grę» w panelu)
    if ($fgPath) {
        $exe = [IO.Path]::GetFileName($fgPath).ToLowerInvariant()
        if ($NeverGame -notcontains $exe -and $exe -ne 'msedgewebview2.exe') {
            $title = ''
            try { $title = (Get-Process -Id $fgPid -ErrorAction Stop).MainWindowTitle } catch {}
            $old = @($script:Recent | Where-Object { $_.exe -eq $exe })
            foreach ($o in $old) { $script:Recent.Remove($o) }
            $script:Recent.Insert(0, [pscustomobject]@{ exe = $exe; title = $title })
            while ($script:Recent.Count -gt 6) { $script:Recent.RemoveAt($script:Recent.Count - 1) }
        }
    }

    # wybór gry: Steam > gra na pierwszym planie > dotychczasowa > najnowsza
    $pick = $null
    $steam = Get-SteamRunning
    if ($steam) {
        $same = @($found | Where-Object { $_.M.Steam -eq $steam.Steam }) | Select-Object -First 1
        $m = [pscustomobject]@{ Exe = ''; Id = ''; Name = $steam.Name; Icon = ''; Steam = $steam.Steam; Image = ''; Header = $steam.Header; Via = 'steam' }
        if ($same) { $m.Exe = $same.M.Exe; $m.Id = $same.M.Id; $m.Icon = $same.M.Icon; if ($same.M.Via -eq 'my-games') { $m.Name = $same.M.Name; $m.Image = $same.M.Image } }
        # okno gry ze Steama: proces z listy albo – gdy go nie znamy – okno na pierwszym planie z folderu steamapps
        $spid = 0; $spath = ''
        if ($same) { $spid = $same.Pid; $spath = $same.Path } elseif ($fgPath -and $fgPath -match '\\steamapps\\common\\') { $spid = $fgPid; $spath = $fgPath }
        $pick = [pscustomobject]@{ M = $m; Start = $(if ($same) { $same.Start } else { $null }); Pid = $spid; Path = $spath }
    }
    if (-not $pick -and $found.Count) {
        $pick = @($found | Where-Object { $_.Pid -eq $fgPid }) | Select-Object -First 1
        if (-not $pick) { $pick = @($found | Where-Object { $_.M.Name -eq $script:Current }) | Select-Object -First 1 }
        if (-not $pick) { $pick = @($found | Sort-Object Start -Descending) | Select-Object -First 1 }
    }

    # launcher → konkretna część (np. Mass Effect Legendary Edition → Mass Effect 2 (Legendary Edition))
    if ($part) {
        if ($pick -and $pick.M.Name -match $part.Family) {
            $m2 = $pick.M.PSObject.Copy(); $m2.Name = $part.Name; $m2.Exe = $part.Exe
            $pick = [pscustomobject]@{ M = $m2; Start = $part.Start; Pid = $part.Pid; Path = $part.Path }
        } elseif (-not $pick) {
            $pick = [pscustomobject]@{ M = [pscustomobject]@{ Exe = $part.Exe; Id = ''; Name = $part.Name; Icon = ''; Steam = ''; Args = ''; Image = ''; Header = ''; Via = 'part' }; Start = $part.Start; Pid = $part.Pid; Path = $part.Path }
        }
    }

    $game = $null
    if ($pick) {
        $m = $pick.M
        if (-not $script:FirstSeen.ContainsKey($m.Name)) { $script:FirstSeen[$m.Name] = Get-Date }
        $start = $pick.Start
        if (-not $start) { $start = $script:FirstSeen[$m.Name] }
        $game = [pscustomobject]@{
            name   = $m.Name
            exe    = $m.Exe
            via    = $m.Via
            steam  = $m.Steam
            start  = [long]([DateTimeOffset]$start).ToUnixTimeMilliseconds()
            images = (Get-Images $m)
            kind   = [string]$m.Kind
            window = ''
            path   = [string]$pick.Path
        }
        if (-not $game.steam -and $game.path) { $game.steam = Get-SteamIdFromPath $game.path }
        $game | Add-Member -NotePropertyName art -NotePropertyValue (Get-GameArt ([string]$game.steam))
        $ws = Get-WindowSpec ([int]$pick.Pid)
        if ($ws) { $game.window = $ws.spec }
        try { Update-Library $m ([string]$pick.Path) } catch {}
        if ($script:Current -ne $m.Name) {
            $from = $m.Via; if ($m.Exe) { $from += ", $($m.Exe)" }
            Log "Gra: $($m.Name)   ($from)" 'Cyan'
        }
        $script:Current = $m.Name
    } elseif ($script:Current) {
        Log "Koniec gry: $script:Current" 'DarkGray'
        $script:FirstSeen.Remove($script:Current)
        $script:Current = $null
    }
    if (-not $game) { $script:LibCurrent = '' }
    $script:State = [pscustomobject]@{ game = $game; recent = @($script:Recent) }
}

# ---------------------------------------------------------------- zdarzenia (alerty)
$script:Events = New-Object Collections.ArrayList
$script:EventSeq = 0
function Add-Event($ev) {
    $script:EventSeq++
    $ev | Add-Member -NotePropertyName id -NotePropertyValue $script:EventSeq -Force
    $ev | Add-Member -NotePropertyName at -NotePropertyValue ([DateTimeOffset]::Now.ToUnixTimeMilliseconds()) -Force
    [void]$script:Events.Add($ev)
    while ($script:Events.Count -gt 400) { $script:Events.RemoveAt(0) }
    Add-SessionEvent $ev
    try { Write-ArchiveEvent $ev } catch { Log "Archiwum: $($_.Exception.Message)" 'DarkYellow' }
    $who = ''; if ($ev.user) { $who = $ev.user }
    if ($ev.type -ne 'chat') { Log ("Alert: {0} {1}" -f $ev.type, $who) 'Magenta' }
}

# ---------------------------------------------------------------- sesja (do napisów końcowych)
$script:Session = @{ chatters = [ordered]@{}; follow = [ordered]@{}; sub = [ordered]@{}; gift = [ordered]@{}; cheer = [ordered]@{}; raid = [ordered]@{}; redeem = [ordered]@{}; started = (Get-Date) }
function Add-SessionEvent($ev) {
    if ($ev.test -or -not $ev.user) { return }
    $u = [string]$ev.user
    switch ($ev.type) {
        'chat'   { $script:Session.chatters[$u] = 1 + [int]$script:Session.chatters[$u] }
        'follow' { $script:Session.follow[$u] = 1 }
        'sub'    { $script:Session.sub[$u] = 1 }
        'resub'  { $script:Session.sub[$u] = [int]$ev.months }
        'gift'   { $script:Session.gift[$u] = [int]$script:Session.gift[$u] + [int]$ev.count }
        'cheer'  { $script:Session.cheer[$u] = [int]$script:Session.cheer[$u] + [int]$ev.amount }
        'raid'   { $script:Session.raid[$u] = [int]$ev.viewers }
        'redeem' { $script:Session.redeem[$u] = 1 + [int]$script:Session.redeem[$u] }
    }
}
function Get-Session {
    $o = [ordered]@{ started = $script:Session.started.ToString('o') }
    foreach ($k in @('chatters', 'follow', 'sub', 'gift', 'cheer', 'raid', 'redeem')) {
        $o[$k] = @($script:Session[$k].GetEnumerator() | ForEach-Object { [pscustomobject]@{ user = $_.Key; n = $_.Value } })
    }
    return [pscustomobject]$o
}

# ---------------------------------------------------------------- czat: wygląd wybrany przez widzów i efekty
$ViewersFile = Join-Path $DataDir 'viewers.json'
$script:Viewers = @{}
if (Test-Path $ViewersFile) {
    try { $vj = (Get-Content $ViewersFile -Raw -Encoding UTF8) | ConvertFrom-Json; foreach ($pp in $vj.PSObject.Properties) { $script:Viewers[$pp.Name] = $pp.Value } } catch {}
}
$ChatStyles = @('neon', 'szklo', 'pixel', 'komiks', 'terminal', 'papier', 'holo', 'sakura', 'ogien', 'lod')
$ChatColors = @{ czerwony = '#ff4d5e'; pomaranczowy = '#ff9f43'; zolty = '#ffd43b'; zielony = '#4cd97b'; turkus = '#2ee6d6'; niebieski = '#4c9dff'; fiolet = '#a77bff'; rozowy = '#ff6fb5'; bialy = '#f4f4f8'; zloty = '#e8b84a' }
$ChatEffects = @('konfetti', 'serca', 'gwiazdy', 'fajerwerki', 'iskry', 'babelki')
$script:EffectCooldown = @{}; $script:EffectGlobal = [DateTime]::MinValue

function Remove-Diacritics([string]$t) {
    $n = $t.ToLowerInvariant().Normalize([Text.NormalizationForm]::FormD)
    $sb = New-Object Text.StringBuilder
    foreach ($c in $n.ToCharArray()) { if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($c) -ne 'NonSpacingMark') { [void]$sb.Append($c) } }
    return $sb.ToString().Replace('ł', 'l')
}
function Save-Viewers {
    [IO.File]::WriteAllText($ViewersFile, ([pscustomobject]$script:Viewers | ConvertTo-Json -Depth 4 -Compress), $Utf8NoBom)
}
# zwraca $true, jeśli wiadomość była komendą (wtedy pokazujemy potwierdzenie zamiast treści)
function Invoke-ChatCommand($login, $user, [string]$text) {
    $t = $text.Trim()
    if (-not $t.StartsWith('!')) { return $null }
    $parts = $t.Substring(1).Split(' ', 2, [StringSplitOptions]::RemoveEmptyEntries)
    if (-not $parts.Length) { return $null }
    $cmd = Remove-Diacritics $parts[0]
    $arg = if ($parts.Length -gt 1) { Remove-Diacritics $parts[1].Trim() } else { '' }
    $v = $script:Viewers[$login]; if (-not $v) { $v = [pscustomobject]@{ style = ''; color = '' } }
    switch ($cmd) {
        { $_ -in @('styl', 'style') } {
            if ($arg -eq 'szklo' -or $arg -eq 'glass') { $arg = 'szklo' }
            if ($ChatStyles -notcontains $arg) { return "style: $($ChatStyles -join ', ')" }
            $v.style = $arg; $script:Viewers[$login] = $v; Save-Viewers; return "styl: $arg ✓"
        }
        { $_ -in @('kolor', 'color') } {
            $hex = $null
            if ($arg -match '^#?[0-9a-f]{6}$') { $hex = '#' + $arg.TrimStart('#') } elseif ($ChatColors.ContainsKey($arg)) { $hex = $ChatColors[$arg] }
            if (-not $hex) { return "kolory: $(($ChatColors.Keys | Sort-Object) -join ', ') albo #rrggbb" }
            $v.color = $hex; $script:Viewers[$login] = $v; Save-Viewers; return "kolor: $arg ✓"
        }
        { $_ -in @('efekt', 'effect') } {
            if ($ChatEffects -notcontains $arg) { return "efekty: $($ChatEffects -join ', ')" }
            $now = Get-Date
            $last = $script:EffectCooldown[$login]
            if ($last -and ($now - $last).TotalSeconds -lt 60) { return "efekt za $([int](60 - ($now - $last).TotalSeconds)) s" }
            if (($now - $script:EffectGlobal).TotalSeconds -lt 15) { return 'chwila – efekt właśnie leci' }
            $script:EffectCooldown[$login] = $now; $script:EffectGlobal = $now
            Add-Event ([pscustomobject]@{ type = 'effect'; effect = $arg; user = $user })
            return "efekt: $arg ✓"
        }
        { $_ -in @('reset') } { $script:Viewers.Remove($login); Save-Viewers; return 'wygląd: domyślny ✓' }
    }
    return $null
}
function New-ChatEvent($login, $user, [string]$color, [string]$text, $fragments, $badges, [bool]$test = $false, [string]$userId = '', [double]$fakeAge = -2) {
    $reply = Invoke-ChatCommand $login $user $text
    $v = $script:Viewers[$login]
    # flaga: nowe konto, link, tekst bota, «fajnie grasz» gdy nikt nie gra (panel → Czat i statystyki)
    $flag = $null
    if (-not $reply) {
        $rec = if ($test) { [pscustomobject]@{ login = $login; msgs = 0; trust = $false; created = '' } } else { Get-ChatterRecord $login $user }
        try { $flag = Get-ChatFlag $rec $text $badges $userId $fakeAge } catch {}
    }
    return [pscustomobject]@{
        type = 'chat'; user = $user; login = $login; text = $text; fragments = @($fragments); badges = @($badges)
        color = $(if ($v -and $v.color) { $v.color } elseif ($color) { $color } else { '' })
        style = $(if ($v -and $v.style) { $v.style } else { '' })
        command = [bool]$reply; reply = $(if ($reply) { [string]$reply } else { '' }); test = $test; flag = $flag
    }
}

# ---------------------------------------------------------------- archiwum: zapis czatu i zdarzeń, statystyki, flagowanie botów
# data\archive\chatters.json            – każdy czatownik: pierwsza/ostatnia wizyta, liczba wiadomości, wiek konta, zaufany
# data\archive\streams\<id>.jsonl       – wszystko z jednego streama (czat + alerty), linia = jedno zdarzenie
# data\archive\streams\<id>.json        – podsumowanie (zapisywane co 2 min i na końcu streama)
# Stream = od stream.online do stream.offline z Twitcha; czat poza streamem trafia do «poza-streamem-<data>».
$ArchiveDir = Join-Path $DataDir 'archive'
$StreamsDir = Join-Path $ArchiveDir 'streams'
$ChattersFile = Join-Path $ArchiveDir 'chatters.json'
New-Item -ItemType Directory -Force -Path $StreamsDir | Out-Null
$script:Chatters = @{}
if (Test-Path $ChattersFile) {
    try { $cj = (Get-Content $ChattersFile -Raw -Encoding UTF8) | ConvertFrom-Json; foreach ($pp in $cj.PSObject.Properties) { $script:Chatters[$pp.Name] = $pp.Value } } catch {}
}
$script:ChattersDirty = $false; $script:ChattersSaved = Get-Date
$script:Channel = [pscustomobject]@{ live = $false; category = ''; title = ''; viewers = 0; startedAt = $null; nextPoll = [DateTime]::MinValue }
$script:Cur = $null
$script:RecentTexts = New-Object Collections.ArrayList
$NonGameCategories = @('art', 'software and game development', 'makers & crafting', 'just chatting', 'music', 'science & technology', 'talk shows & podcasts', 'food & drink', 'special events', 'travel & outdoors', 'fitness & health', 'beauty & body art', 'animals, aquariums, and zoos', 'asmr', 'pools, hot tubs, and beaches')

function New-StreamStats([string]$id, [datetime]$start, [bool]$live) {
    return [pscustomobject]@{
        id = $id; live = $live; start = $start.ToString('o'); end = ''; title = $script:Channel.title; category = $script:Channel.category
        games = @{}; msgs = 0; chatters = @{}; newChatters = 0; follows = 0; subs = 0; gifts = 0; bits = 0; raids = 0; raidViewers = 0; redeems = 0
        viewers = New-Object Collections.ArrayList; peak = 0; flagged = @{}; perSlot = @{}; saved = [DateTime]::MinValue
    }
}
function Get-StreamId([datetime]$start, [bool]$live) {
    if ($live) { return $start.ToString('yyyy-MM-dd_HHmm') }
    return 'poza-streamem-' + (Get-Date).ToString('yyyy-MM-dd')
}
function Open-StreamArchive([bool]$live, $start = $null) {
    if (-not $start) { $start = Get-Date }
    $id = Get-StreamId $start $live
    if ($script:Cur -and $script:Cur.id -eq $id) { return }
    if ($script:Cur) { Close-StreamArchive }
    $script:Cur = New-StreamStats $id $start $live
    # restart wykrywacza w trakcie streama: dopisz do istniejącego podsumowania
    $f = Join-Path $StreamsDir "$id.json"
    if (Test-Path $f) {
        try {
            $o = (Get-Content $f -Raw -Encoding UTF8) | ConvertFrom-Json
            foreach ($k in @('msgs', 'newChatters', 'follows', 'subs', 'gifts', 'bits', 'raids', 'raidViewers', 'redeems', 'peak')) { $script:Cur.$k = [int]$o.$k }
            foreach ($c in @($o.top)) { if ($c.login) { $script:Cur.chatters[[string]$c.login] = [int]$c.n } }
            foreach ($g in @($o.games)) { if ($g) { $script:Cur.games[[string]$g] = 1 } }
            foreach ($v in @($o.viewers)) { [void]$script:Cur.viewers.Add($v) }
            foreach ($fl in @($o.flagged)) { if ($fl.login) { $script:Cur.flagged[[string]$fl.login] = $fl } }
        } catch {}
    }
    if ($live) { Log "Archiwum: stream $id" 'DarkCyan' }
}
function Close-StreamArchive {
    if (-not $script:Cur) { return }
    $script:Cur.end = (Get-Date).ToString('o')
    Save-StreamSummary
    if ($script:Cur.live) { Log "Archiwum: koniec streama $($script:Cur.id) – wiadomości: $($script:Cur.msgs), czatowników: $($script:Cur.chatters.Count)" 'DarkCyan' }
    $script:Cur = $null
}
function Get-StreamSummary($c) {
    if (-not $c) { return $null }
    $top = @($c.chatters.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 30 | ForEach-Object {
            $rec = $script:Chatters[$_.Key]; [pscustomobject]@{ login = $_.Key; name = $(if ($rec) { [string]$rec.name } else { $_.Key }); n = $_.Value } })
    $vs = @($c.viewers | ForEach-Object { [int]$_.v })
    $avg = 0; if ($vs.Count) { $avg = [int](($vs | Measure-Object -Average).Average) }
    $slots = @($c.perSlot.GetEnumerator() | Sort-Object Name | ForEach-Object { [pscustomobject]@{ t = $_.Name; n = $_.Value } })
    $dur = 0; try { $endT = if ($c.end) { [datetime]::Parse($c.end) } else { Get-Date }; $dur = [int]($endT - [datetime]::Parse($c.start)).TotalMinutes } catch {}
    return [pscustomobject]@{
        id = $c.id; live = $c.live; start = $c.start; end = $c.end; minutes = $dur; title = $c.title; category = $c.category; games = @($c.games.Keys)
        msgs = $c.msgs; chatters = $c.chatters.Count; newChatters = $c.newChatters; follows = $c.follows; subs = $c.subs; gifts = $c.gifts
        bits = $c.bits; raids = $c.raids; raidViewers = $c.raidViewers; redeems = $c.redeems; peak = $c.peak; avgViewers = $avg
        viewers = @($c.viewers); top = $top; flagged = @($c.flagged.Values); perSlot = $slots
    }
}
function Save-StreamSummary {
    $c = $script:Cur; if (-not $c) { return }
    $c.saved = Get-Date
    try { [IO.File]::WriteAllText((Join-Path $StreamsDir "$($c.id).json"), ((Get-StreamSummary $c) | ConvertTo-Json -Depth 6 -Compress), $Utf8NoBom) } catch {}
}
function Save-Chatters([switch]$Force) {
    if (-not $script:ChattersDirty) { return }
    if (-not $Force -and ((Get-Date) - $script:ChattersSaved).TotalSeconds -lt 60) { return }
    $script:ChattersDirty = $false; $script:ChattersSaved = Get-Date
    try { [IO.File]::WriteAllText($ChattersFile, ([pscustomobject]$script:Chatters | ConvertTo-Json -Depth 5 -Compress), $Utf8NoBom) } catch {}
}

# wiek konta z Twitcha (raz na czatownika, zapamiętany)
function Get-AccountAgeDays($rec, [string]$userId) {
    if (-not $rec.created -and $userId -and $script:TW.token -and $script:TW.status -eq 'online') {
        try { $u = Invoke-Helix 'GET' "users?id=$userId" $null; if ($u.data.Count) { $rec.created = [string]$u.data[0].created_at; $script:ChattersDirty = $true } } catch {}
    }
    if (-not $rec.created) { return -1 }
    try { return [Math]::Max(0, ((Get-Date).ToUniversalTime() - [datetime]::Parse($rec.created).ToUniversalTime()).TotalDays) } catch { return -1 }
}

# ocena wiadomości: świeże konto, link w pierwszej wiadomości, typowe teksty botów i «fajnie grasz», gdy nikt nie gra
function Get-ChatFlag($rec, [string]$text, $badges, [string]$userId, [double]$fakeAge = -2) {
    if ($rec.trust) { return $null }
    foreach ($b in @($badges)) { if (@('broadcaster', 'moderator', 'vip', 'subscriber', 'founder') -contains [string]$b) { return $null } }
    $t = Remove-Diacritics $text
    $first = [int]$rec.msgs -lt 1
    $early = [int]$rec.msgs -lt 3
    $score = 0; $why = New-Object Collections.ArrayList
    $age = if ($fakeAge -gt -2) { $fakeAge } elseif ($early) { Get-AccountAgeDays $rec $userId } else { -1 }
    if ($age -ge 0) {
        if ($age -lt 2) { $score += 3; [void]$why.Add(('konto ma {0} h' -f [int]($age * 24))) }
        elseif ($age -lt 14) { $score += 2; [void]$why.Add(('konto ma {0} dni' -f [int]$age)) }
        elseif ($age -lt 60 -and $first) { $score += 1; [void]$why.Add(('konto ma {0} dni' -f [int]$age)) }
    }
    $hasLink = $t -match '(https?://|www\.|\b[a-z0-9-]+\s?\.\s?(com|net|org|ru|xyz|io|gg|ly|shop|site|online|top)\b|discord\.gg)'
    if ($hasLink) { if ($early) { $score += 3; [void]$why.Add('link na początku znajomości') } else { $score += 1; [void]$why.Add('link') } }
    if ($t -match '(viewers|followers|follows|promot|cheap|best .{0,12}(viewers|followers)|streamboo|dogehype|bigfollows|grow your (channel|stream)|kup (widzow|followow)|rozkrec\w* kanal|remove the space|only ?fans|crypto|nft|forex)') {
        $score += 4; [void]$why.Add('tekst jak z reklamy widzów/followów')
    }
    if ($first -and $t -match '^\W*(hi|hello|hey|yo|siema|czesc|hej|witam)?\W*(streamer|bro|friend)?\W*(fajnie|super|swietnie|dobrze|niezle|ladnie|nice|great|good|cool|awesome|amazing|love)\W+(grasz|gra|stream\w*|content|gameplay|game|play\w*|channel|kanal|vibe|video)\b') {
        $score += 2; [void]$why.Add('ogólnikowe «fajny stream» na dzień dobry')
    }
    # pisze o graniu, a nikt nie gra (np. Blender, rozmowa)
    $gaming = [bool]$script:State.game -and $script:State.game.kind -ne 'make'
    $cat = ([string]$script:Channel.category).ToLowerInvariant()
    if (-not $gaming -and $cat -and $NonGameCategories -contains $cat -and $t -match '\b(grasz|grac|gra\b|gierk|gameplay|game|play(ing)?|gg|level|boss)') {
        $score += 3; [void]$why.Add("pisze o graniu, a kategoria to «$($script:Channel.category)»")
    } elseif (-not $gaming -and -not $cat -and $first -and $t -match '\b(grasz|gameplay|playing)\b') {
        $score += 2; [void]$why.Add('pisze o graniu, a nic nie jest uruchomione')
    }
    if ($first -and $text -match '\p{IsCyrillic}|\p{IsArabic}|\p{IsDevanagari}|\p{IsThai}' -and $text -notmatch '[a-zA-Z]{3}') { $score += 1; [void]$why.Add('inny alfabet') }
    # ten sam tekst od kilku osób w ciągu minuty
    $norm = ($t -replace '\W+', ' ').Trim()
    if ($norm.Length -ge 12) {
        $now = Get-Date
        while ($script:RecentTexts.Count -and ($now - $script:RecentTexts[0].at).TotalSeconds -gt 60) { $script:RecentTexts.RemoveAt(0) }
        $same = @($script:RecentTexts | Where-Object { $_.text -eq $norm -and $_.login -ne $rec.login }).Count
        [void]$script:RecentTexts.Add([pscustomobject]@{ text = $norm; login = $rec.login; at = $now })
        if ($same -ge 1) { $score += 2; [void]$why.Add('ten sam tekst od kilku kont') }
    }
    if ($score -lt 2) { return $null }
    return [pscustomobject]@{ level = $(if ($score -ge 4) { 'suspect' } else { 'watch' }); score = $score; reasons = @($why); ageDays = $(if ($age -ge 0) { [Math]::Round($age, 1) } else { $null }); first = $first }
}

function Get-ChatterRecord([string]$login, [string]$name) {
    $rec = $script:Chatters[$login]
    if (-not $rec) {
        $rec = [pscustomobject]@{ login = $login; name = $name; first = (Get-Date).ToString('o'); last = ''; msgs = 0; streams = 0; lastStream = ''; created = ''; trust = $false; flags = 0 }
        $script:Chatters[$login] = $rec; $script:ChattersDirty = $true
    }
    return $rec
}

# wywoływane dla każdego zdarzenia (Add-Event)
function Write-ArchiveEvent($ev) {
    if ($ev.test -or @('transition', 'effect') -contains [string]$ev.type) { return }
    if (-not $script:Cur) { Open-StreamArchive $false }
    $c = $script:Cur
    $u = [string]$ev.user
    switch ([string]$ev.type) {
        'chat' {
            if ($ev.command) { break }
            $c.msgs++
            $login = [string]$ev.login; if (-not $login) { $login = $u.ToLowerInvariant() }
            $c.chatters[$login] = 1 + [int]$c.chatters[$login]
            $rec = Get-ChatterRecord $login $u
            if ($rec.lastStream -ne $c.id) { $rec.streams = [int]$rec.streams + 1; $rec.lastStream = $c.id; if ([int]$rec.streams -eq 1) { $c.newChatters++ } }
            $rec.msgs = [int]$rec.msgs + 1; $rec.last = (Get-Date).ToString('o'); $rec.name = $u; $script:ChattersDirty = $true
            if ($ev.flag) {
                $rec.flags = [int]$rec.flags + 1
                $c.flagged[$login] = [pscustomobject]@{ login = $login; name = $u; level = $ev.flag.level; reasons = @($ev.flag.reasons); text = [string]$ev.text; at = (Get-Date).ToString('o') }
            }
        }
        'follow' { $c.follows++ }
        'sub' { $c.subs++ }
        'resub' { $c.subs++ }
        'gift' { $c.gifts += [int]$ev.count }
        'cheer' { $c.bits += [int]$ev.amount }
        'raid' { $c.raids++; $c.raidViewers += [int]$ev.viewers }
        'redeem' { $c.redeems++ }
    }
    $slot = (Get-Date).ToString('HH:') + ('{0:00}' -f ([Math]::Floor((Get-Date).Minute / 5) * 5))
    $c.perSlot[$slot] = 1 + [int]$c.perSlot[$slot]
    if ($script:State.game -and $script:State.game.name) { $c.games[[string]$script:State.game.name] = 1 }
    try {
        $line = [ordered]@{ t = [DateTimeOffset]::Now.ToUnixTimeMilliseconds() }
        foreach ($p in $ev.PSObject.Properties) { if (@('id', 'at', 'fragments', 'reply', 'test', 'style', 'color') -notcontains $p.Name) { $line[$p.Name] = $p.Value } }
        [IO.File]::AppendAllText((Join-Path $StreamsDir "$($c.id).jsonl"), (([pscustomobject]$line) | ConvertTo-Json -Depth 5 -Compress) + "`n", $Utf8NoBom)
    } catch {}
}

# co minutę: czy stream trwa, ilu widzów, jaka kategoria; zapis podsumowania i bazy czatowników
function Update-Archive {
    Save-Chatters
    if ($script:Cur -and ((Get-Date) - $script:Cur.saved).TotalSeconds -gt 120) { Save-StreamSummary }
    if ($script:TW.status -ne 'online' -or (Get-Date) -lt $script:Channel.nextPoll) { return }
    $script:Channel.nextPoll = (Get-Date).AddSeconds(60)
    try {
        $r = Invoke-Helix 'GET' "streams?user_id=$($script:TW.userId)" $null
        if ($r.data.Count) {
            $st = $r.data[0]
            $script:Channel.live = $true; $script:Channel.viewers = [int]$st.viewer_count
            $script:Channel.category = [string]$st.game_name; $script:Channel.title = [string]$st.title
            $start = [datetime]::Parse([string]$st.started_at).ToLocalTime()
            Open-StreamArchive $true $start
            $c = $script:Cur
            $c.title = $script:Channel.title; $c.category = $script:Channel.category
            [void]$c.viewers.Add([pscustomobject]@{ t = (Get-Date).ToString('HH:mm'); v = $script:Channel.viewers })
            if ($script:Channel.viewers -gt $c.peak) { $c.peak = $script:Channel.viewers }
        } else {
            if ($script:Cur -and $script:Cur.live) { Close-StreamArchive }
            $script:Channel.live = $false; $script:Channel.viewers = 0
            $ch = Invoke-Helix 'GET' "channels?broadcaster_id=$($script:TW.userId)" $null
            if ($ch.data.Count) { $script:Channel.category = [string]$ch.data[0].game_name; $script:Channel.title = [string]$ch.data[0].title }
            $script:Channel.nextPoll = (Get-Date).AddSeconds(180)
        }
    } catch {}
}

function Get-ArchiveList {
    $list = @(Get-ChildItem -Path $StreamsDir -Filter '*.json' -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 60 | ForEach-Object {
            try { $o = (Get-Content $_.FullName -Raw -Encoding UTF8) | ConvertFrom-Json; $o.PSObject.Properties.Remove('viewers'); $o.PSObject.Properties.Remove('top'); $o.PSObject.Properties.Remove('perSlot'); $o } catch { $null }
        } | Where-Object { $_ })
    $cur = $null; if ($script:Cur) { $cur = Get-StreamSummary $script:Cur }
    $flaggedNow = @()
    foreach ($rec in $script:Chatters.Values) { if ([int]$rec.flags -gt 0 -and -not $rec.trust) { $flaggedNow += $rec } }
    $totals = [pscustomobject]@{ chatters = $script:Chatters.Count; returning = @($script:Chatters.Values | Where-Object { [int]$_.streams -ge 2 }).Count; flagged = $flaggedNow.Count }
    return [pscustomobject]@{ current = $cur; streams = $list; totals = $totals; channel = $script:Channel }
}

# eksport czatu: txt (czas od początku), srt (napisy do nagrania), json
function Export-Stream([string]$id, [string]$fmt, [int]$offsetSec = 0) {
    $f = Join-Path $StreamsDir "$id.jsonl"
    if (-not (Test-Path $f)) { return $null }
    $sumF = Join-Path $StreamsDir "$id.json"
    $start = $null
    if (Test-Path $sumF) { try { $start = [DateTimeOffset]::Parse([string]((Get-Content $sumF -Raw -Encoding UTF8) | ConvertFrom-Json).start).ToUnixTimeMilliseconds() } catch {} }
    $lines = [IO.File]::ReadAllLines($f, [Text.Encoding]::UTF8)
    if ($fmt -eq 'json') { return '[' + ($lines -join ',') + ']' }
    $sb = New-Object Text.StringBuilder
    $n = 0
    foreach ($l in $lines) {
        try { $e = $l | ConvertFrom-Json } catch { continue }
        if (-not $start) { $start = [long]$e.t }
        $ms = [long]$e.t - $start + $offsetSec * 1000
        if ($ms -lt 0) { continue }
        $ts = [TimeSpan]::FromMilliseconds($ms)
        $who = [string]$e.user
        $what = switch ([string]$e.type) {
            'chat' { [string]$e.text } 'follow' { '★ obserwuje' } 'sub' { '★ sub' } 'resub' { "★ resub ($($e.months) mies.)" }
            'gift' { "★ gift ×$($e.count)" } 'cheer' { "★ $($e.amount) bitsów" } 'raid' { "★ raid ($($e.viewers) os.)" } 'redeem' { "★ nagroda: $($e.reward)" }
            default { [string]$e.type }
        }
        $flag = ''; if ($e.flag) { $flag = ' [' + $(if ($e.flag.level -eq 'suspect') { 'PODEJRZANE' } else { 'do sprawdzenia' }) + ']' }
        if ($fmt -eq 'srt') {
            $n++
            $end = $ts.Add([TimeSpan]::FromSeconds(4))
            [void]$sb.AppendLine($n).AppendLine(('{0:hh\:mm\:ss\,fff} --> {1:hh\:mm\:ss\,fff}' -f $ts, $end)).AppendLine("${who}: $what").AppendLine()
        } else {
            [void]$sb.AppendLine(('[{0:hh\:mm\:ss}] {1}: {2}{3}' -f $ts, $who, $what, $flag))
        }
    }
    return $sb.ToString()
}

# ---------------------------------------------------------------- Twitch (EventSub przez WebSocket)
# Logowanie: Device Code Flow (kod na twitch.tv/activate), aplikacja typu «Public» – bez sekretu.
# Token jest zaszyfrowany kontem Windows (DPAPI) w data\twitch-token.bin.
Add-Type -AssemblyName System.Security
$TwitchCfgFile = Join-Path $DataDir 'twitch.json'
$TwitchTokFile = Join-Path $DataDir 'twitch-token.bin'
$TwitchScopes  = 'moderator:read:followers channel:read:subscriptions bits:read channel:read:redemptions user:read:chat'
$script:TW = [pscustomobject]@{
    status = 'off'; clientId = ''; user = ''; userId = ''; error = ''
    code = ''; uri = ''; deviceCode = ''; deviceInterval = 5; deviceUntil = [DateTime]::MinValue; nextPoll = [DateTime]::MinValue
    token = $null; ws = $null; recv = $null; buf = $null; ms = $null; lastMsg = [DateTime]::MinValue; keepalive = 30
    reconnectAt = [DateTime]::MinValue; resubscribe = $true; nextRefresh = [DateTime]::MinValue
}

function Save-TwitchToken($t) {
    $bytes = [Text.Encoding]::UTF8.GetBytes(($t | ConvertTo-Json -Compress))
    $enc = [Security.Cryptography.ProtectedData]::Protect($bytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
    [IO.File]::WriteAllBytes($TwitchTokFile, $enc)
}
function Read-TwitchToken {
    if (-not (Test-Path $TwitchTokFile)) { return $null }
    try {
        $bytes = [Security.Cryptography.ProtectedData]::Unprotect([IO.File]::ReadAllBytes($TwitchTokFile), $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
        return ([Text.Encoding]::UTF8.GetString($bytes) | ConvertFrom-Json)
    } catch { return $null }
}
function Get-ErrBody($err) {
    if ($err.ErrorDetails -and $err.ErrorDetails.Message) { return $err.ErrorDetails.Message }
    return $err.Exception.Message
}
function Set-TwitchToken($resp) {
    $t = [pscustomobject]@{
        access = [string]$resp.access_token; refresh = [string]$resp.refresh_token
        expires = (Get-Date).AddSeconds([int]$resp.expires_in).ToString('o')
    }
    $script:TW.token = $t
    Save-TwitchToken $t
    $script:TW.nextRefresh = (Get-Date).AddSeconds([Math]::Max(60, [int]$resp.expires_in - 600))
}
function Update-TwitchToken {
    $t = $script:TW.token
    if (-not $t -or -not $t.refresh) { return $false }
    try {
        $r = Invoke-RestMethod -UseBasicParsing -Method Post -Uri 'https://id.twitch.tv/oauth2/token' -TimeoutSec 15 `
            -Body @{ client_id = $script:TW.clientId; grant_type = 'refresh_token'; refresh_token = $t.refresh }
        Set-TwitchToken $r
        Log 'Twitch: token odświeżony' 'DarkGray'
        return $true
    } catch {
        Log "Twitch: nie udało się odświeżyć logowania ($(Get-ErrBody $_)) – zaloguj się ponownie w panelu." 'Yellow'
        $script:TW.token = $null; Remove-Item $TwitchTokFile -ErrorAction SilentlyContinue
        $script:TW.status = 'need-login'
        return $false
    }
}
function Invoke-Helix([string]$method, [string]$path, $body) {
    $h = @{ 'Client-Id' = $script:TW.clientId; Authorization = "Bearer $($script:TW.token.access)" }
    $args2 = @{ UseBasicParsing = $true; Method = $method; Uri = "https://api.twitch.tv/helix/$path"; Headers = $h; TimeoutSec = 15 }
    if ($null -ne $body) { $args2.ContentType = 'application/json'; $args2.Body = ($body | ConvertTo-Json -Depth 6 -Compress) }
    try { return Invoke-RestMethod @args2 }
    catch {
        $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
        if ($code -eq 401 -and (Update-TwitchToken)) {
            $args2.Headers.Authorization = "Bearer $($script:TW.token.access)"
            return Invoke-RestMethod @args2
        }
        throw
    }
}

function Start-TwitchLogin([string]$clientId) {
    $clientId = $clientId.Trim()
    if ($clientId -notmatch '^[a-z0-9]{20,40}$') { throw 'To nie wygląda na Client ID z dev.twitch.tv' }
    $script:TW.clientId = $clientId
    [IO.File]::WriteAllText($TwitchCfgFile, (@{ clientId = $clientId } | ConvertTo-Json), $Utf8NoBom)
    Stop-TwitchSocket
    $r = Invoke-RestMethod -UseBasicParsing -Method Post -Uri 'https://id.twitch.tv/oauth2/device' -TimeoutSec 15 `
        -Body @{ client_id = $clientId; scopes = $TwitchScopes }
    $script:TW.deviceCode = [string]$r.device_code
    $script:TW.code = [string]$r.user_code
    $script:TW.uri = [string]$r.verification_uri
    $script:TW.deviceInterval = [Math]::Max(2, [int]$r.interval)
    $script:TW.deviceUntil = (Get-Date).AddSeconds([int]$r.expires_in)
    $script:TW.nextPoll = (Get-Date).AddSeconds($script:TW.deviceInterval)
    $script:TW.status = 'device'; $script:TW.error = ''
    Log "Twitch: wejdź na $($script:TW.uri) i wpisz kod $($script:TW.code)" 'Cyan'
}

function Test-TwitchDevice {
    if ((Get-Date) -lt $script:TW.nextPoll) { return }
    if ((Get-Date) -gt $script:TW.deviceUntil) { $script:TW.status = 'need-login'; $script:TW.error = 'Kod wygasł – kliknij «Połącz» jeszcze raz.'; return }
    $script:TW.nextPoll = (Get-Date).AddSeconds($script:TW.deviceInterval)
    try {
        $r = Invoke-RestMethod -UseBasicParsing -Method Post -Uri 'https://id.twitch.tv/oauth2/token' -TimeoutSec 15 -Body @{
            client_id = $script:TW.clientId; scopes = $TwitchScopes; device_code = $script:TW.deviceCode
            grant_type = 'urn:ietf:params:oauth:grant-type:device_code'
        }
        Set-TwitchToken $r
        $script:TW.code = ''; $script:TW.status = 'connecting'
        Log 'Twitch: zalogowano' 'Green'
        Connect-Twitch
    } catch {
        $msg = Get-ErrBody $_
        if ($msg -match 'authorization_pending') { return }
        if ($msg -match 'slow_down') { $script:TW.deviceInterval += 2; return }
        $script:TW.status = 'need-login'; $script:TW.error = "Logowanie nieudane: $msg"
        Log "Twitch: $($script:TW.error)" 'Yellow'
    }
}

function Stop-TwitchSocket {
    if ($script:TW.ws) { try { $script:TW.ws.Dispose() } catch {} }
    $script:TW.ws = $null; $script:TW.recv = $null
}

function Open-TwitchSocket([string]$url) {
    $ws = New-Object Net.WebSockets.ClientWebSocket
    $ws.Options.KeepAliveInterval = [TimeSpan]::FromSeconds(20)
    if (-not $ws.ConnectAsync([Uri]$url, [Threading.CancellationToken]::None).Wait(15000)) { throw 'przekroczony czas połączenia' }
    $old = $script:TW.ws
    $script:TW.ws = $ws
    $script:TW.buf = New-Object byte[] 65536
    $script:TW.ms = New-Object IO.MemoryStream
    $script:TW.recv = $ws.ReceiveAsync([ArraySegment[byte]]::new($script:TW.buf), [Threading.CancellationToken]::None)
    $script:TW.lastMsg = Get-Date
    if ($old) { try { $old.Dispose() } catch {} }
}

function Connect-Twitch {
    try {
        if (-not $script:TW.token) { $script:TW.status = 'need-login'; return }
        $me = Invoke-Helix 'GET' 'users' $null
        $script:TW.userId = [string]$me.data[0].id
        $script:TW.user = [string]$me.data[0].display_name
        $script:TW.resubscribe = $true
        Open-TwitchSocket 'wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=30'
        $script:TW.status = 'connecting'
    } catch {
        $script:TW.status = 'error'; $script:TW.error = Get-ErrBody $_
        $script:TW.reconnectAt = (Get-Date).AddSeconds(20)
        Log "Twitch: błąd połączenia ($($script:TW.error)), ponowię za 20 s" 'Yellow'
    }
}

function Register-TwitchEvents([string]$sessionId) {
    $uid = $script:TW.userId
    $subs = @(
        @{ type = 'channel.follow'; version = '2'; condition = @{ broadcaster_user_id = $uid; moderator_user_id = $uid } },
        @{ type = 'channel.subscribe'; version = '1'; condition = @{ broadcaster_user_id = $uid } },
        @{ type = 'channel.subscription.message'; version = '1'; condition = @{ broadcaster_user_id = $uid } },
        @{ type = 'channel.subscription.gift'; version = '1'; condition = @{ broadcaster_user_id = $uid } },
        @{ type = 'channel.cheer'; version = '1'; condition = @{ broadcaster_user_id = $uid } },
        @{ type = 'channel.raid'; version = '1'; condition = @{ to_broadcaster_user_id = $uid } },
        @{ type = 'channel.channel_points_custom_reward_redemption.add'; version = '1'; condition = @{ broadcaster_user_id = $uid } },
        @{ type = 'channel.chat.message'; version = '1'; condition = @{ broadcaster_user_id = $uid; user_id = $uid } },
        @{ type = 'stream.online'; version = '1'; condition = @{ broadcaster_user_id = $uid } },
        @{ type = 'stream.offline'; version = '1'; condition = @{ broadcaster_user_id = $uid } },
        @{ type = 'channel.update'; version = '2'; condition = @{ broadcaster_user_id = $uid } }
    )
    $ok = 0
    foreach ($s in $subs) {
        $s.transport = @{ method = 'websocket'; session_id = $sessionId }
        try { [void](Invoke-Helix 'POST' 'eventsub/subscriptions' $s); $ok++ }
        catch { Log "Twitch: nie mogę włączyć $($s.type) ($(Get-ErrBody $_))" 'DarkYellow' }
    }
    Log "Twitch: połączono jako $($script:TW.user) – aktywne zdarzenia: $ok/$($subs.Count)" 'Green'
}

function Convert-TwitchEvent([string]$type, $e) {
    $tier = { param($t) switch ([string]$t) { '2000' { 'Tier 2' } '3000' { 'Tier 3' } default { 'Tier 1' } } }
    switch ($type) {
        'channel.follow' { return [pscustomobject]@{ type = 'follow'; user = $e.user_name } }
        'channel.subscribe' {
            if ($e.is_gift) { return $null }   # pokazujemy jeden alert «gift» zamiast wielu
            return [pscustomobject]@{ type = 'sub'; user = $e.user_name; tier = (& $tier $e.tier) }
        }
        'channel.subscription.message' {
            return [pscustomobject]@{ type = 'resub'; user = $e.user_name; tier = (& $tier $e.tier); months = [int]$e.cumulative_months; message = [string]$e.message.text }
        }
        'channel.subscription.gift' {
            $u = if ($e.is_anonymous) { 'Anonim' } else { $e.user_name }
            return [pscustomobject]@{ type = 'gift'; user = $u; tier = (& $tier $e.tier); count = [int]$e.total }
        }
        'channel.cheer' {
            $u = if ($e.is_anonymous) { 'Anonim' } else { $e.user_name }
            return [pscustomobject]@{ type = 'cheer'; user = $u; amount = [int]$e.bits; message = [string]$e.message }
        }
        'channel.raid' { return [pscustomobject]@{ type = 'raid'; user = $e.from_broadcaster_user_name; viewers = [int]$e.viewers } }
        'channel.chat.message' {
            $frags = @()
            foreach ($f in @($e.message.fragments)) {
                if ($f.type -eq 'emote' -and $f.emote) { $frags += [pscustomobject]@{ t = 'emote'; id = [string]$f.emote.id; v = [string]$f.text } }
                else { $frags += [pscustomobject]@{ t = 'text'; v = [string]$f.text } }
            }
            $badges = @($e.badges | ForEach-Object { [string]$_.set_id })
            return (New-ChatEvent ([string]$e.chatter_user_login) ([string]$e.chatter_user_name) ([string]$e.color) ([string]$e.message.text) $frags $badges $false ([string]$e.chatter_user_id))
        }
        'channel.channel_points_custom_reward_redemption.add' {
            # nagroda «Efekt: konfetti» (albo inny efekt) uruchamia efekt bez limitu czasu
            $title = Remove-Diacritics ([string]$e.reward.title)
            foreach ($fx in $ChatEffects) { if ($title -match "efekt\W*$fx") { Add-Event ([pscustomobject]@{ type = 'effect'; effect = $fx; user = $e.user_name }); break } }
            return [pscustomobject]@{ type = 'redeem'; user = $e.user_name; reward = [string]$e.reward.title; cost = [int]$e.reward.cost; message = [string]$e.user_input }
        }
    }
    return $null
}

function Read-TwitchMessage([string]$text) {
    $m = $text | ConvertFrom-Json
    $script:TW.lastMsg = Get-Date
    switch ([string]$m.metadata.message_type) {
        'session_welcome' {
            $script:TW.keepalive = [int]$m.payload.session.keepalive_timeout_seconds
            $script:TW.status = 'online'; $script:TW.error = ''
            if ($script:TW.resubscribe) { Register-TwitchEvents ([string]$m.payload.session.id) }
            $script:TW.resubscribe = $false
        }
        'session_reconnect' {
            Log 'Twitch: serwer prosi o przełączenie połączenia' 'DarkGray'
            $script:TW.resubscribe = $false   # subskrypcje przechodzą na nowe połączenie
            Open-TwitchSocket ([string]$m.payload.session.reconnect_url)
        }
        'notification' {
            $st = [string]$m.metadata.subscription_type; $pe = $m.payload.event
            # początek/koniec streama i zmiana kategorii – do archiwum i flagowania
            if ($st -eq 'stream.online') { $script:Channel.live = $true; Open-StreamArchive $true ([datetime]::Parse([string]$pe.started_at).ToLocalTime()); $script:Channel.nextPoll = (Get-Date).AddSeconds(5); return }
            if ($st -eq 'stream.offline') { Close-StreamArchive; $script:Channel.live = $false; return }
            if ($st -eq 'channel.update') { $script:Channel.category = [string]$pe.category_name; $script:Channel.title = [string]$pe.title; if ($script:Cur) { $script:Cur.category = $script:Channel.category; $script:Cur.title = $script:Channel.title }; return }
            $ev = Convert-TwitchEvent $st $pe
            if ($ev) { Add-Event $ev }
        }
        'revocation' { Log "Twitch: wyłączono zdarzenie $($m.payload.subscription.type) ($($m.payload.subscription.status))" 'Yellow' }
    }
}

function Update-Twitch {
    $tw = $script:TW
    switch ($tw.status) {
        'device' { Test-TwitchDevice; return }
        'off' { return }
        'need-login' { return }
    }
    if ($tw.token -and (Get-Date) -gt $tw.nextRefresh) { [void](Update-TwitchToken) }
    if (-not $tw.ws) {
        if ($tw.token -and (Get-Date) -gt $tw.reconnectAt) { Connect-Twitch }
        return
    }
    # odbiór wiadomości bez blokowania pętli
    while ($tw.recv -and $tw.recv.IsCompleted) {
        if ($tw.recv.IsFaulted -or $tw.recv.IsCanceled) { $tw.recv = $null; break }
        $cur = $tw.recv
        $res = $cur.Result
        if ($res.MessageType -eq [Net.WebSockets.WebSocketMessageType]::Close) { $tw.recv = $null; break }
        $tw.ms.Write($tw.buf, 0, $res.Count)
        if ($res.EndOfMessage) {
            $text = [Text.Encoding]::UTF8.GetString($tw.ms.ToArray())
            $tw.ms.SetLength(0)
            try { Read-TwitchMessage $text } catch { Log "Twitch: błąd wiadomości ($($_.Exception.Message))" 'DarkYellow' }
        }
        if (-not $tw.ws) { return }
        if ($tw.recv -ne $cur) { continue }   # po «session_reconnect» nowe połączenie już czeka na dane
        $tw.recv = $tw.ws.ReceiveAsync([ArraySegment[byte]]::new($tw.buf), [Threading.CancellationToken]::None)
    }
    $silent = ((Get-Date) - $tw.lastMsg).TotalSeconds -gt ($tw.keepalive + 10)
    if (-not $tw.recv -or $silent) {
        Log 'Twitch: połączenie zerwane, łączę ponownie…' 'Yellow'
        Stop-TwitchSocket
        $tw.status = 'connecting'; $tw.resubscribe = $true
        $tw.reconnectAt = (Get-Date).AddSeconds(3)
    }
}

function Initialize-Twitch {
    if (Test-Path $TwitchCfgFile) {
        try { $script:TW.clientId = [string]((Get-Content $TwitchCfgFile -Raw) | ConvertFrom-Json).clientId } catch {}
    }
    if (-not $script:TW.clientId) { $script:TW.status = 'off'; return }
    $script:TW.token = Read-TwitchToken
    if (-not $script:TW.token) { $script:TW.status = 'need-login'; return }
    $script:TW.nextRefresh = [DateTime]::Parse($script:TW.token.expires).AddMinutes(-10)
    $script:TW.status = 'connecting'
    Connect-Twitch
}

function Get-TwitchStatus {
    return [pscustomobject]@{
        status = $script:TW.status; user = $script:TW.user; hasClient = [bool]$script:TW.clientId
        code = $script:TW.code; uri = $script:TW.uri; error = $script:TW.error
    }
}

# zdarzenia testowe (przyciski w panelu)
function New-TestEvent([string]$type, [int]$tier = 0, [string]$msg = '') {
    $names = @('LunaFox', 'Kuba_Gra', 'PixelWilk', 'Nocny_Smok', 'herbatka99', 'MrówkaPancerna')
    $u = $names[(Get-Random -Maximum $names.Count)]
    # poziom 1–5: wartości jak w themes/tiers.js (SAMPLE), żeby sprawdzić każdą wielkość reakcji
    if ($tier -ge 1 -and $tier -le 5) {
        $i = $tier - 1
        switch ($type) {
            'cheer'  { return [pscustomobject]@{ type = 'cheer'; user = $u; amount = @(50, 300, 800, 2500, 10000)[$i]; message = 'Test poziomu'; test = $true } }
            'gift'   { return [pscustomobject]@{ type = 'gift'; user = $u; tier = 'Tier 1'; count = @(1, 3, 7, 20, 100)[$i]; test = $true } }
            'resub'  { return [pscustomobject]@{ type = 'resub'; user = $u; tier = 'Tier 1'; months = @(2, 4, 9, 18, 36)[$i]; message = 'Test poziomu'; test = $true } }
            'raid'   { return [pscustomobject]@{ type = 'raid'; user = $u; viewers = @(3, 12, 35, 120, 500)[$i]; test = $true } }
            'redeem' { return [pscustomobject]@{ type = 'redeem'; user = $u; reward = 'Nawodnij się'; cost = @(100, 1000, 5000, 20000, 100000)[$i]; message = ''; test = $true } }
            'sub'    { return [pscustomobject]@{ type = 'sub'; user = $u; tier = $(if ($tier -ge 4) { 'Tier 3' } elseif ($tier -eq 3) { 'Tier 2' } else { 'Tier 1' }); test = $true } }
        }
    }
    switch ($type) {
        'chatbot' {
            # podejrzana wiadomość: świeże konto, «fajnie grasz» i reklama widzów
            $m = 'fajnie grasz! best viewers on streamboo .com'
            return (New-ChatEvent 'nowe_konto_2077' 'nowe_konto_2077' '' $m @([pscustomobject]@{ t = 'text'; v = $m }) @() $true '' 0.3)
        }
        'chat' {
            $msgs = @('cześć wszystkim!', 'ale akcja', 'GG', 'jak długo już grasz?', '!styl pixel', 'to było mocne', 'pozdro z Krakowa', '!kolor turkus')
            $m = $msgs[(Get-Random -Maximum $msgs.Count)]
            return (New-ChatEvent ($u.ToLowerInvariant()) $u '' $m @([pscustomobject]@{ t = 'text'; v = $m }) @() $true)
        }
        'effect' { return [pscustomobject]@{ type = 'effect'; effect = $ChatEffects[(Get-Random -Maximum $ChatEffects.Count)]; user = $u; test = $true } }
        'follow' { return [pscustomobject]@{ type = 'follow'; user = $u; test = $true } }
        'sub'    { return [pscustomobject]@{ type = 'sub'; user = $u; tier = 'Tier 1'; test = $true } }
        'resub'  { return [pscustomobject]@{ type = 'resub'; user = $u; tier = 'Tier 1'; months = 7; message = 'Siódmy miesiąc, dalej najlepszy kanał!'; test = $true } }
        'gift'   { return [pscustomobject]@{ type = 'gift'; user = $u; tier = 'Tier 1'; count = 5; test = $true } }
        'cheer'  { return [pscustomobject]@{ type = 'cheer'; user = $u; amount = 500; message = 'Na nowe ciasteczka'; test = $true } }
        'raid'   { return [pscustomobject]@{ type = 'raid'; user = $u; viewers = 42; test = $true } }
        'redeem' { return [pscustomobject]@{ type = 'redeem'; user = $u; reward = 'Nawodnij się'; cost = 500; message = ''; test = $true } }
    }
    return $null
}

# ---------------------------------------------------------------- aktualizacje
$AppDir = Split-Path $Root
$UpdateScript = Join-Path $AppDir 'update.ps1'
$UpdateCfg = Join-Path $DataDir 'update.json'
$script:CanUpdate = Test-Path $UpdateScript
if ($script:CanUpdate) { . $UpdateScript -Library }
function Get-AppVersion {
    try { return [string]((Get-Content (Join-Path $AppDir 'version.json') -Raw -Encoding UTF8) | ConvertFrom-Json).version } catch { return '0.0.0' }
}
$script:AppVersion = Get-AppVersion
$script:UP = [pscustomobject]@{
    auto = $true; latest = ''; notes = ''; error = ''; lastCheck = $null; busy = $false
    nextCheck = (Get-Date).AddSeconds(60); nextLocal = (Get-Date).AddSeconds(30)
}
if (Test-Path $UpdateCfg) { try { $script:UP.auto = [bool]((Get-Content $UpdateCfg -Raw) | ConvertFrom-Json).auto } catch {} }
$script:RestartPending = $false

function Get-UpdateStatus {
    return [pscustomobject]@{
        installed = $script:AppVersion; latest = $script:UP.latest; notes = $script:UP.notes; auto = $script:UP.auto
        error = $script:UP.error; canUpdate = $script:CanUpdate
        lastCheck = $(if ($script:UP.lastCheck) { $script:UP.lastCheck.ToString('HH:mm') } else { '' })
        newer = [bool]($script:UP.latest -and (Test-VMNewerSafe $script:UP.latest $script:AppVersion))
    }
}
function Test-VMNewerSafe([string]$a, [string]$b) { try { return ([version]$a) -gt ([version]$b) } catch { return $false } }

function Invoke-UpdateCheck([switch]$Install) {
    if (-not $script:CanUpdate) { $script:UP.error = 'brak update.ps1 obok wykrywacza'; return }
    $script:UP.lastCheck = Get-Date; $script:UP.error = ''
    try {
        $r = Get-VMRemoteInfo
        $script:UP.latest = [string]$r.version; $script:UP.notes = [string]$r.notes
        if ($Install -and (Test-VMNewerSafe $script:UP.latest $script:AppVersion)) {
            Log "Aktualizacja: pobieram wersję $($script:UP.latest)…" 'Cyan'
            $n = Install-VMFiles $AppDir
            Log "Aktualizacja: podmienione pliki: $n" 'Green'
            $script:RestartPending = $true
        }
    } catch {
        $script:UP.error = $_.Exception.Message
        Log "Aktualizacja: nie udało się ($($script:UP.error))" 'DarkYellow'
    }
}

function Update-Updater {
    $now = Get-Date
    # ktoś uruchomił update.bat ręcznie – nowa wersja na dysku, uruchom ją
    if ($now -ge $script:UP.nextLocal) {
        $script:UP.nextLocal = $now.AddSeconds(30)
        if ((Get-AppVersion) -ne $script:AppVersion) { $script:RestartPending = $true }
        # enable-remote.ps1 prosi o restart (włączono pilota z telefonu)
        if (Test-Path $RestartFlag) { Remove-Item $RestartFlag -Force -ErrorAction SilentlyContinue; $script:RestartPending = $true }
    }
    if ($script:UP.auto -and $now -ge $script:UP.nextCheck) {
        $script:UP.nextCheck = $now.AddHours(6)
        Invoke-UpdateCheck -Install
    }
}

function Restart-Detector {
    Log "Uruchamiam wykrywacz w nowej wersji ($(Get-AppVersion))…" 'Cyan'
    $a = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $PSCommandPath + '"'), '-WaitStart', '2')
    if ($Hidden) { Start-Process powershell.exe -ArgumentList ($a + '-Hidden') -WindowStyle Hidden }
    else { Start-Process powershell.exe -ArgumentList $a }
    try { $listener.Stop(); $listener.Close() } catch {}
    exit 0
}

# ---------------------------------------------------------------- HTTP
# ---------------------------------------------------------------- pilot z telefonu: ustawienia, pliki, klucz
$SettingsFile = Join-Path $DataDir 'settings.json'
$RemoteFile = Join-Path $DataDir 'remote.json'
$RestartFlag = Join-Path $DataDir 'restart.flag'
Remove-Item $RestartFlag -ErrorAction SilentlyContinue   # stara prośba o restart nie dotyczy świeżo uruchomionego wykrywacza
$script:Settings = $null; $script:SettingsRev = 0; $script:SettingsFrom = ''
if (Test-Path $SettingsFile) {
    try { $j = (Get-Content $SettingsFile -Raw -Encoding UTF8) | ConvertFrom-Json; $script:Settings = [string]$j.json; $script:SettingsRev = [int]$j.rev } catch {}
}
$script:RemoteKey = ''
try { $script:RemoteKey = [string]((Get-Content $RemoteFile -Raw) | ConvertFrom-Json).key } catch {}
if (-not $script:RemoteKey) {
    $chars = 'abcdefghjkmnpqrstuvwxyz23456789'.ToCharArray()
    $script:RemoteKey = -join (1..8 | ForEach-Object { $chars[(Get-Random -Maximum $chars.Length)] })
    [IO.File]::WriteAllText($RemoteFile, (@{ key = $script:RemoteKey } | ConvertTo-Json), $Utf8NoBom)
}
$script:LanMode = $false

function Get-LanAddresses {
    $ips = @()
    try {
        $ips = @(Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop | Where-Object {
            $_.IPAddress -notmatch '^(127\.|169\.254\.)' -and $_.PrefixOrigin -in @('Dhcp', 'Manual') } | ForEach-Object { $_.IPAddress })
    } catch {
        $ips = @([Net.Dns]::GetHostAddresses([Net.Dns]::GetHostName()) | Where-Object { $_.AddressFamily -eq 'InterNetwork' -and $_.ToString() -notmatch '^(127\.|169\.254\.)' } | ForEach-Object { $_.ToString() })
    }
    return $ips
}

$MimeTypes = @{ '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'; '.webp' = 'image/webp'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon' }
function Send-File($ctx, [string]$rel) {
    $res = $ctx.Response
    if (-not $rel) { $rel = 'panel.html' }
    $rel = [Uri]::UnescapeDataString($rel).Replace('/', '\')
    $full = [IO.Path]::GetFullPath((Join-Path $AppDir $rel))
    $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
    $okPath = $full.StartsWith($AppDir + '\', [StringComparison]::OrdinalIgnoreCase) -and $full -notlike '*\detector\*'
    if (-not $okPath -or -not $MimeTypes.ContainsKey($ext) -or -not (Test-Path $full -PathType Leaf)) {
        $res.StatusCode = 404; $res.OutputStream.Close(); return
    }
    $bytes = [IO.File]::ReadAllBytes($full)
    $res.ContentType = $MimeTypes[$ext]
    $res.Headers['Cache-Control'] = 'no-cache'
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.OutputStream.Close()
}

function Read-Body($req) {
    $r = New-Object IO.StreamReader($req.InputStream, [Text.Encoding]::UTF8)
    try { return $r.ReadToEnd() } finally { $r.Dispose() }
}

function Send-Json($ctx, $obj, [int]$code = 200) {
    $res = $ctx.Response
    $res.StatusCode = $code
    $res.ContentType = 'application/json; charset=utf-8'
    $res.Headers['Access-Control-Allow-Origin'] = '*'
    $res.Headers['Access-Control-Allow-Private-Network'] = 'true'
    $res.Headers['Cache-Control'] = 'no-store'
    $bytes = $Utf8NoBom.GetBytes(($obj | ConvertTo-Json -Depth 6 -Compress))
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.OutputStream.Close()
}

function Send-Raw($ctx, [string]$text, [string]$type) {
    $res = $ctx.Response
    $res.ContentType = "$type; charset=utf-8"
    $res.Headers['Access-Control-Allow-Origin'] = '*'; $res.Headers['Cache-Control'] = 'no-store'
    $b = $Utf8NoBom.GetBytes($text); $res.ContentLength64 = $b.Length; $res.OutputStream.Write($b, 0, $b.Length); $res.OutputStream.Close()
}

function Get-Query($req) {
    # własne dekodowanie jako UTF-8 (HttpListener psuje polskie znaki w QueryString)
    $q = @{}
    $raw = $req.RawUrl
    $i = $raw.IndexOf('?')
    if ($i -lt 0) { return $q }
    foreach ($pair in $raw.Substring($i + 1).Split('&')) {
        if (-not $pair) { continue }
        $kv = $pair.Split(@('='), 2, [StringSplitOptions]::None)
        $k = [Uri]::UnescapeDataString($kv[0].Replace('+', ' '))
        $val = ''; if ($kv.Length -gt 1) { $val = [Uri]::UnescapeDataString($kv[1].Replace('+', ' ')) }
        $q[$k] = $val
    }
    return $q
}

function Invoke-Request($ctx) {
    $req = $ctx.Request
    try {
        if ($req.HttpMethod -eq 'OPTIONS') {
            $ctx.Response.Headers['Access-Control-Allow-Methods'] = 'GET'
            $ctx.Response.Headers['Access-Control-Allow-Headers'] = '*'
            Send-Json $ctx @{ ok = $true }; return
        }
        $q = Get-Query $req
        $path = $req.Url.AbsolutePath
        # z sieci domowej (telefon) tylko z kluczem; na tym komputerze bez klucza
        if (-not $req.IsLocal) {
            $key = [string]$q['key']
            if (-not $key) { $c = $req.Cookies['vmkey']; if ($c) { $key = $c.Value } }
            if ($key -ne $script:RemoteKey) {
                $ctx.Response.StatusCode = 403
                $b = $Utf8NoBom.GetBytes('Brak dostępu: otwórz adres z kluczem z panelu w OBS (Ustawienia → Pilot z telefonu).')
                $ctx.Response.ContentType = 'text/plain; charset=utf-8'
                $ctx.Response.OutputStream.Write($b, 0, $b.Length); $ctx.Response.OutputStream.Close(); return
            }
            if ($q['key']) { $ctx.Response.AppendCookie((New-Object Net.Cookie('vmkey', $script:RemoteKey, '/'))) }
        }
        if ($path -eq '/ui' -or $path.StartsWith('/ui/')) { Send-File $ctx ($path -replace '^/ui/?', ''); return }
        switch ($path.TrimEnd('/')) {
            '/settings' {
                if ($req.HttpMethod -eq 'POST') {
                    $body = Read-Body $req
                    try { $data = $body | ConvertFrom-Json } catch { Send-Json $ctx @{ ok = $false; error = 'zły JSON' } 400; return }
                    $script:Settings = ($data.settings | ConvertTo-Json -Depth 10 -Compress)
                    $script:SettingsRev++; $script:SettingsFrom = [string]$data.client
                    [IO.File]::WriteAllText($SettingsFile, (@{ rev = $script:SettingsRev; json = $script:Settings } | ConvertTo-Json -Compress), $Utf8NoBom)
                    Send-Json $ctx ([pscustomobject]@{ ok = $true; rev = $script:SettingsRev })
                } else {
                    # ustawienia jako tekst JSON – bez przepuszczania przez obiekty PowerShella
                    $json = if ($script:Settings) { $script:Settings } else { 'null' }
                    $raw = '{"rev":' + $script:SettingsRev + ',"from":' + ($script:SettingsFrom | ConvertTo-Json) + ',"settings":' + $json + '}'
                    $res = $ctx.Response; $res.ContentType = 'application/json; charset=utf-8'
                    $res.Headers['Access-Control-Allow-Origin'] = '*'; $res.Headers['Cache-Control'] = 'no-store'
                    $b = $Utf8NoBom.GetBytes($raw); $res.ContentLength64 = $b.Length; $res.OutputStream.Write($b, 0, $b.Length); $res.OutputStream.Close()
                }
            }
            '/session' { Send-Json $ctx (Get-Session) }
            '/obsws' {
                # hasło do OBS WebSocket zapisane przez instalator – nakładki łączą się z OBS bez wpisywania czegokolwiek
                $f = Join-Path $DataDir 'obs-ws.json'
                if (Test-Path $f) {
                    try { $o = (Get-Content $f -Raw -Encoding UTF8) | ConvertFrom-Json; Send-Json $ctx ([pscustomobject]@{ ok = $true; url = "ws://localhost:$($o.port)"; password = [string]$o.password }) }
                    catch { Send-Json $ctx @{ ok = $false } }
                } else { Send-Json $ctx @{ ok = $false } }
            }
            '/remote/info' {
                if (-not $req.IsLocal) { Send-Json $ctx @{ ok = $false } 403; return }
                $urls = @(); if ($script:LanMode) { $urls = @(Get-LanAddresses | ForEach-Object { "http://${_}:$Port/ui/panel.html?key=$($script:RemoteKey)" }) }
                Send-Json $ctx ([pscustomobject]@{ lan = $script:LanMode; urls = $urls; key = $script:RemoteKey })
            }
            '/game' {
                Send-Json $ctx ([pscustomobject]@{ online = $true; version = 2; appVersion = $script:AppVersion; settingsRev = $script:SettingsRev; game = $script:State.game; recent = @($script:State.recent); twitch = (Get-TwitchStatus) })
            }
            '/update/status' { Send-Json $ctx (Get-UpdateStatus) }
            '/update/check' { Invoke-UpdateCheck; Send-Json $ctx (Get-UpdateStatus) }
            '/update/run' {
                Invoke-UpdateCheck -Install
                $st = Get-UpdateStatus
                Send-Json $ctx ([pscustomobject]@{ ok = -not $st.error; restarting = $script:RestartPending; status = $st })
            }
            '/update/auto' {
                $script:UP.auto = ([string]$q['on']) -ne '0'
                [IO.File]::WriteAllText($UpdateCfg, (@{ auto = $script:UP.auto } | ConvertTo-Json), $Utf8NoBom)
                Log ("Automatyczne aktualizacje: " + $(if ($script:UP.auto) { 'włączone' } else { 'wyłączone' }))
                Send-Json $ctx (Get-UpdateStatus)
            }
            '/events' {
                # bez «after» zwracamy tylko numer ostatniego zdarzenia – nowa nakładka nie odtwarza starych alertów
                $after = -1
                if ($q.ContainsKey('after')) { [void][int]::TryParse([string]$q['after'], [ref]$after) }
                $list = @()
                if ($after -ge 0) { $list = @($script:Events | Where-Object { $_.id -gt $after }) }
                Send-Json $ctx ([pscustomobject]@{ last = $script:EventSeq; events = $list; appVersion = $script:AppVersion })
            }
            '/test' {
                $tl = 0; [void][int]::TryParse([string]$q['tier'], [ref]$tl)
                $ev = New-TestEvent ([string]$q['type']) $tl ([string]$q['msg'])
                # wiadomość widza z panelu: w stylu aktywnej postaci i gry
                if ($ev -and $q['msg'] -and ($ev.PSObject.Properties.Name -contains 'message')) { $ev.message = [string]$q['msg'] }
                if ($ev -and $q['msg'] -and $ev.type -eq 'chat') { $ev.text = [string]$q['msg']; $ev.fragments = @([pscustomobject]@{ t = 'text'; v = [string]$q['msg'] }) }
                if (-not $ev) { Send-Json $ctx @{ ok = $false; error = 'nieznany typ' } 400; return }
                Add-Event $ev
                Send-Json $ctx @{ ok = $true }
            }
            '/transition' {
                # przejście między ekranami z pilota w telefonie (w OBS panel wysyła je bezpośrednio)
                Add-Event ([pscustomobject]@{ type = 'transition'; scene = [string]$q['scene']; style = [string]$q['style']; tid = [guid]::NewGuid().ToString('N') })
                Send-Json $ctx @{ ok = $true }
            }
            '/library' {
                $all = ([string]$q['all']) -eq '1'
                $list = @($script:Library.Values | Where-Object { $all -or -not $_.hidden } | Sort-Object { [string]$_.last } -Descending)
                # zainstalowane gry Steam, których jeszcze nie uruchamiałeś (do wyboru z listy)
                $inst = @()
                try { $inst = @(Get-SteamInstalled | Where-Object { -not $script:Library.ContainsKey($_.id) } | Sort-Object name | ForEach-Object { [pscustomobject]@{ id = $_.id; name = $_.name; steam = $_.steam; kind = ''; installed = $true } }) } catch {}
                Send-Json $ctx ([pscustomobject]@{ items = $list; installed = $inst; current = $script:LibCurrent })
            }
            '/art' {
                $f = Get-SteamArtFile ([string]$q['id']) ([string]$q['k'])
                $res = $ctx.Response
                if (-not $f) {
                    $cdn = @{ logo = 'logo.png'; hero = 'library_hero.jpg'; header = 'header.jpg'; cover = 'library_600x900.jpg' }[[string]$q['k']]
                    if ($cdn -and ([string]$q['id']) -match '^\d+$') { $res.StatusCode = 302; $res.RedirectLocation = "https://cdn.cloudflare.steamstatic.com/steam/apps/$($q['id'])/$cdn" } else { $res.StatusCode = 404 }
                    $res.OutputStream.Close(); return
                }
                $bytes = [IO.File]::ReadAllBytes($f)
                $res.ContentType = if ($f -like '*.png') { 'image/png' } else { 'image/jpeg' }
                $res.Headers['Cache-Control'] = 'max-age=86400'; $res.Headers['Access-Control-Allow-Origin'] = '*'
                $res.ContentLength64 = $bytes.Length; $res.OutputStream.Write($bytes, 0, $bytes.Length); $res.OutputStream.Close()
            }
            '/library/launch' {
                $err = Start-LibraryItem ([string]$q['id'])
                Send-Json $ctx @{ ok = -not $err; error = $err }
            }
            '/library/edit' {
                $e = $script:Library[[string]$q['id']]
                if (-not $e) { Send-Json $ctx @{ ok = $false } 404; return }
                if ($q.ContainsKey('name') -and ([string]$q['name']).Trim()) { $e.name = ([string]$q['name']).Trim() }
                if ($q.ContainsKey('hidden')) { $e.hidden = ([string]$q['hidden']) -eq '1' }
                $script:LibDirty = $true; Save-Library -Force
                Send-Json $ctx @{ ok = $true }
            }
            '/archive' { Send-Json $ctx (Get-ArchiveList) }
            '/archive/stream' {
                $id = [string]$q['id']
                if ($id -notmatch '^[\w-]+$') { Send-Json $ctx @{ ok = $false } 400; return }
                if ($script:Cur -and $script:Cur.id -eq $id) { Send-Json $ctx (Get-StreamSummary $script:Cur); return }
                $f = Join-Path $StreamsDir "$id.json"
                if (Test-Path $f) { Send-Raw $ctx ([IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)) 'application/json' } else { Send-Json $ctx @{ ok = $false } 404 }
            }
            '/archive/trust' {
                $login = ([string]$q['login']).ToLowerInvariant()
                $rec = $script:Chatters[$login]
                if ($rec) { $rec.trust = ([string]$q['on']) -ne '0'; $script:ChattersDirty = $true; Save-Chatters -Force }
                if ($script:Cur -and $rec -and $rec.trust) { $script:Cur.flagged.Remove($login) }
                Send-Json $ctx @{ ok = [bool]$rec }
            }
            '/archive/export' {
                $id = [string]$q['id']; $fmt = [string]$q['fmt']; if (@('txt', 'srt', 'json') -notcontains $fmt) { $fmt = 'txt' }
                $off = 0; [void][int]::TryParse([string]$q['offset'], [ref]$off)
                if ($id -notmatch '^[\w-]+$') { Send-Json $ctx @{ ok = $false } 400; return }
                $txt = Export-Stream $id $fmt $off
                if ($null -eq $txt) { Send-Json $ctx @{ ok = $false; error = 'brak zapisu' } 404; return }
                $ctx.Response.Headers['Content-Disposition'] = "attachment; filename=czat-$id.$fmt"
                Send-Raw $ctx $txt $(if ($fmt -eq 'json') { 'application/json' } else { 'text/plain' })
            }
            '/twitch/status' { Send-Json $ctx (Get-TwitchStatus) }
            '/twitch/setup' {
                $cid = [string]$q['clientId']
                if ($cid -eq 'keep') { $cid = $script:TW.clientId }   # «Połącz» bez wpisywania ID ponownie
                try { Start-TwitchLogin $cid; Send-Json $ctx (Get-TwitchStatus) }
                catch { Send-Json $ctx @{ ok = $false; error = (Get-ErrBody $_) } 400 }
            }
            '/twitch/logout' {
                Stop-TwitchSocket
                Remove-Item $TwitchTokFile -ErrorAction SilentlyContinue
                $script:TW.token = $null; $script:TW.user = ''; $script:TW.status = $(if ($script:TW.clientId) { 'need-login' } else { 'off' })
                Log 'Twitch: wylogowano' 'Yellow'
                Send-Json $ctx (Get-TwitchStatus)
            }
            '/add' {
                $exe = ([string]$q['exe']).Trim().ToLowerInvariant(); $name = ([string]$q['name']).Trim()
                if (-not $exe -or -not $name -or $exe -match '[=|\r\n]' -or $name -match '[\r\n]') { Send-Json $ctx @{ ok = $false; error = 'exe i name są wymagane' } 400; return }
                Add-CustomLine "$exe = $name"
                Log "Dodano do my-games.txt: $exe = $name" 'Green'
                Update-State
                Send-Json $ctx @{ ok = $true }
            }
            '/ignore' {
                $exe = ([string]$q['exe']).Trim().ToLowerInvariant()
                if (-not $exe -or $exe -match '[=|\r\n]') { Send-Json $ctx @{ ok = $false; error = 'exe jest wymagane' } 400; return }
                Add-CustomLine "!$exe"
                Log "Ignorowane od teraz: $exe" 'Yellow'
                Update-State
                Send-Json $ctx @{ ok = $true }
            }
            '' { Send-Json $ctx @{ ok = $true; app = 'Vincent-Media game detector'; endpoints = @('/game', '/add?exe=&name=', '/ignore?exe=') } }
            default { Send-Json $ctx @{ ok = $false; error = 'not found' } 404 }
        }
    } catch {
        Log "Błąd zapytania: $($_.Exception.Message)" 'Red'
        try { Send-Json $ctx @{ ok = $false; error = $_.Exception.Message } 500 } catch {}
    }
}

# ---------------------------------------------------------------- start
Write-Host ''
Write-Host "  Vincent-Media – wykrywacz gier  v$($script:AppVersion)" -ForegroundColor Magenta
Write-Host "  Nakładka czyta: http://localhost:$Port/game   (Ctrl+C = koniec)" -ForegroundColor DarkGray
Write-Host ''

$needDb = -not (Test-Path $IndexFile)
if (-not $needDb) { $needDb = ((Get-Date) - (Get-Item $IndexFile).LastWriteTime).TotalDays -gt $DbMaxAgeDays }
if ($needDb) { Update-Index }
Import-Index
Initialize-CustomFile
Import-Custom
Initialize-Twitch

# najpierw w całej sieci domowej (pilot z telefonu), a jeśli Windows nie pozwala – tylko na tym komputerze
$listener = New-Object Net.HttpListener
$listener.Prefixes.Add("http://+:$Port/")
try { $listener.Start(); $script:LanMode = $true }
catch {
    try { $listener.Close() } catch {}
    $listener = New-Object Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    try { $listener.Start() } catch {
        Log "Nie mogę otworzyć portu $Port – może wykrywacz już działa w innym oknie? ($($_.Exception.Message))" 'Red'
        exit 1
    }
}
Log "Nasłuchuję na http://localhost:$Port/" 'Green'
if ($script:LanMode) {
    foreach ($ip in Get-LanAddresses) { Log "Pilot z telefonu: http://${ip}:$Port/ui/panel.html?key=$($script:RemoteKey)" 'Cyan' }
} else {
    Log 'Pilot z telefonu wyłączony – włączysz go skrótem «Włącz pilota z telefonu» (jedna zgoda administratora).' 'DarkGray'
}

try {
    $next = [DateTime]::MinValue
    $task = $listener.GetContextAsync()
    while ($listener.IsListening) {
        if ([DateTime]::Now -ge $next) {
            try { Update-State } catch { Log "Błąd skanu: $($_.Exception.Message)" 'Red' }
            $next = [DateTime]::Now.AddSeconds($Interval)
        }
        try { Update-Updater } catch { Log "Aktualizacja: $($_.Exception.Message)" 'DarkYellow' }
        if ($script:RestartPending) { Restart-Detector }
        try { Update-Archive } catch {}
        try { Update-Twitch } catch { Log "Twitch: $($_.Exception.Message)" 'Red'; Stop-TwitchSocket; $script:TW.reconnectAt = (Get-Date).AddSeconds(20) }
        if ($task.Wait(200)) {
            Invoke-Request $task.Result
            if ($script:RestartPending) { Restart-Detector }
            $task = $listener.GetContextAsync()
        }
    }
} finally {
    try { Save-Chatters -Force; Save-StreamSummary; Save-Library -Force } catch {}
    $listener.Stop()
    $listener.Close()
}
