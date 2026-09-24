# 🧠 Project Memory

### Home Workout – Shared Context for Humans & AI Assistants

**Read this file first** at the start of every work session. It is a short, always-current summary of where the project stands, what matters most and what was learned along the way. Details live in the linked documents.

| Field | Details |
|---|---|
| **Last updated** | September 24, 2026 |
| **Current phase** | Foundation and the shared component library are done. Next is the character rig. |
| **Next step** | Owner reviews `app/dev/components` and runs the app in Expo Go (T1.17), then the character rig (T2.9) with a style-approval gate before all 119 animations |
| **Code written** | Yes, from Sep 24, 2026: Expo SDK 57 project, theme, KV, i18n, database, content loader, tabs, 40-component UI library, 57 tests |

---

## 1. Project Snapshot

| Item | Value |
|---|---|
| Product | Free, fully offline home-workout app for adults (18+) |
| Working name | "Home Workout" (placeholder; must change before release, ADR-012) |
| Package ID | `com.placeholder.homeworkout` (placeholder) |
| Platform | Android on Google Play; min API 24, target API 36 |
| Stack | Expo SDK 57 · React Native 0.86 · TypeScript strict · expo-router · Zustand · expo-sqlite + Drizzle |
| Business model | 100% free. No ads, no subscriptions, no accounts, no analytics. |
| UX reference | 25 screenshots in `reference-img/` (layout patterns only; never copy text or assets) |

---

## 2. Source of Truth (in priority order)

1. [DECISIONS.md](DECISIONS.md) – accepted decisions override everything else.
2. [PRD.md](PRD.md) – what we build and why.
3. [ARCHITECTURE.md](ARCHITECTURE.md), [DESIGN.md](DESIGN.md), [RULES.md](RULES.md), [SECURITY.md](SECURITY.md), [TEST_PLAN.md](TEST_PLAN.md).
4. [CONTENT_MAP.md](CONTENT_MAP.md) – the content catalog and production sheet: every exercise, workout, challenge and badge with its poses, views, props, variations and placements.

---

## 3. Hard Constraints (never break these)

- No network: no network calls and no INTERNET permission in release.
- No API keys, paid services, ads, analytics or trackers.
- Everything unlocked: no PRO, paywall or "Unlock" UI.
- Exercise demos are generated 2D Lottie. No 3D, no videos in v1.
- Every asset is generated locally by TypeScript scripts in `tools/`. No Python.
- Ask before adding any package that isn't approved.
- Content copy: no spot-reduction, height-growth, shaming or diet claims.

---

## 4. Current Status

| Area | Status |
|---|---|
| ✅ Done | All planning docs, completeness audit, every decision approved, Phase 1 code (T1.1–T1.16), the 40-component shared UI library with its dev gallery, T3.6 and T6.10 |
| 🔄 In progress | T1.17 – run the app on the owner's phone with Expo Go |
| ⏭️ Next | Character rig (T2.9): build it, render 3–5 poses, then **stop for the owner to approve the style** before generating all 119 |
| ⛔ Blocked | Nothing. Awaiting the owner: final app name (T0.14), Play account type (T0.15), and confirmation of the proposed character shade tones (DESIGN §2.7) |

---

## 5. Key Facts & Numbers

| Topic | Value |
|---|---|
| Content | 119 exercises · 60 workouts · 12 challenges · 6 Discover tiles + 5 sections · 35 achievements |
| Tasks | 164 across 13 phases (Phase 0 + 12 build phases) |
| Decisions | 50 ADRs |
| Content details | Per-exercise pose, view, props, one-sided flag, variations and quiet swap in [CONTENT_MAP](CONTENT_MAP.md) |
| Brand colours | `primary #004BFF` · CTA gradient `#12DDFE → #014CFF` · page `#F8F8F8` · rest panel `#005DFF` (all measured from the reference) |
| Font | Poppins 400–800 (proposed, ADR-026) |
| kcal | MET × 3.5 × weightKg / 200 × minutes (70 kg if weight is unknown) |
| BMI | weightKg / heightM²; scale 15 · 16 · 18.5 · 25 · 30 · 35 · 40 |
| Streak day | Any session ≥ 50% complete on that local calendar day |
| Weekly goal | Streak days Sunday–Saturday vs target (default 4) |
| Resume window | Player snapshot younger than 2 hours |
| Timers | Rest 5–120 s (default 20 s); prep 0/5/10/15/20/30 s (default 15 s) |
| Budgets | Cold start < 2 s · 60 fps · Lottie first frame < 200 ms · player memory < 200 MB · AAB < 40 MB · Lottie < 40 KB each |
| Play launch | Closed test with 12+ testers for 14 consecutive days (planning for a personal account) |

---

## 6. Environment Notes (dev machine)

| Item | Value |
|---|---|
| OS / shells | Windows 11 Pro · PowerShell 5.1 and Git Bash |
| Project path | `E:\Work\workout` (Git repository on branch `main`; nothing committed yet) |
| Node / npm | 26.8.2 / 11.19.1. Expo SDK 57 needs ≥ 22.13; an LTS release is recommended. |
| Git | 2.55 |
| Java | JDK 25 installed. React Native recommends JDK 17 for local Android builds. |
| Android SDK / adb | Not installed. Only needed for local builds (ADR-036). |
| Python | Not installed and not needed (ADR-005). |

---

## 7. Gotchas & Lessons Learned

