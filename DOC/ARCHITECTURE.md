# 🏛️ System Architecture

### Home Workout – Offline-First Mobile App

This document describes the overall system architecture, technology stack, folder structure, data flow and key design decisions for the Home Workout app. It is the technical companion to the [PRD](PRD.md).

| Field | Details |
|---|---|
| **Version** | 1.6 |
| **Last updated** | October 4, 2026 |
| **Status** | Draft – approved decisions plus proposals awaiting owner approval (see [DECISIONS.md](DECISIONS.md)) |
| **Related** | [PRD](PRD.md) · [DESIGN](DESIGN.md) · [CONTENT_MAP](CONTENT_MAP.md) · [RULES](RULES.md) · [TASKS](TASKS.md) · [TEST_PLAN](TEST_PLAN.md) · [SECURITY](SECURITY.md) |

---

## 1. High-Level Architecture

> **Current exercise-media override (Sep 28, 2026, ADR-056):** Exercise demos are bundled static images. Local `require()` sources replace the planned Lottie playback path for now. Internet access is allowed only for one-time asset sourcing outside the app, with author/source/licence records; no runtime image downloads. Rig and Lottie sections below are deferred historical design.

Home Workout is a **single, self-contained Android app**. There is no server, no internet access and no user account. Everything the app needs (content, animations, images, sounds) ships inside the app bundle, and all user data stays on the device.

```
┌──────────────┐        ┌────────────────────────────────────────────────────────────┐
│     User     │        │                  Home Workout app (on the phone)           │
│  (Android    │  taps  │                                                            │
│   phone)     │ ─────▶ │   ┌─────────────┐     ┌────────────────┐     ┌──────────┐  │
└──────────────┘        │   │  UI layer   │ ──▶ │ Feature modules│ ──▶ │   Data   │  │
                        │   │ expo-router │     │ logic + stores │     │  layer   │  │
                        │   │  screens    │ ◀── │   (Zustand)    │ ◀── │          │  │
                        │   └─────────────┘     └────────────────┘     └──────────┘  │
                        │          │                    │                  │         │
                        │          ▼                    ▼                  ▼         │
                        │   ┌──────────────────────────────┐   ┌──────────────────┐  │
                        │   │ Device services              │   │ SQLite · KV store│  │
                        │   │ speech · audio · haptics ·   │   │ Content pack     │  │
                        │   │ notifications · keep-awake · │   │ (bundled JSON,   │  │
                        │   │ files & sharing              │   │  Lottie, SVG)    │  │
                        │   └──────────────────────────────┘   └──────────────────┘  │
                        └────────────────────────────────────────────────────────────┘
                                ✕ No internet   ✕ No backend   ✕ No analytics
```

### Layer responsibilities

| Layer | Responsibility | Examples |
|---|---|---|
| **UI layer** | Renders state and forwards user input. No business logic. | `app/` routes, `core/ui` components |
| **Feature modules** | Business logic for one domain, Zustand store, hooks, use-case functions | Workout engine, report calculators, challenge progression |
| **Data layer** | Persistence and content access, **only** through repositories | Drizzle repositories, KV wrapper, content repository |
| **Device services** | Thin wrappers around Expo native modules | Voice cues, beeps, haptics, reminders, file export |

### Architecture principles

1. **Offline by construction.** No code path may use the network (see [SECURITY.md](SECURITY.md) §6).
2. **One-way data flow.** UI → action → module service → repository → store update → UI.
3. **Pure logic, thin screens.** Calculations (timer, kcal, BMI, streaks, progression) are pure functions, so they are easy to unit-test.
4. **Modules are isolated.** A module exposes a public API through its `index.ts`, and other modules never import its internals.
5. **Content is read-only; user data is read-write.** They live in different stores (§6).

---

## 2. Technology Stack

