# Reference comparison — October 1, 2026

The owner's latest full-scroll Training/Discover screenshots supersede earlier layout targets for those tabs. Corrected compact challenge/weekly frames, synchronised body-focus columns, recent/goal/duration order, plain recommendation rows, builder preview, goal carousel and Explore. Discover now uses overlaid beginner/challenge captions with proper alpha, an equipment banner that filters actual catalog exercise equipment, and a two-row below-caption Stretch gallery. Equipment copy describes supported household/optional-weight routines. Original transparent art and safe catalog copy are retained: environmental photos, PRO, height-growth and spot-reduction promotions are not reproduced. No installed-build screenshot comparison has been performed for these changes.

All 25 files in `reference-img` were visually inspected in a labelled contact sheet; Training, Discover, challenge list, workout detail and Report were also inspected individually. The current implementation was reviewed screen by screen. This is a **reference/source audit**, not a native pixel-diff result: no Android SDK, adb or connected emulator is available on this machine. Only the owner's supplied screenshots are current native app evidence.

## Corrections made in this pass

Second UI/source review: workout exercise/related rows now align with the content edge without a second inset; related rows show duration and level. Customize is a secondary footer link instead of a second large CTA immediately under Start. Featured challenge metadata follows time/level, then focus/home location. Rest editing now uses a wheel; Workout Settings opens a nested Default/Custom/enable/wheel/Done sheet. The controlled wheel also resynchronises when Default changes the selected duration. Text-link buttons retain a 48 dp touch target.

- Challenge artwork has a fixed 180 dp region occupying half the card width; title space no longer changes the photo size with description length. Core/calisthenics have distinct upright portraits instead of tiny landscape poses. Title wrapping has a wider column and bounded fitting.
- Shared headers no longer apply a second horizontal inset inside already padded screens/sheets. Banner titles use sentence case and their own scale.
- Training weekly goal is a single white card containing its editable count, dates and coach/message bubble. Dates do not display Report's weekday letters. The challenge carousel leaves a clear next-card preview.
- Workout details have full-width artwork, an overlaid back control, rounded content panel, level/time/exercise metadata and an Introduction heading. Existing start/customize/favorite/exercise links remain connected.
- Core/back category headers frame the upper body at a larger scale; leg/full-body categories retain the full pose.
- Report opens with workout/kcal/minute totals, followed by history calendar/streaks, weight and BMI. Additional period, target, bests and achievement controls remain further down the same tab. Default summary period is total; changing it still updates the totals.
- Settings navigation is grouped into reference-style white rows; profile, reminders, backup and favourites stay in Settings. Workout-specific controls remain in the player's sheet.

## Screen mapping

The six digits below identify `Screenshot_20260923_<time>_Home Workout.jpg.jpeg`. Every row still requires an installed-build screenshot for actual pixel comparison.

| Reference | Area / app destination | Source comparison result |
|---|---|---|
| 131201 | Training, first viewport | Header/search/weekly card/challenge/body focus/quick links reviewed; header and weekly grouping corrected |
| 131212 | Training, full scroll | Recommendation, personalised rows, stretch, goal filters and Explore reviewed; app-only builder/local notes retained |
| 131516 | Challenge list | Filters, gradient cards, art, copy and CTA reviewed; larger portraits and title fit corrected |
| 131609 | Recommended workout list | Thumbnail/title/metadata/card rows and navigation reviewed |
| 131623 | Stretch & warm-up list | Same list primitive, relevant unique covers and bundled workout links reviewed |
| 131652 | Body-focus workout list | Focus filtering, rows and durations reviewed |
| 131730 | Strength workout detail | Full-width hero/back/content panel/metadata/intro/CTA/related rows corrected |
| 131823 | Discover, full scroll | Featured, picks, collection, beginners, fast, challenges, stretch and body-focus placement reviewed; black panels were already removed at the owner's request |
| 131853 | Core category | Dark header/photo/text and compact rows reviewed; larger torso framing corrected |
| 132013 | Workout detail with exercises | Shared detail frame corrected; exercise/related/start actions retained |
| 132037 | Player preparation | Stage/name/countdown/control placement reviewed; static realistic pose replaces animation by prior owner request |
| 132103 | Player running | Timer/previous/pause/next/progress structure reviewed; functional tests cover these controls |
| 132110 | Alternate player view | Shared player stage/control structure reviewed; no multi-view animated asset in this static-image version |
| 132719 | Full exercise guide | Instructions/duration/focus/muscle map/mistakes/breathing/close reviewed; no remote video |
| 132746 | Muscle guide | Anatomical map and primary/secondary muscle data reviewed; static-image/media differences retained |
| 132813 | Compact exercise guide | Exercise image/sections/close reviewed; local guide remains scrollable with safe-area footer |
| 132828 | Player rest | Next exercise, blue rest panel, timer/edit/add/skip reviewed |
| 132845 | Next exercise running | Same stage/timer/control primitives reviewed |
| 132913 | Workout settings sheet | Cue/rest/preparation settings reviewed; reference music player is not implemented as a playlist |
| 135643 | Rest timer sheet | Default/Custom, enable switch, duration wheel and Done implemented; active rest editing also uses the wheel |
| 135700 | Playing queue sheet | No matching local music queue exists in the current build; this is a remaining feature/design difference |
| 135716 | Quit workout overlay | Functional native quit/save/discard dialog exists; reference custom motivational overlay remains a design difference |
| 135757 | Stretch workout detail | Shared full-width detail frame/metadata/introduction/related rows corrected |
| 135844 | Report | Core section order, statistic order and history calendar corrected; weight/BMI and additional controls reviewed |
| 135916 | Weight logging sheet | Date/unit/value/ruler/cancel/save reviewed; validation and persistence remain functional |

## Limits and follow-up

- No main Settings-tab or onboarding reference is included in these 25 images. Those screens use the shared theme/components; an exact reference match cannot be certified for them.
- Original generated cutouts are retained instead of copying reference photography. Ads, PRO/unlock gates, equipment-only offerings and unsupported body-change claims are excluded under the app's existing requirements. Discover's below-image captions follow the owner's explicit request to remove the black half.
- A true final pass needs same-size native captures of all four tabs (including scroll), list/category/workout pages, player prep/running/rest, guide, settings sheets and weight sheet, plus dark mode and large text. Use overlay/diff only after normalising the viewport and excluding phone chrome; tests and Android export do not prove visual parity.
- Local music player/queue and custom quit overlay remain visible differences. They are not marked complete by this pass.
