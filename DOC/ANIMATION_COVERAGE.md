# Exercise animation coverage — October 13, 2026

October 27: **112/119** — 28 Lottie + 84 owner-generated Google Flow MP4s (3D character, muscle highlights). Remaining 7 are listed in [VIDEO_PROMPTS](VIDEO_PROMPTS.md).

October 26 (supersedes everything below): owner removed all third-party MP4 demos and their sources/notices (ADR-065). Active animation: **28/119 Lottie only**; the other 91 show photos until owner-generated Google Flow clips arrive (prompts: [VIDEO_PROMPTS](VIDEO_PROMPTS.md)).

October 13 repair pass (supersedes historical coverage below): owner rejected TrainAI. Its 27 active mappings are disabled; originals/provenance are archived, not bundled. Current active demos: 92/119 exercise IDs, 28 Lottie + 64 MP4, 88 unique sources; 27 exercises retain their original images. All 32 HeyGainz clips loop; eight previously truncated holds now use complete original GIF cycles. MP4 total 14,142,982 bytes. Native release cleanup is fixed, guide/player image Retry added, and Home offers a suitable no-equipment routine to review before Start. Full plan and physical acceptance matrix: [APP_REPAIR_PLAN](APP_REPAIR_PLAN.md). Native phone reproduction and release QA remain open; no APK built.

October 13 completed animation mapping: **119/119 exercise IDs** now have local demos (28 Lottie + 91 MP4 mappings, 114 unique sources). Final three additions: Arm Pulse (public emireerose/GIPHY), Frog Jump (reviewed Sworkit forward segment), Floor Row Isometric (FitnessProgramer floor-seated scapular retraction entry then hold). MP4 bytes total 14,324,244; twenty MP4 held-pose entries. Images/UI/instructions retained; no runtime network or new dependency. Exact framing/movement limitations and unverified distribution permissions are recorded in ANIMATION_FINAL_REVIEW. Native form/playback QA remains. No APK.

October 13 current coverage: **116/119 exercise IDs, 111 unique sources, 3 remaining**. This pass adds seven mappings (six new sources plus shared Step-back Burpee). Active bundle: 28 Lottie and 88 MP4 mappings, 14,142,256 MP4 bytes, nineteen MP4 holds. Arm Pulse, Floor Row Isometric and Frog Jump still lack an exact reviewed matching demo. Original images remain. See ANIMATION_FINAL_REVIEW for matching evidence, source terms and device QA limitations.

October 13 latest coverage: **109/119 exercise IDs, 105 unique sources, 10 remaining**. Added 32 anatomical HeyGainz GIF demos converted to bundled MP4s (8,006,804 bytes); active bundle has 28 Lottie mappings and 81 MP4 mappings (11,112,075 MP4 bytes). Eight new hold entries stop on the held pose; there are 18 MP4 holds total. Original photographs remain. Exact mappings: video-candidates.json; remaining IDs: coverage.generated.json. Detailed matching exclusions: tools/animations/HEYGAINZ-REVIEW.md. This is not complete animation coverage or cleared distribution permission.

October 13 earlier batch coverage: 77/119 exercise IDs, 73 unique sources, 42 unresolved. This pass adds 48 original GIF demos converted to MP4: 22 anatomical Gym visual demos via the public ExerciseDB dataset and 26 TrainAI character demos. There are 28 Lottie mappings and 49 MP4 mappings; MP4 bytes total 3,105,271. Exact mappings and remaining IDs: tools/animations/video-candidates.json and coverage.generated.json. Ten reviewed hold entries stop on the held pose. Original photos remain.

## October 12 MP4 expansion

Owner approved ready-made GIF/MP4/Lottie formats and the SDK-compatible expo-video package. Pike Push-Up now uses the reviewed original Vital Animations free character sample 0353 with shoulder/upper-arm highlights. Current coverage: **29/119 exercise IDs, 25 unique source animations, 90 unresolved IDs**. Original Lottie JSON still totals 3,343,861 bytes; the unchanged MP4 adds 1,739,537 bytes. Images remain. Video provenance is in tools/animations/video-candidates.json and assets/videos/exercises/provenance.json; `npm run animations:build` regenerates both formats and unified coverage. Native form/playback QA remains pending. Historical Lottie-only counts below describe earlier passes.

