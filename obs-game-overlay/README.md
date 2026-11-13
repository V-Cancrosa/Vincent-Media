# OBS Game Overlay

Nakładka „Teraz gram” do OBS na nagrania i streamy na YouTube i Twitchu. Nazwę gry możesz wpisać sam albo pozwolić, żeby została wykryta automatycznie – tak jak robi to Discord. Nakładka sama dobiera kolor do gry.

- `overlay.html` – sama nakładka; w OBS dodajesz ją jako **źródło przeglądarki** (Browser Source)
- `panel.html` – panel sterowania; w OBS dodajesz go jako **dock przeglądarki** (Custom Browser Dock)
- `scenes.html` – ekrany przerw („Zaraz zaczynamy”, „Przerwa”, „Koniec”) z odliczaniem; w OBS osobne **źródło przeglądarki**
- `alerts.html` – alerty z Twitcha (follow, sub, raid…); w OBS osobne **źródło przeglądarki**
- `detector/` – wykrywacz gier i połączenie z Twitchem dla Windows (skrypt PowerShell, nic nie trzeba instalować)

Do wpisywania gry ręcznie wystarczą dwa pliki HTML.

## Motywy

`neon` · `glass` · `minimal` · `retro` (pixel art) · `esport` (pasek)

**Motywy gier** (włączają się same, gdy gra ma swój motyw; można to wyłączyć w panelu):
Elden Ring · Minecraft · Fortnite · League of Legends · VALORANT · Counter-Strike 2 · GTA V · Cyberpunk 2077.
Mają animowane ozdobniki wystające nad panel i cząsteczki wokół niego. Cała grafika jest narysowana od zera (SVG i canvas), bez logotypów i grafik z gier – licencja CC0. Definicje są w `themes/games.js` i `themes/games.css`.

**Motywy postaci:** Vince · Chip · Ragnar · Toro · Myr-35 · Zarin (w panelu w grupie *Postacie*, w adresie `theme=g-vince` itd.).
Kolory, czcionki i motywy pochodzą ze stron postaci. Każda postać ma swój napis nad nazwą gry, dopóki w panelu zostaje domyślny „Teraz gram”.
Gdy gra ma własny motyw i opcja *gra ma własny motyw → włącz go sam* jest zaznaczona, motyw gry wygrywa z motywem postaci.
Portrety w `themes/fursona/` należą do autorów ilustracji (patrz `themes/fursona/CREDITS.md`) i nie są na licencji CC0.

**Animacje** są zawsze włączone, niezależnie od ustawień systemu. Wyłącza je tylko opcja *ogranicz animacje* w panelu (albo `motion=reduced` w adresie).

Kolor akcentu jest liczony z nazwy gry, więc każda gra ma swój stały kolor. Możesz też ustawić własny kolor w panelu.
Gry ze Steama dostają okładkę ze sklepu Steam, pozostałe wykryte gry – ikonę z Discorda. Jeśli nie ma żadnego obrazka, nakładka pokazuje monogram, np. **ER** dla Elden Ring.

## Instalacja w OBS

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

## Ekrany przerw

`scenes.html` to pełnoekranowe tło na sceny „Zaraz zaczynamy”, „Przerwa” i „Koniec” w aktywnym motywie: duża karta z odliczaniem, tło z cząsteczkami, duża postać albo emblemat obok, a na dole Twoje linki i ostatni follow / sub z Twitcha.

W OBS dodaj źródło przeglądarki `file:///C:/OBS/obs-game-overlay/scenes.html` (1920×1080). Są dwie możliwości:
- **Jedno źródło**, a ekran wybierasz w panelu (sekcja *Ekrany przerw*).
- **Osobne źródło na każdą scenę OBS**: `scenes.html?scene=start`, `scenes.html?scene=brb`, `scenes.html?scene=end`. Wtedy przełączenie sceny w OBS od razu pokazuje właściwy ekran.

W panelu ustawiasz odliczanie (minuty + *Start*), podpis pod odliczaniem (pusty = „Dziś: [gra]”) i linki w stopce.
Każda postać ma własne napisy, np. Myr-35: „TRANSMISJA ZA” / „PRZERWA SERWISOWA” / „KONIEC ZMIANY”.

## Alerty z Twitcha

Follow, sub, resub, gifty, bitsy, raid i nagrody za punkty kanału – bez StreamElements. Alerty mają wygląd aktywnego motywu (bazowego, gry albo postaci), własne napisy postaci i dźwięki generowane w przeglądarce (bez plików, bez licencji).

### W OBS

*Źródła → + → Przeglądarka*, odznaczone „Plik lokalny”, URL:
`file:///C:/OBS/obs-game-overlay/alerts.html`, 1920×1080. Ustaw źródło **nad** resztą sceny.
Żeby dźwięk alertów szedł przez mikser OBS, zaznacz w źródle *Kontroluj dźwięk przez OBS*.

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
