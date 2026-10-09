# Google Play Data safety answers (DRAFT, for owner review)

> **DRAFT.** Derived from the app code at version 2.0.0 (`src/core/firebase/*`, `src/core/logger.ts`,
> `app.config.ts`). The owner answers the form in Play Console (Policy → App content → Data safety)
> and is responsible for it. Re-check whenever a feature or SDK is added (for example Smart
> inspection, Remote Config, an AI service).

## What the app does with data
- **Firebase Authentication:** email address, password (handled by Firebase, never stored by the
  app), Google sign-in (Google account email and name), and the Firebase user id.
- **Cloud Firestore `users/{uid}`:** first name, last name, optional date of birth, creation time.
- **Firebase Crashlytics (production builds only):** crash and non-fatal error reports with device
  model, OS version, app version, a Crashlytics installation id, stack traces and short log lines.
  The app's own log lines contain only an operation name, an error code and the Firebase user id
  (`logFirebaseError`), never email, names or tokens.
- **Cloud Functions:** callables run on the user's own account (no extra data types).
- **Not used:** Firebase Analytics (removed), advertising id (`AD_ID` blocked), ads, location,
  contacts, messaging, push notifications, payments, third-party tracking.
- **Camera / photos:** only the Smart inspection screen uses them, and it is hidden in this release
  (decision: sign-in and accounts only; the feature is gated behind a flag before 2.0.0 ships).
  The photo is not uploaded anywhere in 2.0.0 (the analysis is a mock). If Smart inspection ships
  later with uploads, add **Photos** (and user-provided text) to this form first.

## Overview questions

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** (Firebase uses TLS only) |
| Do you provide a way for users to request that their data is deleted? | **Yes**: in-app "Delete account" (deletes the Firebase account; the backend `onUserDeleted` function deletes the profile). Play also asks for a **web link** for deletion requests: _owner to provide a page, e.g. https://quadev.net/delete-account, explaining the in-app path and an email contact._ |
| Shared with third parties? | **No.** Google/Firebase act as service providers (processors) for the developer, which Play does not count as sharing. |

## Data types collected

| Category → type | Collected | Shared | Processed ephemerally | Required or optional | Purposes |
|---|---|---|---|---|---|
| Personal info → **Name** | Yes | No | No | Required (an account needs first and last name) | Account management, App functionality |
| Personal info → **Email address** | Yes | No | No | Required | Account management, App functionality |
| Personal info → **User IDs** (Firebase user id) | Yes | No | No | Required | Account management, App functionality |
| Personal info → **Other info** (date of birth) | Yes | No | No | Optional | Account management |
| App info and performance → **Crash logs** | Yes | No | No | Required (no opt-out in the app) | App functionality (analytics: no) |
| App info and performance → **Diagnostics** | Yes | No | No | Required | App functionality |
| Device or other IDs → **Device or other IDs** (Crashlytics installation id) | Yes | No | No | Required | App functionality |

Not collected: location, financial info, health and fitness, messages, photos and videos (in 2.0.0),
audio, files and docs, calendar, contacts, app activity, web browsing.

Passwords: Play treats passwords as authentication data that does not need to be declared when it is
only used to sign in; Firebase stores them hashed.

## Security practices (shown on the listing)
- Data is encrypted in transit: **Yes**.
- You can request that data be deleted: **Yes**.
- Independent security review: **No** (unless one is done).
