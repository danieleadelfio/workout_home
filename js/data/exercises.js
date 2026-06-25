// ════════════════════════════════════════════════════════════════════════════
// EXERCISE LIBRARY
// Model: { slug, name, type, equipment, muscles, goals, video, sets, reps, secs, tip }
//   type      : 'bodyweight' | 'weights'
//   equipment : array of EQUIPMENT ids required (['none'] for bodyweight)
//   muscles   : array of MUSCLES ids
//   goals     : array of GOALS ids this exercise serves well
//   video     : YouTube video ID (editable by user). '' => search fallback.
//   reps=0    => time-based (use secs as work duration)
// NOTE: video IDs are curated defaults from popular fitness channels and can be
//       edited per-exercise in the editor if a link is not ideal.
// ════════════════════════════════════════════════════════════════════════════

export const EXERCISE_LIBRARY = [

  // ─────────────────────────── BODYWEIGHT · GAMBE ───────────────────────────
  { slug:'squat', name:'Squat', type:'bodyweight', equipment:['none'], muscles:['legs','glutes'], goals:['strength','hypertrophy','tone','fat-loss'], video:'aclHkVaku9U',
    sets:3, reps:12, secs:50, tip:'Talloni a terra, schiena dritta. Scendi fino a cosce parallele al suolo.' },
  { slug:'squat-sumo', name:'Squat sumo', type:'bodyweight', equipment:['none'], muscles:['legs','glutes'], goals:['tone','hypertrophy','glutes'], video:'qB3UjgIxnhA',
    sets:3, reps:12, secs:50, tip:'Piedi larghi, punte a 45 gradi. Ginocchia nella direzione delle punte.' },
  { slug:'lunges', name:'Affondi alternati', type:'bodyweight', equipment:['none'], muscles:['legs','glutes'], goals:['strength','tone','fat-loss'], video:'QOVaHwm-Q6U',
    sets:3, reps:10, secs:55, tip:'Passo ampio. Il ginocchio posteriore sfiora il pavimento senza toccarlo.' },
  { slug:'lateral-lunges', name:'Affondi laterali', type:'bodyweight', equipment:['none'], muscles:['legs','glutes'], goals:['tone','mobility','fat-loss'], video:'kVCHsmN3Kg4',
    sets:3, reps:10, secs:55, tip:'Passo laterale ampio. La gamba opposta rimane tesa con tallone a terra.' },
  { slug:'step-up', name:'Step-up su sedia', type:'bodyweight', equipment:['none'], muscles:['legs','glutes'], goals:['strength','tone','endurance'], video:'WCFCdxzFBa4',
    sets:3, reps:10, secs:50, tip:'Usa una sedia solida. Spingi con il tallone del piede che sale.' },
  { slug:'glute-bridge', name:'Glute bridge', type:'bodyweight', equipment:['none'], muscles:['glutes','core'], goals:['tone','hypertrophy','strength'], video:'wPM8icPu6H8',
    sets:3, reps:15, secs:50, tip:'Piedi vicini ai glutei. Spingi con i talloni e stringi i glutei in alto.' },
  { slug:'single-leg-glute-bridge', name:'Glute bridge monopodalico', type:'bodyweight', equipment:['none'], muscles:['glutes','core'], goals:['tone','strength'], video:'b7Hj1bdbU_w',
    sets:3, reps:12, secs:50, tip:'Una gamba sola sollevata. Mantieni il bacino stabile e in linea.' },
  { slug:'wall-sit', name:'Wall sit', type:'bodyweight', equipment:['none'], muscles:['legs'], goals:['strength','endurance'], video:'-cdph8hv0O0',
    sets:3, reps:0, secs:40, tip:'Schiena al muro, cosce parallele al suolo. Resisti senza scivolare.' },
  { slug:'calf-raise', name:'Calf raise', type:'bodyweight', equipment:['none'], muscles:['legs'], goals:['tone','strength'], video:'gwLzBJYoWlI',
    sets:3, reps:20, secs:40, tip:'Sali lentamente sulle punte e scendi controllato. Puoi farlo su un gradino.' },

  // ─────────────────────────── BODYWEIGHT · CORE ───────────────────────────
  { slug:'plank', name:'Plank', type:'bodyweight', equipment:['none'], muscles:['core'], goals:['strength','tone'], video:'pSHjTRCQxIw',
    sets:3, reps:0, secs:30, tip:'Glutei stretti, core attivo. Non lasciare cadere o alzare i fianchi.' },
  { slug:'side-plank', name:'Plank laterale', type:'bodyweight', equipment:['none'], muscles:['core'], goals:['strength','tone'], video:'K2VljzCC16g',
    sets:2, reps:0, secs:25, tip:'Corpo in linea retta testa-piedi. Esegui 25 secondi per lato.' },
  { slug:'crunch', name:'Crunch', type:'bodyweight', equipment:['none'], muscles:['core'], goals:['tone','hypertrophy'], video:'Xyd_fa5zoEU',
    sets:3, reps:20, secs:45, tip:'Solleva solo le scapole dal suolo. Non tirare il collo con le mani.' },
  { slug:'reverse-crunch', name:'Crunch inverso', type:'bodyweight', equipment:['none'], muscles:['core'], goals:['tone','hypertrophy'], video:'hyv14e2QDq0',
    sets:3, reps:15, secs:40, tip:'Gambe a 90 gradi. Porta le ginocchia verso il petto con controllo.' },
  { slug:'bicycle-crunch', name:'Bicycle crunch', type:'bodyweight', equipment:['none'], muscles:['core'], goals:['tone','fat-loss'], video:'9FGilxCbdz8',
    sets:3, reps:20, secs:40, tip:'Gomito verso il ginocchio opposto, pedala lentamente con controllo.' },
  { slug:'mountain-climber', name:'Mountain climber', type:'bodyweight', equipment:['none'], muscles:['core','cardio'], goals:['fat-loss','endurance'], video:'nmwgirgXLYM',
    sets:3, reps:20, secs:40, tip:'Posizione di plank. Porta le ginocchia al petto alternando velocemente.' },
  { slug:'hollow-body', name:'Hollow body', type:'bodyweight', equipment:['none'], muscles:['core'], goals:['strength','tone'], video:'LlDNef_ZtsA',
    sets:3, reps:0, secs:25, tip:'Schiena piatta a terra, arti estesi. Solleva leggermente gambe e spalle.' },
  { slug:'superman', name:'Superman', type:'bodyweight', equipment:['none'], muscles:['back','core'], goals:['strength','tone','mobility'], video:'z6PJMT2y8GQ',
    sets:3, reps:12, secs:40, tip:'Prono, solleva contemporaneamente braccia e gambe. Trattieni 1 sec.' },
  { slug:'leg-raise', name:'Leg raise', type:'bodyweight', equipment:['none'], muscles:['core'], goals:['tone','hypertrophy'], video:'JB2oyawG9KI',
    sets:3, reps:12, secs:45, tip:'Gambe tese, solleva fino a 90 gradi e abbassa senza toccare terra.' },

  // ─────────────────────────── BODYWEIGHT · SPINTA ───────────────────────────
  { slug:'pushup', name:'Push-up', type:'bodyweight', equipment:['none'], muscles:['chest','arms','shoulders'], goals:['strength','hypertrophy','tone'], video:'IODxDxX7oi4',
    sets:3, reps:10, secs:45, tip:'Corpo rigido come un asse. Sulle ginocchia è una valida alternativa.' },
  { slug:'diamond-pushup', name:'Push-up diamante', type:'bodyweight', equipment:['none'], muscles:['arms','chest'], goals:['strength','hypertrophy'], video:'J0DnG1_S92I',
    sets:3, reps:8, secs:40, tip:'Mani ravvicinate sotto il petto a diamante. Lavora molto i tricipiti.' },
  { slug:'incline-pushup', name:'Push-up inclinato', type:'bodyweight', equipment:['none'], muscles:['chest','arms'], goals:['tone','endurance'], video:'4dF1DOWzf20',
    sets:3, reps:12, secs:45, tip:'Mani su sedia o tavolo. Più facile del push-up classico.' },
  { slug:'pike-pushup', name:'Pike push-up', type:'bodyweight', equipment:['none'], muscles:['shoulders','arms'], goals:['strength','hypertrophy'], video:'x7_I5Sc6Rj8',
    sets:3, reps:8, secs:45, tip:'Bacino in alto a V rovesciata. Spingi con le spalle, testa verso terra.' },
  { slug:'dips', name:'Dips su sedia', type:'bodyweight', equipment:['none'], muscles:['arms','chest'], goals:['strength','hypertrophy'], video:'6kALZikXxLc',
    sets:3, reps:10, secs:40, tip:'Mani sul bordo della sedia. Scendi lento, spingi su controllato.' },

  // ─────────────────────────── BODYWEIGHT · CARDIO ───────────────────────────
  { slug:'burpee', name:'Burpee', type:'bodyweight', equipment:['none'], muscles:['fullbody','cardio'], goals:['fat-loss','endurance'], video:'auBLPXO8Fww',
    sets:3, reps:8, secs:50, tip:'In piedi, squat, plank, push-up opzionale, salto. Mantieni un ritmo costante.' },
  { slug:'jumping-jack', name:'Jumping jack', type:'bodyweight', equipment:['none'], muscles:['cardio','fullbody'], goals:['fat-loss','endurance'], video:'iSSAk4XCsRA',
    sets:1, reps:0, secs:45, tip:'Atterraggi morbidi sulle punte. Se le ginocchia protestano, marcia sul posto.' },
  { slug:'high-knees', name:'High knees', type:'bodyweight', equipment:['none'], muscles:['cardio','legs'], goals:['fat-loss','endurance'], video:'oDdkytliOqE',
    sets:1, reps:0, secs:40, tip:'Porta le ginocchia all\'altezza dei fianchi. Core attivo durante tutto il movimento.' },
  { slug:'squat-jump', name:'Squat jump', type:'bodyweight', equipment:['none'], muscles:['legs','cardio'], goals:['fat-loss','endurance','strength'], video:'CVaEhXotL7M',
    sets:3, reps:12, secs:45, tip:'Esplodi verso l\'alto dallo squat, atterra morbido piegando le ginocchia.' },

  // ─────────────────────────── BODYWEIGHT · MOBILITÀ ───────────────────────────
  { slug:'cat-cow', name:'Cat-Cow', type:'bodyweight', equipment:['none'], muscles:['mobility','back'], goals:['mobility'], video:'kqnua4rHVVA',
    sets:1, reps:10, secs:40, tip:'A quattro zampe, alterna inarcamento e arrotondamento della schiena lentamente.' },
  { slug:'quad-stretch', name:'Stretching quadricipiti', type:'bodyweight', equipment:['none'], muscles:['mobility','legs'], goals:['mobility'], video:'Q4qE6jbqJjk',
    sets:1, reps:0, secs:65, tip:'30 sec per gamba. Tira il piede verso il gluteo. Tieniti a un muro.' },
  { slug:'hamstring-stretch', name:'Stretching ischio-crurali', type:'bodyweight', equipment:['none'], muscles:['mobility','legs'], goals:['mobility'], video:'FFTxedXfjDI',
    sets:1, reps:0, secs:65, tip:'Gamba tesa avanti, piega il busto a schiena dritta. Senti il tirare dietro.' },
  { slug:'chest-stretch', name:'Stretching petto', type:'bodyweight', equipment:['none'], muscles:['mobility','chest'], goals:['mobility'], video:'I6w9pwjsosc',
    sets:1, reps:0, secs:40, tip:'Apri le braccia, tieniti a una porta. Senti lo stretch davanti alle spalle.' },
  { slug:'shoulder-stretch', name:'Stretching spalle', type:'bodyweight', equipment:['none'], muscles:['mobility','shoulders'], goals:['mobility'], video:'1RvBpvAW0Tw',
    sets:1, reps:0, secs:45, tip:'Porta un braccio sul petto, tienilo con l\'altro. Spalle abbassate.' },
  { slug:'deep-breathing', name:'Respirazione profonda', type:'bodyweight', equipment:['none'], muscles:['mobility'], goals:['mobility'], video:'LiUnFJ8P4gM',
    sets:1, reps:5, secs:40, tip:'4 sec inspira, 6 sec espira. Lascia che il corpo si rilassi completamente.' },
  { slug:'world-greatest-stretch', name:'World\'s greatest stretch', type:'bodyweight', equipment:['none'], muscles:['mobility','fullbody'], goals:['mobility'], video:'nnbYao-5bSI',
    sets:1, reps:8, secs:50, tip:'Affondo + rotazione del busto. Mobilita anche e colonna in un solo movimento.' },

  // ═══════════════════════════ WEIGHTS · MANUBRI ═══════════════════════════
  { slug:'db-goblet-squat', name:'Goblet squat', type:'weights', equipment:['dumbbell'], muscles:['legs','glutes'], goals:['strength','hypertrophy','tone'], video:'MeIiIdhvXT4',
    sets:4, reps:10, secs:55, tip:'Manubrio al petto. Schiena dritta, scendi tra le gambe mantenendo i gomiti dentro.' },
  { slug:'db-lunges', name:'Affondi con manubri', type:'weights', equipment:['dumbbell'], muscles:['legs','glutes'], goals:['strength','hypertrophy'], video:'D7KaRcUTQeE',
    sets:3, reps:10, secs:55, tip:'Un manubrio per mano lungo i fianchi. Busto eretto, passo controllato.' },
  { slug:'db-romanian-deadlift', name:'Stacco rumeno con manubri', type:'weights', equipment:['dumbbell'], muscles:['glutes','legs','back'], goals:['strength','hypertrophy'], video:'2SHsk9AzdjA',
    sets:4, reps:10, secs:55, tip:'Manubri davanti alle cosce. Spingi il bacino indietro, schiena neutra.' },
  { slug:'db-bench-press', name:'Distensioni su panca con manubri', type:'weights', equipment:['dumbbell','bench'], muscles:['chest','arms','shoulders'], goals:['strength','hypertrophy'], video:'VmB1G1K7v94',
    sets:4, reps:10, secs:60, tip:'Scapole retratte. Abbassa i manubri all\'altezza del petto, spingi in alto.' },
  { slug:'db-floor-press', name:'Floor press con manubri', type:'weights', equipment:['dumbbell'], muscles:['chest','arms'], goals:['strength','hypertrophy'], video:'jZNGoUegbAA',
    sets:3, reps:12, secs:55, tip:'Senza panca: a terra. Gomiti fermano a terra, poi spingi verso l\'alto.' },
  { slug:'db-shoulder-press', name:'Lento avanti con manubri', type:'weights', equipment:['dumbbell'], muscles:['shoulders','arms'], goals:['strength','hypertrophy'], video:'qEwKCR5JCog',
    sets:4, reps:10, secs:55, tip:'Manubri all\'altezza delle spalle, spingi sopra la testa senza inarcare la schiena.' },
  { slug:'db-lateral-raise', name:'Alzate laterali', type:'weights', equipment:['dumbbell'], muscles:['shoulders'], goals:['hypertrophy','tone'], video:'3VcKaXpzqRo',
    sets:3, reps:15, secs:45, tip:'Braccia leggermente piegate, solleva fino all\'altezza delle spalle. Controlla la discesa.' },
  { slug:'db-row', name:'Rematore con manubrio', type:'weights', equipment:['dumbbell'], muscles:['back','arms'], goals:['strength','hypertrophy'], video:'pYcpY20QaE8',
    sets:4, reps:10, secs:55, tip:'Busto inclinato, tira il manubrio verso l\'anca stringendo la scapola.' },
  { slug:'db-bicep-curl', name:'Curl bicipiti', type:'weights', equipment:['dumbbell'], muscles:['arms'], goals:['hypertrophy','tone'], video:'ykJmrZ5v0Oo',
    sets:3, reps:12, secs:45, tip:'Gomiti fermi ai fianchi. Solleva senza dondolare il busto.' },
  { slug:'db-tricep-extension', name:'Estensioni tricipiti', type:'weights', equipment:['dumbbell'], muscles:['arms'], goals:['hypertrophy','tone'], video:'_gsUck-7M74',
    sets:3, reps:12, secs:45, tip:'Manubrio sopra la testa, abbassa dietro la nuca con i gomiti fermi.' },

  // ═══════════════════════════ WEIGHTS · BILANCIERE ═══════════════════════════
  { slug:'bb-back-squat', name:'Back squat', type:'weights', equipment:['barbell'], muscles:['legs','glutes'], goals:['strength','hypertrophy'], video:'1oed-UmAxFs',
    sets:5, reps:5, secs:70, tip:'Bilanciere sul trapezio. Scendi controllato, spingi con i talloni.' },
  { slug:'bb-deadlift', name:'Stacco da terra', type:'weights', equipment:['barbell'], muscles:['back','glutes','legs'], goals:['strength','hypertrophy'], video:'op9kVnSso6Q',
    sets:5, reps:5, secs:75, tip:'Schiena neutra, barra vicina alle gambe. Spingi il pavimento via con i piedi.' },
  { slug:'bb-bench-press', name:'Panca piana', type:'weights', equipment:['barbell','bench'], muscles:['chest','arms','shoulders'], goals:['strength','hypertrophy'], video:'rT7DgCr-3pg',
    sets:4, reps:8, secs:70, tip:'Scapole retratte, piedi a terra. Abbassa al petto, spingi in modo esplosivo.' },
  { slug:'bb-row', name:'Rematore con bilanciere', type:'weights', equipment:['barbell'], muscles:['back','arms'], goals:['strength','hypertrophy'], video:'9efgcAjQe7E',
    sets:4, reps:8, secs:60, tip:'Busto inclinato a 45 gradi, tira verso l\'addome stringendo le scapole.' },
  { slug:'bb-overhead-press', name:'Military press', type:'weights', equipment:['barbell'], muscles:['shoulders','arms'], goals:['strength','hypertrophy'], video:'2yjwXTZQDDI',
    sets:4, reps:8, secs:60, tip:'Barra all\'altezza delle clavicole, spingi sopra la testa, core contratto.' },
  { slug:'bb-hip-thrust', name:'Hip thrust con bilanciere', type:'weights', equipment:['barbell','bench'], muscles:['glutes'], goals:['hypertrophy','strength','tone'], video:'LM8XHLYJoYs',
    sets:4, reps:10, secs:60, tip:'Schiena sulla panca, barra sui fianchi. Spingi in alto stringendo i glutei.' },

  // ═══════════════════════════ WEIGHTS · KETTLEBELL ═══════════════════════════
  { slug:'kb-swing', name:'Kettlebell swing', type:'weights', equipment:['kettlebell'], muscles:['glutes','back','cardio'], goals:['fat-loss','strength','endurance'], video:'YSxHifyI6s8',
    sets:4, reps:15, secs:50, tip:'Movimento d\'anca esplosivo, non di braccia. La kettlebell arriva all\'altezza del petto.' },
  { slug:'kb-goblet-squat', name:'Goblet squat kettlebell', type:'weights', equipment:['kettlebell'], muscles:['legs','glutes'], goals:['strength','hypertrophy','tone'], video:'jHfP69Ee_q0',
    sets:4, reps:12, secs:55, tip:'Kettlebell al petto, gomiti dentro. Scendi in profondità mantenendo il busto eretto.' },
  { slug:'kb-clean-press', name:'Clean & press kettlebell', type:'weights', equipment:['kettlebell'], muscles:['fullbody','shoulders'], goals:['strength','fat-loss'], video:'tbpDojRgGEk',
    sets:3, reps:8, secs:55, tip:'Porta la kettlebell in rack, poi spingi sopra la testa. Lavora un lato per volta.' },
  { slug:'kb-deadlift', name:'Stacco con kettlebell', type:'weights', equipment:['kettlebell'], muscles:['glutes','back','legs'], goals:['strength','tone'], video:'L6kp7iWyE0g',
    sets:4, reps:12, secs:50, tip:'Kettlebell tra i piedi, spingi il bacino indietro, schiena dritta.' },

  // ═══════════════════════════ WEIGHTS · ELASTICI ═══════════════════════════
  { slug:'band-squat', name:'Squat con elastico', type:'weights', equipment:['band'], muscles:['legs','glutes'], goals:['tone','endurance'], video:'iZTxa8NJFEo',
    sets:3, reps:15, secs:50, tip:'Elastico sotto i piedi e sulle spalle. Mantieni tensione costante in salita.' },
  { slug:'band-row', name:'Rematore con elastico', type:'weights', equipment:['band'], muscles:['back','arms'], goals:['tone','strength'], video:'xQNrFHEMhI4',
    sets:3, reps:15, secs:45, tip:'Elastico ancorato davanti. Tira verso l\'addome stringendo le scapole.' },
  { slug:'band-pull-apart', name:'Pull apart con elastico', type:'weights', equipment:['band'], muscles:['back','shoulders'], goals:['tone','mobility'], video:'b9Ym-Lh_dwc',
    sets:3, reps:18, secs:40, tip:'Braccia tese davanti, apri l\'elastico fino al petto stringendo le scapole.' },
  { slug:'band-glute-kickback', name:'Glute kickback con elastico', type:'weights', equipment:['band'], muscles:['glutes'], goals:['tone','glutes'], video:'GIyZ4_Fb50w',
    sets:3, reps:15, secs:45, tip:'Elastico alle caviglie. Spingi una gamba indietro mantenendo il bacino fermo.' },
  { slug:'band-lateral-walk', name:'Camminata laterale con elastico', type:'weights', equipment:['band'], muscles:['glutes','legs'], goals:['tone','endurance'], video:'o-Rc5MZA1lU',
    sets:3, reps:12, secs:45, tip:'Elastico sopra le ginocchia, mini-squat. Passi laterali mantenendo tensione.' },

  // ═══════════════════════════ WEIGHTS · SBARRA ═══════════════════════════
  { slug:'pullup', name:'Trazioni alla sbarra', type:'weights', equipment:['pullupbar'], muscles:['back','arms'], goals:['strength','hypertrophy'], video:'eGo4IYlbE5g',
    sets:4, reps:8, secs:60, tip:'Presa poco più larga delle spalle. Tira il mento sopra la sbarra, scendi controllato.' },
  { slug:'chinup', name:'Trazioni presa supina', type:'weights', equipment:['pullupbar'], muscles:['back','arms'], goals:['strength','hypertrophy'], video:'brhRXlOhsAM',
    sets:4, reps:8, secs:60, tip:'Palmi verso di te. Coinvolge di più i bicipiti rispetto alle trazioni classiche.' },
  { slug:'hanging-leg-raise', name:'Leg raise alla sbarra', type:'weights', equipment:['pullupbar'], muscles:['core'], goals:['strength','hypertrophy'], video:'Pr1ieGZ5atk',
    sets:3, reps:10, secs:50, tip:'Appeso alla sbarra, solleva le gambe tese fino a 90 gradi senza dondolare.' },
  { slug:'dead-hang', name:'Dead hang', type:'weights', equipment:['pullupbar'], muscles:['back','arms','mobility'], goals:['mobility','strength'], video:'XLLn0FFvUVw',
    sets:3, reps:0, secs:30, tip:'Appeso a braccia tese. Decomprime la colonna e rinforza la presa.' },
];

// Quick lookup by slug
export const EXERCISE_BY_SLUG = Object.fromEntries(EXERCISE_LIBRARY.map(e => [e.slug, e]));

export function getExercise(slug) {
  return EXERCISE_BY_SLUG[slug] || null;
}
