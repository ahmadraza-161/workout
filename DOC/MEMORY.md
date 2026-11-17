# 🧠 Project Memory

November 6 — Home redesign (ADR-066) plus the finish-screen plan-day card (ADR-067: day done, tomorrow, plan complete). Typecheck, lint and 361 tests / 79 suites pass; release preflight passed earlier the same day; docs updated; Flow ZIPs moved to `E:\Work\workout-flow-zips\`. Still open: phone visual check, a level-1 plan (ask owner), 7 clips to regenerate. Nothing committed, no APK. Read [NEXT_STEPS](NEXT_STEPS.md) first.

October 27 Flow clips: owner supplied two ZIPs (assets/videos/Oct 26 - 20_07.zip, Oct 26 - 23_06.zip; 106 clips). Each reviewed from frame sheets; 84 mapped (clearer of duplicates), compressed to 960x540 H.264 CRF 28, no audio (11.2 MB) into tools/animations/video-source, listed in video-candidates.json with source clip names, built with build-videos. Coverage **112/119** (28 Lottie + 84 MP4). Still needed: arm circles (not generated), archer push-up, lateral lunge, single-leg glute bridge, fire hydrant, single-leg calf raise, plank jack (wrong movement); their prompts were tightened. Wall Angel clip faces the wall (instructions say back to wall); accepted, regenerate if wanted. Video player now unmounts (releases) on screen blur and autoplays again on focus. Native device QA pending; no APK.

October 26 media reset (ADR-065): owner rejected all downloaded MP4 demos (watermarks/third-party marks). Deleted bundled MP4s, tools/animations video-source/gif-source and their notices; video-candidates.json is empty and notices regenerated. Active: 28 Lottie mappings; 91 exercises show photos. expo-video player, loop/pause/Reduce Motion handling and build-videos pipeline kept for owner-generated Google Flow clips. Prompts: DOC/VIDEO_PROMPTS.md (one per missing ID, file name = exercise ID; stylised 3D character like the Lottie look, primary muscles red, secondary orange). On delivery: compress (~720p, small bitrate), add entries with SHA256, run animations:build, device-check loops.

October 13 build-helper repair: reproduced owner's `Task '-' not found` in
Windows PowerShell 5.1. A single-item array returned by `if` was unwrapped to
a string; native splatting split `--offline` into individual characters.
build-apk.ps1 now constructs one explicit Gradle argument array and appends
the offline flag. Offline/online forwarding verified using the actual repaired
argument block and a native batch stub in PowerShell 5.1 and 7. No APK built
for this repair. ADB detection now works outside the sandbox but reports zero
connected devices; physical QA remains open. Existing APK manifest inspected:
no INTERNET permission; it predates the current app fixes.

Build-helper final checks: typecheck/lint and all 347 tests/75 suites pass
(170.168s). Windows PowerShell full-script syntax and offline/online native
argument forwarding pass. Actual APK compilation remains to be rerun.

October 13 repair verification: final npm run check -- -- --runInBand --testTimeout=20000 passes typecheck, lint and all 347 tests/75 suites (147.368s). Release preflight passes. Production Android JS export passes (4,973 modules, 245 assets, .expo/app-repair-export); exported MD5 bytes verify all 64 active MP4s and all 119 original images, with zero disabled TrainAI videos. All 64 MP4s decode and source SHA256 hashes match. Image audit passes 119 PNGs (11.21 MB) and five character assets. Regression coverage includes native release before guide cleanup/stale events, HeyGainz loop policy, local-image retry, suitable recommendation and Review workout navigation. Intermediate checks exposed a stale recommendation expectation, ungenerated translation keys and a Jest mock-hoisting error; all were corrected before this final pass. Physical Android scenario matrix in APP_REPAIR_PLAN remains open; no APK built.

October 13 repair pass (supersedes historical coverage below): owner rejected TrainAI. Its 27 active mappings are disabled; originals/provenance are archived, not bundled. Current active demos: 92/119 exercise IDs, 28 Lottie + 64 MP4, 88 unique sources; 27 exercises retain their original images. All 32 HeyGainz clips loop; eight previously truncated holds now use complete original GIF cycles. MP4 total 14,142,982 bytes. Native release cleanup is fixed, guide/player image Retry added, and Home offers a suitable no-equipment routine to review before Start. Full plan and physical acceptance matrix: [APP_REPAIR_PLAN](APP_REPAIR_PLAN.md). Native phone reproduction and release QA remain open; no APK built.

Final 119/119 export verification: production Android JS export passes (5,000 modules; .expo/animation-all-exercises-export; 271 assets). All 91 MP4 mappings and all 119 original image mappings match exported MD5 assets; shared sources deduplicate. Release preflight passes. Full check passes typecheck/lint and 342 tests/74 suites (85.696s). Native Android QA remains; no APK built.

October 13 final catalog-wide check: typecheck/lint and all 342 tests across 74 suites pass (85.696 seconds). All three final MP4s decode without errors; Floor Row decoded last pose reviewed. Original-source integrity now also checks the untrimmed Sworkit MP4 hash. Static fallback test uses a missing-demo ID since all 119 catalog IDs are now mapped. The intermediate check collided with asset generation (Windows EBUSY); final checks ran after generators completed and pass. Physical Android form/framing, pose holds, pause/background, Reduce Motion, TalkBack and airplane-mode QA remain pending. No APK built.

October 13 completed animation mapping: **119/119 exercise IDs** now have local demos (28 Lottie + 91 MP4 mappings, 114 unique sources). Final three additions: Arm Pulse (public emireerose/GIPHY), Frog Jump (reviewed Sworkit forward segment), Floor Row Isometric (FitnessProgramer floor-seated scapular retraction entry then hold). MP4 bytes total 14,324,244; twenty MP4 held-pose entries. Images/UI/instructions retained; no runtime network or new dependency. Exact framing/movement limitations and unverified distribution permissions are recorded in ANIMATION_FINAL_REVIEW. Native form/playback QA remains. No APK.

Production Android JS export passes (4,997 modules; .expo/animation-final-seven-export; 268 assets). All 88 MP4 mappings and 119 original image mappings are verified by MD5 in exported metadata; identical shared MP4s deduplicate. Native phone QA remains; no APK built.

October 13 final matching pass: seven more exercise IDs have local demos (six new sources and reused Step-back Burpee for Squat Thrust). Coverage 116/119, 111 unique sources, 28 Lottie + 88 MP4 mappings; MP4 bytes 14,142,256. Hamstring Stretch adds the nineteenth MP4 hold; Get-Up uses reviewed seated-to-standing-to-seated source segment. Images/UI retained. Arm Pulse, Floor Row Isometric and Frog Jump remain unresolved because reviewed movements differ; see ANIMATION_FINAL_REVIEW. Public redistribution rights remain unverified, accurately recorded in offline notices. Typecheck/lint and 342 tests/74 suites pass (74.074s); release preflight passes; all seven new MP4 mappings decode. Native phone QA remains. No APK.

October 13 HeyGainz continuation: 32 further reviewed anatomical character GIFs converted to local MP4s; total 109/119 animated exercise IDs (28 Lottie + 81 MP4), 105 unique sources, 10 remaining. Added 8,006,804 MP4 bytes; all MP4s total 11,112,075 bytes. Eight more hold clips stop on the selected pose (18 MP4 holds total). Original photos/UI/instructions remain. Public source branding and original hashes retained, with unverified app redistribution rights recorded in offline credits. No APK. Typecheck/lint and all 342 tests across 74 suites pass (128.909 seconds), release preflight passes, and production Android JS export passes (4,990 modules; .expo/animation-batch-32-export). All 32 new MP4s decode without errors. Native phone QA remains; details in TEST_PLAN.

October 13 fast animation batch: downloaded and bundled 48 further ready-made character demos (22 anatomical Gym visual GIFs via the public ExerciseDB dataset, 26 TrainAI creator GIFs). Originals/hashes retained; GIFs converted to local H.264 without new motion or removed source marks. Current coverage 77/119 (28 Lottie mappings + 49 MP4), 42 unresolved; 73 unique sources. Added MP4 bytes: 1,365,734. Ten held-pose clips use reviewed first-entry segments and loop=false. Images/UI retained; no APK. Source terms and native QA limitations are in ANIMATION_SOURCES/TEST_PLAN. Final typecheck/lint and 342 tests across 74 suites pass (106.769 seconds, testTimeout=20000); release preflight passes. Production Android JS export passes (4,958 modules; .expo/animation-batch-48-export); physical phone QA remains.

October 12 format expansion: owner accepts ready-made GIF/MP4/Lottie demos with clear movement and target muscles; keep photos/offline operation. Downloaded Vital free ZIP and reviewed its 50 gym records plus character samples. Sample 0353 matches Pike Push-Up (1080-square, 3.203991s, red shoulder/upper-arm highlights); original and provenance retained under tools/animations. Owner approved expo-video 57.0.5; original MP4 now bundled with Animation/Image selection, muted local playback, pause/focus/background gating and pose fallback. Active coverage 29/119, 90 unresolved. Final typecheck/lint and 341 tests across 74 suites pass (80.469 seconds); production Android JS export passes (4,910 modules, .expo/mp4-pike-export, original MP4 included); release preflight passes. Native phone playback/form and airplane-mode QA remain. No APK built. Details: ANIMATION_SOURCES.

October 11 Russian Twist import: source access recovered normally; original licensed 195-frame seated torso-rotation demo added. Fixed legs/hips and animated torso reviewed in original frames 0/25/50/75/99. Honest unnamed contributor credit retained (a848f9e4); no new geometry or motion authored. Current coverage 28/119 IDs, 24 unique sources, 91 unresolved, 3,343,861 bundled bytes. All original images/UI retained, no APK built. Final validation: typecheck/lint and all 336 tests across 72 suites pass (279.355 seconds); production Android JS export passes (4,899 modules, .expo/lottie-russian-export), and release preflight passes. Native form/playback and airplane-mode QA remain open.

October 11 further acquisition: located a free Simple License Russian Twists candidate (rx3c7eZtwE), but its preview/download is blocked at automatic browser security verification. Movement/style and supported feet are unverified; do not map it yet. New knee-push-up, calf-raise and wall-push-up results are premium or watermarked video previews. No production changes this pass; coverage stays 27/119, 92 unresolved. Evidence: ANIMATION_SOURCES.

October 11 next animation pass: added Standing Forward Fold using the licensed original Inchworm entry frames 0–24 once, then hold before hand walking. Source reviewed at frames 0/24/30/34/39 and across its full cycle. No custom motion or new unique source claimed. Current coverage 27/119 IDs, 23 unique sources, 92 unresolved, 3,239,591 bundled bytes. Original images/UI retained; no APK built. Final validation: typecheck/lint and 335 tests across 72 suites pass (197.003 seconds); production Android JS export passes (4,898 modules, .expo/lottie-fold-export), and release preflight passes. Native playback/form and airplane-mode QA remain open.

October 11 batch continuation: added Neck Side Stretch (Indrum, original frames 0–60 once then hold), Side Plank (Ajay Gupta, original rotating-plank first entry frames 1–35 once then hold, reviewed viewport), and Shadow Boxing (existing Dinh Punches source, matching staggered stance/alternating punches/guard). No custom motion authored. Current coverage: 26/119 exercise IDs, 23 unique licensed sources, 93 unresolved IDs, 2,934,727 bundled bytes. All 119 images and UI retained; no APK built. Final validation: typecheck, lint and all 334 tests across 72 suites passed; release preflight passed. Android JS export metadata and Hermes bundle verified in .expo/lottie-batch-export. Native form/playback and airplane-mode device QA remain open.

October 11 animation-only continuation: two further exercise IDs now have verified ready-made demos. Push-Up Hold plays original Military Push Ups frames 2–10 once, then holds at shallow elbow flexion. Plank Walkout shares the original Inchworm demo because their catalog instructions describe the same hand-walk movement. These are reused licensed sources, not two new unique downloads or authored animations. Coverage: 23/119 exercise IDs, 21 unique source animations, 96 unresolved IDs, 2,594,038 bundled bytes. All 119 photographs and UI remain. Full check passes typecheck/lint and 332 tests across 72 suites (94.124 seconds). Production Android JS export passes (4,894 modules, .expo/lottie-hold-walkout-export). Native playback/form QA remains open; no APK built.

October 11 owner scope: only exercise animations; do not change UI, design, feel or other features. Existing photographs remain.

October 11 continuation: completed the interrupted High Knees import by Bashir Ahmad under the Lottie Simple License. Original 29-frame alternating thigh/arm motion and floor line are retained. Coverage is 21/119, with 98 IDs still awaiting matching free ready-made demos; bundled JSON totals 2,214,530 bytes. All 119 exercise images remain. Production Android JS export passes (4,892 modules; .expo/lottie-high-knees-export), and release preflight passes. Full check passes typecheck/lint and 331 tests across 72 suites (205.968 seconds). Native phone QA remains open. No APK built.

### WorkoutStride – Shared Context for Humans & AI Assistants

Final free-only pass verification: typecheck/lint and 330 tests across 72 suites pass; production Android export and release preflight pass. Coverage 20/119. Native phone QA remains; no APK built.

October 5 free-only clarification: added Blinix Solutions Forearm Plank and Flutter Kicks under the Simple License, for 20/119 local demos (2,131,736 bytes), with 99 unresolved IDs. Plank entry plays once and holds; flutter kicks alternate straight legs. Both use reviewed viewports to remove unused canvas while preserving geometry/timing; originals, credits and photos remain. Guide test now supplies route focus, and fallback test uses an exercise that still lacks an animation. Source audit: ANIMATION_SOURCES; final verification: TEST_PLAN. No APK built.

October 5 continued ready-made sourcing: [ANIMATION_SOURCES](ANIMATION_SOURCES.md) records GymVisual, ExerciseAnimatic, VFE, MoveKit and further community candidates. VFE's free content pack explicitly excludes apps; MoveKit's app-licensed free samples do not match this catalog. Matching community mountain-climber/arm-circle candidates are premium. Coverage remains 18/119, all photographs retained, no production code/assets or APK changed. Asked owner whether to remain free-only or evaluate paid price/coverage; no purchase authorised.

October 2 owner-requested improvements/QA, without APK: fixed startup custom-font selection after font-load failure and contained workout resume-snapshot write errors (one warning, later automatic retries, final session save still attempted). Added sound-focus cancellation and independent vibration regression checks. Full `npm run check -- -- --runInBand`: 319 tests/69 suites pass; offline `qa:release` and `images:qa` pass (119 transparent exercise files/11.21 MB plus five character assets). Physical UI/TalkBack/reminder/audio/fresh-install scenarios remain pending: local bundled adb cannot initialise its Android profile. No APK was rebuilt. Evidence and limitations: TEST_PLAN.

October 2 challenge-card spacing: removed flex growth from the card body so the CTA follows its copy with normal padding; width-constrained carousel cards align to their own height instead of stretching with taller neighbours. Full-width list/detail cards still stretch horizontally. Per owner clarification, character/title placement is retained; text overlap is not part of this change. Installed-device visual confirmation remains pending.

October 2 startup refinement: the branded startup page is visible for at least 1.2 seconds after layout, with a 160 dp character logo and accessible progress line. Fonts/database readiness still controls entry, so slower preparation holds the loader longer. Reduced Motion skips the animation; completion is guarded to run once. Existing onboarding/home and database-error routing are retained. Full `npm run check -- -- --runInBand` passes typecheck/lint and 315 tests/69 suites, including fast/slow startup and reduced-motion gates. Installed Android startup visual QA remains pending; the previously delivered APK does not include this source change.

Final onboarding verification: full `npm run check -- -- --runInBand` passed the existing 311 tests/68 suites. Final typecheck/lint and updated onboarding/card navigation tests passed; two added choice/review tests also passed (313 distinct tests across 69 suites verified). New unit tests isolate native Sheet/content integrations, matching existing test harness conventions. Android production export passed. Native device visual/keyboard/TalkBack QA remains pending.

October 1 onboarding/related-card refinement: paired-character welcome with clear offline/privacy benefits, top Back/progress header, single fixed safe-area CTA, described goal/level radio cards, inclusive character note, grouped safety questions, accessible form-error alerts and structured goal/level/schedule review. Profile validation, repeated-finish guard and health-check routing remain enforced. Owner follow-up screenshot: workout-detail "You may also like" rows are now blue/purple/slate gradient cards; links still open their selected workouts. References contain no onboarding captures; native visual comparison remains pending. Android production export passes (`.expo/onboarding-export`). Full check passes 311 tests/68 suites, with final selected onboarding/navigation checks tracked separately.

October 1 logo colour refinement: owner requested red/maroon. The character logo now uses deep maroon `#4A0B24` to rich red `#BA2346`; launcher/adaptive background, splash, favicon, light/dark wordmarks and preview are regenerated, and native assets refreshed through Expo prebuild. Character art, name and screen UI palette are unchanged. Visual export QA passed; typecheck/lint and all 311 tests/68 suites pass. Current palette lives in `DOC/BRANDING.md`.

