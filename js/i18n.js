// ════════════════════════════════════════════════════════════════════════════
// I18N — tiny dependency-free internationalisation layer (IT / EN).
//   t(key, params)   → translated string with {placeholder} interpolation
//   getLang/setLang  → current language, persisted to localStorage
//   applyStatic(root)→ translate [data-i18n*] attributes in the DOM
//   subscribe(cb)    → run cb whenever the language changes (re-render screens)
// UI strings live here. Exercise/template CONTENT lives in data/i18n-content.js.
// ════════════════════════════════════════════════════════════════════════════

const LANG_KEY = 'workoutLang';
const SUPPORTED = ['it', 'en'];

let lang = detectLang();
const subscribers = new Set();

function detectLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch (e) {}
  const nav = (navigator.language || 'it').slice(0, 2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : 'it';
}

export function getLang() { return lang; }

export function setLang(next) {
  if (!SUPPORTED.includes(next) || next === lang) return;
  lang = next;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  document.documentElement.setAttribute('lang', lang);
  applyStatic(document);
  subscribers.forEach(cb => { try { cb(lang); } catch (e) {} });
}

export function subscribe(cb) { subscribers.add(cb); return () => subscribers.delete(cb); }

// Translate a key for the current language, interpolating {name} params.
export function t(key, params) {
  const dict = DICT[lang] || DICT.it;
  let s = dict[key];
  if (s == null) s = (DICT.it[key] != null ? DICT.it[key] : key);
  if (params) s = s.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? params[k] : `{${k}}`));
  return s;
}