The owner approved expanding the animations after trying the initial three. Dinh Bui Xuan's three public portfolio pages, saagar shrestha's two pages and public exercise/home-workout collections were reviewed. Twenty-nine of the 119 existing exercises now have local animation previews; 90 retain their original images because a matching licensed demo has not been verified. This is not complete animation coverage. The eleven Dinh demos retain the initially approved style; the other reviewed sources use flat characters.

Owner preference after the eighteen-demo pass: use only ready-made animations resembling the existing demos. Custom character animation was explicitly declined. Do not enable the historical rough rig or commission/generate a different character style to fill the remaining IDs. The unresolved requirement is matching, appropriately licensed ready-made source assets for the remaining exercises; their absence from the reviewed sources does not prove they are unavailable everywhere.

| Exercise | Source animation | Added |
|---|---|---|
| Standard Push-Up | Military Push Ups | October 4 |
| Pike Push-Up | Vital Animations free home character sample 0353 — original MP4 and muscle highlights | October 12 |
| Wide Push-Up | Wide Arm Push Up | October 4 |
| Squat to Overhead Reach | Squat Reach | October 4 |
| Jumping Jack | Jumping Jack | October 5 |
| Squat Jump | Jumping Squats | October 5 |
| Punches | Punches | October 5 |
| Forward Lunge | Lunge | October 5 |
| Inchworm Walkout | Inchworm | October 5 |
| Step-Up (Chair) | Step Up on Chair | October 5 |
| Burpee | Burpee and Jump Exercise | October 5 |
| Cobra Stretch | Cobras | October 5 |
| Marching High Knees | High stepping — saagar shrestha | October 5 |
| Triceps Dip (Chair/Floor) | Triceps dips — saagar shrestha | October 5 |
| Crunch | ABS Crunches — saagar shrestha | October 5 |
| Bodyweight Squat | Man with beard doing Sit up — saagar shrestha, reviewed as a standing squat | October 5 |
| Dead Bug | Deadbug fitness exercise — unnamed contributor a848f9e4 | October 5 follow-up |
| March in Place | Warmup Exercise — Brian Karungani | October 5 follow-up |
| Donkey Kick | Fitness girl workouts — Dima Oris | October 5 follow-up |
| Forearm Plank | Plank — Blinix Solutions | October 5 free-only pass |
| Flutter Kick | Flutter Kicks — Blinix Solutions | October 5 free-only pass |
| High Knees | High Knees Workout — Bashir Ahmad | October 11, interrupted import completed |
| Push-Up Hold | Military Push Ups — single shallow lowering segment, then hold | October 11 |
| Plank Walkout | Inchworm — same hand-walk movement as catalog instructions | October 11 |
| Neck Side Stretch | Yoga neck exercise — Indrum, gentle tilt once then hold | October 11 batch continuation |
| Shadow Boxing | Punches — same original staggered stance/alternating punches/guard | October 11 batch continuation |
| Side Plank (each side) | Exercise — Ajay Gupta, first side entry once then hold | October 11 batch continuation |
| Standing Forward Fold | Inchworm — original hip hinge frames 0–24 once, then hold | October 11 next pass |
| Russian Twist | Russian Twists — unnamed contributor a848f9e4, original seated rotation | October 11 |

Current bundle: 26 animated exercise IDs backed by 23 unique source animations, 2,934,727 bundled bytes. High Knees preserves the original alternating 29-frame cycle; all 119 optimized photographs remain.

Sources, public download URLs, licence and playback segments: [catalog](../tools/animations/catalog.json). Exact remaining exercise IDs: [generated coverage](../tools/animations/coverage.generated.json), regenerated by `npm run animations:build`.

The photographs and browse cards are retained. Native exercise previews open with Animation, with Image as the second option. Playback respects pause, foreground, route focus and Reduce Motion; failures fall back to the photograph. Cobra plays frames 40–60 once, rising into the stretch and holding the final pose rather than repeatedly lowering and lifting. Its hold instructions are unchanged. Step-Up belongs to the existing household-chair exercise; no equipment exercise or new catalog entry was added.

Original archives and extracted JSON remain in `tools/animations/source/`. The generator removes full-canvas background solids in root and nested compositions and embeds source PNGs as data URIs, requiring no runtime image folder or download. The current bundled JSON byte total is recorded above. Source and embedded-image hashes are recorded in `assets/lottie/imported/provenance.json`; creator/licence notices are available offline in Settings. The donkey-kick source's decorative #fitnessgirl label is removed by its reviewed layer name; character geometry and motion are preserved. Dead Bug's public source no longer displays an author name and its profile returns a missing page; the credit preserves the public contributor identifier rather than inventing a name. Its source page still explicitly publishes the Simple License. `node tools/animations/render-raster-qa.mts` renders raster-source keyframes for review, without changing their source art. The snapshot shows the standing/squatting movement despite the source's incorrect Sit up title; the catalog mapping includes an explicit note and does not assign it to Sit-Up.

