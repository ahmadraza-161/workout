// Original, descriptive copy for the 60 catalog workouts and 12 challenges.
// Keep promises modest: the title may reflect a goal, but an intro describes
// the actual kind of movement rather than promising a body change or cure.

const WORKOUT_INTROS: Record<string, string> = {
  abs_beginner: 'Start with approachable floor and standing core moves, taking time to learn each position.',
  abs_intermediate: 'Build on familiar core moves with longer efforts and more changes of position.',
  abs_advanced: 'A longer core session with demanding holds and controlled repetitions.',
  chest_beginner: 'Practice chest-focused presses at a manageable pace, with time to reset your form.',
  chest_intermediate: 'Mix pressing angles and holds while keeping each repetition controlled.',
  chest_advanced: 'Work through a longer sequence of challenging push-up variations and holds.',
  arm_beginner: 'Introduce arm and shoulder movements with short, steady sets.',
  arm_intermediate: 'Alternate arm and shoulder exercises for a fuller upper-body session.',
  arm_advanced: 'Use longer sets of arm and shoulder work while keeping the movement deliberate.',
  shoulder_beginner: 'Explore simple shoulder movements and keep your range comfortable.',
  shoulder_intermediate: 'Combine shoulder raises, presses and holds with controlled transitions.',
  shoulder_advanced: 'Take on a longer shoulder-focused session with more demanding positions.',
  back_beginner: 'Practice gentle back and shoulder-blade movements with a steady trunk.',
  back_intermediate: 'Move between back extensions, reaches and holds without rushing the range.',
  back_advanced: 'A longer back-focused sequence that asks for steady form through each set.',
  leg_beginner: 'Start with basic lower-body movements and use a comfortable depth.',
  leg_intermediate: 'Mix squats, lunges and calf work at a pace you can control.',
  leg_advanced: 'Work through a longer mix of lower-body patterns with measured rests.',
  glutes_beginner: 'Learn hip-focused movements on the floor and while standing.',
  glutes_intermediate: 'Alternate bridges, leg lifts and standing work while keeping the hips steady.',
  glutes_advanced: 'A longer hip-focused session with more repetitions and varied positions.',
  full_body_beginner: 'Meet a mix of upper-body, lower-body and core movements at an easy starting pace.',
  full_body_intermediate: 'Rotate through several movement patterns with time to regain your breath.',
  full_body_advanced: 'A longer whole-body sequence with challenging efforts and shorter breaks.',
  '4_minute_wake_up': 'A brief set of gentle mobility moves to begin moving for the day.',
  '5_minute_morning_boost': 'A short mix of active movements and a finishing stretch.',
  '6_minute_tabata': 'A compact interval session with quick efforts and short rests.',
  '7_minute_full_body': 'Move between standing and floor exercises in a brief whole-body circuit.',
  '10_minute_abs': 'A short core-focused session with controlled repetitions and holds.',
  fat_burning_hiit_beginner: 'Try a beginner-paced interval circuit with standing moves and short rests.',
  fat_burning_hiit_intermediate: 'Alternate brisk whole-body movements with brief recovery periods.',
  fat_burning_hiit_advanced: 'A longer interval circuit with demanding movements and short breaks.',
  low_impact_fat_burn_no_jumping: 'Keep the pace moving through a whole-body circuit without jumping exercises.',
  total_body_burn: 'Rotate through standing and floor work across the whole body.',
  cardio_core_circuit: 'Switch between faster cardio intervals and core-focused exercises.',
  upper_body_strength: 'Work through chest, shoulder and arm movements with controlled presses and holds.',
  lower_body_strength: 'Mix squats, lunges, hip work and calf raises in one lower-body session.',
  push_strength_chest_shoulders_triceps: 'Focus on presses and holds for the chest, shoulders and triceps.',
  pull_posture_back_rear_delts: 'Practice back and rear-shoulder movements with a comfortable range.',
  full_body_strength: 'Train several movement patterns with measured sets across the whole body.',
  daily_move: 'Fit a varied whole-body movement session into a short part of your day.',
  office_break: 'Use standing mobility and light movement during a break from sitting.',
  evening_wind_down: 'Slow the pace with gentle holds for several areas of the body.',
  weekend_energizer: 'Take time for a varied circuit of active whole-body movements.',
  before_workout_warm_up: 'Ease into movement with simple joint circles, marching and a walkout.',
  morning_warm_up: 'Start with a longer round of gentle standing and floor mobility.',
  full_body_stretching: 'Move through comfortable stretches for the upper and lower body.',
  upper_body_stretching: 'Spend time on gentle chest, arm, neck and upper-back stretches.',
  lower_body_stretching: 'Hold comfortable stretches around the hips, thighs and calves.',
  back_stretching: 'Move gently through back and hip stretches without forcing the range.',
  neck_shoulder_tension_relief: 'Explore gentle neck, shoulder and upper-body stretches at an easy pace.',
  lower_back_relief: 'Take a gentle route through back and hip positions, staying within a comfortable range.',
  knee_friendly_mobility: 'Use low-impact stretches with no jumping or deep squat work.',
  sleepy_time_stretching: 'Finish the day with slow, comfortable holds and unhurried transitions.',
  posture_reset: 'Practice comfortable chest, back and shoulder stretches after a long day.',
  hip_mobility: 'Explore gentle hip and leg stretches with room to adjust each position.',
  quiet_apartment_workout: 'Keep moving through a no-jump circuit designed for a quieter space.',
  arm_workout_no_push_ups: 'Train arms and shoulders with raises, holds and triceps work instead of push-ups.',
  chair_assisted_workout: 'Use a stable chair for selected movements alongside simple standing exercises.',
  absolute_beginner_start: 'Begin with familiar, level-one movements and take breaks whenever needed.',
};

