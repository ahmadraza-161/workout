# WorkoutStride — app repair and user-flow plan

Version 1.0 · October 13, 2026

The owner's APK testing reports global errors when leaving exercise guides or selecting Image, failed image previews, rejected TrainAI demos, and HeyGainz previews stopping after one action. Earlier passing unit tests/export checks did not establish successful physical Android operation. Treat this as a repair pass, not a completed release.

## Product structure users should understand

1. **Startup and onboarding:** prepare local storage/fonts, collect goal and experience, make optional measurements/reminders understandable, then lead to a suitable first workout. Both genders use the same functional catalog.
2. **Training:** one obvious suggested workout based on experience/goal, followed by weekly progress and optional plans/body-focus browsing. A user can review duration, difficulty, exercises and needed household props before starting.
3. **Discover:** searchable alternatives grouped by purpose. Filters must describe the actual routine. A body-focus category describes training focus, not a promise to remove fat from one area.
4. **Workout detail:** what the routine contains, difficulty, duration, actual equipment, exercise previews and a clear Start action. Viewing an exercise does not start a workout.
5. **Exercise guide:** Animation/Image, focus muscles and written steps are different views of the same exercise. Closing or changing variations returns safely. A media failure must not discard navigation or the active session.
6. **Player:** prepare → exercise → rest → next exercise → finish. Guide opening pauses the timer. Demo repetition is illustrative, not a repetition counter. Skip/previous/pause/resume/quit preserve correct session state.
7. **Finish and Report:** completed activity, feedback and local history; challenge and achievement updates happen once. Failed saving offers recovery without fabricating progress.
8. **Settings:** profile/units, local reminder permission and schedule, sound/vibration, favorites/custom routines, backup/restore and credits. Offline reminders are local notifications; no remote push service.

## Repair phases and acceptance criteria

| Phase | Scope | Acceptance evidence |
|---|---|---|
| 1 — stop crashes | Native player cleanup, exercise close/variation changes, Animation/Image toggling, local image recovery | Released-player regression; queued callbacks ignored; 30 physical close/switch cycles without a root error |
| 2 — correct media | Disable all 27 TrainAI mappings, repeat full HeyGainz cycles, retain photos and provenance | No active TrainAI mapping or export asset; HeyGainz loop flags/full cycles checked; all 119 images decode |
| 3 — make starting clear | One goal/level-appropriate no-equipment starting recommendation; detail/preview before Start | Recommendation excludes advanced routines for beginners and required props; CTA routes to selected workout detail |
| 4 — audit every functional flow | Onboarding, search/filters, workout player, challenge days/rest/restart, custom builder, report, reminders, backup and accessibility | Automated regressions plus physical scenarios below; every failure documented as open/fixed/verified |
| 5 — release gate | Production export, permissions, real Android offline test and owner visual review | Passing checks/export, merged APK permission inspection, phone airplane-mode and restart/notification tests; APK only when requested |

## Confirmed findings and changes

- **Native cleanup defect:** useVideoPlayer owns release; our effect cleanup additionally called pause on its shared native object. Native-hook release can precede our cleanup, producing an exception during closing/Image selection. Removed the cleanup pause; ignore stale callbacks and contain playback-command failures. Tests simulate native release before cleanup. Exact owner stack trace is unavailable, so this is a verified code defect and likely contributor, not proof of every reported error's cause.
- **Image recovery gap:** a decoder error remained a terminal fallback with no retry in guide/player. Add a local-image retry that remounts the native Image. All 119 bundled PNGs decode in the image audit; device decoder/resource behaviour still requires phone reproduction.
- **Rejected provider:** archive TrainAI provenance but remove its 27 active mappings, including shared Squat Thrust. Those exercises keep their original images; do not advertise 119/119 active animation coverage. Active coverage becomes 92/119.
- **HeyGainz stopping:** eight held-entry mappings had loop=false and truncated clips by design. The owner now wants repeating visual demonstrations. Restore their complete original GIF cycles and use looping playback; preserve written hold/timer semantics.
- **Choice overload:** Home has several challenge/body-focus/custom/recommendation groups and no single obvious everyday starting action. Add a suitable starting suggestion; preserve the reference card/section system.

