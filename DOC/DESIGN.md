# 🎨 Design System

October 2 challenge-card spacing: card bodies use natural content height instead of flex expansion; each carousel card aligns to its own height. This keeps the CTA directly below its copy with token-based padding, avoiding the large blank middle caused by taller neighbouring cards. Existing character/title placement is retained per owner clarification.

October 2 startup refinement: on cold launch, native splash hands off to a branded page with a 160 dp character logo, app name/tagline and accessible progress line. Keep this page visible for at least 1.2 seconds after layout, and longer if fonts/database are still preparing. Continue to the existing onboarding/home route only after readiness and progress completion. Reduce Motion displays progress without animation. Installed Android startup visual QA remains pending.

October 1 onboarding refinement uses the established white/plain pages, blue CTA and selected-card tint, branded paired-character welcome, top Back/progress controls, fixed safe-area footer and structured review. Supplied references contain no onboarding captures. Owner-requested workout-detail recommendations now use blue/purple/slate gradient cards; this explicitly supersedes their earlier plain-row treatment.

Latest owner full-scroll targets take precedence over earlier screenshots: Training uses a dates-only weekly card (no coach bubble), 260 dp compact challenge variant, body-focus columns with a next-column peek and synchronised chip/swipe selection, recent/goal links above duration links and compact plain recommendation rows. Builder previews keep the create promotion and route to the full saved-workout screen; goal results remain grouped by the selected goal. Discover places titles over a transparent-to-dark gradient on beginner/challenge artwork, inserts functional equipment browsing before Stretch and reserves below-image captions for Stretch. Featured artwork spans the banner; Explore is 104 dp with a trailing pill. Existing distinct original cutouts remain, so photo backgrounds differ from the target. Main sections/actions are wired; native pixel parity is unverified.

Second UI recheck: detail exercise/related rows share the content edge; related rows include duration/level and Customize is a secondary footer link. Featured challenge tiles follow time/level, then focus/home. Rest settings use the existing three-row wheel within a Default/Custom/enable/Done sheet; selecting Default resets wheel position as well as value. Link buttons have a 48 dp touch region. Native pixel verification remains pending.

Reference comparison addendum: see [REFERENCE_AUDIT](REFERENCE_AUDIT.md) for all 25 screens and remaining differences. Challenge portrait frames use a fixed 180 dp height/50% width, a wider fitted title column and dedicated 24/28 title typography; core/calisthenics assets now have upright framing. Banners use sentence-case 22/28 typography. Screen/sheet padding owns horizontal header insets. Training weekly goal is grouped in one card. Workout details use full-width hero plus floating back/rounded content; Report's core order is totals → history calendar → weight → BMI. Settings shortcuts use grouped rows. Native pixel parity is not yet verified.

October 1 implementation addendum: categories use dedicated, opaque transparent-cutout artwork beside reserved text space; every workout detail has a contain-fit top photo. Challenge art is unique per plan. Discover image cards show captions below the photo, with no black caption panel. SVG alpha gradients split RGB and stop opacity for Android. Onboarding uses portrait selection, full-width radio choices, step progress and a scrollable body above a safe-area action footer. Startup bridges native splash to branded font/database progress without an artificial multi-second wait. Native/reference QA remains pending.

### Home Workout – Bold, Clear, Motivating

This document defines the visual design system for Home Workout: colours, typography, components, layout, motion and accessibility. The look **follows the reference app** in `reference-img/` (layout, colour and component patterns). Every colour marked **Ref** was measured directly from those screenshots. All names, copy, illustrations and icons are original, and colours were adjusted only where needed to meet WCAG AA contrast.

