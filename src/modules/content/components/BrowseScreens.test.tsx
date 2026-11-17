import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { t } from '@/modules/core/i18n';
import { ThemeProvider } from '@/modules/core/theme';

import { DEFAULT_BROWSE_CONTEXT } from '../browse';
import { loadBrowseContext } from '../browseRepository';
import { getContentPack } from '../repository';
import { CatalogListScreen } from './CatalogListScreen';
import { DiscoverScreen } from './DiscoverScreen';

jest.mock('expo-router', () => ({ router: { push: jest.fn(), back: jest.fn() }, useIsFocused: () => true, useFocusEffect: () => undefined }));
jest.mock('../browseRepository', () => ({ loadBrowseContext: jest.fn() }));
jest.mock('./ExerciseImage', () => ({ ExerciseImage: () => null }));
jest.mock('@/modules/core/ui/Sheet', () => ({ Sheet: () => null }));
jest.mock('./FeedbackSection', () => ({ FeedbackSection: () => null }));
beforeEach(() => { jest.clearAllMocks(); jest.mocked(loadBrowseContext).mockReturnValue(DEFAULT_BROWSE_CONTEXT); });
it('connects Discover history, collections, section links and body-focus tiles', async () => {
  await render(<ThemeProvider><DiscoverScreen /></ThemeProvider>);
  await fireEvent.press(screen.getByLabelText(t('browseUi.recent')));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/list/[type]', params: { type: 'workouts', group: 'recent' } });
  const collection = getContentPack().collections.find((item) => item.id === 'c3')!;
  await fireEvent.press(screen.getByLabelText(t(collection.titleKey)));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/list/[type]', params: { type: 'workouts', group: 'collection', id: 'c3' } });
  await fireEvent.press(screen.getByLabelText(t('browseUi.equipment')));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/list/[type]', params: { type: 'workouts', group: 'equipment' } });
  const category = getContentPack().categories[0]!;
  await fireEvent.press(screen.getByLabelText(t(category.titleKey)));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/list/[type]', params: { type: 'workouts', group: 'category', id: category.id } });
});
it('shows an empty history and can retry a failed local read', async () => {
  jest.mocked(loadBrowseContext).mockImplementationOnce(() => { throw new Error('disk'); });
  await render(<ThemeProvider><CatalogListScreen type="workouts" group="recent" /></ThemeProvider>);
  await fireEvent.press(screen.getByLabelText(t('common.retry')));
  expect(screen.getByText(t('browse.noResults'))).toBeTruthy();
});
it('changes challenge filters and opens the selected plan', async () => {
  await render(<ThemeProvider><CatalogListScreen type="challenges" /></ThemeProvider>);
  await fireEvent.press(screen.getByLabelText(t('challengeUi.filter.flexibility')));
  const selected = getContentPack().challenges.filter((item) => item.goal === 'flexibility');
  expect(screen.getAllByLabelText(t('browseUi.viewPlan'))).toHaveLength(selected.length);
  await fireEvent.press(screen.getAllByLabelText(t('browseUi.viewPlan'))[0]!);
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/challenge/[id]', params: { id: selected[0]!.id } });
});