| Layer | Technology | Latest on npm (Sep 23, 2026) | Purpose |
|---|---|---|---|
| Framework | Expo SDK 57 (`expo`) | 57.0.24 | App runtime, native modules, build tooling |
| UI runtime | React Native | 0.86 (bundled with SDK 57) | Native UI |
| Language | TypeScript (strict) | from Expo template | Type safety |
| Navigation | `expo-router` | 57.0.22 | File-based routes, tabs, stacks, modals |
| State | `zustand` | 5.0.15 | One small store per domain |
| Database | `expo-sqlite` + `drizzle-orm` | 57.0.3 / 0.45.3 | User data, typed schema, migrations |
| Key-value | `expo-sqlite/kv-store` | part of `expo-sqlite` | Settings, player snapshot, small flags |
| Exercise demos | `lottie-react-native` | ~7.3.8 (SDK 57 bundled version) | Plays selected local 2D Lottie animations (ADR-061) |
| Exercise MP4 demos | `expo-video` | ~57.0.5 | Owner-approved local MP4 playback with photo fallback (ADR-063); no background playback or PiP |
| UI motion | `react-native-reanimated` | 4.7.0 | 60 fps UI-thread animations |
| Vector graphics | `react-native-svg` | 15.15.5 | Muscle map, charts, timer rings, gradients, artwork |
| Lists | `@shopify/flash-list` | 2.3.2 | Fast, memory-efficient lists |
| Bottom sheets | `@gorhom/bottom-sheet` | 5.2.14 | All secondary actions |
| Voice cues | `expo-speech` | SDK 57 | Exercise names, "10 seconds left", "Next up" |
| Sounds | `expo-audio` | SDK 57 | Countdown beeps, completion sounds |
| Reminders | `expo-notifications` | SDK 57 | Local notifications only |
| Haptics / screen | `expo-haptics`, `expo-keep-awake` | SDK 57 | Phase-change vibration, screen on during workout |
| Backup | `expo-file-system`, `expo-sharing`, `expo-document-picker` | SDK 57 | Export and import of user data |
| i18n | `i18n-js` + `expo-localization` | 4.5.3 / SDK 57 | All text through translation keys |
| Icons | `lucide-react-native` | 1.47.0 | Stroke icon set |
| Dates | `date-fns` | 4.4.0 | Calendar and streak maths |
| Fonts | Poppins (OFL) via `expo-font` | bundled files | Brand typography |
| Testing | `jest` + React Native Testing Library | from Expo template | Unit and component tests |
| Asset tools | TypeScript scripts run with Node | — | Build-time generators in `tools/` (never shipped) |
| Version control | Git | 2.55 installed | Source history |

> **Versions:** the exact versions are pinned in Phase 1 with `npx expo install`, which picks versions that match Expo SDK 57. The column above is only a snapshot from planning day.

**Platform targets:** minimum Android 7.0 (API 24); compile and target API 36 (Expo SDK 57 defaults, as Google Play requires for new apps).

**Development machine requirements**

| Tool | Requirement | This machine (Sep 23, 2026) |
|---|---|---|
| Node.js | ≥ 22.13 (Expo SDK 57). An LTS release is recommended. | 26.8.2 ("Current" line, not yet LTS) |
| Git | Any recent version | 2.55 ✅ |
| Expo Go | SDK 57 build on a real Android phone | To install |
| JDK | 17 (React Native docs recommend it; newer versions may fail) – **local builds only** | 25 installed ⚠️ |
| Android SDK | Platform 36 and build tools – **local builds only** | Not installed |

Packages that the approved libraries need but spec §4 does not list are awaiting approval (ADR-037).

---

## 3. Folder Structure

The project uses a **feature-based** structure. Screens live in `app/` (routing only), and all logic lives in `src/modules/`.

