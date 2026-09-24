import { Redirect } from 'expo-router';
import {
  BicepsFlexed,
  CalendarDays,
  ChartNoAxesColumn,
  CircleCheck,
  Clock,
  Flame,
  HeartPulse,
  Layers,
  Medal,
  Music,
  Settings as SettingsIcon,
  Target,
  ThumbsDown,
  ThumbsUp,
  Timer,
  Trophy,
} from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  challengeGradients,
  gradients,
  spacing,
  useTheme,
} from '@/modules/core/theme';
import type { ThemePreference } from '@/modules/core/kv';
import {
  AchievementBadge,
  Banner,
  Bolts,
  Button,
  Card,
  CategoryHero,
  Chip,
  DarkTile,
  DatePicker,
  Divider,
  EmptyState,
  GradientCard,
  HScroll,
  IconButton,
  LevelText,
  LoadingState,
  MediaCard,
  MetaCell,
  PlayerControls,
  ProgressBar,
  RestActions,
  Row,
  RulerPicker,
  SearchBar,
  Section,
  SegmentedControl,
  SettingsGroup,
  SheetHeader,
  StackHeader,
  StatCard,
  Stepper,
  StreakFlame,
  Switch,
  TabHeader,
  Tag,
  Text,
  TextField,
  Thumb,
  TimePicker,
  TimerRing,
  Touchable,
  WeekStrip,
  WheelPicker,
} from '@/modules/core/ui';

// Development-only gallery of every shared component, in light and dark.
// This is how the component library is reviewed before any screen is built.
// It is not reachable in a release build.
export default function ComponentGallery() {
  if (!__DEV__) return <Redirect href="/" />;
  return <Gallery />;
}

const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Light' },
  { value: 'dark' as const, label: 'Dark' },
  { value: 'system' as const, label: 'System' },
];

const REST_SECONDS = [10, 15, 20, 25, 30, 45, 60] as const;

const FOCUS_CHIPS = [
  { key: 'abs', label: 'Abs' },
  { key: 'arm', label: 'Arm' },
  { key: 'chest', label: 'Chest' },
  { key: 'leg', label: 'Leg' },
];

