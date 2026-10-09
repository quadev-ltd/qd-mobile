# Native parity: approved differences

`scripts/parity/parity.zsh check <variant>` (or `yarn parity:dev` / `yarn parity:prod`) compares
what the Expo-generated app declares with the pre-Expo app (origin/main `445cb68`) and fails on any
difference that is not listed here.

- **Baseline** (`docs/parity/baseline/`): `aapt2 dump` of the `developmentDebug` and
  `productionDebug` APKs built from `445cb68`, plus that commit's tracked iOS `Info.plist`,
  entitlements, privacy manifest and build settings (no iOS build: the iOS 26.5 platform is not
  installed on the build machine).
- **Candidate**: the APK from `npx expo run:android` (or `./gradlew assembleDebug`) after
  `yarn prebuild:dev|prod`, and the generated `ios/` project.
- Configuration values (`DEEP_LINKING_DOMAIN`, `REVERSED_CLIENT_ID`, the encoded Firebase app id)
  are replaced by placeholders, so the JSON and reports never contain them.

## Approved differences

| Difference | Why |
|---|---|
| Android `targetSdk` 34 → 36, `compileSdk` 35 → 36 | Expo SDK 57 / Play requirement (API 36 since 31 Aug 2026). |
| iOS deployment target 15.1 → 16.4 | Expo SDK 57 minimum. |
| Display names: Android "(D) QuaDev" → "QuaDev (dev)"; iOS "QDMobile (dev)" / "QDMobile" → "QuaDev (dev)" / "QuaDev" | Decision D6. The usage strings follow the new name ("QuaDev needs access to…"); they used `$(PRODUCT_NAME)`, which was "QDMobile". |
| `versionCode` 16 → 17, iOS build 26 → 27, iOS short version "1.0" → "1.0.0" | Store builds must increase; Expo uses one `version` for both platforms. |
| `READ_MEDIA_IMAGES` removed | expo-image-picker uses the system photo picker, which needs no permission. |
| `AD_ID`, `ACCESS_ADSERVICES_*`, `BIND_GET_INSTALL_REFERRER_SERVICE` removed | Firebase Analytics removed (decision D4); these came from it. |
| `SYSTEM_ALERT_WINDOW` (no difference expected) | Debug builds get it from the debug manifest, as before. The Expo template also declares it in the main manifest, which would add it to release builds, so it is blocked there in `app.config.ts`. |
| Empty `NSLocationWhenInUseUsageDescription` removed | Nothing requests location once VisionCamera is gone. |
| `NSPhotoLibraryUsageDescription` added to the dev variant | The dev Info.plist was missing it; both variants now match production. |
| Icon font `MaterialCommunityIcons.ttf` → `MaterialDesignIcons.ttf` | `react-native-vector-icons` → `@react-native-vector-icons/material-design-icons` (same glyphs). |
| Extra iOS URL schemes: the bundle id, and the encoded Firebase app id | Added by Expo prebuild (bundle id scheme) and the RNFB Auth config plugin (phone-auth reCAPTCHA redirect). Nothing in the app handles them. |
| Production debug APK deep-link host: dev domain → production domain | The old `productionDebug` build picked up `.env.dev` (react-native-config only mapped the flavor names), so it embedded the dev domain. The Expo production variant uses the production domain, like the old release build. |
| `RECORD_AUDIO`, `READ/WRITE_EXTERNAL_STORAGE`, `VIBRATE` | Blocked in `app.config.ts`, so they must not appear. |
| Phase 3: Android https app-link intent filter (`autoVerify`, host = deep-linking domain) removed; iOS `associated-domains` entitlement and the Info.plist copy of it removed | Email verification and password reset now use Firebase's hosted pages, so no universal/app links are needed. Terms and Privacy on the website now open in the browser instead of the app. The custom URL scheme stays. |
| Phase 3: `USE_BIOMETRIC` and `USE_FINGERPRINT` removed | They came from `react-native-keychain`, removed with the custom token storage (Firebase keeps its own session). |
| Phase 3: `com.google.android.c2dm.permission.RECEIVE` (no difference expected) | `firebase-iid`, pulled in by the Functions SDK, declares it for Cloud Messaging, which the app does not use; it is blocked in `app.config.ts`. |
| Phase 5: Android package `com.qdmobile.dev` / `com.qdmobile` → `net.quadev.app.dev` / `net.quadev.app`, and the `<package>.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` permission that is named after it | Decision D19: the first Play developer account was closed, and a package name can never be reused on another account. iOS keeps `com.qdmobile` / `com.qdmobile.dev`. |
| Phase 5: version 2.0.0 (Android `versionName` 1.0.0 → 2.0.0, iOS short version "1.0" → "2.0.0") | First public store release (decision D19). iOS `ITSAppUsesNonExemptEncryption = false` is added too (not tracked by the parity JSON). |

The machine-readable list (`<platform>/<variant> <path glob>`; globs use zsh patterns):

```allowed
android/* targetSdk
android/* compileSdk
android/development label
android/* versionCode
android/* permissions.android.permission.READ_MEDIA_IMAGES
android/* permissions.com.google.android.gms.permission.AD_ID
android/* permissions.android.permission.ACCESS_ADSERVICES_ATTRIBUTION
android/* permissions.android.permission.ACCESS_ADSERVICES_AD_ID
android/* permissions.com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE
android/production intentFilters.*
ios/* buildSettings.deploymentTarget
ios/* displayName
ios/* bundleVersion
ios/* shortVersion
ios/* usage.NSCameraUsageDescription
ios/* usage.NSPhotoLibraryUsageDescription
ios/* usage.NSLocationWhenInUseUsageDescription
ios/* fonts.MaterialCommunityIcons.ttf
ios/* fonts.MaterialDesignIcons.ttf
ios/development urlSchemes.com.qdmobile.dev
ios/production urlSchemes.com.qdmobile
ios/* urlSchemes.*ENCODED_FIREBASE_APP_ID*
android/* intentFilters.*https*
android/* permissions.android.permission.USE_BIOMETRIC
android/* permissions.android.permission.USE_FINGERPRINT
ios/* entitlements.com.apple.developer.associated-domains.*
ios/* infoPlistAssociatedDomains.*
android/* package
android/* versionName
android/* permissions.*.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION
```