## Reviewed exclusions

Free-only follow-up adds two original Blinix Solutions character demos, totalling 20/119 and 2,131,736 bytes. Forearm Plank enters frames 0–15 once and holds; Flutter Kick alternates opposite straight-leg thigh rotations. Original geometry/timing remain unchanged. Reviewed viewports trim unused canvas, translating only static root positions; invalid bounds or animated root positions are rejected. Source and final SVG keyframes were inspected locally. Original archives, Simple License notices and all 119 exercise photographs remain. Final native decoding/form approval is still pending.

The owner-supplied GymVisual, ExerciseAnimatic, VFE and MoveKit resources and further community candidates are recorded in [ANIMATION_SOURCES](ANIMATION_SOURCES.md). Their reviewed free samples do not add verified matching demos. Paid licensing and video-format changes are not implied by the request to continue searching.

- Reverse Crunches (`reverse-crunches-79P2FMTS7Z`): visual inspection shows a seated knee-tuck with the torso raised, which does not match the catalog's supine pelvic-curl instructions. The candidate archive/JSON are preserved for review and are not referenced by the app.
- T Plank: rotating straight-arm plank; does not match the forearm side-plank hold or shoulder-tap instructions.
- Shoulder Stretch / Forearm Stretch: do not match the overhead triceps or neck stretches.
- Squat Kicks, Frog Press, Seated Abs Circles, Staggered Push Ups, Walking Hip Opener, Split Jump, Press-Up Position Toe Tap: distinct variants without an exact matching catalog exercise.
- Barbell clean-and-press and box-jump assets: incompatible with the existing exercise/prop definitions.
- saagar Side plank and Wall sitting: static raster layers with no movement; adding them as animated demos would only replace the already retained poses.
- saagar Leg up: one leg lifts while the other stays down; does not match the catalog's both-legs-together Leg Raise.
- Vector Fitness Exercises' sit-up sample: its description explicitly restricts commercial use despite the site's generic free-licence label; not downloaded or used.
- Butterfly Exercise by Asim Abbasi: a gym chest machine, not the no-equipment butterfly stretch.
- Open Books: half-kneeling trunk rotation, not the catalog's quadruped or side-lying thoracic rotation.
- Plank Low To High: preview displays overlapping poses rather than a clean movement demonstration.
- Plank by Oyinloluwa Adedoyin: two static raster layers with zero animated properties; preserved as a candidate, not included as an animation. Other reviewed plank previews do not demonstrate a steady aligned forearm hold.
- Workout (`workout-LMGRexida5`, Muhammad Ali, credits Abdul Latif): ball-supported abdominal movement in a decorative room, incompatible with the existing no-equipment exercises.
- Flow Exercise Dataset: three-frame silhouette SVGs with declared provenance limitations; different from the owner-selected ready-made character style. Not imported.

The remaining 96 need matching free ready-made exercise-specific assets; generic loops must not be substituted. Source previews and composition data were reviewed. The previous fifteen-demo checks passed typecheck/lint, 328 tests/72 suites, offline Android export and release preflight. Follow-up passes typecheck/lint, 329 tests/72 suites, offline production Android export and release preflight; details are recorded in TEST_PLAN. Final Android decoding, small-screen framing and exercise-form approval of the fifteen demos added after the original three still require an installed-device pass. No APK is built by this change.

## Revision history

| Version | Date | Changes |
|---|---|---|
| 1.0 | October 5, 2026 | Fifteen matching offline previews, exact coverage gaps, keyframe review and documented exclusions |
| 1.1 | October 5, 2026 | Three further matching demos, decorative label removal, honest unnamed attribution and additional exclusions |
| 1.2 | October 5, 2026 | Owner declines custom animations; preserve ready-made style requirement and record further source exclusions |
| 1.3 | October 5, 2026 | Link provider and community source audit; retain 18/119 production coverage |
| 1.4 | October 5, 2026 | Add free forearm-plank/flutter-kick demos with reviewed canvas framing; coverage 20/119 |

| 1.5 | October 11, 2026 | Complete reviewed High Knees import; coverage 21/119, 98 unresolved IDs |

