# 🧭 Decision Log

### ADR-062 — Reference framing without stretching exercise poses (October 1, 2026)

Use upright original portraits for narrow core/calisthenics challenge hero slots instead of enlarging/stretching landscape instructional poses. Fix the hero frame height independently of card copy and fit titles in a wider column. Preserve full exercise poses in guides and thumbnails. Make Training/Report grouping and workout-detail framing follow the reference while retaining functional app controls. Record all reference mappings and remaining deviations; export/tests must not be described as native pixel verification.

### ADR-061 — Distinct covers and visible bootstrap progress (October 1, 2026)

Assign one unique actual-exercise cover to each of the 60 catalog workouts using deterministic matching; prefer primary-muscle candidates and broaden only unmatched plans. Use separate bundled transparent heroes for categories and challenges. Keep Discover captions below images and supply explicit SVG stop opacity on Android. Show onboarding progress/portrait choices and a fixed safe-area footer. Bridge native splash to a database-independent startup view; routes and stored-theme reads wait until fonts/database settle and the progress animation finishes. No runtime network, new package or native-source edits.

### Home Workout – Architecture & Product Decision Records (ADR)

This document records every important product and technical decision: what was decided, why, and what it means. It is the **single source of truth for decisions**. When other documents or the original spec disagree with an **Accepted** record here, this log wins.

| Field | Details |
|---|---|
| **Version** | 1.11 |
| **Last updated** | October 5, 2026 |
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
| ADR-052 | The rig lives in `src`, shared by the app and the generators | ✅ Accepted | Sep 24, 2026 |
| ADR-053 | Lottie export as parented layers with rotation keyframes | ✅ Accepted | Sep 24, 2026 |
| ADR-054 | Generators read CONTENT_MAP.md as the catalog | ✅ Accepted | Sep 24, 2026 |
| ADR-055 | Muscle map uses vendored MIT path data | ✅ Accepted | Sep 24, 2026 |
| ADR-056 | Static exercise images for the current implementation | ✅ Accepted | Sep 28, 2026 |
| ADR-057 | Custom plans reuse the existing player and JSON storage | ✅ Accepted | Sep 30, 2026 |
| ADR-058 | Offline notice inventory and canonical measurement units | ✅ Accepted | Sep 30, 2026 |
| ADR-059 | Shared focused Back handling and optional reminder setup | ✅ Accepted | Sep 30, 2026 |

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

### ADR-012 – WorkoutStride app identity ✅

- **Decision:** On October 1, 2026 the owner delegated name/logo selection, then requested an easier English workout-related name and proper athletic characters for a global no-equipment app. Public name is **WorkoutStride**, tagline **Your pace. Your progress.**, canonical exports in `app.config.ts`. Original male/female bodyweight character branding is generated by `tools/branding/build.mts`; see [BRANDING](BRANDING.md).
- **Consequences:** Screens and generated i18n use the same identity. The testing package ID `com.placeholder.homeworkout` is retained for install/data continuity; `workoutstride` and the legacy `workoutdost`/`homeworkout` URL schemes are supported. Store publishing identity remains a release concern.

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

### ADR-052 – The rig lives in `src`, shared by the app and the generators ✅

- **Context:** ADR-024 draws thumbnails from the rig at runtime, and T2.11 exports the same rig to Lottie at build time. Two copies of the pose maths would drift, and a thumbnail that disagreed with its animation is exactly the kind of bug nobody notices until release.
- **Decision:** The rig model, solver, SVG renderer and Lottie exporter live in `src/modules/demo/rig`. `tools/rig` holds only the scripts that write files. Internal rig imports carry explicit `.ts` extensions, because Node's ESM loader requires them and `tools/` runs under plain Node; `allowImportingTsExtensions` is enabled so `tsc` accepts them, and Metro already did.
- **Consequences:** One definition, two consumers. The exporter is typechecked and unit-tested alongside the rig instead of sitting outside the test suite. The `.ts` extensions are unusual to read but are confined to the rig.

### ADR-053 – Lottie export as parented layers with rotation keyframes ✅

