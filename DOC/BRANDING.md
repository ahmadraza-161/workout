# WorkoutStride identity

Selected October 1, 2026 under the owner's instruction to choose the name and all branding independently.

- **Public name:** WorkoutStride — an English workout-related name selected after the owner requested another name and proper character art for a global audience.
- **Tagline:** Your pace. Your progress.
- **Audience:** adults of all genders, beginners through experienced home-workout users.
- **Artwork:** original semi-realistic male/female athletic characters performing a standing bodyweight warm-up. No equipment or stock photos. Full-colour launcher/splash use this character pair; Android's single-colour themed icon uses the readable bodyweight glyph.
- **Palette:** deep maroon `#4A0B24` to rich red `#BA2346` icon background (owner-selected colour direction), electric-blue workout clothing and lime accents. Existing accessible UI tokens and reference layouts remain intact.

`app.config.ts` exports the canonical name/tagline. Screens use Expo Constants; the content generator updates i18n fallbacks and the onboarding welcome. Android retains its testing package ID and legacy URL schemes so existing installs/data and links remain compatible; `workoutstride` is the new primary URL scheme.

Source artwork is `tools/branding/characters.png`, generated with the built-in imagegen tool. Exact prompt/provenance is in `tools/branding/prompt.json`; the original generation remains preserved under Codex generated_images. `tools/branding/mark.svg` supplies the monochrome glyph. Run `npm run branding:build` to regenerate the 1024 px launcher, adaptive foreground/background, monochrome, splash and favicon PNGs plus light/dark SVG wrappers/wordmarks and the transparent character PNG in `assets/images/branding/`. SVG character exports embed raster artwork; they are not pure vector drawings. The same task is included in `npm run assets`. No new packages or remote runtime assets.

A public name search found other Stride fitness products, but no obvious exact WorkoutStride app match. This naming screen does not establish trademark clearance.

The previously delivered `Home-Workout-arm64.apk` predates this rename. A fresh prebuild and APK build are needed to install the new launcher name/icon. Rebuild steps remain in `BUILD_APK.md`.
