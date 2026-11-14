/*
  Wypowiedzi na przejścia między ekranami (transition.html): powrót do gry (game) i ogólne przełączenie (any).
  Polski i angielski; postacie i gry. {game} – nazwa gry. Ładowane po voices.js, voices-games.js i voices-en.js.
*/
(function () {
  const VO = window.OverlayVoices; if (!VO) return;
  const PL = { V: VO.data, G: VO.games }, EN = window.OverlayVoicesEN ? { V: window.OverlayVoicesEN.V, G: window.OverlayVoicesEN.GAMEV } : null;
  const put = (set, who, trans) => { if (set && set.V[who]) set.V[who].trans = trans; };
  const putG = (set, id, trans) => { if (set && set.G[id]) set.G[id].trans = trans; };

  // ---------------------------------------------------------------- postacie
  put(PL, '_', { game: [['Wracamy do gry', '{game}'], ['Gramy dalej', 'Wracam do {game}.']], any: [['Chwila…', 'Zmieniam scenę.'], ['Przełączam', 'Zaraz wszystko będzie.']] });
  put(EN, '_', { game: [['Back to the game', '{game}'], ['Playing on', 'Back to {game}.']], any: [['One moment…', 'Switching scenes.'], ['Switching', 'Almost there.']] });
  put(PL, 'vince', { game: [['Powrót do planu', 'Każdy krok tworzy grunt pod następny – {game}.'], ['Wracamy', 'Tunel miał wyjście. Prosto do {game}.']], any: [['Zmiana planu', 'Krok w bok, żeby zobaczyć całość.'], ['Przejście', 'Mosty mają powód. Ten prowadzi dalej.']] });
  put(EN, 'vince', { game: [['Back to the plan', 'Every step lays ground for the next – {game}.'], ['Returning', 'The tunnel had an exit. Straight to {game}.']], any: [['Change of plan', 'A step aside to see the whole.'], ['Transition', 'Bridges have a reason. This one leads on.']] });
  put(PL, 'chip', { game: [['no dobra. gramy.', '{game}. nie patrz tak.'], ['wracam', 'ciasteczko zjedzone. {game}.']], any: [['chwila', 'nie dotykaj niczego.'], ['zmieniam', '*dzwonek przytrzymany*']] });
  put(EN, 'chip', { game: [['fine. we play.', '{game}. don\'t look at me like that.'], ['back', 'cookie eaten. {game}.']], any: [['one sec', 'don\'t touch anything.'], ['switching', '*holds the bell*']] });
  put(PL, 'ragnar', { game: [['WRACAMY NA PARKIET!', '{game} – drop za trzy, dwa, jeden!'], ['Kolejny numer!', 'Gramy dalej: {game}!']], any: [['Przejście!', 'Miksuję do następnego kawałka.'], ['Zmiana setu', 'Nie schodźcie z parkietu!']] });
  put(EN, 'ragnar', { game: [['BACK ON THE FLOOR!', '{game} – drop in three, two, one!'], ['Next track!', 'Playing on: {game}!']], any: [['Transition!', 'Mixing into the next track.'], ['Set change', 'Don\'t leave the dance floor!']] });
  put(PL, 'toro', { game: [['Rzeka płynie dalej', 'Panta rei – wracamy do {game}.'], ['Latarnia znów świeci', 'Herbata wypita. {game}.']], any: [['Przejście przez most', '„Wszystko płynie.” My też.'], ['Chwila ciszy', 'Co ma być, to będzie – za moment.']] });
  put(EN, 'toro', { game: [['The river flows on', 'Panta rei – back to {game}.'], ['The lantern shines again', 'Tea finished. {game}.']], any: [['Crossing the bridge', '"Everything flows." So do we.'], ['A moment of quiet', 'What will be, will be – in a moment.']] });
  put(PL, 'zarin', { game: [['silniki znów działają!', 'wracamy do {game}. *ćwierk*'], ['naprawione', 'działa! no to {game}.']], any: [['przestawiam przełącznik', 'jeśli zaiskrzy – to normalne.'], ['chwila', 'jeszcze jedna śrubka.']] });
  put(EN, 'zarin', { game: [['engines running again!', 'back to {game}. *chirp*'], ['fixed', 'it works! {game} it is.']], any: [['flipping the switch', 'if it sparks – that\'s normal.'], ['one sec', 'one more screw.']] });
  put(PL, 'myr', {
    game: { protocol: [['POWRÓT DO ZADANIA', 'Ta jednostka wznawia operację: {game}.']], human: [['wracam', 'Ja… wracam do {game}.']], terminal: [['> resume()', '> task="{game}" // status=active']], syndrome: [['P-POWRÓT', '{game}… {game}… wzna-wznawiam']] },
    any: { protocol: [['ZMIANA KONFIGURACJI', 'Ta jednostka przełącza widok.']], human: [['chwila', 'Ja… zaraz.']], terminal: [['> scene.switch()', '> fade // cut // ok']], syndrome: [['Z-ZMIANA', 'włącz… wyłącz… przełącz']] }
  });
  put(EN, 'myr', {
    game: { protocol: [['RETURN TO TASK', 'This unit resumes operation: {game}.']], human: [['back', 'I… am going back to {game}.']], terminal: [['> resume()', '> task="{game}" // status=active']], syndrome: [['R-RETURN', '{game}… {game}… res-resuming']] },
    any: { protocol: [['CONFIGURATION CHANGE', 'This unit is switching view.']], human: [['one moment', 'I… one moment.']], terminal: [['> scene.switch()', '> fade // cut // ok']], syndrome: [['S-SWITCH', 'on… off… switch']] }
  });

  // ---------------------------------------------------------------- gry
  putG(PL, 'dd', { game: [['Z POWROTEM W CIEMNOŚĆ', 'Pochodnia przygasła, ale jeszcze się tli. Schodzimy dalej.'], ['WYTRWAŁOŚĆ', 'Odpoczynek się skończył. Loch – nigdy.']], any: [['ZMIANA', 'Mgła gęstnieje… i rozstępuje się na chwilę.'], ['CIEŃ', 'Coś się porusza na skraju światła. To tylko zmiana sceny. Tym razem.']] });
  putG(EN, 'dd', { game: [['BACK INTO THE DARK', 'The torch has dimmed, but still smoulders. We descend further.'], ['RESOLVE', 'The rest is over. The dungeon – never.']], any: [['A SHIFT', 'The fog thickens… and parts for a moment.'], ['A SHADOW', 'Something moves at the edge of the light. Only a scene change. This time.']] });
  putG(PL, 'dd2', { game: [['W DROGĘ', 'Dyliżans rusza dalej. Góra nie czeka.']] });
  putG(EN, 'dd2', { game: [['ONWARD', 'The stagecoach rolls on. The Mountain does not wait.']] });
  putG(PL, 'me', { game: [['POWRÓT NA MOSTEK', 'Kurs ustalony – {game}.']], any: [['SKOK PRZEZ PRZEKAŹNIK', 'Trzymajcie się, zmiana pozycji.']] });
  putG(EN, 'me', { game: [['BACK ON THE BRIDGE', 'Course set – {game}.']], any: [['RELAY JUMP', 'Hold on, changing position.']] });
  putG(PL, 'cp', { game: [['WPINAM SIĘ', 'Night City czeka, choom.']], any: [['ZAKŁÓCENIA', 'Sygnał przeskakuje na inny kanał.']] });
  putG(EN, 'cp', { game: [['JACKING IN', 'Night City is waiting, choom.']], any: [['INTERFERENCE', 'The signal jumps to another channel.']] });
  putG(PL, 'hk', { game: [['DALEJ W GŁĄB', 'Ławka zostaje za nami.']], any: [['NIĆ SIĘ NAPINA', 'Krótka cisza między pieśniami.']] });
  putG(EN, 'hk', { game: [['DEEPER STILL', 'The bench stays behind us.']], any: [['THE THREAD TIGHTENS', 'A short silence between songs.']] });
  putG(PL, 'wf', { game: [['WYLOT Z ORBITERA', 'Tenno, wracamy do misji.']] });
  putG(EN, 'wf', { game: [['LEAVING THE ORBITER', 'Tenno, back to the mission.']] });
  putG(PL, 'ra', { game: [['WRACAMY NA FRONT', 'Jednostki gotowe. Ruszamy.']] });
  putG(EN, 'ra', { game: [['BACK TO THE FRONT', 'Units ready. Moving out.']] });
  putG(PL, 'cnc', { game: [['EVA: MISJA WZNOWIONA', 'Komandorze, czekamy na rozkazy.']] });
  putG(EN, 'cnc', { game: [['EVA: MISSION RESUMED', 'Commander, awaiting orders.']] });
  putG(PL, 'vn', { game: [['NASTĘPNY ROZDZIAŁ', 'Wczytuję zapis – {game}.']], any: [['ZAPISANO', 'Zakładka włożona między strony.']] });
  putG(EN, 'vn', { game: [['NEXT CHAPTER', 'Loading the save – {game}.']], any: [['SAVED', 'A bookmark between the pages.']] });
  putG(PL, 'mk', { game: [['WRACAM DO SCENY', 'Tab – tryb edycji.']], any: [['ZMIANA WIDOKU', 'Numpad 0 – kamera.']] });
  putG(EN, 'mk', { game: [['BACK TO THE SCENE', 'Tab – edit mode.']], any: [['VIEW CHANGE', 'Numpad 0 – camera.']] });
  putG(PL, 'pal', { game: [['WYPRAWA!', 'Pale gotowe, ruszamy.']] });
  putG(EN, 'pal', { game: [['EXPEDITION!', 'Pals ready, let\'s go.']] });
  putG(PL, 'cs', { game: [['NOWA RUNDA', 'Kupujemy i gramy.']] });
  putG(EN, 'cs', { game: [['NEW ROUND', 'Buy and go.']] });
})();