```text
workout/                          # repository root (E:\Work\workout)
├── app/                          # expo-router routes – compose module components, no business logic
│   ├── _layout.tsx               # root providers: theme, i18n, database, error boundary
│   ├── index.tsx                 # bootstrap → onboarding, resume prompt or tabs
│   ├── onboarding/               # welcome, gender, goal, level, body-data, schedule, safety, ready
│   ├── (tabs)/                   # _layout, training, discover, report, settings
│   ├── workout/[id].tsx          # workout details
│   ├── player/                   # prep, exercise, rest, complete (full-screen stack, no tab bar)
│   ├── list/[type].tsx           # generic list used by every "More >"
│   ├── category/[id].tsx         # Discover body-focus category
│   ├── challenge/                # index (list) and [id] (detail)
│   ├── builder/                  # custom workout builder (3 steps)
│   ├── history.tsx               # all records (calendar + day sessions)
│   ├── session/[id].tsx          # session detail
│   ├── achievements.tsx          # all 35 badges
│   ├── search.tsx
│   ├── dev/                      # animation preview – development builds only
│   └── settings/                 # reminders, units, backup, favourites, credits, privacy, disclaimer, about
├── src/
│   ├── modules/
│   │   ├── core/                 # theme, i18n, db, kv, ui primitives, error boundary, utils
│   │   ├── content/              # content-pack types, loader, indexes, repository, search
│   │   ├── demo/                 # ExerciseDemo (Lottie), thumbnails, artwork, muscle map
│   │   ├── player/               # workout engine, timing, snapshot, cues, session writer
│   │   ├── profile/              # profile, onboarding state, units, preferences
│   │   ├── report/               # stats, streaks, weekly goal, kcal, BMI, weight, personal bests
│   │   ├── challenges/           # schedules, progression, state
│   │   ├── builder/              # custom workout drafts, validation, CRUD
│   │   ├── achievements/         # definitions, evaluator, celebration
│   │   ├── reminders/            # schedule and cancel local notifications, permission primer
│   │   └── backup/               # export, import (validate + transaction), reset
│   └── types/                    # types shared across modules
├── assets/
│   ├── data/                     # generated content pack: exercises, workouts, challenges,
│   │                             #   categories, achievements (JSON)
│   ├── lottie/exercises/         # one .json per exercise (generated)
│   ├── lottie/ui/                # spinner, streak flame, achievement pop, goal ring, celebration
│   ├── svg/muscle-map/           # front and back body maps with named muscle groups (generated)
│   ├── sounds/                   # beep_short, beep_long, complete, achievement (generated WAV)
│   ├── fonts/                    # Poppins (OFL)
│   ├── images/                   # icon, adaptive icon, splash, notification icon (generated)
│   └── i18n/en.json              # all English copy (generated from the catalog)
├── tools/                        # build-time generators in TypeScript – never shipped in the app
│   ├── content/                  # catalog data + rules → content pack + en.json
│   ├── rig/                      # character rig, pose library, Lottie exporter
│   ├── art/                      # muscle map, artwork data, branding
│   ├── sound/                    # WAV synthesis
│   └── build-assets.ts           # runs all generators, prints a size report, fails on budget
├── DOC/                          # all project documentation (this folder)
├── reference-img/                # reference screenshots – UX guide only, never shipped
├── app.config.ts                 # Expo config (name, package, permissions per build variant)
├── eas.json · package.json · tsconfig.json · drizzle.config.ts · jest.config.js
```

**Inside a feature module**

```text
src/modules/<feature>/
├── components/      # UI pieces owned by this feature
├── hooks/           # React hooks exposed to screens
├── services/        # pure logic and use-case functions
├── repository.ts    # data access (if the feature owns tables)
├── store.ts         # Zustand store (if needed)
├── types.ts
└── index.ts         # public API – the only file other modules may import
```

Tests sit next to the code they test (`*.test.ts` / `*.test.tsx`), as proposed in ADR-035.

---

## 4. Module Design

| Module | Responsibility | Key parts | May use |
|---|---|---|---|
| `core` | Foundation shared by everything | Theme tokens and `useTheme`, i18n, DB client and migrations, KV wrapper, UI primitives (`ListRow`, `SectionHeader`, `ChipTabs`, `FilterChip`, `GradientCard`, `MetaRow`, `TimerRing`, `PrimaryButton`, `Sheet`), error boundary, dev logger | — |
| `content` | Read-only access to the content pack | Types, loader, in-memory indexes, filters (body focus, level, duration, goal, quiet), search, "You may like" | core |
| `demo` | Visual representation of exercises | `ExerciseDemo` (Lottie with fallback), `ExerciseThumb`, `Artwork`, `MuscleMap` | core, content |
| `player` | Running a workout | Engine (pure state machine), timing, snapshot, audio/voice/haptic cues, session writer, plan-day finish card (ADR-067) | core, content, demo, profile, report, challenges |
| `profile` | Who the user is and their preferences | Profile store, onboarding flow state, unit conversion, preference keys | core, content (first workout selection and goal types) |
| `report` | Progress and statistics | Aggregations, streak and weekly goal, kcal, BMI, weight log, personal bests, history | core, content, profile |
| `challenges` | Multi-day plans | Schedule lookup, day progression, state; one active plan (`getActivePlan`, `selectPlan`) | core, content |
| `home` | The plan-first Training tab (ADR-066) | `HomeScreen` (picks `WelcomeHome` or `PlanHome`), `PlanScreen` (`/plan`), `PlanPath`, plan recommendation from goal + level, week path | core, content, challenges, profile, report |
| `builder` | Custom workouts | Draft state, validation, save/edit/delete | core, content |
| `achievements` | Badges | Definitions, evaluator, unlock and celebration | core, report |
| `reminders` | Local notifications | Schedule, cancel, reboot-safe, permission primer | core, profile |
| `backup` | User data portability | Export JSON, validated transactional import, reset | core (all repositories through their public APIs) |

