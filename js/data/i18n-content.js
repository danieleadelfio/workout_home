// ════════════════════════════════════════════════════════════════════════════
// I18N CONTENT — English translations for exercise + template CONTENT and the
// language-aware display helpers used across the UI. The Italian text remains
// the source data on the exercise/template objects; the *_EN maps below provide
// the English equivalents keyed by slug / template id.
// ════════════════════════════════════════════════════════════════════════════

import { getLang, t } from '../i18n.js';
import { EXERCISE_BY_SLUG } from './exercises.js';
import { TEMPLATE_BY_ID } from './templates.js';
import { goalLabel, equipmentLabel } from './taxonomy.js';

const isEn = () => getLang() === 'en';

// ─── Exercises (slug → { name, tip }) ────────────────────────────────────────
export const EXERCISE_EN = {
  'squat': { name: 'Squat', tip: 'Heels down, back straight. Lower until thighs are parallel to the floor.' },
  'squat-sumo': { name: 'Sumo squat', tip: 'Feet wide, toes at 45°. Knees track in the direction of your toes.' },
  'lunges': { name: 'Alternating lunges', tip: 'Long step. The back knee grazes the floor without touching.' },
  'lateral-lunges': { name: 'Lateral lunges', tip: 'Wide side step. The opposite leg stays straight with the heel down.' },
  'step-up': { name: 'Chair step-up', tip: 'Use a sturdy chair. Push through the heel of the leading foot.' },
  'glute-bridge': { name: 'Glute bridge', tip: 'Feet close to your glutes. Push through the heels and squeeze the glutes at the top.' },
  'single-leg-glute-bridge': { name: 'Single-leg glute bridge', tip: 'Lift one leg. Keep your hips stable and level.' },
  'wall-sit': { name: 'Wall sit', tip: 'Back against the wall, thighs parallel to the floor. Hold without sliding.' },
  'calf-raise': { name: 'Calf raise', tip: 'Rise slowly onto your toes and lower under control. You can do it on a step.' },
  'plank': { name: 'Plank', tip: "Glutes tight, core engaged. Don't let your hips drop or pike up." },
  'side-plank': { name: 'Side plank', tip: 'Body in a straight line head to feet. Do 25 seconds per side.' },
  'crunch': { name: 'Crunch', tip: "Lift only your shoulder blades off the floor. Don't pull your neck with your hands." },
  'reverse-crunch': { name: 'Reverse crunch', tip: 'Legs at 90°. Bring your knees toward your chest with control.' },
  'bicycle-crunch': { name: 'Bicycle crunch', tip: 'Elbow to the opposite knee, pedal slowly with control.' },
  'mountain-climber': { name: 'Mountain climber', tip: 'Plank position. Drive your knees to your chest, alternating quickly.' },
  'hollow-body': { name: 'Hollow body', tip: 'Lower back flat on the floor, limbs extended. Lift legs and shoulders slightly.' },
  'superman': { name: 'Superman', tip: 'Lying face down, lift arms and legs together. Hold for 1 sec.' },
  'leg-raise': { name: 'Leg raise', tip: 'Legs straight, lift to 90° and lower without touching the floor.' },
  'pushup': { name: 'Push-up', tip: 'Body rigid like a board. On your knees is a valid alternative.' },
  'diamond-pushup': { name: 'Diamond push-up', tip: 'Hands close under the chest in a diamond. Hits the triceps hard.' },
  'incline-pushup': { name: 'Incline push-up', tip: 'Hands on a chair or table. Easier than the classic push-up.' },
  'pike-pushup': { name: 'Pike push-up', tip: 'Hips high in an inverted V. Push with your shoulders, head toward the floor.' },
  'dips': { name: 'Chair dips', tip: 'Hands on the edge of the chair. Lower slowly, push up under control.' },
  'burpee': { name: 'Burpee', tip: 'Stand, squat, plank, optional push-up, jump. Keep a steady rhythm.' },
  'jumping-jack': { name: 'Jumping jack', tip: 'Soft landings on the balls of your feet. If your knees complain, march in place.' },
  'high-knees': { name: 'High knees', tip: 'Bring your knees up to hip height. Keep your core engaged throughout.' },
  'squat-jump': { name: 'Squat jump', tip: 'Explode up from the squat, land softly by bending your knees.' },
  'cat-cow': { name: 'Cat-Cow', tip: 'On all fours, slowly alternate arching and rounding your back.' },
  'quad-stretch': { name: 'Quad stretch', tip: '30 sec per leg. Pull your foot toward your glute. Hold a wall for balance.' },
  'hamstring-stretch': { name: 'Hamstring stretch', tip: 'Leg straight in front, hinge forward with a flat back. Feel the stretch behind.' },
  'chest-stretch': { name: 'Chest stretch', tip: 'Open your arms, hold a doorway. Feel the stretch in front of your shoulders.' },
  'shoulder-stretch': { name: 'Shoulder stretch', tip: 'Bring one arm across your chest, hold it with the other. Shoulders down.' },
  'deep-breathing': { name: 'Deep breathing', tip: 'Inhale 4 sec, exhale 6 sec. Let your body relax completely.' },
  'world-greatest-stretch': { name: "World's greatest stretch", tip: 'Lunge + torso rotation. Mobilizes hips and spine in one move.' },
  'db-goblet-squat': { name: 'Goblet squat', tip: 'Dumbbell at your chest. Back straight, lower between your legs keeping elbows in.' },
  'db-lunges': { name: 'Dumbbell lunges', tip: 'One dumbbell per hand along your sides. Torso upright, controlled step.' },
  'db-romanian-deadlift': { name: 'Dumbbell Romanian deadlift', tip: 'Dumbbells in front of your thighs. Push your hips back, neutral spine.' },
  'db-bench-press': { name: 'Dumbbell bench press', tip: 'Shoulder blades retracted. Lower the dumbbells to chest level, press up.' },
  'db-floor-press': { name: 'Dumbbell floor press', tip: 'No bench: on the floor. Elbows stop at the floor, then press up.' },
  'db-shoulder-press': { name: 'Dumbbell shoulder press', tip: 'Dumbbells at shoulder height, press overhead without arching your back.' },
  'db-lateral-raise': { name: 'Lateral raises', tip: 'Arms slightly bent, lift to shoulder height. Control the descent.' },
  'db-row': { name: 'Single-arm dumbbell row', tip: 'Torso hinged, pull the dumbbell to your hip squeezing the shoulder blade.' },
  'db-bicep-curl': { name: 'Bicep curl', tip: 'Elbows fixed at your sides. Lift without swinging your torso.' },
  'db-tricep-extension': { name: 'Tricep extension', tip: 'Dumbbell overhead, lower behind your neck with elbows fixed.' },
  'bb-back-squat': { name: 'Back squat', tip: 'Barbell on your traps. Lower under control, push through your heels.' },
  'bb-deadlift': { name: 'Deadlift', tip: 'Neutral back, bar close to your legs. Push the floor away with your feet.' },
  'bb-bench-press': { name: 'Bench press', tip: 'Shoulder blades retracted, feet on the floor. Lower to chest, press explosively.' },
  'bb-row': { name: 'Barbell row', tip: 'Torso hinged at 45°, pull to your abdomen squeezing your shoulder blades.' },
  'bb-overhead-press': { name: 'Overhead press', tip: 'Bar at collarbone height, press overhead, core braced.' },
  'bb-hip-thrust': { name: 'Barbell hip thrust', tip: 'Back on the bench, bar over your hips. Drive up squeezing your glutes.' },
  'kb-swing': { name: 'Kettlebell swing', tip: 'Explosive hip movement, not arms. The kettlebell rises to chest height.' },
  'kb-goblet-squat': { name: 'Kettlebell goblet squat', tip: 'Kettlebell at your chest, elbows in. Squat deep keeping your torso upright.' },
  'kb-clean-press': { name: 'Kettlebell clean & press', tip: 'Bring the kettlebell to the rack, then press overhead. Work one side at a time.' },
  'kb-deadlift': { name: 'Kettlebell deadlift', tip: 'Kettlebell between your feet, push your hips back, back straight.' },
  'band-squat': { name: 'Band squat', tip: 'Band under your feet and over your shoulders. Keep constant tension on the way up.' },
  'band-row': { name: 'Band row', tip: 'Band anchored in front. Pull to your abdomen squeezing your shoulder blades.' },
  'band-pull-apart': { name: 'Band pull apart', tip: 'Arms straight in front, open the band to your chest squeezing the shoulder blades.' },
  'band-glute-kickback': { name: 'Band glute kickback', tip: 'Band at your ankles. Push one leg back keeping your hips still.' },
  'band-lateral-walk': { name: 'Band lateral walk', tip: 'Band above your knees, mini-squat. Side steps keeping tension.' },
  'pullup': { name: 'Pull-ups', tip: 'Grip slightly wider than shoulders. Pull your chin over the bar, lower under control.' },
  'chinup': { name: 'Chin-ups', tip: 'Palms facing you. Involves the biceps more than classic pull-ups.' },
  'hanging-leg-raise': { name: 'Hanging leg raise', tip: 'Hanging from the bar, lift straight legs to 90° without swinging.' },
  'dead-hang': { name: 'Dead hang', tip: 'Hanging with straight arms. Decompresses the spine and strengthens your grip.' },
};