October 1 character/name revision: the owner rejected the generic glyph and requested proper characters plus another name. Current identity is **WorkoutStride**, with original semi-realistic male/female characters in a no-equipment standing warm-up. Built-in imagegen source and exact prompt are preserved in `tools/branding/characters.png` and `prompt.json`. Character launcher/splash, adaptive foreground/background, favicon and light/dark wordmarks regenerated; the bodyweight vector is retained only for Android themed monochrome icons. Native prebuild refreshed final assets/name; prior APK remains old branding. Checks: typecheck/lint + 311 tests/68 suites pass; release preflight passes. Details: `DOC/BRANDING.md`.

October 1 logo refinement: the owner requested immediate workout recognition for a global audience, then clarified no equipment. Final identity is an original gender-neutral jumping-jack figure with a lime movement arrow, replacing the earlier letter mark. Launcher/adaptive/monochrome/splash/favicon and light/dark wordmarks regenerated from `tools/branding/mark.svg`; 64 px legibility visually checked and native icons refreshed through Expo prebuild. `npm run check -- -- --runInBand`: typecheck/lint and all 311 tests/68 suites pass. Previous delivered APK still predates branding.

**Read this file first** at the start of every work session. It is a short, always-current summary of where the project stands, what matters most and what was learned along the way. Details live in the linked documents.

