# 🔍 Coverage Matrix

### Home Workout – Traceability from Reference, Spec and Catalog to Docs and Tasks

This document shows that **nothing is missed**. Every element in the 25 reference screenshots, every section of the original spec, every module, every screen and every part of the content catalog is mapped to where it is designed ([DESIGN](DESIGN.md), [CONTENT_MAP](CONTENT_MAP.md)…) and built ([TASKS](TASKS.md)). Anything left out is left out on purpose, with the reason.

| Field | Details |
|---|---|
| **Version** | 1.0 |
| **Last updated** | September 23, 2026 |
| **Status** | Complete for planning; update whenever scope changes ([RULES](RULES.md) §11) |
| **Related** | [PRD](PRD.md) · [DESIGN](DESIGN.md) · [CONTENT_MAP](CONTENT_MAP.md) · [TASKS](TASKS.md) · [DECISIONS](DECISIONS.md) |

**Legend:** ✅ Included as in the reference · 🔁 Included but adapted to our rules · ❌ Deliberately excluded (reason given) · ➕ Added from the spec (no reference screenshot)

---

## 1. Reference Screenshots (25)

File names are shortened to their time stamp (`…131201…` = `Screenshot_20260923_131201_Home Workout.jpg.jpeg`).

### 1.1 `…131201…` – Training tab (top)

| Element | Status | Where |
|---|---|---|
| Header "HOME WORKOUT" | ✅ | DESIGN §4.6 tab header · T7.1 |
| Streak flame | 🔁 Also shows the streak count (spec §9.2) | T7.1 |
| PRO badge | ❌ Everything is free (PRD §3.2) | — |
| Search bar "Search workouts, plans…" | ✅ | DESIGN §4.2 · T7.1, T3.4 |
| Weekly Goal card: "0/4" + pencil | ✅ | DESIGN §4.3 · T7.2 |
| Week strip 20–26, today ringed with a pointer | ✅ | DESIGN §4.3 |
| Coach avatar + motivational line | 🔁 Generated avatar, original copy | T7.2, T2.17 |
| "Challenge" + "More >" | ✅ | T7.3 |
| "CUSTOMIZED FOR YOU" tag | ✅ Chosen by goal | CONTENT_MAP §10 · DESIGN §4.5 |
| Featured challenge card: title + arrow, 4 meta cells, "START DAY 1" | ✅ | DESIGN §4.3 (featured variant) · T7.3 |
| Next card peeking | ✅ | DESIGN §4.6 carousels |
| Body Focus chips (Abs, Arm, Forearm, Chest, Leg…) | 🔁 8 chips from the catalog; **Forearm dropped** (the catalog has no forearm workouts); Shoulder, Back, Butt, Full Body added | CONTENT_MAP §9.1 · T7.4 |
| Rows: thumb, title, "16 mins · 16 Exercises", bolts | ✅ | DESIGN §4.3 workout row · T7.4 |
| Second column of rows peeking | 🔁 The catalog has exactly 3 workouts per body focus, so one column | — |
| Quick filter chips (2 rows, with icons) | ✅ | DESIGN §4.2 · CONTENT_MAP §9.1 · T7.5 |
| Bottom tab bar (Training, Discover, Report, Settings) | ✅ | DESIGN §4.6 · T1.14 |

### 1.2 `…131212…` – Training tab (full length)

| Element | Status | Where |
|---|---|---|
| "CREATE YOUR OWN" card + GO + pencil tile | ✅ | DESIGN §4.3 · T7.6 |
| Recommended banner "HEIGHT INCREASE" + "7 Workouts" pill | 🔁 Goal-based collection banner; no height claims (PRD §9) | CONTENT_MAP §9.3 · T7.7 |
| "Just For You" + More (2 rows, second column peeking) | ✅ | CONTENT_MAP §9.1 · T7.8 |
| "Stretch & Warm Up" 2-up photo cards + More | 🔁 Generated artwork instead of photos | T7.9 |
| "Popular Goals" chips + card with 3 rows, arrow circles, "More >" | ✅ | T7.10 |
| "Explore more workouts" banner + Go | ✅ Opens the Discover tab | T7.11 |
| "Can't find what you want? Tell us what you need" | ✅ Local note, exportable | T7.12 |

