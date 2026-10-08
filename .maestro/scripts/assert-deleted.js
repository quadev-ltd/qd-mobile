// Talks to the local Firebase emulators started from quadev-backend
// (firebase emulators:start --only auth,firestore,functions --project quadevapp-dev).
// Maestro runs scripts on the host, so "localhost" is the emulators. Never point this at a real
// project. Each runScript file is self-contained (Maestro has no imports between scripts).
var PROJECT = "quadevapp-dev";
var AUTH = "http://localhost:9099";
var FIRESTORE = "http://localhost:8080";
var KEY = "emulator-api-key"; // the Auth emulator accepts any API key
var ADMIN = { "Content-Type": "application/json", Authorization: "Bearer owner" }; // emulator-only admin

// The Auth account is gone, and the backend's onUserDeleted trigger removed users/{uid}.
// The trigger is asynchronous, so the flow wraps this script in "retry".
var session = http.post(AUTH + "/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + KEY, {
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true }),
});
if (session.status === 200) {
  throw new Error("The Auth account still exists");
}
var doc = http.get(FIRESTORE + "/v1/projects/" + PROJECT + "/databases/(default)/documents/users/" + UID, {
  headers: ADMIN,
});
if (doc.status !== 404) {
  throw new Error("Expected users/{uid} to be deleted, got HTTP " + doc.status);
}
