# Releases (EAS Build and Submit)

Store builds are made by [EAS Build](https://docs.expo.dev/build/introduction/) and uploaded by
[EAS Submit](https://docs.expo.dev/submit/introduction/). Pushing a tag `vX.Y.Z` starts both from
GitHub Actions (`.github/workflows/release.yml`); testers get internal builds from
`.github/workflows/preview-build.yml`.

| Platform | Store id (production / development) | Firebase project |
|---|---|---|
| Android | `net.quadev.app` / `net.quadev.app.dev` (decision D19) | `quadevapp` / `quadevapp-dev` |
| iOS | `com.qdmobile` / `com.qdmobile.dev` (unchanged) | `quadevapp` / `quadevapp-dev` |

## How it fits together

- **`eas.json`** (build profiles, all extend `base`: Node 24.21.0 and Corepack for Yarn 4):

  | Profile | Variant | Distribution | EAS environment | Used by |
  |---|---|---|---|---|
  | `preview-dev` | development | internal (APK / ad hoc) | `development` | `preview-build.yml` (variant `dev`) |
  | `preview` | production | internal (APK / ad hoc) | `preview` | `preview-build.yml` (variant `prod`) |
  | `production` | production | store (AAB / App Store) | `production` | `release.yml` |

  Submit profile `production`: Android to the Play **internal** track as a **draft**; iOS to App
  Store Connect (TestFlight) for team `LQRYUWUP72`. `ascAppId` is added after the first iOS submit
  (step 5 below); JSON has no comments, so it is noted here.
- **Configuration on EAS.** EAS does not read `.env.dev` / `.env.prod`, the gitignored
  `firebase-config/` folder, or GitHub Actions variables. The build server resolves
  `app.config.ts` with the profile's `env` (`APP_VARIANT`) plus the **EAS environment variables** of
  the profile's environment:
  - `EXPO_PUBLIC_*` (the keys in `.env.example`), visibility **sensitive**;
  - `GOOGLE_SERVICES_JSON` and `GOOGLE_SERVICE_INFO_PLIST`, type **file**, visibility **secret**.
    EAS exposes a file variable as the path to the file, and `app.config.ts` uses
    `process.env.GOOGLE_SERVICES_JSON ?? ./firebase-config/<variant>/google-services.json` (same for
    the plist).

  | EAS environment | Values from |
  |---|---|
  | `development` | `.env.dev`, `firebase-config/development/*` |
  | `preview` and `production` | `.env.prod`, `firebase-config/production/*` |
- **Versions.** `cli.appVersionSource` is `remote`: EAS stores the Android `versionCode` and iOS
  `buildNumber`, and `autoIncrement` bumps them on every `production` build. The first build seeds
  them from `app.config.ts` (`versionCode: 17`, `buildNumber: '27'`), so 2.0.0 ships as 18 / 28.
  The marketing version is `version` in `app.config.ts`, which must equal `package.json`
  `"version"` (the release workflow checks the tag against `package.json`).
- **Store listing.** `store.config.json` holds the App Store listing for `eas metadata:push` (App
  Store only). The Play listing, Data safety, App Privacy, ratings and review notes are drafted in
  `docs/store/` and entered by hand in Play Console / App Store Connect.
- **Free plan limits:** 15 Android and 15 iOS builds a month, 45-minute build timeout. A release is
  one build per platform; use preview builds sparingly.

## One-time setup

Roles: **Owner** = the account holder (logins, payments, store consoles). **Claude** = changes in
the repo and CLI work in an already logged-in shell. Commands the owner runs in the Claude Code
session are prefixed with `!` so the login prompts stay in the owner's terminal. Secrets (tokens,
keys, passwords, `.env` values) are never pasted into the chat, printed, or committed.

1. **Expo project**
   - Owner: create the Expo account and the organisation `quadev` (expo.dev), then `! eas login`.
   - Claude: `eas init` (in the repo), then a small PR that adds `owner: 'quadev'`, the `slug` it
     prints, and `extra.eas.projectId` to `app.config.ts` (a dynamic config, so `eas init` prints
     them instead of writing them).
2. **EAS environment variables** (Claude, logged-in shell). Values are read from the local
   gitignored files into the command without being printed, for example:
   ```bash
   set -a; source .env.prod; set +a
   eas env:set production --name EXPO_PUBLIC_CLIENT_ID --value "$EXPO_PUBLIC_CLIENT_ID" \
     --visibility sensitive --non-interactive
   eas env:set production --name GOOGLE_SERVICES_JSON --type file \
     --value firebase-config/production/google-services.json --visibility secret --non-interactive
   eas env:set production --name GOOGLE_SERVICE_INFO_PLIST --type file \
     --value firebase-config/production/GoogleService-Info.plist --visibility secret --non-interactive
   ```
   Repeat for every `EXPO_PUBLIC_*` key in `.env.example` (except `EXPO_PUBLIC_REVERSED_CLIENT_ID`,
   which only the parity script reads, and `EXPO_PUBLIC_USE_FIREBASE_EMULATORS`), for the
   `production` and `preview` environments from `.env.prod` / `firebase-config/production`, and for
   `development` from `.env.dev` / `firebase-config/development`. Check with
   `eas env:list <environment>` (sensitive and secret values are masked).
3. **First build per platform, interactive** (Owner, because Apple sign-in and key prompts need a
   person):
   - `! eas build -p ios --profile production`: sign in with the Apple ID, let EAS sync the
     capabilities (Sign in with Apple), and create the distribution certificate and provisioning
     profile for `com.qdmobile`.
   - `! eas build -p android --profile production`: let EAS generate the **upload keystore** for
     `net.quadev.app`.
   - Do not submit these yet (or submit iOS only after step 4). They count toward the monthly quota.
4. **Store accounts and submit credentials**
   - Owner (Play Console, the new organisation account): create the app (name "QuaDev", package
     `net.quadev.app`, free, app), fill in the store listing, Data safety, content rating, target
     audience and app access from `docs/store/`. Google requires the first AAB of a new app to be
     **uploaded by hand** once: download the AAB from step 3 (expo.dev) and upload it to the
     internal testing track. After that EAS Submit can upload.
   - Claude (on approval, with `gcloud` already logged in): create a service account for Play
     publishing in the production Google Cloud project, e.g.
     `gcloud iam service-accounts create eas-play-submit --project quadevapp --display-name "EAS Play submit"`,
     and a JSON key written straight to a local gitignored path (never printed).
   - Owner: in Play Console, Users and permissions, invite the service account email with the
     release permissions for this app. Then `! eas credentials -p android` → production →
     Google Service Account → upload the JSON key. Delete the local key file afterwards.
   - Owner: App Store Connect → Users and Access → Integrations → create an **App Store Connect API
     key** (App Manager), then `! eas credentials -p ios` → App Store Connect API key → add it.
   - Owner: `! eas submit -p ios --profile production --latest` once. It creates the App Store
     Connect app record (interactive) and uploads the build from step 3 to TestFlight.
5. **Release signing fingerprints and ascAppId** (Claude)
   - Read the SHA-1 and SHA-256 of the **EAS upload key** (`eas credentials -p android`, production
     keystore) and of the **Play app-signing key** (Play Console → Test and release → App
     integrity → App signing; the owner can read them out, they are public fingerprints).
   - Add all four to the Firebase Android app `net.quadev.app` (project `quadevapp`):
     `firebase apps:android:sha:create <appId> <sha> --project quadevapp`. Google sign-in on store
     and `preview` builds needs them. For `preview-dev` builds, add the SHA-1/SHA-256 of the EAS
     keystore for `net.quadev.app.dev` to the dev app in `quadevapp-dev`.
   - Download the updated `google-services.json` (`firebase apps:sdkconfig ANDROID <appId>`) into
     `firebase-config/<variant>/` without printing it, and update the `GOOGLE_SERVICES_JSON` file
     variable (step 2), since the new OAuth clients are listed in it.
   - Set `submit.production.ios.ascAppId` in `eas.json` to the App Store Connect app id (Apple ID
     of the app, a number) in a small PR, so iOS auto-submit works non-interactively.
   - Record the fingerprints and the app ids in quadev-backend `docs/operations/infrastructure-log.md`.
6. **Turn on the workflows** (Owner)
   - Create an Expo **robot** access token (expo.dev → organisation `quadev` → Access tokens) and
     save it as the GitHub Actions secret `EXPO_TOKEN` (repo Settings → Secrets and variables →
     Actions). Do not paste it anywhere else.
   - Add the repository **variable** `EAS_RELEASE_ENABLED` = `true`. Until it exists, both
     workflows show as skipped.
   - Release: `git tag v2.0.0 && git push --tags` (see below).

## Releasing a version

1. Bump the version in **both** `package.json` (`"version"`) and `app.config.ts` (`version`) in a
   PR, e.g. `2.0.1` (bug fixes), `2.1.0` (features). Merge it.
2. Tag the merge commit on `main` and push the tag:
   ```bash
   git switch main && git pull
   git tag v2.0.1 && git push origin v2.0.1
   ```
3. The **Release** workflow checks the tag against `package.json`, then queues the EAS production
   builds with auto-submit and ends. Follow the builds and submissions on expo.dev.
4. **Android:** the build lands in the Play **internal** track as a **draft** release. In Play
   Console, open the draft, check it, and roll it out to internal testers; then promote it to
   closed/open testing or production (with a staged rollout percentage if wanted). EAS never
   publishes to production by itself.
5. **iOS:** the build lands in TestFlight after processing. Add it to testers, then create the App
   Store version (or `eas metadata:push` with the updated `store.config.json`, whose
   `apple.version` must match), choose the build and submit it for review. `release.automaticRelease`
   is `false`, so an approved version waits for a manual release.

A failed release can be re-run from the Actions tab (Re-run jobs) or by deleting and re-pushing the
tag; every new production build gets a new build number anyway.

### Version numbers
- Build numbers live on EAS (`appVersionSource: remote`). Inspect or change them with
  `eas build:version:get` / `eas build:version:set -p android -e production` (or `-p ios`), for
  example to jump past a number that a manual upload already used. A store rejects a build number
  it has seen before for that app.
- `versionCode` / `buildNumber` in `app.config.ts` are only the initial seed and local-build
  values; do not bump them for releases.

### Preview builds for testers
Actions → **Preview build** → Run workflow → variant `dev` (development, `quadevapp-dev`) or `prod`
(production variant, `quadevapp`), platform `android` (default), `ios` or `all`. Android builds
give an installable APK link on expo.dev. iOS internal builds only install on devices registered
with `eas device:create` (ad hoc provisioning).

## Rollback
Store binaries cannot be pulled back from users' devices; roll forward instead.
- **Android:** in Play Console, **halt** the rollout of the bad release (Release → Manage → Halt
  rollout) if it is staged, then fix, bump the version (e.g. `2.0.2`), tag and release. To serve the
  previous binary again, it has to be re-released with a **higher** `versionCode`: rebuild the old
  tag after bumping the build number (`eas build:version:set`) or promote a still-unreleased
  earlier build.
- **iOS:** remove the version from sale or from review in App Store Connect if it has not reached
  users; phased release can be paused for up to 30 days. Otherwise ship a fixed version through
  expedited review.
- **Firebase:** server-side changes (rules, functions) roll back independently in quadev-backend.
- **Release workflow:** setting `EAS_RELEASE_ENABLED` to anything but `true` disables both
  workflows immediately.

## Play draft vs completed
`submit.production.android.releaseStatus` is `draft`: EAS uploads the AAB and creates a draft
release on the internal track, which a person reviews and rolls out in Play Console. Google also
requires drafts while the app has never been reviewed. Once releases are routine, it can change to
`completed` (rolls out to the internal track automatically) or `inProgress` with `rollout` (staged).
Production releases stay manual promotions in Play Console either way.
