/*
  English lines for English-language streams (panel → Język streama → English).
  Same structure as themes/voices.js + themes/voices-games.js. Characters keep their voices:
  Vince – analytical, sparse; Chip – sceptical, lowercase; Ragnar – loud DJ heart; Toro – calm, quotes philosophers;
  Zarin – curious Avali mechanic; Myr-35 – four registers (protocol / human / terminal / Nanite Syndrome).
  {user} lines are written so they don't depend on anyone's gender.
*/
(function () {
  const V = {
    _: {
      follow: [['New follower', 'Welcome aboard, {user}!'], ['Someone new', 'Make yourself at home, {user}.'], ['New follow', 'Thanks for sticking around!'], ['New face in the crew', 'Good to see you, {user}.']],
      sub: [['New subscriber', 'Huge thanks, {user}!'], ['Sub!', 'That really helps – thank you!'], ['New sub', '{user} joins the crew.']],
      resub: [['Resubscribed', 'Month {n} together. Thanks, {user}!'], ['Loyal viewer', 'Month {n} in a row – respect.'], ['Resub', 'Still here together – thanks, {user}!']],
      gift: [['Gifts for chat', '{user} is giving subs away!'], ['Sub shower', 'Big heart, {user}!'], ['Gifts!', '{n}× sub flying into chat.']],
      cheer: [['Bits!', 'Thanks for the support, {user}!'], ['Bits incoming', 'Bits: {n} – thank you!'], ['Cheer!', 'Appreciate it, {user}.']],
      raid: [['Raid!', 'Welcome, {user} crew!'], ['Incoming!', 'Make yourselves at home, everyone!'], ['Guests!', '{user} brings the crew: {n}!']],
      redeem: [['Channel points', '{user}: {reward}'], ['Redeemed', '{reward} – accepted!'], ['Order from chat', '{user} picks: {reward}']]
    },
    vince: {
      follow: [['A new path', 'Welcome, {user}. Every step lays ground for the next.'], ['New follower', 'A sensible choice, {user}.'], ['Someone new', 'Walls have an end. You just walked through one.'], ['{user} joins', 'Wide network, and still – noted.']],
      sub: [['New subscriber', 'A foundation for something bigger. Thank you, {user}.'], ['Sub', 'No shortcuts – and it would be harder without you.'], ['Support', 'Bridges have a reason. You are one of them.']],
      resub: [['Month {n}', 'Consistency impresses me more than scale.'], ['Extended', 'A narrow door, {user} – and yet you are inside.'], ['A steady line', 'I rarely say it plainly: thank you.']],
      gift: [['Gifts for chat', 'You build conditions for others. That is how it is done.'], ['Gifts', '{user} lays ground for new paths: {n}.']],
      cheer: [['Bits', 'A precise move, {user}.'], ['Support', 'Noted. And appreciated.']],
      raid: [['The tunnel has an exit', '{user} crew coming in. Welcome.'], ['Raid', 'An outside perspective – always welcome.'], ['Guests', 'The room grows. So does the plan.']],
      redeem: [['Commission', '{reward} – accepted for execution.'], ['Channel points', '{user}: {reward}. Reasonable.']],
      scenes: {
        prep: [['Preparing', 'First, understand the shape of the problem.'], ['Laying out the plan', 'Every step lays ground for the next.']],
        soon: [['Stream in', 'Schedule set. The structure stands.'], ['Soon', 'Bridges have a reason. This one too.']],
        start: [['Starting soon', 'Final adjustments to the plan.'], ['Starting shortly', 'Walls have an end.']],
        late: [['Slight delay', 'An obstacle, not a problem. Already working around it.'], ['A short slip', 'Tunnels have exits – this one too.']],
        brb: [['Break', 'Calibration. Back in a moment.'], ['Pause', 'A step back to see the whole.']],
        brbLate: [['The break runs long', 'A moment more. It is worth doing right.']],
        talk: [['Conversation', 'No games. Just the shape of things.'], ['Let us talk', 'Bridges have a reason – sometimes it is a conversation.']],
        end: [['That is it for today', 'Tunnels have exits. See you.'], ['Thanks for today', 'Each of you was a step further.']]
      }
    },
    chip: {
      follow: [['huh. new follow', 'sure. we will see how long you stay.'], ['someone new', '{user}. noted. not that it matters.'], ['follow. ok.', 'where is the catch?'], ['hey', 'the cookies are mine. the rest… fine.']],
      sub: [['huh. a sub', '…thanks. just don\'t make it a thing.'], ['sub. seriously?', 'you didn\'t have to. but fine.'], ['new sub', '*holds the bell so it won\'t ring*']],
      resub: [['you again. good.', 'month {n}. not saying i\'m happy.'], ['still here', 'still haven\'t found the catch. suspicious.'], ['resub', '*the bell rings. didn\'t hold it this time*']],
      gift: [['cookies for everyone', '{user} is sharing. i\'m just guarding the plate.'], ['gifts', 'someone here has too good a heart. {user}.'], ['giveaway', 'i didn\'t steal them. this time.']],
      cheer: [['bit crumbs', '{n} – counted. twice.'], ['bits', 'for cookies? for cookies.']],
      raid: [['someone came in. a lot of someones.', 'don\'t touch the cookies.'], ['raid', '{user} brought people. ok. i\'ll be quiet.'], ['incoming', 'the bell isn\'t ringing. everything is under control.']],
      redeem: [['fine, a reward', '{reward}. make it quick.'], ['points', '{user} wants: {reward}. thinking. done.']],
      scenes: {
        prep: [['setting up', 'don\'t look. not yet.'], ['one sec', 'arranging stuff. don\'t help.']],
        soon: [['stream in', 'it will happen. stop asking every hour.'], ['soon', 'stay. or don\'t. but stay.']],
        start: [['huh. starting soon', 'cookies ready. me almost.'], ['soon', 'bell held. we can go.']],
        late: [['running late', 'not my fault. probably not this time.'], ['one more minute', 'the catch was in the cable.']],
        brb: [['cookie break', 'don\'t eat anything without me.'], ['brb', 'don\'t go anywhere.']],
        brbLate: [['longer break', 'the cookie was bigger than i thought.']],
        talk: [['talking', 'no games. just… talking. fine.'], ['chat', 'ask. i\'ll answer. maybe.']],
        end: [['so. that\'s it.', 'it was… ok. better than ok. don\'t tell anyone.'], ['the end', 'thanks. *bell, quietly*']]
      }
    },
    ragnar: {
      follow: [['The room grows!', '{user} hits the dance floor!'], ['NEW FACE!', 'Welcome, {user} – I can hear you!'], ['Follow!', 'Reading the room: it\'s getting better.'], ['You\'re in!', 'One more heart at 128 BPM.']],
      sub: [['SUB ON THE FLOOR!', '{user}, this is the moment – THANK YOU!'], ['Sub!', 'Turning the bass up just for you.'], ['There it is!', 'I feel it in my chest – thanks, {user}!']],
      resub: [['A regular!', 'Month {n} by the stage. Love it.'], ['You\'re back!', 'Same rhythm, {user}, and it still slaps!'], ['Resub!', 'You know how to hold a room.']],
      gift: [['A round for the room!', '{user} buys for the whole floor!'], ['GIFTS!', 'Hands up for {user}!'], ['Presents!', '{n}× sub – the crowd goes wild!']],
      cheer: [['Louder!', 'Bits: {n} – straight into the speakers!'], ['Bits!', '{user} cranks the energy!']],
      raid: [['RAID! THE WHOLE ROOM!', '{user} crew rolls in – welcome to the club!'], ['New crowd!', 'Drop in three, two, one!'], ['Raid!', '+{n} on the floor – switching to the heavy setlist!']],
      redeem: [['Request for the DJ', '{reward} – let\'s go!'], ['From the floor!', '{user} asks for: {reward}. You got it!']],
      scenes: {
        prep: [['Soundcheck…', 'Setting up the decks. I can already feel the room.'], ['Warm-up', 'Cables, lights, heart – checking.']],
        soon: [['Party in', 'Save the dance floor!'], ['Playing soon', 'I feel like it\'s gonna be a good night.']],
        start: [['Going on soon!', 'Last beat before the drop.'], ['Start!', 'Hands up, we\'re about to play!']],
        late: [['Small delay', 'The room is waiting – I\'ll come in loud, promise!'], ['One more moment', 'The best entrances are late.']],
        brb: [['Break at the bar', 'Water, breathe, back in a bit.'], ['Catching my breath', 'The music keeps going, me in a sec.']],
        brbLate: [['The break runs long', 'Don\'t leave the dance floor!']],
        talk: [['Talk time!', 'Tonight I\'m reading the chat, not the room.'], ['No games', 'Just us and a talk – turning up the heart.']],
        end: [['Last track', 'Thank you, the room was INCREDIBLE.'], ['Party\'s over', 'Every one of you was on beat tonight. Thanks!']]
      }
    },
    toro: {
      follow: [['Another light under the bridge', 'Welcome, {user} – there\'s room here.'], ['A new guest', 'Panta rei – and here you are, {user}.'], ['Someone by the lantern', 'Make yourself at home, the tea is still warm.'], ['Welcome', '"Friendship is one soul in two bodies" – and there are more of us here.']],
      sub: [['A new lantern', 'Thank you, {user}. The night gets warmer.'], ['Sub', 'Seneca said giving is an art. You have mastered it.'], ['Support', 'I take something from every outcome – from this one the most.']],
      resub: [['The lantern keeps shining', 'Month {n} under the same bridge.'], ['Together again', '"Everything flows" – and you stay. Thank you.'], ['Resub', 'Warmth that returns is the most precious.']],
      gift: [['Lanterns for everyone', '{user} lights the way for others.'], ['Gifts', 'Sharing what you have – a beautiful custom.']],
      cheer: [['Sparks over the river', 'Sparks: {n} – thank you, {user}.'], ['Bits', 'A small gesture, a great light.']],
      raid: [['Guests from the river', 'Welcome, {user} crew! Tea for everyone.'], ['Raid', 'The dogs bark, the caravan moves on – straight to us!'], ['Incoming', 'There is always room under the bridge.']],
      redeem: [['A request under the bridge', '{reward} – with pleasure.'], ['Points', '{user}: {reward}. What will be, will be.']],
      scenes: {
        prep: [['Lighting the lantern', 'It is hard to begin when you don\'t know if the night will be warm.'], ['Preparing', 'Tidying up, putting the kettle on.']],
        soon: [['See you in', '"Patience is bitter, but its fruit is sweet."'], ['Soon', 'The lantern is already glowing.']],
        start: [['The lantern lights up', 'Make yourselves at home under the bridge.'], ['Here we go', 'Panta rei – we flow.']],
        late: [['The river flows slower', 'Late, but in good spirits.'], ['One more moment', 'What will be, will be – in a moment.']],
        brb: [['Tea under the bridge', 'Brewing and coming back.'], ['Break', 'A short walk by the river.']],
        brbLate: [['The tea is steeping', 'Good tea doesn\'t like to be rushed.']],
        talk: [['Talk by the lantern', 'No games, but aphorisms.'], ['A chat', '"There\'s room for your aphorisms too."']],
        end: [['The light goes out. Panta rei.', 'Thank you for being under this bridge.'], ['Good night', 'Tomorrow the river will be different – and so will we.']]
      }
    },
    zarin: {
      follow: [['new part in the collection:', 'still works! welcome, {user}.'], ['someone new aboard', '*chirp* {user}, did you bring something to fix?'], ['follow!', 'adding to the list. pencil first, marker later.'], ['new crew member', 'the hatch was open – good thing you came in.']],
      sub: [['it still works! sub:', 'thanks, {user} – the heat exchanger is purring.'], ['new sub', 'enough for a new harness fan!'], ['sub!', 'Myr, look – someone is supporting us!']],
      resub: [['still running:', 'month {n} without a breakdown. a record!'], ['resub', 'this part stays for good. in marker.'], ['still with us', '*happy chirping*']],
      gift: [['a crate of parts for the crew', '{user} is handing out! everyone to the workshop.'], ['gifts', '{n}× sub? that\'s more than Patch has in the till.']],
      cheer: [['sparks from the exchanger', 'bits: {n} – Oskar will be happy.'], ['bits!', 'saving up for a new hull plate.']],
      raid: [['a freighter is landing:', '{user} crew! mind the snow by the hatch.'], ['raid!', '+{n} aboard – it\'ll get warm. too warm. come on in.'], ['guests!', 'Myr opens, I fix – welcome!']],
      redeem: [['a job from the crew:', '{reward}. grabbing the wrench.'], ['points', '{user} wants: {reward}. let me check if it still works.']],
      scenes: {
        prep: [['taking the gear apart', 'one screw left over. there\'s always one.'], ['preparing', 'goggles down. going where I shouldn\'t.']],
        soon: [['engines start in', 'the coolant pump coughs, but it\'ll fly.'], ['soon', 'counting the gaps between coughs.']],
        start: [['warming up the engines…', 'hold on to something.'], ['taking off soon', 'hatch closed. almost.']],
        late: [['something got stuck', 'fixing it. it was just one cable. two.'], ['delay', 'the snow was coming sideways. literally.']],
        brb: [['fixing something. one sec.', 'don\'t touch anything that sparks.'], ['break', 'going to the cold room. just for a moment.']],
        brbLate: [['it\'s a bigger repair', 'turns out there was something else inside.']],
        talk: [['talking in the workshop', 'ask away, I\'ll take something apart meanwhile.'], ['chat', 'want to know how it works? me too.']],
        end: [['closing the workshop', 'thanks, crew. everything still works!'], ['end of shift', 'Patch is asleep. me soon too.']]
      }
    },
    myr: {
      weights: { protocol: 0.55, human: 0.18, terminal: 0.17, syndrome: 0.10 },
      follow: {
        protocol: [['REPORT: NEW FOLLOWER', 'This unit registers: {user}. Access granted.'], ['NEW CREW MEMBER', 'This unit greets {user} per protocol.'], ['REPORT', 'Crew increased by one. Status: satisfactory.']],
        human: [['…welcome', 'I… I\'m glad you\'re here, {user}.'], ['someone new', 'Stay. It\'s warm here – by the engine room.']],
        terminal: [['> follow.event', '> user={user} // status=OK // ack'], ['> CREW.ADD', '> {user} :: clearance B1 :: granted']],
        syndrome: [['RE-RE-REPORT', 'this un-unit… re-registers… {user}'], ['N-NEW', 'Zarin… counting… three… two… new… follower.']]
      },
      sub: {
        protocol: [['REPORT: NEW SUBSCRIPTION', 'This unit confirms support from {user}. Supplies replenished.'], ['SUPPLIES RECEIVED', 'This unit says thank you. Formally.']],
        human: [['…thank you', 'I… don\'t know how to say it by the regulations. Thank you, {user}.'], ['that matters', 'I will remember this.']],
        terminal: [['> sub.event', '> user={user} // tier=OK // resources++'], ['> SUPPLY.IN', '> source={user} :: thank_you.exe']],
        syndrome: [['SUB-SUB-SCRIPTION', 't-t-tha… this unit… thanks… thanks']]
      },
      resub: {
        protocol: [['REPORT: SUBSCRIPTION EXTENDED', 'This unit registers continuity. Month: {n}.'], ['PERMANENT CREW MEMBER', 'Loyalty of {user} confirmed.']],
        human: [['still here', 'I… remember you, {user}.']],
        terminal: [['> resub.event', '> user={user} // months={n} // streak=stable']],
        syndrome: [['E-EXTENDED', '{n}… {n}… mon-month… stable']]
      },
      gift: {
        protocol: [['REPORT: SUPPLIES FOR THE CREW', '{user} transfers resources to the crew. Packages: {n}.'], ['RESOURCE DISTRIBUTION', 'This unit supervises distribution.']],
        human: [['for everyone', 'I… that is very kind of you, {user}.']],
        terminal: [['> gift.event', '> from={user} // count={n} // distribute()']],
        syndrome: [['S-SUPPLIES', 'dis… distri… d-d-distribution… complete']]
      },
      cheer: {
        protocol: [['REPORT: BITS', 'This unit registers support. Value: {n}.'], ['ENERGY RECEIVED', 'Power level increased.']],
        human: [['warmth', 'I… feel it. Thank you, {user}.']],
        terminal: [['> cheer.event', '> bits={n} // user={user} // power+']],
        syndrome: [['B-BITS', '{n}… nanites… on… off… on']]
      },
      raid: {
        protocol: [['ALERT: BOARDING', 'Visitors detected: {n}. This unit permits entry. No breaching the bulkhead.'], ['FRIENDLY BOARDING', '{user} crew aboard. Bulkhead open.']],
        human: [['guests', 'I… will open. Come in.']],
        terminal: [['> RAID.DETECTED', '> from={user} // count={n} // hull=OK // open()']],
        syndrome: [['B-B-BOARDING', 'bulkhead… bulkhead… Zarin, count… one… two… open.']]
      },
      redeem: {
        protocol: [['REPORT: ORDER FROM CHAT', 'This unit accepts the task: {reward}.'], ['COMMISSION', '{user} issues an order. Execution in progress.']],
        human: [['all right', 'I\'ll do it, {user}. {reward}.']],
        terminal: [['> redeem.event', '> task="{reward}" // by={user} // queued']],
        syndrome: [['O-ORDER', '{reward}… {reward}… acc-accepted']]
      },
      scenes: {
        prep: { protocol: [['UNIT PREPARATION', 'This unit performs a pre-broadcast check.']], human: [['one moment', 'I… am almost ready.']], terminal: [['> BOOT', '> systems.check() … OK']], syndrome: [['P-PREPA…', 'check… check… ch-check']] },
        soon: { protocol: [['BROADCAST IN', 'This unit reports time until start.']], human: [['soon', 'I am waiting too.']], terminal: [['> SCHEDULE', '> stream.start = T-minus']], syndrome: [['B-B-BROADCAST', 'in… in… in']] },
        start: { protocol: [['BROADCAST IN', 'This unit takes position.']], human: [['soon', 'I… am glad you are here.']], terminal: [['> stream.start', '> countdown.active']], syndrome: [['S-START', 'in… a moment… moment']] },
        late: { protocol: [['OPERATION DELAYED', 'This unit apologises for the deviation from schedule.']], human: [['sorry', 'I… one more moment.']], terminal: [['> WARN', '> stream.start delayed // retry']], syndrome: [['D-DELAY…', 'nanites… loop… Zarin… counting…']] },
        brb: { protocol: [['MAINTENANCE BREAK', 'This unit proceeds to the engine room.']], human: [['break', 'I… will be right back.']], terminal: [['> PAUSE', '> unit.status = maintenance']], syndrome: [['B-BREAK', 'on… off… break']] },
        brbLate: { protocol: [['MAINTENANCE EXTENDED', 'This unit requests patience.']], human: [['one more moment', 'I… almost.']], terminal: [['> PAUSE', '> eta = unknown']], syndrome: [['M-MAINT', 'three… two… one… once more']] },
        talk: { protocol: [['VERBAL REPORT', 'This unit answers the crew\'s questions.']], human: [['let\'s talk', 'I… like it when you ask.']], terminal: [['> CHAT.MODE', '> input=chat // output=voice']], syndrome: [['R-REPORT', 'ask… questions… ask']] },
        end: { protocol: [['END OF SHIFT', 'This unit thanks the crew. Report closed.']], human: [['thank you', 'I… it was a good day. Thank you all.']], terminal: [['> SHUTDOWN', '> thanks.all() // goodnight']], syndrome: [['E-END', 'of… of shift… th-thank you']] }
      }
    }
  };

  const TIERS = {
    _: {
      sub: { 3: [['Tier 2 sub!', '{user}, huge thanks!']], 4: [['TIER 3 SUB!', '{user} – that is massive support!']] },
      cheer: { 3: [['Bit shower!', '{user} rains bits: {n}!']], 4: [['BIT STORM', 'Bits: {n}! {user}, that\'s something!']], 5: [['LEGENDARY BITS', 'Bits: {n}. {user}… no words. THANK YOU!']] },
      gift: { 3: [['Sub avalanche!', '{user} gives away: {n}× sub!']], 4: [['GIFT STORM', '{n}× sub from {user} – chat went wild!']], 5: [['GIFT APOCALYPSE', '{user}: {n}× sub. This goes down in channel history.']] },
      resub: { 3: [['Half a year and more!', 'Month {n} – thanks for being here, {user}!']], 4: [['OVER A YEAR TOGETHER', 'Month {n} – {user}, you are part of this place.']], 5: [['CHANNEL VETERAN', 'Month {n} – {user}, this is your home as much as mine.']] },
      raid: { 3: [['Big raid!', '{user} crew arrives in full: {n}!']], 4: [['HUGE RAID', 'Aboard: {n}! Welcome, {user} crew!']], 5: [['INVASION', '{user} crew: {n}! The servers are shaking!']] },
      redeem: { 3: [['A big one', '{user} spends points on: {reward}!']], 4: [['PRICEY REWARD', '{reward} – {user} spares no points!']], 5: [['LEGENDARY REWARD', '{user} redeems: {reward}. Respect.']] }
    },
    vince: {
      sub: { 3: [['A solid foundation', 'One tier up. Noted, {user}.']], 4: [['Load-bearing structure', 'Tier 3. You can build on this for years.']] },
      cheer: { 3: [['A precise investment', 'Bits: {n}. Every step lays ground for the next.']], 4: [['A new floor', 'Bits: {n}. The plan just got bigger.']], 5: [['A bridge over the gap', 'Bits: {n}. Bridges have a reason – today it\'s you, {user}.']] },
      gift: { 3: [['Conditions for others', '{n}× sub. That\'s how a community is built.']], 4: [['Infrastructure', '{user} builds a whole district: {n}× sub.']], 5: [['A city', '{n}× sub. That\'s not a house anymore – it\'s a city, {user}.']] },
      resub: { 3: [['Consistency', 'Month {n}. I rarely see it – and I appreciate it.']], 4: [['Over a year', 'Month {n}. A narrow door, and you\'ve been inside for ages.']], 5: [['Foundation', 'Month {n}. Without you this structure would not stand.']] },
      raid: { 3: [['A wide tunnel', '{user} crew – entry without collision. Welcome.']], 4: [['A new storey', 'Aboard: {n}. Plan recalculated, there is room.']], 5: [['A whole quarter', '{user} crew: {n}. Walls have an end – today you moved them.']] },
      redeem: { 3: [['A serious commission', '{reward}. Accepted, with priority.']], 4: [['A special project', '{user} orders: {reward}. I\'ll draw it up properly.']], 5: [['Project of a lifetime', '{reward}. All right, {user}. No shortcuts.']] }
    },
    chip: {
      sub: { 3: [['…tier 2?', 'you didn\'t have to. seriously. …thanks.']], 4: [['TIER 3?!', '*the bell rings. couldn\'t hold it.*']] },
      cheer: { 3: [['a lot of crumbs', 'bits: {n}. counted three times. still that many.']], 4: [['these aren\'t crumbs', 'bits: {n}. where is the catch. WHERE.']], 5: [['…', 'bits: {n}. *the bell rings on its own* …thank you. don\'t tell anyone.']] },
      gift: { 3: [['cookies for chat', '{n}× sub. {user} has too good a heart.']], 4: [['a whole box of cookies', '{n}× sub. ok. ok. that\'s a lot.']], 5: [['a bakery', '{n}× sub. {user}… *doesn\'t know what to do with paws*']] },
      resub: { 3: [['still here', 'month {n}. still no catch. suspicious.']], 4: [['over a year', 'month {n}. …you\'re mine. channel-wise. don\'t tell anyone.']], 5: [['you\'re staying', 'month {n}. i was wrong about the catch 23 times. about you too.']] },
      raid: { 3: [['a lot of someones', '{user} crew. don\'t touch the cookies. none.']], 4: [['A LOT of someones', 'aboard: {n}. hiding the plate.']], 5: [['the whole world came in', '{user} crew: {n}. *the bell rings. on purpose this time*']] },
      redeem: { 3: [['a big reward', '{reward}. fine. i\'ll do it.']], 4: [['a pricey reward', '{user} spent it on: {reward}. really? …fine. really.']], 5: [['that reward?!', '{reward}. ok. for you. once.']] }
    },
    ragnar: {
      sub: { 3: [['TIER 2 ON THE FLOOR!', '{user}, I feel it in my chest!']], 4: [['TIER 3!!!', '{user}, the whole room stands up for you!']] },
      cheer: { 3: [['BASS UP!', 'Bits: {n} – cranking it to the max!']], 4: [['DROP!!!', 'Bits: {n}! {user}, the whole room is jumping!']], 5: [['BEST NIGHT OF MY LIFE', 'Bits: {n}! {user} – I don\'t have enough speakers for this!']] },
      gift: { 3: [['A ROUND FOR EVERYONE!', '{n}× sub from {user}!']], 4: [['OPEN BAR!', '{n}× sub! {user}, I love you, seriously!']], 5: [['THE WHOLE CLUB ON {user}!', '{n}× sub. I\'m crying at the decks.']] },
      resub: { 3: [['A REGULAR!', 'Month {n} – I remember your entrance!']], 4: [['A YEAR BY THE STAGE!', 'Month {n} – you ARE the rhythm, {user}!']], 5: [['DANCE FLOOR LEGEND', 'Month {n} – {user}, this room is yours too.']] },
      raid: { 3: [['THE ROOM IS BURSTING!', '{user} crew rolls in – hands up!']], 4: [['SECOND FLOOR OPEN!', 'In the room: +{n}! Switching to the festival set!']], 5: [['FESTIVAL!!!', '{user} crew: {n}! THIS IS THE BIGGEST PARTY!']] },
      redeem: { 3: [['SPECIAL REQUEST', '{reward} – full power!']], 4: [['VIP FROM THE FLOOR!', '{user} wants: {reward}. YOU GOT IT, madlad!']], 5: [['A LIVE WISH', '{reward}. {user}, I\'m doing this for you on stage!']] }
    },
    toro: {
      sub: { 3: [['A brighter lantern', 'One tier up – the night gets very warm.']], 4: [['A stained-glass lantern', 'Tier 3. "Generosity is the spirit of the deed." Thank you, {user}.']] },
      cheer: { 3: [['Fireworks over the river', 'Sparks: {n}. Panta rei – and here they flow to us.']], 4: [['A river of light', 'Sparks: {n}. Seneca would approve.']], 5: [['A sun under the bridge', 'Sparks: {n}. For the first time it\'s bright as day under the bridge.']] },
      gift: { 3: [['Lanterns for the whole street', '{n}× sub. Sharing – a beautiful custom.']], 4: [['A lantern festival', '{user} lights {n}× lights for others.']], 5: [['A bridge in light', '{n}× sub. The whole bridge is glowing, {user}. Thank you.']] },
      resub: { 3: [['A regular under the bridge', 'Month {n}. Everything flows – and you stay.']], 4: [['A year by the lantern', 'Month {n}. "A true friend is one soul in two bodies."']], 5: [['A chosen family', 'Month {n}. My family cut me off – and I found you.']] },
      raid: { 3: [['Many guests from the river', '{user} crew! There\'s enough tea, I promise.']], 4: [['A whole flotilla', 'On the bank: {n}. There\'s always room under the bridge.']], 5: [['A river of guests', '{user} crew: {n}. The caravan didn\'t move on – it came to us!']] },
      redeem: { 3: [['A special request', '{reward} – with great pleasure.']], 4: [['A generous request', '{user} asks for: {reward}. What will be, will be.']], 5: [['A great request', '{reward}. For a request like this, every lantern should be lit.']] }
    },
    zarin: {
      sub: { 3: [['a better part!', 'tier 2! the exchanger purrs louder!']], 4: [['premium part!!', 'tier 3?! *chirps very loudly*']] },
      cheer: { 3: [['sparks from the whole exchanger', 'bits: {n}. Oskar counted and sat down.']], 4: [['short circuit of joy', 'bits: {n}! enough for a new coolant pump!']], 5: [['NEW ENGINE', 'bits: {n}. Patch will fly faster than ever. *delighted chirping*']] },
      gift: { 3: [['a crate of parts', '{n}× sub for the crew! everyone to the workshop!']], 4: [['a whole container!', '{n}× sub! Maro can\'t hand out the tools fast enough!']], 5: [['a new ship?!', '{n}× sub. {user}, that\'s more than Patch was worth. *chirp*']] },
      resub: { 3: [['still works!', 'month {n}. this part stays for good.']], 4: [['over a year without a breakdown', 'month {n}. writing it in marker. a thick one.']], 5: [['part of the hull', 'month {n}. you\'re bolted to Patch now, {user}.']] },
      raid: { 3: [['a big freighter!', '{user} crew! mind the snow by the hatch!']], 4: [['a whole convoy!', '+{n} aboard. it\'ll be very warm. Myr, open up!']], 5: [['a fleet!!', '{user} crew: {n}. Oskar says this is a station now, not a ship.']] },
      redeem: { 3: [['a bigger job', '{reward}. grabbing the big wrench.']], 4: [['a special job', '{user} wants: {reward}. I\'ll take everything apart to do it.']], 5: [['the job of a lifetime', '{reward}. ok. goggles down. going in.']] }
    },
    myr: {
      big: {
        protocol: [['REPORT: HIGH PRIORITY EVENT', 'This unit registers value {n}. The protocol does not cover such magnitude.'], ['ALERT: GRATITUDE OVERLOAD', 'This unit… this unit confirms. {user}.']],
        human: [['…{user}', 'I… have no regulation sentence for this. Thank you. Really.'], ['me', 'I will remember this forever, {user}.']],
        terminal: [['> PRIORITY.MAX', '> value={n} // from={user} // buffer overflow // gratitude++'], ['> EVENT.CRITICAL', '> {user} :: magnitude={n} :: unit.status=moved']],
        syndrome: [['O-O-OVERLO…', 'too… too much… Zarin… count… three… two… {user}… th-thank you'], ['V-V-VALUE', '{n}… {n}… nanites… on… off… I… I…']]
      }
    }
  };

  const SCENES_DEFAULT = {
    prep: [['Getting ready', 'Setting everything up, almost there.'], ['Stream in preparation', 'Make yourself at home, we start soon.']],
    soon: [['Stream in', 'See you soon!'], ['Starting in', 'Drop in when the countdown ends.']],
    start: [['Starting soon', 'Make yourself at home, we\'re about to start.'], ['Here we go!', 'Final preparations.']],
    late: [['Running late', 'Sorry for the delay – almost there!'], ['Small delay', 'Stay, I\'ll be right there.']],
    brb: [['Break', 'Be right back.'], ['Short break', 'Don\'t go far.']],
    brbLate: [['The break runs long', 'One more moment, thanks for your patience.']],
    talk: [['Let\'s talk', 'No games – just conversation.'], ['Just chatting', 'Ask me anything.']],
    end: [['Thanks for today!', 'See you next stream.'], ['End of stream', 'Thank you for being here.']]
  };

  const quick = (start, brb, end) => ({ start: [start], brb: [brb], end: [end] });
  const GAMEV = {
    tal: {
      follow: [['A new seeker of the Crown', '{user} rolls the dice and joins the board.'], ['New character in play', '{user} draws an adventure card.']],
      sub: [['Talisman found', '{user} – the road to the Crown of Command is open.'], ['A gold coin', 'Sub from {user}. Fortune favours the bold.']],
      resub: [['Another turn', 'Month {n} – {user} is still on the road.']], gift: [['Treasure for the party', '{user} deals the cards: {n}× sub!']],
      cheer: [['Gold for the purse', 'Bits: {n} – {user} goes shopping in town.']], raid: [['Raid on the Realm', '{user}\'s party enters the board!']],
      redeem: [['Event card', '{user} reveals: {reward}']],
      big: [['CROWN OF COMMAND', '{user} reaches the centre of the board. Legendary!'], ['A GREAT SPELL', '{user} rolls – all sixes!']],
      scenes: quick(['FIRST ROLL', 'The dice are rolling.'], ['AT THE INN', 'Turn on hold.'], ['GAME OVER', 'Crown or not – thanks for playing.'])
    },
    tal5: { follow: [['A NEW SEEKER', '{user} picks a character and heads for the Crown.']] },
    pal: {
      follow: [['New Pal caught!', '{user} joins the base.'], ['New companion', '{user} – first contact successful!']],
      sub: [['A rare Pal!', '{user} jumps into the party!'], ['Caught!', 'Sub from {user} – the sphere hit on the first try.']],
      resub: [['Base resident', 'Month {n} – {user} has worked the farm for ages.']], gift: [['A package for the base', '{user} hands out {n}× sub to the whole party!']],
      cheer: [['Supplies!', 'Bits: {n} – the base has food.']], raid: [['The pack attacks!', '{user}\'s crew runs into the base!']],
      redeem: [['A job for a Pal', '{user}: {reward}']],
      big: [['LEGENDARY PAL', '{user} – nobody has caught this one yet!'], ['ALPHA!', '{user} takes down the boss in one move!']],
      scenes: quick(['EXPEDITION!', 'Pals ready to go.'], ['AT THE BASE', 'The Pals work, I rest.'], ['SEE YOU TOMORROW!', 'The Pals go to sleep. Thanks!'])
    },
    me: {
      follow: [['New crew member', '{user} aboard. Course set.'], ['Recruit', '{user} joins the mission.']],
      sub: [['Fleet support', '{user} – signal received, thank you.'], ['Paragon', '{user} takes the good path: sub!']],
      resub: [['Mission veteran', 'Month {n} – {user} flew with us through every relay.']], gift: [['Fleet supplies', '{user} delivers {n}× sub for the crew!']],
      cheer: [['Credits', 'Bits: {n} – {user} funds the upgrade.']], raid: [['The fleet arrives', '{user}\'s ships drop out of the relay!']],
      redeem: [['Orders from the bridge', '{user}: {reward}']],
      big: [['COMBAT READY', '{user} – the whole galaxy saw that.'], ['A DECISION THAT CHANGES EVERYTHING', '{user} – logged in the codex.']],
      scenes: {
        prep: [['PRE-FLIGHT', 'Drive systems check. Crew to stations.']], soon: [['JUMP IN', 'Relay charged. Waiting for the signal.']],
        start: [['LAUNCH', 'Course set. Entering the relay.']], late: [['LAUNCH DELAYED', 'Flight control is holding us. One more moment.']],
        brb: [['DOCKED', 'The Normandy is refuelling. Back soon.']], brbLate: [['REPAIRS RUN LONG', 'Engineering asks for patience.']],
        talk: [['CAPTAIN\'S CABIN', 'Talking with the crew. Ask away.']], end: [['MISSION COMPLETE', 'Report filed. Thank you, crew.']]
      }
    },
    mele: { follow: [['MISSION SELECT', '{user} – the trilogy awaits. Which part first?']], scenes: { start: [['MISSION SELECT', 'Three games, one crew. Setting course.']] } },
    me1: {
      follow: [['NEW ALLIANCE RECRUIT', '{user} reports aboard the SR-1.'], ['PLANET SCAN', 'New signal detected: {user}.']],
      sub: [['SPECTRE STATUS', '{user} – the Council grants Spectre status.'], ['ROVER READY', 'Sub from {user}. We\'ll land even on a vertical cliff.']],
      resub: [['CITADEL VETERAN', 'Month {n} – {user} knows every corner of the Presidium.']], gift: [['ALLIANCE SUPPLIES', '{user} sends {n}× sub for the SR-1 crew!']],
      cheer: [['CREDITS', 'Bits: {n} – {user} buys better armour from the quartermaster.']], raid: [['ALLIANCE FLEET', '{user}\'s ships drop out of the relay above the Citadel!']],
      big: [['SPECTRE IN ACTION', '{user} – the Council won\'t be happy. But it works.'], ['RELAY ACTIVE', '{user} – a trip everyone will remember.']],
      scenes: { start: [['SR-1 LAUNCH', 'First flight. The galaxy has no idea yet.']], brb: [['STOP AT THE CITADEL', 'Shopping on the Presidium. Back soon.']] }
    },
    me2: {
      follow: [['NEW DOSSIER', '{user} – file reviewed, recruit accepted.'], ['RECRUITMENT', '{user} joins the team for a one-way mission.']],
      sub: [['LOYALTY EARNED', '{user} – loyalty mission complete.'], ['SR-2 UPGRADE', 'Sub from {user} – thicker armour, better odds.']],
      resub: [['OLD CREW', 'Month {n} – {user} is still aboard after every suicide mission.']], gift: [['NO-QUESTIONS DELIVERY', '{user} funds {n}× sub. Nobody asks where from.']],
      cheer: [['RESOURCES', 'Bits: {n} – {user} probes every planet.']], raid: [['BOARDING', '{user}\'s squad goes through the relay – no turning back!']],
      big: [['EVERYONE SURVIVED', '{user} – the whole crew comes home!'], ['NO WAY BACK', '{user} – through the relay and back.']],
      scenes: { start: [['SR-2 LAUNCH', 'New ship, new crew, old cause.']], end: [['MISSION ACCOMPLISHED', 'Everyone aboard. Thank you, crew.']] }
    },
    me3: {
      follow: [['WAR ASSET', '{user} – a new asset on the war map.'], ['ALLY', '{user} joins the galactic coalition.']],
      sub: [['READINESS +1', '{user} – the fleet grows stronger.'], ['UNITED', 'Sub from {user}. Every species counts.']],
      resub: [['WE DON\'T GIVE UP', 'Month {n} – {user} fights to the end.']], gift: [['COALITION', '{user} gathers a fleet: {n}× sub!']],
      cheer: [['WAR EFFORT', 'Bits: {n} – {user} chips in for the weapon.']], raid: [['FLEETS ARRIVE', '{user}\'s crew drops out of the relay – we take Earth back!']],
      big: [['TAKE BACK EARTH', '{user} – the whole galaxy stands together.'], ['ONE OF THEM FELL', '{user} – so they can be beaten!']],
      scenes: { start: [['EARTH IS BURNING', 'No time. We start.']], end: [['AFTER THE BATTLE', 'Whatever we choose – thank you for being here.']] }
    },
    mea: { follow: [['PATHFINDER', '{user} wakes from cryo.'], ['A NEW WORLD', '{user} – outpost established.']], sub: [['VIABILITY +10%', '{user} – the planet is getting friendlier.']], big: [['A NEW HOME', '{user} – Andromeda finally welcomes us.']] },
    wf: {
      follow: [['New Tenno', '{user} wakes from cryosleep.'], ['Operator joins', '{user} – welcome to the Orbiter.']],
      sub: [['Prime!', '{user} – sub recognised. Gold trim.'], ['Platinum', 'Thanks, {user}!']],
      resub: [['Mastery', 'Month {n} – {user} ranks up mastery.']], gift: [['A gift from the Relay', '{user} hands out {n}× sub to the clan!']],
      cheer: [['Endo and credits', 'Bits: {n} – {user} maxes out the mods.']], raid: [['Squad incoming', '{user}\'s squad lands through the Rift!']],
      redeem: [['Contract', '{user} commissions: {reward}']],
      big: [['LEGENDARY DROP', '{user} – one in a thousand, and it hit!'], ['PRIME ACCESS', '{user} – gold and energy at full power!']],
      scenes: quick(['LEAVING THE ORBITER', 'Tenno, mission assigned.'], ['ORBITER', 'Break aboard.'], ['BACK TO THE ORBITER', 'Mission complete. Thanks, Tenno.'])
    },
    dl: {
      follow: [['A new agent of the Bureau', '{user} steps into the city fog.'], ['The Patron noticed', '{user} – the key has turned.']],
      sub: [['Souls collected', '{user} – the Patron smiles.'], ['Pact sealed', 'Sub from {user}. The lock gave way.']],
      resub: [['An alley regular', 'Month {n} – {user} knows every street.']], gift: [['Souls for the lane', '{user} gives {n}× sub to allies!']],
      cheer: [['Souls!', 'Bits: {n} – {user} buys an item.']], raid: [['A wave in the lane', '{user}\'s team pushes the lane!']],
      redeem: [['Ritual', '{user} performs: {reward}']],
      big: [['THE PATRON HAS SPOKEN', '{user} – the lock is wide open.'], ['AN UNDYING RITUAL', '{user} – the city trembles.']],
      scenes: quick(['MATCH', 'Lanes set. The Patron is watching.'], ['BEHIND THE LOCK', 'A break at the Bureau.'], ['LOCK CLOSED', 'Thanks, agents.'])
    },
    dd: {
      follow: [['ANOTHER SOUL', 'Another soul descends the steps into darkness. {user} does not yet know what waits below.'], ['A NEWCOMER', 'The stagecoach brings {user}. Youth and zeal – the currency the dungeon accepts most gladly.'], ['THE CONTRACT', 'A contract signed by {user}. The ink is not yet dry, and the darkness already knows the name.'], ['FRESH BLOOD', '{user} stands at the Hamlet gates. Courage is a fine beginning. Rarely a fine end.'], ['ENLISTED', 'The roster of mercenaries grows by one name: {user}. The quill trembles, but writes on.']],
      sub: [['GOLD FOR THE FAMILY', '{user} pays in gold. The Hamlet\'s foundations groan with gratitude.'], ['AN OATH', '{user} swears loyalty. May it be kept longer than mine.'], ['A GIFT', 'The generosity of {user} pushes back the gloom – if only for a moment. Sometimes a moment is enough.'], ['RENEWAL', 'With the gift from {user} we will rebuild the forge. Steel remembers who paid for it.']],
      resub: [['PERSEVERANCE', 'Month {n}. {user} still stands, though reason long ago said to run.'], ['AN OLD HAND', 'The scars of {user} count {n} months. Each one a lesson – and a bill.'], ['RESOLVE', 'Month {n}. The darkness tried. {user} – not a step back.'], ['THE CHRONICLE', 'The chronicler adds another chapter: {user}, month {n}. There is ink enough for many.']],
      gift: [['SUPPLIES FOR THE COMPANY', '{user} hands out {n}× sub. Torches, rations and a little hope for each.'], ['BENEFACTOR', 'This is how legends are born: {user} shares while others hoard. {n} gifts.'], ['ALMS', '{n} subs from {user}. Even in this cursed land, generosity still blooms.']],
      cheer: [['THE CLINK OF COIN', '{n} bits from {user}. Gold smells better than fear.'], ['FOR THE TORCHES', '{user} scatters bits: {n}. Light is costly. Darkness – free.'], ['TREASURE', 'A chest opened, and within – {n} bits from {user}. No trap. This time.']],
      raid: [['RAID', 'The Hamlet gates creak. {user} leads {n} souls across our threshold.'], ['A COLUMN ON THE ROAD', 'Dust on the road, torches in a row – the company of {user}. Let them in while it is still light.'], ['RELIEF', 'When hope was fading, the company of {user} arrived. {n} more blades against the dark.']],
      redeem: [['A WISH', '{user} demands: {reward}. The darkness takes note.'], ['A TAVERN JOB', '{user} sets a coin on the table: {reward}. Someone will have to do it.'], ['A RITE', 'Words spoken by {user}: {reward}. There is no turning back.']],
      big: [['TRIUMPH', 'Excellent! {user} – such a feat is written in the family chronicle in golden ink.'], ['THE FINAL BLOW', 'The beast falls, and the echo carries the name of {user} down every corridor.'], ['VIRTUE', 'Facing the abyss – resolve. {user} forges fear into fire.'], ['A TORCH AT THE PEAK', 'The flame leaps to the vault! {user} – even the shadows step back in respect.'], ['VICTORY', 'Rarely do I see such a thing. {user} – let the Hamlet bell ring!']],
      scenes: {
        prep: [['PREPARATIONS', 'Sharpen the blades, count the rations. The dungeon does not forgive haste.'], ['MUSTER IN THE HAMLET', 'The supply wagon has not yet stopped. Patience.']],
        soon: [['EXPEDITION IN', 'Every minute is one more breath before the darkness.'], ['DESCENT IN', 'The torches are lit. We wait for the hour to strike.']],
        start: [['THE DESCENT', 'The steps are slick, and the air heavier with every step. We begin.'], ['ONWARD', 'The gate opens. May the light outlast the courage.']],
        late: [['DELAY', 'The guide is late. The darkness – never.'], ['A SETBACK', 'Even the best plan crumbles on contact with reality. A little longer.']],
        brb: [['CAMP', 'Light the fire. Wounds will close; fear – not necessarily.'], ['A REST', 'A short halt. Listen for footsteps in the dark.']],
        brbLate: [['THE NIGHT DRAGS ON', 'The fire burns low, and the watch has not returned. Wait.'], ['SILENCE', 'Too quiet for too long. It is always too quiet before it begins.']],
        talk: [['IN THE TAVERN', 'Full tankards, loose tongues. Speak, while you still can.'], ['BY THE HEARTH', 'No dungeon tonight. Only words – they can wound too.']],
        end: [['THE RETURN', 'You came back – not all whole, but all alive. Thank you for walking with me.'], ['THE EXPEDITION ENDS', 'The torch goes out. Until the next descent – may it not be the last.']]
      }
    },
    dd2: {
      follow: [['A NEW PASSENGER', 'The stagecoach stops. {user} climbs aboard without asking where to.'], ['THE ROAD', '{user} rides with us. The wheels creak, and the Mountain waits.']],
      sub: [['THE FLAME', '{user} feeds the lantern. The flame burns brighter.'], ['A BOND', 'Sub from {user}. In this party, someone still trusts someone.']],
      big: [['THE MOUNTAIN DRAWS NEAR', '{user} – this whole cursed road waited for such deeds.'], ['HOPE', '{user} – in this darkness, it is more than light.']],
      scenes: { start: [['ONWARD', 'Lantern lit, wheels greased. We ride for the Mountain.']], brb: [['THE INN', 'A stop at the inn. Wounds, wine and old grudges.']], end: [['END OF THE LEG', 'The stagecoach halts. Today we got further than yesterday.']] }
    },
    hk: {
      follow: [['A new wanderer', '{user} enters the kingdom.'], ['Someone\'s thread', '{user} – a new thread in the fabric.']],
      sub: [['Mask shard', '{user} – thanks, the heart beats stronger.'], ['Tangled thread', 'Sub from {user}.']],
      resub: [['An old wanderer', 'Month {n} – {user} knows every bench.']], gift: [['Silk for everyone', '{user} hands out {n}× sub!']],
      cheer: [['Geo', 'Bits: {n} – {user} visits the cartographer.']], raid: [['Pilgrims', '{user}\'s pilgrimage climbs to the Citadel!']],
      redeem: [['A request from the bench', '{user}: {reward}']],
      big: [['THE SONG OF SILK', '{user} – the whole kingdom hears it.'], ['BOSS DOWN', '{user} – without a single hit!']],
      scenes: quick(['THE JOURNEY', 'The kingdom waits in silence.'], ['A BENCH', 'Resting on a bench. On the road again soon.'], ['THE SONG ENDS', 'The thread didn\'t break. Thank you.'])
    },
    hk1: { follow: [['A NEW WANDERER', '{user} descends into the kingdom below.']], sub: [['MASK SHARD', '{user} – one more heart.']], big: [['THE KINGDOM THANKS YOU', '{user} – even the silence got louder.']] },
    silk: {
      follow: [['A NEW PILGRIMAGE', '{user} climbs toward the citadel.'], ['THREAD TIED', '{user} – a new thread in the song.']],
      sub: [['SILK', '{user} – thanks, the spool is full.'], ['NEEDLE AND THREAD', 'Sub from {user}. Stitched for good.']],
      big: [['THE SONG OF SILK', '{user} – the whole citadel is singing!'], ['NOT A SINGLE HIT', '{user} – a dance with the needle, clean!']],
      scenes: { start: [['THE CLIMB', 'The pilgrimage heads upward.']], brb: [['REST', 'A bench, a moment of quiet, then onward.']] }
    },
    cp: {
      follow: [['New runner', '{user} jacks into the Net.'], ['Contact', '{user} – a new number in the phone.']],
      sub: [['Eddies!', '{user} – transfer received. Thanks, choom.'], ['New implant', 'Sub from {user}.']],
      resub: [['Afterlife legend', 'Month {n} – {user}, your name is on the wall.']], gift: [['A package from the fixer', '{user} hands out {n}× sub to the crew!']],
      cheer: [['Eddies in the account', 'Bits: {n} – {user} pays for the implant.']], raid: [['A crew from Night City', '{user}\'s crew rolls into the city!']],
      redeem: [['Gig', '{user}: {reward}']],
      big: [['NIGHT CITY LEGEND', '{user} – every bar will remember this.'], ['NET TAKEOVER', '{user} – system breached!']],
      scenes: quick(['JACKING IN', 'Night City never sleeps. Neither do we.'], ['NET BREAK', 'Signal lost for a moment, choom.'], ['JACKING OUT', 'Thanks, crew. Until the next gig.'])
    },
    cs: {
      follow: [['New player on the team', '{user} joins the server.'], ['Buying weapons', '{user} – ready for the round.']],
      sub: [['Ace!', '{user} – sub in the first round.'], ['Bomb defused', 'Sub from {user}.']],
      resub: [['Rank veteran', 'Month {n} – {user} has been playing for ages.']], gift: [['A drop for the team', '{user} drops {n}× sub for the whole team!']],
      cheer: [['Economy', 'Bits: {n} – full buy for the team.']], raid: [['Rush B!', '{user}\'s crew runs onto the site!']],
      redeem: [['Tactic', '{user} calls: {reward}']],
      big: [['ACE!!!', '{user} – five in one round!'], ['CLUTCH 1v5', '{user} – nobody believed it!']],
      scenes: quick(['WARM-UP', 'Buy and go.'], ['TACTICAL TIMEOUT', 'Technical pause.'], ['GG', 'Thanks for the match!'])
    },
    ra: {
      follow: [['UNIT READY', '{user} – reporting to base.'], ['NEW RECRUIT', '{user} trained at the barracks.']],
      sub: [['TESLA COIL CHARGED', '{user} – maximum voltage!'], ['NEW ARMAMENTS', 'Sub from {user}. The factory runs at full steam.']],
      resub: [['FRONT VETERAN', 'Month {n} – {user} earns another stripe.']], gift: [['SUPPLY DROP', '{user} drops {n}× sub over the base!']],
      cheer: [['CREDITS', 'Bits: {n} – the refinery runs at full capacity.']], raid: [['FORCES DETECTED', '{user}\'s crew on radar! Heading: our base.']],
      redeem: [['ORDERS', '{user}: {reward}']],
      big: [['IRON CURTAIN', '{user} – invulnerable for a full half minute!'], ['CHRONOSPHERE', '{user} teleports the whole army in a blink!']],
      scenes: { start: [['MISSION STARTED', 'Base construction under way. Objective: survive.']], brb: [['CEASEFIRE', 'A short break on the front.']], end: [['MISSION COMPLETE', 'Front report sent. Thank you, comrades in arms.']] }
    },
    ra2: { follow: [['NEW RECRUIT', '{user} – barracks ready, unit trained.'], ['A SPY?', '{user} enters the base. The dogs are already sniffing.']], sub: [['TESLA COIL', '{user} – full power!'], ['CHRONOSPHERE', 'Sub from {user} – shifted straight into the base.']], big: [['APOCALYPSE', '{user} – Apocalypse tanks on the way!'], ['ATTACK THROUGH TIME', '{user} – the whole army appears out of nowhere!']], scenes: { start: [['BRIEFING', 'Comrade commander, the front awaits.']], brb: [['CEASEFIRE', 'A short break in the cold war.']] } },
    yr: { follow: [['MIND TAKEN', '{user} – joining… of their own free will?'], ['NEW ADEPT', '{user} joins the Initiative.']], sub: [['MIND CONTROL', '{user} – one sub, one thought, one goal.'], ['CLONE', 'Sub from {user}. Or is it a clone?']], big: [['PSYCHIC DOMINATOR', '{user} – the whole map thinks the same: wow!'], ['MASS TAKEOVER', '{user} – chat belongs to us now.']], scenes: { brb: [['MEDITATION', 'Minds are resting. Back soon.']] } },
    ra3: { follow: [['NEW UNIT', '{user} – readiness confirmed, commander.'], ['THE BIG THREE', '{user} picks a side. The right one, I hope.']], sub: [['TECH OF TOMORROW', '{user} – a sub and an instant upgrade!'], ['FLEET SUPPORT', 'Sub from {user} – ships turning into tanks.']], big: [['ULTIMATE WEAPON', '{user} – all three sides freeze!'], ['GRAND OFFENSIVE', '{user} – the whole front moves!']], scenes: { start: [['THREE SIDES', 'Soviets, Allies, Empire – we begin.']] } },
    up: { follow: [['UPRISING', '{user} – one more voice in the revolt.']], big: [['A WINNING UPRISING', '{user} – the old order is shaking!']] },
    cnc: {
      follow: [['UNIT TRAINED', '{user} – readiness confirmed.'], ['NEW SIGNAL', '{user} on radar.']],
      sub: [['TIBERIUM HARVESTED', '{user} – green crystals flow to the refinery.'], ['CONSTRUCTION COMPLETE', 'Sub from {user}.']],
      resub: [['OLD COMMANDER', 'Month {n} – {user} remembers the first Tiberium war.']], gift: [['SUPPLY DROP', '{user} hands out {n}× sub!']],
      cheer: [['CREDITS', 'Bits: {n} – the harvester returns full.']], raid: [['BASE UNDER ATTACK', '{user}\'s forces enter the map!']],
      redeem: [['ORDERS', '{user}: {reward}']],
      big: [['ION CANNON READY', '{user} – target locked. Fire from orbit!'], ['COUNTDOWN COMPLETE', '{user} – superweapon launched!']],
      scenes: { start: [['MISSION LOADED', 'Commander, awaiting orders.']], brb: [['TRANSMISSION BREAK', 'Communications will be restored.']], end: [['MISSION ACCOMPLISHED', 'Area secured. Thank you, commanders.']] }
    },
    ts: { follow: [['NEW COMMANDER', '{user} – the tiberium field awaits.']], sub: [['MECH READY', '{user} – walker advancing!']], big: [['ION CANNON', '{user} – an ion storm over the whole map!']], scenes: { brb: [['ION STORM', 'Communications down – back soon.']] } },
    fs: { follow: [['FIRESTORM', '{user} – walking right into the fire.']], big: [['FIRESTORM ACTIVE', '{user} – an impassable wall of fire!']] },
    tw: { follow: [['NEW REPORT', '{user} – EVA confirms the recruit.']], sub: [['TIBERIUM HARVESTED', '{user} – the refineries never stop.']], big: [['TIBERIUM WARS', '{user} – the whole world is watching!'], ['STRIKE FROM ORBIT', '{user} – ion cannon ready to fire!']] },
    kw: { follow: [['FAITHFUL TO NOD', '{user} – the Brotherhood grows.']], sub: [['PEACE THROUGH POWER', 'Sub from {user}. Kane smiles.']], big: [['KANE\'S WRATH', '{user} – the temple trembles!']], scenes: { start: [['THE BROTHERHOOD CALLS', 'Faithful, assemble. We begin.']] } },
    c4: { follow: [['TWILIGHT', '{user} – the last chapter of tiberium.']] },
    gen: {
      follow: [['NEW SOLDIER', '{user} – recruit ready for action.'], ['REPORTING', '{user} reports to HQ.']],
      sub: [['GENERAL\'S PROMOTION', '{user} – general point awarded!'], ['SUPPLY DROP', 'Sub from {user} – a crate on a parachute.']],
      resub: [['ANOTHER STAR', 'Month {n} – {user} gets promoted again.']], gift: [['AIRLIFT', '{user} drops {n}× sub from a cargo plane!']],
      cheer: [['SUPPLIES', 'Bits: {n} – another drop for the base.']], raid: [['ARMOURED COLUMN', '{user}\'s crew rolls onto the battlefield!']],
      redeem: [['HQ ORDERS', '{user}: {reward}']],
      big: [['SUPERWEAPON READY', '{user} – countdown complete!'], ['AIR STRIKE', '{user} calls in air support – the whole map shakes!']],
      scenes: { start: [['BRIEFING', 'General, the map is ready. We begin.']], brb: [['HALT', 'Resupplying. Back soon.']], end: [['OPERATION OVER', 'Operation complete. Thank you, soldiers.']] }
    },
    zh: { follow: [['ZERO HOUR', '{user} – recruit ready for the final operation.']], sub: [['THE GENERAL RANKS UP', '{user} – new general powers!']], big: [['ZERO HOUR HAS STRUCK', '{user} – superweapon fully armed!']] },
    vn: {
      follow: [['A NEW READER', '{user} opens the next chapter.'], ['CHOICE SAVED', '{user} – this decision will matter.']],
      sub: [['ROUTE UNLOCKED', '{user} – a new path in the story.'], ['BOOKMARK', 'Sub from {user}. Saving the game.']],
      resub: [['ANOTHER CHAPTER', 'Month {n} – {user} knows every branch of the plot.']], gift: [['READING TOGETHER', '{user} hands out {n}× sub – we read together!']],
      cheer: [['CG UNLOCKED', 'Bits: {n} – {user} adds a new illustration to the gallery.']], raid: [['NEW READERS', '{user}\'s crew sits down with the text!']],
      redeem: [['CHAT\'S CHOICE', '{user}: {reward}']],
      big: [['TRUE ENDING', '{user} – nobody saw that coming.'], ['PLOT TWIST', '{user} – the whole story turned upside down!']],
      scenes: { start: [['CHAPTER ONE', 'The text is loading. We read together.']], brb: [['GAME SAVED', 'A short break between chapters.']], end: [['END OF CHAPTER', 'Thank you for reading with me.']], talk: [['BETWEEN CHAPTERS', 'Talking about choices and characters.']] }
    },
    sc: { follow: [['NEW BLACKRUNNER', '{user} – training starts now.'], ['A SIGNAL IN THE ZONE', '{user} – someone is still alive in this darkness.']], sub: [['TEAM SUPPORT', '{user} – nobody goes into a blackzone alone.']], big: [['YOU SURVIVED THE ZONE', '{user} – back from the blackzone in one piece!']], scenes: { start: [['INTO THE ZONE', 'Gear checked. Moving out.']], brb: [['CAMP', 'A fire, coffee and a moment of quiet before the zone.']] } },
    mk: {
      follow: [['NEW VERTEX', '{user} – the mesh grows.'], ['ADDED TO THE SCENE', '{user} – Shift+A and there you are.']],
      sub: [['SUBDIVISION +1', '{user} – the model is smoother already.'], ['MATERIAL APPLIED', 'Sub from {user}. Finally not grey.']],
      resub: [['OLD MODELER', 'Month {n} – {user} has seen every n-gon on this channel.']], gift: [['ASSET PACK', '{user} gives {n}× sub – everyone gets a texture!']],
      cheer: [['COMPUTE POWER', 'Bits: {n} – {user} buys a few render samples.']], raid: [['NEW COLLECTIONS', '{user}\'s crew drops into the scene!']],
      redeem: [['COMMISSION', '{user}: {reward}']],
      big: [['RENDER DONE', '{user} – 4K, all samples, zero noise!'], ['ZERO N-GONS', '{user} – perfect topology!']],
      scenes: {
        prep: [['OPENING THE PROJECT', 'Loading the scene and textures.']], start: [['LET\'S MODEL', 'Mesh ready, here we go.']],
        brb: [['RENDER IN PROGRESS', 'The computer works, I make tea.']], brbLate: [['THE RENDER DRAGS ON', 'A few more samples…']],
        talk: [['LET\'S TALK 3D', 'Ask about modelling and Blender.']], end: [['PROJECT SAVED', 'Ctrl+S and thanks for modelling with me!']]
      }
    }
  };

  const SAMPLES = {
    _: ['thanks for the stream!', 'still the best channel!', 'greetings from Berlin'],
    vince: ['for the next storey', 'bridges have a reason', 'for the Dual Path'],
    chip: ['for cookies!', 'for a new bell for Chip', 'don\'t eat them all at once'],
    ragnar: ['for a new set!', 'for that drop!', 'still the best party on Twitch!'],
    toro: ['for tea under the bridge', 'for the lantern', 'panta rei!'],
    myr: ['for unit MYR-35', 'for engine room supplies', 'report: all nominal'],
    zarin: ['for Patch parts', 'for a new fan', 'does it still work?'],
    tal: ['for another turn!', 'may the dice be kind', 'for the Crown of Command'], pal: ['for all the Pals', 'for a new base', 'catch them all'],
    me: ['for the Normandy crew', 'for the ship upgrade', 'for the right choice'], me1: ['for the SR-1 crew', 'for a new rover'], me2: ['for the SR-2 upgrade', 'so everyone survives'], me3: ['for the coalition', 'take back Earth'],
    wf: ['for new mods', 'for a lucky drop', 'for the clan'], dl: ['for the Patron', 'for a new item', 'hold the lane!'],
    dd: ['for torches', 'to lower the stress', 'for the family and the Hamlet'], dd2: ['for the lantern flame', 'for the stagecoach'],
    hk: ['geo for the cartographer', 'for every bench', 'the thread won\'t break'], silk: ['for silk', 'for every thread'],
    cp: ['for a new implant', 'eddies for the crew', 'for Night City'], cs: ['full buy!', 'rush B', 'GG WP'],
    ra: ['for the Tesla coil', 'for a new tank'], ra2: ['chronosphere ready'], yr: ['mind control!', 'it wasn\'t me, it was Yuri'], ra3: ['for the fleet'],
    cnc: ['for tiberium', 'ion cannon ready'], kw: ['peace through power'], gen: ['general point!', 'for the airdrop'], zh: ['zero hour!'],
    vn: ['for that choice!', 'for the next chapter', 'keep reading'], sc: ['for the Blackrunners', 'careful in the zone'],
    mk: ['for a better GPU', 'fewer n-gons!', 'for that render']
  };

  window.OverlayVoicesEN = { V, TIERS, SCENES_DEFAULT, GAMEV, SAMPLES };
})();
