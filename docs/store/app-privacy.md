# Apple App Privacy labels (DRAFT, for owner review)

> **DRAFT.** Derived from the app code at version 2.0.0, same facts as `data-safety.md`. The owner
> answers the questionnaire in App Store Connect (App → App Privacy) and is responsible for it.
> Re-check whenever a feature or SDK is added.

## Tracking
**Does the app or its third-party partners use data for tracking?** **No.** No advertising, no
advertising identifier, no data brokers, no cross-app linking. The privacy manifest says
`NSPrivacyTracking: false`, and the App Tracking Transparency prompt is not needed.

## Data collected

| Data type | Linked to the user | Used for tracking | Purposes |
|---|---|---|---|
| Contact Info → **Name** | Yes | No | App Functionality |
| Contact Info → **Email Address** | Yes | No | App Functionality |
| Identifiers → **User ID** (Firebase user id) | Yes | No | App Functionality |
| Diagnostics → **Crash Data** | Yes (log lines can include the Firebase user id) | No | App Functionality |
| Diagnostics → **Other Diagnostic Data** (non-fatal error reports) | Yes | No | App Functionality |
| Identifiers → **Device ID** (Crashlytics installation id) | Yes | No | App Functionality |
| Other Data → **Other Data Types** (optional date of birth) | Yes | No | App Functionality |

Notes:
- **Sign in with Apple:** the email may be a private relay address; it is still Email Address.
- **Camera / Photos:** the usage strings stay in the build (build-time config), but the only screen
  that uses them (Smart inspection) is hidden in 2.0.0 and uploads nothing. Do not declare Photos
  or Videos for 2.0.0; declare them before Smart inspection ships with uploads.
- **Not collected:** location, health, financial info, contacts, user content, browsing or search
  history, purchases, usage data (no analytics), sensitive info.
- Crash reporting is on only in production builds (`src/core/logger.ts`).
- Follow-up (not blocking): `NSPrivacyCollectedDataTypes` in `app.config.ts` is empty; the Firebase
  SDKs ship their own privacy manifests, but listing the types above in the app's manifest keeps it
  consistent with these labels.

## Account deletion
Apple requires in-app account deletion for apps with account creation: **Delete account** in the
drawer (with re-authentication and Apple token revocation on iOS).

## Export compliance
`ITSAppUsesNonExemptEncryption = false` (`ios.config.usesNonExemptEncryption` in `app.config.ts`):
only standard HTTPS/TLS through the OS and Firebase SDKs, so no export compliance documents.
