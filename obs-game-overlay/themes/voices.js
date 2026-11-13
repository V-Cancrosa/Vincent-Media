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
  function pick(themeId, kind, ctx) {
    const scene = kind.startsWith('scene:') ? kind.slice(6) : null;
    const who = V[themeId];
    let pool = null, register = 'normal';
    if (who) pool = scene ? who.scenes && who.scenes[scene] : who[kind];
    if (pool && !Array.isArray(pool)) {          // postać z rejestrami (Myr)
      register = pickRegister(who.weights || { protocol: 1 });
      pool = pool[register] || pool.protocol;
    }
    if (!pool || !pool.length) pool = scene ? SCENES_DEFAULT[scene] : V._[kind];
    if (!pool || !pool.length) return { label: '', line: '', register };
    const [label, line] = rand(pool);
    let out = { label: fill(label, ctx), line: fill(line, ctx), register };
    if (register === 'syndrome') out = { ...out, line: glitch(out.line) };
    return out;
  }

  window.OverlayVoices = { pick, data: V };
})();
