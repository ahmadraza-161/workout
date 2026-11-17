import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { exportBackup, pickBackup } from './files';
import { MAX_BACKUP_BYTES, parseBackup } from './format';

const mockFile = {
  uri: 'file:///cache/picked.json', size: 100, exists: true,
  text: jest.fn().mockResolvedValue('{}'), write: jest.fn(), delete: jest.fn(),
};

jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn() }));
jest.mock('expo-file-system', () => ({
  File: jest.fn().mockImplementation(() => mockFile), Paths: { cache: { uri: 'file:///cache/' } },
}));
jest.mock('expo-sharing', () => ({ isAvailableAsync: jest.fn(), shareAsync: jest.fn() }));
jest.mock('./repository', () => ({ collectBackup: jest.fn(() => ({ app: 'offline-workout' })) }));
jest.mock('./format', () => ({ MAX_BACKUP_BYTES: 5 * 1024 * 1024, parseBackup: jest.fn(() => ({ app: 'offline-workout' })) }));

beforeEach(() => {
  jest.clearAllMocks();
  mockFile.uri = 'file:///cache/picked.json'; mockFile.size = 100;
});

it('treats picker cancellation as a no-op', async () => {
  jest.mocked(DocumentPicker.getDocumentAsync).mockResolvedValue({ canceled: true, assets: null });
  expect(await pickBackup()).toBeNull();
  expect(File).not.toHaveBeenCalled();
});

it('checks oversized metadata before reading and removes only the cache copy', async () => {
  jest.mocked(DocumentPicker.getDocumentAsync).mockResolvedValue({ canceled: false,
    assets: [{ uri: mockFile.uri, name: 'backup.json', size: MAX_BACKUP_BYTES + 1, lastModified: 1 }] });
  await expect(pickBackup()).rejects.toThrow('Backup too large');
  expect(mockFile.text).not.toHaveBeenCalled();
  expect(mockFile.delete).toHaveBeenCalledTimes(1);
});

it('leaves the owner source file intact when the provider returns a non-cache URI', async () => {
  mockFile.uri = 'content://owner/backup.json';
  jest.mocked(DocumentPicker.getDocumentAsync).mockResolvedValue({ canceled: false,
    assets: [{ uri: mockFile.uri, name: 'backup.json', lastModified: 1 }] });
  await pickBackup();
  expect(parseBackup).toHaveBeenCalledWith('{}');
  expect(mockFile.delete).not.toHaveBeenCalled();
});

it('shares a validated local file and retains it for asynchronous recipients', async () => {
  jest.mocked(Sharing.isAvailableAsync).mockResolvedValue(true);
  jest.mocked(Sharing.shareAsync).mockResolvedValue(undefined);
  await exportBackup();
  expect(mockFile.write).toHaveBeenCalledWith(JSON.stringify({ app: 'offline-workout' }));
  expect(Sharing.shareAsync).toHaveBeenCalledWith(mockFile.uri, { mimeType: 'application/json', UTI: 'public.json' });
  expect(mockFile.delete).not.toHaveBeenCalled();
});
