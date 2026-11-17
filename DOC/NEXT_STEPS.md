# Next steps — where we stopped (October 27, 2026)

Start here tomorrow. Nothing is committed yet: every change below is uncommitted on `main`. No APK has been built.

## Done

### 1. Exercise animations (finished)

- All downloaded third-party MP4/GIF demos (HeyGainz, TrainAI, dataset, Vital and others), their source files and notices are removed. The 28 Lottie animations stay.
- [VIDEO_PROMPTS.md](VIDEO_PROMPTS.md) has 91 Google Flow prompts: a 3D character in the Lottie style, working muscles red, supporting muscles orange, 8-second loop.
- The owner's two Flow ZIPs (106 clips) were reviewed frame by frame. 84 clips are in the app, compressed to 960x540 without audio (11.2 MB). **Coverage: 112 of 119 exercises.**
- Video behaviour: plays by itself when an exercise page or the workout player opens. Loops, no sound. Pauses when the workout pauses or the app goes to the background. Fully released when the page closes or another page covers it, and loads again on return. Lists and cards show only the photo.
- Typecheck, lint, all 348 tests and the release preflight passed after this step.

### 2. Home redesign (code written, not finished)

What the owner chose:

- **Plan-only Home.** The full workout catalogue stays in Discover.
- **The app recommends the plan** from the user's goal and level.
- **Keep the blue brand, but make it more vivid and alive.**
- **Two kinds of Home:**
  - **New user** (no plan yet and no workout done): a colourful welcome, the recommended plan with **Start day 1**, **Customize my plan**, "How it works" in 3 steps, the first week's path and Explore.
  - **Returning user:** a greeting with the streak, **today's plan day** (workout name, minutes, exercise previews, Start), this week's path with progress, Customize tiles (change plan, quick 5 min, stretch, create your own), suggested workouts and Explore.

What changed in the code:

- **New `home` module** (`src/modules/home/`):
  - `plan.ts`: plan recommendation, the week path and levels.
  - Screens: `HomeScreen`, `WelcomeHome`, `PlanHome`, `PlanScreen`.
  - Building blocks: `PlanPath`, `HomeSections`, `FadeIn`.
  - Tests for the plan logic and both screens.
- **New route:** `app/plan.tsx` opens the customize screen (goal, level, days per week, best plan, all plans). `app/(tabs)/training.tsx` now shows the new Home.
- **Plan rules** (`challenges` module): `getActivePlan` and `selectPlan`. There is one active plan at a time. Starting any challenge makes it the plan and pauses the others. A paused plan keeps its progress if chosen again.
- **Onboarding** now ends on **See my plan** and opens the new Home. It no longer jumps straight into a workout.
- **Old Home sections deleted:** `TrainingHomeScreen`, `TrainingBrowseSections` and `TrainingBodyFocus`. The feedback box moved to the bottom of Discover.
- **Text and colours:**
  - All new text is in `tools/content/homeStrings.ts`, built into `en.json` under `home.*`. The content pack did not change.
  - One new colour token: `onPrimarySoft`, a see-through white for pills on gradient cards.

Checks so far:

- Typecheck and lint pass.
- In the changed modules, 31 of 34 tests pass. The 3 failures are timeouts: the first test in `HomeScreen.test.tsx`, `PlanScreen.test.tsx` and `OnboardingScreen.test.tsx`. The suites ran very slowly (about 100 seconds each), so this is probably machine load and not a bug. This is not confirmed yet.
- The new screens have **not been seen on a phone** yet.

## To do, in this order

1. ~~Tests~~ — done November 6. The timeouts were machine load, not bugs: each file passes alone. `OnboardingScreen.test.tsx` had a hard-coded 15 s timeout that overrode the CLI flag, so `testTimeout: 30000` now lives in `jest.config.js`.
2. ~~Full check and preflight~~ — done November 6: `npm run check -- -- --runInBand` passes (typecheck, lint, 354 tests / 77 suites, 200 s). `npm run qa:release` passes.
3. Open the app on a phone and check:
   - the welcome Home (new install)
   - the plan Home after starting day 1
   - the plan screen
   - dark mode, small screens, spacing and the hero artwork size
4. ~~Update the docs~~ — done November 6: ARCHITECTURE (`home` row, `/plan`), DESIGN §12.4 and `onPrimarySoft`, DECISIONS ADR-066, PRD first-run flow.
5. Ideas:
   - ~~"Tomorrow: day X", day-done celebration, "plan complete"~~ — done November 6 as one finish-screen card (ADR-067, `player/planDay.ts`, `PlanDayCard`). Check it on a phone too.
   - Not started, ask the owner first: a true level-1 plan. This needs content-generator work, because all 12 current plans are level 2–3.
6. Animations still missing:
   - 7 clips to regenerate: Arm Circles, Archer Push-Up, Lateral Lunge, Single-Leg Glute Bridge, Fire Hydrant, Single-Leg Calf Raise and Plank Jack. They are listed at the top of VIDEO_PROMPTS.md.
   - Optional: Wall Angel, which shows the person facing the wall.
   - ~~Move the two ZIPs~~ — done November 6: they are now in `E:\Work\workout-flow-zips\`, outside the project. `sourceArchive` in video-candidates.json still names the old path as a record of where each clip came from.

## Notes

- The easier/harder exercise swap is not offered, because those links do not exist in the content data (ADR-040).
- No new settings key was added, because the backup import counts every key and would reject older backups. The active plan is read from the existing `challenge_state` table.
- The temporary helper scripts (prompt generator, clip review) were deleted by a temp-folder cleanup. Their results are safe in the repo.
