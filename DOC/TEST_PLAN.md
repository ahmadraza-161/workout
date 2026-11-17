# 🧪 Test Plan

October 13 build-helper regression: Windows PowerShell 5.1 reproduces the old
offline-option splat as individual characters, including two bare `-` tasks.
The repaired argument block sends one `--offline` flag in 5.1 and 7; online mode
omits it. Full helper syntax parses in Windows PowerShell. Final project check
passes typecheck/lint and 347 tests across 75 suites (170.168s). No native APK
compilation was run for this argument repair; owner must rerun the helper.

October 13 repair verification: final npm run check -- -- --runInBand --testTimeout=20000 passes typecheck, lint and all 347 tests/75 suites (147.368s). Release preflight passes. Production Android JS export passes (4,973 modules, 245 assets, .expo/app-repair-export); exported MD5 bytes verify all 64 active MP4s and all 119 original images, with zero disabled TrainAI videos. All 64 MP4s decode and source SHA256 hashes match. Image audit passes 119 PNGs (11.21 MB) and five character assets. Regression coverage includes native release before guide cleanup/stale events, HeyGainz loop policy, local-image retry, suitable recommendation and Review workout navigation. Intermediate checks exposed a stale recommendation expectation, ungenerated translation keys and a Jest mock-hoisting error; all were corrected before this final pass. Physical Android scenario matrix in APP_REPAIR_PLAN remains open; no APK built.

Final 119/119 export verification: production Android JS export passes (5,000 modules; .expo/animation-all-exercises-export; 271 assets). All 91 MP4 mappings and all 119 original image mappings match exported MD5 assets; shared sources deduplicate. Release preflight passes. Full check passes typecheck/lint and 342 tests/74 suites (85.696s). Native Android QA remains; no APK built.

October 13 final catalog-wide check: typecheck/lint and all 342 tests across 74 suites pass (85.696 seconds). All three final MP4s decode without errors; Floor Row decoded last pose reviewed. Original-source integrity now also checks the untrimmed Sworkit MP4 hash. Static fallback test uses a missing-demo ID since all 119 catalog IDs are now mapped. The intermediate check collided with asset generation (Windows EBUSY); final checks ran after generators completed and pass. Physical Android form/framing, pose holds, pause/background, Reduce Motion, TalkBack and airplane-mode QA remain pending. No APK built.

Production Android JS export passes (4,997 modules; .expo/animation-final-seven-export; 268 assets). All 88 MP4 mappings and 119 original image mappings are verified by MD5 in exported metadata; identical shared MP4s deduplicate. Native phone QA remains; no APK built.

October 13 final seven-mapping pass: source review, held Hamstring final pose, seated Get-Up endpoints and all seven FFmpeg decode checks pass. Final typecheck/lint and 342 tests/74 suites pass (74.074s). The initial run caught a stale static-fallback test referencing newly animated Arm Circles; it now uses Floor Row Isometric. Release preflight passes. Native Android form/framing, held last-frame, pause/background, Reduce Motion, TalkBack and airplane-mode checks remain pending. No APK.

October 13 HeyGainz continuation: 32 further demos added, total 109/119, with eight new held-pose segments. Original GIF/hash and MP4 integrity checks, dense hold source review, decoded final-frame inspection and FFmpeg decoding of all 32 new MP4s pass. Required full check passes typecheck/lint and 342 tests across 74 suites (128.909 seconds; testTimeout=20000). The first run exposed the old integrity-test equipment assertion: existing front/lateral raises use optional household bottles; regression now permits only these two IDs and requires actual Bottle Weighted sources and household instructions. Release preflight passes. Production Android JS export passes (4,990 modules; .expo/animation-batch-32-export), with all 81 MP4s and 119 original image mappings included. Physical Android form/framing, held last-frame, pause/background, Reduce Motion and airplane-mode QA remain pending; no APK built.

October 13 animation batch: 48 new demos bundled, total 77/119; original GIF headers/hashes and converted MP4 hashes checked by generator and integrity tests. Visual review uses original frames at 0/20/40/60/80 percent. Ten hold entries stop before release; regression checks loop=false. First full check under acquisition/QA load had an existing browse timeout and a case-sensitive notice assertion; notice check is corrected and final full check reruns with testTimeout=20000. Final full check passes typecheck/lint and 342 tests across 74 suites (106.769 seconds); release preflight passes. Production Android JS export passes (4,958 modules; .expo/animation-batch-48-export), including all 49 MP4s and 119 original exercise images. FFmpeg decodes all 49 bundled MP4s without errors. Physical Android playback/form, airplane-mode and held-last-frame checks remain pending. No APK built.

### October 12 — offline MP4 demo

