// Original English exercise-guide copy. Each row supplies a specific setup,
// movement and form error; the matching pattern supplies shared safe cues.
// Keep these sentences descriptive and avoid medical or outcome claims.

type Pattern = 'mobility' | 'core' | 'coreHold' | 'plank' | 'plankMove' | 'isometric' | 'backHold' |
  'wallSit' | 'push' | 'upper' | 'back' | 'squat' | 'lunge' | 'bridge' | 'hip' |
  'hinge' | 'cardio' | 'jump' | 'stretch' | 'balance';

type Seed = readonly [pattern: Pattern, setup: string, movement: string, mistake: string];

export interface GuideCopy {
  instructions: string[];
  mistakes: string[];
  breathing: string[];
}

const PATTERNS: Record<Pattern, { finish: string; mistakes: [string, string]; breathing: [string, string, string] }> = {
  mobility: {
    finish: 'Move only through a comfortable range, then return slowly to the start.',
    mistakes: ['Moving so fast that the joints lose control.', 'Forcing the range instead of easing into it.'],
    breathing: ['Begin with an easy breath in.', 'Breathe out during the moving part.', 'Breathe in as you return; do not hold your breath.'],
  },
  core: {
    finish: 'Return with control while keeping the trunk steady.',
    mistakes: ['Using momentum instead of the abdominal muscles.', 'Letting the lower back move farther than you can control.'],
    breathing: ['Breathe in before each repetition.', 'Breathe out during the effort or reach.', 'Breathe in as you return with control.'],
  },
  coreHold: {
    finish: 'Hold only while the lower back stays comfortable, then release slowly.',
    mistakes: ['Reaching the head forward instead of keeping the neck relaxed.', 'Tensing the neck or holding the breath.'],
    breathing: ['Take a calm breath before lifting.', 'Keep breathing through the hold.', 'Release and rest if you cannot breathe comfortably.'],
  },
  plank: {
    finish: 'Hold a steady line for the target time, then lower gently.',
    mistakes: ['Letting the hips sag or rise well above the shoulders.', 'Tensing the neck or shrugging the shoulders.'],
    breathing: ['Take a calm breath before lifting.', 'Keep breathing steadily during the hold.', 'Avoid holding your breath as you brace.'],
  },
  plankMove: {
    finish: 'Return to a steady plank before the next repetition.',
    mistakes: ['Letting the hips sag as the arms move.', 'Turning the pelvis instead of keeping the trunk steady.'],
    breathing: ['Breathe in as you set the plank.', 'Breathe out during the arm movement.', 'Breathe in as you reset without holding your breath.'],
  },
  isometric: {
    finish: 'Hold gentle tension for the target time, then release gradually.',
    mistakes: ['Tensing the neck and shoulders unnecessarily.', 'Forcing the joints into an uncomfortable position.'],
    breathing: ['Take a calm breath before the hold.', 'Breathe steadily while applying tension.', 'Do not hold your breath during the effort.'],
  },
  wallSit: {
    finish: 'Hold at a comfortable depth, then stand up slowly.',
    mistakes: ['Letting the knees collapse inward.', 'Lifting the heels off the floor.'],
    breathing: ['Breathe in before lowering.', 'Keep breathing during the hold.', 'Breathe out as you stand up.'],
  },
  push: {
    finish: 'Press back to the start at a pace you can control.',
    mistakes: ['Letting the hips sag instead of moving as one unit.', 'Flaring the elbows excessively or shrugging the shoulders.'],
    breathing: ['Breathe in as you lower.', 'Breathe out as you press away.', 'Keep breathing between repetitions.'],
  },
  upper: {
    finish: 'Lower or release slowly before the next repetition.',
    mistakes: ['Swinging the arms or using body momentum.', 'Shrugging the shoulders toward the ears.'],
    breathing: ['Breathe in at the starting position.', 'Breathe out during the effort.', 'Breathe in as you return without holding your breath.'],
  },
  back: {
    finish: 'Return to the start with control and keep the neck in line with the spine.',
    mistakes: ['Throwing the head back to lift higher.', 'Rushing the movement instead of using the back and shoulder muscles.'],
    breathing: ['Breathe in before you move.', 'Breathe out as you lift or reach.', 'Breathe in as you return to the starting position.'],
  },
  backHold: {
    finish: 'Hold gentle tension, then return to the start slowly.',
    mistakes: ['Tensing the neck to lift or pull farther.', 'Holding the breath while the back works.'],
    breathing: ['Breathe in before creating tension.', 'Continue breathing while holding.', 'Breathe out as you release.'],
  },
  squat: {
    finish: 'Press through the feet to stand tall without locking the knees hard.',
    mistakes: ['Letting the knees collapse inward.', 'Lifting the heels or rounding the lower back.'],
    breathing: ['Breathe in as you lower.', 'Breathe out as you stand or rise.', 'Keep the breath moving between repetitions.'],
  },
  lunge: {
    finish: 'Push through the working foot to return, then change legs as directed.',
    mistakes: ['Letting the front knee fall inward.', 'Taking a step so short that balance and control are lost.'],
    breathing: ['Breathe in while lowering.', 'Breathe out while standing back up.', 'Pause for a normal breath if balance is difficult.'],
  },
  bridge: {
    finish: 'Lower the hips slowly before repeating or changing sides.',
    mistakes: ['Arching the lower back to lift higher.', 'Pushing through the toes while the heels lift.'],
    breathing: ['Breathe in at the bottom.', 'Breathe out as the hips lift.', 'Breathe in as you lower without holding your breath.'],
  },
  hip: {
    finish: 'Lower the working leg slowly before repeating or changing sides.',
    mistakes: ['Shifting all the weight onto one supporting hand.', 'Letting the neck drop toward the floor.'],
    breathing: ['Breathe in at the start.', 'Breathe out as the leg lifts.', 'Breathe in as you lower with control.'],
  },
  hinge: {
    finish: 'Drive through the feet and return to a tall standing position.',
    mistakes: ['Rounding the back instead of hinging at the hips.', 'Moving faster than you can keep the torso controlled.'],
    breathing: ['Breathe in as you hinge.', 'Breathe out as you stand.', 'Avoid holding your breath during the effort.'],
  },
  cardio: {
    finish: 'Keep a pace that lets you change direction with control.',
    mistakes: ['Losing posture as the pace increases.', 'Moving so quickly that the steps or arm motions lose control.'],
    breathing: ['Start with a relaxed breathing rhythm.', 'Breathe continuously as the pace increases.', 'Slow the pace if you cannot keep breathing comfortably.'],
  },
  jump: {
    finish: 'Land softly with knees bent and reset before the next repetition.',
    mistakes: ['Jumping farther or higher than you can land quietly.', 'Letting the upper body collapse on landing.'],
    breathing: ['Start with a relaxed breathing rhythm.', 'Breathe out during the jump or step.', 'Keep breathing normally as you land and reset.'],
  },
  stretch: {
    finish: 'Hold a gentle stretch without bouncing, then ease out slowly.',
    mistakes: ['Pulling into a painful range.', 'Bouncing or forcing the stretch.'],
    breathing: ['Breathe in as you find the position.', 'Breathe out as you soften into the stretch.', 'Keep taking slow, comfortable breaths during the hold.'],
  },
  balance: {
    finish: 'Return to the start slowly and use stable support when needed.',
    mistakes: ['Rushing while balance is unsteady.', 'Leaning on an unstable chair or wall fixture.'],
    breathing: ['Breathe in before moving.', 'Breathe out during the effort.', 'Keep breathing normally while you steady yourself.'],
  },
};

