# Character assets and prompts

Created October 1, 2026 with the built-in imagegen tool. Original generated male, female and paired characters, not people or artwork extracted from reference screenshots. Sources are in `assets/images/characters/`; the build trims transparent outer margins and produces optimized PNGs bounded by 768 × 1024. Owner exercise JPEGs remain unchanged. Original realistic exercise replacements are in `assets/images/exercises/realistic/`; their exact prompts are recorded separately when the generation batch completes.

## Final prompt set

### male-trainer.png

Create one original premium fitness app challenge hero artwork: a photorealistic adult male athletic trainer, waist-up front three-quarter view, relaxed confident hands on hips, muscular but natural physique, short dark hair, navy training shorts, shirtless torso. Entire head, both elbows and waistband visible. Genuine transparent alpha background, isolated cutout, no floor, no text, logo, watermark or checkerboard. Realistic studio illumination, tasteful editorial fitness portrait. Composition fills tall 3:4 frame with minimal transparent outer margins. This is a standalone male character for the right half of a blue workout challenge card; never copy a recognizable person.

### male-plank.png

Original editorial fitness artwork, photorealistic adult athletic male in a correct high plank exercise position, three-quarter side view facing left, both hands shoulder-width on ground plane, straight elbows, straight neutral spine from head to heels, toes supporting him. Teal fitted sleeveless training top, dark navy shorts, neutral sneakers. Entire body, both hands and both feet visible. Genuine transparent alpha cutout, no background, no floor, no text, logo or watermark. Soft realistic studio light. Wide horizontal composition with minimal safe transparent margins. For a home workout app's workout thumbnail and Discover banner; preserve anatomically correct exercise form.

### male-squat.png

Create an original photorealistic editorial workout character: adult athletic male wearing teal sleeveless fitted top, navy training shorts and neutral sneakers, in a controlled bodyweight squat, three-quarter side view facing left, arms extended forwards at shoulder height, hips back, knees aligned over toes, heels planted, neutral spine. Full body including both hands and feet, no clipped parts. Genuine transparent alpha background, no floor, shadow, checkerboard, text, logo or watermark, clean neutral antialiased edges. Minimal transparent margins around complete silhouette. This isolated male workout cutout goes into home workout app leg workout thumbnails. Studio lighting and natural athletic proportions; no reference-person copying.

### Exercise squat cutout edit

Input: original optimized `ex_bodyweight_squat.jpg`.

Use case: background-extraction. Remove the baked white/gray checkerboard background ONLY from this exercise illustration and return a genuine transparent-alpha PNG cutout. Keep the athlete's exact identity, female gender, pose, clothes, colours, body proportions and every hand/foot unchanged. Preserve the full character and clean antialiased silhouette; no shadow, floor, checkerboard, additional content or text. Trim excess empty canvas close to the complete silhouette, with a small safe transparent margin.

## Integration and remaining QA

- Challenge cards and shared collection banners use original male/female pairs. Strength and calorie collection banners use male and female portraits respectively.
- Workout artwork selects an actual exercise from the workout, prioritizing its primary/secondary muscle focus. It does not substitute an unrelated generic plank for every workout.
- Card overlays reserve title space. Heroes reserve a separate text column. Exercise images contain the whole character with spacing appropriate to thumb, guide or player.
- `npm run images:build` prefers `realistic/<exercise-id>.png`, then `cutouts/<exercise-id>.png`, then original sources. It preserves alpha, trims transparent outer margins and limits decoded dimensions/file size; no runtime network.
- `npm run images:qa` validates exercise decodes and all five male/female browse PNGs, with white/blue exercise sheets and blue/dark character previews. Partial-alpha metadata helps identify halos for visual review; an alpha channel alone is not visual approval.
- Generation, pose/edge approval and phone size/font-scaling QA are separate gates. See [IMAGE_QA](IMAGE_QA.md); never describe a generated batch as trainer-approved or phone-verified.

## Additional character generation briefs

Mode: original image generation with transparent background; no reference person or screenshot supplied.

- `trainers-mixed.png`: Two adult athletic fitness coaches, male in teal sleeveless top/navy shorts and female in navy sports top/teal leggings, adjacent and equally prominent, friendly waist-up composition, natural muscular anatomy, studio lighting, no touching, transparent alpha, no floor/fog/text/logos.
- `female-trainer.png`: Adult athletic female coach, waist-up with hands on hips, teal athletic sports top and navy high-waisted leggings, natural toned arms/shoulders, realistic studio portrait, full head/elbows/hands visible, transparent alpha, no fog/text/logos.

## Revision history

| Version | Date | Changes |
|---|---|---|
| 1.0 | Oct 1, 2026 | Initial male characters and squat extraction prompts |
| 1.1 | Oct 1, 2026 | Added original female/pair generation briefs, inclusive realistic source priority and muscle-relevant artwork selection |
