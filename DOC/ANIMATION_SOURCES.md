# Ready-made animation sourcing

October 26 (supersedes everything below): owner removed all third-party MP4 demos and their sources/notices (ADR-065). Active animation: **28/119 Lottie only**; the other 91 show photos until owner-generated Google Flow clips arrive (prompts: [VIDEO_PROMPTS](VIDEO_PROMPTS.md)).

October 13 repair pass (supersedes historical coverage below): owner rejected TrainAI. Its 27 active mappings are disabled; originals/provenance are archived, not bundled. Current active demos: 92/119 exercise IDs, 28 Lottie + 64 MP4, 88 unique sources; 27 exercises retain their original images. All 32 HeyGainz clips loop; eight previously truncated holds now use complete original GIF cycles. MP4 total 14,142,982 bytes. Native release cleanup is fixed, guide/player image Retry added, and Home offers a suitable no-equipment routine to review before Start. Full plan and physical acceptance matrix: [APP_REPAIR_PLAN](APP_REPAIR_PLAN.md). Native phone reproduction and release QA remain open; no APK built.

October 13 completed animation mapping: **119/119 exercise IDs** now have local demos (28 Lottie + 91 MP4 mappings, 114 unique sources). Final three additions: Arm Pulse (public emireerose/GIPHY), Frog Jump (reviewed Sworkit forward segment), Floor Row Isometric (FitnessProgramer floor-seated scapular retraction entry then hold). MP4 bytes total 14,324,244; twenty MP4 held-pose entries. Images/UI/instructions retained; no runtime network or new dependency. Exact framing/movement limitations and unverified distribution permissions are recorded in ANIMATION_FINAL_REVIEW. Native form/playback QA remains. No APK.

October 13 final matching pass: imported public downloads from FitnessProgramer, FitnessBlender via MakeAGIF, 24Life, TNT Performance, Gymaholic and Physitrack; reused the existing TrainAI Step-back Burpee for matching Squat Thrust. Original marks, hashes and GIF timing retained; no new motion. Coverage 116/119. These public downloads have unverified app redistribution rights and truthful offline notices. Arm Pulse, Floor Row Isometric and Frog Jump candidates still differ; detailed review and canonical source links: ANIMATION_FINAL_REVIEW and tools/animations/video-candidates.json. No APK.

