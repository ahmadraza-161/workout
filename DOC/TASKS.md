# ✅ Project Tasks

October 27 evening — Home redesign in progress; status and ordered to-do list in [NEXT_STEPS](NEXT_STEPS.md).

October 27 — owner Flow clips integrated: 84 videos, coverage 112/119. Remaining 7 listed at top of [VIDEO_PROMPTS](VIDEO_PROMPTS.md). Player releases on blur. Device QA of loops/playback still open; no APK.

October 26 — media reset: removed all third-party MP4 demos (28/119 Lottie remain), regenerated coverage/notices, updated tests. Next: owner generates 91 clips with [VIDEO_PROMPTS](VIDEO_PROMPTS.md); then compress, add via video-candidates.json, build and device-check loops.

October 13 build-helper repair: reproduced and fixed Windows PowerShell 5.1
splitting `--offline` into character arguments (`Task '-' not found`). Repaired
argument forwarding verified in PowerShell 5.1 and 7 for offline/online modes.
No APK built during this repair. Physical QA still needs a connected phone;
ADB detection succeeds outside sandbox but currently lists no device.

October 13 repair verification: final npm run check -- -- --runInBand --testTimeout=20000 passes typecheck, lint and all 347 tests/75 suites (147.368s). Release preflight passes. Production Android JS export passes (4,973 modules, 245 assets, .expo/app-repair-export); exported MD5 bytes verify all 64 active MP4s and all 119 original images, with zero disabled TrainAI videos. All 64 MP4s decode and source SHA256 hashes match. Image audit passes 119 PNGs (11.21 MB) and five character assets. Regression coverage includes native release before guide cleanup/stale events, HeyGainz loop policy, local-image retry, suitable recommendation and Review workout navigation. Intermediate checks exposed a stale recommendation expectation, ungenerated translation keys and a Jest mock-hoisting error; all were corrected before this final pass. Physical Android scenario matrix in APP_REPAIR_PLAN remains open; no APK built.

October 13 repair pass (supersedes historical coverage below): owner rejected TrainAI. Its 27 active mappings are disabled; originals/provenance are archived, not bundled. Current active demos: 92/119 exercise IDs, 28 Lottie + 64 MP4, 88 unique sources; 27 exercises retain their original images. All 32 HeyGainz clips loop; eight previously truncated holds now use complete original GIF cycles. MP4 total 14,142,982 bytes. Native release cleanup is fixed, guide/player image Retry added, and Home offers a suitable no-equipment routine to review before Start. Full plan and physical acceptance matrix: [APP_REPAIR_PLAN](APP_REPAIR_PLAN.md). Native phone reproduction and release QA remain open; no APK built.

Final 119/119 export verification: production Android JS export passes (5,000 modules; .expo/animation-all-exercises-export; 271 assets). All 91 MP4 mappings and all 119 original image mappings match exported MD5 assets; shared sources deduplicate. Release preflight passes. Full check passes typecheck/lint and 342 tests/74 suites (85.696s). Native Android QA remains; no APK built.

October 13 final catalog-wide check: typecheck/lint and all 342 tests across 74 suites pass (85.696 seconds). All three final MP4s decode without errors; Floor Row decoded last pose reviewed. Original-source integrity now also checks the untrimmed Sworkit MP4 hash. Static fallback test uses a missing-demo ID since all 119 catalog IDs are now mapped. The intermediate check collided with asset generation (Windows EBUSY); final checks ran after generators completed and pass. Physical Android form/framing, pose holds, pause/background, Reduce Motion, TalkBack and airplane-mode QA remain pending. No APK built.

October 13 completed animation mapping: **119/119 exercise IDs** now have local demos (28 Lottie + 91 MP4 mappings, 114 unique sources). Final three additions: Arm Pulse (public emireerose/GIPHY), Frog Jump (reviewed Sworkit forward segment), Floor Row Isometric (FitnessProgramer floor-seated scapular retraction entry then hold). MP4 bytes total 14,324,244; twenty MP4 held-pose entries. Images/UI/instructions retained; no runtime network or new dependency. Exact framing/movement limitations and unverified distribution permissions are recorded in ANIMATION_FINAL_REVIEW. Native form/playback QA remains. No APK.

Production Android JS export passes (4,997 modules; .expo/animation-final-seven-export; 268 assets). All 88 MP4 mappings and 119 original image mappings are verified by MD5 in exported metadata; identical shared MP4s deduplicate. Native phone QA remains; no APK built.

October 13 final animation matching pass: 116/119 IDs now have demos, with seven further mappings. Three unresolved movements and exact candidate exclusions are recorded in ANIMATION_FINAL_REVIEW. Original images/UI retained. Typecheck/lint and 342 tests/74 suites pass; release preflight and seven MP4 decode checks pass. Publication permissions and physical Android playback/form QA remain open. No APK.

October 13 remaining animation batch: 32 additional HeyGainz character demos bundled, reaching 109/119 IDs. Ten unmatched exercises remain; exact mismatches are documented in tools/animations/HEYGAINZ-REVIEW.md. Existing images/UI remain, no APK built. Final checks are in TEST_PLAN; native Android QA and media distribution permission remain unresolved.

October 13 animation-only batch: 48 additional downloaded demos integrated; coverage 77/119, with 42 matching demos still required. Existing images remain. Local MP4 playback and single-entry holds share the approved player; original GIFs/source attribution retained. Final checks and device QA are recorded in TEST_PLAN. No APK built.

## October 12 — offline MP4 exercise demo

Owner accepted GIF/MP4/Lottie formats and explicitly approved expo-video. Bundled the verified Vital free Pike Push-Up sample with original red muscle highlights, source hash and offline credit. Preserve Animation/Image choices and all photographs; muted native playback follows pause, focus, foreground and Reduce Motion. Current coverage 29/119, with 90 awaiting matching demos. No APK built; full-check/export/device status in TEST_PLAN.

October 11 Russian Twist import: source access recovered normally; original licensed 195-frame seated torso-rotation demo added. Fixed legs/hips and animated torso reviewed in original frames 0/25/50/75/99. Honest unnamed contributor credit retained (a848f9e4); no new geometry or motion authored. Current coverage 28/119 IDs, 24 unique sources, 91 unresolved, 3,343,861 bundled bytes. All original images/UI retained, no APK built. Final validation: typecheck/lint and all 336 tests across 72 suites pass (279.355 seconds); production Android JS export passes (4,899 modules, .expo/lottie-russian-export), and release preflight passes. Native form/playback and airplane-mode QA remain open.

October 11 further acquisition: located a free Simple License Russian Twists candidate (rx3c7eZtwE), but its preview/download is blocked at automatic browser security verification. Movement/style and supported feet are unverified; do not map it yet. New knee-push-up, calf-raise and wall-push-up results are premium or watermarked video previews. No production changes this pass; coverage stays 27/119, 92 unresolved. Evidence: ANIMATION_SOURCES.

October 11 next animation pass: added Standing Forward Fold using the licensed original Inchworm entry frames 0–24 once, then hold before hand walking. Source reviewed at frames 0/24/30/34/39 and across its full cycle. No custom motion or new unique source claimed. Current coverage 27/119 IDs, 23 unique sources, 92 unresolved, 3,239,591 bundled bytes. Original images/UI retained; no APK built. Final validation: typecheck/lint and 335 tests across 72 suites pass (197.003 seconds); production Android JS export passes (4,898 modules, .expo/lottie-fold-export), and release preflight passes. Native playback/form and airplane-mode QA remain open.