| Field | Details |
|---|---|
| **Last updated** | October 11, 2026 |
| **Current phase** | Engineering passes 1–4: Training and Discover now follow the reference section structure, with local ranking, catalog filters and challenge day browsing. Native/reference/release QA continues. |
| **Next step** | Verify 23 exercise demos on Android (21 unique sources), including PNG decoding, framing, pause/focus and hold behavior. Preserve all 119 images; 96 IDs still need matching free ready-made demos. |
| **Code written** | Yes: Expo SDK 57 project, theme, KV, i18n, database, content loader, tabs, shared UI library and 329 passing tests |

October 5 animation sourcing preference: the owner explicitly selected **only ready-made animations resembling the existing demos**, declining custom character animation. Preserve the eighteen approved mappings and all original images. The remaining 101 require matching licensed source assets; do not silently use the old rough rig, unrelated movements or silhouette frame libraries. Further reviewed public sources did not resolve these gaps; see ANIMATION_COVERAGE. No additional production animation is added by this sourcing pass.

---

October 1 branding: owner requested autonomous naming/logo selection, then an easy workout-related name. **Workout Dost** is now configured, tagline **Your pace. Your progress.** Original blue/white/lime rounded W mark exports launcher/adaptive/monochrome icons, native/startup splash, favicon and light/dark SVG wordmarks. Generator `npm run branding:build`; identity/source details in `DOC/BRANDING.md`. Onboarding welcome and name fallbacks are regenerated; native Android prebuild confirms the new launcher name/schemes. Package ID and legacy links retained for compatibility. Previous APK remains old branding. Verification: `npm run check -- -- --runInBand` passes typecheck/lint and all 311 tests/68 suites; release preflight passes. The first concurrent run hit one existing settings-test timeout; serial rerun passed without test changes.

