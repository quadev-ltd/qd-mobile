# Legacy release path (React Native CLI, before Expo)

Kept for reference until phase 5 (EAS Build/Submit). Nothing here runs:

- `.github/workflows/`: the old `pr.yml`, `main.yml` and `tag.yml` workflows. GitHub only runs
  workflows from the repository's `.github/workflows/`, so these are inert.
- `ios/fastlane`, `android/fastlane`, `Gemfile*`: the fastlane lanes (match, pilot, supply).
- `Dockerfile`: the Android CI image used by the old `build-android` job.

The native `ios/` and `android/` projects they built are generated now (`expo prebuild`)
and are no longer in git; the last version with them is `445cb68` on `main`.