// ─── Templates (id → { name, desc }) ─────────────────────────────────────────
export const TEMPLATE_EN = {
  'bw-fullbody-fatloss': { name: 'Full Body Fat Burn', desc: 'High-intensity bodyweight circuit to maximise calorie burn.' },
  'bw-fullbody-strength': { name: 'Full Body Bodyweight Strength', desc: 'A few key fundamentals, controlled sets to build strength everywhere.' },
  'bw-core': { name: 'Core of Steel', desc: 'Targeted training for abs and trunk stability.' },
  'bw-glutes': { name: 'Top Glutes (bodyweight)', desc: 'Activate and tone your glutes with no equipment.' },
  'bw-lower': { name: 'Bodyweight Legs', desc: 'Leg volume using only your bodyweight.' },
  'bw-mobility': { name: 'Mobility & Recovery', desc: 'A gentle session of joint mobility and stretching. Perfect on rest days.' },
  'db-fullbody-hypertrophy': { name: 'Full Body Mass · Dumbbells', desc: 'Complete hypertrophy stimulus with dumbbells only.' },
  'db-upper-hypertrophy': { name: 'Upper Body Mass · Dumbbells', desc: 'Chest, back, shoulders and arms with dumbbells.' },
  'db-lower-tone': { name: 'Legs & Glutes · Dumbbells', desc: 'Tone your legs and glutes with added load.' },
  'bb-strength-fullbody': { name: 'Strength 5x5 · Barbell', desc: 'The barbell fundamentals to build pure strength.' },
  'bb-glutes-power': { name: 'Powerful Glutes · Barbell', desc: 'Hip thrusts and deadlifts for strong, full glutes.' },
  'kb-fatloss-conditioning': { name: 'Kettlebell Fat Burn', desc: 'Swings and dynamic moves for intense metabolic conditioning.' },
  'band-glutes': { name: 'Glutes with Bands', desc: 'Activate and tone your glutes with elastic resistance.' },
  'band-upper-tone': { name: 'Toned Upper with Bands', desc: 'Defined back and shoulders with bands only.' },
  'bar-upper-strength': { name: 'Pull-up Bar Pulling', desc: 'Pull-ups and bar work for a strong, wide back.' },
};

