// A fresh address per run, so a flow never collides with an earlier account.
// No "+" in it: Maestro text assertions are regular expressions, where "+" is a quantifier.
output.email = "e2e-" + new Date().getTime() + "@example.com";