- **Context:** An exercise animation could be exported either by keyframing each body part's path per frame, or by exporting the bone hierarchy and keyframing only rotations.
- **Decision:** Export one shape layer per bone, drawn once in local space, parented to its parent bone, with only rotation (and the root's position) keyframed.
- **Consequences:** Measured on the four proof exercises: **11–14 KB each, at most 33% of the 40 KB budget**, so 119 exercises fit comfortably. Limbs sweep through true arcs instead of shrinking toward the chord, which path interpolation would cause. Bones that do not move cost a single static value, which is most of the saving. Layer names are the bone names, so professional art can replace a file while keeping the same rig contract.

### ADR-054 – Generators read CONTENT_MAP.md as the catalog ✅

- **Context:** The catalog's 119 exercises, 60 workouts, 12 challenges and 35 badges live in `DOC/CONTENT_MAP.md` as markdown tables. The generators could either parse that document or keep a transcribed copy in TypeScript.
- **Decision:** Parse the document. `tools/content` reads the tables, joins them, validates them and emits `assets/data/catalog.generated.json`.
- **Consequences:** One copy of the catalog, edited by humans in the place the docs already point at, with no transcription step to drift. The cost is a markdown parser and a hard dependency on the table shapes, which the validator's count and reference checks catch immediately if a heading or column is renamed. Pure logic lives in `.ts` files so it is typechecked and unit-tested; only the entry script is `.mts`, for `import.meta`.

### ADR-055 – Muscle map uses vendored MIT path data ✅

- **Context:** The exercise guide has to light up individual muscles. A first attempt drew the map from scratch; it covered all 19 groups but did not look like a body. Searching for an open-licensed replacement turned up plenty of anatomy illustrations, but the public-domain ones draw the whole figure as between one and eleven compound paths, so no muscle can be coloured on its own. The images that do look right are commercial products and cannot be used.
- **Decision:** Vendor the per-muscle SVG path data from [react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter) (MIT, © 2022 ELABBASSI Hicham) into `tools/art/vendor`, and keep our own generator on top of it. Only the data is taken, not the component or the package.
- **Consequences:** All 19 groups get real anatomical shapes that highlight independently, front and back. Two are approximations the source does not separate — `lats` shares the upper-back shape and `hip_flexors` the adductors — recorded in [LICENSES.md](LICENSES.md) so the guide is not read as more precise than its artwork. The data is committed rather than installed, so the app stays offline and gains no dependency. Colours remain theme tokens, so dark mode and per-exercise highlighting still work without regenerating anything.

---

## Current exercise media

### ADR-056 – Static exercise images for the current implementation ✅

- **Decision (owner, Sep 28, 2026):** Use one static pose image per exercise for now. Pause the generated character/animation work. This supersedes the exercise-demo Lottie requirement and the generated-only restriction for exercise images; existing animation decisions remain historical.
- **Sourcing:** Ready-made internet images may be downloaded once and bundled locally when their individual reuse licence is verified. Record author, source, licence and modifications. Never hotlink or add runtime internet access. Do not copy the reference app's assets.
- **Scope:** Keep timers, instructions and the offline architecture. Static images do not demonstrate a whole movement. Animation may be reconsidered later; do not produce 119 animations now.
- **Sep 29 owner direction:** Images should be full colour. A clean, original AI-assisted side-plank illustration is the first style study; the monochrome source sample was removed. The owner will generate and add the remaining images using `DOC/IMAGE_PROMPTS.md`; engineering proceeds with non-image app work. The study is bundled at `/dev/rig`, but its appearance on a phone and coverage of the other 118 exercises remain pending. Previous rig experiments are retained, inactive.

### ADR-057 – Custom plans reuse the existing player and JSON storage ✅

- **Context:** The owner authorized the custom-workout builder phase. Focus and per-set rest need to survive save/edit and backup without duplicating the offline catalog.
- **Implementation:** Store a version-one plan envelope in the existing `items_json` column, retaining legacy-array reading. Resolve plans into the timestamp player with per-item rest; global rest OFF remains authoritative. Export backup format 2 and accept formats 1 and 2.
- **Consequences:** No package or database migration. Edits/deletion clear the matching unfinished snapshot to avoid replaying changed sets; deletion retains completed sessions. Deleted template titles use the history fallback because session rows do not snapshot titles. Native full-flow and reference checks remain.

### ADR-058 – Offline notice inventory and canonical measurement units ✅

- **Context:** The owner authorized credits/licences and Settings completion. Licence reading must work offline; changing display units must not alter existing measurements.
- **Implementation:** Build a deduplicated local notice inventory from installed production dependencies and vendored font/map notices, with a separate missing-file audit. Show searchable notices, privacy, disclaimer and About in the existing shared sheet. Read app identity from Expo config. Use the existing units preference for Profile and Report and share pure kg/lbs and cm/ft-in conversion helpers.
- **Consequences:** No packages, network actions or schema changes. Untouched canonical values retain their precision; edits convert at the input boundary. Installed package metadata is not a completed redistribution audit: missing upstream/native notices and owner-image provenance remain release checks.

### ADR-059 – Shared focused Back handling and optional reminder setup ✅

- **Context:** The owner authorized the remaining functional gap pass. Native Back could bypass the player's quit flow or leave a builder draft, and onboarding did not expose the saved reminder setup.
- **Implementation:** A focus-gated shared Back hook keeps registrations stable so open sheets retain priority. Screens reuse their header handlers. Quit pauses first and keeps failed finish saves on screen; draft exits ask once. The onboarding schedule step links the existing reminder route and reflects its stored schedule, keeping notification permission optional and explicit.
- **Consequences:** No new package or schema. Cancelled quit stays paused for explicit Resume. Tests cover registration cleanup/priority and critical screen flows; phone gesture, keyboard, notification and reference QA remain.

## Template (new records)

```markdown
### ADR-060 – Inclusive realistic static artwork ✅

- **Owner direction (Oct 1):** The app is for men and women. The owner prefers realistic exercise images, relevant muscle focus and mixed male/female artwork on appropriate reference-style cards.
- **Implementation:** Generate original local photographic-style cutouts from the authored exercise instructions; preserve owner originals. Alternate male/female subjects across the exercise catalog. Use an original pair for shared collection/challenge banners. Workout covers must select an exercise actually included in that workout, prioritizing its muscle focus.
- **Consequences:** Extends ADR-056's full-colour static image direction; no runtime networking, new package or copied reference person. Generated images still require pose, edge, small-screen and final native bundle QA.

### ADR-0XX – <Short decision title> <status emoji>

- **Context:** What problem or question led to this?
- **Decision / Proposal:** What we will do.
- **Consequences:** What this makes easier or harder; follow-up work.
```

---

### ADR-061 – Selected offline third-party exercise demos ✅

- **Owner direction (Oct 4):** After reviewing Dinh Bui Xuan's free LottieFiles exercises, the owner authorized adding the three recommended samples.
- **Owner expansion (Oct 5):** After trying and approving the animation style, the owner requested the remaining exercises. Add eight further verified matching Dinh demos and four matching saagar shrestha demos; retain images for unmapped exercises rather than assigning unrelated movements. The same owner-authorized expansion adds Dead Bug, March in Place and Donkey Kick from reviewed public Simple License sources (eighteen total, 101 remaining). Unnamed-source attribution preserves the published contributor ID; the donkey-kick decorative caption is removed by the generator. Cobra uses one entry into the held pose. Source/licence, rejected variants, visual mapping corrections and exact gaps are recorded in [ANIMATION_COVERAGE](ANIMATION_COVERAGE.md). This expands the previously narrow asset exception; approved native dependencies are unchanged.
- **Decision:** Bundle Military Push Ups for Standard Push-Up, Wide Arm Push Up for Wide Push-Up, and Squat Reach for Squat to Overhead Reach. Install the already-approved Lottie player with Expo's SDK 57 version selection (`~7.3.8`). This is a narrow exception to ADR-056's static-only direction and the locally authored asset constraint, authorized by the owner.
- **Consequences:** Native player and pose-guide demos loop locally, respecting pause, route focus, app background and Reduce Motion. The preview opens with Animation first and retains the original photograph under Image, as explicitly requested by the owner. Browse cards retain static artwork; unknown exercises, loading and failures retain their pose. Web uses the static fallback. Preserve originals, remove only background solids through a repeatable generator, and bundle full Lottie Simple License terms and creator credit. Squat-reach instructions now describe alternating overhead reaches as shown by the approved animation. A rebuilt Android app and phone playback/form QA are required; no APK was built in this task.

### ADR-063 – Owner-approved offline MP4 exercise demonstrations ✅

October 13 final three mappings complete 119/119 catalog coverage. Ready-made real-person arm pulses and a selected forward frog-jump segment complement the anatomical floor-seated retraction entry/hold. All source marks and unverified permissions retained. Original Sworkit MP4 additionally retained and tested by SHA256. Coverage completion means local preview availability, not native form approval or cleared publication rights.

October 13 final matching extension: six new publicly displayed sources plus reused Step-back Burpee add seven IDs, total 116/119. GIF conversion now supports reviewed source start/end segments; Get-Up retains only its seated-to-standing-to-seated cycle. Hamstring photo sequence enters and holds. Public download marks and unverified redistribution notices remain. Three mismatched movements are recorded in ANIMATION_FINAL_REVIEW. No dependency, UI or runtime network change.

October 13 continuation: 32 additional publicly displayed HeyGainz anatomical demos are bundled, bringing coverage to 109/119. Original GIFs and branding remain; eight further held-pose clips use reviewed segments with loop=false. Public-download sourcing remains the owner-approved local integration exception, with app redistribution rights unverified and truthful offline notices. Ten movement mismatches remain documented in tools/animations/HEYGAINZ-REVIEW.md. No runtime network or new dependency added.


October 13 expansion: owner requested faster public-file acquisition and explicitly accepted downloadable sources despite unresolved copyright. Added 48 reviewed demos as local MP4s, preserving original GIFs and source branding; no download entitlements bypassed. Ten holds use only the reviewed entry segment and `loop=false`, retaining the last pose before source release. Dataset Gym visual media requires an own licence before redistribution, while TrainAI creator-download terms do not establish an app licence. Notices record these restrictions; imports are not claimed publication-cleared. Existing photos, UI and native dependency set remain.

- **Owner direction (October 12):** Ready-made GIF, MP4 and Lottie are acceptable when movement, body gestures and target muscles are clear. Owner explicitly approved adding `expo-video` after the required package question.
- **Decision:** Install Expo SDK 57-compatible `expo-video` 57.0.5. Bundle the reviewed Vital Animations free character sample 0353 as Pike Push-Up; retain the original MP4, provenance/hash and publisher usage notice. Technical source: SDK 57 video documentation; asset source: Vital's public free pack and canonical publisher statement.
- **Behaviour:** Local `require()` asset only, mute/loop, no background service or Picture-in-Picture, pause on timer pause/route blur/background. Reduce Motion, loading and decoding failure retain the existing pose. Animation-first/Image-second choices remain. Web keeps the pose fallback.
- **Consequences:** Expands ADR-061's format restriction; does not authorize paid purchases, runtime network media or unrelated UI work. Asset generator counts Lottie and MP4 together. Android binary rebuild and real-device form/playback/airplane-mode QA remain necessary; no APK built in this task.


## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version: 39 records, including PRD D1–D14 and new engineering proposals |
| 1.1 | Sep 23, 2026 | Completeness audit: ADR-040 to ADR-050 added (50 records) |
| 1.2 | Sep 23, 2026 | Owner approved every proposed and pending decision |
| 1.3 | Sep 28, 2026 | ADR-056: owner chose bundled static exercise images; animation work paused |
| 1.4 | Sep 29, 2026 | ADR-056: full-colour direction and original illustration style study |
| 1.5 | Sep 29, 2026 | ADR-056: owner supplies exercise images from the prompt catalog while app work continues |
| 1.6 | Sep 30, 2026 | ADR-057: custom plan persistence and player reuse under the authorized builder phase |
| 1.7 | Sep 30, 2026 | ADR-058: offline notice generation and canonical measurement input/display |
| 1.8 | Sep 30, 2026 | ADR-059: Back priority and optional onboarding reminder entry |
| 1.9 | Oct 1, 2026 | ADR-060: owner-authorized realistic male/female exercise art and original mixed banners |
| 1.10 | Oct 4, 2026 | ADR-061: owner-authorized selected offline Lottie exercise demos and their derivative licence terms |
| 1.11 | Oct 5, 2026 | Owner-authorized matching-demo expansion with retained photos, cobra hold and explicit coverage gaps |


## ADR-064 — Repair media lifecycle and clarify the starting routine

**Status:** accepted by owner request, October 13, 2026. Supersedes the animation-only scope and held HeyGainz playback policy.

Disable all TrainAI mappings without replacing them with unrelated movements; retain their original static images and archive provenance. Restore complete HeyGainz source cycles and repeat while active, preserving written hold instructions and timer semantics. Let useVideoPlayer own native release; do not pause its SharedObject from cleanup. Offer native-image retry after decode failure. Add a single goal/experience-appropriate Home suggestion that excludes required props and routes through workout detail before Start. No new package, schema, native generated code or runtime network.

Tradeoff: active animation coverage drops to 92/119; 27 exercises use photos until approved matching replacements exist. Device verification is a separate release gate, not inferred from unit tests. Full user-flow and acceptance plan: [APP_REPAIR_PLAN](APP_REPAIR_PLAN.md).

## ADR-065 — Remove third-party MP4 demos; owner-generated clips replace them

**Status:** accepted by owner request, October 26, 2026. Supersedes ADR-063's sourcing and ADR-064's HeyGainz playback policy; the `expo-video` player stays.

Remove every downloaded MP4/GIF demo (HeyGainz, dataset, Vital, public sources), their originals and notices; keep only the 28 Lottie mappings. The 91 other exercises show their photo until the owner supplies Google Flow clips generated from DOC/VIDEO_PROMPTS.md (stylised 3D character in the Lottie look, working muscles highlighted red/orange, no text or marks, 8-second seamless loop). New clips go through tools/animations/video-candidates.json and build-videos.mts; no third-party credit is needed for owner-generated media.

October 27 addendum: 84 owner Flow clips integrated (960x540, muted, looping). The video stage now unmounts its player when the screen loses focus, so only the visible exercise holds a native player; it reloads and autoplays on return.

## ADR-066 — Plan-first Home with one active plan

**Status:** accepted by owner request, October 27, 2026. Replaces the long-scroll Training home (13 sections) of ADR-051.

The Training tab becomes a plan Home; the full workout catalogue stays in Discover. The app recommends one plan from the profile's goal and level (`home/plan.ts`; beginners get the gentle two-week start plan). A new user (no active plan, no session) sees a welcome with that plan, **Start day 1**, **Customize my plan**, "How it works" and the first week's path. A returning user sees the streak, today's plan day, the week path, customize tiles and suggested workouts. `/plan` changes goal, level and days per week and lists all plans.

Only one plan is active: `selectPlan` and starting any challenge pause the others; a paused plan keeps its progress when chosen again. The active plan is read from the existing `challenge_state` table, so no new KV key is added (backup import counts keys and would reject older backups). Onboarding ends on **See my plan** instead of starting a workout. Old sections `TrainingHomeScreen`, `TrainingBrowseSections` and `TrainingBodyFocus` are deleted; the feedback box moves to the bottom of Discover. Keep the blue brand, more vivid; one new token `onPrimarySoft`. No new package, schema change or network.

Tradeoff: all 12 current plans are level 2–3, so a true level-1 plan needs content-generator work later. Phone visual QA is still required.

## ADR-067 — Plan-day celebration on the finish screen

**Status:** accepted by owner request, November 6, 2026. Builds on ADR-066.

When a plan-day workout is saved at 100 %, the finish screen shows a card that pops in (a spring scale; Reduce Motion shows it at once). It says **Day X done!** with the plan's progress, then **Tomorrow: day Y · workout**, or that tomorrow is a rest day. After the last day it shows **Plan complete!** with **Choose your next plan** (`/plan`). Partial sessions and paused plans show no card. The outcome is read from the reconciled `challenge_state` progress after the save (`player/planDay.ts`, `getPlanDayOutcome`); a lookup failure hides the card and never affects the saved workout. `player` now also reads `challenges`. No new package, token, schema or KV key.
