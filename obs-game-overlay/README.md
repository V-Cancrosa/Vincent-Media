# OBS Game Overlay

Nakładka „Teraz gram” do OBS na nagrania i streamy na YouTube i Twitchu. Nazwę gry możesz wpisać sam albo pozwolić, żeby została wykryta automatycznie – tak jak robi to Discord. Nakładka sama dobiera kolor do gry.

- `overlay.html` – sama nakładka; w OBS dodajesz ją jako **źródło przeglądarki** (Browser Source)
- `panel.html` – panel sterowania; w OBS dodajesz go jako **dock przeglądarki** (Custom Browser Dock)
- `scenes.html` – ekrany: przygotowania, stream za X, start, spóźnienie, przerwa, koniec z napisami
- `layouts.html` – układy: gra na pełny ekran (dymki czatu), gra w ramce (czat obok), rozmowa; z miejscem na avatara/kamerkę
- `chat.html` – czat z Twitcha: dymki albo panel, z wyglądem wybieranym przez widzów
- `alerts.html` – alerty z Twitcha (follow, sub, raid…); w OBS osobne **źródło przeglądarki**
- `detector/` – wykrywacz gier i połączenie z Twitchem dla Windows (skrypt PowerShell, nic nie trzeba instalować)

Do wpisywania gry ręcznie wystarczą dwa pliki HTML.

## Motywy

`neon` · `glass` · `minimal` · `retro` (pixel art) · `esport` (pasek)

**Motywy gier** (włączają się same, gdy gra ma swój motyw; można to wyłączyć w panelu):
Talisman (obie edycje) · Palworld · Mass Effect · Warframe · Deadlock · Darkest Dungeon · Hollow Knight (też Silksong) · Cyberpunk 2077 · Counter-Strike 2 · C&C: Red Alert · C&C: Tiberium · C&C: Generals.

**Mass Effect Legendary Edition** startuje launcherem, a potem uruchamia jedną z części jako osobny program. Wykrywacz to widzi i podaje część: *Mass Effect 1/2/3 (Legendary Edition)*. Każda ma własny wygląd i teksty – ME1 niebieski Sojusz i SR-1, ME2 pomarańczowy Cerber i misja samobójcza, ME3 czerwień Żniwiarzy i zasoby wojenne, Andromeda turkus pionierów. Sam launcher ma neutralny „wybór misji”.

**Części innych gier** – wykrywacz albo nazwa gry podaje część, a motyw zmienia kolory, napis i teksty:
- Red Alert: 1 / Remastered, 2, *Yuri's Revenge* (fiolet kontroli umysłów), 3, *Uprising*,
- Tiberium: *Tiberian Dawn* / Remastered, *Tiberian Sun*, *Firestorm*, *C&C 3*, *Kane's Wrath* (czerwień Bractwa), *C&C 4*,
- Generals / *Zero Hour*, Hollow Knight / *Silksong*, Darkest Dungeon / *Darkest Dungeon II* (dyliżans i droga ku Górze), Talisman 4. / 5. edycja.

**Visual Novel** – motyw okna dialogowego z plakietką imienia. Włącza się sam dla SoulCreeka (ma własny wariant „Blackrunner”) i dla **każdej gry na silniku Ren'Py**: wykrywacz rozpoznaje silnik po plikach gry i bierze nazwę z folderu, np. „Soulcreek-0.10-pc” → „Soulcreek”.

**Blender / 3D** – gdy działa Blender (albo ZBrush, Substance, Houdini, Maya, 3ds Max, Cinema 4D; a bez własnego motywu także Krita, Aseprite, Clip Studio, Photoshop, Unity, Unreal, Godot), karta mówi **„Teraz tworzę”** zamiast „Teraz gram”. Motyw ma obracającą się siatkę, a ekrany i alerty mówią po modelarsku („Render się liczy – zaraz wracam”). Flagowanie botów nie traktuje tego jak grania.

**Darkest Dungeon** mówi głosem narratora: podniośle, mrocznie i z gorzkim humorem – w alertach, na ekranach przerw i w przejściach (teksty napisane od zera, w duchu gry).
W plikach są też Elden Ring, Minecraft, Fortnite, League of Legends, VALORANT i GTA V – działają przy wykryciu gry, ale nie ma ich na liście w panelu (nie ma ich w bibliotece). Listę ukrytych zmienisz w `themes/library.js`.
Długie nazwy gier i nicki nie są ucinane „…”: czcionka się zmniejsza, a w razie potrzeby tekst przechodzi do drugiej linijki.
Mają animowane ozdobniki wystające nad panel i cząsteczki wokół niego. Cała grafika jest narysowana od zera (SVG i canvas), bez logotypów i grafik z gier – licencja CC0. Definicje są w `themes/games.js` i `themes/games.css`.

