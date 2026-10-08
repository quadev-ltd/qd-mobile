// Talks to the local Firebase emulators started from quadev-backend
// (firebase emulators:start --only auth,firestore,functions --project quadevapp-dev).
// Maestro runs scripts on the host, so "localhost" is the emulators. Never point this at a real
// project. Each runScript file is self-contained (Maestro has no imports between scripts).
var PROJECT = "quadevapp-dev";
var AUTH = "http://localhost:9099";
var FIRESTORE = "http://localhost:8080";
var KEY = "emulator-api-key"; // the Auth emulator accepts any API key
var ADMIN = { "Content-Type": "application/json", Authorization: "Bearer owner" }; // emulator-only admin

// The app shows the same neutral message either way; for an existing account the Auth emulator
// must have queued a password reset email.
var codes = json(http.get(AUTH + "/emulator/v1/projects/" + PROJECT + "/oobCodes").body).oobCodes || [];
var mine = codes.filter(function (c) { return c.email === EMAIL && c.requestType === "PASSWORD_RESET"; });
if (!mine.length) {
  throw new Error("No password reset email in the Auth emulator for this address");
}