**Tab screen sections (ADR-051).** The Training and Discover tabs have no module of their own. Their sections split in two:

- **Generic visuals live in `core/ui`** — `Row`, `Chip`, `Banner`, `MediaCard`, `GradientCard`, `Section`, `HScroll`, `WeekStrip`, `MetaCell` and the rest. They take props and know nothing about features. The reference reuses the same vocabulary across every tab, so one `Row` serves 8 placements, one `Banner` serves 5 and `WeekStrip` serves both the Training weekly goal and the Report history.
- **Data-bound sections live in the module that owns the data** — Weekly Goal in `report`, challenge carousel in `challenges`, Body Focus and list sections in `content`, Custom Workout card in `builder`. Each is a thin wrapper that reads its own data and composes `core/ui` pieces.

Routes in `app/` only arrange the sections in order.

**Cross-module orchestration** happens in use-case functions, never by stores calling each other. Example: `completeWorkout()` in `player` saves the session, then calls `report.updateStreakAndGoal()`, `report.updatePersonalBests()` and `achievements.evaluate()` through their public APIs.

---

## 5. Navigation Map

```text
/ (bootstrap)
├── /onboarding                           first run only (8 steps)
├── /(tabs)                               bottom tab bar
│   ├── training                          Tab 1 – plan Home: welcome (new user) or today's plan day
│   ├── discover                          Tab 2
│   ├── report                            Tab 3
│   └── settings                          Tab 4
├── /workout/[id]                         stack
├── /list/[type]                          stack – every "More >", quick filters, goal lists
│                                         (challenges first), favourites, recent, search results
├── /category/[id]                        stack – Discover category
├── /plan                                 stack – customize plan (goal, level, days, all plans)
├── /challenge  and  /challenge/[id]      stack
├── /builder/*                            stack – 3 steps
├── /history · /session/[id]              stack – all records, session detail
├── /achievements · /search · /settings/* stack
├── /dev/animations                       development builds only (animation QA)
└── /player/*                             full-screen modal stack, no tab bar
                                          (back = pause → quit confirmation)
```

**Bottom sheets (not routes):** exercise guide, workout settings, rest timer, prep timer, sound options, weight log, weekly goal edit, height/BMI edit, "Edit rest time".

**System modals:** achievement unlocked, weekly goal reached, resume workout?, notification permission primer, what's new.

---

## 6. Data Architecture

### 6.1 Three kinds of data

| Kind | Examples | Storage | Changes |
|---|---|---|---|
| **Content** | Exercises, workouts, challenges, categories, achievements, all copy | Bundled JSON content pack in `assets/data/` + `en.json`, loaded into memory at start-up | Read-only. Changes only with an app update. |
| **User data** | Profile, sessions, weight log, challenge progress, custom workouts, favourites | SQLite through `expo-sqlite` + Drizzle | Read-write. Evolves with versioned migrations. |
| **Quick state** | Preferences, player snapshot, recent searches, "what's new" flag | `expo-sqlite/kv-store` | Small keys. Fast synchronous reads. |

### 6.2 Content pack

