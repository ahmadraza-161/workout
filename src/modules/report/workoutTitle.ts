import { getCustomWorkout } from '@/modules/builder';
import { getWorkout } from '@/modules/content';
import { t } from '@/modules/core/i18n';

export function sessionWorkoutTitle(id: string): string {
  return getCustomWorkout(id)?.title ?? t(getWorkout(id)?.titleKey ?? 'report.unknownWorkout');
}
