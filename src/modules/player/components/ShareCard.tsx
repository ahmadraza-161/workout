import Constants from 'expo-constants';
import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { t } from '@/modules/core/i18n';
import { gradients, shareCardLayout as layout, textStyleFor, useTheme } from '@/modules/core/theme';

import type { CompletionProgress } from '../repository';
import type { SessionSummary } from '../summary';

export const SHARE_CARD_WIDTH = layout.width;
export const SHARE_CARD_HEIGHT = layout.height;

export interface ShareCardData {
  completedCount: number;
  summary: SessionSummary;
  progress: CompletionProgress | null;
}

/** Uses the configured app name and includes no body measurements. */
export function shareMessage(data: ShareCardData): string {
  return t('player.finish.shareSummary', {
    appName: Constants.expoConfig?.name ?? t('app.name'),
    count: data.completedCount, minutes: Math.round(data.summary.durationSec / 60),
  });
}

/** Local export uses the same palette and progress wording as the finish screen. */
export const ShareCard = forwardRef<Svg, ShareCardData>(function ShareCard({ completedCount, summary, progress }, ref) {
  const { colors, isDark } = useTheme();
  const stops = isDark ? gradients.finishDark : gradients.finishLight;
  const regular = textStyleFor('body').fontFamily;
  const bold = textStyleFor('h1').fontFamily;
  const stats = [
    { value: completedCount, label: t('player.finish.exercises') },
    { value: Math.round(summary.durationSec / 60), label: t('report.minutes') },
    { value: Math.round(summary.kcal), label: t('report.kcal') },
  ];
  return <Svg ref={ref} width={layout.width} height={layout.height}
    viewBox={`0 0 ${layout.width} ${layout.height}`} style={styles.hidden}>
    <Defs><LinearGradient id="shareBackground" x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0" stopColor={stops[0]} /><Stop offset="1" stopColor={stops[1]} />
    </LinearGradient></Defs>
    <Rect width={layout.width} height={layout.height} fill="url(#shareBackground)" rx={layout.radius} />
    {layout.circles.map((circle, index) => <Circle key={index} cx={circle.x} cy={circle.y}
      r={circle.radius} fill={colors.primary} opacity={circle.opacity} />)}
    <SvgText x={layout.padding} y={layout.brandY} fontSize={layout.font.brand}
      fontFamily={bold} fill={colors.primary}>{Constants.expoConfig?.name ?? t('app.name')}</SvgText>
    <SvgText x={layout.padding} y={layout.titleY} fontSize={layout.font.title}
      fontFamily={bold} fill={colors.text.strong}>{t('player.complete')}</SvgText>
    <SvgText x={layout.padding} y={layout.subtitleY} fontSize={layout.font.subtitle}
      fontFamily={regular} fill={colors.text.body}>{t('player.finish.shareTagline')}</SvgText>
    <Rect x={layout.padding} y={layout.statsY} width={layout.contentWidth}
      height={layout.statsHeight} fill={colors.surface.default} rx={layout.statsRadius} />
    {stats.map((stat, index) => <SvgText key={stat.label} x={layout.statX[index]}
      y={layout.statValueY} fontSize={layout.font.value} textAnchor="middle"
      fontFamily={bold} fill={colors.primary}>{String(stat.value)}</SvgText>)}
    {stats.map((stat, index) => <SvgText key={stat.label} x={layout.statX[index]}
      y={layout.statLabelY} fontSize={layout.font.label} textAnchor="middle"
      fontFamily={regular} fill={colors.text.secondary}>{stat.label}</SvgText>)}
    {progress ? <>
      <SvgText x={layout.padding} y={layout.streakY} fontSize={layout.font.streak}
        fontFamily={bold} fill={colors.text.strong}>{t('player.finish.streak', { count: progress.streak })}</SvgText>
      <SvgText x={layout.padding} y={layout.weeklyY} fontSize={layout.font.weekly}
        fontFamily={regular} fill={colors.text.secondary}>{t('player.finish.weeklyGoal', {
          done: progress.weeklyDone, target: progress.weeklyTarget,
        })}</SvgText>
    </> : null}
    <SvgText x={layout.padding} y={layout.footerY} fontSize={layout.font.footer}
      fontFamily={regular} fill={colors.text.secondary}>{t('player.finish.shareFooter')}</SvgText>
  </Svg>;
});

const styles = StyleSheet.create({ hidden: { position: 'absolute', left: -layout.width * 2, top: 0 } });
