import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const pack = JSON.parse(readFileSync(join(root, 'assets/data/content-pack.json'), 'utf8')) as {
  exercises: { id: string; view: string; props: string[] }[];
};
const catalog = readFileSync(join(root, 'DOC/CONTENT_MAP.md'), 'utf8');
const exerciseTable = catalog.slice(catalog.indexOf('## 2.'), catalog.indexOf('## 3.'));
const names = new Map<number, string>();
for (const match of exerciseTable.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|/gm)) {
  names.set(Number(match[1]), match[2]!.trim());
}

// One unmistakable pose for each exercise, in catalog order. Keep limb position explicit.
const poseCues = [
  'Walking in place with one knee lifted to hip height and the opposite arm forward.',
  'Standing tall with arms extended sideways at shoulder height, showing a circular arm motion through one clear position.',
  'Standing upright with both shoulders raised toward the ears, arms relaxed by the sides.',
  'Standing with hands on hips and pelvis shifted to one side of a controlled hip circle.',
  'Standing beside a wall for balance, one straight leg swung forward to comfortable height.',
  'Facing forward beside a wall for balance, one straight leg lifted out to the side.',
  'Standing with feet hip-width apart, elbows bent, torso rotated while hips face forward.',
  'Standing upright with chin gently turned and tilted to one side, shoulders relaxed.',
  'On hands and knees with a gently arched upper back, hands below shoulders and knees below hips.',
  'Side view halfway through an inchworm: feet planted, hips high, hands walked forward toward plank.',
  'Lying on the back with knees bent, upper shoulders lifted a few inches, hands lightly beside the head.',
  'Lying on the back with knees bent and hips curled just off the floor toward the chest.',
  'Lying on the back with one knee toward the opposite elbow, other leg extended off the floor.',
  'Lying on the back with bent knees and torso lifted halfway toward sitting, arms reaching ahead.',
  'Lying on the back with both straight legs raised about 45 degrees, lower back grounded.',
  'Lying on the back with straight legs low and separated vertically, one leg slightly higher.',
  'Viewed from above: lying on the back with straight legs crossed in a scissor position.',
  'Viewed from above: lying on the back, knees bent, torso curled slightly sideways with one hand reaching to the same-side heel.',
  'Seated with knees bent, heels lightly grounded and torso reclined, hands together beside one hip.',
  'Forearm plank in side view: elbows beneath shoulders, legs straight, body aligned from head to heels.',
  'Side plank: one forearm under the shoulder, hips lifted, legs stacked and straight, top arm raised.',
  'High plank with one palm lifting to touch the opposite shoulder, hips level.',
  'Lying on the back with opposite arm and leg extended low while the other knee and arm remain lifted.',
  'Hollow hold on the back: shoulders and straight legs lifted low, arms extended overhead, spine controlled.',
  'High plank with one knee driving toward the chest, other leg straight behind.',
  'Lying on the back in a V shape: straight legs and torso raised, arms reaching toward the feet.',
  'Lying on the back with both legs pointing upward and shoulders curled toward the toes.',
  'Standing with legs apart, torso folded diagonally so one hand reaches toward the opposite foot.',
  'Standing on one leg with the other knee lifted toward the same-side elbow, torso bending sideways.',
  'Side view facing a wall, palms on wall at chest height, elbows bent and body straight.',
  'Side view with palms on a sturdy chair seat, body in an incline plank and elbows bent.',
  'Side view with knees on floor, palms beneath shoulders, straight line from knees through shoulders, elbows bent.',
  'Side view at mid push-up: palms below shoulders, elbows bent, body rigid from head to heels.',
  'Side view at mid push-up with palms noticeably wider than shoulders and body rigid.',
  'High plank with thumbs and index fingers forming a diamond beneath the chest, elbows bent.',
  'Side view with feet on a sturdy chair and palms on floor, body straight in a decline push-up.',
  'Front view in a low archer push-up: one elbow bent under the shoulder, other arm extended sideways.',
  'Side view holding the bottom of a push-up, elbows bent about 90 degrees, body straight.',
  'Side view halfway from forearm plank to high plank: one forearm down, opposite palm planted.',
  'Standing facing forward with palms pressed firmly together at chest height and elbows out.',
  'High plank at the top of a push-up, one hand lifted to touch the opposite shoulder.',
  'Inverted V body shape, hips high and elbows bent so the head lowers between the hands.',
  'Back against a wall, elbows bent in a goalpost shape and arms sliding upward against the wall.',
  'Side view with hands gripping a sturdy chair edge behind the hips, knees bent, elbows bent in a dip.',
  'Side view in a forearm-supported plank with elbows bent close to the body, showing triceps extension position.',
  'Standing tall holding two small water bottles, straight arms raised forward to shoulder height.',
  'Standing tall holding two small water bottles, straight arms raised sideways to shoulder height.',
  'Standing facing forward with elbows bent and hands pressing upward above the head in an isometric hold.',
  'Side view in transition from forearm plank to high plank, one elbow down and one palm planted.',
  'On hands and knees with knees hovering just above the floor, flat back and toes planted.',
  'Side view of a controlled handstand against a wall, palms on floor, heels lightly touching wall.',
  'Standing in a boxing stance with one fist extended in a straight punch, other fist guarding face.',
  'Standing with arms straight out at shoulder height, palms down, showing a small pulse position.',
  'Lying face down with arms stretched forward and both arms, chest and legs lifted slightly.',
  'Lying face down with arms extended ahead and upper chest raised a little off the floor.',
  'Viewed from above: lying face down, both straight arms swept out sideways like a snow angel.',
  'Viewed from above: lying face down with both arms raised overhead in a clear Y shape.',
  'Viewed from above: lying face down with straight arms out to the sides in a T shape.',
  'Viewed from above: lying face down with elbows bent and arms forming a W shape.',
  'Lying face down with one arm and opposite leg lifted, the other arm and leg low.',
  'On hands and knees with one arm reaching forward and opposite leg reaching back, hips level.',
  'Lying on the back with elbows driven into the floor beside the ribs, chest lifted slightly in an isometric row.',
  'Lying face down with hands beside the head and upper chest raised, legs resting on floor.',
  'Side view in a bodyweight squat: hips back and down, knees tracking over toes, heels flat.',
  'Front view in a wide sumo squat: toes turned slightly out, knees apart, hips lowered.',
  'Side view holding a shallow squat pulse, hips back, heels down and knees bent.',
  'Side view with back flat against a wall and knees bent about 90 degrees in a wall sit.',
  'Side view in a forward lunge: front knee bent over foot, back knee lowered near floor.',
  'Side view in a reverse lunge: front knee bent, rear leg stepped backward with knee near floor.',
  'Front view in a lateral lunge: one knee bent over its foot, other leg straight to the side.',
  'Front view in a curtsy lunge: one leg crossed diagonally behind the other, both knees bent.',
  'Side view in a split squat: feet staggered and stationary, both knees bent, torso upright.',
  'Lying on the back with knees bent and feet flat, hips lifted into a straight shoulder-to-knee line.',
  'Lying on the back with one foot planted, other leg extended, hips lifted in a single-leg bridge.',
  'Lying on the back with knees bent, feet flat and hips raised high in a floor hip thrust.',
  'On hands and knees with one bent leg kicking upward behind, knee about 90 degrees.',
  'Front view on hands and knees with one bent knee lifted sideways like a fire hydrant.',
  'Side view standing tall on both toes with heels raised, knees nearly straight.',
  'Side view balancing lightly beside a wall, one foot off floor, support heel raised.',
  'Side view with soft knees, hips hinged back, flat spine and torso tilted forward.',
  'Side view stepping onto a sturdy low chair or step, lead foot planted and body rising.',
  'Side view in the low phase of a half burpee: hands on floor, legs stepped back to plank, no jump.',
  'Side view in a burpee transition: hands on floor, legs extended back, ready to jump forward.',
  'Side view with hands on floor, feet jumped back into a straight plank from a squat.',
  'Side view on hands and toes with knees hovering, one hand and opposite foot stepped forward.',
  'Side view in a crab position: hands and feet on floor, belly facing upward and hips lifted.',
  'Side view rising from a squat with both arms reaching straight overhead.',
  'Side view halfway from floor to stand: one knee down, other foot planted, torso upright.',
  'Front view in high plank with feet spread wide apart for a plank jack.',
  'Side view of a walkout: feet grounded, hands walked out to high plank, hips lowering.',
  'Side view in a frog jump takeoff: low wide squat, hands reaching forward, heels beginning to lift.',
  'Front view mid jumping jack: legs wide, arms raised above the head.',
  'Front view in a step jack: one foot stepped sideways and both arms lifted overhead.',
  'Side view running in place with one knee driven high and opposite arm forward.',
  'Side view marching in place with one knee raised high, one foot grounded.',
  'Side view jogging in place with one heel kicked up toward the glutes.',
  'Front view with one heel extended forward to tap the floor, arms moving naturally.',
  'Front view in a skater hop landing: one knee bent, other leg crossed behind, torso leaning slightly.',
  'Front view stepping sideways with one foot out, knees soft and arms balancing.',
  'Side view at the takeoff of a squat jump: knees bent, arms back, heels just lifting.',
  'Front view in an athletic low stance, feet staggered as if running quickly in place.',
  'Front view in a boxing stance with one fist punching forward and the other guarding.',
  'Front view with one knee lifted diagonally to meet the opposite elbow, torso rotating.',
  'Side view kneeling with hips toward heels, torso folded forward and arms extended along floor.',
  'Side view lying face down with palms below shoulders, arms partly straight and chest lifted into cobra.',
  'Side view in downward dog: hands and feet grounded, hips high, straight back forming inverted V.',
  'Side view seated with both legs straight ahead, torso hinging forward and arms reaching feet.',
  'Side view standing with legs straight but soft knees, torso folded forward from hips.',
  'Side view lying on back with one leg raised straight and gently held behind the thigh.',
  'Side view standing beside a wall for balance, one ankle held behind to stretch the front thigh.',
  'Side view in half-kneeling lunge, rear knee grounded and pelvis gently shifted forward.',
  'Side view lying on back with one ankle crossed over opposite knee in figure four, hands behind thigh.',
  'Front view seated upright with soles together, knees opened sideways, hands holding feet.',
  'Side view in a doorway with one forearm against the frame, torso gently turning away.',
  'Front view standing with one elbow bent overhead and the opposite hand gently holding it.',
  'Front view standing upright with ear gently tilted toward one shoulder, shoulders relaxed.',
  'Side view on hands and knees with one arm rotating upward and chest opening toward that side.',
  'Side view lying on back while hugging one knee toward the chest, other leg relaxed.',
  'Viewed from above: lying on back with arms out and bent knees dropping together to one side.',
];