October 1 APK build: standalone ARM64 testing APK successfully built and signature verified. Deliverable `Home-Workout-arm64.apk` at project root, 69,260,342 bytes; package `com.placeholder.homeworkout`, version 0.1.0, minimum API 24, target API 36. Actual APK permission inspection confirms no INTERNET/access-network-state or blocked sensitive permissions. Uses generated debug signing for testing. Local SDK/NDK/Java 17/Gradle toolchain now exists under `.expo/build-tools`; phone runtime/visual QA remains pending. Build instructions: `DOC/BUILD_APK.md`. Existing source check remains 311 passing tests.

October 1 owner full-scroll layout pass: Training compact cards/weekly dates, synchronised body-focus chip/swipe columns, recent/goal then duration links, plain recommendation rows, builder preview, paged selected-goal cards and short Explore. Discover overlaid gradient captions, full-width feature, equipment banner filtered by actual exercise equipment, then Stretch gallery. Earlier below-caption/coach-bubble notes are historical. Existing art/safe catalog copy remain distinct from reference photos/promotions. `npm run check`: 311 tests/68 suites; typecheck/lint clean. Android production export passed on retry (initial Hermes temporary-file error). Native pixel comparison still needs an installed-build capture.

Reference/UI recheck October 1: all 25 reference images mapped and reviewed against screen source in `DOC/REFERENCE_AUDIT.md`. Larger challenge art, grouped Training weekly card, corrected header/detail-row insets, workout hero/related metadata, featured challenge info order, Report calendar/order and Settings groups are implemented. Rest editing now uses a wheel, with nested Default/Custom/enable/Done settings and correct reset synchronisation. `npm run check`: 309 tests/68 suites; Android export passed. Native pixel comparison is not certified (no adb/device here); reference music queue and custom quit overlay remain differences documented in the audit.

October 1 screenshot pass: 60 distinct catalog workout covers selected from actual exercises; 19 dedicated category/challenge/collection heroes (2.48 MB). Discover captions below images and explicit SVG stop opacity remove black panels. Workout details now show top artwork. Onboarding has portrait/radio choices, progress, scrolling forms and a safe-area footer. Branded startup progress waits for fonts/storage before stored-theme reads. `npm run check`: 306 tests/65 suites; Android production export passed. Installed-device layout, native splash, dark mode and TalkBack checks remain pending. Hero prompts/provenance: `DOC/HERO_IMAGE_PROMPTS.json`.

## 1. Project Snapshot

