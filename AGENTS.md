This is an Expo / React Native Android app: **Home Workout** (working name). It is free, 100% offline, and has no accounts, ads or analytics.

## Read first

1. `DOC/MEMORY.md` – current state and key facts. Read it once per session.
2. `DOC/RULES.md` – coding rules and the Definition of Done.
3. The task in `DOC/TASKS.md`. Open other `DOC/` files only when the task needs them.

## Expo has changed – do not trust training data

Expo ships breaking changes every SDK release. Before writing code that touches an Expo or React Native API:

1. Check the `expo` major version in `package.json` (SDK 57).
2. Use the matching docs: `https://docs.expo.dev/versions/v57.0.0/`.
3. For anything else, use https://docs.expo.dev/llms.txt and follow its links.

## Commands

```bash
npx expo install <package>  # ALWAYS use instead of npm install – picks SDK-compatible versions
npx expo start              # dev server (Expo Go on a real Android phone)
npm run check               # typecheck + lint + tests – must pass before a task is done
npm run db:generate         # after changing src/modules/core/db/schema.ts
npx expo-doctor             # diagnose dependency and config issues
```

## Project rules (short)

- Routes live in `app/`; all other code lives in `src/modules/<feature>/`. Import a module only through its `index.ts`.
- **No network:** no `fetch`, WebSocket or remote assets. Never install `expo-updates`, analytics or ads SDKs.
- **Approved packages only** (DOC/ARCHITECTURE.md §2, DOC/DECISIONS.md ADR-037). Ask before adding anything else.
- Use theme tokens (`useTheme()`) and i18n keys (`t()`). No hard-coded colours, sizes or strings.
- `ios/` and `android/` are generated (Continuous Native Generation). Never edit them; configure `app.config.ts` instead.
- Keep token use low: update only the documents a change affects.
