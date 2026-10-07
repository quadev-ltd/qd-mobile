QuaDev Mobile App
=======

An [Expo](https://docs.expo.dev) (SDK 57, React Native 0.86) app. The native `ios/` and
`android/` projects are generated from `app.config.ts` with `expo prebuild` and are not in git.

# Requirements
- Node 24 (`nvm use` reads `.nvmrc`) and Yarn 4 (`corepack enable`).
- Android: Android Studio, JDK 17, an emulator or device.
- iOS: Xcode 26.4 or newer with the iOS 26.5 platform installed, and CocoaPods.

## Local configuration (never committed)
- Firebase config files, one folder per variant:
  - `firebase-config/development/google-services.json` and `GoogleService-Info.plist` (project `quadevapp-dev`)
  - `firebase-config/production/google-services.json` and `GoogleService-Info.plist` (project `quadevapp`)
- Environment files with the keys from `.env.example`:
  - `.env.development` and `.env.production`

All variables use the `EXPO_PUBLIC_` prefix: Expo inlines them into the JavaScript bundle at build
time, so they must not hold secrets. They are validated in `src/core/env.ts`, the only file allowed
to read `process.env`.

# Quickstart

```bash
yarn install
yarn android:dev     # build, install and run the development variant (com.qdmobile.dev)
yarn ios:dev         # same on iOS
yarn start:dev       # Metro only, for an already installed development build
```

`android:prod`, `ios:prod` and `start:prod` do the same for the production variant (`com.qdmobile`).
Both variants come from one `app.config.ts`, selected with `APP_VARIANT=development|production`; the
scripts set it and load the matching `.env` file with `dotenv-cli`.

`yarn prebuild:dev` / `yarn prebuild:prod` regenerate `ios/` and `android/` from scratch. Run it after
changing `app.config.ts`, a config plugin or a native dependency, and when switching variants. Never
edit `ios/` or `android/` by hand.

# Checks

```bash
yarn typecheck && yarn lint && yarn test
npx expo-doctor && npx expo install --check
yarn parity:dev        # native parity with the pre-Expo app (see docs/parity/allowed-diff.md)
maestro test .maestro  # smoke tests against an installed development build
```

# Releases
Store builds move to EAS Build/Submit in a later phase. Until then, the old fastlane lanes and CI
workflows are kept, unused, under `legacy/` for reference.
