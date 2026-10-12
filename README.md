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
  `errors.ts` (Firebase codes → i18n keys; logs only the uid and the error code), `featureFlags.ts`
  (`featureFlags/{uid}`) and `remoteConfig.ts` (feature flags, see below).
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

## Feature flags
Features can be turned on per user or for everyone without a release (decision D18, quadev-backend
ADR 0013). A flag is evaluated in this order:

1. **Per-user override:** the document `featureFlags/{uid}` (one boolean field per flag). The app
   listens to it live while the user is signed in; only the backend writes it (clients can only read
   their own).
2. **Remote Config:** the parameter with the flag's name (template in quadev-backend
   `remoteconfig.template.json`). Fetched at app start (at most once an hour in production, always
   in development) and updated in real time.
3. **Code default** in `src/core/flags/registry.ts`, which mirrors quadev-backend
   `packages/flags/src/index.ts`. Every flag defaults to off, and the code defaults are also the
   Remote Config in-app defaults.

Any failure (offline, permission denied, missing document) falls back to the next layer, so the app
never waits for flags. With `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true` Remote Config is skipped (it has
no emulator): overrides in the Firestore emulator and the code defaults decide.

| Flag | What it gates in the app |
|---|---|
| `smartInspection` | The Smart inspection screen and its drawer item (off: hidden, still a mock) |
| `interviewAssistant` | Nothing yet |
| `aiDiagnostics` | Nothing (backend only) |

In code: `useFlag('smartInspection')` (from `src/core/flags/FlagsProvider.tsx`; `FlagsProvider` is
mounted in `App.tsx` inside `SessionProvider`).

**Turning a flag on for one user** (from quadev-backend; an offline dry run unless `--apply`, which
needs `gcloud auth application-default login` and the owner's access):

```bash
npm run set-flag -- --project quadevapp-dev --email you@example.com --flag smartInspection --on
npm run set-flag -- --apply --project quadevapp-dev --uid <uid> --flag smartInspection --on
npm run set-flag -- --apply --project quadevapp-dev --uid <uid> --flag smartInspection --clear
npm run list-flags -- --project quadevapp-dev
```

The app picks the change up within seconds, without a restart (`--clear` hands the decision back to
Remote Config). **For everyone:** change the parameter in the Remote Config console (or the template
in quadev-backend and deploy it); open apps update in real time. **Adding a flag:** add it to
quadev-backend `packages/flags` and `remoteconfig.template.json` first, then mirror it in
`src/core/flags/registry.ts`.

# Quickstart

```bash
yarn install
yarn android:dev     # build, install and run the development variant (Android net.quadev.app.dev)
yarn ios:dev         # same on iOS (com.qdmobile.dev)
yarn start:dev       # Metro only, for an already installed development build
```

`android:prod`, `ios:prod` and `start:prod` do the same for the production variant (Android
`net.quadev.app`, iOS `com.qdmobile`). Android moved to `net.quadev.app` in 2.0.0 (decision D19: the
first Play developer account was closed and its package names cannot be reused); iOS keeps its ids.
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

## Pull request checks (CI)
Every pull request into `main` runs:

| Check | Workflow | What it proves |
| --- | --- | --- |
| `run-checks` | `pr.yml` | TypeScript, lint, Jest, `expo-doctor`, SDK dependency versions |
| `build-android` | `native-build.yml` | `expo prebuild` + a Gradle debug build compile every native module and config plugin |
| `build-ios` | `native-build.yml` | `expo prebuild` + CocoaPods + an Xcode 26.5 simulator build (no signing) |
| `gitleaks` | `secret-scan.yml` | No secrets in the new commits |

The native builds use the placeholder Firebase config in `ci/firebase/` (no secrets needed). They take
roughly 10-15 minutes (Android) and 20-30 minutes (iOS).

## End-to-end tests (Maestro)
Two flows cover the critical paths; everything more detailed is a Jest test. Both need the Firebase
emulators and a development build bundled with `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true` (see above).
Their helper scripts (`.maestro/scripts/`) call the emulators' REST APIs on `localhost` to apply the
verification link and check that the account and profile were deleted.

```bash
maestro test .maestro                             # both flows (about 3 minutes)
maestro test .maestro/auth-email-lifecycle.yaml   # sign up → verify → home → sign out → sign in → delete
maestro test .maestro/auth-sign-in-errors.yaml    # wrong password, forgot password (neutral message)
maestro test -e APP_ID=com.qdmobile.dev .maestro  # on the iOS simulator (the default is the Android id)
```

# Releases
Store builds are made with **EAS Build** and uploaded with **EAS Submit**; the full runbook (one-time
setup, tagging, version numbers, rollback) is in [`docs/release.md`](docs/release.md).

- **Config:** `eas.json` (profiles `preview-dev`, `preview`, `production`; submit `production`),
  `store.config.json` (App Store listing for `eas metadata:push`), and the drafts in `docs/store/`
  (Play listing, Data safety, App Privacy, ratings, review notes).
- **Release:** bump `version` in `package.json` and `app.config.ts` (they must match), merge, then
  `git tag vX.Y.Z && git push origin vX.Y.Z`. The `release.yml` workflow checks the tag, starts the
  EAS production builds for both platforms and auto-submits them: Android to the Play internal track
  as a draft, iOS to TestFlight. Promotion to production is done by hand in the store consoles.
- **Testers:** the `preview-build.yml` workflow (Actions → Preview build → Run workflow) makes an
  internal build of the dev or prod variant.
- **Build numbers** (`versionCode`, `buildNumber`) are managed by EAS (`appVersionSource: remote`,
  `eas build:version:set`); the values in `app.config.ts` only seeded them.
- **EAS config values:** EAS does not read `.env.*` or `firebase-config/`. The `EXPO_PUBLIC_*` values
  and the Firebase files (`GOOGLE_SERVICES_JSON`, `GOOGLE_SERVICE_INFO_PLIST`, file variables) are EAS
  environment variables per environment (`development`, `preview`, `production`).
- **Off until set up:** both workflows only run when the repository variable `EAS_RELEASE_ENABLED`
  is `true` and the `EXPO_TOKEN` secret exists (see the runbook).

The old fastlane lanes and CI workflows are kept, unused, under `legacy/` for reference.