### 1.3 `…131516…` – Challenge list

| Element | Status | Where |
|---|---|---|
| Back + "Challenge" header | ✅ | DESIGN §4.6 |
| Filter chips (All, Build Muscle, Lose Weight, Full Body…) | 🔁 All · Build Muscle · Burn Fat · Full Body · Flexibility | CONTENT_MAP §10 · T10.1 |
| Gradient cards: "N DAYS", title + arrow, description, "START DAY 1" | 🔁 12 catalog challenges; standard card variant with description; AA gradients | DESIGN §2.5, §4.3 · T10.1 |
| Photos of people on cards | 🔁 Generated character artwork | T2.14 |
| Copy such as "Lose man boobs…", "Height increase", "Shred" | ❌ Content rules (PRD §9) | — |

### 1.4 `…131609…` – "Just For You" list

| Element | Status | Where |
|---|---|---|
| Back + title | ✅ | DESIGN §4.6 |
| Rows on grey rounded cards: thumb, title, "19 mins · 20 exercises" | ✅ | DESIGN §4.3 list row · T3.2 |

### 1.5 `…131623…` – "Stretch & Warm Up" list

| Element | Status | Where |
|---|---|---|
| Same list layout with 12 stretch and warm-up workouts | ✅ | CONTENT_MAP §8 · T3.2, T7.9 |

### 1.6 `…131652…` – "Build Muscle" list

| Element | Status | Where |
|---|---|---|
| Challenge rows first ("14 days plan", "28 days plan") | ✅ Goal lists show challenges as "N-day plan" rows first | DESIGN §4.3 · CONTENT_MAP §9.1 · T3.8 |
| Workout rows after them | ✅ | T3.2 |

### 1.7 `…131730…` and `…135757…` – Workout details (locked)

| Element | Status | Where |
|---|---|---|
| Full-bleed hero photo + floating back button | 🔁 Generated artwork hero | DESIGN §4.1, §6.2 · T4.3 |
| Title + meta row (level, minutes, exercises) | ✅ | T4.3 |
| Introduction with collapse chevron | ✅ | T4.3 |
| "Unlock" gradient button | 🔁 Always "Start" | DESIGN §12.4 |
| No exercise list while locked | 🔁 Exercise list is always shown | T4.3 |
| "You may like" (4 rows, coloured level) | ✅ | T4.3 |

### 1.8 `…131823…` – Discover tab

| Element | Status | Where |
|---|---|---|
| Header "DISCOVER" + search + history icons | ✅ History opens the "Recent" list | CONTENT_MAP §9.2 · T8.1, T3.9 |
| Featured banner "Only 4 Moves for Abs…" | 🔁 Featured workout, neutral copy | T8.1 |
| "Picks for you" rows (second column peeking) | ✅ | T8.2 |
| Collection banner "Stay active, stay in shape · 5 workouts" | ✅ Collection C3 | CONTENT_MAP §9.3 · T8.3 |
| "For beginners" 3-up cards | ✅ | T8.4 |
| "Fast workout" rows | ✅ | T8.5 |
| "Challenge" 3-up cards | ✅ | T8.6 |
| **"With Equipment" banner + "Let's Go!"** | ❌ The app is equipment-free; the catalog has no dumbbell workouts | DESIGN §12.4 |
| "Stretch" 2-row horizontal grid (image + title below) | ✅ | DESIGN §4.3 · T8.7 |
| Body focus dark tiles (Chest, Arm & Shoulder, Butt & Leg, Six pack) | 🔁 6 tiles; "Six pack" becomes "Core"; + Back & Posture, Full Body | CONTENT_MAP §8 · T8.8 |
| Tab bar with Discover active | ✅ | T1.14 |

### 1.9 `…131853…` – Discover category ("SIX PACK")