October 11 batch continuation: added Neck Side Stretch (Indrum, original frames 0–60 once then hold), Side Plank (Ajay Gupta, original rotating-plank first entry frames 1–35 once then hold, reviewed viewport), and Shadow Boxing (existing Dinh Punches source, matching staggered stance/alternating punches/guard). No custom motion authored. Current coverage: 26/119 exercise IDs, 23 unique licensed sources, 93 unresolved IDs, 2,934,727 bundled bytes. All 119 images and UI retained; no APK built. Final validation: typecheck, lint and all 334 tests across 72 suites passed; release preflight passed. Android JS export metadata and Hermes bundle verified in .expo/lottie-batch-export. Native form/playback and airplane-mode device QA remain open.

October 11 animation-only continuation: two further exercise IDs now have verified ready-made demos. Push-Up Hold plays original Military Push Ups frames 2–10 once, then holds at shallow elbow flexion. Plank Walkout shares the original Inchworm demo because their catalog instructions describe the same hand-walk movement. These are reused licensed sources, not two new unique downloads or authored animations. Coverage: 23/119 exercise IDs, 21 unique source animations, 96 unresolved IDs, 2,594,038 bundled bytes. All 119 photographs and UI remain. Full check passes typecheck/lint and 332 tests across 72 suites (94.124 seconds). Production Android JS export passes (4,894 modules, .expo/lottie-hold-walkout-export). Native playback/form QA remains open; no APK built.

October 11 owner scope: only exercise animations; do not change UI, design, feel or other features. Existing photographs remain.

October 11 continuation: completed the interrupted High Knees import by Bashir Ahmad under the Lottie Simple License. Original 29-frame alternating thigh/arm motion and floor line are retained. Coverage is 21/119, with 98 IDs still awaiting matching free ready-made demos; bundled JSON totals 2,214,530 bytes. All 119 exercise images remain. Production Android JS export passes (4,892 modules; .expo/lottie-high-knees-export), and release preflight passes. Full check passes typecheck/lint and 331 tests across 72 suites (205.968 seconds). Native phone QA remains open. No APK built.

### Home Workout – Task Breakdown & Development Plan

This document lists every task needed to build and launch Home Workout. Tasks are grouped into phases, each with clear deliverables, priorities and status tracking. A phase starts only after the previous phase's **"Done when"** test passes ([RULES](RULES.md) §14).