if (pack.exercises.length !== 119 || poseCues.length !== pack.exercises.length || names.size !== 119) {
  throw new Error(`Prompt catalog mismatch: ${pack.exercises.length} IDs, ${poseCues.length} cues, ${names.size} names`);
}

const intro = `# Full-colour exercise image prompts

These 119 prompts match the exercise IDs in \`assets/data/content-pack.json\`. Generate one static pose per row and save it as the exact filename in \`assets/images/exercises/\`. PNG with transparent background is preferred; 3:2 landscape canvas, at least 960 × 640 pixels. Keep the whole body and any required prop visible. Do not put text in the image. If your generator supports a style reference, attach \`side-plank-color-study.png\` to keep the same character, outfit and rendering style; do not copy the reference app's artwork.

**Shared style prefix for every row:** Original full-colour, anatomically accurate semi-realistic fitness illustration for a mobile workout app. One adult athlete, consistent teal athletic top, navy bottoms and coral shoes, natural skin and hair, clean silhouette, subtle shading, isolated transparent background. The full body is visible with space around every limb. No logos, text, arrows, duplicate limbs, cropped hands/feet, gym scene or extra equipment. Show one representative still pose, not a sequence.

**How to use:** Combine the shared prefix with the row's pose instruction. Keep the indicated camera view and prop. For one-sided exercises, generate the shown side first; the app may mirror it for the other side after pose review. Review anatomy and exercise form before saving.

| # | Exercise ID | Save as | Pose instruction |
|---:|---|---|---|
`;

const rows = pack.exercises.map((exercise, index) => {
  const name = names.get(index + 1);
  if (!name) throw new Error(`Missing catalog name for exercise ${index + 1}`);
  const props = exercise.props.length ? ` Include only: ${exercise.props.join(', ')}.` : '';
  return `| ${index + 1} | \`${exercise.id}\` | \`${exercise.id}.png\` | ${name}. ${poseCues[index]} Camera: ${exercise.view} view.${props} |`;
});

const footer = `\n---\n\n## Revision history\n\n| Version | Date | Changes |\n|---|---|---|\n| 1.0 | Sep 29, 2026 | Pose prompts and exact filenames for all 119 exercises |\n`;
writeFileSync(join(root, 'DOC/IMAGE_PROMPTS.md'), `${intro}${rows.join('\n')}\n${footer}`, 'utf8');
console.log(`Wrote ${rows.length} prompts to DOC/IMAGE_PROMPTS.md`);