const SEEDS: Record<string, Seed> = {
  march_in_place: ['cardio', 'Stand tall with your feet hip-width apart and arms relaxed.', 'Lift one knee, lower it, then alternate knees while swinging the opposite arm.', 'Leaning backward as the knees rise.'],
  arm_circles: ['mobility', 'Stand tall and extend both arms out to the sides.', 'Draw small circles with the arms, then reverse direction.', 'Making the circles so large that the shoulders feel strained.'],
  shoulder_rolls: ['mobility', 'Stand or sit tall with arms relaxed at your sides.', 'Lift the shoulders gently, roll them back and down, then change direction.', 'Lifting the shoulders forcefully toward the ears.'],
  hip_circles: ['mobility', 'Stand with feet hip-width apart and hands on the hips.', 'Circle the hips slowly in one direction, then reverse.', 'Twisting the knees sharply while the hips circle.'],
  leg_swings_front: ['balance', 'Stand beside a stable wall and hold it lightly for balance.', 'Swing one leg forward and back in a small controlled arc, then switch legs.', 'Swinging so high that the lower back arches.'],
  leg_swings_side: ['balance', 'Face a stable wall and hold it lightly with both hands.', 'Swing one leg across and out to the side without rotating the trunk, then switch.', 'Turning the whole torso to make the swing larger.'],
  torso_twist: ['mobility', 'Stand with feet hip-width apart and knees soft.', 'Rotate the upper body gently left and right while the hips mostly face forward.', 'Forcing the neck or lower back through a large twist.'],
  neck_rolls: ['mobility', 'Stand or sit tall with shoulders relaxed.', 'Tilt the head gently to one side, move through a small front arc, then to the other side.', 'Dropping the head far backward or forcing a full circle.'],
  cat_cow: ['mobility', 'Start on hands and knees with wrists under shoulders and knees under hips.', 'Round the back gently, then lengthen the spine and lift the chest slightly.', 'Throwing the head back or pushing into a painful arch.'],
  inchworm_walkout: ['core', 'Stand tall, soften the knees and fold toward the floor.', 'Walk the hands forward to a strong plank, then walk them back and stand.', 'Letting the hips sag when the hands reach plank.'],
  crunch: ['core', 'Lie on your back with knees bent and feet planted.', 'Lift the shoulder blades a short distance using the abdomen, then lower.', 'Pulling the head forward with the hands.'],
  reverse_crunch: ['core', 'Lie on your back with knees bent over the hips.', 'Curl the pelvis gently toward the ribs, lifting the hips slightly, then lower.', 'Swinging the legs to gain momentum.'],
  bicycle_crunch: ['core', 'Lie on your back with hands lightly beside the head and knees raised.', 'Rotate one shoulder toward the opposite knee while extending the other leg, then alternate.', 'Yanking the neck with the hands.'],
  sit_up: ['core', 'Lie on your back with knees bent and feet on the floor.', 'Roll the trunk up toward the knees with control, then lower slowly.', 'Jerking the body upward with momentum.'],
  leg_raise: ['core', 'Lie on your back with legs long and hands by your sides.', 'Raise the legs together only as far as you can keep the lower back controlled, then lower.', 'Lowering the legs until the lower back lifts sharply from the floor.'],
  flutter_kick: ['core', 'Lie on your back with legs extended and the lower back comfortable.', 'Lift the legs slightly and alternate small up-and-down kicks.', 'Making large kicks that pull the lower back off the floor.'],
  scissor_kick: ['core', 'Lie on your back with long legs lifted slightly.', 'Cross one leg over the other in small alternating motions.', 'Swinging the legs so far that the pelvis rocks.'],
  heel_touch: ['core', 'Lie on your back with knees bent and feet close enough to reach toward.', 'Lift the shoulders slightly and reach side to side toward each heel.', 'Pulling on the neck or swinging the trunk.'],
  russian_twist: ['core', 'Sit with knees bent, feet supported and chest lifted.', 'Rotate the ribs gently from side to side while keeping the spine long.', 'Rounding the back and throwing the arms across the body.'],
  forearm_plank: ['plank', 'Place forearms on the floor with elbows under the shoulders.', 'Step the feet back and lift into a straight line from head to heels.', 'Letting the lower back sag while the elbows drift ahead.'],
  side_plank_each_side: ['plank', 'Lie on one side with the supporting elbow under the shoulder.', 'Lift the hips until the body forms a long line; repeat on the other side.', 'Allowing the supporting shoulder to collapse toward the ear.'],
  plank_shoulder_tap: ['plankMove', 'Start in a high plank with hands under shoulders and feet a little apart.', 'Tap one shoulder with the opposite hand, replace it, then alternate.', 'Rocking the hips widely from side to side.'],
  dead_bug: ['core', 'Lie on your back with hips and knees bent and arms reaching up.', 'Lower one arm and the opposite leg slowly, return, then alternate sides.', 'Arching the lower back as the leg extends.'],
  hollow_hold: ['coreHold', 'Lie on your back and gently draw the ribs toward the pelvis.', 'Lift the shoulders and legs only as far as the lower back stays controlled.', 'Reaching the legs too low and losing lower-back control.'],
  mountain_climber: ['cardio', 'Begin in a high plank with hands below the shoulders.', 'Drive one knee toward the chest, replace it, then alternate at a steady pace.', 'Bouncing the hips high as the feet switch.'],
  v_up: ['core', 'Lie long on your back with arms overhead and legs together.', 'Lift arms and legs toward each other, then lower with control.', 'Throwing the arms forward to yank the trunk up.'],
  toe_touch_crunch: ['core', 'Lie on your back with legs reaching toward the ceiling.', 'Lift the shoulder blades and reach toward the toes, then lower.', 'Pulling the head forward to reach higher.'],
  cross_touch_and_reach: ['mobility', 'Stand tall with feet wider than hips and arms out.', 'Hinge and reach one hand toward the opposite foot, then rise and reach upward; alternate.', 'Twisting the knees or forcing the hand all the way to the foot.'],
  standing_oblique_crunch: ['core', 'Stand tall with hands lightly beside the head.', 'Lift one knee toward the same-side elbow by shortening the side of the trunk, then alternate.', 'Pulling the head downward to meet the knee.'],
  wall_push_up: ['push', 'Face a stable wall with hands at chest height and feet stepped back.', 'Bend the elbows to bring the chest toward the wall while the body stays straight.', 'Letting the head reach the wall before the chest.'],
  incline_push_up: ['push', 'Place hands on a stable, non-slip chair or surface and walk the feet back.', 'Lower the chest toward the support by bending the elbows.', 'Using a chair that can slide or tip.'],
  knee_push_up: ['push', 'Set hands below the shoulders and keep knees on a padded floor.', 'Lower the chest while the trunk stays aligned from head to knees.', 'Bending at the hips instead of lowering the whole trunk.'],
  standard_push_up: ['push', 'Start in a high plank with hands just wider than the shoulders.', 'Bend the elbows and lower the chest while keeping a long body line.', 'Letting the chin lead while the chest stays high.'],
  wide_push_up: ['push', 'Place hands wider than shoulder width in a firm high plank.', 'Lower the chest between the hands with elbows moving comfortably outward.', 'Placing the hands so wide that the shoulders lose control.'],
  diamond_push_up: ['push', 'Place hands close together under the chest in a strong high plank.', 'Bend the elbows close to the body and lower only as far as control allows.', 'Forcing the wrists into an uncomfortable angle.'],
  decline_push_up: ['push', 'Place feet on a stable, non-slip low support and hands on the floor.', 'Keep a firm plank while lowering the chest toward the floor.', 'Using a support that moves or lifting the hips high.'],
  archer_push_up: ['push', 'Start in a wide high plank with feet spread for balance.', 'Bend one arm while the other stays longer, shift toward the bending side, then alternate.', 'Dropping suddenly onto the working shoulder.'],
  push_up_hold: ['plank', 'Set up in a high plank with hands beneath the shoulders.', 'Bend the elbows slightly and hold the body rigid at a comfortable depth.', 'Lowering so far that the shoulders or wrists lose control.'],
  plank_to_push_up: ['plankMove', 'Begin on the forearms in a firm plank.', 'Place one hand down, then the other to rise into high plank; lower one forearm at a time.', 'Swinging the hips widely as the arms change level.'],
  chest_squeeze_isometric: ['isometric', 'Stand or sit tall with palms pressed together in front of the chest.', 'Press the palms together gently and hold without lifting the shoulders.', 'Pressing so hard that the wrists bend or the neck tenses.'],
  shoulder_tap_push_up: ['push', 'Begin in a high plank with feet apart for balance.', 'Complete one controlled push-up, then tap each opposite shoulder without twisting the hips.', 'Rushing the taps and losing the plank line.'],
  pike_push_up: ['push', 'Place hands on the floor and lift the hips to form an inverted V.', 'Bend the elbows to lower the head between the hands, then press up.', 'Letting the elbows flare far out while the neck collapses.'],
  wall_angel: ['mobility', 'Stand with back near a wall, knees soft and ribs relaxed.', 'Slide bent arms up and down the wall within a comfortable shoulder range.', 'Arching the lower back to force the hands against the wall.'],
  triceps_dip_chair_floor: ['push', 'Use a stable chair against a wall or place hands on the floor behind the hips.', 'Bend the elbows a little to lower the hips, then press back up.', 'Dropping too deep and forcing the shoulders behind the body.'],
  floor_triceps_extension: ['push', 'Start on hands and knees with hands ahead of the shoulders.', 'Bend the elbows to bring forearms toward the floor, then press through the palms.', 'Letting elbows splay far apart.'],
  front_raise: ['upper', 'Stand tall holding light water bottles with palms facing the thighs.', 'Raise the arms forward to a comfortable shoulder height, then lower.', 'Leaning backward to lift the bottles.'],
  lateral_raise: ['upper', 'Stand tall with light bottles by the sides and elbows soft.', 'Raise the arms out to the sides to a comfortable height, then lower.', 'Shrugging to pull the bottles higher.'],
  overhead_press_isometric: ['isometric', 'Stand tall with elbows bent and hands beside the shoulders.', 'Press the palms upward against an imagined resistance and hold with ribs down.', 'Arching the lower back while reaching overhead.'],
  plank_up_down: ['plankMove', 'Begin in a forearm plank with the feet apart for balance.', 'Press onto one hand and then the other, then lower to the forearms and switch lead arm.', 'Rotating the hips strongly with every arm change.'],
  bear_hold: ['plank', 'Start on hands and knees with wrists under shoulders.', 'Lift the knees a little above the floor while keeping the back level.', 'Raising the hips into a pike instead of hovering.'],
  wall_handstand_hold: ['balance', 'Use a stable wall and clear, non-slip floor; begin only if you can control the setup.', 'Place hands shoulder-width apart and bring the feet onto the wall to a manageable height.', 'Kicking up without control or forcing weight into painful wrists.'],
  punches: ['cardio', 'Stand with soft knees and hands in front of the face.', 'Extend alternating arms forward, then bring each hand back to guard.', 'Snapping the elbows hard at full reach.'],
  arm_pulse: ['upper', 'Stand tall with arms extended sideways and elbows soft.', 'Make small controlled pulses without lifting the shoulders.', 'Swinging the arms in large, fast arcs.'],
  superman_hold: ['backHold', 'Lie face down with arms reaching forward and legs long.', 'Lift arms and legs a small distance while keeping the gaze down, then hold.', 'Throwing the head upward to lift higher.'],
  superman_raise: ['back', 'Lie face down with arms reaching forward and legs long.', 'Lift arms and legs gently, pause, then lower to the floor.', 'Jerking the limbs high instead of making a small controlled lift.'],
  reverse_snow_angel: ['back', 'Lie face down with arms near the hips and palms facing the floor.', 'Lift the hands slightly and sweep the arms outward and overhead, then return.', 'Arching the lower back to move the arms.'],
  prone_y_raise: ['back', 'Lie face down with arms angled overhead in a Y shape.', 'Lift the hands a short distance by drawing the shoulder blades down and back.', 'Shrugging the shoulders up toward the ears.'],
  prone_t_raise: ['back', 'Lie face down with arms extended sideways in a T shape.', 'Lift the hands slightly while keeping the forehead close to the floor.', 'Turning the lift into a large lower-back arch.'],
  prone_w_raise: ['back', 'Lie face down with elbows bent to form a W beside the body.', 'Lift the hands and elbows slightly while drawing the shoulder blades together.', 'Pushing the chin forward to lift higher.'],
  swimmer: ['back', 'Lie face down with arms forward and legs extended.', 'Lift one arm and the opposite leg gently, lower, then switch sides.', 'Swinging the trunk from side to side.'],
  bird_dog: ['back', 'Start on hands and knees with the spine long.', 'Reach one arm and the opposite leg away, pause, then return and alternate.', 'Rotating the hips or over-arching the back.'],
  floor_row_isometric: ['backHold', 'Sit tall on the floor with legs comfortable and elbows beside the ribs.', 'Pull the elbows backward against an imagined resistance and hold gently.', 'Shrugging the shoulders while pulling the elbows.'],
  back_extension: ['back', 'Lie face down with hands lightly beside the head or chest.', 'Lift the chest a small amount using the back muscles, then lower.', 'Pushing forcefully with the hands or throwing the head back.'],
  bodyweight_squat: ['squat', 'Stand with feet about shoulder-width apart and toes turned out slightly.', 'Send the hips back and bend the knees to a comfortable depth.', 'Allowing the knees to collapse inward as you lower.'],
  sumo_squat: ['squat', 'Stand wider than shoulder width with toes turned out comfortably.', 'Lower the hips between the legs while the knees track in the direction of the toes.', 'Turning the feet too far out and twisting the knees.'],
  squat_pulse: ['squat', 'Lower into a comfortable squat with feet planted.', 'Move the hips a short distance up and down while keeping the trunk steady.', 'Bouncing at the bottom of the squat.'],
  wall_sit: ['wallSit', 'Lean against a stable wall with feet stepped forward.', 'Slide down until the knees are bent at a comfortable angle and hold.', 'Placing the feet too close to the wall or forcing a deep knee bend.'],
  forward_lunge: ['lunge', 'Stand tall with feet hip-width apart.', 'Step forward and bend both knees to a controlled depth.', 'Landing with both feet on one narrow line and losing balance.'],
  reverse_lunge: ['lunge', 'Stand tall with feet hip-width apart.', 'Step one foot back and lower both knees gently, then return.', 'Leaning far forward or dropping the rear knee hard.'],
  lateral_lunge: ['lunge', 'Stand with feet together and space to step sideways.', 'Step to one side, bend that knee and push the hips back while the other leg stays long.', 'Letting the bending knee collapse inward.'],
  curtsy_lunge: ['lunge', 'Stand tall with enough room behind you.', 'Step one leg diagonally behind the other and lower only as far as the knees feel comfortable.', 'Crossing so far that the front knee twists.'],
  split_squat: ['lunge', 'Stand in a staggered stance with feet apart side to side for balance.', 'Bend both knees to lower straight down, then rise through the front foot.', 'Placing both feet on a tight line and wobbling.'],
  glute_bridge: ['bridge', 'Lie on your back with knees bent and feet hip-width apart.', 'Press through the heels and lift the hips until the trunk aligns with the thighs.', 'Overarching the lower back at the top.'],
  single_leg_glute_bridge: ['bridge', 'Lie on your back with one foot planted and the other leg lifted comfortably.', 'Press through the planted heel to raise the hips, then lower and change sides.', 'Letting the pelvis tip sharply toward the lifted leg.'],
  floor_hip_thrust: ['bridge', 'Sit on the floor with knees bent and hands behind you for support.', 'Press through the feet and lift the hips into a tabletop-like position.', 'Throwing the head backward as the hips rise.'],
  donkey_kick: ['hip', 'Start on hands and knees with the back level.', 'Keep one knee bent and lift that foot toward the ceiling without twisting the hips.', 'Arching the lower back to lift the leg higher.'],
  fire_hydrant: ['hip', 'Start on hands and knees with wrists under shoulders.', 'Lift one bent knee out to the side a small distance, then lower and switch.', 'Rolling the whole pelvis to raise the knee.'],
  calf_raise: ['balance', 'Stand tall with feet hip-width apart and a wall nearby if needed.', 'Rise onto the balls of both feet, pause, then lower the heels slowly.', 'Rolling the ankles outward while lifting.'],
  single_leg_calf_raise: ['balance', 'Stand beside a stable wall and lift one foot from the floor.', 'Rise on the working foot, pause, lower slowly, then change legs.', 'Letting the standing ankle roll outward.'],
  good_morning: ['hinge', 'Stand with feet hip-width apart and knees slightly soft.', 'Push the hips back while the torso tips forward with a long spine.', 'Rounding the back to reach farther down.'],
  step_up_chair: ['balance', 'Use a low, stable, non-slip step or chair that cannot tip.', 'Step up through one foot, stand tall, then step down carefully and alternate.', 'Pushing off the floor with the trailing leg instead of controlling the lead leg.'],
  half_burpee_no_jump: ['cardio', 'Stand tall with feet apart and room to move.', 'Squat down, place hands on the floor, step the feet back to plank, then step in and stand.', 'Dropping the hips into a sagging plank.'],
  burpee: ['cardio', 'Stand with space around you and feet hip-width apart.', 'Lower the hands, move the feet back to plank, bring them forward and stand or jump lightly.', 'Landing with locked knees or losing plank control.'],
  squat_thrust: ['cardio', 'Start standing with feet apart and knees soft.', 'Place hands down, move the feet back to plank, then bring them forward and rise.', 'Throwing the feet backward while the lower back sags.'],
  bear_crawl: ['cardio', 'Start on hands and knees with knees hovering just off the floor.', 'Move one hand and the opposite foot forward together in small steps.', 'Lifting the hips high or taking steps too long to control.'],
  crab_walk: ['cardio', 'Sit with hands behind the hips and feet on the floor.', 'Lift the hips slightly and walk using small alternating hand and foot steps.', 'Letting the shoulders collapse or moving too fast.'],
  squat_to_overhead_reach: ['squat', 'Stand with feet shoulder-width apart and arms by the sides.', 'Lower into a comfortable squat, then rise and reach one arm overhead; alternate arms each time.', 'Arching the back to force the overhead reach.'],
  get_up_floor_to_stand: ['balance', 'Start seated or kneeling on a clear floor with stable support nearby.', 'Move through hands and feet to stand, then reverse the path slowly.', 'Rushing the transition and losing balance.'],
  plank_jack: ['cardio', 'Start in a strong high plank with hands under shoulders.', 'Move the feet apart and together with small jumps or steps while the trunk stays firm.', 'Bouncing the hips high with each foot change.'],
  plank_walkout: ['core', 'Stand with knees soft and fold forward to place the hands down.', 'Walk the hands out to plank, pause, then walk them back toward the feet.', 'Letting the lower back sag in the plank.'],
  frog_jump: ['jump', 'Stand with feet wider than hips and knees soft.', 'Lower into a shallow squat and make a small forward jump, landing quietly.', 'Landing with the knees collapsing inward.'],
  jumping_jack: ['jump', 'Stand tall with arms at the sides and knees soft.', 'Jump the feet apart while raising the arms, then return to the start.', 'Landing stiff-legged or forcing the arms overhead.'],
  step_jack: ['cardio', 'Stand tall with arms at the sides.', 'Step one foot out while lifting both arms, return, then switch sides.', 'Leaning heavily onto the stepping leg.'],
  high_knees: ['cardio', 'Stand tall with room to move and arms relaxed.', 'Run or step in place while lifting alternate knees toward a comfortable height.', 'Leaning backward to raise the knees higher.'],
  marching_high_knees: ['cardio', 'Stand tall with feet hip-width apart.', 'March in place and raise each knee higher than a regular march while swinging the opposite arm.', 'Lurching backward as the knee rises.'],
  butt_kicks: ['cardio', 'Stand tall with knees soft and arms relaxed.', 'Alternate bending the knees to bring heels toward the glutes at a comfortable pace.', 'Arching the lower back to bring the heels higher.'],
  heel_digs: ['cardio', 'Stand tall with a slight bend in the standing knee.', 'Place one heel ahead with toes up, return, then alternate heels and swing the arms.', 'Locking the standing knee with each step.'],
  skater_hop: ['jump', 'Stand with knees soft and space to move sideways.', 'Hop or step to one side, land on that leg and let the other foot trail behind.', 'Landing with the knee collapsing inward.'],
  lateral_step: ['cardio', 'Stand tall with knees soft and space on either side.', 'Step sideways, bring the other foot in, then change direction.', 'Crossing the feet and losing balance.'],
  squat_jump: ['jump', 'Stand with feet shoulder-width apart and knees soft.', 'Lower into a comfortable squat, jump a small height, then land quietly.', 'Landing with straight knees or collapsing ankles.'],
  fast_feet: ['cardio', 'Stand in a shallow athletic stance with feet under the hips.', 'Take quick, short steps in place while keeping the upper body steady.', 'Taking steps so wide that the feet tangle.'],
  shadow_boxing: ['cardio', 'Stand in a staggered stance with soft knees and hands by the face.', 'Throw light alternating punches into open space, returning each hand to guard.', 'Locking the elbow hard at the end of a punch.'],
  standing_knee_to_elbow: ['cardio', 'Stand tall with elbows bent and feet hip-width apart.', 'Lift one knee toward the opposite elbow, lower it, then alternate sides.', 'Pulling the head down sharply to meet the knee.'],
  childs_pose: ['stretch', 'Kneel on a comfortable surface with knees apart as needed.', 'Sit the hips gently toward the heels and reach the arms forward.', 'Forcing the hips onto the heels when the knees feel uncomfortable.'],
  cobra_stretch: ['stretch', 'Lie face down with hands near the ribs and legs long.', 'Press lightly through the hands to lift the chest only as far as the lower back feels comfortable.', 'Locking the elbows and forcing a deep backbend.'],
  downward_dog: ['stretch', 'Start on hands and knees with hands shoulder-width apart.', 'Lift the hips up and back, keeping the knees soft if the legs feel tight.', 'Forcing the heels flat by rounding the back.'],
  seated_forward_fold: ['stretch', 'Sit tall with legs forward and knees slightly bent if needed.', 'Hinge from the hips and reach toward the legs without pulling the spine into a deep curve.', 'Yanking on the feet to force a deeper fold.'],
  standing_forward_fold: ['stretch', 'Stand with feet hip-width apart and knees soft.', 'Hinge at the hips and let the torso fold forward only as far as comfortable.', 'Locking the knees and pulling the body downward.'],
  hamstring_stretch_each_leg: ['stretch', 'Place one heel ahead with the knee softly bent and toes up.', 'Hinge at the hips until a gentle stretch is felt behind that thigh, then switch legs.', 'Rounding the back to reach the toes.'],
  quad_stretch_each_leg: ['stretch', 'Stand beside a stable wall and hold it lightly for balance.', 'Bend one knee and bring the heel toward the glute, holding the foot only if comfortable.', 'Pulling the foot sharply or arching the lower back.'],
  hip_flexor_stretch_each_side: ['stretch', 'Kneel in a split stance on a soft surface with the front foot planted.', 'Gently shift the hips forward while keeping the trunk tall, then change sides.', 'Arching the lower back to create a larger stretch.'],
  figure_4_glute_stretch: ['stretch', 'Lie on your back with knees bent and place one ankle over the opposite thigh.', 'Draw the supporting leg gently toward the chest, then change sides.', 'Pressing directly on the raised knee.'],
  butterfly_stretch: ['stretch', 'Sit tall with the soles of the feet together.', 'Let the knees relax outward and hinge forward a little if comfortable.', 'Pushing the knees down with the hands.'],
  chest_doorway_stretch: ['stretch', 'Stand in a stable doorway and place forearms on the frame at a comfortable height.', 'Step gently forward until a light stretch is felt across the chest.', 'Pushing through shoulder pain or placing arms too high.'],
  triceps_stretch: ['stretch', 'Stand or sit tall and lift one arm overhead.', 'Bend that elbow and use the other hand for a light assist, then change arms.', 'Pulling the elbow sharply behind the head.'],
  neck_side_stretch: ['stretch', 'Sit or stand tall with both shoulders relaxed.', 'Tilt one ear gently toward the same-side shoulder, then switch sides.', 'Pulling the head down with the hand.'],
  thoracic_rotation: ['mobility', 'Start on hands and knees or in a comfortable side-lying position.', 'Rotate the upper back to open one arm toward the ceiling, then return and change sides.', 'Twisting the lower back to gain extra range.'],
  knee_to_chest: ['stretch', 'Lie on your back with both legs comfortable.', 'Bring one knee gently toward the chest while the other leg stays relaxed, then switch.', 'Yanking the knee toward the chest.'],
  lying_spinal_twist: ['stretch', 'Lie on your back with knees bent and arms open.', 'Let both knees move gently to one side while the shoulders stay comfortable, then switch.', 'Forcing the knees to the floor while the shoulder lifts painfully.'],
};

/** Returns complete copy for a catalog slug or throws during asset generation. */
export function exerciseCopyFor(slug: string): GuideCopy {
  const seed = SEEDS[slug];
  if (!seed) throw new Error(`Exercise guide copy missing: ${slug}`);
  const [pattern, setup, movement, mistake] = seed;
  const shared = PATTERNS[pattern];
  return {
    instructions: [setup, movement, shared.finish],
    mistakes: [mistake, ...shared.mistakes],
    breathing: [...shared.breathing],
  };
}

export function exerciseCopySlugs(): string[] {
  return Object.keys(SEEDS);
}