| Item | Value |
|---|---|
| Product | Free, fully offline home-workout app for adults (18+) |
| App name | WorkoutStride — Your pace. Your progress. (owner-delegated identity, ADR-012) |
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
- Eighteen owner-authorized licensed demos play offline as the first preview (ADR-061); all original static images remain available. Other 101 exercises retain their poses until matching demos are verified. No 3D, remote video or runtime asset downloads.
- Licensed external images may be sourced once and bundled with credit. Original full-colour realistic exercise/browse cutouts generated with the built-in imagegen tool are owner-authorized (ADR-056/060). Other asset generation stays in local TypeScript scripts. No Python or runtime network.
- Ask before adding any package that isn't approved.
- Content copy: no spot-reduction, height-growth, shaming or diet claims.

---

## 4. Current Status

| Area | Status |
|---|---|
| ✅ Done | All planning docs, completeness audit, every decision approved, Phase 1 code (T1.1–T1.16), the 40-component shared UI library with its dev gallery, T3.6 and T6.10 |
| 🔄 In progress | Exercise form/edge review, native playback and framing of eighteen offline demos (fifteen added after the original three), the remaining 101 animation gaps, onboarding visual/safety follow-up, guided player UI, custom-builder native/reference QA, challenge/device QA, Training/Discover/Report/Settings sections and achievements device QA; phone check T1.17 remains pending |
| ⏭️ Next | Native/reference QA for the implemented finish progress, feedback, ratings, share card and browse sections; offline voice remains. Native gesture/keyboard/builder/player flow, backup share/round-trip and reminder reboot/delivery checks remain alongside TalkBack QA. [IMAGE_QA](IMAGE_QA.md) records image findings; [LICENSE_AUDIT](LICENSE_AUDIT.md) tracks missing installed notices. |
| ⛔ Blocked | Nothing. Awaiting the owner: final app name (T0.14), Play account type (T0.15), and confirmation of the proposed character shade tones (DESIGN §2.7) |

---

## 5. Key Facts & Numbers

| Topic | Value |
|---|---|
| Content | 119 exercises · 60 workouts · 12 challenges · 6 Discover tiles + 5 sections · 35 achievements |
| Tasks | 164 across 13 phases (Phase 0 + 12 build phases) |
| Decisions | 59 ADRs (including superseded/historical records) |
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