October 13 HeyGainz expansion: reviewed public catalog GIFs and alternatives against existing instructions; added 32 matching demos. Public pages supplied the download URLs; original GIFs, source hashes, character artwork, red muscle highlights and branding are retained. Floor leg raise, tabletop floor hip thrust, lying single-knee stretch and bent-knee spinal twist replace mismatched candidates; bottle raises use actual household-bottle sources. Eight holds use reviewed clips with loop=false. Coverage 109/119, 10 remaining. HeyGainz terms (https://heygainz.com/tos, checked October 13) claim copyright and do not grant app redistribution; these assets are not claimed cleared for publication. Detailed exclusions and pending QA: tools/animations/HEYGAINZ-REVIEW.md. No APK.

October 13 acquisition: downloaded 28 candidates from hasaneyldrm/exercises-dataset and 28 from TrainAI creator media; visually reviewed five cycle points per candidate. Bundled 22 dataset and 26 TrainAI matches (48 new), retaining original GIFs and hashes. Dataset rejects: standing toe touch is not a supine toe-touch crunch; across-chest triceps stretch is not overhead; body-up presses both arms rather than alternating plank up/down; butterfly/knee-to-chest/lying-twist source cycles were not selected for holds in this pass. TrainAI rejects: arm circles are broad sweeps rather than catalog small circles; reverse snow angel is standing rather than prone. Selected ten TrainAI hold entries stop before release. TrainAI has no red anatomical highlights; existing Focus area guide remains. Current dataset README attributes GIF copyright to Gym visual and requires an own media licence before reuse; TrainAI public catalog is for TrainAI content production and requires visible branding, not a general app licence. Owner expressly requested publicly downloadable media despite unresolved copyright; no purchase or entitlement bypass. Marks/credits remain. These imports are not claimed cleared for publication. GIF-to-H.264 conversion retains frame timing and body gestures, pads odd dimensions, and does not author new motion. Current coverage 77/119, 42 unresolved; original files/provenance in tools/animations/gif-source and video-candidates.json. No APK.

### October 12 — owner accepts GIF/MP4 as well as Lottie

Follow-up: owner explicitly approved `expo-video`; Expo selected SDK-compatible version 57.0.5. Pike Push-Up sample 0353 is now bundled locally with its original hash and source credit. Coverage is 29/119 (28 Lottie mappings plus one MP4), with 90 unresolved IDs. Animation-first/Image-second remains; muted playback pauses on timer pause, route blur and app background, and Reduce Motion/errors fall back to the original pose. Video player checks, production export and native phone QA status are recorded in TEST_PLAN.

The owner now accepts ready-made GIF, MP4 or Lottie demos, provided full body movement and target muscles are clear and the quality resembles the accepted demos. This supersedes the previous Lottie-only format restriction; it does not authorize a package purchase or automatically approve new native dependencies. Keep existing images and offline local assets.

Downloaded the public [Vital Animations Free Pack](https://vitalanimations.com/free-pack), 284,164,517 bytes, via its ordinary free-download control. Archive contains 50 gym MP4s with JSON metadata plus 11 character sample MP4s (two duplicate gym samples). The 50 gym entries are mostly equipment exercises; the few `body weight` metadata labels include rope/weighted-plate movements and do not establish equipment-free matches. The archive's character samples were decoded and reviewed locally at four cycle points. Home sample `0353` matches Pike Push-Up, 1080×1080, 3.203991 seconds, with red shoulder/upper-arm highlights. The original is retained in `tools/animations/video-source/pike-push-up-vital.mp4`, with mapping provenance in `video-candidates.json`. Player integration is pending, so app coverage remains 28/119 rather than 29/119. Other samples show an already-covered crunch (`0473`), seated arm sweeps (`0708`), bow pose (`0778`), bent-knee tuck with elevated torso (`0976`), wall-supported donkey kick (`1177`), gym machines (`1245`, `1254`) and face movement (`0925`); none is a verified new catalog mapping.

The provider's canonical GitHub README expressly offers its free pack under the same commercial terms as its paid packages. The current EULA permits offline app storage, technical compression/transcoding and incorporation in apps, while restricting standalone redistribution. The pack is kept as local review input rather than redistributed as an asset library. Native MP4 playback requires the currently unapproved `expo-video` dependency; package approval was requested under the owner's AGENTS.md rule. No package, player code or APK has changed in this preparation pass.

### October 12 — posture candidate review

Reviewed three additional free community assets; none adds a verified matching exercise. [Body-Posture](https://lottiefiles.com/free-animation/body-posture-O0ynLIiUgp) is under the Lottie Simple License; its public original archive was downloaded temporarily and rendered locally at five points of its 240-frame cycle. It shows a partial upper-body character with arm movement, rather than a complete catalog exercise. [Posture Care](https://lottiefiles.com/free-animation/posture-care-eq0rzSnOjs) is a outlined prop-supported forward bend, outside the accepted existing character style and catalog setup. [Posture Care - Yoga](https://lottiefiles.com/free-animation/posture-care-yoga-WHK1QK6q9b) shows an abstract yellow figure obscured by a large blue prop; it does not establish a suitable visible floor/stretch demonstration. No production animation, image, player, dependency or APK was changed. Coverage remains 28/119 exercise IDs, with 91 unresolved. Existing full-check evidence remains unchanged; this was a sourcing/documentation pass.

Reviewed through October 11, 2026. This is a source audit, not an asset licence or a claim of complete exercise coverage. The owner accepts only free ready-made character demos resembling the existing animations. Production now has 28 animated exercise IDs (24 unique sources) out of 119; exact unresolved IDs are in [generated coverage](../tools/animations/coverage.generated.json).

## Owner-supplied resources

| Source | Available formats and appearance | Free assets and product-use restrictions | Integration status |
|---|---|---|---|
| [GymVisual](https://gymvisual.com/) | Anatomical illustrations, GIFs and rendered videos | [Free catalogue](https://gymvisual.com/14-free) has five items, including still images and weighted-crunch media. The free hyperextension video needs prop/form review before any floor-back-extension mapping. [Terms](https://gymvisual.com/content/3-terms-and-conditions-of-use) allow Android/iOS use of purchased licensed non-watermarked media; public previews are not production assets. | No new verified matching Lottie source. GIF/video playback would require a separately scoped format change. |
| [ExerciseAnimatic](https://www.exerciseanimatic.com/free-fitness-exercise-videos) | Rendered exercise videos | Four free samples: AB-wheel rollout, bodyweight squat, 180-degree jump turns and suspension-trainer reverse rollout. Squat is already covered; the others do not match unresolved catalog exercises/props. The [product licence](https://www.exerciseanimatic.com/license) describes purchased content; production rights for free samples are not explicitly established by that page. | No new matching licensed demo imported. Video support is outside the current Lottie-only implementation. |
| [Vector Fitness Exercises](https://vectorfitexercises.com/for-content-creators) | Licensed library offers male/female Lottie JSON and video formats | The 305-video free content pack explicitly excludes mobile/web apps, including free apps. Licensed product files require a commercial licence. The free designer pack is for prototypes, not published products. | Closest technical fit to the current local Lottie player. Actual coverage, character style, licence tier and price require verification before selecting a paid pack. No purchase authorised or made. |
| [MoveKit](https://movekit.com/free-sample) | MP4; faceless grey anatomical model. JSON/CSV contain metadata, not Lottie animations. | Two free samples explicitly permit app use: Pull Ups and Dumbbell Chest Fly. Neither matches this no-equipment catalog. The remaining library is paid. [Full terms](https://movekit.com/license) restrict raw-file redistribution. | No samples imported. Different character style and video format require owner scope approval. |

## Further community search

- Added [Plank by Blinix Solutions](https://lottiefiles.com/free-animation/plank-667YC6ODte): Simple License, genuine 0–15 entry into an aligned forearm hold, followed by a static held pose. Playback enters once and stays held.
- Added [Flutter Kicks by Blinix Solutions](https://lottiefiles.com/free-animation/flutter-kicks-yEimZJq9dF): Simple License, supine alternating straight-leg kicks; opposite thigh rotations verified in source keyframes. Original character and mat retained.
- Reviewed [Workout girl by Fede Biagioli](https://lottiefiles.com/free-animation/workout-girl-hmJb2ozwfq): bent-knee leg movement with static torso, not the catalog's bicycle crunch with opposite elbow/knee action or reverse pelvic curl. Candidate file remains temporary; not imported.
- Reviewed [Exercise animation by Rishi Kesavan](https://lottiefiles.com/free-animation/exercise-animation-PZIfFABSaQ): weighted kettlebell squat, incompatible with the no-equipment sumo squat. Not imported.
- Reviewed [fitness by SIMPOOLI](https://lottiefiles.com/free-animation/fitness-7BSj7bJL6b): decorative arm/dumbbell illustration, not a whole-body exercise demonstration. Not imported.

- [Mountain Climber by Dima Oris](https://lottiefiles.com/animation/mountain-climber-exercise-animation_5117103): explicitly marked Premium Animation, powered by IconScout. Its presence under a Free Animations breadcrumb does not establish a free download entitlement.
- [Arm Circles by Letsdo Motion](https://lottiefiles.com/animation/arm-circles-exercise-10136183): premium, with an Unlock Premium Animations control.
- [Glute Bridge by Zubia Naseer](https://lottiefiles.com/animation/man-doing-glute-bridge-exercise-animation_12426839): premium. Exact form and source files have not been approved for import.
- Bird-dog search results include actual animal animations and premium exercise animations. No new free matching exercise asset was verified in this pass.
- [Body-Posture](https://lottiefiles.com/free-animation/body-posture-0F9HLOx25m) advertises the Simple License, but the inspected preview did not establish a matching movement and approved character style. Not imported.
- [Vector Fitness barbell hip-thrust sample](https://lottiefiles.com/free-animation/barbell-hip-thrust-exercise-for-glutes-Umin2UVmtk) explicitly requires a commercial licence in its description and uses equipment. The generic Simple License label is insufficient to disregard the source restriction.
- [FitMainCharacter](https://github.com/SimonSchubert/FitMainCharacter): inspected repository inventory contains static exercise vector drawables and audio; no ready-made Lottie exercise library was found. README requests for future animation contributions are not delivered assets.


## October 11 continuation audit

- Added [High Knees Workout by Bashir Ahmad](https://lottiefiles.com/free-animation/high-knees-workout-Ym8kDozRNe), freely licensed with Simple License. Original frames 0/7/15/22 and opposite thigh keyframes establish alternating knee lifts and arm movement. Source archive and JSON are preserved; 21/119 demos now bundled.
- [Exercise by Ajay Gupta](https://lottiefiles.com/free-animation/exercise-1gT4OIyvhf): rotates from forearm plank to a side position, unlike a repeated hold or quadruped thoracic rotation. The full looping source was initially excluded; the later reviewed first-entry segment is now used for Side Plank, stopping at frame 35.
- [Side Hip Abduction](https://lottiefiles.com/free-animation/side-hip-abduction-DO2MOCww5r): side-lying leg raises; the current 119-exercise catalog has no matching entry. Not imported.
- [Warmup Exercise by Brian Karungani](https://lottiefiles.com/free-animation/warmup-exercise-OSUvmoX6Pg): another marching knee-lift demo; existing marching entries are already covered. Not reused for unrelated IDs.
- [Man with beard doing sit up](https://lottiefiles.com/free-animation/man-with-beard-doing-sit-up-FBsdwsgSn3): downloaded JSON is byte-for-byte equivalent in parsed content to the existing standing-squat source, not a new sit-up. Not duplicated.
- [Boxing by Aleksandr](https://lottiefiles.com/free-animation/boxing-mw9IrI4KqQ): enters a defensive stance rather than demonstrating repeated shadow-boxing punches. Not imported.
- Additional Bird Dog, Glute Bridge and Superman exercise search results are premium or unrelated animals/superheroes; no new free matching files verified. This does not establish that matching assets are unavailable elsewhere.

## Further October 11 mappings

Push-Up Hold uses the existing licensed Military Push Ups source frames 2–10, reviewed at frames 2/10/18/25 using the official SVG renderer. The selected endpoint has shallow elbow flexion; playback stops there instead of repeating a push-up. Plank Walkout uses the existing Inchworm source, matching the same hand-walk-to-plank-and-return instructions. These add two covered IDs without claiming new unique source assets. Current coverage is 23/119 (21 unique sources), with 96 remaining. Further stretching searches returned icon/decorative/premium results without a verified new match.

## October 11 batch-source review

- Added [Yoga neck exercise by Indrum](https://lottiefiles.com/free-animation/yoga-neck-exercise-fzL9sEfD8L), Simple License. Original frames 0/60/120 show gentle opposing head tilts; the first tilt plays once and holds at frame 60 for Neck Side Stretch. It is not mapped to Neck Rolls. Original scene and character remain; no geometry or motion authored.
- Added Side Plank from the previously inspected [Exercise by Ajay Gupta](https://lottiefiles.com/free-animation/exercise-1gT4OIyvhf). Frames 1/35/65/100/140 show forearm plank and alternating side positions. The first entry stops at frame 35 in an aligned side forearm hold; the full rotating loop remains unsuitable for a hold. Reviewed viewport retains the raised hand, feet and mat; native form confirmation remains pending.
- Shadow Boxing reuses the original licensed Dinh Punches source: frames 0/6/12/18 show a staggered stance, alternating forward punches and return to guard, matching the catalog instructions. This is another covered ID, not a new unique asset.
- [Lightcode body exercise](https://lottiefiles.com/free-animation/body-exercise-animation-animation-BPOvgqMapf): kettlebell squat; not mapped to no-equipment Sumo Squat.
- [Back Excercise by Sanket Birajdar](https://lottiefiles.com/free-animation/back-excercise-gjCCOO2dKZ): dumbbell row; incompatible with no-equipment back entries.
- [Exercises by Gil Romeu](https://lottiefiles.com/free-animation/exercises-ihk3n9Zh51) and [exercise by Lena](https://lottiefiles.com/free-animation/exercise-PqoclKEmdt): weighted barbell squat; not imported.
- [fitness by Umut](https://lottiefiles.com/free-animation/fitness-BRi61sTHTF) is a progress icon; [fitness by Varun](https://lottiefiles.com/free-animation/fitness-xiFx7kBE2n) is a phone mascot with dumbbells. Neither is a matching human exercise demo.
- [exercise in office by Kumar](https://lottiefiles.com/free-animation/exercise-in-office-coQDCEOqLW): seated side bend, no matching catalog exercise.
- [ejercicio by Kevin](https://lottiefiles.com/free-animation/ejercicio-dwfph50bAQ): gym-ball crunch; wrong props.
- [Walking Crab by Bashir](https://lottiefiles.com/free-animation/walking-crab-gNWUZiD83o): despite exercise-description text, the visible preview is a crab animal. Not mapped to Crab Walk.
- [Downward Dog by Matt Landeg](https://lottiefiles.com/free-animation/downward-dog-mLmAXyq4oU): sketch line-art icon, unlike the approved character demos. Not imported.
- [Lunges by saagar](https://lottiefiles.com/free-animation/lunges-EYqhjdyntw): original raster/vector transforms reviewed at frames 0/16/33/50/66; steps into a forward lunge and returns to standing. Forward Lunge is covered; do not assign it to stationary Split Squat or Reverse Lunge.
- [Workout by April](https://lottiefiles.com/free-animation/workout-SiMlBjfL1U): public preview remains blank; source contains Kalrito Dumbbell compositions. No matching approved no-equipment demo established. Not imported.

Current coverage is 26/119 IDs, 23 unique sources, with 93 unresolved. Remaining IDs are grouped into ten-item acquisition batches in ANIMATION_COVERAGE. Those groups are pending, not completed or proof that free matching assets do not exist anywhere. New searches for core, pushing/shoulders, back, lower body, crawling/cardio and stretching families did not establish a complete free Lottie library. No paid files, previews of paid products, custom motions or videos were substituted.

## Next input and acceptance checks

### Additional continuation search

- Glute Bridge and Seated Hamstring Stretch results were checked again: the specific matching character assets returned by LottieFiles are explicitly Premium Animation / Powered by IconScout. No production files were acquired from these listings.
- [Flow Exercise Dataset](https://github.com/ozansozuozgit/flow-exercise-dataset/blob/main/NOTICE.md) exposes three-frame custom SVG illustrations rather than matching ready-made Lottie character demos. Its notice also records incomplete generation provenance and unverified movement variants. Not imported under the owner's existing-style-only requirement.
- [Exercise by qtxs](https://lottiefiles.com/free-animation/exercise-UCPyDBiSGR) has Simple License permission, but original frames 0/30 show a biceps/dumbbell icon with moving droplets, not a full human exercise demo. Reviewed locally; not imported.
- Further Calf Raises, Heel Digs, Cat Cow and Bird Dog searches did not establish another accepted free character file. Search-category result counts mix unrelated and premium items; they do not establish coverage.

The owner explicitly selected free licensed Lottie assets. The previous free-versus-paid question is resolved; no paid-pack evaluation or purchase is needed. Continue finding matching ready-made community demos. No runtime network integration, custom character authoring or APK build is part of this change.

For each candidate: verify production app-use permission, inspect movement against the existing instructions and required props, verify the accepted character style, retain original files and attribution, then add through the existing catalog/build pipeline. Preserve all original exercise images. Downloaded preview media must not be repackaged as licensed product files. Never assign a generic movement to unrelated exercise IDs.

## Revision history

| Version | Date | Changes |
|---|---|---|
| 1.0 | October 5, 2026 | Owner resource audit and further community search; no additional production assets verified |
| 1.1 | October 5, 2026 | Resolve free-only preference and record two added licensed character demos and further exclusions |

## October 11 next animation pass

- Added Standing Forward Fold from the existing licensed [Inchworm](https://lottiefiles.com/free-animation/inchworm-oMKbWGAaDD) source. Full cycle and frames 0/24/30/34/39 reviewed; stop the initial standing hip hinge at frame 24 before hand walking. The catalog prescribes a comfortable held forward fold with no bounce. Original source motion/geometry are retained. This adds an exercise mapping, not a new unique source.
- [Yoga by Arjun patidar](https://lottiefiles.com/free-animation/yoga-vUt2O8R03P): Simple License, but original frames 0/30 show tree pose with animated decorative foliage. No tree-pose exercise exists in this catalog. Not imported.
- Full Burpee and Jump original frames 0–165 reviewed: includes a push-up and jump. Not assigned to Half Burpee or Squat Thrust; truncation would not produce their complete movement.
- Additional core/leg/push/stretch searches returned already reviewed sources, premium entries and unrelated icons without another accepted mapping. The in-app browser binding was unavailable; public detail-page license and download links were inspected with web tools, and downloaded free candidate files were reviewed using the local official Lottie SVG renderer. No paid assets acquired.

Current production coverage: 27/119 IDs, 23 unique sources, 92 unresolved. Further acquisition is still needed to meet all-exercise coverage.

## October 11 further acquisition pass

- New candidate: [Russian Twists](https://lottiefiles.com/free-animation/russian-twists-rx3c7eZtwE). The public detail page specifies the Lottie Simple License and a 101.8 KB original JSON / 17.4 KB dotLottie; no creator name is displayed. This establishes a source candidate, not a matching movement. The app instructions require supported feet and controlled seated rib rotation. Neither movement, props nor style has been verified yet.
- The available in-app browser (new ID 4 after the old binding became unavailable) was used to open this specific source. It remained on Cloudflare's automatic security-verification page; no download URL or animation was available through the visible UI. No CAPTCHA was solved, protection bypassed, or asset URL guessed. Leave this candidate unassigned until the original file and movement can be inspected.
- Specific knee-push-up results by Letsdo Motion and Muhammad Noor Ridho are explicitly premium. Calf Raise by VFE and Wall Push Up listings expose premium JSON and free watermarked video previews on IconScout; those previews were not acquired as production files. Additional torso-twist, superman and lateral-lunge queries did not verify another free matching character demo.
- No production assets, application code, image mappings or dependencies changed in this acquisition pass. Coverage remains 27/119 IDs, 23 unique sources, 92 unresolved. The last completed code validation remains 335 passing tests/72 suites, typecheck/lint, production Android JS export and release preflight. No APK built.

## Russian Twist source access recovered

The next normal browser navigation reached the public Russian Twists page after a navigation timeout; binding its returned tab showed the actual page. No CAPTCHA interaction or security bypass was used. The visible Edit with AI link disclosed the original download URL: https://assets-v2.lottiefiles.com/a/5fa0c1c4-1169-11ee-8227-23e1469e994e/t39hniOp4K.lottie. The public profile link identifies a848f9e4-c9cb-4e84-a292-f41412968458; that profile returns 404, so attribution remains honestly unnamed.

Original frames 0/25/50/75/99 inspected locally: seated bent-knee male with legs/hips fixed and changing torso/arm paths, no weights or leg-lifting animation. Added the original complete 195-frame cycle to ex_russian_twist under the Simple License. Native form and supported-feet interpretation still require device/editorial review; no source movement was altered. The generic download-blocker note above is historical and is resolved for this file. Current coverage 28/119 IDs, 24 unique sources, 91 unresolved.

Further cardio review: the live Butt Kicks search returned 42 mixed results, including premium exercise entries, sports cartoons, already reviewed Squat Kicks/Flutter Kicks and generic fitness icons. [Workout by EK_ Ahlers](https://lottiefiles.com/free-animation/workout-w4HzY7bnGp) was opened directly: the visible preview shows an upright jumping figure with overhead arms (6.9 MB dotLottie / 9.2 MB JSON), without a verified heel-to-glute Butt Kicks demonstration. Not downloaded or assigned. Category counts are not free matching coverage.

### October 13 final-pass revision

Seven further mappings bring current coverage to 116/119; historical counts and batch plans above describe earlier passes. Current remaining IDs: Arm Pulse, Floor Row Isometric, Frog Jump. Review and verification: ANIMATION_FINAL_REVIEW.

### Final revision — all catalog IDs mapped

119/119 exercise IDs are now mapped to bundled demos. Historical unresolved counts above are superseded. Exact source/framing limitations and final passing checks: ANIMATION_FINAL_REVIEW.