**Motywy postaci:** Vince · Chip · Ragnar · Toro · Myr-35 · Zarin (w panelu: *Postać*; „bez postaci” wraca do wybranego stylu, a gra zostaje; w adresie `theme=g-vince` itd.).
Myr-35 ma głowę protogena w ujęciu 3/4 z gęstą matrycą LED (mimika: spokój, mrugnięcie, uśmiech, mówienie przy mikrofonie, zakłócenia przy Nanite Syndrome). Domyślnie losuje rejestr; w panelu można go ustawić na stałe (protokół / człowiek / terminal / Nanite Syndrome).
Kolory, czcionki i motywy pochodzą ze stron postaci. Każda postać ma swój napis nad nazwą gry, dopóki w panelu zostaje domyślny „Teraz gram”.
Gdy gra ma własny motyw i opcja *gra ma własny motyw → włącz go sam* jest zaznaczona, motyw gry wygrywa z motywem postaci.
Portrety w `themes/fursona/` należą do autorów ilustracji (patrz `themes/fursona/CREDITS.md`) i nie są na licencji CC0.

**Fuzja postaci z grą** (panel → Wygląd → Karta → „Gdy gra ma własny motyw”):

| Tryb | Proporcja | Wygląd | Teksty |
|---|---|---|---|
| **Pół na pół** (domyślny) | 50:50 | karta postaci z wymieszanymi kolorami, obwódką i odznaką gry | pół na pół |
| Sam motyw gry | – | tylko gra | tylko gra |
| Ignoruj motywy gier | – | tylko postać / styl | tylko postać |
| 🧪 Postać bazą, gra dodatkiem | 66:33 | eksperymentalny – do dopracowania | ⅔ postać, ⅓ gra |
| 🧪 Gra bazą, postać dodatkiem | 33:66 | eksperymentalny – do dopracowania | ⅓ postać, ⅔ gra |

Każda gra z motywem ma własne teksty alertów (i na duże zdarzenia). Przykładowe wiadomości w alertach testowych też są w stylu aktywnej postaci i gry.

**Animacje** są zawsze włączone, niezależnie od ustawień systemu. Wyłącza je tylko opcja *ogranicz animacje* w panelu (albo `motion=reduced` w adresie).

Kolor akcentu jest liczony z nazwy gry, więc każda gra ma swój stały kolor. Możesz też ustawić własny kolor w panelu.
Gry ze Steama dostają okładkę ze sklepu Steam, pozostałe wykryte gry – ikonę z Discorda. Jeśli nie ma żadnego obrazka, nakładka pokazuje monogram, np. **ER** dla Elden Ring.

## Instalacja automatyczna (zalecana)

