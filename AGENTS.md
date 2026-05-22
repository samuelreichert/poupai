# Poupai — Project Rules for AI

Before any substantive work in this repository, always invoke the `project-discipline` skill from `.agents/skills/project-discipline/`.

## Project Overview

Personal finance and stock portfolio tracker. Built with Expo + React Native + TypeScript, single codebase for iOS (primary), Android (primary), and Web (secondary).

**Stack:** Expo SDK 55, Expo Router, React Native 0.83 (New Architecture), TypeScript, MMKV.

---

## Architecture

- New Architecture enabled — `newArchEnabled: true` in app.json always.
- Use `@expo/ui` for native UI: SwiftUI on iOS, Jetpack Compose on Android.
- Use **Expo Router native tabs** for all tab navigation.
- Prefer Expo SDK over third-party libraries.
- `@/` path aliases for all internal imports. Never use relative paths (`../`, `./`).
- **Styling: `StyleSheet.create()` only.** No inline styles, no Tailwind.
- Computed layout values that can't live in `StyleSheet` (e.g. `insets.top + Spacing[16]`) must be extracted to named `const` variables above JSX — never inlined.

## Storage

- **MMKV** for all persistent config and settings. No `AsyncStorage`.
- Covers: feature flags, force-update, user preferences, global app config.

## Dependencies

- **Never install a dependency without explicit user permission.**
- Check if Expo SDK covers the need first. If not, propose with justification and wait for approval.
- Always use the latest stable versions.

## Code Standards

- **Functional components only.** No class components.
- **Custom hooks for all business logic** (`useAuth`, `usePortfolio`, etc.). Components handle rendering only.
- Minimal code — only what is asked, nothing beyond scope.
- No speculative abstractions, no docstrings on unmodified code.
- No error handling for impossible scenarios. Trust framework guarantees.
- Validate only at system boundaries (user input, external APIs).
- **File and folder names in English.** UI-facing strings in Brazilian Portuguese.

## Process

- Understand the full architecture before implementing. Ask if unclear.
- Confirm scope and approach before starting.
- Start every new change on a dedicated git branch before editing code. Do not work directly on the current branch.
- Keep commits small and organized in logical chunks for readability, reviewability, and easier reverts.
- Follow Conventional Commits for all commit messages (`feat:`, `fix:`, `refactor:`, `chore:`, etc.).
- Research current package docs before proposing an implementation.

---

## Product & UX Rules

- Prioritize user experience over rigid visual recipes. The app flow must feel clear, trustworthy, and pleasant enough that people want to keep using it.
- Follow the design tokens and shared theme in `constants/theme.ts` instead of hardcoding visual decisions in feature code.
- Prefer consistent patterns that reduce friction: obvious navigation, clear next actions, strong defaults, and minimal cognitive load.
- Optimize for fast, smooth, focused flows. Avoid unnecessary steps, dead ends, confusing branching, or decorative UI that gets in the way of the task.
- Treat visual details as part of usability. Spacing, hierarchy, labels, feedback, and touch targets should make the app feel polished and easy to understand.
- When changing or adding UI, preserve coherence with the existing app instead of inventing a new visual language per screen.
