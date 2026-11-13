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
# Panel w OBS też umie tu dopisywać gry (przycisk „Dodaj jako grę”).

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

function Update-State {
    Import-Custom
    $fgPid = Get-ForegroundPid
    $procs = Get-CimInstance -ClassName Win32_Process -Property ProcessId, ExecutablePath, CommandLine, CreationDate -ErrorAction SilentlyContinue
    $found = New-Object Collections.ArrayList
    $fgPath = $null
    foreach ($p in $procs) {
        $path = $p.ExecutablePath
        if (-not $path) { continue }
        if ($p.ProcessId -eq $fgPid) { $fgPath = $path }
        $m = Find-Game $path $p.CommandLine
        if ($m) { [void]$found.Add([pscustomobject]@{ M = $m; Pid = $p.ProcessId; Start = $p.CreationDate }) }
    }

    # ostatnie okna na pierwszym planie (do „Dodaj jako grę” w panelu)
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
        $pick = [pscustomobject]@{ M = $m; Start = $(if ($same) { $same.Start } else { $null }) }
    }
    if (-not $pick -and $found.Count) {
        $pick = @($found | Where-Object { $_.Pid -eq $fgPid }) | Select-Object -First 1
        if (-not $pick) { $pick = @($found | Where-Object { $_.M.Name -eq $script:Current }) | Select-Object -First 1 }
        if (-not $pick) { $pick = @($found | Sort-Object Start -Descending) | Select-Object -First 1 }
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
        }
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
    while ($script:Events.Count -gt 100) { $script:Events.RemoveAt(0) }
    $who = ''; if ($ev.user) { $who = $ev.user }
    Log ("Alert: {0} {1}" -f $ev.type, $who) 'Magenta'
}

# ---------------------------------------------------------------- Twitch (EventSub przez WebSocket)
# Logowanie: Device Code Flow (kod na twitch.tv/activate), aplikacja typu „Public” – bez sekretu.
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
    if ((Get-Date) -gt $script:TW.deviceUntil) { $script:TW.status = 'need-login'; $script:TW.error = 'Kod wygasł – kliknij „Połącz” jeszcze raz.'; return }
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
        @{ type = 'channel.channel_points_custom_reward_redemption.add'; version = '1'; condition = @{ broadcaster_user_id = $uid } }
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
            if ($e.is_gift) { return $null }   # pokazujemy jeden alert „gift” zamiast wielu
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
        'channel.channel_points_custom_reward_redemption.add' {
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
            $ev = Convert-TwitchEvent ([string]$m.metadata.subscription_type) $m.payload.event
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
        if ($tw.recv -ne $cur) { continue }   # po „session_reconnect” nowe połączenie już czeka na dane
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
function New-TestEvent([string]$type) {
    $names = @('LunaFox', 'Kuba_Gra', 'PixelWilk', 'Nocny_Smok', 'herbatka99', 'MrówkaPancerna')
    $u = $names[(Get-Random -Maximum $names.Count)]
    switch ($type) {
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
        switch ($req.Url.AbsolutePath.TrimEnd('/')) {
            '/game' {
                Send-Json $ctx ([pscustomobject]@{ online = $true; version = 2; appVersion = $script:AppVersion; game = $script:State.game; recent = @($script:State.recent); twitch = (Get-TwitchStatus) })
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
                # bez „after” zwracamy tylko numer ostatniego zdarzenia – nowa nakładka nie odtwarza starych alertów
                $after = -1
                if ($q.ContainsKey('after')) { [void][int]::TryParse([string]$q['after'], [ref]$after) }
                $list = @()
                if ($after -ge 0) { $list = @($script:Events | Where-Object { $_.id -gt $after }) }
                Send-Json $ctx ([pscustomobject]@{ last = $script:EventSeq; events = $list; appVersion = $script:AppVersion })
            }
            '/test' {
                $ev = New-TestEvent ([string]$q['type'])
                if (-not $ev) { Send-Json $ctx @{ ok = $false; error = 'nieznany typ' } 400; return }
                Add-Event $ev
                Send-Json $ctx @{ ok = $true }
            }
            '/twitch/status' { Send-Json $ctx (Get-TwitchStatus) }
            '/twitch/setup' {
                $cid = [string]$q['clientId']
                if ($cid -eq 'keep') { $cid = $script:TW.clientId }   # „Połącz” bez wpisywania ID ponownie
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

$listener = New-Object Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() } catch {
    Log "Nie mogę otworzyć portu $Port – może wykrywacz już działa w innym oknie? ($($_.Exception.Message))" 'Red'
    exit 1
}
Log "Nasłuchuję na http://localhost:$Port/" 'Green'

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
        try { Update-Twitch } catch { Log "Twitch: $($_.Exception.Message)" 'Red'; Stop-TwitchSocket; $script:TW.reconnectAt = (Get-Date).AddSeconds(20) }
        if ($task.Wait(200)) {
            Invoke-Request $task.Result
            if ($script:RestartPending) { Restart-Detector }
            $task = $listener.GetContextAsync()
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
