# Remaining animation review — October 13, 2026

October 26 (supersedes everything below): owner removed all third-party MP4 demos and their sources/notices (ADR-065). Active animation: **28/119 Lottie only**; the other 91 show photos until owner-generated Google Flow clips arrive (prompts: [VIDEO_PROMPTS](VIDEO_PROMPTS.md)).

October 13 repair pass (supersedes historical coverage below): owner rejected TrainAI. Its 27 active mappings are disabled; originals/provenance are archived, not bundled. Current active demos: 92/119 exercise IDs, 28 Lottie + 64 MP4, 88 unique sources; 27 exercises retain their original images. All 32 HeyGainz clips loop; eight previously truncated holds now use complete original GIF cycles. MP4 total 14,142,982 bytes. Native release cleanup is fixed, guide/player image Retry added, and Home offers a suitable no-equipment routine to review before Start. Full plan and physical acceptance matrix: [APP_REPAIR_PLAN](APP_REPAIR_PLAN.md). Native phone reproduction and release QA remain open; no APK built.

Added seven exercise mappings, bringing the bundle to 116/119 IDs: 28 Lottie and 88 MP4 mappings, backed by 111 unique sources. MP4 bytes total 14,142,256; seven added mappings account for 3,030,181 bytes. Six new source downloads were integrated; Squat Thrust reuses the reviewed Step-back Burpee source because the catalog describes the same no-jump movement. Original images and UI remain.

| Exercise | Selected source and review |
|---|---|
| Arm Circles | FitnessBlender via MakeAGIF: small circles, straight sideways arms, standing full body. Source labels and logo retained. |
| Fire Hydrant | FitnessProgramer: bent knee lifts sideways with hip muscle highlights. Straight-leg kick alternative rejected. |
| Hamstring Stretch, each leg | 24Life: original three timed photos, heel forward/toes up and hip hinge. Plays once and holds the final stretch. No invented motion. |
| Get-Up, floor to stand | TNT Performance: source 20–80% segment starts seated, rises through supported kneeling to standing, and returns seated. Lightweight shoe is a balance cue, not resistance. |
| Reverse Snow Angel | Gymaholic: prone arm sweep with body remaining on the floor, without a Superman back arch. Original MP4 unchanged. |
| Squat Thrust | Existing TrainAI Step-back Burpee: hands down, feet back to plank, feet in, stand; no jump. Shared source is not a new unique download. |
| Heel Digs | Physitrack: alternating forward heel taps with toes raised and softly bent supporting knee. Original MP4 unchanged. |

Original hashes, GIFs, converted MP4s, source URLs and playback settings are retained in tools/animations/video-candidates.json. Public availability does not grant app redistribution permission; these additional sources have unverified redistribution rights, recorded in PUBLIC-DEMO-NOTICE.txt and offline credits. No login, security, payment or entitlement bypass was used. Real-person sources lack anatomical overlays; the existing Focus area guide provides catalog muscle information.

## Historical exclusions before the final source pass

- **Arm Pulse:** ExerciseAnimatic's public Arm Pulses, Palms Upwards and Palms Downwards previews were downloaded through URLs present in their public product pages and reviewed through the complete cycles. All keep elbows bent in front, unlike this catalog's straight sideways arms. HeyGainz alternatives add stepping or front-elbow pulses. No matching source bundled.
- **Floor Row Isometric:** Physitrack's no-equipment seated row uses a chair/stool; cable, band, towel and supine floor-row candidates also differ from the catalog's floor-seated imagined-resistance hold. No matching source bundled.
- **Frog Jump:** Physitrack's child demo uses a deep hands-on-floor crouch. Their forward/back jump uses feet together and backward hopping. ExerciseAnimatic's male/female public previews use deep squat jumps with hands between the knees, rather than the catalog's shallow squat and small forward jump. Existing frogger/plank-hop and long-jump candidates also differ. No matching source bundled.

Their original images remain. Rejected preview downloads are ignored scratch inputs, not app assets. Custom motion remains excluded by the owner's preference.

## Validation