- Produced by `tools/content` from the [content catalog in CONTENT_MAP](CONTENT_MAP.md) and the rules in [PRD §8](PRD.md#8-content).
- **Validated at build time.** IDs are unique, every reference resolves, counts match the catalog (119 / 60 / 12 / 6 + 5 / 35), workout durations match the catalog within ±1 minute, and size budgets pass.
- Carries a `contentVersion`. It is loaded once and indexed in memory by id, body focus, level, goal and type (ADR-023, proposed).
- All text is referenced by i18n keys; English copy lives in `assets/i18n/en.json`.
- The same format can later be downloaded or edited through an admin panel (v2 or later) without changing the app's data layer.
- Beyond spec v3, the content model adds **collections**, **equipment values** (`none`, `household`, `optional_weight`), **props**, **views**, **quiet swaps**, **resolved variation links** and **19 muscle groups**. Every value per item is listed in [CONTENT_MAP.md](CONTENT_MAP.md) (ADR-040 to ADR-050).
- Challenge day workouts are generated as separate entries. They are not part of the 60 catalog workouts.

### 6.3 Database schema (SQLite)

| Table | Columns | Notes |
|---|---|---|
| `profile` | `id=1`, gender, goal, level, heightCm, weightKg, birthYear, daysPerWeekTarget (default 4), createdAt | Single row. Preferences live in KV (ADR-025, proposed). |
| `sessions` | id (UUID), workoutId, challengeId?, day?, startedAt, endedAt, durationSec, completionPct, kcal, feedback?, localDate, createdAt | One row per workout attempt, including partial ones |
| `session_items` | id, sessionId → sessions, exerciseId, orderIndex, targetSeconds?, targetReps?, doneSeconds, doneReps?, skipped, rating? | One row per exercise played |
| `challenge_state` | challengeId (PK), currentDay, startedAt, lastCompletedAt, status | Progress per challenge |
| `weight_log` | id, recordedAt, localDate, weightKg | Always stored in kg |
| `streaks` | `id=1`, current, longest, lastWorkoutDate | "Personal Best" on the Report tab = `longest` |
| `personal_bests` | id, exerciseId, metric, value, achievedAt | Longest plank, most reps in a set, longest workout |
| `achievements` | id (PK), unlockedAt | Badge definitions come from the content pack |
| `custom_workouts` | id, title, itemsJson, createdAt, updatedAt | User-built workouts |
| `favorites` | workoutId (PK), addedAt | |
| `exercise_prefs` | exerciseId (PK), rating | Thumbs up/down; disliked exercises rank lower in suggestions |

**Differences from spec v3 §6.2 (proposed in ADR-025):** preferences (units, theme, quiet mode, locale) move from `profile` to the KV store. The separate `weekly_goal` table is dropped because it duplicated `profile.daysPerWeekTarget`. The `settings` table is replaced by the KV store.

**Conventions**

- Timestamps are epoch milliseconds (UTC). Day-based logic (streaks, weekly goal, history) uses a `localDate` string (`YYYY-MM-DD`) computed on the device when the row is written.
- Units are stored in SI (kg, cm, seconds) and converted only in the UI.
- IDs are UUID v4 strings. Singleton rows use `id = 1`.
- Indexes: `sessions(startedAt)`, `sessions(localDate)`, `sessions(workoutId)`, `session_items(sessionId)`, `weight_log(recordedAt)`.
- Migrations are generated by `drizzle-kit`, bundled with the app and applied at start-up inside a transaction. Applied migrations are never edited.

### 6.4 KV keys

All keys are namespaced:

| Key | Type | Default |
|---|---|---|
| `settings.units` | `"metric"` or `"imperial"` | From device locale |
| `settings.theme` | `"system"`, `"light"` or `"dark"` | `"system"` |
| `settings.quietMode` | boolean | `false` |
| `settings.sound.voice` / `.beeps` / `.announceName` | boolean | `true` |
| `settings.timers.restMode` | `"default"` or `"custom"` | `"default"` |
| `settings.timers.restSeconds` | number, 5–120 | 20 |
| `settings.timers.restEnabled` | boolean | `true` |
| `settings.timers.prepSeconds` | 0, 5, 10, 15, 20 or 30 | 15 |
| `onboarding.completed` | boolean | `false` |
| `player.snapshot` | JSON (see §8) | none |
| `search.recent` | string[] (max 10) | `[]` |
| `app.lastVersionSeen` | string | none |
| `feedback.note` | string (max 2,000 characters) | `""` |

---

## 7. Key Flows

### 7.1 App start (target: under 2 seconds)

```text
splash → load fonts → open DB + run migrations → load content pack + build indexes
       → read KV (onboarding.completed, player.snapshot)
       → route: onboarding  |  "Resume workout?" (snapshot < 2 h old)  |  Training tab
```

### 7.2 Run a workout

```text
Workout details → Start → engine.start(workout, settings)
  PREP (ring countdown) → EXERCISE → REST → … → COMPLETE
  (a snapshot is saved to KV at every phase change)
COMPLETE → completeWorkout():
  1. write session + items (one transaction)
  2. update streak and weekly goal
  3. update personal bests
  4. evaluate achievements → celebration modal if any unlocked
  5. clear the snapshot → show the finish screen
```

### 7.3 Interruptions

- **App goes to the background (call, lock, home button).** No timer needs to run. On return, the engine recomputes from timestamps and fast-forwards through any phases that ended.
- **App is killed.** On the next launch, a snapshot younger than 2 hours triggers "Resume workout?". Older snapshots are discarded.
- **Quit.** The user chooses "Save & exit" (partial session with `completionPct`) or "Discard".

### 7.4 Backup

```text
Export:  collect DB tables + KV preferences → JSON { app, schemaVersion, contentVersion, exportedAt, data }
         → write to the cache directory → system share sheet (user decides where it goes)
Import:  document picker → size check (≤ 5 MB) → parse → validate every field
         → confirm "This replaces your data" → one transaction (replace all) → reload stores
         → any error = rollback, nothing changes
Reset:   confirm twice → delete all tables and KV preferences → back to onboarding
```

The current backup format uses `app: "offline-workout"` and `schemaVersion: 2`;
import also accepts version 1 and normalizes it to version 2. Version 2 preserves custom
workout focus and per-item rest in the plan envelope described below.
All 11 user tables use their SQLite column names; preferences use the typed KV keys.
The unfinished player snapshot is exported as `null`. Unknown fields, invalid ranges,
duplicate keys and orphan session items are rejected before confirmation.
Import/reset attaches Expo SDK 57's `ExpoSQLiteStorage` database to the user-data connection
and replaces both inside one synchronous transaction. Ordinary SQL failures roll back both;
power-loss atomicity across attached databases in WAL mode remains a release/device check.
After replacement the theme reloads, reminders reconcile without prompting, and navigation
returns through the onboarding gate. A private cache export is retained until the next export
or data replacement so share recipients can finish reading it; external backups remain untouched.

### 7.5 Custom workouts

The three-step builder edits a name/focus, local exercise selection and ordered per-set
reps or seconds plus rest. The existing `custom_workouts.items_json` column stores
`{ version: 1, bodyFocus, items }`; legacy item arrays remain readable with full-body focus
and a 20-second rest fallback. No database migration or catalog duplication is needed.
IDs use the `custom_` prefix. Saved plans resolve into the existing player shape with
`useItemRest`; global rest OFF still disables rest, and the final set has no trailing rest.
Training lists saved templates, and catalog workout details can prefill a new copy.
Edits preserve template identity. Editing or deleting invalidates its saved player snapshot;
deletion removes the template/favourite but retains completed sessions and exercise results.
History resolves a current custom title while the template exists, then uses the unknown-workout
fallback after deletion. Component and SQLite tests cover validation, order, CRUD and history retention;
native Back, keyboard, full player/resume and reference layout checks remain.

---

### 7.6 Settings information and measurement units

Settings uses the existing typed `settings.units` preference. Profile inputs and Report
display kg/cm or lbs/ft-in; shared pure helpers in `core/units` convert only at UI boundaries.
Canonical saved measurements and BMI calculation remain kg/cm. Imperial input keeps local
text while typing, and untouched measurements are not rounded back into storage.
Information sheets expose local privacy, adult exercise disclaimer and config-derived About.
`npm run licenses:build` generates a conservative installed production dependency inventory
with deduplicated licence/notice texts, plus the Poppins and vendored muscle-map notices.
The credits sheet searches metadata and renders one selected notice at a time. Source
addresses remain selectable attribution text. The missing-notice report in
[LICENSE_AUDIT](LICENSE_AUDIT.md) and final native/bundle licence review are release gates.

### 7.7 Optional onboarding reminders and Android Back

The onboarding schedule step offers the existing reminder setup route and displays its
saved schedule on return. Skipping setup does not request permission or schedule notifications.
`core/navigation.useAndroidBack` registers only on the focused route and keeps listener
order stable while callback state changes. Shared sheets register while open and consume
Back to dismiss before the underlying screen acts. Builder and onboarding step backwards;
builder/reminder unsaved edits require confirmation. The player freezes its timer before
one Save/Discard quit dialog; Cancel leaves it paused. Finished-session Back cannot leave
until persistence succeeds. Header and hardware actions share the same screen handlers.
Component tests cover focus cleanup, overlay priority, changed drafts, safety gating, duplicate
finish prevention and player save failure. Native gesture/button/keyboard checks remain.

## 8. Workout Engine

The engine is a **pure TypeScript state machine** in `src/modules/player/services/`. The UI only subscribes to it.

```text
IDLE → PREP → EXERCISE → REST → EXERCISE → … → COMPLETE
          ↘       ↕          ↕
           PAUSED (from PREP, EXERCISE or REST)
any state → QUIT (save prompt)
```

| Rule | Detail |
|---|---|
| **Timing** | Store `phaseStartedAt` (epoch ms) and `phaseDurationMs`. Remaining time = duration − (now − start − paused time). **Never** decrement a counter on interval ticks. A 250 ms UI tick only re-renders. |
| **Pause** | Store `pausedAt`. On resume, shift `phaseStartedAt` forward by the paused time. |
| **Fast-forward** | On return to the foreground, walk through every phase whose end time has passed. |
| **Snapshot** | `{ workoutId, challengeId?, day?, index, phase, phaseStartedAt, phaseDurationMs, pausedAt?, startedAt, done[] }` is saved to KV on every phase change. |
| **Rest** | Skipped when an item's rest is 0 or "Enable rest" is off. Supports "+20s", Skip and "Edit rest time". |
| **Reps exercises** | No countdown: show the target, a large **Done** button and an adjuster to record the actual count. |
| **Duration estimates** | Rep-based items count **3 seconds per rep** when estimating workout length (ADR-033, proposed). |
| **One-sided exercises** | Two consecutive items (left, then right), created by the content generator. |
| **Quiet Mode** | When the Quiet Mode setting is on, `engine.start()` resolves the plan first and replaces each jumping exercise with its quiet swap, keeping the same time or reps ([CONTENT_MAP](CONTENT_MAP.md) §4, ADR-041). The session records the exercise actually played. |
| **Cues** | `expo-speech`: name at start, "10 seconds left", "Next up: X" during rest. Beeps at 3-2-1. Haptic on every phase change. Everything can be turned off. Other apps' music is ducked, not stopped, and silent mode is respected. |
| **Screen** | `expo-keep-awake` is active during PREP, EXERCISE and REST only. |
| **Background** | No background service. Voice cues do not play while the phone is locked; the timer stays correct through timestamps. |
| **Safety** | Error boundary around the player. A crash leaves a snapshot, so the workout can be resumed. |

---

## 9. Content & Asset Pipeline

```text
tools/content  (catalog data + rules §8 of PRD) ──▶ assets/data/*.json + assets/i18n/en.json
tools/rig      (rig + pose library + 119 pose sets) ─▶ assets/lottie/exercises/<slug>.json
tools/art      (muscle map, artwork data, branding) ─▶ assets/svg/muscle-map/*.svg, assets/images/*
tools/sound    (synthesised tones) ─────────────────▶ assets/sounds/*.wav
tools/build-assets.ts ── runs everything, prints a size report, fails if a budget is exceeded
```

- Run with `npm run assets`. Generated files are **committed**, so building the app never requires running the generators.
- Generated files are **never edited by hand**. Change the generator, then regenerate.
- `DOC/ASSETS.md` (written in Phase 2) explains how to swap any generated asset for real art: same path, file name, size and Lottie layer names.
- **Thumbnails and workout artwork** are drawn at runtime as vectors with `react-native-svg` (gradient + silhouette from the rig), not stored as WebP files (ADR-024, proposed). They stay sharp, themeable and tiny.
- **Raster outputs** (app icon, adaptive icon, splash, notification icon) must be PNG files. How to render them without Python is pending (ADR-038).
- **Rig capabilities:** Side, Front and Top views, a base-pose library (standing, plank, lying on back or front, all fours, seated, side plank, kneeling, inverted, and transitions) and props (wall, chair, doorway, water bottles, floor line). Without these, 15 exercises cannot be drawn correctly (ADR-042, [CONTENT_MAP](CONTENT_MAP.md) §5).
- **Share card (finish screen):** composed as an SVG with `react-native-svg`, exported to PNG with its `toDataURL()` method, written to the cache directory with `expo-file-system` and shared with `expo-sharing`. No Skia or extra package is needed (ADR-047). The card shows workout name, duration, exercises, kcal and streak, and never body data.

| Asset | Budget |
|---|---|
| Exercise Lottie | < 40 KB each |
| UI Lottie | < 25 KB each |
| Sound | < 25 KB each (44.1 kHz mono WAV) |
| Content pack + `en.json` | < 1 MB total |
| App bundle (AAB) | < 40 MB |

---

## 10. State Management

- One Zustand store per domain: `profile`, `settings`, `player`, `report`, `challenges`, `builder`.
- Stores hold UI-relevant state only. Persistence always goes through repositories.
- Components read state with selectors (`useStore(s => s.value)`) to avoid unnecessary re-renders.
- The workout engine state lives in the `player` store and is driven by engine events.

---

## 11. Theming & Internationalisation

- `ThemeProvider` in `core` exposes light and dark token sets from [DESIGN.md](DESIGN.md) §11. The user chooses System (default), Light or Dark.
- Components use `useTheme()`. Hard-coded colours, sizes and font values are not allowed.
- All user-facing text uses i18n keys (`i18n-js`), with pluralisation rules. English ships in v1.
- Numbers, dates and units are formatted by helpers in `core` (date-fns, kg ↔ lbs, cm ↔ ft/in).

---

## 12. Error Handling & Resilience

| Situation | Behaviour |
|---|---|
| Render error anywhere | Root error boundary shows a friendly screen with "Try again" |
| Error in the player or a Lottie view | Local error boundary: static thumbnail instead of the animation; the workout continues |
| Database migration fails | Error screen with "Export my data" and "Retry". Data is never silently deleted. |
| Missing or corrupt asset | Fallback thumbnail; the build-time validator should make this impossible |
| Import fails validation | Transaction rolls back. The user sees what was wrong, and nothing changes. |
| Crash reporting | No SDK. Crashes and ANRs are monitored in Play Console (Android vitals). |

---

## 13. Performance Strategy

- **Start-up:** only essential work before the first frame (fonts, DB, content indexes). The content pack is small (< 1 MB).
- **Lists:** `FlashList` everywhere, memoised rows, vector thumbnails.
- **Animations:** only one Lottie plays at a time, and it pauses when its screen loses focus. UI motion runs on the UI thread (Reanimated).
- **Rendering:** no heavy work on the JS thread during the player. The timer re-renders at most 4 times per second.
- **Budgets:** cold start < 2 s · 60 fps · Lottie first frame < 200 ms · player memory < 200 MB · AAB < 40 MB.

---

## 14. Build, Environments & Release

| Environment | Used for | How |
|---|---|---|
| **Expo Go** | Most day-to-day development | Scan the QR code from `npx expo start` on a real Android phone |
| **Development build** | Features Expo Go cannot run, release testing | EAS Build or a local Gradle build (ADR-036, pending) |
| **Release (AAB)** | Google Play | R8 minify + resource shrinking, signed with the upload key, Play App Signing |

- `app.config.ts` holds the app name and package ID as constants (ADR-012) and switches settings by `APP_VARIANT`. **Only the production variant blocks the INTERNET permission**, because development builds need the network to reach the local dev server.
- `expo-updates` (over-the-air updates) is **not** installed, because it would need the network.
- Enabling R8 and resource shrinking needs `expo-build-properties`, which is waiting for approval (ADR-037). Add ProGuard keep rules for Lottie and Reanimated if a minified build fails (spec §13).
- Google Play splits the AAB by CPU architecture (ABI) and screen density automatically, so each phone downloads only what it needs.
- Versioning: `versionName` follows semantic versioning (1.0.0) and `versionCode` increases with every Play upload.
- Release path: internal testing → closed testing (12+ testers for 14 days) → staged production rollout. See [TEST_PLAN.md](TEST_PLAN.md) §10.

---

## 15. Key Architecture Decisions

| ADR | Decision | Status |
|---|---|---|
| ADR-003 | 100% offline; no INTERNET permission in release | Accepted |
| ADR-007 | Generated 2D Lottie for all 119 exercises | Accepted |
| ADR-016 | `expo-sqlite/kv-store` instead of MMKV | Accepted |
| ADR-017 | `react-native-svg` instead of Skia | Accepted |
| ADR-021 | Timestamp-based workout timer with snapshots | Accepted |
| ADR-022 | Generators written in TypeScript (Node) | Proposed |
| ADR-023 | Content pack held in memory; SQLite for user data only | Proposed |
| ADR-024 | Vector thumbnails and artwork at runtime | Proposed |
| ADR-025 | Preferences in KV; trimmed profile table | Proposed |
| ADR-036 | EAS Build or local Gradle build | Pending |
| ADR-041 | Quiet Mode swaps for all 9 jumping exercises | Proposed |
| ADR-042 | Rig views, base poses and props | Proposed |
| ADR-047 | Share card exported with `react-native-svg` | Proposed |

The full list with context and consequences is in [DECISIONS.md](DECISIONS.md).

---

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version, based on spec v3, PRD v1.1 and answered open questions |
| 1.1 | Sep 23, 2026 | Completeness audit: new routes (session, achievements, dev), content-model additions, Quiet Mode, rig capabilities, share card, R8 and ABI notes |
| 1.2 | Sep 30, 2026 | Documented version-one backup validation, attached-KV transaction, cache lifetime and native verification limits |
| 1.3 | Sep 30, 2026 | Documented custom plan storage, player/history integration and backwards-compatible version-two backups |
| 1.4 | Sep 30, 2026 | Documented offline information/notice sheets and canonical unit conversion boundaries |
| 1.5 | Sep 30, 2026 | Documented shared Android Back priority and optional first-run reminder setup |
| 1.6 | Oct 4, 2026 | SDK-compatible Lottie dependency and selected local demos with static photograph fallback (ADR-061) |
