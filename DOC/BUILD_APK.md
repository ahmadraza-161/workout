# Local Android APK build

October 13 PowerShell repair: `Task '-' not found` was caused by the helper's
single-item offline option being unwrapped to a string in Windows PowerShell
5.1. Native splatting forwarded each character separately. The helper now uses
one explicit Gradle argument array. Offline and online modes were verified in
PowerShell 5.1 and 7. Run the same helper again from the project root; clearing
caches or prebuilding again is not required for this argument error.

Version 1.2 · October 4, 2026

October 2 build repair: the owner's native rebuild failed in `react-native-screens` because Ninja could not stat a 268-character Gradle prefab header path. The tracked helper `tools/qa/build-apk.ps1` moves the existing cache to the actual short workspace directory `.g` (reported header becomes 240 characters), preserving the old cache location as a junction. A shortcut pointing to the old long cache is insufficient because Android resolves its actual target. It uses cached dependencies offline, places Android preferences inside the workspace, restores the caller's directory even on failure, verifies the built APK signature before copying, and copies the successful output directly to the project root. The earlier ignored helper forwards to this tracked helper.

Branding update: current source/native configuration is **WorkoutStride** with male/female character art. The APK recorded below predates the rename; rebuild to install the new name, icon and splash. See [BRANDING](BRANDING.md).

Build completed successfully: `Home-Workout-arm64.apk` at project root, 69,260,342 bytes. Signature verified. APK inspection confirms ARM64, minimum API 24, target API 36 and no INTERNET/access-network-state or blocked sensitive permissions. SHA-256: `656f6d47af08990fb35d337b0cda4e87b4d46b1a5774c25d5dec319a34425bd3`. Phone runtime/visual testing remains pending.

The owner requested an installable APK for phone testing. This build uses the generated Android project, release JavaScript/assets and the generated debug signing key. It is a test distribution, not a Play Store release credential.

## Local toolchain

- Expo SDK 57 / React Native 0.86 from the existing lockfile.
- Java 17 (Temurin), Gradle 9.3.1, Android platform/build-tools 36.
- NDK 27.1.12297006 and CMake 3.22.1.
- Tools and Gradle cache are isolated in `.expo/build-tools`; system Java settings are unchanged.
- SDK tools were downloaded from Google and their SHA-256 matched the published checksum. Java download SHA-256 is verified against Adoptium release metadata.

## Rebuild on this workstation

If prebuild already succeeded, run only:

```powershell
cd E:\Work\workout
& '.\tools\qa\build-apk.ps1'
```

After success, `E:\Work\workout\Home-Workout-arm64.apk` is automatically updated. Do not copy an older `.expo` APK after a failed build. The optional `-NativeCheckOnly` switch reproduces/checks the previously failing ARM64 screens C++ task without building an APK.

Generate native files from app configuration; never hand-edit `android/`:

```powershell
$env:APP_VARIANT = 'production'
npx expo prebuild --platform android --no-install
```

The tracked helper `tools/qa/build-apk.ps1` sets the local Java/SDK/short-cache paths, then runs:

```powershell
.\gradlew.bat :app:assembleRelease --no-daemon --max-workers=2 -PreactNativeArchitectures=arm64-v8a -Pandroid.enablePngCrunchInReleaseBuilds=false
```

The helper runs Gradle from `android/`, then restores the caller's working directory. It verifies the signature using `apksigner` and copies the successful APK to both `.expo/Home-Workout-arm64.apk` and the project root. ARM64 is for modern Android phones, not an x86 emulator. Production configuration removes INTERNET/access-network-state and disables Android backup. Inspect the actual APK permissions before delivery. Test airplane-mode startup, onboarding, workout completion, reminders and backup on a phone.

## Revision history

October 4 Lottie integration: the newly installed player requires the native Maven dependency `com.airbnb.android:lottie:6.7.1`, absent from the current local cache. After refreshing native files using the production prebuild command above, use `& '.\tools\qa\build-apk.ps1' -OnlineDependencies` for the first build. This lets Gradle download build dependencies; the app still has no runtime network permission. Later builds use the usual offline command. No new APK or native build was run during animation integration.

| Version | Date | Change |
|---|---|---|
| 1.0 | Oct 1, 2026 | Added local testing APK build/toolchain instructions |
| 1.1 | Oct 2, 2026 | Short-cache Windows path repair, tracked helper, directory restoration and verified root output |
| 1.2 | Oct 4, 2026 | Optional first-build dependency download for the new native Lottie player |
