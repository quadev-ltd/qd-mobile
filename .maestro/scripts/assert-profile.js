// Talks to the local Firebase emulators started from quadev-backend
// (firebase emulators:start --only auth,firestore,functions --project quadevapp-dev).
// Maestro runs scripts on the host, so "localhost" is the emulators. Never point this at a real
// project. Each runScript file is self-contained (Maestro has no imports between scripts).
var PROJECT = "quadevapp-dev";
var AUTH = "http://localhost:9099";
var FIRESTORE = "http://localhost:8080";
var KEY = "emulator-api-key"; // the Auth emulator accepts any API key
var ADMIN = { "Content-Type": "application/json", Authorization: "Bearer owner" }; // emulator-only admin

// The sign-up created users/{uid} (read with emulator admin rights).
var doc = http.get(FIRESTORE + "/v1/projects/" + PROJECT + "/databases/(default)/documents/users/" + UID, {
  headers: ADMIN,
});
if (doc.status !== 200) {
  throw new Error("Expected users/{uid} to exist, got HTTP " + doc.status);
}
