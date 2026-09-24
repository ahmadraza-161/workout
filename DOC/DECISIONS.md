# 🧭 Decision Log

### Home Workout – Architecture & Product Decision Records (ADR)

This document records every important product and technical decision: what was decided, why, and what it means. It is the **single source of truth for decisions**. When other documents or the original spec disagree with an **Accepted** record here, this log wins.

| Field | Details |
|---|---|
| **Version** | 1.2 |
| **Last updated** | September 23, 2026 |
| **Related** | [PRD](PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [DESIGN](DESIGN.md) · [CONTENT_MAP](CONTENT_MAP.md) · [COVERAGE](COVERAGE.md) · [RULES](RULES.md) · [TASKS](TASKS.md) |

**Statuses**

| Status | Meaning |
|---|---|
| ✅ **Accepted** | Agreed by the product owner; build on it |
| 🟡 **Proposed** | Recommended by engineering; **needs owner approval** before the phase that uses it |
| ⏳ **Pending** | A decision is still needed; options are listed |
| ♻️ **Superseded** | Replaced by a later record (kept for history) |

**How to add a decision:** copy the template at the end, use the next free number, add it to the index, and link it from any document it affects ([RULES](RULES.md) §11).

---

## Index

| ID | Decision | Status | Date |
|---|---|---|---|
| ADR-001 | Build with Expo + React Native + TypeScript | ✅ Accepted | Sep 23, 2026 |
| ADR-002 | Android first, released on Google Play | ✅ Accepted | Sep 23, 2026 |
| ADR-003 | 100% offline; no INTERNET permission in release | ✅ Accepted | Sep 23, 2026 |
| ADR-004 | No backend, no accounts; user data on the device | ✅ Accepted | Sep 23, 2026 |
| ADR-005 | Tooling is React Native, Expo and npm only (no Python) | ✅ Accepted | Sep 23, 2026 |
| ADR-006 | Exercise animations from the ExerciseDB free API | ♻️ Superseded by ADR-007 | Sep 23, 2026 |
| ADR-007 | Generated 2D Lottie animations for all 119 exercises | ✅ Accepted | Sep 23, 2026 |
| ADR-008 | Online image URLs during development | ♻️ Superseded by ADR-009 | Sep 23, 2026 |
| ADR-009 | Every asset generated locally; real art swapped in later | ✅ Accepted | Sep 23, 2026 |
| ADR-010 | YouTube exercise videos deferred to v2 | ✅ Accepted | Sep 23, 2026 |
| ADR-011 | No admin panel in v1; versioned content pack | ✅ Accepted | Sep 23, 2026 |
| ADR-012 | Placeholder app identity "Home Workout" | ✅ Accepted (until final name) | Sep 23, 2026 |
| ADR-013 | Ship exact catalog counts (119 exercises, 35 achievements) | ✅ Accepted | Sep 23, 2026 |
| ADR-014 | Discover = 6 body-focus tiles + 5 sections | ✅ Accepted | Sep 23, 2026 |
| ADR-015 | Workouts and challenge schedules generated from rules | ✅ Accepted | Sep 23, 2026 |
| ADR-016 | `expo-sqlite/kv-store` instead of MMKV | ✅ Accepted | Sep 23, 2026 |
| ADR-017 | `react-native-svg` instead of Skia | ✅ Accepted | Sep 23, 2026 |
| ADR-018 | Expo Go first; development build for release testing | ✅ Accepted | Sep 23, 2026 |
| ADR-019 | Weight goals deferred to v2 | ✅ Accepted | Sep 23, 2026 |
| ADR-020 | Plan for the personal-account Play testing rule | ✅ Accepted | Sep 23, 2026 |
| ADR-021 | Timestamp-based workout timer with snapshots | ✅ Accepted | Sep 23, 2026 |
| ADR-022 | Generator scripts written in TypeScript (Node) | ✅ Accepted | Sep 23, 2026 |
| ADR-023 | Content pack held in memory; SQLite for user data only | ✅ Accepted | Sep 23, 2026 |
| ADR-024 | Vector thumbnails and artwork drawn at runtime | ✅ Accepted | Sep 23, 2026 |
| ADR-025 | Preferences in the KV store; trimmed profile table | ✅ Accepted | Sep 23, 2026 |
| ADR-026 | Poppins as the app font | ✅ Accepted | Sep 23, 2026 |
| ADR-027 | Reference colours adjusted to meet WCAG AA | ✅ Accepted | Sep 23, 2026 |
| ADR-028 | Portrait-only orientation | ✅ Accepted | Sep 23, 2026 |
| ADR-029 | Week starts on Sunday | ✅ Accepted | Sep 23, 2026 |
| ADR-030 | Android auto-backup disabled | ✅ Accepted | Sep 23, 2026 |
| ADR-031 | One documentation folder: `DOC/` | ✅ Accepted | Sep 23, 2026 |
| ADR-032 | Birth-year picker limited to ages 18+ | ✅ Accepted | Sep 23, 2026 |
| ADR-033 | 3 seconds per rep for duration estimates | ✅ Accepted | Sep 23, 2026 |
| ADR-034 | Gradients drawn with `react-native-svg` | ✅ Accepted | Sep 23, 2026 |
| ADR-035 | Tests live next to the code they test | ✅ Accepted | Sep 23, 2026 |
| ADR-036 | Build approach: EAS Build or local Gradle | ✅ Accepted | Sep 23, 2026 |
| ADR-037 | Approval of packages not listed in spec §4 | ✅ Accepted | Sep 23, 2026 |
| ADR-038 | How to render PNG icon and splash files without Python | ✅ Accepted | Sep 23, 2026 |
| ADR-039 | 21- and 30-day challenge mapping onto the 4-week pattern | ✅ Accepted | Sep 23, 2026 |
| ADR-040 | Variation links resolve only to catalog exercises | ✅ Accepted | Sep 23, 2026 |
| ADR-041 | Quiet Mode swaps for all 9 jumping exercises | ✅ Accepted | Sep 23, 2026 |
| ADR-042 | Rig supports three views, a base-pose library and props | ✅ Accepted | Sep 23, 2026 |
| ADR-043 | Muscle map uses 19 named groups | ✅ Accepted | Sep 23, 2026 |
| ADR-044 | Collections and placement rules for Training and Discover | ✅ Accepted | Sep 23, 2026 |
| ADR-045 | Equipment values: none, household, optional weight | ✅ Accepted | Sep 23, 2026 |
| ADR-046 | Achievement unlock conditions | ✅ Accepted | Sep 23, 2026 |
| ADR-047 | Share card exported with `react-native-svg` | ✅ Accepted | Sep 23, 2026 |
| ADR-048 | MET values from the Compendium of Physical Activities | ✅ Accepted | Sep 23, 2026 |
| ADR-049 | Levels for workouts that have none in the catalog | ✅ Accepted | Sep 23, 2026 |
| ADR-050 | Baselines for single-exercise challenges | ✅ Accepted | Sep 23, 2026 |
| ADR-051 | Where Training and Discover section components live | ✅ Accepted | Sep 24, 2026 |

**Mapping from PRD v1.1 IDs:** D1 → ADR-005 · D2 → ADR-006 · D3 → ADR-008 · D4 → ADR-010 · D5 → ADR-011 · D6 → ADR-007 · D7 → ADR-003 + ADR-009 · D8 → ADR-012 · D9 → ADR-013 · D10 → ADR-014 · D11 → ADR-015 · D12 → ADR-016 + ADR-017 + ADR-018 · D13 → ADR-019 · D14 → ADR-020.

---

## Accepted & Superseded Decisions

### ADR-001 – Build with Expo + React Native + TypeScript ✅

- **Context:** One developer, a mobile app, and a need to move fast with good native access.
- **Decision:** Expo SDK 57 with React Native and TypeScript in strict mode.
- **Consequences:** Expo modules cover every native need (SQLite, speech, audio, notifications). An iOS version stays possible later.

### ADR-002 – Android first, released on Google Play ✅

- **Context:** The target users mostly use Android; launching on two stores doubles the release work.
- **Decision:** v1 ships on Android only, targeting API 36 with a minimum of API 24.
- **Consequences:** Only Android testing and Play policies apply in v1.

### ADR-003 – 100% offline; no INTERNET permission in release ✅

- **Context:** Privacy, zero running costs and the "no data collected" Data safety answer.
- **Decision:** No network calls at all. The production build blocks the INTERNET permission. Content updates arrive through Play Store updates.
- **Consequences:** No remote images, videos, analytics, crash SDKs or OTA updates. Development builds keep network access for the dev server only.

### ADR-004 – No backend, no accounts ✅

- **Context:** Accounts add cost, privacy duties and friction.
- **Decision:** All user data lives on the device (SQLite + KV). Backup is a user-initiated file export.
- **Consequences:** No cloud sync. Losing the phone without an export loses the data.

### ADR-005 – Tooling is React Native, Expo and npm only ✅

- **Context:** The owner wants a single JavaScript/TypeScript toolchain. Python is not installed on the dev machine.
- **Decision:** No Python or other non-JS tooling. Spec v3's Python asset scripts are dropped.
- **Consequences:** Generators are written in TypeScript (ADR-022). Raster output needs a JS solution (ADR-038).

### ADR-006 – Exercise animations from the ExerciseDB free API ♻️ Superseded by ADR-007

- **Context:** The owner first asked for a free library of exercise animations. ExerciseDB v1 offered 1,500 GIFs with no key, but for non-commercial use only, at 180p, with strict rate limits and a network requirement. About 45 of our exercises had no match.
- **Decision (then):** Use ExerciseDB GIFs.
- **Why superseded:** It needs network access (conflicts with ADR-003), bundling rights are unclear, and coverage was incomplete.

### ADR-007 – Generated 2D Lottie animations for all 119 exercises ✅

- **Context:** Offline, free, original assets for every exercise.
- **Decision:** A flat 2D character rig built in code. Each exercise has 2–4 key poses (joint angles), interpolated into a seamless loop and exported as one Lottie JSON (< 40 KB) per exercise, in two character variants.
- **Consequences:** Full coverage and consistent style. Quality is simpler than hand-made animation, especially for floor exercises. Files keep stable names and layer names so professional animations can replace them later.

### ADR-008 – Online image URLs during development ♻️ Superseded by ADR-009

- **Context:** The owner planned to use online images until release, then add local copies.
- **Decision (then):** Load images from free-licence URLs (for example Unsplash) and cache them.
- **Why superseded:** Any network use conflicts with ADR-003.

### ADR-009 – Every asset generated locally; real art swapped in later ✅

- **Context:** No network, no stock photos, no copying from the reference app.
- **Decision:** Animations, thumbnails, artwork, muscle map, sounds and branding are all generated by `tools/`. They are placeholders designed to be replaced with real art later (same paths, names and sizes, described in `DOC/ASSETS.md`).
- **Consequences:** The app is complete and consistent without outside assets. The owner can drop in real photos or art later without code changes.

### ADR-010 – YouTube exercise videos deferred to v2 ✅

- **Decision:** No video tab in v1; the exercise guide shows the animation instead.
- **Consequences:** v2 will need a network permission and an updated privacy policy.

### ADR-011 – No admin panel in v1; versioned content pack ✅

- **Decision:** Content ships as a versioned JSON content pack inside the app.
- **Consequences:** Content changes need an app update. The format is ready for online updates or an admin panel later.

### ADR-012 – Placeholder app identity ✅ (until the final name)

- **Decision:** Name "Home Workout", package ID `com.placeholder.homeworkout`, kept in one constant plus `app.config.ts`.
- **Consequences:** Renaming is a one-line change. The name matches the reference app's name, so it **must change before release**. The owner confirms before Phase 11.

### ADR-013 – Ship exact catalog counts ✅

- **Decision:** 119 exercises and all 35 achievements in Part 5 of the content catalog. No padding and no trimming.

### ADR-014 – Discover = 6 body-focus tiles + 5 sections ✅

- **Decision:** Tiles: Chest, Arm & Shoulder, Butt & Leg, Core, Back & Posture, Full Body. Sections: Picks for you, For beginners, Fast workout, Challenge, Stretch.

### ADR-015 – Workouts and challenge schedules generated from rules ✅

- **Decision:** A documented generator builds all workout contents and challenge schedules from the rules in [PRD](PRD.md) §8.2–8.3, so the catalog is reproducible rather than hand-typed.

### ADR-016 – `expo-sqlite/kv-store` instead of MMKV ✅

- **Context:** MMKV needs a custom development build, which slows daily work.
- **Decision:** Quick settings and runtime snapshots use `expo-sqlite/kv-store` (verified as an export of `expo-sqlite` 57.0.3).
- **Consequences:** Most of the app runs in Expo Go.

### ADR-017 – `react-native-svg` instead of Skia ✅

- **Decision:** Timer rings, charts, the muscle map and gradients use `react-native-svg`. Skia is added only if the share-card image export truly needs it, and then kept isolated.

### ADR-018 – Expo Go first; development build for release testing ✅

- **Decision:** Daily development happens in Expo Go on a real phone. A development build is produced for release testing.

### ADR-019 – Weight goals deferred to v2 ✅

- **Decision:** v1 ships weight logging, the trend chart and BMI. Goal setting, target weight and the safe-rate guardrail move to v2.

### ADR-020 – Plan for the personal-account Play testing rule ✅

- **Decision:** Plan a closed test with at least 12 testers for 14 consecutive days before production. This is the stricter path; nothing in the code changes if the account is an organization account.

### ADR-021 – Timestamp-based workout timer with snapshots ✅

- **Decision:** From spec v3 §10. Store phase start times and durations; compute remaining time from the clock; save a snapshot at every phase change; offer resume for snapshots under 2 hours old.
- **Consequences:** Survives calls, locks and app kills without background services.

---

## Engineering Proposals (accepted by the owner on Sep 23, 2026)

### ADR-022 – Generator scripts written in TypeScript (Node) ✅

- **Context:** The answered open questions asked for `tools/generate_content.py`, but ADR-005 rules out Python.
- **Proposal:** Write every generator in TypeScript, run with Node's built-in TypeScript support. No extra runner package is needed.
- **Consequences:** One language across the whole project; the generators can share types with the app.

### ADR-023 – Content pack held in memory; SQLite for user data only ✅

- **Context:** Spec v3 says "DB seeded from JSON". The content is small (< 1 MB) and read-only.
- **Proposal:** Load the content pack into memory at start-up and index it. Don't copy it into SQLite.
- **Consequences:** Faster start-up, no seeding or migration logic for content, and content upgrades need no data migration.

### ADR-024 – Vector thumbnails and artwork drawn at runtime ✅

- **Context:** Spec v3 generated WebP thumbnails and heroes with Python/Pillow, which is no longer allowed.
- **Proposal:** Draw thumbnails (first key pose) and workout artwork (gradient + silhouette) as vectors with `react-native-svg`.
- **Consequences:** Crisp at every size, themeable in dark mode, and tiny. Real photos can still replace artwork later.

### ADR-025 – Preferences in the KV store; trimmed profile table ✅

- **Context:** Spec v3 stored units, theme, quiet mode and locale in `profile`, and had both `weekly_goal.targetPerWeek` and `profile.daysPerWeekTarget` (a duplicate).
- **Proposal:** Preferences go to the KV store (`settings.*`). Drop the `weekly_goal` and `settings` tables and keep `profile.daysPerWeekTarget`.
- **Consequences:** One place for each value. Backup exports include the KV preferences.

### ADR-026 – Poppins as the app font ✅

- **Context:** Spec v3 allows Inter or Poppins. The reference uses a geometric sans-serif.
- **Proposal:** Poppins (SIL OFL), weights 400–800, bundled with the app.
- **Consequences:** About 750 KB of font files. Confirm the look side by side with the reference in Phase 1.

### ADR-027 – Reference colours adjusted to meet WCAG AA ✅

- **Context:** Several measured reference colours fail contrast. Examples: grey meta text `#878787` (3.6:1), Intermediate orange `#FE8012` (2.5:1), and white text on the orange and cyan cards (2.8–3.0:1).
- **Proposal:** Keep each hue but adjust the value to pass AA ([DESIGN](DESIGN.md) §2 and §9.1).
- **Consequences:** Some colours are slightly darker than the reference; the app is readable for everyone.

### ADR-028 – Portrait-only orientation ✅

- **Proposal:** Lock the app to portrait, like the reference.
- **Consequences:** Simpler layouts and testing. Landscape can come later.

### ADR-029 – Week starts on Sunday ✅

- **Proposal:** The week strip and weekly goal use Sunday–Saturday, as in the reference.
- **Consequences:** It may differ from some locales' first day of the week. A setting can be added later.

### ADR-030 – Android auto-backup disabled ✅

- **Proposal:** `allowBackup: false`. Users back up through the in-app export.
- **Consequences:** Health data is never copied to cloud backups silently. Users who switch phones must export and import.

### ADR-031 – One documentation folder: `DOC/` ✅

- **Proposal:** All documentation, including the spec's planned `docs/` files (ASSETS, LICENSES, PRIVACY, PLAY_CHECKLIST), lives in `DOC/`.
- **Consequences:** No split between two documentation folders.

### ADR-032 – Birth-year picker limited to ages 18+ ✅

- **Context:** The app is rated 18+.
- **Proposal:** The optional birth-year picker only offers years for ages 18–100.
- **Consequences:** The in-app experience matches the content rating.

### ADR-033 – 3 seconds per rep for duration estimates ✅

- **Context:** Rep-based exercises have no fixed time, but workout durations must match the catalog within ±1 minute.
- **Proposal:** Estimate 3 seconds per rep (per side for one-sided exercises) in the generator and on detail screens.
- **Consequences:** Displayed durations are estimates. kcal always uses the time actually spent.

### ADR-034 – Gradients drawn with `react-native-svg` ✅

- **Context:** `expo-linear-gradient` is not in the approved list.
- **Proposal:** Draw gradients with `LinearGradient` inside an `Svg`, wrapped in a core `GradientBackground` component.
- **Consequences:** No new package. If performance suffers, request approval for `expo-linear-gradient`.

### ADR-035 – Tests live next to the code they test ✅

- **Proposal:** `*.test.ts(x)` files sit beside their source files.
- **Consequences:** Tests are easy to find and move with the code.

---

## Formerly Pending (resolved by the owner on Sep 23, 2026)

### ADR-036 – Build approach: EAS Build or local Gradle ✅

| Option | Pros | Cons |
|---|---|---|
| **A. EAS Build (cloud)** | No Android Studio needed; managed signing credentials; 15 free Android builds a month | Needs a free Expo account; source is uploaded to Expo's build servers |
| **B. Local Gradle build** | Everything stays on this PC; no account | Install Android Studio, SDK Platform 36 and JDK 17 (JDK 25 is installed and may not work); slower setup |

**Resolved:** option A (EAS Build). A free Expo account is needed before the first cloud build.

### ADR-037 – Approval of packages not listed in spec §4 ✅

These are required by approved libraries or standard tooling, but spec §4 does not name them:

| Package | Why it is needed |
|---|---|
| `react-native-gesture-handler` | Required by expo-router and bottom sheets |
| `react-native-safe-area-context` | Required by expo-router; safe areas |
| `react-native-screens` | Required by expo-router |
| `react-native-worklets` | Required by Reanimated 4 |
| `expo-font` | Loads the bundled Poppins font |
| `expo-build-properties` | Turns on R8 minification and resource shrinking for release |
| `drizzle-kit` (dev only) | Generates database migrations |
| `eslint` + `eslint-config-expo` (dev only) | Linting ([RULES](RULES.md) §2) |
| `prettier` (dev only) | Formatting |

**Resolved:** all approved, together with the first-party companions they require (for example `expo-linking`, `expo-constants`, `expo-status-bar`, `jest-expo`).

### ADR-038 – How to render PNG icon and splash files without Python ✅

| Option | Pros | Cons |
|---|---|---|
| **A. `sharp` (dev-only dependency)** | Industry standard; renders SVG → PNG in one call | One more dev package (never shipped in the app) |
| **B. Small in-house rasteriser in TypeScript** | No new package | More code to write and maintain for a handful of images |

**Resolved:** option A (`sharp`, dev-only).

### ADR-039 – 21- and 30-day challenge mapping onto the 4-week pattern ✅

- **Resolved (assumption accepted):** 21 days = weeks 1–3 of the pattern; 30 days = weeks 1–4 plus 2 extra days at the week-4 level.
- Needed before task T2.5 (challenge generator).

---

## Completeness Audit Decisions (accepted by the owner on Sep 23, 2026)

These came out of checking every reference screenshot, spec section and catalog item ([COVERAGE](COVERAGE.md) §6). Full per-item data is in [CONTENT_MAP](CONTENT_MAP.md).

### ADR-040 – Variation links resolve only to catalog exercises ✅

- **Context:** 19 easier/harder links in the catalog name exercises that don't exist, such as Knee Plank, Jump Lunge and a Bulgarian split squat. Adding exercises would break ADR-013.
- **Proposal:** Keep only links to existing exercises. The 19 unresolved links become "none". The guide shows Easier/Harder buttons only for valid links.
- **Consequences:** 14 exercises lose one or both variation buttons. The missing variations are a v1.1 content candidate. Full list: CONTENT_MAP §3.

### ADR-041 – Quiet Mode swaps for all 9 jumping exercises ✅

- **Context:** The catalog promises a quiet twin for every high-impact move but defines only 4. Quiet Mode behaviour was undefined.
- **Proposal:** Complete the list: Burpee → Half Burpee, Plank Jack → Mountain Climber, Frog Jump → Sumo Squat, Squat Jump → Squat Pulse, Fast Feet → Marching High Knees, plus the 4 catalog twins. When Quiet Mode is on, the player swaps them automatically, keeping the same time or reps.
- **Consequences:** Apartment users can do any workout. The session records the exercise actually played.

### ADR-042 – Rig supports three views, a base-pose library and props ✅

- **Context:** 15 exercises need a wall, chair, doorway or water bottles, and sideways moves while lying down can't be shown from the side.
- **Proposal:**
  - Views: Side, Front and Top.
  - Base poses: standing, plank, lying on back, lying on front, all fours, seated, side plank, kneeling, inverted, plus transitions.
  - Props: flat grey wall, chair, doorway, water bottles and a floor line.
- **Consequences:** Every exercise can be animated clearly, at the cost of more rig work in Phase 2 (T2.19).

### ADR-043 – Muscle map uses 19 named groups ✅

- **Context:** Spec v3 listed 14 groups, but the catalog also mentions the neck, hip flexors, inner thighs, rear shoulders and upper back.
- **Proposal:** Add `neck`, `hip_flexors`, `adductors`, `rear_deltoids` and `upper_back` (19 in total), with a mapping from catalog focus words (CONTENT_MAP §6).
- **Consequences:** Every focus chip can be highlighted on the map.

### ADR-044 – Collections and placement rules for Training and Discover ✅

- **Context:** The spec lists sections ("Recommended – a curated collection", "Picks for you", "For beginners"…) but not which workouts go where. Challenges have no goal tags and no rule for "Customized for you".
- **Proposal:**
  - 4 goal-based collections (C1–C4).
  - A fixed content rule for every section.
  - Goal tags and filter chips for challenges.
  - "Customized for you" chosen from the user's goal (CONTENT_MAP §9–§10).
- **Consequences:** The generator builds every section deterministically, and the content pack gains a small `collections` list.

### ADR-045 – Equipment values: none, household, optional weight ✅

- **Context:** Spec v3 allowed only `none | optional_dumbbell`. The catalog uses chairs, walls, a doorway and water bottles, and has no dumbbell workouts.
- **Proposal:** `none`, `household` (wall, chair, doorway) and `optional_weight` (water bottles). "No equipment" labels and filters include household items.
- **Consequences:** Labels are accurate, and no dumbbell content is implied.

### ADR-046 – Achievement unlock conditions ✅

- **Context:** Some badge names are ambiguous ("First Week Done", "First Challenge Started"), and 21-day challenges have no badge.
- **Proposal:** Use the conditions in CONTENT_MAP §11:
  - First Week Done = workouts on 3 different days within 7 days of the first workout.
  - First Challenge Started = Day 1 of any challenge completed.
  - "Completed a 14-Day Challenge" also counts 21-day challenges.
- **Consequences:** Every badge is testable, and the count stays 35 (ADR-013).

### ADR-047 – Share card exported with `react-native-svg` ✅

- **Context:** The finish screen has a Share button. Spec v3 would have used Skia for image export, which ADR-017 avoids.
- **Proposal:** Build the card as an SVG, export it with `toDataURL()`, save it with `expo-file-system` and share it with `expo-sharing`. The card never shows body data.
- **Consequences:** No new package. If export quality is poor, reconsider Skia in an isolated module.

### ADR-048 – MET values from the Compendium of Physical Activities ✅

- **Context:** kcal = MET × 3.5 × kg / 200 × minutes needs a MET value for every exercise, and the spec gives none.
- **Proposal:** Take MET values from the Adult Compendium of Physical Activities, the standard public reference. Choose the closest activity code for each exercise and store the code with the exercise data.
- **Consequences:** Calorie estimates are consistent and traceable. They are still estimates and are labelled that way.

### ADR-049 – Levels for workouts that have none in the catalog ✅

- **Context:** The 12 Stretch & Warm-Up workouts and the 4 Special workouts have no level in the catalog.
- **Proposal:** Stretch & Warm-Up = level 1 · Quiet Apartment Workout = 2 · Arm Workout (No Push-Ups) = 2 · Chair-Assisted Workout = 1 · Absolute Beginner Start = 1.
- **Consequences:** Level filters and "For beginners" work for all 60 workouts.

### ADR-050 – Baselines for single-exercise challenges ✅

- **Context:** The Plank, Push-Up and Squat challenges ramp "from a beginner baseline" that is not defined.
- **Proposal:**
  - Plank: 20 s × 3 sets.
  - Push-Up: 5 reps × 3 sets, using Knee Push-Up at level 1 and Standard Push-Up at level 2+.
  - Squat: 10 reps × 3 sets.
  - About +10% per training day, rounded up.
- **Consequences:** The last training day reaches about 2.6× the baseline and still fits the catalog's daily time.

### ADR-051 – Where Training and Discover section components live ✅

- **Context:** [ARCHITECTURE](ARCHITECTURE.md) §4 defines 11 modules, but the Training tab (13 sections) and the Discover tab (8 sections) had no owning module. The rule "routes compose module components, no business logic" left 21 tasks with nowhere to put their components.
- **Decision:** Split by what the component knows, not by which screen shows it.
  - **Generic, data-free components live in `core/ui`.** Anything that takes props and renders — rows, chips, banners, media cards, gradient cards, section headers, carousels, week strips, meta cells. The reference screenshots show the same visual vocabulary reused across all four tabs, so these belong to the shared layer, not to any feature.
  - **Data-bound section components live in the module that owns the data.** Weekly Goal → `report`, challenge carousel → `challenges`, Body Focus and list sections → `content`, Custom Workout card → `builder`. Each is a thin wrapper that reads its module's data and composes `core/ui` pieces.
  - Routes in `app/` only arrange these sections in order. No data access and no layout logic beyond ordering.
- **Consequences:** No twelfth module. The Training and Discover screens import from several modules, which is allowed because each import is a public `index.ts`. The reuse audit of the reference found one `Row` serving 8 placements, one `Banner` serving 5, one `MediaCard` serving 4 and one `WeekStrip` serving both the Training weekly goal and the Report history — so the shared layer carries most of the weight and the feature wrappers stay small.

---

## Template

```markdown
### ADR-0XX – <Short decision title> <status emoji>

- **Context:** What problem or question led to this?
- **Decision / Proposal:** What we will do.
- **Consequences:** What this makes easier or harder; follow-up work.
```

---

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version: 39 records, including PRD D1–D14 and new engineering proposals |
| 1.1 | Sep 23, 2026 | Completeness audit: ADR-040 to ADR-050 added (50 records) |
| 1.2 | Sep 23, 2026 | Owner approved every proposed and pending decision |
