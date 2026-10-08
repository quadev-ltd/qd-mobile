// Talks to the local Firebase emulators started from quadev-backend
// (firebase emulators:start --only auth,firestore,functions --project quadevapp-dev).
// Maestro runs scripts on the host, so "localhost" is the emulators. Never point this at a real
// project. Each runScript file is self-contained (Maestro has no imports between scripts).
var PROJECT = "quadevapp-dev";
var AUTH = "http://localhost:9099";
var FIRESTORE = "http://localhost:8080";
var KEY = "emulator-api-key"; // the Auth emulator accepts any API key
var ADMIN = { "Content-Type": "application/json", Authorization: "Bearer owner" }; // emulator-only admin

// Applies the latest verification link the Auth emulator "sent" to EMAIL (a plain GET of the
// oobLink verifies the email), then records the uid for the later checks.
var codes = json(http.get(AUTH + "/emulator/v1/projects/" + PROJECT + "/oobCodes").body).oobCodes || [];
var mine = codes.filter(function (c) { return c.email === EMAIL && c.requestType === "VERIFY_EMAIL"; });
if (!mine.length) {
  throw new Error("No verification email in the Auth emulator for this address");
}
var applied = http.get(mine[mine.length - 1].oobLink);
if (applied.status !== 200) {
  throw new Error("Applying the verification link failed: HTTP " + applied.status);
}
var session = http.post(AUTH + "/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + KEY, {
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true }),
});
if (session.status !== 200) {
  throw new Error("Could not read the uid from the Auth emulator: HTTP " + session.status);
}
output.uid = json(session.body).localId;