1. Pobierz **[Zainstaluj-Vincent-Media.bat](https://github.com/V-Cancrosa/Vincent-Media/raw/main/Zainstaluj-Vincent-Media.bat)** i kliknij go dwa razy.
   Jeśli Windows pokaże „System Windows ochronił ten komputer”: *Więcej informacji → Uruchom mimo to*.
   Zamiast pliku możesz wkleić w PowerShellu: `irm "https://raw.githubusercontent.com/V-Cancrosa/Vincent-Media/main/install.ps1?t=$(Get-Random)" | iex`
2. Instalator:
   - pobiera pliki do `%LOCALAPPDATA%\Vincent-Media\obs-game-overlay` (nie potrzebuje uprawnień administratora),
   - pyta, czy skonfigurować OBS (OBS musi być wtedy zamknięty). Jeśli tak, dodaje:
     - źródła przeglądarki `VM · Teraz gram`, `VM · Alerty`, `VM · Ekran start/przerwa/koniec`,
     - scenę **`VM · Nakładki`** (karta z grą + alerty) i – jeśli chcesz – kładzie ją na wierzch Twoich istniejących scen,
     - sceny `VM · Zaraz zaczynamy`, `VM · Przerwa`, `VM · Koniec`,
     - dok **Vincent-Media** z panelem,
     - i wszystko dopasowuje do rozdzielczości Twojego płótna OBS,
   - przed zmianami robi kopię zapasową plików OBS (`*.vm-backup-data-godzina` obok oryginału),
   - tworzy skróty w menu Start (*Vincent-Media → Wykrywacz gier / Aktualizuj / Folder*) i opcjonalnie autostart wykrywacza.
3. Uruchom OBS.

Instalator można uruchomić ponownie, np. po zmianie kolekcji scen. Nie tworzy wtedy duplikatów, tylko aktualizuje adresy.

### Aktualizacje

- Gdy działa wykrywacz, co 6 godzin sprawdza na GitHubie, czy jest nowa wersja. Jeśli jest, podmienia zmienione pliki i uruchamia się od nowa. Nakładki i panel w OBS same się odświeżają.
- Twoje dane zostają: logowanie Twitcha, baza gier i `my-games.txt`. Ustawienia panelu są w OBS, więc aktualizacja ich nie rusza.
- W panelu, w sekcji **Wersja**, widać zainstalowaną wersję, jest przycisk *Sprawdź aktualizacje* / *Aktualizuj teraz* i można wyłączyć automatyczne aktualizacje.
- Ręcznie: *Menu Start → Vincent-Media → Aktualizuj* (albo `update.bat` w folderze nakładek).

### Odinstalowanie

Usuń sceny `VM · …` i dok w OBS, folder `%LOCALAPPDATA%\Vincent-Media`, folder *Vincent-Media* w menu Start i skrót *Vincent-Media wykrywacz* w autostarcie (`Win+R` → `shell:startup`).

## Instalacja ręczna w OBS

1. Pobierz folder `obs-game-overlay` na dysk, np. do `C:\OBS\obs-game-overlay\`.
2. **Nakładka:** *Źródła → + → Przeglądarka*
   - **Nie** zaznaczaj „Plik lokalny”. W polu URL wpisz:
     `file:///C:/OBS/obs-game-overlay/overlay.html`
   - Szerokość `1920`, wysokość `1080` (albo rozdzielczość Twojej sceny).
3. **Panel:** *Doki → Własne doki przeglądarki…*
   - Nazwa: `Gra`
   - URL: `file:///C:/OBS/obs-game-overlay/panel.html`

> Oba adresy muszą zaczynać się od `file:///`, czyli tak samo. Tylko wtedy panel i nakładka „widzą się” nawzajem. Opcja „Plik lokalny” zmienia adres na `http://absolute/…` i synchronizacja przestaje działać.

Gotowe. W docku wpisujesz nazwę gry i wciskasz Enter, a nakładka zmienia się z animacją. Ostatnie gry zostają w panelu jako przyciski do szybkiego wyboru.

## Automatyczne wykrywanie gry (Windows)

W folderze `detector` jest wykrywacz, który działa tak jak wykrywanie gier w Discordzie, ale bez Discorda:

1. raz w tygodniu pobiera publiczną bazę gier Discorda (ok. 22 tys. gier i ich plików `.exe`),
2. co 3 sekundy sprawdza, jakie programy są uruchomione, i szuka wśród nich gry,
3. pyta Steama, jaka gra jest właśnie włączona – stąd pewna nazwa i okładka,
4. przekazuje wynik nakładce pod adresem `http://localhost:7777` (tylko na Twoim komputerze, nic nie wychodzi na zewnątrz).

### Uruchomienie

Dwuklik na **`detector\start-detector.bat`**. Otworzy się okno, w którym widać, co zostało wykryte, np.:

```
[20:14:03] Wczytano bazę: 11197 gier/plików
[20:14:03] Nasłuchuję na http://localhost:7777/
[20:15:41] Gra: ELDEN RING   (steam, eldenring.exe)
```

Okno możesz zminimalizować. Zamknięcie okna wyłącza wykrywacz. Nakładka sama to zauważy i wróci do gry wpisanej ręcznie.

W panelu, w sekcji **Lokalny wykrywacz**, powinien pojawić się zielony napis **DZIAŁA**.

> Przy pierwszym uruchomieniu skrypt pobiera bazę gier (ok. 12 MB) – może to potrwać kilkanaście sekund.
> Jeśli Windows pokaże „System Windows ochronił ten komputer”, kliknij *Więcej informacji → Uruchom mimo to*. Żeby tego uniknąć, przed rozpakowaniem ZIP-a kliknij go prawym → *Właściwości* → zaznacz *Odblokuj*.

**Bez okna / autostart:** `start-detector-hidden.bat` uruchamia wykrywacz w tle. Żeby startował razem z Windows, wciśnij `Win+R`, wpisz `shell:startup` i wrzuć tam skrót do `start-detector-hidden.bat`. Wyłączenie: Menedżer zadań → *Windows PowerShell* → Zakończ zadanie.

### Gra nie została wykryta albo wykryło się coś, co nie jest grą

- **Gry nie ma w bazie** (np. mała gra z itch.io albo emulator): włącz grę, przełącz się na nią na chwilę i wróć do OBS. W panelu wybierz jej okno z listy, wpisz nazwę i kliknij **Dodaj jako grę**.
- **Wykryło coś, co nie jest grą:** w panelu kliknij **To nie gra – ignoruj**.

Obie rzeczy zapisują się w pliku `detector\my-games.txt`, który możesz też edytować ręcznie:

```
# plik.exe = Nazwa gry | opcjonalny adres okładki
dolphin.exe = Dolphin (GameCube)
mygame.exe = Moja Gra | https://example.com/cover.jpg
# ignorowanie:
!wallpaper64.exe
!steam:431960
```

Nazwy z tego pliku mają pierwszeństwo przed bazą Discorda, więc możesz w nim też zmienić nazwę wykrywanej gry.

### Kolejność, gdy działa kilka źródeł naraz

| Tryb (panel → *Wykrywanie gier*) | Co pokazuje |
|---|---|
| **Auto** (domyślny) | gra z wykrywacza → gra z Discorda → gra wpisana ręcznie |
| **Tylko ręcznie** | tylko to, co wpiszesz |
| **Tylko wykryta automatycznie** | wykrywacz albo Discord; gdy nic nie jest uruchomione, nakładka się chowa |

Jeśli wpiszesz ręcznie tę samą nazwę co wykryta gra, Twój podtytuł i okładka mają pierwszeństwo.
Licznik czasu przy wykrytej grze liczy od uruchomienia gry, przy wpisanej ręcznie – od chwili jej ustawienia.

## Start: wszystko na co dzień w jednej zakładce

Panel otwiera się na zakładce **Start**:
- **stan** wykrywacza, OBS i Twitcha (kliknięcie prowadzi do ustawień). Gdy wykrywacz nie odpowiada, panel po kilku sekundach sam go uruchamia (raz), a przycisk *Uruchom wykrywacz* zostaje na wszelki wypadek. Działa, jeśli przy instalacji zgodzisz się na „uruchamianie z OBS i strażnika” (adres `vincentmedia://start` + zadanie, które co 5 minut sprawdza, czy wykrywacz żyje),
- **Co dziś?** – główny sposób wyboru gry. Lista gier i programów, które już uruchamiałeś (dopisują się same), a pod nią **wszystkie zainstalowane gry ze Steama**. *Wybierz* = ta gra jest na nakładce bez względu na wykrywanie; pod każdą pozycją wybierasz **motyw gry** (automatycznie, dowolny motyw z listy albo „bez motywu – sama postać”). ▶ uruchamia grę, ✕ chowa ją z listy, *↺ auto* wraca do automatycznego wykrywania,
- **automatyczne przechwytywanie**: panel dodaje źródło `VM · Gra (automatycznie)` do wszystkich scen (odznaczysz w *W których scenach*) i ustawia je na okno uruchomionej gry: Windows Graphics Capture, z kursorem, tylko zawartość okna,
- **mikrofon**: jeśli OBS nie ma mikrofonu ani w *Ustawienia → Dźwięk*, ani jako źródła, panel dodaje `VM · Mikrofon` (domyślny mikrofon Windows) do scen,
- **Sceny** – jedyne miejsce do zmiany scen: ekrany VM (przed streamem, przerwa, koniec), gra, rozmowa i Twoje własne sceny z OBS, zawsze z przejściem,
- **szybki test** alertów, czatu i bota.

Reszta jest w zakładkach **Sterowanie** (gra ręcznie, odliczanie i napisy ekranów, alerty), **Wygląd**, **Czat** i **Więcej** (Twitch, OBS, wykrywacz, funkcje, telefon, wersja).

### Postać prowadzi, gra jest naszyta (tryb „Łatka”)

Stream zawsze prowadzi jedna z postaci, więc domyślny tryb fuzji to **Łatka**: karta, czcionki, kolory i portret są postaci, a gra jest na nią naszyta – naszywka z **logo gry** (dla gier ze Steama) albo emblematem motywu, wstążka w kolorach gry przyszyta do dołu karty i cząsteczki gry. Pozostałe tryby (50:50, sam motyw gry, eksperymentalne) są w *Wygląd → Gdy gra ma własny motyw*.

Portret postaci jest **wkomponowany w kartę**: dolna krawędź karty jest przed postacią, a górna – za nią (głowa wychodzi ponad kartę). W lewym rogu ekranu postać stoi z lewej i patrzy w prawo, w prawym – z prawej i patrzy w lewo (portret odbija się sam). Na pełnoekranowej grze nie ma już drugiego, dużego portretu w rogu – jest tylko ten w karcie.

### Grafiki gier

Logo, okładkę i tło gry ze Steama nakładka bierze **z pamięci Steama na Twoim komputerze** (`Steam\appcache\librarycache`, przez wykrywacz), a gdy ich tam nie ma – z publicznego CDN Steama. Repozytorium nie zawiera i nie rozpowszechnia tych grafik. Wszystkie logotypy, okładki i grafiki gier są własnością ich wydawców i twórców; używam ich z sympatii do tych gier, wyłącznie po to, żeby pokazać, w co gram. Jeśli właściciel praw ma zastrzeżenia – napisz (zgłoszenie w repozytorium), a grafika zostanie usunięta od razu. Wyłączenie: `gameLogo: false` w ustawieniach (wtedy zostaje emblemat motywu).

Reszta jest w zakładkach **Sterowanie** (gra ręcznie, ekrany, alerty), **Wygląd**, **Czat** i **Więcej** (Twitch, OBS, wykrywacz, funkcje, telefon, wersja).

## Panel i pilot z telefonu

Panel ma zakładki **Na żywo** (gra, ekrany przerw, alerty testowe), **Wygląd**, **Połączenia** i **Ustawienia**.
W *Ustawienia → Funkcje* włączasz tylko to, czego używasz – wyłączone rzeczy (np. Discord) znikają z panelu.

**Pilot z telefonu:** ten sam panel na telefonie w domowej sieci Wi‑Fi – zmieniasz grę, motyw, ekran przerwy albo wywołujesz alert testowy, a OBS od razu to pokazuje (nawet przy zamkniętym doku).

1. Raz: *Menu Start → Vincent-Media → Włącz pilota z telefonu* (albo zgoda w instalatorze). Windows poprosi o zgodę administratora: wykrywacz dostaje pozwolenie na nasłuchiwanie w sieci, a zapora przepuszcza port 7777 **tylko w sieciach prywatnych**.
2. W panelu w OBS: *Ustawienia → Pilot z telefonu* – zeskanuj kod QR telefonem.

Adres zawiera klucz dostępu (bez niego wykrywacz nie odpowiada nikomu spoza komputera) – nie pokazuj go na streamie.
Jeśli telefon się nie łączy, sprawdź, czy sieć Wi‑Fi jest w Windows ustawiona jako *prywatna*.
Wyłączenie pilota: `detector\enable-remote.bat -Disable`.

Ustawienia panelu są teraz zapisywane w wykrywaczu (`detector\data\settings.json`), więc dok i telefon widzą to samo. Bez wykrywacza panel działa jak wcześniej, tylko w OBS.

## Ekrany i układy

Instalator dodaje wszystko jako sceny OBS `VM · …`. Każdy ekran ma motyw aktywnej postaci (z fuzją z grą), cząsteczki na całym ekranie, przelatujący snop światła przy zmianie ekranu i teksty w głosie postaci.

**Ekrany pełnoekranowe** – `scenes.html?scene=…`:

| Ekran | `scene=` | Co pokazuje |
|---|---|---|
| Stream w przygotowaniu | `prep` | „W przygotowaniu” + odhaczana lista (scena, dźwięk, mikrofon, czat…) |
| Stream za X czasu | `soon` | odliczanie do terminu (dni/godziny), „start jutro o 20:00” |
| Stream się zaczyna | `start` | odliczanie minut |
| Stream się spóźnia | `late` | licznik spóźnienia „+05:12”; włącza się sam 30 s po końcu odliczania startu |
| Przerwa | `brb` | odliczanie; po jego końcu sam przechodzi w „przerwa się przedłuża” (`brb-late`) |
| Koniec | `end` | przewijane napisy: obecni na czacie i każdy follow, sub, gift, bitsy, raid i nagroda z tego streama |

**Układy** – `layouts.html?layout=…` (źródło gry/kamerki w OBS kładziesz **pod** układem):

| Układ | `layout=` | Co jest na ekranie |
|---|---|---|
| Gra na pełny ekran | `game-full` | przezroczysty; czat jako **pasek przewijany w bok** (jak w wiadomościach – nie zasłania gry), dymki albo bez czatu; avatar w rogu |
| Gra w ramce | `game-frame` | gra w animowanej ramce 1440×810 (lewy górny róg 40,40), obok avatar i czat na stałe, pod grą ostatnie zdarzenia i linki |
| Rozmowa | `talk` | duży avatar, temat rozmowy, czat |

**Avatar / kamerka** (panel → Wygląd → Avatar): *art postaci* (ożywa, gdy mówisz), *kamerka* (przezroczyste okno w ramce – kamerkę ustaw w OBS pod układem w tym miejscu), *VTuber* (okno bez ramki) albo *bez avatara*.
Możesz też podać własne obrazki „cisza” i „mówię” (PNGtuber).

W panelu (Na żywo → Ekrany) wybierasz ekran, odliczanie, termin dla „Stream za…”, temat rozmowy, podpis i linki w stopce.

### Ułożenie i miejsce na alerty

Nic na siebie nie nachodzi:
- **Ekrany przerw** – u góry jest pas na alerty, po prawej postać (albo napisy końcowe), na dole stopka. Karta z odliczaniem stoi w tym, co zostaje, i sama się zmniejsza, gdy tekst jest długi.
- **Alerty wiedzą, która scena jest na wizji** (OBS mówi to źródłom, a panel podaje nazwę sceny). Na przerwach pokazują się w pasie u góry, w grze na pełnym ekranie u góry na środku, a w układach z czatem (*Gra – w ramce*, *Rozmowa*) **są częścią czatu**, jako wyróżniona wiadomość z dźwiękiem. Wyłączysz to w *Na żywo → Alerty* – wtedy alert w ramce pojawi się nad paskiem pod grą, a w rozmowie nad tematem.
- Karta alertu zawsze mieści się na ekranie (zmniejsza się zamiast wychodzić poza krawędź).
- **Gra na pełnym ekranie** – avatar stoi nad kartą „Teraz gram”, a pasek czatu podnosi oba.
- **Rozmowa** – długi temat dostaje mniejszą czcionkę (najwyżej trzy linijki).

### Przejścia między ekranami

Źródło `VM · Przejścia` (`transition.html`) leży na wierzchu każdej sceny VM. Gdy zmieniasz ekran albo scenę z panelu (także z telefonu), obraz najpierw zasłania animacja, potem OBS przełącza scenę cięciem, a na końcu obraz się odsłania. W środku pojawia się napis w głosie postaci albo gry, np. narratora Darkest Dungeon.

| Rodzaj | Kiedy (automatycznie) |
|---|---|
| mrok i pochodnia | Darkest Dungeon, Talisman, Elden Ring |
| hologram (heksy, skan) | Mass Effect, Warframe, Tiberium |
| glitch | Cyberpunk 2077, Myr-35 |
| stalowe wrota | Red Alert, Generals, Deadlock, Zarin |
| jedwab i nić | Hollow Knight |
| koło (przesłona) | Palworld, Chip |
| granat hukowy | Counter-Strike 2 |
| korektor (słupki w rytm) | Ragnar |
| drzwi shoji | Toro |
| plan architekta | Vince |
| piksele | Retro, Minecraft |
| skośne pasy | pozostałe style |

W środku przejścia mówi postać albo gra: zdanie o ekranie, na który przechodzisz, czasem komentarz do samej zmiany, a przy powrocie do gry – zdanie o powrocie (np. narrator Darkest Dungeon: „Z powrotem w ciemność”, Myr: „Ta jednostka wznawia operację”). Wszystkie te zdania widać w galerii powiadomień.

**Długość przejścia** (Na żywo → Ekrany → Przejścia): *krótkie* – sam napis, ok. 1,4 s; *zwykłe* – napis i zdanie, 2–4 s; *długie* – czas na przeczytanie, 4–9 s zależnie od długości tekstu. Scena w OBS przełącza się zawsze w chwili, gdy obraz jest zasłonięty.

Rodzaj możesz też wybrać na stałe (Na żywo → Ekrany → Przejścia), wyłączyć napis albo całe przejścia. Po aktualizacji ze starszej wersji kliknij tam *Dodaj źródło przejść do scen OBS* – panel doda je przez WebSocket (bez ponownej instalacji). Przełączanie scen bezpośrednio w OBS działa jak dotąd, bez tej animacji.

## Połączenie z OBS: avatar reagujący na głos i przełączanie scen

Nakładki łączą się z wbudowanym w OBS **WebSocketem** (OBS 28+). Instalator włącza go sam, ustawia hasło i przekazuje je nakładkom – nic nie trzeba wpisywać.
- **Avatar ożywa, gdy mówisz:** nakładki czytają poziom Twojego mikrofonu z OBS (bez dostępu do mikrofonu w przeglądarce). Art postaci podskakuje i świeci, a na ekranach przerw reaguje duża postać. Własne obrazki „cisza” / „mówię” ustawisz w panelu (Wygląd → Avatar).
- **Sceny OBS z panelu i z telefonu:** w zakładce *Na żywo* są przyciski wszystkich scen OBS (aktualna podświetlona na czerwono). Wybór ekranu (np. „Przerwa”) przełącza też scenę `VM · Przerwa`.
- W *Połączenia → OBS* wybierasz mikrofon i próg głosu (z podglądem poziomu na żywo).

Ręcznie: OBS → *Narzędzia → Ustawienia serwera WebSocket* → włącz, ustaw hasło i wpisz je w panelu (*Połączenia → OBS → Ręczne połączenie*).

## Czat i komendy dla widzów

`chat.html` pokazuje czat z Twitcha na nakładce (wymaga połączenia z Twitchem – patrz niżej):
- `chat.html` – **dymki**: wiadomości wyskakują i po chwili znikają (do gry na pełnym ekranie). `?pos=br|bl|tr|tl`, `?life=12` (sekundy), `?width=560`.
- `chat.html?mode=panel` – **czat na stałe** (do układu z grą w ramce).
- Pasek czatu jest też na samej nakładce „Teraz gram” – czyli w każdej scenie z grą (wyłączysz w Czat → Na ekranie). Wiadomości to wyraźne kafelki z kolorem widza.
- `chat.html?mode=ticker` – **pasek** u dołu ekranu, wiadomości jadą od prawej do lewej; przy większym ruchu pasek przyspiesza. `?pos=top`, `?speed=140`.

Emotki, kolory nicków i odznaki (HOST, MOD, VIP, SUB) są pokazywane. Wygląd czatu łączy się z aktywnym motywem (i grą przy fuzji).

**Widzowie sami decydują o swoim wyglądzie** – komendy w czacie (wybór zapamiętuje wykrywacz w `detector\data\viewers.json`):

| Komenda | Co robi |
|---|---|
| `!styl neon` | styl dymka: `neon`, `szklo`, `pixel`, `komiks`, `terminal`, `papier`, `holo`, `sakura`, `ogien`, `lod` |
| `!kolor turkus` | kolor nicku: `czerwony`, `pomaranczowy`, `zolty`, `zielony`, `turkus`, `niebieski`, `fiolet`, `rozowy`, `bialy`, `zloty` albo `#rrggbb` |
| `!efekt konfetti` | efekt na cały ekran: `konfetti`, `serca`, `gwiazdy`, `fajerwerki`, `iskry`, `babelki` (raz na minutę na osobę, co najmniej 15 s przerwy między efektami) |
| `!reset` | powrót do wyglądu domyślnego |

Komenda nie pojawia się w czacie na ekranie – zamiast niej widać krótkie potwierdzenie („LunaFox → styl: pixel ✓”).
Efekty można też dać jako **nagrody za punkty kanału**: nagroda o nazwie zawierającej np. „Efekt: konfetti” uruchamia efekt bez limitu.
Efekty pokazuje źródło `alerts.html`, więc musi być w scenie.

## Język streama: polski albo angielski

Panel → Wygląd → **Język streama**. Po angielsku jest wszystko, co widać na streamie: napisy nad grą („Now playing”), alerty i ich opisy, ekrany przerw i napisy końcowe, przejścia, pasek czatu i głosy postaci (każda zachowuje swój charakter – Chip dalej małymi literami, Myr w czterech rejestrach, narrator Darkest Dungeon po angielsku). Panel zostaje po polsku. Własny napis wpisany w panelu nie jest tłumaczony.

## Testy: galeria, stały napływ, test bota

- **Galeria powiadomień** (Na żywo → Alerty → *Galeria*) – wszystkie teksty aktywnej postaci i gry naraz, w prawdziwym wyglądzie karty: zwykłe, na duże zdarzenia, części gier, rejestry Myr; pod spodem teksty ekranów i alerty w czacie.
- **Stały napływ czatu / alertów** (Czat → Na ekranie) – co chwilę wiadomość albo alert; co kilka wiadomości wpada bot.
- **Test bota** – wiadomość w stylu bota przechodzi przez ocenę czatu, a wynik (poziom i powody) pojawia się od razu pod przyciskami. *Pokazuj podejrzane* wyświetla je na ekranie z ⚑ zamiast ukrywać.

## Archiwum, statystyki i podejrzane konta

Wykrywacz zapisuje każdy stream (od startu do końca na Twitchu) w `detector\data\archive\streams\`:
- `<data_godzina>.jsonl` – cały czat i wszystkie alerty z godziną,
- `<data_godzina>.json` – podsumowanie: czas, kategoria i gry, widzowie co minutę (szczyt, średnia), wiadomości, czatownicy (w tym nowi), follow, suby, gifty, bitsy, raidy, najaktywniejsi na czacie, oflagowani.

`detector\data\archive\chatters.json` pamięta każdego czatownika: pierwszą i ostatnią wizytę, liczbę wiadomości i streamów, wiek konta.

W panelu, w zakładce **Czat**:
- **Statystyki** – bieżący stream (z wykresem widzów) i lista poprzednich. Każdy możesz pobrać jako **TXT** (czat z czasem od startu), **SRT** (napisy z czatem do nagrania) albo **JSON**.
- **Moderacja** – wiadomości z flagą. Flaga to podpowiedź, nie wyrok. Liczą się:
  - wiek konta z Twitcha (godziny / dni),
  - link albo reklama widzów i followów na początku znajomości,
  - ogólnikowe „fajnie grasz / nice stream” jako pierwsza wiadomość,
  - pisanie o graniu, gdy kategoria to np. *Art*, *Software and Game Development*, *Just Chatting* i nic nie jest uruchomione (np. modelujesz w Blenderze, a ktoś pisze „fajnie grasz”),
  - ten sam tekst od kilku kont w ciągu minuty.

  Suby, VIP-y i moderatorzy nie są oceniani. *Zaufaj* zdejmuje flagę na stałe. Wiadomości z flagą „podejrzane” domyślnie nie trafiają na ekran (do wyłączenia w *Czat → Na ekranie*).
- **Nagrywanie** – OBS może sam zacząć nagrywać lokalnie, gdy zaczynasz stream (i zatrzymać po końcu). Twitch trzyma VOD-y tylko 7 dni (afilianci 14, partnerzy 60), a lokalne nagranie zostaje na zawsze. Plik SRT z czatem pasuje do takiego nagrania.

## Alerty z Twitcha

Follow, sub, resub, gifty, bitsy, raid i nagrody za punkty kanału – bez StreamElements. Alerty mają wygląd aktywnego motywu (bazowego, gry albo postaci), własne napisy postaci i dźwięki generowane w przeglądarce (bez plików, bez licencji).

### W OBS

*Źródła → + → Przeglądarka*, odznaczone „Plik lokalny”, URL:
`file:///C:/OBS/obs-game-overlay/alerts.html`, 1920×1080. Ustaw źródło **nad** resztą sceny.
Żeby dźwięk alertów szedł przez mikser OBS, zaznacz w źródle *Kontroluj dźwięk przez OBS*.

**Poziomy reakcji (1–5):** im większe zdarzenie, tym większy, dłuższy i głośniejszy alert. Od poziomu 3 – efekt na cały ekran, gwiazdki i inne teksty postaci (Myr częściej mówi wtedy „ja”), od 4 – drżenie ekranu i bas, 5 – fanfara i „LEGENDARNE”. Avatar w układach i postać na ekranach podskakują tym mocniej, im wyższy poziom.

| Zdarzenie | 2 | 3 | 4 | 5 |
|---|---|---|---|---|
| Bitsy | 100+ | 500+ | 1000+ | 5000+ |
| Gift (liczba subów) | 2+ | 5+ | 10+ | 50+ |
| Resub (miesiące) | 3+ | 6+ | 12+ | 24+ |
| Raid (widzowie) | 5+ | 20+ | 50+ | 200+ |
| Nagroda (koszt w punktach) | 500+ | 2000+ | 10 000+ | 50 000+ |

Sub to poziom 2, Tier 2 i Tier 3 podnoszą poziom o 1 i 2. Progi zmienisz w `themes/tiers.js`.

**Szybkie powiadomienia** (⚡ na podglądzie w panelu albo w sekcji Alerty): alert pojawia się od razu, nowy przerywa bieżący, a całość trwa 2,5 s – do szybkiego sprawdzania wyglądu. Wyłączone = normalna kolejka.
Przy przyciskach testowych wybierasz **wielkość zdarzenia** (1–5), żeby sprawdzić każdy poziom.

W panelu, w sekcji **Alerty**, są przyciski testowe i ustawienia: które alerty pokazywać, głośność, czas, pozycja i wielkość.
Przyciski testowe działają także bez połączenia z Twitchem.

### Połączenie z Twitchem (raz, ok. 3 minuty)

Alerty przychodzą przez wykrywacz (`detector\start-detector.bat`), więc musi być uruchomiony.

1. Wejdź na <https://dev.twitch.tv/console/apps> i zaloguj się kontem kanału. Twitch wymaga włączonego logowania dwuetapowego.
2. **Register Your Application**:
   - *Name*: dowolna, unikalna, np. `VincentMedia Overlay`
   - *OAuth Redirect URLs*: `http://localhost` (pole jest wymagane, ale nieużywane)
   - *Category*: `Broadcaster Suite`
   - *Client Type*: **Public**
3. Kliknij **Manage** przy aplikacji i skopiuj **Client ID**. Sekretu nie trzeba.
4. W panelu, w sekcji **Twitch**, wklej Client ID i kliknij **Połącz z Twitchem**.
5. Panel pokaże kod. Wejdź na <https://www.twitch.tv/activate> (może być na telefonie), wpisz kod i zatwierdź.
6. Panel pokaże **POŁĄCZONO**. W oknie wykrywacza zobaczysz, które zdarzenia są aktywne.

Logowanie zostaje zapamiętane (zaszyfrowane Twoim kontem Windows w `detector\data\twitch-token.bin`) i odświeża się samo.
Jeśli nie używasz komputera z Twitchem przez ponad 30 dni, trzeba będzie połączyć się jeszcze raz.

> Sub, resub, gifty i bitsy działają tylko na kanałach z afiliacją lub partnerstwem. Bez nich wykrywacz po prostu pominie te zdarzenia.

## Wykrywanie przez Discord (opcjonalnie)

Zamiast wykrywacza (albo obok niego) możesz użyć Discorda przez [Lanyard](https://github.com/Phineas/lanyard). Nie trzeba wtedy niczego uruchamiać, ale Discord musi być włączony.

1. Dołącz do serwera Lanyard: <https://discord.gg/lanyard>. Wystarczy być na serwerze.
2. W Discordzie: *Ustawienia → Prywatność aktywności → Udostępniaj wykrytą aktywność innym* musi być **włączone**.
3. Skopiuj swoje **User ID**: *Ustawienia → Zaawansowane → Tryb dewelopera: włącz*, potem prawy klik na swój avatar → *Kopiuj ID użytkownika*.
4. Wklej ID w panelu, w sekcji **Discord (Lanyard)**.

> Prywatność: po dołączeniu do serwera Lanyard Twój status Discorda (gra, Spotify itp.) jest dostępny publicznie przez API dla każdego, kto zna Twoje ID. Lokalny wykrywacz nie ma tej wady.

## Bez panelu – wszystko w adresie URL

Nakładka działa też sama, z ustawieniami w adresie. W panelu, w sekcji *Link bez panelu*, jest gotowy adres z obecnymi ustawieniami. Przykład:

```
file:///C:/OBS/obs-game-overlay/overlay.html?panel=0&game=Elden%20Ring&theme=esport&pos=br
```

| Parametr | Wartości | Domyślnie |
|---|---|---|
| `game` | nazwa gry | – |
| `sub` | podtytuł | – |
| `cover` | URL obrazka | – |
| `discord` | Discord User ID | – |
| `mode` | `auto`, `manual`, `detect` (tylko wykryta) | `auto` |
| `ignore` | lista nazw gier po przecinku | – |
| `local` | `0` wyłącza lokalny wykrywacz | `1` |
| `localUrl` | adres wykrywacza | `http://localhost:7777` |
| `theme` | `neon`, `glass`, `minimal`, `retro`, `esport` albo motyw gry: `g-elden`, `g-mc`, `g-fn`, `g-lol`, `g-val`, `g-cs`, `g-gta`, `g-cp` | `neon` |
| `pos` | `tl`, `tc`, `tr`, `bl`, `bc`, `br` | `bl` |
| `label` | napis nad nazwą | `Teraz gram` |
| `accent`, `accent2` | kolor hex bez `#`, np. `ff3366` | auto |
| `scale` | np. `1.5` | `1` |
| `margin` | odstęp od krawędzi w px | `40` |
| `timer`, `icon`, `showLabel` | `0` wyłącza | `1` |
| `gameThemes` | `0` = nie zmieniaj motywu na motyw gry | `1` |
| `motion` | `reduced` = ogranicz animacje | `full` |
| `panel` | `0` = ignoruj ustawienia z panelu | – |

Z `panel=0` możesz zrobić kilka źródeł z różnymi stałymi ustawieniami. Bez `panel=0` ustawienia z panelu nadpisują te z adresu.

## Wskazówki

- Nakładka ma przezroczyste tło, więc nie trzeba dodawać żadnego CSS w ustawieniach źródła.
- Odśwież źródło w OBS (*Właściwości → Odśwież pamięć podręczną bieżącej strony*), jeśli podmienisz pliki na nowszą wersję.
- Czcionki są pobierane z Google Fonts. Bez internetu nakładka użyje czcionek systemowych.