| Element | Status | Where |
|---|---|---|
| Dark hero with photo, back arrow, title, description | 🔁 Generated artwork; "Core" name; neutral copy | DESIGN §4.3 category hero · T8.8 |
| List rows with dividers and level text | ✅ | T8.8 |
| Copy "melt away excess fat… six pack visible" | ❌ Content rules | — |

### 1.10 `…132013…` – Workout details (unlocked)

| Element | Status | Where |
|---|---|---|
| Edit icon (list + gear) in the title row | ✅ `sliders-horizontal` → builder | T4.7 |
| Start gradient button | ✅ | DESIGN §4.1 · T4.3 |
| Exercise rows: animated thumb, name, "01:00", dividers | ✅ Rep items show "× 15" | DESIGN §4.3 · T4.3 |
| "View all" with chevron | ✅ Expands the list in place | T4.4 |
| Tapping an exercise row | ➕ Opens the exercise guide | T4.3 |
| "You may like" | ✅ | T4.3 |
| Sticky Start at the bottom | ✅ | T4.3 |

### 1.11 `…132037…` – Player: Ready

| Element | Status | Where |
|---|---|---|
| Stage with character and a brand watermark pattern | 🔁 Plain stage, no watermark | DESIGN §12.4 |
| Top icons: video, music, settings | 🔁 Video removed (v2); music and settings kept | T5.4, T5.10 |
| Thumbs down / up | ✅ | T5.13 |
| "READY TO GO!", name + (?), ring countdown, ">" | ✅ | DESIGN §4.5 · T5.4 |

### 1.12 `…132103…`, `…132110…`, `…132845…` – Player: Exercise

| Element | Status | Where |
|---|---|---|
| Back, music, settings icons | ✅ | T5.5 |
| Thin overall-progress line (longer on exercise 2) | ✅ | DESIGN §4.5 |
| Name + (?) and large timer | ✅ | T5.5 |
| Prev · Pause with progress fill · Next | ✅ | DESIGN §4.1 · T5.5 |
| Toolbar at the bottom of `…132110…` | — It is the phone's own screenshot toolbar, not app UI | — |

### 1.13 `…132719…`, `…132746…`, `…132813…` – Exercise guide sheet

| Element | Status | Where |
|---|---|---|
| Title in uppercase | ✅ | DESIGN §4.4 · T4.5 |
| Segmented control Video / Muscle / How to do | 🔁 Animation / Muscle / How to do | T4.5 |
| "Video" tab = animation | 🔁 "Animation" tab with our Lottie | T4.5 |
| "Muscle" tab = 3D anatomy side views + play/download icon | 🔁 SVG muscle map (front + back); no download | T4.6 |
| "How to do" tab = YouTube video | 🔁 Step-by-step text with pose stills (offline) | T4.5 |
| DURATION, INSTRUCTIONS, FOCUS AREA chips | ✅ | T4.5 |
| Front + back muscle map with highlights | ✅ | T4.6 |
| COMMON MISTAKES (numbered), BREATHING TIPS (bullets) | ✅ | T4.5 |
| CLOSE button | ✅ | T4.5 |
| Easier / Harder variations | ➕ Shown when valid links exist | CONTENT_MAP §3 · T4.8 |

### 1.14 `…132828…` – Player: Rest

| Element | Status | Where |
|---|---|---|
| Next exercise animation on a white stage with rounded bottom corners | ✅ | DESIGN §4.1 · T5.6 |
| Blue panel: "NEXT 2/13", next name + (?), duration | ✅ | T5.6 |
| "REST" + countdown | ✅ | T5.6 |
| "Edit Rest Time" pill, "+20s", "Skip" | ✅ | DESIGN §4.1 · T5.6 |

### 1.15 `…132913…` – Workout Settings sheet

| Element | Status | Where |
|---|---|---|
| Title + close | ✅ | DESIGN §4.4 |
| Music toggle, song card, player controls, volume slider | 🔁 No in-app music: "Plays alongside your own music" + ducking toggle | DESIGN §12.4 · T5.10 |
| "Stream audio from other apps >" | 🔁 Becomes the explanation that the user's own music app keeps playing | T5.10 |
| "Sound options >", "Rest timer: Default >", "Prep timer: 15 secs >" | ✅ | T5.10 |
| DONE | ✅ | T5.10 |

