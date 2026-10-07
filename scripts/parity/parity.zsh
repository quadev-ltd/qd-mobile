#!/bin/zsh
# Native parity check: compares what the Expo-generated app declares to the stores
# (Android manifest, iOS Info.plist / entitlements / privacy manifest / build settings)
# with the pre-Expo app (origin/main 445cb68).
#
# Values of DEEP_LINKING_DOMAIN and REVERSED_CLIENT_ID are replaced by placeholders, so
# the JSON never contains configuration values. Nothing else from .env files is read.
#
# Usage (run from the repo root):
#   scripts/parity/parity.zsh android-json <apk> <deepLinkingDomain>      > out.json
#   scripts/parity/parity.zsh ios-json <Info.plist> <entitlements> <PrivacyInfo.xcprivacy> <project.pbxproj> > out.json
#   scripts/parity/parity.zsh check <development|production>
#       Needs: an APK at $APK (default: android/app/build/outputs/apk/debug/app-debug.apk),
#       the prebuilt ios/ folder, and EXPO_PUBLIC_DEEP_LINKING_DOMAIN /
#       EXPO_PUBLIC_REVERSED_CLIENT_ID in the environment (the package.json script
#       `parity:dev` / `parity:prod` loads them with dotenv-cli).
#   scripts/parity/parity.zsh baseline <development|production> <origin-main-apk>
#       Regenerates docs/parity/baseline/<variant>.json (already committed; only
#       needed if the baseline has to be captured again).
set -euo pipefail

ROOT=${0:A:h:h:h}
BASE_DIR=$ROOT/docs/parity/baseline
OUT_DIR=$ROOT/docs/parity/out
ALLOWED=$ROOT/docs/parity/allowed-diff.md
BUILD_TOOLS=${ANDROID_BUILD_TOOLS:-$HOME/Library/Android/sdk/build-tools/36.0.0}
AAPT2=$BUILD_TOOLS/aapt2
BASE_REF=445cb68

die() { print -u2 -- "parity: $*"; exit 1; }

# Replace the configured values with placeholders (reads them from the environment only).
mask() {
  local domain=${PARITY_DOMAIN:-} rcid=${PARITY_REVERSED_CLIENT_ID:-}
  jq --arg d "$domain" --arg r "$rcid" '
    def rx: gsub("(?<c>[.+*?()\\[\\]{}|^$\\\\])"; "\\\(.c)");
    ($d | rx) as $d | ($r | rx) as $r
    | def m: if type == "string" then
        (if $r != "" then gsub($r; "$(REVERSED_CLIENT_ID)") else . end)
        | (if $d != "" then gsub($d; "$(DEEP_LINKING_DOMAIN)") else . end)
        # Firebase encoded app id (URL scheme added by the RNFB auth plugin for phone auth)
        | gsub("app-[0-9]+-[0-9]+-ios-[0-9a-f]+"; "$(ENCODED_FIREBASE_APP_ID)")
      else . end;
    walk(m)
    # keys can contain the values too (sets are objects)
    | walk(if type == "object" then with_entries(.key |= m) else . end)'
}

