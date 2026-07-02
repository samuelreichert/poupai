## Overview

This change is a foundation cleanup and upgrade. It does not add portfolio behavior; it prepares the repo so future MVP branches can be scoped through OpenSpec and built on Expo SDK 57.

## Decisions

- Keep the existing app instead of restarting from a new Expo project.
- Use the local `openspec` CLI version `1.3.1` and initialize Codex support under `.codex/skills`.
- Treat the official Expo skills already tracked in `skills-lock.json` from `expo/skills` as the canonical project-local Expo AI guidance.
- Remove `app/(tabs)/sdk-56` and `components/sdk-56` instead of carrying demo surfaces forward.
- Keep useful `expo-ideas` foundation edits:
  - `ios.deploymentTarget` in `app.json`
  - dev-only auth bypass support
  - server-render guard in MMKV storage wrapper
  - tab stack scroll-edge hiding

## SDK 57 Upgrade

Use Expo tooling to reconcile package versions:

- Install `expo@^57.0.0`.
- Run `expo install --fix` to align Expo/RN package versions.
- Run `expo-doctor`, TypeScript, and lint after the migration.

## Risks

- SDK 57 may require package updates that affect generated lockfile entries.
- `@expo/ui` APIs may have changed since SDK 56, but this PR removes demo usage rather than expanding native UI usage.
- The Codex OpenSpec setup creates `.codex/skills`; these are project tooling files, not runtime app code.