All seven added MP4 mappings decode without FFmpeg errors. Source-cycle review and decoded Get-Up endpoints / Hamstring Stretch final pose pass. Typecheck/lint and all 342 tests across 74 suites pass (74.074 seconds). The initial test run exposed a stale static-fallback test using Arm Circles; it now uses the unresolved Floor Row exercise. Release preflight passes. Production Android JS export passes (4,997 modules; .expo/animation-final-seven-export; 268 assets). All 88 MP4 mappings and 119 original image mappings are verified by MD5 in exported metadata; identical shared MP4s deduplicate. Native phone QA remains; no APK built. Native Android framing, gestures, pause/background, held last frame, Reduce Motion, TalkBack and airplane-mode QA remain pending. No APK built.

## Revision history

| Version | Date | Changes |
|---|---|---|
| 1.0 | October 13, 2026 | Seven mappings and exact remaining movement exclusions |

## Final three mappings — complete catalog coverage

October 13 completed animation mapping: **119/119 exercise IDs** now have local demos (28 Lottie + 91 MP4 mappings, 114 unique sources). Final three additions: Arm Pulse (public emireerose/GIPHY), Frog Jump (reviewed Sworkit forward segment), Floor Row Isometric (FitnessProgramer floor-seated scapular retraction entry then hold). MP4 bytes total 14,324,244; twenty MP4 held-pose entries. Images/UI/instructions retained; no runtime network or new dependency. Exact framing/movement limitations and unverified distribution permissions are recorded in ANIMATION_FINAL_REVIEW. Native form/playback QA remains. No APK.

| Exercise | Source and exact limits |
|---|---|
| Arm Pulse | Original emireerose/GIPHY MP4 embedded in Boston Magazine arm workout: standing torso, sideways arms, soft elbows and small pulses. Source camera ends at thighs; feet are outside its original frame. Arms, wrists and shoulders are visible throughout. No artificial reframing or anatomical overlay added. |
| Frog Jump | Original Sworkit 0.30–0.85 second segment: shallow takeoff, small forward jump, grounded landing and soft-knee reset. The source deeper crouch and backward hop are omitted; the loop resets position without fabricated return motion. Side view limits stance-width assessment. Untrimmed original MP4/hash retained separately. |
| Floor Row Isometric | FitnessProgramer Seated Scapular Retraction: floor-seated crossed legs, elbows beside ribs, shoulders/elbows pulled back and down. Source first-entry frames before 1.9 seconds are retained, then final retracted pose holds; frame timing extends the last existing frame. This is the catalog imagined-resistance retraction hold, not a cable/band row. Original animation uses two poses with a dissolve, not continuous articulated limbs. Creator mark and highlighted upper-back/shoulder muscles remain. |

Final source pages: https://giphy.com/gifs/xT0GqlJf2mJVIr4a08 ; https://sworkit.com/exercise/frog-jumps ; https://fitnessprogramer.com/exercise/seated-scapular-retraction-exercise/ . All three output MP4s decode without errors; final Floor Row held frame was visually inspected. Native editorial/form review remains essential for these source limitations.

## Final validation

October 13 final catalog-wide check: typecheck/lint and all 342 tests across 74 suites pass (85.696 seconds). All three final MP4s decode without errors; Floor Row decoded last pose reviewed. Original-source integrity now also checks the untrimmed Sworkit MP4 hash. Static fallback test uses a missing-demo ID since all 119 catalog IDs are now mapped. The intermediate check collided with asset generation (Windows EBUSY); final checks ran after generators completed and pass. Physical Android form/framing, pose holds, pause/background, Reduce Motion, TalkBack and airplane-mode QA remain pending. No APK built.

| 1.1 | October 13, 2026 | Final three source mappings complete 119/119 and source-integrity/fallback checks |

Final 119/119 export verification: production Android JS export passes (5,000 modules; .expo/animation-all-exercises-export; 271 assets). All 91 MP4 mappings and all 119 original image mappings match exported MD5 assets; shared sources deduplicate. Release preflight passes. Full check passes typecheck/lint and 342 tests/74 suites (85.696s). Native Android QA remains; no APK built.