Owner-approved `expo-video` 57.0.5 plays the original local Vital Pike Push-Up sample (0353). Coverage is 29/119 exercise IDs, 25 unique sources and 90 unresolved. Automated regressions cover readiness/first-frame pose fallback, timer pause, route blur, background pause, preserving playback position, Reduce Motion, decoder errors, listener cleanup and Animation/Image switching. Asset integrity checks verify the original MP4 hash, matching equipment-free exercise, offline credit and unified coverage. Release preflight passes. Final full check passes typecheck/lint and 341 tests across 74 suites (80.469 seconds). The initial check exposed a missing native-module mock in the isolated ExerciseGuide test; the fixed test passes in the final full run. Production Android JS export passes (4,910 modules; .expo/mp4-pike-export); the original 1,739,537-byte MP4 is listed in the exported assets alongside all 119 exercise images.

Physical Android playback/form, airplane-mode, TalkBack, light/dark framing and merged-manifest QA remain open. A rebuilt Android binary is required for the new native dependency; no APK is built in this task.

October 11 Russian Twist import: source access recovered normally; original licensed 195-frame seated torso-rotation demo added. Fixed legs/hips and animated torso reviewed in original frames 0/25/50/75/99. Honest unnamed contributor credit retained (a848f9e4); no new geometry or motion authored. Current coverage 28/119 IDs, 24 unique sources, 91 unresolved, 3,343,861 bundled bytes. All original images/UI retained, no APK built. Final validation: typecheck/lint and all 336 tests across 72 suites pass (279.355 seconds); production Android JS export passes (4,899 modules, .expo/lottie-russian-export), and release preflight passes. Native form/playback and airplane-mode QA remain open.

October 11 next animation pass: added Standing Forward Fold using the licensed original Inchworm entry frames 0–24 once, then hold before hand walking. Source reviewed at frames 0/24/30/34/39 and across its full cycle. No custom motion or new unique source claimed. Current coverage 27/119 IDs, 23 unique sources, 92 unresolved, 3,239,591 bundled bytes. Original images/UI retained; no APK built. Final validation: typecheck/lint and 335 tests across 72 suites pass (197.003 seconds); production Android JS export passes (4,898 modules, .expo/lottie-fold-export), and release preflight passes. Native playback/form and airplane-mode QA remain open.

October 11 batch continuation: added Neck Side Stretch (Indrum, original frames 0–60 once then hold), Side Plank (Ajay Gupta, original rotating-plank first entry frames 1–35 once then hold, reviewed viewport), and Shadow Boxing (existing Dinh Punches source, matching staggered stance/alternating punches/guard). No custom motion authored. Current coverage: 26/119 exercise IDs, 23 unique licensed sources, 93 unresolved IDs, 2,934,727 bundled bytes. All 119 images and UI retained; no APK built. Final validation: typecheck, lint and all 334 tests across 72 suites passed; release preflight passed. Android JS export metadata and Hermes bundle verified in .expo/lottie-batch-export. Native form/playback and airplane-mode device QA remain open.

October 11 animation-only continuation: two further exercise IDs now have verified ready-made demos. Push-Up Hold plays original Military Push Ups frames 2–10 once, then holds at shallow elbow flexion. Plank Walkout shares the original Inchworm demo because their catalog instructions describe the same hand-walk movement. These are reused licensed sources, not two new unique downloads or authored animations. Coverage: 23/119 exercise IDs, 21 unique source animations, 96 unresolved IDs, 2,594,038 bundled bytes. All 119 photographs and UI remain. Full check passes typecheck/lint and 332 tests across 72 suites (94.124 seconds). Production Android JS export passes (4,894 modules, .expo/lottie-hold-walkout-export). Native playback/form QA remains open; no APK built.

October 11 continuation: completed the interrupted High Knees import by Bashir Ahmad under the Lottie Simple License. Original 29-frame alternating thigh/arm motion and floor line are retained. Coverage is 21/119, with 98 IDs still awaiting matching free ready-made demos; bundled JSON totals 2,214,530 bytes. All 119 exercise images remain. Production Android JS export passes (4,892 modules; .expo/lottie-high-knees-export), and release preflight passes. Full check passes typecheck/lint and 331 tests across 72 suites (205.968 seconds). Native phone QA remains open. No APK built.

### Home Workout – Quality Assurance Strategy

This document defines how Home Workout is tested: scope, test levels, tools, devices, test cases, mandatory scenarios, performance and accessibility checks, release testing and defect handling. Its goal is to ship an app that is **correct, reliable during workouts, fully offline, accessible and fast**.

