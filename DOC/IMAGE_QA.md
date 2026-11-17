# Exercise image handoff and QA

| Field | Details |
|---|---|
| Version | 1.3 |
| Last updated | October 1, 2026 |
| Scope | All 119 original realistic static replacements (ADR-060), with archived owner-image findings |
| Result | Technical coverage and initial full-catalog visual review pass; final form/native release approval remains open |

## Technical audit

- 119/119 catalog IDs map to unique bundled images; every mapped file decoded successfully.
- Initial owner-image review: all optimized images were opaque 768 × 1029 JPEGs with zero alpha; payload **8.33 MB**. The intermediate one-cutout pass was **8.71 MB**. Current integration maps 119 original realistic PNG replacements, all with alpha, bounded by 768 × 1024; exercise payload is **11.21 MB**. Owner sources remain preserved.
- Framing separates exercise thumb/guide/player padding, overlay-card title clearance and hero artwork. `contain` preserves complete silhouettes. Five original male/female browse cutouts are separate from exercise instruction media; see [CHARACTER_ASSETS](CHARACTER_ASSETS.md) and [REALISTIC_IMAGE_PROMPTS.json](REALISTIC_IMAGE_PROMPTS.json).
- Run `npm run images:qa` for decoding, metadata and six labelled sheets each on white/blue, plus character previews on blue/dark. Palette PNG compression may quantize solid alpha from 255 to 254; character validation accepts near-opaque alpha ≥250 while requiring real zero-alpha background.
- Contact sheets for this review were saved in the Codex visualization workspace, outside the app source/assets. Reviewed every numbered tile and zoomed suspicious poses individually.
- This is a visual comparison against [IMAGE_PROMPTS](IMAGE_PROMPTS.md). “Reviewed” below means no obvious pose mismatch at contact-sheet scale; it does not mean final anatomical, trainer or phone approval.

## Findings and replacement order

**Current October 1 follow-up:** Generated realistic exercise cutouts from authored instructions with male/female prompt assignments, plus female/pair portraits. Reviewed all 119 tiles on saturated blue and the five character assets on blue/dark. No baked checkerboard backgrounds are visible in these composites. Three generation-batch errors were investigated: wide push-up, floor triceps extension and crab walk files had actually saved and decode correctly; their blue-background poses were inspected. Two new pose issues were corrected and separately reviewed: squat jump shows both feet airborne together, and knee-to-elbow shows a cross-body arm/knee relationship. Same-side knee-to-elbow candidates were rejected and not bundled. Exact native placement, small-phone legibility and trainer approval remain unverified. Android production bundle export and typecheck/lint/302 tests pass.

**Archived owner-JPEG review:** The findings and per-exercise table below describe the superseded original illustrations, not release approval or active defects in the new photographic-style replacements. The original nine P1 and seven P2 rows are retained for review history.

1. **P1 — 9 specific replacements:** wrong/unclear defining pose, required prop absent, duplicate poses, or embedded logo/text. Fix these before final image approval.
2. **P2 — 7 clarity/style improvements:** mid-movement visibility, ambiguous top-down/prone orientation or unnecessary equipment. Ambiguous prone images are flagged for clarification, not asserted to be definitely standing.
3. **Backgrounds:** many images have grey-and-white checkerboards baked into their pixels. Some have clean white/grey backgrounds instead. Renaming a JPEG to PNG cannot create transparency. Use genuinely transparent PNG replacements or one consistent clean opaque background.
4. **Framing/style:** standing poses often fill the portrait canvas while horizontal floor poses occupy a narrow band. At thumbnail/player sizes those floor poses may become small; phone checks remain. Faces, hair, outfit cut, checker size and illustration detail vary. Preserve the approved teal/navy/coral palette when replacing images.
5. The app's `contain` mode preserves the whole asset, but the image audit cannot establish real-device small-screen legibility, light/dark blending or the final AAB budget.
6. Compared the guide/player reference screenshots `…132719…` and `…132103…`: their light stages keep the pose visually clear. The current baked checkerboards create a busier stage, so background replacement is needed for that design direction. Reference video, branding and watermark are not assets to copy.