### 1.16 `…135643…` – Rest timer picker

| Element | Status | Where |
|---|---|---|
| Default / Custom segmented control | ✅ | DESIGN §4.2 · T5.10 |
| "Enable rest" switch | ✅ | T5.10 |
| Wheel picker (20s, **25s**, 30s) | ✅ 5–120 s in 5 s steps | T5.10 |
| Done | ✅ | T5.10 |

### 1.17 `…135700…` – Music playing queue

| Element | Status | Where |
|---|---|---|
| Queue, "Import", song downloads | ❌ No music library and no downloads (ADR-003) | DESIGN §12.4 |

### 1.18 `…135716…` – Quit screen

| Element | Status | Where |
|---|---|---|
| Faded stage behind the content | ✅ | DESIGN §4.4 |
| Emoji in a white circle | 🔁 Generated icon | T2.17 |
| "1 exercises completed." | 🔁 Correct plural ("1 exercise completed") | T5.7 |
| "Sweat more, shine later!" | 🔁 Original motivational copy | T5.7 |
| Keep exercising · Restart this exercise · Do it later | ✅ "Do it later" → Save & exit / Discard | T5.7 |

### 1.19 `…135844…` – Report tab

| Element | Status | Where |
|---|---|---|
| Summary card: Workout, Kcal, Minute | ✅ + period toggle (spec) | T9.1 |
| History + "All records", week letters, check on done days | ✅ | T9.2, T9.9 |
| Day Streak 🔥 + Personal Best | ✅ | T9.2 |
| Weight + Log, Current / Heaviest / Lightest, chart | ✅ Axis scales to the data | T9.4, T9.5 |
| BMI + Edit, value, colour scale 15–40, Height + Edit | ✅ | DESIGN §2.6 · T9.6 |
| Ad banner | ❌ No ads | — |

### 1.20 `…135916…` – Weight log sheet

| Element | Status | Where |
|---|---|---|
| Title + date chip (tap to change the date) | ✅ Opens the calendar sheet | DESIGN §4.2 · T6.10, T9.4 |
| kg / lbs toggle, large value, ruler picker | ✅ | DESIGN §4.2 · T9.4 |
| Cancel / Save | ✅ | T9.4 |

### 1.21 Screens with no reference screenshot

These come from the spec and are designed with the same components and tokens:

| Screen | Where |
|---|---|
| Onboarding (8 steps) | DESIGN §4 · Phase 6 |
| Settings tab and sub-screens | DESIGN §4.3 settings group · T6.9, T11.8 |
| Challenge detail with day grid | T10.2 |
| Custom workout builder | T11.2 |
| Search | T3.4 |
| All records, day sessions, session detail | T9.9 |
| Finish screen (P6) and pause overlay (P4) | T5.7, T5.8 |
| Achievements screen | T9.11 |
| System modals | §4 below |

---

## 2. Spec v3 Coverage

