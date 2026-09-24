# 🧪 Test Plan

### Home Workout – Quality Assurance Strategy

This document defines how Home Workout is tested: scope, test levels, tools, devices, test cases, mandatory scenarios, performance and accessibility checks, release testing and defect handling. Its goal is to ship an app that is **correct, reliable during workouts, fully offline, accessible and fast**.

| Field | Details |
|---|---|
| **Version** | 1.1 |
| **Last updated** | September 23, 2026 |
| **Status** | Active |
| **Related** | [PRD](PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [CONTENT_MAP](CONTENT_MAP.md) · [RULES](RULES.md) · [TASKS](TASKS.md) · [SECURITY](SECURITY.md) |

---

## 1. Purpose & Scope

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

## 13. Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version |
| 1.1 | Sep 23, 2026 | Completeness audit: tests for Quiet Mode, content placements, rig coverage, variations, pickers, favourites, recent, goal lists, share card, what's new, achievements screen |
