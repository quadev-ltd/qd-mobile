# App review account and notes (DRAFT, for owner review)

> **DRAFT.** Both stores need a way to sign in. Create the review account in the **production**
> Firebase project only for store review (never commit or paste its password), and enter the
> credentials directly in Play Console (App content → App access) and App Store Connect (App Review
> Information). The App Store contact block is not in `store.config.json` because its contact
> fields are required; add it locally before `eas metadata:push` or fill it in App Store Connect.

## Review account (owner)
1. Sign up in the production app (or Firebase console → Authentication → Add user in `quadevapp`)
   with a dedicated address, e.g. `appreview@quadev.net`, and a strong password kept in the owner's
   password manager.
2. Verify the email so the account opens straight to Home.
3. Do not delete it while a review is pending. Reviewers may delete it as part of testing account
   deletion; re-create it before the next submission if so.

## Notes for the reviewer (paste into both consoles)

```
QuaDev 2.0.0 is the account foundation for upcoming AI-powered tools for professionals.

Sign in with the demo account (email + password), or create a new account with email, Google or
(on iOS) Sign in with Apple. New email accounts must verify their address through the link we send.

After signing in: the Home screen and the drawer menu (top left) with Delete account and Sign out.
Delete account permanently deletes the account and its profile data (it asks you to confirm your
identity first).

The app has no ads, no in-app purchases and no tracking. Camera and photo permission strings are
present for a feature that is not enabled in this version; the app never requests these permissions
in 2.0.0.
```

## Risk to check before submitting (owner)
- **Smart inspection must be hidden first:** these notes and the privacy answers assume the
  feature-flag change (branch `platform-flags`) is merged, so the Smart inspection screen and its
  drawer item are gone by default. Do not tag `v2.0.0` before that.
- **Apple guideline 4.2 (minimum functionality):** an app that only offers sign-in and an account can
  be rejected as not useful enough on its own. Consider shipping 2.0.0 to TestFlight / the Play
  internal track first and submitting for public review when the first AI feature is ready, or
  adding a clear first feature.
- **Guideline 5.1.1:** a privacy policy URL that works and matches `app-privacy.md`; account
  deletion inside the app (done).
- **Play policy:** the account-deletion web link in `data-safety.md`, and a working privacy policy.