## Code audit coverage

Reviewed Training recommendation ranking and navigation; workout detail exercise links;
exercise guide variation replacement and close/back fallback; player guide pause,
quit confirmation and resume persistence; native video readiness, focus, background,
Reduce Motion, status events and cleanup; image source mapping and decoder fallback;
onboarding first-workout route and input validation; root error boundary and boot gate.
Existing automated suites cover challenge progression, builder, reports, backup,
reminders, feedback/audio and catalog/filter integrity. Passing those suites is
automated evidence; it does not close the physical scenario matrix.

The starting recommendation now filters routines to the user's experience and
no-equipment exercises, then ranks by goal/history. Home shows duration, level,
guidance and Review workout before Start. This addresses the unclear starting
choice without changing the catalog or starting sessions automatically.

## Physical Android scenario matrix — still open

| Area | Steps |
|---|---|
| Guides/media | From two different workouts open every exercise; switch Animation/Image repeatedly; close via button, backdrop and hardware Back; open easier/harder variants; verify all photos including newly animated IDs |
| Repetition | Run all HeyGainz demos through three complete cycles; pause/resume, open a guide, background/foreground, and enable Reduce Motion |
| Sessions | Start, skip, previous, rest adjustment, guide pause, quit/resume after app restart, finish/save/retry; confirm history and challenge progress exactly once |
| Browsing | Every tab, search/no-results, each filter, collection/body focus, favorites, recent and recommendation links |
| Plans/custom | Challenge join/rest day/restart/leave; custom create/edit/reorder/delete/copy and playback |
| Profile/storage | Onboarding validation, profile/unit change, backup round trip, corrupted/newer backup rejection, restart persistence |
| Reminders/sound | Permission allow/deny, local notification with app closed in airplane mode, schedule changes, audio/vibration toggles |
| Accessibility/UI | Small screen, large font, light/dark, TalkBack focus and controls, transparent image framing compared with supplied references |

ADB initially could not initialize its user directory inside the sandbox.
Running approved device detection outside the sandbox started ADB successfully,
but the device list is empty. A connected, authorized Android phone is still
required. The existing APK manifest has no INTERNET permission, but that APK
predates the current repairs. Do not claim phone scenarios passed based on Jest
or export results. The owner confirmed both close and image-selection failures;
exact device model/native logs remain unknown.

## Revision history

| Version | Date | Changes |
|---|---|---|
| 1.0 | October 13, 2026 | Full user-flow structure, repair priorities, evidence limits and physical acceptance matrix |

## Verification and current phase status

October 13 repair verification: final npm run check -- -- --runInBand --testTimeout=20000 passes typecheck, lint and all 347 tests/75 suites (147.368s). Release preflight passes. Production Android JS export passes (4,973 modules, 245 assets, .expo/app-repair-export); exported MD5 bytes verify all 64 active MP4s and all 119 original images, with zero disabled TrainAI videos. All 64 MP4s decode and source SHA256 hashes match. Image audit passes 119 PNGs (11.21 MB) and five character assets. Regression coverage includes native release before guide cleanup/stale events, HeyGainz loop policy, local-image retry, suitable recommendation and Review workout navigation. Intermediate checks exposed a stale recommendation expectation, ungenerated translation keys and a Jest mock-hoisting error; all were corrected before this final pass. Physical Android scenario matrix in APP_REPAIR_PLAN remains open; no APK built.

| Phase | Current status |
|---|---|
| 1 — crashes | Code fixes and automated regressions pass; phone reproduction remains open |
| 2 — media | TrainAI disabled, HeyGainz full cycles restored, all active files/export verified; phone form/loop QA remains open |
| 3 — starting flow | Home suggestion and Review workout navigation implemented and tested |
| 4 — functional audit | Code review and 75 automated suites pass; physical scenario matrix remains open |
| 5 — release gate | JS export/preflight pass; merged APK manifest and real Android offline QA remain open; no APK requested |