| Field | Details |
|---|---|
| **Version** | 1.5 |
| **Last updated** | October 1, 2026 |
| **Status** | Draft – colour adjustments (ADR-027) and font choice (ADR-026) are proposed |
| **Related** | [PRD](PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [RULES](RULES.md) · [DECISIONS](DECISIONS.md) |

---

## 1. Design Principles

> **Current exercise-media override (Sep 29, 2026, ADR-056):** Use one locally bundled, full-colour static pose image per exercise. Character palettes, motion arcs and animation-stage requirements below remain historical proposals while animation work is paused. Keep the whole demonstrated body visible at both thumbnail and player sizes. The original side-plank illustration is a style study, not final catalog approval.

**Artwork framing (Oct 1):** Exercise thumbnails, guides and player stages contain the complete pose with separate padding tokens. Browse overlay cards reserve bottom space for titles. Challenge artwork occupies the top-right 44% width / 48% height, leaving a 56% title column; banners reserve a right-side artwork slot. Original male photographic cutouts provide browse/hero art, while exercise instructions retain their own pose images. Transparent assets are trimmed to their silhouette in the build; opaque assets are never cropped. See [CHARACTER_ASSETS](CHARACTER_ASSETS.md). Native screenshot comparison remains pending.

**Inclusive realistic direction (Oct 1, ADR-060):** The owner requested both men and women and prefers realistic exercise imagery. Original paired portraits appear on shared challenge/collection cards; other banners vary male/female subjects. Workout covers select a pose actually present in the workout and relevant to its muscle focus. Discover uses white/plain rows below its coloured banners, full-width category heroes with compact divided lists, body-focus silhouettes and bottom-only photo-title scrims. Exercise cutouts use `contain`; palette PNG optimization preserves their alpha. Exact native sizing, form and small-screen clarity still require QA.

| Principle | What it means in practice |
|---|---|
| 💪 **Motivating** | Bold uppercase headlines, vivid gradients and visible progress everywhere: streak flame, weekly ticks, rings, badges. |
| 🍃 **Simple & Clear** | One primary action per screen, big touch targets, plain language, secondary actions in bottom sheets. |
| ⚙️ **Consistent** | One token set and one component library. The same patterns repeat on every screen ("Title + More >", list rows, sheets). |
| ⭐ **Accessible** | WCAG 2.2 AA contrast, TalkBack labels, 48 dp touch targets, font scaling, Reduce Motion support. |
| 📱 **Workout-first** | Readable at arm's length during exercise: huge timers, high contrast, minimal chrome in the player. |

---

## 2. Color Palette

**Source column:** **Ref** = measured from the reference screenshots · **AA** = reference hue adjusted to pass WCAG AA · **New** = original colour in the same style.

### 2.1 Brand

| Token | Hex | Usage | Source |
|---|---|---|---|
| `primary` | `#004BFF` | Links, active tab, selected chips, bolts, icons, guide headings, checks, small buttons | Ref |
| `primaryPressed` | `#003BCC` | Pressed state of primary elements | New |
| `primarySoft` | `#E9EDF8` | Selected chip background | Ref |
| `primaryTint` | `#E7EEFF` | Numbered badges, soft highlights | Ref |
| `primaryBorderSoft` | `#CCDBFF` | "Today" ring in the week strip | Ref |
| `ringProgress` | `#0074FF` | Prep countdown ring | Ref |
| `restBg` | `#005DFF` | Full-bleed rest panel | Ref |
| `flame` | `#FF4762` | Streak flame | Ref |
| `tagBg` / `tagText` | `#FEF0D3` / `#22140C` | "CUSTOMIZED FOR YOU" tag | Ref |
| `statIcon` | `#98B7FF` | Duotone accent in report stat icons | Ref |
| `onPrimarySoft` | `rgba(255,255,255,0.2)` | See-through white pills on gradient cards (Home) | New |

**Brand gradients**

| Token | Stops | Angle | Usage | Source |
|---|---|---|---|---|
| `gradient.cta` | `#12DDFE` → `#014CFF` | 90° (left → right) | **Start** buttons on workout details | Ref |
| `gradient.button` | `#0071FE` → `#004DFF` | 90° | Done, Save, Keep exercising, Close | Ref |
| `gradient.create` | `#0092FF` → `#0551FF` | 135° | "CREATE YOUR OWN" card | Ref |
| `gradient.finish` | `#EFF3FF` → `#EBF1FF` | 180° (top → bottom) | Quit and finish screens | Ref |
| `gradient.darkTile` | `#2E3548` → `#2D3245` | 135° | Discover body-focus tiles | Ref |

### 2.2 Neutrals (light theme)

| Token | Hex | Usage | Source |
|---|---|---|---|
| `bg.page` | `#F8F8F8` | Tab screens (Training, Discover, Report, Settings) | Ref |
| `bg.plain` | `#FFFFFF` | Stack screens (lists, details) | Ref |
| `surface.default` | `#FFFFFF` | Cards, sheets, tab bar | Ref |
| `surface.muted` | `#EFF0F2` | Chips, search bar, quick filters, segmented controls | Ref |
| `surface.row` | `#F7F7F9` | List-row cards, settings sheet background | Ref |
| `surface.bubble` | `#F0F0F0` | Coach message bubble, placeholder circles | Ref |
| `surface.picker` | `#F3F4F6` | Selected row in wheel pickers | Ref |
| `surface.stage` | `#FAFAFA` | Player animation area | Ref |
| `text.primary` | `#000000` | Titles, list titles, numbers | Ref |
| `text.strong` | `#1D2025` | Section headings, settings rows | Ref |
| `text.body` | `#3F3F3F` | Long text (instructions, mistakes) | Ref |
| `text.subtle` | `#575E6E` | Workout introductions | Ref |
| `text.secondary` | `#6B6B6B` | Meta text ("16 mins · 16 exercises"), labels, unselected chips | AA (Ref `#878787` = 3.6:1 ✗) |
| `text.tertiary` | `#949494` | Future dates, disabled or decorative text only | AA (Ref `#989898`) |
| `line.divider` | `#E2E2E2` | Dividers, hairlines | Ref |
| `line.grid` | `#E8E9EB` | Chart grid lines | Ref |
| `line.rulerTick` | `#CCCCCE` | Weight ruler ticks | Ref |
| `line.ringTrack` | `#EEEEEE` | Ring and progress tracks | Ref |
| `boltOff` | `#DFDFDF` | Inactive difficulty bolt (decorative; the row has an accessibility label) | Ref |
| `control.bg` | `#F4F4F4` | Prev/next player buttons | Ref |
| `control.bgStrong` | `#EEEEEE` | Pause button track | Ref |
| `control.iconButton` | `#F1F1F1` | Round icon buttons on the player stage | Ref |
| `control.secondary` | `#F6F6F6` | Secondary buttons (Cancel) | Ref |
| `control.secondaryTinted` | `#E2E6F2` | Secondary buttons on tinted backgrounds (Restart) | Ref |
| `control.close` | `#E5E5E5` | Close (×) circle, with a `#3F3F3F` icon | AA (Ref `#CCCCCC` with a white ×) |
| `control.restAction` | `#3370FF` | "+20s" button on the rest panel | Ref |
| `control.restPill` | `#266CFF` | "Edit Rest Time" pill | Ref |
| `overlay.scrim` | `rgba(0,0,0,0.60)` | Behind bottom sheets and dialogs | Ref (measured 60%) |

### 2.3 Semantic

| Token | Fill | Text on light | Text on dark |
|---|---|---|---|
| `success` | `#12B76A` | `#0D864E` | `#12B76A` |
| `warning` | `#F79009` | `#AE6506` | `#F79009` |
| `error` | `#F04438` | `#D92D20` | `#F04438` |
| `info` | `#004BFF` | `#004BFF` | `#6E9BFF` |

### 2.4 Difficulty Levels

| Level | Light | Dark | Source |
|---|---|---|---|
| Beginner | `#004BFF` | `#6E9BFF` | Ref |
| Intermediate | `#BE5901` | `#FF9A4D` | AA (Ref `#FE8012` = 2.5:1 ✗) |
| Advanced | `#DB3931` | `#FF6B64` | AA (Ref `#DD433C` = 4.25:1 ✗) |

Difficulty bolts: 3 × `zap` icons. Filled bolts use `primary`, empty bolts use `boltOff`.

### 2.5 Challenge & Artwork Gradients

Every card gradient runs at **135°** (top-left → bottom-right). The **start** colour (text side) has ≥ 4.5:1 contrast with white, and the **end** colour (artwork side) has ≥ 3:1. Card text stays in the left 60% of the card.

| Token | Start → End | Challenge (content catalog) | Source |
|---|---|---|---|
| `blue` | `#016EF9` → `#004DFF` | Full Body Challenge | Ref (AA) |
| `orange` | `#CD4D07` → `#F8681A` | Lose Weight Challenge | Ref hue (AA) |
| `cyan` | `#017CC0` → `#019BF0` | Lower Body Challenge | Ref hue (AA) |
| `purple` | `#8F36CE` → `#6819A1` | Core & Six Pack Challenge | Ref |
| `violet` | `#6D4AFF` → `#4B2BD1` | Calisthenics Plan | New |
| `slate` | `#2E5579` → `#305277` | Upper Body Challenge | Ref |
| `green` | `#328374` → `#3C9F8C` | Beginner Start Challenge | Ref hue (AA) |
| `teal` | `#01838C` → `#01A4B0` | Plank Challenge | Ref hue (AA) |
| `red` | `#E12D33` → `#E5484D` | Push-Up Challenge | New |
| `amber` | `#A86700` → `#D38200` | Squat Challenge | New |
| `mint` | `#208755` → `#28A86A` | Flexibility & Mobility Challenge | New |
| `indigo` | `#3D317A` → `#3B2E74` | Posture & Stand Tall Challenge | Ref |

**Workout artwork by body focus** (generated thumbnails and heroes use the same gradients):

| Body focus / type | Gradient |
|---|---|
| Abs | `blue` |
| Chest | `slate` |
| Arm | `violet` |
| Shoulder | `indigo` |
| Back | `teal` |
| Leg | `cyan` |
| Butt | `purple` |
| Full body | `orange` |
| HIIT / fat-burn | `red` |
| Quick workouts | `amber` |
| Stretch, warm-up, cool-down | `mint` |
| Keep fit / special | `green` |

### 2.6 BMI Scale (Report tab)

Six segments. Each is a small gradient (lighter → darker), matching the reference.

| Range | Label | Gradient | Source |
|---|---|---|---|
| 15 – 16 | Severely underweight | `#5378E3` → `#2438CA` | Ref |
| 16 – 18.5 | Underweight | `#7EA7F9` → `#3778F6` | Ref |
| 18.5 – 25 | Healthy weight | `#6FDAD2` → `#5BC5DD` | Ref |
| 25 – 30 | Overweight | `#FCE48A` → `#F7CC48` | Ref |
| 30 – 35 | Obese (class I) | `#F5C887` → `#F0983A` | Ref |
| 35 – 40 | Obese (class II+) | `#ED6E83` → `#EA353E` | Ref |

The category label under the value uses text colours (never the light segment colours) so it stays readable.

### 2.7 Character Palette (generated exercise animations)

Every part has **two flat tones**: a base and a shade. The shade is a second flat polygon on the far side of the part (the arm behind the body, the underside of a thigh, the neck below the jaw). This is what makes a flat figure read as three-dimensional; a single fill per part looks like a cardboard cut-out. Measured from the reference: skin base `#FAC3B0` with shade `#EAB099`, and shorts base `#151E27` with shade `#132B37` — on dark clothing the second tone is a *lighter*, bluer highlight rather than a darker shade.

| Part | Variant A base | Variant A shade | Variant B base | Variant B shade |
|---|---|---|---|---|
| Top | `#3A9AD9` | `#2F82B8` | `#E8698A` | `#C9516F` |
| Shorts / leggings | `#1F2530` | `#2A3140` | `#2B2F3A` | `#373C4A` |
| Skin | `#F0B49C` | `#DFA285` | `#E3A98C` | `#D29576` |
| Hair | `#5C5C5C` | `#4A4A4A` | `#3B2A25` | `#2E211D` |
| Shoes | `#5E6166` | `#4E5155` | `#5E6166` | `#4E5155` |
| Floor shadow | `#DBDBDB` | — | `#DBDBDB` | — |

**Status:** ⏳ the shade tones are proposed and await the owner's confirmation. The base tones are accepted.

**Rules**

- **Flat fills only:** no gradients and no outlines. Two flat tones per part is not a gradient.
- **The character has no facial features** — no eyes, nose or mouth. Only a head shape and hair. Confirmed across all 25 reference screenshots. Generators must never add a face.
- Variant A is used for "Male" and "Prefer not to say", Variant B for "Female". Users can switch variants in Settings.

**Motion arc**

A translucent curved arrow drawn **behind** the character, wrapping the joint or body part that moves. It shows the direction of travel in a still frame, which a looping animation alone cannot.

| Property | Value |
|---|---|
| `motionArc.stroke` | `#7FC4E8` at 55% opacity |
| Stroke width | 10 on the 600 × 600 canvas |
| Caps | Round |
| Arrowhead | Solid triangle, 26 long × 22 wide, same colour at full arc opacity, at the leading end |
| Placement | Behind the character, centred on the moving joint; sweep matches the pose delta |
| When to draw | Rotations, swings and reaches where the direction is ambiguous from the key poses alone. Never on holds, planks or symmetrical up-down moves. |

**Stage geometry** (measured from the reference, 1080 × 2400 screen):

| Element | Value |
|---|---|
| Stage height | 42% of screen, background `surface.stage` |
| Character height | 29% of screen, horizontally centred |
| Floor ellipse | `#DBDBDB`, under the feet at the bottom of the stage |
| Canvas | 600 × 600, 30 fps |

---

## 3. Typography

**Font family:** **Poppins** (SIL Open Font License), bundled with the app and loaded with `expo-font`. It is the spec-approved font closest to the reference's geometric style (ADR-026). Weights shipped: 400, 500, 600, 700 and 800. Fallback: system sans-serif.

| Token | Size (sp) | Weight | Line height | Letter spacing | Case | Used for |
|---|---|---|---|---|---|---|
| `displayXL` | 64 | 800 | 72 | 0 | — | Workout timer, prep countdown |
| `metricXL` | 56 | 800 | 64 | 0 | — | Big value in the weight sheet |
| `displayL` | 32 | 800 | 38 | 0.5 | UPPER | "READY TO GO!", "REST", exercise name in the player (auto-shrinks to 28) |
| `h1` | 26 | 700 | 32 | 0 | — | Detail titles, finish message, large sheet titles |
| `cardTitle` | 26 | 800 | 30 | 0.3 | UPPER | Challenge and banner card titles |
| `tabHeader` | 24 | 800 | 30 | 0.5 | UPPER | "HOME WORKOUT", "DISCOVER", "REPORT", "SETTINGS" |
| `h2` | 22 | 700 | 28 | 0 | — | Stack screen titles, sheet titles |
| `h3` | 19 | 700 | 25 | 0 | — | Section headings ("Weekly Goal", "Body Focus") |
| `guideHeading` | 18 | 800 | 24 | 0.3 | UPPER | Exercise guide headings (DURATION, INSTRUCTIONS, …) in `primary` |
| `button` | 18 | 700 | 24 | 0.2 | — | Primary and secondary buttons |
| `statValue` | 28 | 700 | 34 | 0 | — | Report stats, current weight, BMI value |
| `title` | 16 | 600 | 22 | 0 | — | Card titles, settings rows |
| `listTitle` | 17 | 500 | 24 | 0 | — | Generic list rows (regular weight, as in the reference) |
| `body` | 15 | 400 | 22 | 0 | — | Paragraphs, instructions |
| `bodyStrong` | 15 | 600 | 22 | 0 | — | Emphasis, selected chip labels |
| `buttonSm` | 15 | 800 | 20 | 0.5 | UPPER | Card CTA ("START DAY 1"), "GO" |
| `caption` | 13 | 400 | 18 | 0 | — | Meta text, chart labels |
| `captionSm` | 12 | 500 | 16 | 0 | — | Card meta labels ("Daily Time"), tab labels |
| `micro` | 11 | 700 | 14 | 0.6 | UPPER | Tags ("CUSTOMIZED FOR YOU"), "NEXT 2/13" |

**Rules**

- Timers use fixed-width digit layout so numbers never jitter.
- Titles wrap to at most 2 lines, then truncate with an ellipsis.
- Text scales with the system font size. `maxFontSizeMultiplier`: 1.0 for `displayXL`/`metricXL`, 1.2 for `displayL`/`cardTitle`/`tabHeader`, 1.3 for tab labels, unlimited elsewhere. Layouts must work at 200% for body text.

---

## 4. UI Components

All components live in `src/modules/core/ui` (see [ARCHITECTURE](ARCHITECTURE.md) §4) and use tokens only.

### 4.1 Buttons

| Component | Spec | Where |
|---|---|---|
| **Primary CTA** | Height 56, radius pill, `gradient.cta`, label `button` white (≥ 18 sp bold, so the 3:1 large-text rule applies), optional leading `play` icon, full width with 16 dp margins | Start on workout details, sticky Start |
| **Primary** | Height 56, radius pill, `gradient.button`, label `button` white | Done, Save, Keep exercising, Continue, Close |
| **Secondary** | Height 56, radius pill, `control.secondary` (or `control.secondaryTinted` on tinted screens), label `button` in `text.primary` | Cancel, Restart this exercise |
| **Card CTA** | Height 48, white pill, label `buttonSm` in the card's start colour, trailing `circle-arrow-right` in the same colour | "START DAY 1" on challenge cards, "GO" |
| **Small action** | Height 36, radius 12, `primary` fill, label 15/700 white, 20 dp side padding | Log, Edit, Import |
| **Text link** | `primary`, 15/500, trailing `chevron-right` 18 | "More", "View all", "All records", "Tell us what you need" |
| **Plain link** | `text.primary`, 15/500, underlined | "Do it later", "Skip" in onboarding |
| **Icon button** | 40 dp visual, **48 dp hit area**, circle `control.iconButton`, icon 22 `text.strong` | Player top bar |
| **Floating back** | 40 dp circle `rgba(0,0,0,0.35)`, white `arrow-left` | Over hero artwork |
| **Close** | 32 dp circle `control.close`, `x` icon `#3F3F3F`, 48 dp hit area | Sheet headers |
| **Player controls** | Prev/Next: 72 × 72, radius 20, `control.bg`, icons `step-back` / `step-forward` 24. Pause: flexible width × 72, radius 20, `control.bgStrong`, with a `primary` fill growing left → right as the exercise progresses | Exercise screen |
| **Rest actions** | "+20s": height 56 pill, `control.restAction`, white label. "Skip": height 56 pill, white, `primary` label. "Edit Rest Time": height 44 pill, `control.restPill`, 15/600 white | Rest panel |
| **Thumbs** | 48 dp circles `#E9E9E9` with `#5A5A5A` icons (AA; the reference's white-on-grey fails) | Player stage |

**States:** pressed = scale 0.98 + 90% opacity · disabled = 40% opacity, not focusable · loading = spinner replaces the label, width unchanged.

### 4.2 Inputs & Selectors

| Component | Spec |
|---|---|
| **Search bar** | Height 48, pill, `surface.muted`, leading `search` 20 in `text.secondary`, placeholder `body` in `text.secondary`. Tapping opens the Search screen. |
| **Segmented – primary** | Container `surface.muted`, pill, height 44. Selected segment: `primary` fill, white 15/600 label. Used for Animation / Muscle / How to do and kg / lbs. |
| **Segmented – neutral** | Same container. Selected: white pill with a small shadow and `text.primary` label; unselected label `text.secondary`. Used for Default / Custom and period toggles. |
| **Switch** | Track on `#B3C8FF` (Ref), thumb on `primary`. Track off `line.divider`, thumb off white. |
| **Slider** | Track 4 dp `#E5E5E5`, fill `primary`, thumb 20 dp `primary`. |
| **Wheel picker** | 3 visible rows, 64 dp each. Selected row: `surface.picker`, radius 16, label 28/700 `primary`. Other rows: 22/600 `text.tertiary`. Snaps, with haptic tick. |
| **Ruler picker** | Minor tick every 0.1 (1 × 24 dp), major tick every 1.0 (2 × 44 dp) with label 20/500 `text.secondary`, ticks `line.rulerTick`, centre indicator 2 dp `primary`. Value above in `metricXL` plus unit 18/500. |
| **Text field** | Height 52, radius 14, `surface.muted`, no border. Focus: 2 dp `primary` border. Label above in 13/600. Error text `error` below. |
| **Stepper** | − value + with 44 dp round buttons (`surface.muted`, `primary` icons). Used for the reps adjuster. |
| **Date picker** | Bottom sheet with a month calendar: 7-column grid, 40 dp day cells, today ringed with `primaryBorderSoft`, selected day filled `primary` with white text, future days disabled for logs. Same component as the All records calendar. Opened by the date chip in the weight log. No extra package. |
| **Time picker** | Bottom sheet with two wheel pickers (hour, minute in 5-minute steps), plus AM/PM when the device uses a 12-hour clock. Used for the reminder time (onboarding schedule, Settings → Reminders). |
| **Chip tab** | Height 36, pill, 16 dp padding. Unselected: `surface.muted`, `body` in `text.secondary`. Selected: `primarySoft` fill, 1.5 dp `primary` border, `bodyStrong` in `primary`. Body Focus, Popular Goals. |
| **Filter chip** | Height 36, pill. Unselected: `surface.muted`, `text.primary`. Selected: solid `primary`, white label. Challenge list filters. |
| **Quick filter chip** | Height 44, radius 12, `surface.muted`, leading icon 18 `primary`, label 15/500 `text.primary`. Two horizontally scrolling rows on Training. |

### 4.3 Cards

| Card | Spec |
|---|---|
| **Challenge card – featured** (`GradientCard`) | First card on Training ("CUSTOMIZED FOR YOU"). Width = screen − 72 dp (the next card peeks), height 250, radius 20, challenge gradient, padding 20. Contents: tag, "28 DAYS" (`micro`), title (`cardTitle`, max 2 lines) + `circle-arrow-right`, 2 × 2 meta cells (32 dp icon tile in white at 20% + value 15/700 + label `captionSm`; daily time, level, target area, equipment), Card CTA. **All text is solid white.** Generated artwork fills the right 45%. |
| **Challenge card – standard** | Other Training cards and the challenge list (reference `…131516…`). Same frame, but a 3-line description (`body`, white, max width 60%) replaces the meta cells. On the challenge list the card is full width. |
| **Weekly Goal card** | White, radius 16, padding 20. Header: "Weekly Goal" (`h3`) + count ("0" 24/700 `primary` + "/4" 17/600) + `pencil` 18. Week strip of 7 dates (17/500): past `text.primary`, future `text.tertiary`, today `primary` inside a 44 dp ring (`primaryBorderSoft`, 2 dp) with a small pointer, completed = 44 dp `primary` circle with a white check. Coach bubble below: `surface.bubble`, radius 16, 48 dp avatar + 15/500 message. |
| **Workout row** | Thumb 88 (radius 12) + title 16/700 + meta `caption` `text.secondary` + bolts row (14 dp). Divider inset to the text start. Body Focus, "You may like". |
| **List row** | `surface.row` card, radius 16, padding 16, thumb 64 (radius 12), title `listTitle` (17/500, regular weight as in the reference), meta `caption` "19 mins · 20 exercises". Every generic list. In goal lists (reference `…131652…`), challenges come first as rows with the meta "28-day plan". |
| **Exercise row** | Workout details list: 88 dp thumbnail (first key pose on `surface.stage`), name 16/700, "01:00" or "× 15" in `caption`, inset divider. Tapping opens the exercise guide. |
| **Media card (2-up)** | Width (screen − 44) / 2, aspect 1.6, radius 16, artwork, bottom scrim (black 0 → 60%), title 14/700 white. Stretch & Warm Up on Training. |
| **Grid card** | Discover "Stretch": a **2-row horizontal grid** that scrolls sideways, with the third column peeking. Card = artwork (radius 16, aspect 1.4) with the title below in 14/600 `text.primary`. |
| **Banner** | Height 140–180, radius 16, gradient + artwork, title `cardTitle` white, subtitle `caption` white, count pill (white 90%, `text.strong`). Recommended, Explore more, Discover featured. |
| **Create card** | Height 140, `gradient.create`, "CREATE YOUR OWN" `cardTitle` white, white "GO" pill, pencil tile on the right. |
| **Stat card** | White, radius 16. Three columns: duotone icon 28 (`primary` + `statIcon`), value `statValue`, label 15/400 `text.secondary`. |
| **Settings group** | White, radius 16. Rows 56–64 dp: icon tile 36 (`primarySoft` + `primary` icon), label `title`, value `caption` `text.secondary`, `chevron-right`. |
| **Dark tile** | Height 110, radius 16, `gradient.darkTile`, white silhouette icon 48 (top right), label 16/700 white (bottom left). Discover body focus. |
| **Category hero** | `#252B39` background, back arrow white, title `cardTitle` white, description 15/400 white. |
| **Achievement badge** | 72 dp circle with a group gradient + white icon 32. Locked: `surface.muted` + `text.tertiary` icon. Name 13/600 below. |

### 4.4 Modals & Sheets

| Component | Spec |
|---|---|
| **Bottom sheet** | Top radius 24, `surface.default` (Workout Settings uses `surface.row`), scrim `overlay.scrim`, no drag handle. Header: title `h2` (or `h1` for large sheets) + Close. Footer: Primary button with 16 dp margins above the safe area. |
| **Exercise guide sheet** | Title 22/800 UPPER. Media box radius 16 on `surface.stage`. Primary segmented control (Animation / Muscle / How to do). Then DURATION (value right, 17/700 `text.secondary`), INSTRUCTIONS, FOCUS AREA chips, front + back muscle map, COMMON MISTAKES (numbered), BREATHING TIPS (bullets), and "Easier" / "Harder" outline pills when valid variations exist ([CONTENT_MAP](CONTENT_MAP.md) §3). Sticky **CLOSE** Primary button. |
| **Rest stage** | During rest, the upper half shows the next exercise's animation on white with 32 dp rounded bottom corners, above the `restBg` panel. |
| **Full-screen modal** | Quit / finish screens: `gradient.finish` background with the faded player stage behind it, 100 dp icon circle, message `h1` centred, Primary + Secondary buttons, Plain link. |
| **Completion progress / share card** | Finish progress includes a weekly ring counting distinct active days. The local 1080×1350 share image uses `shareCardLayout` export tokens, the current light/dark finish gradient, theme colours, Poppins families, translation keys and configured app name. Native SVG font/rendering and system share-sheet QA remain. |
| **Dialog** | Centred card, radius 20, padding 24, title 20/700, body `body`, buttons side by side. The destructive action uses an `error` fill. |
| **Toast** | Bottom, 24 dp above the tab bar, `#1D2025` background, 15/500 white, radius 12, 3 seconds. |
| **Celebration** | Scrim + celebration Lottie + badge + title `h1` + Primary "Nice!" button. |

### 4.5 Badges & Indicators

| Component | Spec |
|---|---|
| **Tag** | `tagBg` + `tagText`, `micro`, height 24, 10 dp padding. Corners: top-left follows the card radius, bottom-right 12. |
| **Difficulty bolts** | 3 × `zap` 14 dp, 4 dp gap. Accessibility label "Difficulty 2 of 3". |
| **Level text** | `caption` in the level colour ("Intermediate"). |
| **Focus chip** | `#F3F4F9` pill, 8 dp `primary` dot, 15/500 `text.primary`. |
| **Numbered circle** | 24 dp `primaryTint` circle, number 13/700 `primary`. |
| **Streak flame** | `flame` icon 26 + count 17/700 `text.primary`. |
| **Day check** | 44 dp `primary` circle + white `check` 20. |
| **Timer ring** | Diameter 120, stroke 6, track `line.ringTrack`, progress `ringProgress`, round caps, countdown `displayXL` inside. |
| **Progress line** | 3 dp `primary` bar at the top of the player's lower panel (overall workout progress). |

### 4.6 Navigation

| Component | Spec |
|---|---|
| **Bottom tab bar** | Height 64 + safe area, `surface.default`, top hairline `line.divider`. Icons 26: Training `timer`, Discover `compass`, Report `chart-column`, Settings `user-round`. Active: `primary` icon + 12/700 label. Inactive: `text.secondary` + 12/600. |
| **Tab header** | `tabHeader` on the left. Right side: streak flame with count (Training; opens the Report tab), `search` + `clock-3` (Discover; the clock opens the "Recent" list). Height 56. |
| **Favourite toggle** | `heart` icon button in the workout-details hero (outline; filled with the `flame` colour `#FF4762` when saved). Saved workouts are listed under Settings → "My favourites". |
| **Stack header** | `arrow-left` 24 + title `h2`, left-aligned, height 56, background matches the screen. |
| **Section header** | Title `h3` on the left, "More" text link on the right, 12 dp gap to the content. |
| **Carousels** | Snap to item, 12 dp gap, next item peeks 32–44 dp, 16 dp start padding. |
| **Onboarding progress** | 4 dp bar at the top, `primary` on `line.ringTrack`, animates between steps. |

### 4.7 Icons

`lucide-react-native` (ISC licence), stroke width 2, sizes 16 / 20 / 24 / 28. Colours always come from tokens. Names below were checked against lucide 1.47.0.

| Purpose | Icon | Purpose | Icon |
|---|---|---|---|
| Training tab | `timer` | Discover tab | `compass` |
| Report tab | `chart-column` | Settings tab | `user-round` |
| Search | `search` | History (Discover) | `clock-3` |
| Streak / kcal | `flame` | Edit | `pencil` |
| Back | `arrow-left` | Card arrow | `circle-arrow-right` |
| More / row chevron | `chevron-right` | Daily time | `calendar-days` |
| Level (card) | `chart-no-axes-column` | Level (details) | `layers` |
| Target area | `target` | Equipment | `circle-check` |
| Minutes | `timer` | Difficulty bolt | `zap` |
| Play / pause | `play` / `pause` | Previous / next | `step-back` / `step-forward` |
| Help (?) | `circle-question-mark` | Music | `music` |
| Workout settings | `settings` | Edit workout (builder) | `sliders-horizontal` |
| Thumbs | `thumbs-up` / `thumbs-down` | Close | `x` |
| Check | `check` | Duration filter | `clock` |
| Keep fit | `heart-pulse` | Build muscle | `biceps-flexed` |
| Burn fat | `flame` | Favourite | `heart` |
| Warm-up | `person-standing` | Workouts stat | `medal` |
| Achievements | `trophy` | Reminders | `bell` |
| Export / import | `upload` / `download` | Reset | `trash` |
| Theme | `sun` / `moon` | Language | `globe` |
| Height / weight | `ruler` / `scale` | Privacy | `shield-check` |
| Disclaimer | `file-text` | About | `info` |
| Share | `share-2` | Reorder | `grip-vertical` |

> Renamed in current lucide: `bar-chart-3` → `chart-column`, `circle-help` → `circle-question-mark`, `trash-2` → `trash`. There is no `history` icon, so use `clock-3`.

---

## 5. Layout & Grid

### 5.1 Container

- Screen side padding: **16 dp**. All content respects the top and bottom safe areas.
- On wide screens (≥ 600 dp), content has a maximum width of 600 dp and is centred.
- Tab screens scroll vertically with **28 dp** between sections and 24 dp + tab bar height at the bottom.

### 5.2 Grid System

| Pattern | Rule |
|---|---|
| 2-up cards | (screen − 2 × 16 − 12) / 2 |
| 3-up carousel cards | about 140 dp wide, 12 dp gap, peeking |
| Tiles (Discover) | 2 columns, 10 dp gap |
| Stretch grid (Discover) | 2 rows, scrolls horizontally, 12 dp gaps, third column peeks |
| Meta cells (challenge card) | 2 × 2 grid, 12 dp gap |
| Week strip | 7 equal columns |

### 5.3 Spacing Scale (4-point)

| Token | dp | Token | dp |
|---|---|---|---|
| `space.0` | 0 | `space.6` | 24 |
| `space.0_5` | 2 | `space.7` | 28 |
| `space.1` | 4 | `space.8` | 32 |
| `space.2` | 8 | `space.10` | 40 |
| `space.3` | 12 | `space.12` | 48 |
| `space.4` | 16 | `space.16` | 64 |
| `space.5` | 20 | | |

Common values: card padding 20 · list-row padding 16 · heading → content 12 · row gap 10 · section gap 28.

---

## 6. Icons & Illustrations

### 6.1 Icon Library

Only `lucide-react-native` icons (§4.7). No raster icons, and never icons copied from the reference app.

### 6.2 Illustrations

| Asset | Style |
|---|---|
| Exercise animations | Flat 2D character (§2.7): two flat tones per part, no face, 600 × 600 canvas, 30 fps, 2–4 key poses, seamless loop, motion arc for rotations (spec in §2.7) |
| Thumbnails | First key pose of the same character on `surface.stage` |
| Workout and challenge artwork | Body-focus gradient (§2.5) + large character silhouette + simple geometric pattern |
| Coach avatar | Friendly flat character bust in a circle |
| Empty states | 6 geometric illustrations in brand colours |

No photographs, no realistic faces and no before/after bodies ([PRD](PRD.md) §9).

---

## 7. Responsive Design

### 7.1 Breakpoints (window width)

| Name | Width | Behaviour |
|---|---|---|
| Compact | < 360 dp | Display sizes −10%, challenge card peek 24 dp, quick-filter labels may truncate |
| Regular | 360 – 599 dp | Default design |
| Expanded | ≥ 600 dp | Content max width 600 dp and centred; carousels show more items |

### 7.2 Layout Behaviour

- **Portrait only** (ADR-028).
- Everything scales with the system font size (§3). Rows grow taller; they never clip text.
- Lists use `FlashList`. Horizontal carousels use snap points.
- Use `start`/`end` instead of `left`/`right` so the layout is RTL-ready (RTL is not shipped in v1).
- Screens with text inputs avoid the keyboard.

---

## 8. Dark Mode

The user chooses **System** (default), **Light** or **Dark** in Settings.

### 8.1 Colour Adjustments

| Token | Light | Dark |
|---|---|---|
| `bg.page` / `bg.plain` | `#F8F8F8` / `#FFFFFF` | `#0E1014` |
| `surface.default` | `#FFFFFF` | `#171A21` |
| `surface.muted` | `#EFF0F2` | `#20242D` |
| `surface.row` | `#F7F7F9` | `#1A1D25` |
| `surface.bubble` / `surface.picker` | `#F0F0F0` / `#F3F4F6` | `#20242D` |
| `surface.stage` | `#FAFAFA` | `#151820` |
| `text.primary` | `#000000` | `#F2F4F7` |
| `text.strong` | `#1D2025` | `#E6E8EC` |
| `text.body` | `#3F3F3F` | `#D0D4DB` |
| `text.subtle` | `#575E6E` | `#B4BAC4` |
| `text.secondary` | `#6B6B6B` | `#A0A6B1` |
| `text.tertiary` | `#949494` | `#6F7682` |
| `primary` (text and icons) | `#004BFF` | `#6E9BFF` |
| Primary fills (buttons, checks) | `#004BFF` | `#004BFF` |
| `primarySoft` / `primaryTint` | `#E9EDF8` / `#E7EEFF` | `#1A2A4D` |
| `line.divider` / `line.ringTrack` | `#E2E2E2` / `#EEEEEE` | `#2A2F3A` |
| `line.grid` | `#E8E9EB` | `#262B35` |
| `boltOff` / muscle base | `#DFDFDF` / `#CBCBCD` | `#3A404C` |
| `control.bg` / `control.bgStrong` | `#F4F4F4` / `#EEEEEE` | `#20242D` / `#262B35` |
| `control.secondary` | `#F6F6F6` | `#262B35` |
| `overlay.scrim` | `rgba(0,0,0,0.60)` | `rgba(0,0,0,0.70)` |
| `gradient.finish` | `#EFF3FF` → `#EBF1FF` | `#131827` → `#101521` |

Challenge gradients, the CTA gradients, `restBg`, `flame`, the tag colours and the BMI scale stay the same in both themes. Shadows are replaced by surface contrast in dark mode.

### 8.2 Component States

| State | Light | Dark |
|---|---|---|
| Pressed | Scale 0.98 + 90% opacity | Same, plus an 8% white overlay on surfaces |
| Focused (TalkBack, keyboard) | 2 dp `primary` outline, 2 dp offset | 2 dp `#6E9BFF` outline |
| Selected | `primarySoft` + `primary` border or text | `#1A2A4D` + `#6E9BFF` |
| Disabled | 40% opacity, not focusable | Same |
| Error | `error` border and helper text | Same, with dark text colours |

---

## 9. Accessibility

Target: **WCAG 2.2 level AA** on Android with TalkBack.

### 9.1 Contrast Ratio

Required: **4.5:1** for normal text, **3:1** for large text (≥ 18.66 sp bold or ≥ 24 sp) and for meaningful UI graphics. Verified pairs:

| Pair | Ratio | Pass |
|---|---|---|
| `primary` on white / on `bg.page` / on `primarySoft` | 6.09 / 5.73 / 5.20 | ✅ AA |
| White on `primary` / on `restBg` | 6.09 / 5.24 | ✅ AA |
| `text.secondary` on white / `bg.page` / `surface.row` / `surface.muted` | 5.33 / 5.02 / 4.98 / 4.67 | ✅ AA |
| `text.body` on white / `text.subtle` on white | 10.53 / 6.50 | ✅ AA |
| Intermediate `#BE5901` / Advanced `#DB3931` on white | 4.55 / 4.52 | ✅ AA |
| White on challenge gradient starts | ≥ 4.51 | ✅ AA |
| White on challenge gradient ends | ≥ 3.01 | ✅ large text only |
| White on the centre of `gradient.cta` | 3.11 | ✅ large text only (button labels are 18 sp bold) |
| White on `control.restAction` "+20s" | 4.28 | ✅ large text |
| `tagText` on `tagBg` | 15.87 | ✅ AAA |
| Dark: `text.primary` / `text.secondary` / `primary` on `surface.default` | 15.80 / 7.12 / 6.46 | ✅ AA |
| `text.tertiary` on white / dark surface | 3.03 / 3.81 | ⚠️ decorative or disabled text only |

Any new colour pair must be checked before use.

### 9.2 Screen Reader & Focus

- Every interactive element has an `accessibilityLabel`, the right `accessibilityRole` and its state (`selected`, `checked`, `disabled`, `expanded`).
- Row content is grouped into **one** focusable element with a combined label.
- Focus order follows the visual order. Sheets trap focus and return it on close.
- The player announces phase changes and "10 seconds left" with `announceForAccessibility`, and never announces every second.
- Decorative images and silhouettes are hidden from TalkBack.
- Basic external keyboard and D-pad focus works on every screen.

### 9.3 Accessibility Labels (Android equivalent of ARIA)

| Element | Role | Label pattern |
|---|---|---|
| Workout row | `button` | "Abs Beginner, 12 minutes, 14 exercises, difficulty 1 of 3" |
| Challenge card | `button` | "28-day Full Body Challenge, beginner, 7 to 22 minutes a day. Start day 1" |
| Week strip day | `text` | "Wednesday 23, today, workout done" |
| Chip tab | `tab` | "Abs, selected" |
| Pause button | `button` | "Pause. 40 seconds left" |
| Timer | `timer` | "54 seconds remaining" (live region: polite) |
| Switch | `switch` | "Voice cues, on" |
| Ruler picker | `adjustable` | "Weight, 74.5 kilograms". Swipe up/down changes by 0.1. |
| Help icon | `button` | "How to do Torso Twist" |

**Also required:** 48 dp minimum touch targets · colour is never the only signal (bolts, BMI and levels have text) · Reduce Motion is respected (§10) · no time limits except the workout itself, which can always be paused.

---

## 10. Animation & Transitions

### 10.1 Principles

Motion is **purposeful** (explains a change), **fast** and **interruptible**. It runs on the UI thread with Reanimated. When Reduce Motion is on, decorative motion is removed and transitions become simple fades.

### 10.2 Duration

| Token | ms | Used for |
|---|---|---|
| `instant` | 100 | Press feedback |
| `fast` | 150 | Chips, switches, segmented controls |
| `base` | 250 | Cross-fades, expanding intros, the rest-screen switch |
| `sheet` | 300 | Bottom sheets (spring) |
| `slow` | 400 | Screen transitions, goal-ring fill |
| `celebrate` | 1200–2000 | Achievement and finish celebrations |

### 10.3 Easing

| Token | Curve | Used for |
|---|---|---|
| `standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most transitions |
| `decelerate` | `cubic-bezier(0, 0, 0, 1)` | Elements entering |
| `accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | Elements leaving |
| `linear` | linear | Pause-button fill, countdown ring (they represent time) |
| `spring` | damping 20, stiffness 200 | Bottom sheets, check-mark pop |

**Specific motion:** Lottie demos loop at 30 fps · timer digits change without animation · completed-day check pops (scale 0.8 → 1, spring) · the player opens as a modal (slide up) · normal screens use the native stack slide.

---

## 11. Design Tokens

Tokens live in one place, `src/modules/core/theme/`, and are exposed through `useTheme()`. The colour tokens are defined in §2 and §8.1.

### 11.1 Typography Tokens

The type scale in §3. Tokens are named exactly as in the table (`displayXL`, `h1`, `title`, …).

### 11.2 Colour Tokens

`primary`, `bg.*`, `surface.*`, `text.*`, `line.*`, `control.*`, `level.*`, `semantic.*`, `overlay.scrim`, `gradient.*` and `challenge.*`. Every token has a light value and a dark value (§8.1).

### 11.3 Spacing

The 4-point scale in §5.3.

### 11.4 Border Radius

| Token | dp | Used for |
|---|---|---|
| `radius.xs` | 6 | Tiny elements |
| `radius.sm` | 8 | Icon tiles |
| `radius.md` | 12 | Thumbnails, quick filters, small buttons, toasts |
| `radius.lg` | 16 | Cards, list rows, banners, pickers |
| `radius.xl` | 20 | Challenge cards, player controls, dialogs |
| `radius.xxl` | 24 | Bottom-sheet top corners |
| `radius.pill` | 999 | Buttons, chips, search bar, segmented controls |

### 11.5 Shadows (Android elevation)

The reference is flat: cards sit on `bg.page` without shadows.

| Token | Elevation | Used for |
|---|---|---|
| `shadow.none` | 0 | Cards and rows (default) |
| `shadow.sm` | 1 | Selected neutral segment |
| `shadow.md` | 4 | Toasts, sticky Start bar |
| `shadow.lg` | 12 | Bottom sheets, dialogs |

### 11.6 Sizes

| Token | dp | Token | dp |
|---|---|---|---|
| `touch.min` | 48 | `thumb.sm` / `md` / `lg` | 56 / 64 / 88 |
| `button.lg` / `md` / `sm` | 56 / 48 / 36 | `avatar` | 48 |
| `iconButton` | 40 (48 hit area) | `tabBar` | 64 |
| `icon.sm` / `md` / `lg` / `xl` | 16 / 20 / 24 / 28 | `header` | 56 |
| `chip` / `quickChip` | 36 / 44 | `playerControl` | 72 |
| `searchBar` / `segmented` | 48 / 44 | `timerRing` | 120 (stroke 6) |

---

## 12. Implementation Notes

### 12.1 Tools & Resources

| Need | Tool |
|---|---|
| Gradients | `react-native-svg` `LinearGradient` inside an `Svg` background (ADR-034, proposed) |
| Icons | `lucide-react-native` |
| Charts, rings, muscle map | `react-native-svg` |
| Motion | `react-native-reanimated` |
| Exercise demos | `lottie-react-native` |
| Font | Poppins TTF files in `assets/fonts/`, loaded with `expo-font` |
| Reference | `reference-img/` screenshots (layout guide only) |

### 12.2 Best Practices

- Never hard-code a colour, size, radius or font. Always use tokens.
- Build each screen from the core components (§4). Add a new component only when it will be reused.
- Check every screen in light, dark, 200% font size and TalkBack before calling it done.
- Compare every screen **side by side with its reference screenshot** (§12.3) for layout, spacing and hierarchy.
- Keep the "deliberate differences" below. Never add PRO, Unlock, ads or video UI.

### 12.3 Screen ↔ Reference Map

| App screen | Reference screenshot(s) in `reference-img/` |
|---|---|
| Training tab | `…131201…`, `…131212…` |
| Challenge list | `…131516…` |
| Generic list (Just For You, Stretch & Warm Up, Build Muscle) | `…131609…`, `…131623…`, `…131652…` |
| Workout details | `…131730…`, `…132013…`, `…135757…` |
| Discover tab | `…131823…` |
| Discover category | `…131853…` |
| Player – Ready | `…132037…` |
| Player – Exercise | `…132103…`, `…132845…` |
| Player – Rest | `…132828…` |
| Exercise guide sheet | `…132719…`, `…132746…`, `…132813…` |
| Workout Settings sheet | `…132913…` |
| Rest timer picker | `…135643…` |
| Quit screen | `…135716…` |
| Report tab | `…135844…` |
| Weight log sheet | `…135916…` |

### 12.4 Home (plan-first, ADR-066)

The Training tab shows one plan, not the catalogue (that stays in Discover). Same blue brand, more vivid: gradient hero cards, `onPrimarySoft` pills, short `FadeIn` entrances (skipped under Reduce Motion).

| Home | Sections, top to bottom |
|---|---|
| **New user** (no active plan, no session) | Colourful welcome → recommended plan card with **Start day 1** and **Customize my plan** → "How it works" (3 steps) → first week's path → Explore |
| **Returning user** | Greeting with streak → today's plan day (name, minutes, exercise previews, **Start**) → this week's path with progress → Customize tiles (change plan, quick 5 min, stretch, create your own) → suggested workouts → Explore |

**Finish screen after a plan day (ADR-067):** a gradient card under the title pops in with a spring (static under Reduce Motion). Blue card: party icon, "Day X done!", plan progress, then an `onPrimarySoft` row with tomorrow's day and workout (moon icon if it is a rest day). Orange card on the last day: trophy, "Plan complete!" and **Choose your next plan**.

`PlanPath` shows seven day nodes: done, today, rest and upcoming. The `/plan` screen lets the user change goal, level and days per week, then shows the best plan and all plans.

### 12.5 Deliberate Differences from the Reference

| Reference | Home Workout v1 | Why |
|---|---|---|
| PRO badge, "Unlock" buttons | None; always "Start" | Everything is free |
| Ad banner on Report | None | No ads |
| "Video" tab (YouTube) | "Animation" tab | Fully offline; videos come in v2 |
| In-app music player and queue | "Plays alongside your own music" + ducking toggle | No music library, no network |
| Watermarked demo background | Plain `surface.stage` | Original assets only |
| Photos of people | Generated artwork and character | No stock photos |
| "Height Increase", "Shred" and similar copy | Posture and neutral wording | [PRD](PRD.md) §9 content rules |
| "Forearm" body-focus chip | Not shown | The catalog has no forearm workouts |
| Second column of body-focus rows | One column of 3 rows | The catalog has exactly 3 workouts per body focus |
| "With Equipment" banner on Discover | Not shown | The app is equipment-free |
| "Six pack" tile and category | "Core" | Neutral naming |
| Music playing queue and import | Not shown | No music library, no downloads |
| Some low-contrast colours | AA-adjusted tokens (§2) | Accessibility |

---

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version. Colours measured from 25 reference screenshots and checked for WCAG contrast. |
| 1.1 | Sep 23, 2026 | Completeness audit: two challenge-card variants, list-row weight, exercise row, grid card, date and time pickers, rest stage, favourites, icon fixes, more documented differences |
| 1.2 | Sep 29, 2026 | Full-colour static pose style study replaces monochrome source sample (ADR-056) |
| 1.3 | Oct 1, 2026 | Documented weekly active-day ring and completion share-card theme/export conventions |
| 1.4 | Oct 1, 2026 | Added reference-informed male browse artwork and separate hero/card/exercise framing; documented transparent replacement pipeline |
| 1.5 | Oct 1, 2026 | Added owner-directed realistic male/female/pair art, muscle-relevant covers and coloured-header/plain-row Discover framing |
