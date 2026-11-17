// Public API of the shared UI layer. Generic, data-free components live here
// and are reused across every tab; data-bound sections live in the module that
// owns their data (ADR-051).

// Primitives
export { Text, type TextProps, type TextTone } from './Text';
export { Screen, type ScreenProps } from './Screen';
export { Touchable, type TouchableProps } from './Touchable';
export { Divider } from './Divider';
export { GradientBackground, type GradientAngle } from './GradientBackground';

// Atoms
export { Button, type ButtonProps, type ButtonVariant } from './Button';
export { IconButton, type IconButtonProps, type IconButtonVariant } from './IconButton';
export { Chip, type ChipProps, type ChipVariant } from './Chip';
export { Tag } from './Tag';
export { Bolts, type Level } from './Bolts';
export { LevelText } from './LevelText';
export { MetaLine, type MetaLineProps } from './MetaLine';
export { MetaCell, type MetaCellProps } from './MetaCell';
export { Thumb, type ThumbProps, type ThumbSize } from './Thumb';
export { NumberedCircle, StreakFlame, ProgressBar, Avatar } from './Indicators';
export { TimerRing, type TimerRingProps } from './TimerRing';

// Form controls
export { SearchBar, type SearchBarProps } from './SearchBar';
export { SegmentedControl, type SegmentedOption, type SegmentedControlProps } from './SegmentedControl';
export { Switch, TextField, Stepper, type TextFieldProps } from './Forms';
export { WheelPicker, type WheelPickerProps } from './WheelPicker';
export { RulerPicker, type RulerPickerProps } from './RulerPicker';
export { DatePicker, TimePicker, type DatePickerProps } from './DatePicker';

// Cards and layout
export { Card } from './Card';
export { Row, rowDividerInset, type RowProps } from './Row';
export { Section, type SectionProps } from './Section';
export { HScroll, type HScrollProps } from './HScroll';
export { WeekStrip, type WeekDay, type WeekStripProps } from './WeekStrip';
export { Banner, type BannerProps } from './Banner';
export { MediaCard, type MediaCardProps } from './MediaCard';
export { GradientCard, type GradientCardProps } from './GradientCard';
export { DarkTile, type DarkTileProps } from './DarkTile';
export {
  StatCard,
  SettingsGroup,
  AchievementBadge,
  CategoryHero,
  type StatCardProps,
  type SettingsRow,
} from './Groups';

// Headers, sheets and states
export { TabHeader, StackHeader, SheetHeader } from './Headers';
export { Sheet, type SheetProps } from './Sheet';
export { LoadingState, EmptyState, ErrorState, type EmptyStateProps } from './States';

// Player
export {
  PlayerControls,
  RestActions,
  type PlayerControlsProps,
  type RestActionsProps,
} from './PlayerControls';

// Infrastructure
export { ErrorBoundary } from './ErrorBoundary';
export { TabPlaceholder } from './TabPlaceholder';
export { AppStartupScreen } from './AppStartupScreen';
