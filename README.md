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
  - `.env.dev` and `.env.prod` (deliberately not `.env.development` / `.env.production`: Expo CLI
    loads those automatically by build mode, which would mix the variants, e.g. a production-variant
    debug build would pick up the development file)

All variables use the `EXPO_PUBLIC_` prefix: Expo inlines them into the JavaScript bundle at build
time, so they must not hold secrets. They are validated in `src/core/env.ts`, the only file allowed
to read `process.env`. (`EXPO_PUBLIC_REVERSED_CLIENT_ID` is only read by the parity script.)

# Backend: Firebase
The app talks only to Firebase (project `quadevapp-dev` for the development variant, `quadevapp` for
production); the backend code, Firestore rules and API contract live in `quadev-backend`
(`docs/api.md`).

- `src/core/firebase/` is the only code that imports `@react-native-firebase/*` (besides the
  Crashlytics logger): `auth.ts` (sign-up, sign-in, Google/Apple, verification, password reset,
  sign-out, delete), `profile.ts` (`users/{uid}`), `claims.ts` (`paid` / `admin` custom claims),
  `errors.ts` (Firebase codes → i18n keys; logs only the uid and the error code).
- `src/core/session/SessionProvider.tsx` follows `onAuthStateChanged` and the profile document and
  keeps the `session` Redux slice up to date. Its status picks what the router shows:

  | Status | Shown |
  |---|---|
  | `initializing` | splash, then the loading screen |
  | `signedOut` | Landing, Sign in, Sign up, Forgot password |
  | `needsEmailVerification` | VerifyEmail (email/password accounts only) |
  | `needsProfile` | CompleteProfile (no profile yet, e.g. Apple without a name) |
  | `ready` | Home drawer |

- Flows:
  - **Sign up:** account → profile (`users/{uid}`; date of birth optional) → verification email.
  - **Verify email / reset password:** the links open Firebase's hosted pages; there are no deep or
    app links. Back in the app, VerifyEmail reloads the user ("I've verified", or on returning to
    the app).
  - **Google / Apple:** a new user gets a profile from the provider's names; if a name is missing,
    CompleteProfile asks for it.
  - **Forgot password:** always the same neutral message (email enumeration protection is on).
  - **Delete account:** re-authentication by provider (password prompt when Firebase asks for a
    recent login, Google, or Apple on iOS with token revocation), then `deleteUser`; the backend's
    `onUserDeleted` deletes the profile.

## Running against the Firebase emulators
Use the emulators for local development and end-to-end tests; never create test users in the real
projects.

```bash
# 1. In quadev-backend (Node 24, JDK 21): build the functions once, then start the emulators
npm --prefix services/accounts run build
PATH="$(/usr/libexec/java_home -v 21)/bin:$PATH" \
  firebase emulators:start --only auth,firestore,functions --project quadevapp-dev

# 2. Here: Metro with the emulator flag, then the development build (Android emulator or iOS simulator)
EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true yarn start:dev
yarn android:dev   # or an already installed development build
```

With `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true`, Auth, Firestore and Functions connect to `localhost`
(React Native Firebase maps it to `10.0.2.2` on the Android emulator; a physical device needs the
host's IP instead). Verification and reset emails are not sent: the Auth emulator lists them at
`http://localhost:9099/emulator/v1/projects/quadevapp-dev/oobCodes`, and opening an `oobLink`
applies it. The emulator UI is at `http://localhost:4000`.

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
maestro test .maestro  # end-to-end flows (needs the Firebase emulators, see below)
```

## End-to-end tests (Maestro)
Two flows cover the critical paths; everything more detailed is a Jest test. Both need the Firebase
emulators and a development build bundled with `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true` (see above).
Their helper scripts (`.maestro/scripts/`) call the emulators' REST APIs on `localhost` to apply the
verification link and check that the account and profile were deleted.

```bash
maestro test .maestro                             # both flows (about 3 minutes)
maestro test .maestro/auth-email-lifecycle.yaml   # sign up → verify → home → sign out → sign in → delete
maestro test .maestro/auth-sign-in-errors.yaml    # wrong password, forgot password (neutral message)
```

# Releases
Store builds move to EAS Build/Submit in a later phase. Until then, the old fastlane lanes and CI
workflows are kept, unused, under `legacy/` for reference.
