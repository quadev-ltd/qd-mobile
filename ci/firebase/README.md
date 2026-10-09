# CI fixtures

Placeholder Firebase config files used **only** by the native build checks in
`.github/workflows/native-build.yml`. They point at a fake project (`ci-placeholder`, project number
`000000000000`) with no real keys, so the build checks need no secrets and also run for pull requests from
forks. An app built with them compiles and launches but cannot reach Firebase.

Real config files for local and release builds live in the gitignored `firebase-config/` folder (and in EAS
for store builds). Never put real Firebase config here.