- **Decisions changed on day one.** ExerciseDB and online images were chosen first, then replaced by generated assets and a fully offline app (ADR-006 → ADR-007, ADR-008 → ADR-009). Always check [DECISIONS.md](DECISIONS.md) instead of assuming.
- **Pasted answers can conflict with earlier decisions.** Example: the Python generator versus the no-Python rule. Flag conflicts; don't choose silently.
- **Free online sources disappear.** An ExerciseDB mirror on Vercel was already disabled, and `source.unsplash.com` no longer works. That is one more reason to stay offline.
- **Lucide icon names changed:** use `chart-column` (not `bar-chart-3`), `circle-question-mark` (not `circle-help`) and `trash` (not `trash-2`). There is no `history` icon, so use `clock-3`.
- **Block INTERNET in the production variant only.** Development builds need the network for the dev server.
- **Never install `expo-updates`.** It needs the network.
- **The audio module may add microphone permission.** Keep `RECORD_AUDIO` blocked and check the merged manifest.
- **Reference colours fail contrast in places.** The adjusted tokens are in [DESIGN.md](DESIGN.md) §2; don't "fix" them back to the reference values.
- **The placeholder name equals the reference app's name.** It must change before release.
- **The catalog has gaps:** 19 easier/harder links point to exercises that don't exist, only 4 of 9 jumping moves had quiet twins, and 16 workouts have no level. They are resolved in CONTENT_MAP (ADR-040, 041, 049).
- **15 exercises need props** (wall, chair, doorway, bottles). The rig must support them (ADR-042).
- **The reference colours in DESIGN are verified.** They were re-measured from the screenshots pixel by pixel on Sep 24, 2026 and match. Do not measure them again or "correct" them.
- **`jest-expo` cannot parse `lucide-react-native`.** It resolves the package's `react-native` export condition, which is untranspiled ESM. `jest.config.js` maps it to the CommonJS build. Expect the same for any other ESM-only package.
- **RN 0.86 removed `StyleSheet.absoluteFillObject`.** Spell the inset out, or use `StyleSheet.absoluteFill` as a style value.
- **`accessibilityRole` alone does not make a View focusable on Android.** Add `accessible` too, or TalkBack skips it.

---

## 8. Glossary

| Term | Meaning |
|---|---|
| **ADR** | Architecture/decision record in [DECISIONS.md](DECISIONS.md) |
| **Content pack** | Versioned, read-only JSON with all exercises, workouts, challenges, categories and achievements |
| **Rig** | The code-built 2D character whose joint angles are animated to create exercise demos |
| **Pose set** | 2–4 key poses (joint angles) that define one exercise's animation loop |
| **MET** | Metabolic equivalent of a task, used to estimate calories |
| **PAR-Q** | Physical Activity Readiness Questionnaire (health safety check in onboarding) |
| **Quiet-safe** | An exercise with no jumping, suitable for apartments |
| **One-sided (unilateral)** | An exercise done on each side in turn (left, then right) |
| **Snapshot** | The saved player state used to resume an interrupted workout |
| **AAB** | Android App Bundle, the file uploaded to Google Play |
| **ANR** | "App Not Responding" – an Android stability metric |
| **Expo Go** | Expo's app for running a project on a phone without a custom build |

---

## 9. Session Log

| Date | Summary |
|---|---|
| Sep 23, 2026 | Analysed 25 reference screenshots and the research spec/catalog. Researched animation sources (ExerciseDB accepted, then replaced by generated Lottie). Decided: offline, no Python, no admin panel, YouTube in v2. Wrote PRD v1.1 with the owner's answers. Measured the reference colours and checked contrast. Checked the environment (Node 26.8.2, JDK 25, no Android SDK) and latest package versions (Expo SDK 57). Wrote ARCHITECTURE, DESIGN, RULES, TASKS (152 tasks), TEST_PLAN, SECURITY, DECISIONS (39 records) and this file. No code written. |
| Sep 24, 2026 | Owner approved every decision (ADR-022 to ADR-050). Phase 1 built: Expo 57.0.24 / RN 0.86.3 / TypeScript 6; typecheck, lint, 37 tests, Android export and expo-doctor (21/21) all pass. Notes: TS 6 needs `types: ["jest"]`; RNTL v14 render/fireEvent are async; npm 11 blocks install scripts (esbuild, unrs-resolver approved); react-dom pinned to 19.2.3 as a dev dependency to satisfy peers. Not committed yet. |
| Sep 23, 2026 | Completeness audit of all 25 screenshots, spec v3, the catalog, modules and screens. Added COVERAGE.md and CONTENT_MAP.md (generated from the catalog: 119 exercises, 60 workouts, 12 challenges, 35 badges). Closed 21 gaps; added ADR-040 to ADR-050 and 12 tasks (164 total). |
| Sep 24, 2026 | Re-audited all 25 screenshots and verified the measured colour tokens by sampling pixels with `jimp`: DESIGN's values are correct, so do not re-measure them. Found four gaps and applied them — the character is two-tone per part, has no face, needs a motion-arc spec and a top-of-head shape. First git commits (nothing had been committed). ADR-051 settled where Training and Discover sections live. Built the 40-component shared library with a dev gallery at `app/dev/components`. 57 tests. |

---

## 10. How to Update This File

- At the **end of every session**: update "Last updated", the current phase and next step (header), §4 status, and add one row to the §9 session log.
- Add a line to §7 whenever something surprising is learned.
- Keep it short. Details belong in the other documents; link to them.
