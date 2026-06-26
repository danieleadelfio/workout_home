<h1 align="center">🏋️ Personal Home Workout</h1>

<p align="center">
  A fast, private, no-account web app that builds a personalized home workout
  from the equipment you own and the goals you choose — then coaches you through
  it with a timer, audio cues and video demos.
</p>

<p align="center">
  <strong>👉 <a href="https://self-home-workout.netlify.app/">Open the live app · Apri l'app</a></strong>
</p>

<p align="center">
  <strong>Choose your language · Scegli la lingua</strong><br>
  <a href="#-english">🇬🇧 English</a> &nbsp;·&nbsp; <a href="#-italiano">🇮🇹 Italiano</a>
</p>

---

## 🇬🇧 English

### What is it?

**Personal Home Workout** is a lightweight web app that turns *"I have a pair of
dumbbells and 20 minutes"* into a complete, structured training session — warm-up,
main circuit and cool-down — tailored to your equipment and your fitness goal.

It runs entirely in the browser. **No account, no backend, no tracking.** Your
profile and saved workouts live in your browser's local storage, so everything
stays on your device.

> 🔗 **Try it now:** [self-home-workout.netlify.app](https://self-home-workout.netlify.app/)

### ✨ Features

- **Guided onboarding** — pick the equipment you actually own (bodyweight,
  dumbbells, barbell, kettlebell, resistance bands, bench, pull-up bar) and your
  goal (fat loss, strength, muscle, toning, endurance, mobility).
- **Smart plan generator** — the *"Generate recommended plan"* button builds a
  circuit from curated, per-equipment exercise sets, choosing weighted movements
  when you own the gear and matching the rounds/rest to your goal.
- **Template gallery** — ready-made routines, automatically sorted and flagged as
  *"Recommended for you"* based on your profile.
- **Exercise library** — browse bodyweight and weighted exercises, filter by goal
  and equipment, and preview each movement with an embedded **YouTube demo**.
- **Full workout editor** — reorder exercises with drag & drop, tweak sets, reps
  and durations, swap movements, and attach your own demo video to any exercise.
- **Favorites** — save any configured workout and reload it with one tap.
- **Coached sessions** — animated countdown ring, per-set progress dots, audio
  countdown beeps, haptic vibration, pause / skip / stop, and an end-of-workout
  summary with your stats.
- **Responsive** — designed mobile-first and works great on phones, tablets and
  desktop. Add it to your phone's home screen for an app-like, full-screen feel.

### 🎯 Goal

To remove every excuse between you and a workout. No subscriptions, no sign-ups,
no gym required — just open the page, tell it what you've got, and start moving.

### 🧱 How it works

1. **Set your profile** — equipment + goals during onboarding.
2. **Get a plan** — the app generates a recommended circuit, or pick a template.
3. **Customize (optional)** — edit exercises, sets, reps, rest and videos.
4. **Train** — follow the guided timer with audio and visual cues.
5. **Save** — keep the workouts you love in your favorites.

### 🛠️ Tech

- **Vanilla JavaScript (ES modules)** — no framework, no build step.
- **Web Audio API** for countdown beeps, **Vibration API** for haptics.
- **YouTube (privacy-enhanced `youtube-nocookie`) embeds** for exercise demos.
- **`localStorage`** for the profile, current plan and favorites.
- Pure static files — deployable anywhere (e.g. Netlify, GitHub Pages).

### 🔒 Privacy

There is no server and no analytics. The app never sends your data anywhere; your
profile and saved workouts never leave your browser.

### 🚀 Run it locally

Because it uses ES modules, open it through a local web server (not `file://`):

```bash
# from the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```

### ☁️ Deploy

It's a static site. On Netlify, connect the repo and set the publish directory to
the project root (`.`) — no build command needed. Any static host works the same way.

---

## 🇮🇹 Italiano

### Cos'è?

**Personal Home Workout** è una web app leggera che trasforma *"ho un paio di
manubri e 20 minuti"* in un allenamento completo e strutturato — riscaldamento,
circuito principale e defaticamento — costruito su misura per i tuoi attrezzi e il
tuo obiettivo.

Funziona interamente nel browser. **Nessun account, nessun backend, nessun
tracciamento.** Il tuo profilo e gli allenamenti salvati restano nella memoria
locale del browser, quindi tutto rimane sul tuo dispositivo.

> 🔗 **Provala ora:** [self-home-workout.netlify.app](https://self-home-workout.netlify.app/)

### ✨ Funzionalità

- **Onboarding guidato** — scegli gli attrezzi che possiedi davvero (corpo libero,
  manubri, bilanciere, kettlebell, elastici, panca, sbarra) e il tuo obiettivo
  (dimagrimento, forza, massa, tonificazione, resistenza, mobilità).
- **Generatore di piani intelligente** — il pulsante *"Genera piano consigliato"*
  crea un circuito a partire da set di esercizi curati per ogni attrezzo,
  preferendo i movimenti con i pesi quando li hai e adattando giri e recupero al
  tuo obiettivo.
- **Galleria di template** — routine pronte all'uso, ordinate automaticamente e
  contrassegnate come *"Consigliati per te"* in base al tuo profilo.
- **Libreria esercizi** — sfoglia esercizi a corpo libero e con i pesi, filtra per
  obiettivo e attrezzo e guarda l'anteprima di ogni movimento con un **video
  YouTube** integrato.
- **Editor completo dell'allenamento** — riordina gli esercizi con il drag & drop,
  modifica serie, ripetizioni e durate, sostituisci i movimenti e aggiungi il tuo
  video dimostrativo a qualsiasi esercizio.
- **Preferiti** — salva qualsiasi allenamento configurato e ricaricalo con un tocco.
- **Sessioni guidate** — anello di countdown animato, indicatori di avanzamento per
  ogni serie, beep audio del conto alla rovescia, vibrazione, pausa / avanti /
  stop e un riepilogo finale con le tue statistiche.
- **Responsive** — progettata mobile-first, funziona benissimo su smartphone,
  tablet e desktop. Aggiungila alla home del telefono per un'esperienza a schermo
  intero come una vera app.

### 🎯 Obiettivo

Eliminare ogni scusa tra te e l'allenamento. Nessun abbonamento, nessuna
registrazione, nessuna palestra: apri la pagina, indica cosa hai a disposizione e
inizia a muoverti.

### 🧱 Come funziona

1. **Imposta il profilo** — attrezzi + obiettivi durante l'onboarding.
2. **Ottieni un piano** — l'app genera un circuito consigliato, oppure scegli un
   template.
3. **Personalizza (facoltativo)** — modifica esercizi, serie, ripetizioni, recupero
   e video.
4. **Allenati** — segui il timer guidato con segnali audio e visivi.
5. **Salva** — conserva nei preferiti gli allenamenti che ami.

### 🛠️ Tecnologia

- **JavaScript puro (moduli ES)** — nessun framework, nessuno step di build.
- **Web Audio API** per i beep del countdown, **Vibration API** per la vibrazione.
- **Embed YouTube** (versione privacy `youtube-nocookie`) per i video degli esercizi.
- **`localStorage`** per profilo, piano corrente e preferiti.
- Solo file statici — pubblicabile ovunque (es. Netlify, GitHub Pages).

### 🔒 Privacy

Non c'è alcun server e nessun sistema di analisi. L'app non invia i tuoi dati da
nessuna parte: il profilo e gli allenamenti salvati non escono mai dal tuo browser.

### 🚀 Avvio in locale

Poiché usa i moduli ES, aprila tramite un server web locale (non `file://`):

```bash
# dalla cartella del progetto
python3 -m http.server 8000
# poi apri http://localhost:8000
```

### ☁️ Pubblicazione

È un sito statico. Su Netlify collega il repository e imposta la directory di
pubblicazione sulla radice del progetto (`.`) — non serve alcun comando di build.
Qualsiasi hosting statico funziona allo stesso modo.

---

<p align="center"><sub>Made for moving more, with fewer excuses. · Fatto per muoversi di più, con meno scuse.</sub></p>