// Apply translations to static DOM nodes carrying data-i18n* attributes.
export function applyStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  root.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
  root.querySelectorAll('[data-i18n-ph]').forEach(el => { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
  root.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
  root.querySelectorAll('[data-i18n-title]').forEach(el => { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
}

// Initialise <html lang> and static text on boot.
export function initI18n() {
  document.documentElement.setAttribute('lang', lang);
  applyStatic(document);
}

// ─── Dictionaries ────────────────────────────────────────────────────────────
const DICT = {
  it: {
    'common.edit': 'Modifica',
    'common.reset': 'Reset',
    'common.cancel': 'Annulla',
    'common.use': 'Usa',
    'common.add': 'Aggiungi',
    'common.delete': 'Elimina',
    'common.workout': 'Allenamento',
    'common.back': 'Indietro',

    'lang.switch': 'Cambia lingua',
    'help.open': 'Come funziona',

    // Onboarding
    'onb.title': 'Costruiamo il<br>tuo allenamento',
    'onb.subtitle': 'Personalizziamo gli esercizi in base a ciò che hai e ai tuoi obiettivi.',
    'onb.equipQ': 'Cosa hai a disposizione?',
    'onb.equipHelp': 'Il corpo libero è sempre incluso. Seleziona gli attrezzi che possiedi.',
    'onb.levelQ': 'Qual è il tuo livello?',
    'onb.levelHelp': 'Adattiamo esercizi, ripetizioni e intensità alla tua esperienza.',
    'onb.goalQ': 'Qual è il tuo obiettivo?',
    'onb.goalHelp': 'Puoi sceglierne più di uno. Obiettivi opposti si escludono a vicenda.',
    'onb.start': 'Inizia ad allenarti',
    'onb.chooseGoal': 'Scegli almeno un obiettivo',

    // Home
    'home.label': 'Il tuo allenamento',
    'home.title': 'Pronto ad<br>allenarti?',
    'home.profileTitle': 'Il tuo profilo',
    'home.generate': '✨ Genera piano consigliato',
    'home.noProfile': 'Profilo non impostato',
    'home.sub': '{rounds} giri · {n} esercizi · a casa tua',
    'home.stat.duration': 'Durata',
    'home.stat.rounds': 'Giri',
    'home.stat.exercises': 'Esercizi',
    'home.templates': 'Template',
    'home.favorites': 'Preferiti',
    'home.customize': 'Personalizza',
    'home.start': 'Inizia allenamento →',

    // Phases (home card)
    'phase.warmup': 'Riscaldamento',
    'phase.circuit': 'Circuito principale',
    'phase.cooldown': 'Defaticamento',
    'phase.warmupSub': '{n} esercizi · ~{m} min',
    'phase.circuitSub': '{rounds} giri × {n} esercizi',
    'phase.cooldownSub': '{n} esercizi · stretching',
    'phase.circuitNote': 'Ogni giro è una serie · {rounds} giri in totale',

    // Units / details
    'unit.reps': '{n} rip.',
    'unit.secs': '{n}s',
    'unit.sec': 'sec',
    'detail.reps': '{n} ripetizioni',
    'detail.secs': '{n} sec',

    // Workout engine
    'wk.warmup': 'RISCALDAMENTO',
    'wk.cooldown': 'DEFATICAMENTO',
    'wk.restPhase': 'RIPOSO',
    'wk.round': 'GIRO {r} / {n}',
    'wk.rest': 'Riposo',
    'wk.restRounds': 'Riposo tra i giri',
    'wk.tip.breatheSlow': 'Respira lentamente.',
    'wk.tip.water': "Bevi un sorso d'acqua.",
    'wk.tip.shake': 'Scuoti braccia e gambe, respira profondo.',
    'wk.tip.breathe': 'Respira profondo.',
    'wk.minsec': 'MIN:SEC',
    'wk.sec': 'SEC',
    'wk.watchExample': '▶ Guarda esempio',
    'wk.pause': 'Pausa',
    'wk.resume': 'Riprendi',
    'wk.next': 'Avanti →',

    // Stop modal
    'stop.title': 'Interrompere?',
    'stop.subtitle': 'I progressi di questa sessione andranno persi.',
    'stop.confirm': 'Interrompi',

    // Done
    'done.title': 'Ottimo lavoro!',
    'done.subtitle': 'Hai completato il tuo allenamento.<br>Il corpo ha già iniziato a rispondere.',
    'done.minutes': 'Minuti',
    'done.rounds': 'Giri',
    'done.series': 'Serie',
    'done.reps': 'Ripetizioni',
    'done.backHome': '← Torna alla home',

    // Editor
    'editor.title': 'Personalizza allenamento',
    'editor.general': 'Impostazioni generali',
    'editor.circuit': 'Circuito',
    'editor.name': 'Nome',
    'editor.rounds': 'Giri',
    'editor.roundsUnit': 'giri',
    'editor.restEx': 'Pausa esercizi',
    'editor.restRounds': 'Pausa tra giri',
    'editor.addExercise': '＋ Aggiungi esercizio',
    'editor.reps': 'Rip.',
    'editor.time': 'Tempo',
    'editor.tip': 'Tip',
    'editor.video': 'Video',
    'editor.videoPh': 'URL o ID YouTube',
    'editor.resetConfirm': "Ripristinare l'allenamento predefinito? Le modifiche andranno perse.",

    // Templates
    'templates.title': 'Template allenamenti',
    'tpl.recommended': '⭐ Consigliati per te',
    'tpl.others': 'Altri allenamenti',
    'tpl.locked': '🔒 Richiedono altri attrezzi',
    'tpl.flag': 'Consigliato per te',
    'tpl.rounds': '🔁 {n} giri',
    'tpl.exercises': '🏃 {n} esercizi',
    'tpl.use': 'Usa questo template',
    'tpl.needEquip': '🔒 Attrezzo mancante',

    // Favorites
    'favorites.title': 'Preferiti',
    'favorites.saveLabel': "Salva l'allenamento attuale",
    'favorites.namePlaceholder': 'Nome allenamento',
    'favorites.saveBtn': '⭐ Salva nei preferiti',
    'fav.meta': "⏱ {min}' · 🔁 {rounds} giri · 🏃 {ex} esercizi",
    'fav.saved': '✓ Salvato',
    'fav.empty': "Nessun preferito salvato. Salva l'allenamento attuale per ritrovarlo qui.",

    // Library
    'library.title': 'Aggiungi esercizio',
    'library.tabBody': '🤸 Corpo libero',
    'library.tabWeights': '🏋️ Pesi',
    'lib.all': 'Tutti',
    'lib.allEquip': 'Tutti gli attrezzi',
    'lib.requires': 'Richiede: {equip}',
    'lib.empty': 'Nessun esercizio con questi filtri.',

    // Video
    'video.title': 'Esempio esercizio',
    'video.noVideo': 'Nessun video disponibile per questo esercizio.',
    'video.searchYoutube': 'Cerca su YouTube →',
    'video.searchQuery': 'come fare {name} esercizio',

    // Plan name (generated)
    'plan.name': 'Piano {goal} · {equip}',

    // Tour
    'tour.skip': 'Salta',
    'tour.back': 'Indietro',
    'tour.next': 'Avanti',
    'tour.done': 'Fatto',
    'tour.step': '{i} di {n}',
    'tour.welcome.title': 'Benvenuto! 👋',
    'tour.welcome.body': 'Ti mostro in pochi passi come usare l\'app. Potrai rivedere questa guida quando vuoi dal pulsante “?”.',
    'tour.profile.title': 'Il tuo profilo',
    'tour.profile.body': 'Qui vedi gli attrezzi e gli obiettivi scelti. Tocca “Modifica” per cambiarli in qualsiasi momento.',
    'tour.generate.title': 'Genera il piano',
    'tour.generate.body': 'Con un tocco crei un allenamento su misura per i tuoi attrezzi e obiettivi. Premilo ogni volta che vuoi una nuova proposta.',
    'tour.stages.title': 'Cosa farai',
    'tour.stages.body': 'L\'allenamento ha tre fasi: riscaldamento, circuito e defaticamento. Tocca ogni fase per vedere gli esercizi. Ogni giro del circuito è una serie.',
    'tour.actions.title': 'Template e personalizzazione',
    'tour.actions.body': 'Scegli allenamenti pronti (Template), salva i tuoi preferiti o personalizza ogni esercizio, serie e tempo.',
    'tour.start.title': 'Inizia!',
    'tour.start.body': 'Premi qui per partire: un timer guidato ti accompagna esercizio per esercizio, con segnali audio e video di esempio.',
    'tour.help.title': 'Serve aiuto?',
    'tour.help.body': 'Rivedi questa guida quando vuoi da questo pulsante. Buon allenamento! 💪',
  },

  en: {
    'common.edit': 'Edit',
    'common.reset': 'Reset',
    'common.cancel': 'Cancel',
    'common.use': 'Use',
    'common.add': 'Add',
    'common.delete': 'Delete',
    'common.workout': 'Workout',
    'common.back': 'Back',

    'lang.switch': 'Change language',
    'help.open': 'How it works',

    // Onboarding
    'onb.title': "Let's build<br>your workout",
    'onb.subtitle': 'We tailor the exercises to what you have and your goals.',
    'onb.equipQ': 'What do you have?',
    'onb.equipHelp': 'Bodyweight is always included. Select the equipment you own.',
    'onb.levelQ': 'What is your level?',
    'onb.levelHelp': 'We adapt exercises, reps and intensity to your experience.',
    'onb.goalQ': 'What is your goal?',
    'onb.goalHelp': 'You can pick more than one. Opposite goals exclude each other.',
    'onb.start': 'Start training',
    'onb.chooseGoal': 'Choose at least one goal',

    // Home
    'home.label': 'Your workout',
    'home.title': 'Ready to<br>train?',
    'home.profileTitle': 'Your profile',
    'home.generate': '✨ Generate recommended plan',
    'home.noProfile': 'Profile not set',
    'home.sub': '{rounds} rounds · {n} exercises · at home',
    'home.stat.duration': 'Duration',
    'home.stat.rounds': 'Rounds',
    'home.stat.exercises': 'Exercises',
    'home.templates': 'Templates',
    'home.favorites': 'Favorites',
    'home.customize': 'Customize',
    'home.start': 'Start workout →',

    // Phases (home card)
    'phase.warmup': 'Warm-up',
    'phase.circuit': 'Main circuit',
    'phase.cooldown': 'Cool-down',
    'phase.warmupSub': '{n} exercises · ~{m} min',
    'phase.circuitSub': '{rounds} rounds × {n} exercises',
    'phase.cooldownSub': '{n} exercises · stretching',
    'phase.circuitNote': 'Each round is one set · {rounds} rounds total',

    // Units / details
    'unit.reps': '{n} reps',
    'unit.secs': '{n}s',
    'unit.sec': 'sec',
    'detail.reps': '{n} reps',
    'detail.secs': '{n} sec',

    // Workout engine
    'wk.warmup': 'WARM-UP',
    'wk.cooldown': 'COOL-DOWN',
    'wk.restPhase': 'REST',
    'wk.round': 'ROUND {r} / {n}',
    'wk.rest': 'Rest',
    'wk.restRounds': 'Rest between rounds',
    'wk.tip.breatheSlow': 'Breathe slowly.',
    'wk.tip.water': 'Take a sip of water.',
    'wk.tip.shake': 'Shake out arms and legs, breathe deep.',
    'wk.tip.breathe': 'Breathe deep.',
    'wk.minsec': 'MIN:SEC',
    'wk.sec': 'SEC',
    'wk.watchExample': '▶ Watch example',
    'wk.pause': 'Pause',
    'wk.resume': 'Resume',
    'wk.next': 'Next →',

    // Stop modal
    'stop.title': 'Stop workout?',
    'stop.subtitle': 'The progress of this session will be lost.',
    'stop.confirm': 'Stop',

    // Done
    'done.title': 'Great job!',
    'done.subtitle': 'You completed your workout.<br>Your body has already started to respond.',
    'done.minutes': 'Minutes',
    'done.rounds': 'Rounds',
    'done.series': 'Sets',
    'done.reps': 'Reps',
    'done.backHome': '← Back to home',

    // Editor
    'editor.title': 'Customize workout',
    'editor.general': 'General settings',
    'editor.circuit': 'Circuit',
    'editor.name': 'Name',
    'editor.rounds': 'Rounds',
    'editor.roundsUnit': 'rounds',
    'editor.restEx': 'Rest between exercises',
    'editor.restRounds': 'Rest between rounds',
    'editor.addExercise': '＋ Add exercise',
    'editor.reps': 'Reps',
    'editor.time': 'Time',
    'editor.tip': 'Tip',
    'editor.video': 'Video',
    'editor.videoPh': 'YouTube URL or ID',
    'editor.resetConfirm': 'Reset to the default workout? Your changes will be lost.',

    // Templates
    'templates.title': 'Workout templates',
    'tpl.recommended': '⭐ Recommended for you',
    'tpl.others': 'Other workouts',
    'tpl.locked': '🔒 Need other equipment',
    'tpl.flag': 'Recommended for you',
    'tpl.rounds': '🔁 {n} rounds',
    'tpl.exercises': '🏃 {n} exercises',
    'tpl.use': 'Use this template',
    'tpl.needEquip': '🔒 Equipment needed',

    // Favorites
    'favorites.title': 'Favorites',
    'favorites.saveLabel': 'Save the current workout',
    'favorites.namePlaceholder': 'Workout name',
    'favorites.saveBtn': '⭐ Save to favorites',
    'fav.meta': "⏱ {min}' · 🔁 {rounds} rounds · 🏃 {ex} exercises",
    'fav.saved': '✓ Saved',
    'fav.empty': 'No favorites saved yet. Save the current workout to find it here.',

    // Library
    'library.title': 'Add exercise',
    'library.tabBody': '🤸 Bodyweight',
    'library.tabWeights': '🏋️ Weights',
    'lib.all': 'All',
    'lib.allEquip': 'All equipment',
    'lib.requires': 'Requires: {equip}',
    'lib.empty': 'No exercise matches these filters.',

    // Video
    'video.title': 'Exercise example',
    'video.noVideo': 'No video available for this exercise.',
    'video.searchYoutube': 'Search on YouTube →',
    'video.searchQuery': 'how to do {name} exercise',

    // Plan name (generated)
    'plan.name': '{goal} plan · {equip}',

    // Tour
    'tour.skip': 'Skip',
    'tour.back': 'Back',
    'tour.next': 'Next',
    'tour.done': 'Done',
    'tour.step': '{i} of {n}',
    'tour.welcome.title': 'Welcome! 👋',
    'tour.welcome.body': 'Let me show you how to use the app in a few steps. You can replay this guide anytime from the “?” button.',
    'tour.profile.title': 'Your profile',
    'tour.profile.body': 'Here you see your chosen equipment and goals. Tap “Edit” to change them anytime.',
    'tour.generate.title': 'Generate the plan',
    'tour.generate.body': 'One tap builds a workout tailored to your equipment and goals. Press it whenever you want a new suggestion.',
    'tour.stages.title': 'What you will do',
    'tour.stages.body': 'The workout has three stages: warm-up, circuit and cool-down. Tap each stage to see the exercises. Each circuit round is one set.',
    'tour.actions.title': 'Templates and customization',
    'tour.actions.body': 'Pick ready-made workouts (Templates), save your favorites, or customize every exercise, set and time.',
    'tour.start.title': 'Get started!',
    'tour.start.body': 'Press here to begin: a guided timer walks you through each exercise, with audio cues and example videos.',
    'tour.help.title': 'Need help?',
    'tour.help.body': 'Replay this guide anytime from this button. Enjoy your workout! 💪',
  },
};
