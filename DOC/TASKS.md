# ✅ Project Tasks

### Home Workout – Task Breakdown & Development Plan

This document lists every task needed to build and launch Home Workout. Tasks are grouped into phases, each with clear deliverables, priorities and status tracking. A phase starts only after the previous phase's **"Done when"** test passes ([RULES](RULES.md) §14).

| Field | Details |
|---|---|
| **Version** | 1.1 |
| **Last updated** | September 23, 2026 |
| **Current phase** | Phase 2 – Character rig, awaiting the owner's style approval |
| **Related** | [PRD](PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [DESIGN](DESIGN.md) · [TEST_PLAN](TEST_PLAN.md) · [DECISIONS](DECISIONS.md) |

---

## 1. Project Overview

Home Workout is a free, fully offline Android app built with Expo and React Native. Work is split into **13 phases**: planning (Phase 0) plus the 12 build phases from the spec. Task IDs are written as `T<phase>.<number>` in commits and notes, for example `T5.6`.

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
| **164** | **41** (25%) | **6** (4%) | **117** (71%) | **0** (0%) |

| Phase | Tasks | Completed | Status |
|---|:---:|:---:|---|
| 0 – Planning & Documentation | 18 | 15 | 🔄 In Progress |
| 1 – Foundation | 17 | 16 | 🔄 In Progress |
| 2 – Asset Generators | 20 | 8 | 🔄 In Progress |
| 3 – Content & Lists | 9 | 0 | ⬜ Not Started |
| 4 – Workout Details & Exercise Guide | 8 | 0 | ⬜ Not Started |
| 5 – Workout Player | 17 | 0 | ⬜ Not Started |
| 6 – Onboarding & Profile | 10 | 0 | ⬜ Not Started |
| 7 – Training Tab | 14 | 0 | ⬜ Not Started |
| 8 – Discover Tab | 8 | 0 | ⬜ Not Started |
| 9 – Report Tab | 11 | 0 | ⬜ Not Started |
| 10 – Challenges | 6 | 0 | ⬜ Not Started |
| 11 – Builder, Achievements, Reminders, Backup | 10 | 0 | ⬜ Not Started |
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

Generate every asset locally with TypeScript scripts in `tools/`. **Status: 🔄 In Progress**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 2.1 | Generator toolchain: `tools/` + `npm run assets` | 🔴 High | ✅ Completed | Reads DOC/CONTENT_MAP.md directly, so the catalog has one copy (ADR-054) |
| 2.2 | Exercise metadata for all 119 exercises | 🔴 High | ✅ Completed | Catalog fields parsed; muscles, MET and defaults authored in `tools/content/metrics.ts` |
| 2.3 | Exercise copy for all 119 exercises | 🔴 High | ⬜ Not Started | 2–3 instructions, 3 mistakes, 3 breathing tips; original text; follows PRD §9 |
| 2.4 | Workout generator: 60 workouts from the rules in PRD §8.2 + intros | 🔴 High | 🔄 In Progress | Exercise lists built and within ±1 min; intro copy comes with T2.3 |
| 2.5 | Challenge generator: 12 schedules from PRD §8.3 + copy | 🔴 High | 🔄 In Progress | Schedules built; copy comes with T2.3 |
| 2.6 | Categories (6 tiles) and Discover section config | 🟠 Medium | ✅ Completed | Tiles built from each workout's own tile column; 4 collections, all names resolved |
| 2.7 | Achievements: 35 definitions with unlock conditions | 🟠 Medium | ✅ Completed | 35 rules written out by hand and paired against the catalog, not regex-parsed |
| 2.8 | Content validator: IDs, references, counts, durations, banned words | 🔴 High | ✅ Completed | 13 tests prove it catches each class of error, not just that it passes |
| 2.9 | Character rig: flat 2D humanoid, joint hierarchy, 2 palettes | 🔴 High | ✅ Completed | Two flat tones per part; `src/modules/demo/rig` (ADR-052) |
| 2.10 | Base pose library: standing, plank, lying on back, lying on front, all fours, seated, side plank, kneeling, inverted, transitions | 🔴 High | ⬜ Not Started | [CONTENT_MAP](CONTENT_MAP.md) §5 |
| 2.11 | Pose sets for all 119 exercises + Lottie exporter | 🔴 High | ⬜ Not Started | Interpolation, seamless loop, motion arcs, < 40 KB each |
| 2.12 | Dev-only animation preview screen for all 119 animations | 🟠 Medium | 🔄 In Progress | `app/dev/rig` shows the 4 proof exercises; grows to 119 after the style gate |
| 2.13 | Muscle map SVG, front and back, with named muscle groups | 🔴 High | ✅ Completed | All 19 groups placed; colours left to the theme |
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

Make the content browsable and searchable. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 3.1 | Content repository API: by ID, filters, related workouts | 🔴 High | ⬜ Not Started | Body focus, level, duration, goal, quiet |
| 3.2 | `ListRow` component + generic list screen `/list/[type]` | 🔴 High | ⬜ Not Started | |
| 3.3 | Map quick filters and every "More >" to list types | 🟠 Medium | ⬜ Not Started | |
| 3.4 | Search screen: recent searches, results grouped by Workouts / Exercises / Challenges | 🟠 Medium | ⬜ Not Started | |
| 3.5 | Favourites: table, toggle, favourites list | 🟠 Medium | ⬜ Not Started | Heart on workout details; list under Settings → My favourites |
| 3.6 | Loading, empty and error states for lists | 🟠 Medium | ✅ Completed | `LoadingState`, `EmptyState`, `ErrorState` in `core/ui` |
| 3.7 | Unit tests: filters, search, related | 🔴 High | ⬜ Not Started | |
| 3.8 | Goal lists: challenges first as "N-day plan" rows, then workouts | 🟠 Medium | ⬜ Not Started | Reference `…131652…` |
| 3.9 | "Recent" list opened by the Discover history icon | 🟢 Low | ⬜ Not Started | Completed workouts, newest first |

**Done when:** filters by body focus, level, duration and goal, and search, all return correct results.

---

## Phase 4: Workout Details & Exercise Guide

Show what a workout contains and how to do each exercise. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 4.1 | `ExerciseDemo`: Lottie loop, pause when off-screen, fallback thumbnail, error boundary | 🔴 High | ⬜ Not Started | First frame < 200 ms |
| 4.2 | `ExerciseThumb` and `Artwork` vector components | 🔴 High | ⬜ Not Started | |
| 4.3 | Workout details screen | 🔴 High | ⬜ Not Started | Hero, favourite heart, sheet, meta row, expandable intro, Start, exercise preview + View all (tap a row → guide), You may like, sticky Start |
| 4.4 | Full exercise list view | 🟠 Medium | ⬜ Not Started | |
| 4.5 | Exercise guide sheet: Animation / Muscle / How to do + fixed sections | 🔴 High | ⬜ Not Started | Duration, instructions, focus area, mistakes, breathing |
| 4.6 | `MuscleMap` component with primary and secondary highlights | 🔴 High | ⬜ Not Started | |
| 4.7 | Edit icon → builder pre-filled with this workout | 🟢 Low | ⬜ Not Started | Wired up in Phase 11 |
| 4.8 | "Easier" / "Harder" buttons in the guide (valid links only) | 🟢 Low | ⬜ Not Started | CONTENT_MAP §3 (ADR-040) |

**Done when:** animations loop, the fallback works and the guide sheet shows every section.

---

## Phase 5: Workout Player

The heart of the app: guided, interruption-proof workouts. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 5.1 | Engine state machine: IDLE → PREP → EXERCISE → REST → COMPLETE, PAUSED, QUIT | 🔴 High | ⬜ Not Started | Pure TypeScript |
| 5.2 | Timestamp timing, pause/resume, fast-forward on return to the foreground | 🔴 High | ⬜ Not Started | Never decrement on ticks (ADR-021) |
| 5.3 | Snapshot to KV on every phase change + "Resume workout?" (< 2 h) | 🔴 High | ⬜ Not Started | |
| 5.4 | P1 Ready screen: ring countdown and skip | 🔴 High | ⬜ Not Started | |
| 5.5 | P2 Exercise screen: timer, or reps + Done + adjuster; prev/pause/next; thumbs | 🔴 High | ⬜ Not Started | |
| 5.6 | P3 Rest screen: blue panel, next exercise, +20s, Skip, Edit rest time | 🔴 High | ⬜ Not Started | |
| 5.7 | P4 Pause overlay and P5 quit confirmation (save partial / discard) | 🔴 High | ⬜ Not Started | |
| 5.8 | P6 Finish screen: stats, streak, weekly ring, badges, share, feedback | 🔴 High | ⬜ Not Started | |
| 5.9 | Cues: voice, beeps, haptics, ducking, silent mode | 🟠 Medium | ⬜ Not Started | All can be turned off |
| 5.10 | Workout Settings sheet: music note + ducking, sound options, rest timer, prep timer | 🟠 Medium | ⬜ Not Started | |
| 5.11 | Keep the screen awake during PREP, EXERCISE and REST only | 🟠 Medium | ⬜ Not Started | |
| 5.12 | Save sessions and session items + kcal calculation | 🔴 High | ⬜ Not Started | One transaction |
| 5.13 | Save exercise thumbs ratings to `exercise_prefs` | 🟢 Low | ⬜ Not Started | |
| 5.14 | Unit tests: state machine, timing, fast-forward, snapshot, kcal | 🔴 High | ⬜ Not Started | |
| 5.15 | Device scenarios S1–S3: phone call, screen lock, app killed | 🔴 High | ⬜ Not Started | [TEST_PLAN](TEST_PLAN.md) §8 |
| 5.16 | Quiet Mode: swap jumping exercises for their quiet versions | 🟠 Medium | ⬜ Not Started | CONTENT_MAP §4 (ADR-041) |
| 5.17 | Share card: SVG → PNG → share sheet | 🟠 Medium | ⬜ Not Started | ADR-047; no body data on the card |

**Done when:** a full workout survives a phone call, a screen lock and the app being killed.

---

## Phase 6: Onboarding & Profile

Get a new user to their first workout in under 60 seconds. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 6.1 | Bootstrap routing: first run, resume prompt or tabs | 🔴 High | ⬜ Not Started | |
| 6.2 | Welcome slides (3) | 🟠 Medium | ⬜ Not Started | |
| 6.3 | Gender, goal and level steps | 🔴 High | ⬜ Not Started | Gender picks the character variant |
| 6.4 | Body data step: height, weight, birth year (18+ only), skippable | 🔴 High | ⬜ Not Started | ADR-032 |
| 6.5 | Schedule step: days per week + reminder time | 🟠 Medium | ⬜ Not Started | |
| 6.6 | Safety step: PAR-Q questions + disclaimer; any "yes" shows advice to see a doctor | 🔴 High | ⬜ Not Started | |
| 6.7 | Ready step: plan summary → Start first workout | 🔴 High | ⬜ Not Started | |
| 6.8 | Profile repository and store | 🔴 High | ⬜ Not Started | |
| 6.9 | Settings tab (core): profile, weekly goal, units, theme, sound and timers, quiet mode, disclaimer, privacy, about | 🔴 High | ⬜ Not Started | Reminders and backup rows are added in Phase 11 |
| 6.10 | Date picker (calendar sheet) and time picker (hour/minute wheels) | 🔴 High | ✅ Completed | Built on `date-fns`, no extra package |

**Done when:** a new user reaches a running workout in under 60 seconds.

---

## Phase 7: Training Tab

Build the main screen with all 13 sections. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 7.1 | Header (app name + streak flame) and search pill | 🔴 High | ⬜ Not Started | Sections 1–2 |
| 7.2 | Weekly Goal card + edit-target sheet | 🔴 High | ⬜ Not Started | Section 3 |
| 7.3 | Challenge carousel with gradient cards | 🔴 High | ⬜ Not Started | Section 4 |
| 7.4 | Body Focus chip tabs + 3 level rows with bolts | 🔴 High | ⬜ Not Started | Section 5 |
| 7.5 | Quick filter chips (2 scrolling rows) | 🟠 Medium | ⬜ Not Started | Section 6 |
| 7.6 | Custom Workout card + saved custom workouts | 🟠 Medium | ⬜ Not Started | Section 7 |
| 7.7 | Recommended banner | 🟢 Low | ⬜ Not Started | Section 8 |
| 7.8 | Just For You (2 rows + More) | 🟠 Medium | ⬜ Not Started | Section 9 |
| 7.9 | Stretch & Warm Up (2-up cards + More) | 🟠 Medium | ⬜ Not Started | Section 10 |
| 7.10 | Popular Goals (chip tabs + 3 rows + More) | 🟠 Medium | ⬜ Not Started | Section 11 |
| 7.11 | Explore more banner | 🟢 Low | ⬜ Not Started | Section 12 |
| 7.12 | Feedback: "Tell us what you need" → local note that can be exported | 🟢 Low | ⬜ Not Started | Section 13 |
| 7.13 | Suggestion ranking: level, goal, disliked exercises ranked lower | 🟠 Medium | ⬜ Not Started | Feeds Just For You and Picks for you |
| 7.14 | "Weekly goal reached" modal (once per week) | 🟠 Medium | ⬜ Not Started | System modal (spec §9.14) |

**Done when:** all 13 sections render, navigate correctly and look right in light and dark.

---

## Phase 8: Discover Tab

Build the browse surface: banners, curated sections, body-focus tiles and category pages. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 8.1 | Header (search + history) and featured banner | 🟠 Medium | ⬜ Not Started | |
| 8.2 | Picks for you rows | 🟠 Medium | ⬜ Not Started | |
| 8.3 | Collection banner | 🟢 Low | ⬜ Not Started | |
| 8.4 | For beginners (3-up cards) | 🟠 Medium | ⬜ Not Started | |
| 8.5 | Fast workout rows | 🟠 Medium | ⬜ Not Started | |
| 8.6 | Challenge (3-up cards) | 🟠 Medium | ⬜ Not Started | |
| 8.7 | Stretch (2-row horizontal grid) | 🟠 Medium | ⬜ Not Started | DESIGN §4.3 grid card |
| 8.8 | 6 body-focus tiles + category screen | 🔴 High | ⬜ Not Started | Dark hero + full list |

**Done when:** every section opens the right list, category or workout.

---

## Phase 9: Report Tab

Show progress: activity totals, history, streaks, weight and BMI. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 9.1 | Summary card (workouts, kcal, minutes) + period toggle | 🔴 High | ⬜ Not Started | This week / This month / Total |
| 9.2 | History week strip, day streak, personal best | 🔴 High | ⬜ Not Started | |
| 9.3 | Streak and weekly-goal logic + unit tests (month and year boundaries) | 🔴 High | ⬜ Not Started | Streak day = session ≥ 50% complete |
| 9.4 | Weight log sheet: date, kg/lbs, ruler picker | 🔴 High | ⬜ Not Started | |
| 9.5 | Weight chart (SVG) + current / heaviest / lightest | 🔴 High | ⬜ Not Started | |
| 9.6 | BMI card: scale, category, height edit | 🔴 High | ⬜ Not Started | |
| 9.7 | Personal bests: longest plank, most reps in a set, longest workout | 🟠 Medium | ⬜ Not Started | |
| 9.8 | Achievements preview (grid + More) | 🟠 Medium | ⬜ Not Started | |
| 9.9 | All records: month calendar → day sessions → session detail | 🟠 Medium | ⬜ Not Started | |
| 9.10 | Unit tests for kcal, BMI and aggregations; scenarios S9 and S10 | 🔴 High | ⬜ Not Started | |
| 9.11 | Achievements screen: all 35 badges, locked and unlocked | 🟠 Medium | ⬜ Not Started | Route `/achievements` |

**Done when:** stats, streak, weight and BMI match hand calculations.

---

## Phase 10: Challenges

Multi-day plans with a day-by-day grid and progression that survives restarts. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 10.1 | Challenge list with filter chips | 🔴 High | ⬜ Not Started | All, Build Muscle, Burn Fat, Full Body, Flexibility |
| 10.2 | Challenge detail: hero, day grid (done / today / locked / rest), Start Day N | 🔴 High | ⬜ Not Started | |
| 10.3 | Day progression and persistence | 🔴 High | ⬜ Not Started | |
| 10.4 | Single-exercise ramp challenges (Plank, Push-Up, Squat) | 🟠 Medium | ⬜ Not Started | +~10% per training day |
| 10.5 | Restart or leave a challenge | 🟢 Low | ⬜ Not Started | |
| 10.6 | Unit tests for progression | 🔴 High | ⬜ Not Started | |

**Done when:** finishing Day 1 unlocks Day 2 and progress survives an app restart.

---

## Phase 11: Builder, Achievements, Reminders, Backup

The remaining features: custom workouts, badges, local reminders and data portability. **Status: ⬜ Not Started**

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 11.1 | Gate: confirm the final app name and update the constant | 🔴 High | ⬜ Not Started | ADR-012 |
| 11.2 | Builder steps 1–3: name and focus, exercise picker, per-exercise settings + reorder | 🔴 High | ⬜ Not Started | |
| 11.3 | Save, edit, delete and run custom workouts | 🔴 High | ⬜ Not Started | |
| 11.4 | Achievements evaluator + celebration modal | 🟠 Medium | ⬜ Not Started | 35 badges |
| 11.5 | Reminders: permission primer, day toggles, time, survives reboot | 🟠 Medium | ⬜ Not Started | |
| 11.6 | Backup export | 🔴 High | ⬜ Not Started | JSON through the share sheet |
| 11.7 | Backup import (validated, transactional) + Reset all data | 🔴 High | ⬜ Not Started | |
| 11.8 | Settings: reminders, backup, credits and licences screens | 🟠 Medium | ⬜ Not Started | |
| 11.9 | Unit tests for builder, achievements and backup; scenarios S6 and S7 | 🔴 High | ⬜ Not Started | |
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
| 12.6 | Verify the release manifest: no INTERNET, only the notification runtime permission | 🔴 High | ⬜ Not Started | Scenario S11 |
| 12.7 | Full regression and every scenario test | 🔴 High | ⬜ Not Started | [TEST_PLAN](TEST_PLAN.md) |
| 12.8 | Privacy policy (`DOC/PRIVACY.md`) hosted on GitHub Pages | 🔴 High | ⬜ Not Started | Required URL for Play |
| 12.9 | `DOC/LICENSES.md` + credits screen content | 🟠 Medium | ⬜ Not Started | |
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

- **Now:** the owner reviews the proposed and pending decisions (T0.13), chooses the build approach (T0.16) and prepares the phone and dev machine (T0.17).
- **Next:** Phase 1 – Foundation. It starts once the owner gives the go-ahead to write code.
- **Critical path:** Phase 2 (119 generated animations and the content generator) is the largest phase and the biggest schedule risk.
- **Start early:** the 14-day closed test (T12.14) cannot be shortened, so internal testing should begin as soon as the app is usable.

---

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version: 152 tasks across 13 phases |
| 1.1 | Sep 23, 2026 | Completeness audit: 12 tasks added (T0.18, T2.19, T2.20, T3.8, T3.9, T4.8, T5.16, T5.17, T6.10, T7.14, T9.11, T11.10); 164 tasks in total |
