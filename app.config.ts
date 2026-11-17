import type { ExpoConfig } from 'expo/config';

// Screens read the public name through expo-constants. Generators import these
// exports so their offline fallback copy and brand assets stay in sync.
export const APP_NAME = 'WorkoutStride';
export const APP_TAGLINE = 'Your pace. Your progress.';
// Retain the installed testing app's identity and local data during this rename.
const ANDROID_PACKAGE = 'com.placeholder.homeworkout';

const IS_PRODUCTION = process.env.APP_VARIANT === 'production';

// Never needed by this app in any build (DOC/SECURITY.md §5).
const ALWAYS_BLOCKED_PERMISSIONS = [
  'android.permission.RECORD_AUDIO',
  'android.permission.CAMERA',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
  'android.permission.READ_MEDIA_AUDIO',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.USE_EXACT_ALARM',
];

// Blocked only in release builds: development builds need network access to
// reach the local Metro dev server (ADR-003).
const PRODUCTION_ONLY_BLOCKED_PERMISSIONS = [
  'android.permission.INTERNET',
  'android.permission.ACCESS_NETWORK_STATE',
];

const config: ExpoConfig = {
  name: APP_NAME,
  slug: 'workoutstride',
  scheme: ['workoutstride', 'workoutdost', 'homeworkout'],
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  android: {
    package: ANDROID_PACKAGE,
    versionCode: 1,
    allowBackup: false,
    predictiveBackGestureEnabled: false,
    adaptiveIcon: {
      backgroundColor: '#4A0B24',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    blockedPermissions: [
      ...ALWAYS_BLOCKED_PERMISSIONS,
      ...(IS_PRODUCTION ? PRODUCTION_ONLY_BLOCKED_PERMISSIONS : []),
    ],
  },
  plugins: [
    'expo-router',
    'expo-sqlite',
    'expo-font',
    'expo-localization',
    'expo-notifications',
    'expo-sharing',
    ['expo-video', { supportsBackgroundPlayback: false, supportsPictureInPicture: false }],
    ['expo-audio', { microphonePermission: false, recordAudioAndroid: false,
      enableBackgroundPlayback: false, enableBackgroundRecording: false }],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 160,
        resizeMode: 'contain',
        backgroundColor: '#FFFFFF',
        dark: { backgroundColor: '#0E1014' },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
