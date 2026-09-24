# 🔒 Security & Privacy

### Home Workout – Security Requirements and Privacy by Design

This document defines how Home Workout protects its users and their data. Because the app is **fully offline with no accounts**, the attack surface is small, but the app stores personal health data (weight, BMI, workout history), so that data must be handled carefully.

| Field | Details |
|---|---|
| **Version** | 1.0 |
| **Last updated** | September 23, 2026 |
| **Status** | Active |
| **Related** | [PRD](PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [RULES](RULES.md) · [TEST_PLAN](TEST_PLAN.md) |

---

## 1. Security Principles

| Principle | Meaning for this app |
|---|---|
| **Data minimisation** | Collect only what a feature needs. Body data is optional. No name, email or location. |
| **Local only** | No network access, no servers, no third-party SDKs. Data never leaves the phone unless the user exports it. |
| **Least privilege** | One runtime permission (notifications), requested only when it is needed. |
| **User control** | The user can export, import and permanently delete all data at any time. |
| **Secure by default** | Android auto-backup off, release builds minified, no debug logging. |
| **Verify, don't assume** | Every release is checked: manifest, network, dependencies (§13). |

---

## 2. Threat Model

**What we protect:** personal health and activity data (weight history, height, birth year, BMI, workout sessions, streaks), app integrity and the signing key.

| # | Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| T1 | Another app reads our data | Low | High | Data lives in the app's private sandbox. No external storage. No exported content providers. |
| T2 | Data leaks through cloud auto-backup | Medium | Medium | `allowBackup: false`. Backup only through user-initiated export (ADR-030). |
| T3 | Exported backup file is shared or lost | Medium | Medium | Clear warning before sharing. The file contains no credentials. |
| T4 | Malicious or corrupted import file | Low | High | Size limit, strict validation and an all-or-nothing transaction (§7). |
| T5 | A third-party library sends data out | Low | High | No INTERNET permission in release, approved-package list, dependency review (§9). |
| T6 | Tampered or repackaged APK | Low | Medium | Play App Signing; R8 obfuscation; users install from Google Play. |
| T7 | Upload key lost or stolen | Low | High | Key stored outside the repo, encrypted, with an offline backup (§10). |
| T8 | Shoulder-surfing health data | Low | Low | Accepted risk. No sensitive data on the lock screen or in notifications. |
| T9 | Harmful health advice | Medium | High | PAR-Q screening, disclaimer, reviewed copy rules ([PRD](PRD.md) §9). |

**Out of scope:** rooted or compromised devices, physical attacks on an unlocked phone.

---

## 3. Data Inventory & Classification

| Data | Sensitivity | Where it lives | Leaves the device? | Retention |
|---|---|---|---|---|
| Gender, goal, level | Low | SQLite `profile` | Only in a user export | Until reset |
| Height, weight, birth year | **Sensitive (health)** | SQLite `profile`, `weight_log` | Only in a user export | Until the user deletes it |
| Workout sessions, streaks, personal bests | Personal | SQLite | Only in a user export | Until reset |
| Challenge progress, custom workouts, favourites | Personal | SQLite | Only in a user export | Until reset |
| Preferences and player snapshot | Low | KV store | Preferences only, in an export | Snapshot deleted after 2 h or on finish |
| Feedback note | Personal (free text) | KV store | Only if the user exports it | Until cleared |
| Share card image | Low (workout summary only: name, duration, exercises, kcal, streak; never body data) | Cache directory, temporary | Only when the user shares it | Deleted after sharing or on the next launch |
| Content pack | Public | App bundle | No | — |

No identifiers (advertising ID, device ID, email, phone, location, contacts, photos) are collected.

---

## 4. Data at Rest

- All user data sits in the app's **private internal storage** (SQLite and the KV store). Android file-based encryption protects it while the device is locked.
- No database-level encryption (SQLCipher) in v1: the sandbox plus device encryption fit this data's sensitivity, and no extra package is needed.
- **Android auto-backup is disabled** (`android.allowBackup: false`) so health data is not copied to cloud backups without the user choosing to.
- Temporary export files are written to the **cache directory** and deleted after sharing or on the next launch.
- No data is written to shared or external storage.

---

## 5. Permissions

| Permission | Type | Why | When |
|---|---|---|---|
| `POST_NOTIFICATIONS` | Runtime (Android 13+) | Workout reminders | Only after the primer screen, when the user turns on reminders |
| `RECEIVE_BOOT_COMPLETED` | Normal (install-time) | Restore scheduled reminders after a reboot | Added by `expo-notifications` |
| `VIBRATE` | Normal | Haptics and notification vibration | Added by Expo modules |
| `WAKE_LOCK` | Normal | May be added by notification or keep-awake modules | Acceptable if present |

**Must never appear in the release manifest** (blocked with `android.blockedPermissions` for the production variant):

`INTERNET` · `ACCESS_NETWORK_STATE` · `RECORD_AUDIO` · `CAMERA` · `READ_EXTERNAL_STORAGE` · `WRITE_EXTERNAL_STORAGE` · `READ_MEDIA_IMAGES` · `READ_MEDIA_VIDEO` · `READ_MEDIA_AUDIO` · `ACCESS_FINE_LOCATION` · `ACCESS_COARSE_LOCATION` · `SYSTEM_ALERT_WINDOW` · `SCHEDULE_EXACT_ALARM` · `USE_EXACT_ALARM`

Notes:

- The audio library must not add microphone access. `RECORD_AUDIO` is blocked, and the merged manifest is checked on every release.
- Reminders use **inexact** scheduling. Exact-alarm permissions are restricted by Google Play policy and are not needed.
- Import uses the system document picker and export uses the share sheet, so **no storage permission** is needed.
- `INTERNET` is blocked only in the production variant, because development builds need it to reach the local dev server ([ARCHITECTURE](ARCHITECTURE.md) §14).

---

## 6. Network Policy

The app makes **zero network requests**.

| Control | How it is enforced |
|---|---|
| No INTERNET permission in release | `blockedPermissions` in `app.config.ts` + manifest check (scenario S11) |
| No network code | Code search: no `fetch`, `XMLHttpRequest`, `WebSocket` or `EventSource` in `src/` or `app/` |
| No networked SDKs | No analytics, crash reporting, ads, remote config or `expo-updates` |
| No remote assets | Every image, animation, font and sound is bundled |
| Runtime proof | Firewall or network monitor on the test phone shows zero traffic (TEST_PLAN §9.3) |

---

## 7. Input Validation

| Input | Rule |
|---|---|
| Height | 100–250 cm (converted from ft/in if needed) |
| Weight | 20–400 kg (converted from lbs if needed) |
| Birth year | Only years giving an age of 18–100 (ADR-032) |
| Days per week | 1–7 |
| Rest timer | 5–120 s in 5 s steps; prep timer 0 / 5 / 10 / 15 / 20 / 30 s |
| Custom workout name | 1–40 characters, trimmed |
| Custom workout | 1–50 exercises; each 10–300 s or 1–100 reps; rest 0–120 s |
| Feedback note | Maximum 2,000 characters |
| Search query | Maximum 50 characters; plain text matching only |

All inputs are validated in the module service (not only in the UI) before they reach a repository.

---

## 8. Backup Export & Import

**Export**

- Format: JSON `{ app: "home-workout", schemaVersion, contentVersion, exportedAt, data: { …tables…, preferences } }`.
- Contains health data. Before the share sheet opens, the user sees: *"This file contains your personal workout and body data. Share it only with people or places you trust."*
- No passwords, tokens or device identifiers are included.

**Import**

1. The user picks a file with the system document picker.
2. **Size check:** reject files over 5 MB before reading them fully.
3. **Parse:** `JSON.parse` inside `try/catch`; reject anything that fails.
4. **Header check:** `app` must match; `schemaVersion` must not be newer than the app supports. Older versions are migrated.
5. **Validate every record:** types, ranges (§7), enums, ID format, string lengths and references (for example, every `session_items.sessionId` exists). Unknown tables or fields are rejected.
6. **Confirm:** "This will replace all your current data."
7. **Apply in one transaction:** delete all, then insert all. Any error rolls everything back.
8. Reload the stores and show a summary ("Restored 124 workouts, 18 weight entries").

**Reset all data:** two confirmations → delete every table and preference → return to onboarding.

---

## 9. Dependency & Supply-Chain Security

- Only packages on the approved list ([ARCHITECTURE](ARCHITECTURE.md) §2, [DECISIONS](DECISIONS.md)). Adding one requires owner approval.
- Install with `npx expo install` so versions match the Expo SDK. **Commit the lockfile.**
- **Licence allowlist:** MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause, 0BSD, OFL-1.1 (fonts), CC0 (assets). **Not allowed:** GPL, AGPL, LGPL, SSPL or any non-commercial licence. Check licences every time a dependency changes.
- Run `npm audit` at the end of every phase and before every release. Fix high and critical issues before release.
- Update to new Expo SDK releases in a planned phase, never mid-feature.
- Build-time generators are part of the repo and use only Node's standard library plus approved dev tools.

---

## 10. Build, Signing & Release Security

- Release builds: R8 minification and resource shrinking on, `debuggable` false, no dev menu, no source maps in the app bundle.
- **Play App Signing:** Google holds the app signing key. We keep only the **upload key**.
- Upload keystore: generated once, **never committed**, stored encrypted in a password manager with an offline backup. Its passwords are stored separately from the file.
- If EAS Build is chosen (ADR-036), EAS stores the credentials encrypted. Restrict account access and enable two-factor authentication on the Expo account.
- Every release is built from a tagged commit (`vX.Y.Z`) on `main`.

---

## 11. Privacy & Compliance

**Google Play Data safety form (planned answers)**

| Question | Answer |
|---|---|
| Does the app collect or share any of the required user data types? | **No** (no data is sent off the device) |
| Is data encrypted in transit? | Not applicable (no data is transmitted) |
| Can users request data deletion? | Users delete everything in the app with "Reset all data" |

**Other Play requirements**

| Requirement | Plan |
|---|---|
| Health apps declaration | Declare "Activity and fitness" and "Nutrition and weight management" (weight and BMI tracking) |
| Content rating | IARC questionnaire → 18+ |
| Target audience | Adults 18+; not designed for children |
| Ads declaration | No ads |
| Privacy policy URL | `DOC/PRIVACY.md` published on GitHub Pages (task T12.8) |

**Privacy policy must state:** what is stored and where (on the device only), that nothing is collected or shared, how to export and delete data, that there are no ads or analytics, the 18+ audience, the medical disclaimer, and a contact email.

**User rights (GDPR-style):** access and portability = Export; erasure = Reset all data; no processing by the developer, because data never reaches the developer.

**Medical disclaimer:** shown in onboarding and always available in Settings. The app gives general fitness guidance, not medical advice.

---

## 12. Logging & Error Handling

- A single dev logger in `core` prints only when `__DEV__` is true. Release builds produce no app logs.
- Never log personal data (weight, height, birth year, notes), not even in development.
- Error messages shown to users are friendly and generic, and never include stack traces.
- There is no crash-reporting SDK. Crashes and ANRs are monitored through Play Console (Android vitals), which does not need any code in the app.

---

## 13. Security Testing Checklist (every release)

- [ ] Merged release manifest has no blocked permissions (§5); only `POST_NOTIFICATIONS` is requested at runtime (S11).
- [ ] Code search finds no network APIs (§6).
- [ ] Network monitor shows zero traffic during a full session.
- [ ] `allowBackup` is false in the merged manifest.
- [ ] `npm audit`: no high or critical issues.
- [ ] Every dependency licence is on the allowlist.
- [ ] Import rejects a corrupted, oversized and out-of-range file (U-BAK-02 to U-BAK-05).
- [ ] Export warning is shown; the temporary file is cleaned up.
- [ ] Release build is minified, not debuggable, and has no dev menu.
- [ ] No keystore, `.env` or credentials in the repository history.
- [ ] Privacy policy URL works and matches the app's behaviour.

---

## 14. Vulnerability Reporting & Incident Response

- **Report a vulnerability:** email the product owner at `[security contact email – to be added]`. Please include steps to reproduce.
- **Response targets:** acknowledge within 3 business days; fix critical issues within 14 days; fix others in the next release.
- **Incident steps:**
  1. Confirm and assess impact.
  2. Fix on a branch and test.
  3. Release through a staged rollout.
  4. Update the store listing notes if users must act.
  5. Record the incident and lessons learned in [DECISIONS](DECISIONS.md) or [MEMORY](MEMORY.md).

---

## 15. Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version |
| 1.1 | Sep 23, 2026 | Share card added to the data inventory |
