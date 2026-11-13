# Vincent-Media

Narzędzia do nagrywania i streamowania (YouTube, Twitch, OBS).

## Instalacja (Windows)

Pobierz i kliknij dwa razy **[Zainstaluj-Vincent-Media.bat](https://github.com/V-Cancrosa/Vincent-Media/raw/main/Zainstaluj-Vincent-Media.bat)**
albo wklej w PowerShellu:

```powershell
irm https://raw.githubusercontent.com/V-Cancrosa/Vincent-Media/main/install.ps1 | iex
```

Instalator pobiera najnowszą wersję, za Twoją zgodą dodaje do OBS sceny, źródła i dok z panelem (z kopią zapasową ustawień OBS) i tworzy skróty w menu Start.
Potem wszystko aktualizuje się samo. Szczegóły: [obs-game-overlay/README.md](obs-game-overlay/README.md).

| Folder | Co to jest |
|---|---|
| [`obs-game-overlay`](obs-game-overlay) | Nakładka „Teraz gram” do OBS: nazwa gry wpisana ręcznie albo wykryta automatycznie (własny wykrywacz dla Windows ze Steamem i bazą gier Discorda, opcjonalnie Discord), 5 motywów, panel sterowania jako dok w OBS; alerty z Twitcha (follow, sub, raid…) bez StreamElements |
