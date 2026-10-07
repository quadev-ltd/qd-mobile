import type { ConfigContext, ExpoConfig } from 'expo/config';
import bootsplash from 'react-native-bootsplash/expo';

/**
 * One config, two variants. Pick one with APP_VARIANT=development|production
 * (the package.json scripts set it and load the matching .env file).
 */
type Variant = 'development' | 'production';

const VARIANTS: Record<
  Variant,
  { name: string; id: string; domain: string; firebaseDir: string }
> = {
  development: {
    name: 'QuaDev (dev)',
    id: 'com.qdmobile.dev',
    domain: 'dev.quadev.net',
    firebaseDir: './firebase-config/development',
  },
  production: {
    name: 'QuaDev',
    id: 'com.qdmobile',
    domain: 'quadev.net',
    firebaseDir: './firebase-config/production',
  },
};

const variant: Variant =
  process.env.APP_VARIANT === 'production' ? 'production' : 'development';
const current = VARIANTS[variant];

// Same value the app reads at runtime (src/core/env.ts). Falls back to the
// variant's domain so tooling without the .env file (CI, expo-doctor) still works.
const deepLinkingDomain =
  process.env.EXPO_PUBLIC_DEEP_LINKING_DOMAIN || current.domain;

const BRAND_COLOR = '#5050C3';
const CAMERA_USAGE = 'QuaDev needs access to your Camera.';
const PHOTOS_USAGE = 'QuaDev needs access to your photo library.';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: current.name,
  slug: 'qd-mobile',
  version: '1.0.0',
  platforms: ['ios', 'android'],
  orientation: 'default',
  icon: './assets/icon.png',
  // Follows the system setting, as before (iOS had no UIUserInterfaceStyle; Android used DayNight).
  userInterfaceStyle: 'automatic',
  extra: {
    appVariant: variant,
  },
  ios: {
    bundleIdentifier: current.id,
    // Android gets the scheme through intentFilters below (host "api"), as today.
    scheme: deepLinkingDomain,
    buildNumber: '27',
    supportsTablet: false,
    googleServicesFile: `${current.firebaseDir}/GoogleService-Info.plist`,
    associatedDomains: [`applinks:${current.domain}`],
    entitlements: {
      'com.apple.developer.applesignin': ['Default'],
    },
    infoPlist: {
      NSCameraUsageDescription: CAMERA_USAGE,
      NSPhotoLibraryUsageDescription: PHOTOS_USAGE,
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: false,
        NSAllowsLocalNetworking: true,
      },
      LSApplicationQueriesSchemes: [deepLinkingDomain],
      // Same orientations as before (no upside-down portrait).
      UISupportedInterfaceOrientations: [
        'UIInterfaceOrientationPortrait',
        'UIInterfaceOrientationLandscapeLeft',
        'UIInterfaceOrientationLandscapeRight',
      ],
      // Kept as today (iOS ignores this key in Info.plist; the entitlement is what counts).
      'com.apple.developer.associated-domains': [
        `applinks:${deepLinkingDomain}`,
      ],
    },
    privacyManifests: {
      NSPrivacyTracking: false,
      NSPrivacyCollectedDataTypes: [],
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1', '1C8F.1', 'C56D.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1', '3B52.1'],
        },
        {
          NSPrivacyAccessedAPIType:
            'NSPrivacyAccessedAPICategorySystemBootTime',
          NSPrivacyAccessedAPITypeReasons: ['35F9.1'],
        },
      ],
    },
  },
  android: {
    package: current.id,
    versionCode: 17,
    googleServicesFile: `${current.firebaseDir}/google-services.json`,
    allowBackup: false,
    softwareKeyboardLayoutMode: 'resize',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon-foreground.png',
      backgroundColor: BRAND_COLOR,
    },
    permissions: ['android.permission.INTERNET', 'android.permission.CAMERA'],
    blockedPermissions: [
      // expo-image-picker uses the system photo picker, so no media permission is needed.
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.RECORD_AUDIO',
      'android.permission.VIBRATE',
      // The Expo template declares it in the main manifest; the old app only had it in debug builds.
      'android.permission.SYSTEM_ALERT_WINDOW',
      // Firebase Analytics is removed (D4).
      'com.google.android.gms.permission.AD_ID',
      'android.permission.ACCESS_ADSERVICES_ATTRIBUTION',
      'android.permission.ACCESS_ADSERVICES_AD_ID',
    ],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        category: ['BROWSABLE', 'DEFAULT'],
        data: [{ scheme: 'https', host: deepLinkingDomain }],
      },
      {
        action: 'VIEW',
        category: ['BROWSABLE', 'DEFAULT'],
        data: [{ scheme: deepLinkingDomain, host: 'api' }],
      },
    ],
  },
  plugins: [
    ['@react-native-firebase/app', { ios: { disableSPM: true } }],
    '@react-native-firebase/auth',
    '@react-native-firebase/crashlytics',
    '@react-native-google-signin/google-signin',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          forceStaticLinking: ['RNFBApp', 'RNFBAuth', 'RNFBCrashlytics'],
        },
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          minSdkVersion: 24,
        },
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: CAMERA_USAGE,
        microphonePermission: false,
        recordAudioAndroid: false,
        barcodeScannerEnabled: false,
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: PHOTOS_USAGE,
        cameraPermission: CAMERA_USAGE,
        microphonePermission: false,
      },
    ],
    '@react-native-vector-icons/material-design-icons',
    bootsplash({
      logo: './src/assets/png/logo.png',
      logoWidth: 154,
      background: BRAND_COLOR,
    }),
  ],
});