## Archived owner-image per-exercise review

All rows inherit the background/framing review above. P1/P2 notes describe additional issues. The other 103 images have no obvious pose mismatch in this visual pass, with phone and final form checks still pending.

| # | Exercise ID | Visual result | Finding |
|---:|---|---|---|
| 1 | `ex_march_in_place` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 2 | `ex_arm_circles` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 3 | `ex_shoulder_rolls` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 4 | `ex_hip_circles` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 5 | `ex_leg_swings_front` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 6 | `ex_leg_swings_side` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 7 | `ex_torso_twist` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 8 | `ex_neck_rolls` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 9 | `ex_cat_cow` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 10 | `ex_inchworm_walkout` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 11 | `ex_crunch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 12 | `ex_reverse_crunch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 13 | `ex_bicycle_crunch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 14 | `ex_sit_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 15 | `ex_leg_raise` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 16 | `ex_flutter_kick` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 17 | `ex_scissor_kick` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 18 | `ex_heel_touch` | P1 | Standing/reaching toward thigh; prompt requires supine heel touch. |
| 19 | `ex_russian_twist` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 20 | `ex_forearm_plank` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 21 | `ex_side_plank_each_side` | P1 | Two athletes/poses in one image; replace with one clear side-plank hold. |
| 22 | `ex_plank_shoulder_tap` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 23 | `ex_dead_bug` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 24 | `ex_hollow_hold` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 25 | `ex_mountain_climber` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 26 | `ex_v_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 27 | `ex_toe_touch_crunch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 28 | `ex_cross_touch_and_reach` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 29 | `ex_standing_oblique_crunch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 30 | `ex_wall_push_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 31 | `ex_incline_push_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 32 | `ex_knee_push_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 33 | `ex_standard_push_up` | P2 | Top position is recognizable, but approved prompt requests bent elbows at mid push-up. |
| 34 | `ex_wide_push_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 35 | `ex_diamond_push_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 36 | `ex_decline_push_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 37 | `ex_archer_push_up` | P1 | Extended arm is lifted away from the floor; does not show the supported low archer position. |
| 38 | `ex_push_up_hold` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 39 | `ex_plank_to_push_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 40 | `ex_chest_squeeze_isometric` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 41 | `ex_shoulder_tap_push_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 42 | `ex_pike_push_up` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 43 | `ex_wall_angel` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 44 | `ex_triceps_dip_chair_floor` | P2 | Straight-arm top position; bent-elbow dip would communicate the intended pose more clearly. |
| 45 | `ex_floor_triceps_extension` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 46 | `ex_front_raise` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 47 | `ex_lateral_raise` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 48 | `ex_overhead_press_isometric` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 49 | `ex_plank_up_down` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 50 | `ex_bear_hold` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 51 | `ex_wall_handstand_hold` | P1 | Required wall and heel contact are absent; currently reads as an unsupported handstand. |
| 52 | `ex_punches` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 53 | `ex_arm_pulse` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 54 | `ex_superman_hold` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 55 | `ex_superman_raise` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 56 | `ex_reverse_snow_angel` | P2 | Rear/top-view orientation is ambiguous and outfit differs; make prone floor contact explicit. |
| 57 | `ex_prone_y_raise` | P2 | Could be read as standing/tilted; make the top-down prone position and floor contact clearer. |
| 58 | `ex_prone_t_raise` | P2 | Could be read as standing against a surface; make top-down prone floor contact clearer. |
| 59 | `ex_prone_w_raise` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 60 | `ex_swimmer` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 61 | `ex_bird_dog` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 62 | `ex_floor_row_isometric` | P2 | Looks bridge-like; clarify elbow contact and slight chest lift against the approved prompt. |
| 63 | `ex_back_extension` | P1 | Embedded logo and “SUPERMAN HOLD” label violate the no-text rule and name a different exercise. |
| 64 | `ex_bodyweight_squat` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 65 | `ex_sumo_squat` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 66 | `ex_squat_pulse` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 67 | `ex_wall_sit` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 68 | `ex_forward_lunge` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 69 | `ex_reverse_lunge` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 70 | `ex_lateral_lunge` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 71 | `ex_curtsy_lunge` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 72 | `ex_split_squat` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 73 | `ex_glute_bridge` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 74 | `ex_single_leg_glute_bridge` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 75 | `ex_floor_hip_thrust` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 76 | `ex_donkey_kick` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 77 | `ex_fire_hydrant` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 78 | `ex_calf_raise` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 79 | `ex_single_leg_calf_raise` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 80 | `ex_good_morning` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 81 | `ex_step_up_chair` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 82 | `ex_half_burpee_no_jump` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 83 | `ex_burpee` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 84 | `ex_squat_thrust` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 85 | `ex_bear_crawl` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 86 | `ex_crab_walk` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 87 | `ex_squat_to_overhead_reach` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 88 | `ex_get_up_floor_to_stand` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 89 | `ex_plank_jack` | P1 | Bent-knee wide crouch with hands down; prompt requires high plank with straight legs spread. |
| 90 | `ex_plank_walkout` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 91 | `ex_frog_jump` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 92 | `ex_jumping_jack` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 93 | `ex_step_jack` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 94 | `ex_high_knees` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 95 | `ex_marching_high_knees` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 96 | `ex_butt_kicks` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 97 | `ex_heel_digs` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 98 | `ex_skater_hop` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 99 | `ex_lateral_step` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 100 | `ex_squat_jump` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 101 | `ex_fast_feet` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 102 | `ex_shadow_boxing` | P2 | Extra boxing gloves conflict with the shared no-extra-equipment prompt; bare fists preferred. |
| 103 | `ex_standing_knee_to_elbow` | P1 | Raised knee is not meeting the opposite elbow; image reads as a high-knee pose. |
| 104 | `ex_childs_pose` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 105 | `ex_cobra_stretch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 106 | `ex_downward_dog` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 107 | `ex_seated_forward_fold` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 108 | `ex_standing_forward_fold` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 109 | `ex_hamstring_stretch_each_leg` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 110 | `ex_quad_stretch_each_leg` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 111 | `ex_hip_flexor_stretch_each_side` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 112 | `ex_figure_4_glute_stretch` | P1 | Shows a knee hug; the ankle-over-opposite-knee figure-four crossing is absent. |
| 113 | `ex_butterfly_stretch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 114 | `ex_chest_doorway_stretch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 115 | `ex_triceps_stretch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 116 | `ex_neck_side_stretch` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 117 | `ex_thoracic_rotation` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 118 | `ex_knee_to_chest` | Reviewed | No obvious pose mismatch at contact-sheet scale. |
| 119 | `ex_lying_spinal_twist` | P1 | Upright bent-knee pose; prompt requires lying on back with knees dropped to one side. |

## Replacing an image

Save an approved transparent replacement as `assets/images/exercises/realistic/<exercise-id>.png`. The builder prefers this directory, then `cutouts/`, then canonical/timestamped owner sources, and keeps PNG alpha. Use the authored pose instruction and realistic prompt catalog. Keep the whole body and required prop visible; one pose, no text/logo or checkerboard pixels.

Run `npm run images:build`, `npm run images:qa` and `npm run check`; inspect guide/player/thumbnail views in light and dark themes on Android. Keep originals until replacement QA is complete. Native reference fit and trainer/form approval remain separate gates.

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 30, 2026 | Recorded handoff, local integration, sampled findings and replacement steps |
| 1.1 | Oct 1, 2026 | Decoded all 119 mapped assets, reviewed all contact-sheet tiles, zoomed suspicious poses, recorded nine P1 replacements and seven P2 improvements with per-ID review status |
| 1.2 | Oct 1, 2026 | Initial transparent squat and male browse framing follow-up |
| 1.3 | Oct 1, 2026 | Original realistic male/female catalog, white/blue review, five character previews and archived owner-image findings; final form/native approval remains |
