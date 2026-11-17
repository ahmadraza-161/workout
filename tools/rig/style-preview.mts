// Offline moving review artifact. No browser library or network asset required.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { PALETTES } from '../../src/modules/demo/rig/palette.ts';
import {
  STYLE_DURATION,
  STYLE_EXERCISES,
  drawStyleFrame,
} from '../../src/modules/demo/rig/authored/motion.ts';
import { svgPath } from '../../src/modules/demo/rig/authored/geometry.ts';

const output = join(import.meta.dirname, '../../.expo/style-proof');
mkdirSync(output, { recursive: true });
const samples = 120;
const frames = Object.fromEntries(
  STYLE_EXERCISES.map((exercise) => [
    exercise,
    Object.fromEntries(
      Object.entries(PALETTES).map(([paletteName, palette]) => [
        paletteName,
        Array.from({ length: samples }, (_, frame) =>
          drawStyleFrame(exercise, frame / samples, palette).map((part) => ({
            id: part.id,
            d: svgPath(part.path),
            fill: part.fill,
          })),
        ),
      ]),
    ),
  ]),
);
for (const exercise of STYLE_EXERCISES) {
  for (const [label, time] of [
    ['start', 0],
    ['quarter', 0.25],
    ['deep', 0.5],
    ['other', 0.75],
  ] as const) {
    const paths = drawStyleFrame(exercise, time, PALETTES.a)
      .map((part) => `<path d="${svgPath(part.path)}" fill="${part.fill}"/>`)
      .join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600"><rect width="600" height="600" fill="#FAFAFA"/>${paths}</svg>`;
    writeFileSync(join(output, `${exercise}-${label}.svg`), svg);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(join(output, `${exercise}-${label}.png`));
  }
}
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Character movement review</title><style>
*{box-sizing:border-box}body{margin:0;background:#f8f8f8;color:#1d2025;font:16px/1.5 system-ui,sans-serif}main{max-width:1080px;margin:auto;padding:32px 20px}h1{font-size:30px;margin:4px 0}p{color:#575e6e}.eyebrow{font-size:12px;letter-spacing:2px;color:#004bff;font-weight:700}.controls{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:24px 0}button,select{min-height:48px;border:1px solid #ddd;border-radius:24px;padding:0 22px;background:white;font:inherit;cursor:pointer}button{background:#004bff;color:white;border:0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.card{background:white;border-radius:24px;overflow:hidden}svg{display:block;width:100%;height:auto;background:#fafafa}.copy{padding:20px 24px}h2{margin:0;font-size:22px}.copy p{margin:8px 0}.scrub{width:100%;margin-top:16px;min-height:48px}body.dark{background:#0e1014;color:#fafafa}body.dark .card{background:#1d2025}body.dark svg{background:#242830}body.dark p{color:#bdc5d1}small{color:#6b6b6b}@media(max-width:650px){.grid{grid-template-columns:1fr}main{padding:20px 12px}}
</style><main><div class="eyebrow">ORIGINAL CHARACTER · STYLE REVIEW 01</div><h1>Let's get the movement right.</h1><p>Two exercise studies. Review the silhouette, turns and floor contact before expanding the library.</p>
<div class="controls"><button id="play">Pause</button><label>Outfit <select id="palette"><option value="a">Blue</option><option value="b">Rose</option></select></label><label>Speed <select id="speed"><option value="1">Normal</option><option value="0.5">Half speed</option></select></label><button id="theme">Dark background</button></div>
<div class="grid">${STYLE_EXERCISES.map((exercise) => `<article class="card"><svg role="img" aria-label="${exercise} moving character" viewBox="0 0 600 600" id="${exercise}"></svg><div class="copy"><h2>${exercise === 'squat' ? 'Squat' : 'Torso twist'}</h2><p>${exercise === 'squat' ? 'Controlled hip hinge. Heels stay planted through the entire repetition.' : 'Shoulders and hands turn together. Hips and feet remain stable.'}</p><label>Inspect pose<input class="scrub" type="range" min="0" max="119" value="0" data-exercise="${exercise}"></label></div></article>`).join('')}</div><p><small>Artwork and movement proof — pending your visual approval. Existing production Lottie samples have not been replaced.</small></p></main>
<script>const frames=${JSON.stringify(frames)};const duration=${JSON.stringify(STYLE_DURATION)};let playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;let palette='a',speed=1,last=performance.now();const times={'torso-twist':0,squat:0};const play=document.getElementById('play');const nodes={};for(const exercise of Object.keys(frames)){const svg=document.getElementById(exercise);nodes[exercise]=frames[exercise].a[0].map(part=>{const node=document.createElementNS('http://www.w3.org/2000/svg','path');svg.appendChild(node);return node;});}function render(exercise){const index=Math.floor(times[exercise]*120)%120;frames[exercise][palette][index].forEach((part,i)=>{nodes[exercise][i].setAttribute('d',part.d);nodes[exercise][i].setAttribute('fill',part.fill);});document.querySelector('[data-exercise="'+exercise+'"]').value=index;}function state(){play.textContent=playing?'Pause':'Play';}play.onclick=()=>{playing=!playing;state();};document.getElementById('palette').onchange=e=>{palette=e.target.value;Object.keys(frames).forEach(render);};document.getElementById('speed').onchange=e=>speed=Number(e.target.value);document.getElementById('theme').onclick=e=>{document.body.classList.toggle('dark');e.target.textContent=document.body.classList.contains('dark')?'Light background':'Dark background';};document.querySelectorAll('.scrub').forEach(input=>input.oninput=()=>{playing=false;state();times[input.dataset.exercise]=Number(input.value)/120;render(input.dataset.exercise);});function tick(now){const delta=Math.min(now-last,100)/1000;last=now;if(playing&&!document.hidden){for(const exercise of Object.keys(frames)){times[exercise]=(times[exercise]+delta*speed/duration[exercise])%1;render(exercise);}}requestAnimationFrame(tick);}state();Object.keys(frames).forEach(render);requestAnimationFrame(tick);</script></html>`;
writeFileSync(join(output, 'index.html'), html);
console.log(`Offline preview: ${join(output, 'index.html')}`);