# ---------- Android ----------
android_json() {
  local apk=$1
  [[ -f $apk ]] || die "APK not found: $apk"
  local badging xml res
  badging=$("$AAPT2" dump badging "$apk")
  xml=$("$AAPT2" dump xmltree --file AndroidManifest.xml "$apk")
  # Resource ids used by the manifest → string values (only those referenced).
  local refs
  refs=$(print -r -- "$xml" | grep -oE '=@0x[0-9a-f]{8}' | sort -u | sed 's/=@//' | tr '\n' ' ')
  res=$("$AAPT2" dump resources "$apk" | awk -v refs="$refs" '
    BEGIN { n = split(refs, r, " "); for (i = 1; i <= n; i++) want[r[i]] = 1 }
    /^ *resource 0x/ { cur = ($2 in want) ? $2 : ""; name = $3; next }
    cur != "" && /^ *\(\) "/ { v = $0; sub(/^ *\(\) "/, "", v); sub(/"$/, "", v); gsub(/\\/, "\\\\", v); gsub(/"/, "\\\"", v);
      printf "{\"id\":\"@%s\",\"name\":\"%s\",\"value\":\"%s\"}\n", cur, name, v; cur = "" }
  ' | jq -s 'map({key: .id, value: .value}) | from_entries')

  # xmltree → one JSON object per element with its depth-based parent
  local elements
  elements=$(print -r -- "$xml" | awk '
    function esc(s) { gsub(/\\/, "\\\\", s); gsub(/"/, "\\\"", s); return s }
    /^ *E: / {
      match($0, /^ */); depth = RLENGTH
      name = $2
      while (sp > 0 && sd[sp] >= depth) sp--
      parent = (sp > 0) ? sid[sp] : -1
      id++; sp++; sid[sp] = id; sd[sp] = depth
      if (id > 1) printf "}}\n"
      printf "{\"id\":%d,\"parent\":%d,\"name\":\"%s\",\"attrs\":{", id, parent, name
      first = 1; next
    }
    /^ *A: / {
      line = $0; sub(/^ *A: /, "", line)
      key = line; sub(/=.*/, "", key); sub(/^.*:/, "", key); sub(/\(0x[0-9a-f]+\)$/, "", key)
      val = line; sub(/^[^=]*=/, "", val)
      if (val ~ /^"/) { sub(/^"/, "", val); sub(/" \(Raw: .*$/, "", val); sub(/"$/, "", val) }
      printf "%s\"%s\":\"%s\"", (first ? "" : ","), esc(key), esc(val); first = 0
    }
    END { if (id > 0) printf "}}\n" }
  ' | jq -s '.')

  local label
  label=$(print -r -- "$badging" | sed -n "s/^application-label:'\(.*\)'$/\1/p")
  local native
  native=$(print -r -- "$badging" | sed -n "s/^native-code: //p" | tr -d "'")

  jq -n --argjson el "$elements" --argjson res "$res" --arg label "$label" --arg native "$native" '
    def r: if type == "string" and startswith("@0x") then ($res[.] // .) else . end;
    def byid: ($el | map({key: (.id|tostring), value: .}) | from_entries);
    def children($id; $name): $el | map(select(.parent == $id and .name == $name));
    ($el[] | select(.name == "manifest")) as $m
    | ($el[] | select(.name == "application")) as $app
    | ($el | map(select(.name == "activity" and .parent == $app.id))) as $acts
    | ($acts | map(select(.attrs.name | test("MainActivity$")))[0]) as $main
    | {
        package: $m.attrs.package,
        versionCode: $m.attrs.versionCode,
        versionName: $m.attrs.versionName,
        compileSdk: $m.attrs.compileSdkVersion,
        minSdk: (($el[] | select(.name == "uses-sdk")).attrs.minSdkVersion),
        targetSdk: (($el[] | select(.name == "uses-sdk")).attrs.targetSdkVersion),
        label: $label,
        nativeCode: $native,
        permissions: ($el | map(select(.name == "uses-permission") | .attrs.name | {key: ., value: true}) | from_entries),
        application: ($app.attrs | {allowBackup, supportsRtl, usesCleartextTraffic, debuggable}),
        # screenOrientation: absent and -1 both mean "unspecified"
        mainActivity: ($main.attrs | {launchMode, windowSoftInputMode, exported, screenOrientation: (.screenOrientation // "-1")}),
        intentFilters: (
          children($main.id; "intent-filter")
          | map(. as $f | {
              autoVerify: ($f.attrs.autoVerify // "false"),
              actions: (children($f.id; "action") | map(.attrs.name) | sort),
              categories: (children($f.id; "category") | map(.attrs.name) | sort),
              data: (children($f.id; "data") | map(.attrs | map_values(r)) | sort_by(tostring))
            })
          | map({key: (tostring), value: true}) | from_entries
        )
      }' | mask
}

# ---------- iOS ----------
plist_json() { plutil -convert json -o - "$1"; }

# Build settings of the app target (the configuration whose bundle id is not a test target).
pbx_settings() {
  awk '
    /buildSettings = \{/ { inb = 1; delete s; next }
    inb && /^\t\t\t\};/ {
      inb = 0
      if (s["PRODUCT_BUNDLE_IDENTIFIER"] ~ /com\.qdmobile/ ) {
        printf "{\"bundleId\":\"%s\",\"deploymentTarget\":\"%s\",\"buildNumber\":\"%s\",\"marketingVersion\":\"%s\",\"deviceFamily\":\"%s\"}\n",
          s["PRODUCT_BUNDLE_IDENTIFIER"], s["IPHONEOS_DEPLOYMENT_TARGET"], s["CURRENT_PROJECT_VERSION"], s["MARKETING_VERSION"], s["TARGETED_DEVICE_FAMILY"]
      }
      next
    }
    inb && /=/ {
      line = $0; gsub(/^[ \t]+|;$/, "", line); k = line; sub(/ = .*/, "", k); v = line; sub(/^[^=]*= /, "", v); gsub(/"/, "", v); s[k] = v
    }
  ' "$1" | jq -s '.'
}

ios_json() {
  local info=$1 ent=$2 priv=$3 pbx=$4
  local settings_all project_target
  settings_all=$(pbx_settings "$pbx")
  # Targets without their own deployment target inherit the project-level one.
  project_target=$(grep -o 'IPHONEOS_DEPLOYMENT_TARGET = [0-9.]*' "$pbx" | awk '{print $3}' | sort | uniq -c | sort -rn | awk 'NR==1{print $2}')
  jq -n --argjson info "$(plist_json "$info")" --argjson ent "$(plist_json "$ent")" \
    --argjson priv "$(plist_json "$priv")" --argjson settings "$settings_all" --arg bundle "${PARITY_BUNDLE_ID:-}" --arg projectTarget "$project_target" '
    ($settings | map(select($bundle == "" or .bundleId == $bundle)) | .[0]
      | .deploymentTarget = (if .deploymentTarget == "" then $projectTarget else .deploymentTarget end)
      | .deviceFamily = (if .deviceFamily == "" then "1" else .deviceFamily end)) as $s
    | def res: if type == "string" then
          gsub("\\$\\(CURRENT_PROJECT_VERSION\\)"; $s.buildNumber)
          | gsub("\\$\\(MARKETING_VERSION\\)"; $s.marketingVersion)
          | gsub("\\$\\(PRODUCT_BUNDLE_IDENTIFIER\\)"; $s.bundleId)
        else . end;
    def set: map({key: tostring, value: true}) | from_entries;
    ($info | walk(res)) as $i
    | {
        buildSettings: ($s | {bundleId, deploymentTarget, deviceFamily}),
        displayName: $i.CFBundleDisplayName,
        bundleIdentifier: $i.CFBundleIdentifier,
        shortVersion: $i.CFBundleShortVersionString,
        bundleVersion: $i.CFBundleVersion,
        urlSchemes: ([$i.CFBundleURLTypes[]?.CFBundleURLSchemes[]?] | set),
        queriesSchemes: (($i.LSApplicationQueriesSchemes // []) | set),
        ats: $i.NSAppTransportSecurity,
        usage: ($i | with_entries(select(.key | test("UsageDescription$")))),
        fonts: (($i.UIAppFonts // []) | set),
        orientations: (($i.UISupportedInterfaceOrientations // []) | set),
        requiredCapabilities: (($i.UIRequiredDeviceCapabilities // []) | set),
        userInterfaceStyle: ($i.UIUserInterfaceStyle // "Automatic"),
        viewControllerBasedStatusBar: $i.UIViewControllerBasedStatusBarAppearance,
        infoPlistAssociatedDomains: (($i["com.apple.developer.associated-domains"] // []) | set),
        entitlements: ($ent | with_entries(.value |= (if type == "array" then set else . end))),
        privacy: {
          tracking: $priv.NSPrivacyTracking,
          collectedDataTypes: ($priv.NSPrivacyCollectedDataTypes | length),
          accessedAPIs: ($priv.NSPrivacyAccessedAPITypes | map({key: .NSPrivacyAccessedAPIType, value: (.NSPrivacyAccessedAPITypeReasons | set)}) | from_entries)
        }
      }' | mask
}

# ---------- diff ----------
# Leaf paths whose values differ, as "path: before -> after" lines (sets are objects, so
# additions and removals show up as their own paths).
json_diff() {
  jq -rn --slurpfile a "$1" --slurpfile b "$2" '
    $a[0] as $A | $b[0] as $B
    | ([$A, $B] | map([paths(scalars)]) | add | unique) as $ps
    | $ps[]
    | . as $p
    | ($A | try getpath($p) catch null) as $x
    | ($B | try getpath($p) catch null) as $y
    | select($x != $y)
    | "\($p | map(tostring) | join(".")): \($x | tojson) -> \($y | tojson)"'
}

allowed_patterns() {
  # Lines in the ```allowed fenced block of allowed-diff.md: "<platform>/<variant|*> <path-glob>"
  awk '/^```allowed/ { on = 1; next } /^```/ { on = 0 } on && NF && $1 !~ /^#/ { print $1 " " $2 }' "$ALLOWED"
}

is_allowed() {
  local scope=$1 jpath=${2%%: *}
  local pat_scope pat
  while read -r pat_scope pat; do
    [[ $scope == ${~pat_scope} && $jpath == ${~pat} ]] && return 0
  done < <(allowed_patterns)
  return 1
}

check() {
  local variant=$1
  local apk=${APK:-$ROOT/android/app/build/outputs/apk/debug/app-debug.apk}
  [[ -n ${EXPO_PUBLIC_DEEP_LINKING_DOMAIN:-} ]] || die "EXPO_PUBLIC_DEEP_LINKING_DOMAIN not set (use yarn parity:dev / parity:prod)"
  export PARITY_DOMAIN=$EXPO_PUBLIC_DEEP_LINKING_DOMAIN PARITY_REVERSED_CLIENT_ID=${EXPO_PUBLIC_REVERSED_CLIENT_ID:-}
  mkdir -p "$OUT_DIR"
  local report=$OUT_DIR/report-$variant.md unexpected=0

  print "# Native parity report: $variant\n" > "$report"
  print "Baseline: origin/main $BASE_REF (RN CLI). Candidate: this branch after \`expo prebuild\`.\n" >> "$report"

  # Android
  android_json "$apk" > "$OUT_DIR/android-$variant.json"
  # iOS
  local proj=( $ROOT/ios/*.xcodeproj(N) )
  [[ ${#proj} -eq 1 ]] || die "expected one ios/*.xcodeproj (run prebuild first)"
  local name=${proj[1]:t:r}
  PARITY_BUNDLE_ID= ios_json "$ROOT/ios/$name/Info.plist" "$ROOT/ios/$name/$name.entitlements" \
    "$ROOT/ios/$name/PrivacyInfo.xcprivacy" "${proj[1]}/project.pbxproj" > "$OUT_DIR/ios-$variant.json"

  local platform line n
  for platform in android ios; do
    local base=$BASE_DIR/$platform-$variant.json cand=$OUT_DIR/$platform-$variant.json
    [[ -f $base ]] || die "missing baseline $base"
    print "## ${platform}\n" >> "$report"
    print "| Path | Before -> after | Status |\n|---|---|---|" >> "$report"
    n=0
    while IFS= read -r line; do
      n=$((n + 1))
      local verdict="approved"
      if ! is_allowed "$platform/$variant" "$line"; then verdict="**UNEXPECTED**"; unexpected=$((unexpected + 1)); fi
      print -r -- "| \`${line%%: *}\` | \`${line#*: }\` | $verdict |" >> "$report"
    done < <(json_diff "$base" "$cand")
    (( n == 0 )) && print "| (no differences) | | |" >> "$report"
    print "" >> "$report"
  done

  print "Unexpected differences: $unexpected" >> "$report"
  cat "$report"
  (( unexpected == 0 ))
}

baseline() {
  local variant=$1 apk=$2 tmp
  [[ -n ${EXPO_PUBLIC_DEEP_LINKING_DOMAIN:-} ]] || die "EXPO_PUBLIC_DEEP_LINKING_DOMAIN not set"
  export PARITY_DOMAIN=$EXPO_PUBLIC_DEEP_LINKING_DOMAIN PARITY_REVERSED_CLIENT_ID=${EXPO_PUBLIC_REVERSED_CLIENT_ID:-}
  tmp=$(mktemp -d)
  android_json "$apk" > "$BASE_DIR/android-$variant.json"
  git -C "$ROOT" show "$BASE_REF:ios/QDMobile.xcodeproj/project.pbxproj" > "$tmp/project.pbxproj"
  local info ent bundle
  if [[ $variant == development ]]; then
    info=$BASE_DIR/ios/QDMobileDev-Info.plist ent=$BASE_DIR/ios/QDMobileDev.entitlements bundle=com.qdmobile.dev
  else
    info=$BASE_DIR/ios/QDMobile-Info.plist ent=$BASE_DIR/ios/QDMobile.entitlements bundle=com.qdmobile
  fi
  # The old Info.plist used build variables; resolve the ones the old xcconfig/pbxproj defined.
  sed -e "s/\$(DEEP_LINKING_DOMAIN)/$PARITY_DOMAIN/g" -e "s/\$(REVERSED_CLIENT_ID)/$PARITY_REVERSED_CLIENT_ID/g" \
    -e 's/\$(PRODUCT_NAME)/QDMobile/g' "$info" > "$tmp/Info.plist"
  PARITY_BUNDLE_ID=$bundle ios_json "$tmp/Info.plist" "$ent" "$BASE_DIR/ios/PrivacyInfo.xcprivacy" "$tmp/project.pbxproj" \
    > "$BASE_DIR/ios-$variant.json"
  rm -rf "$tmp"
  print "baseline written: $BASE_DIR/{android,ios}-$variant.json"
}

cmd=${1:-}; shift || true
case $cmd in
  android-json) android_json "$@" ;;
  ios-json) ios_json "$@" ;;
  check) check "$@" ;;
  baseline) baseline "$@" ;;
  *) die "usage: parity.zsh android-json|ios-json|check|baseline ..." ;;
esac