function Gallery() {
  const { colors, preference, setPreference } = useTheme();
  const { width } = useWindowDimensions();

  const [chip, setChip] = useState('abs');
  const [segment, setSegment] = useState('animation');
  const [switchOn, setSwitchOn] = useState(true);
  const [reps, setReps] = useState(15);
  const [weight, setWeight] = useState(72.5);
  const [rest, setRest] = useState<(typeof REST_SECONDS)[number]>(20);
  const [name, setName] = useState('');
  const [paused, setPaused] = useState(false);
  const [date, setDate] = useState(() => new Date());
  const [time, setTime] = useState({ hour: 18, minute: 30 });

  const cardWidth = (width - spacing[4] * 2 - spacing[3]) / 2;
  const noop = () => undefined;

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg.page }}
      contentContainerStyle={styles.page}
    >
      <View style={styles.padded}>
        <Text variant="h1">Component gallery</Text>
        <Text variant="caption" tone="secondary">
          Development only. Every component below uses theme tokens and i18n keys.
        </Text>
        <SegmentedControl
          options={THEME_OPTIONS}
          value={preference}
          onChange={(next) => setPreference(next as ThemePreference)}
          accessibilityLabel="Theme"
        />
      </View>

      <Group title="Headers">
        <TabHeader title="HOME WORKOUT" actions={<StreakFlame count={7} />} />
        <StackHeader title="Challenge" onBack={noop} />
        <SheetHeader title="Workout Settings" onClose={noop} />
      </Group>

      <Group title="Buttons">
        <View style={styles.padded}>
          <Button label="Start" variant="cta" onPress={noop} />
          <Button label="Done" variant="primary" onPress={noop} />
          <Button label="Cancel" variant="secondary" onPress={noop} />
          <View style={styles.rowWrap}>
            <Button label="Log" variant="small" onPress={noop} />
            <Button label="START DAY 1" variant="cardCta" onPress={noop} accentColor={colors.primary} />
          </View>
          <View style={styles.rowWrap}>
            <Button label="More" variant="textLink" onPress={noop} />
            <Button label="Do it later" variant="plainLink" onPress={noop} />
            <Button label="Saving" variant="primary" onPress={noop} loading />
            <Button label="Disabled" variant="secondary" onPress={noop} disabled />
          </View>
          <View style={styles.rowWrap}>
            <IconButton icon={Music} onPress={noop} accessibilityLabel="Music" />
            <IconButton icon={SettingsIcon} onPress={noop} accessibilityLabel="Settings" />
            <IconButton icon={ThumbsUp} onPress={noop} accessibilityLabel="Like" variant="thumbs" />
            <IconButton icon={ThumbsDown} onPress={noop} accessibilityLabel="Dislike" variant="thumbs" />
          </View>
        </View>
      </Group>

      <Group title="Indicators">
        <View style={styles.padded}>
          <View style={styles.rowWrap}>
            <Bolts level={1} />
            <Bolts level={2} />
            <Bolts level={3} />
            <LevelText level={1} />
            <LevelText level={2} />
            <LevelText level={3} />
          </View>
          <View style={styles.rowWrap}>
            <Tag label="CUSTOMIZED FOR YOU" />
            <Chip label="Abs" variant="focus" />
            <StreakFlame count={12} />
          </View>
          <ProgressBar progress={0.35} />
          <TimerRing progress={0.6}>
            <Text variant="displayXL">13</Text>
          </TimerRing>
        </View>
      </Group>

      <Group title="Chips">
        <HScroll>
          {FOCUS_CHIPS.map((focus) => (
            <Chip
              key={focus.key}
              label={focus.label}
              selected={chip === focus.key}
              onPress={() => setChip(focus.key)}
            />
          ))}
        </HScroll>
        <HScroll>
          <Chip label="All" variant="filter" selected onPress={noop} />
          <Chip label="Build Muscle" variant="filter" onPress={noop} />
          <Chip label="<7 mins" variant="quick" icon={Clock} onPress={noop} />
          <Chip label="Keep Fit" variant="quick" icon={HeartPulse} onPress={noop} />
        </HScroll>
      </Group>

      <Group title="Rows">
        <Row
          leading={<Thumb size="lg" />}
          title="Abs Beginner"
          meta={['16 mins', '16 Exercises']}
          trailing={undefined}
          onPress={noop}
        />
        <Divider inset={spacing[4] + 88 + spacing[3]} />
        <Row
          leading={<Thumb size="lg" stage />}
          title="Torso Twist"
          meta={<Text variant="caption" tone="secondary">01:00</Text>}
          onPress={noop}
        />
        <View style={styles.padded}>
          <Row
            container="card"
            leading={<Thumb />}
            title="Arm Workout (No Push-Ups!)"
            titleVariant="list"
            meta={['19 mins', '20 exercises']}
            onPress={noop}
          />
          <Row
            leading={<Thumb />}
            title="Abs Intermediate"
            meta={<View style={styles.rowWrap}><Text variant="caption" tone="secondary">25mins ·</Text><LevelText level={2} /></View>}
            onPress={noop}
          />
        </View>
      </Group>

      <Group title="Cards">
        <HScroll snapWidth={width - 72 + spacing[3]}>
          <GradientCard
            title="FULL BODY CHALLENGE"
            eyebrow="28 DAYS"
            tag="CUSTOMIZED FOR YOU"
            gradient="blue"
            width={width - 72}
            footer={<Button label="START DAY 1" variant="cardCta" onPress={noop} accentColor="#016EF9" />}
          >
            <View style={styles.metaGrid}>
              <MetaCell icon={CalendarDays} value="7–22 Min" label="Daily Time" />
              <MetaCell icon={ChartNoAxesColumn} value="Beginner" label="Level" />
            </View>
            <View style={styles.metaGrid}>
              <MetaCell icon={Target} value="Full Body" label="Target area" />
              <MetaCell icon={CircleCheck} value="No Equipment" label="Equipment" />
            </View>
          </GradientCard>

          <GradientCard
            title="PLANK CHALLENGE"
            eyebrow="21 DAYS"
            gradient="teal"
            width={width - 72}
            footer={<Button label="START DAY 1" variant="cardCta" onPress={noop} accentColor="#01838C" />}
          >
            <Text variant="body" style={styles.onCard}>
              Build a stronger core one hold at a time, with a little more each training day.
            </Text>
          </GradientCard>
        </HScroll>

        <View style={styles.padded}>
          <Banner
            title="STAY ACTIVE"
            subtitle="Short sessions you can keep up with"
            countLabel="5 workouts"
            gradient={challengeGradients.slate}
            onPress={noop}
          />
          <Banner
            title="CREATE YOUR OWN"
            gradient={gradients.create}
            height={140}
            trailing={<Button label="GO" variant="cardCta" onPress={noop} accentColor="#0551FF" />}
          />
          <View style={styles.rowWrap}>
            <MediaCard title="6 Min Tabata" width={cardWidth} onPress={noop} />
            <MediaCard title="Morning Warm-Up" width={cardWidth} aspect={1.4} titlePlacement="below" onPress={noop} />
          </View>
          <View style={styles.rowWrap}>
            <DarkTile label="Chest" icon={BicepsFlexed} onPress={noop} />
            <DarkTile label="Core" icon={Target} onPress={noop} />
          </View>
        </View>

        <CategoryHero title="CORE" description="Strengthen your midsection with focused, joint-friendly work." />
      </Group>

      <Group title="Report">
        <View style={styles.padded}>
          <StatCard
            stats={[
              { icon: Medal, value: '12', label: 'Workout' },
              { icon: Flame, value: '840', label: 'Kcal' },
              { icon: Timer, value: '146', label: 'Minute' },
            ]}
          />
          <Card>
            <WeekStrip
              days={[
                { date: 20, letter: 'S', state: 'past' },
                { date: 21, letter: 'M', state: 'done' },
                { date: 22, letter: 'T', state: 'past' },
                { date: 23, letter: 'W', state: 'today' },
                { date: 24, letter: 'T', state: 'future' },
                { date: 25, letter: 'F', state: 'future' },
                { date: 26, letter: 'S', state: 'future' },
              ]}
              showTodayPointer
              accessibilityLabel="This week"
            />
          </Card>
          <View style={styles.rowWrap}>
            <AchievementBadge name="First workout" icon={Trophy} unlocked />
            <AchievementBadge name="7-day streak" icon={Flame} unlocked={false} />
          </View>
          <SettingsGroup
            rows={[
              { key: 'units', icon: Layers, label: 'Units', value: 'kg · cm', onPress: noop },
              { key: 'reminders', icon: Timer, label: 'Reminders', value: 'Off', onPress: noop },
            ]}
          />
        </View>
      </Group>

      <Group title="Form controls">
        <View style={styles.padded}>
          <SearchBar placeholder="Search workouts, plans…" onPress={noop} />
          <SegmentedControl
            options={[
              { value: 'animation', label: 'Animation' },
              { value: 'muscle', label: 'Muscle' },
              { value: 'howto', label: 'How to do' },
            ]}
            value={segment}
            onChange={setSegment}
            appearance="primary"
            accessibilityLabel="Exercise guide tab"
          />
          <View style={styles.between}>
            <Text variant="title">Enable rest</Text>
            <Switch value={switchOn} onValueChange={setSwitchOn} accessibilityLabel="Enable rest" />
          </View>
          <TextField value={name} onChangeText={setName} label="Workout name" placeholder="My workout" />
          <Stepper value={reps} onChange={setReps} label="Reps" />
          <WheelPicker
            options={REST_SECONDS}
            value={rest}
            onChange={setRest}
            format={(seconds) => `${seconds}s`}
            accessibilityLabel="Rest time"
          />
          <RulerPicker
            value={weight}
            onChange={setWeight}
            min={40}
            max={120}
            unit="kg"
            accessibilityLabel="Weight"
          />
          <DatePicker value={date} onChange={setDate} />
          <TimePicker hour={time.hour} minute={time.minute} onChange={setTime} />
        </View>
      </Group>

      <Group title="Player">
        <View style={styles.padded}>
          <PlayerControls
            paused={paused}
            progress={0.45}
            onTogglePause={() => setPaused((value) => !value)}
            onPrevious={noop}
            onNext={noop}
            labels={{ previous: 'Previous', next: 'Next', pause: 'Pause', resume: 'Resume' }}
          />
        </View>
        <View style={[styles.restPanel, { backgroundColor: colors.restBg }]}>
          <RestActions
            countdown="00:21"
            onAddTime={noop}
            onSkip={noop}
            onEditRestTime={noop}
            labels={{ rest: 'REST', addTime: '+20s', skip: 'Skip', editRestTime: 'Edit Rest Time' }}
          />
        </View>
      </Group>

      <Group title="States">
        <View style={styles.states}>
          <LoadingState />
        </View>
        <View style={styles.states}>
          <EmptyState
            title="No favourites yet"
            body="Tap the heart on any workout to save it here."
            actionLabel="Browse workouts"
            onAction={noop}
          />
        </View>
      </Group>

      <Group title="Section and carousel">
        <Section title="Just For You" actionLabel="More" onAction={noop}>
          <HScroll>
            <Thumb size="lg" />
            <Thumb size="lg" stage />
            <Thumb size="lg" />
          </HScroll>
        </Section>
        <View style={styles.padded}>
          <Touchable onPress={noop} accessibilityLabel="Press feedback demo">
            <Card>
              <Text variant="body">Touchable: press me to see scale 0.98 and 90% opacity.</Text>
            </Card>
          </Touchable>
        </View>
      </Group>
    </ScrollView>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.group}>
      <View style={[styles.groupHeader, { backgroundColor: colors.surface.muted }]}>
        <Text variant="guideHeading" tone="brand">
          {title}
        </Text>
      </View>
      <View style={styles.groupBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: spacing[16] },
  padded: { paddingHorizontal: spacing[4], gap: spacing[3] },
  group: { gap: spacing[3], marginTop: spacing[6] },
  groupHeader: { paddingHorizontal: spacing[4], paddingVertical: spacing[2] },
  groupBody: { gap: spacing[3] },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing[3] },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metaGrid: { flexDirection: 'row', gap: spacing[3] },
  onCard: { color: '#FFFFFF' },
  restPanel: { padding: spacing[5] },
  states: { height: 260 },
});
