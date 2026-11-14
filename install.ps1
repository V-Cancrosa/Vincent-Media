# Vincent-Media – instalator nakładek do OBS (Windows 10/11, bez uprawnień administratora).
#
# Uruchomienie: dwuklik na Zainstaluj-Vincent-Media.bat albo w PowerShellu:
#   irm https://raw.githubusercontent.com/V-Cancrosa/Vincent-Media/main/install.ps1 | iex
#
# Co robi:
#   1. pobiera najnowszą wersję do %LOCALAPPDATA%\Vincent-Media\obs-game-overlay
#   2. (za Twoją zgodą) dodaje do OBS sceny, źródła przeglądarki i dok z panelem – z kopią zapasową
#   3. tworzy skróty w menu Start i (opcjonalnie) autostart wykrywacza
# Ponowne uruchomienie jest bezpieczne: aktualizuje pliki i adresy, nie dubluje scen ani źródeł.

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}
try { [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12 } catch {}

$Repo       = 'V-Cancrosa/Vincent-Media'
$Branch     = 'main'
$AppRoot    = Join-Path $env:LOCALAPPDATA 'Vincent-Media'
$InstallDir = Join-Path $AppRoot 'obs-game-overlay'
$ObsDir     = Join-Path $env:APPDATA 'obs-studio'
$Prefix     = 'VM · '

function Say([string]$t, [string]$c = 'Gray') { Write-Host "  $t" -ForegroundColor $c }
function Step([string]$t) { Write-Host ''; Write-Host "  ▸ $t" -ForegroundColor Cyan }
function Ask([string]$q, [bool]$def = $true) {
    $hint = if ($def) { '[T/n]' } else { '[t/N]' }
    while ($true) {
        $a = (Read-Host "  $q $hint").Trim().ToLower()
        if (-not $a) { return $def }
        if ($a -in @('t', 'tak', 'y', 'yes')) { return $true }
        if ($a -in @('n', 'nie', 'no')) { return $false }
    }
}
function To-Url([string]$path) { return ([Uri]$path).AbsoluteUri }

Write-Host ''
Write-Host '  ╔══════════════════════════════════════════╗' -ForegroundColor Magenta
Write-Host '  ║   Vincent-Media – instalator dla OBS     ║' -ForegroundColor Magenta
Write-Host '  ╚══════════════════════════════════════════╝' -ForegroundColor Magenta
Say "Pliki trafią do: $InstallDir" 'DarkGray'

# ------------------------------------------------------------------ 1. pliki
Step 'Pobieram najnowszą wersję z GitHuba'
$tmp = Join-Path $env:TEMP ('vm-install-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmp | Out-Null
try {
    $zip = Join-Path $tmp 'vm.zip'
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -UseBasicParsing -TimeoutSec 180 -Uri "https://codeload.github.com/$Repo/zip/refs/heads/$Branch" -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath $tmp -Force
    $src = Join-Path (Get-ChildItem -Path $tmp -Directory | Select-Object -First 1).FullName 'obs-game-overlay'
    if (-not (Test-Path (Join-Path $src 'version.json'))) { throw 'pobrana paczka nie zawiera nakładki' }
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    $n = 0
    foreach ($f in Get-ChildItem -Path $src -Recurse -File) {
        $rel = $f.FullName.Substring($src.Length).TrimStart('\')
        if ($rel -like 'detector\data\*' -or $rel -eq 'detector\my-games.txt') { continue }   # Twoje dane zostają
        $dst = Join-Path $InstallDir $rel
        New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
        Copy-Item -Path $f.FullName -Destination $dst -Force
        $n++
    }
} finally {
    Remove-Item -Path $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
$version = [string]((Get-Content (Join-Path $InstallDir 'version.json') -Raw -Encoding UTF8) | ConvertFrom-Json).version
Say "Zainstalowano wersję $version ($n plików)." 'Green'

$Urls = [ordered]@{
    overlay = To-Url (Join-Path $InstallDir 'overlay.html')
    alerts  = To-Url (Join-Path $InstallDir 'alerts.html')
    scenes  = To-Url (Join-Path $InstallDir 'scenes.html')
    panel   = To-Url (Join-Path $InstallDir 'panel.html')
}

# ------------------------------------------------------------------ 2. OBS
Add-Type -AssemblyName System.Web.Extensions
$Json = New-Object Web.Script.Serialization.JavaScriptSerializer
$Json.MaxJsonLength = [int]::MaxValue
$Json.RecursionLimit = 512

function Read-Ini([string]$path) {
    $bytes = [IO.File]::ReadAllBytes($path)
    $bom = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
    $text = [Text.Encoding]::UTF8.GetString($bytes)
    if ($bom) { $text = $text.Substring(1) }
    $lines = New-Object Collections.Generic.List[string]
    foreach ($l in ($text -split "`r?`n")) { $lines.Add($l) }
    return [pscustomobject]@{ Path = $path; Bom = $bom; Lines = $lines }
}
function Get-IniValue($ini, [string]$section, [string]$key) {
    $in = $false
    foreach ($l in $ini.Lines) {
        if ($l -match '^\s*\[(.+)\]\s*$') { $in = ($Matches[1] -eq $section); continue }
        if ($in -and $l -match ('^' + [regex]::Escape($key) + '=(.*)$')) { return $Matches[1] }
    }
    return $null
}
function Set-IniValue($ini, [string]$section, [string]$key, [string]$value) {
    $in = $false; $secAt = -1
    for ($i = 0; $i -lt $ini.Lines.Count; $i++) {
        $l = $ini.Lines[$i]
        if ($l -match '^\s*\[(.+)\]\s*$') {
            if ($in) { break }
            $in = ($Matches[1] -eq $section); if ($in) { $secAt = $i }
            continue
        }
        if ($in -and $l -match ('^' + [regex]::Escape($key) + '=')) { $ini.Lines[$i] = "$key=$value"; return }
    }
    if ($secAt -lt 0) {
        if ($ini.Lines.Count -and $ini.Lines[$ini.Lines.Count - 1] -ne '') { $ini.Lines.Add('') }
        $ini.Lines.Add("[$section]"); $ini.Lines.Add("$key=$value"); return
    }
    $ini.Lines.Insert($secAt + 1, "$key=$value")
}
function Save-Ini($ini) {
    $text = ($ini.Lines -join "`n")
    [IO.File]::WriteAllText($ini.Path, $text, (New-Object Text.UTF8Encoding $ini.Bom))
}
function Backup([string]$path) {
    $b = "$path.vm-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item -Path $path -Destination $b -Force
    return $b
}

function New-Source([string]$name, [string]$url, [bool]$audio) {
    $d = New-Object 'Collections.Generic.Dictionary[string,object]'
    $d['name'] = $name; $d['uuid'] = [guid]::NewGuid().ToString()
    $d['id'] = 'browser_source'; $d['versioned_id'] = 'browser_source'
    $s = New-Object 'Collections.Generic.Dictionary[string,object]'
    $s['url'] = $url; $s['width'] = 1920; $s['height'] = 1080; $s['is_local_file'] = $false
    $s['reroute_audio'] = $audio
    $s['css'] = 'body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }'
    $d['settings'] = $s
    $d['mixers'] = $(if ($audio) { 255 } else { 0 }); $d['sync'] = 0; $d['flags'] = 0; $d['volume'] = 1.0; $d['balance'] = 0.5
    $d['enabled'] = $true; $d['muted'] = $false
    $d['monitoring_type'] = $(if ($audio) { 2 } else { 0 })   # alerty: słychać je w słuchawkach i na streamie
    $d['hotkeys'] = New-Object 'Collections.Generic.Dictionary[string,object]'
    $d['private_settings'] = New-Object 'Collections.Generic.Dictionary[string,object]'
    return $d
}
function New-SceneItem($src, [int]$id, [double]$cx, [double]$cy) {
    $it = New-Object 'Collections.Generic.Dictionary[string,object]'
    $it['name'] = $src['name']; if ($src.ContainsKey('uuid')) { $it['source_uuid'] = $src['uuid'] }
    $it['visible'] = $true; $it['locked'] = $false; $it['rot'] = 0.0
    $it['pos'] = @{ x = 0.0; y = 0.0 }; $it['scale'] = @{ x = 1.0; y = 1.0 }; $it['align'] = 5
    $it['bounds_type'] = 2; $it['bounds_align'] = 0; $it['bounds'] = @{ x = $cx; y = $cy }   # dopasuj do płótna OBS
    $it['crop_left'] = 0; $it['crop_top'] = 0; $it['crop_right'] = 0; $it['crop_bottom'] = 0
    $it['id'] = $id; $it['group_item_backup'] = $false; $it['scale_filter'] = 'disable'
    $it['blend_method'] = 'default'; $it['blend_type'] = 'normal'
    $it['show_transition'] = @{ duration = 0 }; $it['hide_transition'] = @{ duration = 0 }
    $it['private_settings'] = New-Object 'Collections.Generic.Dictionary[string,object]'
    return $it
}
function New-Scene([string]$name) {
    $d = New-Object 'Collections.Generic.Dictionary[string,object]'
    $d['name'] = $name; $d['uuid'] = [guid]::NewGuid().ToString()
    $d['id'] = 'scene'; $d['versioned_id'] = 'scene'
    $s = New-Object 'Collections.Generic.Dictionary[string,object]'
    $s['id_counter'] = 0; $s['custom_size'] = $false; $s['items'] = @()
    $d['settings'] = $s
    $d['mixers'] = 0; $d['sync'] = 0; $d['flags'] = 0; $d['volume'] = 1.0; $d['balance'] = 0.5; $d['enabled'] = $true; $d['muted'] = $false
    $d['hotkeys'] = New-Object 'Collections.Generic.Dictionary[string,object]'
    $d['private_settings'] = New-Object 'Collections.Generic.Dictionary[string,object]'
    return $d
}

$obsConfigured = $false
if (-not (Test-Path $ObsDir)) {
    Step 'OBS'
    Say 'Nie widzę ustawień OBS. Zainstaluj OBS Studio, uruchom go raz i odpal instalator jeszcze raz.' 'Yellow'
} else {
    Step 'Konfiguracja OBS'
    Say 'Mogę dodać do OBS:' 'Gray'
    Say "  • scenę «${Prefix}Nakładki» (karta z grą + alerty) – dodasz ją jako źródło do swoich scen z grą" 'Gray'
    Say "  • ekrany: Przygotowania, Stream za…, Zaraz zaczynamy, Spóźnienie, Przerwa, Koniec (z napisami)" 'Gray'
    Say "  • układy: Gra – pełny ekran, Gra – w ramce (z czatem), Rozmowa" 'Gray'
    Say '  • dok «Vincent-Media» z panelem sterowania' 'Gray'
    Say 'Przed zmianą zrobię kopię zapasową plików OBS.' 'DarkGray'
    if (Ask 'Skonfigurować OBS?') {
        while (Get-Process -Name obs64, obs32, obs -ErrorAction SilentlyContinue) {
            Say 'OBS jest uruchomiony. Zamknij go (zapisze swoje ustawienia), potem wróć tutaj.' 'Yellow'
            $a = Read-Host '  Enter = sprawdź ponownie, P = pomiń konfigurację OBS'
            if ($a.Trim().ToLower() -eq 'p') { break }
        }
        if (-not (Get-Process -Name obs64, obs32, obs -ErrorAction SilentlyContinue)) {
            try {
                # OBS 31+ trzyma ustawienia użytkownika w user.ini, starsze wersje w global.ini
                $iniPath = Join-Path $ObsDir 'user.ini'
                if (-not (Test-Path $iniPath)) { $iniPath = Join-Path $ObsDir 'global.ini' }
                if (-not (Test-Path $iniPath)) { throw 'nie znalazłem global.ini ani user.ini – uruchom OBS raz i spróbuj ponownie' }
                $ini = Read-Ini $iniPath

                # --- kolekcja scen
                $scenesDir = Join-Path $ObsDir 'basic\scenes'
                $collFile = Get-IniValue $ini 'Basic' 'SceneCollectionFile'
                $collPath = if ($collFile) { Join-Path $scenesDir "$collFile.json" } else { $null }
                if (-not $collPath -or -not (Test-Path $collPath)) {
                    $collPath = (Get-ChildItem -Path $scenesDir -Filter *.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
                }
                if (-not $collPath) { throw 'nie znalazłem kolekcji scen – uruchom OBS raz i spróbuj ponownie' }
                Say "Kolekcja scen: $([IO.Path]::GetFileNameWithoutExtension($collPath))" 'DarkGray'

                # --- rozdzielczość płótna z aktywnego profilu
                $cx = 1920.0; $cy = 1080.0
                $profDir = Get-IniValue $ini 'Basic' 'ProfileDir'
                if ($profDir) {
                    $bi = Join-Path $ObsDir "basic\profiles\$profDir\basic.ini"
                    if (Test-Path $bi) {
                        $b = Read-Ini $bi
                        $w = Get-IniValue $b 'Video' 'BaseCX'; $h = Get-IniValue $b 'Video' 'BaseCY'
                        if ($w -and $h) { $cx = [double]$w; $cy = [double]$h }
                    }
                }
                Say "Płótno OBS: $cx×$cy" 'DarkGray'

                $bk1 = Backup $collPath
                $coll = $Json.DeserializeObject([IO.File]::ReadAllText($collPath, [Text.Encoding]::UTF8))
                $sources = New-Object Collections.ArrayList
                if ($coll.ContainsKey('sources') -and $coll['sources']) { $sources.AddRange([object[]]$coll['sources']) }
                $findSrc = { param($name) foreach ($x in $sources) { if ($x['name'] -eq $name) { return $x } } return $null }

                # źródła przeglądarki (przy ponownej instalacji tylko aktualizujemy adresy)
                $layouts = To-Url (Join-Path $InstallDir 'layouts.html')
                $want = @(
                    @{ key = 'overlay'; name = "${Prefix}Teraz gram"; url = $Urls.overlay; audio = $false },
                    @{ key = 'alerts'; name = "${Prefix}Alerty"; url = $Urls.alerts; audio = $true },
                    @{ key = 'prep'; name = "${Prefix}Ekran przygotowania"; url = "$($Urls.scenes)?scene=prep"; audio = $false },
                    @{ key = 'soon'; name = "${Prefix}Ekran stream za"; url = "$($Urls.scenes)?scene=soon"; audio = $false },
                    @{ key = 'start'; name = "${Prefix}Ekran start"; url = "$($Urls.scenes)?scene=start"; audio = $false },
                    @{ key = 'late'; name = "${Prefix}Ekran spóźnienie"; url = "$($Urls.scenes)?scene=late"; audio = $false },
                    @{ key = 'brb'; name = "${Prefix}Ekran przerwa"; url = "$($Urls.scenes)?scene=brb"; audio = $false },
                    @{ key = 'end'; name = "${Prefix}Ekran koniec"; url = "$($Urls.scenes)?scene=end"; audio = $false },
                    @{ key = 'lfull'; name = "${Prefix}Układ gra pełny ekran"; url = "$layouts`?layout=game-full"; audio = $false },
                    @{ key = 'lframe'; name = "${Prefix}Układ gra w ramce"; url = "$layouts`?layout=game-frame"; audio = $false },
                    @{ key = 'ltalk'; name = "${Prefix}Układ rozmowa"; url = "$layouts`?layout=talk"; audio = $false },
                    @{ key = 'trans'; name = "${Prefix}Przejścia"; url = (To-Url (Join-Path $InstallDir 'transition.html')); audio = $false }
                )
                $S = @{}
                foreach ($w in $want) {
                    $ex = & $findSrc $w.name
                    if ($ex) { $ex['settings']['url'] = $w.url; $ex['settings']['is_local_file'] = $false; $S[$w.key] = $ex }
                    else { $new = New-Source $w.name $w.url $w.audio; [void]$sources.Add($new); $S[$w.key] = $new }
                }

                # nasze sceny (zawartość nadpisujemy, żeby były zawsze aktualne)
                # kolejność elementów: od dołu do góry; w scenach z grą dodaj przechwytywanie gry i przesuń je na sam dół
                $sceneDefs = @(
                    @{ name = "${Prefix}Nakładki"; items = @('overlay', 'alerts', 'trans') },
                    @{ name = "${Prefix}Przygotowania"; items = @('prep', 'alerts', 'trans') },
                    @{ name = "${Prefix}Stream za…"; items = @('soon', 'alerts', 'trans') },
                    @{ name = "${Prefix}Zaraz zaczynamy"; items = @('start', 'alerts', 'trans') },
                    @{ name = "${Prefix}Spóźnienie"; items = @('late', 'alerts', 'trans') },
                    @{ name = "${Prefix}Gra – pełny ekran"; items = @('lfull', 'overlay', 'alerts', 'trans') },
                    @{ name = "${Prefix}Gra – w ramce"; items = @('lframe', 'alerts', 'trans') },
                    @{ name = "${Prefix}Przerwa"; items = @('brb', 'alerts', 'trans') },
                    @{ name = "${Prefix}Rozmowa"; items = @('ltalk', 'alerts', 'trans') },
                    @{ name = "${Prefix}Koniec"; items = @('end', 'alerts', 'trans') }
                )
                $overlayScene = $null
                foreach ($sd in $sceneDefs) {
                    $sc = & $findSrc $sd.name
                    if (-not $sc) { $sc = New-Scene $sd.name; [void]$sources.Add($sc) }
                    $items = @(); $i = 0
                    foreach ($k in $sd.items) { $i++; $items += , (New-SceneItem $S[$k] $i $cx $cy) }
                    $sc['settings']['items'] = $items; $sc['settings']['id_counter'] = $i
                    if (-not $overlayScene) { $overlayScene = $sc }
                }

                # kolejność scen w OBS
                $order = New-Object Collections.ArrayList
                if ($coll.ContainsKey('scene_order') -and $coll['scene_order']) { $order.AddRange([object[]]$coll['scene_order']) }
                foreach ($sd in $sceneDefs) {
                    if (-not ($order | Where-Object { $_['name'] -eq $sd.name })) { [void]$order.Add(@{ name = $sd.name }) }
                }

                # nakładki na wierzch istniejących scen (scena zagnieżdżona – jedno miejsce do zmian)
                $userScenes = @($sources | Where-Object { $_['id'] -eq 'scene' -and -not ([string]$_['name']).StartsWith($Prefix) })
                if ($userScenes.Count) {
                    Say "Twoje sceny: $(($userScenes | ForEach-Object { $_['name'] }) -join ', ')" 'DarkGray'
                    if (Ask "Dodać «${Prefix}Nakładki» na wierzch tych scen?" $true) {
                        foreach ($us in $userScenes) {
                            $st = $us['settings']
                            $items = New-Object Collections.ArrayList
                            if ($st.ContainsKey('items') -and $st['items']) { $items.AddRange([object[]]$st['items']) }
                            if ($items | Where-Object { $_['name'] -eq $overlayScene['name'] }) { continue }
                            $maxId = 0
                            foreach ($it in $items) { if ([int]$it['id'] -gt $maxId) { $maxId = [int]$it['id'] } }
                            if ($st.ContainsKey('id_counter') -and [int]$st['id_counter'] -gt $maxId) { $maxId = [int]$st['id_counter'] }
                            $nid = $maxId + 1
                            $ni = New-SceneItem $overlayScene $nid $cx $cy
                            $ni['bounds_type'] = 0                      # scena ma już rozmiar płótna
                            [void]$items.Add($ni)                       # ostatni element = na samej górze
                            $st['items'] = $items.ToArray(); $st['id_counter'] = $nid
                        }
                    }
                }

                $coll['sources'] = $sources.ToArray()
                $coll['scene_order'] = $order.ToArray()
                [IO.File]::WriteAllText($collPath, $Json.Serialize($coll), (New-Object Text.UTF8Encoding $false))
                Say 'Sceny i źródła dodane.' 'Green'
                Say "W scenach «${Prefix}Gra – …» dodaj swoje przechwytywanie gry i przesuń je na sam dół listy źródeł." 'Yellow'
                Say 'Kamerka / VTuber: w panelu (Wygląd → Avatar) wybierz tryb, a źródło kamerki ustaw pod układem w miejscu okna.' 'DarkGray'

                # --- dok z panelem
                $bk2 = Backup $iniPath
                $docksRaw = Get-IniValue $ini 'BasicWindow' 'ExtraBrowserDocks'
                $docks = New-Object Collections.ArrayList
                if ($docksRaw) { try { $docks.AddRange([object[]]$Json.DeserializeObject($docksRaw)) } catch {} }
                $dock = $docks | Where-Object { $_['title'] -eq 'Vincent-Media' } | Select-Object -First 1
                if ($dock) { $dock['url'] = $Urls.panel }
                else {
                    $dd = New-Object 'Collections.Generic.Dictionary[string,object]'
                    $dd['title'] = 'Vincent-Media'; $dd['url'] = $Urls.panel; $dd['uuid'] = [guid]::NewGuid().ToString()
                    [void]$docks.Add($dd)
                }
                Set-IniValue $ini 'BasicWindow' 'ExtraBrowserDocks' ($Json.Serialize($docks.ToArray()))
                Save-Ini $ini
                Say 'Dok «Vincent-Media» dodany (OBS: menu Doki).' 'Green'
                Say "Kopie zapasowe: $bk1" 'DarkGray'
                Say "                $bk2" 'DarkGray'
                # --- OBS WebSocket: avatar reagujący na głos i przełączanie scen z panelu / telefonu
                $wsCfg = Join-Path $ObsDir 'plugin_config\obs-websocket\config.json'
                New-Item -ItemType Directory -Force -Path (Split-Path $wsCfg) | Out-Null
                if (Test-Path (Split-Path $wsCfg)) {
                    Say 'OBS WebSocket pozwala nakładkom widzieć poziom mikrofonu (avatar ożywa, gdy mówisz) i przełączać sceny z panelu.' 'Gray'
                    if (Ask 'Włączyć OBS WebSocket i połączyć z nim nakładki?' $true) {
                        $ws = $null
                        if (Test-Path $wsCfg) { try { $ws = $Json.DeserializeObject([IO.File]::ReadAllText($wsCfg, [Text.Encoding]::UTF8)) } catch {} ; [void](Backup $wsCfg) }
                        if (-not $ws) { $ws = New-Object 'Collections.Generic.Dictionary[string,object]' }
                        $ws['server_enabled'] = $true
                        $ws['first_load'] = $false      # inaczej OBS przy pierwszym starcie wygeneruje własne hasło
                        if (-not $ws.ContainsKey('server_port') -or -not $ws['server_port']) { $ws['server_port'] = 4455 }
                        $ws['auth_required'] = $true
                        if (-not $ws.ContainsKey('server_password') -or -not [string]$ws['server_password']) {
                            $chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'.ToCharArray()
                            $ws['server_password'] = -join (1..20 | ForEach-Object { $chars[(Get-Random -Maximum $chars.Length)] })
                        }
                        [IO.File]::WriteAllText($wsCfg, $Json.Serialize($ws), (New-Object Text.UTF8Encoding $false))
                        $dataDir = Join-Path $InstallDir 'detector\data'
                        New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
                        [IO.File]::WriteAllText((Join-Path $dataDir 'obs-ws.json'), $Json.Serialize(@{ port = $ws['server_port']; password = $ws['server_password'] }), (New-Object Text.UTF8Encoding $false))
                        Say "OBS WebSocket włączony (port $($ws['server_port'])). Hasło zapisane dla nakładek." 'Green'
                    }
                }
                $obsConfigured = $true
            } catch {
                Say "Nie udało się skonfigurować OBS: $($_.Exception.Message)" 'Red'
                Say 'Pliki nakładki są zainstalowane – źródła możesz dodać ręcznie (README).' 'Yellow'
            }
        }
    }
}

# ------------------------------------------------------------------ 3. skróty
Step 'Skróty'
$sh = New-Object -ComObject WScript.Shell
$menu = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Vincent-Media'
New-Item -ItemType Directory -Force -Path $menu | Out-Null
function New-Link([string]$path, [string]$target, [string]$dir, [string]$desc, [int]$style = 1) {
    $l = $sh.CreateShortcut($path); $l.TargetPath = $target; $l.WorkingDirectory = $dir; $l.Description = $desc; $l.WindowStyle = $style; $l.Save()
}
$det = Join-Path $InstallDir 'detector'
New-Link (Join-Path $menu 'Wykrywacz gier.lnk') (Join-Path $det 'start-detector.bat') $det 'Wykrywa grę, łączy z Twitchem i pilnuje aktualizacji'
New-Link (Join-Path $menu 'Aktualizuj Vincent-Media.lnk') (Join-Path $InstallDir 'update.bat') $InstallDir 'Sprawdź i zainstaluj aktualizacje nakładek'
New-Link (Join-Path $menu 'Folder Vincent-Media.lnk') $InstallDir $InstallDir 'Pliki nakładek'
New-Link (Join-Path $menu 'Włącz pilota z telefonu.lnk') (Join-Path $det 'enable-remote.bat') $det 'Sterowanie nakładkami z telefonu w sieci domowej'
Say 'Menu Start → Vincent-Media: Wykrywacz gier, Aktualizuj, Folder, Włącz pilota z telefonu.' 'Green'

Step 'Pilot z telefonu'
Say 'Panel można otwierać na telefonie w domowej sieci Wi‑Fi (zmiana gry, ekrany przerw, alerty testowe).' 'Gray'
Say 'Wymaga jednej zgody administratora (wpis w zaporze tylko dla sieci prywatnych). Panel jest chroniony kluczem.' 'DarkGray'
if (Ask 'Włączyć pilota z telefonu?' $true) {
    try { & (Join-Path $det 'enable-remote.ps1') } catch { Say "Nie udało się: $($_.Exception.Message)" 'Yellow' }
}

$startup = Join-Path ([Environment]::GetFolderPath('Startup')) 'Vincent-Media wykrywacz.lnk'
if (Ask 'Uruchamiać wykrywacz razem z Windows (w tle, bez okna)? Pilnuje też aktualizacji.' $true) {
    New-Link $startup (Join-Path $det 'start-detector-hidden.bat') $det 'Vincent-Media: wykrywacz w tle' 7
    Say 'Autostart włączony.' 'Green'
} elseif (Test-Path $startup) { Remove-Item $startup -Force; Say 'Autostart wyłączony.' }

# ------------------------------------------------------------------ gotowe
Step 'Gotowe'
if ($obsConfigured) {
    Say 'Uruchom OBS. Zobaczysz nowe sceny «VM · …» i dok «Vincent-Media» (jeśli go nie widać: menu Doki).' 'White'
    Say 'Dok i nakładki czasem potrzebują chwili na pierwsze załadowanie czcionek.' 'DarkGray'
} else {
    Say 'Adresy do ręcznego dodania w OBS (Źródło przeglądarki, bez «Plik lokalny», 1920×1080):' 'White'
    foreach ($k in $Urls.Keys) { Say "  $k : $($Urls[$k])" 'Gray' }
}
Say 'Aktualizacje instalują się same, gdy działa wykrywacz (sprawdza co 6 godzin).' 'Gray'
if (Ask 'Uruchomić teraz wykrywacz?' $true) {
    Start-Process -FilePath (Join-Path $det 'start-detector.bat') -WorkingDirectory $det
}
Write-Host ''
