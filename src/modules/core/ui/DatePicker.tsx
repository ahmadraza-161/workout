import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '../i18n';
import { radius, spacing, useTheme } from '../theme';
import { IconButton } from './IconButton';
import { Text } from './Text';
import { Touchable } from './Touchable';
import { WheelPicker } from './WheelPicker';

const CELL = 40;
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Month calendar (DESIGN §4.2). Built on date-fns rather than a date-picker
// package: the app ships no extra dependency for this, and the same grid is
// reused by the Report "All records" calendar.
export interface DatePickerProps {
  value: Date;
  onChange: (next: Date) => void;
  /** Logs cannot be dated in the future. */
  disableFuture?: boolean;
  /** Local dates with recorded activity, shown as small dots in history. */
  markedDates?: ReadonlySet<string>;
}

export function DatePicker({ value, onChange, disableFuture = true, markedDates }: DatePickerProps) {
  const { colors } = useTheme();
  const [month, setMonth] = useState(() => startOfMonth(value));
  const today = startOfDay(new Date());

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  // Blank cells before the first of the month so dates line up under their weekday.
  const leadingBlanks = getDay(startOfMonth(month));

  return (
    <View style={styles.calendar}>
      <View style={styles.monthRow}>
        <IconButton
          icon={ChevronLeft}
          onPress={() => setMonth((current) => subMonths(current, 1))}
          accessibilityLabel={format(subMonths(month, 1), 'MMMM yyyy')}
        />
        <Text variant="h3">{format(month, 'MMMM yyyy')}</Text>
        <IconButton
          icon={ChevronRight}
          onPress={() => setMonth((current) => addMonths(current, 1))}
          accessibilityLabel={format(addMonths(month, 1), 'MMMM yyyy')}
          disabled={disableFuture && !isAfter(startOfMonth(today), month)}
        />
      </View>

      <View style={styles.grid}>
        {WEEKDAYS.map((letter, index) => (
          <View key={`${letter}-${index}`} style={styles.cell}>
            <Text variant="caption" tone="secondary">
              {letter}
            </Text>
          </View>
        ))}

        {Array.from({ length: leadingBlanks }, (_, index) => (
          <View key={`blank-${index}`} style={styles.cell} />
        ))}

        {days.map((day) => {
          const selected = isSameDay(day, value);
          const isToday = isSameDay(day, today);
          const disabled = disableFuture && isAfter(startOfDay(day), today);
          const marked = markedDates?.has(format(day, 'yyyy-MM-dd')) ?? false;

          return (
            <Touchable
              key={day.toISOString()}
              onPress={() => onChange(day)}
              disabled={disabled}
              visualSize={CELL}
              accessibilityLabel={`${format(day, 'd MMMM yyyy')}${marked ? `, ${t('calendar.recordedDay')}` : ''}`}
              accessibilityState={{ selected, disabled }}
              style={styles.cell}
            >
              <View
                style={[
                  styles.day,
                  isToday && !selected && { borderWidth: 2, borderColor: colors.primaryBorderSoft },
                  selected && { backgroundColor: colors.primaryFill },
                ]}
              >
                <Text
                  variant="listTitle"
                  tone={selected ? 'onPrimary' : disabled || !isSameMonth(day, month) ? 'tertiary' : 'primary'}
                >
                  {format(day, 'd')}
                </Text>
                {marked ? <View style={[styles.dot, { backgroundColor: selected ? colors.onPrimary : colors.primary }]} /> : null}
              </View>
            </Touchable>
          );
        })}
      </View>
    </View>
  );
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);

/**
 * Hour and minute wheels for the reminder time (DESIGN §4.2). Minutes step in
 * fives, matching the reference. The caller decides the display format, so the
 * 12-hour case is handled by `use12Hour` rather than a second component.
 */
export function TimePicker({
  hour,
  minute,
  onChange,
  use12Hour = false,
}: {
  hour: number;
  minute: number;
  onChange: (next: { hour: number; minute: number }) => void;
  use12Hour?: boolean;
}) {
  const formatHour = (value: number) => {
    if (!use12Hour) return String(value).padStart(2, '0');
    const display = value % 12 === 0 ? 12 : value % 12;
    return `${display} ${value < 12 ? 'AM' : 'PM'}`;
  };

  return (
    <View style={styles.timeRow}>
      <View style={styles.timeColumn}>
        <WheelPicker
          options={HOURS}
          value={hour}
          onChange={(next) => onChange({ hour: next, minute })}
          format={formatHour}
          accessibilityLabel={t('a11y.selectTime')}
        />
      </View>
      <View style={styles.timeColumn}>
        <WheelPicker
          options={MINUTES}
          value={minute}
          onChange={(next) => onChange({ hour, minute: next })}
          format={(value) => String(value).padStart(2, '0')}
          accessibilityLabel={t('a11y.selectTime')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: { gap: spacing[3] },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: CELL, alignItems: 'center', justifyContent: 'center' },
  day: { width: CELL - 4, height: CELL - 4, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', bottom: spacing[0.5], width: spacing[1], height: spacing[1], borderRadius: radius.pill },
  timeRow: { flexDirection: 'row', gap: spacing[4] },
  timeColumn: { flex: 1 },
});
