/* eslint-disable import/first -- module mocks must run before its import. */
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { executionEnvironment: 'storeClient' },
  ExecutionEnvironment: { StoreClient: 'storeClient' },
}));
jest.mock('expo-notifications', () => {
  throw new Error('Expo Go must not load notifications');
});

import { getNotifications, remindersAreAvailable } from './notifications';

it('does not evaluate expo-notifications inside Expo Go', () => {
  expect(getNotifications()).toBeNull();
  expect(remindersAreAvailable()).toBe(false);
});
