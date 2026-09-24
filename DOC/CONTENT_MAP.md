# 🗂️ Content Map

### Home Workout – Production Map for Every Exercise, Workout, Challenge and Badge

This document turns the [content catalog](../WORKOUT_APP_CONTENT.md) into a production checklist so that **nothing is missed**. The catalog stays the source of truth for names, counts, types, levels and quiet flags. This map adds what the generators need: base pose, view, props, one-sided flags, variations, quiet swaps, placements and badge rules. Exercise and workout names are copied from the catalog by a script, so they match it exactly.

| Field | Details |
|---|---|
| **Version** | 1.0 |
| **Last updated** | September 23, 2026 |
| **Status** | Draft – items marked † are proposals that need owner approval (ADR-040 to ADR-050) |
| **Related** | [PRD](PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [DESIGN](DESIGN.md) · [TASKS](TASKS.md) · [COVERAGE](COVERAGE.md) · [DECISIONS](DECISIONS.md) |

---

## 1. Summary

| Content | Count | Breakdown |
|---|---|---|
| Exercises | **119** | Warm-Up 10 · Core & Abs 19 · Chest & Push 12 · Shoulders & Arms 12 · Back & Pull 10 · Legs & Glutes 18 · Full Body 10 · Cardio & Conditioning 12 · Stretch & Cool-Down 16 |
| Exercise types | 119 | time 30 · reps 63 · hold 26 |
| Exercise levels | 119 | Level 1: 56 · Level 2: 50 · Level 3: 13 |
| Quiet-safe | 110 | 9 jumping exercises, each with a quiet swap (§4) |
| One-sided † | 17 | Played as left + right items (§2) |
| Views | 119 | Front 33 · Side 79 · Top 7 (§5) |
| Exercises with props | 15 | Wall, chair, doorway, water bottles (§5) |
| Variation links | 49 exercises | 19 links point to exercises not in the catalog (§3) |
| Workouts | **60** | Body Focus × 3 levels 24 · Quick Workouts 5 · Burn Fat 6 · Build Muscle 5 · Keep Fit 4 · Stretch & Warm-Up 12 · Special / Situational 4 |
| Challenges | **12** | 4 × 14 days · 2 × 21 · 4 × 28 · 2 × 30 |
| Discover | 6 tiles + 5 sections | §9 |
| Collections † | 4 | §9.3 |
| Achievements | **35** | §11 |

---

## 2. Exercise Production Sheet

One row per exercise. **Status** tracks the four production steps for each exercise: metadata, copy, pose set and animation QA (tasks T2.2, T2.3, T2.11, T2.12).

**Columns:** Base pose = rig starting position · View = Side / Front / Top (§5) · Props = objects drawn in the animation · One-sided = played left + right · Variations = easier → harder, resolved against the catalog (⚠️ = the catalog names an exercise that does not exist, see §3) · Quiet swap = replacement when Quiet Mode is on (§4).

### 2.1 Warm-Up (10)

| # | Exercise | Type | Lvl | Quiet | Base pose | View | Props | One-sided | Variations | Quiet swap | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | March in Place | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 2 | Arm Circles | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 3 | Shoulder Rolls | time | 1 | ✅ | standing | Side | — | — | — | — | ⬜ |
| 4 | Hip Circles | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 5 | Leg Swings (Front) | time | 1 | ✅ | standing | Side | Wall (balance, optional) | Yes | — | — | ⬜ |
| 6 | Leg Swings (Side) | time | 1 | ✅ | standing | Front | Wall (balance, optional) | Yes | — | — | ⬜ |
| 7 | Torso Twist | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 8 | Neck Rolls | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 9 | Cat-Cow | time | 1 | ✅ | all fours | Side | — | — | — | — | ⬜ |
| 10 | Inchworm Walkout | reps | 2 | ✅ | standing → plank | Side | — | — | — | — | ⬜ |

### 2.2 Core & Abs (19)

| # | Exercise | Type | Lvl | Quiet | Base pose | View | Props | One-sided | Variations | Quiet swap | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 11 | Crunch | reps | 1 | ✅ | lying on back | Side | — | — | — → Sit-Up | — | ⬜ |
| 12 | Reverse Crunch | reps | 2 | ✅ | lying on back | Side | — | — | Crunch → Leg Raise | — | ⬜ |
| 13 | Bicycle Crunch | reps | 2 | ✅ | lying on back | Side | — | — | Crunch → V-Up | — | ⬜ |
| 14 | Sit-Up | reps | 2 | ✅ | lying on back | Side | — | — | Crunch → V-Up | — | ⬜ |
| 15 | Leg Raise | reps | 2 | ✅ | lying on back | Side | — | — | Reverse Crunch → — ⚠️ | — | ⬜ |
| 16 | Flutter Kick | time | 2 | ✅ | lying on back | Side | — | — | Heel Touch → Scissor Kick | — | ⬜ |
| 17 | Scissor Kick | time | 2 | ✅ | lying on back | Top | — | — | Flutter Kick → Leg Raise | — | ⬜ |
| 18 | Heel Touch | reps | 1 | ✅ | lying on back | Top | — | — | — → Russian Twist | — | ⬜ |
| 19 | Russian Twist | reps | 2 | ✅ | seated | Front | — | — | Heel Touch → — ⚠️ | — | ⬜ |
| 20 | Forearm Plank | hold | 1 | ✅ | plank | Side | — | — | — ⚠️ → Plank Shoulder Tap | — | ⬜ |
| 21 | Side Plank (each side) | hold | 2 | ✅ | side plank | Front | — | Yes | — ⚠️ → — ⚠️ | — | ⬜ |
| 22 | Plank Shoulder Tap | reps | 2 | ✅ | plank | Side | — | — | Forearm Plank → Plank Up-Down | — | ⬜ |
| 23 | Dead Bug | reps | 1 | ✅ | lying on back | Side | — | — | — → Hollow Hold | — | ⬜ |
| 24 | Hollow Hold | hold | 3 | ✅ | lying on back | Side | — | — | Dead Bug → — | — | ⬜ |
| 25 | Mountain Climber | time | 2 | ✅ | plank | Side | — | — | — ⚠️ → — ⚠️ | — | ⬜ |
| 26 | V-Up | reps | 3 | ✅ | lying on back | Side | — | — | Sit-Up → — | — | ⬜ |
| 27 | Toe Touch Crunch | reps | 2 | ✅ | lying on back | Side | — | — | Crunch → V-Up | — | ⬜ |
| 28 | Cross Touch and Reach | time | 1 | ✅ | standing | Front | — | — | — → Standing Oblique Crunch | — | ⬜ |
| 29 | Standing Oblique Crunch | reps | 1 | ✅ | standing | Front | — | — | Cross Touch and Reach → Russian Twist | — | ⬜ |

### 2.3 Chest & Push (12)

| # | Exercise | Type | Lvl | Quiet | Base pose | View | Props | One-sided | Variations | Quiet swap | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 30 | Wall Push-Up | reps | 1 | ✅ | standing | Side | Wall | — | — → Incline Push-Up | — | ⬜ |
| 31 | Incline Push-Up | reps | 1 | ✅ | plank | Side | Chair | — | Wall Push-Up → Knee Push-Up | — | ⬜ |
| 32 | Knee Push-Up | reps | 1 | ✅ | plank | Side | — | — | Incline Push-Up → Standard Push-Up | — | ⬜ |
| 33 | Standard Push-Up | reps | 2 | ✅ | plank | Side | — | — | Knee Push-Up → Wide Push-Up | — | ⬜ |
| 34 | Wide Push-Up | reps | 2 | ✅ | plank | Side | — | — | Standard Push-Up → Decline Push-Up | — | ⬜ |
| 35 | Diamond Push-Up | reps | 3 | ✅ | plank | Side | — | — | Standard Push-Up → Archer Push-Up | — | ⬜ |
| 36 | Decline Push-Up | reps | 3 | ✅ | plank | Side | Chair | — | Standard Push-Up → Archer Push-Up | — | ⬜ |
| 37 | Archer Push-Up | reps | 3 | ✅ | plank | Front | — | — | Diamond Push-Up → — | — | ⬜ |
| 38 | Push-Up Hold | hold | 2 | ✅ | plank | Side | — | — | — ⚠️ → — | — | ⬜ |
| 39 | Plank to Push-Up | reps | 3 | ✅ | plank | Side | — | — | — ⚠️ → — | — | ⬜ |
| 40 | Chest Squeeze (isometric) | hold | 1 | ✅ | standing | Front | — | — | — → — | — | ⬜ |
| 41 | Shoulder Tap Push-Up | reps | 3 | ✅ | plank | Side | — | — | Standard Push-Up → — | — | ⬜ |

### 2.4 Shoulders & Arms (12)

| # | Exercise | Type | Lvl | Quiet | Base pose | View | Props | One-sided | Variations | Quiet swap | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 42 | Pike Push-Up | reps | 3 | ✅ | inverted | Side | — | — | — | — | ⬜ |
| 43 | Wall Angel | reps | 1 | ✅ | standing | Front | Wall | — | — | — | ⬜ |
| 44 | Triceps Dip (chair/floor) | reps | 2 | ✅ | seated | Side | Chair | — | — | — | ⬜ |
| 45 | Floor Triceps Extension | reps | 2 | ✅ | plank | Side | — | — | — | — | ⬜ |
| 46 | Front Raise | reps | 1 | ✅ | standing | Side | Water bottles (optional) | — | — | — | ⬜ |
| 47 | Lateral Raise | reps | 1 | ✅ | standing | Front | Water bottles (optional) | — | — | — | ⬜ |
| 48 | Overhead Press (isometric) | hold | 2 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 49 | Plank Up-Down | reps | 3 | ✅ | plank | Side | — | — | — | — | ⬜ |
| 50 | Bear Hold | hold | 2 | ✅ | all fours | Side | — | — | — | — | ⬜ |
| 51 | Wall Handstand Hold | hold | 3 | ✅ | inverted | Side | Wall | — | — | — | ⬜ |
| 52 | Punches | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 53 | Arm Pulse | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |

### 2.5 Back & Pull (10)

| # | Exercise | Type | Lvl | Quiet | Base pose | View | Props | One-sided | Variations | Quiet swap | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 54 | Superman Hold | hold | 1 | ✅ | lying on front | Side | — | — | — | — | ⬜ |
| 55 | Superman Raise | reps | 2 | ✅ | lying on front | Side | — | — | — | — | ⬜ |
| 56 | Reverse Snow Angel | reps | 2 | ✅ | lying on front | Top | — | — | — | — | ⬜ |
| 57 | Prone Y Raise | reps | 2 | ✅ | lying on front | Top | — | — | — | — | ⬜ |
| 58 | Prone T Raise | reps | 2 | ✅ | lying on front | Top | — | — | — | — | ⬜ |
| 59 | Prone W Raise | reps | 2 | ✅ | lying on front | Top | — | — | — | — | ⬜ |
| 60 | Swimmer | time | 2 | ✅ | lying on front | Side | — | — | — | — | ⬜ |
| 61 | Bird Dog | reps | 1 | ✅ | all fours | Side | — | — | — | — | ⬜ |
| 62 | Floor Row (isometric) | hold | 2 | ✅ | lying on back | Side | — | — | — | — | ⬜ |
| 63 | Back Extension | reps | 2 | ✅ | lying on front | Side | — | — | — | — | ⬜ |

### 2.6 Legs & Glutes (18)

| # | Exercise | Type | Lvl | Quiet | Base pose | View | Props | One-sided | Variations | Quiet swap | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 64 | Bodyweight Squat | reps | 1 | ✅ | standing | Side | — | — | — ⚠️ → Sumo Squat | — | ⬜ |
| 65 | Sumo Squat | reps | 1 | ✅ | standing | Front | — | — | Bodyweight Squat → Squat Pulse | — | ⬜ |
| 66 | Squat Pulse | time | 2 | ✅ | standing | Side | — | — | Bodyweight Squat → Squat Jump | — | ⬜ |
| 67 | Wall Sit | hold | 2 | ✅ | standing | Side | Wall | — | — ⚠️ → — ⚠️ | — | ⬜ |
| 68 | Forward Lunge | reps | 2 | ✅ | standing | Side | — | — | — ⚠️ → — ⚠️ | — | ⬜ |
| 69 | Reverse Lunge | reps | 1 | ✅ | standing | Side | — | — | — ⚠️ → Forward Lunge | — | ⬜ |
| 70 | Lateral Lunge | reps | 2 | ✅ | standing | Front | — | — | — → Curtsy Lunge | — | ⬜ |
| 71 | Curtsy Lunge | reps | 2 | ✅ | standing | Front | — | — | Reverse Lunge → — | — | ⬜ |
| 72 | Split Squat | reps | 2 | ✅ | standing | Side | — | Yes | Reverse Lunge → — ⚠️ | — | ⬜ |
| 73 | Glute Bridge | reps | 1 | ✅ | lying on back | Side | — | — | — → Single-Leg Glute Bridge | — | ⬜ |
| 74 | Single-Leg Glute Bridge | reps | 2 | ✅ | lying on back | Side | — | Yes | Glute Bridge → Floor Hip Thrust | — | ⬜ |
| 75 | Floor Hip Thrust | reps | 2 | ✅ | lying on back | Side | — | — | Glute Bridge → — | — | ⬜ |
| 76 | Donkey Kick | reps | 1 | ✅ | all fours | Side | — | Yes | — → Fire Hydrant | — | ⬜ |
| 77 | Fire Hydrant | reps | 1 | ✅ | all fours | Front | — | Yes | Donkey Kick → — | — | ⬜ |
| 78 | Calf Raise | reps | 1 | ✅ | standing | Side | — | — | — → Single-Leg Calf Raise | — | ⬜ |
| 79 | Single-Leg Calf Raise | reps | 2 | ✅ | standing | Side | Wall (balance, optional) | Yes | Calf Raise → — | — | ⬜ |
| 80 | Good Morning | reps | 2 | ✅ | standing | Side | — | — | — → — ⚠️ | — | ⬜ |
| 81 | Step-Up (chair) | reps | 2 | ✅ | standing | Side | Chair | Yes | — ⚠️ → — ⚠️ | — | ⬜ |

### 2.7 Full Body (10)

| # | Exercise | Type | Lvl | Quiet | Base pose | View | Props | One-sided | Variations | Quiet swap | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 82 | Half Burpee (no jump) | reps | 2 | ✅ | standing → plank | Side | — | — | — | — | ⬜ |
| 83 | Burpee | reps | 3 | ❌ | standing → plank | Side | — | — | — | → Half Burpee (no jump) (#82) | ⬜ |
| 84 | Squat Thrust | reps | 2 | ✅ | standing → plank | Side | — | — | — | — | ⬜ |
| 85 | Bear Crawl | time | 2 | ✅ | all fours | Side | — | — | — | — | ⬜ |
| 86 | Crab Walk | time | 2 | ✅ | seated | Side | — | — | — | — | ⬜ |
| 87 | Squat to Overhead Reach | reps | 1 | ✅ | standing | Side | — | — | — | — | ⬜ |
| 88 | Get-Up (floor to stand) | reps | 2 | ✅ | lying → standing | Side | — | — | — | — | ⬜ |
| 89 | Plank Jack | reps | 2 | ❌ | plank | Front | — | — | — | → Mountain Climber (#25) | ⬜ |
| 90 | Plank Walkout | reps | 2 | ✅ | standing → plank | Side | — | — | — | — | ⬜ |
| 91 | Frog Jump | reps | 3 | ❌ | standing | Side | — | — | — | → Sumo Squat (#65) | ⬜ |

### 2.8 Cardio & Conditioning (12)

| # | Exercise | Type | Lvl | Quiet | Base pose | View | Props | One-sided | Variations | Quiet swap | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 92 | Jumping Jack | time | 1 | ❌ | standing | Front | — | — | — | → Step Jack (#93) | ⬜ |
| 93 | Step Jack | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 94 | High Knees | time | 2 | ❌ | standing | Side | — | — | — | → Marching High Knees (#95) | ⬜ |
| 95 | Marching High Knees | time | 1 | ✅ | standing | Side | — | — | — | — | ⬜ |
| 96 | Butt Kicks | time | 2 | ❌ | standing | Side | — | — | — | → Heel Digs (#97) | ⬜ |
| 97 | Heel Digs | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 98 | Skater Hop | time | 2 | ❌ | standing | Front | — | — | — | → Lateral Step (#99) | ⬜ |
| 99 | Lateral Step | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 100 | Squat Jump | reps | 3 | ❌ | standing | Side | — | — | — | → Squat Pulse (#66) | ⬜ |
| 101 | Fast Feet | time | 2 | ❌ | standing | Front | — | — | — | → Marching High Knees (#95) | ⬜ |
| 102 | Shadow Boxing | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |
| 103 | Standing Knee to Elbow | time | 1 | ✅ | standing | Front | — | — | — | — | ⬜ |

### 2.9 Stretch & Cool-Down (16)

| # | Exercise | Type | Lvl | Quiet | Base pose | View | Props | One-sided | Variations | Quiet swap | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 104 | Child's Pose | hold | 1 | ✅ | kneeling | Side | — | — | — | — | ⬜ |
| 105 | Cobra Stretch | hold | 1 | ✅ | lying on front | Side | — | — | — | — | ⬜ |
| 106 | Downward Dog | hold | 2 | ✅ | inverted | Side | — | — | — | — | ⬜ |
| 107 | Seated Forward Fold | hold | 1 | ✅ | seated | Side | — | — | — | — | ⬜ |
| 108 | Standing Forward Fold | hold | 1 | ✅ | standing | Side | — | — | — | — | ⬜ |
| 109 | Hamstring Stretch (each leg) | hold | 1 | ✅ | lying on back | Side | — | Yes | — | — | ⬜ |
| 110 | Quad Stretch (each leg) | hold | 1 | ✅ | standing | Side | Wall (balance, optional) | Yes | — | — | ⬜ |
| 111 | Hip Flexor Stretch (each side) | hold | 1 | ✅ | kneeling | Side | — | Yes | — | — | ⬜ |
| 112 | Figure-4 Glute Stretch | hold | 1 | ✅ | lying on back | Side | — | Yes | — | — | ⬜ |
| 113 | Butterfly Stretch | hold | 1 | ✅ | seated | Front | — | — | — | — | ⬜ |
| 114 | Chest Doorway Stretch | hold | 1 | ✅ | standing | Side | Doorway | — | — | — | ⬜ |
| 115 | Triceps Stretch | hold | 1 | ✅ | standing | Front | — | Yes | — | — | ⬜ |
| 116 | Neck Side Stretch | hold | 1 | ✅ | standing | Front | — | Yes | — | — | ⬜ |
| 117 | Thoracic Rotation | reps | 1 | ✅ | all fours | Side | — | Yes | — | — | ⬜ |
| 118 | Knee to Chest | hold | 1 | ✅ | lying on back | Side | — | — | — | — | ⬜ |
| 119 | Lying Spinal Twist | hold | 1 | ✅ | lying on back | Top | — | Yes | — | — | ⬜ |

---

## 3. Variations (Easier / Harder) †

**Rule (ADR-040):** a variation link may only point to an exercise that exists in the catalog. Adding exercises is not allowed (ADR-013), so the links below become **"none"**. In the app, the exercise guide shows "Easier" / "Harder" buttons only when a valid link exists.

| # | Exercise | Side | Catalog says | Resolved to |
|---|---|---|---|---|
| 15 | Leg Raise | Harder | Hanging equivalent n/a | none |
| 19 | Russian Twist | Harder | Weighted version | none |
| 20 | Forearm Plank | Easier | Knee Plank | none |
| 21 | Side Plank (each side) | Easier | Knee Side Plank | none |
| 21 | Side Plank (each side) | Harder | Side Plank Raise | none |
| 25 | Mountain Climber | Easier | Slow Mountain Climber | none |
| 25 | Mountain Climber | Harder | Cross-Body MC | none |
| 38 | Push-Up Hold | Easier | Knee Push-Up Hold | none |
| 39 | Plank to Push-Up | Easier | Knee version | none |
| 64 | Bodyweight Squat | Easier | Chair Squat | none |
| 67 | Wall Sit | Easier | Half Wall Sit | none |
| 67 | Wall Sit | Harder | Single-Leg | none |
| 68 | Forward Lunge | Easier | Static Lunge | none |
| 68 | Forward Lunge | Harder | Jump Lunge | none |
| 69 | Reverse Lunge | Easier | Static Lunge | none |
| 72 | Split Squat | Harder | Bulgarian (chair) | none |
| 80 | Good Morning | Harder | Single-Leg Deadlift | none |
| 81 | Step-Up (chair) | Easier | Low step | none |
| 81 | Step-Up (chair) | Harder | Higher step | none |

**Total:** 19 unresolved links across 14 exercises. Adding these variations as new exercises is a v1.1 candidate.

---

## 4. Quiet Mode Swaps †

The catalog promises that "every high-impact move has a quiet twin", but it defines twins for only 4 of the 9 jumping exercises. This table completes the list (ADR-041).

**Behaviour:** when **Quiet Mode** is on (Settings, default off), the player replaces each jumping exercise with its quiet swap, keeping the same time or reps, and shows a small "Quiet swap" label. Workouts marked quiet never contain jumping exercises in the first place.

| Jumping exercise | Quiet swap | Source |
|---|---|---|
| #83 Burpee | #82 Half Burpee (no jump) | Proposed † |
| #89 Plank Jack | #25 Mountain Climber | Proposed † |
| #91 Frog Jump | #65 Sumo Squat | Proposed † |
| #92 Jumping Jack | #93 Step Jack | Catalog |
| #94 High Knees | #95 Marching High Knees | Catalog |
| #96 Butt Kicks | #97 Heel Digs | Catalog |
| #98 Skater Hop | #99 Lateral Step | Catalog |
| #100 Squat Jump | #66 Squat Pulse | Proposed † |
| #101 Fast Feet | #95 Marching High Knees | Proposed † |

---

## 5. Rig Requirements: Base Poses, Views and Props †

The character rig (tasks T2.9–T2.11) must support these, otherwise some exercises cannot be animated correctly (ADR-042).

**Base poses**

| Base pose | Exercises | Count |
|---|---|---|
| standing | #1, #2, #3, #4, #5, #6, #7, #8, #28, #29, #30, #40, #43, #46, #47, #48, #52, #53, #64, #65, #66, #67, #68, #69, #70, #71, #72, #78, #79, #80, #81, #87, #91, #92, #93, #94, #95, #96, #97, #98, #99, #100, #101, #102, #103, #108, #110, #114, #115, #116 | 50 |
| plank | #20, #22, #25, #31, #32, #33, #34, #35, #36, #37, #38, #39, #41, #45, #49, #89 | 16 |
| lying on back | #11, #12, #13, #14, #15, #16, #17, #18, #23, #24, #26, #27, #62, #73, #74, #75, #109, #112, #118, #119 | 20 |
| lying on front | #54, #55, #56, #57, #58, #59, #60, #63, #105 | 9 |
| all fours | #9, #50, #61, #76, #77, #85, #117 | 7 |
| seated | #19, #44, #86, #107, #113 | 5 |
| side plank | #21 | 1 |
| kneeling | #104, #111 | 2 |
| inverted | #42, #51, #106 | 3 |
| standing → plank | #10, #82, #83, #84, #90 | 5 |
| lying → standing | #88 | 1 |

**Views**

| View | Meaning | Count |
|---|---|---|
| Side | Profile view; best for floor work, squats, lunges and push-ups | 79 |
| Front | Facing the camera; best for lateral and rotational moves | 33 |
| Top | Front-view figure lying on the floor, seen from above; for lying moves that go sideways | 7 |

**Props** (flat, neutral grey `#C9CCD1`, drawn behind the character)

| Prop | Exercises |
|---|---|
| Wall (balance, optional) | #5 Leg Swings (Front) · #6 Leg Swings (Side) · #79 Single-Leg Calf Raise · #110 Quad Stretch (each leg) |
| Wall | #30 Wall Push-Up · #43 Wall Angel · #51 Wall Handstand Hold · #67 Wall Sit |
| Chair | #31 Incline Push-Up · #36 Decline Push-Up · #44 Triceps Dip (chair/floor) · #81 Step-Up (chair) |
| Water bottles (optional) | #46 Front Raise · #47 Lateral Raise |
| Doorway | #114 Chest Doorway Stretch |
| Floor line / mat | Every exercise that touches the floor (drawn by default) |

---

## 6. Muscle Groups & Focus Mapping †

The muscle map needs a named SVG group for every muscle the catalog mentions. Spec v3 listed 14 groups, so 5 more are added (ADR-043).

| ID | Label | Map view | In spec v3 |
|---|---|---|---|
| `neck` | Neck | Front + back | New |
| `traps` | Trapezius | Front + back | Yes |
| `deltoids` | Shoulders (front and side) | Front | Yes |
| `rear_deltoids` | Rear shoulders | Back | New |
| `chest` | Chest | Front | Yes |
| `biceps` | Biceps | Front | Yes |
| `triceps` | Triceps | Back | Yes |
| `forearms` | Forearms | Front + back | Yes |
| `upper_back` | Upper back | Back | New |
| `lats` | Lats | Back | Yes |
| `erector_spinae` | Lower back | Back | Yes |
| `abs` | Abs | Front | Yes |
| `obliques` | Obliques | Front | Yes |
| `hip_flexors` | Hip flexors | Front | New |
| `glutes` | Glutes | Back | Yes |
| `adductors` | Inner thighs | Front | New |
| `quads` | Quadriceps | Front | Yes |
| `hamstrings` | Hamstrings | Back | Yes |
| `calves` | Calves | Front + back | Yes |

**Catalog focus words → muscle groups**

| Catalog word | Muscle groups |
|---|---|
| full body / cardio | quads, glutes, chest, deltoids, abs |
| shoulders | deltoids |
| traps | traps |
| hips | hip_flexors, glutes |
| hamstrings | hamstrings |
| adductors | adductors |
| abs | abs, obliques |
| core | abs, obliques |
| lower back / spine | erector_spinae |
| neck | neck |
| posture / rear delts | rear_deltoids, upper_back |
| upper back | upper_back |
| back | lats, erector_spinae |
| triceps | triceps |
| arms | biceps, triceps |
| chest | chest |
| quads | quads |
| hip flexors | hip_flexors |
| glutes | glutes |

Section defaults when the catalog gives no focus: Core & Abs → abs, obliques · Chest & Push → chest (+ triceps, deltoids) · Shoulders & Arms → deltoids, biceps, triceps · Back & Pull → upper_back, lats, erector_spinae, rear_deltoids · Legs & Glutes → quads, glutes, hamstrings, calves · Full Body and Cardio → the full-body set. Exact primary and secondary muscles per exercise are set in task T2.2.

---

## 7. Equipment Values †

Spec v3 only had `none | optional_dumbbell`, but the catalog uses chairs, walls, a doorway and water bottles (ADR-045).

| Value | Meaning | Exercises |
|---|---|---|
| `none` | Nothing needed | All others |
| `household` | Uses a wall, chair or doorway | #30, #31, #36, #43, #44, #51, #67, #81, #114 |
| `optional_weight` | Can hold water bottles for extra resistance | #46, #47 |

Challenge cards and filters count `household` as "No equipment".

---

## 8. Workouts

All 60 catalog workouts. Levels marked † are not in the catalog and are assumed (ADR-049). **Quiet:** "Yes" = only quiet-safe exercises; "Auto" = the generator decides from the exercises it picks. Challenge day workouts are generated separately and are **not** part of these 60.

| # | Workout | Group | Min | Lvl | Body focus | Goal | Type | Quiet | Discover tile(s) | Fixed placements |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Abs Beginner | Body Focus | 12 | 1 | abs | build_muscle | strength | Auto | Core | Body Focus rows (Training) |
| 2 | Abs Intermediate | Body Focus | 18 | 2 | abs | build_muscle | strength | Auto | Core | Body Focus rows (Training) |
| 3 | Abs Advanced | Body Focus | 25 | 3 | abs | build_muscle | strength | Auto | Core | Body Focus rows (Training) |
| 4 | Chest Beginner | Body Focus | 10 | 1 | chest | build_muscle | strength | Auto | Chest | Body Focus rows (Training) |
| 5 | Chest Intermediate | Body Focus | 16 | 2 | chest | build_muscle | strength | Auto | Chest | Body Focus rows (Training) |
| 6 | Chest Advanced | Body Focus | 22 | 3 | chest | build_muscle | strength | Auto | Chest | Body Focus rows (Training) |
| 7 | Arm Beginner | Body Focus | 10 | 1 | arm | build_muscle | strength | Auto | Arm & Shoulder | Body Focus rows (Training) |
| 8 | Arm Intermediate | Body Focus | 15 | 2 | arm | build_muscle | strength | Auto | Arm & Shoulder | Body Focus rows (Training) |
| 9 | Arm Advanced | Body Focus | 20 | 3 | arm | build_muscle | strength | Auto | Arm & Shoulder | Body Focus rows (Training) |
| 10 | Shoulder Beginner | Body Focus | 10 | 1 | shoulder | build_muscle | strength | Auto | Arm & Shoulder | Body Focus rows (Training) |
| 11 | Shoulder Intermediate | Body Focus | 15 | 2 | shoulder | build_muscle | strength | Auto | Arm & Shoulder | Body Focus rows (Training) |
| 12 | Shoulder Advanced | Body Focus | 20 | 3 | shoulder | build_muscle | strength | Auto | Arm & Shoulder | Body Focus rows (Training) |
| 13 | Back Beginner | Body Focus | 12 | 1 | back | build_muscle | strength | Auto | Back & Posture | Body Focus rows (Training) |
| 14 | Back Intermediate | Body Focus | 17 | 2 | back | build_muscle | strength | Auto | Back & Posture | Body Focus rows (Training) |
| 15 | Back Advanced | Body Focus | 22 | 3 | back | build_muscle | strength | Auto | Back & Posture | Body Focus rows (Training) |
| 16 | Leg Beginner | Body Focus | 12 | 1 | leg | build_muscle | strength | Auto | Butt & Leg | Body Focus rows (Training) |
| 17 | Leg Intermediate | Body Focus | 18 | 2 | leg | build_muscle | strength | Auto | Butt & Leg | Body Focus rows (Training) |
| 18 | Leg Advanced | Body Focus | 25 | 3 | leg | build_muscle | strength | Auto | Butt & Leg | Body Focus rows (Training) |
| 19 | Glutes Beginner | Body Focus | 12 | 1 | butt | build_muscle | strength | Auto | Butt & Leg | Body Focus rows (Training) |
| 20 | Glutes Intermediate | Body Focus | 18 | 2 | butt | build_muscle | strength | Auto | Butt & Leg | Body Focus rows (Training) |
| 21 | Glutes Advanced | Body Focus | 24 | 3 | butt | build_muscle | strength | Auto | Butt & Leg | Body Focus rows (Training) |
| 22 | Full Body Beginner | Body Focus | 15 | 1 | full_body | build_muscle | strength | Auto | Full Body | Body Focus rows (Training) |
| 23 | Full Body Intermediate | Body Focus | 22 | 2 | full_body | build_muscle | strength | Auto | Full Body | Body Focus rows (Training) |
| 24 | Full Body Advanced | Body Focus | 30 | 3 | full_body | build_muscle | strength | Auto | Full Body | Body Focus rows (Training) |
| 25 | 4-Minute Wake Up | Quick Workouts | 4 | 1 | full_body | keep_fit | warmup | Yes | — | Fast workout · Warm-Up filter |
| 26 | 5-Minute Morning Boost | Quick Workouts | 5 | 1 | full_body | keep_fit | hiit | Auto | Full Body | Fast workout · Collection C3 |
| 27 | 6-Minute Tabata | Quick Workouts | 6 | 2 | full_body | burn_fat | hiit | Auto | Full Body | Fast workout |
| 28 | 7-Minute Full Body | Quick Workouts | 7 | 2 | full_body | keep_fit | hiit | Auto | Full Body | Fast workout |
| 29 | 10-Minute Abs | Quick Workouts | 10 | 1 | abs | build_muscle | strength | Auto | Core | Fast workout |
| 30 | Fat Burning HIIT — Beginner | Burn Fat | 15 | 1 | full_body | burn_fat | hiit | Auto | Full Body | Collection C2 |
| 31 | Fat Burning HIIT — Intermediate | Burn Fat | 22 | 2 | full_body | burn_fat | hiit | Auto | Full Body | Collection C2 |
| 32 | Fat Burning HIIT — Advanced | Burn Fat | 28 | 3 | full_body | burn_fat | hiit | Auto | Full Body | Collection C2 |
| 33 | Low-Impact Fat Burn (No Jumping) | Burn Fat | 20 | 2 | full_body | burn_fat | hiit | Yes (required) | Full Body | Collection C2 |
| 34 | Total Body Burn | Burn Fat | 25 | 2 | full_body | burn_fat | hiit | Auto | Full Body | Collection C2 |
| 35 | Cardio Core Circuit | Burn Fat | 18 | 2 | abs | burn_fat | hiit | Auto | Core | Collection C2 |
| 36 | Upper Body Strength | Build Muscle | 20 | 2 | chest | build_muscle | strength | Auto | Chest · Arm & Shoulder | Collection C1 |
| 37 | Lower Body Strength | Build Muscle | 22 | 2 | leg | build_muscle | strength | Auto | Butt & Leg | Collection C1 |
| 38 | Push Strength (Chest/Shoulders/Triceps) | Build Muscle | 18 | 2 | chest | build_muscle | strength | Auto | Chest · Arm & Shoulder | Collection C1 |
| 39 | Pull & Posture (Back/Rear Delts) | Build Muscle | 18 | 2 | back | build_muscle | strength | Auto | Back & Posture | Collection C1 |
| 40 | Full Body Strength | Build Muscle | 28 | 3 | full_body | build_muscle | strength | Auto | Full Body | Collection C1 |
| 41 | Daily Move | Keep Fit | 10 | 1 | full_body | keep_fit | hiit | Yes | Full Body | Collection C3 |
| 42 | Office Break | Keep Fit | 8 | 1 | full_body | keep_fit | warmup | Yes | — | Collection C3 · Warm-Up filter |
| 43 | Evening Wind-Down | Keep Fit | 12 | 1 | full_body | keep_fit | cooldown | Yes | — | Collection C3 |
| 44 | Weekend Energizer | Keep Fit | 20 | 2 | full_body | keep_fit | hiit | Auto | Full Body | Collection C3 |
| 45 | Before Workout Warm-Up | Stretch & Warm-Up | 5 | 1 † | full_body | flexibility | warmup | Yes | — | Stretch & Warm Up · Discover Stretch · Warm-Up filter |
| 46 | Morning Warm-Up | Stretch & Warm-Up | 9 | 1 † | full_body | flexibility | warmup | Yes | — | Stretch & Warm Up · Discover Stretch · Warm-Up filter |
| 47 | Full Body Stretching | Stretch & Warm-Up | 11 | 1 † | full_body | flexibility | stretch | Yes | — | Stretch & Warm Up · Discover Stretch · Collection C4 |
| 48 | Upper Body Stretching | Stretch & Warm-Up | 13 | 1 † | shoulder | flexibility | stretch | Yes | — | Stretch & Warm Up · Discover Stretch |
| 49 | Lower Body Stretching | Stretch & Warm-Up | 15 | 1 † | leg | flexibility | stretch | Yes | — | Stretch & Warm Up · Discover Stretch |
| 50 | Back Stretching | Stretch & Warm-Up | 14 | 1 † | back | flexibility | stretch | Yes | Back & Posture | Stretch & Warm Up · Discover Stretch |
| 51 | Neck & Shoulder Tension Relief | Stretch & Warm-Up | 16 | 1 † | shoulder | flexibility | stretch | Yes | — | Stretch & Warm Up · Discover Stretch |
| 52 | Lower Back Relief | Stretch & Warm-Up | 15 | 1 † | back | flexibility | stretch | Yes | Back & Posture | Stretch & Warm Up · Discover Stretch · Collection C4 |
| 53 | Knee-Friendly Mobility | Stretch & Warm-Up | 14 | 1 † | leg | flexibility | stretch | Yes | — | Stretch & Warm Up · Discover Stretch · Collection C4 |
| 54 | Sleepy Time Stretching | Stretch & Warm-Up | 12 | 1 † | full_body | flexibility | cooldown | Yes | — | Stretch & Warm Up · Discover Stretch |
| 55 | Posture Reset | Stretch & Warm-Up | 10 | 1 † | back | flexibility | stretch | Yes | Back & Posture | Stretch & Warm Up · Discover Stretch · Collection C4 |
| 56 | Hip Mobility | Stretch & Warm-Up | 12 | 1 † | butt | flexibility | stretch | Yes | — | Stretch & Warm Up · Discover Stretch · Collection C4 |
| 57 | Quiet Apartment Workout | Special | 20 | 2 † | full_body | keep_fit | hiit | Yes (required) | Full Body | — |
| 58 | Arm Workout (No Push-Ups) | Special | 18 | 2 † | arm | build_muscle | strength | Auto | Arm & Shoulder | — |
| 59 | Chair-Assisted Workout | Special | 15 | 1 † | full_body | keep_fit | strength | Yes | Full Body | Uses chair exercises (#31, #44, #81) |
| 60 | Absolute Beginner Start | Special | 12 | 1 † | full_body | keep_fit | strength | Yes | Full Body | Discover featured for new users |

**Discover tile coverage:** Core 5 · Chest 5 · Arm & Shoulder 9 · Back & Posture 7 · Butt & Leg 7 · Full Body 17. Every tile has content.

---

## 9. Home & Discover Placement Rules

### 9.1 Training tab (13 sections)

| # | Section | Content rule |
|---|---|---|
| 1 | Header | App name + streak flame showing `streaks.current`; tapping the flame opens the Report tab |
| 2 | Search | Opens Search (workouts, exercises, challenges) |
| 3 | Weekly Goal | Week strip (Sunday–Saturday) and `profile.daysPerWeekTarget` |
| 4 | Challenge | "Customized for you" card first (by goal, §10), then the other challenges, shortest plans first; "More" → challenge list |
| 5 | Body Focus | 8 chips (Abs, Arm, Chest, Shoulder, Back, Leg, Butt, Full Body); each shows its 3 body-focus workouts |
| 6 | Quick filters | <7 mins · 7–15 mins · >15 mins (by duration) · Keep Fit, Build Muscle, Burn Fat (by goal) · Warm-Up (type `warmup`) |
| 7 | Custom Workout | "Create your own" card + the user's saved custom workouts |
| 8 | Recommended | The collection that matches the user's goal (§9.3) |
| 9 | Just For You | Ranked suggestions: matching level and goal, not done in the last 3 days, disliked exercises ranked lower. 2 rows; "More" → list |
| 10 | Stretch & Warm Up | The 12 Stretch & Warm-Up workouts; 2 cards shown; "More" → list of 12 |
| 11 | Popular Goals | Chips Build Muscle / Burn Fat / Keep Fit; top 3 workouts for that goal; "More" → goal list (challenges with that goal first as "N-day plan" rows, then workouts) |
| 12 | Explore more | Opens the Discover tab |
| 13 | Feedback | "Tell us what you need" → local note that can be exported |

### 9.2 Discover tab

| Section | Content rule |
|---|---|
| Header icons | Search · History (clock) → "Recent" list of completed workouts, newest first |
| Featured banner | New users (no sessions yet): Absolute Beginner Start. Otherwise a workout matching goal and level, rotating weekly |
| Picks for you | Same ranking as Just For You, excluding the two already shown on Training; 2-row horizontal pager |
| Collection banner | Collection C3 "Stay Active Every Day" (5 workouts) |
| For beginners | Level-1 workouts, shortest first; 3-up cards |
| Fast workout | The 5 Quick Workouts |
| Challenge | All 12 challenges as 3-up cards, shortest first |
| Stretch | The 12 Stretch & Warm-Up workouts in a 2-row horizontal grid |
| Body focus tiles | 6 tiles → category pages (tile column in §8) |

### 9.3 Collections †

Spec v3 mentions "a curated collection" but defines none, so 4 are proposed (ADR-044).

| ID | Collection | Goal | Workouts |
|---|---|---|---|
| C1 | Build Strength at Home | build_muscle | Upper Body Strength · Lower Body Strength · Push Strength (Chest/Shoulders/Triceps) · Pull & Posture (Back/Rear Delts) · Full Body Strength (5) |
| C2 | Burn More Calories | burn_fat | Fat Burning HIIT — Beginner · Fat Burning HIIT — Intermediate · Fat Burning HIIT — Advanced · Low-Impact Fat Burn (No Jumping) · Total Body Burn · Cardio Core Circuit (6) |
| C3 | Stay Active Every Day | keep_fit | 5-Minute Morning Boost · Daily Move · Office Break · Evening Wind-Down · Weekend Energizer (5) |
| C4 | Move Better | flexibility | Full Body Stretching · Lower Back Relief · Knee-Friendly Mobility · Posture Reset · Hip Mobility (5) |

---

## 10. Challenges

Goal tags, filter chips and the "Customized for you" rule are proposals (ADR-044). Challenge day workouts are generated from the rules in PRD §8.3.

| # | Challenge | Days | Focus | Daily time | Gradient | Kind | Goal | List filter chips | "Customized for you" when goal is |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Full Body Challenge | 28 | full body | 7–22 min | `blue` | Daily plan | build_muscle | Build Muscle · Full Body | Build muscle |
| 2 | Lose Weight Challenge | 30 | burn fat | 10–25 min | `orange` | Daily plan | burn_fat | Burn Fat · Full Body | Burn fat |
| 3 | Lower Body Challenge | 28 | legs & glutes | 8–20 min | `cyan` | Daily plan | build_muscle | Build Muscle | — |
| 4 | Core & Six Pack Challenge | 30 | abs | 7–20 min | `purple` | Daily plan | build_muscle | Build Muscle | — |
| 5 | Calisthenics Plan | 28 | strength | 12–25 min | `violet` | Daily plan | build_muscle | Build Muscle · Full Body | — |
| 6 | Upper Body Challenge | 28 | chest, arms, shoulders | 10–22 min | `slate` | Daily plan | build_muscle | Build Muscle | — |
| 7 | Beginner Start Challenge | 14 | full body, easy | 5–12 min | `green` | Daily plan | keep_fit | Full Body | Keep fit |
| 8 | Plank Challenge | 14 | core hold | 3–8 min | `teal` | Single-exercise ramp: Forearm Plank (#20) | build_muscle | Build Muscle | — |
| 9 | Push-Up Challenge | 14 | chest & triceps | 5–12 min | `red` | Single-exercise ramp: Knee Push-Up (#32) at level 1, Standard Push-Up (#33) at level 2+ † | build_muscle | Build Muscle | — |
| 10 | Squat Challenge | 14 | legs & glutes | 5–12 min | `amber` | Single-exercise ramp: Bodyweight Squat (#64) | build_muscle | Build Muscle | — |
| 11 | Flexibility & Mobility Challenge | 21 | stretch | 10–15 min | `mint` | Daily plan (stretch workouts) | flexibility | Flexibility | Flexibility |
| 12 | Posture & Stand Tall Challenge | 21 | posture, spine, core | 8–15 min | `indigo` | Daily plan (posture, mobility, core) | flexibility | Flexibility | — |

**Ramp baselines † (single-exercise challenges, ADR-050):** Plank 20 s × 3 sets · Push-Up 5 reps × 3 sets · Squat 10 reps × 3 sets. Each training day adds about 10% (rounded up to a whole second or rep); rest days keep the previous value. By day 14 this reaches about 2.6× the baseline and stays inside the catalog's daily time.

---

## 11. Achievements (35)

Conditions marked † interpret an ambiguous catalog name and need owner approval (ADR-046). Badge colours follow the group gradient.

| # | ID | Badge | Group (gradient) | Unlock condition |
|---|---|---|---|---|
| 1 | `first_workout` | First Workout | Getting started (`green`) | Complete 1 workout (≥ 50%) |
| 2 | `workouts_3` | 3 Workouts | Getting started (`green`) | Complete 3 workouts |
| 3 | `first_week_done` | First Week Done | Getting started (`green`) | Work out on 3 different days within 7 days of the first workout † |
| 4 | `first_challenge` | First Challenge Started | Getting started (`green`) | Complete Day 1 of any challenge † |
| 5 | `streak_3` | 3-Day Streak | Consistency (`orange`) | Streak reaches 3 |
| 6 | `streak_7` | 7-Day Streak | Consistency (`orange`) | Streak reaches 7 |
| 7 | `streak_14` | 14-Day Streak | Consistency (`orange`) | Streak reaches 14 |
| 8 | `streak_30` | 30-Day Streak | Consistency (`orange`) | Streak reaches 30 |
| 9 | `streak_60` | 60-Day Streak | Consistency (`orange`) | Streak reaches 60 |
| 10 | `days_100` | 100 Days Total | Consistency (`orange`) | Workouts on 100 different days |
| 11 | `workouts_10` | 10 Workouts | Volume (`blue`) | Complete 10 workouts |
| 12 | `workouts_25` | 25 Workouts | Volume (`blue`) | Complete 25 workouts |
| 13 | `workouts_50` | 50 Workouts | Volume (`blue`) | Complete 50 workouts |
| 14 | `workouts_100` | 100 Workouts | Volume (`blue`) | Complete 100 workouts |
| 15 | `workouts_250` | 250 Workouts | Volume (`blue`) | Complete 250 workouts |
| 16 | `minutes_60` | 60 Minutes Total | Time (`cyan`) | 60 total workout minutes |
| 17 | `minutes_300` | 300 Minutes | Time (`cyan`) | 300 total minutes |
| 18 | `minutes_600` | 600 Minutes | Time (`cyan`) | 600 total minutes |
| 19 | `minutes_1200` | 1,200 Minutes | Time (`cyan`) | 1,200 total minutes |
| 20 | `pushups_20` | 20 Push-Ups in a Set | Strength (`red`) | ≥ 20 reps in one set of any rep-based "…Push-Up" exercise (#30–37, #39, #41, #42) † |
| 21 | `squats_50` | 50 Squats in a Set | Strength (`red`) | ≥ 50 reps in one set of Bodyweight Squat (#64) or Sumo Squat (#65) † |
| 22 | `plank_60` | 60-Second Plank | Strength (`red`) | Hold Forearm Plank (#20) ≥ 60 s in one set |
| 23 | `plank_120` | 120-Second Plank | Strength (`red`) | Hold Forearm Plank (#20) ≥ 120 s in one set |
| 24 | `wallsit_30` | 30-Second Wall Sit | Strength (`red`) | Hold Wall Sit (#67) ≥ 30 s |
| 25 | `wallsit_90` | 90-Second Wall Sit | Strength (`red`) | Hold Wall Sit (#67) ≥ 90 s |
| 26 | `tried_25` | Tried 25 Exercises | Exploration (`violet`) | 25 different exercises done (not skipped) |
| 27 | `tried_50` | Tried 50 Exercises | Exploration (`violet`) | 50 different exercises done |
| 28 | `every_focus` | Completed a Workout from Every Body Focus | Exploration (`violet`) | At least one completed workout for each of the 8 body focuses |
| 29 | `custom_built` | Built a Custom Workout | Exploration (`violet`) | Save 1 custom workout |
| 30 | `challenge_14` | Completed a 14-Day Challenge | Challenges (`purple`) | Finish any challenge of 14 or 21 days † (the catalog has no badge for 21-day challenges) |
| 31 | `challenge_28` | Completed a 28/30-Day Challenge | Challenges (`purple`) | Finish any 28- or 30-day challenge |
| 32 | `goal_met` | Weekly Goal Met | Habits (`indigo`) | Reach the weekly goal once |
| 33 | `goal_4_weeks` | Weekly Goal Met 4 Weeks Running | Habits (`indigo`) | Reach the weekly goal 4 weeks in a row |
| 34 | `early_bird` | Early Bird | Habits (`indigo`) | Finish a workout before 08:00 local time |
| 35 | `night_owl` | Night Owl | Habits (`indigo`) | Finish a workout after 21:00 local time |

---

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version, generated from the content catalog during the completeness audit |
