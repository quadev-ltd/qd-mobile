// Talks to the local Firebase emulators started from quadev-backend
// (firebase emulators:start --only auth,firestore,functions --project quadevapp-dev).
// Maestro runs scripts on the host, so "localhost" is the emulators. Never point this at a real
// project. Each runScript file is self-contained (Maestro has no imports between scripts).
var PROJECT = "quadevapp-dev";
var AUTH = "http://localhost:9099";
var FIRESTORE = "http://localhost:8080";
var KEY = "emulator-api-key"; // the Auth emulator accepts any API key
var ADMIN = { "Content-Type": "application/json", Authorization: "Bearer owner" }; // emulator-only admin

// Setup for the sign-in flows: a verified account with a profile, created directly in the
// emulators (admin calls), so the flow does not depend on the sign-up UI.
var signUp = http.post(AUTH + "/identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + KEY, {
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true }),
});
if (signUp.status !== 200) {
  throw new Error("Emulator sign-up failed: HTTP " + signUp.status);
}
var uid = json(signUp.body).localId;
var verified = http.post(AUTH + "/identitytoolkit.googleapis.com/v1/projects/" + PROJECT + "/accounts:update", {
  headers: ADMIN,
  body: JSON.stringify({ localId: uid, emailVerified: true }),
});
if (verified.status !== 200) {
  throw new Error("Emulator email verification failed: HTTP " + verified.status);
}
var profile = http.post(
  FIRESTORE + "/v1/projects/" + PROJECT + "/databases/(default)/documents/users?documentId=" + uid,
  {
    headers: ADMIN,
    body: JSON.stringify({
      fields: {
        firstName: { stringValue: "Grace" },
        lastName: { stringValue: "Hopper" },
        createdAt: { timestampValue: new Date().toISOString() },
      },
    }),
  },
);
if (profile.status !== 200) {
  throw new Error("Emulator profile write failed: HTTP " + profile.status);
}
output.uid = uid;