| 1.6 | October 11, 2026 | Add hold/walkout mappings from two verified original sources; 23 IDs, 21 unique source animations |

Current bundle after Russian Twist import: 28 IDs, 24 unique sources, 91 remaining IDs, 3,343,861 bytes.

## Remaining batches requested by the owner

These are pending acquisition groups, not completed animation batches. Search results and rejected candidates are recorded in ANIMATION_SOURCES. Never mark a batch complete using unrelated animations.

| Batch | Remaining exercise IDs | State |
|---|---|---|
| 1 | `ex_arm_circles`, `ex_shoulder_rolls`, `ex_hip_circles`, `ex_leg_swings_front`, `ex_leg_swings_side`, `ex_torso_twist`, `ex_neck_rolls`, `ex_cat_cow`, `ex_reverse_crunch`, `ex_bicycle_crunch` | Awaiting verified matching free ready-made assets |
| 2 | `ex_sit_up`, `ex_leg_raise`, `ex_scissor_kick`, `ex_heel_touch`, `ex_plank_shoulder_tap`, `ex_hollow_hold`, `ex_mountain_climber`, `ex_v_up`, `ex_toe_touch_crunch` | Awaiting verified matching free ready-made assets |
| 3 | `ex_cross_touch_and_reach`, `ex_standing_oblique_crunch`, `ex_wall_push_up`, `ex_incline_push_up`, `ex_knee_push_up`, `ex_diamond_push_up`, `ex_decline_push_up`, `ex_archer_push_up`, `ex_plank_to_push_up`, `ex_chest_squeeze_isometric` | Awaiting verified matching free ready-made assets |
| 4 | `ex_shoulder_tap_push_up`, `ex_wall_angel`, `ex_floor_triceps_extension`, `ex_front_raise`, `ex_lateral_raise`, `ex_overhead_press_isometric`, `ex_plank_up_down`, `ex_bear_hold`, `ex_wall_handstand_hold` | Awaiting verified matching free ready-made assets |
| 5 | `ex_arm_pulse`, `ex_superman_hold`, `ex_superman_raise`, `ex_reverse_snow_angel`, `ex_prone_y_raise`, `ex_prone_t_raise`, `ex_prone_w_raise`, `ex_swimmer`, `ex_bird_dog`, `ex_floor_row_isometric` | Awaiting verified matching free ready-made assets |
| 6 | `ex_back_extension`, `ex_sumo_squat`, `ex_squat_pulse`, `ex_wall_sit`, `ex_reverse_lunge`, `ex_lateral_lunge`, `ex_curtsy_lunge`, `ex_split_squat`, `ex_glute_bridge`, `ex_single_leg_glute_bridge` | Awaiting verified matching free ready-made assets |
| 7 | `ex_floor_hip_thrust`, `ex_fire_hydrant`, `ex_calf_raise`, `ex_single_leg_calf_raise`, `ex_good_morning`, `ex_half_burpee_no_jump`, `ex_squat_thrust`, `ex_bear_crawl`, `ex_crab_walk`, `ex_get_up_floor_to_stand` | Awaiting verified matching free ready-made assets |
| 8 | `ex_plank_jack`, `ex_frog_jump`, `ex_step_jack`, `ex_butt_kicks`, `ex_heel_digs`, `ex_skater_hop`, `ex_lateral_step`, `ex_fast_feet`, `ex_standing_knee_to_elbow`, `ex_childs_pose` | Awaiting verified matching free ready-made assets |
| 9 | `ex_downward_dog`, `ex_seated_forward_fold`, `ex_hamstring_stretch_each_leg`, `ex_quad_stretch_each_leg`, `ex_hip_flexor_stretch_each_side`, `ex_figure_4_glute_stretch`, `ex_butterfly_stretch`, `ex_chest_doorway_stretch`, `ex_triceps_stretch` | Awaiting verified matching free ready-made assets |
| 10 | `ex_thoracic_rotation`, `ex_knee_to_chest`, `ex_lying_spinal_twist` | Awaiting verified matching free ready-made assets |

### October 13 final-pass revision

Seven further mappings bring current coverage to 116/119; historical counts and batch plans above describe earlier passes. Current remaining IDs: Arm Pulse, Floor Row Isometric, Frog Jump. Review and verification: ANIMATION_FINAL_REVIEW.

### Final revision — all catalog IDs mapped

119/119 exercise IDs are now mapped to bundled demos. Historical unresolved counts above are superseded. Exact source/framing limitations and final passing checks: ANIMATION_FINAL_REVIEW.