// ─── Display helpers ─────────────────────────────────────────────────────────

// Library exercise object → localized name / tip.
export function exName(ex) { return (isEn() && EXERCISE_EN[ex.slug]?.name) || ex.name; }
export function exTip(ex)  { return (isEn() && EXERCISE_EN[ex.slug]?.tip)  || ex.tip; }

// Config step → localized name. Honours user customisations: a stored name that
// differs from the library's Italian source means the user edited it → keep it.
export function stepName(step) {
  const lib = step.slug && EXERCISE_BY_SLUG[step.slug];
  if (isEn() && lib && step.name === lib.name && EXERCISE_EN[step.slug]) return EXERCISE_EN[step.slug].name;
  return step.name;
}
export function stepTip(step) {
  const lib = step.slug && EXERCISE_BY_SLUG[step.slug];
  if (isEn() && lib && step.tip === lib.tip && EXERCISE_EN[step.slug]) return EXERCISE_EN[step.slug].tip;
  return step.tip;
}

// Template object (or id) → localized name / description.
export function tplName(tpl) {
  const o = typeof tpl === 'string' ? TEMPLATE_BY_ID[tpl] : tpl;
  if (!o) return typeof tpl === 'string' ? tpl : '';
  return (isEn() && TEMPLATE_EN[o.id]?.name) || o.name;
}
export function tplDesc(tpl) {
  const o = typeof tpl === 'string' ? TEMPLATE_BY_ID[tpl] : tpl;
  if (!o) return '';
  return (isEn() && TEMPLATE_EN[o.id]?.desc) || o.desc;
}

// Build a generated-plan name in the current language.
export function planName(goal, equipment) {
  const equip = (equipment && equipment.length)
    ? equipment.map(equipmentLabel).join(' & ')
    : equipmentLabel('none');
  return t('plan.name', { goal: goalLabel(goal), equip });
}

// Resolve a config's display name in the current language.
//   - template-based config  → localized template name
//   - generated config       → rebuilt plan name (nameMeta)
//   - custom / renamed config → stored name verbatim
export function localizedConfigName(cfg) {
  if (!cfg) return '';
  if (cfg.templateId && TEMPLATE_BY_ID[cfg.templateId]) return tplName(cfg.templateId);
  if (cfg.nameMeta) return planName(cfg.nameMeta.goal, cfg.nameMeta.equipment);
  return cfg.name || '';
}