| Spec § | Topic | Covered in | Status |
|---|---|---|---|
| 1 | Overview | PRD §1 | ✅ |
| 2 | Principles, non-goals | PRD §3.2, §6 · DECISIONS | ✅ |
| 3 | Content & safety rules | PRD §9 | 🔁 Weight-goal guardrail moved to v2 (ADR-019) |
| 4 | Tech stack | ARCHITECTURE §2 | 🔁 MMKV → kv-store (ADR-016), Skia → SVG (ADR-017), no Python (ADR-005) |
| 5 | Repository structure | ARCHITECTURE §3 | 🔁 Generators in TypeScript; `docs/` → `DOC/` (ADR-031) |
| 6.1 | Content JSON | ARCHITECTURE §6.2 · CONTENT_MAP | 🔁 Equipment values (ADR-045), collections (ADR-044); spec's "programs" = challenges |
| 6.2 | SQLite schema | ARCHITECTURE §6.3 | 🔁 Preferences in KV (ADR-025) |
| 7 | Content plan | CONTENT_MAP | ✅ 119 / 60 / 12 / 6 / 35 (ADR-013) |
| 8 | Modules | §3 below | ✅ All 11 |
| 9 | Screens | §4 below | ✅ All |
| 10 | Workout engine | ARCHITECTURE §8 | ✅ + Quiet Mode swaps (ADR-041) |
| 11 | Report calculations | ARCHITECTURE · TEST_PLAN §6.3–6.4 | ✅ |
| 12 | Visual system | DESIGN | 🔁 Colours measured from the reference, AA-adjusted (ADR-027) |
| 13 | Google Play | PRD §13 · SECURITY §11 · Phase 12 | ✅ ABI splits come automatically with AAB; R8 keep rules in T12.5 |
| 14 | Performance budgets & tests | TEST_PLAN | ✅ |
| 15 | Build phases | TASKS | ✅ + Phase 0 |
| 16 | Conventions | RULES | ✅ |
| A.1 | Character rig | T2.9 | 🔁 + views and props (ADR-042) |
| A.2 | Exercise Lottie | T2.10, T2.11 | ✅ |
| A.3 | Thumbnails | T2.14 | 🔁 Vector at runtime (ADR-024) |
| A.4 | Hero images | T2.14 | 🔁 Vector at runtime (ADR-024) |
| A.5 | UI Lottie | T2.15 | ✅ |
| A.6 | Muscle map | T2.13 | 🔁 19 groups (ADR-043) |
| A.7 | Sounds | T2.16 | 🔁 TypeScript instead of numpy |
| A.8 | Branding + empty states | T2.17 | 🔁 PNG rendering pending (ADR-038) |
| A.9 | Content generator | T2.2–T2.8, T2.20 | 🔁 TypeScript (ADR-022) |
| A.10 | Build-assets script + ASSETS.md | T2.18 | ✅ |
| B | Starter prompt for Claude Code | RULES §12 · MEMORY | ✅ Replaced by the collaboration rules |

---

## 3. Modules (spec §8)

| # | Spec module | Spec "done when" | Our module(s) | Tasks |
|---|---|---|---|---|
| 1 | core | Tabs, theme, i18n, data loaded | `core` | T1.5–T1.16 |
| 2 | content | Filters and search work | `content` | T3.1–T3.9 |
| 3 | demo | Lottie loops, static fallback | `demo` | T4.1, T4.2, T4.6 |
| 4 | player | Survives call, lock, app kill | `player` | Phase 5 |
| 5 | onboarding | Running workout in < 60 s | `profile` + `app/onboarding/` | Phase 6 |
| 6 | report | Stats, streak, weight, BMI correct | `report` | Phase 9 |
| 7 | challenges | Day 1 unlocks Day 2; progress persists | `challenges` | Phase 10 |
| 8 | builder | Create, save, edit, run | `builder` | T11.2, T11.3 |
| 9 | achievements | Badges unlock with celebration | `achievements` | T9.8, T9.11, T11.4 |
| 10 | reminders | Fires and survives reboot | `reminders` | T11.5 |
| 11 | backup | Export → reset → import restores | `backup` | T11.6, T11.7 |

---

## 4. Screens

