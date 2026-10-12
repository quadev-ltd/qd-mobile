# Content rating and age rating answers (DRAFT, for owner review)

> **DRAFT.** For version 2.0.0 (accounts only). Re-answer when features with user-generated content,
> chat or AI-generated content ship.

## Google Play: IARC questionnaire (Policy → App content → Content rating)
- Email for the certificate: _owner's developer email_.
- Category: **All other app types** (not a game, not social, not a news or reference app).
- Violence, fear, sexuality, language, controlled substances, crude humour: **No** to all.
- Gambling or simulated gambling: **No**.
- Users can interact or exchange content with each other (chat, sharing, UGC): **No**.
- Shares the user's current physical location with other users: **No**.
- Allows users to purchase digital goods: **No**.
- Unrestricted internet access (web browser, search): **No** (Terms and Privacy open the system
  browser on two fixed pages).
- Expected result: **Everyone / PEGI 3 / USK 0** (or equivalent).

## Google Play: Target audience and content
- Target age groups: **18 and over** (the app is a professional tool; not designed for children,
  so the Families policy does not apply). Appeals to children: **No**.

## Apple: Age rating (in `store.config.json` → `apple.advisory`)
All content descriptors **None**; gambling, loot boxes, unrestricted web access, messaging and chat,
user-generated content, advertising, parental controls, age assurance, health or wellness topics:
**No**; not in the Kids category (`kidsAgeBand: null`); no age-rating override.
Expected result: **4+** (shown as 4+ under Apple's 2025 age-rating system).
