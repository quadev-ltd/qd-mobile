import type { ConfigContext, ExpoConfig } from 'expo/config';
import bootsplash from 'react-native-bootsplash/expo';

/**
 * One config, two variants. Pick one with APP_VARIANT=development|production
 * (the package.json scripts set it and load the matching .env file).
 */
type Variant = 'development' | 'production';

// iOS keeps the original bundle ids. Android moved to net.quadev.app (decision D19): the first
// Play developer account was closed, and a package name can never be reused on a new account.
const VARIANTS: Record<
  Variant,
  {
    name: string;
    iosId: string;
    androidId: string;
    domain: string;
    firebaseDir: string;
  }
> = {
  development: {
    name: 'QuaDev (dev)',
    iosId: 'com.qdmobile.dev',
    androidId: 'net.quadev.app.dev',
    domain: 'dev.quadev.net',
    firebaseDir: './firebase-config/development',
  },
  production: {
    name: 'QuaDev',
    iosId: 'com.qdmobile',
    androidId: 'net.quadev.app',
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

// Firebase config files. EAS Build has no access to the gitignored firebase-config/ folder, so store
// builds get them from EAS file environment variables, which expose the file's path (docs/release.md).
const googleServicesJson =
  process.env.GOOGLE_SERVICES_JSON ??
  `${current.firebaseDir}/google-services.json`;
const googleServiceInfoPlist =
  process.env.GOOGLE_SERVICE_INFO_PLIST ??
  `${current.firebaseDir}/GoogleService-Info.plist`;

const BRAND_COLOR = '#5050C3';
const CAMERA_USAGE = 'QuaDev needs access to your Camera.';
const PHOTOS_USAGE = 'QuaDev needs access to your photo library.';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: current.name,
  slug: 'qd-mobile',
  // Marketing version. Must match package.json "version" (the release workflow checks the tag
  // against it). versionCode / buildNumber below only seed EAS's remote counters (docs/release.md).
  version: '2.0.0',
  platforms: ['ios', 'android'],
  orientation: 'default',
  icon: './assets/icon.png',
  // Follows the system setting, as before (iOS had no UIUserInterfaceStyle; Android used DayNight).
  userInterfaceStyle: 'automatic',
  extra: {
    appVariant: variant,
  },
  ios: {
    bundleIdentifier: current.iosId,
    // Android gets the scheme through intentFilters below (host "api"), as today. Custom scheme only:
    // email verification and password reset use Firebase's hosted pages, so no universal links.
    scheme: deepLinkingDomain,
    buildNumber: '27',
    supportsTablet: false,
    googleServicesFile: googleServiceInfoPlist,
    config: {
      // Only standard HTTPS/TLS (exempt), so App Store Connect asks no export compliance questions.
      usesNonExemptEncryption: false,
    },
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
    package: current.androidId,
    versionCode: 17,
    googleServicesFile: googleServicesJson,
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
      // Added by firebase-iid (a dependency of the Functions SDK) for Cloud Messaging, which the
      // app does not use; callable functions work without it.
      'com.google.android.c2dm.permission.RECEIVE',
    ],
    // Custom scheme only. The https app link is gone (phase 3): Firebase's hosted pages handle the
    // email links, and Terms / Privacy on the website now open in the browser instead of the app.
    intentFilters: [
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
          // Firestore, Functions and Remote Config have no Expo config plugin, so they are only listed here.
          forceStaticLinking: [
            'RNFBApp',
            'RNFBAuth',
            'RNFBCrashlytics',
            'RNFBFirestore',
            'RNFBFunctions',
            'RNFBRemoteConfig',
          ],
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