| # | Screen | Spec | Route / type | Reference | Task |
|---|---|---|---|---|---|
| 1 | Bootstrap | O1 | `/` | — | T6.1 |
| 2 | Welcome (3 slides) | O2 | `/onboarding/welcome` | — | T6.2 |
| 3 | Gender | O3 | `/onboarding/gender` | — | T6.3 |
| 4 | Goal | O4 | `/onboarding/goal` | — | T6.3 |
| 5 | Level | O5 | `/onboarding/level` | — | T6.3 |
| 6 | Body data | O6 | `/onboarding/body-data` | — | T6.4 |
| 7 | Schedule | O7 | `/onboarding/schedule` | — | T6.5 |
| 8 | Safety + Ready | O8 | `/onboarding/safety`, `/onboarding/ready` | — | T6.6, T6.7 |
| 9 | Training tab | 9.2 | `/(tabs)/training` | 131201, 131212 | Phase 7 |
| 10 | Discover tab | 9.3 | `/(tabs)/discover` | 131823 | Phase 8 |
| 11 | Report tab | 9.10 | `/(tabs)/report` | 135844 | Phase 9 |
| 12 | Settings tab | 9.11 | `/(tabs)/settings` | — | T6.9, T11.8 |
| 13 | Generic list (More, filters, goal lists, favourites, recent, search results) | 9.4 | `/list/[type]` | 131609, 131623, 131652 | T3.2, T3.5, T3.8, T3.9 |
| 14 | Discover category | 9.3 | `/category/[id]` | 131853 | T8.8 |
| 15 | Workout details | 9.5 | `/workout/[id]` | 131730, 132013, 135757 | T4.3, T4.4 |
| 16 | Challenge list | 9.6 | `/challenge` | 131516 | T10.1 |
| 17 | Challenge detail | 9.6 | `/challenge/[id]` | — | T10.2 |
| 18 | Search | 9.13 | `/search` | — | T3.4 |
| 19 | All records (calendar + day sessions) | 9.10 | `/history` | — | T9.9 |
| 20 | Session detail | 9.10 | `/session/[id]` | — | T9.9 |
| 21 | Achievements | 9.10 | `/achievements` | — | T9.11 |
| 22 | Builder (3 steps) | 9.12 | `/builder/*` | — | T11.2 |
| 23 | Settings sub-screens (reminders, units, backup, credits & licences, privacy, disclaimer, about) | 9.11 | `/settings/*` | — | T6.9, T11.8 |
| 24 | P1 Ready | 9.7 | `/player/prep` | 132037 | T5.4 |
| 25 | P2 Exercise | 9.7 | `/player/exercise` | 132103, 132110, 132845 | T5.5 |
| 26 | P3 Rest | 9.7 | `/player/rest` | 132828 | T5.6 |
| 27 | P4 Paused | 9.7 | overlay | — | T5.7 |
| 28 | P5 Quit | 9.7 | full-screen modal | 135716 | T5.7 |
| 29 | P6 Complete (+ share card) | 9.7 | `/player/complete` | — | T5.8, T5.17 |
| 30 | Exercise guide | 9.8 | sheet | 132719, 132746, 132813 | T4.5, T4.6, T4.8 |
| 31 | Workout settings | 9.9 | sheet | 132913 | T5.10 |
| 32 | Sound options | 9.9 | sheet | — | T5.10 |
| 33 | Rest timer | 9.9 | sheet | 135643 | T5.10 |
| 34 | Prep timer | 9.9 | sheet | — | T5.10 |
| 35 | Edit rest time (during rest) | 9.7 | sheet | 132828 | T5.6 |
| 36 | Weight log | 9.10 | sheet | 135916 | T9.4 |
| 37 | Date picker (calendar) | — | sheet | 135916 (date chip) | T6.10 |
| 38 | Time picker | — | sheet | — | T6.10 |
| 39 | Weekly goal edit | 9.2 | sheet | 131201 (pencil) | T7.2 |
| 40 | Height / BMI edit | 9.10 | sheet | 135844 (Edit) | T9.6 |
| 41 | Feedback note | 9.2 | sheet | 131212 | T7.12 |
| 42 | Achievement unlocked | 9.14 | modal | — | T11.4 |
| 43 | Weekly goal reached | 9.14 | modal | — | T7.14 |
| 44 | Resume workout? | 9.14 | modal | — | T5.3 |
| 45 | Notification permission primer | 9.14 | modal | — | T11.5 |
| 46 | What's new | 9.14 | modal | — | T11.10 |
| 47 | Reset and import confirmations | 9.11 | dialogs | — | T11.7 |
| 48 | Animation preview (development builds only) | — | `/dev/animations` | — | T2.12 |

---

## 5. Content Catalog Coverage