const CHALLENGE_DESCRIPTIONS: Record<string, string> = {
  full_body_challenge: 'Follow a four-week plan of varied whole-body workouts, with rest days built in.',
  lose_weight_challenge: 'Follow a month of movement sessions and rest days; progress is about consistency, not a promised weight change.',
  lower_body_challenge: 'Work through a four-week sequence of leg and hip-focused sessions with scheduled rest days.',
  core_six_pack_challenge: 'Practice core-focused sessions across the month, alternating effort and recovery.',
  calisthenics_plan: 'Build a routine of bodyweight sessions over four weeks, with time to recover between harder days.',
  upper_body_challenge: 'Follow four weeks of upper-body sessions covering presses, arm work and shoulder movements.',
  beginner_start_challenge: 'Try two weeks of short workouts with rest days to make starting more manageable.',
  plank_challenge: 'Practice forearm-plank holds on training days, gradually increasing the target with rest days between.',
  push_up_challenge: 'Begin with knee push-ups, then progress to standard push-ups as the plan advances.',
  squat_challenge: 'Practice bodyweight squats on training days with gradually increasing targets and scheduled rest.',
  flexibility_mobility_challenge: 'Follow three weeks of stretching and mobility sessions, moving only within a comfortable range.',
  posture_stand_tall_challenge: 'Explore back, shoulder and core movement over three weeks without forcing a particular posture.',
};

export function workoutIntroFor(slug: string): string {
  const intro = WORKOUT_INTROS[slug];
  if (!intro) throw new Error(`Workout intro missing: ${slug}`);
  return intro;
}

export function challengeDescriptionFor(slug: string): string {
  const description = CHALLENGE_DESCRIPTIONS[slug];
  if (!description) throw new Error(`Challenge description missing: ${slug}`);
  return description;
}

export const workoutCopySlugs = (): string[] => Object.keys(WORKOUT_INTROS);
export const challengeCopySlugs = (): string[] => Object.keys(CHALLENGE_DESCRIPTIONS);