| Field | Details |
|---|---|
| **Version** | 1.8 |
| **Last updated** | October 11, 2026 |
| **Status** | Active |
| **Related** | [PRD](PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [CONTENT_MAP](CONTENT_MAP.md) · [RULES](RULES.md) · [TASKS](TASKS.md) · [SECURITY](SECURITY.md) |

---

## 1. Purpose & Scope

October 2 owner-requested source QA (APK rebuild excluded): full check passes 319 tests/69 suites, including startup readiness/font failure, onboarding navigation/validation, timer/pause/rest/finish/save retry, challenge progression, history/weekly goals, reminder denial/cancellation/reconciliation and independent audio/haptics. Added regressions cover pending audio cancellation when navigating away and sound remaining enabled with vibration off. Snapshot-storage failure now warns once, retries on subsequent state changes and does not prevent timer completion or final session persistence. Font failure now uses a system-font startup while retaining the readiness gate.

`npm run qa:release` passes the offline/config checks. `npm run images:qa` decodes all 119 exercise images (11.21 MB, all with alpha) and five male/female character assets; character previews on blue/dark backgrounds and the first exercise contact sheet were visually reviewed. This is asset/source QA, not an installed-app layout comparison. Existing automated browse/navigation and light/dark checks pass.

Physical tests remain open: small-screen/large-font/TalkBack and pixel comparison; real notification delivery while closed/after reboot; audible cues/music ducking/call interruption; airplane-mode runtime and fresh-install launch timing. The bundled adb currently fails to initialise its Android profile (`Cannot mkdir '\\.android': Permission denied`), so no device validation was performed. No APK was rebuilt, as requested.

**In scope:** every v1 feature in [PRD](PRD.md) §5, the content pack, the generated assets, the release build and the Google Play submission.

**Out of scope for v1:** iOS, tablets as a primary target, landscape, languages other than English, YouTube videos, weight goals, and any online or server feature (none exist).

---

## 2. Quality Goals

| Goal | Target | Measured by |
|---|---|---|
| Correct maths | kcal, BMI, streaks and weekly goal match hand calculations exactly | Unit tests (§6), scenario S9–S10 |
| Reliable workouts | Timer accurate to ±1 s after calls, locks and restarts | Scenarios S1–S3 |
| Fully offline | Every feature works in airplane mode; no INTERNET permission | S4, S11 |
| Stable | Crash rate < 0.5%, ANR rate < 0.3% | Play Console (Android vitals) |
| Fast | Cold start < 2 s, 60 fps, Lottie first frame < 200 ms, player memory < 200 MB, AAB < 40 MB | §9 |
| Accessible | WCAG 2.2 AA; TalkBack usable end to end | §9.2 |
| Quick to start | New user reaches a running workout in < 60 s | Usability test (§7.1) |

---

## 3. Test Levels & Strategy

| Level | What | Tool | When | Owner |
|---|---|---|---|---|
| **Static checks** | Types, lint, formatting | `tsc`, ESLint, Prettier | Every commit | Developer / AI |
| **Unit tests** | Pure logic: engine, timing, maths, generators, validation | Jest | Every commit | Developer / AI |
| **Component tests** | Core UI components and key screens render and respond | React Native Testing Library | Every commit | Developer / AI |
| **Build-time validation** | Content pack and asset budgets | `npm run assets` validator | Every asset change | Developer / AI |
| **Manual feature tests** | Test cases in §7 | Real phones | End of each phase | Product owner + developer |
| **Scenario tests** | Mandatory real-world scenarios in §8 | Real phones | Phases 5, 9, 11, 12 | Developer |
| **Non-functional tests** | Performance, accessibility, compatibility, battery | See §9 | Phase 12 (+ spot checks) | Developer |
| **Release testing** | Internal → closed (12+ testers, 14 days) → staged rollout | Google Play Console | Phase 12 | Product owner |

**Coverage targets:** ≥ 90% line coverage for `player`, `report`, `challenges`, `backup` and the content generator. ≥ 70% overall.

Run `npm run qa:release` before Android release testing. It resolves the production Expo config locally, checks permission-removal directives, disabled cloud backup/updates, and scans application sources for network APIs, remote SVG loaders and URLs. It does not build or inspect a merged APK manifest, prove native dependency permissions, or replace airplane-mode scenario S11. Those checks still require an Android build and device.

Reminder/audio device follow-up (installed Android build): schedule the next selected weekday/time and verify delivery with airplane mode, app closed and after reboot. Deny app permission and block the reminder channel separately; saving must show recovery rather than success. Change time/days repeatedly, then turn reminders off and confirm all seven owned identifiers are gone. Check foreground reminder sound against the system channel/mute settings. In a workout, verify 3–2–1, transition and completion cues, independent vibration, sound off during playback, music ducking, phone lock/call/background suppression and return without replaying missed cues. Expo Go does not exercise reminders in this project; automated hook tests do not prove physical sound or notification delivery.

---

## 4. Test Environments & Device Matrix

| Environment | Purpose |
|---|---|
| Expo Go (SDK 57) on a real phone | Daily development and feature checks |
| Development build | Checks that need native configuration |
| Release AAB (internal testing track) | Performance, permissions, scenario and regression tests |

| Device class | Example spec | Android version | Why |
|---|---|---|---|
| Low-end | 2 GB RAM, 720p, 5.5" | 8–10 | Performance floor (S5) |
| Mid-range | 4–6 GB RAM, 1080p | 13–14 | Most common users |
| Recent flagship | 8+ GB RAM, 1080p+ | 16 | Target API behaviour |
| Small screen | ~360 dp wide | Any | Compact layout |
| Large phone | ≥ 412 dp wide | Any | Regular layout |
| Oldest supported | Any | 7.0 (API 24) | Minimum SDK |

If no physical device is available for a class, borrow one or use the Android emulator (needs the Android SDK, ADR-036).

---

## 5. Entry & Exit Criteria

| Stage | Entry | Exit |
|---|---|---|
| **Phase** | Previous phase done; tasks for this phase complete | Phase "Done when" test passes, all unit tests green, no open S1/S2 bugs |
| **Internal testing** | Phases 1–11 done; release build signed | Full regression (§7) passes; S1–S11 pass |
| **Closed testing** | Internal testing exit met | 14 consecutive days with 12+ opted-in testers; no open S1/S2 bugs |
| **Production** | Closed testing exit met; Play forms complete | Staged rollout with crash rate < 0.5% and ANR rate < 0.3% at each step |

---

## 6. Unit Test Requirements

### 6.1 Workout engine (state machine)

| ID | Case | Expected |
|---|---|---|
| U-ENG-01 | Start a workout | IDLE → PREP with the prep duration from settings |
| U-ENG-02 | Prep time ends | PREP → EXERCISE (item 1) |
| U-ENG-03 | Exercise time ends and rest > 0 | EXERCISE → REST |
| U-ENG-04 | Rest is 0 or "Enable rest" is off | EXERCISE → next EXERCISE (no REST) |
| U-ENG-05 | Last exercise ends | → COMPLETE (no rest after the last item) |
| U-ENG-06 | Pause, then resume after 30 s | Remaining time unchanged by the pause |
| U-ENG-07 | Skip / previous | Moves to next / previous item; previous on item 1 restarts it |
| U-ENG-08 | "+20s" during rest | Rest end time moves 20 s later |
| U-ENG-09 | Reps item "Done" with an adjusted count | Records the actual reps and moves on |
| U-ENG-10 | Quit → save | Partial session with the correct `completionPct` |
| U-ENG-11 | One-sided exercise | Left and right items run back to back |
| U-ENG-12 | Quiet Mode on, workout contains Jumping Jack (#92) | Plays Step Jack (#93) with the same time; the session records #93 |

### 6.2 Timing, fast-forward and snapshot

| ID | Case | Expected |
|---|---|---|
| U-TIM-01 | Remaining time from timestamps | `duration − (now − start − paused)`; never negative |
| U-TIM-02 | App returns after 5 min in the background mid-workout | Fast-forwards through every finished phase and lands in the correct phase with the correct remaining time |
| U-TIM-03 | Device clock unchanged, 250 ms UI ticks for 60 s | No drift beyond ±1 s |
| U-TIM-04 | Snapshot 1 h old on launch | "Resume workout?" offered and state restored |
| U-TIM-05 | Snapshot 3 h old on launch | Snapshot discarded; no prompt |

### 6.3 Calculations

| ID | Case | Expected |
|---|---|---|
| U-CAL-01 | kcal: MET 8, 70 kg, 10 min | 8 × 3.5 × 70 / 200 × 10 = **98.0 kcal** |
| U-CAL-02 | kcal with no weight entered | Uses 70 kg |
| U-CAL-03 | kcal for a session | Sum over exercises of MET × time actually done |
| U-CAL-04 | BMI: 70 kg, 175 cm | 70 / 1.75² = **22.9**, "Healthy weight" |
| U-CAL-05 | BMI boundaries 18.5 / 25 / 30 / 35 | Each boundary value belongs to the higher category |
| U-CAL-06 | BMI with no height | Card shows "--" and asks for height |
| U-CAL-07 | Units | 1 kg = 2.20462 lb; 1 in = 2.54 cm; display rounded to 1 decimal |

### 6.4 Streaks & weekly goal

| ID | Case | Expected |
|---|---|---|
| U-STR-01 | Sessions ≥ 50% on 3 consecutive days | Streak = 3 |
| U-STR-02 | Session 40% complete | Does not count as a streak day |
| U-STR-03 | Two sessions on the same day | Counts once |
| U-STR-04 | Jan 31 → Feb 1 → Feb 2 | Streak = 3 (month boundary) |
| U-STR-05 | Dec 31 → Jan 1 | Streak continues (year boundary) |
| U-STR-06 | One missed day | Streak resets to 1 on the next workout day; longest kept |
| U-STR-07 | Workout at 23:59 and 00:01 local time | Two different streak days |
| U-STR-08 | DST change or time-zone change | Days are based on the local date written at save time; no double counting |
| U-GOAL-01 | Week = Sunday–Saturday; 3 streak days this week, target 4 | Shows 3/4 |
| U-GOAL-02 | Target changed mid-week | New target applies immediately; count unchanged |

### 6.5 Challenges

| ID | Case | Expected |
|---|---|---|
| U-CH-01 | Complete Day 1 | Day 2 becomes the current day |
| U-CH-02 | Rest day | Marked as rest; "Start Day N" moves to the next training day |
| U-CH-03 | 14-day challenge | 4-week progression compressed into 2 weeks |
| U-CH-04 | Ramp challenge (e.g. Plank): baseline 20 s | Training days increase ~10% (rounded to whole seconds or reps); rest days keep the previous value |
| U-CH-05 | Restart | Progress resets; history kept |

### 6.6 Content generator (build time)

| ID | Case | Expected |
|---|---|---|
| U-GEN-01 | Counts | 119 exercises, 60 workouts, 12 challenges, 6 tiles, 35 achievements |
| U-GEN-02 | Block sizes | < 10 min: 1/4–6/1 · 10–20 min: 2/8–12/2 · > 20 min: 3/12–18/3 |
| U-GEN-03 | Level ranges | Difficulty, work and rest inside the level's range (PRD §8.2) |
| U-GEN-04 | Same primary muscle back to back | Never, except in strength workouts |
| U-GEN-05 | Quiet workouts | Only quiet-safe exercises |
| U-GEN-06 | Stretch workouts | Holds only, 30–45 s, no rest, no cardio |
| U-GEN-07 | Duration | Within ±1 min of the catalog (3 s per rep for rep items) |
| U-GEN-08 | References | Every exercise, workout, challenge and category ID resolves |
| U-GEN-09 | Copy rules | No banned phrases ("shred", "melt fat", "flat belly", …) |
| U-GEN-10 | Determinism | Two runs produce byte-identical output |
| U-GEN-11 | Quiet swaps | Each of the 9 jumping exercises has a swap; every swap target is quiet-safe |
| U-GEN-12 | Variation links | Every easier/harder link points to an existing exercise; the 19 unresolved ones are empty |
| U-GEN-13 | Placements | Every Discover tile and all 4 collections have at least one workout; each quick filter returns ≥ 1 workout |
| U-GEN-14 | Rig coverage | All 119 exercises have a base pose, a view and their required props |

### 6.7 Backup & validation

| ID | Case | Expected |
|---|---|---|
| U-BAK-01 | Export → import on a clean install | All tables and preferences identical |
| U-BAK-02 | Corrupted JSON | Rejected with a clear message; nothing changes |
| U-BAK-03 | File > 5 MB | Rejected before parsing |
| U-BAK-04 | Newer `schemaVersion` than the app supports | Rejected with an "update the app" message |
| U-BAK-05 | Out-of-range values (weight 900 kg, negative duration) | Rejected; nothing changes |
| U-BAK-06 | Failure half-way through the import | Transaction rolls back completely |

---

## 7. Functional Test Cases

Run on a real phone at the end of each phase, and all together in the Phase 12 regression.

### 7.1 Onboarding

| ID | Steps | Expected |
|---|---|---|
| F-ONB-01 | Fresh install → complete every step quickly | Running workout in < 60 s |
| F-ONB-02 | Skip body data | Allowed; BMI later shows "--"; kcal uses 70 kg |
| F-ONB-03 | Birth year picker | Only offers ages 18 and over |
| F-ONB-04 | Answer "Yes" to a PAR-Q question | Advice to consult a doctor; must acknowledge before continuing |
| F-ONB-05 | Kill the app mid-onboarding | Restarts onboarding at the first unfinished step |
| F-ONB-06 | Schedule step: pick a reminder time with the time picker | Saved; 12-hour or 24-hour format follows the device |

### 7.2 Training tab

| ID | Steps | Expected |
|---|---|---|
| F-TRN-01 | Scroll the whole tab | All 13 sections in order ([PRD](PRD.md), spec §9.2) |
| F-TRN-02 | Edit the weekly goal to 5 | Card shows n/5; saved after restart |
| F-TRN-03 | Tap each Body Focus chip | 3 rows (Beginner / Intermediate / Advanced) with correct bolts |
| F-TRN-04 | Tap each quick filter | Opens the correct filtered list |
| F-TRN-05 | Tap every "More >" | Opens the generic list with the right title and items |
| F-TRN-06 | Challenge card "START DAY 1" | Opens the challenge's day 1 |
| F-TRN-07 | "Tell us what you need" | Local note saves and can be exported through the share sheet |
| F-TRN-08 | Reach the weekly goal | "Weekly goal reached" modal appears once that week |
| F-TRN-09 | Tap the streak flame | Opens the Report tab |

### 7.3 Discover, lists, search, favourites

| ID | Steps | Expected |
|---|---|---|
| F-DIS-01 | Tap each of the 6 body-focus tiles | Category page with a dark hero and the right workouts |
| F-DIS-02 | Every Discover section | Opens the right list or workout |
| F-SRC-01 | Search "plank" | Grouped results (Workouts / Exercises / Challenges) |
| F-SRC-02 | Search with no results | Empty state with a suggestion |
| F-SRC-03 | Recent searches | The last 10 are kept; can be cleared |
| F-FAV-01 | Favourite a workout, restart the app | Still in favourites |
| F-FAV-02 | Settings → My favourites | Lists saved workouts; the heart on details toggles membership |
| F-DIS-03 | Discover history (clock) icon | "Recent" list of completed workouts, newest first |
| F-LST-01 | Popular Goals → Build Muscle → More | Build-muscle challenges first as "N-day plan" rows, then workouts |
| F-LST-02 | Discover "Stretch" | 2-row horizontal grid with the 12 stretch and warm-up workouts |

### 7.4 Workout details & exercise guide

| ID | Steps | Expected |
|---|---|---|
| F-DET-01 | Open any workout | Correct level, minutes, exercise count and intro; Start (never "Unlock") |
| F-DET-02 | "View all" | Full exercise list |
| F-DET-03 | Scroll past Start | Sticky Start appears |
| F-GDE-01 | Tap (?) on an exercise | Guide sheet: Animation / Muscle / How to do + every fixed section |
| F-GDE-02 | Muscle tab | Primary muscles highlighted strongly, secondary muscles lightly |
| F-GDE-03 | Guide for Crunch (#11), then Forearm Plank (#20) | Crunch shows only "Harder: Sit-Up"; Forearm Plank shows only "Harder: Plank Shoulder Tap" |
| F-DET-04 | Tap an exercise row on workout details | Opens that exercise's guide |

### 7.5 Player

| ID | Steps | Expected |
|---|---|---|
| F-PLY-01 | Start a workout | Ready screen with ring countdown (default 15 s); ">" starts at once |
| F-PLY-02 | Timed exercise | Timer counts down; the pause button fills left → right |
| F-PLY-03 | Rep exercise | Target shown, Done button, adjuster records the actual count |
| F-PLY-04 | Rest | Blue panel with "NEXT n/N", countdown, +20s and Skip |
| F-PLY-05 | Edit rest time to Custom 25 s | Following rests last 25 s |
| F-PLY-06 | Prep timer set to 0 | No Ready countdown |
| F-PLY-07 | Voice cues, beeps, haptics on/off | Each toggle works on its own |
| F-PLY-08 | Music playing in another app | Music ducks during cues and never stops |
| F-PLY-09 | Phone in silent mode | No beeps or voice |
| F-PLY-10 | Back button mid-workout | Pause overlay → Quit → "Save & exit" / "Discard" |
| F-PLY-11 | Finish a workout | Finish screen: duration, exercises, kcal, streak, weekly ring, new badges, feedback |
| F-PLY-12 | Thumbs down an exercise | Saved; that exercise ranks lower in suggestions |
| F-PLY-13 | Quiet Mode on → start a workout that contains a jumping exercise (❌ in CONTENT_MAP §2) | Each jumping exercise is replaced by its quiet swap, labelled "Quiet swap" |
| F-PLY-14 | Finish screen → Share | Share sheet opens with a PNG card; the card shows no weight, BMI or age |

### 7.6 Challenges

| ID | Steps | Expected |
|---|---|---|
| F-CHL-01 | Filter the challenge list | Chips filter correctly |
| F-CHL-02 | Finish Day 1 | Day 1 ticked, Day 2 current, others locked, rest days marked |
| F-CHL-03 | Restart the app | Progress kept |

### 7.7 Report

| ID | Steps | Expected |
|---|---|---|
| F-REP-01 | Finish one 10-minute workout | Workouts +1, minutes +10, kcal matches the formula |
| F-REP-02 | Period toggle | This week / This month / Total change the numbers correctly |
| F-REP-03 | Log weight in lbs | Stored in kg; displayed in lbs; chart updates |
| F-REP-04 | Heaviest / lightest | Correct after several entries |
| F-REP-05 | Edit height | BMI recalculates; marker moves to the right segment |
| F-REP-06 | All records | Calendar dots on workout days; day → sessions → session detail |
| F-REP-07 | Weight log: tap the date chip, pick a past date, save | Entry saved on that date; future dates can't be picked |

### 7.8 Builder, achievements, reminders, backup, settings

| ID | Steps | Expected |
|---|---|---|
| F-BLD-01 | Create a custom workout with 5 exercises, reorder, save | Appears under Custom Workout; runs in the player |
| F-BLD-02 | Edit and delete it | Changes saved; deletion asks for confirmation |
| F-ACH-01 | Finish the first workout | "First Workout" badge + celebration |
| F-ACH-02 | Report → Achievements → More | All 35 badges, locked ones greyed out |
| F-REM-01 | Turn on a reminder | Primer first, then the Android permission dialog |
| F-REM-02 | Deny the permission | Reminder stays off; clear message on how to enable it |
| F-BAK-01 | Export | Share sheet opens with a JSON file |
| F-BAK-02 | Reset all data | Double confirmation → back to onboarding, no data left |
| F-SET-01 | Theme: System / Light / Dark | Switches instantly and follows the system |
| F-SET-02 | Units: metric / imperial | Every screen converts correctly |
| F-SET-03 | Install a build with a higher version | "What's new" appears once, then never again for that version |

---

## 8. Mandatory Scenario Tests

These scenarios must pass on a real phone with a **release build** before launch.

| ID | Scenario | Steps | Pass criteria |
|---|---|---|---|
| **S1** | Phone call mid-workout | Start a workout → receive a call during an exercise → talk 1 min → return | Timer correct (±1 s); workout continues or offers resume |
| **S2** | Screen lock during a hold | Start a 60 s plank → lock for 30 s → unlock | Remaining ≈ 30 s (±1 s) |
| **S3** | App killed | Mid-workout → swipe the app away → reopen within 2 h | "Resume workout?" restores the exact exercise |
| **S4** | Airplane mode end to end | Airplane mode on → install → onboarding → workout → report → export | Everything works; nothing asks for internet |
| **S5** | Low-end device | 2 GB RAM phone → complete a 20-minute workout | No visible jank; no crash; frame drops < 5% |
| **S6** | Backup round trip | Use the app for a week → export → reset → import | Every session, weight, challenge and setting restored |
| **S7** | Reminder after reboot | Set a reminder for 5 min ahead → reboot the phone | Notification arrives on time (inexact alarms allow a few minutes' delay) |
| **S8** | Memory stability | Open and close 20 different workout details quickly | Memory returns to baseline (< 10% growth) |
| **S9** | Hand-calculated maths | 70 kg user, MET 8, 10 min; height 175 cm | Report shows 98 kcal; BMI 22.9 |
| **S10** | Streak across a month end | Set the device date to Jan 30 → workout; Jan 31 → workout; Feb 1 → workout | Streak 3, personal best 3 |
| **S11** | No internet permission | Inspect the merged release manifest (`apkanalyzer` or the Play Console bundle explorer) | No `INTERNET`, no `ACCESS_NETWORK_STATE`; only `POST_NOTIFICATIONS` requested at runtime |
| **S12** | Time-zone change | Workout at 23:30 → change the time zone forward 2 h | No duplicate or lost streak day |
| **S13** | Extreme settings | 200% font size + dark mode + TalkBack → run a full workout | Everything readable, usable and announced |

---

## 9. Non-Functional Tests

### 9.1 Performance

| Metric | Budget | How to measure |
|---|---|---|
| Cold start | < 2.0 s | `adb shell am start -W` (needs the Android SDK) or screen recording on the low-end phone, 5 runs, median |
| Frame rate | 60 fps | Android GPU rendering profile / React Native perf monitor on Training scroll and in the player |
| Lottie first frame | < 200 ms | Timestamp from mount to first `onAnimationLoaded` |
| Memory in the player | < 200 MB | Android Studio profiler or `adb shell dumpsys meminfo` |
| App bundle size | < 40 MB | Play Console bundle explorer or `bundletool` |
| Battery | < 8% per 60-minute workout on the mid-range phone | Battery stats before and after |

### 9.2 Accessibility

- A full TalkBack pass through onboarding, a workout, the report and settings.
- Font size at 200%: no clipped or overlapping text.
- Contrast pairs as listed in [DESIGN](DESIGN.md) §9.1. Re-check any new colour pair.
- Google's **Accessibility Scanner** app on every screen: zero high-severity issues.
- Touch targets ≥ 48 dp; Reduce Motion removes decorative animation.

### 9.3 Offline & privacy

- S4 and S11 pass.
- A code search finds no `fetch`, `XMLHttpRequest`, `WebSocket` or `EventSource` in `src/` or `app/`.
- A network monitor (for example, a firewall app on the test phone) shows zero traffic from the app during a full session.

### 9.4 Compatibility

- Android 7.0 (API 24) through Android 16 (API 36).
- Gesture navigation and 3-button navigation.
- Notch, punch-hole and edge-to-edge layouts respect safe areas.

---

## 10. Regression & Release Testing

**Smoke test (every build, ~10 minutes):** launch → Training loads → open a workout → run 2 exercises + 1 rest → quit and save → Report updated → switch theme → export works.

**Release path**

| Step | What | Exit |
|---|---|---|
| 1. Internal testing | Team installs from the internal track | Full regression (§7) + S1–S13 pass |
| 2. Closed testing | **12+ testers opted in for 14 consecutive days** (required for new personal Play accounts) | No open S1/S2 bugs; feedback triaged |
| 3. Production | Staged rollout 10% → 50% → 100% | Each step: crash rate < 0.5%, ANR rate < 0.3%, no new S1/S2 bugs |

Testers send feedback through the Play testing feedback channel or directly to the product owner. The app itself collects nothing.

---

## 11. Defect Management

| Severity | Definition | Example | Rule |
|---|---|---|---|
| **S1 – Blocker** | Crash, data loss, privacy breach, wrong health maths | Import wipes data; kcal off by 10× | Fix before any further testing or release |
| **S2 – Critical** | Core flow broken; no workaround | Rest screen never ends | Fix before the phase exits |
| **S3 – Major** | Feature wrong; a workaround exists | Wrong bolts on one row | Fix before release |
| **S4 – Minor** | Cosmetic or copy issue | 2 dp misalignment | Fix when convenient |

**Bug report template**

```text
Title:        [Area] Short description
Severity:     S1 / S2 / S3 / S4
Build:        version + build type (Expo Go / dev build / release)
Device:       model, Android version, font size, theme
Steps:        1. … 2. … 3. …
Expected:     …
Actual:       …
Evidence:     screenshot / screen recording
```

---

## 12. Test Deliverables & Reporting

| Deliverable | When |
|---|---|
| Unit and component test results + coverage report | Every commit (local) |
| Phase test log (table below) | End of every phase |
| Scenario results S1–S13 | Phase 12 |
| Release sign-off (all exit criteria met) | Before each Play track promotion |

**Phase test log**

| Phase | Date | Build | Tests run | Passed | Failed | Open bugs (S1/S2/S3/S4) | Result |
|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — |

---

## Offline animation expansion — October 5, 2026

Full check passes typecheck/lint and 328 tests across 72 suites with `npm run check -- -- --runInBand --testTimeout=20000`. The initial concurrent export/check run hit one existing five-second browse-test timeout; the complete rerun passed. Tests verify licensed catalog mappings, embedded PNG signatures/data URIs, root/nested background removal, retained fallback, pause/focus/background/Reduce Motion and cobra's single playback segment. The source-title regression prevents assigning the reviewed standing squat to Sit-Up or the seated knee-tuck to Reverse Crunch.

Follow-up: three further demos pass the complete typecheck/lint and 329-test/72-suite check. A regression verifies that the decorative donkey-kick label is removed while its body layer remains. Release preflight passes. The three source compositions have genuine animated properties, no expressions, no font references and no raster dependencies. Offline production Android export passes (4,889 modules; Hermes bundle entry-9fdf8be187aee6705d069395427c4164.hbc). This verifies packaging, not physical playback.

Native follow-up: run all eighteen mapped exercises in airplane mode, including the fifteen previews added after the original three listed in [ANIMATION_COVERAGE](ANIMATION_COVERAGE.md). Check raster parts and nested compositions decode, full-body framing, pause/resume, tab changes, background/foreground, Image selection and Reduce Motion. Cobra must rise once and remain held after returning from background. Compare each demonstration with its instructions and have form/framing approved on a real phone. Automated tests and JS export do not complete this native pass. No APK is built in this task.

## 13. Revision History

October 5, 2026: Free-only follow-up: reviewed original/generated SVG keyframes for Plank and Flutter Kicks. Regression checks preserve plank paths/rotations while cropping unused canvas and enforce single-entry hold playback. Updated isolated guide focus and static-fallback test assumptions. Production Android export passed: 4,891 modules, entry-541f3577a95fbb92ecbd245c83a67212.hbc. Release preflight passed. Final npm run check passes typecheck, lint and 330 tests / 72 suites (153.058 seconds). Installed-device decoding/form/framing and airplane-mode QA remain required for all 20 demos. No APK built.

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version |
| 1.1 | Sep 23, 2026 | Completeness audit: tests for Quiet Mode, content placements, rig coverage, variations, pickers, favourites, recent, goal lists, share card, what's new, achievements screen |
| 1.2 | Oct 1, 2026 | Added local production preflight command and clarified its limits relative to merged APK and Android scenario checks |
| 1.3 | Oct 1, 2026 | Added installed-build reminder/audio follow-up scenarios and limits of automated lifecycle tests |
| 1.5 | Oct 5, 2026 | Offline demo expansion evidence, initial timeout/rerun and required native decoding/hold/framing checks |

| 1.6 | Oct 5, 2026 | Add free plank/flutter-kick demos, reviewed framing and current 20/119 coverage |

| 1.7 | October 13, 2026 | Seven further animation mappings; 116/119, exact exclusions and final validation in ANIMATION_FINAL_REVIEW |

| 1.8 | October 13, 2026 | Complete 119/119 local animation mappings; source limitations and device QA remain documented |