| Catalog part | Items | Mapped in | Tasks |
|---|---|---|---|
| Part 1 – Exercises | 119 | CONTENT_MAP §2–§7 | T2.2, T2.3, T2.9–T2.12, T2.19, T2.20 |
| Part 2 – Workouts | 60 | CONTENT_MAP §8–§9 | T2.4, T2.6 |
| Part 3 – Challenges | 12 | CONTENT_MAP §10 · DESIGN §2.5 | T2.5, Phase 10 |
| Part 4 – Discover categories | 6 | CONTENT_MAP §8–§9 | T2.6, T8.8 |
| Part 5 – Achievements | 35 | CONTENT_MAP §11 | T2.7, T11.4 |
| Part 6 – Copy rules | — | PRD §9 | T2.3, T2.8 |

---

## 6. Gaps Found in the Completeness Audit (and How They Were Closed)

| # | Gap | Fix | Where |
|---|---|---|---|
| 1 | 19 easier/harder links name exercises that don't exist in the catalog | Resolved to "none" (ADR-040) | CONTENT_MAP §3 |
| 2 | Only 4 of 9 jumping exercises had quiet twins; Quiet Mode had no defined behaviour | Complete swap table + behaviour (ADR-041) | CONTENT_MAP §4 · T5.16 |
| 3 | The rig had no props or view rules, so wall, chair and doorway exercises couldn't be drawn | Props + Side / Front / Top views + base poses (ADR-042) | CONTENT_MAP §5 · T2.19 |
| 4 | The muscle map had no IDs for neck, hip flexors, inner thighs, rear shoulders or upper back | 19 muscle groups + focus mapping (ADR-043) | CONTENT_MAP §6 |
| 5 | No rules for which workouts appear in which Training or Discover section; "curated collection" was undefined | Placement rules + 4 collections (ADR-044) | CONTENT_MAP §8–§9 |
| 6 | The equipment field couldn't express chair, wall, doorway or water bottles | `household` and `optional_weight` values (ADR-045) | CONTENT_MAP §7 |
| 7 | Ambiguous badges ("First Week Done", "Started") and no badge for 21-day challenges | Proposed unlock conditions (ADR-046) | CONTENT_MAP §11 |
| 8 | 16 workouts have no level in the catalog | Assumed levels marked † | CONTENT_MAP §8 |
| 9 | The share card needs image export without Skia | `react-native-svg` `toDataURL` (ADR-047) | ARCHITECTURE §9 · T5.17 |
| 10 | MET values had no source | Compendium of Physical Activities (ADR-048) | T2.2 |
| 11 | Challenge-list cards show a description, not meta cells | Two card variants | DESIGN §4.3 |
| 12 | Goal lists mix challenges and workouts | "N-day plan" rows | DESIGN §4.3 · T3.8 |
| 13 | Discover "Stretch" is a 2-row horizontal grid, not a 2-column grid | Corrected | DESIGN §4.3 · T8.7 |
| 14 | The weight log's date chip needs a date picker, and the schedule step needs a time picker | Calendar sheet + hour/minute wheels (no new package) | DESIGN §4.2 · T6.10 |
| 15 | Discover's history icon had no destination | "Recent" list | CONTENT_MAP §9.2 · T3.9 |
| 16 | Favourites had no entry point | Heart on workout details + "My favourites" in Settings | DESIGN §4.3 · T3.5 |
| 17 | "Weekly goal reached" and "What's new" modals had no tasks | Tasks added | T7.14 · T11.10 |
| 18 | Achievements and session-detail screens had no routes | Routes added | ARCHITECTURE §5 · T9.9, T9.11 |
| 19 | Easier/harder links had no UI | "Easier / Harder" buttons in the guide | T4.8 |
| 20 | Reference list titles are regular weight, not semi-bold | List-row title set to 17/500 | DESIGN §4.3 |
| 21 | Spec §13 R8 keep rules were not in the docs | Added | ARCHITECTURE §14 · T12.5 |

---

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version: full completeness audit of the reference, spec, catalog, modules and screens |
