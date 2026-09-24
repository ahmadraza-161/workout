# 📘 Development Rules

### Home Workout – Project Guidelines for AI & Human Collaboration

This document defines the development rules, coding standards and best practices for building Home Workout. They keep the code consistent, maintainable, secure and of high quality. **Both AI assistants and human contributors must follow them.**

| Field | Details |
|---|---|
| **Version** | 1.0 |
| **Last updated** | September 23, 2026 |
| **Status** | Active |
| **Related** | [PRD](PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [DESIGN](DESIGN.md) · [CONTENT_MAP](CONTENT_MAP.md) · [COVERAGE](COVERAGE.md) · [TASKS](TASKS.md) · [TEST_PLAN](TEST_PLAN.md) · [SECURITY](SECURITY.md) · [DECISIONS](DECISIONS.md) · [MEMORY](MEMORY.md) |

---

## 1. General Principles

These rules apply to the entire project.

- ✅ Read the documentation before changing anything: [MEMORY](MEMORY.md) → [PRD](PRD.md) → [ARCHITECTURE](ARCHITECTURE.md) → [DESIGN](DESIGN.md) → this file → the current task in [TASKS](TASKS.md).
- ✅ The **hard constraints** in [PRD](PRD.md) §3.2 are non-negotiable: no network, no API keys or paid services, no ads or analytics, everything unlocked, 2D Lottie only, assets generated locally, approved packages only.
- ✅ Keep code clean, readable and well named. Prefer simple over clever.
- ✅ Don't duplicate logic. Reuse core components, hooks and module services.
- ✅ Write small, focused functions (about 50 lines or fewer) and components (about 200 lines or fewer).
- ✅ One task = one focused change. Don't modify unrelated files.
- ✅ Follow the phase order in [TASKS](TASKS.md). A phase is done only when its "Done when" test passes.
- ✅ When the docs and an instruction disagree, **stop and ask**. Never pick silently.

---

## 2. Technology & Coding Standards

| Area | Rule |
|---|---|
| **Language** | TypeScript in strict mode. No `any` (use `unknown` and narrow it). No `@ts-ignore` without a comment explaining why. Exported functions declare their return types. |
| **Framework** | Expo SDK 57 + React Native. Routing with `expo-router`. Function components and hooks only. |
| **Styling** | `StyleSheet.create` + theme tokens from `useTheme()`. No hard-coded colours, sizes or fonts. No Tailwind/NativeWind (not approved). |
| **State** | One Zustand store per domain. Read with selectors. No global mutable singletons. |
| **Data access** | Only through repositories. Components never touch SQLite or the KV store directly. |
| **Async** | `async`/`await`. Handle every error. No floating promises. |
| **Linting** | ESLint with `eslint-config-expo` (awaiting approval, ADR-037). Zero warnings before commit. |
| **Formatting** | Prettier (awaiting approval): 2 spaces, single quotes, trailing commas, 100-character lines. |
| **Dependencies** | Only packages approved in [ARCHITECTURE](ARCHITECTURE.md) §2 and [DECISIONS](DECISIONS.md). Install with `npx expo install`. **Ask before adding any package.** |
| **File naming** | Components `PascalCase.tsx` · hooks `useThing.ts` · utilities `camelCase.ts` · routes in `app/` lowercase, as expo-router expects · tests `*.test.ts(x)` next to the code · constants `SCREAMING_SNAKE_CASE`. |
| **Imports** | Path alias `@/` → `src/`. Order: React and external packages → `@/` modules → relative files. Import another module **only** through its `index.ts`. |
| **Text** | Every user-visible string comes from an i18n key. No literal UI strings. |
| **Units and time** | Store kg, cm, seconds and epoch ms. Convert only in the UI. Day-based logic uses the local date string (`YYYY-MM-DD`). |
| **Comments** | Explain *why*, not *what*. Timing and state-machine code must be heavily commented. |
| **Magic numbers** | Name them (`REST_DEFAULT_SECONDS = 20`) in the module's `constants.ts`. |

---

## 3. Project Structure

Follow the folder structure in [ARCHITECTURE](ARCHITECTURE.md) §3. Keep things organised and scalable.

- ✅ `app/` contains routes only. Screens compose module components and contain no business logic.
- ✅ Feature code lives in `src/modules/<feature>/` (`components/`, `hooks/`, `services/`, `repository.ts`, `store.ts`, `types.ts`, `index.ts`).
- ✅ Reusable UI primitives live in `src/modules/core/ui/`.
- ✅ Types shared by several modules live in `src/types/`.
- ✅ Generated assets live in `assets/`. **Never edit them by hand**: change the generator in `tools/` and regenerate.
- ✅ Documentation lives in `DOC/` only.
- ✅ Don't create new top-level folders without a decision record in [DECISIONS](DECISIONS.md).

---

## 4. UI/UX Guidelines

- ✅ Follow [DESIGN](DESIGN.md) exactly, and compare each screen with its reference screenshot (DESIGN §12.3).
- ✅ Build screens from core components: `ListRow`, `SectionHeader`, `ChipTabs`, `FilterChip`, `GradientCard`, `MetaRow`, `TimerRing`, `PrimaryButton`, `Sheet`.
- ✅ Every screen has **loading, empty and error states**, works in **light and dark**, uses **i18n keys** and has **accessibility labels**.
- ✅ Touch targets are at least 48 dp. Colour is never the only signal.
- ✅ Secondary actions open in bottom sheets, not new screens.
- ✅ Respect Reduce Motion and system font scaling.
- ✅ All copy follows the content rules in [PRD](PRD.md) §9 (no spot-reduction, height-growth or shaming language).
- ❌ No PRO badges, "Unlock" buttons, ad slots or video tabs.

---

## 5. Database & Schema Rules

- ✅ The schema lives only in `src/modules/core/db/schema.ts` (Drizzle).
- ✅ Every schema change = a new migration generated by `drizzle-kit`, plus a test that upgrades from the previous version. **Never edit an applied migration.**
- ✅ All reads and writes go through repositories. Multi-table writes run in one transaction.
- ✅ IDs are UUID v4 strings. Singleton rows use `id = 1`.
- ✅ Content (exercises, workouts, …) is **never** stored in SQLite. It comes from the read-only content pack (ADR-023, proposed).
- ✅ Add indexes for frequent queries (see ARCHITECTURE §6.3).
- ✅ When the backup format changes, bump `schemaVersion` and keep importing older versions.
- ❌ No destructive migration without a data-preserving path.

---

## 6. Permissions & Privacy

*(This project has no accounts, so it has no authentication or authorisation layer.)*

- ✅ The only runtime permission is `POST_NOTIFICATIONS`. It is requested after a primer screen, and only when the user turns on reminders.
- ✅ The release manifest must not contain `INTERNET` or any sensitive permission. Check it on every release ([SECURITY](SECURITY.md) §5).
- ✅ Data leaves the device only when the user exports a backup through the share sheet.
- ✅ Keep Android auto-backup disabled (ADR-030, proposed).

---

## 7. API & External Services

- ✅ **None.** The app makes no network requests of any kind.
- ❌ No `fetch`, `XMLHttpRequest`, `WebSocket` or `EventSource` in app code. A search for these in `src/` and `app/` must return nothing.
- ❌ No SDKs that contact a server: analytics, crash reporting, ads, remote config, `expo-updates`.
- ✅ Build-time generators read only files in the repository. One-time inputs (such as the Poppins font files) are downloaded manually once and committed.

---

## 8. Testing Guidelines

- ✅ **Unit tests are required** for: the player state machine, timing and fast-forward, kcal and BMI, streak and weekly-goal logic (including month and year boundaries), challenge progression, content-generator rules, backup import validation and unit conversion.
- ✅ Component tests (React Native Testing Library) for core UI components and key screens.
- ✅ Tests are deterministic: inject the clock (`now()`), use Jest fake timers and seeded randomness. Never depend on real time.
- ✅ Test names describe behaviour: `"moves to REST when the exercise time ends"`.
- ✅ `npm test`, the type-check and lint must all pass before every commit.
- ✅ Follow [TEST_PLAN](TEST_PLAN.md) for device, scenario, performance and accessibility testing.

---

## 9. Security Requirements

- ✅ Follow [SECURITY](SECURITY.md).
- ✅ No secrets exist in this project. Keep it that way (no API keys, no tokens).
- ✅ Validate every imported file before touching the database.
- ✅ Never log personal data. The logger prints only in development (`__DEV__`).
- ✅ Signing keystores are never committed. `*.jks`, `*.keystore` and credentials files are in `.gitignore`.

---

## 10. Git & Version Control

- ✅ Initialise Git in Phase 1. The default branch is `main`.
- ✅ One branch per task: `feat/<task-id>-short-name`, `fix/…`, `docs/…`, `chore/…`, `test/…`.
- ✅ Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, `build:`. Mention the task ID, for example `feat(player): add rest phase (T5.6)`.
- ✅ Small commits whose message explains *why*.
- ✅ Commit the lockfile (`package-lock.json`).
- ❌ Never commit build outputs, `node_modules`, keystores or local environment files.
- ✅ Tag every release `vX.Y.Z`, and keep `CHANGELOG.md` from Phase 12 onwards.
- ✅ AI assistants commit or push **only when asked**.

---

## 11. Documentation

- ✅ Keep token use low: read the docs **once per session**, and update **only** the documents a change actually affects, batched at the end of the session:
  - [TASKS](TASKS.md): task status and notes
  - [DECISIONS](DECISIONS.md): a new record for every decision
  - [MEMORY](MEMORY.md): an entry in the session log
  - [ARCHITECTURE](ARCHITECTURE.md) and [DESIGN](DESIGN.md): when structure or design changes
  - [CONTENT_MAP](CONTENT_MAP.md): the per-exercise status column during Phase 2, and any content change
  - [COVERAGE](COVERAGE.md): whenever scope changes (something added, adapted or dropped)
- ✅ Every document ends with a revision history. Bump its version when content changes meaningfully.
- ✅ Docs and code comments are in clear, simple English.
- ✅ Public functions in `services/` get a one-line JSDoc summary.

---

## 12. AI Collaboration Guidelines

- ✅ At the start of a session, read [MEMORY](MEMORY.md) first, then the docs relevant to the task.
- ✅ Work only on the current task. If the scope is unclear, ask.
- ✅ **Ask before:** adding a package, changing a decision or constraint, deleting files, large refactors, committing or pushing.
- ✅ Flag conflicts between an instruction and the docs. Don't resolve them silently.
- ✅ Don't invent content that isn't in the catalog, and never copy text, names or assets from the reference app.
- ✅ Verify before saying "done": run the tests, type-check and lint, then report honestly, including failures.
- ✅ At the end of a session, update TASKS, the MEMORY session log and DECISIONS (if anything was decided).
- ✅ The product owner writes in Roman Urdu. Reply in Roman Urdu, and keep code and docs in English.

---

## 13. What NOT to Do

- ❌ Add network calls, analytics, ads, paywalls, PRO badges or "Unlock" buttons.
- ❌ Add a package without approval, or use Python or other non-JavaScript tooling.
- ❌ Use `any`, or `@ts-ignore` without a reason.
- ❌ Hard-code strings, colours, sizes or fonts.
- ❌ Run a countdown by decrementing a number in `setInterval`.
- ❌ Access the database from screens or components.
- ❌ Edit generated files by hand.
- ❌ Copy names, text, images or icons from the reference app.
- ❌ Write spot-reduction, height-growth, shaming or diet copy.
- ❌ Commit secrets, keystores or build outputs.
- ❌ Skip empty, error or dark-mode states.
- ❌ Leave `console.log` in committed code (use the dev logger).

---

## 14. Definition of Done

A task is **done** only when every item is true:

- [ ] It works in **airplane mode**.
- [ ] It matches [DESIGN](DESIGN.md) and the reference layout.
- [ ] Loading, empty and error states exist.
- [ ] Light and dark themes both look correct.
- [ ] All text uses i18n keys.
- [ ] Accessibility labels, roles and 48 dp targets are in place; TalkBack reads it correctly.
- [ ] Unit and component tests are written and pass.
- [ ] The type-check and lint are clean.
- [ ] Performance budgets are respected ([PRD](PRD.md) §11).
- [ ] Docs are updated (TASKS, MEMORY, DECISIONS if needed).
- [ ] For the last task of a phase: the phase's "Done when" test passes.

---

## 15. Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sep 23, 2026 | First version |
| 1.1 | Sep 23, 2026 | Documentation rules now cover CONTENT_MAP and COVERAGE |
