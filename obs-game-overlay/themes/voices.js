/*
  Głosy postaci w powiadomieniach i na ekranach.
  Każdy wpis to [nagłówek, zdanie]. W zdaniu: {user} – nick, {n} – liczba (miesiące, suby, bitsy, widzowie),
  {reward} – nagroda za punkty, {game} – aktualna gra. Zdanie może być puste ('').

  Myr-35 mówi w czterech rejestrach (losowanych z wagami):
    protocol – „ta jednostka” melduje, pełne regulaminowe zdania (najczęściej),
    human    – „ja” wymyka się, gdy coś naprawdę się liczy,
    terminal – czysty log z konsoli,
    syndrome – Nanite Syndrome: nanity w pętli włącz–wyłącz, tekst się rwie, karta drga.
*/
(function () {
  const V = {
    // ---------------------------------------------------------------- domyślne (motywy bazowe i gry)
    _: {
      follow: [['Nowy obserwujący', 'Witaj na pokładzie, {user}!'], ['Nowa osoba na kanale', 'Rozgość się, {user}.'], ['Nowy follow', 'Dzięki, że zostajesz!'], ['Ktoś nowy w ekipie', 'Miło Cię widzieć, {user}.']],
      sub: [['Nowa subskrypcja', 'Ogromne dzięki, {user}!'], ['Sub!', 'To naprawdę pomaga – dziękuję!'], ['Nowy subskrybent', '{user} dołącza do ekipy.']],
      resub: [['Subskrypcja przedłużona', '{n}. miesiąc razem. Dzięki, {user}!'], ['Wierny widz', 'Miesiąc {n}. z rzędu – szacun.'], ['Resub', 'Dalej razem – dzięki, {user}!']],
      gift: [['Prezent dla czatu', '{user} rozdaje suby!'], ['Deszcz subów', 'Wielkie serce, {user}!'], ['Gifty!', '{n}× sub leci w czat.']],
      cheer: [['Bitsy!', 'Dzięki za wsparcie, {user}!'], ['Bitsy lecą', 'Bitsy: {n} – dziękuję!'], ['Cheer!', 'Doceniam, {user}.']],
      raid: [['Raid!', 'Witajcie, ekipo {user}!'], ['Najazd!', 'Rozgośćcie się wszyscy!'], ['Goście!', '{user} przyprowadza ekipę: {n}!']],
      redeem: [['Nagroda za punkty', '{user}: {reward}'], ['Punkty kanału', '{reward} – przyjęte!'], ['Zamówienie z czatu', '{user} wybiera: {reward}']]
    },

    // ---------------------------------------------------------------- Vince: analityczny, oszczędny, Dual Path
    vince: {
      follow: [['Nowa ścieżka', 'Witaj, {user}. Każdy krok tworzy grunt pod następny.'], ['Nowy obserwujący', 'Rozsądny wybór, {user}.'], ['Ktoś nowy', 'Mury mają koniec. Ty właśnie przeszedłeś przez jeden.'], ['Dołącza {user}', 'Szeroka sieć, a jednak – zapamiętam.']],
      sub: [['Nowa subskrypcja', 'Fundament pod coś większego. Dziękuję, {user}.'], ['Sub', 'Bez skrótów – i bez Ciebie byłoby trudniej.'], ['Wsparcie', 'Mosty mają powód. Ty jesteś jednym z nich.']],
      resub: [['{n}. miesiąc', 'Konsekwencja robi wrażenie bardziej niż rozmach.'], ['Przedłużone', 'Wąskie drzwi, {user} – a jednak jesteś w środku.'], ['Stała linia', 'Rzadko to mówię wprost: dziękuję.']],
      gift: [['Prezent dla czatu', 'Przygotowujesz warunki innym. Tak się buduje.'], ['Gifty', '{user} kładzie grunt pod nowe ścieżki: {n}.']],
      cheer: [['Bitsy', 'Precyzyjny ruch, {user}.'], ['Wsparcie', 'Odnotowane. I docenione.']],
      raid: [['Tunel ma wyjście', 'Ekipa {user} wchodzi. Witajcie.'], ['Raid', 'Spojrzenie z zewnątrz – zawsze mile widziane.'], ['Goście', 'Sala się powiększa. Plan też.']],
      redeem: [['Zlecenie', '{reward} – przyjęte do realizacji.'], ['Punkty kanału', '{user}: {reward}. Rozsądne.']],
      scenes: {
        prep: [['Przygotowania', 'Najpierw zrozumieć kształt problemu.'], ['Rozkładam plan', 'Każdy krok tworzy grunt pod następny.']],
        soon: [['Stream za', 'Termin ustalony. Konstrukcja stoi.'], ['Wkrótce', 'Mosty mają powód. Ten też.']],
        start: [['Zaraz zaczynamy', 'Ostatnie poprawki w planie.'], ['Start za chwilę', 'Mury mają koniec.']],
        late: [['Lekkie opóźnienie', 'Przeszkoda, nie problem. Już obchodzę.'], ['Chwila poślizgu', 'Tunele mają wyjścia – to też.']],
        brb: [['Przerwa', 'Kalibracja. Zaraz wracam.'], ['Pauza', 'Krok w tył, żeby zobaczyć całość.']],
        brbLate: [['Przerwa się przedłuża', 'Jeszcze moment. Warto zrobić to dobrze.']],
        talk: [['Rozmowa', 'Bez gier. Tylko kształt rzeczy.'], ['Pogadajmy', 'Mosty mają powód – czasem to rozmowa.']],
        end: [['Koniec na dziś', 'Tunele mają wyjścia. Do zobaczenia.'], ['Dzięki za dziś', 'Każdy z Was był krokiem dalej.']]
      }
    },

    // ---------------------------------------------------------------- Chip: sceptyczny, krótko, małe litery, dziękuje czynami
    chip: {
      follow: [['no co. nowy follow', 'jasne. zobaczymy, ile zostaniesz.'], ['ktoś nowy', '{user}. zapamiętam. nie że coś.'], ['follow. ok.', 'gdzie jest haczyk?'], ['no hej', 'ciasteczka są moje. reszta… może być.']],
      sub: [['no co. sub', '…dzięki. tylko nie rób z tego sprawy.'], ['sub. serio?', 'nie musiałeś. ale dobra.'], ['nowy sub', '*przyciska dzwonek, żeby nie zadzwonił*']],
      resub: [['znowu ty. dobrze.', '{n}. miesiąc. nie mówię, że się cieszę.'], ['dalej tu jesteś', 'haczyka dalej nie znalazłem. podejrzane.'], ['resub', '*dzwonek dzwoni. tym razem nie przytrzymuje*']],
      gift: [['ciasteczka dla wszystkich', '{user} częstuje. ja tylko pilnuję talerza.'], ['gifty', 'ktoś tu ma za dobre serce. {user}.'], ['rozdawanie', 'nie ukradłem ich. tym razem.']],
      cheer: [['okruszki bitsów', '{n} – policzyłem. dwa razy.'], ['bitsy', 'na ciasteczka? na ciasteczka.']],
      raid: [['ktoś wpadł. dużo ktosiów.', 'nie dotykać ciasteczek.'], ['raid', '{user} przyprowadza ludzi. ok. cicho siedzę.'], ['najazd', 'dzwonek nie dzwoni. wszystko pod kontrolą.']],
      redeem: [['no dobra, nagroda', '{reward}. tylko szybko.'], ['punkty', '{user} chce: {reward}. przemyślę. zrobione.']],
      scenes: {
        prep: [['przygotowania', 'nie patrz. jeszcze nie.'], ['chwila', 'układam. nie pomagaj.']],
        soon: [['stream za', 'będzie. nie pytaj co godzinę.'], ['niedługo', 'zostań. albo nie. ale zostań.']],
        start: [['no co. zaraz zaczynam', 'ciasteczka gotowe. ja prawie.'], ['zaraz', 'dzwonek przytrzymany. możemy.']],
        late: [['spóźnienie', 'to nie moja wina. tym razem chyba nie.'], ['jeszcze chwila', 'haczyk był w kablu.']],
        brb: [['przerwa na ciasteczko', 'nie zjadaj nic beze mnie.'], ['zaraz wracam', 'nigdzie nie idź.']],
        brbLate: [['dłuższa przerwa', 'ciasteczko było większe, niż myślałem.']],
        talk: [['gadamy', 'bez gier. tylko… gadanie. dobra.'], ['rozmowa', 'pytaj. odpowiem. może.']],
        end: [['no. to tyle.', 'było… ok. lepiej niż ok. nie mów nikomu.'], ['koniec', 'dzięki. *dzwonek, cicho*']]
      }
    },

    // ---------------------------------------------------------------- Ragnar: serce, głośno, DJ, czyta salę
    ragnar: {
      follow: [['Sala rośnie!', '{user} wchodzi na parkiet!'], ['NOWA OSOBA!', 'Witaj, {user} – słyszę, że jesteś!'], ['Follow!', 'Czytam salę: robi się lepiej.'], ['Dołączasz!', 'Jeszcze jedno serce w rytmie 128 BPM.']],
      sub: [['SUB NA PARKIECIE!', '{user}, to jest ten moment – DZIĘKUJĘ!'], ['Sub!', 'Podkręcam basy specjalnie dla Ciebie.'], ['No i mamy to!', 'Czuję to aż w klatce – dzięki, {user}!']],
      resub: [['Stały bywalec!', '{n}. miesiąc pod sceną. Kocham to.'], ['Wracasz!', 'Ten sam rytm, {user}, i dalej gra!'], ['Resub!', 'Ty to wiesz, jak trzymać salę.']],
      gift: [['Kolejka dla sali!', '{user} stawia całemu parkietowi!'], ['GIFTY!', 'Ręce w górę dla {user}!'], ['Prezenty!', '{n}× sub – sala szaleje!']],
      cheer: [['Głośniej!', 'Bitsy: {n} – prosto w głośniki!'], ['Bitsy!', '{user} podkręca energię!']],
      raid: [['RAID! CAŁA SALA!', 'Ekipa {user} wpada – witajcie w klubie!'], ['Nowy tłum!', 'Drop za trzy, dwa, jeden!'], ['Raid!', 'Plus {n} na parkiecie – zmieniam setlistę na grubszą!']],
      redeem: [['Zamówienie dla DJ-a', '{reward} – lecimy z tym!'], ['Z sali!', '{user} prosi o: {reward}. Masz to!']],
      scenes: {
        prep: [['Soundcheck…', 'Ustawiam decki. Czuć już salę.'], ['Rozgrzewka', 'Kable, światła, serce – sprawdzam.']],
        soon: [['Impreza za', 'Zarezerwujcie parkiet!'], ['Niedługo gramy', 'Czuję, że to będzie dobra noc.']],
        start: [['Zaraz wchodzimy!', 'Ostatni bit przed dropem.'], ['Start!', 'Ręce w górę, zaraz gramy!']],
        late: [['Mały poślizg', 'Sala czeka – wejdę z hukiem, obiecuję!'], ['Jeszcze moment', 'Najlepsze wejścia są spóźnione.']],
        brb: [['Przerwa przy barze', 'Woda, oddech i wracam.'], ['Chwila oddechu', 'Muzyka gra dalej, ja zaraz.']],
        brbLate: [['Przerwa się wydłuża', 'Nie wychodźcie z parkietu!']],
        talk: [['Gadamy!', 'Dziś czytam czat zamiast sali.'], ['Bez gier', 'Tylko my i rozmowa – podkręcam serce.']],
        end: [['Ostatni numer', 'Dziękuję, sala była NIESAMOWITA.'], ['Koniec imprezy', 'Każdy z Was był dziś w rytmie. Dzięki!']]
      }
    },

    // ---------------------------------------------------------------- Toro: pogodny, panta rei, cytaty z filozofów
    toro: {
      follow: [['Kolejne światło pod mostem', 'Witaj, {user} – znajdzie się miejsce.'], ['Nowy gość', 'Panta rei – i oto ty, {user}.'], ['Ktoś przy latarni', 'Rozgość się, herbata jeszcze ciepła.'], ['Witaj', '„Przyjaźń jest jedną duszą w dwóch ciałach” – a tu jest nas więcej.']],
      sub: [['Nowa latarnia', 'Dziękuję, {user}. Noc robi się cieplejsza.'], ['Sub', 'Seneka mówił, że dawać to sztuka. Opanowałeś ją.'], ['Wsparcie', 'Z każdego wyniku coś wynoszę – z tego najwięcej.']],
      resub: [['Latarnia świeci dalej', '{n}. miesiąc pod tym samym mostem.'], ['Znowu razem', '„Wszystko płynie” – a ty zostajesz. Dziękuję.'], ['Resub', 'Ciepło, które wraca, jest najcenniejsze.']],
      gift: [['Lampiony dla wszystkich', '{user} zapala światło innym.'], ['Prezenty', 'Dzielić się tym, co się ma – piękny zwyczaj.']],
      cheer: [['Iskry nad rzeką', 'Iskry: {n} – dziękuję, {user}.'], ['Bitsy', 'Mały gest, wielkie światło.']],
      raid: [['Goście z rzeki', 'Witajcie, ekipo {user}! Herbata dla wszystkich.'], ['Raid', 'Psy szczekają, karawana jedzie – prosto do nas!'], ['Najazd', 'Pod mostem zawsze znajdzie się miejsce.']],
      redeem: [['Prośba pod mostem', '{reward} – z przyjemnością.'], ['Punkty', '{user}: {reward}. Co ma być, to będzie.']],
      scenes: {
        prep: [['Zapalam latarnię', 'Trudno zaczynać, kiedy nie wiesz, czy noc będzie ciepła.'], ['Przygotowania', 'Sprzątam, nastawiam herbatę.']],
        soon: [['Spotkajmy się za', '„Cierpliwość jest gorzka, ale jej owoc słodki.”'], ['Niedługo', 'Latarnia już się żarzy.']],
        start: [['Latarnia się zapala', 'Rozgośćcie się pod mostem.'], ['Zaczynamy', 'Panta rei – płyniemy.']],
        late: [['Rzeka płynie wolniej', 'Spóźniony, ale w dobrym humorze.'], ['Jeszcze chwila', 'Co ma być, to będzie – za moment.']],
        brb: [['Herbata pod mostem', 'Zaparzam i wracam.'], ['Przerwa', 'Krótki spacer nad rzeką.']],
        brbLate: [['Herbata się parzy', 'Dobra herbata nie lubi pośpiechu.']],
        talk: [['Rozmowa przy latarni', 'Bez gier, za to z aforyzmami.'], ['Pogawędka', '„Znajdzie się miejsce na twoje aforyzmy.”']],
        end: [['Światło gaśnie. Panta rei.', 'Dziękuję, że byliście pod tym mostem.'], ['Dobranoc', 'Jutro rzeka będzie inna – my też.']]
      }
    },

    // ---------------------------------------------------------------- Zarin: ciekawski mechanik Avali, przyjazny, psotny
    zarin: {
      follow: [['nowa część w kolekcji:', 'jeszcze działa! witaj, {user}.'], ['ktoś nowy na pokładzie', '*ćwierk* {user}, przyniosłeś coś do naprawy?'], ['follow!', 'dopisuję do listy. ołówkiem, potem markerem.'], ['nowy w załodze', 'właz był otwarty – dobrze, że wszedłeś.']],
      sub: [['to jeszcze działa! sub:', 'dzięki, {user} – wymiennik ciepła mruczy.'], ['nowy sub', 'starczy na nowy wentylator do uprzęży!'], ['sub!', 'Myr, patrz – ktoś nas wspiera!']],
      resub: [['nadal na chodzie:', '{n}. miesiąc bez awarii. rekord!'], ['resub', 'ta część zostaje na stałe. markerem.'], ['dalej z nami', '*zadowolone ćwierkanie*']],
      gift: [['paczka części dla załogi', '{user} rozdaje! wszyscy do warsztatu.'], ['gifty', '{n}× sub? to więcej niż Patch ma w kasie.']],
      cheer: [['iskry z wymiennika', 'bitsy: {n} – Oskar się ucieszy.'], ['bitsy!', 'zbieram na nową płytę do kadłuba.']],
      raid: [['frachtowiec ląduje:', 'ekipa {user}! uwaga na śnieg przy włazie.'], ['raid!', '+{n} na pokładzie – zrobi się ciepło. za ciepło. dawajcie.'], ['goście!', 'Myr otwiera, ja naprawiam – witajcie!']],
      redeem: [['zlecenie od załogi:', '{reward}. biorę klucz.'], ['punkty', '{user} chce: {reward}. sprawdzę, czy to jeszcze działa.']],
      scenes: {
        prep: [['rozkręcam sprzęt', 'jedna śrubka została. zawsze zostaje.'], ['przygotowania', 'opuszczam gogle. wchodzę tam, gdzie nie powinienem.']],
        soon: [['start silników za', 'pompa chłodząca kaszle, ale poleci.'], ['niedługo', 'liczę przerwy między kaszlnięciami.']],
        start: [['rozgrzewam silniki…', 'trzymajcie się czegoś.'], ['zaraz lecimy', 'właz zamknięty. prawie.']],
        late: [['coś się zacięło', 'naprawiam. to był tylko jeden kabel. dwa.'], ['opóźnienie', 'śnieg leciał bokiem. dosłownie.']],
        brb: [['naprawiam coś. chwila.', 'nie dotykajcie niczego, co iskrzy.'], ['przerwa', 'idę do chłodni. tylko na chwilę.']],
        brbLate: [['to większa naprawa', 'okazało się, że w środku było coś jeszcze.']],
        talk: [['gadamy w warsztacie', 'pytajcie, ja w tym czasie coś rozkręcę.'], ['rozmowa', 'chcecie wiedzieć, jak to działa? ja też.']],
        end: [['zamykam warsztat', 'dzięki, załogo. wszystko jeszcze działa!'], ['koniec zmiany', 'Patch śpi. ja zaraz też.']]
      }
    },

    // ---------------------------------------------------------------- Myr-35: cztery rejestry
    myr: {
      weights: { protocol: 0.55, human: 0.18, terminal: 0.17, syndrome: 0.10 },
      follow: {
        protocol: [['MELDUNEK: NOWY OBSERWUJĄCY', 'Ta jednostka odnotowuje: {user}. Dostęp przyznany.'], ['NOWY CZŁONEK ZAŁOGI', 'Ta jednostka wita {user} zgodnie z protokołem.'], ['MELDUNEK', 'Załoga powiększona o jedną osobę. Stan: zadowalający.']],
        human: [['…witaj', 'Ja… cieszę się, że jesteś, {user}.'], ['nowa osoba', 'Zostań. Tu jest ciepło – przy maszynowni.']],
        terminal: [['> follow.event', '> user={user} // status=OK // ack'], ['> CREW.ADD', '> {user} :: clearance B1 :: granted']],
        syndrome: [['MEL-MEL-DUNEK', 'ta jed-jednostka… o-od-notowuje… {user}'], ['N-NOWY', 'Zarin… liczy… trzy… dwa… nowy… obserwujący.']]
      },
      sub: {
        protocol: [['MELDUNEK: NOWA SUBSKRYPCJA', 'Ta jednostka potwierdza wsparcie od {user}. Zasoby uzupełnione.'], ['ZAOPATRZENIE PRZYJĘTE', 'Ta jednostka dziękuje. Formalnie.']],
        human: [['…dziękuję', 'Ja… nie wiem, jak to powiedzieć regulaminowo. Dziękuję, {user}.'], ['to się liczy', 'Ja to zapamiętam.']],
        terminal: [['> sub.event', '> user={user} // tier=OK // resources++'], ['> SUPPLY.IN', '> source={user} :: thank_you.exe']],
        syndrome: [['SUB-SUB-SKRYPCJA', 'd-d-dzię… ta jednostka… dziękuje… dziękuje']]
      },
      resub: {
        protocol: [['MELDUNEK: SUBSKRYPCJA PRZEDŁUŻONA', 'Ta jednostka odnotowuje ciągłość. Miesiąc: {n}.'], ['STAŁY CZŁONEK ZAŁOGI', 'Lojalność {user} potwierdzona.']],
        human: [['wciąż tu jesteś', 'Ja… pamiętam Cię, {user}.']],
        terminal: [['> resub.event', '> user={user} // months={n} // streak=stable']],
        syndrome: [['P-PRZEDŁUŻONA', '{n}… {n}… miesią-miesiąc… stabilnie']]
      },
      gift: {
        protocol: [['MELDUNEK: ZAOPATRZENIE DLA ZAŁOGI', '{user} przekazuje zasoby dla załogi. Pakiety: {n}.'], ['ROZDZIAŁ ZASOBÓW', 'Ta jednostka nadzoruje dystrybucję.']],
        human: [['dla wszystkich', 'Ja… to bardzo dobre z Twojej strony, {user}.']],
        terminal: [['> gift.event', '> from={user} // count={n} // distribute()']],
        syndrome: [['Z-ZAOPATRZENIE', 'roz… rozdział… r-r-rozdział… zakończony']]
      },
      cheer: {
        protocol: [['MELDUNEK: BITSY', 'Ta jednostka rejestruje wsparcie. Wartość: {n}.'], ['ENERGIA PRZYJĘTA', 'Poziom zasilania wzrósł.']],
        human: [['ciepło', 'Ja… czuję to. Dziękuję, {user}.']],
        terminal: [['> cheer.event', '> bits={n} // user={user} // power+']],
        syndrome: [['B-BITSY', '{n}… nanity… włącz… wyłącz… włącz']]
      },
      raid: {
        protocol: [['ALARM: ABORDAŻ', 'Wykryto przybyszów: {n}. Ta jednostka zezwala na wejście. Bez łamania grodzi.'], ['ABORDAŻ PRZYJAZNY', 'Ekipa {user} na pokładzie. Gródź otwarta.']],
        human: [['goście', 'Ja… otworzę. Wejdźcie.']],
        terminal: [['> RAID.DETECTED', '> from={user} // count={n} // hull=OK // open()']],
        syndrome: [['A-A-ABORDAŻ', 'gródź… gródź… Zarin, licz… raz… dwa… otwarte.']]
      },
      redeem: {
        protocol: [['MELDUNEK: ROZKAZ Z CZATU', 'Ta jednostka przyjmuje zadanie: {reward}.'], ['ZLECENIE', '{user} wydaje rozkaz. Wykonanie w toku.']],
        human: [['dobrze', 'Ja to zrobię, {user}. {reward}.']],
        terminal: [['> redeem.event', '> task="{reward}" // by={user} // queued']],
        syndrome: [['R-ROZKAZ', '{reward}… {reward}… przyj-przyjęte']]
      },
      scenes: {
        prep: { protocol: [['PRZYGOTOWANIE JEDNOSTKI', 'Ta jednostka przeprowadza kontrolę przed transmisją.']], human: [['chwila', 'Ja… prawie gotowa.']], terminal: [['> BOOT', '> systems.check() … OK']], syndrome: [['P-PRZYGOTO…', 'kontrola… kontrola… kon-trola']] },
        soon: { protocol: [['TRANSMISJA ZA', 'Ta jednostka podaje czas do rozpoczęcia.']], human: [['niedługo', 'Ja też czekam.']], terminal: [['> SCHEDULE', '> stream.start = T-minus']], syndrome: [['T-T-TRANSMISJA', 'za… za… za']] },
        start: { protocol: [['TRANSMISJA ZA', 'Ta jednostka zajmuje pozycję.']], human: [['zaraz', 'Ja… cieszę się, że jesteście.']], terminal: [['> stream.start', '> countdown.active']], syndrome: [['S-START', 'za… chwilę… chwilę']] },
        late: { protocol: [['OPÓŹNIENIE OPERACJI', 'Ta jednostka przeprasza za odchylenie od harmonogramu.']], human: [['przepraszam', 'Ja… jeszcze chwila.']], terminal: [['> WARN', '> stream.start delayed // retry']], syndrome: [['O-OPÓŹ…', 'nanity… pętla… Zarin… liczy…']] },
        brb: { protocol: [['PRZERWA SERWISOWA', 'Ta jednostka przechodzi do maszynowni.']], human: [['przerwa', 'Ja… zaraz wrócę.']], terminal: [['> PAUSE', '> unit.status = maintenance']], syndrome: [['P-PRZERWA', 'włącz… wyłącz… przerwa']] },
        brbLate: { protocol: [['SERWIS SIĘ PRZEDŁUŻA', 'Ta jednostka prosi o cierpliwość.']], human: [['jeszcze moment', 'Ja… prawie.']], terminal: [['> PAUSE', '> eta = unknown']], syndrome: [['S-SERWIS', 'trzy… dwa… jeden… jeszcze raz']] },
        talk: { protocol: [['RAPORT USTNY', 'Ta jednostka odpowiada na pytania załogi.']], human: [['porozmawiajmy', 'Ja… lubię, kiedy pytacie.']], terminal: [['> CHAT.MODE', '> input=chat // output=voice']], syndrome: [['R-RAPORT', 'pyta… pytania… pytajcie']] },
        end: { protocol: [['KONIEC ZMIANY', 'Ta jednostka dziękuje załodze. Raport zamknięty.']], human: [['dziękuję', 'Ja… to był dobry dzień. Dziękuję Wam.']], terminal: [['> SHUTDOWN', '> thanks.all() // goodnight']], syndrome: [['K-KONIEC', 'zmia… zmiany… dzię-dziękuję']] }
      }
    }
  };


  // ---------------------------------------------------------------- teksty na duże zdarzenia (poziom 3, 4, 5)
  // Poziom 4 bez własnych tekstów bierze z 3, poziom 5 – z 4. Myr ma jedną pulę „big” z rejestrami.
  const TIERS = {
    _: {
      sub: { 3: [['Sub Tier 2!', '{user}, wielkie dzięki!']], 4: [['SUB TIER 3!', '{user} – to ogromne wsparcie!']] },
      cheer: { 3: [['Deszcz bitsów!', '{user} sypie bitsami: {n}!']], 4: [['BITSOWA BURZA', 'Bitsy: {n}! {user}, to jest coś!']], 5: [['LEGENDARNE BITSY', 'Bitsy: {n}. {user}… brak słów. DZIĘKUJĘ!']] },
      gift: { 3: [['Lawina subów!', '{user} rozdaje: {n}× sub!']], 4: [['DESZCZ PREZENTÓW', '{n}× sub od {user} – czat oszalał!']], 5: [['PREZENTOWA APOKALIPSA', '{user}: {n}× sub. To przejdzie do historii kanału.']] },
      resub: { 3: [['Pół roku i więcej!', 'Miesiąc {n}. – dzięki, że jesteś, {user}!']], 4: [['PONAD ROK RAZEM', 'Miesiąc {n}. – {user}, jesteś częścią tego miejsca.']], 5: [['WETERAN KANAŁU', 'Miesiąc {n}. – {user}, to Twój dom tak samo jak mój.']] },
      raid: { 3: [['Duży raid!', 'Ekipa {user} wpada w komplecie: {n}!']], 4: [['WIELKI NAJAZD', 'Na pokładzie: {n}! Witajcie, ekipo {user}!']], 5: [['INWAZJA', 'Ekipa {user}: {n}! Serwery drżą!']] },
      redeem: { 3: [['Spora nagroda', '{user} wydaje punkty na: {reward}!']], 4: [['DROGA NAGRODA', '{reward} – {user} nie żałuje punktów!']], 5: [['NAGRODA LEGENDARNA', '{user} wykupuje: {reward}. Szacunek.']] }
    },
    vince: {
      sub: { 3: [['Mocny fundament', 'Tier wyżej. Zauważone, {user}.']], 4: [['Konstrukcja nośna', 'Tier 3. Na tym można budować latami.']] },
      cheer: { 3: [['Precyzyjna inwestycja', 'Bitsy: {n}. Każdy krok tworzy grunt pod następny.']], 4: [['Nowe piętro', 'Bitsy: {n}. Plan właśnie się powiększył.']], 5: [['Most nad przepaścią', 'Bitsy: {n}. Mosty mają powód – dziś to Ty, {user}.']] },
      gift: { 3: [['Warunki dla innych', '{n}× sub. Tak się buduje wspólnotę.']], 4: [['Infrastruktura', '{user} stawia całe osiedle: {n}× sub.']], 5: [['Miasto', '{n}× sub. To już nie dom – to miasto, {user}.']] },
      resub: { 3: [['Konsekwencja', 'Miesiąc {n}. Rzadko to widzę – i doceniam.']], 4: [['Ponad rok', 'Miesiąc {n}. Wąskie drzwi, a jesteś w środku od dawna.']], 5: [['Fundament', 'Miesiąc {n}. Bez Ciebie ta konstrukcja by nie stała.']] },
      raid: { 3: [['Szeroki tunel', 'Ekipa {user} – wejście bez kolizji. Witajcie.']], 4: [['Nowa kondygnacja', 'Na pokładzie: {n}. Plan przeliczony, miejsca starczy.']], 5: [['Cały kwartał', 'Ekipa {user}: {n}. Mury mają koniec – dziś je przesunęliście.']] },
      redeem: { 3: [['Poważne zlecenie', '{reward}. Przyjęte, z priorytetem.']], 4: [['Projekt specjalny', '{user} zamawia: {reward}. Rozrysuję to porządnie.']], 5: [['Projekt życia', '{reward}. Dobrze, {user}. Zrobię to bez skrótów.']] }
    },
    chip: {
      sub: { 3: [['…tier 2?', 'nie musiałeś. serio. …dzięki.']], 4: [['TIER 3?!', '*dzwonek dzwoni. nie przytrzymał.*']] },
      cheer: { 3: [['dużo okruszków', 'bitsy: {n}. policzyłem trzy razy. dalej tyle.']], 4: [['to nie są okruszki', 'bitsy: {n}. gdzie jest haczyk. GDZIE.']], 5: [['…', 'bitsy: {n}. *dzwonek dzwoni sam z siebie* …dziękuję. tylko nikomu nie mów.']] },
      gift: { 3: [['ciasteczka dla czatu', '{n}× sub. {user} ma za dobre serce.']], 4: [['całe pudełko ciasteczek', '{n}× sub. ok. ok. to jest dużo.']], 5: [['piekarnia', '{n}× sub. {user}… *nie wie, gdzie podziać łapy*']] },
      resub: { 3: [['dalej tu jesteś', 'miesiąc {n}. haczyka nadal brak. podejrzane.']], 4: [['ponad rok', 'miesiąc {n}. …jesteś mój. w sensie kanałowy. nie mów nikomu.']], 5: [['zostajesz', 'miesiąc {n}. 23 razy myliłem się co do haczyka. co do ciebie też.']] },
      raid: { 3: [['dużo ktosiów', 'ekipa {user}. nie dotykać ciasteczek. żadnych.']], 4: [['BARDZO dużo ktosiów', 'na pokładzie: {n}. chowam talerz.']], 5: [['cały świat wpadł', 'ekipa {user}: {n}. *dzwonek dzwoni. tym razem specjalnie*']] },
      redeem: { 3: [['spora nagroda', '{reward}. no dobra. zrobię.']], 4: [['droga nagroda', '{user} wydał na: {reward}. serio? …dobra. serio.']], 5: [['ta nagroda?!', '{reward}. ok. dla ciebie. raz.']] }
    },
    ragnar: {
      sub: { 3: [['TIER 2 NA PARKIECIE!', '{user}, czuję to w klatce!']], 4: [['TIER 3!!!', '{user}, sala wstaje dla Ciebie!']] },
      cheer: { 3: [['BASY W GÓRĘ!', 'Bitsy: {n} – podkręcam na maksa!']], 4: [['DROP!!!', 'Bitsy: {n}! {user}, cała sala skacze!']], 5: [['NAJLEPSZA NOC W ŻYCIU', 'Bitsy: {n}! {user} – brakuje mi głośników na tyle emocji!']] },
      gift: { 3: [['KOLEJKA DLA WSZYSTKICH!', '{n}× sub od {user}!']], 4: [['OTWARTY BAR!', '{n}× sub! {user}, kocham Cię, serio!']], 5: [['CAŁY KLUB NA KOSZT {user}!', '{n}× sub. Płaczę przy deckach.']] },
      resub: { 3: [['STAŁY BYWALEC!', 'Miesiąc {n}. – pamiętam Twoje wejście!']], 4: [['ROK POD SCENĄ!', 'Miesiąc {n}. – Ty jesteś tym rytmem, {user}!']], 5: [['LEGENDA PARKIETU', 'Miesiąc {n}. – {user}, ta sala jest też Twoja.']] },
      raid: { 3: [['SALA PĘKA!', 'Ekipa {user} wpada – ręce w górę!']], 4: [['DRUGI PARKIET OTWARTY!', 'Na sali: +{n}! Zmieniam set na festiwalowy!']], 5: [['FESTIWAL!!!', 'Ekipa {user}: {n}! TO JEST NAJWIĘKSZA IMPREZA!']] },
      redeem: { 3: [['SPECJALNE ZAMÓWIENIE', '{reward} – lecimy na pełnej!']], 4: [['VIP Z SALI!', '{user} chce: {reward}. MASZ TO, wariacie!']], 5: [['ŻYCZENIE NA ŻYWO', '{reward}. {user}, robię to dla Ciebie na scenie!']] }
    },
    toro: {
      sub: { 3: [['Jaśniejsza latarnia', 'Tier wyżej – noc robi się bardzo ciepła.']], 4: [['Latarnia z witrażem', 'Tier 3. „Hojność to duch czynu.” Dziękuję, {user}.']] },
      cheer: { 3: [['Fajerwerki nad rzeką', 'Iskry: {n}. Panta rei – i oto płyną do nas.']], 4: [['Rzeka światła', 'Iskry: {n}. Seneka by to pochwalił.']], 5: [['Słońce pod mostem', 'Iskry: {n}. Pierwszy raz pod mostem jest jasno jak w dzień.']] },
      gift: { 3: [['Lampiony dla całej ulicy', '{n}× sub. Dzielić się – piękny zwyczaj.']], 4: [['Festiwal latarni', '{user} zapala {n}× światło dla innych.']], 5: [['Most w świetle', '{n}× sub. Cały most świeci, {user}. Dziękuję.']] },
      resub: { 3: [['Stały gość pod mostem', 'Miesiąc {n}. Wszystko płynie – a ty zostajesz.']], 4: [['Rok przy latarni', 'Miesiąc {n}. „Prawdziwy przyjaciel to jedna dusza w dwóch ciałach.”']], 5: [['Rodzina z wyboru', 'Miesiąc {n}. Rodzina mnie odcięła – a znalazłem was.']] },
      raid: { 3: [['Wielu gości z rzeki', 'Ekipa {user}! Herbaty starczy, obiecuję.']], 4: [['Cała flotylla', 'Na brzegu: {n}. Pod mostem zawsze znajdzie się miejsce.']], 5: [['Rzeka gości', 'Ekipa {user}: {n}. Karawana nie jedzie – karawana przyjechała do nas!']] },
      redeem: { 3: [['Szczególna prośba', '{reward} – z wielką przyjemnością.']], 4: [['Hojna prośba', '{user} prosi o: {reward}. Co ma być, to będzie.']], 5: [['Wielka prośba', '{reward}. Dla takiej prośby warto zapalić wszystkie latarnie.']] }
    },
    zarin: {
      sub: { 3: [['lepsza część!', 'tier 2! wymiennik mruczy głośniej!']], 4: [['część premium!!', 'tier 3?! *ćwierka bardzo głośno*']] },
      cheer: { 3: [['iskry z całego wymiennika', 'bitsy: {n}. Oskar policzył i usiadł.']], 4: [['zwarcie z radości', 'bitsy: {n}! starczy na nową pompę chłodzącą!']], 5: [['NOWY SILNIK', 'bitsy: {n}. Patch poleci szybciej niż kiedykolwiek. *zachwycone ćwierkanie*']] },
      gift: { 3: [['skrzynia części', '{n}× sub dla załogi! wszyscy do warsztatu!']], 4: [['cały kontener!', '{n}× sub! Maro nie nadąża podawać narzędzi!']], 5: [['nowy statek?!', '{n}× sub. {user}, to więcej niż Patch był wart. *ćwierk*']] },
      resub: { 3: [['nadal działa!', 'miesiąc {n}. ta część zostaje na stałe.']], 4: [['ponad rok bez awarii', 'miesiąc {n}. wpisuję markerem. grubym.']], 5: [['część kadłuba', 'miesiąc {n}. jesteś już przykręcony do Patcha, {user}.']] },
      raid: { 3: [['duży frachtowiec!', 'ekipa {user}! uwaga na śnieg przy włazie!']], 4: [['cały konwój!', '+{n} na pokładzie. będzie bardzo ciepło. Myr, otwieraj!']], 5: [['flota!!', 'ekipa {user}: {n}. Oskar mówi, że to już stacja, nie statek.']] },
      redeem: { 3: [['większe zlecenie', '{reward}. biorę duży klucz.']], 4: [['zlecenie specjalne', '{user} chce: {reward}. rozkręcę wszystko, żeby to zrobić.']], 5: [['zlecenie życia', '{reward}. ok. opuszczam gogle. wchodzę.']] }
    },
    myr: {
      big: {
        protocol: [['MELDUNEK: ZDARZENIE O WYSOKIM PRIORYTECIE', 'Ta jednostka odnotowuje wartość {n}. Protokół nie przewiduje takiej wielkości.'], ['ALARM: PRZECIĄŻENIE WDZIĘCZNOŚCI', 'Ta jednostka… ta jednostka potwierdza. {user}.']],
        human: [['…{user}', 'Ja… nie mam na to regulaminowego zdania. Dziękuję. Naprawdę.'], ['ja', 'Ja to zapamiętam na zawsze, {user}.']],
        terminal: [['> PRIORITY.MAX', '> value={n} // from={user} // buffer overflow // gratitude++'], ['> EVENT.CRITICAL', '> {user} :: magnitude={n} :: unit.status=moved']],
        syndrome: [['P-P-PRZECIĄŻ…', 'za… za dużo… Zarin… licz… trzy… dwa… {user}… dzię-dziękuję'], ['W-W-WARTOŚĆ', '{n}… {n}… nanity… włącz… wyłącz… ja… ja…']]
      }
    }
  };

  const SCENES_DEFAULT = {
    prep: [['Przygotowania', 'Ustawiam wszystko, zaraz będzie.'], ['Stream w przygotowaniu', 'Rozgość się, za chwilę ruszamy.']],
    soon: [['Stream za', 'Do zobaczenia wkrótce!'], ['Startujemy za', 'Wpadnij, gdy odliczanie się skończy.']],
    start: [['Zaraz zaczynamy', 'Rozgość się, zaraz startujemy.'], ['Startujemy!', 'Ostatnie przygotowania.']],
    late: [['Stream się spóźnia', 'Przepraszam za poślizg – już prawie!'], ['Mały poślizg', 'Zostań, zaraz będę.']],
    brb: [['Przerwa', 'Zaraz wracam.'], ['Chwila przerwy', 'Nie odchodź daleko.']],
    brbLate: [['Przerwa się przedłuża', 'Jeszcze chwila, dziękuję za cierpliwość.']],
    talk: [['Pogadajmy', 'Bez gier – tylko rozmowa.'], ['Just chatting', 'Pytajcie o wszystko.']],
    end: [['Dzięki za dziś!', 'Do zobaczenia na następnym streamie.'], ['Koniec streama', 'Dziękuję, że byliście.']]
  };

  // ---------------------------------------------------------------- język streama i rejestr Myr (panel: Język streama, Myr – rejestr)
  function settings() { try { return JSON.parse(localStorage.getItem('obsGameOverlay.v1') || '{}') || {}; } catch (e) { return {}; } }
  function curLang() {
    try { const q = new URLSearchParams(location.search).get('lang'); if (q) return q === 'en' ? 'en' : 'pl'; } catch (e) {}
    return settings().lang === 'en' ? 'en' : 'pl';
  }
  // zestaw tekstów: polski (ten plik + voices-games.js) albo angielski (voices-en.js)
  function D(lang) {
    const E = window.OverlayVoicesEN;
    if ((lang || curLang()) === 'en' && E) return { V: E.V, TIERS: E.TIERS, SCENES: E.SCENES_DEFAULT, GAMEV: E.GAMEV, SAMPLES: E.SAMPLES, lang: 'en' };
    return { V, TIERS, SCENES: SCENES_DEFAULT, GAMEV, SAMPLES, lang: 'pl' };
  }
  const REGISTERS = ['protocol', 'human', 'terminal', 'syndrome'];
  function forcedRegister() { const r = settings().myrRegister; return REGISTERS.includes(r) ? r : ''; }

  const rand = a => a[Math.floor(Math.random() * a.length)];
  function pickRegister(w) {
    let r = Math.random();
    for (const [k, p] of Object.entries(w)) { if ((r -= p) <= 0) return k; }
    return 'protocol';
  }
  function fill(t, ctx) {
    return String(t || '').replace(/\{(\w+)\}/g, (_, k) => (ctx && ctx[k] != null && ctx[k] !== '' ? ctx[k] : ''));
  }
  // Nanite Syndrome: pojedyncze sylaby się zapętlają, czasem znak się „rwie”
  function glitch(t) {
    return t.replace(/\b(\p{L}{2,3})(\p{L}{3,})/gu, (m, a, b) => Math.random() < 0.3 ? `${a}-${a}${b}` : m)
      .replace(/(\p{L})/gu, c => Math.random() < 0.04 ? '▒' : c);
  }

  // Wybiera nagłówek i zdanie: kind = typ alertu (follow, sub…) albo 'scene:prep' itd.
  // poziom 3+ → teksty na duże zdarzenia (najpierw postaci, potem domyślne)
  function tierPool(themeId, kind, tier) {
    const d = D();
    for (const who of [d.TIERS[themeId], d.TIERS._]) {
      if (!who) continue;
      if (who.big) return who.big;                                  // Myr: jedna pula z rejestrami
      const k = who[kind]; if (!k) continue;
      for (let t = tier; t >= 3; t--) if (k[t]) return k[t];
    }
    return null;
  }
  // Myr: im większe zdarzenie, tym częściej wymyka się „ja” (a przy największych – syndrom)
  function myrWeights(base, tier) {
    if (!tier || tier < 3) return base;
    const w = { ...base };
    w.human = (w.human || 0) + 0.12 * (tier - 2);
    if (tier >= 5) w.syndrome = (w.syndrome || 0) + 0.1;
    const sum = Object.values(w).reduce((a, b) => a + b, 0);
    for (const k in w) w[k] /= sum;
    return w;
  }

  function pick(themeId, kind, ctx, tier) {
    const d = D();
    // 'trans:game' / 'trans:any' – wypowiedzi na przejścia (themes/voices-trans.js); traktowane jak ekran
    const trans = kind.startsWith('trans:') ? kind.slice(6) : null;
    const scene = kind.startsWith('scene:') ? kind.slice(6) : trans ? 'trans' : null;
    const who = d.V[themeId];
    let pool = null, register = 'normal';
    if (trans) pool = (who && who.trans && (who.trans[trans] || who.trans.any)) || (d.GAMEV[themeId] && d.GAMEV[themeId].trans && (d.GAMEV[themeId].trans[trans] || d.GAMEV[themeId].trans.any));
    else if (who) pool = scene ? who.scenes && who.scenes[scene] : who[kind];
    else if (scene && d.GAMEV[themeId] && d.GAMEV[themeId].scenes) pool = d.GAMEV[themeId].scenes[scene];   // motyw gry jako styl ekranu
    if (!scene && tier >= 3) { const tp = tierPool(themeId, kind, tier); if (tp) pool = tp; }
    if (pool && !Array.isArray(pool)) {          // postać z rejestrami (Myr)
      register = forcedRegister() || pickRegister(myrWeights(who && who.weights || { protocol: 1 }, scene ? 0 : tier));
      pool = pool[register] || pool.protocol;
    }
    if (!pool || (Array.isArray(pool) && !pool.length)) pool = trans ? (d.V._.trans && (d.V._.trans[trans] || d.V._.trans.any)) : scene ? d.SCENES[scene] : d.V._[kind];
    if (!pool || !pool.length) return { label: '', line: '', register };
    const [label, line] = rand(pool);
    let out = { label: fill(label, ctx), line: fill(line, ctx), register };
    if (register === 'syndrome') out = { ...out, line: glitch(out.line) };
    return out;
  }


  // ---------------------------------------------------------------- głosy gier (motyw gry albo fuzja z grą)
  // Mieszane z głosem postaci w proporcji fuzji: 66:33 (postać bazą), 50:50, 33:66 (gra bazą), sama gra.
  const GAMEV = {
    tal: {
      follow: [['Nowy poszukiwacz Korony', '{user} rzuca kośćmi i wchodzi na planszę.'], ['Nowa postać w grze', '{user} losuje kartę przygody.']],
      sub: [['Talizman zdobyty', '{user} – droga do Korony Władzy stoi otworem.'], ['Złota moneta', 'Sub od {user}. Los sprzyja śmiałym.']],
      resub: [['Kolejna tura', 'Miesiąc {n}. – {user} wciąż na szlaku.']], gift: [['Skarb dla drużyny', '{user} rozdaje karty: {n}× sub!']],
      cheer: [['Złoto do sakwy', 'Bitsy: {n} – {user} kupuje coś w mieście.']], raid: [['Najazd na Krainę', 'Drużyna {user} wkracza na planszę!']],
      redeem: [['Karta zdarzenia', '{user} odkrywa: {reward}']],
      big: [['KORONA WŁADZY', '{user} dociera do środka planszy. Legendarne!'], ['WIELKIE ZAKLĘCIE', '{user} rzuca kośćmi – same szóstki!']]
    },
    pal: {
      follow: [['Nowy Pal schwytany!', '{user} dołącza do bazy.'], ['Nowy towarzysz', '{user} – pierwszy kontakt udany!']],
      sub: [['Rzadki Pal!', '{user} wskakuje do drużyny!'], ['Złapany!', 'Sub od {user} – kula trafiła za pierwszym razem.']],
      resub: [['Stały mieszkaniec bazy', 'Miesiąc {n}. – {user} pracuje na farmie od dawna.']], gift: [['Paczka dla bazy', '{user} rozdaje {n}× sub całej drużynie!']],
      cheer: [['Zapasy!', 'Bitsy: {n} – baza ma co jeść.']], raid: [['Wataha w natarciu!', 'Ekipa {user} wbiega do bazy!']],
      redeem: [['Zadanie dla Pala', '{user}: {reward}']],
      big: [['LEGENDARNY PAL', '{user} – tego jeszcze nikt nie złapał!'], ['ALFA!', '{user} pokonuje bossa jednym ruchem!']]
    },
    me: {
      follow: [['Nowy członek załogi', '{user} na pokładzie. Kurs ustalony.'], ['Rekrut', '{user} dołącza do misji.']],
      sub: [['Wsparcie floty', '{user} – sygnał przyjęty, dziękuję.'], ['Paragon', '{user} wybiera dobrą ścieżkę: sub!']],
      resub: [['Weteran misji', 'Miesiąc {n}. – {user} leciał z nami przez cały przekaźnik.']], gift: [['Zaopatrzenie floty', '{user} dostarcza {n}× sub dla załogi!']],
      cheer: [['Kredyty', 'Bitsy: {n} – {user} finansuje modernizację.']], raid: [['Flota przybywa', 'Okręty {user} wychodzą z przekaźnika!']],
      redeem: [['Rozkaz z mostka', '{user}: {reward}']],
      big: [['GOTOWOŚĆ BOJOWA', '{user} – cała galaktyka to widziała.'], ['DECYZJA, KTÓRA ZMIENIA WSZYSTKO', '{user} – zapisane w kodeksie.']]
    },
    wf: {
      follow: [['Nowy Tenno', '{user} budzi się z kriosnu.'], ['Operator dołącza', '{user} – witaj w orbiterze.']],
      sub: [['Prime!', '{user} – sub rozpoznany. Złote zdobienia.'], ['Platyna', 'Dzięki, {user}!']],
      resub: [['Mistrzostwo', 'Miesiąc {n}. – {user} awansuje rangę mistrzostwa.']], gift: [['Dar z Relay', '{user} rozdaje {n}× sub klanowi!']],
      cheer: [['Endo i kredyty', 'Bitsy: {n} – {user} wbija mody do maksa.']], raid: [['Squad wchodzi', 'Drużyna {user} ląduje przez Rift!']],
      redeem: [['Kontrakt', '{user} zleca: {reward}']],
      big: [['DROP LEGENDARNY', '{user} – szansa jedna na tysiąc i trafiona!'], ['PRIME ACCESS', '{user} – złoto i energia na pełną moc!']]
    },
    dl: {
      follow: [['Nowy agent Wydziału', '{user} wchodzi w mgłę miasta.'], ['Patron zauważył', '{user} – klucz przekręcony.']],
      sub: [['Dusze zebrane', '{user} – Patron się uśmiecha.'], ['Pakt zawarty', 'Sub od {user}. Zamek ustąpił.']],
      resub: [['Stary bywalec alei', 'Miesiąc {n}. – {user} zna każdą ulicę.']], gift: [['Dusze dla linii', '{user} rozdaje {n}× sub sojusznikom!']],
      cheer: [['Dusze!', 'Bitsy: {n} – {user} kupuje przedmiot.']], raid: [['Fala na alei', 'Drużyna {user} pcha linię!']],
      redeem: [['Rytuał', '{user} odprawia: {reward}']],
      big: [['PATRON PRZEMÓWIŁ', '{user} – zamek otwarty na oścież.'], ['NIEŚMIERTELNY RYTUAŁ', '{user} – miasto drży.']]
    },
    dd: {
      follow: [['Nowy śmiałek', '{user} schodzi do lochów. Pochodnia płonie.'], ['Rekrut w Hamlecie', '{user} dołącza do kompanii.']],
      sub: [['Cnota!', '{user} – wola nie złamana. Dzięki.'], ['Złoto do rodowej kasy', 'Sub od {user} – Hamlet rośnie.']],
      resub: [['Weteran lochów', 'Miesiąc {n}. – {user} przeżył więcej, niż powinien.']], gift: [['Zapasy dla kompanii', '{user} dzieli się: {n}× sub. Pochodnie dla wszystkich.']],
      cheer: [['Pochodnia rozpalona', 'Bitsy: {n} – {user} odpędza ciemność.']], raid: [['Kompania przybywa', 'Śmiałkowie {user} wchodzą do Hamletu.']],
      redeem: [['Zlecenie z tawerny', '{user}: {reward}']],
      big: [['CNOTA!', '{user} – w obliczu ciemności… wytrwałość.'], ['ŚWIATŁO W CIEMNOŚCI', '{user} – pochodnia na sto procent!']]
    },
    hk: {
      follow: [['Nowy wędrowiec', '{user} wkracza do królestwa.'], ['Czyjaś nić', '{user} – nowa nić w tkaninie.']],
      sub: [['Odłamek maski', '{user} – dzięki, serce bije mocniej.'], ['Nić splątana', 'Sub od {user}.']],
      resub: [['Stary wędrowiec', 'Miesiąc {n}. – {user} zna każdą ławkę.']], gift: [['Jedwab dla wszystkich', '{user} rozdaje {n}× sub!']],
      cheer: [['Geo', 'Bitsy: {n} – {user} odwiedza kartografa.']], raid: [['Pielgrzymi', 'Pielgrzymka {user} wspina się do Cytadeli!']],
      redeem: [['Prośba z ławki', '{user}: {reward}']],
      big: [['PIEŚŃ JEDWABIU', '{user} – całe królestwo to słyszy.'], ['BOSS POKONANY', '{user} – bez jednego trafienia!']]
    },
    cp: {
      follow: [['Nowy runner', '{user} wpina się do Sieci.'], ['Kontakt', '{user} – nowy numer w telefonie.']],
      sub: [['Eddies!', '{user} – przelew dotarł. Dzięki, choom.'], ['Nowy wszczep', 'Sub od {user}.']],
      resub: [['Legenda Afterlife', 'Miesiąc {n}. – {user}, twoje imię wisi na ścianie.']], gift: [['Paczka od fixera', '{user} rozdaje {n}× sub ekipie!']],
      cheer: [['Eddies na koncie', 'Bitsy: {n} – {user} płaci za wszczep.']], raid: [['Ekipa z Night City', 'Ekipa {user} wjeżdża do miasta!']],
      redeem: [['Zlecenie', '{user}: {reward}']],
      big: [['LEGENDA NIGHT CITY', '{user} – zapamiętają to w każdym barze.'], ['PRZEJĘCIE SIECI', '{user} – system przejęty!']]
    },
    cs: {
      follow: [['Nowy gracz w składzie', '{user} wchodzi na serwer.'], ['Kupuje broń', '{user} – gotowy na rundę.']],
      sub: [['Ace!', '{user} – sub w pierwszej rundzie.'], ['Bomba rozbrojona', 'Sub od {user}.']],
      resub: [['Weteran rang', 'Miesiąc {n}. – {user} gra od dawna.']], gift: [['Drop dla drużyny', '{user} rzuca {n}× sub całej drużynie!']],
      cheer: [['Ekonomia', 'Bitsy: {n} – pełny buy dla drużyny.']], raid: [['Rush B!', 'Ekipa {user} wbiega na plant!']],
      redeem: [['Taktyka', '{user} woła: {reward}']],
      big: [['ACE!!!', '{user} – pięciu w jednej rundzie!'], ['CLUTCH 1v5', '{user} – nikt w to nie wierzył!']]
    }
  };

  // przykładowe wiadomości widzów do alertów testowych – w stylu postaci albo gry
  const SAMPLES = {
    _: ['dzięki za stream!', 'dalej najlepszy kanał!', 'pozdro z Krakowa'],
    vince: ['na kolejną kondygnację', 'mosty mają powód', 'za Dual Path'],
    chip: ['na ciasteczka!', 'na nowy dzwonek dla Chipa', 'nie zjedz wszystkich naraz'],
    ragnar: ['na nowy set!', 'za ten drop!', 'dalej najlepsza impreza na Twitchu!'],
    toro: ['na herbatę pod mostem', 'za latarnię', 'panta rei!'],
    myr: ['dla jednostki MYR-35', 'na zapasy do maszynowni', 'raport: wszystko w normie'],
    zarin: ['na części do Patcha', 'na nowy wentylator', 'czy to jeszcze działa?'],
    tal: ['za kolejną turę!', 'niech kości sprzyjają', 'po Koronę Władzy'],
    pal: ['dla wszystkich Pali', 'na nową bazę', 'złap je wszystkie'],
    me: ['dla załogi Normandii', 'na modernizację statku', 'za dobrą decyzję'],
    wf: ['na nowe mody', 'za udany drop', 'dla klanu'],
    dl: ['dla Patrona', 'na nowy przedmiot', 'trzymaj linię!'],
    dd: ['na pochodnie', 'żeby stres spadł', 'wytrwałości!'],
    hk: ['na geo dla kartografa', 'za każdą ławkę', 'nić się nie urwie'],
    cp: ['na nowy wszczep', 'eddies dla ekipy', 'za Night City'],
    cs: ['pełny buy!', 'rush B', 'GG WP']
  };

  // fuzja: kto mówi – postać czy gra – w proporcji wybranej w panelu
  function mixInfo(f) {
    f = f || {};
    const personaId = f.personaId || f.themeId || '_';
    const gameId = f.gameId || '';
    const mix = gameId ? (f.mix != null ? f.mix : 0.5) : 0;
    return { personaId, gameId, mix, variant: f.variant || '' };
  }
  // wariant (np. me2) ma własne teksty; czego nie ma, bierze z gry
  function pickGame(gameId, kind, ctx, tier, variant) {
    const G = D().GAMEV;
    const base = G[gameId]; if (!base) return null;
    const vg = variant && G[variant] ? G[variant] : null;
    const scene = kind.startsWith('scene:') ? kind.slice(6) : null;
    const get = k => (vg && vg[k]) || base[k];
    let pool;
    if (kind.startsWith('trans:')) { const k = kind.slice(6), t = (vg && vg.trans) || base.trans; pool = t && (t[k] || t.any); }
    else if (scene) { const sc = (vg && vg.scenes && vg.scenes[scene]) || (base.scenes && base.scenes[scene]); pool = sc; }
    else pool = (tier >= 3 && get('big')) ? get('big') : (get(kind) || get('follow'));
    if (!pool || !pool.length) return null;
    const [label, line] = rand(pool);
    return { label: fill(label, ctx), line: fill(line, ctx), register: 'game' };
  }
  function pickMix(f, kind, ctx, tier) {
    const m = mixInfo(f);
    if (m.gameId && D().GAMEV[m.gameId] && Math.random() < m.mix) {
      const g = pickGame(m.gameId, kind, ctx, tier, m.variant); if (g) return g;
    }
    return pick(m.personaId, kind, ctx, tier);
  }
  function sample(f) {
    const m = mixInfo(f);
    const SM = D().SAMPLES;
    const gsrc = m.variant && SM[m.variant] ? m.variant : m.gameId;
    const src = m.gameId && SM[gsrc] && Math.random() < m.mix ? gsrc : (SM[m.personaId] ? m.personaId : '_');
    return rand(SM[src]);
  }

  window.OverlayVoices = { pick, pickMix, sample, data: V, games: GAMEV, samples: SAMPLES, tiers: TIERS, scenesDefault: SCENES_DEFAULT, fill, glitch, set: D, lang: curLang, registers: REGISTERS };
})();