- **Animation titles can misidentify the movement.** The reviewed "Reverse Crunches" is a seated knee-tuck; "Man with beard doing Sit up" is a standing squat. Review poses/keyframes before mapping. Some apparent animations are static raster layers, and a generic free-licence label can conflict with the author's non-commercial restriction. Embedded PNGs must be bundled inside JSON; nested background solids need removal too.
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
- **RN 0.86 BackHandler callbacks receive an event with `type` and `timeStamp`.** Use installed callback types in tests. Keep focused screen listeners stable between timer/draft renders so an open sheet remains first in Android's reverse callback order.
- **`accessibilityRole` alone does not make a View focusable on Android.** Add `accessible` too, or TalkBack skips it.
- **Initial owner images were opaque:** their checkerboard/form findings are archived in IMAGE_QA. Current 119 realistic PNG replacements have genuine alpha. A JPG-to-PNG rename cannot create transparency. Inspect alpha compositing on blue/dark: RGB beneath zero-alpha pixels can look like a halo in a raw preview while being invisible in the app. Palette compression can quantize opaque alpha to 254; validate near-opacity rather than exact 255.
- **Generated lists need title-level review:** broad body-focus matching gave the chair workout no chair moves and blended targeted stretch plans. Keep the reviewed pools in `tools/content/workouts.ts` and test named plans against their actual exercise IDs.

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
| Oct 5, 2026 | Owner continuation: added Dead Bug, March in Place and Donkey Kick from reviewed free sources, for eighteen offline demos and 101 remaining gaps. Original photos retained; removed only the donkey-kick decorative caption. Source originals, credits and hashes preserved. Typecheck/lint and 329 tests/72 suites pass; release preflight passes. Android export verification recorded in TEST_PLAN; physical playback/form/framing remains pending. No APK built. |
| Oct 5, 2026 | Expanded to fifteen offline demos after owner approval, from reviewed Dinh Bui Xuan/saagar portfolios. All photos retained; no dependency/APK change. Cobra plays its entry once and holds. PNGs are embedded locally; root/nested backgrounds are removed. Source-title mismatches, static samples, one-leg variant and commercial-use restriction documented in ANIMATION_COVERAGE; 104 exact remaining IDs generated. Full check passes typecheck/lint + 328 tests/72 suites with a 20-second per-test host allowance after an initial browse timeout under concurrent export load. Final offline Android export and release preflight pass. Native decoding/form/framing remain pending. |
| Oct 4, 2026 | Added three owner-approved offline Dinh Bui Xuan demos (ADR-061); native player/guide opens Animation first and retains the original Image option for Standard Push-Up, Wide Push-Up and Squat to Overhead Reach. Repeatable transparent-asset generation, complete creator/library notices and lifecycle tests added; SDK 57 selects Lottie ~7.3.8. Final check passes typecheck, lint and 325 tests/72 suites; Android JS export and release preflight pass. All 119 exercise images retained. No APK built; native playback/form QA remains. First rebuild needs Maven downloads via tools/qa/build-apk.ps1 -OnlineDependencies. |
| Sep 23, 2026 | Analysed 25 reference screenshots and the research spec/catalog. Researched animation sources (ExerciseDB accepted, then replaced by generated Lottie). Decided: offline, no Python, no admin panel, YouTube in v2. Wrote PRD v1.1 with the owner's answers. Measured the reference colours and checked contrast. Checked the environment (Node 26.8.2, JDK 25, no Android SDK) and latest package versions (Expo SDK 57). Wrote ARCHITECTURE, DESIGN, RULES, TASKS (152 tasks), TEST_PLAN, SECURITY, DECISIONS (39 records) and this file. No code written. |
| Sep 24, 2026 | Owner approved every decision (ADR-022 to ADR-050). Phase 1 built: Expo 57.0.24 / RN 0.86.3 / TypeScript 6; typecheck, lint, 37 tests, Android export and expo-doctor (21/21) all pass. Notes: TS 6 needs `types: ["jest"]`; RNTL v14 render/fireEvent are async; npm 11 blocks install scripts (esbuild, unrs-resolver approved); react-dom pinned to 19.2.3 as a dev dependency to satisfy peers. Not committed yet. |
| Sep 23, 2026 | Completeness audit of all 25 screenshots, spec v3, the catalog, modules and screens. Added COVERAGE.md and CONTENT_MAP.md (generated from the catalog: 119 exercises, 60 workouts, 12 challenges, 35 badges). Closed 21 gaps; added ADR-040 to ADR-050 and 12 tasks (164 total). |
| Sep 24, 2026 | Re-audited all 25 screenshots and verified the measured colour tokens by sampling pixels with `jimp`: DESIGN's values are correct, so do not re-measure them. Found four gaps and applied them — the character is two-tone per part, has no face, needs a motion-arc spec and a top-of-head shape. First git commits (nothing had been committed). ADR-051 settled where Training and Discover sections live. Built the 40-component shared library with a dev gallery at `app/dev/components`. 57 tests. |
| Sep 29, 2026 | Continued app-wide engineering while owner prepares the exercise PNGs. Player now saves validated 2-hour snapshots and transactional session results with kcal, supports quit save/discard, rep/rest adjustment and quiet swaps. Added local favourites, recent searches, settings, Report totals/history, Training home, full catalog lists and a browse-only challenge schedule. `npm run check` passes 162 tests across 20 suites; Android export passes. Onboarding, challenge progression, complete tab layouts, content copy, image integration and phone QA remain. No commit. |
| Sep 29, 2026 | Challenge phase: added filter chips, current-day start, challenge-linked session persistence, sequential unlock with automatic rest-day skip, and leave/restart without deleting old workouts. Plank, Push-up and Squat day exercises now resolve to local player workouts with their authored sets and increasing targets. Pure tests cover progression and old-run isolation; device restart scenario remains to verify. Image prompt files were left unchanged after the owner's ratio question. No commit. |
| Sep 29, 2026 | Onboarding phase: added first-run routing, eight quick steps, SQLite profile save/edit, optional measurements with adult birth-year validation, explicit 18+ confirmation and a short seven-question health check. A yes answer shows professional-advice copy and opens browsing rather than auto-starting exercise. This is not the full PAR-Q+ follow-up; wording was informed by the [2026 general questions](https://www.frontierdistrict.k-state.edu/health-nutrition/staystrongstayhealthy/forms/26forms/2026%20PARQ%20Form.pdf). Remaining: reminder setup, phone timing/visual QA and full safety review. No images changed. No commit. |
| Sep 29, 2026 | Report phase: added week/month/total summaries, distinct qualifying local-day streaks, Sunday–Saturday weekly goals, a responsive seven-day strip and editable target sheet on Training and Report. Date-boundary aggregation tests cover year and leap-month transitions; weight/BMI, records and phone visual QA remain. Owner image files untouched. No commit. |
| Sep 29, 2026 | Report follow-up: added SQLite weight logging with date picker, kg/lbs conversion and one entry per day; an SVG trend with current/min/max; and BMI estimate with categories, scale and height edit. Adult BMI copy uses screening language, not diagnosis. Unit/conversion/BMI boundary tests pass. Phone visual, picker and medical copy review remain; owner images untouched. No commit. |
| Sep 29, 2026 | Report history follow-up: added `/history` month calendar with saved-day dots and day sessions, `/session/[id]` details with saved exercise results, tappable Report history, and personal bests derived from old and new saved attempts. Calendar tests cover marked, future-disabled and earlier-month dates. Android export and 188 tests pass; real-device navigation and visual QA remain. Images untouched. No commit. |
| Sep 30, 2026 | Achievement pass: added all 35 rule evaluations from local sessions, exercise sets, challenges and weekly goals; persisted unlocks, Report preview, grouped full list and a static completion celebration. Checked Report reference screenshot and badge design spec; actual phone visual match, accessibility and celebration Lottie still need QA/assets. `npm run check` passes 195 tests across 28 suites and Android export succeeds. Owner images untouched; no commit. |
| Sep 30, 2026 | Image/player pass: mapped 119/119 owner JPEGs to offline static assets, optimized the image payload from about 57 MB to 8.3 MB, and wired thumbnails/detail/player with a fallback. Added player ring/rest styling and finish stats with saved-session navigation and retry. Sample review found baked checkerboard, a two-pose side plank and top-position standard push-up; see [IMAGE_QA](IMAGE_QA.md). Android export succeeds; `npm run check` passes 196 tests across 29 suites. Individual image-form and phone/reference QA remain. No commit. |
| Sep 30, 2026 | Player controls pass: wired the existing reference-style previous/pause/next controls, made previous replay clear later saved results, formatted exercise/rest timers as mm:ss, and used rest actions with an edit-time sheet. Engine test covers replay and result rollback. `npm run check` passes 197 tests across 29 suites and Android export succeeds. Exercise guide still lacks the 119 authored copy entries; phone/reference checks remain. No commit. |
| Sep 30, 2026 | Exercise-guide pass: authored original 3+3+3 lines for all 119 exercises and bundled them with strict catalog coverage tests; generated runtime front/back muscle-map paths and added pose/muscle/how guide sections. Player opens the current or next guide after pausing and saving its snapshot. `npm run check` passes 199 tests across 31 suites and Android export succeeds; editorial form review, reference sheet presentation and phone QA remain. No commit. |
| Sep 30, 2026 | Program-content pass: authored 60 workout intros and 12 challenge descriptions, then reviewed generated lists against their titles. Corrected office, upper/lower-body, targeted stretch, no-push-up, chair-assisted and absolute-beginner pools; added regression tests for these promises. `npm run check` passes 203 tests across 32 suites. Individual content and device/reference QA remain; no commit. |
| Sep 30, 2026 | Guide-sheet pass: inspected all three guide references and changed the route to a transparent modal with dimmed background, rounded top, scrolling content and fixed Close. Added matching title/section/value typography and safe close fallback for direct entry. All 204 tests pass; typecheck and final lint are clean; Android export succeeds. Phone layout, native Back, TalkBack and large-font checks remain. No commit. |

---

| Sep 30, 2026 | Player-feedback pass: added persistent sound/vibration settings, scrollable settings sheet, local WAV countdown/phase/finish cues and active-player wake lock. Cue-policy and preference tests bring the suite to 208 tests. Android export succeeds; offline voice selection and device sound/layout/lock QA remain. No commit. |

| Sep 30, 2026 | Backup pass: added local version-one JSON export/import, 5 MB and field/relationship validation, all-table/attached-KV replacement with rollback, theme/reminder refresh, and double-confirm reset through onboarding. All 228 tests across 39 suites pass with clean typecheck/lint; Android export succeeds. Full-table round-trip, failure rollback, file-bridge and confirmation tests pass. Native S6, provider, forced-kill and reference QA remain. No commit. |

| Sep 30, 2026 | Custom-builder pass: added three-step name/focus, searchable exercise selection, repeated sets, targets/rest/reorder, SQLite CRUD, catalog-copy entry and Training list. Saved plans run/resume in the existing player; edits/deletion invalidate matching snapshots and deletion retains completed history. Backup format 2 preserves focus/rest and imports legacy format 1. `npm run check` passes 238 tests across 42 suites, with clean typecheck/lint; Android export succeeds. Native keyboard/Back/player flow, reference and TalkBack QA remain. No commit. |

| Sep 30, 2026 | Settings-information pass: added durable units selector, imperial Profile input and BMI height display/edit without changing canonical kg/cm data. Added shared information sheets for privacy, adult disclaimer, config-derived About and searchable offline notices. Generator bundles 721 notice entries/280 unique texts (about 0.6 MB); LICENSE_AUDIT records 57 upstream notice gaps and LICENSES tracks owner-image provenance. `npm run check` passes 246 tests across 46 suites, with clean typecheck/lint; Android export succeeds. Native sheet/Back/keyboard/reference/TalkBack and final licence review remain. No commit. |

| Sep 30, 2026 | Back/onboarding gap pass: added optional reminder setup and saved summary in the onboarding schedule step. Added focused stable Android Back subscriptions, shared sheet dismissal, builder/reminder unsaved-change prompts and onboarding step navigation. Player quit pauses before a single dialog; finish Back preserves pending/failed session saves. Onboarding finish is guarded against duplicate saves. Typecheck and all 255 tests across 51 suites pass; final lint is clean after merging one duplicate test import. Android export succeeds. Native gesture/button/keyboard, first-run reminders and reference QA remain. No commit. |
| Sep 30, 2026 | Browse-design pass: rebuilt Training with the challenge carousel, focus/quick filters, collection and recommendation banners, stretch cards, goal tabs and local feedback note. Rebuilt Discover with featured, history, curated media carousels, collection, category tiles and bounded list routes. Added local profile/recent/disliked ranking, a responsive challenge hero/day grid and generated UI strings. `npm run check` passes 268 tests across 54 suites; Android export succeeds. Real-device visual, TalkBack and large-font QA remain. No commit. |
| Sep 30, 2026 | Expo Go startup fix: guarded the notifications native import by execution environment. Expo Go now starts without loading the unsupported module; reminder scheduling remains available in installed/development builds and its Settings screen explains the Expo Go limitation. Reminder tests pass; full device notification QA remains. No commit. |
| Sep 30, 2026 | Player completion pass: added per-exercise thumbs that persist to completed session items and local preferences, plus finish-screen streak/weekly goal details and saved workout difficulty feedback. Ratings feed the offline browse ranking. Typecheck, lint and focused player tests pass; local share card and device QA remain. No commit. |
| Oct 1, 2026 | Share-card pass: added an off-screen local SVG completion card with exercises, minutes, kcal, streak and weekly progress. It rasterizes to a cache PNG and opens only the system share sheet after the owner taps Share; body data never appears. Share-card unit tests, typecheck and lint pass. Native share-sheet/device QA remains. No commit. |
| Oct 1, 2026 | Player reliability pass: removed a duplicate completion handler that overwrote the saved summary. Ratings now live in validated resumable state and also persist during partial saves. Completion retries preserve the actual finish timestamp; the timer stops on completion. Feedback save errors are visible; share export has a timeout and immediate duplicate-tap guard. `npm run check` passes: 281 tests across 56 suites, clean typecheck/lint. Native/device QA remains. No commit. |
| Oct 1, 2026 | Offline release preflight: added `npm run qa:release`, using the installed Expo CLI with production/offline environment and no native-directory writes. It checks generated permission-removal directives, backup and updates off, and network-free app sources. Replaced the old remote muscle-map development preview with the bundled exercise guide. Preflight, production Android bundle export and `npm run check` pass (287 tests across 57 suites). SDK/adb is unavailable; merged APK inspection, real-device airplane mode and visual QA remain. No commit. |
| Oct 1, 2026 | Reminder/audio reliability: enabled default system sound for owned reminders in the channel/content/foreground handler. Missing channels and revoked permission fail safely; queued scheduling rechecks access without prompting. All weekday operations are attempted despite individual native failures, preserving intent for retry. Audio pauses immediately on background/unmount, pending cues cancel on pause/settings changes, and native failures cannot crash the hook. Added reminder and audio lifecycle regression tests. `npm run check` passes (295 tests, 59 suites), release preflight and production Android bundle export pass. Physical sound, silent/music behavior, delivery/reboot/battery/timezone checks require an installed Android build; Expo Go reminders remain guarded. Offline voice remains pending. No commit. |
| Oct 1, 2026 | Complete image QA pass: added `npm run images:qa` for metadata, full decoding and six contact sheets. All 119 mapped JPEGs decode at 768×1029; 8.33 MB, zero alpha. Reviewed every tile, zoomed suspicious poses and compared guide/player references. IMAGE_QA records nine priority replacements, seven clarity/style improvements and the other 103 reviewed rows. Checker backgrounds, pose corrections and phone/final form approval remain. Source and optimized assets unchanged; contact sheets saved outside the project. `npm run check` passes (295 tests, 59 suites), clean typecheck/lint. No commit. |
| Oct 1, 2026 | Completion polish: added the weekly active-day progress ring and corrected wording that previously called active days workouts. Share card now uses light/dark theme, Poppins, layout tokens, translation keys and configured app name; share dialog title is localized. Added light/dark card and configured-brand regression tests. `npm run check` passes (298 tests, 60 suites), clean typecheck/lint. Production Android bundle export and release preflight also pass. Native SVG/font/share-sheet and reference QA remain. No commit. |
| Oct 1, 2026 | Reference artwork follow-up: compared Training/Discover/player references, generated three original transparent male trainer/plank/squat browse assets with built-in imagegen, and removed the owner squat's baked checkerboard into a separate cutout. Alpha-aware build prefers cutouts and trims transparent outer margins; originals preserved. Hero/card/thumb/guide/player slots now have separate framing and card-title clearance. All 119 exercise mappings decode (8.71 MB; one alpha image); three male assets have genuine alpha and blue/dark previews were inspected. `npm run check` passes (300 tests, 61 suites), Android bundle export passes. Remaining 118 backgrounds need owner's cutout folder path or a removal batch; native size/reference and pose QA remain. Prompts/paths in CHARACTER_ASSETS. No commit. |

| Oct 1, 2026 | Inclusive artwork (ADR-060): original realistic transparent catalog (60 male/59 female prompt assignments), female/pair browse portraits, actual workout covers selected by muscle focus, compact Discover rows/full-width category heroes, body-focus silhouettes and bottom title scrims. Owner sources preserved; exact exercise prompts recorded in REALISTIC_IMAGE_PROMPTS.json. Typecheck/lint and 302 tests across 62 suites pass; Android production export passes. IMAGE_QA tracks technical/visual review and native/form approval; no commit. |

## 10. How to Update This File

### Sep 30, 2026 — local reminders

Validation: `npm run check` passes (215 tests across 36 suites, clean typecheck and lint); Android export succeeds. The time wheel now exposes increment/decrement actions for screen readers.

Added Settings → Workout reminders, weekday chips, 5-minute time wheels with device 12/24-hour format, permission primer and blocked-permission/channel recovery. Weekly notifications use fixed owned identifiers and serialize native updates so retries/startup repair cannot overwrite a newer setting. Desired state persists before scheduling for retry after native failures. Turning off cancels all seven owned identifiers. Startup/foreground reconciliation never requests permission. Expo's native reboot receiver is present; exact-alarm permissions remain blocked. Device reboot, airplane-mode delivery, battery delay, timezone, visual and TalkBack QA remain. Onboarding reminder step is still pending. No commit.

### Sep 30, 2026 — player feedback

Added saved countdown sound and vibration preferences, a scrollable workout settings sheet, local 3–2–1/phase/finish WAV cues, phase haptics and foreground/focused/unpaused screen-awake gating. Settings pauses the workout; timer defaults apply next workout. Installed approved SDK 57 audio, speech, haptics and keep-awake packages; recording and background audio plugin permissions are disabled. Speech is deliberately not invoked: the Android Expo voice list omits the native network-required flag, so offline-safe selection still needs implementation. Native airplane-mode, silent-mode, music ducking, background/lock and reference checks remain. No commit.

### Sep 28, 2026 session

Reviewed all 25 reference screenshots and current code. Found outdated status summaries and incomplete exercise copy. Began two replacement SVG animation studies, then the owner explicitly chose static images instead. Paused the rig work; retained experiments without routing to them. Added a licensed, unchanged Everkinetic side-plank PNG and a local preview with credit at `/dev/rig`, accessible from Training. Removed rig generation from the default assets command. `sharp` was installed as the already-approved dev tool (ADR-038) during the interrupted visual review. No commits. Full image catalog and phone QA remain pending.

Validation: typecheck passed; lint is clean after removing a BOM from the preview route. Tests: 145 passed, 3 failed in the existing `content/pack.test.ts`: its sample-pack expectations still use `wk_` IDs and single-workout counts, while the pre-existing working-tree content pack now has `wo_` IDs and the full catalog. Static-image work does not modify that pack or those tests. Device rendering remains unverified.

### Sep 29, 2026 session

The owner chose full-colour static illustrations, then took ownership of generating the 119 PNGs. Added a complete pose-prompt catalog with exact exercise IDs and filenames in `DOC/IMAGE_PROMPTS.md`; the original side-plank colour study remains a preview only. Restructured the content-pack tests around a small fixture so they no longer assume the old sample pack. Added local grouped search, related-workout ranking, a Discover browse entry, and basic workout/exercise detail routes. A first timestamp-based player route now runs prep, exercise and rest with pause/skip/Done; session persistence, cues and final visual design remain pending. Images, exercise copy and phone QA also remain pending. No commits.

Validation: `npm run check` passes (155 tests across 17 suites); Android export bundles successfully. Phone testing remains pending.

- At the **end of every session**: update "Last updated", the current phase and next step (header), §4 status, and add one row to the §9 session log.
- Add a line to §7 whenever something surprising is learned.
- Keep it short. Details belong in the other documents; link to them.
