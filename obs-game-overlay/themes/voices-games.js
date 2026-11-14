/*
  Dodatkowe głosy gier (ładowane po voices.js):
    • Darkest Dungeon – narrator: podniosły, mroczny, z gorzkim humorem (teksty napisane od zera, w duchu gry),
    • Mass Effect – osobne teksty dla każdej części (wariant z wykrywacza: me1, me2, me3, mea),
    • Command & Conquer – Red Alert, Tiberium, Generals.
  Każda gra może mieć też „scenes” – teksty ekranów przerw i przejść (prep, soon, start, late, brb, brbLate, talk, end).
  Imiona widzów ({user}) stoją tak, żeby zdania nie zależały od płci.
*/
(function () {
  const VO = window.OverlayVoices;
  if (!VO || !VO.games) return;
  const G = VO.games, S = VO.samples || {};

  // ---------------------------------------------------------------- DARKEST DUNGEON – narrator
  G.dd = {
    follow: [
      ['KOLEJNA DUSZA', 'Kolejna dusza schodzi po stopniach w ciemność. {user} jeszcze nie wie, co tam czeka.'],
      ['PRZYBYSZ', 'Dyliżans przywozi {user}. Młodość i zapał – waluta, którą lochy przyjmują najchętniej.'],
      ['KONTRAKT', 'Kontrakt podpisany przez {user}. Atrament jeszcze nie wysechł, a ciemność już zna to imię.'],
      ['ŚWIEŻA KREW', '{user} staje u bram Hamletu. Odwaga to dobry początek. Rzadko – dobry koniec.'],
      ['ZWERBOWANY', 'Rejestr najemników rośnie o jedno imię: {user}. Pióro drży, ale pisze dalej.']
    ],
    sub: [
      ['ZŁOTO DLA RODU', '{user} płaci złotem. Fundamenty Hamletu jęczą z wdzięczności.'],
      ['PRZYSIĘGA', '{user} składa przysięgę wierności. Oby dotrzymaną dłużej niż moje.'],
      ['DAR', 'Hojność {user} rozprasza mrok – choć na chwilę. Czasem chwila wystarczy.'],
      ['ODNOWA', 'Za dar od {user} odbudujemy kuźnię. Stal pamięta tych, którzy za nią zapłacili.']
    ],
    resub: [
      ['WYTRWAŁOŚĆ', '{n}. miesiąc. {user} wciąż stoi, choć rozsądek dawno kazał uciekać.'],
      ['STARY WIARUS', 'Blizny {user} liczą {n} miesięcy. Każda z nich to lekcja – i rachunek.'],
      ['NIEZŁOMNOŚĆ', 'Miesiąc {n}. Ciemność próbowała. {user} – ani kroku w tył.'],
      ['KRONIKA', 'Kronikarz dopisuje kolejny rozdział: {user}, miesiąc {n}. Atramentu starczy na wiele.']
    ],
    gift: [
      ['ZAPASY DLA KOMPANII', '{user} rozdaje {n}× sub. Pochodnie, racje i odrobina nadziei dla każdego.'],
      ['DOBROCZYŃCA', 'Tak rodzą się legendy: {user} dzieli się, gdy inni gromadzą. {n} darów.'],
      ['JAŁMUŻNA', '{n} subów od {user}. Nawet w tej przeklętej ziemi hojność wciąż kwitnie.']
    ],
    cheer: [
      ['BRZĘK MONET', '{n} bitsów od {user}. Złoto pachnie lepiej niż strach.'],
      ['ZA POCHODNIE', '{user} sypie bitsami: {n}. Światło jest drogie. Ciemność – darmowa.'],
      ['SKARB', 'Skrzynia otwarta, a w niej {n} bitsów od {user}. Żadnej pułapki. Tym razem.']
    ],
    raid: [
      ['NAJAZD', 'Bramy Hamletu skrzypią. {user} prowadzi {n} dusz w nasze progi.'],
      ['KOLUMNA NA DRODZE', 'Kurz na drodze, pochodnie w szeregu – to kompania {user}. Niech wejdą, póki jeszcze jasno.'],
      ['ODSIECZ', 'Kiedy nadzieja gasła, przybyła kompania {user}. {n} ostrzy więcej przeciw mrokowi.']
    ],
    redeem: [
      ['ŻYCZENIE', '{user} żąda: {reward}. Ciemność odnotowuje.'],
      ['ZLECENIE Z TAWERNY', '{user} kładzie monetę na stole: {reward}. Ktoś będzie musiał to zrobić.'],
      ['RYTUAŁ', 'Słowa wypowiedziane przez {user}: {reward}. Nie ma odwrotu.']
    ],
    big: [
      ['TRIUMF', 'Wyśmienicie! {user} – taki wyczyn zapisuje się w kronikach rodu złotym atramentem.'],
      ['CIOS OSTATECZNY', 'Bestia pada, a echo niesie imię {user} przez wszystkie korytarze.'],
      ['CNOTA', 'W obliczu otchłani – niezłomność. {user} przekuwa strach w ogień.'],
      ['POCHODNIA NA SZCZYCIE', 'Płomień strzela pod sklepienie! {user} – nawet cienie cofają się z szacunkiem.'],
      ['ZWYCIĘSTWO', 'Rzadko widuję coś takiego. {user} – niech bije dzwon w Hamlecie!']
    ],
    scenes: {
      prep: [['PRZYGOTOWANIA', 'Ostrzcie klingi, liczcie racje. Loch nie wybacza pośpiechu.'], ['ZBIÓRKA W HAMLECIE', 'Wóz z zapasami jeszcze się nie zatrzymał. Cierpliwości.']],
      soon: [['WYPRAWA ZA', 'Każda minuta to jeszcze jeden oddech przed ciemnością.'], ['ZEJŚCIE ZA', 'Pochodnie zapalone. Czekamy, aż wybije godzina.']],
      start: [['ZEJŚCIE', 'Stopnie są śliskie, a powietrze cięższe z każdym krokiem. Zaczynamy.'], ['W DROGĘ', 'Brama się otwiera. Niech światło wytrzyma dłużej niż odwaga.']],
      late: [['ZWŁOKA', 'Przewodnik się spóźnia. Ciemność – nigdy.'], ['OPÓŹNIENIE', 'Nawet najlepszy plan rozpada się w zetknięciu z rzeczywistością. Chwilę jeszcze.']],
      brb: [['OBÓZ', 'Rozpalcie ognisko. Rany się zasklepią, strach – niekoniecznie.'], ['POPAS', 'Krótki odpoczynek. Nasłuchujcie kroków w mroku.']],
      brbLate: [['NOC SIĘ DŁUŻY', 'Ognisko przygasa, a warta wciąż nie wraca. Czekajcie.'], ['CISZA', 'Za długo jest cicho. Zawsze jest za cicho, zanim coś się zacznie.']],
      talk: [['W TAWERNIE', 'Kufle pełne, języki rozwiązane. Opowiadajcie, póki jeszcze możecie.'], ['PRZY KOMINKU', 'Dziś bez lochów. Tylko słowa – one też potrafią ranić.']],
      end: [['POWRÓT', 'Wróciliście – nie wszyscy cali, ale wszyscy żywi. Dziękuję, że szliście ze mną.'], ['KONIEC WYPRAWY', 'Pochodnia gaśnie. Do następnego zejścia – oby nie ostatniego.']]
    }
  };
  S.dd = ['na pochodnie', 'żeby stres spadł', 'za ród i Hamlet', 'na odbudowę kuźni', 'wytrwałości!'];

  // ---------------------------------------------------------------- MASS EFFECT – wspólne + osobne części
  G.me.scenes = {
    prep: [['PRZYGOTOWANIE DO STARTU', 'Kontrola systemów napędu. Załoga na stanowiska.']],
    soon: [['SKOK ZA', 'Przekaźnik naładowany. Czekamy na sygnał.']],
    start: [['START', 'Kurs ustalony. Wchodzimy w przekaźnik.']],
    late: [['OPÓŹNIENIE STARTU', 'Kontrola lotów wstrzymuje start. Jeszcze chwila.']],
    brb: [['POSTÓJ W DOKU', 'Normandia uzupełnia paliwo. Zaraz wracamy.']],
    brbLate: [['NAPRAWY SIĘ PRZEDŁUŻAJĄ', 'Inżynieria prosi o cierpliwość.']],
    talk: [['KAJUTA KAPITANA', 'Rozmowy z załogą. Pytajcie śmiało.']],
    end: [['KONIEC MISJI', 'Raport złożony. Dziękuję, załogo.']]
  };
  G.mele = {
    follow: [['WYBÓR MISJI', '{user} – trylogia czeka. Od której części zaczynamy?']],
    scenes: { start: [['WYBÓR MISJI', 'Trzy części, jedna załoga. Wybieram kurs.']] }
  };
  G.me1 = {
    follow: [['NOWY REKRUT SOJUSZU', '{user} melduje się na pokładzie SR-1.'], ['SKAN PLANETY', 'Wykryto nowy sygnał: {user}.']],
    sub: [['STATUS WIDMA', '{user} – Rada przyznaje status Widma.'], ['ŁAZIK GOTOWY', 'Sub od {user}. Lądujemy, choćby na pionowej ścianie.']],
    resub: [['WETERAN CYTADELI', 'Miesiąc {n}. – {user} zna każdy zakątek Prezydium.']],
    gift: [['ZAOPATRZENIE SOJUSZU', '{user} wysyła {n}× sub dla załogi SR-1!']],
    cheer: [['KREDYTY', 'Bitsy: {n} – {user} kupuje lepszy pancerz u kwatermistrza.']],
    raid: [['FLOTA SOJUSZU', 'Okręty {user} wychodzą z przekaźnika nad Cytadelą!']],
    big: [['WIDMO W AKCJI', '{user} – Rada nie będzie zadowolona. Ale to działa.'], ['PRZEKAŹNIK AKTYWNY', '{user} – podróż, którą wszyscy zapamiętają.']],
    scenes: { start: [['START SR-1', 'Pierwszy lot. Galaktyka jeszcze nie wie, co ją czeka.']], brb: [['POSTÓJ NA CYTADELI', 'Zakupy w Prezydium. Zaraz wracamy.']] }
  };
  G.me2 = {
    follow: [['NOWE AKTA', '{user} – akta przejrzane, rekrut przyjęty.'], ['WERBUNEK', '{user} dołącza do drużyny na misję bez powrotu.']],
    sub: [['LOJALNOŚĆ ZDOBYTA', '{user} – misja lojalnościowa zaliczona.'], ['MODERNIZACJA SR-2', 'Sub od {user} – grubsze opancerzenie, większe szanse.']],
    resub: [['STARA ZAŁOGA', 'Miesiąc {n}. – {user} wciąż na pokładzie, mimo wszystkich misji samobójczych.']],
    gift: [['DOSTAWA BEZ PYTAŃ', '{user} finansuje {n}× sub. Nikt nie pyta o źródło.']],
    cheer: [['SUROWCE', 'Bitsy: {n} – {user} wysyła sondy na każdą planetę.']],
    raid: [['ABORDAŻ', 'Drużyna {user} przechodzi przez przekaźnik – bez odwrotu!']],
    big: [['WSZYSCY PRZEŻYLI', '{user} – cała załoga wraca do domu!'], ['BEZ ODWROTU', '{user} – przez przekaźnik i z powrotem.']],
    scenes: { start: [['START SR-2', 'Nowy statek, nowa załoga, stara sprawa.']], end: [['MISJA ZAKOŃCZONA', 'Wszyscy na pokładzie. Dziękuję, załogo.']] }
  };
  G.me3 = {
    follow: [['ZASÓB WOJENNY', '{user} – nowy zasób na mapie wojny.'], ['SOJUSZNIK', '{user} dołącza do galaktycznej koalicji.']],
    sub: [['GOTOWOŚĆ +1', '{user} – flota rośnie w siłę.'], ['ZJEDNOCZENIE', 'Sub od {user}. Każda rasa się liczy.']],
    resub: [['NIE PODDAJEMY SIĘ', 'Miesiąc {n}. – {user} walczy do końca.']],
    gift: [['KOALICJA', '{user} zbiera flotę: {n}× sub!']],
    cheer: [['WYSIŁEK WOJENNY', 'Bitsy: {n} – {user} dokłada się do budowy broni.']],
    raid: [['FLOTY PRZYBYWAJĄ', 'Ekipa {user} wychodzi z przekaźnika – odbijamy Ziemię!']],
    big: [['ODBIĆ ZIEMIĘ', '{user} – cała galaktyka staje ramię w ramię.'], ['JEDEN Z NICH PADŁ', '{user} – a więc da się ich pokonać!']],
    scenes: { start: [['ZIEMIA PŁONIE', 'Nie ma czasu. Zaczynamy.']], end: [['PO BITWIE', 'Cokolwiek wybierzemy – dziękuję, że byliście.']] }
  };
  G.mea = {
    follow: [['PIONIER', '{user} wychodzi z kriostazy.'], ['NOWY ŚWIAT', '{user} – placówka założona.']],
    sub: [['ŻYWOTNOŚĆ +10%', '{user} – planeta coraz bardziej przyjazna.']],
    big: [['NOWY DOM', '{user} – Andromeda wreszcie wita nas z otwartymi ramionami.']]
  };
  Object.assign(S, {
    me1: ['dla załogi SR-1', 'na nowy łazik', 'za Cytadelę'],
    me2: ['na modernizację SR-2', 'za lojalność', 'żeby wszyscy przeżyli'],
    me3: ['dla koalicji', 'na zasoby wojenne', 'odbijamy Ziemię'],
    mea: ['dla pionierów', 'na nową placówkę', 'za Andromedę']
  });

  // ---------------------------------------------------------------- COMMAND & CONQUER
  G.ra = {
    follow: [['JEDNOSTKA GOTOWA', '{user} – zgłasza się do bazy.'], ['NOWY REKRUT', '{user} wyszkolony w koszarach.']],
    sub: [['WIEŻA TESLI NAŁADOWANA', '{user} – napięcie maksymalne!'], ['NOWE ZBROJENIA', 'Sub od {user}. Fabryka pracuje pełną parą.']],
    resub: [['WETERAN FRONTU', 'Miesiąc {n}. – {user} zdobywa kolejną belkę.']],
    gift: [['ZRZUT ZAOPATRZENIA', '{user} zrzuca {n}× sub nad bazą!']],
    cheer: [['KREDYTY', 'Bitsy: {n} – rafineria pracuje na pełnych obrotach.']],
    raid: [['WYKRYTO SIŁY', 'Ekipa {user} na radarze! Kierunek: nasza baza.']],
    redeem: [['ROZKAZ', '{user}: {reward}']],
    big: [['ŻELAZNA KURTYNA', '{user} – nietykalni na pełne pół minuty!'], ['CHRONOSFERA', '{user} przenosi całą armię w mgnieniu oka!']],
    scenes: {
      start: [['MISJA ROZPOCZĘTA', 'Budowa bazy w toku. Cel: przetrwać.']], brb: [['ZAWIESZENIE BRONI', 'Krótka przerwa na froncie.']],
      end: [['MISJA ZAKOŃCZONA', 'Raport z frontu wysłany. Dziękuję, towarzysze broni.']]
    }
  };
  G.cnc = {
    follow: [['JEDNOSTKA WYSZKOLONA', '{user} – gotowość potwierdzona.'], ['NOWY SYGNAŁ', '{user} na radarze.']],
    sub: [['TYBERIUM ZEBRANE', '{user} – zielone kryształy płyną do rafinerii.'], ['KONSTRUKCJA UKOŃCZONA', 'Sub od {user}.']],
    resub: [['STARY KOMANDOR', 'Miesiąc {n}. – {user} pamięta pierwszą wojnę o tyberium.']],
    gift: [['ZRZUT ZAOPATRZENIA', '{user} rozdaje {n}× sub!']],
    cheer: [['KREDYTY', 'Bitsy: {n} – zbieracz wraca pełny.']],
    raid: [['ATAK NA BAZĘ', 'Siły {user} wchodzą na mapę!']],
    redeem: [['ROZKAZ', '{user}: {reward}']],
    big: [['DZIAŁO JONOWE GOTOWE', '{user} – cel namierzony. Ogień z orbity!'], ['ODLICZANIE ZAKOŃCZONE', '{user} – superbroń odpalona!']],
    scenes: {
      start: [['ZAŁADOWANO MISJĘ', 'Komandorze, oczekujemy rozkazów.']], brb: [['PRZERWA W TRANSMISJI', 'Łączność zostanie przywrócona.']],
      end: [['MISJA WYKONANA', 'Teren zabezpieczony. Dziękuję, komandorzy.']]
    }
  };
  G.gen = {
    follow: [['NOWY ŻOŁNIERZ', '{user} – rekrut gotowy do akcji.'], ['ZGŁOSZENIE', '{user} melduje się w sztabie.']],
    sub: [['PUNKT GENERALSKI', '{user} – awans przyznany!'], ['ZRZUT', 'Sub od {user} – paczka spada na spadochronie.']],
    resub: [['KOLEJNA GWIAZDKA', 'Miesiąc {n}. – {user} awansuje dalej.']],
    gift: [['TRANSPORT LOTNICZY', '{user} zrzuca {n}× sub z samolotu transportowego!']],
    cheer: [['ZAOPATRZENIE', 'Bitsy: {n} – kolejny zrzut dla bazy.']],
    raid: [['KOLUMNA PANCERNA', 'Ekipa {user} wjeżdża na pole bitwy!']],
    redeem: [['ROZKAZ SZTABU', '{user}: {reward}']],
    big: [['SUPERBROŃ GOTOWA', '{user} – odliczanie zakończone!'], ['NALOT', '{user} wzywa wsparcie z powietrza – cała mapa drży!']],
    scenes: {
      start: [['ODPRAWA', 'Generale, mapa gotowa. Zaczynamy.']], brb: [['POSTÓJ', 'Uzupełniamy zapasy. Zaraz wracamy.']],
      end: [['KONIEC OPERACJI', 'Operacja zakończona. Dziękuję, żołnierze.']]
    }
  };
  Object.assign(S, {
    ra: ['dla wieży Tesli', 'na nowy czołg', 'za radar!'],
    cnc: ['na tyberium', 'dla zbieracza', 'działo jonowe gotowe'],
    gen: ['punkt generalski!', 'na zrzut', 'za kolumnę pancerną']
  });

  // ---------------------------------------------------------------- krótkie teksty ekranów dla reszty gier (przejścia i ekrany przerw)
  const quick = (start, brb, end) => ({ start: [start], brb: [brb], end: [end] });
  if (G.cp && !G.cp.scenes) G.cp.scenes = quick(['WPINAM SIĘ', 'Night City nie śpi. My też nie.'], ['PRZERWA W SIECI', 'Chwilowy brak sygnału, choom.'], ['WYPINAM SIĘ', 'Dzięki, ekipo. Do następnej roboty.']);
  if (G.hk && !G.hk.scenes) G.hk.scenes = quick(['WĘDRÓWKA', 'Królestwo czeka w ciszy.'], ['ŁAWKA', 'Odpoczynek na ławce. Zaraz w drogę.'], ['KONIEC PIEŚNI', 'Nić się nie urwała. Dziękuję.']);
  if (G.wf && !G.wf.scenes) G.wf.scenes = quick(['WYLOT Z ORBITERA', 'Tenno, misja przydzielona.'], ['ORBITER', 'Przerwa na pokładzie.'], ['POWRÓT NA ORBITER', 'Misja zakończona. Dzięki, Tenno.']);
  if (G.tal && !G.tal.scenes) G.tal.scenes = quick(['PIERWSZY RZUT', 'Kości poszły w ruch.'], ['POSTÓJ W GOSPODZIE', 'Tura zawieszona.'], ['KONIEC GRY', 'Korona zdobyta albo nie – dzięki za grę.']);
  if (G.pal && !G.pal.scenes) G.pal.scenes = quick(['WYPRAWA!', 'Pale gotowe do drogi.'], ['W BAZIE', 'Pale pracują, ja odpoczywam.'], ['DO JUTRA!', 'Pale idą spać. Dzięki!']);
  if (G.dl && !G.dl.scenes) G.dl.scenes = quick(['MECZ', 'Linie ustawione. Patron patrzy.'], ['ZA ZAMKIEM', 'Przerwa w Wydziale.'], ['ZAMEK ZAMKNIĘTY', 'Dzięki, agenci.']);
  if (G.cs && !G.cs.scenes) G.cs.scenes = quick(['ROZGRZEWKA', 'Kupujemy i ruszamy.'], ['TAKTYCZNA PRZERWA', 'Pauza techniczna.'], ['GG', 'Dzięki za mecz!']);

  // ---------------------------------------------------------------- warianty części (wykrywacz / nazwa gry)
  Object.assign(G, {
    // Red Alert
    ra2: {
      follow: [['NOWY REKRUT', '{user} – koszary gotowe, jednostka przeszkolona.'], ['SZPIEG?', '{user} wchodzi do bazy. Psy już węszą.']],
      sub: [['CEWKA TESLI', '{user} – ładujemy pełną moc!'], ['CHRONOSFERA', 'Sub od {user} – przeniesiony prosto do bazy.']],
      big: [['APOKALIPSA', '{user} – czołgi Apokalipsy w drodze!'], ['ATAK PRZEZ CZAS', '{user} – cała armia zjawia się znikąd!']],
      scenes: { start: [['ODPRAWA', 'Towarzyszu komandorze, front czeka.']], brb: [['ZAWIESZENIE BRONI', 'Krótka przerwa na froncie zimnej wojny.']] }
    },
    yr: {
      follow: [['UMYSŁ PRZEJĘTY', '{user} – a jednak dołącza… z własnej woli?'], ['NOWY ADEPT', '{user} wstępuje do Inicjatywy.']],
      sub: [['KONTROLA UMYSŁÓW', '{user} – jeden sub, jedna myśl, wspólny cel.'], ['KLON', 'Sub od {user}. A może to klon?']],
      big: [['DOMINATOR PSYCHICZNY', '{user} – cała mapa myśli to samo: wow!'], ['MASOWE PRZEJĘCIE', '{user} – czat należy teraz do nas.']],
      scenes: { brb: [['MEDYTACJA', 'Umysły odpoczywają. Zaraz wracamy.']] }
    },
    ra3: {
      follow: [['NOWA JEDNOSTKA', '{user} – gotowość potwierdzona, dowódco.'], ['WIELKA TRÓJKA', '{user} wybiera stronę. Dobrą, mam nadzieję.']],
      sub: [['TECHNOLOGIA PRZYSZŁOŚCI', '{user} – sub i od razu ulepszenie!'], ['WSPARCIE FLOTY', 'Sub od {user} – okręty zmieniają się w czołgi.']],
      big: [['BROŃ OSTATECZNA', '{user} – trzy strony stają w miejscu!'], ['WIELKA OFENSYWA', '{user} – front rusza na całej długości!']],
      scenes: { start: [['TRZY STRONY', 'Sowieci, Alianci, Imperium – zaczynamy.']] }
    },
    up: { follow: [['POWSTANIE', '{user} – kolejny głos w rewolcie.']], big: [['ZWYCIĘSKIE POWSTANIE', '{user} – stary porządek się chwieje!']] },
    // Tiberium
    ts: {
      follow: [['NOWY KOMANDOR', '{user} – pole tyberium czeka na wydobycie.']],
      sub: [['MECH GOTOWY', '{user} – kroczący robot w natarciu!']],
      big: [['DZIAŁO JONOWE', '{user} – burza jonowa nad całą mapą!']],
      scenes: { brb: [['BURZA JONOWA', 'Łączność przerwana – zaraz wracamy.']] }
    },
    fs: { follow: [['BURZA OGNIA', '{user} – wchodzi w sam środek ognia.']], big: [['FIRESTORM AKTYWNY', '{user} – ściana ognia nie do przejścia!']] },
    tw: {
      follow: [['NOWE ZGŁOSZENIE', '{user} – EVA potwierdza rekruta.']],
      sub: [['TYBERIUM ZEBRANE', '{user} – rafinerie pracują bez przerwy.']],
      big: [['WOJNA O TYBERIUM', '{user} – cały kraj to widzi!'], ['ATAK Z ORBITY', '{user} – działo jonowe gotowe do strzału!']]
    },
    kw: {
      follow: [['WIERNY NOD', '{user} – braterstwo rośnie.']],
      sub: [['POKÓJ PRZEZ MOC', 'Sub od {user}. Kane się uśmiecha.']],
      big: [['GNIEW KANE’A', '{user} – świątynia drży!']],
      scenes: { start: [['BRACTWO WZYWA', 'Wierni, zbiórka. Zaczynamy.']] }
    },
    c4: { follow: [['ZMIERZCH', '{user} – ostatni rozdział tyberium.']] },
    // Generals
    zh: {
      follow: [['GODZINA ZERO', '{user} – rekrut gotowy na ostatnią operację.']],
      sub: [['GENERAŁ AWANSUJE', '{user} – nowe moce generalskie!']],
      big: [['GODZINA ZERO WYBIŁA', '{user} – superbroń w pełnej gotowości!']]
    },
    // Hollow Knight / Silksong
    silk: {
      follow: [['NOWA PIELGRZYMKA', '{user} wspina się ku cytadeli.'], ['NIĆ ZAWIĄZANA', '{user} – nowa nić w pieśni.']],
      sub: [['JEDWAB', '{user} – dzięki, szpula pełna.'], ['IGŁA I NIĆ', 'Sub od {user}. Zszyte na amen.']],
      big: [['PIEŚŃ JEDWABIU', '{user} – cała cytadela śpiewa!'], ['BEZ JEDNEGO TRAFIENIA', '{user} – taniec z igłą, czysto!']],
      scenes: { start: [['WSPINACZKA', 'Pielgrzymka rusza w górę.']], brb: [['ODPOCZYNEK', 'Ławka, chwila ciszy, zaraz dalej.']] }
    },
    hk1: {
      follow: [['NOWY WĘDROWIEC', '{user} schodzi do królestwa w głębi.']],
      sub: [['ODŁAMEK MASKI', '{user} – jedno serce więcej.']],
      big: [['KRÓLESTWO CI DZIĘKUJE', '{user} – nawet cisza zrobiła się głośniejsza.']]
    },
    // Darkest Dungeon II – droga dyliżansem ku Górze
    dd2: {
      follow: [['NOWY PASAŻER', 'Dyliżans przystaje. {user} wsiada, nie pytając o cel.'], ['DROGA', '{user} rusza z nami. Koła skrzypią, a Góra czeka.']],
      sub: [['PŁOMIEŃ', '{user} dokłada do latarni. Płomień płonie jaśniej.'], ['RELACJA', 'Sub od {user}. W tej drużynie ktoś komuś jeszcze ufa.']],
      big: [['GÓRA SIĘ ZBLIŻA', '{user} – na takie czyny czekała cała ta przeklęta droga.'], ['NADZIEJA', '{user} – w tej ciemności to coś więcej niż światło.']],
      scenes: {
        start: [['W DROGĘ', 'Latarnia zapalona, koła naoliwione. Ruszamy ku Górze.']],
        brb: [['GOSPODA', 'Postój w gospodzie. Rany, wino i stare urazy.']],
        end: [['KONIEC ETAPU', 'Dyliżans staje. Dziś dotarliśmy dalej niż wczoraj.']]
      }
    },
    // Talisman
    tal5: { follow: [['NOWY POSZUKIWACZ', '{user} wybiera postać i rusza po Koronę.']] }
  });
  Object.assign(S, {
    ra2: ['dla wieży Tesli', 'chronosfera gotowa'], yr: ['kontrola umysłów!', 'to nie ja, to Yuri'], ra3: ['dla floty', 'trzy strony, jeden stream'],
    tw: ['na tyberium', 'dla bractwa'], kw: ['pokój przez moc'], zh: ['punkt generalski!'],
    silk: ['na jedwab', 'za każdą nić'], dd2: ['na płomień latarni', 'za dyliżans']
  });

  // ---------------------------------------------------------------- Visual Novel
  G.vn = {
    follow: [['NOWY CZYTELNIK', '{user} otwiera kolejny rozdział.'], ['WYBÓR ZAPISANY', '{user} – ta decyzja będzie miała znaczenie.']],
    sub: [['ŚCIEŻKA ODBLOKOWANA', '{user} – nowa ścieżka w historii.'], ['ZAKŁADKA', 'Sub od {user}. Zapisuję grę.']],
    resub: [['KOLEJNY ROZDZIAŁ', 'Miesiąc {n}. – {user} zna każdą gałąź fabuły.']],
    gift: [['WSPÓLNE CZYTANIE', '{user} rozdaje {n}× sub – czytamy razem!']],
    cheer: [['CG ODBLOKOWANE', 'Bitsy: {n} – {user} dorzuca nową ilustrację do galerii.']],
    raid: [['NOWI CZYTELNICY', 'Ekipa {user} siada przy tekście!']],
    redeem: [['WYBÓR CZATU', '{user}: {reward}']],
    big: [['PRAWDZIWE ZAKOŃCZENIE', '{user} – tego nikt się nie spodziewał.'], ['ZWROT AKCJI', '{user} – cała fabuła stanęła na głowie!']],
    scenes: {
      start: [['ROZDZIAŁ PIERWSZY', 'Tekst się ładuje. Czytamy razem.']], brb: [['ZAPISANO GRĘ', 'Krótka przerwa między rozdziałami.']],
      end: [['KONIEC ROZDZIAŁU', 'Dziękuję, że czytaliście ze mną.']], talk: [['MIĘDZY ROZDZIAŁAMI', 'Gadamy o wyborach i postaciach.']]
    }
  };
  G.sc = {
    follow: [['NOWY BLACKRUNNER', '{user} – szkolenie zaczyna się teraz.'], ['SYGNAŁ W STREFIE', '{user} – ktoś jeszcze żyje w tej ciemności.']],
    sub: [['WSPARCIE ZESPOŁU', '{user} – w czarnej strefie nikt nie idzie sam.']],
    big: [['PRZEŻYŁEŚ STREFĘ', '{user} – wracamy z czarnej strefy w jednym kawałku!']],
    scenes: { start: [['WYJŚCIE W STREFĘ', 'Sprzęt sprawdzony. Ruszamy.']], brb: [['OBÓZ', 'Ognisko, kawa i chwila ciszy przed strefą.']] }
  };
  S.vn = ['za ten wybór!', 'na kolejny rozdział', 'czytamy dalej'];
  S.sc = ['dla Blackrunnerów', 'uważaj w strefie'];

  // ---------------------------------------------------------------- Blender / modelowanie 3D
  G.mk = {
    follow: [['NOWY WIERZCHOŁEK', '{user} – siatka rośnie.'], ['DODANO DO SCENY', '{user} – Shift+A i jest.']],
    sub: [['SUBDIVISION +1', '{user} – model od razu gładszy.'], ['MATERIAŁ NAŁOŻONY', 'Sub od {user}. Wreszcie nie szary.']],
    resub: [['STARY MODELARZ', 'Miesiąc {n}. – {user} widział każdy n-gon na tym kanale.']],
    gift: [['PACZKA ASSETÓW', '{user} rozdaje {n}× sub – każdy dostaje teksturę!']],
    cheer: [['MOC OBLICZENIOWA', 'Bitsy: {n} – {user} kupuje kilka próbek renderu.']],
    raid: [['NOWE KOLEKCJE', 'Ekipa {user} wpada do sceny!']],
    redeem: [['ZLECENIE', '{user}: {reward}']],
    big: [['RENDER GOTOWY', '{user} – 4K, wszystkie próbki, zero szumu!'], ['ZERO N-GONÓW', '{user} – idealna topologia!']],
    scenes: {
      prep: [['OTWIERAM PROJEKT', 'Ładuję scenę i tekstury.']], start: [['MODELUJEMY', 'Siatka gotowa, zaczynamy.']],
      brb: [['RENDER SIĘ LICZY', 'Komputer pracuje, ja robię herbatę.']], brbLate: [['RENDER SIĘ CIĄGNIE', 'Jeszcze kilka próbek…']],
      talk: [['POGADAJMY O 3D', 'Pytajcie o modelowanie i Blendera.']], end: [['ZAPISANO PROJEKT', 'Ctrl+S i dziękuję za wspólne modelowanie!']]
    }
  };
  S.mk = ['na lepszą kartę graficzną', 'mniej n-gonów!', 'za ten render'];
})();
