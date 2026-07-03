## Why

Poupai needs a clean foundation before the next MVP slices so SDK experiments stop leaking into product code and future changes follow a spec-driven workflow. Moving the app to Expo SDK 57 now keeps the project aligned with current Expo packages before auth, goals, and macro allocation work grows the surface area.

## What Changes

- Initialize OpenSpec for Codex and adopt the explore -> propose -> apply -> archive workflow for future feature branches.
- Upgrade the Expo dependency set from SDK 56 to SDK 57.
- Keep the official Expo AI skills installed from `expo/skills` and document that they are part of the project workflow.
- Remove the SDK 56 demo tab and demo-only screens/components from the product app.
- Preserve useful foundation changes from `expo-ideas`, including the iOS deployment target and server-safe storage guard.

## Capabilities

### New Capabilities
- `development-workflow`: Covers the project workflow for OpenSpec, Expo skills, and SDK baseline maintenance.

### Modified Capabilities
- None.

## Impact

- Affects `package.json`, `package-lock.json`, `app.json`, project AI instructions, OpenSpec files, and demo-only SDK 56 routes/components.
- No production user-facing finance behavior should change in this foundation PR.