| Field | Details |
|---|---|
| **Version** | 1.47 |
| **Last updated** | October 11, 2026 |
| **Current phase** | Engineering passes 1–4 in progress; all exercise, workout and challenge copy is bundled, with editorial, reference and device QA pending |
| **Related** | [PRD](PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [DESIGN](DESIGN.md) · [TEST_PLAN](TEST_PLAN.md) · [DECISIONS](DECISIONS.md) |

---

### October 5 — expanded offline animations

Final free-only pass verification: typecheck/lint and 330 tests across 72 suites pass; production Android export and release preflight pass. Coverage 20/119. Native phone QA remains; no APK built.

Owner clarified free-only Lottie sourcing. Added Blinix Solutions Forearm Plank and Flutter Kicks, now 20/119; 99 still need matching ready-made assets. Plank enters once then holds. Reviewed viewports crop unused canvas while preserving original geometry/timing. Images remain available. Free-versus-paid question is resolved. Final validation is recorded in TEST_PLAN; no APK is built.

Owner continuation: only ready-made animations resembling the existing demos are accepted; custom character authoring was declined. Additional source research excludes ball-supported/decorative movement and silhouette frame libraries. Coverage remains eighteen; 101 IDs still need verified licensed matching assets. No production code/assets or APK changed in this sourcing pass.

Further sourcing: reviewed the four owner-supplied providers and community candidates. Free samples do not add verified matching demos; several actual exercise candidates are premium. See [ANIMATION_SOURCES](ANIMATION_SOURCES.md). Owner budget preference is pending; continue only within the selected sourcing scope. No purchase or new video player has been made.

Owner approved the first animation style and requested expansion. Twelve further matching demos are bundled, for fifteen total, retaining all 119 images and static browse artwork. Source originals, embedded PNGs, creator notices, nested background removal and exact remaining coverage are recorded in [ANIMATION_COVERAGE](ANIMATION_COVERAGE.md). Cobra enters its hold once. Visual/keyframe review excludes wrong variants and maps a mislabeled source to its actual standing squat. Full `npm run check -- -- --runInBand --testTimeout=20000` passes typecheck/lint and 328 tests/72 suites; the first run under concurrent export load had one existing browse-test timeout. Final offline Android export and release preflight pass. The follow-up adds Dead Bug, March in Place and Donkey Kick, preserving author credits and removing only the reviewed decorative caption. Eighteen demos are now bundled. Follow-up full check passes typecheck/lint and 329 tests/72 suites; release preflight passes. New demos require native playback/framing/form QA; 101 exercises still need matching animations. No APK is built.

### October 2 — visible branded startup

Owner-requested improvement/QA pass, excluding APK: startup distinguishes fonts settled from fonts actually loaded, preserving system-font fallback on errors. Resume snapshot write errors are contained with one warning and later retries, without blocking final session persistence. Added audio navigation/cancellation and independent haptics regressions. Full check: 319 tests/69 suites pass; offline release preflight and image audit pass. Physical Android checks remain open (adb profile initialisation fails locally); scope/evidence in TEST_PLAN.

Owner card-spacing follow-up: challenge bodies no longer expand with flex to fill taller carousel neighbours; cards align to their own height, bringing the CTA directly after copy. Character/title placement is retained as requested. Final typecheck/lint and all 315 tests/69 suites pass; native visual confirmation remains pending.

Owner-requested launch loader now has a 1.2-second minimum presentation after layout, a larger branded character logo and accessible progress. Font/storage readiness still gates entry; slow preparation holds the page longer. Reduce Motion skips animation, and completion fires once. `npm run check -- -- --runInBand`: typecheck/lint and all 315 tests/69 suites pass. Native startup visual QA remains pending.

### October 1 — owner full-scroll Training/Discover targets

Onboarding/card validation: existing full check 311 tests/68 suites passes; final typecheck/lint and targeted onboarding/card tests pass, including two added choice/review tests (313 distinct tests/69 suites verified). Android production export passes. Native device visual QA remains open.

Onboarding refinement: branded character welcome with offline/privacy benefits, top Back/progress header, single fixed footer CTA, descriptive goal/level cards, inclusive portrait choices, grouped safety questions, alert-styled form errors and a structured plan review. Original safety validation/profile persistence remain enforced. Owner follow-up: workout-detail "You may also like" recommendations now use blue/purple/slate gradient cards with readable metadata and working workout navigation. No onboarding screenshot exists in the supplied 25 references; native layout comparison remains pending.

Latest branding revision supersedes the earlier Workout Dost mark: **WorkoutStride**, original semi-realistic male/female bodyweight warm-up character art, updated app name/onboarding/share fallbacks, launcher/adaptive/splash/favicon and light/dark wordmarks. Native assets regenerated; typecheck/lint, 311 tests/68 suites and release preflight pass. Prompt/source provenance: [BRANDING](BRANDING.md). Previous delivered APK still needs rebuilding.

Owner-delegated branding implemented as **Workout Dost**, with an original no-equipment jumping-jack/movement-arrow mark, blue/white/lime launcher/adaptive/monochrome icons, splash, favicon and light/dark vector wordmarks. The final mark follows the owner's global/bodyweight clarification. Canonical name/tagline, onboarding, startup and share fallback copy are aligned. Editable sources/rebuild instructions are in [BRANDING](BRANDING.md). Previous APK still carries the old name.

Standalone ARM64 testing APK built successfully at `Home-Workout-arm64.apk` (69,260,342 bytes). Signature and actual APK permissions verified; no INTERNET permission. Minimum API 24/target 36. Local build toolchain documented in [BUILD_APK](BUILD_APK.md); installed-phone QA remains open.

Matched the newly supplied section sequence: compact Training challenge cards, dates-only weekly goal, synchronised swipe/chip body-focus columns, goal/recent before duration links, smaller plain recommendation rows, compact builder promotion without inline empty/saved cards, horizontally paged goal cards and short Explore banner. Discover restores gradient-overlaid beginner/challenge captions, places an equipment banner before the two-row Stretch gallery and uses a full-width featured artwork frame. Equipment opens only workouts containing real catalog equipment exercises. Original bundled assets and safe copy remain; PRO/height-growth/spot-reduction content is excluded. Native pixel comparison remains pending. Verification is recorded in MEMORY.

### October 1 — second UI comparison

Corrected detail-row double insets, added related duration/level, moved Customize to a footer link, reordered featured challenge metadata and implemented rest duration wheels plus nested Default/Custom/enable/Done settings. Controlled wheel reset and exact values/disable behavior have integration coverage. Text-link buttons retain a 48 dp target. `npm run check`: 309 tests/68 suites; Android export passed. Same native pixel/music/custom-quit follow-ups remain in [REFERENCE_AUDIT](REFERENCE_AUDIT.md).

### October 1 — 25-reference comparison pass

Implemented larger challenge portraits/frames and title fitting, corrected header insets/banner typography, grouped Training weekly goal, full-width workout detail with floating back/metadata/introduction, reference Report core order/calendar and grouped Settings navigation. Settings/detail navigation regressions are covered. All 25 screenshots are mapped in [REFERENCE_AUDIT](REFERENCE_AUDIT.md), with actual native pixel verification and remaining music/quit/rest-picker differences explicitly open. `npm run check`: 308 tests/67 suites; Android export passed.

### October 1 — screenshot and startup pass

- Implemented unique covers for 60 workouts, separate heroes for 6 categories/12 challenges and the fourth collection, category descriptions and workout-detail top artwork.
- Removed Discover black caption panels and corrected SVG alpha rendering.
- Restyled onboarding with step progress, male/female portraits, full-width choices, scrolling forms and a safe-area footer. Validation, back and save-once behavior remain tested.
- Startup branding/progress follows font and database readiness before app routes mount.
- `npm run check`: 306 tests/65 suites; Android production export passed. Final phone/reference/splash/dark-mode and TalkBack QA remains open.

## 1. Project Overview

Home Workout is a free, fully offline Android app built with Expo and React Native. Work is split into **13 phases**: planning (Phase 0) plus the 12 build phases from the spec. Task IDs are written as `T<phase>.<number>` in commits and notes, for example `T5.6`.

**Current implementation passes (Oct 1):** Owner originals are preserved; 119 original realistic transparent replacements are now bundled locally. [IMAGE_QA](IMAGE_QA.md) tracks the current visual review, archived original findings and device checks. The passes below keep the original task IDs as the detailed checklist.

| Pass | Scope | Completion gate |
|---|---|---|
| 1. Browse and content | Finish exercise/workout/challenge copy, local search, lists, details and guide | All catalog items browsable with accurate copy; no broken references |
| 2. Guided workouts | Player, timestamp timing, resume, sessions, settings and cues | A full workout survives pause, lock and restart; session saved once |
| 3. Personal app | Onboarding, Training, Discover, Report, challenges, builder, achievements and backup | Every tab and route works offline, with correct progress and accessibility |
| 4. Release polish | Integrate owner images, visual QA, bundle/performance checks, store preparation | 119 image mappings checked; device scenarios and release checks pass |

**Legend**

| Priority | Meaning | Status | Meaning |
|---|---|---|---|
| 🔴 High | Blocks launch or the next task | ✅ Completed | Done and verified |
| 🟠 Medium | Needed for launch | 🔄 In Progress | Being worked on |
| 🟢 Low | Nice to have; can move to v1.1 | ⬜ Not Started | Not begun |
| | | ⛔ Blocked | Waiting on a decision or dependency |

---

## 2. Task Statistics

| Total Tasks | ✅ Completed | 🔄 In Progress | ⬜ Not Started | ⛔ Blocked |
|:---:|:---:|:---:|:---:|:---:|
| **164** | **57** (35%) | **30** (18%) | **77** (47%) | **0** (0%) |

| Phase | Tasks | Completed | Status |
|---|:---:|:---:|---|
| 0 – Planning & Documentation | 18 | 15 | 🔄 In Progress |
| 1 – Foundation | 17 | 16 | 🔄 In Progress |
| 2 – Asset Generators | 20 | 8 | 🔄 In Progress |
| 3 – Content & Lists | 9 | 6 | 🔄 In Progress |
| 4 – Workout Details & Exercise Guide | 8 | 0 | 🔄 In Progress |
| 5 – Workout Player | 17 | 4 | 🔄 In Progress |
| 6 – Onboarding & Profile | 10 | 4 | 🔄 In Progress |
| 7 – Training Tab | 14 | 0 | 🔄 In Progress |
| 8 – Discover Tab | 8 | 0 | 🔄 In Progress |
| 9 – Report Tab | 11 | 1 | 🔄 In Progress |
| 10 – Challenges | 6 | 4 | 🔄 In Progress |
| 11 – Builder, Achievements, Reminders, Backup | 10 | 0 | 🔄 In Progress |
| 12 – Polish & Launch | 16 | 0 | ⬜ Not Started |

Per-exercise production status (119 rows) is tracked in [CONTENT_MAP](CONTENT_MAP.md) §2.

---

## Phase 0: Planning & Documentation

Define the product, design, architecture and working rules before writing code. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 0.1 | Analyse the 25 reference screenshots | 🔴 High | ✅ Completed | Every screen and component catalogued |
| 0.2 | Review spec v3 and the content catalog | 🔴 High | ✅ Completed | Conflicts listed and resolved in the PRD |
| 0.3 | Research exercise animation sources | 🟠 Medium | ✅ Completed | ExerciseDB evaluated, then rejected (ADR-006 → ADR-007) |
| 0.4 | Write the PRD | 🔴 High | ✅ Completed | v1.1 with answered open questions |
| 0.5 | Write ARCHITECTURE.md | 🔴 High | ✅ Completed | |
| 0.6 | Write DESIGN.md | 🔴 High | ✅ Completed | Colours measured from the reference and checked for contrast |
| 0.7 | Write RULES.md | 🔴 High | ✅ Completed | |
| 0.8 | Write TASKS.md | 🔴 High | ✅ Completed | This document |
| 0.9 | Write TEST_PLAN.md | 🔴 High | ✅ Completed | |
| 0.10 | Write SECURITY.md | 🔴 High | ✅ Completed | |
| 0.11 | Write DECISIONS.md | 🔴 High | ✅ Completed | 50 records after the audit |
| 0.12 | Write MEMORY.md | 🟠 Medium | ✅ Completed | |
| 0.13 | Owner review of proposed and pending decisions (ADR-022 to ADR-050) | 🔴 High | ✅ Completed | Owner approved all decisions on Sep 24, 2026 |
| 0.14 | Confirm the final app name and branding | 🟠 Medium | ⬜ Not Started | Needed before Phase 11 (ADR-012) |
| 0.15 | Confirm the Google Play account type | 🟠 Medium | ⬜ Not Started | Planning as a personal account (ADR-020) |
| 0.16 | Choose the build approach: EAS Build or local Gradle | 🔴 High | ✅ Completed | EAS Build chosen (ADR-036); an Expo account is needed before the first cloud build |
| 0.17 | Prepare the dev machine and a test phone | 🔴 High | 🔄 In Progress | Node LTS recommended (26.8.2 installed). Install Expo Go on the phone. JDK 17 + Android SDK only for local builds (JDK 25 installed, no SDK). |
| 0.18 | Completeness audit of the reference, spec, catalog, modules and screens | 🔴 High | ✅ Completed | [COVERAGE](COVERAGE.md) + [CONTENT_MAP](CONTENT_MAP.md); 21 gaps found and closed |

**Done when:** all docs exist, the owner has answered the pending decisions, and the build approach is chosen.

---

## Phase 1: Foundation

Set up the project, theme, translations, database and navigation. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 1.1 | Initialise the Git repository and `.gitignore` | 🔴 High | ✅ Completed | Ignore keystores, build outputs, `node_modules` |
| 1.2 | Create the Expo SDK 57 project (TypeScript, expo-router) in the repo root | 🔴 High | ✅ Completed | Expo 57.0.24, React Native 0.86.3, TypeScript 6 |
| 1.3 | Enable TypeScript strict mode and the `@/` path alias | 🔴 High | ✅ Completed | |
| 1.4 | Set up ESLint and Prettier | 🟠 Medium | ✅ Completed | ESLint also blocks network APIs in app code |
| 1.5 | Write `app.config.ts`: name and package constants, portrait, min SDK 24 / target 36, `allowBackup: false`, permissions per build variant | 🔴 High | ✅ Completed | INTERNET is blocked in production builds only |
| 1.6 | Create the folder structure | 🟠 Medium | ✅ Completed | [ARCHITECTURE](ARCHITECTURE.md) §3 |
| 1.7 | Theme: light and dark tokens, `ThemeProvider`, `useTheme` | 🔴 High | ✅ Completed | [DESIGN](DESIGN.md) §2, §8, §11 |
| 1.8 | Bundle and load Poppins (weights 400–800) | 🟠 Medium | ✅ Completed | Downloaded once with `npm run fonts` |
| 1.9 | i18n: `i18n-js` + `expo-localization` + `en.json` skeleton | 🔴 High | ✅ Completed | |
| 1.10 | Database: Drizzle schema, `drizzle-kit` migrations, migrate on start-up | 🔴 High | ✅ Completed | 11 tables; migrations bundled by `tools/db/bundle-migrations.mts` |
| 1.11 | Typed KV wrapper on `expo-sqlite/kv-store` | 🟠 Medium | ✅ Completed | ARCHITECTURE §6.4 |
| 1.12 | Content pack types, loader and in-memory indexes (with a small sample pack) | 🔴 High | ✅ Completed | The full pack arrives in Phase 2 |
| 1.13 | Root layout: providers, error boundary, bootstrap route | 🔴 High | ✅ Completed | |
| 1.14 | Bottom tabs (Training, Discover, Report, Settings) with placeholder screens | 🔴 High | ✅ Completed | |
| 1.15 | Core UI primitives v1: Text, Screen, Button, Card, Icon, Sheet | 🔴 High | ✅ Completed | Grown into the full 40-component shared library (ADR-051); reviewed in `app/dev/components` |
| 1.16 | Set up Jest + React Native Testing Library with first tests | 🔴 High | ✅ Completed | 37 tests passing |
| 1.17 | Run the app on a real Android phone with Expo Go | 🔴 High | ⬜ Not Started | Needs the owner's phone: install Expo Go, run `npx expo start`, scan the QR code |

**Done when:** tabs navigate, the theme switches between light and dark, i18n works, the database migrates and the content pack loads.

---

## Phase 2: Asset Generators

> **Exercise-media scope — ADR-056/060:** Use one locally bundled, full-colour static pose per exercise. Original realistic male/female replacements supersede the preserved owner JPEGs, with [IMAGE_QA](IMAGE_QA.md) recording visual checks. T2.9–T2.12 and T2.19 animation work is paused; historical statuses below describe the old rig. T4.1 renders bundled static images with a missing-image fallback. Timer/player behavior is unchanged.

**Image work, split into four sub-phases:**

| Sub-phase | Deliverable | Status / gate |
|---|---|---|
| A. Style proof | One original full-colour pose with a clean silhouette, local preview and provenance | 🔄 Side-plank study and owner images bundled; clean-background and phone review pending |
| B. Catalog | Original realistic replacements; check form and exact filenames | 🔄 119/119 transparent files mapped and contact-sheet reviewed; final trainer/form approval pending |
| C. App wiring | Static asset manifest, exercise thumbnails, detail/guide/player image, and missing-image fallback | 🔄 All 119 statically bundled and major surfaces wired; device visual check pending |
| D. QA | Check all 119 poses at list and player sizes, both themes, TalkBack, airplane mode and bundle-size budget | ⬜ Device verification pending |

Generated artwork may fill the catalog where licensed external images cannot provide a consistent, clear pose. Never use remote image URLs in the app.

Generate every asset locally with TypeScript scripts in `tools/`. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 2.1 | Generator toolchain: `tools/` + `npm run assets` | 🔴 High | ✅ Completed | Reads DOC/CONTENT_MAP.md directly, so the catalog has one copy (ADR-054) |
| 2.2 | Exercise metadata for all 119 exercises | 🔴 High | ✅ Completed | Catalog fields parsed; muscles, MET and defaults authored in `tools/content/metrics.ts` |
| 2.3 | Exercise copy for all 119 exercises | 🔴 High | 🔄 In Progress | Original 3+3+3 guide lines bundled for 119/119; individual form and editorial safety review pending |
| 2.4 | Workout generator: 60 workouts from the rules in PRD §8.2 + intros | 🔴 High | 🔄 In Progress | 60/60 intros bundled; reviewed pools now honor special and targeted stretch titles; durations within ±1 min; individual workout/device QA pending |
| 2.5 | Challenge generator: 12 schedules from PRD §8.3 + copy | 🔴 High | 🔄 In Progress | 12/12 descriptions bundled; schedule and device/editorial review pending |
| 2.6 | Categories (6 tiles) and Discover section config | 🟠 Medium | ✅ Completed | Tiles built from each workout's own tile column; 4 collections, all names resolved |
| 2.7 | Achievements: 35 definitions with unlock conditions | 🟠 Medium | ✅ Completed | 35 rules written out by hand and paired against the catalog, not regex-parsed |
| 2.8 | Content validator: IDs, references, counts, durations, banned words | 🔴 High | ✅ Completed | 13 tests prove it catches each class of error, not just that it passes |
| 2.9 | Character rig: flat 2D humanoid, joint hierarchy, 2 palettes | 🔴 High | ✅ Completed | Two flat tones per part; `src/modules/demo/rig` (ADR-052) |
| 2.10 | Base pose library: standing, plank, lying on back, lying on front, all fours, seated, side plank, kneeling, inverted, transitions | 🔴 High | ⬜ Not Started | [CONTENT_MAP](CONTENT_MAP.md) §5 |
| 2.11 | Pose sets for all 119 exercises + Lottie exporter | 🔴 High | ⬜ Not Started | Interpolation, seamless loop, motion arcs, < 40 KB each |
| 2.12 | Dev-only exercise-media preview | 🟠 Medium | 🔄 In Progress | `npm run images:qa` verifies all 119 decodes/mappings with white/blue sheets and five blue/dark character previews. Current realistic images reviewed; original nine P1/seven P2 findings archived. Final trainer/form and phone QA remain |
| 2.13 | Muscle map SVG, front and back, with named muscle groups | 🔴 High | ✅ Completed | All 19 groups; vendored MIT anatomy paths (ADR-055), colours left to the theme |
| 2.14 | Workout and challenge artwork data (silhouette + pattern) | 🟠 Medium | ⬜ Not Started | Rendered as vectors at runtime (ADR-024) |
| 2.15 | UI Lottie: spinner, streak flame, achievement pop, goal ring, celebration | 🟢 Low | ⬜ Not Started | < 25 KB each |
| 2.16 | Sounds: `beep_short`, `beep_long`, `complete`, `achievement` | 🟠 Medium | ✅ Completed | 22.05 kHz mono; 44.1 kHz and < 25 KB together cap a sound at 0.29 s |
| 2.17 | Branding: app icon, adaptive icon, splash, notification icon, 6 empty-state illustrations | 🟠 Medium | ⬜ Not Started | PNG rendering approach pending (ADR-038) |
| 2.18 | `build-assets`: run everything, print the size report, fail on budget; write `DOC/ASSETS.md` | 🔴 High | ⬜ Not Started | |
| 2.19 | Rig views (Side / Front / Top) and props (wall, chair, doorway, water bottles, floor line) | 🔴 High | 🔄 In Progress | Side and Front verified; Top and the chair, doorway and bottle props still to check |
| 2.20 | Content data: resolved variations, quiet swaps, equipment values, muscle groups, collections, placements, badge rules | 🔴 High | ⬜ Not Started | From [CONTENT_MAP](CONTENT_MAP.md) (ADR-040 to ADR-050) |

**Done when:** every asset is generated, validated and within budget, and ASSETS.md explains how to replace each one.

---

## Phase 3: Content & Lists

Make the content browsable and searchable. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 3.1 | Content repository API: by ID, filters, related workouts | 🔴 High | ✅ Completed | Local lookup, filter, search and related-workout ranking |
| 3.2 | `ListRow` component + generic list screen `/list/[type]` | 🔴 High | ✅ Completed | Workout, exercise and challenge lists use local content |
| 3.3 | Map quick filters and every "More >" to list types | 🟠 Medium | ⬜ Not Started | |
| 3.4 | Search screen: recent searches, results grouped by Workouts / Exercises / Challenges | 🟠 Medium | ✅ Completed | Grouped local results and recent-search KV history |
| 3.5 | Favourites: table, toggle, favourites list | 🟠 Medium | ✅ Completed | KV-backed toggle on workout details; list under Settings |
| 3.6 | Loading, empty and error states for lists | 🟠 Medium | ✅ Completed | `LoadingState`, `EmptyState`, `ErrorState` in `core/ui` |
| 3.7 | Unit tests: filters, search, related | 🔴 High | ✅ Completed | Deterministic query and ranking tests added |
| 3.8 | Goal lists: challenges first as "N-day plan" rows, then workouts | 🟠 Medium | ⬜ Not Started | Reference `…131652…` |
| 3.9 | "Recent" list opened by the Discover history icon | 🟢 Low | ⬜ Not Started | Completed workouts, newest first |

**Done when:** filters by body focus, level, duration and goal, and search, all return correct results.

---

## Phase 4: Workout Details & Exercise Guide

Show what a workout contains and how to do each exercise. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 4.1 | Exercise media: bundled static pose, list/detail/player display and missing-image fallback (ADR-056) | 🔴 High | 🔄 In Progress | All 119 original realistic transparent replacements mapped (11.21 MB); 60 male/59 female prompt assignments and mixed/female browse portraits. Muscle-relevant actual workout covers, compact Discover rows/category heroes and per-surface framing wired. Full-catalog form/edge and native/reference approval remain; previous owner-JPEG findings are historical |
| 4.2 | `ExerciseThumb` and `Artwork` vector components | 🔴 High | ⬜ Not Started | |
| 4.3 | Workout details screen | 🔴 High | 🔄 In Progress | Route, local title/meta, exercise list, related workouts, favourite and Start; reference visual polish pending |
| 4.4 | Full exercise list view | 🟠 Medium | ⬜ Not Started | |
| 4.5 | Exercise guide sheet: Animation / Muscle / How to do + fixed sections | 🔴 High | 🔄 In Progress | Transparent modal sheet with rounded top, dimmed background, reference typography, scrollable sections and fixed Close; tabs/Close tested; phone visual, Android Back and TalkBack QA pending |
| 4.6 | `MuscleMap` component with primary and secondary highlights | 🔴 High | 🔄 In Progress | Runtime front/back paths and theme highlights implemented; phone visual and accessibility QA pending |
| 4.7 | Edit icon → builder pre-filled with this workout | 🟢 Low | 🔄 In Progress | Customize action copies the catalog workout into the three-step builder; native navigation/layout QA remains. |
| 4.8 | "Easier" / "Harder" buttons in the guide (valid links only) | 🟢 Low | ⬜ Not Started | CONTENT_MAP §3 (ADR-040) |

**Done when:** animations loop, the fallback works and the guide sheet shows every section.

---

## Phase 5: Workout Player

The heart of the app: guided, interruption-proof workouts. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 5.1 | Engine state machine: IDLE → PREP → EXERCISE → REST → COMPLETE, PAUSED, QUIT | 🔴 High | 🔄 In Progress | Pure timestamp engine, per-item results, pause, quit save/discard; device QA pending |
| 5.2 | Timestamp timing, pause/resume, fast-forward on return to the foreground | 🔴 High | 🔄 In Progress | Timestamp catch-up and pause/resume tested; phone lock/device QA pending |
| 5.3 | Snapshot to KV on every phase change + "Resume workout?" (< 2 h) | 🔴 High | ✅ Completed | Validated KV snapshot and bootstrap resume prompt |
| 5.4 | P1 Ready screen: ring countdown and skip | 🔴 High | 🔄 In Progress | Ring countdown and skip wired; cues and phone visual QA pending |
| 5.5 | P2 Exercise screen: timer, or reps + Done + adjuster; prev/pause/next; thumbs | 🔴 High | 🔄 In Progress | Reference-style controls, previous replay, timer, reps adjuster, image, guide and local thumbs controls wired; device QA pending |
| 5.6 | P3 Rest screen: blue panel, next exercise, +20s, Skip, Edit rest time | 🔴 High | 🔄 In Progress | Next image, countdown, +20s, Skip and edit sheet wired; reference/phone QA pending |
| 5.7 | P4 Pause overlay and P5 quit confirmation (save partial / discard) | 🔴 High | 🔄 In Progress | Header and Android Back pause before one quit dialog; cancel stays paused, Save/Discard follow the existing flow. Back cannot bypass a failed/pending finish save. Shared sheets close before the player handles Back. Component tests pass; pause/quit reference presentation and native QA remain. |
| 5.8 | P6 Finish screen: stats, streak, weekly ring, badges, share, feedback | 🔴 High | 🔄 In Progress | Saved-session stats, streak, weekly active-day ring, badges, difficulty feedback, retry and navigation work. Local share card uses theme colours, fonts, translation keys and configured app name; light/dark regression tests pass. Device rendering/share QA pending |
| 5.9 | Cues: voice, beeps, haptics, ducking, silent mode | 🟠 Medium | 🔄 In Progress | Local countdown/transition/finish sounds and independent haptics; background immediately stops audio, pending cues cancel on pause/settings changes, native errors are contained. Hook lifecycle tests added. Ducking/silent-mode policy retained. Offline voice and native/audio QA remain. |
| 5.10 | Workout Settings sheet: music note + ducking, sound options, rest timer, prep timer | 🟠 Medium | 🔄 In Progress | Scrollable reference-style sheet pauses player; saved sound/vibration, rest and prep controls. Timer edits apply next workout; explicit Resume continues current workout. Device/reference QA remains. |
| 5.11 | Keep the screen awake during PREP, EXERCISE and REST only | 🟠 Medium | 🔄 In Progress | Wake lock only while focused, foreground and unpaused; removed on completion. Device lock/background checks remain. |
| 5.12 | Save sessions and session items + kcal calculation | 🔴 High | ✅ Completed | One SQLite transaction; idempotent session ID and MET-based kcal |
| 5.13 | Save exercise thumbs ratings to `exercise_prefs` | 🟢 Low | 🔄 In Progress | Ratings survive validated snapshots/resume and save with completed or partial sessions; selected controls are disabled and preferences update local ranking. Device QA pending |
| 5.14 | Unit tests: state machine, timing, fast-forward, snapshot, kcal | 🔴 High | ✅ Completed | Pure engine, snapshot, quiet plan and kcal tests pass |
| 5.15 | Device scenarios S1–S3: phone call, screen lock, app killed | 🔴 High | ⬜ Not Started | [TEST_PLAN](TEST_PLAN.md) §8 |
| 5.16 | Quiet Mode: swap jumping exercises for their quiet versions | 🟠 Medium | ✅ Completed | Local setting resolves swaps before player start; resumed plan stays stable |
| 5.17 | Share card: SVG → PNG → share sheet | 🟠 Medium | 🔄 In Progress | Local SVG exports to a cache PNG through the system share sheet; no body data appears on the card; device QA pending |

**Done when:** a full workout survives a phone call, a screen lock and the app being killed.

---

## Phase 6: Onboarding & Profile

Get a new user to their first workout in under 60 seconds. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 6.1 | Bootstrap routing: first run, resume prompt or tabs | 🔴 High | ✅ Completed | First launch goes to onboarding; later launch checks resumable workout, then tabs |
| 6.2 | Welcome slides (3) | 🟠 Medium | 🔄 In Progress | One quick welcome step; reference slides still pending |
| 6.3 | Gender, goal and level steps | 🔴 High | 🔄 In Progress | Selections persist in profile; character variant awaits image integration |
| 6.4 | Body data step: height, weight, birth year (18+ only), skippable | 🔴 High | ✅ Completed | Optional fields validate adult birth year and sane measurement ranges; separate 18+ confirmation required |
| 6.5 | Schedule step: days per week + reminder time | 🟠 Medium | 🔄 In Progress | Weekly target persists; optional reminder setup opens the existing weekday/time/permission screen and reflects the saved schedule on return. Continue without setup never requests notification permission. Native first-run/navigation/delivery QA remains. |
| 6.6 | Safety step: PAR-Q questions + disclaimer; any "yes" shows advice to see a doctor | 🔴 High | 🔄 In Progress | Seven paraphrased general questions; yes shows advice and prevents auto-start; full PAR-Q+ follow-up/medical review pending |
| 6.7 | Ready step: plan summary → Start first workout | 🔴 High | ✅ Completed | Safe path starts a short local workout; yes-answer path opens browse |
| 6.8 | Profile repository and store | 🔴 High | 🔄 In Progress | SQLite profile save/read/edit; Zustand store pending |
| 6.9 | Settings tab (core): profile, weekly goal, units, theme, sound and timers, quiet mode, disclaimer, privacy, about | 🔴 High | 🔄 In Progress | Units selector now persists across Profile and Report (kg/lbs, cm/ft-in); privacy, adult exercise disclaimer and config-derived About available offline in sheets. Profile/goal, theme, quiet mode, cues/timers and favourites implemented. Offline voice, native/reference, font-scale and TalkBack QA remain. |
| 6.10 | Date picker (calendar sheet) and time picker (hour/minute wheels) | 🔴 High | ✅ Completed | Built on `date-fns`, no extra package |

**Done when:** a new user reaches a running workout in under 60 seconds.

---

## Phase 7: Training Tab

Build the main screen with all 13 sections. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 7.1 | Header (app name + streak flame) and search pill | 🔴 High | 🔄 In Progress | App name, live streak action and search work; phone visual QA pending |
| 7.2 | Weekly Goal card + edit-target sheet | 🔴 High | 🔄 In Progress | Saved weekly progress, seven-day strip and 1–7 target sheet work; phone visual QA pending |
| 7.3 | Challenge carousel with gradient cards | 🔴 High | 🔄 In Progress | Goal-ranked gradient carousel, metadata cards and plan navigation work; device/reference QA pending |
| 7.4 | Body Focus chip tabs + 3 level rows with bolts | 🔴 High | 🔄 In Progress | Eight focus tabs, three level rows and accessible difficulty bolts work; phone visual QA pending |
| 7.5 | Quick filter chips (2 scrolling rows) | 🟠 Medium | 🔄 In Progress | Duration, goal and warm-up chips route into bounded catalog filters; phone visual QA pending |
| 7.6 | Custom Workout card + saved custom workouts | 🟠 Medium | 🔄 In Progress | Training preview and full saved-workout list with create/start/edit/delete; phone/reference QA remains. |
| 7.7 | Recommended banner | 🟢 Low | 🔄 In Progress | Goal-matched collection banner opens its catalog; phone visual QA pending |
| 7.8 | Just For You (2 rows + More) | 🟠 Medium | 🔄 In Progress | Two-row local recommendation carousel and More list work; phone visual QA pending |
| 7.9 | Stretch & Warm Up (2-up cards + More) | 🟠 Medium | 🔄 In Progress | Original warm-up/stretch pair and 12-item More list work; phone visual QA pending |
| 7.10 | Popular Goals (chip tabs + 3 rows + More) | 🟠 Medium | 🔄 In Progress | Goal tabs, rows and goal-filtered More list work; phone visual QA pending |
| 7.11 | Explore more banner | 🟢 Low | 🔄 In Progress | Discover entry banner works; phone visual QA pending |
| 7.12 | Feedback: "Tell us what you need" → local note that can be exported | 🟢 Low | 🔄 In Progress | Local note sheet persists in the existing backup preference; phone sheet QA pending |
| 7.13 | Suggestion ranking: level, goal, disliked exercises ranked lower | 🟠 Medium | 🔄 In Progress | Deterministic local ranking excludes the last three days and lowers disliked moves; device QA pending |
| 7.14 | "Weekly goal reached" modal (once per week) | 🟠 Medium | ⬜ Not Started | System modal (spec §9.14) |

**Done when:** all 13 sections render, navigate correctly and look right in light and dark.

---

## Phase 8: Discover Tab

Build the browse surface: banners, curated sections, body-focus tiles and category pages. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 8.1 | Header (search + history) and featured banner | 🟠 Medium | 🔄 In Progress | Search, completed-history route and weekly rotating local featured banner work; phone QA pending |
| 8.2 | Picks for you rows | 🟠 Medium | 🔄 In Progress | Two-row locally ranked carousel and More list work; phone QA pending |
| 8.3 | Collection banner | 🟢 Low | 🔄 In Progress | Stay Active Every Day collection banner opens its catalog; phone QA pending |
| 8.4 | For beginners (3-up cards) | 🟠 Medium | 🔄 In Progress | Shortest level-one media carousel works; phone QA pending |
| 8.5 | Fast workout rows | 🟠 Medium | 🔄 In Progress | Five authored quick workouts appear in a two-row carousel and More list; phone QA pending |
| 8.6 | Challenge (3-up cards) | 🟠 Medium | 🔄 In Progress | Ordered challenge media carousel and full list work; phone QA pending |
| 8.7 | Stretch (2-row horizontal grid) | 🟠 Medium | 🔄 In Progress | Twelve approved stretch/warm-up entries appear in the horizontal grid; phone QA pending |
| 8.8 | 6 body-focus tiles + category screen | 🔴 High | 🔄 In Progress | Six dark tiles open category heroes and bounded catalog lists; phone QA pending |

**Done when:** every section opens the right list, category or workout.

---

## Phase 9: Report Tab

Show progress: activity totals, history, streaks, weight and BMI. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 9.1 | Summary card (workouts, kcal, minutes) + period toggle | 🔴 High | 🔄 In Progress | Week/month/total SQLite summary works; phone visual QA pending |
| 9.2 | History week strip, day streak, personal best | 🔴 High | 🔄 In Progress | Completed-day strip, current/best streak and personal-best rows work; phone visual QA pending |
| 9.3 | Streak and weekly-goal logic + unit tests (month and year boundaries) | 🔴 High | ✅ Completed | Distinct local days ≥50%; Sunday week, year/leap-month/gap tests |
| 9.4 | Weight log sheet: date, kg/lbs, ruler picker | 🔴 High | 🔄 In Progress | Past-date selection, one entry per day, kg storage and unit switch work; phone picker QA pending |
| 9.5 | Weight chart (SVG) + current / heaviest / lightest | 🔴 High | 🔄 In Progress | Seven dated measurements and min/max/current work; phone visual QA pending |
| 9.6 | BMI card: scale, category, height edit | 🔴 High | 🔄 In Progress | Adult BMI calculation, categories, marker and height edit work; phone visual/safety QA pending |
| 9.7 | Personal bests: longest plank, most reps in a set, longest workout | 🟠 Medium | 🔄 In Progress | Derived from saved sessions/items, including older workouts; phone visual QA pending |
| 9.8 | Achievements preview (grid + More) | 🟠 Medium | 🔄 In Progress | Report card shows saved unlocks and opens the full list; phone visual QA pending |
| 9.9 | All records: month calendar → day sessions → session detail | 🟠 Medium | 🔄 In Progress | Marked month calendar, dated session list and exercise-level detail routes work; phone navigation QA pending |
| 9.10 | Unit tests for kcal, BMI and aggregations; scenarios S9 and S10 | 🔴 High | 🔄 In Progress | Aggregation, conversion and BMI boundary tests pass; phone scenarios pending |
| 9.11 | Achievements screen: all 35 badges, locked and unlocked | 🟠 Medium | 🔄 In Progress | `/achievements` groups all 35 with saved locked/unlocked state; phone accessibility/visual QA pending |

**Done when:** stats, streak, weight and BMI match hand calculations.

---

## Phase 10: Challenges

Multi-day plans with a day-by-day grid and progression that survives restarts. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 10.1 | Challenge list with filter chips | 🔴 High | ✅ Completed | All, muscle, fat, full-body and flexibility filters on the local list |
| 10.2 | Challenge detail: hero, day grid (done / today / locked / rest), Start Day N | 🔴 High | 🔄 In Progress | Gradient hero metadata, responsive day grid and current-day Start action work; device QA pending |
| 10.3 | Day progression and persistence | 🔴 High | 🔄 In Progress | Sessions carry challenge ID/day; current day reconciles from saved 100%-complete sessions; device restart QA pending |
| 10.4 | Single-exercise ramp challenges (Plank, Push-Up, Squat) | 🟠 Medium | ✅ Completed | Authored per-day seconds/reps and sets resolve into local player workouts |
| 10.5 | Restart or leave a challenge | 🟢 Low | ✅ Completed | Restart sets a new run timestamp without deleting workout history; leave marks abandoned |
| 10.6 | Unit tests for progression | 🔴 High | ✅ Completed | Covers sequential unlock, rest days, finish and old-run isolation |

**Done when:** finishing Day 1 unlocks Day 2 and progress survives an app restart.

---

## Phase 11: Builder, Achievements, Reminders, Backup

The remaining features: custom workouts, badges, local reminders and data portability. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 11.1 | Gate: confirm the final app name and update the constant | 🔴 High | ⬜ Not Started | ADR-012 |
| 11.2 | Builder steps 1–3: name and focus, exercise picker, per-exercise settings + reorder | 🔴 High | 🔄 In Progress | Name/focus, local searchable picker, repeated sets, targets/rest, reorder/remove and discard confirmation implemented. Android Back moves within steps, then confirms unsaved discard; duplicate dialogs guarded and tested. Phone keyboard/Back, layout and TalkBack QA remain. |
| 11.3 | Save, edit, delete and run custom workouts | 🔴 High | 🔄 In Progress | SQLite CRUD, Training list, catalog-copy entry and existing player/resume integration. Per-item rest respects global OFF. Editing/deleting clears matching resume; deletion retains session history. Native full-flow QA remains. |
| 11.4 | Achievements evaluator + celebration modal | 🟠 Medium | 🔄 In Progress | 35 catalog rules evaluate from saved sessions; unlocks persist and workout completion shows a static celebration modal. Lottie asset and phone QA pending |
| 11.5 | Reminders: permission primer, day toggles, time, survives reboot | 🟠 Medium | 🔄 In Progress | Saved weekdays/time, primer/denial recovery and serialized fixed identifiers. Scheduling rechecks permission/channel; missing channels fail safely. Default system sound enabled for owned reminders. Cancellation attempts every day despite individual failures. Expo native reboot receiver installed; reboot, battery, timezone and delivery QA pending. No exact-alarm permission. |
| 11.6 | Backup export | 🔴 High | 🔄 In Progress | Settings → Backup and data shares validated version-two JSON with all 11 tables and preferences, including custom focus/rest plans. Version-one import remains supported. Unfinished player snapshot excluded. Native share/file-provider QA remains. |
| 11.7 | Backup import (validated, transactional) + Reset all data | 🔴 High | 🔄 In Progress | 5 MB limit, complete field/range/relationship validation, replacement confirmation, attached-KV SQL rollback, theme reload and reminder reconciliation. Reset requires two confirmations and returns to onboarding. Native round-trip/process-interruption QA remains. |
| 11.8 | Settings: reminders, backup, credits and licences screens | 🟠 Medium | 🔄 In Progress | Reminders/backup linked; offline credits sheet searches bundled notices and opens selectable full text. Native sheet navigation/Back and reference QA remain. |
| 11.9 | Unit tests for builder, achievements and backup; scenarios S6 and S7 | 🔴 High | 🔄 In Progress | Builder validation/reorder/component flow, actual-SQLite CRUD/history retention, per-item player rest and backup compatibility tests added alongside achievement/reminder and backup rollback tests. Device S6/S7 remain. |
| 11.10 | "What's new" modal after an app update | 🟢 Low | ⬜ Not Started | Uses `app.lastVersionSeen` |

**Done when:** the builder works, badges unlock, a reminder fires after a reboot, and export → reset → import restores all data.

---

## Phase 12: Polish & Launch

Accessibility, performance, the release build and the path to production on Google Play. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 12.1 | Accessibility pass: TalkBack, 200% font, contrast, touch targets | 🔴 High | ⬜ Not Started | |
| 12.2 | Dark theme review of every screen | 🔴 High | ⬜ Not Started | |
| 12.3 | Performance pass: cold start, lists, Lottie first frame, memory | 🔴 High | ⬜ Not Started | PRD §11 budgets |
| 12.4 | Low-end device test (2 GB RAM) | 🔴 High | ⬜ Not Started | Scenario S5 |
| 12.5 | Release build: R8 + resource shrinking, AAB under 40 MB | 🔴 High | ⬜ Not Started | ProGuard keep rules for Lottie and Reanimated if needed |
| 12.6 | Verify the release manifest: no INTERNET, only the notification runtime permission | 🔴 High | 🔄 In Progress | `npm run qa:release` checks production manifest removal directives, backup/updates off and network-free sources. Merged APK inspection and device S11 remain; SDK/adb unavailable locally |
| 12.7 | Full regression and every scenario test | 🔴 High | ⬜ Not Started | [TEST_PLAN](TEST_PLAN.md) |
| 12.8 | Privacy policy (`DOC/PRIVACY.md`) hosted on GitHub Pages | 🔴 High | ⬜ Not Started | Required URL for Play |
| 12.9 | `DOC/LICENSES.md` + credits screen content | 🟠 Medium | 🔄 In Progress | Poppins, muscle-map, Lucide, Material Symbols and installed production dependency notices bundled offline. Generated LICENSE_AUDIT tracks missing upstream texts; owner-image provenance and final native-library/bundle licence review remain. |
| 12.10 | Store listing: title, descriptions, screenshots, feature graphic, icon | 🔴 High | ⬜ Not Started | |
| 12.11 | Play Console forms: Data safety, Health apps declaration, content rating (18+), target audience, ads (none) | 🔴 High | ⬜ Not Started | |
| 12.12 | Write `DOC/PLAY_CHECKLIST.md` | 🟠 Medium | ⬜ Not Started | |
| 12.13 | Internal testing track | 🔴 High | ⬜ Not Started | |
| 12.14 | Closed testing: 12+ testers for 14 consecutive days | 🔴 High | ⬜ Not Started | Start early (ADR-020) |
| 12.15 | Fix closed-test feedback | 🔴 High | ⬜ Not Started | |
| 12.16 | Apply for production access; staged rollout (10% → 50% → 100%) | 🔴 High | ⬜ Not Started | Watch Android vitals |

**Done when:** all mandatory tests pass, every budget is met, and the app is live on Google Play.

---

## Summary

- **Now:** 119 original realistic transparent replacements are bundled, with male/female/pair art and muscle-relevant covers; 302 tests pass. Owner sources remain preserved.
- **Next:** approve final exercise form/edges and run phone/reference/player checks, including small-screen readability and final AAB budget.
- **Critical path:** real-device player QA, individual image form review and the remaining app screens.
- **Start early:** the 14-day closed test (T12.14) cannot be shortened, so internal testing should begin as soon as the app is usable.

---

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version: 152 tasks across 13 phases |
| 1.1 | Sep 23, 2026 | Completeness audit: 12 tasks added (T0.18, T2.19, T2.20, T3.8, T3.9, T4.8, T5.16, T5.17, T6.10, T7.14, T9.11, T11.10); 164 tasks in total |
| 1.2 | Sep 28, 2026 | Pause exercise animation work; start licensed static-image sourcing and local sample preview (ADR-056) |
| 1.3 | Sep 29, 2026 | Split full-colour static image rollout into style, catalog, integration and QA sub-phases |
| 1.4 | Sep 29, 2026 | Owner takes image generation; 119 prompts prepared; offline content search and detail implementation started |
| 1.5 | Sep 29, 2026 | Added session save/resume, quiet swaps, settings, favourites, report totals, Training browse, full catalog lists and challenge schedule browsing; tracked remaining UI and device work |
| 1.6 | Sep 29, 2026 | Challenge sessions now carry day context; list filters, sequential progress, rest-day skip, single-exercise ramp workouts, leave/restart and progression tests added |
| 1.7 | Sep 29, 2026 | Added first-run onboarding gate, optional body data with 18+ confirmation, seven-question safety check, saved profile editing and first-workout entry; tracked remaining welcome/reminder/safety work |
| 1.8 | Sep 29, 2026 | Added week/month/total report totals, local-day streak and weekly-goal aggregation, editable target card on Training and Report, and date-boundary tests; phone visual QA remains |
| 1.9 | Sep 29, 2026 | Added local weight logging with dated kg/lbs input, SVG trend and extremes, adult BMI card and editable height; 182 tests pass, device QA pending |
| 1.10 | Sep 29, 2026 | Added all-records calendar and session detail routes, tappable recent history, three derived personal bests and calendar interaction tests; device QA pending |
| 1.11 | Sep 30, 2026 | Added 35-badge evaluator, persistent unlock reconciliation, Report preview, grouped achievements route and static completion celebration; 195 tests and Android export pass, phone/reference visual QA pending |
| 1.12 | Sep 30, 2026 | Integrated all 119 owner JPEGs through an optimized offline manifest, added player/finish image and stats views, recorded image QA findings and remaining phone checks |
| 1.13 | Sep 30, 2026 | Added previous-exercise replay with result rollback, reference-style exercise controls and rest actions with edit sheet; phone visual QA remains |
| 1.14 | Sep 30, 2026 | Bundled original 3+3+3 guide copy for all 119 exercises, added runtime muscle map and guide sections, and linked player guide with pause/snapshot; editorial and reference/device QA remain |
| 1.15 | Sep 30, 2026 | Bundled original intros for 60 workouts and descriptions for 12 challenges; corrected named workout pools whose generated exercises did not match their titles; 203 tests pass, device QA remains |
| 1.16 | Sep 30, 2026 | Adapted the guide route to a reference-style modal sheet with fixed Close and matching title/section typography; 204 tests pass, native visual/navigation QA remains |
| 1.17 | Sep 30, 2026 | Added player settings, local audio cues, phase haptics and screen-awake lifecycle; offline voice and native QA remain |
| 1.18 | Sep 30, 2026 | Added local weekly reminders, permission primer, saved time/day controls and reconciliation tests; native delivery/reboot QA remains |
| 1.19 | Sep 30, 2026 | Added versioned backup export, validated transactional import and double-confirm reset, with full-table SQLite round-trip/rollback tests; native provider and process-interruption QA remains |
| 1.20 | Sep 30, 2026 | Implemented custom workout builder, CRUD, Training/player/history integration and version-two backup compatibility; native flow/reference QA remains |
| 1.21 | Sep 30, 2026 | Added offline information/licence sheets and durable unit selection across Profile/Report; native UI and release licence audit remain |
| 1.22 | Sep 30, 2026 | Wired optional first-run reminder setup and focused Android Back handling for sheets, builder, onboarding, reminders and player; native/device QA remains |
| 1.23 | Sep 30, 2026 | Added reference-structured Training and Discover browse sections, local ranking/filters, category and collection routes, challenge gradient hero/day grid, and navigation/component coverage tests; device visual QA remains |
| 1.24 | Sep 30, 2026 | Added player exercise ratings and finish progress/feedback persistence; share card and device visual QA remain |
| 1.25 | Oct 1, 2026 | Added body-data-free local workout share card export through SVG, cache PNG and the system share sheet; device QA remains |
| 1.26 | Oct 1, 2026 | Fixed duplicate completion handler, retained ratings across resume/partial saves, froze completed-session end time during retries, surfaced feedback failures and bounded share rendering; device QA remains |
| 1.27 | Oct 1, 2026 | Added repeatable offline production preflight and regression tests; replaced the old remote muscle-map preview with the bundled guide. Merged APK and real-device QA remain |
| 1.28 | Oct 1, 2026 | Hardened reminder permission/channel checks and cancellation, enabled owned reminder sounds, and tested audio background/pending-cue/error handling. Native sound/delivery/reboot QA remains |
| 1.29 | Oct 1, 2026 | Added repeatable image audit/contact sheets and reviewed all 119 assets; recorded nine priority replacements and seven clarity/style improvements. Owner assets remain unchanged; final visual approval is open |
| 1.30 | Oct 1, 2026 | Added weekly progress ring, corrected active-day wording and aligned completion share card with theme, typography, translation keys and configured app name. Native visual/share QA remains |
| 1.31 | Oct 1, 2026 | Compared reference artwork framing, added three transparent male browse characters and one cleaned squat, separated card/hero/player image slots, and preserved alpha in the build. Remaining cutout folder and phone QA pending |
| 1.32 | Oct 1, 2026 | Integrated original realistic male/female catalog and paired portraits, selected muscle-relevant actual workout covers and aligned Discover plain rows/full-width category heroes. 302 tests pass; final form/native QA remains |
| 1.36 | Oct 1, 2026 | Applied owner full-scroll Training/Discover section layout, compact card variants, synced body-focus scrolling and actual equipment filtering. 311 tests pass; native visual QA remains |
| 1.42 | Oct 4, 2026 | Added three offline animation samples with retained Image preview, lifecycle tests, creator notices and optional first-build dependency download. Final check passes typecheck/lint + 325 tests/72 suites; Android JS export and release preflight pass. No APK built; native playback/form QA remains |
| 1.43 | Oct 5, 2026 | Fifteen matching offline demos, preserved photos, single-entry cobra hold, embedded source PNGs and explicit 104-exercise gap; final check passes 328 tests/72 suites |
| 1.44 | Oct 5, 2026 | Record further provider/community sourcing, unchanged 18/119 coverage and pending free-versus-paid preference |
| 1.45 | Oct 5, 2026 | Free-only preference resolved; add forearm plank/flutter kicks with original artwork and reviewed framing |

| 1.46 | October 13, 2026 | Seven further animation mappings; 116/119, exact exclusions and final validation in ANIMATION_FINAL_REVIEW |

| 1.47 | October 13, 2026 | Complete 119/119 local animation mappings; source limitations and device QA remain documented |
